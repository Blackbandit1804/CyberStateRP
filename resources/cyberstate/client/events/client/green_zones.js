import alt from 'alt';
import game from 'natives';

const controlsToDisable = [ /*21,*/ 37, 44, 157, 158, 159, 160, 161, 162, 163, 164, 165,
	14, 15, 16, 17, 53, 54, 140, 141, 142, 143, 143, 47, 38, 69, 70, 68, 92, 99, 115, 46, 25, 36];

let interiorZones = new Set();
let isInGreenZone = false;
const localPlayer = alt.Player.local

alt.on("custom_event:interiorChanged", onInteriorChanged);

alt.onServer("green_zone::load", (rawData) => {
	interiorZones = new Set(JSON.parse(rawData));
});

alt.onServer("green_zone::addRemove", (isAdd) => {
	const eventName = `green_zone::${isAdd ? "add": "remove"}`;

	alt.emitServer(eventName, getCurrentInterior());
});

alt.onServer("green_zone::add", (interior) => {
	addInteriorZone(interior);
});

alt.onServer("green_zone::remove", (interior) => {
	removeInteriorZone(interior);
});

function onInteriorChanged(newInterior) {
	if (newInterior === 0) {
		if (isInGreenZone) {
			onExitGreenZone();
		}

		return;
	}

	for (const interiorZone of interiorZones) {
		if (newInterior !== interiorZone) {
			continue;
		}

		onEnterGreenZone();

		return;
	}

	if (isInGreenZone) {
		onExitGreenZone();
	}
}

function onEnterGreenZone() {
	isInGreenZone = true;

	game.setCurrentPedWeapon(localPlayer.scriptID, game.getHashKey("weapon_unarmed") >> 0, true)
	game.setPedStealthMovement(localPlayer.scriptID, false, "DEFAULT_ACTION");
	game.setPedMaxMoveBlendRatio(localPlayer.scriptID, 1.35);
	alt.helpers.controlsDisabler.addRange(controlsToDisable);
}

function onExitGreenZone() {
	isInGreenZone = false;
	game.setPedMaxMoveBlendRatio(localPlayer.scriptID, 1);
	alt.helpers.controlsDisabler.removeRange(controlsToDisable);
}

function addInteriorZone(interiorId) {
	interiorZones.add(interiorId);

	const currentInterior = getCurrentInterior();

	if (currentInterior === interiorId && !isInGreenZone) {
		onEnterGreenZone();
	}
}

function removeInteriorZone(interiorId) {
	interiorZones.delete(interiorId);

	const currentInterior = getCurrentInterior();

	if (currentInterior === interiorId && isInGreenZone) {
		onExitGreenZone();
	}
}

function getCurrentInterior() {
	return game.getInteriorFromEntity(localPlayer.scriptID);
}

export default {
	addInteriorGreenZone: addInteriorZone,
	removeInteriorGreenZone: removeInteriorZone,
	islocalPlayerInGreenZone: () => isInGreenZone
};