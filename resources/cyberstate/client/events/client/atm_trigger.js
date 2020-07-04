import alt from 'alt';
import game from 'natives';

const localPlayer = alt.Player.local
const searchRadius = 1;
const atmModels = [ 0xCC179926, 0xBCDEFAB5, 0xAEA85E48, 0x1E34B5C2 ];

let isNearAtm = false;
let isAtmUsing = false;

alt.on("update", () => {
	if (game.isPedInAnyVehicle(localPlayer.scriptID)) {
		return;
	}

	const position = localPlayer.pos;
	let found = false;

	for (const atmModel of atmModels) {
		const obj = game.getClosestObjectOfType(position.x, position.y, position.z, searchRadius, atmModel, false, false, false);
		if (typeof(obj) === "number" && obj > 0) {
			found = true;
			break;
		}
	}

	if (!found) {
		if (isNearAtm) onStopInteraction();
		return;
	}

	if (!isNearAtm) onStartInteraction();
});

alt.onServer("playerDeath", (player) => {
	if (player.id === localPlayer.id) onStopInteraction();
});

alt.on(`Client::init`, (view) => {
	view.on("selectMenu.itemSelected", (menuName, itemName) => {
		if (menuName === "bank_menu" && itemName === "Закрыть") isAtmUsing = false;
	});

	view.on("update.bank.main.open", (status) => {
		isAtmUsing = status;
	});
});

alt.on(`keydown`, (key) => {
	if (key === 0x45) {
		if (isAtmUsing) {
			onStopInteraction();
			return;
		}

		if (!isNearAtm || isAtmUsing) return;

		isAtmUsing = true;
		alt.emitServer("show.bank.menu");
		alt.emit("prompt.hide");
	}
});

function onStartInteraction() {
	if (game.isPedDeadOrDying(localPlayer.scriptID, true)) return;

	isNearAtm = true;
	isAtmUsing = false;

	alt.emit("prompt.show", "Нажмите <span class=\"hint-main__info-button\">E</span> для взаимодействия с банкоматом");
}

function onStopInteraction() {
	isNearAtm = false;
	isAtmUsing = false;

	alt.emit("prompt.hide");
	alt.emit("selectMenu.hide");
}

