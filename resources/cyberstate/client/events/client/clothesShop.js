import alt from 'alt';
import game from 'natives';

const localPlayer = alt.Player.local
const controlsToDisable = [ 22, 24, 25, 37, 44, 157, 158, 159, 160, 161, 162, 163, 164, 165,
	14, 15, 16, 17, 53, 54, 140, 141, 142, 143, 143, 47, 38, 69, 70, 68, 92, 99, 115, 46, 25, 36 ];
const movementControls = [ 30, 31, 32, 33, 34, 35 ];

const bodyPartsInfo = {
	"full": { offset: 0, scale: 2.7 },
	"head": { offset: 0.6, scale: 1 },
	"body": { offset: 0.2, scale: 1.3 },
	"legs": { offset: -0.4, scale: 1.5 },
	"feet": { offset: -0.7, scale: 1 }
}

let camera;
let isDressingStarted = false;
let basePosition;
let baseHeading = 0;

alt.on("update", () => {
	if (!isDressingStarted) {
		return;
	}

	game.hideHudAndRadarThisFrame();
	
	const leftPressed = game.isDisabledControlPressed(2, 205);
	const rightPressed = game.isDisabledControlPressed(2, 206);
	
	if (!leftPressed && !rightPressed) {
		return;
	}
	
	let heading = game.getEntityHeading(localPlayer.scriptID);
	
	heading += leftPressed ? -1.5 : 1.5;
		
	if (heading > 360) {
		heading = 0;
	} else if (heading < 0) {
		heading = 360;
	}
	
	game.setEntityHeading(localPlayer.scriptID, heading);
});

alt.onServer("clothes_shop::dressing_start", (position, heading) => {
	basePosition = new alt.Vector3(position.x, position.y, position.z);
	baseHeading = heading;

	alt.helpers.controlsDisabler.addRange(controlsToDisable);
	alt.helpers.controlsDisabler.addRange(movementControls, 0);
	game.freezeEntityPosition(localPlayer.scriptID, false);
	game.setEntityCoords(localPlayer.scriptID, basePosition.x, basePosition.y, basePosition.z);
	game.setEntityHeading(localPlayer.scriptID, baseHeading);
	game.freezeEntityPosition(localPlayer.scriptID, true);
	
	setupCamera();

	if (localPlayer.getSyncedMeta("id") !== null) alt.emit("inventory.enable", false);
	alt.emit("selectMenu.show", "biz_3_clothes");
	alt.helpers.screen.fade(false, 50);
	alt.helpers.instructionButtonsDrawler.init();
	showRotateButtons();

	isDressingStarted = true;
});

alt.on("clothes_shop::resetView", (bodyPart = "full", menuInfo = undefined, resetHeading = true) => {
	if (resetHeading) {
		game.setEntityHeading(localPlayer.scriptID, baseHeading);
	}

	if (menuInfo) {
		alt.emit("selectMenu.hide");
	}

	moveCameraToBodyPart(bodyPart, menuInfo);
});

alt.onServer("clothes_shop::stopDressing", stopDressing);

alt.onServer("playerDeath", (player) => {
	if (player.id !== localPlayer.id) {
		return;
	}

	stopDressing();
});

function setupCamera() {
	const cameraLookAt = game.getOffsetFromEntityInWorldCoords(localPlayer.scriptID, 0, 0, 0);
	camera = alt.helpers.camera.new("DEFAULT_SCRIPTED_CAMERA");
	game.setCamCoord(camera._camera, getPositionByBodyPart("full").x, getPositionByBodyPart("full").y, getPositionByBodyPart("full").z);
	game.setCamFov(camera._camera, 47);
	game.setCamActive(camera._camera, true);
	game.pointCamAtCoord(camera._camera, cameraLookAt.x, cameraLookAt.y, cameraLookAt.z);
	alt.helpers.camera.renderCams(true);
}

function getPositionByBodyPart(bodyPart) {
	const bodyPartInfo = bodyPartsInfo[bodyPart];
	const cameraPos = game.getOffsetFromEntityInWorldCoords(localPlayer.scriptID, 0, bodyPartInfo.scale, bodyPartInfo.offset);

	return cameraPos;
}

function getPositionByBodyPartlookAt(bodyPart) {
	const bodyPartInfo = bodyPartsInfo[bodyPart];
	const lookAt = game.getOffsetFromEntityInWorldCoords(localPlayer.scriptID, 0, 0, bodyPartInfo.offset);

	return lookAt;
}

function moveCameraToBodyPart(bodyPart, menuInfo = undefined) {
	const position = getPositionByBodyPart(bodyPart);
	const lookAt = getPositionByBodyPartlookAt(bodyPart);
	game.setCamCoord(camera._camera, position.x, position.y, position.z);
	game.pointCamAtCoord(camera._camera, lookAt.x, lookAt.y, lookAt.z);

	alt.emit("selectMenu.show", menuInfo.name, menuInfo.index || 0);
}

function stopDressing() {
	isDressingStarted = false;
	if (localPlayer.getSyncedMeta("id") !== null) alt.emit("inventory.enable", true);
	game.freezeEntityPosition(localPlayer.scriptID, false);
	alt.emit("finishMoveCam");
	alt.helpers.camera.renderCams(false);
	alt.helpers.instructionButtonsDrawler.dispose();
	alt.helpers.controlsDisabler.removeRange(controlsToDisable);
	alt.helpers.controlsDisabler.removeRange(movementControls, 0);

	if (camera) {
		game.destroyCam(camera._camera);
	}
}

function showRotateButtons() {
	alt.helpers.instructionButtonsDrawler.setButtons({ altControl: "t_E%t_Q", label: "FE_HLP24" });
	alt.helpers.instructionButtonsDrawler.setActive(true);
}