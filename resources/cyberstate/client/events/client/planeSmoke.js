import alt from 'alt';
import game from 'natives';

const localPlayer = alt.Player.local

const allowedModels = [0x81794C70, 0x39D6779E, 0x96E24857, 0xC3F25753, 0xA52F6866, 0x3DC92356],
    dict = "scr_carsteal4",
    effect = "scr_carsteal4_wheel_burnout",
    defaultColor = [255, 255, 255], localPlayer = player, smokeSize = 1.8;
let planeSmokeColors = {},
planesWithSmoke = [];

game.requestNamedPtfxAsset(dict);

alt.on('update', () => {
    var vehicle = localPlayer.vehicle;
    if (game.isControlJustPressed(0, 22) && isDriver(localPlayer) && vehicle && allowedModels.includes(vehicle.model)) alt.emitServer('toggleSmoke');
    if (planesWithSmoke.length > 0) {
        planesWithSmoke.forEach(plane => {
            if (game.hasNamedPtfxAssetLoaded(dict)) {
                if (plane && game.getIsVehicleEngineRunning(plane.scriptID)) {
                    let color = planeSmokeColors[plane.scriptID];
                    if (!color) return;
                    game.setParticleFxNonLoopedColour(color[0], color[1], color[2]);
                    game.useParticleFxAsset(dict);
                    game.startParticleFxNonLoopedOnEntity(effect, plane.scriptID, -0.15, -5.0, 0.3, 0, 0, 0, smokeSize, false, true, false);
                }
            }
        });
    }
});

alt.on(`gameEntityCreate`, (entity) => {
    if (entity.type === 'vehicle' && entity.getSyncedMeta('smokeActive')) {
        let color = entity.getSyncedMeta('smokeColor');
        startSmoke(entity, color);
    }
});

alt.on("syncedMetaChange", (entity, key) => {
    key === "smokeActive" ? startSmoke(entity) : removeSmoke(entity);
});

function hexToRGB(hex) { // Thanks to root and lovely stackoverflow
    let bigint = parseInt(hex.replace(/[^0-9A-F]/gi, ''), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function startSmoke (...args) {
    // debug("startSmoke...")
    let vehicle = args[0];
    if (!allowedModels.includes(vehicle.model)) return;
    if (planesWithSmoke.includes(vehicle)) return false;
    if (!planeSmokeColors[vehicle.scriptID]) planeSmokeColors[vehicle.scriptID] = defaultColor;
    planesWithSmoke.push(vehicle);
}

function removeSmoke (entity) {
    // debug("removeSmoke...")
    if (planesWithSmoke.length > 0) {
        let idx = planesWithSmoke.indexOf(entity);
        return idx > -1 ? planesWithSmoke.splice(idx, 1) : false;
    }
}

function isDriver (player) {
    if (player.vehicle) return game.getPedInVehicleSeat(player.vehicle.scriptID, -1) === player.scriptID;
}
