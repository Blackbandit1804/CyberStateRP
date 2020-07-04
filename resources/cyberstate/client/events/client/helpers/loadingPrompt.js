/**
 * Spin types:
 * 0: LOADING_PROMPT_LEFT,
 * 1: LOADING_PROMPT_LEFT_2
 * 2: LOADING_PROMPT_LEFT_3
 * 3: SAVE_PROMPT_LEFT
 * 4: LOADING_PROMPT_RIGHT
 */

import game from 'natives';

 class LoadingPrompt {
	show(textEntry, spinType = 4) {
		game.beginTextCommandBusyString(textEntry);
		game.endTextCommandBusyString(spinType);
	}

	showMessage() {
		game.beginTextCommandBusyString("STRING");
		game.addTextComponentSubstringPlayerName(message);
		game.endTextCommandBusyString(spinType);
	}

	hide() {
		game.removeLoadingPrompt();
	}
}

const loadingPromptHelper = new LoadingPrompt();

export default loadingPromptHelper;
