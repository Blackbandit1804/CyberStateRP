import alt from 'alt';
import game from 'natives';

alt.onServer("doorControl::setDefaultState", (rawInfo) => {
	const doorsInfo = JSON.parse(rawInfo);

	for (const doorInfo of doorsInfo) {
		if (doorInfo.toSystem) {
			game.addDoorToSystem(game.getHashKey("xuy"), doorInfo.model, doorInfo.position.x, doorInfo.position.y, doorInfo.position.z, false, true, false);
		}

		doorControl(doorInfo.locked, doorInfo.model, doorInfo.position);
	}
});

function doorControl(locked, model, position) {
	game.doorControl(model, position.x, position.y, position.z, locked, 0, 0, 0);
}
