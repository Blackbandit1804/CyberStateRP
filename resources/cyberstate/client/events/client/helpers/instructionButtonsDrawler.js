import alt from 'alt';
import game from 'natives';

class InstructionButtonsDrawler {
	constructor() {
		this.isActive = false;
		this.scaleform = undefined;

		alt.on("update", () => {
			if (!this.isActive || !this.scaleform) {
				return;
			}
		
			this.draw();
		});
	}

	init() {
		this.scaleform = alt.helpers.scaleform.new("instructional_buttons");
	}

	setActive(state) {
		this.isActive = state;
	}

	setButtons(...buttons) {
		this.scaleform.callFunction("SET_DATA_SLOT_EMPTY");

		if (Array.isArray(buttons)) {
			for (let i = 0; i < buttons.length; i++) {
				const button = buttons[i].altControl
					? buttons[i].altControl
					: game._0x80C2FD58D720C801(2, buttons[i].control, true);

					this.scaleform.callFunction("SET_DATA_SLOT", i, button, game.getLabelText(buttons[i].label));
			}
		}
		
		this.scaleform.callFunction("DRAW_INSTRUCTIONAL_BUTTONS", -1);
	}

	draw() {
		this.scaleform.drawFullscreen();
	}

	dispose() {
		this.isActive = false;
		
		if (this.scaleform) {
			this.scaleform.dispose();
		}
		
		this.scaleform = undefined;
	}
}

const instructionButtonsDrawler = new InstructionButtonsDrawler();

export default instructionButtonsDrawler;
