import alt from 'alt';
import game from 'natives';

function wait(ms) {
    return new Promise(resolve => alt.setTimeout(resolve, ms));
}

async function setWalkingStyle(player, style) {
    if (!style) {
        game.resetPedMovementClipset(player.scriptID, 0.0);
    } else {
        if (!game.hasClipSetLoaded(style)) {
            game.requestClipSet(style);
            while(!game.hasClipSetLoaded(style)) await wait(0);
        }

        game.setPedMovementClipset(player.scriptID, style, 0.0);
    }
}

alt.on("syncedMetaChange", (entity, key, value) => {
    if (key === "walking") {
        if (entity instanceof alt.Player) setWalkingStyle(entity, value);
    }
});