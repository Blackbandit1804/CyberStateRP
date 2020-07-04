alt.onClient("playerBrowserReady", (player) => {
    alt.log(`playerBrowserReady: ${player.name}`);
    initPlayerStartUtils(player);
    initBodyUtils(player);

    if (Config.autoLogin) alt.emit("authAccount", player, Config.login, Config.password);
    else if (Config.closedMode) alt.emitClient(player, "modal.show", "closed_mode");
    else {
        alt.emitClient(player, "showAuthAccount");
    }
});

var masksWithHideHairs = [114];

function initPlayerStartUtils(player) {
    player.utils = {
        success: (text) => {
            alt.emitClient(player, "nSuccess", text);
        },
        error: (text) => {
            alt.emitClient(player, "nError", text);
        },
        warning: (text) => {
            alt.emitClient(player, "nWarning", text);
        },
        info: (text) => {
            alt.emitClient(player, "nInfo", text);
        },
        prompt: (text) => {
            alt.emitClient(player, "prompt.show", text);
        },
        initChoiceCharacter: () => {
            if (!player.account) return player.utils.error(`Вы не вошли в учетную запись!`);

            DB.Query("SELECT *,unix_timestamp(regDate) FROM characters WHERE accountId=?", player.account.id, (e, result) => {
                var characterIds = [];

                for (var i = 0; i < result.length; i++)
                    characterIds.push(result[i].id);

                var array = [];

                characterIds.forEach((id) => {
                    array.push("?");
                });

                var query = `SELECT * FROM inventory_players WHERE parentId=? AND playerId IN (${array})`;
                var values = [-1].concat(characterIds);

                DB.Query(query, values, (e, invResult) => {
                    player.spawn(-66.43, -820.07, 326.08); // крыша
                    var list = [];
                    for (var i = 0; i < result.length; i++) {
                        result[i].faceFeatures = JSON.parse(result[i].faceFeatures);
                        result[i].bodyItems = [];
                        invResult.forEach((item) => {
                            if (item.playerId == result[i].id) {
                                item.params = JSON.parse(item.params);
                                result[i].bodyItems.push(item);
                            }
                        });

                        var factionName = 0;
                        if (result[i].faction) {
                            var faction = alt.factions.getBySqlId(result[i].faction);
                            if (faction) factionName = faction.name;
                        }
                        list.push({
                            regDate: result[i]['unix_timestamp(regDate)'],
                            minutes: result[i].minutes,
                            vipDate: result[i].vipDate,
                            name: result[i].name,
                            spawn: result[i].spawn,
                            donateHouse: result[i].donateHouse,
                            donateBizes: result[i].donateBizes,
                            donateCars: result[i].donateCars,
                            skills: result[i].skills,
                            testDrive: result[i].testDrive,
                            houseId: result[i].houseId,
                            faction: factionName,
                            money: result[i].money,
                            bank: result[i].bank,
                        });
                    }
                    player.characters = result;
                    //player.utils.copyPed(0);
                    alt.emitClient(player, `showSelectorCharacters`, {
                        donate: player.account.donate,
                        isFree: player.account.free_slot,
                        isDonate: player.account.donate_slot,
                        characters: list
                    });
                });
            });
        },
        copyPed: (characterIndex) => {
            if (!player.characters || !player.characters[characterIndex]) return player.utils.error(`Неверный персонаж!`);
            var character = player.characters[characterIndex];

            var undershirtDefault = (character.sex == 1) ? 15 : 14;
            alt.emitClient(player, `Clothes::set`, 8, undershirtDefault, 0, 0);
            alt.emitClient(player, `Clothes::set`, 2, character.hair, 0, 0);
            player.sex = character.sex;

            var isLast = (characterIndex == player.characters.length - 1);
            var data = {
                headBlendData: {
                    mother: character.mother,
                    father: character.father,
                    skinColor: character.skinColor,
                    similarity: character.similarity
                },
                faceFeatures: character.faceFeatures,
                skills: character.skills,
                eyeColor: character.eyeColor,
                sex: character.sex,
                name: character.name,
                carsCount: character.cars.length,
                house: character.house,
                biz: "todo",
                faction: character.faction,
                job: character.job,
                family: "todo"
            }

            alt.emitClient(player, "copyPed", isLast, characterIndex, data);
        },

    };
    player.setFaceFeatures = (faceFeatures) => {
        alt.emitClient(player, `Face::set::feature`, faceFeatures);
    };
}

function initBodyUtils(player) {
    player.body = {
        items: [],

        loadItems: () => {
            var bodyItemIds = [1, 2, 3, 6, 7, 8, 9, 10, 11, 12, 13, 14];
            var bodyItems = [];
            for (var key in player.inventory.items) {
                var item = player.inventory.items[key];
                if (bodyItemIds.indexOf(item.itemId) != -1) {
                    bodyItems.push(item);
                }
            }

            player.body.clearItems();
            for (var i = 0; i < bodyItems.length; i++) {
                player.body.add(bodyItems[i].itemId, bodyItems[i].params);
            }
        },

        clearItems: () => {
            player.body.items = [];
            var itemIds = [3, 7, 8, 9, 6, 14, 2, 1, 10, 11, 12, 13];

            itemIds.forEach((itemId) => {
                player.body.updateView(itemId);
            });
            
            var undershirtDefault = (player.sex == 1) ? 15 : 14;
            alt.emitClient(player, `Clothes::set`, 8, undershirtDefault, 0, 0);
        },

        add: (itemId, params, callback) => {
            if (player.body.getByItemId(itemId)) return callback("Предмет данного типа уже используется");

            player.body.items.push(params);
            player.body.updateView(itemId, params, callback);
        },

        getByItemId: (itemId) => {
            for (var i = 0; i < player.body.items.length; i++) {
                if (player.body.items[i] && player.body.items[i].itemId == itemId)
                    return player.body.items[i];
            }
        },
        updateView: (itemId, params, callback) => {
            if (player.body.denyUpdateView) return;
            if (!callback) callback = () => {};
            var item = player.body.getByItemId(itemId);
            //alt.log(`item: ${item}`);
            if (!params) {
                var clothesIndexes = {
                    "2": 7,
                    "13": 5
                };
                var propsIndexes = {
                    "6": 0,
                    "1": 1,
                    "10": 2,
                    "11": 6,
                    "12": 7
                };
                var otherItems = {
                    "3": () => {
                        for (var key in player.inventory.items) {
                            var item = player.inventory.items[key];
                            if (item.itemId == itemId) {
                                item.params.armour = parseInt(player.armour);
                                player.inventory.updateParams(key, item);
                            }
                        }
                        alt.emitClient(player, `Clothes::set`, 9, 0, 0, 0);
                    },
                    "7": () => {
                        var index = (player.sex == 1) ? 15 : 82;
                        var undershirtDefault = (player.sex == 1) ? 15 : 14;
                        alt.emitClient(player, `Clothes::set`, 3, 15, 0, 0);
                        alt.emitClient(player, `Clothes::set`, 11, index, 0, 0);
                        alt.emitClient(player, `Clothes::set`, 8, undershirtDefault, 0, 0);
                    },
                    "8": () => {
                        alt.emitClient(player, `Clothes::set`, 4, 21, 0, 0);
                    },
                    "9": () => {
                        var index = (player.sex == 1) ? 34 : 35;
                        alt.emitClient(player, `Clothes::set`, 6, index, 0, 0);
                    },
                    "14": () => {
                        alt.emitClient(player, `Clothes::set`, 2, player.hair, 0, 0);
                        alt.emitClient(player, `Clothes::set`, 1, 0, 0, 0);
                    }
                };

                if (clothesIndexes[itemId] != null) {
                    alt.emitClient(player, `Clothes::set`, clothesIndexes[itemId], 0, 0, 0);

                } else if (propsIndexes[itemId] != null) {
                    alt.emitClient(player, `Prop::set`, propsIndexes[itemId], -1, 0);

                } else if (otherItems[itemId] != null) {
                    otherItems[itemId]();
                } else return callback("Неподходящий тип предмета для тела!");
            } else {
                var clothesIndexes = {
                    "2": 7,
                    "8": 4,
                    "9": 6,
                    "13": 5
                };
                var propsIndexes = {
                    "6": 0,
                    "1": 1,
                    "10": 2,
                    "11": 6,
                    "12": 7
                };
                var otherItems = {
                    "3": () => {
                        player.armour = parseInt(params.armour);
                        alt.emitClient(player, `Clothes::set`, 9, params.variation, params.texture, 0);
                    },
                    "7": () => {
                        var texture = params.tTexture || 0;
                        alt.emitClient(player, `Clothes::set`, 3, params.torso, texture, 0);
                        alt.emitClient(player, `Clothes::set`, 11, params.variation, params.texture, 0);
                        var texture = params.uTexture || 0;
                        if (params.undershirt != null) alt.emitClient(player, `Clothes::set`, 8, params.undershirt, texture, 0);
                    },
                    "14": (params) => {
                        if (masksWithHideHairs.includes(params.variation)) alt.emitClient(player, `Clothes::set`, 2, 0, 0, 0);
                        alt.emitClient(player, `Clothes::set`, 1, params.variation, params.texture, 0);
                    }
                };

                if (clothesIndexes[itemId] != null) {
                    alt.emitClient(player, `Clothes::set`, clothesIndexes[itemId], params.variation, params.texture, 0);
                } else if (propsIndexes[itemId] != null) {
                    alt.emitClient(player, `Prop::set`, propsIndexes[itemId], params.variation, params.texture);
                } else if (otherItems[itemId] != null) {
                    otherItems[itemId](params);
                } else return callback("Неподходящий тип предмета для тела!");
            }
        }
    };
}
