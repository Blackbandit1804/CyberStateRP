import alt from 'alt';
import game from 'natives';

const disabledControls = new Map();

alt.on("update", () => {
	if (disabledControls.size === 0) {
		return;
	}

	disabledControls.forEach((controls, group) => {
		for (const control of controls) {
			game.disableControlAction(group, control, true);
		}
	});

	
});

function addToMap(control, group) {
	let controlsInGroup = disabledControls.get(group);

	if (!controlsInGroup) {
		disabledControls.set(group, new Set());
		controlsInGroup = disabledControls.get(group);
	}
	
	controlsInGroup.add(control);
}

function removeFromMap(control, group) {
	let controlsInGroup = disabledControls.get(group);

	if (!controlsInGroup) {
		return;
	}

	controlsInGroup.delete(control);
}

const controlsDisablerHelper = {
	add: (control, group = 2) => {
		addToMap(control, group);
	},
	addRange: (controls, group = 2) => {
		if (!Array.isArray(controls)) {
			return;
		}
		
		for (const control of controls) {
			addToMap(control, group);
		}
	},
	remove: (control, group = 2) => {
		removeFromMap(control, group);
	},
	removeRange: (controls, group = 2) => {
		if (!Array.isArray(controls)) {
			return;
		}
		
		for (const control of controls) {
			removeFromMap(control, group);
		}
	},
	removeAll: () => {
		disabledControls.clear();
	},
	removeGroup: (group) => {
		disabledControls.delete(group);
	}
}

export default controlsDisablerHelper;