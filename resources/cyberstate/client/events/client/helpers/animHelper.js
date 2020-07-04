import alt from 'alt';
import game from 'natives';

function wait(ms) {
    return new Promise(resolve => alt.setTimeout(resolve, ms));
}

const animationHelper = {
	async requestAnimDict(dictName) {
		if (game.hasAnimDictLoaded(dictName)) {
			return true;
		}

		game.requestAnimDict(dictName);

		while (!game.hasAnimDictLoaded(dictName)) {
			await wait(0);
		}

		return true;
	}
}


export default animationHelper;