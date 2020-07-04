import alt from 'alt';
import game from 'natives';
const localPlayer = alt.Player.local

function wait(ms) {
    return new Promise(resolve => alt.setTimeout(resolve, ms));
}

let pointing = {
    active: false,
    interval: 0,
    lastSent: 0,
    start: async function() {
        if (!this.active) {
            this.active = true;

            game.requestAnimDict("anim@mp_point");

            while (!game.hasAnimDictLoaded("anim@mp_point")) {
                await wait(0);
            }

            game.setPedCurrentWeaponVisible(localPlayer.scriptID, 0, 1, 1, 1);
            game.setPedConfigFlag(localPlayer.scriptID, 36, true)
            game.taskMoveNetwork(localPlayer.scriptID, "task_mp_pointing", 0.5, false, "anim@mp_point", 24);
            game.removeAnimDict("anim@mp_point");

            this.interval = alt.setInterval(this.process.bind(this), 0);
        }
    },

    stop: function() {
        if (this.active) {
            alt.clearInterval(this.interval);
            
            this.interval = null;
            this.active = false;

            game.setNetworkTaskAction(localPlayer.scriptID, "Stop");

            if (!game.isPedInjured(localPlayer.scriptID)) {
                game.clearPedSecondaryTask(localPlayer.scriptID);
            } else if (!game.isPedInAnyVehicle(localPlayer.scriptID, true)) {
                game.setPedCurrentWeaponVisible(localPlayer.scriptID, 1, 1, 1, 1);
            }

            game.setPedConfigFlag(localPlayer.scriptID, 36, false)
            game.clearPedSecondaryTask(localPlayer.scriptID);
        }
    },

    gameplayCam: game.createCam('DEFAULT_SCRIPTED_CAMERA', false),
    lastSync: 0,

    getRelativePitch: function() {
        let camRot = game.getCamRot(this.gameplayCam, 2);
        return camRot.x - game.getEntityPitch(localPlayer.scriptID);
    },

    process: function() {
        if (this.active) {
            game.isTaskMoveScriptedActive(localPlayer.scriptID);

            let camPitch = this.getRelativePitch();

            if (camPitch < -70.0) {
                camPitch = -70.0;
            } else if (camPitch > 42.0) {
                camPitch = 42.0;
            }

            camPitch = (camPitch + 70.0) / 112.0;

            let camHeading = game.getGameplayCamRelativeHeading();

            let cosCamHeading = Math.cos(camHeading);
            let sinCamHeading = Math.sin(camHeading);

            if (camHeading < -180.0) {
                camHeading = -180.0;
            } else if (camHeading > 180.0) {
                camHeading = 180.0;
            }

            camHeading = (camHeading + 180.0) / 360.0;

            let coords = game.getOffsetFromEntityInWorldCoords(localPlayer.scriptID, (cosCamHeading * -0.2) - (sinCamHeading *
                (0.4 * camHeading + 0.3)), (sinCamHeading * -0.2) + (cosCamHeading * (0.4 * camHeading + 0.3)), 0.6);

            let ray = game.startShapeTestCapsule(coords.x, coords.y, coords.z - 0.2, coords.x, coords.y, coords.z + 0.2, 1.0, 95, localPlayer.scriptID, 7);
            let [_, blocked, coords1, coords2, entity] = game.getShapeTestResult(ray, false, null, null, null);

            game.setNetworkTaskParamFloat(localPlayer.scriptID, "Pitch", camPitch);
            game.setNetworkTaskParamFloat(localPlayer.scriptID, "Heading", camHeading * -1.0 + 1.0);
            game.setNetworkTaskParamBool(localPlayer.scriptID, "isBlocked", blocked);
            game.setNetworkTaskParamBool(localPlayer.scriptID, "isFirstPerson", game._0xEE778F8C7E1142E2(game._0x19CAFA3C87F7C2FF()) == 4);
        }
    }
}

alt.onServer(`authCharacter.success`, () => {
    alt.on(`keyup`, (key) => {
        if (key === 0x42) {
            if (pointing.active) {
                pointing.stop();
            } else {
                if (alt.chatActive || alt.consoleActive || localPlayer.vehicle) return;
                pointing.start();
            }
        }
    });
});

alt.onServer(`playerEnteredVehicle`, (vehicle, seat) => {
    if (pointing.active) pointing.stop();
});