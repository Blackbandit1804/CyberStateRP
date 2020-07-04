import game from 'natives';

const screenHelper = {
	fade: (state, duration) => {
		if (state) {
			game.doScreenFadeOut(duration);
		} else {
			game.doScreenFadeIn(duration);
		}
	}
};

export default screenHelper;
