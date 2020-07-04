import alt from 'alt';
import game from 'natives';

const localPlayer = alt.Player.local
const searchRadius = 1;
const phoneBoxes = [ "prop_phonebox_01b" ];
let found = 0;

game.requestAnimDict("oddjobs@assassinate@construction@call");

alt.on("update", () => {
    const position = localPlayer.pos;

	for (const phoneBox of phoneBoxes) {
		const obj = game.getClosestObjectOfType(position.x, position.y, position.z, searchRadius, game.getHashKey(phoneBox), false, false, false);
		if (typeof(obj) === "number" && obj > 0) {
            alt.debug(`test2 ${obj}`)
			found = obj;
			break;
		}
	}
});

alt.onServer(`test_test_test`, () => {
    const position = localPlayer.pos;
    const scene = game.createSynchronizedScene(position.x, position.y, position.z, 0, 0, game.getEntityHeading(localPlayer.scriptID), 2);

    if (game.doesEntityExist(found)) {
        game.attachSynchronizedSceneToEntity(scene, found, -1);
    }

    game.taskSynchronizedScene(localPlayer.scriptID, scene, "oddjobs@assassinate@construction@call", "ass_construction_call_p1", 1000, -2, 2, 0, 1148846080, 0);
    game.playSynchronizedEntityAnim(found, scene, "ass_construction_call_phone", "oddjobs@assassinate@construction@call", 1000, -2, 0, 1148846080);
});