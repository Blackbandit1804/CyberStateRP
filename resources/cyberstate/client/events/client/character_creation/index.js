import alt from 'alt';
import game from 'natives';

alt.on(`Client::init`, (view) => {
	alt.movingcam = { id: undefined };
	const localPlayer = alt.Player.local
	var changeCharacter = false;
	let basePosition;
	let camera;
	const bodyPartsInfo = {
		"full": { offset: 0, scale: 2.7 },
		"head": { offset: 0.6, scale: 1 },
		"body": { offset: 0.2, scale: 1.3 },
		"legs": { offset: -0.4, scale: 1.5 },
		"feet": { offset: -0.7, scale: 1 }
	}
	const info = {
		spawn: { position: new alt.Vector3(123.2, -229.06, 53.56), heading: 350 },
		mothers: [ 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 45 ],
		fathers: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 42, 44, 43 ],
		peds: [],
		headOverlaysMenu: [
			// Female
			[
				{ text: "Причёска" },
				{ text: "Брови" },
				{ text: "Дефекты кожи" },
				{ text: "Старение кожи" },
				{ text: "Тип кожи" },
				{ text: "Родинки и веснушки" },
				{ text: "Повреждения кожи" },
				{ text: "Цвет глаз" },
				{ text: "Макияж глаз" },
				{ text: "Румяна" },
				{ text: "Помада" },
			],
			// Male
			[
				{ text: "Причёска" },
				{ text: "Брови" },
				{ text: "Волосы на лице" },
				{ text: "Дефекты кожи" },
				{ text: "Старение кожи" },
				{ text: "Тип кожи" },
				{ text: "Родинки и веснушки" },
				{ text: "Повреждения кожи" },
				{ text: "Цвет глаз" },
				{ text: "Макияж глаз" },
				{ text: "Помада" },
			]
		],
		clothesMenu: [
			// Female
			[
				{ text: "Торс", values: [ "Майка", "Футболка", "Рубашка", "Кофта" ] },
				{ text: "Ноги", values: [ "Джинсы", "Брюки", "Юбка", "Шорты" ] },
				{ text: "Обувь", values: [ "Кроссовки", "Сланцы", "Туфли" ] }
			],
			// Male
			[
				{ text: "Торс", values: [ "Футболка", "Свитшот", "Рубашка", "Майка" ] },
				{ text: "Ноги", values: [ "Джинсы", "Шорты", "Штаны" ] },
				{ text: "Обувь", values: [ "Кроссовки", "Сланцы" ] }
			]
		],
		values: {
			hair: [
				// Female
				[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23 ],
				// Male
				[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22 ]
			],
			eyeColors: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
			headOverlays: [
				// Female
				[ 2, 0, 3, 6, 9, 7, 4, 5, 8 ],
				// Male
				[ 2, 1, 0, 3, 6, 9, 7, 4, 8 ]
			],
			headOverlaysLabels: {
				0: [ "Нет", "Краснуха", "Корь", "Пятна", "Сыпь", "Угри", "Налет", "Гнойники", "Прыщики", "Большие прыщи", "Прыщи", "Сыпь на щеках", "Сыпь на лице", "Расковырянные прыщи", "Пубертат", "Язва", "Сыпь на подбородке", "С двумя лицами", "Зона Т", "Сальная кожа", "Шрамы", "Шрамы от прыщей", "Шрамы от больших прыщей", "Герпес", "Лишай" ],
				3: [ "Нет", "Морщины в углах глаз", "Первые признаки старения", "Средний возраст", "Морщины", "Депрессия", "Преклонный возраст", "Старость", "Обветренная кожа", "Морщинистая кожа", "Обвисшая кожа", "Тяжелая жизнь", "Винтаж", "Пенсионный возраст", "Наркомания", "Престарелость" ],
				6: [ "Нет", "Румянец", "Раздражение от щетины", "Покраснение", "Солнечный ожог", "Синяки", "Алкоголизм", "Пятна", "Тотем", "Кровеносные сосуды", "Повреждения", "Бледная", "Мертвенно-бледная" ],
				7: [ "Нет", "Неровная", "Наждак", "Пятнистая", "Грубая", "Жёсткая", "Шероховатая", "Загрубелая", "Неровная", "Со складками", "Потрескавшаяся", "Твёрдая" ],
				9: [ "Нет", "Ангелочек", "Повсюду", "Местами", "Единичные", "На переносице", "Куколка", "Фея", "Загорелая", "Родинки", "Ряд", "Как у модели", "Редкие", "Веснушки", "Капельки дождя", "Удвоенность", "С одной стороны", "Пары", "Бородавки" ]
			},
			makeups: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 32, 34, 35, 36, 37, 38, 39, 40, 41 ],
			blushes: [ 0, 1, 2, 3, 4, 5, 6 ],
			hairColors: [],
			lipstickColors: [],
			makeupColors: [],
			clothes: [
				// Female
				[
					[ // Торс
						{ drawable: 16, texture: 2, torso: 15 },
						{ drawable: 23, texture: 1, torso: 4 },
						{ drawable: 9, texture: 9, torso: 0 },
						{ drawable: 3, texture: 1, torso: 3 }
					],
					[ // Ноги
						{ drawable: 1, texture: 4 },
						{ drawable: 37, texture: 0 },
						{ drawable: 36, texture: 2 },
						{ drawable: 16, texture: 4 }
					],
					[ // Обувь
						{ drawable: 3, texture: 0 },
						{ drawable: 16, texture: 6 },
						{ drawable: 6, texture: 0 }
					]
				],
				// Male
				[
					[ // Торс
						{ drawable: 1, texture: 1, torso: 0 },
						{ drawable: 8, texture: 14, torso: 8 },
						{ drawable: 12, texture: 5, torso: 12 },
						{ drawable: 5, texture: 2, torso: 5 }
					],
					[ // Ноги
						{ drawable: 1, texture: 1 },
						{ drawable: 15, texture: 3 },
						{ drawable: 5, texture: 4 }
					],
					[ // Обувь
						{ drawable: 1, texture: 2 },
						{ drawable: 16, texture: 10 }
					]
				]
			],
		}
	};

	const editData = {};

	let currentAppearanceItem;
	let isPedRotationEnabled = false;

	const Keys = {
		PageUp: 0x21,
		PageDown: 0x22,
		Q: 0x51,
		E: 0x45
	};

	function resetEditData() {
		editData.selectedGender = 0
		editData.fatherIndex = 0;
		editData.motherIndex = 0;
		editData.shapeMix = 0.5;
		editData.skinMix = 0.5;
		editData.faceFeatures = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
		editData.appearance = {
			hairIndex: [
				// Female
				4,
				// Male
				4
			],
			hairColorIndex: 0,
			eyeColorIndex: 0,
			headOverlays: {}
		};

		for (let i = 0; i < 10; i++) {
			editData.appearance.headOverlays[i] = { value: i === 2 ? 1 : 255, opacity: 1, colorIndex: isHeadOverlayHasColor(i) ? 0 : -1 }
		}

		editData.clothes = [];

		for (let i = 0; i < 2; i++) {
			editData.clothes[i] = {
				topIndex: 0,
				legsIndex: 0,
				shoesIndex: 0
			};
		}
	}

	alt.on("update", () => {
		if (!isPedRotationEnabled) {
			return;
		}

		handlePedRotation();
	});

	view.on("regCharacter", (characterName) => {
		const clothes = info.values.clothes[editData.selectedGender];
		const pedClothes = editData.clothes[editData.selectedGender];
		const data = {
			characterName,
			gender: editData.selectedGender,
			father: info.fathers[editData.fatherIndex],
			mother: info.mothers[editData.motherIndex],
			shapeMix: editData.shapeMix,
			skinMix: editData.skinMix,
			faceFeatures: editData.faceFeatures.map((faceFeature) => Math.round(faceFeature*100)/100),
			appearance: {
				hair: info.values.hair[editData.selectedGender][editData.appearance.hairIndex[editData.selectedGender]],
				hairColor: info.values.hairColors[editData.appearance.hairColorIndex],
				eyeColor: info.values.eyeColors[editData.appearance.eyeColorIndex],
				headOverlays: info.values.headOverlays[editData.selectedGender].map((headOverlayId) => {
					const headOverlay = editData.appearance.headOverlays[headOverlayId];
					const color = headOverlay.colorIndex === -1 ? 0 : getHeadOverlayColors(headOverlayId)[headOverlay.colorIndex];

					return { id: headOverlayId, value: headOverlay.value, opacity: headOverlay.opacity, color };
				})
			},
			clothes: {
				top: clothes[0][pedClothes.topIndex],
				legs: clothes[1][pedClothes.legsIndex],
				shoes: clothes[2][pedClothes.shoesIndex],
			},
			skills: localPlayer.skills || [2, 2, 2, 2, 2, 2, 2]
		};

		alt.emitServer("regCharacter", JSON.stringify(data));
	});

	alt.on("changeCharacter", () => {
		const data = {
			gender: editData.selectedGender,
			father: info.fathers[editData.fatherIndex],
			mother: info.mothers[editData.motherIndex],
			shapeMix: editData.shapeMix,
			skinMix: editData.skinMix,
			faceFeatures: editData.faceFeatures.map((faceFeature) => Math.round(faceFeature*100)/100),
			appearance: {
				hair: info.values.hair[editData.selectedGender][editData.appearance.hairIndex[editData.selectedGender]],
				hairColor: info.values.hairColors[editData.appearance.hairColorIndex],
				eyeColor: info.values.eyeColors[editData.appearance.eyeColorIndex],
				headOverlays: info.values.headOverlays[editData.selectedGender].map((headOverlayId) => {
					const headOverlay = editData.appearance.headOverlays[headOverlayId];
					const color = headOverlay.colorIndex === -1 ? 0 : getHeadOverlayColors(headOverlayId)[headOverlay.colorIndex];

					return { id: headOverlayId, value: headOverlay.value, opacity: headOverlay.opacity, color };
				})
			},
			skills: localPlayer.skills || [2, 2, 2, 2, 2, 2, 2]
		};

		alt.emitServer("changeCharacter", JSON.stringify(data));
	});

	alt.onServer("character_creation::init", async () => {
		if (info.values.hairColors.length === 0) initColors();
		basePosition = new alt.Vector3(info.spawn.position.x, info.spawn.position.y, info.spawn.position.z);
		resetEditData();
		game.setEntityCoords(game.playerPedId(), basePosition.x, basePosition.y, basePosition.z);
		game.setEntityVisible(game.playerPedId(), false, false);
		game.setEntityHeading(localPlayer.scriptID, info.spawn.heading);
		alt.emit("setFreeze", game.playerPedId(), true);
		
		editData.selectedGender = 0;
		alt.helpers.instructionButtonsDrawler.init();
		game.requestAdditionalText("HAR_MNU", 9);

		view.emit("hideEnterAccount");
		view.emit(`initNewCharacter`);

		setupCamera();
		alt.emit("effect", "MP_job_load", 1);

		await initPeds();
		toggleGender();

		alt.emit(`Cursor::show`, false);
		alt.emit("selectMenu.show", "character_main");
	});


	alt.onServer("character_change::init", async () => {
		if (info.values.hairColors.length === 0) initColors();
		basePosition = new alt.Vector3(info.spawn.position.x, info.spawn.position.y, info.spawn.position.z);
		resetEditData();
		game.setEntityCoords(game.playerPedId(), basePosition.x, basePosition.y, basePosition.z);
		game.setEntityVisible(game.playerPedId(), false, false);
		game.setEntityHeading(localPlayer.scriptID, info.spawn.heading);
		alt.emit("setFreeze", game.playerPedId(), true);
		
		editData.selectedGender = 0;
		alt.helpers.instructionButtonsDrawler.init();
		game.requestAdditionalText("HAR_MNU", 9);

		changeCharacter = true;

		setupCamera();
		alt.emit("effect", "MP_job_load", 1);

		await initPeds();
		toggleGender();

		alt.emit(`Cursor::show`, false);
		alt.emit("selectMenu.show", "character_change");
	});

	alt.onServer("character_creation::continue", () => {
		backToMainMenu(7);
	});

	alt.onServer("character_creation::stop", () => {
		game.setEntityVisible(game.playerPedId(), true, false);
		alt.helpers.instructionButtonsDrawler.dispose();
		alt.emit(`Cursor::show`, true);
		for (const ped of info.peds) game.deletePed(ped);
	});

	alt.on(`disconnect`, () => {
		for (const ped of info.peds) game.deletePed(ped);

		for (var key in alt.peds) {
			game.deletePed(alt.peds[key].id);
			delete alt.peds[key];
		}

		game.destroyAllCams(true);
		game.renderScriptCams(false, false, 0, false, false);
	});

	alt.onServer("character_change::stop", () => {
		game.setEntityVisible(game.playerPedId(), true, false);
		alt.helpers.instructionButtonsDrawler.dispose();
		game.setEntityCoords(game.playerPedId(), localPlayer.lastPos.x, localPlayer.lastPos.y, localPlayer.lastPos.z);
		delete localPlayer.lastPos;

		if (changeCharacter) changeCharacter = false;

		game.playSoundFrontend(-1, "Start", "DLC_HEIST_HACKING_SNAKE_SOUNDS", true);
		game.renderScriptCams(false, false, 0, false, false);
		alt.emit("setFreeze", game.playerPedId(), false);

		for (const ped of info.peds) game.deletePed(ped);
	});
									
	view.on("selectMenu.itemSelected", (menuName, itemName, itemValue, itemIndex) => {
		if (menuName === "character_main" || menuName === "character_change") {
			if (itemName === "Наследственность") {
				alt.emit("selectMenu.show", "character_parents");
				showCharacterSkills();
				moveCameraToBodyPart("head");
			} else if (itemName === "Характеристики") {
				alt.emit("selectMenu.show", "character_faceFeatures");
				moveCameraToBodyPart("head");
				showRotateButtons();
			} else if (itemName === "Внешний вид") {
				const items = [...info.headOverlaysMenu[editData.selectedGender], { text: "Вернуться" }];

				mapHeadOverlayItems(items);

				currentAppearanceItem = items[0].text;

				alt.emit("selectMenu.setSpecialItems", "character_look", items);
				alt.emit("selectMenu.show", "character_look");
				moveCameraToBodyPart("head");
				showButtons(true, true);
			} else if (itemName === "Одежда" && menuName != "character_change") {
				const items = [...info.clothesMenu[editData.selectedGender], { text: "Вернуться" }];
				const clothes = editData.clothes[editData.selectedGender];

				items[0].valueIndex = clothes.topIndex;
				items[1].valueIndex = clothes.legsIndex;
				items[2].valueIndex = clothes.shoesIndex;

				alt.emit("selectMenu.setSpecialItems", "character_clothes", items);
				alt.emit("selectMenu.show", "character_clothes");
				moveCameraToBodyPart("body");
			} else if (itemName === "Изменить" && menuName == "character_change") {
				alt.emit("selectMenu.hide");
				alt.emit("changeCharacter");
			} else if (itemName === "Далее" && menuName == "character_main") {
				alt.emit("selectMenu.hide");
				view.emit(`regCharacterHandler`);
			}
		} else if (menuName === "character_parents") {
			if (itemName === "Вернуться") {
				backToMainMenu(3);
			}
		} else if (menuName === "character_faceFeatures") {
			if (itemName === "Вернуться") {
				backToMainMenu(4);
			}
		} else if (menuName === "character_look") {
			if (itemName === "Вернуться") {
				backToMainMenu(5);
			}
		} else if (menuName === "character_clothes") {
			if (itemName === "Вернуться") {
				backToMainMenu(6);
			}
		}
	});

	view.on("selectMenu.itemFocusChanged", (menuName, itemName, itemValue, itemIndex, valueIndex) => {
		if (menuName === "character_look") {
			currentAppearanceItem = itemName;
			showButtons(true, ...getButtonsState(itemName));
		} else if (menuName === "character_clothes") {
			if (itemName === "Торс") {
				moveCameraToBodyPart("body");
			} else if (itemName === "Ноги") {
				moveCameraToBodyPart("legs");
			} else if (itemName === "Обувь") {
				moveCameraToBodyPart("feet");
			}
		}
	});

	view.on("selectMenu.backspacePressed", (menuName) => {
		if (menuName === "character_parents") {
			backToMainMenu(3);
		} else if (menuName === "character_faceFeatures") {
			backToMainMenu(4);
		} else if (menuName === "character_look") {
			backToMainMenu(5);
		} else if (menuName === "character_clothes") {
			backToMainMenu(6);
		}
	});

	view.on("selectMenu.itemValueChanged", (menuName, itemName, itemValue, itemIndex, valueIndex) => {
		if (menuName === "character_main" || menuName === "character_change") {
			if (itemName === "Пол") {
				toggleGender();
			}
		} else if (menuName === "character_parents") {
			if (itemName === "Мама") {
				editData.motherIndex = valueIndex;

				setPedsCurrentHeadBlendData();
				view.emit(`selectMenu.setMotherImage`, valueIndex);
				showCharacterSkills();
			} else if (itemName === "Папа") {
				editData.fatherIndex = valueIndex;

				setPedsCurrentHeadBlendData();
				view.emit(`selectMenu.setFatherImage`, valueIndex);
				showCharacterSkills();
			} else if (itemName === "Сходство") {
				editData.shapeMix = (valueIndex * 2) / 100;

				setPedsCurrentHeadBlendData();
				showCharacterSkills();
			} else if (itemName === "Цвет кожи") {
				editData.skinMix = (valueIndex * 2) / 100;

				setPedsCurrentHeadBlendData();
				showCharacterSkills();
			}
		} else if (menuName === "character_faceFeatures") {
			const value = valueIndex * 0.02 - 1;

			editData.faceFeatures[itemIndex] = value;
			setPedsFaceFeature(itemIndex, value);
		} else if (menuName === "character_look") {
			if (itemName === "Причёска") {
				editData.appearance.hairIndex[editData.selectedGender] = valueIndex;

				setPedCurrentHair();
			} else if (itemName === "Цвет глаз") {
				editData.appearance.eyeColorIndex = valueIndex;

				setPedsCurrentEyeColor();
			} else {
				const headOverlayId = getHeadOverlayIdByItemName(itemName);
				let value = valueIndex === 0 ? 255 : valueIndex - 1;

				if (valueIndex > 0) {
					if (headOverlayId === 4) {
						value = info.values.makeups[valueIndex - 1];
					} else if (headOverlayId === 5) {
						value = info.values.blushes[valueIndex - 1];
					}
				}

				editData.appearance.headOverlays[headOverlayId].value = value;

				setPedsCurrentHeadOverlay(headOverlayId);
			}
		} else if (menuName === "character_clothes") {
			if (itemName === "Торс") {
				editData.clothes[editData.selectedGender].topIndex = valueIndex;
			} else if (itemName === "Ноги") {
				editData.clothes[editData.selectedGender].legsIndex = valueIndex;
			} else if (itemName === "Обувь") {
				editData.clothes[editData.selectedGender].shoesIndex = valueIndex;
			}

			setPedCurrentClothes(editData.selectedGender);
		}
	});

	// E
	alt.on('keydown', (key) => {
		if (key === Keys.E) {
			if (editData.length >= 1) onKeyPressed(Keys.E);
		} else if (key === Keys.Q) {
			if (editData.length >= 1) onKeyPressed(Keys.Q);
		} else if (key === Keys.PageUp) {
			onKeyPressed(Keys.PageUp);
		}else if (key === Keys.PageDown) {
			onKeyPressed(Keys.PageDown);
		}
	});

	function onKeyPressed(key) {
		const [ isColorShowed, isOpacityShowed ] = getButtonsState(currentAppearanceItem);

		if (!alt.helpers.instructionButtonsDrawler.isActive || (!isColorShowed && !isOpacityShowed)) {
			return;
		}

		if ((key === Keys.PageDown || key === Keys.PageUp) && isColorShowed) {
			const addValue = key === Keys.PageDown ? -1 : 1;

			if (currentAppearanceItem === "Причёска") {
				editData.appearance.hairColorIndex = getNextValidValue(info.values.hairColors, editData.appearance.hairColorIndex, addValue);

				setPedsCurrentHairColor();
			} else {
				const headOverlayId = getHeadOverlayIdByItemName(currentAppearanceItem);
				const colors = getHeadOverlayColors(headOverlayId);

				if (editData.appearance.headOverlays[headOverlayId].colorIndex === -1) {
					return;
				}

				editData.appearance.headOverlays[headOverlayId].colorIndex = getNextValidValue(colors, editData.appearance.headOverlays[headOverlayId].colorIndex, addValue);

				setPedsCurrentHeadOverlayColor(headOverlayId);
			}
		} else if((key === Keys.Q || key === Keys.E) && isOpacityShowed) {
			const headOverlayId = getHeadOverlayIdByItemName(currentAppearanceItem);

			editData.appearance.headOverlays[headOverlayId].opacity += key === Keys.Q ? -0.05 : 0.05;

			if (editData.appearance.headOverlays[headOverlayId].opacity > 1) {
				editData.appearance.headOverlays[headOverlayId].opacity = 1;
			} else if (editData.appearance.headOverlays[headOverlayId].opacity < 0) {
				editData.appearance.headOverlays[headOverlayId].opacity = 0;
			}

			setPedsCurrentHeadOverlay(headOverlayId);

		}
	}

	alt.on(`finishMoveCam`, () => {
		if (!alt.movingcam) return;
		game.setCamActive(alt.movingcam.id, false);
		alt.movingcam.startmove = false;
		game.renderScriptCams(false, false, 0, false, false);
		localPlayer.isFreeze = false;
		alt.drawDescription = false;
		alt.finilDescription = true;
		alt.setTimeout(() => {
			alt.finilDescription = false;
		}, 5000);
	});

	function backToMainMenu(itemIndex = 0) {
		if (isPedRotationEnabled) {
			isPedRotationEnabled = false;
			setPedsHeading(info.spawn.heading);
		}

		showButtons(false);

		if (changeCharacter) alt.emit(`selectMenu.show`, "character_change", itemIndex - 3);
		else alt.emit(`selectMenu.show`, "character_main", itemIndex);

		view.emit(`infoTable`);
		moveCameraToBodyPart("full");
	}

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

	async function initPeds() {
		info.peds = [];

		for (let i = 0; i < 2; i++) {
			const model = game.getHashKey(i === 1 ? "MP_M_Freemode_01" : "MP_F_Freemode_01");
			await loadModelAsync(model);
			const ped = await alt.helpers.ped.createPed(0, model, info.spawn.position, info.spawn.heading);

			game.freezeEntityPosition(ped, true);
			game.setEntityCollision(ped, false, false);
			game.setEntityVisible(ped, false, false);

			info.peds.push(ped);
		}

		setPedsCurrentClothes();
		setPedsCurrentHair();
		setPedsCurrentHairColor();
		setPedsCurrentHeadBlendData();
		setPedsCurrentFaceFeatures();
		setPedsCurrentEyeColor();
		setPedsCurrentHeadOverlays();
		setPedsCurrentHeadOverlaysColors();
	}

	function toggleGender() {
		const previousPed = getCurrentPed();

		editData.selectedGender = editData.selectedGender === 1 ? 0 : 1;

		const currentPed = getCurrentPed();

		game.setEntityVisible(previousPed, false, false);
		game.setEntityVisible(currentPed, true, false);
	}

	function setPedsCurrentClothes() {
		for (let i = 0; i < 2; i++) {
			setPedCurrentClothes(i);
		}
	}

	function setPedCurrentClothes(pedIndex) {
		const ped = info.peds[pedIndex];
		const clothes = info.values.clothes[pedIndex];
		const pedClothes = editData.clothes[pedIndex];
		const top = clothes[0][pedClothes.topIndex];
		const legs = clothes[1][pedClothes.legsIndex];
		const shoes = clothes[2][pedClothes.shoesIndex];
			
		game.setPedComponentVariation(ped, 3, top.torso, 0, 0);
		game.setPedComponentVariation(ped, 4, legs.drawable, legs.texture, 0);
		game.setPedComponentVariation(ped, 6, shoes.drawable, shoes.texture, 0);
		game.setPedComponentVariation(ped, 8, pedIndex === 0 ? 14 : 15, 0, 0);
		game.setPedComponentVariation(ped, 11, top.drawable, top.texture, 0);
	}

	function getCurrentPed() {
		return info.peds[editData.selectedGender];
	}

	function setPedsCurrentHeadBlendData() {
		const mother = info.mothers[editData.motherIndex];
		const father = info.fathers[editData.fatherIndex];

		for (const ped of info.peds) {
			game.setPedHeadBlendData(ped, mother, father, 0, mother, father, 0, editData.shapeMix, editData.skinMix, 0, false);
		}
	}

	function setPedsCurrentHairColor() {
		const color = info.values.hairColors[editData.appearance.hairColorIndex];

		for (const ped of info.peds) {
			game.setPedHairColor(ped, color, color);
		}
	}

	function setPedsCurrentFaceFeatures() {
		for (let i = 0; i < editData.faceFeatures.length; i++) {
			setPedsFaceFeature(i, editData.faceFeatures[i]);
		}
	}

	function setPedsFaceFeature(index, value) {
		for (const ped of info.peds) {
			game.setPedFaceFeature(ped, index, value);
		}
	}

	function setPedsCurrentHair() {
		for (let i = 0; i < 2; i++) {
			const ped = info.peds[i];
			const hairs = info.values.hair[i];
			const currentHairIndex = editData.appearance.hairIndex[i];

			game.setPedComponentVariation(ped, 2, hairs[currentHairIndex], game.getPedTextureVariation(ped, 2), 2);
		}	
	}

	function setPedCurrentHair() {
		const ped = info.peds[editData.selectedGender];
		const hairs = info.values.hair[editData.selectedGender];
		const currentHairIndex = editData.appearance.hairIndex[editData.selectedGender];

		game.setPedComponentVariation(ped, 2, hairs[currentHairIndex], game.getPedTextureVariation(ped, 2), 2);
	}

	function setPedsCurrentEyeColor() {
		for (const ped of info.peds) {
			game.setPedEyeColor(ped, info.values.eyeColors[editData.appearance.eyeColorIndex]);
		}
	}

	function setPedsCurrentHeadOverlays() {
		for (let i = 0; i < info.peds.length; i++) {
			const ped = info.peds[i];

			for (const headOverlayId of info.values.headOverlays[i]) {
				const headOverlay = editData.appearance.headOverlays[headOverlayId];

				game.setPedHeadOverlay(ped, headOverlayId, headOverlay.value, headOverlay.opacity);
			}
		}
	}

	function setPedsCurrentHeadOverlay(headOverlayId) {
		for (let i = 0; i < info.peds.length; i++) {
			if (info.values.headOverlays[i].indexOf(headOverlayId) < 0) {
				continue;
			}

			const ped = info.peds[i];
			const headOverlay = editData.appearance.headOverlays[headOverlayId];

			game.setPedHeadOverlay(ped, headOverlayId, headOverlay.value, headOverlay.opacity);
		}
	}

	function setPedsCurrentHeadOverlaysColors() {
		for (let i = 0; i < info.peds.length; i++) {
			const ped = info.peds[i];

			for (const headOverlayId of info.values.headOverlays[i]) {
				const headOverlay = editData.appearance.headOverlays[headOverlayId];

				if (headOverlay.colorIndex === -1) {
					continue;
				}

				const color = getHeadOverlayColors(headOverlayId)[headOverlay.colorIndex];

				game.setPedHeadOverlayColor(ped, headOverlayId, getHeadOverlayColorType(headOverlayId), color, color);
			}
		}
	}

	function setupCamera() {
		const cameraLookAt = game.getOffsetFromEntityInWorldCoords(localPlayer.scriptID, 0, 0, 0);
		camera = alt.helpers.camera.new("DEFAULT_SCRIPTED_CAMERA");
		game.setCamCoord(camera._camera, getPositionByBodyPart("full").x, getPositionByBodyPart("full").y, getPositionByBodyPart("full").z);
		game.setCamFov(camera._camera, 47);
		game.setCamActive(camera._camera, true);
		game.pointCamAtCoord(camera._camera, cameraLookAt.x, cameraLookAt.y, cameraLookAt.z);
		alt.helpers.camera.renderCams(true);
	}

	function getPositionByBodyPart(bodyPart) {
		const bodyPartInfo = bodyPartsInfo[bodyPart];
		const cameraPos = game.getOffsetFromEntityInWorldCoords(localPlayer.scriptID, 0, bodyPartInfo.scale, bodyPartInfo.offset);

		return cameraPos;
	}

	function getPositionByBodyPartlookAt(bodyPart) {
		const bodyPartInfo = bodyPartsInfo[bodyPart];
		const lookAt = game.getOffsetFromEntityInWorldCoords(localPlayer.scriptID, 0, 0, bodyPartInfo.offset);

		return lookAt;
	}
	
	function moveCameraToBodyPart(bodyPart) {
		const position = getPositionByBodyPart(bodyPart);
		const lookAt = getPositionByBodyPartlookAt(bodyPart);
		game.setCamCoord(camera._camera, position.x, position.y, position.z);
		game.pointCamAtCoord(camera._camera, lookAt.x, lookAt.y, lookAt.z);
		//TODO: camera.moveToPoint(position, undefined, 1000);
	}

	function setPedsCurrentHeadOverlayColor(headOverlayId) {
		for (let i = 0; i < info.peds.length; i++) {
			if (info.values.headOverlays[i].indexOf(headOverlayId) < 0) {
				continue;
			}

			const ped = info.peds[i];
			const headOverlay = editData.appearance.headOverlays[headOverlayId];

			if (headOverlay.colorIndex === -1) {
				continue;
			}

			const color = getHeadOverlayColors(headOverlayId)[headOverlay.colorIndex];

			game.setPedHeadOverlayColor(ped, headOverlayId, getHeadOverlayColorType(headOverlayId), color, color);
		}
	}

	function showCharacterSkills() {
		alt.emit("showCharacterSkills", editData.fatherIndex, editData.motherIndex);
	}

	function mapHeadOverlayItems(items) {
		items.map((item) => {
			if (item.text === "Вернуться") {
				return item;
			}

			if (item.text === "Причёска") {
				const labelTemplate = `CC_${(editData.selectedGender === 1 ? "M" : "F")}_HS_`;
				const currentHairIndex = editData.appearance.hairIndex[editData.selectedGender];
				let selectedIndex = 0;

				item.values = [];

				for (let i = 0; i < info.values.hair[editData.selectedGender].length; i++) {
					const hairValue = info.values.hair[editData.selectedGender][i];

					if (i === currentHairIndex) {
						selectedIndex = i;
					}

					const label = game.getLabelText(labelTemplate + hairValue.toString());

					item.values.push(alt.helpers.string.escapeHtml(label));
				}

				item.valueIndex = selectedIndex;
			} else if (item.text === "Цвет глаз") {
				let selectedIndex = 0;

				item.values = [];

				for (let i = 0; i < info.values.eyeColors.length; i++) {
					if (i === editData.appearance.eyeColorIndex) {
						selectedIndex = i;
					}

					const label = game.getLabelText(`FACE_E_C_${info.values.eyeColors[i]}`);

					item.values.push(alt.helpers.string.escapeHtml(label));
				}

				item.valueIndex = selectedIndex;
			} else {
				const headOverlayId = getHeadOverlayIdByItemName(item.text);
				const itemsCount = getHeadOverlayItemsCount(headOverlayId);
				const currentHeadOverlay = editData.appearance.headOverlays[headOverlayId];
				let selectedIndex = 0;

				item.values = [ ];

				for (let i = 0; i <= itemsCount; i++) {
					if (currentHeadOverlay.value === i - 1) {
						selectedIndex = i;
					}

					const label = getHeadOverlayLabel(headOverlayId, i);
					const text = info.values.headOverlaysLabels[headOverlayId] ? label : game.getLabelText(label);
					
					item.values.push(alt.helpers.string.escapeHtml(text));
				}

				item.valueIndex = selectedIndex;
			}

			return item;
		});
	}

	function getHeadOverlayItemsCount(headOverlayId) {
		if (headOverlayId === 4) {
			return info.values.makeups.length;
		} else if (headOverlayId === 5) {
			return info.values.blushes.length;
		}

		return game.getPedHeadOverlayNum(headOverlayId);
	}

	function isHeadOverlayHasColor(headOverlayId) {
		return headOverlayId === 1 || headOverlayId === 2 || headOverlayId === 5 || headOverlayId === 8;
	}

	function getHeadOverlayIdByItemName(name) {
		switch (name) {
			case "Брови":
				return 2;
			case "Волосы на лице":
				return 1;
			case "Дефекты кожи":
				return 0;
			case "Старение кожи":
				return 3;
			case "Тип кожи":
				return 6;
			case "Родинки и веснушки":
				return 9;
			case "Повреждения кожи":
				return 7;
			case "Макияж глаз":
				return 4;
			case "Румяна":
				return 5;
			case "Помада":
				return 8;
		}
	}

	function getHeadOverlayLabel(headOverlayId, index) {
		switch (headOverlayId) {
			case 1: // Beard
				return index <= 19 ? `HAIR_BEARD${index}` : `BRD_HP_${index-20}`;
			case 2: // Eyebrows
				return index === 0 ? "NONE" : `CC_EYEBRW_${index-1}`;
			case 4: // Makeup
				return index === 0 ? "NONE" : `CC_MKUP_${info.values.makeups[index-1]}`;
			case 5: // Blush
				return index === 0 ? "NONE" : `CC_BLUSH_${info.values.blushes[index-1]}`;
			case 8: // Lipstick
				return index === 0 ? "NONE" : `CC_LIPSTICK_${index-1}`;
			default:
				return info.values.headOverlaysLabels[headOverlayId] ? info.values.headOverlaysLabels[headOverlayId][index] : "NONE";
		}
	}

	function showButtons(state, color = false, opacity = false) {
		if (!color && !opacity) {
			state = false;
		}

		if (state) {
			const buttons = [];

			if (color) {
				buttons.push({ altControl: "b_1009%b_1010", label: "face_ccol" });
			}

			if (opacity) {
				buttons.push({ altControl: "t_E%t_Q", label: "ITEM_B_OPACITY" });
			}

			alt.helpers.instructionButtonsDrawler.setButtons(...buttons);
		}

		alt.helpers.instructionButtonsDrawler.setActive(state);
	}

	function showRotateButtons() {
		alt.helpers.instructionButtonsDrawler.setButtons({ altControl: "t_E%t_Q", label: "FE_HLP24" });
		alt.helpers.instructionButtonsDrawler.setActive(true);
		isPedRotationEnabled = true;
	}

	// [ color, opacity ]
	function getButtonsState(itemName) {
		if (itemName === "Причёска") {
			return [ true, false ];
		} else if (itemName === "Цвет глаз" || itemName === "Вернуться") {
			return [ false, false ];
		} else if (itemName === "Брови" || itemName === "Волосы на лице" || itemName === "Помада" || itemName === "Румяна") {
			return [ true, true ];
		}

		return [ false, true ];
	}

	function initColors() {
		const maxColors = Math.max(game.getNumHairColors(), game.getNumMakeupColors());

		for (let i = 0; i < maxColors; i++) {
			if (game.isPedHairColorValid(i)) {
				info.values.hairColors.push(i);
			}

			if (game.isPedLipstickColorValid(i)) {
				info.values.lipstickColors.push(i);
			}

			if (game.isPedBlushColorValid(i)) {
				info.values.makeupColors.push(i);
			}
		}
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

	function getHeadOverlayColorType(headOverlayId) {
		switch (headOverlayId) {
			case 1: case 2: case 10:
				return 1;
			case 5: case 8:
				return 2;
			default:
				return 0;
		}
	}

	function getHeadOverlayColors(headOverlayId) {
		switch (headOverlayId) {
			case 1:
			case 2:
				return info.values.hairColors;
			case 5:
				return info.values.makeupColors;
			case 8:
				return info.values.lipstickColors;
			default:
				return [];
		}
	}

	function handlePedRotation() {
		const leftPressed = game.isDisabledControlPressed(2, 205);
		const rightPressed = game.isDisabledControlPressed(2, 206);

		if (!leftPressed && !rightPressed) {
			return;
		}

		let heading = game.getEntityHeading(info.peds[0]);

		heading += leftPressed ? -1.5 : 1.5;
		
		if (heading > 360) {
			heading = 0;
		} else if (heading < 0) {
			heading = 360;
		}

		setPedsHeading(heading);
	}

	function setPedsHeading(value) {
		for (const ped of info.peds) {
			game.setPedDesiredHeading(ped, value);
		}
	}
});