import alt from 'alt';
import game from 'natives';

function wait(ms) {
    return new Promise(resolve => alt.setTimeout(resolve, ms));
}

class Scaleform {
	constructor(movieName) {
		this.handle = Scaleform.requestMovie(movieName);
	}

	callFunction(name, ...args) {
		game.beginScaleformMovieMethod(this.handle, name);

		for (const arg of args) {
			switch (typeof(arg)) {
				case "string":
					game.addScaleformMovieMethodParameterString(arg);
					break;
				case "boolean":
					game.addScaleformMovieMethodParameterBool(arg);
					break;
				case "number":
					if (Number.isInteger(arg)) {
						game.scaleformMovieMethodAddParamInt(arg);
					} else {
						game.addScaleformMovieMethodParameterFloat(arg);
					}

					break;
				default:
					continue;
			}
		}

		game.endScaleformMovieMethod();
	}

	drawFullscreen(red = 255, green = 255, blue = 255, alpha = 255) {
		game.drawScaleformMovieFullscreen(this.handle, red, green, blue, alpha, false);
	}

	dispose() {
		game.setScaleformMovieAsNoLongerNeeded(this.handle);
	}

	static async requestMovie(movieName) {
		const id = game.requestScaleformMovieInstance(movieName);

		while (!game.hasScaleformMovieLoaded(id)) {
			await wait(0);
		}

		return id;
	}
}

const scaleformHelper = {
	"new": (movieName) => new Scaleform(movieName),
	requestMovie: Scaleform.requestMovie
};

export default scaleformHelper;
