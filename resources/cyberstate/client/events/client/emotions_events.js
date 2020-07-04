import alt from 'alt';
import game from 'natives';

function setMood(player, mood) {
    if (!mood) {
        game.clearFacialIdleAnimOverride(player.scriptID);
    } else {
        game.setFacialIdleAnimOverride(player.scriptID, mood, 0);
    }
}

alt.on(`syncedMetaChange`, (entity, key, value) => {
    if (key === "emotion") {
        if (entity instanceof alt.Player) setMood(entity, value);
    }
});