import alt from 'alt';
import game from 'natives';

const localPlayer = alt.Player.local

const interiorHelper = {
	getCurrent: () => game.getInteriorFromEntity(localPlayer.scriptID)
};

export default interiorHelper;