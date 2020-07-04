import alt from 'alt';
import game from 'natives';

const storage = alt.LocalStorage.get();
const localPlayer = alt.Player.local

function playFocusSound() {
    game.playSoundFrontend(-1, "NAV_UP_DOWN", "HUD_FRONTEND_DEFAULT_SOUNDSET", true);
}

function playBackSound() {
    game.playSoundFrontend(-1, "CANCEL", "HUD_FRONTEND_DEFAULT_SOUNDSET", true);
}

function playSelectSound() {
    game.playSoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", true);
}

alt.on(`Client::init`, (view) => {
    var prevMenuName = "";
    var showHandlers = {
        "enter_biz_3": () => {
            var counts = getArrayClothesCounts();
            //alt.emitServer(`requestClothes`, JSON.stringify(counts));
        },
        "biz_3_top": () => {
            var clothes = alt.clothes[8][alt.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Вернуться"
            });
            view.emit(`selectMenuAPI.setSpecialItems`, 'biz_3_top', JSON.stringify(items));
        },
        "biz_3_legs": () => {
            var clothes = alt.clothes[5][alt.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Вернуться"
            });
            view.emit(`selectMenuAPI.setSpecialItems`, 'biz_3_legs', JSON.stringify(items));
        },
        "biz_3_feets": () => {
            var clothes = alt.clothes[2][alt.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Вернуться"
            });
            view.emit(`selectMenuAPI.setSpecialItems`, 'biz_3_feets', JSON.stringify(items));
        },
        "biz_3_hats": () => {
            var clothes = alt.clothes[4][alt.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Вернуться"
            });
            view.emit(`selectMenuAPI.setSpecialItems`, 'biz_3_hats', JSON.stringify(items));
        },
        "biz_3_glasses": () => {
            var clothes = alt.clothes[3][alt.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Вернуться"
            });
            view.emit(`selectMenuAPI.setSpecialItems`, 'biz_3_glasses', JSON.stringify(items));
        },
        "biz_3_bracelets": () => {
            var clothes = alt.clothes[0][alt.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Вернуться"
            });
            view.emit(`selectMenuAPI.setSpecialItems`, 'biz_3_bracelets', JSON.stringify(items));
        },
        "biz_3_ears": () => {
            var clothes = alt.clothes[1][alt.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Вернуться"
            });
            view.emit(`selectMenuAPI.setSpecialItems`, 'biz_3_ears', JSON.stringify(items));
        },
        "biz_3_masks": () => {
            var clothes = alt.clothes[6][alt.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Вернуться"
            });
            view.emit(`selectMenuAPI.setSpecialItems`, 'biz_3_masks', JSON.stringify(items));
        },
        "biz_3_ties": () => {
            var clothes = alt.clothes[7][alt.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Вернуться"
            });
            view.emit(`selectMenuAPI.setSpecialItems`, 'biz_3_ties', JSON.stringify(items));
        },
        "biz_3_watches": () => {
            var clothes = alt.clothes[9][alt.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Вернуться"
            });
            view.emit(`selectMenuAPI.setSpecialItems`, 'biz_3_watches', JSON.stringify(items));
        },
    };
    alt.on("selectMenu.show", (menuName, selectedIndex = 0, values = null) => {
        // if (player.vehicle) return;
        if (values) values = JSON.stringify(values);
        if (showHandlers[menuName]) showHandlers[menuName]();
        view.emit(`selectMenuAPI.show`, menuName, selectedIndex, values);
    });

    alt.onServer("selectMenu.show", (menuName, selectedIndex = 0, values = null) => {
        // if (player.vehicle) return;
        if (values) values = JSON.stringify(values);
        if (showHandlers[menuName]) showHandlers[menuName]();
        view.emit(`selectMenuAPI.show`, menuName, selectedIndex, values);
    });

    alt.on("selectMenu.hide", () => {
        view.emit(`selectMenuAPI.hide`);
    });

    alt.onServer("selectMenu.hide", () => {
        view.emit(`selectMenuAPI.hide`);
    });

    alt.on("selectMenu.clearState", (menuName) => {
        view.emit(`selectMenuAPI.clearState`, menuName);
    });

    alt.on("selectMenu.setItems", (menuName, itemsName) => {
        view.emit(`selectMenuAPI.setItems`, menuName, itemsName);
    });

    alt.on("selectMenu.setSpecialItems", (menuName, items) => {
        view.emit(`selectMenuAPI.setSpecialItems`, menuName, JSON.stringify(items));
    });

    alt.on("selectMenu.setHeader", (menuName, header) => {
        view.emit(`selectMenuAPI.setHeader`, menuName, header);
    });

    alt.on("selectMenu.setPrompt", (menuName, text) => {
        view.emit(`selectMenu.setPrompt`, menuName, text);
    });

    alt.on("selectMenu.setItemValueIndex", (menuName, itemIndex, index) => {
        view.emit(`selectMenu.setItemValueIndex`, menuName, itemIndex, index);
    });

    alt.on("selectMenu.setItemName", (menuName, index, newName) => {
        view.emit(`selectMenu.setItemName`, menuName, index, newName);
    });

    var menuHandlers = {
        "enter_biz_1": {
            "Купить бизнес": () => {
                if (!alt.isFlood()) {
                    alt.emitServer("biz.show", "biz_buy");
                    alt.emit("selectMenu.hide");
                }
            },
            "Панель управления": () => {
                prevMenuName = "enter_biz_1";
                alt.emit("selectMenu.show", "biz_panel");
            }
        },
        "sell_car": {
            "Продать автомобиль": () => {
                if (!alt.isFlood()) {
                    alt.emitServer("sellCar");
                    alt.emit("selectMenu.hide");
                }
            }
        },
        "enter_biz_2": {
            "Купить бизнес": () => {
                if (!alt.isFlood()) {
                    alt.emitServer("biz.show", "biz_buy");
                    alt.emit("selectMenu.hide");
                }
            },
            "Панель управления": () => {
                prevMenuName = "enter_biz_2";
                alt.emit("selectMenu.show", "biz_panel");
            }
        },
        "enter_biz_3": {
            "Примерочная": () => {
                alt.emitServer("biz_3.clearItems", alt.helpers.interior.getCurrent());
            },
            "Купить бизнес": () => {
                if (!alt.isFlood()) {
                    alt.emitServer("biz.show", "biz_buy");
                    alt.emit("selectMenu.hide");
                }
            },
            "Панель управления": () => {
                prevMenuName = "enter_biz_3";
                alt.emit("selectMenu.show", "biz_panel");
            }
        },
        "biz_3_clothes": {
            "Верхняя одежда": (itemValue, itemIndex) => {
                var comp = alt.clothes[8][alt.clientStorage.sex][0];
                game.setPedComponentVariation(game.playerPedId(), 3, comp.torso, 0, 0);
                game.setPedComponentVariation(game.playerPedId(), 11, comp.variation, comp.textures[0], 0);
				alt.emit("clothes_shop::resetView", "body", { name: "biz_3_top" });
            },
            "Нижняя одежда": () => {
                var comp = alt.clothes[5][alt.clientStorage.sex][0];
                game.setPedComponentVariation(game.playerPedId(), 4, comp.variation, comp.textures[0], 0);
				alt.emit("clothes_shop::resetView", "legs", { name: "biz_3_legs" });
            },
            "Обувь": () => {
                var comp = alt.clothes[2][alt.clientStorage.sex][0];
                game.setPedComponentVariation(game.playerPedId(), 6, comp.variation, comp.textures[0], 0);
				alt.emit("clothes_shop::resetView", "feet", { name: "biz_3_feets" });
            },
            "Головные уборы": () => {
                var comp = alt.clothes[4][alt.clientStorage.sex][0];
                game.setPedPropIndex(game.playerPedId(), 0, comp.variation, comp.textures[0], true);
				alt.emit("clothes_shop::resetView", "head", { name: "biz_3_hats" });
            },
            "Очки": () => {
                var comp = alt.clothes[3][alt.clientStorage.sex][0];
                game.setPedPropIndex(game.playerPedId(), 1, comp.variation, comp.textures[0], true);
				alt.emit("clothes_shop::resetView", "head", { name: "biz_3_glasses" });
            },
            "Браслеты": (itemValue, itemIndex) => {
                var comp = alt.clothes[0][alt.clientStorage.sex][0];
                game.setPedPropIndex(game.playerPedId(), 7, comp.variation, comp.textures[0], true);
				alt.emit("clothes_shop::resetView", "body", { name: "biz_3_bracelets" });
            },
            "Серьги": (itemValue, itemIndex) => {
                var comp = alt.clothes[1][alt.clientStorage.sex][0];
                game.setPedPropIndex(game.playerPedId(), 2, comp.variation, comp.textures[0], true);
                alt.emit("clothes_shop::resetView", "head", { name: "biz_3_ears" });
            },
            "Маски": (itemValue, itemIndex) => {
                var comp = alt.clothes[6][alt.clientStorage.sex][0];
                game.setPedPropIndex(game.playerPedId(), 1, comp.variation, comp.textures[0], 0);
                alt.emit("clothes_shop::resetView", "head", { name: "biz_3_masks" });
            },
            "Аксессуары": (itemValue, itemIndex) => {
                var comp = alt.clothes[7][alt.clientStorage.sex][0];
                game.setPedPropIndex(game.playerPedId(), 7, comp.variation, comp.textures[0], 0);
                alt.emit("clothes_shop::resetView", "body", { name: "biz_3_ties" });
            },
            "Часы": (itemValue, itemIndex) => {
                var comp = alt.clothes[9][alt.clientStorage.sex][0];
                game.setPedPropIndex(game.playerPedId(), 6, comp.variation, comp.textures[0], true);
                alt.emit("clothes_shop::resetView", "body", { name: "biz_3_watches" });
            },
            "Завершить": () => {
                alt.emit("selectMenu.hide");
                alt.emitServer("clothes_shop::stopDressing");
            },
        },
        "biz_3_top": {
            "Вернуться": () => {
                alt.emit("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 0 });
            }
        },
        "biz_3_legs": {
            "Вернуться": () => {
                alt.emit("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 1 });
            }
        },
        "biz_3_feets": {
            "Вернуться": () => {
                alt.emit("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 2 });
            }
        },
        "biz_3_hats": {
            "Вернуться": () => {
                alt.emit("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 3 });
            }
        },
        "biz_3_glasses": {
            "Вернуться": () => {
                alt.emit("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 4 });
            }
        },
        "biz_3_bracelets": {
            "Вернуться": () => {
                alt.emit("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 5 });
            }
        },
        "biz_3_ears": {
            "Вернуться": () => {
                alt.emit("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 6 });
            }
        },
        "biz_3_masks": {
            "Вернуться": () => {
                alt.emit("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 7 });
            }
        },
        "biz_3_ties": {
            "Вернуться": () => {
                alt.emit("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 8 });
            }
        },
        "biz_3_watches": {
            "Вернуться": () => {
                alt.emit("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 9 });
            }
        },
        "enter_biz_4": {
            "Купить бизнес": () => {
                if (!alt.isFlood()) {
                    alt.emitServer("biz.show", "biz_buy");
                    alt.emit("selectMenu.hide");
                }
            },
            "Панель управления": () => {
                prevMenuName = "enter_biz_4";
                alt.emit("selectMenu.show", "biz_panel");
            }
        },
        "enter_biz_5": {
            "Топливо": () => {
                alt.emit('selectMenu.show', 'biz_5_items');
            },
            "Купить бизнес": () => {
                if (!alt.isFlood()) {
                    alt.emitServer("biz.show", "biz_buy");
                    alt.emit("selectMenu.hide");
                }
            },
            "Панель управления": () => {
                prevMenuName = "enter_biz_5";
                alt.emit("selectMenu.show", "biz_panel");
            }
        },
        "biz_5_items": {
            "Заправить": (value) => {
                alt.emitServer("biz_5.buyItem", 0, parseInt(value));
            },
            "Пополнить канистру": (value) => {
                alt.emitServer("biz_5.buyItem", 1);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "enter_biz_5");
            },
        },
        "enter_biz_6": {
            "Магазин": () => {
                alt.emit('selectMenu.show', 'biz_6_items');
            },
            "Купить бизнес": () => {
                if (!alt.isFlood()) {
                    alt.emitServer("biz.show", "biz_buy");
                    alt.emit("selectMenu.hide");
                }
            },
            "Панель управления": () => {
                prevMenuName = "enter_biz_6";
                alt.emit("selectMenu.show", "biz_panel");
            }
        },
        "biz_6_items": {
            0: () => {
                alt.emitServer("biz_6.buyItem", 30);
            },
            1: () => {
                alt.emitServer("biz_6.buyItem", 31);
            },
            2: () => {
                alt.emitServer("biz_6.buyItem", 32);
            },
            3: () => {
                alt.emitServer("biz_6.buyItem", 33);
            },
            4: () => {
                alt.emitServer("biz_6.buyItem", 34);
            },
            5: () => {
                alt.emitServer("biz_6.buyItem", 35);
            },
            6: () => {
                alt.emitServer("biz_6.buyItem", 15);
            },
            7: () => {
                alt.emitServer("biz_6.buyItem", 13);
            },
            8: () => {
                alt.emitServer("biz_6.buyItem", 36);
            },
            9: () => {
                alt.emitServer("biz_6.buyItem", 25);
            },
            10: () => {
                alt.emit("selectMenu.show", "enter_biz_6");
            },
        },
        "enter_biz_7": {
            "Купить бизнес": () => {
                if (!alt.isFlood()) {
                    alt.emitServer("biz.show", "biz_buy");
                    alt.emit("selectMenu.hide");
                }
            },
            "Панель управления": () => {
                prevMenuName = "enter_biz_7";
                alt.emit("selectMenu.show", "biz_panel");
            }
        },
        "enter_biz_8": {
            "Оружия": () => {
                alt.emit("selectMenu.show", "biz_8_guns");
            },
            "Патроны": () => {
                alt.emit("selectMenu.show", "biz_8_ammo");
            },
            "Купить бизнес": () => {
                if (!alt.isFlood()) {
                    alt.emitServer("biz.show", "biz_buy");
                    alt.emit("selectMenu.hide");
                }
            },
            "Панель управления": () => {
                prevMenuName = "enter_biz_8";
                alt.emit("selectMenu.show", "biz_panel");
            }
        },
        "biz_8_guns": {
            "Ближний бой": () => {
                alt.emit("selectMenu.show", "biz_8_melee");
            },
            "Пистолеты": () => {
                alt.emit("selectMenu.show", "biz_8_handguns");
            },
            "Пистолеты-пулеметы": () => {
                alt.emit("selectMenu.show", "biz_8_submachine_guns");
            },
            "Ружья": () => {
                alt.emit("selectMenu.show", "biz_8_shotguns");
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "enter_biz_8");
            },
        },
        "biz_8_melee": {
            0: () => {
                alt.emitServer(`biz_8.buyItem`, 41);
            },
            1: () => {
                alt.emitServer(`biz_8.buyItem`, 42);
            },
            2: () => {
                alt.emitServer(`biz_8.buyItem`, 43);
            },
            3: () => {
                alt.emit("selectMenu.show", `biz_8_guns`);
            },
        },
        "biz_8_handguns": {
            0: () => {
                alt.emitServer(`biz_8.buyItem`, 44);
            },
            1: () => {
                alt.emitServer(`biz_8.buyItem`, 45);
            },
            2: () => {
                alt.emit("selectMenu.show", `biz_8_guns`, 1);
            },
        },
        "biz_8_submachine_guns": {
            0: () => {
                alt.emitServer(`biz_8.buyItem`, 47);
            },
            1: () => {
                alt.emitServer(`biz_8.buyItem`, 48);
            },
            2: () => {
                alt.emit("selectMenu.show", `biz_8_guns`, 2);
            },
        },
        "biz_8_shotguns": {
            0: () => {
                alt.emitServer(`biz_8.buyItem`, 49);
            },
            1: () => {
                alt.emit("selectMenu.show", `biz_8_guns`, 3);
            },
        },
        "biz_8_ammo": {
            0: (value) => {
                if (!alt.isFlood()) alt.emitServer(`biz_8.buyAmmo`, 0, parseInt(value));
            },
            1: (value) => {
                if (!alt.isFlood()) alt.emitServer(`biz_8.buyAmmo`, 1, parseInt(value));
            },
            2: (value) => {
                if (!alt.isFlood()) alt.emitServer(`biz_8.buyAmmo`, 2, parseInt(value));
            },
            3: (value) => {
                if (!alt.isFlood()) alt.emitServer(`biz_8.buyAmmo`, 3, parseInt(value));
            },
            4: () => {
                alt.emit(`selectMenu.show`, `enter_biz_8`, 1);
            },
        },
        "enter_biz_9": {
            "Купить авто": () => {
                alt.emitServer(`autoSaloon.openBuyerMenu`);
            }
        },
        "enter_biz_10": {
            "Купить бизнес": () => {
                if (!alt.isFlood()) {
                    alt.emitServer("biz.show", "biz_buy");
                    alt.emit("selectMenu.hide");
                }
            },
            "Панель управления": () => {
                prevMenuName = "enter_biz_10";
                alt.emit("selectMenu.show", "biz_panel");
            }
        },
        "enter_biz_11": {
            "Купить бизнес": () => {
                if (!alt.isFlood()) {
                    alt.emitServer("biz.show", "biz_buy");
                    alt.emit("selectMenu.hide");
                }
            },
            "Панель управления": () => {
                prevMenuName = "enter_biz_11";
                alt.emit("selectMenu.show", "biz_panel");
            }
        },
        "biz_panel": {
            "Информация о бизнесе": () => {
                if (!alt.isFlood()) {
                    alt.emitServer("getBizInfo");
                    alt.emit("selectMenu.hide");
                }
            },
            "Касса": () => {
                alt.emit("selectMenu.show", "biz_cashbox");
            },
            "Доходы и расходы": () => {
                alt.emit("selectMenu.show", "biz_stats");
            },
            "Товар": () => {
                alt.emit("selectMenu.show", "biz_products");
            },
            "Персонал": () => {
                alt.emit("selectMenu.show", "biz_staff");
            },
            "Улучшения для бизнеса": () => {
                alt.emit("selectMenu.show", "biz_rise");
            },
            "Статус бизнеса": () => {
                alt.emit("selectMenu.show", "biz_status");
            },
            "Продать бизнес": () => {
                alt.emit("selectMenu.show", "biz_sell");
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", prevMenuName);
            },
        },
        "biz_cashbox": {
            "Баланс кассы": () => {
                if (!alt.isFlood()) {
                    alt.emitServer("biz.balance.get");
                    alt.emit("selectMenu.hide");
                }
            },
            "Вывести с кассы": () => {
                alt.emit("modal.show", "biz_balance_take");
                alt.emit("selectMenu.hide");
            },
            "Пополнить кассу": () => {
                alt.emit("modal.show", "biz_balance_add");
                alt.emit("selectMenu.hide");
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "biz_panel", 1);
            }
        },
        "biz_stats": {
            "История кассы": () => {
                if (!alt.isFlood()) {
                    alt.emit("setLocalVar", "bizLogsOffset", 0);
                    alt.emitServer("biz.getStats", alt.clientStorage["bizLogsOffset"]);
                    alt.emit("selectMenu.hide");
                }
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "biz_panel", 2);
            }
        },
        "biz_products": {
            "Закупить товар": () => {
                if (!alt.isFlood()) {
                    alt.emitServer("biz.show", "biz_products_buy");
                    alt.emit("selectMenu.hide");
                }
            },
            "Списать товар": () => {
                if (!alt.isFlood()) {
                    alt.emitServer("biz.show", "biz_products_sell");
                    alt.emit("selectMenu.hide");
                }
            },
            "Цена товара": () => {
                if (!alt.isFlood()) {
                    alt.emitServer("biz.show", "biz_products_price");
                    alt.emit("selectMenu.hide");
                }
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "biz_panel", 3);
            }
        },
        "biz_staff": {
            "Вернуться": () => {
                alt.emit("selectMenu.show", "biz_panel", 4);
            }
        },
        "biz_rise": {
            "Вернуться": () => {
                alt.emit("selectMenu.show", "biz_panel", 5);
            }
        },
        "biz_status": {
            "Открыть бизнес": () => {
                if (!alt.isFlood()) {
                    alt.emitServer("biz.setStatus", 1);
                    alt.emit("selectMenu.hide");
                }
            },
            "Закрыть бизнес": () => {
                if (!alt.isFlood()) {
                    alt.emitServer("biz.setStatus", 0);
                    alt.emit("selectMenu.hide");
                }
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "biz_panel", 6);
            }
        },
        "biz_sell": {
            "Гражданину": () => {
                if (!alt.isFlood()) {
                    alt.emitServer("biz.show", "biz_sell_to_player");
                    alt.emit("selectMenu.hide");
                }
            },
            "Государству": () => {
                if (!alt.isFlood()) {
                    alt.emitServer("biz.show", "biz_sell_to_gov");
                    alt.emit("selectMenu.hide");
                }
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "biz_panel", 7);
            }
        },

        "police_storage": {
            "Служебное вооружение": () => {
                alt.emit("selectMenu.show", "police_guns");
            },
            "Гардероб": () => {
                alt.emit("selectMenu.show", "police_clothes");
            },
            "Спец. предметы": () => {
                alt.emit("selectMenu.show", "police_items");
            },
            "Патроны": () => {
                alt.emit("selectMenu.show", "police_ammo");
            },
        },
        "police_guns": {
            "Nightstick": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeGun`, 0);
            },
            "Flashlight": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeGun`, 1);
            },
            "Stun Gun": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeGun`, 2);
            },
            "Combat Pistol": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeGun`, 3);
            },
            "Pump Shotgun": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeGun`, 4);
            },
            "Carbine Rifle": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeGun`, 5);
            },
            "Sniper Rifle": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeGun`, 6);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "police_storage");
            }
        },
        "police_items": {
            "Удостоверение PD": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeItem`, 0);
            },
            "Рация": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeItem`, 1);
            },
            "Наручники": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeItem`, 2);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "police_storage", 2);
            }
        },
        "police_ammo": {
            "Combat Pistol - 9mm": (value) => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeAmmo`, 0, parseInt(value));
            },
            "Pump Shotgun - 12mm": (value) => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeAmmo`, 1, parseInt(value));
            },
            "Carbine Rifle - 5.56mm": (value) => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeAmmo`, 2, parseInt(value));
            },
            "Sniper Rifle - 7.62mm": (value) => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeAmmo`, 3, parseInt(value));
            },
            "Вернуться": (value) => {
                alt.emit("selectMenu.show", "police_storage", 3);
            }
        },
        "police_clothes": {
            "Форма офицера №1": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeClothes`, 0);
            },
            "Форма SWAT": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeClothes`, 1);
            },
            "Форма офицера №2": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeClothes`, 2);
            },
            "Бронежилет": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeArmour`);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "police_storage", 1);
            }
        },
        "police_service": {
            "Восстановление вещей": () => {
                alt.emit("selectMenu.show", "police_service_recovery");
            },
            "Оплата штрафа": () => {
                alt.emitServer("policeService.showClearFine");
                alt.emit("selectMenu.hide");
            },
        },
        "police_service_recovery": {
            "Документы": () => {
                alt.emitServer("policeService.recovery.documents");
            },
            "Ключи от авто": () => {
                alt.emitServer("policeService.recovery.carKeys");
            },
            "Ключи от дома": (value) => {
                if (!value) return alt.emit(`nError`, `У Вас нет дома!`);
                alt.emitServer("policeService.recovery.houseKeys", parseInt(value.substr(1)));
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "police_service");
            }
        },

        "gang_storage": {
            "Сейф": () => {
                alt.emit("choose.gang.safe.menu");
            },
            "Оружейный арсенал": () => {
                alt.emit("choose.gang.weapon.menu");
            },
            "Наркотики": () => {
                alt.emit("choose.gang.drugs.menu");
            },
            "Боеприпасы": () => {
                alt.emit("choose.gang.ammo.menu");
            },
            "Управление": () => {
                alt.emit("choose.gang.control.menu");
            },
        },
        "gang_storage_1": {
            "Пополнить сейф": () => {
                alt.emit("choose.gang.safe.money", true);
            },
            "Снять с сейфа": () => {
                alt.emit("choose.gang.safe.money", false);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "gang_storage");
            },
        },
        "gang_storage_2": {
            "Положить наркотики": () => {
                alt.emit("put.gang.drugs.menu");
            },
            "Взять наркотики": () => {
                alt.emit("put.gang.drugs_in.menu");
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "gang_storage");
            },
        },

        "gang_storage_3": {
            0: () => {
               alt.emit("choose.gang.safe.drugs", 0, true);
            },
            1: () => {
               alt.emit("choose.gang.safe.drugs", 1, true);
            },
            2: () => {
               alt.emit("choose.gang.safe.drugs", 2, true);
            },
            3: () => {
               alt.emit("choose.gang.safe.drugs", 3, true);
            },
            4: () => { alt.emit("selectMenu.show", "gang_storage_2"); },
        },
        "gang_storage_4": {
            0: () => {
               alt.emit("choose.gang.safe.drugs", 0, false);
            },
            1: () => {
               alt.emit("choose.gang.safe.drugs", 1, false);
            },
            2: () => {
               alt.emit("choose.gang.safe.drugs", 2, false);
            },
            3: () => {
               alt.emit("choose.gang.safe.drugs", 3, false);
            },
            4: () => { alt.emit("selectMenu.show", "gang_storage_2"); },
        },
        "gang_storage_5": {
            "Положить боеприпасы": () => {
                alt.emit("put.gang.ammo.menu");
            },
            "Взять боеприпасы": () => {
                alt.emit("put.gang.ammo_in.menu");
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "gang_storage");
            },
        },
        "gang_storage_6": {
          0: () => {
             alt.emit("choose.gang.safe.ammo", 0, true);
          },
          1: () => {
             alt.emit("choose.gang.safe.ammo", 1, true);
          },
          2: () => {
             alt.emit("choose.gang.safe.ammo", 2, true);
          },
          3: () => {
             alt.emit("choose.gang.safe.ammo", 3, true);
          },
          4: () => { alt.emit("selectMenu.show", "gang_storage_5"); },
        },
        "gang_storage_7": {
          0: () => {
             alt.emit("choose.gang.safe.ammo", 0, false);
          },
          1: () => {
             alt.emit("choose.gang.safe.ammo", 1, false);
          },
          2: () => {
             alt.emit("choose.gang.safe.ammo", 2, false);
          },
          3: () => {
             alt.emit("choose.gang.safe.ammo", 3, false);
          },
          4: () => { alt.emit("selectMenu.show", "gang_storage_5"); },
        },
        "gang_storage_8": {
            "Открыть / Закрыть склад": () => {
                alt.emit("gang.set.lock");
            },
            "Установить ранговые ограничения": () => {
                alt.emit("choose.gang.ranks.menu");
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "gang_storage");
            },
        },

        "gang_storage_9": {
          "Доступ к оружию": () => {
              alt.emit("send.gang.allow.menu", 0);
          },
          "Доступ к деньгам": () => {
              alt.emit("send.gang.allow.menu", 4);
          },
          "Доступ к наркотикам": () => {
              alt.emit("send.gang.allow.menu", 1);
          },
          "Доступ к боеприпасам": () => {
              alt.emit("send.gang.allow.menu", 2);
          },
          "Доступ к управлению": () => {
              alt.emit("send.gang.allow.menu", 3);
          },
          "Вернуться": () => {
              alt.emit("selectMenu.show", "gang_storage_8");
          },
        },
        "gang_storage_10": {
            "Положить оружие": () => {
                alt.emit("put.gang.weapon.menu");
            },
            "Взять оружие": () => {
                alt.emit("put.gang.weapon_in.menu");
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "gang_storage");
            },
        },
        "gang_storage_11": {
            "Холодное оружие": () => {
                alt.emit("selectMenu.show", "gang_storage_11_1");
            },
            "Пистолеты": () => {
                alt.emit("selectMenu.show", "gang_storage_11_2");
            },
            "Пистолеты-пулеметы": () => {
                alt.emit("selectMenu.show", "gang_storage_11_3");
            },
            "Ружья": () => {
                alt.emit("selectMenu.show", "gang_storage_11_4");
            },
            "Штурмовые винтовки": () => {
                alt.emit("selectMenu.show", "gang_storage_11_5");
            },
            "Легкие пулеметы": () => {
                alt.emit("selectMenu.show", "gang_storage_11_6");
            },
            "Снайперские винтовки": () => {
                alt.emit("selectMenu.show", "gang_storage_11_7");
            },
            "Тяжелое оружие": () => {
                alt.emit("selectMenu.show", "gang_storage_11_8");
            },
            "Метательное оружие": () => {
                alt.emit("selectMenu.show", "gang_storage_11_9");
            },
            "Разное": () => {
                alt.emit("selectMenu.show", "gang_storage_11_10");
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "gang_storage_10");
            },
        },
        "gang_storage_12": {
          "Холодное оружие": () => {
              alt.emit("selectMenu.show", "gang_storage_12_1");
          },
          "Пистолеты": () => {
              alt.emit("selectMenu.show", "gang_storage_12_2");
          },
          "Пистолеты-пулеметы": () => {
              alt.emit("selectMenu.show", "gang_storage_12_3");
          },
          "Ружья": () => {
              alt.emit("selectMenu.show", "gang_storage_12_4");
          },
          "Штурмовые винтовки": () => {
              alt.emit("selectMenu.show", "gang_storage_12_5");
          },
          "Легкие пулеметы": () => {
              alt.emit("selectMenu.show", "gang_storage_12_6");
          },
          "Снайперские винтовки": () => {
              alt.emit("selectMenu.show", "gang_storage_12_7");
          },
          "Тяжелое оружие": () => {
              alt.emit("selectMenu.show", "gang_storage_12_8");
          },
          "Метательное оружие": () => {
              alt.emit("selectMenu.show", "gang_storage_12_9");
          },
          "Разное": () => {
              alt.emit("selectMenu.show", "gang_storage_12_10");
          },
          "Вернуться": () => {
              alt.emit("selectMenu.show", "gang_storage_10");
          },
        },
        "gang_storage_11_1": {
          0: () => { alt.emit("take.gang.weapons.safe", 65, false); },
          1: () => { alt.emit("take.gang.weapons.safe", 41, false); },
          2: () => { alt.emit("take.gang.weapons.safe", 66, false); },
          3: () => { alt.emit("take.gang.weapons.safe", 67, false); },
          4: () => { alt.emit("take.gang.weapons.safe", 18, false); },
          5: () => { alt.emit("take.gang.weapons.safe", 68, false); },
          6: () => { alt.emit("take.gang.weapons.safe", 69, false); },
          7: () => { alt.emit("take.gang.weapons.safe", 70, false); },
          8: () => { alt.emit("take.gang.weapons.safe", 42, false); },
          9: () => { alt.emit("take.gang.weapons.safe", 43, false); },
          10: () => { alt.emit("take.gang.weapons.safe", 71, false); },
          11: () => { alt.emit("take.gang.weapons.safe", 72, false); },
          12: () => { alt.emit("take.gang.weapons.safe", 17, false); },
          13: () => { alt.emit("take.gang.weapons.safe", 73, false); },
          14: () => { alt.emit("take.gang.weapons.safe", 74, false); },
          15: () => { alt.emit("take.gang.weapons.safe", 75, false); },
          16: () => { alt.emit("take.gang.weapons.safe", 76, false); },
          17: () => { alt.emit("selectMenu.show", "gang_storage_11"); },
    		},
        "gang_storage_12_1": {
          0: () => { alt.emit("take.gang.weapons.safe", 65, true); },
          1: () => { alt.emit("take.gang.weapons.safe", 41, true); },
          2: () => { alt.emit("take.gang.weapons.safe", 66, true); },
          3: () => { alt.emit("take.gang.weapons.safe", 67, true); },
          4: () => { alt.emit("take.gang.weapons.safe", 18, true); },
          5: () => { alt.emit("take.gang.weapons.safe", 68, true); },
          6: () => { alt.emit("take.gang.weapons.safe", 69, true); },
          7: () => { alt.emit("take.gang.weapons.safe", 70, true); },
          8: () => { alt.emit("take.gang.weapons.safe", 42, true); },
          9: () => { alt.emit("take.gang.weapons.safe", 43, true); },
          10: () => { alt.emit("take.gang.weapons.safe", 71, true); },
          11: () => { alt.emit("take.gang.weapons.safe", 72, true); },
          12: () => { alt.emit("take.gang.weapons.safe", 17, true); },
          13: () => { alt.emit("take.gang.weapons.safe", 73, true); },
          14: () => { alt.emit("take.gang.weapons.safe", 74, true); },
          15: () => { alt.emit("take.gang.weapons.safe", 75, true); },
          16: () => { alt.emit("take.gang.weapons.safe", 76, true); },
          17: () => { alt.emit("selectMenu.show", "gang_storage_12"); },
    		},
        "gang_storage_11_2": {
          0: () => { alt.emit("take.gang.weapons.safe", 44, false); },
          1: () => { alt.emit("take.gang.weapons.safe", 77, false); },
          2: () => { alt.emit("take.gang.weapons.safe", 20, false); },
          3: () => { alt.emit("take.gang.weapons.safe", 45, false); },
          4: () => { alt.emit("take.gang.weapons.safe", 19, false); },
          5: () => { alt.emit("take.gang.weapons.safe", 125, false); },
          6: () => { alt.emit("take.gang.weapons.safe", 78, false); },
          7: () => { alt.emit("take.gang.weapons.safe", 79, false); },
          8: () => { alt.emit("take.gang.weapons.safe", 80, false); },
          9: () => { alt.emit("take.gang.weapons.safe", 81, false); },
          10: () => { alt.emit("take.gang.weapons.safe", 82, false); },
          11: () => { alt.emit("take.gang.weapons.safe", 83, false); },
          12: () => { alt.emit("take.gang.weapons.safe", 46, false); },
          13: () => { alt.emit("take.gang.weapons.safe", 84, false); },
          14: () => { alt.emit("take.gang.weapons.safe", 85, false); },
          15: () => { alt.emit("selectMenu.show", "gang_storage_11"); },
        },
        "gang_storage_12_2": {
          0: () => { alt.emit("take.gang.weapons.safe", 44, true); },
          1: () => { alt.emit("take.gang.weapons.safe", 77, true); },
          2: () => { alt.emit("take.gang.weapons.safe", 20, true); },
          3: () => { alt.emit("take.gang.weapons.safe", 45, true); },
          4: () => { alt.emit("take.gang.weapons.safe", 19, true); },
          5: () => { alt.emit("take.gang.weapons.safe", 125, true); },
          6: () => { alt.emit("take.gang.weapons.safe", 78, true); },
          7: () => { alt.emit("take.gang.weapons.safe", 79, true); },
          8: () => { alt.emit("take.gang.weapons.safe", 80, true); },
          9: () => { alt.emit("take.gang.weapons.safe", 81, true); },
          10: () => { alt.emit("take.gang.weapons.safe", 82, true); },
          11: () => { alt.emit("take.gang.weapons.safe", 83, true); },
          12: () => { alt.emit("take.gang.weapons.safe", 46, true); },
          13: () => { alt.emit("take.gang.weapons.safe", 84, true); },
          14: () => { alt.emit("take.gang.weapons.safe", 85, true); },
          15: () => { alt.emit("selectMenu.show", "gang_storage_12"); },
        },
        "gang_storage_11_3": {
          0: () => { alt.emit("take.gang.weapons.safe", 47, false); },
          1: () => { alt.emit("take.gang.weapons.safe", 48, false); },
          2: () => { alt.emit("take.gang.weapons.safe", 86, false); },
          3: () => { alt.emit("take.gang.weapons.safe", 87, false); },
          4: () => { alt.emit("take.gang.weapons.safe", 88, false); },
          5: () => { alt.emit("take.gang.weapons.safe", 89, false); },
          6: () => { alt.emit("take.gang.weapons.safe", 90, false); },
          7: () => { alt.emit("selectMenu.show", "gang_storage_11"); },
        },
        "gang_storage_12_3": {
          0: () => { alt.emit("take.gang.weapons.safe", 47, true); },
          1: () => { alt.emit("take.gang.weapons.safe", 48, true); },
          2: () => { alt.emit("take.gang.weapons.safe", 86, true); },
          3: () => { alt.emit("take.gang.weapons.safe", 87, true); },
          4: () => { alt.emit("take.gang.weapons.safe", 88, true); },
          5: () => { alt.emit("take.gang.weapons.safe", 89, true); },
          6: () => { alt.emit("take.gang.weapons.safe", 90, true); },
          7: () => { alt.emit("selectMenu.show", "gang_storage_12"); },
        },
        "gang_storage_11_4": {
          0: () => { alt.emit("take.gang.weapons.safe", 21, false); },
          1: () => { alt.emit("take.gang.weapons.safe", 91, false); },
          2: () => { alt.emit("take.gang.weapons.safe", 49, false); },
          3: () => { alt.emit("take.gang.weapons.safe", 92, false); },
          4: () => { alt.emit("take.gang.weapons.safe", 93, false); },
          5: () => { alt.emit("take.gang.weapons.safe", 94, false); },
          6: () => { alt.emit("take.gang.weapons.safe", 95, false); },
          7: () => { alt.emit("take.gang.weapons.safe", 96, false); },
          8: () => { alt.emit("take.gang.weapons.safe", 97, false); },
          9: () => { alt.emit("selectMenu.show", "gang_storage_11"); },
        },
        "gang_storage_12_4": {
          0: () => { alt.emit("take.gang.weapons.safe", 21, true); },
          1: () => { alt.emit("take.gang.weapons.safe", 91, true); },
          2: () => { alt.emit("take.gang.weapons.safe", 49, true); },
          3: () => { alt.emit("take.gang.weapons.safe", 92, true); },
          4: () => { alt.emit("take.gang.weapons.safe", 93, true); },
          5: () => { alt.emit("take.gang.weapons.safe", 94, true); },
          6: () => { alt.emit("take.gang.weapons.safe", 95, true); },
          7: () => { alt.emit("take.gang.weapons.safe", 96, true); },
          8: () => { alt.emit("take.gang.weapons.safe", 97, true); },
          9: () => { alt.emit("selectMenu.show", "gang_storage_12"); },
        },
        "gang_storage_11_5": {
          0: () => { alt.emit("take.gang.weapons.safe", 50, false); },
          1: () => { alt.emit("take.gang.weapons.safe", 98, false); },
          2: () => { alt.emit("take.gang.weapons.safe", 22, false); },
          3: () => { alt.emit("take.gang.weapons.safe", 99, false); },
          4: () => { alt.emit("take.gang.weapons.safe", 100, false); },
          5: () => { alt.emit("take.gang.weapons.safe", 101, false); },
          6: () => { alt.emit("take.gang.weapons.safe", 102, false); },
          7: () => { alt.emit("take.gang.weapons.safe", 51, false); },
          8: () => { alt.emit("take.gang.weapons.safe", 103, false); },
          9: () => { alt.emit("take.gang.weapons.safe", 52, false); },
          10: () => { alt.emit("selectMenu.show", "gang_storage_11"); },
        },
        "gang_storage_12_5": {
          0: () => { alt.emit("take.gang.weapons.safe", 50, true); },
          1: () => { alt.emit("take.gang.weapons.safe", 98, true); },
          2: () => { alt.emit("take.gang.weapons.safe", 22, true); },
          3: () => { alt.emit("take.gang.weapons.safe", 99, true); },
          4: () => { alt.emit("take.gang.weapons.safe", 100, true); },
          5: () => { alt.emit("take.gang.weapons.safe", 101, true); },
          6: () => { alt.emit("take.gang.weapons.safe", 102, true); },
          7: () => { alt.emit("take.gang.weapons.safe", 51, true); },
          8: () => { alt.emit("take.gang.weapons.safe", 103, true); },
          9: () => { alt.emit("take.gang.weapons.safe", 52, true); },
          10: () => { alt.emit("selectMenu.show", "gang_storage_12"); },
        },
        "gang_storage_11_6": {
          0: () => { alt.emit("take.gang.weapons.safe", 53, false); },
          1: () => { alt.emit("take.gang.weapons.safe", 104, false); },
          2: () => { alt.emit("take.gang.weapons.safe", 105, false); },
          3: () => { alt.emit("take.gang.weapons.safe", 106, false); },
          4: () => { alt.emit("selectMenu.show", "gang_storage_11"); },
        },
        "gang_storage_12_6": {
          0: () => { alt.emit("take.gang.weapons.safe", 53, true); },
          1: () => { alt.emit("take.gang.weapons.safe", 104, true); },
          2: () => { alt.emit("take.gang.weapons.safe", 105, true); },
          3: () => { alt.emit("take.gang.weapons.safe", 106, true); },
          4: () => { alt.emit("selectMenu.show", "gang_storage_12"); },
        },
        "gang_storage_11_7": {
          0: () => { alt.emit("take.gang.weapons.safe", 23, false); },
          1: () => { alt.emit("take.gang.weapons.safe", 107, false); },
          2: () => { alt.emit("take.gang.weapons.safe", 108, false); },
          3: () => { alt.emit("take.gang.weapons.safe", 109, false); },
          4: () => { alt.emit("take.gang.weapons.safe", 110, false); },
          5: () => { alt.emit("selectMenu.show", "gang_storage_11"); },
        },
        "gang_storage_12_7": {
          0: () => { alt.emit("take.gang.weapons.safe", 23, true); },
          1: () => { alt.emit("take.gang.weapons.safe", 107, true); },
          2: () => { alt.emit("take.gang.weapons.safe", 108, true); },
          3: () => { alt.emit("take.gang.weapons.safe", 109, true); },
          4: () => { alt.emit("take.gang.weapons.safe", 110, true); },
          5: () => { alt.emit("selectMenu.show", "gang_storage_12"); },
        },
        "gang_storage_11_8": {
          0: () => { alt.emit("take.gang.weapons.safe", 111, false); },
          1: () => { alt.emit("take.gang.weapons.safe", 112, false); },
          2: () => { alt.emit("take.gang.weapons.safe", 113, false); },
          3: () => { alt.emit("take.gang.weapons.safe", 114, false); },
          4: () => { alt.emit("take.gang.weapons.safe", 115, false); },
          5: () => { alt.emit("take.gang.weapons.safe", 116, false); },
          6: () => { alt.emit("take.gang.weapons.safe", 117, false); },
          7: () => { alt.emit("selectMenu.show", "gang_storage_11"); },
        },
        "gang_storage_12_8": {
          0: () => { alt.emit("take.gang.weapons.safe", 111, true); },
          1: () => { alt.emit("take.gang.weapons.safe", 112, true); },
          2: () => { alt.emit("take.gang.weapons.safe", 113, true); },
          3: () => { alt.emit("take.gang.weapons.safe", 114, true); },
          4: () => { alt.emit("take.gang.weapons.safe", 115, true); },
          5: () => { alt.emit("take.gang.weapons.safe", 116, true); },
          6: () => { alt.emit("take.gang.weapons.safe", 117, true); },
          7: () => { alt.emit("selectMenu.show", "gang_storage_12"); },
        },
        "gang_storage_11_9": {
          0: () => { alt.emit("take.gang.weapons.safe", 118, false); },
          1: () => { alt.emit("take.gang.weapons.safe", 119, false); },
          2: () => { alt.emit("take.gang.weapons.safe", 120, false); },
          3: () => { alt.emit("take.gang.weapons.safe", 121, false); },
          4: () => { alt.emit("take.gang.weapons.safe", 122, false); },
          5: () => { alt.emit("selectMenu.show", "gang_storage_11"); },
        },
        "gang_storage_12_9": {
          0: () => { alt.emit("take.gang.weapons.safe", 118, true); },
          1: () => { alt.emit("take.gang.weapons.safe", 119, true); },
          2: () => { alt.emit("take.gang.weapons.safe", 120, true); },
          3: () => { alt.emit("take.gang.weapons.safe", 121, true); },
          4: () => { alt.emit("take.gang.weapons.safe", 122, true); },
          5: () => { alt.emit("selectMenu.show", "gang_storage_12"); },
        },
        "gang_storage_11_10": {
          0: () => { alt.emit("take.gang.weapons.safe", 123, false); },
          1: () => { alt.emit("take.gang.weapons.safe", 124, false); },
          2: () => { alt.emit("selectMenu.show", "gang_storage_11"); },
        },
        "gang_storage_12_10": {
          0: () => { alt.emit("take.gang.weapons.safe", 123, true); },
          1: () => { alt.emit("take.gang.weapons.safe", 124, true); },
          2: () => { alt.emit("selectMenu.show", "gang_storage_12"); },
        },

        "police_storage_2": {
            "Служебное вооружение": () => {
                alt.emit("selectMenu.show", "police_guns_2");
            },
            "Гардероб": () => {
                alt.emit("selectMenu.show", "police_clothes_2");
            },
            "Спец. предметы": () => {
                alt.emit("selectMenu.show", "police_items_2");
            },
            "Патроны": () => {
                alt.emit("selectMenu.show", "police_ammo_2");
            },
        },
        "police_guns_2": {
            "Nightstick": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeGun`, 0);
            },
            "Flashlight": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeGun`, 1);
            },
            "Stun Gun": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeGun`, 2);
            },
            "Combat Pistol": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeGun`, 3);
            },
            "Pump Shotgun": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeGun`, 4);
            },
            "Carbine Rifle": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeGun`, 5);
            },
            "Sniper Rifle": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeGun`, 6);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "police_storage_2");
            }
        },
        "police_items_2": {
            "Удостоверение LSSD": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeItem`, 0);
            },
            "Рация": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeItem`, 1);
            },
            "Наручники": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeItem`, 2);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "police_storage_2", 2);
            }
        },
        "police_ammo_2": {
            "Combat Pistol - 9mm": (value) => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeAmmo`, 0, parseInt(value));
            },
            "Pump Shotgun - 12mm": (value) => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeAmmo`, 1, parseInt(value));
            },
            "Carbine Rifle - 5.56mm": (value) => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeAmmo`, 2, parseInt(value));
            },
            "Sniper Rifle - 7.62mm": (value) => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeAmmo`, 3, parseInt(value));
            },
            "Вернуться": (value) => {
                alt.emit("selectMenu.show", "police_storage_2", 3);
            }
        },
        "police_clothes_2": {
            "Спец. форма №1": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeClothes`, 0);
            },
            "Форма Кадета": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeClothes`, 1);
            },
            "Форма Помощника Шерифа": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeClothes`, 2);
            },
            "Форма Сержанта": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeClothes`, 3);
            },
            "Форма Лейтенанта": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeClothes`, 4);
            },
            "Форма Капитана": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeClothes`, 5);
            },
            "Форма Шерифа": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeClothes`, 6);
            },
            "Бронежилет": () => {
                if (!alt.isFlood()) alt.emitServer(`policeStorage.takeArmour`);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "police_storage", 1);
            }
        },
        "police_service_2": {
            "Восстановление вещей": () => {
                alt.emit("selectMenu.show", "police_service_recovery_2");
            },
            "Оплата штрафа": () => {
                alt.emitServer("policeService.showClearFine");
                alt.emit("selectMenu.hide");
            },
        },
        "police_service_recovery_2": {
            "Документы": () => {
                alt.emitServer("policeService.recovery.documents");
            },
            "Ключи от авто": () => {
                alt.emitServer("policeService.recovery.carKeys");
            },
            "Ключи от дома": (value) => {
                if (!value) return alt.emit(`nError`, `У Вас нет дома!`);
                alt.emitServer("policeService.recovery.houseKeys", parseInt(value.substr(1)));
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "police_service_2");
            }
        },

        "gover_storage": {
            "Служебное вооружение": () => {
                alt.emit("selectMenu.show", "gover_guns");
            },
            "Гардероб": () => {
                alt.emit("selectMenu.show", "gover_clothes");
            },
            "Спец. предметы": () => {
                alt.emit("selectMenu.show", "gover_items");
            },
            "Патроны": () => {
                alt.emit("selectMenu.show", "gover_ammo");
            },
        },
        "gover_guns": {
            "Combat Pistol": () => {
                if (!alt.isFlood()) alt.emitServer(`goverStorage.takeGun`, 0);
            },
            "Pump Shotgun": () => {
                if (!alt.isFlood()) alt.emitServer(`goverStorage.takeGun`, 1);
            },
            "Carbine Rifle": () => {
                if (!alt.isFlood()) alt.emitServer(`goverStorage.takeGun`, 2);
            },
            "Электрошокер": () => {
                if (!alt.isFlood()) alt.emitServer(`goverStorage.takeGun`, 3);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "gover_storage");
            }
        },
        "gover_clothes": {
            "Комплект №1": () => {
                if (!alt.isFlood()) alt.emitServer(`goverStorage.takeClothes`, 0);
            },
            "Комплект №2": () => {
                if (!alt.isFlood()) alt.emitServer(`goverStorage.takeClothes`, 1);
            },
            "Бронежилет": () => {
                if (!alt.isFlood()) alt.emitServer(`goverStorage.takeArmour`);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "gover_storage", 1);
            }
        },
        "gover_items": {
            "Рация": () => {
                if (!alt.isFlood()) alt.emitServer(`goverStorage.takeItem`, 0);
            },
            "Наручники": () => {
                if (!alt.isFlood()) alt.emitServer(`goverStorage.takeItem`, 1);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "gover_storage", 2);
            }
        },
        "gover_ammo": {
            "Combat Pistol - 9mm": (value) => {
                if (!alt.isFlood()) alt.emitServer(`goverStorage.takeAmmo`, 0, parseInt(value));
            },
            "Pump Shotgun - 12mm": (value) => {
                if (!alt.isFlood()) alt.emitServer(`goverStorage.takeAmmo`, 1, parseInt(value));
            },
            "Carbine Rifle - 5.56mm": (value) => {
                if (!alt.isFlood()) alt.emitServer(`goverStorage.takeAmmo`, 2, parseInt(value));
            },
            "Sniper Rifle - 7.62mm": (value) => {
                if (!alt.isFlood()) alt.emitServer(`goverStorage.takeAmmo`, 3, parseInt(value));
            },
            "Вернуться": (value) => {
                alt.emit("selectMenu.show", "gover_storage", 3);
            }
        },

        "army_storage": {
            "Служебное вооружение": () => {
                alt.emit("selectMenu.show", "army_guns");
            },
            "Гардероб": () => {
                alt.emit("selectMenu.show", "army_clothes");
            },
            "Спец. предметы": () => {
                alt.emit("selectMenu.show", "army_items");
            },
            "Патроны": () => {
                alt.emit("selectMenu.show", "army_ammo");
            },
        },
        "army_guns": {
            "Combat Pistol": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeGun`, 0);
            },
            "Pump Shotgun": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeGun`, 1);
            },
            "Carbine Rifle": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeGun`, 2);
            },
            "Sniper Rifle": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeGun`, 3);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "army_storage");
            }
        },
        "army_items": {
            "Удостоверение Army": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeItem`, 0);
            },
            "Рация": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeItem`, 1);
            },
            "Наручники": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeItem`, 2);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "army_storage", 2);
            }
        },
        "army_clothes": {
            "Форма рекрута": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeClothes`, 0);
            },
            "Тактический набор №1": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeClothes`, 1);
            },
            "Отдел IB": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeClothes`, 2);
            },
            "Отдел FZA": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeClothes`, 3);
            },
            "Боевая форма TFB": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeClothes`, 4);
            },
            "Отдел MLG": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeClothes`, 5);
            },
            "Армейская форма №1": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeClothes`, 6);
            },
            "Армейская форма №2": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeClothes`, 7);
            },
            "Бронежилет": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeArmour`);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "army_storage", 1);
            }
        },
        "army_ammo": {
            "Combat Pistol - 9mm": (value) => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeAmmo`, 0, parseInt(value));
            },
            "Pump Shotgun - 12mm": (value) => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeAmmo`, 1, parseInt(value));
            },
            "Carbine Rifle - 5.56mm": (value) => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeAmmo`, 2, parseInt(value));
            },
            "Sniper Rifle - 7.62mm": (value) => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeAmmo`, 3, parseInt(value));
            },
            "Вернуться": (value) => {
                alt.emit("selectMenu.show", "army_storage", 2);
            }
        },

        "news_storage": {
            "Гардероб": () => {
                alt.emit("selectMenu.show", "news_storage_1");
            },
            "Спец. предметы": () => {
                alt.emit("selectMenu.show", "news_storage_2");
            },
        },
        "news_storage_1": {
            "Бронежилет": () => {
                if (!alt.isFlood()) alt.emitServer(`newsStorage.takeArmour`);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "news_storage");
            },
        },
        "news_storage_2": {
            "Рация": () => {
                if (!alt.isFlood()) alt.emitServer(`newsStorage.takeRation`);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "news_storage");
            },
        },

        "army_storage_2": {
            "Служебное вооружение": () => {
                alt.emit("selectMenu.show", "army_guns_2");
            },
            "Гардероб": () => {
                alt.emit("selectMenu.show", "army_clothes_2");
            },
            "Спец. предметы": () => {
                alt.emit("selectMenu.show", "army_items_2");
            },
            "Патроны": () => {
                alt.emit("selectMenu.show", "army_ammo_2");
            },
        },
        "army_guns_2": {
            "Combat Pistol": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeGun`, 0);
            },
            "Pump Shotgun": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeGun`, 1);
            },
            "Carbine Rifle": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeGun`, 2);
            },
            "Sniper Rifle": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeGun`, 3);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "army_storage_2");
            }
        },
        "army_items_2": {
            "Удостоверение Army": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeItem`, 0);
            },
            "Рация": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeItem`, 1);
            },
            "Наручники": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeItem`, 2);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "army_storage_2", 2);
            }
        },
        "army_clothes_2": {
            "Отряд - GRS": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeClothes`, 0);
            },
            "Отряд - TLS": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeClothes`, 1);
            },
            "Отряд - FHS": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeClothes`, 2);
            },
            "Армейская форма": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeClothes`, 3);
            },
            "Спец. форма": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeClothes`, 4);
            },
            "Бронежилет": () => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeArmour`);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "army_storage_2", 1);
            }
        },
        "army_ammo_2": {
            "Combat Pistol - 9mm": (value) => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeAmmo`, 0, parseInt(value));
            },
            "Pump Shotgun - 12mm": (value) => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeAmmo`, 1, parseInt(value));
            },
            "Carbine Rifle - 5.56mm": (value) => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeAmmo`, 2, parseInt(value));
            },
            "Sniper Rifle - 7.62mm": (value) => {
                if (!alt.isFlood()) alt.emitServer(`armyStorage.takeAmmo`, 3, parseInt(value));
            },
            "Вернуться": (value) => {
                alt.emit("selectMenu.show", "army_storage_2", 2);
            }
        },
        "fib_storage": {
            "Служебное вооружение": () => {
                alt.emit("selectMenu.show", "fib_guns");
            },
            "Гардероб": () => {
                alt.emit("selectMenu.show", "fib_clothes");
            },
            "Спец. предметы": () => {
                alt.emit("selectMenu.show", "fib_items");
            },
            "Патроны": () => {
                alt.emit("selectMenu.show", "fib_ammo");
            },
        },
        "info_smuggling": {
            "Местоположение сырья": () => {

            },
            "Местоположение лаборатории": () => {

            },
            "Местоположение точки сбыта": () => {

            },
        },
        "fib_guns": {
            "Nightstick": () => {
                if (!alt.isFlood()) alt.emitServer(`fibStorage.takeGun`, 0);
            },
            "Flashlight": () => {
                if (!alt.isFlood()) alt.emitServer(`fibStorage.takeGun`, 1);
            },
            "Stun Gun": () => {
                if (!alt.isFlood()) alt.emitServer(`fibStorage.takeGun`, 2);
            },
            "Combat Pistol": () => {
                if (!alt.isFlood()) alt.emitServer(`fibStorage.takeGun`, 3);
            },
            "Pump Shotgun": () => {
                if (!alt.isFlood()) alt.emitServer(`fibStorage.takeGun`, 4);
            },
            "Carbine Rifle": () => {
                if (!alt.isFlood()) alt.emitServer(`fibStorage.takeGun`, 5);
            },
            "Sniper Rifle": () => {
                if (!alt.isFlood()) alt.emitServer(`fibStorage.takeGun`, 6);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "fib_storage");
            }
        },
        "fib_items": {
            "Удостоверение FIB": () => {
                if (!alt.isFlood()) alt.emitServer(`fibStorage.takeItem`, 0);
            },
            "Рация": () => {
                if (!alt.isFlood()) alt.emitServer(`fibStorage.takeItem`, 1);
            },
            "Наручники": () => {
                if (!alt.isFlood()) alt.emitServer(`fibStorage.takeItem`, 2);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "fib_storage", 2);
            }
        },
        "fib_ammo": {
            "Combat Pistol - 9mm": (value) => {
                if (!alt.isFlood()) alt.emitServer(`fibStorage.takeAmmo`, 0, parseInt(value));
            },
            "Pump Shotgun - 12mm": (value) => {
                if (!alt.isFlood()) alt.emitServer(`fibStorage.takeAmmo`, 1, parseInt(value));
            },
            "Carbine Rifle - 5.56mm": (value) => {
                if (!alt.isFlood()) alt.emitServer(`fibStorage.takeAmmo`, 2, parseInt(value));
            },
            "Sniper Rifle - 7.62mm": (value) => {
                if (!alt.isFlood()) alt.emitServer(`fibStorage.takeAmmo`, 3, parseInt(value));
            },
            "Вернуться": (value) => {
                alt.emit("selectMenu.show", "fib_storage", 3);
            }
        },
        "fib_clothes": {
            "Стажер": () => {
                if (!alt.isFlood()) alt.emitServer(`fibStorage.takeClothes`, 0);
            },
            "Агент": () => {
                if (!alt.isFlood()) alt.emitServer(`fibStorage.takeClothes`, 1);
            },
            "Тактический набор №1": () => {
                if (!alt.isFlood()) alt.emitServer(`fibStorage.takeClothes`, 2);
            },
            "Тактический набор №2": () => {
                if (!alt.isFlood()) alt.emitServer(`fibStorage.takeClothes`, 3);
            },
            "Форма снайпера": () => {
                if (!alt.isFlood()) alt.emitServer(`fibStorage.takeClothes`, 4);
            },
            "Бронежилет": () => {
                if (!alt.isFlood()) alt.emitServer(`fibStorage.takeArmour`);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "fib_storage", 1);
            }
        },

        "hospital_storage": {
            "Служебные принадлежности": () => {
                alt.emit("selectMenu.show", "hospital_items");
            },
            "Гардероб": () => {
                alt.emit("selectMenu.show", "hospital_clothes");
            }
        },
        "hospital_items": {
            "Аптечка": () => {
                if (!alt.isFlood()) alt.emitServer(`hospitalStorage.takeItem`, 0);
            },
            "Пластырь": () => {
                if (!alt.isFlood()) alt.emitServer(`hospitalStorage.takeItem`, 1);
            },
            "Удостоверение Hospital": (value) => {
                if (!alt.isFlood()) alt.emitServer(`hospitalStorage.takeItem`, 2);
            },
            "Рация": (value) => {
                if (!alt.isFlood()) alt.emitServer(`hospitalStorage.takeItem`, 3);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "hospital_storage");
            }
        },
        "hospital_clothes": {
            "Форма парамедика №1": () => {
                if (!alt.isFlood()) alt.emitServer(`hospitalStorage.takeClothes`, 0);
            },
            "Форма парамедика №2": () => {
                if (!alt.isFlood()) alt.emitServer(`hospitalStorage.takeClothes`, 1);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "hospital_storage", 1);
            }
        },

        "band_dealer_menu": {
            "Оружия": () => {
                alt.emit("selectMenu.show", "band_dealer_menu_guns");
            },
            "Патроны": () => {
                alt.emit("selectMenu.show", "band_dealer_menu_ammo");
            },
            "Наркотики": () => {
                alt.emit("selectMenu.show", "band_dealer_menu_drugs");
            },
            "Предметы": () => {
                alt.emit("selectMenu.show", "band_dealer_menu_items");
            },
            "Маски": () => {
                alt.emit("selectMenu.show", "band_dealer_menu_masks");
            },
        },
        "band_dealer_menu_guns": {
            "Холодное оружие": () => {
                alt.emit("selectMenu.show", "band_dealer_menu_melee");
            },
            "Пистолеты": () => {
                alt.emit("selectMenu.show", "band_dealer_menu_handguns");
            },
            "Пистолеты-пулеметы": () => {
                alt.emit("selectMenu.show", "band_dealer_menu_submachine_guns");
            },
            "Ружья": () => {
                alt.emit("selectMenu.show", "band_dealer_menu_shotguns");
            },
            "Штурмовые винтовки": () => {
                alt.emit("selectMenu.show", "band_dealer_menu_assault_rifles");
            },
            "Легкие пулеметы": () => {
                alt.emit("selectMenu.show", "band_dealer_menu_light_machine_guns");
            },
            "Снайперские винтовки": () => {
                alt.emit("selectMenu.show", "band_dealer_menu_sniper_rifles");
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "band_dealer_menu");
            },
        },
        "band_dealer_menu_melee": {
            "Бейсбольная бита | $200": () => {
                alt.emitServer(`bandDealer.buyGun`, 41);
            },
            "Кастет | $75": () => {
                alt.emitServer(`bandDealer.buyGun`, 42);
            },
            "Нож | $200": () => {
                alt.emitServer(`bandDealer.buyGun`, 72);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", `band_dealer_menu_guns`);
            },
        },
        "band_dealer_menu_handguns": {
            "Pistol | $2810": () => {
                alt.emitServer(`bandDealer.buyGun`, 44);
            },
            "Pistol-50 | $7000": () => {
                alt.emitServer(`bandDealer.buyGun`, 125);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", `band_dealer_menu_guns`, 1);
            },
        },
        "band_dealer_menu_submachine_guns": {
            "Micro SMG | $3820": () => {
                alt.emitServer(`bandDealer.buyGun`, 47);
            },
            "SMG | $4650": () => {
                alt.emitServer(`bandDealer.buyGun`, 48);
            },
            "Machine Pistol | $5700": () => {
                alt.emitServer(`bandDealer.buyGun`, 89);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", `band_dealer_menu_guns`, 2);
            },
        },
        "band_dealer_menu_shotguns": {
            "Sawnoff Shotgun | $4000": () => {
                alt.emitServer(`bandDealer.buyGun`, 49);
            },
            "Pump Shotgun | $4550": () => {
                alt.emitServer(`bandDealer.buyGun`, 21);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", `band_dealer_menu_guns`, 3);
            },
        },
        "anim_gesture": {
            "Воздушная гитара": () => {
                alt.emitServer(`animation.set`, 0);
            },
            "Изображать секс": () => {
                alt.emitServer(`animation.set`, 1);
            },
            "Невидимое пианино": () => {
                alt.emitServer(`animation.set`, 2);
            },
            "Воздушный поцелуй": () => {
                alt.emitServer(`animation.set`, 3);
            },
            "Выразить уважение": () => {
                alt.emitServer(`animation.set`, 4);
            },
            "Изображать цыпленка": () => {
                alt.emitServer(`animation.set`, 5);
            },
            "Изобразить DJ'я": () => {
                alt.emitServer(`animation.set`, 6);
            },
            "Фейс палм": () => {
                alt.emitServer(`animation.set`, 7);
            },
            "Показать всем фак": () => {
                alt.emitServer(`animation.set`, 8);
            },
            "Беллиссимо": () => {
                alt.emitServer(`animation.set`, 9);
            },
            "Сюрприз": () => {
                alt.emitServer(`animation.set`, 10);
            },
            "Разминать кулаки": () => {
                alt.emitServer(`animation.set`, 11);
            },
            "Нет нет нет!": () => {
                alt.emitServer(`animation.set`, 12);
            },
            "Ковыряться в носу": () => {
                alt.emitServer(`animation.set`, 13);
            },
            "Всем peace!": () => {
                alt.emitServer(`animation.set`, 14);
            },
            "Сорить деньгами!": () => {
                alt.emitServer(`animation.set`, 15);
            },
            "Медленно аплодировать": () => {
                alt.emitServer(`animation.set`, 16);
            },
            "Кривляться": () => {
                alt.emitServer(`animation.set`, 17);
            },
            "Лайк": () => {
                alt.emitServer(`animation.set`, 18);
            },
            "Дайте 2": () => {
                alt.emitServer(`animation.set`, 19);
            },
            "Крутить пальцем у виска": () => {
                alt.emitServer(`animation.set`, 20);
            },
        },
        "anim_dance1": {
            "Танец 1": () => {
                alt.emitServer(`animation.set`, 21);
            },
            "Танец 2": () => {
                alt.emitServer(`animation.set`, 22);
            },
            "Танец 3": () => {
                alt.emitServer(`animation.set`, 23);
            },
            "Танец 4": () => {
                alt.emitServer(`animation.set`, 24);
            },
            "Танец 5": () => {
                alt.emitServer(`animation.set`, 25);
            },
            "Танец 6": () => {
                alt.emitServer(`animation.set`, 26);
            },
            "Танец 7": () => {
                alt.emitServer(`animation.set`, 27);
            },
            "Танец 8": () => {
                alt.emitServer(`animation.set`, 28);
            },
            "Танец 9": () => {
                alt.emitServer(`animation.set`, 29);
            },
            "Танец 10": () => {
                alt.emitServer(`animation.set`, 30);
            },
            "Танец 11": () => {
                alt.emitServer(`animation.set`, 31);
            },
            "Танец 12": () => {
                alt.emitServer(`animation.set`, 32);
            },
            "Танец 13": () => {
                alt.emitServer(`animation.set`, 33);
            },
            "Танец 14": () => {
                alt.emitServer(`animation.set`, 34);
            },
            "Танец 15": () => {
                alt.emitServer(`animation.set`, 35);
            },
            "Танец 16": () => {
                alt.emitServer(`animation.set`, 36);
            },
            "Танец 17": () => {
                alt.emitServer(`animation.set`, 37);
            },
            "Танец 18": () => {
                alt.emitServer(`animation.set`, 38);
            },
            "Танец 19": () => {
                alt.emitServer(`animation.set`, 39);
            },
            "Танец 20": () => {
                alt.emitServer(`animation.set`, 40);
            },
            "Танец 21": () => {
                alt.emitServer(`animation.set`, 41);
            },
            "Танец 22": () => {
                alt.emitServer(`animation.set`, 42);
            },
            "Танец 23": () => {
                alt.emitServer(`animation.set`, 43);
            },
            "Танец 24": () => {
                alt.emitServer(`animation.set`, 44);
            },
            "Танец 25": () => {
                alt.emitServer(`animation.set`, 45);
            },
            "Танец 26": () => {
                alt.emitServer(`animation.set`, 46);
            },
            "Танец 27": () => {
                alt.emitServer(`animation.set`, 47);
            },
            "Танец 28": () => {
                alt.emitServer(`animation.set`, 48);
            },
            "Танец 29": () => {
                alt.emitServer(`animation.set`, 49);
            },
            "Танец 30": () => {
                alt.emitServer(`animation.set`, 50);
            },
            "Танец 31": () => {
                alt.emitServer(`animation.set`, 51);
            },
            "Танец 32": () => {
                alt.emitServer(`animation.set`, 52);
            },
            "Танец 33": () => {
                alt.emitServer(`animation.set`, 53);
            },
            "Танец 34": () => {
                alt.emitServer(`animation.set`, 54);
            },
            "Танец 35": () => {
                alt.emitServer(`animation.set`, 55);
            },
        },
        "anim_dance2": {
            "Танец 1": () => {
                alt.emitServer(`animation.set`, 56);
            },
            "Танец 2": () => {
                alt.emitServer(`animation.set`, 57);
            },
            "Танец 3": () => {
                alt.emitServer(`animation.set`, 58);
            },
            "Танец 4": () => {
                alt.emitServer(`animation.set`, 59);
            },
            "Танец 5": () => {
                alt.emitServer(`animation.set`, 60);
            },
            "Танец 6": () => {
                alt.emitServer(`animation.set`, 61);
            },
            "Танец 7": () => {
                alt.emitServer(`animation.set`, 62);
            },
            "Танец 8": () => {
                alt.emitServer(`animation.set`, 63);
            },
            "Танец 9": () => {
                alt.emitServer(`animation.set`, 64);
            },
            "Танец 10": () => {
                alt.emitServer(`animation.set`, 65);
            },
            "Танец 11": () => {
                alt.emitServer(`animation.set`, 66);
            },
            "Танец 12": () => {
                alt.emitServer(`animation.set`, 67);
            },
            "Танец 13": () => {
                alt.emitServer(`animation.set`, 68);
            },
            "Танец 14": () => {
                alt.emitServer(`animation.set`, 69);
            },
            "Танец 15": () => {
                alt.emitServer(`animation.set`, 70);
            },
            "Танец 16": () => {
                alt.emitServer(`animation.set`, 71);
            },
            "Танец 17": () => {
                alt.emitServer(`animation.set`, 72);
            },
            "Танец 18": () => {
                alt.emitServer(`animation.set`, 73);
            },
            "Танец 19": () => {
                alt.emitServer(`animation.set`, 74);
            },
            "Танец 20": () => {
                alt.emitServer(`animation.set`, 75);
            },
            "Танец 21": () => {
                alt.emitServer(`animation.set`, 76);
            },
            "Танец 22": () => {
                alt.emitServer(`animation.set`, 77);
            },
            "Танец 23": () => {
                alt.emitServer(`animation.set`, 78);
            },
            "Танец 24": () => {
                alt.emitServer(`animation.set`, 79);
            },
            "Танец 25": () => {
                alt.emitServer(`animation.set`, 80);
            },
            "Танец 26": () => {
                alt.emitServer(`animation.set`, 81);
            },
            "Танец 27": () => {
                alt.emitServer(`animation.set`, 82);
            },
            "Танец 28": () => {
                alt.emitServer(`animation.set`, 83);
            },
            "Танец 29": () => {
                alt.emitServer(`animation.set`, 84);
            },
            "Танец 30": () => {
                alt.emitServer(`animation.set`, 85);
            },
            "Танец 31": () => {
                alt.emitServer(`animation.set`, 86);
            },
            "Танец 32": () => {
                alt.emitServer(`animation.set`, 87);
            },
            "Танец 33": () => {
                alt.emitServer(`animation.set`, 88);
            },
            "Танец 34": () => {
                alt.emitServer(`animation.set`, 89);
            },
            "Танец 35": () => {
                alt.emitServer(`animation.set`, 90);
            },
        },
        "anim_actions": {
            "Блевать сидя": () => {
                alt.emitServer(`animation.set`, 91);
            },
            "Стучать в дверь": () => {
                alt.emitServer(`animation.set`, 92);
            },
            "Охеревать": () => {
                alt.emitServer(`animation.set`, 93);
            },
            "Стряхнуть пыль с одежды": () => {
                alt.emitServer(`animation.set`, 94);
            },
            "Разговаривать по телефону": () => {
                alt.emitServer(`animation.set`, 95);
            },
            "В раздумиях": () => {
                alt.emitServer(`animation.set`, 96);
            },
            "Попросить успокоится": () => {
                alt.emitServer(`animation.set`, 97);
            },
            "Поднять руки": () => {
                alt.emitServer(`animation.set`, 98);
            },
            "Нервничать": () => {
                alt.emitServer(`animation.set`, 99);
            },
            "Руки за головой": () => {
                alt.emitServer(`animation.set`, 100);
            },
            "Гневаться на небеса": () => {
                alt.emitServer(`animation.set`, 101);
            },
            "Отлить": () => {
                alt.emitServer(`animation.set`, 102);
            },
            "На старт": () => {
                alt.emitServer(`animation.set`, 103);
            },
            "Махать руками": () => {
                alt.emitServer(`animation.set`, 104);
            },
            "Лежать связанным": () => {
                alt.emitServer(`animation.set`, 105);
            },
            "Молиться": () => {
                alt.emitServer(`animation.set`, 106);
            },
            "Попросить пройти": () => {
                alt.emitServer(`animation.set`, 107);
            },
            "Поднять руки": () => {
                alt.emitServer(`animation.set`, 108);
            },
            "Прикрыть голову 1": () => {
                alt.emitServer(`animation.set`, 109);
            },
            "Прикрыть голову 2": () => {
                alt.emitServer(`animation.set`, 110);
            },
            "Прикрыть голову 3": () => {
                alt.emitServer(`animation.set`, 111);
            },
            "Складывать в сумку": () => {
                alt.emitServer(`animation.set`, 112);
            },
        },
        "anim_sport": {
            "Разминка 1": () => {
                alt.emitServer(`animation.set`, 113);
            },
            "Разминка 2": () => {
                alt.emitServer(`animation.set`, 114);
            },
            "Разминка 3": () => {
                alt.emitServer(`animation.set`, 115);
            },
            "Разминка 4": () => {
                alt.emitServer(`animation.set`, 116);
            },
            "Разминка 5": () => {
                alt.emitServer(`animation.set`, 117);
            },
            "Разтяжка": () => {
                alt.emitServer(`animation.set`, 118);
            },
            "Йога 1": () => {
                alt.emitServer(`animation.set`, 119);
            },
            "Йога 2": () => {
                alt.emitServer(`animation.set`, 120);
            },
            "Йога 3": () => {
                alt.emitServer(`animation.set`, 121);
            },
        },
        "anim_lay": {
            "Лежать 1": () => {
                alt.emitServer(`animation.set`, 122);
            },
            "Лежать 2": () => {
                alt.emitServer(`animation.set`, 123);
            },
            "Лежать 3": () => {
                alt.emitServer(`animation.set`, 124);
            },
        },
        "anim_sit": {
            "Сидеть 1": () => {
                alt.emitServer(`animation.set`, 125);
            },
            "Cидеть 2": () => {
                alt.emitServer(`animation.set`, 126);
            },
            "Cидеть 3": () => {
                alt.emitServer(`animation.set`, 127);
            },
            "Cидеть 4": () => {
                alt.emitServer(`animation.set`, 128);
            },
            "Cидеть 5": () => {
                alt.emitServer(`animation.set`, 129);
            },
            "Cидеть 6": () => {
                alt.emitServer(`animation.set`, 130);
            },
        },
        "anim_stand": {
            "Ожидать 1": () => {
                alt.emitServer(`animation.set`, 131);
            },
            "Ожидать 2": () => {
                alt.emitServer(`animation.set`, 132);
            },
            "Ожидать 3": () => {
                alt.emitServer(`animation.set`, 133);
            },
            "Оперется 1": () => {
                alt.emitServer(`animation.set`, 134);
            },
            "Оперется 2": () => {
                alt.emitServer(`animation.set`, 135);
            },
            "Уставший": () => {
                alt.emitServer(`animation.set`, 136);
            },
            "Сосредоточенный": () => {
                alt.emitServer(`animation.set`, 137);
            },
        },
        "anim_sex": {
            "Мужчина 1": () => {
                alt.emitServer(`animation.set`, 138);
            },
            "Мужчина 2": () => {
                alt.emitServer(`animation.set`, 139);
            },
            "Мужчина 3": () => {
                alt.emitServer(`animation.set`, 140);
            },
            "Женщина 1": () => {
                alt.emitServer(`animation.set`, 141);
            },
            "Женщина 2": () => {
                alt.emitServer(`animation.set`, 142);
            },
            "Женщина 3": () => {
                alt.emitServer(`animation.set`, 143);
            },
            "Женщина 4": () => {
                alt.emitServer(`animation.set`, 144);
            },
        },
        "social": {
            "Пить кофе": () => {
                alt.emitServer(`scenario.set`, 0);
            },
            "Курить сигарету": () => {
                alt.emitServer(`scenario.set`, 1);
            },
            "Смотреть в бинокль": () => {
                alt.emitServer(`scenario.set`, 2);
            },
            "Умываться": () => {
                alt.emitServer(`scenario.set`, 3);
            },
            "Просить милостыню": () => {
                alt.emitServer(`scenario.set`, 4);
            },
            "Ожидать": () => {
                alt.emitServer(`scenario.set`, 5);
            },
            "Умываться": () => {
                alt.emitServer(`scenario.set`, 6);
            },
            "Аплодировать": () => {
                alt.emitServer(`scenario.set`, 7);
            },
            "Курить косяк": () => {
                alt.emitServer(`scenario.set`, 8);
            },
            "Снимать на телефон": () => {
                alt.emitServer(`scenario.set`, 9);
            },
            "Греться у костра": () => {
                alt.emitServer(`scenario.set`, 10);
            },
            "Ждать": () => {
                alt.emitServer(`scenario.set`, 11);
            },
            "Тусоваться": () => {
                alt.emitServer(`scenario.set`, 12);
            },
            "Писать СМС": () => {
                alt.emitServer(`scenario.set`, 13);
            },
            "Смотреть стриптиз": () => {
                alt.emitServer(`scenario.set`, 14);
            },
            "Ступор": () => {
                alt.emitServer(`scenario.set`, 15);
            },
            "Смотреть карту": () => {
                alt.emitServer(`scenario.set`, 16);
            },
            "Делать селфи": () => {
                alt.emitServer(`scenario.set`, 17);
            },
            "Копаться в мусорке": () => {
                alt.emitServer(`scenario.set`, 18);
            },
            "Считать мелочь": () => {
                alt.emitServer(`scenario.set`, 19);
            },
            "Ждать попутку": () => {
                alt.emitServer(`scenario.set`, 20);
            },
            "Пить пиво": () => {
                alt.emitServer(`scenario.set`, 21);
            },
        },
        "works": {
            "Парковщик": () => {
                alt.emitServer(`scenario.set`, 22);
            },
            "Строитель 1": () => {
                alt.emitServer(`scenario.set`, 23);
            },
            "Строитель 2": () => {
                alt.emitServer(`scenario.set`, 24);
            },
            "Садовник 1": () => {
                alt.emitServer(`scenario.set`, 25);
            },
            "Садовник 2": () => {
                alt.emitServer(`scenario.set`, 26);
            },
            "Детектив 1": () => {
                alt.emitServer(`scenario.set`, 27);
            },
            "Детектив 2": () => {
                alt.emitServer(`scenario.set`, 28);
            },
            "Детектив 3": () => {
                alt.emitServer(`scenario.set`, 29);
            },
            "Охраник 1": () => {
                alt.emitServer(`scenario.set`, 30);
            },
            "Охраник 2": () => {
                alt.emitServer(`scenario.set`, 31);
            },
            "Охраник 3": () => {
                alt.emitServer(`scenario.set`, 32);
            },
            "Уборщик 1": () => {
                alt.emitServer(`scenario.set`, 33);
            },
            "Уборщик 2": () => {
                alt.emitServer(`scenario.set`, 34);
            },
            "Музыкант": () => {
                alt.emitServer(`scenario.set`, 35);
            },
            "Фотограф": () => {
                alt.emitServer(`scenario.set`, 36);
            },
            "Проститутка 1": () => {
                alt.emitServer(`scenario.set`, 37);
            },
            "Проститутка 2": () => {
                alt.emitServer(`scenario.set`, 38);
            },
            "Рыбак": () => {
                alt.emitServer(`scenario.set`, 39);
            },
            "Механик 1": () => {
                alt.emitServer(`scenario.set`, 40);
            },
            "Механик 2": () => {
                alt.emitServer(`scenario.set`, 41);
            },
            "Повар": () => {
                alt.emitServer(`scenario.set`, 42);
            },
            "Сварщик": () => {
                alt.emitServer(`scenario.set`, 43);
            },
            "Мим": () => {
                alt.emitServer(`scenario.set`, 44);
            },
        },
        "sport": {
            "Позировать": () => {
                alt.emitServer(`scenario.set`, 45);
            },
            "Качать бицепс": () => {
                alt.emitServer(`scenario.set`, 46);
            },
            "Отжиматься": () => {
                alt.emitServer(`scenario.set`, 47);
            },
            "Качать пресс": () => {
                alt.emitServer(`scenario.set`, 48);
            },
            "Подтягиваться": () => {
                alt.emitServer(`scenario.set`, 49);
            },
            "Жим лежа": () => {
                alt.emitServer(`scenario.set`, 50);
            },
            "Бег на месте": () => {
                alt.emitServer(`scenario.set`, 51);
            },
        },
        "lay": {
            "Лежать на боку": () => {
                alt.emitServer(`scenario.set`, 52);
            },
            "Лежать на животе": () => {
                alt.emitServer(`scenario.set`, 53);
            },
            "Лежать на спине": () => {
                alt.emitServer(`scenario.set`, 54);
            },
        },
        "stand": {
            "Руки на пояс": () => {
                alt.emitServer(`scenario.set`, 55);
            },
            "Тусоваться": () => {
                alt.emitServer(`scenario.set`, 56);
            },
            "Статуя": () => {
                alt.emitServer(`scenario.set`, 57);
            },
            "Курить": () => {
                alt.emitServer(`scenario.set`, 58);
            },
            "Греться у костра": () => {
                alt.emitServer(`scenario.set`, 59);
            },
        },
        "sit": {
            "Сидеть на земле": () => {
                alt.emitServer(`scenario.set`, 60);
            },
            "Сидеть на уступе": () => {
                alt.emitServer(`scenario.set`, 61);
            },
            "Сидеть на ступеньках": () => {
                alt.emitServer(`scenario.set`, 62);
            },
            "Сидеть на стене": () => {
                alt.emitServer(`scenario.set`, 63);
            },
            "Ступор": () => {
                alt.emitServer(`scenario.set`, 64);
            },
            "Сидеть в кресле": () => {
                alt.emitServer(`scenario.set`, 65);
            },
            "За барной стойкой": () => {
                alt.emitServer(`scenario.set`, 66);
            },
            "Сидеть на скамье": () => {
                alt.emitServer(`scenario.set`, 67);
            },
            "Сидеть на остановке": () => {
                alt.emitServer(`scenario.set`, 68);
            },
            "Сидеть на стуле": () => {
                alt.emitServer(`scenario.set`, 69);
            },
            "Сидеть за ПК": () => {
                alt.emitServer(`scenario.set`, 70);
            },
            "Сидеть на шезлонге": () => {
                alt.emitServer(`scenario.set`, 71);
            },
            "Сидеть на шезлонге 2": () => {
                alt.emitServer(`scenario.set`, 72);
            },
            "Сидя смотреть стриптиз": () => {
                alt.emitServer(`scenario.set`, 73);
            },
        },
        "actions_list": {
            "Анимации": () => {
                alt.emit("selectMenu.show", "actions_anims");
            },
            "Сценарии": () => {
                alt.emit("selectMenu.show", "actions_scenarios");
            },
            "Отмена": () => {
                game.clearPedTasksImmediately(localPlayer.scriptID);
                alt.keyDownIsAtive = false;
                alt.emit("selectMenu.hide");
            },
            "Закрыть": () => {
                alt.keyDownIsAtive = false;
                alt.emit("selectMenu.hide");
            },
        },
        "actions_scenarios": {
            "Сидеть": () => {
                alt.emit("selectMenu.show", "sit");
            },
            "Стоять": () => {
                alt.emit("selectMenu.show", "stand");
            },
            "Положение": () => {
                alt.emit("selectMenu.show", "lay");
            },
            "Спорт": () => {
                alt.emit("selectMenu.show", "sport");
            },
            "Работа": () => {
                alt.emit("selectMenu.show", "works");
            },
            "Социальные": () => {
                alt.emit("selectMenu.show", "social");
            },
        },
        "actions_anims": {
            "Жесты": () => {
                alt.emit("selectMenu.show", "anim_gesture");
            },
            "Танцы 1": () => {
                alt.emit("selectMenu.show", "anim_dance1");
            },
            "Танцы 2": () => {
                alt.emit("selectMenu.show", "anim_dance2");
            },
            "Действия": () => {
                alt.emit("selectMenu.show", "anim_actions");
            },
            "Спорт": () => {
                alt.emit("selectMenu.show", "anim_sport");
            },
            "Положение": () => {
                alt.emit("selectMenu.show", "anim_lay");
            },
            "Сидеть": () => {
                alt.emit("selectMenu.show", "anim_sit");
            },
            "Стоять": () => {
                alt.emit("selectMenu.show", "anim_stand");
            },
            "Соитие": () => {
                alt.emit("selectMenu.show", "anim_sex");
            },
        },
        "band_dealer_menu_assault_rifles": {
            "Compact Rifle | $7500": () => {
                alt.emitServer(`bandDealer.buyGun`, 52);
            },
            "Assault Rifle | $8500": () => {
                alt.emitServer(`bandDealer.buyGun`, 50);
            },
            "Carbine Rifle | $9700": () => {
                alt.emitServer(`bandDealer.buyGun`, 22);
            },
            "Advanced Rifle | $12000": () => {
                alt.emitServer(`bandDealer.buyGun`, 100);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", `band_dealer_menu_guns`, 4);
            },
        },
        "band_dealer_menu_ammo": {
            "Патроны - 9mm | $6": (value) => {
                if (!alt.isFlood()) alt.emitServer(`bandDealer.buyAmmo`, 0, parseInt(value));
            },
            "Патроны - 12mm | $7": (value) => {
                if (!alt.isFlood()) alt.emitServer(`bandDealer.buyAmmo`, 1, parseInt(value));
            },
            "Патроны - 5.56mm | $7": (value) => {
                if (!alt.isFlood()) alt.emitServer(`bandDealer.buyAmmo`, 2, parseInt(value));
            },
            "Патроны - 7.62mm | $6": (value) => {
                if (!alt.isFlood()) alt.emitServer(`bandDealer.buyAmmo`, 3, parseInt(value));
            },
            "Вернуться": () => {
                alt.emit(`selectMenu.show`, `band_dealer_menu`, 1);
            },
        },
        "band_dealer_menu_drugs": {
            "Марихуана | $6": (value) => {
                if (!alt.isFlood()) alt.emitServer(`bandDealer.buyDrgus`, 0, parseInt(value));
            },
            "МДМА | $10": (value) => {
                if (!alt.isFlood()) alt.emitServer(`bandDealer.buyDrgus`, 1, parseInt(value));
            },
            "Кокаин | $8": (value) => {
                if (!alt.isFlood()) alt.emitServer(`bandDealer.buyDrgus`, 2, parseInt(value));
            },
            "Метамфетамин | $9": (value) => {
                if (!alt.isFlood()) alt.emitServer(`bandDealer.buyDrgus`, 3, parseInt(value));
            },
            "Вернуться": () => {
                alt.emit(`selectMenu.show`, `band_dealer_menu`, 2);
            },
        },
        "band_dealer_menu_items": {
            "Стяжки | $150": () => {
                if (!alt.isFlood()) alt.emitServer(`bandDealer.buyItems`, 0);
            },
            "Вернуться": () => {
                alt.emit(`selectMenu.show`, `band_dealer_menu`, 3);
            },
        },

        "band_dealer_menu_masks": {
            "Маска №1 | $3000": () => {
                if (!alt.isFlood()) alt.emitServer(`bandDealer.buyMasks`, 0);
            },
            "Маска №2 | $3200": () => {
                if (!alt.isFlood()) alt.emitServer(`bandDealer.buyMasks`, 1);
            },
            "Маска №3 | $3400": () => {
                if (!alt.isFlood()) alt.emitServer(`bandDealer.buyMasks`, 2);
            },
            "Маска №4 | $3600": () => {
                if (!alt.isFlood()) alt.emitServer(`bandDealer.buyMasks`, 3);
            },
            "Маска №5 | $3800": () => {
                if (!alt.isFlood()) alt.emitServer(`bandDealer.buyMasks`, 4);
            },
            "Маска №6 | $4000": () => {
                if (!alt.isFlood()) alt.emitServer(`bandDealer.buyMasks`, 5);
            },
            "Маска №7 | $4200": () => {
                if (!alt.isFlood()) alt.emitServer(`bandDealer.buyMasks`, 6);
            },
            "Маска №8 | $4400": () => {
                if (!alt.isFlood()) alt.emitServer(`bandDealer.buyMasks`, 7);
            },
            "Маска №9 | $4600": () => {
                if (!alt.isFlood()) alt.emitServer(`bandDealer.buyMasks`, 8);
            },
            "Маска №10 | $4800": () => {
                if (!alt.isFlood()) alt.emitServer(`bandDealer.buyMasks`, 9);
            },
            "Вернуться": () => {
                alt.emit(`selectMenu.show`, `band_dealer_menu`, 4);
            },
        },

        "enter_driving_school": {
            "Лицензии": () => {
                alt.emit("selectMenu.show", "driving_school_licenses");
            },
        },
        "driving_school_licenses": {
            "Водитель": () => {
                alt.emit("selectMenu.show", "driving_school_car");
            },
            "Водный транспорт": () => {
                alt.emit("selectMenu.show", "driving_school_water");
            },
            "Пилот": () => {
                alt.emit("selectMenu.show", "driving_school_fly");
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "enter_driving_school");
            },
        },
        "driving_school_car": {
            "Автомобиль | $500": () => {
                alt.emitServer("drivingSchool.buyLic", 1);
            },
            "Мототехника | $700": () => {
                alt.emitServer("drivingSchool.buyLic", 2);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "driving_school_licenses");
            }
        },
        "driving_school_water": {
            "Лодки | $1000": () => {
                alt.emitServer("drivingSchool.buyLic", 3);
            },
            "Яхты | $5000": () => {
                alt.emitServer("drivingSchool.buyLic", 4);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "driving_school_licenses", 1);
            }
        },
        "driving_school_fly": {
            "Вертолёты | $2000": () => {
                alt.emitServer("drivingSchool.buyLic", 11);
            },
            "Самолёты | $3000": () => {
                alt.emitServer("drivingSchool.buyLic", 12);
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "driving_school_licenses", 2);
            }
        },

        "trucker_load": {
            "Загрузить": (value) => {
                if (!alt.isFlood()) alt.emitServer(`trucker.buyTrailer`, parseInt(value));
                alt.emit("selectMenu.hide");
            },
        },

        "enter_farm": {
            "Работа": () => {
                alt.emit("selectMenu.show", "enter_farm_job");
            },
            "Информация": () => {

            },
            "Помощь": () => {

            },
        },
        "enter_farm_job": {
            "Рабочий": () => {
                alt.emitServer("farm.startJob", 0);
                alt.emit("selectMenu.hide");
            },
            "Фермер": () => {
                alt.emitServer("farm.startJob", 1);
                alt.emit("selectMenu.hide");
            },
            "Тракторист": () => {
                alt.emitServer("farm.startJob", 2);
                alt.emit("selectMenu.hide");
            },
            "Пилот": () => {
                alt.emitServer("farm.startJob", 3);
                alt.emit("selectMenu.hide");
            },
            "Уволиться": () => {
                alt.emitServer("farm.stopJob");
                alt.emit("selectMenu.hide");
            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "enter_farm");
            }
        },
        "bus_mash": {
            "Маршрут #1": () => {
                if (!alt.isFlood()) alt.emitServer("rent.bus.vehicle", 3);
            },
            "Маршрут #2": () => {
                if (!alt.isFlood()) alt.emitServer("rent.bus.vehicle", 4);
            },
            "Отказаться": () => {
                alt.emit(`selectMenu.hide`);
                let veh = player.vehicle;
                if (veh) player.taskLeaveVehicle(veh.handle, 16);
            },
        },
        "farm_warehouse": {
            "Посев зерна": () => {
                alt.emit("selectMenu.show", "farm_warehouse_fill_field");
            },
            "Покупка урожая": () => {
                alt.emit("selectMenu.show", "farm_warehouse_buy_crop");
            },
            "Продажа зерна": () => {
                alt.emit("selectMenu.show", "farm_warehouse_sell_grain");
            },
            "Выгрузка урожая": () => {
                alt.emitServer(`farm.warehouse.unloadCrop`);
                alt.emit("selectMenu.hide");
            },
        },
        "farm_warehouse_fill_field": {
            "Загрузить": () => {

            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "farm_warehouse");
            }
        },
        "farm_warehouse_buy_crop": {
            "Закупить": () => {

            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "farm_warehouse", 1);
            }
        },
        "farm_warehouse_sell_grain": {
            "Продажа": () => {

            },
            "Вернуться": () => {
                alt.emit("selectMenu.show", "farm_warehouse", 2);
            }
        },
    };
    for (var key in menuHandlers) {
        menuHandlers[key]["Закрыть"] = () => {
            alt.emit(`selectMenu.hide`);
        }
    }

    let index_menu = [
      "biz_8_melee",
      "biz_8_handguns",
      "biz_8_submachine_guns",
      "biz_8_shotguns",
      "biz_8_ammo",
      "biz_6_items",
      "gang_storage_3",
      "gang_storage_4",
      "gang_storage_6",
      "gang_storage_7",
      "gang_storage_11_1",
      "gang_storage_12_1",
      "gang_storage_11_2",
      "gang_storage_12_2",
      "gang_storage_11_3",
      "gang_storage_12_3",
      "gang_storage_11_4",
      "gang_storage_12_4",
      "gang_storage_11_5",
      "gang_storage_12_5",
      "gang_storage_11_6",
      "gang_storage_12_6",
      "gang_storage_11_7",
      "gang_storage_12_7",
      "gang_storage_11_8",
      "gang_storage_12_8",
      "gang_storage_11_9",
      "gang_storage_12_9",
      "gang_storage_11_10",
      "gang_storage_12_10"
    ];

    view.on("selectMenu.itemSelected", (menuName, itemName, itemValue, itemIndex) => {
        playSelectSound();

        if (menuHandlers[menuName] !== undefined) {
          if (menuHandlers[menuName][itemName] || menuHandlers[menuName][itemIndex]) {
            if (index_menu.includes(menuName))
                menuHandlers[menuName][itemIndex](itemValue, itemIndex);
            else
                menuHandlers[menuName][itemName](itemValue, itemIndex);
          }
        }

        if (menuName == "biz_3_top") {
            var names = ["bracelets", "ears", "feets", "glasses", "hats", "legs", "masks", "ties", "top", "watches", "underwear"];
            if (itemIndex >= alt.clothes[8][alt.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[8][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[8][alt.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return alt.emit("nError", "Текстура не найдена!");
            alt.emitServer("biz_3.buyItem", "top", itemIndex, texture);
        } else if (menuName == "biz_3_legs") {
            if (itemIndex >= alt.clothes[5][alt.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[5][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[5][alt.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return alt.emit("nError", "Текстура не найдена!");
            alt.emitServer("biz_3.buyItem", "legs", itemIndex, texture);
        } else if (menuName == "biz_3_feets") {
            if (itemIndex >= alt.clothes[2][alt.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[2][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[2][alt.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return alt.emit("nError", "Текстура не найдена!");
            alt.emitServer("biz_3.buyItem", "feets", itemIndex, texture);
        } else if (menuName == "biz_3_hats") {
            if (itemIndex >= alt.clothes[4][alt.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[4][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[4][alt.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return alt.emit("nError", "Текстура не найдена!");
            alt.emitServer("biz_3.buyItem", "hats", itemIndex, texture);
        } else if (menuName == "biz_3_glasses") {
            if (itemIndex >= alt.clothes[3][alt.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[3][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[3][alt.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return alt.emit("nError", "Текстура не найдена!");
            alt.emitServer("biz_3.buyItem", "glasses", itemIndex, texture);
        } else if (menuName == "biz_3_bracelets") {
            if (itemIndex >= alt.clothes[0][alt.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[0][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[0][alt.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return alt.emit("nError", "Текстура не найдена!");
            alt.emitServer("biz_3.buyItem", "bracelets", itemIndex, texture);
        } else if (menuName == "biz_3_ears") {
            if (itemIndex >= alt.clothes[1][alt.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[1][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[1][alt.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return alt.emit("nError", "Текстура не найдена!");
            alt.emitServer("biz_3.buyItem", "ears", itemIndex, texture);
        } else if (menuName == "biz_3_masks") {
            if (itemIndex >= alt.clothes[6][alt.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[6][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[6][alt.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return alt.emit("nError", "Текстура не найдена!");
            alt.emitServer("biz_3.buyItem", "masks", itemIndex, texture);
        } else if (menuName == "biz_3_ties") {
            if (itemIndex >= alt.clothes[7][alt.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[7][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[7][alt.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return alt.emit("nError", "Текстура не найдена!");
            alt.emitServer("biz_3.buyItem", "ties", itemIndex, texture);
        } else if (menuName == "biz_3_watches") {
            if (itemIndex >= alt.clothes[9][alt.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[9][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[9][alt.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return alt.emit("nError", "Текстура не найдена!");
            alt.emitServer("biz_3.buyItem", "watches", itemIndex, texture);
        }
    });

    view.on("selectMenu.itemValueChanged", (menuName, itemName, itemValue, itemIndex, valueIndex) => {
        //debug(`itemValueChanged: ${menuName} ${itemName} ${itemValue}`);
        var menuHandlers = {};

        if (menuHandlers[menuName] && menuHandlers[menuName][itemName])
            menuHandlers[menuName][itemName](itemValue);
        if (menuName == "biz_3_top") {
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[8][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[8][alt.clientStorage.sex][itemIndex];
            game.setPedComponentVariation(game.playerPedId(), 11, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_legs") {
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[5][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[5][alt.clientStorage.sex][itemIndex];
            game.setPedComponentVariation(game.playerPedId(), 4, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_feets") {
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[2][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[2][alt.clientStorage.sex][itemIndex];
            game.setPedComponentVariation(game.playerPedId(), 6, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_hats") {
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[4][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[4][alt.clientStorage.sex][itemIndex];
            game.setPedPropIndex(game.playerPedId(), 0, comp.variation, comp.textures[valueIndex], true);
        } else if (menuName == "biz_3_glasses") {
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[3][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[3][alt.clientStorage.sex][itemIndex];
            game.setPedPropIndex(game.playerPedId(), 1, comp.variation, comp.textures[valueIndex], true);
        } else if (menuName == "biz_3_bracelets") {
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[0][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[0][alt.clientStorage.sex][itemIndex];
            game.setPedPropIndex(game.playerPedId(), 7, comp.variation, comp.textures[valueIndex], true);
        } else if (menuName == "biz_3_ears") {
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[1][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[1][alt.clientStorage.sex][itemIndex];
            game.setPedPropIndex(game.playerPedId(), 2, comp.variation, comp.textures[valueIndex], true);
        } else if (menuName == "biz_3_masks") {
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[6][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[6][alt.clientStorage.sex][itemIndex];
            game.setPedComponentVariation(game.playerPedId(), 1, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_ties") {
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[7][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[7][alt.clientStorage.sex][itemIndex];
            game.setPedComponentVariation(game.playerPedId(), 7, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_watches") {
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[9][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[9][alt.clientStorage.sex][itemIndex];
            game.setPedPropIndex(game.playerPedId(), 6, comp.variation, comp.textures[valueIndex], true);
        }
        //menuHandlers[menuName][itemName][itemValue]();
    });

    view.on("selectMenu.itemFocusChanged", (menuName, itemName, itemValue, itemIndex, valueIndex) => {
        playFocusSound();
        //menu.execute(`alert('itemFocusChanged: ${menuName} ${itemName} ${itemValue}')`);
        var menuHandlers = { };
        if (menuHandlers[menuName] && menuHandlers[menuName][itemName]) menuHandlers[menuName][itemName](itemValue, itemIndex);
        if (menuName == "biz_3_top") {
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[8][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[8][alt.clientStorage.sex][itemIndex];
            game.setPedComponentVariation(game.playerPedId(), 3, comp.torso, 0, 0);
            game.setPedComponentVariation(game.playerPedId(), 11, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_legs") {
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[5][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[5][alt.clientStorage.sex][itemIndex];
            game.setPedComponentVariation(game.playerPedId(), 4, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_feets") {
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[2][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[2][alt.clientStorage.sex][itemIndex];
            game.setPedComponentVariation(game.playerPedId(), 6, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_hats") {
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[4][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[4][alt.clientStorage.sex][itemIndex];
            game.setPedPropIndex(game.playerPedId(), 0, comp.variation, comp.textures[valueIndex], true);
        } else if (menuName == "biz_3_glasses") {
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[3][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[3][alt.clientStorage.sex][itemIndex];
            game.setPedPropIndex(game.playerPedId(), 1, comp.variation, comp.textures[valueIndex], true);
        } else if (menuName == "biz_3_bracelets") {
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[0][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[0][alt.clientStorage.sex][itemIndex];
            game.setPedPropIndex(game.playerPedId(), 7, comp.variation, comp.textures[valueIndex], true);
        } else if (menuName == "biz_3_ears") {
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[1][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[1][alt.clientStorage.sex][itemIndex];
            game.setPedPropIndex(game.playerPedId(), 2, comp.variation, comp.textures[valueIndex], true);
        } else if (menuName == "biz_3_masks") {
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[6][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[6][alt.clientStorage.sex][itemIndex];
            game.setPedComponentVariation(game.playerPedId(), 1, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_ties") {
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[7][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[7][alt.clientStorage.sex][itemIndex];
            game.setPedComponentVariation(game.playerPedId(), 7, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_watches") {
            itemIndex = Math.clamp(itemIndex, 0, alt.clothes[9][alt.clientStorage.sex].length - 1);
            var comp = alt.clothes[9][alt.clientStorage.sex][itemIndex];
            game.setPedPropIndex(game.playerPedId(), 6, comp.variation, comp.textures[valueIndex], true);
        }
    });

    view.on("selectMenu.backspacePressed", (menuName, itemName, itemValue, itemIndex) => {
        playBackSound();
        //menu.execute(`alert('backspacePressed: ${menuName} ${itemName} ${itemValue}')`);
        var menuHandlers = {
            "!enter_house": (itemName, itemValue) => {
                alt.emit(`selectMenu.hide`);
            },
            "!exit_house": (itemName, itemValue) => {
                alt.emit(`selectMenu.hide`);
            },
            "enter_garage": (itemName, itemValue) => {
                alt.emit(`selectMenu.hide`);
            },
            /*"exit_garage": (itemName, itemValue) => {
            	alt.emit(`selectMenu.hide`);
            },*/
            "biz_panel": (itemName, itemValue) => {
                alt.emit(`selectMenu.show`, prevMenuName);
            },
            "biz_cashbox": (itemName, itemValue) => {
                alt.emit(`selectMenu.show`, "biz_panel", 1);
            },
            "biz_stats": (itemName, itemValue) => {
                alt.emit(`selectMenu.show`, "biz_panel", 2);
            },
            "biz_products": (itemName, itemValue) => {
                alt.emit(`selectMenu.show`, "biz_panel", 3);
            },
            "biz_staff": (itemName, itemValue) => {
                alt.emit(`selectMenu.show`, "biz_panel", 4);
            },
            "biz_rise": (itemName, itemValue) => {
                alt.emit(`selectMenu.show`, "biz_panel", 5);
            },
            "biz_status": (itemName, itemValue) => {
                alt.emit(`selectMenu.show`, "biz_panel", 6);
            },
            "biz_sell": (itemName, itemValue) => {
                alt.emit(`selectMenu.show`, "biz_panel", 7);
            },
            "biz_3_clothes": () => {
                //alt.emit("selectMenu.show", "enter_biz_3");
            },
            "biz_3_top": () => {
                alt.emit("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 0 });
            },
            "biz_3_legs": () => {
                alt.emit("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 1 });
            },
            "biz_3_feets": () => {
                alt.emit("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 2 });
            },
            "biz_3_hats": () => {
                alt.emit("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 3 });
            },
            "biz_3_glasses": () => {
                alt.emit("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 4 });
            },
            "biz_3_bracelets": () => {
                alt.emit("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 5 });
            },
            "biz_3_ears": () => {
                alt.emit("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 6 });
            },
            "biz_3_masks": () => {
                alt.emit("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 7 });
            },
            "biz_3_ties": () => {
                alt.emit("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 8 });
            },
            "biz_3_watches": () => {
                alt.emit("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 9 });
            },
            "biz_5_items": () => {
                alt.emit("selectMenu.show", "enter_biz_5", 0);
            },
            "biz_6_items": () => {
                alt.emit("selectMenu.show", "enter_biz_6");
            },
            "biz_8_guns": () => {
                alt.emit("selectMenu.show", "enter_biz_8");
            },
            "biz_8_melee": () => {
                alt.emit("selectMenu.show", "biz_8_guns");
            },
            "biz_8_handguns": () => {
                alt.emit("selectMenu.show", "biz_8_guns", 1);
            },
            "biz_8_submachine_guns": () => {
                alt.emit("selectMenu.show", "biz_8_guns", 2);
            },
            "biz_8_shotguns": () => {
                alt.emit("selectMenu.show", "biz_8_guns", 3);
            },
            "biz_8_assault_rifles": () => {
                alt.emit("selectMenu.show", "biz_8_guns", 4);
            },
            "biz_8_light_machine_guns": () => {
                alt.emit("selectMenu.show", "biz_8_guns", 5);
            },
            "biz_8_sniper_rifles": () => {
                alt.emit("selectMenu.show", "biz_8_guns", 6);
            },
            "biz_8_ammo": () => {
                alt.emit("selectMenu.show", "enter_biz_8", 1);
            },
            "police_storage": () => {
                alt.emit(`selectMenu.hide`);
            },
            "police_guns": () => {
                alt.emit("selectMenu.show", "police_storage");
            },
            "police_clothes": () => {
                alt.emit("selectMenu.show", "police_storage", 1);
            },
            "police_items": () => {
                alt.emit("selectMenu.show", "police_storage", 2);
            },
            "police_ammo": () => {
                alt.emit("selectMenu.show", "police_storage", 3);
            },
            "police_service_recovery": () => {
                alt.emit("selectMenu.show", "police_service");
            },

            "police_storage_2": () => {
                alt.emit(`selectMenu.hide`);
            },
            "police_guns_2": () => {
                alt.emit("selectMenu.show", "police_storage_2");
            },
            "police_clothes_2": () => {
                alt.emit("selectMenu.show", "police_storage_2", 1);
            },
            "police_items_2": () => {
                alt.emit("selectMenu.show", "police_storage_2", 2);
            },
            "police_ammo_2": () => {
                alt.emit("selectMenu.show", "police_storage_2", 3);
            },
            "police_service_recovery_2": () => {
                alt.emit("selectMenu.show", "police_service_2");
            },

            "army_storage": () => {
                alt.emit(`selectMenu.hide`);
            },
            "army_guns": () => {
                alt.emit("selectMenu.show", "army_storage");
            },
            "army_clothes": () => {
                alt.emit("selectMenu.show", "army_storage", 1);
            },
            "army_items": () => {
                alt.emit("selectMenu.show", "army_storage", 2);
            },
            "army_ammo": () => {
                alt.emit("selectMenu.show", "army_storage", 2);
            },

            "army_storage_2": () => {
                alt.emit(`selectMenu.hide`);
            },
            "army_guns_2": () => {
                alt.emit("selectMenu.show", "army_storage_2");
            },
            "army_clothes_2": () => {
                alt.emit("selectMenu.show", "army_storage_2", 1);
            },
            "army_items_2": () => {
                alt.emit("selectMenu.show", "army_storage_2", 2);
            },
            "army_ammo_2": () => {
                alt.emit("selectMenu.show", "army_storage_2", 2);
            },

            "fib_storage": () => {
                alt.emit(`selectMenu.hide`);
            },
            "fib_guns": () => {
                alt.emit("selectMenu.show", "fib_storage");
            },
            "fib_clothes": () => {
                alt.emit("selectMenu.show", "fib_storage", 1);
            },
            "fib_items": () => {
                alt.emit("selectMenu.show", "fib_storage", 2);
            },
            "fib_ammo": () => {
                alt.emit("selectMenu.show", "fib_storage", 3);
            },

            "hospital_storage": () => {
                alt.emit(`selectMenu.hide`);
            },
            "hospital_items": () => {
                alt.emit("selectMenu.show", "hospital_storage");
            },
            "hospital_clothes": () => {
                alt.emit("selectMenu.show", "hospital_storage", 1);
            },
            "driving_school_licenses": () => {
                alt.emit("selectMenu.show", "enter_driving_school");
            },
            "driving_school_car": () => {
                alt.emit("selectMenu.show", "driving_school_licenses");
            },
            "driving_school_water": () => {
                alt.emit("selectMenu.show", "driving_school_licenses", 1);
            },
            "driving_school_fly": () => {
                alt.emit("selectMenu.show", "driving_school_licenses", 2);
            },
            "band_dealer_menu_guns": () => {
                alt.emit("selectMenu.show", "band_dealer_menu");
            },
            "band_dealer_menu_melee": () => {
                alt.emit("selectMenu.show", "band_dealer_menu_guns");
            },
            "band_dealer_menu_handguns": () => {
                alt.emit("selectMenu.show", "band_dealer_menu_guns", 1);
            },
            "band_dealer_menu_submachine_guns": () => {
                alt.emit("selectMenu.show", "band_dealer_menu_guns", 2);
            },
            "band_dealer_menu_shotguns": () => {
                alt.emit("selectMenu.show", "band_dealer_menu_guns", 3);
            },
            "band_dealer_menu_assault_rifles": () => {
                alt.emit("selectMenu.show", "band_dealer_menu_guns", 4);
            },
            "band_dealer_menu_ammo": () => {
                alt.emit("selectMenu.show", "band_dealer_menu", 1);
            },
            "band_dealer_menu_drugs": () => {
                alt.emit("selectMenu.show", "band_dealer_menu", 2);
            },
            "band_dealer_menu_items": () => {
                alt.emit("selectMenu.show", "band_dealer_menu", 3);
            },
            "band_dealer_menu_masks": () => {
                alt.emit("selectMenu.show", "band_dealer_menu", 4);
            },
            "news_storage_1": () => {
                alt.emit("selectMenu.show", "news_storage");
            },
            "news_storage_2": () => {
                alt.emit("selectMenu.show", "news_storage", 1);
            },

            "gover_clothes": () => {
                alt.emit("selectMenu.show", "gover_storage", 1);
            },

            "gover_guns": () => {
                alt.emit("selectMenu.show", "gover_storage");
            },

            "gover_items": () => {
                alt.emit("selectMenu.show", "gover_storage", 2);
            },

            "gover_ammo": () => {
                alt.emit("selectMenu.show", "gover_storage", 3);
            },

            "enter_farm_job": () => {
                alt.emit("selectMenu.show", "enter_farm");
            },
            "farm_warehouse_fill_field": () => {
                alt.emit("selectMenu.show", "farm_warehouse", 0);
            },
            "farm_warehouse_buy_crop": () => {
                alt.emit("selectMenu.show", "farm_warehouse", 1);
            },
            "farm_warehouse_sell_grain": () => {
                alt.emit("selectMenu.show", "farm_warehouse", 2);
            },
        };

        if (menuHandlers[menuName])
            menuHandlers[menuName](itemName, itemValue);
    });

    view.on("setSelectMenuActive", (enable) => {
        alt.selectMenuActive = enable;
    });

    function clothesConvertToMenuItems(clothes) {
        var items = [];
        for (var i = 0; i < clothes.length; i++) {
            items.push({
                text: `Шмотка <i>${clothes[i].price}$</i> ID: ${clothes[i].id}`,
                values: clothes[i].textures
            });
        }
        return items;
    }

    // Custom events
    alt.on("weapon.shop.setAmmoShopName", (args, price) => {
        menu.execute(`selectMenuAPI.setItemName('biz_8_melee', 0, {text: "Бейсбольная бита | $${args[0]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_8_melee', 1, {text: "Кастет | $${args[1]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_8_melee', 2, {text: "Нож | $${args[2]}"})`);

        menu.execute(`selectMenuAPI.setItemName('biz_8_handguns', 0, {text: "Pistol | $${args[3]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_8_handguns', 1, {text: "AP Pistol | $${args[4]}"})`);

        menu.execute(`selectMenuAPI.setItemName('biz_8_submachine_guns', 0, {text: "Micro SMG | $${args[5]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_8_submachine_guns', 1, {text: "SMG | $${args[6]}"})`);

        menu.execute(`selectMenuAPI.setItemName('biz_8_shotguns', 0, {text: "Sawed-Off Shotgun | $${args[7]}"})`);

        menu.execute(`selectMenuAPI.setItemName('biz_8_ammo', 0, {text: "Патроны - 9mm | $${price}", values: ["10 шт.", "20 шт.", "40 шт.", "80 шт."]})`);
        menu.execute(`selectMenuAPI.setItemName('biz_8_ammo', 1, {text: "Патроны - 12mm | $${price}", values: ["10 шт.", "20 шт.", "40 шт.", "80 шт."]})`);
        menu.execute(`selectMenuAPI.setItemName('biz_8_ammo', 2, {text: "Патроны - 5.56mm | $${price}", values: ["10 шт.", "20 шт.", "40 шт.", "80 шт."]})`);
        menu.execute(`selectMenuAPI.setItemName('biz_8_ammo', 3, {text: "Патроны - 7.62mm | $${price}", values: ["10 шт.", "20 шт.", "40 шт.", "80 шт."]})`);
    });

    alt.on("food.shop.setFoodShopName", (args) => {
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 0, {text: "eCola | $${args[0]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 1, {text: "EgoChaser | $${args[1]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 2, {text: "Meteorite | $${args[2]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 3, {text: "P's & Q's | $${args[3]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 4, {text: "Пачка Redwood | $${args[4]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 5, {text: "Pisswasser | $${args[5]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 6, {text: "Телефон | $${args[6]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 7, {text: "Сумка | $${args[7]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 8, {text: "Канистра | $${args[8]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 9, {text: "Пластырь | $${args[9]}"})`);
    });
});

alt.clothes = [[[{"id":9,"variation":0,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":10,"variation":1,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":11,"variation":2,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":12,"variation":3,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":13,"variation":4,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":14,"variation":5,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":15,"variation":6,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":16,"variation":7,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":17,"variation":8,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":18,"variation":9,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":19,"variation":10,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":20,"variation":11,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":21,"variation":12,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":22,"variation":13,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":23,"variation":14,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3}],[{"id":1,"variation":0,"price":8000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":2,"variation":1,"price":9000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":3,"variation":2,"price":18000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":4,"variation":3,"price":11000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":5,"variation":4,"price":10000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":6,"variation":5,"price":1000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":7,"variation":6,"price":3500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":8,"variation":7,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3}]],[[{"id":38,"variation":0,"price":0,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":39,"variation":1,"price":0,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":40,"variation":2,"price":350,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":41,"variation":3,"price":350,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":42,"variation":4,"price":380,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":43,"variation":5,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":44,"variation":6,"price":450,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":45,"variation":7,"price":480,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":46,"variation":8,"price":530,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":47,"variation":9,"price":530,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":48,"variation":10,"price":550,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":49,"variation":11,"price":570,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":50,"variation":12,"price":250,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":51,"variation":13,"price":250,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":52,"variation":14,"price":380,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":53,"variation":15,"price":380,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":54,"variation":16,"price":380,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":55,"variation":17,"price":380,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3}],[{"id":1,"variation":0,"price":120,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":2,"variation":1,"price":250,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":3,"variation":2,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":4,"variation":3,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":5,"variation":4,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":6,"variation":5,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":7,"variation":6,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":8,"variation":7,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":9,"variation":8,"price":1200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":10,"variation":9,"price":380,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":11,"variation":10,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":12,"variation":11,"price":760,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":13,"variation":12,"price":10000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":14,"variation":13,"price":20000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":15,"variation":14,"price":10000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":16,"variation":15,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":17,"variation":16,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":18,"variation":17,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":19,"variation":18,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":20,"variation":19,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":21,"variation":20,"price":800,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":22,"variation":21,"price":7000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":23,"variation":22,"price":7000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":24,"variation":23,"price":14000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":25,"variation":24,"price":3000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":26,"variation":25,"price":3000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":27,"variation":26,"price":6000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":28,"variation":27,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":29,"variation":28,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":30,"variation":29,"price":1000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":31,"variation":30,"price":700,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":32,"variation":31,"price":700,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":33,"variation":32,"price":1400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":34,"variation":33,"price":10000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":35,"variation":34,"price":900,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":36,"variation":35,"price":900,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":37,"variation":36,"price":1800,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3}]],[[{"id":73,"variation":0,"price":400,"textures":[0,1,2,3],"class":3},{"id":74,"variation":1,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":75,"variation":2,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":76,"variation":3,"price":100,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":77,"variation":4,"price":150,"textures":[0,1,2,3],"class":2},{"id":78,"variation":5,"price":100,"textures":[0,1,10,13],"class":1},{"id":79,"variation":6,"price":400,"textures":[0,1,2,3],"class":3},{"id":80,"variation":7,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":81,"variation":8,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":82,"variation":9,"price":300,"textures":[0,1,2,3,11,12],"class":1},{"id":83,"variation":10,"price":300,"textures":[0,1,2,3],"class":2},{"id":84,"variation":11,"price":400,"textures":[0,1,2,3],"class":2},{"id":85,"variation":12,"price":1000000,"textures":[],"class":3},{"id":86,"variation":13,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":87,"variation":14,"price":700,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":88,"variation":15,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":89,"variation":16,"price":100,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"class":1},{"id":90,"variation":17,"price":600,"textures":[0],"class":2},{"id":91,"variation":18,"price":600,"textures":[0,1,2],"class":2},{"id":92,"variation":19,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"class":2},{"id":93,"variation":20,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"class":2},{"id":94,"variation":21,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9],"class":1},{"id":95,"variation":22,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":96,"variation":23,"price":500,"textures":[0,1,2],"class":2},{"id":97,"variation":24,"price":250,"textures":[0],"class":1},{"id":98,"variation":25,"price":250,"textures":[0],"class":1},{"id":99,"variation":26,"price":200,"textures":[0],"class":1},{"id":100,"variation":27,"price":200,"textures":[0],"class":2},{"id":101,"variation":28,"price":200,"textures":[0],"class":2},{"id":102,"variation":29,"price":500,"textures":[0,1,2],"class":3},{"id":103,"variation":30,"price":500,"textures":[0],"class":2},{"id":104,"variation":31,"price":300,"textures":[0],"class":2},{"id":105,"variation":32,"price":300,"textures":[0,1,2,3,4],"class":2},{"id":106,"variation":33,"price":300,"textures":[0,1,2,3,4,5,6,7],"class":2},{"id":107,"variation":34,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":108,"variation":35,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":109,"variation":36,"price":400,"textures":[0,1],"class":2},{"id":110,"variation":37,"price":200,"textures":[0,1,2,3],"class":2},{"id":111,"variation":38,"price":300,"textures":[0,1,2,3,4],"class":2},{"id":112,"variation":39,"price":300,"textures":[0,1,2,3,4],"class":2},{"id":113,"variation":40,"price":200,"textures":[0],"class":1},{"id":114,"variation":41,"price":450,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":3},{"id":115,"variation":42,"price":450,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"class":3},{"id":116,"variation":43,"price":400,"textures":[0,1,2,3,4,5,6,7],"class":2},{"id":117,"variation":44,"price":400,"textures":[0,1,2,3,4,5,6,7],"class":2},{"id":118,"variation":45,"price":330,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":2},{"id":119,"variation":46,"price":230,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":2},{"id":120,"variation":47,"price":190,"textures":[0,1,2,3,4,5,6,7,8,9],"class":2},{"id":122,"variation":49,"price":190,"textures":[0,1],"class":2},{"id":123,"variation":50,"price":190,"textures":[0,1],"class":2},{"id":124,"variation":51,"price":390,"textures":[0,1,2,3,4,5],"class":2},{"id":125,"variation":52,"price":300,"textures":[0,1,2,3,4,5],"class":2},{"id":126,"variation":53,"price":340,"textures":[0,1],"class":2},{"id":127,"variation":54,"price":240,"textures":[0,1,2,3,4,5],"class":1},{"id":128,"variation":55,"price":350,"textures":[0,1,2,3,4,5],"class":2},{"id":129,"variation":56,"price":350,"textures":[0,1,2],"class":2},{"id":130,"variation":57,"price":220,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":132,"variation":59,"price":250,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":133,"variation":60,"price":350,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":135,"variation":62,"price":370,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":136,"variation":63,"price":440,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":137,"variation":64,"price":340,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":138,"variation":65,"price":220,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":139,"variation":66,"price":320,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":140,"variation":67,"price":320,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":141,"variation":68,"price":340,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":142,"variation":69,"price":340,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":145,"variation":72,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":146,"variation":73,"price":320,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":147,"variation":74,"price":320,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":148,"variation":75,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":149,"variation":76,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":150,"variation":77,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":151,"variation":0,"price":100000,"textures":[],"class":1},{"id":152,"variation":1,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":153,"variation":2,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":154,"variation":3,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":155,"variation":4,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":156,"variation":5,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":157,"variation":6,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":158,"variation":7,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":159,"variation":8,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":160,"variation":9,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":161,"variation":10,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":162,"variation":11,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":163,"variation":12,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":164,"variation":13,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":165,"variation":14,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":166,"variation":15,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":167,"variation":16,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":168,"variation":17,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":169,"variation":18,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":170,"variation":19,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":171,"variation":20,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":172,"variation":21,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":173,"variation":22,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":174,"variation":23,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":175,"variation":24,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":176,"variation":25,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":177,"variation":26,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":178,"variation":27,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":179,"variation":28,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":180,"variation":29,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":181,"variation":30,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":182,"variation":31,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":183,"variation":32,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":184,"variation":33,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":185,"variation":34,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":186,"variation":35,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":187,"variation":36,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":188,"variation":37,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":189,"variation":38,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":190,"variation":39,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":191,"variation":40,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":192,"variation":41,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":193,"variation":42,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":194,"variation":43,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":195,"variation":44,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":196,"variation":45,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":197,"variation":46,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":198,"variation":47,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":199,"variation":48,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":200,"variation":49,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":201,"variation":50,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":202,"variation":51,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":203,"variation":52,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":204,"variation":53,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":205,"variation":54,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":206,"variation":55,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":207,"variation":56,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":208,"variation":57,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":209,"variation":58,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":210,"variation":59,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":211,"variation":60,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":212,"variation":61,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":213,"variation":62,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":214,"variation":63,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":215,"variation":64,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":216,"variation":65,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":217,"variation":66,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":218,"variation":67,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":219,"variation":68,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":220,"variation":69,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":221,"variation":70,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":222,"variation":71,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":223,"variation":72,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":224,"variation":73,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":225,"variation":74,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":226,"variation":75,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":227,"variation":76,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":228,"variation":77,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":229,"variation":78,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":230,"variation":79,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":231,"variation":80,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":232,"variation":81,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":233,"variation":82,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":234,"variation":83,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":235,"variation":84,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":236,"variation":85,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":237,"variation":86,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":238,"variation":87,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":239,"variation":88,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":240,"variation":89,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":241,"variation":90,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":242,"variation":91,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":243,"variation":92,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":244,"variation":93,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":245,"variation":94,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":246,"variation":95,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":247,"variation":96,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":248,"variation":97,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":249,"variation":98,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":250,"variation":99,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":251,"variation":100,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":252,"variation":101,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":253,"variation":102,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":254,"variation":103,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":255,"variation":104,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":256,"variation":105,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":257,"variation":106,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":258,"variation":107,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":259,"variation":108,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":260,"variation":109,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":261,"variation":110,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":262,"variation":111,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":263,"variation":112,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":264,"variation":113,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":265,"variation":114,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":266,"variation":115,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":267,"variation":116,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":268,"variation":117,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":269,"variation":118,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":270,"variation":119,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":271,"variation":120,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":272,"variation":121,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":273,"variation":122,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":274,"variation":123,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":275,"variation":124,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":276,"variation":125,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":277,"variation":126,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":278,"variation":127,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":279,"variation":128,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":280,"variation":129,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":281,"variation":130,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":282,"variation":131,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":283,"variation":132,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":284,"variation":133,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":285,"variation":134,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":286,"variation":135,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":287,"variation":136,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":288,"variation":137,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":289,"variation":138,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":290,"variation":139,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":291,"variation":140,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":292,"variation":141,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":293,"variation":142,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":294,"variation":143,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":295,"variation":144,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":296,"variation":145,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":297,"variation":146,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":298,"variation":147,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":299,"variation":148,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":300,"variation":149,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":301,"variation":150,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":302,"variation":151,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":303,"variation":152,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":304,"variation":153,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":305,"variation":154,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":306,"variation":155,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":307,"variation":156,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":308,"variation":157,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":309,"variation":158,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":310,"variation":159,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":311,"variation":160,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":312,"variation":161,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":313,"variation":162,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":314,"variation":163,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":315,"variation":164,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":316,"variation":165,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":317,"variation":166,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":318,"variation":167,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":319,"variation":168,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":320,"variation":169,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":321,"variation":170,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":322,"variation":171,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":323,"variation":172,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":324,"variation":173,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":325,"variation":174,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":326,"variation":175,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":327,"variation":176,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":328,"variation":177,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":329,"variation":178,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":330,"variation":179,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":331,"variation":180,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":332,"variation":181,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":333,"variation":182,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":334,"variation":183,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":335,"variation":184,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":336,"variation":185,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":337,"variation":186,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":338,"variation":187,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":339,"variation":188,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":340,"variation":189,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":341,"variation":190,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":342,"variation":191,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":343,"variation":192,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":344,"variation":193,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":345,"variation":194,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":346,"variation":195,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":347,"variation":196,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":348,"variation":197,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":349,"variation":198,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":350,"variation":199,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":351,"variation":200,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":352,"variation":201,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":353,"variation":202,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":354,"variation":203,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":355,"variation":204,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":356,"variation":205,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":357,"variation":206,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":358,"variation":207,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":359,"variation":208,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":360,"variation":209,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":361,"variation":210,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":362,"variation":211,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":363,"variation":212,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":364,"variation":213,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":365,"variation":214,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":366,"variation":215,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":367,"variation":216,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":368,"variation":217,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":369,"variation":218,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":370,"variation":219,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":371,"variation":220,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":372,"variation":221,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":373,"variation":222,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":374,"variation":223,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":375,"variation":224,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":376,"variation":225,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":377,"variation":226,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":378,"variation":227,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":379,"variation":228,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":380,"variation":229,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":381,"variation":230,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":382,"variation":231,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":383,"variation":232,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":384,"variation":233,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":385,"variation":234,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":386,"variation":235,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":387,"variation":236,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":388,"variation":237,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":389,"variation":238,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":390,"variation":239,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":391,"variation":240,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":392,"variation":241,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":393,"variation":242,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":394,"variation":243,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":395,"variation":244,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":396,"variation":245,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":397,"variation":246,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":398,"variation":247,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":399,"variation":248,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":400,"variation":249,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":401,"variation":250,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":402,"variation":251,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":403,"variation":252,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":404,"variation":253,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1}],[{"id":2,"variation":1,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":4,"variation":3,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":5,"variation":4,"price":270,"textures":[0,1,2,4],"class":1},{"id":6,"variation":5,"price":15,"textures":[0,1,2,3],"class":2},{"id":7,"variation":6,"price":25,"textures":[0,1],"class":2},{"id":8,"variation":7,"price":230,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":9,"variation":8,"price":350,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":10,"variation":9,"price":160,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":11,"variation":10,"price":1400,"textures":[0,7,12,14],"class":3},{"id":13,"variation":12,"price":420,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":14,"variation":14,"price":390,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":15,"variation":15,"price":1600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":16,"variation":16,"price":20,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"class":1},{"id":18,"variation":18,"price":1200,"textures":[0,1],"class":3},{"id":19,"variation":19,"price":1700,"textures":[0],"class":3},{"id":20,"variation":20,"price":1200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"class":3},{"id":21,"variation":21,"price":540,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"class":2},{"id":22,"variation":22,"price":130,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"class":1},{"id":23,"variation":23,"price":725,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":24,"variation":24,"price":800,"textures":[0],"class":1},{"id":25,"variation":25,"price":825,"textures":[0],"class":1},{"id":26,"variation":26,"price":315,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":27,"variation":27,"price":650,"textures":[0],"class":1},{"id":28,"variation":28,"price":2200,"textures":[0,1,2,3,4,5],"class":2},{"id":29,"variation":29,"price":750,"textures":[0],"class":2},{"id":30,"variation":30,"price":430,"textures":[0,1],"class":2},{"id":31,"variation":31,"price":250,"textures":[0,1,2,3,4],"class":2},{"id":32,"variation":32,"price":1300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":34,"variation":35,"price":540,"textures":[0,1],"class":2},{"id":35,"variation":36,"price":750,"textures":[0,1,2,3],"class":3},{"id":36,"variation":37,"price":1800,"textures":[0,1,2,3,4],"class":3},{"id":37,"variation":38,"price":1400,"textures":[0,1,2,3,4],"class":3},{"id":38,"variation":39,"price":1100,"textures":[0],"class":1},{"id":39,"variation":40,"price":980,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"class":3},{"id":40,"variation":41,"price":470,"textures":[0],"class":2},{"id":41,"variation":42,"price":320,"textures":[0,1,2,3,4,5,6,7,8,9],"class":2},{"id":42,"variation":43,"price":320,"textures":[0,1,2,3,4,5,6,7],"class":2},{"id":43,"variation":44,"price":1950,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":3},{"id":44,"variation":45,"price":1500,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":3},{"id":45,"variation":46,"price":1330,"textures":[0,1,2,3,4,5,6,7,8,9],"class":2},{"id":47,"variation":48,"price":175,"textures":[0,1],"class":2},{"id":48,"variation":49,"price":165,"textures":[0,1],"class":2},{"id":49,"variation":50,"price":680,"textures":[0,1,2,3,4,5],"class":2},{"id":50,"variation":51,"price":700,"textures":[0,1,2,3,4,5],"class":2},{"id":51,"variation":52,"price":640,"textures":[0,1],"class":2},{"id":52,"variation":53,"price":1170,"textures":[0,1,2,3,4,5],"class":2},{"id":53,"variation":54,"price":965,"textures":[0,1,2,3,4,5],"class":2},{"id":55,"variation":56,"price":1580,"textures":[0,1],"class":1},{"id":56,"variation":57,"price":610,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"class":1},{"id":58,"variation":59,"price":1000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":2},{"id":59,"variation":60,"price":1800,"textures":[0,1,2,3,4,5,6,7],"class":2},{"id":60,"variation":61,"price":560,"textures":[0,1,2,3,4,5,6,7],"class":2},{"id":61,"variation":62,"price":1335,"textures":[0,1,2,3,4,5,6,7],"class":1},{"id":62,"variation":63,"price":1160,"textures":[0,1,2,3,4,5,6,7],"class":1},{"id":63,"variation":64,"price":1400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13],"class":2},{"id":64,"variation":65,"price":440,"textures":[0,1,2,3,4,5,6],"class":2},{"id":65,"variation":66,"price":420,"textures":[0,1,2,3,4,5,6],"class":2},{"id":68,"variation":69,"price":390,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":2},{"id":69,"variation":70,"price":1700,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":2},{"id":70,"variation":71,"price":1300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":2},{"id":71,"variation":72,"price":1620,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":2},{"id":72,"variation":73,"price":1530,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":2}]],[[{"id":28,"variation":0,"price":380,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":29,"variation":1,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":30,"variation":2,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":31,"variation":3,"price":420,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":32,"variation":4,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":33,"variation":5,"price":10000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":34,"variation":6,"price":550,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":35,"variation":7,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":36,"variation":8,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":37,"variation":9,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":38,"variation":10,"price":360,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":39,"variation":11,"price":380,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":40,"variation":12,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":41,"variation":13,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":42,"variation":14,"price":580,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":43,"variation":15,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":44,"variation":16,"price":550,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":45,"variation":17,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":46,"variation":18,"price":380,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":47,"variation":19,"price":380,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":48,"variation":20,"price":380,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":49,"variation":21,"price":380,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":50,"variation":22,"price":150,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":51,"variation":23,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":52,"variation":24,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":53,"variation":25,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":54,"variation":26,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":55,"variation":27,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":56,"variation":28,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3}],[{"id":2,"variation":1,"price":150,"textures":[1],"class":2},{"id":3,"variation":2,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":1},{"id":4,"variation":3,"price":700,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":1},{"id":5,"variation":4,"price":900,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":1},{"id":6,"variation":5,"price":1200,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":2},{"id":8,"variation":7,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":1},{"id":9,"variation":8,"price":1000,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":2},{"id":10,"variation":9,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":2},{"id":11,"variation":10,"price":2500,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":2},{"id":13,"variation":12,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":3},{"id":14,"variation":13,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":3},{"id":16,"variation":15,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":2},{"id":17,"variation":16,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":2},{"id":18,"variation":17,"price":2000,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":3},{"id":19,"variation":18,"price":1350,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":3},{"id":20,"variation":19,"price":1800,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":3},{"id":21,"variation":20,"price":100,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":2},{"id":22,"variation":21,"price":500,"textures":[1],"class":2},{"id":23,"variation":22,"price":500,"textures":[1],"class":3},{"id":24,"variation":23,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9],"class":3},{"id":25,"variation":24,"price":2000,"textures":[0,1,2,3,4,5],"class":2},{"id":26,"variation":25,"price":1700,"textures":[0,1,2,3,4,5,6,7],"class":2}]],[[{"id":128,"variation":0,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":129,"variation":1,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":130,"variation":2,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":131,"variation":3,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":132,"variation":4,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":133,"variation":5,"price":100,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":134,"variation":6,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":135,"variation":7,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":136,"variation":8,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":137,"variation":9,"price":150,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":138,"variation":10,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":139,"variation":11,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":140,"variation":12,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":141,"variation":13,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":142,"variation":14,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":143,"variation":15,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":144,"variation":16,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":145,"variation":17,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":146,"variation":18,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":148,"variation":20,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":149,"variation":21,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":150,"variation":22,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":151,"variation":23,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":152,"variation":24,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":153,"variation":25,"price":250,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":154,"variation":26,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":155,"variation":27,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":156,"variation":28,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":157,"variation":29,"price":100,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":158,"variation":30,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":159,"variation":31,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":160,"variation":32,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":161,"variation":33,"price":100,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":162,"variation":34,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":163,"variation":35,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":164,"variation":36,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":166,"variation":38,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":167,"variation":39,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":168,"variation":40,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":169,"variation":41,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":170,"variation":42,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":171,"variation":43,"price":150,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":172,"variation":44,"price":150,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":173,"variation":45,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":174,"variation":46,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":175,"variation":47,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":176,"variation":48,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":177,"variation":49,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":178,"variation":50,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":179,"variation":51,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":180,"variation":52,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":181,"variation":53,"price":50,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":182,"variation":54,"price":100,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":183,"variation":55,"price":100,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":184,"variation":56,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":185,"variation":57,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":186,"variation":58,"price":100,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":187,"variation":59,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":188,"variation":60,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":189,"variation":61,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":190,"variation":62,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":191,"variation":63,"price":120,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":192,"variation":64,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":193,"variation":65,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":194,"variation":66,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":195,"variation":67,"price":700,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":196,"variation":68,"price":700,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":197,"variation":69,"price":700,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":198,"variation":70,"price":700,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":199,"variation":71,"price":700,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":200,"variation":72,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":201,"variation":73,"price":700,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":202,"variation":74,"price":700,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":203,"variation":75,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":204,"variation":76,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":205,"variation":77,"price":700,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":206,"variation":78,"price":700,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":207,"variation":79,"price":700,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":208,"variation":80,"price":700,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":209,"variation":81,"price":700,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":210,"variation":82,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":211,"variation":83,"price":800,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":212,"variation":84,"price":800,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":213,"variation":85,"price":800,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":214,"variation":86,"price":800,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":215,"variation":87,"price":800,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":216,"variation":88,"price":800,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":217,"variation":89,"price":800,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":220,"variation":92,"price":550,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":221,"variation":93,"price":250,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":222,"variation":94,"price":450,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":223,"variation":95,"price":250,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":224,"variation":96,"price":450,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":225,"variation":97,"price":450,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":226,"variation":98,"price":450,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":227,"variation":99,"price":550,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":228,"variation":100,"price":350,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":229,"variation":101,"price":250,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":230,"variation":102,"price":250,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":231,"variation":103,"price":350,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":232,"variation":104,"price":350,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":233,"variation":105,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":234,"variation":106,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":235,"variation":107,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":236,"variation":108,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":237,"variation":109,"price":100,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":238,"variation":110,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":239,"variation":111,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":243,"variation":115,"price":10000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":244,"variation":116,"price":10000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":245,"variation":117,"price":10000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":246,"variation":118,"price":10000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":247,"variation":119,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":248,"variation":120,"price":10000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":250,"variation":122,"price":10000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":251,"variation":123,"price":10000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":252,"variation":124,"price":10000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":253,"variation":125,"price":10000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":254,"variation":126,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1}],[{"id":1,"variation":0,"price":270,"textures":[0,1,2,3,4,5,6,7],"class":1},{"id":3,"variation":2,"price":90,"textures":[0,1,2,3,4,5,6,7],"class":1},{"id":4,"variation":3,"price":110,"textures":[1,2],"class":1},{"id":5,"variation":4,"price":220,"textures":[0,1],"class":1},{"id":6,"variation":5,"price":90,"textures":[0,1],"class":1},{"id":7,"variation":6,"price":110,"textures":[0,1,2,3,4,5,6,7],"class":1},{"id":8,"variation":7,"price":40,"textures":[0,1,2,3,4,5,6,7],"class":1},{"id":13,"variation":12,"price":160,"textures":[0,1,2],"class":1},{"id":14,"variation":13,"price":150,"textures":[0,1,2,3,4,5,6,7],"class":1},{"id":15,"variation":14,"price":190,"textures":[0,1,2,3,4,5,6,7],"class":1},{"id":16,"variation":15,"price":340,"textures":[0,1,2,3,4,5,6,7],"class":1},{"id":19,"variation":18,"price":560,"textures":[0,1,2,3,4,5,6,7],"class":1},{"id":21,"variation":20,"price":54,"textures":[0,1,2,3,4,5],"class":1},{"id":22,"variation":21,"price":165,"textures":[0,1,2,3,4,5,6,7],"class":1},{"id":26,"variation":25,"price":190,"textures":[0,1,2],"class":1},{"id":27,"variation":26,"price":185,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13],"class":1},{"id":28,"variation":27,"price":195,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13],"class":1},{"id":29,"variation":28,"price":155,"textures":[0,1,2,3,4,5],"class":1},{"id":30,"variation":29,"price":150,"textures":[0,1,2,3,4,5,6,7],"class":1},{"id":31,"variation":30,"price":175,"textures":[0,1],"class":1},{"id":45,"variation":44,"price":60,"textures":[0,1,2,3,4,5,6,7],"class":1},{"id":46,"variation":45,"price":65,"textures":[0,1,2,3,4,5,6,7],"class":1},{"id":55,"variation":54,"price":60,"textures":[0,1],"class":1},{"id":56,"variation":55,"price":170,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":1},{"id":57,"variation":56,"price":150,"textures":[0,1,2,3,4,5,6,7,8,9],"class":1},{"id":59,"variation":58,"price":70,"textures":[0,1,2],"class":1},{"id":60,"variation":59,"price":230,"textures":[0,1,2,3,4,5,6,7,8,9],"class":1},{"id":61,"variation":60,"price":90,"textures":[0,1,2,3,4,5,6,7,8,9],"class":1},{"id":62,"variation":61,"price":230,"textures":[0,1,2,3,4,5,6,7,8,9],"class":1},{"id":64,"variation":63,"price":90,"textures":[0,1,2,3,4,5,6,7,8,9],"class":1},{"id":65,"variation":64,"price":290,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"class":1},{"id":66,"variation":65,"price":110,"textures":[0],"class":1},{"id":67,"variation":66,"price":120,"textures":[0],"class":1},{"id":78,"variation":77,"price":90,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":84,"variation":83,"price":160,"textures":[0,1,2,3,4,5,6],"class":1},{"id":85,"variation":84,"price":390,"textures":[0,1,2,3,4,5,6,7,8,9],"class":1},{"id":92,"variation":91,"price":200000,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":1},{"id":93,"variation":92,"price":190000,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":1},{"id":95,"variation":94,"price":60,"textures":[0,1,2,3,4,5,6,7,8,9],"class":1},{"id":96,"variation":95,"price":175,"textures":[0,1,2,3,4,5,6,7,8,9],"class":1},{"id":97,"variation":96,"price":180,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":103,"variation":102,"price":70,"textures":[0,1,2,3,4,5,6,7,8,9],"class":1},{"id":104,"variation":103,"price":50,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],"class":1},{"id":105,"variation":104,"price":190,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":1},{"id":106,"variation":105,"price":195,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":1},{"id":107,"variation":106,"price":165,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":1},{"id":108,"variation":107,"price":70,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":1},{"id":109,"variation":108,"price":75,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":1},{"id":110,"variation":109,"price":45,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":1},{"id":111,"variation":110,"price":40,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":1},{"id":121,"variation":120,"price":230,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":1}]],[[{"id":100,"variation":0,"rows":5,"cols":5,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":101,"variation":1,"rows":5,"cols":5,"price":150,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":102,"variation":2,"rows":5,"cols":5,"price":130,"textures":[0],"class":1},{"id":103,"variation":3,"rows":5,"cols":5,"price":170,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":104,"variation":4,"rows":5,"cols":5,"price":270,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":105,"variation":5,"rows":5,"cols":5,"price":1000000,"textures":[8,14],"class":3},{"id":106,"variation":6,"rows":5,"cols":5,"price":400,"textures":[0,1,2],"class":3},{"id":107,"variation":7,"rows":5,"cols":5,"price":200,"textures":[0,1,2],"class":3},{"id":108,"variation":8,"rows":5,"cols":5,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,14],"class":2},{"id":109,"variation":9,"rows":5,"cols":5,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":110,"variation":10,"rows":5,"cols":5,"price":100,"textures":[0,1,2],"class":1},{"id":111,"variation":11,"rows":5,"cols":5,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":112,"variation":12,"rows":5,"cols":5,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":114,"variation":14,"rows":5,"cols":5,"price":250,"textures":[0,1,8,9],"class":2},{"id":115,"variation":15,"rows":5,"cols":5,"price":150,"textures":[0,3,10,11],"class":2},{"id":116,"variation":16,"rows":5,"cols":5,"price":250,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"class":2},{"id":117,"variation":17,"rows":5,"cols":5,"price":150,"textures":[0,1,2,3,4,5,6,7,8,9],"class":2},{"id":118,"variation":18,"rows":5,"cols":5,"price":400,"textures":[],"class":3},{"id":119,"variation":19,"rows":5,"cols":5,"price":400,"textures":[0,1,2,3,4],"class":2},{"id":120,"variation":20,"rows":5,"cols":5,"price":600,"textures":[0,1,2],"class":3},{"id":121,"variation":21,"rows":5,"cols":5,"price":150,"textures":[0],"class":2},{"id":122,"variation":22,"rows":5,"cols":5,"price":600,"textures":[0,1,2],"class":3},{"id":123,"variation":23,"rows":5,"cols":5,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12],"class":3},{"id":124,"variation":24,"rows":5,"cols":5,"price":350,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":3},{"id":125,"variation":25,"rows":5,"cols":5,"price":140,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"class":1},{"id":126,"variation":26,"rows":5,"cols":5,"price":300,"textures":[0],"class":2},{"id":127,"variation":27,"rows":5,"cols":5,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":128,"variation":28,"rows":5,"cols":5,"price":400,"textures":[0],"class":2},{"id":129,"variation":29,"rows":5,"cols":5,"price":500,"textures":[0],"class":2},{"id":130,"variation":30,"rows":5,"cols":5,"price":220,"textures":[0,1,2,3,4],"class":2},{"id":131,"variation":31,"rows":5,"cols":5,"price":320,"textures":[0,1],"class":2},{"id":134,"variation":34,"rows":5,"cols":5,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":135,"variation":35,"rows":5,"cols":5,"price":180,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":136,"variation":36,"rows":5,"cols":5,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":137,"variation":37,"rows":5,"cols":5,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":138,"variation":38,"rows":5,"cols":5,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":139,"variation":39,"rows":5,"cols":5,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":140,"variation":40,"rows":5,"cols":5,"price":250,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":141,"variation":41,"rows":5,"cols":5,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":142,"variation":42,"rows":5,"cols":5,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":143,"variation":43,"rows":5,"cols":5,"price":370,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":144,"variation":44,"rows":5,"cols":5,"price":370,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":145,"variation":45,"rows":5,"cols":5,"price":250,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":147,"variation":47,"rows":5,"cols":5,"price":280,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":148,"variation":48,"rows":5,"cols":5,"price":370,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":149,"variation":49,"rows":5,"cols":5,"price":370,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":150,"variation":50,"rows":5,"cols":5,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":151,"variation":51,"rows":5,"cols":5,"price":350,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":152,"variation":52,"rows":5,"cols":5,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":153,"variation":53,"rows":5,"cols":5,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":154,"variation":54,"rows":5,"cols":5,"price":350,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":155,"variation":55,"rows":5,"cols":5,"price":350,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":156,"variation":56,"rows":5,"cols":5,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":157,"variation":57,"rows":5,"cols":5,"price":120,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":158,"variation":58,"rows":5,"cols":5,"price":150,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":159,"variation":59,"rows":5,"cols":5,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":160,"variation":60,"rows":5,"cols":5,"price":360,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":161,"variation":61,"rows":5,"cols":5,"price":140,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":162,"variation":62,"rows":5,"cols":5,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":163,"variation":63,"rows":5,"cols":5,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":164,"variation":64,"rows":5,"cols":5,"price":550,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":165,"variation":65,"rows":5,"cols":5,"price":270,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":166,"variation":66,"rows":5,"cols":5,"price":150,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":167,"variation":67,"rows":5,"cols":5,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":168,"variation":68,"rows":5,"cols":5,"price":550,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":169,"variation":69,"rows":5,"cols":5,"price":650,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":170,"variation":70,"rows":5,"cols":5,"price":650,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":171,"variation":71,"rows":5,"cols":5,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":172,"variation":72,"rows":5,"cols":5,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":173,"variation":73,"rows":5,"cols":5,"price":380,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":174,"variation":74,"rows":5,"cols":5,"price":380,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":175,"variation":75,"rows":5,"cols":5,"price":380,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":176,"variation":76,"rows":5,"cols":5,"price":350,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":177,"variation":77,"rows":5,"cols":5,"price":350,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":178,"variation":78,"rows":5,"cols":5,"price":550,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":180,"variation":80,"rows":5,"cols":5,"price":250,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":181,"variation":81,"rows":5,"cols":5,"price":250,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":182,"variation":82,"rows":5,"cols":5,"price":150,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":183,"variation":83,"rows":5,"cols":5,"price":150,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":184,"variation":84,"rows":5,"cols":5,"price":250,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":185,"variation":85,"rows":5,"cols":5,"price":250,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":187,"variation":87,"rows":5,"cols":5,"price":650,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":189,"variation":89,"rows":5,"cols":5,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":190,"variation":90,"rows":5,"cols":5,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":191,"variation":91,"rows":5,"cols":5,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":192,"variation":92,"rows":5,"cols":5,"price":800,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":193,"variation":93,"rows":5,"cols":5,"price":700,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":194,"variation":94,"rows":5,"cols":5,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":195,"variation":95,"rows":5,"cols":5,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":196,"variation":96,"rows":5,"cols":5,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":197,"variation":97,"rows":5,"cols":5,"price":350,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":199,"variation":99,"rows":5,"cols":5,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":200,"variation":100,"rows":5,"cols":5,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":201,"variation":101,"rows":5,"cols":5,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":202,"variation":102,"rows":5,"cols":5,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2}],[{"id":1,"variation":0,"rows":5,"cols":5,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":2,"variation":1,"rows":5,"cols":5,"price":470,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":3,"variation":2,"rows":5,"cols":5,"price":60,"textures":[11],"class":3},{"id":4,"variation":3,"rows":5,"cols":5,"price":130,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":5,"variation":4,"rows":5,"cols":5,"price":520,"textures":[0,1],"class":2},{"id":6,"variation":5,"rows":5,"cols":5,"price":100,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],"class":2},{"id":7,"variation":6,"rows":5,"cols":5,"price":75,"textures":[0,1,2,10],"class":1},{"id":8,"variation":7,"rows":5,"cols":5,"price":120,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":9,"variation":8,"rows":5,"cols":5,"price":217,"textures":[0,3,4,14],"class":3},{"id":10,"variation":9,"rows":5,"cols":5,"price":750,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":11,"variation":10,"rows":5,"cols":5,"price":225,"textures":[0,1,2],"class":3},{"id":13,"variation":12,"rows":5,"cols":5,"price":260,"textures":[0,4,5,7],"class":2},{"id":14,"variation":13,"rows":5,"cols":5,"price":280,"textures":[0,1,2],"class":3},{"id":15,"variation":14,"rows":5,"cols":5,"price":85,"textures":[0,1,3],"class":2},{"id":16,"variation":15,"rows":5,"cols":5,"price":120,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":17,"variation":16,"rows":5,"cols":5,"price":210,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"class":2},{"id":18,"variation":17,"rows":5,"cols":5,"price":150,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":1},{"id":19,"variation":18,"rows":5,"cols":5,"price":640,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":2},{"id":20,"variation":19,"rows":5,"cols":5,"price":225,"textures":[0,1],"class":3},{"id":21,"variation":20,"rows":5,"cols":5,"price":290,"textures":[0,1,2,3],"class":3},{"id":22,"variation":21,"rows":5,"cols":5,"price":10,"textures":[0],"class":3},{"id":23,"variation":22,"rows":5,"cols":5,"price":850,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12],"class":3},{"id":24,"variation":23,"rows":5,"cols":5,"price":850,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12],"class":3},{"id":25,"variation":24,"rows":5,"cols":5,"price":1100,"textures":[0,1,2,3,4,5,6],"class":3},{"id":26,"variation":25,"rows":5,"cols":5,"price":140,"textures":[0,1,2,3,4,5,6],"class":3},{"id":27,"variation":26,"rows":5,"cols":5,"price":2500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"class":2},{"id":28,"variation":27,"rows":5,"cols":5,"price":250,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"class":3},{"id":29,"variation":28,"rows":5,"cols":5,"price":1950,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":2},{"id":30,"variation":29,"rows":5,"cols":5,"price":1600,"textures":[0,1],"class":3},{"id":32,"variation":31,"rows":5,"cols":5,"price":1020,"textures":[0,1,2,3],"class":2},{"id":33,"variation":32,"rows":5,"cols":5,"price":3000,"textures":[0,1,2,3],"class":3},{"id":34,"variation":33,"rows":5,"cols":5,"price":440,"textures":[0],"class":2},{"id":36,"variation":35,"rows":5,"cols":5,"price":650,"textures":[0],"class":3},{"id":37,"variation":36,"rows":5,"cols":5,"price":140,"textures":[0],"class":1},{"id":38,"variation":37,"rows":5,"cols":5,"price":570,"textures":[0,1,2,3],"class":3},{"id":39,"variation":38,"rows":5,"cols":5,"price":290,"textures":[0,1,2,3],"class":1},{"id":40,"variation":39,"rows":5,"cols":5,"price":480,"textures":[0,1,2,3],"class":1},{"id":41,"variation":40,"rows":5,"cols":5,"price":535,"textures":[0,1,2,3],"class":2},{"id":43,"variation":42,"rows":5,"cols":5,"price":85,"textures":[0,1,2,3,4,5,6,7],"class":1},{"id":44,"variation":43,"rows":5,"cols":5,"price":185,"textures":[0,1],"class":1},{"id":48,"variation":47,"rows":5,"cols":5,"price":850,"textures":[0,1],"class":2},{"id":49,"variation":48,"rows":5,"cols":5,"price":980,"textures":[0,1,2,3,4],"class":3},{"id":50,"variation":49,"rows":5,"cols":5,"price":1800,"textures":[0,1,2,3,4],"class":3},{"id":51,"variation":50,"rows":5,"cols":5,"price":245,"textures":[0,1,2,3],"class":3},{"id":52,"variation":51,"rows":5,"cols":5,"price":1300,"textures":[0],"class":2},{"id":53,"variation":52,"rows":5,"cols":5,"price":1800,"textures":[0,1,2,3],"class":3},{"id":55,"variation":54,"rows":5,"cols":5,"price":850,"textures":[0,1,2,3,4,5,6],"class":2},{"id":56,"variation":55,"rows":5,"cols":5,"price":170,"textures":[1,2,3,0],"class":1},{"id":58,"variation":57,"rows":5,"cols":5,"price":750,"textures":[0,1,2],"class":3},{"id":59,"variation":58,"rows":5,"cols":5,"price":670,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":60,"variation":59,"rows":5,"cols":5,"price":450,"textures":[0,1,2,3,4,5,6,7,8,9],"class":2},{"id":61,"variation":60,"rows":5,"cols":5,"price":620,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"class":3},{"id":62,"variation":61,"rows":5,"cols":5,"price":80,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13],"class":2},{"id":63,"variation":62,"rows":5,"cols":5,"price":165,"textures":[0,1,2,3],"class":1},{"id":64,"variation":63,"rows":5,"cols":5,"price":100,"textures":[0],"class":1},{"id":65,"variation":64,"rows":5,"cols":5,"price":125,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":1},{"id":66,"variation":65,"rows":5,"cols":5,"price":1200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13],"class":2},{"id":69,"variation":68,"rows":5,"cols":5,"price":2000,"textures":[0,1,2,3,4,5,6,7,8,9],"class":2},{"id":70,"variation":69,"rows":5,"cols":5,"price":4000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],"class":2},{"id":71,"variation":70,"rows":5,"cols":5,"price":2000,"textures":[0,1,2,3],"class":2},{"id":72,"variation":71,"rows":5,"cols":5,"price":635,"textures":[0,1,2,3,4,5],"class":2},{"id":73,"variation":72,"rows":5,"cols":5,"price":635,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":74,"variation":73,"rows":5,"cols":5,"price":635,"textures":[0,1,2,3,4,5],"class":2},{"id":75,"variation":74,"rows":5,"cols":5,"price":795,"textures":[0,1,2,3,4,5],"class":2},{"id":76,"variation":75,"rows":5,"cols":5,"price":160,"textures":[0,1,2,3,4,5,6,7],"class":1},{"id":77,"variation":76,"rows":5,"cols":5,"price":380,"textures":[0,1,2,3,4,5,6,7],"class":1},{"id":79,"variation":78,"rows":5,"cols":5,"price":880,"textures":[0,1,2,3,4,5,6,7],"class":1},{"id":80,"variation":79,"rows":5,"cols":5,"price":880,"textures":[0,1],"class":1},{"id":81,"variation":80,"rows":5,"cols":5,"price":995,"textures":[0,1,2,3,4,5,6,7],"class":2},{"id":82,"variation":81,"rows":5,"cols":5,"price":990,"textures":[0,1,2],"class":2},{"id":83,"variation":82,"rows":5,"cols":5,"price":330,"textures":[0,1,2,3,4,5,6,7,8,9],"class":1},{"id":84,"variation":83,"rows":5,"cols":5,"price":330,"textures":[0,1,2,3],"class":1},{"id":87,"variation":86,"rows":5,"cols":5,"price":1250,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"class":2},{"id":88,"variation":87,"rows":5,"cols":5,"price":1250,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"class":2},{"id":89,"variation":88,"rows":5,"cols":5,"price":585,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"class":2},{"id":90,"variation":89,"rows":5,"cols":5,"price":750,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"class":2},{"id":91,"variation":90,"rows":5,"cols":5,"price":750,"textures":[0,1,2,3,4,5,6,7,8,9],"class":1},{"id":92,"variation":91,"rows":5,"cols":5,"price":1800,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13],"class":2},{"id":95,"variation":94,"rows":5,"cols":5,"price":1500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":2},{"id":97,"variation":96,"rows":5,"cols":5,"price":335,"textures":[0,1],"class":2},{"id":98,"variation":97,"rows":5,"cols":5,"price":735,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":2},{"id":99,"variation":98,"rows":5,"cols":5,"price":735,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":2}]],[[{"id":134,"variation":0,"price":100000,"textures":[0],"class":1},{"id":135,"variation":1,"price":100000,"textures":[0,1,2,3],"class":1},{"id":136,"variation":2,"price":100000,"textures":[0,1,2,3],"class":1},{"id":137,"variation":3,"price":100000,"textures":[0],"class":1},{"id":138,"variation":4,"price":100000,"textures":[0,1,2,3],"class":1},{"id":139,"variation":5,"price":100000,"textures":[0,1,2,3],"class":1},{"id":140,"variation":6,"price":100000,"textures":[0,1,2,3],"class":1},{"id":141,"variation":7,"price":100000,"textures":[0,1,2,3],"class":1},{"id":142,"variation":8,"price":100000,"textures":[0,1,2],"class":1},{"id":143,"variation":9,"price":100000,"textures":[0],"class":1},{"id":144,"variation":10,"price":100000,"textures":[0],"class":1},{"id":145,"variation":11,"price":100000,"textures":[0,1,2],"class":1},{"id":146,"variation":12,"price":100000,"textures":[0,1,2],"class":1},{"id":147,"variation":13,"price":100000,"textures":[0],"class":1},{"id":148,"variation":14,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":149,"variation":15,"price":100000,"textures":[0,1,2,3],"class":1},{"id":150,"variation":16,"price":100000,"textures":[0,1,2,3,4,5,6,7,8],"class":1},{"id":151,"variation":17,"price":100000,"textures":[0,1],"class":1},{"id":152,"variation":18,"price":100000,"textures":[0,1],"class":1},{"id":153,"variation":19,"price":100000,"textures":[0,1],"class":1},{"id":154,"variation":20,"price":100000,"textures":[0,1],"class":1},{"id":155,"variation":21,"price":100000,"textures":[0,1],"class":1},{"id":156,"variation":22,"price":100000,"textures":[0,1],"class":1},{"id":157,"variation":23,"price":100000,"textures":[0,1],"class":1},{"id":158,"variation":24,"price":100000,"textures":[0,1],"class":1},{"id":159,"variation":25,"price":100000,"textures":[0,1],"class":1},{"id":160,"variation":26,"price":100000,"textures":[0,1],"class":1},{"id":161,"variation":27,"price":100000,"textures":[0],"class":1},{"id":162,"variation":28,"price":100000,"textures":[0,1,2,3,4],"class":3},{"id":163,"variation":29,"price":100000,"textures":[0,1,2,3,4],"class":1},{"id":164,"variation":30,"price":100000,"textures":[0],"class":1},{"id":165,"variation":31,"price":100000,"textures":[0],"class":1},{"id":166,"variation":32,"price":100000,"textures":[0],"class":1},{"id":167,"variation":33,"price":100000,"textures":[0],"class":1},{"id":168,"variation":34,"price":100000,"textures":[0,1,2],"class":1},{"id":169,"variation":35,"price":100000,"textures":[0],"class":1},{"id":170,"variation":36,"price":100000,"textures":[0],"class":1},{"id":171,"variation":37,"price":100000,"textures":[0],"class":1},{"id":172,"variation":38,"price":100000,"textures":[0],"class":1},{"id":173,"variation":39,"price":100000,"textures":[0,1],"class":1},{"id":174,"variation":40,"price":100000,"textures":[0,1],"class":1},{"id":175,"variation":41,"price":100000,"textures":[0,1],"class":1},{"id":176,"variation":42,"price":100000,"textures":[0,1],"class":1},{"id":177,"variation":43,"price":100000,"textures":[0],"class":1},{"id":178,"variation":44,"price":100000,"textures":[0],"class":1},{"id":179,"variation":45,"price":100000,"textures":[0],"class":1},{"id":180,"variation":46,"price":100000,"textures":[0],"class":1},{"id":181,"variation":47,"price":100000,"textures":[0,1,2,3],"class":1},{"id":182,"variation":48,"price":100000,"textures":[0,1,2,3],"class":1},{"id":183,"variation":49,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":1},{"id":184,"variation":50,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9],"class":1},{"id":185,"variation":51,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9],"class":1},{"id":186,"variation":52,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":1},{"id":187,"variation":53,"price":100000,"textures":[0,1,2,3,4,5,6,7,8],"class":1},{"id":188,"variation":54,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":1},{"id":189,"variation":55,"price":100000,"textures":[0,1],"class":1},{"id":190,"variation":56,"price":100000,"textures":[0,1,2,3,4,5,6,7,8],"class":1},{"id":191,"variation":57,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],"class":1},{"id":192,"variation":58,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9],"class":1},{"id":193,"variation":59,"price":100000,"textures":[0],"class":1},{"id":194,"variation":60,"price":100000,"textures":[0,1,2],"class":1},{"id":195,"variation":61,"price":100000,"textures":[0,1,2],"class":1},{"id":196,"variation":62,"price":100000,"textures":[0,1,2],"class":1},{"id":197,"variation":63,"price":100000,"textures":[0,1,2],"class":1},{"id":198,"variation":64,"price":100000,"textures":[0,1,2],"class":1},{"id":199,"variation":65,"price":100000,"textures":[0,1,2],"class":1},{"id":200,"variation":66,"price":100000,"textures":[0,1,2],"class":1},{"id":201,"variation":67,"price":100000,"textures":[0,1,2],"class":1},{"id":202,"variation":68,"price":100000,"textures":[0,1,2],"class":1},{"id":203,"variation":69,"price":100000,"textures":[0,1,2],"class":1},{"id":204,"variation":70,"price":100000,"textures":[0,1,2],"class":1},{"id":205,"variation":71,"price":100000,"textures":[0,1,2],"class":1},{"id":206,"variation":72,"price":100000,"textures":[0,1,2],"class":1},{"id":207,"variation":73,"price":100000,"textures":[0],"class":1},{"id":208,"variation":74,"price":100000,"textures":[0,1,2],"class":1},{"id":209,"variation":75,"price":100000,"textures":[0,1,2],"class":1},{"id":210,"variation":76,"price":100000,"textures":[0,1,2],"class":1},{"id":211,"variation":77,"price":100000,"textures":[0,1,2,3,4,5],"class":1},{"id":212,"variation":78,"price":100000,"textures":[0,1],"class":1},{"id":213,"variation":79,"price":100000,"textures":[0,1,2],"class":1},{"id":214,"variation":80,"price":100000,"textures":[0,1,2],"class":1},{"id":215,"variation":81,"price":100000,"textures":[0,1,2],"class":1},{"id":216,"variation":82,"price":100000,"textures":[0,1,2],"class":1},{"id":217,"variation":83,"price":100000,"textures":[0,1,2,3],"class":1},{"id":218,"variation":84,"price":100000,"textures":[0],"class":1},{"id":219,"variation":85,"price":100000,"textures":[0,1,2],"class":1},{"id":220,"variation":86,"price":100000,"textures":[0,1,2],"class":1},{"id":221,"variation":87,"price":100000,"textures":[0,1,2],"class":1},{"id":222,"variation":88,"price":100000,"textures":[0,1,2],"class":1},{"id":223,"variation":89,"price":100000,"textures":[0,1,2,3,4],"class":1},{"id":224,"variation":90,"price":100000,"textures":[0,1,2,3,4,5,6,7],"class":1},{"id":225,"variation":91,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":1},{"id":226,"variation":92,"price":100000,"textures":[0,1,2,3,4,5],"class":1},{"id":227,"variation":93,"price":100000,"textures":[0,1,2,3,4,5],"class":1},{"id":228,"variation":94,"price":100000,"textures":[0,1,2,3,4,5],"class":1},{"id":229,"variation":95,"price":100000,"textures":[0,1,2,3,4,5,6,7],"class":1},{"id":230,"variation":96,"price":100000,"textures":[0,1,2,3],"class":1},{"id":231,"variation":97,"price":100000,"textures":[0,1,2,3,4,5],"class":1},{"id":232,"variation":98,"price":100000,"textures":[0],"class":1},{"id":233,"variation":99,"price":100000,"textures":[0,1,2,3,4,5],"class":1},{"id":234,"variation":100,"price":100000,"textures":[0,1,2,3,4,5],"class":1},{"id":235,"variation":101,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":236,"variation":102,"price":100000,"textures":[0,1,2],"class":1},{"id":237,"variation":103,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":1},{"id":238,"variation":104,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":1},{"id":239,"variation":105,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"class":1},{"id":240,"variation":106,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":1},{"id":241,"variation":107,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"class":1},{"id":242,"variation":108,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"class":1},{"id":243,"variation":109,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"class":1},{"id":244,"variation":110,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":1},{"id":245,"variation":111,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":1},{"id":246,"variation":112,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":1},{"id":247,"variation":113,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],"class":2},{"id":248,"variation":114,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":2},{"id":249,"variation":115,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":2},{"id":250,"variation":116,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":2},{"id":251,"variation":117,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":252,"variation":118,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":2},{"id":253,"variation":119,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],"class":2},{"id":254,"variation":120,"price":100000,"textures":[0],"class":1},{"id":255,"variation":121,"price":100000,"textures":[0],"class":1},{"id":256,"variation":122,"price":100000,"textures":[0,1,2],"class":1},{"id":257,"variation":123,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"class":3},{"id":258,"variation":124,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"class":3},{"id":259,"variation":125,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":3},{"id":260,"variation":126,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],"class":3},{"id":261,"variation":127,"price":1000000,"textures":[0,1,2,3],"class":3},{"id":262,"variation":128,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":263,"variation":129,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],"class":3},{"id":264,"variation":130,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],"class":3},{"id":265,"variation":131,"price":1000000,"textures":[0,1,2,3],"class":3},{"id":266,"variation":132,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":3}],[{"id":2,"variation":1,"price":100000,"textures":[0,1,2,3],"class":1},{"id":3,"variation":2,"price":100000,"textures":[0,1,2,3],"class":1},{"id":4,"variation":3,"price":100000,"textures":[0],"class":1},{"id":5,"variation":4,"price":100000,"textures":[0,1,2,3],"class":1},{"id":6,"variation":5,"price":100000,"textures":[0,1,2,3],"class":1},{"id":7,"variation":6,"price":100000,"textures":[0,1,2,3],"class":1},{"id":8,"variation":7,"price":100000,"textures":[0,1,2,3],"class":1},{"id":9,"variation":8,"price":100000,"textures":[0,1,2],"class":1},{"id":10,"variation":9,"price":100000,"textures":[0],"class":1},{"id":11,"variation":10,"price":100000,"textures":[0],"class":1},{"id":12,"variation":11,"price":100000,"textures":[0,1,2],"class":1},{"id":13,"variation":12,"price":100000,"textures":[0,1,2],"class":1},{"id":14,"variation":13,"price":100000,"textures":[0],"class":1},{"id":15,"variation":14,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":16,"variation":15,"price":100000,"textures":[0,1,2,3],"class":1},{"id":17,"variation":16,"price":100000,"textures":[0,1,2,3,4,5,6,7,8],"class":1},{"id":18,"variation":17,"price":100000,"textures":[0,1],"class":1},{"id":19,"variation":18,"price":100000,"textures":[0,1],"class":1},{"id":20,"variation":19,"price":100000,"textures":[0,1],"class":1},{"id":21,"variation":20,"price":100000,"textures":[0,1],"class":1},{"id":22,"variation":21,"price":100000,"textures":[0,1],"class":1},{"id":23,"variation":22,"price":100000,"textures":[0,1],"class":1},{"id":24,"variation":23,"price":100000,"textures":[0,1],"class":1},{"id":25,"variation":24,"price":100000,"textures":[0,1],"class":1},{"id":26,"variation":25,"price":100000,"textures":[0,1],"class":1},{"id":27,"variation":26,"price":100000,"textures":[0,1],"class":1},{"id":28,"variation":27,"price":100000,"textures":[0],"class":1},{"id":29,"variation":28,"price":100000,"textures":[0,1,2,3,4],"class":1},{"id":30,"variation":29,"price":100000,"textures":[0,1,2,3,4],"class":1},{"id":31,"variation":30,"price":100000,"textures":[0],"class":1},{"id":32,"variation":31,"price":100000,"textures":[0],"class":1},{"id":33,"variation":32,"price":100000,"textures":[0],"class":1},{"id":34,"variation":33,"price":100000,"textures":[0],"class":1},{"id":35,"variation":34,"price":100000,"textures":[0,1,2],"class":1},{"id":36,"variation":35,"price":100000,"textures":[0],"class":1},{"id":37,"variation":36,"price":100000,"textures":[0],"class":1},{"id":38,"variation":37,"price":100000,"textures":[0],"class":1},{"id":39,"variation":38,"price":100000,"textures":[0],"class":1},{"id":40,"variation":39,"price":100000,"textures":[0,1],"class":1},{"id":41,"variation":40,"price":100000,"textures":[0,1],"class":1},{"id":42,"variation":41,"price":100000,"textures":[0,1],"class":1},{"id":43,"variation":42,"price":100000,"textures":[0,1],"class":1},{"id":44,"variation":43,"price":100000,"textures":[0],"class":1},{"id":45,"variation":44,"price":100000,"textures":[0],"class":1},{"id":46,"variation":45,"price":100000,"textures":[0],"class":1},{"id":47,"variation":46,"price":100000,"textures":[0],"class":1},{"id":48,"variation":47,"price":100000,"textures":[0,1,2,3],"class":1},{"id":49,"variation":48,"price":100000,"textures":[0,1,2,3],"class":1},{"id":50,"variation":49,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":1},{"id":51,"variation":50,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9],"class":1},{"id":52,"variation":51,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9],"class":1},{"id":53,"variation":52,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":1},{"id":54,"variation":53,"price":100000,"textures":[0,1,2,3,4,5,6,7,8],"class":1},{"id":55,"variation":54,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":1},{"id":56,"variation":55,"price":100000,"textures":[0,1],"class":1},{"id":57,"variation":56,"price":100000,"textures":[0,1,2,3,4,5,6,7,8],"class":1},{"id":58,"variation":57,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],"class":1},{"id":59,"variation":58,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9],"class":1},{"id":60,"variation":59,"price":100000,"textures":[0],"class":1},{"id":61,"variation":60,"price":100000,"textures":[0,1,2],"class":1},{"id":62,"variation":61,"price":100000,"textures":[0,1,2],"class":1},{"id":63,"variation":62,"price":100000,"textures":[0,1,2],"class":1},{"id":64,"variation":63,"price":100000,"textures":[0,1,2],"class":1},{"id":65,"variation":64,"price":100000,"textures":[0,1,2],"class":1},{"id":66,"variation":65,"price":100000,"textures":[0,1,2],"class":1},{"id":67,"variation":66,"price":100000,"textures":[0,1,2],"class":1},{"id":68,"variation":67,"price":100000,"textures":[0,1,2],"class":1},{"id":69,"variation":68,"price":100000,"textures":[0,1,2],"class":1},{"id":70,"variation":69,"price":100000,"textures":[0,1,2],"class":1},{"id":71,"variation":70,"price":100000,"textures":[0,1,2],"class":1},{"id":72,"variation":71,"price":100000,"textures":[0,1,2],"class":1},{"id":73,"variation":72,"price":100000,"textures":[0,1,2],"class":1},{"id":74,"variation":73,"price":100000,"textures":[0],"class":1},{"id":75,"variation":74,"price":100000,"textures":[0,1,2],"class":1},{"id":76,"variation":75,"price":100000,"textures":[0,1,2],"class":1},{"id":77,"variation":76,"price":100000,"textures":[0,1,2],"class":1},{"id":78,"variation":77,"price":100000,"textures":[0,1,2,3,4,5],"class":1},{"id":79,"variation":78,"price":100000,"textures":[0,1],"class":1},{"id":80,"variation":79,"price":100000,"textures":[0,1,2],"class":1},{"id":81,"variation":80,"price":100000,"textures":[0,1,2],"class":1},{"id":82,"variation":81,"price":100000,"textures":[0,1,2],"class":1},{"id":83,"variation":82,"price":100000,"textures":[0,1,2],"class":1},{"id":84,"variation":83,"price":100000,"textures":[0,1,2,3],"class":1},{"id":85,"variation":84,"price":100000,"textures":[0],"class":1},{"id":86,"variation":85,"price":100000,"textures":[0,1,2],"class":1},{"id":87,"variation":86,"price":100000,"textures":[0,1,2],"class":1},{"id":88,"variation":87,"price":100000,"textures":[0,1,2],"class":1},{"id":89,"variation":88,"price":100000,"textures":[0,1,2],"class":1},{"id":90,"variation":89,"price":100000,"textures":[0,1,2,3,4],"class":1},{"id":91,"variation":90,"price":100000,"textures":[0,1,2,3,4,5,6,7],"class":1},{"id":92,"variation":91,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":1},{"id":93,"variation":92,"price":100000,"textures":[0,1,2,3,4,5],"class":1},{"id":94,"variation":93,"price":100000,"textures":[0,1,2,3,4,5],"class":1},{"id":95,"variation":94,"price":100000,"textures":[0,1,2,3,4,5],"class":1},{"id":96,"variation":95,"price":100000,"textures":[0,1,2,3,4,5,6,7],"class":1},{"id":97,"variation":96,"price":100000,"textures":[0,1,2,3],"class":1},{"id":98,"variation":97,"price":100000,"textures":[0,1,2,3,4,5],"class":1},{"id":99,"variation":98,"price":100000,"textures":[0],"class":1},{"id":100,"variation":99,"price":100000,"textures":[0,1,2,3,4,5],"class":1},{"id":101,"variation":100,"price":100000,"textures":[0,1,2,3,4,5],"class":1},{"id":102,"variation":101,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":103,"variation":102,"price":100000,"textures":[0,1,2],"class":1},{"id":104,"variation":103,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":1},{"id":105,"variation":104,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":1},{"id":106,"variation":105,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"class":1},{"id":107,"variation":106,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":1},{"id":108,"variation":107,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"class":1},{"id":109,"variation":108,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"class":1},{"id":110,"variation":109,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"class":1},{"id":111,"variation":110,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":1},{"id":112,"variation":111,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":1},{"id":113,"variation":112,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":1},{"id":114,"variation":113,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],"class":1},{"id":115,"variation":114,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":1},{"id":116,"variation":115,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":1},{"id":117,"variation":116,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":1},{"id":118,"variation":117,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":1},{"id":119,"variation":118,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":1},{"id":120,"variation":119,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],"class":1},{"id":121,"variation":120,"price":100000,"textures":[0],"class":1},{"id":122,"variation":121,"price":100000,"textures":[0],"class":1},{"id":123,"variation":122,"price":100000,"textures":[0,1,2],"class":1},{"id":124,"variation":123,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"class":1},{"id":125,"variation":124,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"class":1},{"id":126,"variation":125,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":1},{"id":127,"variation":126,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],"class":1},{"id":128,"variation":127,"price":100000,"textures":[0,1,2,3],"class":1},{"id":129,"variation":128,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":1},{"id":130,"variation":129,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],"class":1},{"id":131,"variation":130,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],"class":1},{"id":132,"variation":131,"price":100000,"textures":[0,1,2,3],"class":1},{"id":133,"variation":132,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"class":1}]],[[{"id":84,"variation":0,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":85,"variation":10,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":86,"variation":11,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":87,"variation":12,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":88,"variation":16,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":89,"variation":17,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":90,"variation":18,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":91,"variation":19,"price":100,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":92,"variation":20,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":93,"variation":21,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":94,"variation":22,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":95,"variation":23,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":96,"variation":24,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":97,"variation":25,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":98,"variation":26,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":99,"variation":27,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":100,"variation":28,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":101,"variation":29,"price":1000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":102,"variation":30,"price":1000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":103,"variation":31,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":104,"variation":32,"price":1100,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":105,"variation":33,"price":1100,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":106,"variation":34,"price":1100,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":107,"variation":35,"price":1100,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":108,"variation":36,"price":1100,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":109,"variation":37,"price":1100,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":110,"variation":38,"price":800,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":111,"variation":39,"price":1000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":112,"variation":40,"price":1000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":113,"variation":41,"price":1000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":114,"variation":42,"price":1000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":115,"variation":43,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":116,"variation":44,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":117,"variation":45,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":118,"variation":46,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":119,"variation":47,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":120,"variation":48,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":121,"variation":49,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":122,"variation":50,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":123,"variation":51,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":124,"variation":52,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":125,"variation":53,"price":1000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":126,"variation":54,"price":1000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":127,"variation":55,"price":1000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":128,"variation":74,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":129,"variation":75,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":130,"variation":76,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":131,"variation":77,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":132,"variation":78,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":133,"variation":79,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":134,"variation":80,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":135,"variation":81,"price":1200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":136,"variation":82,"price":1200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":137,"variation":83,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":138,"variation":85,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":139,"variation":86,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":140,"variation":87,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":141,"variation":88,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":142,"variation":89,"price":1200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":143,"variation":90,"price":1200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":144,"variation":91,"price":1200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":145,"variation":92,"price":1200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":146,"variation":93,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":147,"variation":94,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":148,"variation":110,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":149,"variation":111,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":150,"variation":112,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":151,"variation":113,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":152,"variation":114,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":153,"variation":115,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":154,"variation":116,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":155,"variation":117,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":156,"variation":118,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":157,"variation":119,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":158,"variation":120,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":159,"variation":121,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":160,"variation":122,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":161,"variation":123,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":162,"variation":124,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":163,"variation":125,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":164,"variation":126,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":165,"variation":127,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":166,"variation":128,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3}],[{"id":2,"variation":10,"price":200,"textures":[0,1,2,3],"class":3},{"id":3,"variation":11,"price":100,"textures":[0],"class":3},{"id":4,"variation":12,"price":200,"textures":[0,1,2],"class":3},{"id":5,"variation":16,"price":200,"textures":[0,1,2],"class":3},{"id":6,"variation":17,"price":200,"textures":[0,1,2],"class":3},{"id":7,"variation":18,"price":200,"textures":[0],"class":3},{"id":8,"variation":19,"price":200,"textures":[0],"class":3},{"id":9,"variation":20,"price":200,"textures":[0],"class":3},{"id":10,"variation":21,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12],"class":3},{"id":11,"variation":22,"price":100,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],"class":3},{"id":12,"variation":23,"price":220,"textures":[0],"class":3},{"id":13,"variation":24,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":14,"variation":25,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":15,"variation":26,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":16,"variation":27,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":17,"variation":28,"price":200,"textures":[0],"class":3},{"id":18,"variation":29,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":19,"variation":30,"price":400,"textures":[0,1,2,3,4,5],"class":3},{"id":20,"variation":31,"price":400,"textures":[0,1,2,3,4,5],"class":3},{"id":21,"variation":32,"price":300,"textures":[0,1,2],"class":3},{"id":23,"variation":34,"price":370,"textures":[0,1,2],"class":3},{"id":24,"variation":35,"price":370,"textures":[0,1,2],"class":3},{"id":25,"variation":36,"price":70,"textures":[0],"class":3},{"id":26,"variation":37,"price":270,"textures":[0],"class":3},{"id":27,"variation":38,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10],"class":3},{"id":28,"variation":39,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":3},{"id":31,"variation":42,"price":5000,"textures":[0,1],"class":3},{"id":32,"variation":43,"price":5000,"textures":[0,1],"class":3},{"id":33,"variation":44,"price":5000,"textures":[0],"class":3},{"id":34,"variation":45,"price":5000,"textures":[0,1],"class":3},{"id":35,"variation":46,"price":5000,"textures":[0,1],"class":3},{"id":36,"variation":47,"price":25000,"textures":[0,1],"class":3},{"id":37,"variation":48,"price":25000,"textures":[0,1],"class":3},{"id":38,"variation":49,"price":25000,"textures":[0,1],"class":3},{"id":39,"variation":50,"price":30000,"textures":[0,1],"class":3},{"id":40,"variation":51,"price":27000,"textures":[0],"class":3},{"id":41,"variation":52,"price":40000,"textures":[0],"class":3},{"id":42,"variation":53,"price":40000,"textures":[0],"class":3},{"id":43,"variation":54,"price":20000,"textures":[0],"class":3},{"id":44,"variation":55,"price":20000,"textures":[0],"class":3},{"id":45,"variation":74,"price":15000,"textures":[0],"class":3},{"id":46,"variation":75,"price":20000,"textures":[0],"class":3},{"id":47,"variation":76,"price":25000,"textures":[0],"class":3},{"id":48,"variation":77,"price":18000,"textures":[0],"class":3},{"id":49,"variation":78,"price":15000,"textures":[0],"class":3},{"id":50,"variation":79,"price":32000,"textures":[0],"class":3},{"id":51,"variation":80,"price":24000,"textures":[0],"class":3},{"id":52,"variation":81,"price":19000,"textures":[0],"class":3},{"id":53,"variation":82,"price":20000,"textures":[0],"class":3},{"id":54,"variation":83,"price":20000,"textures":[0],"class":3},{"id":55,"variation":85,"price":18000,"textures":[0],"class":3},{"id":56,"variation":86,"price":27000,"textures":[0],"class":3},{"id":57,"variation":87,"price":22000,"textures":[0],"class":3},{"id":58,"variation":88,"price":20000,"textures":[0],"class":3},{"id":59,"variation":89,"price":16000,"textures":[0],"class":3},{"id":60,"variation":90,"price":30000,"textures":[0],"class":3},{"id":61,"variation":91,"price":35000,"textures":[0],"class":3},{"id":62,"variation":92,"price":33000,"textures":[0],"class":3},{"id":63,"variation":93,"price":26000,"textures":[0],"class":3},{"id":64,"variation":94,"price":20000,"textures":[0],"class":3},{"id":65,"variation":110,"price":21000,"textures":[0],"class":3},{"id":66,"variation":111,"price":24000,"textures":[0],"class":3},{"id":67,"variation":112,"price":500,"textures":[0],"class":3},{"id":68,"variation":113,"price":100,"textures":[0],"class":3},{"id":69,"variation":114,"price":100,"textures":[0],"class":3},{"id":70,"variation":115,"price":500,"textures":[0,1],"class":3},{"id":71,"variation":116,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9],"class":3},{"id":72,"variation":117,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9],"class":3},{"id":73,"variation":118,"price":200,"textures":[0],"class":3},{"id":74,"variation":119,"price":1200,"textures":[0],"class":3},{"id":75,"variation":120,"price":1200,"textures":[0],"class":3},{"id":76,"variation":121,"price":1200,"textures":[0],"class":3},{"id":77,"variation":122,"price":1200,"textures":[0],"class":3},{"id":78,"variation":123,"price":120,"textures":[0],"class":3},{"id":79,"variation":124,"price":120,"textures":[0],"class":3}]],[[{"id":256,"variation":1,"rows":3,"cols":3,"price":280,"textures":[0,1,2,4,5,6,9,11,14],"torso":5,"class":2},{"id":257,"variation":2,"rows":3,"cols":3,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"torso":2,"class":2},{"id":258,"variation":3,"rows":3,"cols":3,"price":350,"textures":[0,1,2,3,4,10,11,12,13,14],"torso":3,"class":2},{"id":259,"variation":4,"rows":3,"cols":3,"price":100,"textures":[13,14],"torso":4,"class":1},{"id":260,"variation":5,"rows":3,"cols":3,"price":100,"textures":[0,1,7,9],"torso":4,"class":1},{"id":261,"variation":6,"rows":3,"cols":3,"price":1000,"textures":[0,1,2,4],"torso":5,"class":3},{"id":262,"variation":7,"rows":3,"cols":3,"price":1100,"textures":[0,1,2,8],"torso":5,"class":3},{"id":263,"variation":8,"rows":3,"cols":3,"price":300,"textures":[0,1,2,12],"torso":5,"class":2},{"id":264,"variation":9,"rows":3,"cols":3,"price":150,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],"torso":0,"class":2},{"id":265,"variation":10,"rows":3,"cols":3,"price":250,"textures":[0,1,2,7,10,11,13,15],"torso":5,"class":2},{"id":266,"variation":11,"rows":3,"cols":3,"price":200,"textures":[0,1,2,10,11,15],"torso":4,"class":2},{"id":267,"variation":12,"rows":3,"cols":3,"price":200,"textures":[7,8,9],"torso":12,"class":2},{"id":268,"variation":13,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"torso":15,"class":3},{"id":269,"variation":14,"rows":3,"cols":3,"price":150,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"torso":14,"class":1},{"id":270,"variation":15,"rows":3,"cols":3,"price":150,"textures":[0,3,10,11],"torso":15,"class":2},{"id":271,"variation":16,"rows":3,"cols":3,"price":250,"textures":[0,1,2,3,4,5,6],"torso":15,"class":2},{"id":272,"variation":17,"rows":3,"cols":3,"price":350,"textures":[0],"torso":0,"class":2},{"id":273,"variation":18,"rows":3,"cols":3,"price":150,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"torso":15,"class":2},{"id":274,"variation":19,"rows":3,"cols":3,"price":450,"textures":[0,1,2,3],"torso":15,"class":2},{"id":275,"variation":20,"rows":3,"cols":3,"price":1450,"textures":[0,1],"torso":5,"class":3},{"id":276,"variation":21,"rows":3,"cols":3,"price":1000,"textures":[0,1,2,3,4,5],"torso":4,"class":2},{"id":277,"variation":22,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3,4],"torso":4,"class":2},{"id":278,"variation":23,"rows":3,"cols":3,"price":100,"textures":[0,1,2],"torso":4,"class":1},{"id":279,"variation":24,"rows":3,"cols":3,"price":1400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"torso":5,"class":3},{"id":280,"variation":25,"rows":3,"cols":3,"price":1500,"textures":[0,1,2,3,4,5,6,7,8,9,10],"torso":5,"class":3},{"id":281,"variation":26,"rows":3,"cols":3,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12],"torso":12,"class":2},{"id":282,"variation":27,"rows":3,"cols":3,"price":150,"textures":[0,1,2,3,4,5],"torso":0,"class":2},{"id":283,"variation":28,"rows":3,"cols":3,"price":800,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"torso":15,"class":3},{"id":285,"variation":30,"rows":3,"cols":3,"price":150,"textures":[0,1,2],"torso":2,"class":2},{"id":286,"variation":31,"rows":3,"cols":3,"price":350,"textures":[0,1,2,3,4,5,6],"torso":5,"class":2},{"id":287,"variation":32,"rows":3,"cols":3,"price":300,"textures":[0,1,2],"torso":4,"class":2},{"id":288,"variation":33,"rows":3,"cols":3,"price":300,"textures":[0,1,2,3,4,5,6,7,8],"torso":4,"class":2},{"id":289,"variation":34,"rows":3,"cols":3,"price":1000,"textures":[0],"torso":6,"class":2},{"id":290,"variation":35,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"torso":5,"class":2},{"id":291,"variation":36,"rows":3,"cols":3,"price":200,"textures":[0,1,2,3,4],"torso":4,"class":2},{"id":292,"variation":37,"rows":3,"cols":3,"price":1000,"textures":[0,1,2,3,4,5],"torso":4,"class":2},{"id":293,"variation":38,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3],"torso":2,"class":2},{"id":294,"variation":39,"rows":3,"cols":3,"price":400,"textures":[0],"torso":1,"class":2},{"id":295,"variation":40,"rows":3,"cols":3,"price":300,"textures":[0,1],"torso":2,"class":2},{"id":298,"variation":43,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3,4],"torso":3,"class":3},{"id":299,"variation":44,"rows":3,"cols":3,"price":500,"textures":[0,1,2],"torso":3,"class":3},{"id":300,"variation":45,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3],"torso":3,"class":3},{"id":301,"variation":46,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3],"torso":3,"class":3},{"id":304,"variation":49,"rows":3,"cols":3,"price":500,"textures":[0,1],"torso":14,"class":3},{"id":305,"variation":50,"rows":3,"cols":3,"price":500,"textures":[0],"torso":14,"class":3},{"id":306,"variation":51,"rows":3,"cols":3,"price":500,"textures":[0],"torso":6,"class":3},{"id":307,"variation":52,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3],"torso":6,"class":3},{"id":308,"variation":53,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3],"torso":5,"class":3},{"id":309,"variation":54,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3],"torso":5,"class":3},{"id":310,"variation":55,"rows":3,"cols":3,"price":500,"textures":[0],"torso":5,"class":3},{"id":311,"variation":56,"rows":3,"cols":3,"price":250,"textures":[0],"torso":14,"class":1},{"id":312,"variation":57,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3,4,5,6,7,8],"torso":5,"class":2},{"id":313,"variation":58,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3,4,5,6,7,8],"torso":5,"class":2},{"id":314,"variation":59,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3],"torso":5,"class":2},{"id":315,"variation":60,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3],"torso":14,"class":2},{"id":316,"variation":61,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3],"torso":3,"class":2},{"id":317,"variation":62,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3,4,5],"torso":5,"class":2},{"id":318,"variation":63,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3,4,5],"torso":5,"class":2},{"id":319,"variation":64,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4],"torso":5,"class":2},{"id":320,"variation":65,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"torso":5,"class":2},{"id":321,"variation":66,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3],"torso":6,"class":2},{"id":322,"variation":67,"rows":3,"cols":3,"price":222,"textures":[0],"torso":2,"class":2},{"id":323,"variation":68,"rows":3,"cols":3,"price":222,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],"torso":0,"class":2},{"id":324,"variation":69,"rows":3,"cols":3,"price":600,"textures":[0],"torso":0,"class":2},{"id":325,"variation":70,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4],"torso":0,"class":2},{"id":326,"variation":71,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"torso":0,"class":2},{"id":327,"variation":72,"rows":3,"cols":3,"price":600,"textures":[0],"torso":0,"class":2},{"id":328,"variation":73,"rows":3,"cols":3,"price":200,"textures":[0,1,2],"torso":14,"class":2},{"id":329,"variation":74,"rows":3,"cols":3,"price":222,"textures":[0,1,2],"torso":15,"class":2},{"id":330,"variation":75,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3],"torso":9,"class":3},{"id":331,"variation":76,"rows":3,"cols":3,"price":200,"textures":[0,1,2,3,4],"torso":9,"class":1},{"id":332,"variation":77,"rows":3,"cols":3,"price":400,"textures":[0],"torso":9,"class":2},{"id":333,"variation":78,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3,4,5,6,7],"torso":9,"class":2},{"id":334,"variation":79,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3],"torso":9,"class":2},{"id":335,"variation":80,"rows":3,"cols":3,"price":600,"textures":[0],"torso":9,"class":2},{"id":336,"variation":81,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"torso":9,"class":2},{"id":337,"variation":83,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4,5,6],"torso":9,"class":2},{"id":338,"variation":84,"rows":3,"cols":3,"price":300,"textures":[0,1,2],"torso":14,"class":2},{"id":339,"variation":85,"rows":3,"cols":3,"price":300,"textures":[0,1,2],"torso":14,"class":2},{"id":340,"variation":86,"rows":3,"cols":3,"price":300,"textures":[0,1,2],"torso":9,"class":2},{"id":341,"variation":87,"rows":3,"cols":3,"price":300,"textures":[0],"torso":9,"class":2},{"id":342,"variation":88,"rows":3,"cols":3,"price":300,"textures":[0,1],"torso":0,"class":2},{"id":343,"variation":89,"rows":3,"cols":3,"price":600,"textures":[0,1],"torso":0,"class":2},{"id":344,"variation":90,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4],"torso":6,"class":3},{"id":345,"variation":91,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4],"torso":6,"class":3},{"id":346,"variation":92,"rows":3,"cols":3,"price":300,"textures":[0,1,2,3],"torso":5,"class":2},{"id":347,"variation":93,"rows":3,"cols":3,"price":300,"textures":[0,1,2,3],"torso":5,"class":2},{"id":348,"variation":94,"rows":3,"cols":3,"price":400,"textures":[0],"torso":5,"class":3},{"id":349,"variation":95,"rows":3,"cols":3,"price":400,"textures":[0],"torso":5,"class":3},{"id":350,"variation":96,"rows":3,"cols":3,"price":400,"textures":[0],"torso":4,"class":3},{"id":351,"variation":97,"rows":3,"cols":3,"price":600,"textures":[0],"torso":5,"class":2},{"id":352,"variation":98,"rows":3,"cols":3,"price":800,"textures":[0,1,2,3,4],"torso":5,"class":3},{"id":353,"variation":99,"rows":3,"cols":3,"price":800,"textures":[0,1,2,3,4,5,6,7,8,9,10],"torso":5,"class":3},{"id":354,"variation":100,"rows":3,"cols":3,"price":200,"textures":[0],"torso":0,"class":2},{"id":355,"variation":101,"rows":3,"cols":3,"price":200,"textures":[0,1,2,3,4,5],"torso":15,"class":2},{"id":356,"variation":102,"rows":3,"cols":3,"price":800,"textures":[0],"torso":3,"class":2},{"id":357,"variation":103,"rows":3,"cols":3,"price":200,"textures":[0,1,2,3,4,5],"torso":3,"class":2},{"id":358,"variation":104,"rows":3,"cols":3,"price":800,"textures":[0],"torso":5,"class":3},{"id":359,"variation":105,"rows":3,"cols":3,"price":200,"textures":[0,1,2,3,4,5,6,7],"torso":4,"class":2},{"id":360,"variation":106,"rows":3,"cols":3,"price":200,"textures":[0,1,2,3],"torso":6,"class":2},{"id":361,"variation":107,"rows":3,"cols":3,"price":800,"textures":[0],"torso":6,"class":3},{"id":362,"variation":108,"rows":3,"cols":3,"price":900,"textures":[0,1,2],"torso":6,"class":3},{"id":363,"variation":109,"rows":3,"cols":3,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"torso":6,"class":2},{"id":364,"variation":110,"rows":3,"cols":3,"price":800,"textures":[0,1,2,3,4,5,6,7,8,9],"torso":6,"class":2},{"id":365,"variation":111,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"torso":4,"class":2},{"id":366,"variation":112,"rows":3,"cols":3,"price":500,"textures":[0,1,2],"torso":4,"class":2},{"id":367,"variation":113,"rows":3,"cols":3,"price":500,"textures":[0,1,2],"torso":4,"class":2},{"id":368,"variation":114,"rows":3,"cols":3,"price":500,"textures":[0,1,2],"torso":4,"class":2},{"id":369,"variation":115,"rows":3,"cols":3,"price":500,"textures":[0,1,2],"torso":4,"class":2},{"id":370,"variation":116,"rows":3,"cols":3,"price":500,"textures":[0,1,2],"torso":4,"class":2},{"id":371,"variation":117,"rows":3,"cols":3,"price":200,"textures":[0,1,2],"torso":11,"class":1},{"id":372,"variation":118,"rows":3,"cols":3,"price":200,"textures":[0,1,2],"torso":11,"class":1},{"id":373,"variation":119,"rows":3,"cols":3,"price":200,"textures":[0,1,2],"torso":11,"class":2},{"id":374,"variation":120,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],"torso":6,"class":2},{"id":375,"variation":121,"rows":3,"cols":3,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],"torso":6,"class":2},{"id":376,"variation":122,"rows":3,"cols":3,"price":400,"textures":[0],"torso":2,"class":2},{"id":377,"variation":123,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"torso":2,"class":2},{"id":378,"variation":125,"rows":3,"cols":3,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9],"torso":14,"class":2},{"id":379,"variation":126,"rows":3,"cols":3,"price":200,"textures":[0,1,2],"torso":14,"class":2},{"id":380,"variation":127,"rows":3,"cols":3,"price":600,"textures":[0],"torso":14,"class":2},{"id":381,"variation":128,"rows":3,"cols":3,"price":400,"textures":[0],"torso":14,"class":3},{"id":382,"variation":129,"rows":3,"cols":3,"price":400,"textures":[0],"torso":14,"class":3},{"id":383,"variation":130,"rows":3,"cols":3,"price":400,"textures":[0],"torso":0,"class":3},{"id":384,"variation":131,"rows":3,"cols":3,"price":400,"textures":[0,1,2],"torso":3,"class":3},{"id":385,"variation":132,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3,4,5,6],"torso":2,"class":2},{"id":386,"variation":133,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4,5,6],"torso":5,"class":2},{"id":387,"variation":135,"rows":3,"cols":3,"price":400,"textures":[0,1,2],"torso":3,"class":2},{"id":388,"variation":136,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3,4,5,6,7],"torso":3,"class":2},{"id":389,"variation":137,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],"torso":5,"class":3},{"id":390,"variation":138,"rows":3,"cols":3,"price":250,"textures":[0,1,2,3,4,5,6,7,8,9,10],"torso":6,"class":2},{"id":391,"variation":139,"rows":3,"cols":3,"price":600,"textures":[0,1,2],"torso":5,"class":2},{"id":392,"variation":140,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9],"torso":5,"class":2},{"id":393,"variation":141,"rows":3,"cols":3,"price":200,"textures":[0,1,2,3,4,5],"torso":14,"class":2},{"id":394,"variation":142,"rows":3,"cols":3,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13],"torso":9,"class":2},{"id":395,"variation":143,"rows":3,"cols":3,"price":700,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13],"torso":5,"class":2},{"id":396,"variation":144,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9],"torso":3,"class":2},{"id":397,"variation":145,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"torso":3,"class":2},{"id":398,"variation":146,"rows":3,"cols":3,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9],"torso":7,"class":1},{"id":399,"variation":147,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"torso":1,"class":2},{"id":400,"variation":148,"rows":3,"cols":3,"price":300,"textures":[0,1,2,3,4,5],"torso":5,"class":2},{"id":401,"variation":149,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"torso":5,"class":2},{"id":402,"variation":150,"rows":3,"cols":3,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":0,"class":2},{"id":403,"variation":151,"rows":3,"cols":3,"price":300,"textures":[0,1,2,3,4,5,6,7],"torso":0,"class":2},{"id":404,"variation":152,"rows":3,"cols":3,"price":200,"textures":[0,1,2,3],"torso":7,"class":1},{"id":405,"variation":153,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3,4,5],"torso":5,"class":2},{"id":406,"variation":154,"rows":3,"cols":3,"price":200,"textures":[0,1,2,3],"torso":15,"class":1},{"id":407,"variation":155,"rows":3,"cols":3,"price":200,"textures":[0,1,2],"torso":15,"class":1},{"id":408,"variation":156,"rows":3,"cols":3,"price":200,"textures":[0,1],"torso":15,"class":1},{"id":409,"variation":157,"rows":3,"cols":3,"price":200,"textures":[0,1],"torso":15,"class":1},{"id":410,"variation":158,"rows":3,"cols":3,"price":300,"textures":[0,1,2,3],"torso":15,"class":2},{"id":411,"variation":159,"rows":3,"cols":3,"price":300,"textures":[0,1,2,3],"torso":15,"class":2},{"id":412,"variation":160,"rows":3,"cols":3,"price":300,"textures":[0],"torso":15,"class":2},{"id":413,"variation":161,"rows":3,"cols":3,"price":300,"textures":[0,1,2],"torso":11,"class":1},{"id":414,"variation":162,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4,5,6],"torso":0,"class":2},{"id":415,"variation":163,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4,5],"torso":5,"class":2},{"id":416,"variation":164,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"torso":5,"class":2},{"id":417,"variation":165,"rows":3,"cols":3,"price":300,"textures":[0,1,2],"torso":5,"class":2},{"id":418,"variation":166,"rows":3,"cols":3,"price":300,"textures":[0,1,2,3],"torso":5,"class":2},{"id":419,"variation":167,"rows":3,"cols":3,"price":200,"textures":[0,1,2,3],"torso":15,"class":1},{"id":420,"variation":168,"rows":3,"cols":3,"price":200,"textures":[0,1,2,3,4,5],"torso":15,"class":1},{"id":421,"variation":169,"rows":3,"cols":3,"price":200,"textures":[0,1,2,3,4,5],"torso":15,"class":1},{"id":422,"variation":170,"rows":3,"cols":3,"price":200,"textures":[0,1,2,3,4,5],"torso":15,"class":1},{"id":423,"variation":171,"rows":3,"cols":3,"price":200,"textures":[0,1,2,3,4,5,6,7],"torso":15,"class":1},{"id":424,"variation":172,"rows":3,"cols":3,"price":400,"textures":[0,1],"torso":14,"class":2},{"id":425,"variation":173,"rows":3,"cols":3,"price":200,"textures":[0],"torso":15,"class":1},{"id":426,"variation":174,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3],"torso":15,"class":2},{"id":427,"variation":175,"rows":3,"cols":3,"price":200,"textures":[0,1,2,3],"torso":15,"class":1},{"id":428,"variation":176,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3],"torso":15,"class":2},{"id":429,"variation":177,"rows":3,"cols":3,"price":200,"textures":[0,1,2,3],"torso":15,"class":1},{"id":430,"variation":178,"rows":3,"cols":3,"price":200,"textures":[0],"torso":15,"class":1},{"id":431,"variation":179,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3,4,5,6],"torso":11,"class":3},{"id":433,"variation":181,"rows":3,"cols":3,"price":200,"textures":[0,1,2,3],"torso":15,"class":2},{"id":434,"variation":182,"rows":3,"cols":3,"price":200,"textures":[0,1,2],"torso":15,"class":2},{"id":435,"variation":183,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4,5],"torso":15,"class":2},{"id":436,"variation":184,"rows":3,"cols":3,"price":300,"textures":[0,1],"torso":14,"class":2},{"id":437,"variation":185,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3,4,5],"torso":6,"class":2},{"id":438,"variation":186,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3],"torso":6,"class":2},{"id":439,"variation":187,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3],"torso":6,"class":2},{"id":441,"variation":189,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12],"torso":6,"class":2},{"id":442,"variation":190,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10],"torso":6,"class":2},{"id":443,"variation":191,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10],"torso":6,"class":2},{"id":444,"variation":192,"rows":3,"cols":3,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":5,"class":2},{"id":445,"variation":193,"rows":3,"cols":3,"price":1000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":5,"class":2},{"id":446,"variation":194,"rows":3,"cols":3,"price":1200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"torso":5,"class":3},{"id":447,"variation":195,"rows":3,"cols":3,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":4,"class":2},{"id":448,"variation":196,"rows":3,"cols":3,"price":800,"textures":[0,1,2],"torso":1,"class":2},{"id":449,"variation":197,"rows":3,"cols":3,"price":800,"textures":[0,1,2],"torso":1,"class":2},{"id":450,"variation":198,"rows":3,"cols":3,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"torso":1,"class":2},{"id":451,"variation":199,"rows":3,"cols":3,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"torso":1,"class":2},{"id":452,"variation":200,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4,5,6,7],"torso":1,"class":3},{"id":453,"variation":201,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4,5,6,7],"torso":1,"class":3},{"id":454,"variation":202,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":1,"class":3},{"id":456,"variation":204,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3,4],"torso":4,"class":2},{"id":457,"variation":205,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":0,"class":2},{"id":458,"variation":206,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12],"torso":1,"class":3},{"id":459,"variation":207,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3,4],"torso":4,"class":3},{"id":460,"variation":208,"rows":3,"cols":3,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],"torso":11,"class":2},{"id":461,"variation":209,"rows":3,"cols":3,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],"torso":11,"class":2},{"id":462,"variation":210,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":11,"class":3},{"id":463,"variation":211,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":11,"class":3},{"id":464,"variation":212,"rows":3,"cols":3,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":0,"class":2},{"id":465,"variation":213,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":1,"class":3},{"id":466,"variation":214,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":1,"class":3},{"id":467,"variation":215,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":1,"class":2},{"id":468,"variation":216,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":5,"class":2},{"id":469,"variation":217,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":4,"class":2},{"id":470,"variation":218,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":0,"class":2},{"id":471,"variation":219,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":5,"class":2},{"id":472,"variation":220,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":15,"class":2},{"id":473,"variation":221,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":15,"class":2},{"id":474,"variation":222,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":15,"class":2},{"id":475,"variation":223,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":15,"class":2},{"id":476,"variation":224,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":14,"class":2},{"id":477,"variation":225,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":15,"class":2},{"id":478,"variation":226,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":11,"class":2},{"id":479,"variation":227,"rows":3,"cols":3,"price":450,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],"torso":3,"class":2},{"id":480,"variation":228,"rows":3,"cols":3,"price":450,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],"torso":3,"class":2},{"id":481,"variation":229,"rows":3,"cols":3,"price":650,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":4,"class":2},{"id":482,"variation":230,"rows":3,"cols":3,"price":650,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":0,"class":2},{"id":483,"variation":231,"rows":3,"cols":3,"price":650,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":0,"class":2},{"id":484,"variation":232,"rows":3,"cols":3,"price":650,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":0,"class":2},{"id":485,"variation":233,"rows":3,"cols":3,"price":650,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"torso":11,"class":2},{"id":486,"variation":234,"rows":3,"cols":3,"price":650,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"torso":6,"class":2},{"id":487,"variation":235,"rows":3,"cols":3,"price":250,"textures":[0,1],"torso":1,"class":2},{"id":488,"variation":236,"rows":3,"cols":3,"price":250,"textures":[0],"torso":14,"class":2},{"id":489,"variation":237,"rows":3,"cols":3,"price":750,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13],"torso":3,"class":2},{"id":491,"variation":239,"rows":3,"cols":3,"price":450,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"torso":3,"class":2},{"id":492,"variation":240,"rows":3,"cols":3,"price":450,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"torso":5,"class":2},{"id":494,"variation":242,"rows":3,"cols":3,"price":750,"textures":[0,1,2,3,4,5,6,7,8,9],"torso":6,"class":2},{"id":495,"variation":243,"rows":3,"cols":3,"price":750,"textures":[0,1,2,3,4,5,6,7,8,9],"torso":6,"class":2},{"id":496,"variation":244,"rows":3,"cols":3,"price":250,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":9,"class":2},{"id":497,"variation":245,"rows":3,"cols":3,"price":250,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"torso":14,"class":2},{"id":498,"variation":246,"rows":3,"cols":3,"price":250,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"torso":14,"class":2},{"id":499,"variation":247,"rows":3,"cols":3,"price":150,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":4,"class":2},{"id":500,"variation":248,"rows":3,"cols":3,"price":1000,"textures":[0,1,2,3,4,5],"torso":5,"class":2},{"id":501,"variation":249,"rows":3,"cols":3,"price":1000000,"textures":[0,1,2,3,4,5],"torso":0,"class":3},{"id":502,"variation":250,"rows":3,"cols":3,"price":1000000,"textures":[0,1,2,3,4,5],"torso":0,"class":3},{"id":503,"variation":251,"rows":3,"cols":3,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":3,"class":3},{"id":504,"variation":252,"rows":3,"cols":3,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":5,"class":3},{"id":505,"variation":253,"rows":3,"cols":3,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9],"torso":1,"class":3},{"id":507,"variation":255,"rows":3,"cols":3,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":11,"class":3},{"id":509,"variation":257,"rows":3,"cols":3,"price":200,"textures":[0,1],"torso":6,"class":2},{"id":511,"variation":259,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":3,"class":2},{"id":513,"variation":261,"rows":3,"cols":3,"price":1000000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":3,"class":3}],[{"id":1,"variation":0,"rows":3,"cols":3,"price":75,"textures":[0,1,2,3,4,5,7,8,11],"torso":0,"class":1},{"id":2,"variation":1,"rows":3,"cols":3,"price":85,"textures":[0,1,3,4,5,6,7,8,11,12,14],"torso":0,"class":2},{"id":4,"variation":3,"rows":3,"cols":3,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"torso":14,"class":2},{"id":5,"variation":4,"rows":3,"cols":3,"price":900,"textures":[0,2,3,11,14],"torso":14,"class":3},{"id":6,"variation":5,"rows":3,"cols":3,"price":200,"textures":[0,1,2,7],"torso":5,"class":1},{"id":7,"variation":6,"rows":3,"cols":3,"price":400,"textures":[0,1,3,4,5,6,8,9,11],"torso":14,"class":2},{"id":8,"variation":7,"rows":3,"cols":3,"price":130,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"torso":14,"class":2},{"id":9,"variation":8,"rows":3,"cols":3,"price":45,"textures":[0,10,13,14],"torso":8,"class":2},{"id":10,"variation":9,"rows":3,"cols":3,"price":300,"textures":[0,1,2,3,4,5,6,7,10,11,12,13,14,15],"torso":0,"class":2},{"id":11,"variation":10,"rows":3,"cols":3,"price":900,"textures":[0,1,2],"torso":14,"class":3},{"id":12,"variation":11,"rows":3,"cols":3,"price":200,"textures":[0,1,7,14],"torso":15,"class":3},{"id":13,"variation":12,"rows":3,"cols":3,"price":130,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"torso":12,"class":2},{"id":14,"variation":13,"rows":3,"cols":3,"price":200,"textures":[0,1,2,3,5,13],"torso":11,"class":2},{"id":15,"variation":14,"rows":3,"cols":3,"price":150,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"torso":12,"class":2},{"id":17,"variation":16,"rows":3,"cols":3,"price":85,"textures":[0,1,2],"torso":0,"class":2},{"id":18,"variation":17,"rows":3,"cols":3,"price":20,"textures":[0,1,2,3,4,5],"torso":5,"class":1},{"id":19,"variation":18,"rows":3,"cols":3,"price":6000,"textures":[0,1,2,3],"torso":0,"class":3},{"id":20,"variation":19,"rows":3,"cols":3,"price":2000,"textures":[0,1],"torso":14,"class":3},{"id":21,"variation":20,"rows":3,"cols":3,"price":3000,"textures":[0,1,2,3],"torso":14,"class":3},{"id":22,"variation":21,"rows":3,"cols":3,"price":700,"textures":[0,1,2,3],"torso":15,"class":3},{"id":23,"variation":22,"rows":3,"cols":3,"price":80,"textures":[0,1,2],"torso":0,"class":2},{"id":24,"variation":23,"rows":3,"cols":3,"price":1300,"textures":[0,1,2,3],"torso":14,"class":3},{"id":25,"variation":24,"rows":3,"cols":3,"price":2300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12],"torso":14,"class":3},{"id":26,"variation":25,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9],"torso":15,"class":3},{"id":27,"variation":26,"rows":3,"cols":3,"price":160,"textures":[0,1,2,3,4,5,6,7,8,9],"torso":11,"class":2},{"id":28,"variation":27,"rows":3,"cols":3,"price":1600,"textures":[0,1,2],"torso":14,"class":3},{"id":29,"variation":28,"rows":3,"cols":3,"price":1000,"textures":[0,1,2],"torso":14,"class":3},{"id":30,"variation":29,"rows":3,"cols":3,"price":1600,"textures":[0,1,2,3,4,5,6,7],"torso":14,"class":3},{"id":31,"variation":30,"rows":3,"cols":3,"price":1400,"textures":[0,1,2,3,4,5,6,7],"torso":14,"class":3},{"id":32,"variation":31,"rows":3,"cols":3,"price":1000,"textures":[0,1,2,3,4,5,6,7],"torso":14,"class":3},{"id":33,"variation":32,"rows":3,"cols":3,"price":1000,"textures":[0,1,2,3,4,5,6,7],"torso":14,"class":3},{"id":34,"variation":33,"rows":3,"cols":3,"price":170,"textures":[0],"torso":0,"class":2},{"id":35,"variation":34,"rows":3,"cols":3,"price":165,"textures":[0,1],"torso":0,"class":2},{"id":36,"variation":35,"rows":3,"cols":3,"price":3000,"textures":[0,1,2,3,4,5,6],"torso":14,"class":3},{"id":37,"variation":36,"rows":3,"cols":3,"price":90,"textures":[0,1,2,3,4,5],"torso":5,"class":2},{"id":38,"variation":37,"rows":3,"cols":3,"price":1400,"textures":[0,1,2],"torso":14,"class":2},{"id":39,"variation":38,"rows":3,"cols":3,"price":210,"textures":[0,1,2,3,4],"torso":8,"class":2},{"id":40,"variation":39,"rows":3,"cols":3,"price":340,"textures":[0,1],"torso":0,"class":2},{"id":41,"variation":40,"rows":3,"cols":3,"price":350,"textures":[0,1],"torso":15,"class":3},{"id":42,"variation":41,"rows":3,"cols":3,"price":150,"textures":[0,1,2,3],"torso":12,"class":2},{"id":43,"variation":42,"rows":3,"cols":3,"price":180,"textures":[0],"torso":11,"class":2},{"id":44,"variation":43,"rows":3,"cols":3,"price":280,"textures":[0],"torso":11,"class":2},{"id":45,"variation":44,"rows":3,"cols":3,"price":220,"textures":[0,1,2,3],"torso":0,"class":1},{"id":46,"variation":45,"rows":3,"cols":3,"price":1000,"textures":[0,1,2],"torso":15,"class":3},{"id":47,"variation":46,"rows":3,"cols":3,"price":1000,"textures":[0,1,2],"torso":14,"class":3},{"id":48,"variation":47,"rows":3,"cols":3,"price":600,"textures":[0,1],"torso":0,"class":2},{"id":52,"variation":51,"rows":3,"cols":3,"price":850,"textures":[0,1,2],"torso":1,"class":3},{"id":53,"variation":52,"rows":3,"cols":3,"price":700,"textures":[0,1,2,3],"torso":2,"class":2},{"id":54,"variation":53,"rows":3,"cols":3,"price":800,"textures":[0,1,2,3],"torso":0,"class":2},{"id":57,"variation":56,"rows":3,"cols":3,"price":5,"textures":[0],"torso":0,"class":1},{"id":58,"variation":57,"rows":3,"cols":3,"price":265,"textures":[0],"torso":0,"class":1},{"id":59,"variation":58,"rows":3,"cols":3,"price":600,"textures":[0],"torso":14,"class":3},{"id":60,"variation":59,"rows":3,"cols":3,"price":1430,"textures":[0,1,2,3],"torso":14,"class":3},{"id":61,"variation":60,"rows":3,"cols":3,"price":1430,"textures":[0,1,2,3],"torso":15,"class":3},{"id":62,"variation":61,"rows":3,"cols":3,"price":925,"textures":[0,1,2,3],"torso":0,"class":2},{"id":63,"variation":62,"rows":3,"cols":3,"price":1000,"textures":[0],"torso":14,"class":2},{"id":64,"variation":63,"rows":3,"cols":3,"price":200,"textures":[0],"torso":5,"class":1},{"id":65,"variation":64,"rows":3,"cols":3,"price":1400,"textures":[0],"torso":14,"class":2},{"id":66,"variation":65,"rows":3,"cols":3,"price":300,"textures":[0,1,2,3],"torso":14,"class":1},{"id":67,"variation":66,"rows":3,"cols":3,"price":285,"textures":[0,1,2,3],"torso":15,"class":1},{"id":68,"variation":67,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3],"torso":1,"class":2},{"id":69,"variation":68,"rows":3,"cols":3,"price":435,"textures":[0,1,2,3,4,5],"torso":14,"class":2},{"id":70,"variation":69,"rows":3,"cols":3,"price":435,"textures":[0,1,2,3,4,5],"torso":14,"class":2},{"id":74,"variation":73,"rows":3,"cols":3,"price":1000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],"torso":14,"class":2},{"id":75,"variation":74,"rows":3,"cols":3,"price":4500,"textures":[0,1,2,3,4,5,6,7,8,9,10],"torso":14,"class":3},{"id":76,"variation":75,"rows":3,"cols":3,"price":4500,"textures":[0,1,2,3,4,5,6,7,8,9,10],"torso":14,"class":3},{"id":77,"variation":76,"rows":3,"cols":3,"price":2200,"textures":[0,1,2,3,4],"torso":14,"class":3},{"id":78,"variation":77,"rows":3,"cols":3,"price":2420,"textures":[0,1,2,3],"torso":14,"class":3},{"id":79,"variation":78,"rows":3,"cols":3,"price":1300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"torso":14,"class":3},{"id":80,"variation":79,"rows":3,"cols":3,"price":740,"textures":[0],"torso":14,"class":3},{"id":81,"variation":80,"rows":3,"cols":3,"price":190,"textures":[0,1,2],"torso":0,"class":1},{"id":82,"variation":81,"rows":3,"cols":3,"price":145,"textures":[0,1,2],"torso":0,"class":1},{"id":83,"variation":82,"rows":3,"cols":3,"price":295,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"torso":0,"class":1},{"id":84,"variation":83,"rows":3,"cols":3,"price":110,"textures":[0,1,2,3,4],"torso":0,"class":1},{"id":85,"variation":84,"rows":3,"cols":3,"price":200,"textures":[0,1,2,3,4,5],"torso":1,"class":1},{"id":86,"variation":85,"rows":3,"cols":3,"price":220,"textures":[0],"torso":1,"class":2},{"id":87,"variation":86,"rows":3,"cols":3,"price":350,"textures":[0,1,2,3,4],"torso":1,"class":2},{"id":88,"variation":87,"rows":3,"cols":3,"price":1310,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"torso":1,"class":2},{"id":89,"variation":88,"rows":3,"cols":3,"price":1310,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"torso":14,"class":2},{"id":90,"variation":89,"rows":3,"cols":3,"price":240,"textures":[0,1,2,3],"torso":14,"class":2},{"id":91,"variation":90,"rows":3,"cols":3,"price":900,"textures":[0],"torso":14,"class":2},{"id":93,"variation":92,"rows":3,"cols":3,"price":1540,"textures":[0,1,2,3,4,5,6],"torso":6,"class":2},{"id":94,"variation":93,"rows":3,"cols":3,"price":910,"textures":[0,1,2],"torso":0,"class":2},{"id":95,"variation":94,"rows":3,"cols":3,"price":910,"textures":[0,1,2],"torso":0,"class":2},{"id":96,"variation":95,"rows":3,"cols":3,"price":160,"textures":[0,1,2],"torso":11,"class":2},{"id":97,"variation":96,"rows":3,"cols":3,"price":550,"textures":[0],"torso":11,"class":2},{"id":98,"variation":97,"rows":3,"cols":3,"price":10,"textures":[0,1],"torso":0,"class":1},{"id":100,"variation":99,"rows":3,"cols":3,"price":1400,"textures":[0,1,2,3,4],"torso":14,"class":3},{"id":101,"variation":100,"rows":3,"cols":3,"price":1400,"textures":[0,1,2,3,4],"torso":14,"class":3},{"id":106,"variation":105,"rows":3,"cols":3,"price":770,"textures":[0],"torso":11,"class":1},{"id":107,"variation":106,"rows":3,"cols":3,"price":1000,"textures":[0],"torso":14,"class":2},{"id":108,"variation":107,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3,4],"torso":14,"class":2},{"id":109,"variation":108,"rows":3,"cols":3,"price":1100,"textures":[0,1,2,3,4,5,6,7,8,9,10],"torso":14,"class":3},{"id":110,"variation":109,"rows":3,"cols":3,"price":300,"textures":[0],"torso":5,"class":1},{"id":111,"variation":110,"rows":3,"cols":3,"price":1400,"textures":[0],"torso":1,"class":2},{"id":112,"variation":111,"rows":3,"cols":3,"price":230,"textures":[0,1,2,3,4,5],"torso":4,"class":1},{"id":113,"variation":112,"rows":3,"cols":3,"price":1000,"textures":[0],"torso":14,"class":3},{"id":114,"variation":113,"rows":3,"cols":3,"price":340,"textures":[0,1,2,3],"torso":6,"class":2},{"id":116,"variation":115,"rows":3,"cols":3,"price":1700,"textures":[0],"torso":14,"class":2},{"id":117,"variation":116,"rows":3,"cols":3,"price":2000,"textures":[0,1,2],"torso":14,"class":1},{"id":118,"variation":117,"rows":3,"cols":3,"price":640,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"torso":6,"class":2},{"id":119,"variation":118,"rows":3,"cols":3,"price":800,"textures":[0,1,2,3,4,5,6,7,8,9],"torso":14,"class":2},{"id":120,"variation":119,"rows":3,"cols":3,"price":3300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"torso":14,"class":3},{"id":121,"variation":120,"rows":3,"cols":3,"price":1200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"torso":15,"class":2},{"id":122,"variation":121,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"torso":14,"class":2},{"id":123,"variation":122,"rows":3,"cols":3,"price":900,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13],"torso":14,"class":2},{"id":124,"variation":123,"rows":3,"cols":3,"price":200,"textures":[0,1,2],"torso":11,"class":1},{"id":125,"variation":124,"rows":3,"cols":3,"price":700,"textures":[0],"torso":14,"class":2},{"id":126,"variation":125,"rows":3,"cols":3,"price":800,"textures":[0],"torso":14,"class":2},{"id":127,"variation":126,"rows":3,"cols":3,"price":140,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],"torso":1,"class":2},{"id":128,"variation":127,"rows":3,"cols":3,"price":140,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],"torso":14,"class":1},{"id":129,"variation":128,"rows":3,"cols":3,"price":80,"textures":[0,1,2,3,4,5,6,7,8,9],"torso":0,"class":1},{"id":130,"variation":129,"rows":3,"cols":3,"price":800,"textures":[0],"torso":0,"class":2},{"id":131,"variation":130,"rows":3,"cols":3,"price":530,"textures":[0],"torso":14,"class":2},{"id":132,"variation":131,"rows":3,"cols":3,"price":530,"textures":[0],"torso":0,"class":2},{"id":133,"variation":132,"rows":3,"cols":3,"price":840,"textures":[0],"torso":0,"class":2},{"id":134,"variation":133,"rows":3,"cols":3,"price":640,"textures":[0],"torso":0,"class":2},{"id":135,"variation":134,"rows":3,"cols":3,"price":110,"textures":[0,1,2],"torso":0,"class":2},{"id":136,"variation":135,"rows":3,"cols":3,"price":580,"textures":[0,1,2,3,4,5,6],"torso":0,"class":2},{"id":137,"variation":136,"rows":3,"cols":3,"price":1600,"textures":[0,1,2,3,4,5,6],"torso":14,"class":2},{"id":138,"variation":137,"rows":3,"cols":3,"price":305,"textures":[0,1,2],"torso":15,"class":2},{"id":139,"variation":138,"rows":3,"cols":3,"price":1000,"textures":[0,1,2],"torso":14,"class":2},{"id":140,"variation":139,"rows":3,"cols":3,"price":300,"textures":[0,1,2,3,4,5,6,7],"torso":12,"class":1},{"id":141,"variation":140,"rows":3,"cols":3,"price":1300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],"torso":14,"class":3},{"id":142,"variation":141,"rows":3,"cols":3,"price":875,"textures":[0,1,2,3,4,5,6,7,8,9,10],"torso":6,"class":2},{"id":143,"variation":142,"rows":3,"cols":3,"price":1500,"textures":[0,1,2],"torso":14,"class":2},{"id":144,"variation":143,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9],"torso":14,"class":2},{"id":145,"variation":144,"rows":3,"cols":3,"price":900,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13],"torso":6,"class":2},{"id":146,"variation":145,"rows":3,"cols":3,"price":3500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13],"torso":14,"class":3},{"id":147,"variation":146,"rows":3,"cols":3,"price":75,"textures":[0,1,2,3,4,5,6,7,8],"torso":0,"class":1},{"id":148,"variation":147,"rows":3,"cols":3,"price":1400,"textures":[0,1,2,3,4,5,6,7,8,9],"torso":4,"class":2},{"id":150,"variation":149,"rows":3,"cols":3,"price":2000,"textures":[0,1,2,3,4,5,6,7,8,9],"torso":14,"class":2},{"id":151,"variation":150,"rows":3,"cols":3,"price":2500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"torso":14,"class":3},{"id":152,"variation":151,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4,5],"torso":14,"class":2},{"id":153,"variation":152,"rows":3,"cols":3,"price":1900,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"torso":14,"class":2},{"id":154,"variation":153,"rows":3,"cols":3,"price":620,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":14,"class":2},{"id":155,"variation":154,"rows":3,"cols":3,"price":110,"textures":[0,1,2,3,4,5,6,7],"torso":14,"class":2},{"id":156,"variation":155,"rows":3,"cols":3,"price":2000,"textures":[0,1,2,3],"torso":14,"class":2},{"id":157,"variation":156,"rows":3,"cols":3,"price":1000,"textures":[0,1,2,3,4,5],"torso":14,"class":2},{"id":158,"variation":157,"rows":3,"cols":3,"price":400,"textures":[0,1,2,3],"torso":15,"class":2},{"id":159,"variation":158,"rows":3,"cols":3,"price":400,"textures":[0,1,2],"torso":15,"class":2},{"id":160,"variation":159,"rows":3,"cols":3,"price":630,"textures":[0,1],"torso":15,"class":2},{"id":161,"variation":160,"rows":3,"cols":3,"price":630,"textures":[0,1],"torso":15,"class":2},{"id":162,"variation":161,"rows":3,"cols":3,"price":1300,"textures":[0,1,2,3],"torso":14,"class":2},{"id":163,"variation":162,"rows":3,"cols":3,"price":1000,"textures":[0,1,2,3],"torso":15,"class":2},{"id":164,"variation":163,"rows":3,"cols":3,"price":1300,"textures":[0],"torso":14,"class":2},{"id":165,"variation":164,"rows":3,"cols":3,"price":1300,"textures":[0,1,2],"torso":0,"class":1},{"id":166,"variation":165,"rows":3,"cols":3,"price":1200,"textures":[0,1,2,3,4,5,6],"torso":0,"class":2},{"id":167,"variation":166,"rows":3,"cols":3,"price":1000,"textures":[0,1,2,3,4,5],"torso":14,"class":2},{"id":168,"variation":167,"rows":3,"cols":3,"price":1125,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"torso":14,"class":2},{"id":169,"variation":168,"rows":3,"cols":3,"price":1400,"textures":[0,1,2],"torso":14,"class":2},{"id":170,"variation":169,"rows":3,"cols":3,"price":450,"textures":[0,1,2,3],"torso":14,"class":1},{"id":171,"variation":170,"rows":3,"cols":3,"price":450,"textures":[0,1,2,3],"torso":15,"class":1},{"id":172,"variation":171,"rows":3,"cols":3,"price":600,"textures":[0,1],"torso":1,"class":2},{"id":173,"variation":172,"rows":3,"cols":3,"price":850,"textures":[0,1,2,3],"torso":14,"class":2},{"id":174,"variation":173,"rows":3,"cols":3,"price":850,"textures":[0,1,2,3],"torso":15,"class":2},{"id":175,"variation":174,"rows":3,"cols":3,"price":1600,"textures":[0,1,2,3],"torso":14,"class":2},{"id":176,"variation":175,"rows":3,"cols":3,"price":1600,"textures":[0,1,2,3],"torso":15,"class":2},{"id":177,"variation":176,"rows":3,"cols":3,"price":740,"textures":[0],"torso":15,"class":2},{"id":178,"variation":177,"rows":3,"cols":3,"price":1000,"textures":[0,1,2,3,4,5,6],"torso":15,"class":2},{"id":180,"variation":179,"rows":3,"cols":3,"price":635,"textures":[0,1,2,3],"torso":15,"class":2},{"id":181,"variation":180,"rows":3,"cols":3,"price":655,"textures":[0,1,2],"torso":15,"class":2},{"id":182,"variation":181,"rows":3,"cols":3,"price":1300,"textures":[0,1,2,3,4,5],"torso":15,"class":2},{"id":183,"variation":182,"rows":3,"cols":3,"price":625,"textures":[0,1],"torso":1,"class":1},{"id":184,"variation":183,"rows":3,"cols":3,"price":1830,"textures":[0,1,2,3,4,5],"torso":14,"class":3},{"id":185,"variation":184,"rows":3,"cols":3,"price":1100,"textures":[0,1,2,3],"torso":14,"class":2},{"id":186,"variation":185,"rows":3,"cols":3,"price":1100,"textures":[0,1,2,3],"torso":14,"class":2},{"id":188,"variation":187,"rows":3,"cols":3,"price":1235,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12],"torso":14,"class":2},{"id":189,"variation":188,"rows":3,"cols":3,"price":1500,"textures":[0,1,2,3,4,5,6,7,8,9,10],"torso":14,"class":2},{"id":190,"variation":189,"rows":3,"cols":3,"price":1500,"textures":[0,1,2,3,4,5,6,7,8,9,10],"torso":14,"class":2},{"id":191,"variation":190,"rows":3,"cols":3,"price":940,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":14,"class":3},{"id":192,"variation":191,"rows":3,"cols":3,"price":1800,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":14,"class":2},{"id":193,"variation":192,"rows":3,"cols":3,"price":2200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"torso":14,"class":2},{"id":194,"variation":193,"rows":3,"cols":3,"price":145,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":0,"class":1},{"id":195,"variation":194,"rows":3,"cols":3,"price":2000,"textures":[0,1,2],"torso":1,"class":2},{"id":196,"variation":195,"rows":3,"cols":3,"price":1800,"textures":[0,1,2],"torso":1,"class":2},{"id":197,"variation":196,"rows":3,"cols":3,"price":1730,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"torso":1,"class":2},{"id":198,"variation":197,"rows":3,"cols":3,"price":1645,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"torso":1,"class":2},{"id":199,"variation":198,"rows":3,"cols":3,"price":1400,"textures":[0,1,2,3,4,5,6,7],"torso":1,"class":2},{"id":200,"variation":199,"rows":3,"cols":3,"price":1400,"textures":[0,1,2,3,4,5,6,7],"torso":1,"class":2},{"id":201,"variation":200,"rows":3,"cols":3,"price":1250,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":1,"class":2},{"id":203,"variation":202,"rows":3,"cols":3,"price":1000,"textures":[0,1,2,3,4],"torso":5,"class":2},{"id":204,"variation":203,"rows":3,"cols":3,"price":1250,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":1,"class":2},{"id":205,"variation":204,"rows":3,"cols":3,"price":1000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12],"torso":6,"class":2},{"id":206,"variation":205,"rows":3,"cols":3,"price":1250,"textures":[0,1,2,3,4],"torso":5,"class":2},{"id":207,"variation":206,"rows":3,"cols":3,"price":1420,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":5,"class":2},{"id":208,"variation":207,"rows":3,"cols":3,"price":1420,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":5,"class":2},{"id":209,"variation":208,"rows":3,"cols":3,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":0,"class":2},{"id":210,"variation":209,"rows":3,"cols":3,"price":1910,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":0,"class":2},{"id":211,"variation":210,"rows":3,"cols":3,"price":1910,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":0,"class":2},{"id":212,"variation":211,"rows":3,"cols":3,"price":1910,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":0,"class":2},{"id":213,"variation":212,"rows":3,"cols":3,"price":1910,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":14,"class":2},{"id":214,"variation":213,"rows":3,"cols":3,"price":815,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":15,"class":2},{"id":215,"variation":214,"rows":3,"cols":3,"price":975,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":14,"class":2},{"id":216,"variation":215,"rows":3,"cols":3,"price":985,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":14,"class":2},{"id":217,"variation":216,"rows":3,"cols":3,"price":655,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":15,"class":2},{"id":218,"variation":217,"rows":3,"cols":3,"price":1600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],"torso":14,"class":2},{"id":219,"variation":218,"rows":3,"cols":3,"price":1600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],"torso":14,"class":2},{"id":220,"variation":219,"rows":3,"cols":3,"price":805,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":15,"class":2},{"id":224,"variation":223,"rows":3,"cols":3,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"torso":5,"class":2},{"id":225,"variation":224,"rows":3,"cols":3,"price":755,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"torso":1,"class":2},{"id":226,"variation":225,"rows":3,"cols":3,"price":95,"textures":[0,1],"torso":8,"class":2},{"id":227,"variation":226,"rows":3,"cols":3,"price":605,"textures":[0],"torso":0,"class":2},{"id":228,"variation":227,"rows":3,"cols":3,"price":2205,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13],"torso":4,"class":2},{"id":230,"variation":229,"rows":3,"cols":3,"price":1200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"torso":14,"class":2},{"id":231,"variation":230,"rows":3,"cols":3,"price":1200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"torso":14,"class":2},{"id":233,"variation":232,"rows":3,"cols":3,"price":985,"textures":[0,1,2,3,4,5,6,7,8,9],"torso":14,"class":2},{"id":234,"variation":233,"rows":3,"cols":3,"price":985,"textures":[0,1,2,3,4,5,6,7,8,9],"torso":14,"class":2},{"id":235,"variation":234,"rows":3,"cols":3,"price":820,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":11,"class":1},{"id":236,"variation":235,"rows":3,"cols":3,"price":965,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"torso":0,"class":2},{"id":237,"variation":236,"rows":3,"cols":3,"price":965,"textures":[0,1,2,3,4,5,6,7,8,9,10,11],"torso":0,"class":2},{"id":238,"variation":237,"rows":3,"cols":3,"price":20,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":5,"class":1},{"id":239,"variation":238,"rows":3,"cols":3,"price":40,"textures":[0,1,2,3,4,5],"torso":2,"class":1},{"id":240,"variation":239,"rows":3,"cols":3,"price":45,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],"torso":2,"class":2},{"id":242,"variation":241,"rows":3,"cols":3,"price":95,"textures":[0,1,2,3,4,5],"torso":0,"class":2},{"id":243,"variation":242,"rows":3,"cols":3,"price":95,"textures":[0,1,2,3,4,5],"torso":0,"class":2},{"id":244,"variation":243,"rows":3,"cols":3,"price":220,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":4,"class":2},{"id":245,"variation":244,"rows":3,"cols":3,"price":730,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":14,"class":2},{"id":246,"variation":245,"rows":3,"cols":3,"price":4800,"textures":[0,1,2,3,4,5,6,7,8,9],"torso":6,"class":2},{"id":248,"variation":247,"rows":3,"cols":3,"price":910,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":5,"class":2},{"id":249,"variation":248,"rows":3,"cols":3,"price":1050,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":6,"class":2},{"id":250,"variation":249,"rows":3,"cols":3,"price":1000,"textures":[0,1],"torso":6,"class":1},{"id":251,"variation":250,"rows":3,"cols":3,"price":150,"textures":[0,1],"torso":0,"class":1},{"id":252,"variation":251,"rows":3,"cols":3,"price":1650,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":4,"class":2},{"id":254,"variation":253,"rows":3,"cols":3,"price":1650,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"torso":4,"class":2}]],[[{"id":31,"variation":0,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":32,"variation":1,"price":100000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":33,"variation":2,"price":1000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":34,"variation":3,"price":1000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":35,"variation":4,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":36,"variation":5,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":37,"variation":6,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":38,"variation":7,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":39,"variation":8,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":40,"variation":9,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":41,"variation":10,"price":600,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":42,"variation":11,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":43,"variation":12,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":44,"variation":13,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":45,"variation":14,"price":400,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":46,"variation":15,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":47,"variation":16,"price":300,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":48,"variation":17,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":49,"variation":18,"price":200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3}],[{"id":1,"variation":0,"price":16000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":2,"variation":1,"price":2000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":3,"variation":2,"price":20000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":2},{"id":4,"variation":3,"price":3000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":5,"variation":4,"price":12000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":6,"variation":5,"price":2000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":7,"variation":6,"price":30000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":8,"variation":7,"price":7000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":9,"variation":8,"price":23000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":10,"variation":9,"price":4000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":11,"variation":10,"price":16000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":12,"variation":11,"price":24000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":13,"variation":12,"price":800,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":14,"variation":13,"price":800,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":15,"variation":14,"price":44000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":16,"variation":15,"price":2000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":17,"variation":16,"price":2500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":18,"variation":17,"price":4000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":19,"variation":18,"price":4500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":20,"variation":19,"price":4200,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":21,"variation":20,"price":19000,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":22,"variation":21,"price":800,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":23,"variation":22,"price":500,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":24,"variation":23,"price":900,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":25,"variation":24,"price":900,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":26,"variation":25,"price":800,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":27,"variation":26,"price":700,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":28,"variation":27,"price":700,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":29,"variation":28,"price":960,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3},{"id":30,"variation":29,"price":730,"textures":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"class":3}]]]


function getArrayClothesCounts() {
    var counts = [];

    for (var com in alt.clothes) {
        var count = 0;
        for (var i = 0; i < alt.clothes[com].length; i++) {
            for (var j = 0; j < alt.clothes[com][i].length; j++) {
                count += alt.clothes[com][i][j].price;
                count += alt.clothes[com][i][j].textures.length;
                count += alt.clothes[com][i][j].variation;
                if (alt.clothes[com][i][j].rows) count += alt.clothes[com][i][j].rows;
                if (alt.clothes[com][i][j].cols) count += alt.clothes[com][i][j].cols;
            }
        }
        count += i;
        counts.push(count);
    }
    return counts;
}
