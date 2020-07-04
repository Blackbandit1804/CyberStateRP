import alt from 'alt';

class InteriorChangedHandler {
	constructor() {
		this.currentInterior = 0;
		this.localPlayer = alt.Player.local
	}

	tick() {
		const newInterior = alt.helpers.interior.getCurrent();

		if (newInterior === this.currentInterior) {
			return;
		}

		alt.emit("custom_event:interiorChanged", newInterior, this.currentInterior);
		this.currentInterior = newInterior;
	}
}


const handler = new InteriorChangedHandler();

alt.on("update", () => {
	handler.tick();
});

export default handler;
