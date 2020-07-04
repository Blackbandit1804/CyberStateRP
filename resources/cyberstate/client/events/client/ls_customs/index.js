import alt from 'alt';
import game from 'natives';

const localPlayer = alt.Player.local

const controlsToDisable = [ 71, 72, 76, 73, 59, 60, 75, 80, 69, 70, 68, 74, 86, 81, 82, 138, 136, 114,
	107, 110, 89, 89, 87, 88, 113, 115, 116, 117, 118, 119, 131, 132, 123, 126, 129, 130, 133, 134 ];

function wait(ms) {
	return new Promise(resolve => alt.setTimeout(resolve, ms));
}

const neonColors = [
	[ 222, 222, 255], 
	[ 2, 21, 255], 
	[ 3, 83, 255], 
	[ 0, 255, 140], 
	[ 94, 255, 1], 
	[ 255, 255, 0], 
	[ 255, 150, 5], 
	[ 255, 62, 0], 
	[ 255, 1, 1], 
	[ 255, 50, 100 ], 
	[ 255, 5, 190 ], 
	[ 35, 1, 255 ], 
	[ 15, 3, 255 ]
];

const neonColorNames = ["Белый", "Синий", '"Электрический голубой"', '"Мятно-зеленый"', "Лайм", "Желтый", '"Золотой дождь"', "Оранжевый", "Красный", '"Розовый пони"', "Ярко-розовый", "Фиолетовый", '"Черный свет"'];
const numberPlateTypeValues = ["Синий на белом 1", "Синий на белом 2", "Синий на белом 3", "Желтый на синем", "Желтый на черном"];

let customsInfo = undefined;
let vehiclePrice;

let enterInteractionColshape = undefined;
let camera = undefined;
let isControlsDisabled = false;
let lampObj = undefined;
let invisibleVehicle = undefined;

alt.on("update", () => {
	if (customsInfo === undefined) {
		return;
	}

	if (isControlsDisabled) {
		game.hideHudAndRadarThisFrame();
		disableControls();
	}

	if (!isValidVehicle()) {
		return;
	}

	const placeIndex = getCurrentPlaceIndex();

	if (placeIndex !== -1 && customsInfo.currentPlace !== placeIndex) {
		startEnterInteraction(placeIndex);
	} else if (placeIndex === -1 && customsInfo.currentPlace !== -1) {
		stopEnterInteraction();
	}

	customsInfo.currentPlace = placeIndex;
});

alt.setInterval(() => {
	const pPos = localPlayer.pos;
	if (alt.vdist(pPos, enterInteractionColshape) <= 2) {
		if (localPlayer.inColshape === true) return;
		if (!localPlayer.vehicle) return;
		
		if (customsInfo !== undefined && customsInfo.currentPlace === -1) return;
		
		localPlayer.inColshape = true;
		currentModType = -1;

		if (customsInfo !== undefined) alt.emitServer("ls_customs::init", customsInfo.currentPlace);
	} else {
		if (localPlayer.inColshape === true) {
			localPlayer.inColshape = false;
		}
	}
}, 100);

alt.onServer(`ls_customs::init`, (rawCustomsInfo) => {
	customsInfo = JSON.parse(rawCustomsInfo);

	for (const place of customsInfo.places) {
		doorControl(true, place.door.model, place.door.position);
	}
});

alt.onServer("ls_customs::occupant_init", () => {
	isControlsDisabled = true;

	alt.helpers.screen.fade(true, 50);
}),

alt.onServer("ls_customs::start", (driverId, vehicle, placeId, vehPrice) => {
	const place = customsInfo.places[placeId];

	vehiclePrice = vehPrice;

	setUiElementsState(false);

	alt.emit(`inventory.enable`, false);
	alt.emit(`hudControl.enable`, false);
	
	game.setEntityCoords(vehicle.scriptID, place.startVehInfo.position.x, place.startVehInfo.position.y, place.startVehInfo.position.z);
	game.setEntityHeading(vehicle.scriptID, place.startVehInfo.heading);
	game.setVehicleOnGroundProperly(vehicle.scriptID);
	game.setVehicleDoorsShut(vehicle.scriptID, true);
	game.setVehicleForwardSpeed(vehicle.scriptID, 2);
	game.setVehicleRadioEnabled(vehicle.scriptID, false);

	createLamp(place);	
	camera = game.createCam('DEFAULT_SCRIPTED_CAMERA', false);

	if (driverId === localPlayer.getSyncedMeta("id")) {
		if (place.waypointRecord) {
			alt.helpers.screen.fade(false, 50);
			const camParams = place.startCamParams;
			game.setCamActive(camera, true);
			
			requestWaypointRecording(place.waypointRecord);

			alt.setTimeout(() => {
				vehicleFollowWaypoint(vehicle, place.waypointRecord, 262144, 0, 0, -1, 3, 0, 2.1).then(vehicleReachPoint);
			}, 1000);

			setCamParams(camera, camParams.from.position, camParams.from.rotation, camParams.from.fov, camParams.from.duration, camParams.from.unk);
			setCamParams(camera, camParams.to.position, camParams.to.rotation, camParams.to.fov, camParams.to.duration, camParams.to.unk);
			game.renderScriptCams(true, false, 3000, true, false);
		} else {
			alt.setTimeout(() => {
				alt.helpers.screen.fade(false, 50);
				game.setCamActive(camera, true);
				vehicleReachPoint(vehicle);
				game.renderScriptCams(true, false, 3000, true, false);
			}, 1000);
		}
		
		game.playSoundFromEntity(-1, "MOD_SHOPS_ENTER_ENGINE_BLIP", vehicle.scriptID, 0, 0, 0); // Engine sound
	}
});

alt.on(`disconnect`, () => {
	if (camera !== undefined) game.destroyCam(camera);
	if (lampObj !== undefined) game.deleteObject(lampObj);
});

alt.onServer("ls_customs::show_vehicle", (rawPosition, heading) => {
	const vehicle = localPlayer.vehicle;
	const position = JSON.parse(rawPosition);

	game.setEntityCoords(vehicle.scriptID, position.x, position.y, position.z);
	game.setEntityHeading(vehicle.scriptID, heading);

	onStartTuning(vehicle, true);
})

alt.onServer("ls_customs::end_occupant", () => {
	alt.helpers.screen.fade(false, 50);
	endOfTuning(true);
});

alt.onServer("ls_customs::end_driver", () => {
	endOfTuning(false, true);
});

alt.onServer(`ls_customs::blip::set`, (pos) => {
	pos = JSON.parse(pos);
	
	alt.helpers.blip.new(72, pos.x, pos.y, pos.z, {
		shortRange: true,
		scale: 0.7
	});
});


function loadModelAsync(model) {
  return new Promise((resolve, reject) => {
    if(typeof model === 'string') {
      model = game.getHashKey(model);
    }
  
    if(!game.isModelValid(model))
      return resolve(false);

    if(game.hasModelLoaded(model))
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

async function vehicleReachPoint(vehicle) {
	const vehPosition = vehicle.pos;
	const vehHeading = game.getEntityHeading(vehicle.scriptID);

	alt.emitServer("ls_customs::vehicle_reach_point", JSON.stringify(vehPosition), vehHeading);
	onStartTuning(vehicle, false);

	await loadModelAsync(vehicle.model);
	invisibleVehicle = game.createVehicle(vehicle.model, vehPosition.x, vehPosition.y, vehPosition.z, vehHeading, false, false);

	game.freezeEntityPosition(invisibleVehicle, true);
	game.setEntityCollision(invisibleVehicle, false, false);
	game.setEntityVisible(invisibleVehicle, false, false);
}

function startEnterInteraction(placeIndex) {
	const place = customsInfo.places[placeIndex];
	const vehicle = localPlayer.vehicle;

	doorControl(false, place.door.model, place.door.position);

	if (game.getPedInVehicleSeat(vehicle.scriptID, -1) === localPlayer.scriptID) {
		enterInteractionColshape = new alt.Vector3(place.enterPosition.x, place.enterPosition.y, place.enterPosition.z);
	}
}

let mainMenuIndex = 0;
let currentModType = -1;
let isXenonEnabled;
let neonLightStates;
let currentNeonColor;
let currentHornType = -1;
let currentHornValue;
let currentNumberPlateType;
let isCurrentColorPrimary = false;
let currentColorGroup = -1;
let currentPrimaryColor;
let currentSecondaryColor;
let currentWheelType;
let selectedWheelType = -1;
let selectedWheelTypeIndex;
let currentWheelModType;
let currentWheelModIndex;
let currentWheelColor;
let currentTiresDesign;
let currentTiresSmokeColor;
let currentWheelChunk = [];
let currentModKit;
let currentWindowTint;
let currentRepairPrice;
let currentWheelChunkIndex;

alt.on(`Client::init`, (view) => {
	view.on("selectMenu.itemSelected", async (menuName, itemName, itemValue, itemIndex) => {
		if (menuName === "ls_customs_repair") { 
			if (itemName === "Ремонт") {
				if (!await checkPrice("repair", 0, 0, currentRepairPrice)) {
					return;
				}

				game.setVehicleDirtLevel(localPlayer.vehicle.scriptID, 0);
				alt.emitServer("ls_customs::repair");

				showMenu(localPlayer.vehicle, true);
			} else if (itemName === "Выход") {
				endOfTuning(false);
			}
		} else if (menuName === "ls_customs_main") {
			mainMenuIndex = itemIndex;

			if (itemName === "Выход") {
				endOfTuning(false);
			} else if (itemName === "Фары") {
				const items = [ { text: "Фары" }];

				if (game.isThisModelACar(localPlayer.vehicle.model)) {
					items.push({ text: "Неоновые наборы" });
				}

				alt.emit("selectMenu.setSpecialItems", "ls_customs_headlightsMenu", items);
				alt.emit("selectMenu.show", "ls_customs_headlightsMenu");
			} else if (itemName === "Клаксоны") {
				currentHornValue = game.getVehicleMod(localPlayer.vehicle.scriptID, 14);
				currentHornType = -1;
				alt.emit("selectMenu.show", "ls_customs_hornsMenu");
			} else if (itemName === "Номера") {
				showNumberPlateMenu();
			} else if (itemName === "Окраска") {
				alt.emit("selectMenu.show", "ls_customs_colorMenu");
			} else if (itemName === "Колёса") {
				alt.emit("selectMenu.show", "ls_customs_wheelsMenu");
			} else if (itemName === "Турбонаддув") {
				showTurboMenu();
			} else if (itemName === "Стёкла") {
				currentWindowTint = game.getVehicleWindowTint(localPlayer.vehicle.scriptID);

				showWindowTintMenu();
			} else if (menuMap.has(itemName)) {
				currentModType = menuMap.get(itemName).modType;
				showConcreteMenu(currentModType);
			}
		} else if (menuName === "ls_customs_concreteMod") {
			if (currentActiveMod === itemIndex - 1) {
				return;
			}

			if (!await checkPrice("mods", currentModType, itemIndex, undefined, itemIndex)) {
				return;
			}

			currentActiveMod = itemIndex - 1;
			alt.emitServer("ls_customs::setMod", currentModType, itemIndex);
			showModificationSetMessage(itemName);
		} else if (menuName === "ls_customs_headlightsMenu") {
			if (itemName === "Фары") {
				showHeadlightsMenu();
			} else if (itemName === "Неоновые наборы") {
				alt.emit("selectMenu.show", "ls_customs_neonMenu");
			}
		} else if (menuName === "ls_customs_neonMenu") {
			if (itemName === "Расположение неоновых трубок") {
				showNeonPositionMenu();
			} else if (itemName === "Цвет неона") {
				showNeonColorMenu();
			}
		} else if (menuName === "ls_customs_headlights") {
			if (isXenonEnabled === (itemIndex === 1)) {
				return;
			}

			if (!await checkPrice("mods", 22, itemIndex, undefined, itemIndex)) {
				return;
			}

			isXenonEnabled = itemIndex === 1;
			alt.emitServer("ls_customs::setMod", 22, isXenonEnabled);
			showModificationSetMessage(itemName);
		} else if (menuName === "ls_customs_neonPosition") {
			const states = getNeonValuesByIndex(itemIndex);
			let isOldValue = states.length === neonLightStates.length;

			for (const state of states) {
				if (neonLightStates.indexOf(state) < 0) {
					isOldValue = false;
					break;
				}
			}

			if (isOldValue) {
				return;
			}

			if (!await checkPrice("neonPosition", 0, itemIndex, undefined, itemIndex)) {
				return;
			}

			neonLightStates = states;
			alt.emitServer("ls_customs::enableNeon", JSON.stringify(getNeonValuesByIndexServer(itemIndex)));
			showModificationSetMessage(itemName);
		} else if (menuName === "ls_customs_neonColor") {
			const color = neonColors[itemIndex];

			if (currentNeonColor[0] === color[0] && currentNeonColor[1] === color[1] && currentNeonColor[2] === color[2]) {
				return;
			}

			if (!await checkPrice("neonColor", 0, itemIndex, undefined, itemIndex)) {
				return;
			}

			currentNeonColor = [ color[0], color[1], color[2] ];
			alt.emitServer("ls_customs::neonColor", color[0], color[1], color[2]);
			showModificationSetMessage(itemName);
		} else if (menuName === "ls_customs_hornsMenu") {
			currentHornType = itemIndex;
			showHornsMenu();
		} else if (menuName === "ls_customs_hornsConcrete") {
			const value = customsInfo.horns[currentHornType][itemIndex].value;

			if (currentHornValue === value) {
				return;
			}

			if (!await checkPrice("mods", 14, itemIndex, undefined, itemIndex)) {
				return;
			}

			currentHornValue = value;
			alt.emitServer("ls_customs::setMod", 14, currentHornValue);
			showModificationSetMessage(itemName);
		} else if (menuName === "ls_customs_numberPlate") {
			const value = getNumberPlateValueByIndex(itemIndex);

			if (currentNumberPlateType === value) {
				return;
			}

			if (!await checkPrice("numberPlateType", 0, itemIndex, undefined, itemIndex)) {
				return;
			}

			currentNumberPlateType = value;
			alt.emitServer("ls_customs::numberPlateType", currentNumberPlateType);
			showModificationSetMessage(itemName);
		} else if (menuName === "ls_customs_colorMenu") {
			isCurrentColorPrimary = itemIndex === 0;
			alt.emit("selectMenu.show", "ls_customs_colorGroup");
		} else if (menuName === "ls_customs_colorGroup") {
			currentColorGroup = itemIndex;

			showConcreteColorMenu();
		} else if (menuName === "ls_customs_colorConcrete") {
			const value = customsInfo.colors[currentColorGroup][itemIndex];

			if (isCurrentColorPrimary) {
				if (currentPrimaryColor === value.color) {
					return;
				}

				if (!await checkPrice("color", 0, currentColorGroup, undefined, itemIndex)) {
					return;
				}

				currentPrimaryColor = value.color;
			} else {
				if (currentSecondaryColor === value.color) {
					return;
				}

				if (!await checkPrice("color", 0, currentColorGroup, undefined, itemIndex)) {
					return;
				}

				currentSecondaryColor = value.color;
			}

			alt.emitServer("ls_customs::setColor", currentPrimaryColor, currentSecondaryColor);
			showModificationSetMessage(itemName);
		} else if (menuName === "ls_customs_wheelsMenu") {
			currentTiresDesign = game.getVehicleModVariation(localPlayer.vehicle.scriptID, 23);

			if (itemName === "Колёса") {
				const vehicle = localPlayer.vehicle;
				let wheelMenu = "motoMenu";
				let selectedIndex = 0;

				if (game.isThisModelACar(vehicle.model)) {
					currentWheelType = game.getVehicleWheelType(vehicle.scriptID);
					wheelMenu = "carMenu";
					selectedIndex = getWheelTypeIndexByValue(currentWheelType);
				} else {
					currentWheelType = 6;
				}

				alt.emit("selectMenu.show", `ls_customs_wheels_${wheelMenu}`, selectedIndex);
			} else if (itemName === "Цвет колёс") {
				showWheelsColorMenu();
			} else if (itemName === "Шины") {
				alt.emit("selectMenu.show", `ls_customs_wheels_tiresMenu`);
			}
		} else if (menuName === "ls_customs_wheels_carMenu") {
			currentWheelModType = 23;
			selectedWheelType = getWheelTypeValueByIndex(itemIndex);
			selectedWheelTypeIndex = itemIndex;
			game.setVehicleWheelType(localPlayer.vehicle.scriptID, selectedWheelType);
			alt.emit("selectMenu.show", "ls_customs_wheels_typeMenu");
		} else if (menuName === "ls_customs_wheels_motoMenu") {
			currentWheelModType = 23 + itemIndex;
			selectedWheelType = 6;
			selectedWheelTypeIndex = 0;
			alt.emit("selectMenu.show", "ls_customs_wheels_typeMenu");
		} else if (menuName === "ls_customs_wheels_typeMenu") {
			currentWheelChunkIndex = itemIndex;

			showWheelsConcreteMenu();
		} else if (menuName === "ls_customs_wheels_concreteMenu") {
			const index = currentWheelChunk[itemIndex];

			if (currentWheelModIndex === index && selectedWheelType === currentWheelType) {
				return;
			}

			let priceKey;
			let priceIndex;

			if (game.isThisModelACar(localPlayer.vehicle.model)) {
				priceKey = "carWheels";
				priceIndex = selectedWheelTypeIndex;
			} else {
				priceKey = "motoWheels";
				priceIndex = itemIndex;
			}

			if (!await checkPrice(priceKey, 0, priceIndex, undefined, itemIndex)) {
				return;
			}

			currentWheelModIndex = index;
			currentWheelType = selectedWheelType;
			alt.emitServer("ls_customs::setWheel", selectedWheelType, currentWheelModIndex + 1, currentWheelModType === 24);
			showModificationSetMessage(itemName);
		} else if (menuName === "ls_customs_wheels_colors") {
			const color = customsInfo.wheelColors[itemIndex];

			if (currentWheelColor === color) {
				return;
			}

			if (!await checkPrice("wheelColor", 0, itemIndex, undefined, itemIndex)) {
				return;
			}

			currentWheelColor = color;
			alt.emitServer("ls_customs::setWheelColor", currentWheelColor);
			showModificationSetMessage(itemName);
		} else if (menuName === "ls_customs_wheels_tiresMenu") {
			if (itemName === "Дизайн шин") {
				const vehicle = localPlayer.vehicle;

				if (isVehicleWheelsAreDefault(vehicle)) {
					alt.emit("BN_Show", game.getLabelText("CMOD_NOWHE"));
					return;
				}

				showTiresDesignMenu();
			} else if (itemName === "Улучшение шин") {
				showTiresUpgradeMenu();
			} else if (itemName === "Дым от покрышек") {
				showTiresSmokeColorMenu();
			}
		} else if (menuName === "ls_customs_wheels_tiresDesign") {
			if (currentTiresDesign === (itemIndex === 1)) {
				return;
			}

			if (!await checkPrice("tiresDesign", 0, itemIndex, undefined, itemIndex)) {
				return;
			}

			currentTiresDesign = itemIndex === 1;
			alt.emitServer("ls_customs::setCustomTires", currentTiresDesign === 1 ? true : false);
			showModificationSetMessage(itemName);
		} else if (menuName === "ls_customs_wheels_tiresUpgrade") {
			const vehicle = localPlayer.vehicle;

			if (!game.getVehicleTyresCanBurst(vehicle.scriptID)) {
				return;
			}

			if (!await checkPrice("tiresBurst", 0, itemIndex, undefined, itemIndex)) {
				return;
			}

			game.setVehicleTyresCanBurst(vehicle.scriptID, false);
			alt.emitServer("ls_customs::setTiresBurst", false);
			showModificationSetMessage(itemName);
		} else if (menuName === "ls_customs_wheels_tiresSmokeColor") {
			const color = customsInfo.tiresSmokeColors[itemIndex].color;

			if (currentTiresSmokeColor[0] === color[0] && currentTiresSmokeColor[1] === color[1] && currentTiresSmokeColor[2] === color[2]) {
				return;
			}

			if (!await checkPrice("tiresSmokeColor", 0, itemIndex, undefined, itemIndex)) {
				return;
			}

			currentTiresSmokeColor = [ color[0], color[1], color[2] ];
			alt.emitServer(`ls_customs::setMod`, 20, 1);
			alt.emitServer("ls_customs::setTiresSmokeColor", color[0], color[1], color[2]);
			showModificationSetMessage(itemName);
		} else if (menuName === "ls_customs_turbo") {
			const value = itemIndex === 1;

			if (isVehicleToggleModOn(localPlayer.vehicle, 18) === value) {
				return;
			}

			if (!await checkPrice("mods", 18, itemIndex, undefined, itemIndex)) {
				return;
			}

			alt.emitServer("ls_customs::setMod", 18, value === 1 ? 0 : -1);
			showModificationSetMessage(itemName);
		} else if (menuName === "ls_customs_windows") {
			const windowTint = getWindowTintValueByIndex(itemIndex);

			if (currentWindowTint === windowTint) {
				return;
			}

			if (!await checkPrice("windowTint", 0, itemIndex, undefined, itemIndex)) {
				return;
			}

			currentWindowTint = windowTint;
			alt.emitServer("ls_customs::setWindowTint", currentWindowTint);
			showModificationSetMessage(itemName);
		}
	});
	
	view.on("selectMenu.itemFocusChanged", (menuName, itemName, itemValue, itemIndex, valueIndex) => {
		if (menuName === "ls_customs_concreteMod") {
			if (currentModType === -1) {
				return;
			}

			game.setVehicleMod(localPlayer.vehicle.scriptID, currentModType, itemIndex - 1);
		} else if (menuName === "ls_customs_headlights") {
			game.toggleVehicleMod(localPlayer.vehicle.scriptID, 22, itemIndex === 1 ? 0 : -1);
		} else if (menuName === "ls_customs_neonPosition") {
			setNeonLight(localPlayer.vehicle, getNeonValuesByIndex(itemIndex));
		} else if (menuName === "ls_customs_neonColor") {
			const color = neonColors[itemIndex];

			game.setVehicleNeonLightsColour(localPlayer.vehicle.scriptID, color[0], color[1], color[2]);
		} else if (menuName === "ls_customs_hornsConcrete") {
			const currentHorn = customsInfo.horns[currentHornType][itemIndex];
			let value = currentHorn.value;

			if (value === 42 || value === 44) {
				value++;
			}

			game.setVehicleMod(invisibleVehicle, 14, value);
			game.startVehicleHorn(invisibleVehicle, currentHorn.duration, game.getHashKey("HELDDOWN"), false);
		} else if (menuName === "ls_customs_numberPlate") {
			const value = getNumberPlateValueByIndex(itemIndex);

			game.setVehicleNumberPlateTextIndex(localPlayer.vehicle.scriptID, value);
		} else if (menuName === "ls_customs_colorConcrete") {
			const vehicle = localPlayer.vehicle;
			const value = customsInfo.colors[currentColorGroup][itemIndex];

			if (isCurrentColorPrimary) {
				game.setVehicleColours(vehicle.scriptID, value.color, currentSecondaryColor);
			} else {
				game.setVehicleColours(vehicle.scriptID, currentPrimaryColor, value.color);
			}
		} else if (menuName === "ls_customs_wheels_concreteMenu") {
			setVehicleWheel(localPlayer.vehicle, currentWheelModType, currentWheelChunk[itemIndex], currentTiresDesign);
		} else if (menuName === "ls_customs_wheels_colors") {
			setVehicleWheelColor(localPlayer.vehicle, customsInfo.wheelColors[itemIndex]);
		} else if (menuName === "ls_customs_wheels_tiresDesign") {
			setVehicleTiresDesign(localPlayer.vehicle, itemIndex === 1);
		} else if (menuName === "ls_customs_windows") {
			game.setVehicleWindowTint(localPlayer.vehicle.scriptID, getWindowTintValueByIndex(itemIndex));
		}
	});
	view.on("selectMenu.backspacePressed", (menuName) => {
		if (menuName === "ls_customs_concreteMod") {
			alt.emit("selectMenu.show", "ls_customs_main", mainMenuIndex);
			game.setVehicleMod(localPlayer.vehicle.scriptID, currentModType, currentActiveMod);
			currentModType = -1;
		} else if (menuName === "ls_customs_headlightsMenu") {
			alt.emit("selectMenu.show", "ls_customs_main", mainMenuIndex);
		} else if (menuName === "ls_customs_headlights") {
			const vehicle = localPlayer.vehicle;
	
			alt.emit("selectMenu.show", "ls_customs_headlightsMenu");
			game.setVehicleLights(vehicle.scriptID, 1);
			game.setVehicleLights(vehicle.scriptID, 0);
			game.toggleVehicleMod(vehicle.scriptID, 22, isXenonEnabled);
		} else if (menuName === "ls_customs_neonMenu") {
			alt.emit("selectMenu.show", "ls_customs_headlightsMenu");
		} else if (menuName === "ls_customs_neonPosition") {
			alt.emit("selectMenu.show", "ls_customs_neonMenu");
			setNeonLight(localPlayer.vehicle, neonLightStates);
		} else if (menuName === "ls_customs_neonColor") {
			alt.emit("selectMenu.show", "ls_customs_neonMenu");
			game.setVehicleNeonLightsColour(localPlayer.vehicle.scriptID, currentNeonColor[0], currentNeonColor[1], currentNeonColor[2]);
		} else if (menuName === "ls_customs_hornsMenu") {
			alt.emit("selectMenu.show", "ls_customs_main", mainMenuIndex);
		} else if (menuName === "ls_customs_hornsConcrete") {
			game.setVehicleMod(localPlayer.vehicle.scriptID, 14, currentHornValue);
			alt.emit("selectMenu.show", "ls_customs_hornsMenu");
		} else if (menuName === "ls_customs_numberPlate") {
			game.setVehicleNumberPlateTextIndex(localPlayer.vehicle.scriptID, currentNumberPlateType);
			alt.emit("selectMenu.show", "ls_customs_main", mainMenuIndex);
		} else if (menuName === "ls_customs_colorMenu") {
			alt.emit("selectMenu.show", "ls_customs_main", mainMenuIndex);
		} else if (menuName === "ls_customs_colorGroup") {
			alt.emit("selectMenu.show", "ls_customs_colorMenu");
		} else if (menuName === "ls_customs_colorConcrete") {
			game.setVehicleColours(localPlayer.vehicle.scriptID, currentPrimaryColor, currentSecondaryColor);
			alt.emit("selectMenu.show", "ls_customs_colorGroup");
		} else if (menuName === "ls_customs_wheelsMenu") {
			alt.emit("selectMenu.show", "ls_customs_main", mainMenuIndex);
		} else if (menuName === "ls_customs_wheels_motoMenu") {
			alt.emit("selectMenu.show", "ls_customs_wheelsMenu");
		} else if (menuName === "ls_customs_wheels_carMenu") {
			alt.emit("selectMenu.show", "ls_customs_wheelsMenu");
		} else if (menuName === "ls_customs_wheels_typeMenu") {
			if (game.isThisModelACar(localPlayer.vehicle.model)) {
				alt.emit("selectMenu.show", "ls_customs_wheels_carMenu", getWheelTypeIndexByValue(selectedWheelType));
			} else {
				alt.emit("selectMenu.show", "ls_customs_wheels_motoMenu");
			}
		} else if (menuName === "ls_customs_wheels_concreteMenu") {
			setVehicleWheel(localPlayer.vehicle, currentWheelModType, currentWheelModIndex, currentTiresDesign);
			alt.emit("selectMenu.show", "ls_customs_wheels_typeMenu");
		} else if (menuName === "ls_customs_wheels_colors") {
			setVehicleWheelColor(localPlayer.vehicle, currentWheelColor);
			alt.emit("selectMenu.show", "ls_customs_wheelsMenu");
		} else if (menuName === "ls_customs_wheels_tiresMenu") {
			alt.emit("selectMenu.show", "ls_customs_wheelsMenu");
		} else if (menuName === "ls_customs_wheels_tiresDesign") {
			 setVehicleTiresDesign(localPlayer.vehicle, currentTiresDesign);
			alt.emit("selectMenu.show", "ls_customs_wheels_tiresMenu");
		} else if (menuName === "ls_customs_wheels_tiresUpgrade") {
			alt.emit("selectMenu.show", "ls_customs_wheels_tiresMenu");
		} else if (menuName === "ls_customs_wheels_tiresSmokeColor") {
			game.setVehicleTyreSmokeColor(localPlayer.vehicle.scriptID, currentTiresSmokeColor[0], currentTiresSmokeColor[1], currentTiresSmokeColor[2]);
			alt.emit("selectMenu.show", "ls_customs_wheels_tiresMenu");
		} else if (menuName === "ls_customs_turbo") {
			alt.emit("selectMenu.show", "ls_customs_main", mainMenuIndex);
		} else if (menuName === "ls_customs_windows") {
			game.setVehicleWindowTint(localPlayer.vehicle.scriptID, currentWindowTint);
			alt.emit("selectMenu.show", "ls_customs_main", mainMenuIndex);
		}
	});	
});

function stopEnterInteraction() {
	const place = customsInfo.places[customsInfo.currentPlace];

	doorControl(true, place.door.model, place.door.position);
	
	if (enterInteractionColshape !== undefined) {
		enterInteractionColshape = undefined;
	}
}

function onStartTuning(vehicle, isOccupant) {
	const vehPosition = vehicle.pos;
	const vehHeading = game.getEntityHeading(vehicle.scriptID);
	
	currentModKit = game.getVehicleModKit(vehicle.scriptID);
	game.setVehicleModKit(vehicle.scriptID, 0);

	let cameraOffset = new alt.Vector3(-3.5, 4, 0.5);

	const interior = game.getInteriorAtCoords(vehPosition.x, vehPosition.y, vehPosition.z);

	if (interior === 179457 || interior === 201729) {
		doorControl(false, -822900180, new alt.Vector3(110.594, 6628.001, 32.26));
		doorControl(false, -822900180, new alt.Vector3(1174.656, 2644.159, 40.50673));
		cameraOffset = new alt.Vector3(-2.5, 3.5, 0.5);
	}

	alt.helpers.cameraRotator.start(camera, vehPosition, vehPosition, cameraOffset, vehHeading, 42.5);
	alt.helpers.cameraRotator.setZBound(-0.8, 1.8);
	alt.helpers.cameraRotator.setZUpMultipler(5);

	alt.emit(`Cursor::show`, true);
	game.requestAdditionalText("MOD_MNU", 9);

	if (isOccupant) {
		alt.helpers.screen.fade(false, 50);
	} else {
		showMenu(vehicle);
	}

	showSpecMenu(true);
}

function disableControls() {
	for (const control of controlsToDisable) {
		game.disableControlAction(0, control, true);
	}
}

// TODO
function isValidVehicle() {
	const vehicle = localPlayer.vehicle;

	if (!vehicle) {
		return false;
	}

	const vehModel = vehicle.model;

	return game.isThisModelABike(vehModel) || game.isThisModelACar(vehModel);
}

function getCurrentPlaceIndex() {
	const heading = game.getEntityHeading(localPlayer.vehicle.scriptID);
	let index = 0;

	for (const place of customsInfo.places) {
		if (
			isEntityInAngledArea(localPlayer, place.angledArea.origin, place.angledArea.edge, place.angledArea.angle)
			&& (isHeadingBound(heading, place.angledArea.headingBound[0], place.angledArea.headingBound[1]) || index === 4)
		) {
				return index;
			}

		index++;
	}

	return -1;
}

function createLamp(place) {
	lampObj = game.createObject(place.lampObj.model, place.lampObj.position.x, place.lampObj.position.y, place.lampObj.position.z, false, false, false);

	game.setEntityHeading(lampObj, place.lampObj.rotation);
	game.setEntityCollision(lampObj, false, false);
	game.freezeEntityPosition(lampObj, true);
}

function isEntityInAngledArea(entity, origin, edge, angle) {
	return game.isEntityInAngledArea(entity.scriptID, origin.x, origin.y, origin.z, edge.x, edge.y, edge.z, angle, false, true, 0);
}

function doorControl(locked, model, position) {
	game.doorControl(model, position.x, position.y, position.z, locked, 0, 0, 0);
}

function setCamParams(camera, position, rotation, fov, duration, unk) {
	game.setCamParams(camera, position.x, position.y, position.z, rotation.x, rotation.y, rotation.z, fov, duration, unk, 1, 2);
}

function vehicleFollowWaypoint(vehicle, waypointRecord, unk1, unk2, unk3, unk4, unk5, unk6, unk7) {
	game.taskVehicleFollowWaypointRecording(localPlayer.scriptID, vehicle.scriptID, waypointRecord, unk1, unk2, unk3, unk4, unk5, unk6, unk7);

	return new Promise((resolve, reject) => {
		let counter = 0;
		const interval = alt.setInterval(() => {
			if (game.isWaypointPlaybackGoingOnForVehicle(vehicle.scriptID) === false) {
				alt.clearInterval(interval);
				resolve(vehicle);
			}

			if (counter++ > 100000) {
				alt.clearInterval(interval);
				reject(new Error("Vehicle follow failed"));
			}
		}, 10);
	});
}

async function requestWaypointRecording(name) {
	game.requestWaypointRecording(name);

	while (!game.getIsWaypointRecordingLoaded(name)) {
		await wait(0);
	}
}

function isHeadingBound(heading, bound1, bound2) {
	let dBound1 = (bound1 - bound2);

	if (dBound1 < 0) {
		dBound1 = (dBound1 + 360);
	}

	let dbound2 = (bound1 + bound2);
	
	if (dbound2 >= 360) {
		dbound2 = (dbound2 - 360);
	}

	return dbound2 > dBound1 ? (heading < dbound2 && heading > dBound1) : (heading < dbound2 || heading > dBound1);
}

function getRepairCost(vehicle) {
	const model = vehicle.model;
	let sum = 0;

	const dirtLevel = game.getVehicleDirtLevel(vehicle.scriptID);

	if (dirtLevel > 10) {
		sum += 8;
	} else if (dirtLevel > 5) {
		sum += 4;
	}

	const engineHealth = game.getVehicleEngineHealth(vehicle.scriptID) / 1000;

	if (engineHealth <= 0.99) {
		if (engineHealth > 0.8) {
			sum += 20;
		} else if (engineHealth > 0.6) {
			sum += 40;
		} else if (engineHealth > 0.4) {
			sum += 80;
		} else {
			sum += 100;
		}
	}

	const petrolTankHealth = game.getVehiclePetrolTankHealth(vehicle.scriptID) / 1000;

	if (petrolTankHealth <= 0.99) {
		if (petrolTankHealth > 0.8) {
			sum += 20;
		} else if (petrolTankHealth > 0.6) {
			sum += 40;
		} else if (petrolTankHealth > 0.4) {
			sum += 60;
		} else {
			sum += 75;
		}
	}

	const health = game.getEntityHealth(vehicle.scriptID) / 1000;

	if (health <= 0.99) {
		if (health > 0.8) {
			sum += 40;
		} else if (health > 0.6) {
			sum += 80;
		} else if (health > 0.4) {
			sum += 150;
		} else {
			sum += 200;
		}
	}

	if (game.isVehicleDamaged(vehicle.scriptID)) {
		sum += 50;
	}

	for (let i = 0; i < 2; i ++) {
		const value = i === 1;

		if (game.isVehicleBumperBrokenOff(vehicle.scriptID, value)) {
			sum += 50;
		}
	}

	if (!game.areAllVehicleWindowsIntact(vehicle.scriptID)) {
		sum += 20;

		if (!game.isVehicleWindowIntact(vehicle.scriptID, 6)) {
			sum += 40;
		}

		if (!game.isVehicleWindowIntact(vehicle.scriptID, 7)) {
			sum += 40;
		}
	}

	if (game.isThisModelACar(model)) {
		for (let i = 0; i < 6; i++) {
			if (game.isVehicleDoorDamaged(vehicle.scriptID, i)) {
				sum += 25;
			}
		}
	}

	if (game.getIsLeftVehicleHeadlightDamaged(vehicle.scriptID)) {
		sum += 15;
	}

	if (game.getIsRightVehicleHeadlightDamaged(vehicle.scriptID)) {
		sum += 15;
	}

	for (let i = 0; i < 8; i++) {
		if (game.isVehicleTyreBurst(vehicle.scriptID, i, false)) {
			sum += 25;
		}
	}

	if (game._0x5DB8010EE71FDEF2(vehicle.scriptID)) {
		sum += 50;
	}

	return sum;
}

function showMenu(vehicle, forceMain = false) {
	if (!forceMain) {
		const repairCost = getRepairCost(vehicle);

		if (repairCost > 0) {
			showRepairMenu(repairCost);
			return;
		}
	}

	const menuItems = [];

	addSubmenuItem(vehicle, 16, menuItems);
	addSubmenuItem(vehicle, 12, menuItems);
	addSubmenuItem(vehicle, 1, menuItems);
	addSubmenuItem(vehicle, 2, menuItems);
	addSubmenuItem(vehicle, 11, menuItems);
	addSubmenuItem(vehicle, 4, menuItems);
	addSubmenuItem(vehicle, 6, menuItems);
	addSubmenuItem(vehicle, 7, menuItems);
	addSubmenuItem(vehicle, 10, menuItems);

	// Horns
	menuItems.push({ text: "Клаксоны" });
	// Headlights
	menuItems.push({ text: "Фары" });
	// NumberPlate
	menuItems.push({ text: "Номера" });
	// Color
	menuItems.push({ text: "Окраска" });

	addSubmenuItem(vehicle, 5, menuItems);
	addSubmenuItem(vehicle, 3, menuItems);
	addSubmenuItem(vehicle, 0, menuItems);
	addSubmenuItem(vehicle, 15, menuItems);
	addSubmenuItem(vehicle, 13, menuItems);

	// Turbo
	menuItems.push({ text: "Турбонаддув" });
	// Wheels
	menuItems.push({ text: "Колёса" });

	// WindowTint
	if (game.isThisModelACar(vehicle.model)) {
		menuItems.push({ text: "Стёкла" });
	}

	menuItems.push({text: "Выход"})

	alt.emit("selectMenu.setSpecialItems", "ls_customs_main", menuItems);
	alt.emit("selectMenu.show", "ls_customs_main");
}

const menuMap = new Map();

function addSubmenuItem(vehicle, modType, collection) {
	const mods = game.getNumVehicleMods(vehicle.scriptID, modType);

	if (mods <= 0) {
		return;
	}

	const text = getModSlotName(modType);

	if (!menuMap.has(text)) {
		menuMap.set(text, { modType });
	}

	collection.push({text});
}

let currentActiveMod;

const blockedModLabels = [ "WTD_V_COM_MG", "WT_V_AKU_MN" ];

function showConcreteMenu(modType) {
	if (checkPriceMenuItemIndex !== undefined) {
		return alt.emit("selectMenu.show", "ls_customs_concreteMod", checkPriceMenuItemIndex);
	}

	const vehicle = localPlayer.vehicle;

	currentActiveMod = game.getVehicleMod(vehicle.scriptID, modType);

	alt.emit("selectMenu.setHeader", "ls_customs_concreteMod", `LS Customs: ${getModSlotName(modType)}`);

	const modsCount = game.getNumVehicleMods(vehicle.scriptID, modType);
	const items = [];
	const stockValue = getStockValue(modType);
	let selectedIndex = 0;
	let itemIdx = 0;

	if(stockValue) {
		items.push({text: alt.helpers.string.escapeHtml(game.getLabelText(stockValue)), values: [getModPrice(modType, 0)]});
		itemIdx++;
	}

	for (let i = 0; i < modsCount; i++) {
		if (currentActiveMod === i) {
			selectedIndex = i + 1;
		}

		let label = game.getModTextLabel(vehicle.scriptID, modType, i);

		if (blockedModLabels.indexOf(label) >= 0) {
			continue;
		}

		if (typeof(label) !== "string" || label.length < 1) {
			label = getModLabel(modType, i);
		}

		items.push({text: alt.helpers.string.escapeHtml(game.getLabelText(label)), values: [getModPrice(modType, itemIdx++)]});
	}

	alt.emit("selectMenu.setSpecialItems", "ls_customs_concreteMod", items);
	alt.emit("selectMenu.show", "ls_customs_concreteMod", selectedIndex);
}

function showHeadlightsMenu() {
	if (checkPriceMenuItemIndex !== undefined) {
		return alt.emit("selectMenu.show", "ls_customs_headlights", checkPriceMenuItemIndex);
	}

	const vehicle = localPlayer.vehicle;

	currentModType = 22;
	isXenonEnabled = isVehicleToggleModOn(vehicle, 22);

	const items = [
		{ text: "Стандартные фары", values: [getModPrice(22, 0)] },
		{ text: "Ксеноновые фары", values: [getModPrice(22, 1)] }
	];

	alt.emit("selectMenu.setSpecialItems", "ls_customs_headlights", items);
	alt.emit("selectMenu.show", "ls_customs_headlights", isXenonEnabled ? 1 : 0);
	game.setVehicleLights(vehicle.scriptID, 2);
}

function showNeonPositionMenu() {
	if (checkPriceMenuItemIndex !== undefined) {
		return alt.emit("selectMenu.show", "ls_customs_neonPosition", checkPriceMenuItemIndex);
	}
	
	const vehicle = localPlayer.vehicle;

	currentModType = 200;
	neonLightStates = [];

	for (let i = 0; i < 4; i++) {
		if (!isVehicleNeonLightEnabled(vehicle, i)) {
			continue;
		}

		neonLightStates.push(i);
	}

	const items = [
		{ text: "Нет", values: [getModPrice(0, 0, "neonPosition")] },
		{ text: "Передний", values: [getModPrice(0, 1, "neonPosition")] },
		{ text: "Назад", values: [getModPrice(0, 2, "neonPosition")] },
		{ text: "По бокам", values: [getModPrice(0, 3, "neonPosition")] },
		{ text: "Спереди и сзади", values: [getModPrice(0, 4, "neonPosition")] },
		{ text: "Спереди и по бокам", values: [getModPrice(0, 5, "neonPosition")] },
		{ text: "Сзади и по бокам", values: [getModPrice(0, 6, "neonPosition")] },
		{ text: "Спереди, сзади и по бокам", values: [getModPrice(0, 7, "neonPosition")] },
	];

	alt.emit("selectMenu.setSpecialItems", "ls_customs_neonPosition", items);
	alt.emit("selectMenu.show", "ls_customs_neonPosition", getIndexByNeonValues(neonLightStates));
}

function showNeonColorMenu() {
	if (checkPriceMenuItemIndex !== undefined) {
		return alt.emit("selectMenu.show", "ls_customs_neonColor", checkPriceMenuItemIndex);
	}

	const colorObj = game.getVehicleNeonLightsColour(localPlayer.vehicle.scriptID, 0, 0, 0);

	currentModType = 201;
	currentNeonColor = [ colorObj.r, colorObj.g, colorObj.b ];

	const items = [];

	for(let i = 0; i < neonColorNames.length; i++) {
		items.push({ text: alt.helpers.string.escapeHtml(neonColorNames[i]), values: [ getModPrice(0, i, "neonColor") ] });
	}

	alt.emit("selectMenu.setSpecialItems", "ls_customs_neonColor", items);
	alt.emit("selectMenu.show", "ls_customs_neonColor", getNeonColorIndexByColor(colorObj.r, colorObj.g, colorObj.b));
}

function showHornsMenu() {
	if (checkPriceMenuItemIndex !== undefined) {
		return alt.emit("selectMenu.show", "ls_customs_hornsConcrete", checkPriceMenuItemIndex);
	}
	
	currentModType = 14;

	if (currentHornType === 0) {
		alt.emit("selectMenu.setHeader", "ls_customs_hornsConcrete", "Клаксоны: Стандартные");
	} else if (currentHornType === 1) {
		alt.emit("selectMenu.setHeader", "ls_customs_hornsConcrete", "Клаксоны: Музыкальные");
	} else {
		alt.emit("selectMenu.setHeader", "ls_customs_hornsConcrete", "Клаксоны: С повтором");
	}

	const items = [];
	const currentHorns = customsInfo.horns[currentHornType];
	let selectedIndex = 0;

	for (let i = 0; i < currentHorns.length; i++) {
		if (currentHorns[i].value === currentHornValue) {
			selectedIndex = i;
		}

		items.push({ text: currentHorns[i].label, values: [getModPrice(14, i)] });
	}

	alt.emit("selectMenu.setSpecialItems", "ls_customs_hornsConcrete", items);
	alt.emit("selectMenu.show", "ls_customs_hornsConcrete", selectedIndex);
}

function showNumberPlateMenu() {
	if (checkPriceMenuItemIndex !== undefined) {
		return alt.emit("selectMenu.show", "ls_customs_numberPlate", checkPriceMenuItemIndex);
	}
	
	const items = [];

	currentModType = 202;
	currentNumberPlateType = game.getVehicleNumberPlateTextIndex(localPlayer.vehicle.scriptID);

	for (let i = 0; i < numberPlateTypeValues.length; i++) {
		items.push({ text: numberPlateTypeValues[i], values: [ getModPrice(0, i, "numberPlateType") ] });
	}

	alt.emit("selectMenu.setSpecialItems", "ls_customs_numberPlate", items);
	alt.emit("selectMenu.show", "ls_customs_numberPlate", getNumberPlateIndexByValue(currentNumberPlateType));
}

function showConcreteColorMenu() {
	if (checkPriceMenuItemIndex !== undefined) {
		return alt.emit("selectMenu.show", "ls_customs_colorConcrete", checkPriceMenuItemIndex);
	}
	
	const color = game.getVehicleColours(localPlayer.vehicle.scriptID, 0, 0);

	currentModType = 203;
	currentPrimaryColor = color[1];
	currentSecondaryColor = color[2];

	const items = [];
	const colorGroup = customsInfo.colors[currentColorGroup];
	const price = getModPrice(0, currentColorGroup, "color");
	let selectedIndex = 0;
		
	for (let i = 0; i < colorGroup.length; i++) {
		if ((isCurrentColorPrimary && currentPrimaryColor === colorGroup[i].color) 
			|| (!isCurrentColorPrimary && currentSecondaryColor === colorGroup[i].color)) {
			selectedIndex = i;
		}

		items.push({
			text: game.getLabelText(colorGroup[i].text),
			values: [price]
		});
	}

	alt.emit("selectMenu.setSpecialItems", "ls_customs_colorConcrete", items);
	alt.emit("selectMenu.show", "ls_customs_colorConcrete", selectedIndex);

	if (currentColorGroup === 0) {
		if (isCurrentColorPrimary) {
			game.setVehicleColours(localPlayer.vehicle.scriptID, colorGroup[0].color, currentSecondaryColor);
		} else {
			game.setVehicleColours(localPlayer.vehicle.scriptID, currentPrimaryColor, colorGroup[0].color);
		}
	}
}

function showWheelsConcreteMenu() {
	if (checkPriceMenuItemIndex !== undefined) {
		return alt.emit("selectMenu.show", "ls_customs_wheels_concreteMenu", checkPriceMenuItemIndex);
	}
	
	const vehicle = localPlayer.vehicle;
	let selectedIndex = 0;
	const modsCount = game.getNumVehicleMods(vehicle.scriptID, currentWheelModType);
	const items = [ { text: game.getLabelText("CMOD_WHE_0") } ];
	const allValues = Array.range(modsCount);

	if (game.isThisModelACar(vehicle.model)) {
		currentWheelChunk = [-1, ...allValues.chunk(modsCount / 2)[currentWheelChunkIndex]];
	} else {
		const firstPart = allValues.chunk(13);
		const secondPart = allValues.slice(26).chunk(23);

		currentWheelChunk = [-1, ...firstPart[currentWheelChunkIndex], ...secondPart[currentWheelChunkIndex]];
	}

	currentModType = 204;
	currentWheelModIndex = game.getVehicleMod(vehicle.scriptID, currentWheelModType);

	let priceKey;
	let priceIndex;

	if (game.isThisModelACar(localPlayer.vehicle.model)) {
		priceKey = "carWheels";
		priceIndex = selectedWheelTypeIndex;
	} else {
		priceKey = "motoWheels";
		priceIndex = itemIndex;
	}

	const price = getModPrice(0, priceIndex, priceKey);

	for (let i = 1; i < currentWheelChunk.length; i++) {
		const value = currentWheelChunk[i];

		if (selectedWheelType === currentWheelType && currentWheelModIndex === value) {
			selectedIndex = i;
		}

		let label = game.getModTextLabel(vehicle.scriptID, currentWheelModType, value);

		items.push({text: game.getLabelText(label), values: [price]});
	}

	alt.emit("selectMenu.setSpecialItems", "ls_customs_wheels_concreteMenu", items);
	alt.emit("selectMenu.show", "ls_customs_wheels_concreteMenu", selectedIndex);
}

function showTurboMenu() {
	if (checkPriceMenuItemIndex !== undefined) {
		return alt.emit("selectMenu.show", "ls_customs_turbo", checkPriceMenuItemIndex);
	}
	
	currentModType = 18;

	const items = [
		{
			text: "Нет",
			values: [getModPrice(18, 0)]
		}, {
			text: "Турбо-тюнинг",
			values: [getModPrice(18, 1)]
		}
	];

	alt.emit("selectMenu.setSpecialItems", "ls_customs_turbo", items);
	alt.emit("selectMenu.show", "ls_customs_turbo", game.isToggleModOn(localPlayer.vehicle.scriptID, 18) ? 1 : 0);
}

function showWheelsColorMenu() {
	if (checkPriceMenuItemIndex !== undefined) {
		return alt.emit("selectMenu.show", "ls_customs_wheels_colors", checkPriceMenuItemIndex);
	}
	
	const vehicle = localPlayer.vehicle;
			
	if (isVehicleWheelsAreDefault(vehicle)) {
		alt.emit("BN_Show", game.getLabelText("CMOD_NOWHE"));
		return;
	}

	if (isVehicleWheelsAreChrome(vehicle)) {
		alt.emit("BN_Show", game.getLabelText("CMOD_CHRWHE"));
		return;
	}

	const { wheelColor } = game.getVehicleExtraColours(vehicle.scriptID, 0, 0);
	const items = [];
	let selectedIndex = 0;

	currentModType = 205;
	currentWheelColor = wheelColor;

	for (let i = 0; i < customsInfo.wheelColors.length; i++) {
		if (customsInfo.wheelColors[i] === currentWheelColor) {
			selectedIndex = i;
		}

		items.push({ text: game.getLabelText(`CMOD_COL5_${i}`), values: [getModPrice(0, i, "wheelColor")] });
	}

	alt.emit("selectMenu.setSpecialItems", "ls_customs_wheels_colors", items);
	alt.emit("selectMenu.show", "ls_customs_wheels_colors", selectedIndex);
}

function showTiresDesignMenu() {
	if (checkPriceMenuItemIndex !== undefined) {
		return alt.emit("selectMenu.show", "ls_customs_wheels_tiresDesign", checkPriceMenuItemIndex);
	}
	
	currentModType = 206;

	const items = [
		{ text: "Обычные покрышки", values: [getModPrice(0, 0, "tiresDesign")] },
		{ text: "Заказные покрышки", values: [getModPrice(0, 1, "tiresDesign")] }
	];

	alt.emit("selectMenu.setSpecialItems", "ls_customs_wheels_tiresDesign", items);
	alt.emit("selectMenu.show", "ls_customs_wheels_tiresDesign", game.getVehicleModVariation(localPlayer.vehicle.scriptID, 23) ? 1 : 0);
}

function showTiresUpgradeMenu() {
	if (checkPriceMenuItemIndex !== undefined) {
		return alt.emit("selectMenu.show", "ls_customs_wheels_tiresUpgrade", checkPriceMenuItemIndex);
	}
	
	currentModType = 207;

	const items = [
		{ text: "Пулестойкие покрышки", values: [getModPrice(0, 0, "tiresBurst")] }
	];

	alt.emit("selectMenu.setSpecialItems", "ls_customs_wheels_tiresUpgrade", items);
	alt.emit("selectMenu.show", "ls_customs_wheels_tiresUpgrade");
}

function showTiresSmokeColorMenu() {
	if (checkPriceMenuItemIndex !== undefined) {
		return alt.emit("selectMenu.show", "ls_customs_wheels_tiresSmokeColor", checkPriceMenuItemIndex);
	}
	
	const items = [];
	const { r, g, b } = game.getVehicleTyreSmokeColor(localPlayer.vehicle.scriptID, 0, 0, 0);
	let selectedIndex = 0;

	currentModType = 208;
	currentTiresSmokeColor = [ r, g, b ];

	for (let i = 0; i < customsInfo.tiresSmokeColors.length; i++) {
		const color = customsInfo.tiresSmokeColors[i];

		if (color[0] === r && color[1] === g && color[2] === b) {
			selectedIndex = i;
		}

		items.push({ text: game.getLabelText(color.text), values: [getModPrice(0, i, "tiresSmokeColor")] });
	}

	alt.emit("selectMenu.setSpecialItems", "ls_customs_wheels_tiresSmokeColor", items);
	alt.emit("selectMenu.show", "ls_customs_wheels_tiresSmokeColor", selectedIndex);
}

function showWindowTintMenu() {
	if (checkPriceMenuItemIndex !== undefined) {
		return alt.emit("selectMenu.show", "ls_customs_windows", checkPriceMenuItemIndex);
	}
	
	const items = [
		{ text: "Нет", values: [getModPrice(0, 0, "windowTint")] },
		{ text: "Слабое затемнение", values: [getModPrice(0, 1, "windowTint")] },
		{ text: "Среднее затемнение", values: [getModPrice(0, 2, "windowTint")] },
		{ text: "Лимузин", values: [getModPrice(0, 3, "windowTint")] }
	];

	currentModType = 209;

	alt.emit("selectMenu.setSpecialItems", "ls_customs_windows", items);
	alt.emit("selectMenu.show", "ls_customs_windows", getWindowTintIndexByValue(currentWindowTint));
}

function getModPrice(modType, index, subKey = "mods") {
	let price;

	if (subKey === "mods") {
		if (Array.isArray(customsInfo.prices[subKey][modType])) {
			price = customsInfo.prices[subKey][modType][index];
		} else if (typeof(customsInfo.prices[subKey][modType]) === "object") {
			price = customsInfo.prices[subKey][modType].base + (index * customsInfo.prices[subKey][modType].add);
		}
	} else {
		if (Array.isArray(customsInfo.prices[subKey])) {
			price = customsInfo.prices[subKey][index];
		} else if (typeof(customsInfo.prices[subKey]) === "object") {
			price = customsInfo.prices[subKey].base + (index * customsInfo.prices[subKey].add);
		}
	}

	return Math.round(price * vehiclePrice);
}

function getModSlotName(modType) {
	switch(modType) {
		case 0:
			return "Спойлеры";
		case 1:
			return "Передние бамперы";
		case 2:
			return "Задние бамперы";
		case 3:
			return "Пороги";
		case 4:
			return "Глушитель";
		case 5:
			return "Каркас безопасности";
		case 6:
			return "Решетки радиатора";
		case 7:
			return "Капот";
		case 10:
			return "Крыша";
		case 11:
			return "Двигатель";
		case 12:
			return "Тормоза";
		case 13:
			return "Трансмиссия";
		case 15: 
			return "Подвеска";
		case 16: 
			return "Броня";
		default:
			return "UNKNOWN";
	}
}

function getModLabel(modType, modIndex) {
	switch(modType) {
		case 3:
			return `CMOD_SKI_${modIndex + 1}`;
		case 11:
			return modIndex === 0 ? "collision_55wey9g" : `CMOD_ENG_${modIndex + 2}`;
		case 12:
			return `CMOD_BRA_${modIndex + 1}`;
		case 13:
			return `CMOD_GBX_${modIndex + 1}`;
		case 15:
			return modIndex === 3 ? "collision_84hts2y" : `CMOD_SUS_${modIndex + 1}`;
		case 16: 
			return `CMOD_ARM_${modIndex + 1}`;
	}
}

function getStockValue(modType) {
	switch (modType) {
		case 1:
			return "CMOD_BUM_0";
		case 2:
			return "CMOD_BUM_3";
		case 3:
			return "CMOD_SKI_0";
		case 4:
			return "CMOD_EXH_0";
		case 5:
			return "CMOD_DEF_RC";
		case 6:
			return "CMOD_GRL_0";
		case 7:
			return "CMOD_BON_0";
		case 10:
			return "CMOD_ROF_0";
		case 12:
			return "collision_9ld0k5x";
		case 13:
			return "collision_34vak0";
		case 15:
			return "CMOD_SUS_0";
		case 16: case 0:
			return "HO_NONE";
		default:
			return undefined;
	}
}

function showRepairMenu(price) {
	currentRepairPrice = price;

	const items = [
		{
			text: "Ремонт",
			values: [Math.round(price / 7 + vehiclePrice * 0.001)]
		},
		{ text: "Выход" }
	];

	alt.emit("selectMenu.setSpecialItems", "ls_customs_repair", items);
	alt.emit("selectMenu.show", "ls_customs_repair");
}

function setUiElementsState(state) {
	alt.emit("chat.enable", state);
	alt.emit("nametags::show", state);
	alt.emit("vehicle::engineToggleEnable", state);
}

function endOfTuning(isOccupant, forceEnd = false) {
	alt.emit(`Cursor::show`, false);
	
	setUiElementsState(true);
	//TODO: showSpecMenu(false);

	alt.emit(`inventory.enable`, true);
	alt.emit(`hudControl.enable`, true);

	const vehicle = localPlayer.vehicle;

	if (vehicle) game.setVehicleModKit(vehicle.scriptID, currentModKit);

	if (camera !== undefined) {
		alt.helpers.cameraRotator.stop();
		game.destroyCam(camera);
		camera = undefined;
	}

	game.renderScriptCams(false, false, 0, true, false);
	
	isControlsDisabled = false;

	if (lampObj !== undefined) {
		game.deleteObject(lampObj);
		lampObj = undefined;
	}

	if (!isOccupant) {
		alt.emit("selectMenu.hide");

		if (!forceEnd) {
			alt.emitServer("ls_customs::end");
		}

		if (invisibleVehicle !== undefined) {
			game.deleteVehicle(invisibleVehicle);
			invisibleVehicle = undefined;
		}
	}

	doorControl(true, -822900180, new alt.Vector3(110.594, 6628.001, 32.26));
	doorControl(true, -822900180, new alt.Vector3(1174.656, 2644.159, 40.50673));
}

function isVehicleToggleModOn(vehicle, modType) {
	const result = game.isToggleModOn(vehicle.scriptID, modType);

	return typeof (result) === "boolean" ? result : result === 1;
}

function isVehicleNeonLightEnabled(vehicle, index) {
	const result = game.isVehicleNeonLightEnabled(vehicle.scriptID, index);

	return typeof (result) === "boolean" ? result : result === 1;
}

function getNeonValuesByIndex(index) {
	switch (index) {
		case 0: // None
			return [];
		case 1: // Front
			return [ 2 ];
		case 2: // Back
			return [ 3 ];
		case 3: // Sides
			return [ 0, 1 ];
		case 4: // Front + Back
			return [ 2, 3 ];
		case 5: // Front + Sides
			return [ 0, 1, 2 ];
		case 6: // Back + Sides
			return [ 0, 1, 3 ];
		case 7: // All
			return [ 0, 1, 2, 3 ];
		default:
			return [];
	}
}

function getNeonValuesByIndexServer(index) {
	switch (index) {
		case 0: // None
			return { left: false, right: false, front: false, back: false };
		case 1: // Front
			return { left: false, right: false, front: true, back: false };
		case 2: // Back
			return { left: false, right: false, front: false, back: true };
		case 3: // Sides
			return { left: true, right: true, front: false, back: false };
		case 4: // Front + Back
			return { left: false, right: false, front: true, back: true };
		case 5: // Front + Sides
			return { left: true, right: true, front: true, back: false };
		case 6: // Back + Sides
			return { left: true, right: true, front: false, back: true };
		case 7: // All
			return { left: true, right: true, front: true, back: true };
		default:
			return { left: false, right: false, front: false, back: false };
	}
}

function getIndexByNeonValues(values) {
	if (values.length === 0) {
		return 0;
	} else if (values.length === 1) {
		return values.indexOf(2) >= 0 ? 1 : 2;
	} else if (values.length === 2) {
		return values.indexOf(0) >= 0 ? 3 : 4;
	} else if (values.length === 3) {
		return values.indexOf(2) >= 0 ? 5 : 6;
	}
	
	return 7;
}

function setNeonLight(vehicle, enabledValues) {
	for (let i = 0; i < 4; i++) {
		game.setVehicleNeonLightEnabled(vehicle.scriptID, i, enabledValues.indexOf(i) >= 0);
	}
}

function getNeonColorIndexByColor(r, g, b) {

	for (let i = 0; i < neonColors.length; i++) {
		const neonColor = neonColors[i];

		if (neonColor[0] === r && neonColor[1] === g && neonColor[2] === b) {
			return i;
		}
	}

	return 0;
}

function getNumberPlateIndexByValue(value) {
	switch (value) {
		case 3:
			return 0;
		case 0:
			return 1;
		case 4:
			return 2;
		case 2:
			return 3;
		case 1:
			return 4;
		default:
			return 0;
	}
}

function getNumberPlateValueByIndex(index) {
	switch (index) {
		case 0:
			return 3;
		case 1:
			return 0;
		case 2:
			return 4;
		case 3:
			return 2;
		case 4:
			return 1;
		default:
			return 3;
	}
}

function getWheelTypeIndexByValue(value) {
	switch (value)  {
		case 7:
			return 0;
		case 2:
			return 1;
		case 1:
			return 2;
		case 3:
			return 3;
		case 0:
			return 4;
		case 4:
			return 5;
		case 5:
			return 6;
		default:
			return 0;
	}
}

function getWheelTypeValueByIndex(index) {
	switch (index)  {
		case 0:
			return 7;
		case 1:
			return 2;
		case 2:
			return 1;
		case 3:
			return 3;
		case 4:
			return 0;
		case 5:
			return 4;
		case 6:
			return 5;
		default:
			return 7;
	}
}

function getWindowTintIndexByValue(value) {
	switch (value) {
		case 0:
			return 0;
		case 3:
			return 1;
		case 2:
			return 2;
		case 1:
			return 3;
		default:
			return 0;
	}
}

function getWindowTintValueByIndex(index) {
	switch (index) {
		case 0:
			return 0;
		case 1:
			return 3;
		case 2:
			return 2;
		case 3:
			return 1;
		default:
			return 0;
	}
}

function setVehicleWheel(vehicle, modType, modIndex, customTires = undefined) {
	if (typeof(customTires) !== "boolean") {
		customTires = game.getVehicleModVariation(vehicle.scriptID, 23);
	}

	setVehicleMod(vehicle, modType, modIndex, customTires);
}

function setVehicleWheelColor(vehicle, color) {
	const { pearlescentColor } = game.getVehicleExtraColours(vehicle.scriptID, 0, 0);

	game.setVehicleExtraColours(vehicle.scriptID, pearlescentColor, color);
}

function setVehicleTiresDesign(vehicle, isCustom) {
	for (let modType = 23; modType < 25; modType++) {
		const modIndex = game.getVehicleMod(vehicle.scriptID, modType);

		setVehicleMod(vehicle, modType, modIndex, isCustom);

		if (game.isThisModelACar(vehicle.model)) {
			break;
		}
	}
}

function setVehicleMod(vehicle, modType, modIndex, customTires = false) {
	game.setVehicleMod(vehicle.scriptID, modType, modIndex, customTires);
}

function isVehicleWheelsAreChrome(vehicle) {
	for (let modType = 23; modType < 25; modType++) {
		const modsCount = game.getNumVehicleMods(vehicle.scriptID, modType);
		const modIndex = game.getVehicleMod(vehicle.scriptID, modType);

		if (game.isThisModelACar(vehicle.model)) {
			if (modIndex >= modsCount / 2) {
				return true;
			}

			break;
		}

		if ((modIndex >= 13 && modIndex <= 25) || (modIndex >= 49 && modIndex <= 72)) {
			return true;
		}
	}

	return false;
}

function isVehicleWheelsAreDefault(vehicle) {
	for (let modType = 23; modType < 25; modType++) {
		const modsCount = game.getNumVehicleMods(vehicle.scriptID, modType);
		const modIndex = game.getVehicleMod(vehicle.scriptID, modType);

		if (modIndex < 0 || modIndex >= modsCount) {
			return true;
		}

		if (game.isThisModelACar(vehicle.model)) {
			break;
		}
	}

	return false;
}

Array.range = function(n) {
	return Array.apply(null, Array(n)).map((_x, i) => i);
}

Object.defineProperty(Array.prototype, "chunk", {
  value: function(n) {
    return Array.range(Math.ceil(this.length/n)).map((_x, i) => this.slice(i*n, i*n+n));
  }
});

function showSpecMenu(state) {
	if (state) {
		const characteristics = alt.helpers.vehicle.getVehicleCharacteristics(localPlayer.vehicle);

		//view.emit(`alt.emit('carSystem', {specMenu: [${characteristics.join(',')}], event: 'specMenu' })`);
	}

	//view.emit(`alt.emit('carSystem', {enable: ${state}, event: 'enable' })`);
}

function showModificationSetMessage(itemName) {
	alt.emit("BN_Show", `Модификация ~g~${itemName}~w~ успешно установлена`, true);
	game.playSoundFromEntity(-1, "MOD_SHOPS_UPGRADE_BLIP", localPlayer.vehicle.scriptID, 0, 0, 0)
	//TODO: showSpecMenu(true);
}

let checkPriceResolver;
let checkPriceMenuItemIndex;

function checkPrice(keyItem, modType, itemIndex = 0, repairPrice = undefined, currentIndex = 0) {
	alt.helpers.cameraRotator.pause(true);

	checkPriceMenuItemIndex = currentIndex;

	return new Promise((resolve, reject) => {
		if (checkPriceResolver) {
			return reject("CheckPrice is already requested");
		}

		alt.emit("selectMenu.hide");
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

		alt.emitServer("ls_customs::checkPrice", keyItem, modType, itemIndex, repairPrice);
	});
}

function clearPriceCheck(isSucces) {
	alt.clearTimeout(checkPriceResolver.timeout);
	checkPriceResolver = undefined;
	alt.helpers.loadingPrompt.hide();
	alt.helpers.cameraRotator.pause(false);

	if (currentModType !== -1) {
		if (currentModType === 22) {
			showHeadlightsMenu();
		} else if (currentModType === 200) {
			showNeonPositionMenu();
		} else if (currentModType === 201) {
			showNeonColorMenu();
		} else if (currentModType === 202) {
			showNumberPlateMenu();
		} else if (currentModType === 203) {
			showConcreteColorMenu();
		} else if (currentModType === 204) {
			showWheelsConcreteMenu();
		} else if (currentModType === 205) {
			showWheelsColorMenu();
		} else if (currentModType === 206) {
			showTiresDesignMenu();
		} else if (currentModType === 207) {
			showTiresUpgradeMenu();
		} else if (currentModType === 208) {
			showTiresSmokeColorMenu();
		} else if (currentModType === 209) {
			showWindowTintMenu();
		} else if (currentModType === 14) {
			showHornsMenu();
		} else if (currentModType === 18) {
			showTurboMenu();
		} else {
			showConcreteMenu(currentModType);
		}
	} else {
		showMenu(localPlayer.vehicle, false);
	}

	checkPriceMenuItemIndex = undefined;
}

alt.onServer("ls_customs::checkPriceResponse", (result) => {
	if(!checkPriceResolver || typeof(result) !== "boolean") {
		return;
	}

	if (isControlsDisabled) {
		checkPriceResolver.resolve(result);
	} else {
		checkPriceResolver.resolve(false);
	}
});
