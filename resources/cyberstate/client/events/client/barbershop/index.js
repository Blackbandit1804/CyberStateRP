import alt from 'alt';
import game from 'natives';

const localPlayer = alt.Player.local
const hairColors = [];
const lipstickColors = [];
const makeupColors = [];
const torsoHairComponentsToRemove = [ 3, 7, 8, 9, 11 ];
let barberInfo = undefined;

alt.onServer("playerDeath", (player) => {
	if (alt.isBarberStarted && player.getSyncedMeta("id") === localPlayer.getSyncedMeta("id")) {
		onBarberFinished();
	}
});

alt.onServer("barbershop::load_info", (rawInfo) => {
	barberInfo = JSON.parse(rawInfo);

	// Hair, Makeup
	const maxColors = Math.max(game.getNumHairColors(), game.getNumMakeupColors());

	for (let i = 0; i < maxColors; i++) {
		if (game.isPedHairColorValid(i)) {
			hairColors.push(i);
		}

		if (game.isPedLipstickColorValid(i)) {
			lipstickColors.push(i);
		}

		if (game.isPedBlushColorValid(i)) {
			makeupColors.push(i);
		}
	}
});

let currentPlace = undefined;
alt.isBarberStarted = false;
let playerPed;
let keeperPed;
let camera = undefined;
let stage = -1;
let scissorsObj = undefined;
let isHighlightingEnabled = false;
let currentCutAnim = undefined;
let cutSoundStarted = false;
let cutAcceptCallback = undefined;
let removedClothing = [];
let currentEyeColor;
let cutSound;

alt.on("update", () => {
	if (barberInfo === undefined) {
		return;
	}

	if (alt.isBarberStarted) {
		if (stage === 0 && playerPed && game.hasEntityAnimFinished(playerPed, currentPlace.animDict, "player_enterchair", 3)) {
			onPedSeat();
		}

		if (stage === 2) {
			if (keeperPed && game.hasEntityAnimFinished(keeperPed, currentPlace.animDict, currentCutAnim, 3)) {
				onCutFinished();
			}

			if (sceneId !== -1) {
				const phase = game.getSynchronizedScenePhase(sceneId);

				if (phase >= 0.3 && phase <= 0.4 && !cutSoundStarted) {
					if (cutAcceptCallback) {
						cutAcceptCallback();
						cutAcceptCallback = undefined;
					}
					
					game.playSoundFromEntity(1488, cutSound, keeperPed, "Barber_Sounds", false, 0);
					cutSoundStarted = true;
				} else if (phase >= 0.6 && cutSoundStarted) {
					game.stopSound(1488);
					cutSoundStarted = false;
				}
			}
		}

		if (stage === 3 && playerPed && game.hasEntityAnimFinished(playerPed, currentPlace.animDict, "player_exitchair", 3)) {
			onBarberFinished();
		}

		game.hideHudAndRadarThisFrame();
		return;
	}

	const interior = getCurrentInterior();
	let placeIndex;

	if (interior === 0 || (placeIndex = barberInfo.interiors.indexOf(interior)) < 0) {
		if (currentPlace !== undefined) {
			onStopInteraction();
		}

		return;
	}

	const place = barberInfo.places[placeIndex];

	if(!islocalPlayerInAngledArea(place.interaction.origin, place.interaction.edge, place.interaction.angle)) {
		onStopInteraction();
		return;
	}

	if (currentPlace === undefined) {
		onStartInteraction(place);
	}
});

function loadModelAsync(model) {
	return new Promise((resolve, reject) => {
	  if (typeof model === 'string') {
		model = game.getHashKey(model);
	  }
	
	  if (!game.isModelValid(model))
		return resolve(false);
  
	  if (game.hasModelLoaded(model))
		return resolve(true);
  
	  game.requestModel(model);
  
	  let interval = alt.setInterval(() => {
		if (game.hasModelLoaded(model)) {
		  alt.clearInterval(interval);
		  return resolve(true);
		}
	  }, 0);
	});
}

alt.onServer(`Player::overlayColors::init`, (overlayColors) => {
	overlayColors = JSON.parse(overlayColors);

	localPlayer.overlayColors = overlayColors;
});

alt.onServer("barbershop::startBarber", async (hairColor, highlightColor, eyeColor) => {
	const usedOverlays = [ 1, 2, 4, 5, 8, 10 ];
	const playerPos = localPlayer.pos;
	const chairInfo = currentPlace.chair;
	const exitPos = currentPlace.exit.position;

	currentHair.color = hairColor;
	currentHair.highlightColor = highlightColor;
	playerHeadOverlays = new Map();
	values = [];
	currentEyeColor = eyeColor;

	usedOverlays.forEach((overlay) => {
		values[0] = game.getPedHeadOverlayValue(localPlayer.scriptID, overlay);

		if (localPlayer.overlayColors[overlay]) {
			values[1] = localPlayer.overlayColors[overlay][0];
			values[2] = localPlayer.overlayColors[overlay][1];
		}

		playerHeadOverlays.set(overlay, values);
	});

	await loadModelAsync(game.getEntityModel(localPlayer.scriptID));
	await loadModelAsync(currentPlace.pedModel);
	await loadModelAsync(barberInfo.scissors.model);

	playerPed = await alt.helpers.ped.createPed(0, game.getEntityModel(localPlayer.scriptID), playerPos, 0);
	keeperPed = await alt.helpers.ped.createPed(0, currentPlace.pedModel, playerPos, 0);

	scissorsObj = game.createObject(barberInfo.scissors.model, currentPlace.scissorsPosition.x, currentPlace.scissorsPosition.y, currentPlace.scissorsPosition.z, false, false, false);
	
	game.taskLookAtEntity(keeperPed, playerPed, -1, 2048, 3);
	game.clonePedToTarget(localPlayer.scriptID, playerPed);
	game.setEntityCoords(localPlayer.scriptID, exitPos.x, exitPos.y, exitPos.z);
	game.setEntityHeading(localPlayer.scriptID, currentPlace.exit.heading);
	game.freezeEntityPosition(localPlayer.scriptID, true);
	game.setEntityAlpha(localPlayer.scriptID, 0);
	game.setEntityCollision(localPlayer.scriptID, false, false);

	playVoice("SHOP_HAIR_WHAT_WANT");
	
	await alt.helpers.animation.requestAnimDict(currentPlace.animDict);

	camera = game.createCam(`DEFAULT_SCRIPTED_CAMERA`, false);
		
	game.taskPlayAnimAdvanced(playerPed, currentPlace.animDict, "player_enterchair", chairInfo.position.x, chairInfo.position.y, 
		chairInfo.position.z, 0, 0, chairInfo.heading, 1000, -1000, -1, 5642, 0, 2, 1);
	playKeeperAnim("keeper_enterchair", "scissors_enterchair");

	const camInfo = currentPlace.cam;	
	const camPos = game.getObjectOffsetFromCoords(camInfo.position.x, camInfo.position.y, camInfo.position.z,
		camInfo.heading, camInfo.offset.x, camInfo.offset.y, camInfo.offset.z);

	game.setCamCoord(camera, camPos.x, camPos.y, camPos.z);
	game.pointCamAtCoord(camera, camInfo.position.x, camInfo.position.y, camInfo.position.z);
	game.setCamFov(camera, 47);
	
	alt.helpers.screen.fade(false, 50);
	game.setCamActive(camera, true);
	game.renderScriptCams(true, false, 3000, true, false);
});

function onStartInteraction(place) {
	currentPlace = place;
	alt.emit("prompt.show", `Нажмите <span class=\"hint-main__info-button\">Е</span>, чтобы сделать прическу или нанести макияж.`);
}

function onStopInteraction(clearPlace = true) {
	if (clearPlace) {
		currentPlace = undefined;
	}

	alt.emit("prompt.hide");
}

const Keys = {
	PageUp: 0x21,
	PageDown: 0x22,
	Q: 0x51,
	E: 0x45,
	Space: 0x20
};

alt.on('keydown', (key) => {
	if (key === Keys.E) {
		onKeyPressed(Keys.E);

		if (currentPlace === undefined || alt.isBarberStarted || alt.cursorState) {
			return;
		}

		stage = 0;
		alt.isBarberStarted = true;
		selectedMainMenuIndex = 0;
	
		game.requestAdditionalText("HAR_MNU", 9);
		game.requestAmbientAudioBank("SCRIPT\\Hair_Cut", false);
	
		alt.helpers.instructionButtonsDrawler.init();
		onStopInteraction(false);
		alt.helpers.screen.fade(true, 50);
		alt.emitServer("barbershop::onStart");
	} else if (key === Keys.PageUp) {
        onKeyPressed(Keys.PageUp);
	} else if (key === Keys.PageDown) {
        onKeyPressed(Keys.PageDown);
	} else if (key === Keys.Q) {
        onKeyPressed(Keys.Q);
	} else if (key === Keys.Space) {
        onKeyPressed(Keys.Space);
    }
});

function onPedSeat() {
	stage = 1;

	playBaseAnims();
	showMainMenu();

	const camInfo = currentPlace.cam;

	alt.helpers.cameraRotator.start(camera, camInfo.position, camInfo.position, camInfo.offset, camInfo.heading);
	alt.helpers.cameraRotator.setXBound(150, 240);
	alt.emit(`Cursor::show`, true);
}

function onCutFinished() {
	stage = 1;

	playBaseAnims();
	showConcreteMenu(undefined);

	alt.helpers.instructionButtonsDrawler.setActive(true);

	if (currentMenu === 0) {
		game.setCamFov(camera, 33);
	}

	alt.helpers.cameraRotator.pause(false);
}

function onKeyPressed(key) {
	if (!alt.isBarberStarted || currentMenu === -1 || stage !== 1) {
		return;
	}

	switch (key) {
		case Keys.Space:
			if (currentMenu === 0) { // Hair
				isHighlightingEnabled = !isHighlightingEnabled;
				showHairInstructionButtons();
				setHairColorByIndexes();
			}

			break;
		case Keys.PageDown:
		case Keys.PageUp:
			if (currentMenu === 0) { // Hair
				currentHair.selectedColorIndex = getNextValidValue(hairColors, currentHair.selectedColorIndex, key === Keys.PageDown ? -1 : 1);

				setHairColorByIndexes();
			} else if (currentHeadOverlay.id !== -1 && currentHeadOverlay.colorIndex !== -1) {
				currentHeadOverlay.colorIndex = getNextValidValue(getHeadOverlayColors(currentHeadOverlay.id), currentHeadOverlay.colorIndex, key === Keys.PageDown ? -1 : 1);

				setCurrentHeadOverlayColor();
			}
			
			break;
		case Keys.Q:
		case Keys.E:
			if (currentMenu === 0 && isHighlightingEnabled) {
				currentHair.selectedHighlightColorIndex = getNextValidValue(hairColors, currentHair.selectedHighlightColorIndex, key === Keys.Q ? -1 : 1);
				setHairColorByIndexes();
			} else if (currentHeadOverlay.id !== -1 && currentHeadOverlay.opacity !== -1) {
				currentHeadOverlay.opacity += key === Keys.Q ? -0.05 : 0.05;
				if (currentHeadOverlay.opacity > 1) {
					currentHeadOverlay.opacity = 1;
				} else if (currentHeadOverlay.opacity < 0) {
					currentHeadOverlay.opacity = 0;
				}
				setCurrentHeadOverlay();
			}

			break;
	}
}

let selectedMainMenuIndex = 0;
let currentMenu = -1;
let currentHair = {
	drawable: -1,
	color: 0,
	highlightColor: 0,
	selectedColorIndex: 0,
	selectedHighlightColorIndex: 0
};
let playerHeadOverlays = new Map();
let values = [];
let currentHeadOverlay = {
	id: 0,
	index: 0,
	opacity: 1,
	colorIndex: 0
};

alt.on(`Client::init`, (view) => {
	view.on("selectMenu.itemSelected", async (menuName, itemName, itemValue, itemIndex) => {
		if (!menuName.startsWith("barbershop_")) {
			return;
		}

		if (menuName === "barbershop_m_main" || menuName === "barbershop_f_main") {
			if (itemName === "Уйти") {
				onBarberStop();
				return;
			}

			selectedMainMenuIndex = itemIndex;

			if (itemName === "Макияж") {
				alt.emit("selectMenu.show", `barbershop_makeupMenu_${game.isPedMale(localPlayer.scriptID) ? "m" : "f"}`);
				alt.helpers.instructionButtonsDrawler.setButtons(...mainInstructionButtons);
				alt.helpers.instructionButtonsDrawler.setActive(true);
				return;
			}

			showConcreteMenu(itemName);
		} else if (menuName === "barbershop_makeupMenu_m" || menuName === "barbershop_makeupMenu_f") {
			showConcreteMenu(itemName);
		} else if (menuName === "barbershop_concrete") {
			if (currentMenu === 0) { // Hair
				const hair = getHairDrawableByIndex(itemIndex);
				const { color, highlightColor } = getSelectedColors();
				if (hair === currentHair.drawable && color === currentHair.color && highlightColor === currentHair.highlightColor) {
					return;
				}

				if (!await checkPrice(itemIndex)) {
					return;
				}

				setCurrentHair();
				setCurrentHairColor();

				setHair(hair, color, highlightColor);
				playCutAnim(() => {
					setCurrentHair();
					setCurrentHairColor();
				});
			} else if (currentMenu === 4) { // Eye color
				if (currentEyeColor === itemIndex) {
					return;
				}

				if (!await checkPrice(itemIndex)) {
					return;
				}

				game.setPedEyeColor(playerPed, currentEyeColor);
				currentEyeColor = itemIndex;
				alt.emitServer("barbershop::setEyeColor", currentEyeColor);
				playCutAnim(() => {
					game.setPedEyeColor(playerPed, currentEyeColor);
				}, false);
			} else if(currentHeadOverlay.id !== -1) {
				const headOverlay = playerHeadOverlays.get(currentHeadOverlay.id);
				const overlayIndex = currentHeadOverlay.index;
				const overlayOpacity = currentHeadOverlay.opacity;
				const overlayColorIndex = currentHeadOverlay.colorIndex;

				let color = 0;

				if (overlayColorIndex !== -1) {
					color = getHeadOverlayColors(currentHeadOverlay.id)[overlayColorIndex];
				}

				if (
					headOverlay[0] === overlayIndex
					&& (headOverlay[1] === overlayOpacity || overlayOpacity === -1)
					&& (headOverlay[2] === color || overlayColorIndex === -1)
				) {
					return;
				}

				if (!await checkPrice(itemIndex)) {
					return;
				}

				const currentOverlay = currentHeadOverlay.id;
				let dependentOverlayId = undefined;

				resetCurrentHeadOverlay();

				if (currentMenu === 5 || currentMenu === 6 || currentMenu === 8) {
					dependentOverlayId = currentOverlay === 4 ? 5 : 4;
					const dependentOverlay = playerHeadOverlays.get(dependentOverlayId);
					if (dependentOverlay[0] !== 255) {
						currentHeadOverlay.id = dependentOverlayId;
						resetCurrentHeadOverlay();
						currentHeadOverlay.id = currentOverlay;
					}
				}

				setHeadOverlay(overlayIndex, overlayOpacity, color, overlayColorIndex, dependentOverlayId);
				playCutAnim(() => {
					setCurrentHeadOverlay();
					setCurrentHeadOverlayColor();

					if (dependentOverlayId) {
						currentHeadOverlay.id = dependentOverlayId;
						resetCurrentHeadOverlay();
						currentHeadOverlay.id = currentOverlay;
					}
				}, currentMenu <= 3);
			}
		}
	});

	view.on("selectMenu.itemFocusChanged", (menuName, itemName, itemValue, itemIndex, valueIndex) => {
		if (!menuName.startsWith("barbershop_")) {
			return;
		}

		if (menuName === "barbershop_concrete") {
			if (currentMenu === 0) { // Hair
				game.setPedComponentVariation(playerPed, 2, getHairDrawableByIndex(itemIndex), 0, 2);
				setHairColorByIndexes();
			} else if (currentMenu === 4) { // Eye color
				game.setPedEyeColor(playerPed, itemIndex);
			} else if (currentHeadOverlay.id !== -1) {
				let value = itemIndex === 0 ? 255 : itemIndex - 1;

				if (currentMenu === 5) {
					const painting = barberInfo.facePaintings[itemIndex];

					if (painting.i !== currentHeadOverlay.id) {
						game.setPedHeadOverlay(playerPed, currentHeadOverlay.id, 255, 1);

						currentHeadOverlay.id = painting.i;

						if (currentHeadOverlay.colorIndex === -1) {
							const overlayColors = getHeadOverlayColors(currentHeadOverlay.id);

							currentHeadOverlay.colorIndex = overlayColors.length > 0 ? overlayColors.indexOf(playerHeadOverlays.get(currentHeadOverlay.id)[2]) : -1;
						}

						showItemsInstructionButtons(currentHeadOverlay.colorIndex !== -1, currentHeadOverlay.opacity !== -1);
						setCurrentHeadOverlayColor();
					}

					value = painting.v;
				} else if (currentMenu === 6) {
					game.setPedHeadOverlay(playerPed, 5, 255, 1);
					value = barberInfo.eyeMakeups[itemIndex].v;
				} else if (currentMenu === 8) {
					game.setPedHeadOverlay(playerPed, 4, 255, 1);
				}

				currentHeadOverlay.index = value;
				setCurrentHeadOverlay();
			}
		}
	});

	view.on("selectMenu.backspacePressed", (menuName) => {
		if (!menuName.startsWith("barbershop_")) {
			return;
		}

		if (menuName === "barbershop_concrete") {
			if(currentMenu === 0) { // Hair
				setCurrentHair();
				setCurrentHairColor();
			} else if (currentMenu === 4) { // Eye color
				game.setPedEyeColor(playerPed, currentEyeColor);
			} else if (currentHeadOverlay.id !== -1) {
				resetCurrentHeadOverlay();

				if (currentMenu === 5 || currentMenu === 6 || currentMenu === 8) {
					const dependentOverlayId = currentHeadOverlay.id === 4 ? 5 : 4;

					currentHeadOverlay.id = dependentOverlayId;
					resetCurrentHeadOverlay();
				}
			}

			if (currentMenu === 6 || currentMenu === 7 || currentMenu === 8) {
				alt.emit("selectMenu.show", `barbershop_makeupMenu_${game.isPedMale(localPlayer.scriptID) ? "m" : "f"}`);
				alt.helpers.instructionButtonsDrawler.setButtons(...mainInstructionButtons);
				alt.helpers.instructionButtonsDrawler.setActive(true);
			} else {
				showMainMenu();
			}

			game.setCamFov(camera, 47);
		} else if (menuName === "barbershop_makeupMenu_m" || menuName === "barbershop_makeupMenu_f") {
			showMainMenu();
		}
	});
});

function getCurrentInterior() {
	return game.getInteriorFromEntity(localPlayer.scriptID);
}

function islocalPlayerInAngledArea(origin, edge, angle) {
	return game.isEntityInAngledArea(localPlayer.scriptID, origin.x, origin.y, origin.z, edge.x, edge.y, edge.z, angle, false, true, 0);
}

let sceneId = -1;

function createScene(looped = false) {
	if (sceneId !== -1) {
		game.detachSynchronizedScene(sceneId);
		game.disposeSynchronizedScene(sceneId);
		sceneId = -1;
	}

	const chairInfo = currentPlace.chair;

	sceneId = game.createSynchronizedScene(chairInfo.position.x, chairInfo.position.y, chairInfo.position.z, 0, 0, chairInfo.heading, 2);

	game.setSynchronizedSceneOcclusionPortal(sceneId, true);
	game.setSynchronizedSceneLooped(sceneId, looped);

	return sceneId;
}

const mainInstructionButtons = [
	{ control: 201, label: "ITEM_SELECT" },
	{ altControl: "b_114", label: "ITEM_MOV_CAM" }
];
const baseItemsInstructionButtons = [
	{ control: 201, label: "ITEM_BUY" },
	{ control: 194, label: "ITEM_BACK" },
	{ altControl: "b_114", label: "ITEM_MOV_CAM" },
];
const hairInstructionButtons = [
	...baseItemsInstructionButtons,
	{ altControl: "b_1009%b_1010", label: "ITEM_T_HCOL" },
];

function showMainMenu() {
	currentMenu = -1;
	currentHeadOverlay.id = -1;
	restoreClothes();
	alt.emit("selectMenu.show", `barbershop_${game.isPedMale(localPlayer.scriptID) ? "m" : "f"}_main`, selectedMainMenuIndex);
	alt.helpers.instructionButtonsDrawler.setButtons(...mainInstructionButtons);
	alt.helpers.instructionButtonsDrawler.setActive(true);
}

function showConcreteMenu(header) {
	let selectedIndex = 0;
	const items = [];

	if (header === undefined) {
		header = getMenuHeaderByIndex(currentMenu);
	} else {
		currentMenu = getUniqueMenuIndexByName(header);
	}

	if (currentMenu === 0) { // Hair
		currentHair.drawable = game.getPedDrawableVariation(playerPed, 2);
		currentHair.selectedColorIndex = hairColors.indexOf(currentHair.color);
		currentHair.selectedHighlightColorIndex = hairColors.indexOf(currentHair.highlightColor);

		if (currentHair.selectedColorIndex === -1) {
			currentHair.selectedColorIndex = 0;
		}

		if (currentHair.selectedHighlightColorIndex === -1) {
			currentHair.selectedHighlightColorIndex = 0;
		}

		selectedIndex = generateHairValues(items);
		isHighlightingEnabled = currentHair.color !== currentHair.highlightColor;
		showHairInstructionButtons();
	} else if (currentMenu === 4) { // Eye color
		selectedIndex = generateEyeColorValues(items);
		alt.helpers.instructionButtonsDrawler.setButtons(...baseItemsInstructionButtons);
		alt.helpers.instructionButtonsDrawler.setActive(true);
	} else { // Other overlays
		currentHeadOverlay.id = getOverlayIdByCurrentMenu();
		if (currentHeadOverlay.id === -1) {
			return;
		}

		if (currentMenu === 3 && removedClothing.length === 0) { // Torso hair
			for (const componentId of torsoHairComponentsToRemove) {
				const drawable = game.getPedDrawableVariation(playerPed, componentId);
				const texture = game.getPedTextureVariation(playerPed, componentId);
				const palette = game.getPedPaletteVariation(playerPed, componentId);

				removedClothing.push({ componentId, drawable, texture, palette });

				game.setPedComponentVariation(playerPed, componentId, getNakedClothes(componentId), 0, 0);
			}
		}

		resetCurrentHeadOverlay(false);

		if (currentMenu === 5) {
			selectedIndex = generateFacePaintingValues(items);
		} else if (currentMenu === 6) {
			selectedIndex = generateEyeMakeupValues(items);
		} else {
			selectedIndex = generateHeadOverlayValues(currentHeadOverlay.id, items);
		}

		showItemsInstructionButtons(currentHeadOverlay.colorIndex !== -1, currentHeadOverlay.opacity !== -1);
		setCurrentHeadOverlayColor();
	}

	if (currentMenu !== 3) {
		game.setCamFov(camera, 33);
	}

	alt.emit("selectMenu.setSpecialItems", "barbershop_concrete", items);
	alt.emit("selectMenu.setHeader", "barbershop_concrete", header);
	alt.emit("selectMenu.show", "barbershop_concrete", selectedIndex);
}

function generateHairValues(collection) {
	const hairValues = getHairValues();
	const isMale = game.isPedMale(playerPed);
	let selectedIndex = 0;

	for (let i = 0; i < hairValues.length; i++) {
		if (currentHair.drawable === hairValues[i]) {
			selectedIndex = i;
		}

		const label = getHairLabel(isMale, i);
		const text = alt.helpers.string.escapeHtml(game.getLabelText(label));

		addMenuItem(collection, text, i);
	}

	return selectedIndex;
}

function generateHeadOverlayValues(overlayId, collection) {
	let selectedIndex = 0;

	const itemsCount = currentMenu === 8 ? 7 : game.getPedHeadOverlayNum(overlayId);

	for (let i = 0; i < itemsCount + 1; i++) {
		if (currentHeadOverlay.index === i - 1) {
			selectedIndex = i;
		}

		const label = getHeadOverlayLabel(overlayId, i);
		const text = alt.helpers.string.escapeHtml(game.getLabelText(label));

		addMenuItem(collection, text, i);
	}

	return selectedIndex;
}

function generateEyeColorValues(collection) {
	let selectedIndex = 0;

	for (let i = 0; i < 32; i++) {
		if (currentEyeColor === i) {
			selectedIndex = i;
		}

		const label = `FACE_E_C_${i}`;
		const text = alt.helpers.string.escapeHtml(game.getLabelText(label));

		addMenuItem(collection, text, i);
	}

	return selectedIndex;
}

function generateFacePaintingValues(collection) {
	let selectedIndex = 0;

	for (let i = 0; i < barberInfo.facePaintings.length; i++) {
		const facePainting = barberInfo.facePaintings[i];

		if (currentHeadOverlay.index === facePainting.v && currentHeadOverlay.id === facePainting.i) {
			selectedIndex = i;
		}

		const text = alt.helpers.string.escapeHtml(game.getLabelText(facePainting.l));

		addMenuItem(collection, text, i);
	}

	return selectedIndex;
}

function generateEyeMakeupValues(collection) {
	let selectedIndex = 0;

	for (let i = 0; i < barberInfo.eyeMakeups.length; i++) {
		const eyeMakeup = barberInfo.eyeMakeups[i];

		if (currentHeadOverlay.index === eyeMakeup.v) {
			selectedIndex = i;
		}

		const text = alt.helpers.string.escapeHtml(game.getLabelText(eyeMakeup.l));

		addMenuItem(collection, text, i);
	}

	return selectedIndex;
}

function getHeadOverlayDefaultOpacity(overlayId) {
	switch (overlayId) {
		case 1:
		case 2:
		case 4:
		case 5:
		case 10:
			return 1;
		case 8:
			return 0.8;
		default:
			return -1;
	}
}

function getHeadOverlayColors(overlayId) {
	switch (overlayId) {
		case 1:
		case 2:
		case 10:
			return hairColors;
		case 5:
			return makeupColors;
		case 8:
			return lipstickColors;
		default:
			return [];
	}
}

const maleHairLabels = [ "CC_M_HS_0", "CC_M_HS_1", "CC_M_HS_2", "CC_M_HS_3", "CC_M_HS_4", "CC_M_HS_5", "CC_M_HS_6", "CC_M_HS_7", "CC_M_HS_8", "CC_M_HS_9", "CC_M_HS_10", "CC_M_HS_11", "CC_M_HS_12", "CC_M_HS_13", "CC_M_HS_14", "CC_M_HS_15", "CC_M_HS_16", "CC_M_HS_17", "CC_M_HS_18", "CC_M_HS_19", "CC_M_HS_20", "CC_M_HS_21", "CC_M_HS_22", "CLO_S1M_H_0_0", "CLO_S1M_H_1_0", "CLO_S1M_H_2_0", "CLO_S1M_H_3_0", "CLO_S2M_H_0_0", "CLO_S2M_H_1_0", "CLO_S2M_H_2_0", "CLO_BIM_H_0_0", "CLO_BIM_H_1_0", "CLO_BIM_H_2_0", "CLO_BIM_H_3_0", "CLO_BIM_H_4_0", "CLO_BIM_H_5_0", "CLO_GRM_H_0_0", "CLO_GRM_H_1_0" ];
const femaleHairLabels = [ "CC_F_HS_0", "CC_F_HS_1", "CC_F_HS_2", "CC_F_HS_3", "CC_F_HS_4", "CC_F_HS_5", "CC_F_HS_6", "CC_F_HS_7", "CC_F_HS_8", "CC_F_HS_9", "CC_F_HS_10", "CC_F_HS_11", "CC_F_HS_12", "CC_F_HS_13", "CC_F_HS_14", "CC_F_HS_15", "CC_F_HS_16", "CC_F_HS_17", "CC_F_HS_23", "CC_F_HS_18", "CC_F_HS_19", "CC_F_HS_20", "CC_F_HS_21", "CC_F_HS_22", "CLO_S1F_H_0_0", "CLO_S1F_H_1_0", "CLO_S1F_H_2_0", "CLO_S1F_H_3_0", "CLO_S2F_H_0_0", "CLO_S2F_H_1_0", "CLO_S2F_H_2_0", "CLO_BIF_H_0_0", "CLO_BIF_H_1_0", "CLO_BIF_H_2_0", "CLO_BIF_H_3_0", "CLO_BIF_H_4_0", "CLO_BIF_H_6_0", "CLO_BIF_H_5_0", "CLO_GRF_H_0_0", "CLO_GRF_H_1_0" ];

function getHairLabel(isMale, index) {
	if (isMale) {
		return maleHairLabels[index];
	} else {
		return femaleHairLabels[index];
	}
}

function getHeadOverlayLabel(overlayId, index) {
	switch (overlayId) {
		case 1: // Beard
			return index <= 19 ? `HAIR_BEARD${index}` : `BRD_HP_${index-20}`;
		case 2: // Eyebrows
			return index === 0 ? "NONE" : `CC_EYEBRW_${index-1}`;
		case 5: // Blush
			return index === 0 ? "NONE" : `CC_BLUSH_${index-1}`;
		case 8: // Lipstick
			return index === 0 ? "NONE" : `CC_LIPSTICK_${index-1}`;
		case 10: // Torso hair
			return `CC_BODY_1_${index}`;
		default:
			return "NONE";
	}
}

function getUniqueMenuIndexByName(name) {
	switch (name) {
		case "Причёски":
			return 0;
		case "Бороды":
			return 1;
		case "Брови":
			return 2;
		case "Грудь":
			return 3;
		case "Линзы":
			return 4;
		case "Раскраска лица":
			return 5;
		case "Глаз":
			return 6;
		case "Помада":
			return 7;
		case "Румяна":
			return 8;
		default:
			return -1;
	}
}

function getMenuHeaderByIndex(index) {
	switch (index) {
		case 0:
			return "Причёски";
		case 1:
			return "Бороды";
		case 2:
			return "Брови";
		case 3:
			return "Грудь";
		case 4:
			return "Линзы";
		case 5:
			return "Раскраска лица";
		case 6:
			return "Глаз";
		case 7:
			return "Помада";
		case 8:
			return "Румяна";
		default:
			return "NONE";
	}
}

function getOverlayIdByCurrentMenu() {
	switch (currentMenu) {
		case 1:
			return 1;
		case 2:
			return 2;
		case 3:
			return 10;
		case 5:
			const makeupOverlay = playerHeadOverlays.get(4);

			if (makeupOverlay[0] !== 255) {
				return 4;
			}

			return playerHeadOverlays.get(5)[0] === 255 ? 4 : 5;
		case 6:
			return 4;
		case 7:
			return 8;
		case 8:
			return 5;
		default:
			return -1;
	}
}

function getHairDrawableByIndex(index) {
	return getHairValues()[index];
}

function getHairValues() {
	const genderIndex = game.isPedMale(playerPed) ? 0 : 1;

	return barberInfo.hairValues[genderIndex];
}

function showHairInstructionButtons() {
	const buttons = hairInstructionButtons.slice();

	if (isHighlightingEnabled) {
		buttons.splice(3, 0, { control: 203, label: "ITEM_X_TINT" });
		buttons.splice(4, 0, { altControl: "t_E%t_Q", label: "ITEM_B_HILI" });
	} else {
		buttons.splice(3, 0, { control: 203, label: "ITEM_X_HILI" });
	}
	
	alt.helpers.instructionButtonsDrawler.setButtons(...buttons);
	alt.helpers.instructionButtonsDrawler.setActive(true);
}

function showItemsInstructionButtons(showColor = false, showOpacity = false) {
	const buttons = baseItemsInstructionButtons.slice();
	let insertIndex = 3;

	if (showOpacity) {
		buttons.splice(insertIndex, 0, { altControl: "t_E%t_Q", label: "ITEM_B_OPACITY" });
		insertIndex++;
	}

	if (showColor) {
		buttons.splice(insertIndex, 0, { altControl: "b_1009%b_1010", label: "ITEM_T_COL" });
	}

	alt.helpers.instructionButtonsDrawler.setButtons(...buttons);
	alt.helpers.instructionButtonsDrawler.setActive(true);
}

function getNextValidValue(collection, currentValue, additionValue) {
	let value = currentValue + additionValue;

	if (value < 0) {
		value = collection.length - 1;
	}

	if (value >= collection.length) {
		value = 0;
	}

	return value;
}

function setHairColorByIndexes() {
	const { color, highlightColor } = getSelectedColors();
	game.setPedHairColor(playerPed, color, highlightColor);
}

function setHair(hair, color, highlightColor) {
	currentHair.drawable = hair;
	currentHair.color = color;
	currentHair.highlightColor = highlightColor;

	alt.emitServer("barbershop::setHair", currentHair.drawable, currentHair.color, currentHair.highlightColor);
}

function setCurrentHair() {
	game.setPedComponentVariation(playerPed, 2, currentHair.drawable, game.getPedTextureVariation(playerPed, 2), 2);
}

function setCurrentHairColor() {
	game.setPedHairColor(playerPed, currentHair.color, currentHair.highlightColor);
}

function getSelectedColors() {
	const color = hairColors[currentHair.selectedColorIndex];
	const highlightColor = isHighlightingEnabled ? hairColors[currentHair.selectedHighlightColorIndex] : color;

	return { color, highlightColor };
}

function playCutAnim(acceptCallback = undefined, withScissors = true) {
	const cutVariant = Math.random() >= 0.5 ? "a" : "b";

	currentCutAnim = getCutAnimPart() + cutVariant;

	alt.helpers.instructionButtonsDrawler.setActive(false);

	alt.emit("selectMenu.hide", "barbershop_concrete");
	game.setCamFov(camera, 47);

	playVoice("SHOP_CUTTING_HAIR");

	if (withScissors) {
		cutSound = "Scissors";
		playKeeperAnim(currentCutAnim, currentCutAnim.replace("keeper_", "scissors_"));
	} else {
		cutSound = "Makeup";
		playKeeperAnim(currentCutAnim);
	}

	stage = 2;
	cutSoundStarted = false;

	if (acceptCallback) {
		cutAcceptCallback = acceptCallback;
	}
}

function getCutAnimPart() {
	return currentPlace.animDict.indexOf("hair_dressers") >= 0 ? "keeper_hair_cut_" : "keeper_idle_";
}

function playKeeperAnim(keeperAnim, scissorsAnim = undefined, looped = false) {
	sceneId = createScene(looped);

	game.taskSynchronizedScene(keeperPed, sceneId, currentPlace.animDict, keeperAnim, 1000, -1056964608, 0, 0, 1148846080, 0);

	if (scissorsAnim) {
		game.setEntityInvincible(scissorsObj, false);
		game.playSynchronizedEntityAnim(scissorsObj, sceneId, scissorsAnim, currentPlace.animDict, 1000, -1000, 0, 1148846080);
		game.forceEntityAiAndAnimationUpdate(scissorsObj);
	} else {
		game.setEntityInvincible(scissorsObj, true);
	}
}

function playBaseAnims() {
	const chairInfo = currentPlace.chair;

	game.taskPlayAnimAdvanced(playerPed, currentPlace.animDict, "player_base", chairInfo.position.x, chairInfo.position.y, 
		chairInfo.position.z, 0, 0, chairInfo.heading, 8, 8, -1, 5641, 0, 2, 1);
	playKeeperAnim("keeper_base", "scissors_base", true);
}

function setHeadOverlay(index, opacity, color, colorIndex, clearOverlayId) {
	const headOverlay = playerHeadOverlays.get(currentHeadOverlay.id);

	headOverlay[0] = index;
	headOverlay[1] = opacity;
	headOverlay[2] = color;
	currentHeadOverlay.index = index;
	currentHeadOverlay.opacity = opacity;
	currentHeadOverlay.colorIndex = colorIndex;

	if (clearOverlayId) {
		const clearOverlay = playerHeadOverlays.get(clearOverlayId);
		clearOverlay[0] = 255;
	}

	alt.emitServer("barbershop::setHeadOverlay", currentHeadOverlay.id, index, opacity, color || 0, clearOverlayId);
}

function setCurrentHeadOverlay() {
	game.setPedHeadOverlay(playerPed, currentHeadOverlay.id, currentHeadOverlay.index, currentHeadOverlay.opacity);
}

function setCurrentHeadOverlayColor() {
	if (currentHeadOverlay.colorIndex === -1) {
		return;
	}
	
	const color = getHeadOverlayColors(currentHeadOverlay.id)[currentHeadOverlay.colorIndex];

	if (typeof(color) !== "number") {
		return;
	}

	game.setPedHeadOverlayColor(playerPed, currentHeadOverlay.id, getHeadOverlayColorType(currentHeadOverlay.id), color, color);
}

function resetCurrentHeadOverlay(applyOnPed = true) {
	const headOverlay = playerHeadOverlays.get(currentHeadOverlay.id);
	const overlayColors = getHeadOverlayColors(currentHeadOverlay.id);
	const defaultOpacity = getHeadOverlayDefaultOpacity(currentHeadOverlay.id);

	currentHeadOverlay.index = headOverlay[0];
	currentHeadOverlay.opacity = defaultOpacity;
	currentHeadOverlay.colorIndex = overlayColors.length > 0 ? overlayColors.indexOf(headOverlay[2]) : -1;

	if (applyOnPed) {
		setCurrentHeadOverlay();
		setCurrentHeadOverlayColor();
	}
}

function getHeadOverlayColorType(overlayId) {
	switch (overlayId) {
		case 1: case 2: case 10:
			return 1;
		case 5: case 8:
			return 2;
		default:
			return 0;
	}
}

function getNakedClothes(componentId) {
	switch (componentId) {
		case 3:
			return 15;
		case 7:
			return 0;
		case 8:
			return 15;
		case 9:
			return 0;
		case 11:
			return 15;
		default:
			return undefined;
	}
}

function restoreClothes() {
	if (removedClothing.length === 0) {
		return;
	}

	for (const clothes of removedClothing) {
		game.setPedComponentVariation(playerPed, clothes.componentId, clothes.drawable, clothes.texture, clothes.palette);
	}

	removedClothing = [];
}

function onBarberStop(withAnim = true) {
	alt.emit("selectMenu.hide");
	alt.helpers.cameraRotator.pause(true);
	alt.helpers.cameraRotator.reset();
	alt.emit(`Cursor::show`, false);
	alt.helpers.instructionButtonsDrawler.dispose();

	if (withAnim) {
		const chairInfo = currentPlace.chair;

		playVoice("SHOP_GOODBYE");

		game.taskPlayAnimAdvanced(playerPed, currentPlace.animDict, "player_exitchair", chairInfo.position.x, chairInfo.position.y, 
			chairInfo.position.z, 0, 0, chairInfo.heading, 1000, -1000, -1, 5642, 0, 2, 1);
		playKeeperAnim("keeper_exitchair", "scissors_exitchair");

		stage = 3;
	} else {
		onBarberFinished();
	}
}

function onBarberFinished() {
	alt.helpers.cameraRotator.stop();
	game.renderScriptCams(false, false, 3000, true, false);
	stage = -1;
	alt.isBarberStarted = false;
	destroyEntities();
	alt.emitServer("barbershop::onStop");
	game.setEntityCollision(localPlayer.scriptID, true, true);
	game.freezeEntityPosition(localPlayer.scriptID, false);
	game.setEntityAlpha(localPlayer.scriptID, 255);
}

function destroyEntities() {
	game.deletePed(keeperPed);
	game.deletePed(playerPed);
	game.destroyCam(camera);
	game.deleteObject(scissorsObj);
	keeperPed = undefined;
	scissorsObj = undefined;
	playerPed = undefined;
	camera = undefined;
}

alt.on(`disconnect`, () => {
	destroyEntities();
});

function playVoice(speechName) {
	const voice = currentPlace.pedModel === 0x418DFF92 ? "S_M_M_HAIRDRESSER_01_BLACK_MINI_01" : "S_F_M_FEMBARBER_BLACK_MINI_01";

	game.playAmbientSpeechWithVoice(keeperPed, speechName, voice, "SPEECH_PARAMS_FORCE", false);
}

function addMenuItem(collection, itemName, itemIndex) {
	const price = getItemPrice(itemIndex);

	collection.push({ text: itemName, values: [ `${price} $` ] });
}

function getItemPrice(itemIndex) {
	const prices = barberInfo.prices[currentMenu];

	if (!Array.isArray(prices)) {
		return NaN;
	}

	return Array.isArray(prices[0]) ? prices[(game.isPedMale(localPlayer.scriptID) ? 0 : 1)][itemIndex] : prices[itemIndex];
}

let checkPriceResolver;

function checkPrice(itemIndex) {
	alt.helpers.cameraRotator.pause(true);
	alt.helpers.cameraRotator.reset();

	return new Promise((resolve, reject) => {
		if (checkPriceResolver) {
			return reject("CheckPrice is already requested");
		}

		alt.emit("selectMenu.hide");
		alt.helpers.instructionButtonsDrawler.setActive(false);
		alt.helpers.loadingPrompt.show("HUD_TRANSP", 4);

		checkPriceResolver = {
			resolve: (result) => {
				clearPriceCheck(result);
				resolve(result);
			},
			reject: (message) => {
				clearPriceCheck(false);
				reject(message);
			}
		}

		checkPriceResolver.timeout = alt.setTimeout(() => {
			if (checkPriceResolver) {
				checkPriceResolver.reject("CheckPrice timeout");
			}
		}, 10000);

		alt.emitServer("barbershop::checkPrice", currentMenu, itemIndex, game.isPedMale(localPlayer.scriptID));
	});
}

function clearPriceCheck(isSucces) {
	alt.clearTimeout(checkPriceResolver.timeout);
	checkPriceResolver = undefined;
	alt.helpers.loadingPrompt.hide();
	alt.helpers.cameraRotator.pause(false);

	if (!isSucces) {
		showConcreteMenu(undefined);
	}
}

alt.onServer("barbershop::checkPriceResponse", (result) => {
	if (!checkPriceResolver || typeof(result) !== "boolean") {
		return;
	}

	if (alt.isBarberStarted) {
		checkPriceResolver.resolve(result);
	} else {
		checkPriceResolver.resolve(false);
	}
});