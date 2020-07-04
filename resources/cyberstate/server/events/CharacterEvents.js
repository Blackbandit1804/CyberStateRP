const { tuningVehicle } = require("../modules/ls_customs/index");
const { spawnAtHospital } = require("../modules/hospital/hospitalSpawn");
const { inLegalController } = require(`../modules/jobs/smuggling`);
const phoneOpen = require("../modules/phone.js");

function showRegError(player, errorText) {
    alt.emitClient(player, "character_creation::continue");
    player.utils.error(errorText);
}

alt.on("setSex", (player, sex) => {
    player.utils.initNewCharacter(sex, false);
});

alt.on("setClothes", (player, componentId, drawable, texture = 0, palette = 0) => {
    alt.emitClient(player, `Clothes::set`, componentId, drawable, texture, palette);
});

alt.on("Hair::set::color", (player, colorID, highlightColorID) => {
    alt.emitClient(player, `Hair::set::color`, colorID, highlightColorID);
    
    player.hairColor = colorID;
    player.hairHighlightColor = highlightColorID;
});

alt.on("Head::set::blend", (player, shapeFirstID, shapeSecondID, shapeThirdID, skinFirstID, skinSecondID, skinThirdID, shapeMix, skinMix, thirdMix) => {
    alt.emitClient(player, `Head::set::blend`, shapeFirstID, shapeSecondID, shapeThirdID, skinFirstID, skinSecondID, skinThirdID, shapeMix, skinMix, thirdMix);
});

alt.on("Face::set::feature", (player, faceFeatures) => {
    alt.emitClient(player, `Face::set::feature`, faceFeatures);
});

alt.on(`Face::set::eye::color`, (player, color) => {
    alt.emitClient(player, `Face::set::eye::color`, color);
});

alt.on(`Head::set::overlay`, (player, overlayID, index, opacity, color) => {
    alt.emitClient(player, `Head::set::overlay`, overlayID, index, opacity, color);
});

alt.on(`Anim::play`, (animName, animDict, p3 = 0, loop, stayInAnim, p6 = false, delta, bitset) => {
    alt.emitClient(player, `Anim::play`, animName, animDict, p3, loop, stayInAnim, p6, delta, bitset);
});

alt.onClient("setSpawn", (player, spawnPoint) => {
    player.spawnPoint = spawnPoint;
    DB.Query(`UPDATE characters SET spawn = ? WHERE id = ?`, [spawnPoint, player.sqlId]);
    alt.emitClient(player, `playerMenu.setSpawn`, player.spawnPoint, 'server');
});

alt.onClient("setHouseId", (player, houseId) => {
    player.houseId = houseId;
    DB.Query(`UPDATE characters SET houseId = ? WHERE id = ?`, [houseId, player.sqlId]);
    alt.emitClient(player, `playerMenu.setHouseId`, player.houseId, 'server');
});

alt.onClient("regCharacter", (player, rawData) => {
    // console.log(`regCharacter: ${rawData}`);
    const data = JSON.parse(rawData);
    if (!player.account) return showRegError(player, `Вы не вошли в учетную запись!`);
    var reg = /^([A-Z][a-z]{1,15}) ([A-Z][a-z]{1,15})$/;
    if (!reg.test(data.characterName)) return showRegError(player, `Имя ${data.characterName} некорректно!`);
    if (data.skills.length != 7) return showRegError(player, `Неверное количество умений!`);
    var skillsCount = 0;
    var startMoney = 3000;
    data.skills.forEach((skill) => { skillsCount += skill; });
    if (skillsCount > 10 + 10 + 6 * 2) return showRegError(player, `Превышено количество очков умений!`);
    DB.Query("SELECT null FROM characters WHERE accountId=?", [player.account.id], (e, result) => {
        if (result.length >= Config.maxCharacters) return showRegError(player, `У Вас макс. количество персонажей!`);
        DB.Query(`SELECT null FROM characters WHERE name=?`, [data.characterName], (e, result) => {
            if (e) {
                showRegError(player, "Произошла непредвиденная ошибка, попробуйте еще раз");
                console.log(e);
                return;
            }
            if (result.length > 0) {
                alt.emitClient(player, `lightCharacterName`);
                return showRegError(player, `Персонаж ${data.characterName} уже зарегистрирован!`);
            }

            player.sex = data.gender;
            var bodyItems = [{
                    itemId: 7,
                    params: {
                        owner: 0,
                        sex: player.sex,
                        variation: data.clothes.top.drawable, // player.getClothes(11).drawable,
                        texture: data.clothes.top.texture, // player.getClothes(11).texture,
                        torso: data.clothes.top.torso, // player.getClothes(3).drawable,
                        rows: 5,
                        cols: 5,
                    }
                },
                {
                    itemId: 8,
                    params: {
                        owner: 0,
                        sex: player.sex,
                        variation: data.clothes.legs.drawable, // player.getClothes(4).drawable,
                        texture: data.clothes.legs.texture, // player.getClothes(4).texture,
                        rows: 3,
                        cols: 3,
                    }
                },
                {
                    itemId: 9,
                    params: {
                        owner: 0,
                        sex: player.sex,
                        variation: data.clothes.shoes.drawable, // player.getClothes(6).drawable,
                        texture: data.clothes.shoes.texture, // player.getClothes(6).texture,
                    }
                }
            ];
            const pos = SpawnInfo.user_spawn[getRandom(0, SpawnInfo.user_spawn.length - 1)];
            const faceFeatures = data.faceFeatures.map((faceFeature) => Math.round(faceFeature * 100) / 100);
            let new_number = phoneOpen.getPhoneNumber();
            var query = `INSERT INTO characters (name,regIp,sex,lastIp,mother,father,shapeMix,skinMix, eyeColor,hair,hairColor,faceFeatures,skills,accountId,x,y,z,h,bank,phone) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            var values = [data.characterName, player.ip, player.sex, player.ip, data.mother,
                data.father, data.shapeMix, data.skinMix, data.appearance.eyeColor, data.appearance.hair,
                data.appearance.hairColor, JSON.stringify(faceFeatures), JSON.stringify(data.skills),
                player.account.id, pos.x, pos.y, pos.z, pos.h, startMoney, new_number
            ];

            DB.Query("INSERT INTO phone_taken (num) VALUES (?)", new_number);

            DB.Query(query, values, (e, result) => {
                if (e) {
                    showRegError(player, "Произошла непредвиденная ошибка, попробуйте еще раз");
                    console.log(e);
                    return;
                }
                const headOverlayQuery = "INSERT INTO characters_headoverlays(character_id, overlay_id, overlay_index, opacity, first_color, second_color) VALUES ?";
                const headOverlayParams = [];

                for (const headOverlay of data.appearance.headOverlays) {
                    headOverlayParams.push([result.insertId, headOverlay.id, headOverlay.value, headOverlay.opacity, headOverlay.color, headOverlay.color]);
                }

                DB.Query(headOverlayQuery, [headOverlayParams]);

                for (var i = 1; i < bodyItems.length; i++) {
                    var item = bodyItems[i];
                    item.params.owner = result.insertId;
                    alt.inventory.autoIncrement++;
                    DB.Query("INSERT INTO inventory_players (playerId,itemId,`index`,params) VALUES (?,?,?,?)",
                    [result.insertId, item.itemId, item.itemId - 1, JSON.stringify(item.params)]);
                }

                var item = bodyItems[0];
                item.params.owner = result.insertId;
                DB.Query("INSERT INTO inventory_players (playerId,itemId,`index`,params) VALUES (?,?,?,?)",
                [result.insertId, item.itemId, item.itemId - 1, JSON.stringify(item.params)], (e, result2) => {
                    var docsParams = {
                        owner: result.insertId,
                        licenses: [],
                        weapon: [0, 0, 0, 0, 0, 0, 0],
                        work: []
                    };

                    DB.Query("INSERT INTO inventory_players (playerId,itemId,`index`,params,parentId) VALUES (?,?,?,?,?)", [result.insertId, 16, 0, JSON.stringify(docsParams), result2.insertId], (e) => {
                        if (e) console.log(e);
                    });
                });

                player.utils.success(`Персонаж ${data.characterName} зарегистрирован!`);
                player.dimension = 1;
                alt.emitClient(player, "character_creation::stop");
                player.utils.initChoiceCharacter();
            });
        });
    });
});

alt.onClient("changeCharacter", (player, rawData) => {
    const data = JSON.parse(rawData);
    if (!player.account) return showRegError(player, `Вы не вошли в учетную запись!`);
    if (data.skills.length != 7) return showRegError(player, `Неверное количество умений!`);
    var skillsCount = 0;
    data.skills.forEach((skill) => { skillsCount += skill; });
    if (skillsCount > 10 + 10 + 6 * 2) return showRegError(player, `Превышено количество очков умений!`);

    DB.Query(`SELECT * FROM characters WHERE id=?`, [player.sqlId], (e, result) => {
        if (e) {
            showRegError(player, "Произошла непредвиденная ошибка, попробуйте еще раз");
            console.log(e);
        }

        if (result.length > 0) {
            const faceFeatures = data.faceFeatures.map((faceFeature) => Math.round(faceFeature * 100) / 100);
            DB.Query("UPDATE characters SET mother=?,father=?,shapeMix=?,skinMix=?,eyeColor=?,hair=?,hairColor=?,faceFeatures=?,skills=? WHERE id=?", [data.mother, data.father, data.shapeMix, data.skinMix, data.appearance.eyeColor, data.appearance.hair,
                data.appearance.hairColor, JSON.stringify(faceFeatures), JSON.stringify(data.skills), player.sqlId], (e, result) => {
                if (e) {
                    showRegError(player, "Произошла непредвиденная ошибка, попробуйте еще раз");
                    console.log(e);
                }
            });
            
            player.overlayColors = {};

            player.utils.success(`Внешность персонажа изменена!`);
            player.dimension = 1;

            var undershirtDefault = (player.sex == 1) ? 15 : 14;
            alt.emit(`setClothes`, player, 8, undershirtDefault, 0, 0);
            alt.emit(`setClothes`, player, 2, data.appearance.hair, 0, 0);
            alt.emit(`Head::set::blend`, player, data.mother, data.father, 0, data.mother, data.father, 0, data.shapeMix, data.skinMix, 0);
            alt.emit(`Hair::set::color`, player, data.appearance.hairColor, player.hairHighlightColor);

            player.eyeColor = data.appearance.eyeColor;
            alt.emit(`Face::set::feature`, player, faceFeatures);

            for (const headOverlay of data.appearance.headOverlays) {
                DB.Query("UPDATE IGNORE characters_headoverlays SET overlay_id=?,overlay_index=?,opacity=?,first_color=?,second_color=? WHERE character_id=? order by overlay_id desc", [headOverlay.id, headOverlay.value, headOverlay.opacity, headOverlay.color, headOverlay.color, player.sqlId], (e, result) => {
                    if (e) return console.log(e);
                    player.overlayColors[headOverlay.id] = [headOverlay.color, headOverlay.color];
                    alt.emit(`Head::set::overlay`,  player, headOverlay.id, headOverlay.value, headOverlay.opacity, headOverlay.color);

                    if (headOverlay.id === 10 || headOverlay.id === 2 || headOverlay.id === 1) {
                        alt.emitClient(player, `Head::set::overlay::color`, headOverlay.id, 1, headOverlay.color, headOverlay.color);
                    } else if (headOverlay.id === 8 || headOverlay.id === 5) {
                        alt.emitClient(player, `Head::set::overlay::color`, headOverlay.id, 2, headOverlay.color, headOverlay.color);
                    } else {
                        alt.emitClient(player, `Head::set::overlay::color`, headOverlay.id, 0, headOverlay.color, headOverlay.color);
                    }
                });
            }
            
            alt.emitClient(player, "character_change::stop");
        }     
    });
});

alt.on("copyPed", (player, characterIndex) => {
    player.utils.copyPed(characterIndex);
});

alt.on(`Donate::set`, (login, count) => {
    const rec = alt.Player.getByLogin(login);
    if (rec) rec.utils.setDonate(rec.account.donate + count);
    else DB.Query('UPDATE accounts SET donate = donate+? WHERE login=?', [count, login]);
});

alt.onClient("authCharacter", (player, characterIndex) => {
    //console.log(`authCharacter: ${characterIndex}`);
    if (!player.account) return player.utils.error(`Вы не вошли в учетную запись!`);
    if (!player.characters) return player.utils.error(`Персонажи не найдены!`);
    var character = player.characters[characterIndex];
    if (character.ban > 0) {
        let now = new Date().getTime() / 1000;
        let diff = now - character.ban;
        if (diff > 0) {
            player.utils.success(`Ваш персонаж разбанен!`);
            DB.Query("UPDATE characters SET ban=? WHERE id=?", [0, character.id]);
        } else {
            let ban_time = Math.abs(diff / 24 / 60 / 60);
            if (ban_time < 1) ban_time = 1;
            player.utils.error(`Ваш персонаж забанен на ${Math.round(ban_time)} дней!`);
            player.kick();
            return;
        }
    }

    if (character.skin != null && character.skin != "MP_M_Freemode_01" && character.skin != "MP_F_Freemode_01" && character.skin != "mp_f_freemode_01" && character.skin != "mp_m_freemode_01") {
        player.model = jhash(character.skin);
    } else {
        player.model = (character.sex == 1) ? jhash("MP_M_Freemode_01") : jhash("MP_F_Freemode_01");
        player.dimension = 1;
        var undershirtDefault = (character.sex == 1) ? 15 : 14;

        alt.emit(`setClothes`, player, 8, undershirtDefault, 0, 0);
        alt.emit(`setClothes`, player, 2, character.hair, 0, 0);
        alt.emit(`Head::set::blend`, player, character.mother, character.father, 0, character.mother, character.father, 0, character.shapeMix, character.skinMix, 0);
        alt.emit(`Hair::set::color`, player, character.hairColor, character.hairHighlightColor);
        player.eyeColor = character.eyeColor;
        alt.emit(`Face::set::feature`, player, character.faceFeatures);

        DB.Query("SELECT * FROM characters_headoverlays WHERE character_id = ?", [character.id], (e, result) => {
            player.overlayColors = {};
            player.overlays = {};
            for (let i = 0; i < result.length; i++) {
                player.overlayColors[result[i].overlay_id] = [result[i].first_color, result[i].second_color];
                player.overlays[result[i].overlay_id] = result[i].overlay_id;
                alt.emit(`Head::set::overlay`, player, result[i].overlay_id, result[i].overlay_index, result[i].opacity);
                    
                if (result[i].overlay_id === 10 || result[i].overlay_id === 2 || result[i].overlay_id === 1) {
                    alt.emitClient(player, `Head::set::overlay::color`, result[i].overlay_id, 1, result[i].first_color, result[i].second_color);
                } else if (result[i].overlay_id === 8 || result[i].overlay_id === 5) {
                    alt.emitClient(player, `Head::set::overlay::color`, result[i].overlay_id, 2, result[i].first_color, result[i].second_color);
                } else {
                    alt.emitClient(player, `Head::set::overlay::color`, result[i].overlay_id, 0, result[i].first_color, result[i].second_color);
                }
            }

            alt.emitClient(player, `Player::overlayColors::init`, JSON.stringify(player.overlayColors));
        });
    }

    alt.emitClient(player, "authCharacter.success", character.hospital > 0);

    initPlayerUtils(player);
    initDBParams(player, character);
    player.utils.spawn(character.health, character.hospital);
    initLocalParams(player);
    player.utils.setLocalVar("name", character.name);
    player.setSyncedMeta("name", character.name);
    player.setSyncedMeta("id", character.id);
    initPlayerInventory(player);
    initPlayerTelephone(player);
    initFinesCount(player);
    initSatietyTimer(player);
    initJobSkills(player);
    spawnPlayerCars(player);
    //initCutscenes(player);
    initPlayerReports(player);
    alt.broadcastEnterFactionPlayers(player);
    alt.bandZonesUtils.initBandZones(player);

    delete player.characters;
    delete player.accountRegistrated;

    player.armour = character.armour;

    alt.emitClient(player, `hudControl.setData`, {
        money: player.money,
        bank: player.bank,
        wanted: player.wanted
    });

    if (inLegalController.infoDealer !== undefined) {
        if (inLegalController.infoDealer.isLegal) {
            if (alt.factions.isPoliceFaction(player.faction) || alt.factions.isFibFaction(player.faction)) {
                alt.emitClient(player, `Blip::smuggling::create`, JSON.stringify(inLegalController.infoDealer.blip));
            }
        }
        
        if (alt.factions.isInLegalFaction(player.faction)) {
            alt.emitClient(player, `Blip::smuggling::create`, JSON.stringify(inLegalController.infoDealer.blip));
        }
    }

    player.authTime = new Date().getTime();

    var data = {
        id: player.sqlId,
        name: player.getSyncedMeta("name"),
        score: player.minutes,
        ping: player.ping
    };

    if (player.warntime > 0) {
        let now = new Date().getTime() / 1000;
        let diff = now - player.warntime;
        if (diff > 0) {
            player.warn--;
            player.utils.success(`Варн был обнулен. Варны: ${player.warn}`);
            DB.Query("UPDATE characters SET warn=? WHERE id=?", [player.warn, character.id]);
            if (player.warn > 0)
                DB.Query("UPDATE characters SET warntime=? WHERE id=?", [date.getTime() / 1000 + 15 * 24 * 60 * 60, character.id]);
            else
                DB.Query("UPDATE characters SET warntime=? WHERE id=?", [0, character.id]);
        } else {
            player.utils.error(`Варны: ${player.warn}`);
        }
    }

    if (player.mute > 0) {
        player.startMute = parseInt(new Date().getTime() / 1000);
        player.muteTimerId = setSaveTimeout(() => {
            try {
                player.utils.stopMute();
            } catch (err) {
                console.log(err.stack);
            }
        }, player.mute * 60 * 1000);
        player.utils.error(`Чат заблокирован на ${player.mute.toFixed(0)} минут!`);
    }

    if (player.vmute > 0) {
        alt.emitClient(player, "control.voice.chat", true);
        player.startVoiceMute = parseInt(new Date().getTime() / 1000);
        player.muteVoiceTimerId = setSaveTimeout(() => {
            try {
                player.utils.stopVoiceMute();
            } catch (err) {
                console.log(err.stack);
            }
        }, player.vmute * 60 * 1000);
        player.utils.error(`Микрофон заблокирован на ${player.vmute.toFixed(0)} минут!`);
    }

    if (!player.phone.number) {
        let new_number = phoneOpen.getPhoneNumber();
        player.phone.number = new_number;
        alt.emitClient(player, "update.player.telephone", player.phone.number);
        DB.Query(`UPDATE characters SET phone=? WHERE id=?`, [new_number, player.sqlId]);
    }

    alt.Player.all.forEach((rec) => {
        if (rec.sqlId) {
            if (rec.admin > 0) alt.emitClient(rec, `playersOnline.add`, data);
            if (rec.sqlId != player.sqlId && player.admin > 0) alt.emitClient(player, `playersOnline.add`, {
                id: rec.sqlId,
                name: rec.getSyncedMeta("name"),
                score: rec.minutes,
                ping: rec.ping
            });
        }
    });
});
alt.onClient("deleteCharacter", (player, name) => {
    // debug(`deleteCharacter: ${player.getSyncedMeta("name")} ${name}`)
    if (player.characters) {
        for (var i = 0; i < player.characters.length; i++) {
            var ch = player.characters[i];
            if (ch.name == name) {
                if (ch.ban > 0) {
                let now = new Date().getTime() / 1000;
                let diff = now - ch.ban;
                if (diff < 0) {
                    let ban_time = Math.abs(diff / 24 / 60 / 60);
                    if (ban_time < 1) ban_time = 1;
                    player.utils.error(`Ваш персонаж забанен на ${Math.round(ban_time)} дней!`);
                    player.kick();
                    return;
                }
                } else {
                DB.Query(`UPDATE characters SET accountId=? WHERE id=?`, [-player.account.id, ch.id], () => {
                    player.utils.initChoiceCharacter();
                    player.utils.success(`Персонаж ${name} удален!`);
                });
                return;
                }
            }
        }
    }
    player.utils.error(`Персонаж ${name} не найден!`);
});
alt.onClient("initNewCharacter", (player) => {
    player.dimension = player.sqlId + 1;
    alt.emitClient(player, "character_creation::init");
});
alt.on("initChangeCharacter", (player) => {
    player.dimension = player.sqlId + 532;
    alt.emitClient(player, "character_change::init");
});
alt.onClient("characters.openSlot", (player, type) => {
    // debug(`characters.openSlot: ${player.getSyncedMeta("name")} ${type}`);
    if (type == "free") {
        if (player.account.free_slot) return player.utils.error(`Бесплатный слот уже открыт!`);
        DB.Query(`UPDATE accounts SET free_slot=? WHERE id=?`,
            [1, player.account.id]);
        player.account.free_slot = true;
    } else if (type == "donate") {
        if (!player.account.free_slot) return player.utils.error(`Сначала разблокируйте бесплатный слот!`);
        if (player.account.donate_slot) return player.utils.error(`Слот за VC уже открыт!`);
        var price = alt.economy["open_slot_donate_price"].value;
        if (player.account.donate < price) return player.utils.error(`Необходимо ${price} VC!`);
        player.account.donate -= price;
        DB.Query(`UPDATE accounts SET donate_slot=?,donate=? WHERE id=?`, [1, player.account.donate, player.account.id]);
        player.account.donate_slot = true;
    }
    player.utils.initChoiceCharacter();
});

function initDBParams(player, params) {
    player.sqlId = params.id;
    player.sex = params.sex;
    player.satiety = params.satiety;
    player.thirst = params.thirst;
    player.hair = params.hair;
    player.admin = params.admin;
    player.helper = params.helper;
    player.phone = { number: params.phone, contacts: [], messages: [] };
    player.faction = params.faction;
    player.spawnPoint = params.spawn;
    player.donateBizes = params.donateBizes;
    player.donateHouse = params.donateHouse;
    player.donateCars = params.donateCars;
    player.testDrive = params.testDrive;
    player.mute = params.mute;
    player.vmute = params.vmute;
    player.houseId = params.houseId;
    player.rank = params.rank;
    player.warntime = params.warntime;
    player.factionDate = params.factionDate;
    player.job = params.job;
    player.warn = params.warn;
    player.demorgan = params.demorgan;
    player.jobDate = params.jobDate;
    player.wanted = params.wanted;
    player.law = params.law;
    player.crimes = params.crimes;
    player.money = params.money;
    player.bank = params.bank;
    player.pay = params.pay;
    player.skills = params.skills;
    player.rp = params.rp;
    player.minutes = params.minutes;
    player.vipDate = params.vipDate;
    player.arrestCell = params.arrestCell;
    player.arrestTime = params.arrestTime;
    player.spawnPos = {
        x: params.x,
        y: params.y,
        z: params.z,
        h: params.h
    };

    player.utils.setWanted(player.wanted);
    alt.emitClient(player, `inventory.setSatiety`, player.satiety);
    alt.emitClient(player, `inventory.setThirst`, player.thirst);
    if (player.admin) player.setSyncedMeta("admin", player.admin);
}

function initPlayerUtils(player) {
    player.utils.spawn = (health = 120, hospitalPhase = -1) => {
        if (player.arrestTime > 0 && player.demorgan < 1) {
            return player.utils.doArrest(player.arrestCell, player.arrestTime, true);
        }

        if ((player.hospital || hospitalPhase > 0) && Config.hospitalSpawn) {
            const h = hospitalPhase >= 0 ? health : undefined;

            if (hospitalPhase === -1) {
                hospitalPhase = 1;
            }

            player.hospital = undefined;
            player.spawn(281.30, -1347.15, 24.53);
            player.rot = new alt.Vector3(0, 0, -0.94);
            player.health = health;
            //spawnAtHospital(player, hospitalPhase, h);

            if (hospitalPhase === 1) {
                return;
            }
        }

        const pos = getPlayerSpawnPos(player);

        player.spawn(pos.x, pos.y, pos.z);
        player.rot = new alt.Vector3(0, 0, pos.h);
        player.health = health;
        player.dimension = 1;
    };
    player.utils.setLocalVar = (key, value) => {
        //debug(`setLocalVar: ${key} => ${value}`);
        alt.emitClient(player, "setLocalVar", key, value);
    };
    player.notify = (message, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) => {
        alt.emitClient(player, "BN_Show", message, flashing, textColor, bgColor, flashColor);
    };
    player.notifyWithPicture = (title, sender, message, notifPic, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) => {
        alt.emitClient(player, "BN_ShowWithPicture", title, sender, message, notifPic, icon, flashing, textColor, bgColor, flashColor);
    };
    player.utils.changeName = (oldName, name) => {
        DB.Query(`SELECT * FROM characters WHERE name=?`, [oldName], (e, result) => {
            if (e) return console.log(e);
            if (result.length < 1) return terminal.error(`Игрок с именем: ${oldName} не найден!`, player);
            var res = result[0];
            var rec = alt.Player.getBySqlId(res.id);
            if (rec) rec.setSyncedMeta("name", name);
            var houses = alt.houses.getArrayByOwner(res.id);
            var bizes = alt.bizes.getArrayByOwner(res.id);
            var faction = alt.factions.getBySqlId(res.faction);
            for (var house in houses) house.setOwner(res.id, name);
            for (var biz in bizes) biz.setOwner(res.id, name);
            if (faction && res.rank == alt.factionRanks[res.faction].length - 2) faction.setLeader(res.faction, name);
            DB.Query(`UPDATE characters SET name=? WHERE name=?`, [name, res.name]);
        });
    };
    player.utils.setBankMoney = (newMoney) => {
        newMoney = Math.clamp(newMoney, 0, Number.MAX_VALUE);
        alt.logs.addLog(`Игроку ${player.getSyncedMeta("name")} было назначено с ${player.bank} на ${newMoney} банковских денег`, 'bank', player.account.id, player.sqlId, { oldMoney: player.bank, newMoney: newMoney });
        var diff = newMoney - player.bank;
        if (diff == 0) return;
        alt.emitClient(player, `hudControl.updateBank`, newMoney);
        player.bank = newMoney;
        DB.Query("UPDATE characters SET bank=? WHERE id=?", [player.bank, player.sqlId]);
        player.utils.setLocalVar("bank", player.bank);
    };
    player.utils.leaveDemorgan = () => {
        player.utils.setLocalVar("demorganSet", undefined);
        player.pos = new alt.Vector3(SpawnInfo.demorgan_exit.x, SpawnInfo.demorgan_exit.y, SpawnInfo.demorgan_exit.z);
        player.rot = new alt.Vector3(0, 0, SpawnInfo.demorgan_exit.h);
        player.demorgan = 0;
        DB.Query("UPDATE characters SET demorgan=? WHERE id=?", [0, player.sqlId]);
        player.utils.success(`Вы выпущены из деморгана!`);
        if (player.demorganTimerId) {
          clearSaveInterval(player.demorganTimerId);
          delete player.demorganTimerId;
        }
        delete player.startDemorgan;
    };
    player.utils.stopVoiceMute = () => {
        player.vmute = 0;
        DB.Query("UPDATE characters SET vmute=? WHERE id=?", [0, player.sqlId]);
        alt.emitClient(player, "control.voice.chat", false);
        player.utils.success(`Ваш микрофон разблокирован!`);
        if (player.muteTimerId) {
          clearSaveInterval(player.muteVoiceTimerId);
          delete player.muteVoiceTimerId;
        }
        delete player.startVoiceMute;
	 };
	  player.utils.stopMute = () => {
        player.mute = 0;
        DB.Query("UPDATE characters SET mute=? WHERE id=?", [0, player.sqlId]);
        player.utils.success(`Ваш чат разблокирован!`);
        if (player.muteTimerId) {
            clearSaveInterval(player.muteTimerId);
            delete player.muteTimerId;
        }
        delete player.startMute;
  	};
    player.utils.setDonate = (newDonate) => {
        newDonate = Math.clamp(newDonate, 0, Number.MAX_VALUE);
        player.account.donate = newDonate;
        player.utils.setLocalVar("donate", newDonate);
        DB.Query("UPDATE accounts SET donate = ? WHERE id=?", [newDonate, player.account.id]);
    };
    player.utils.setMoney = (newMoney, dontTouchInventory, callback) => {
        newMoney = Math.clamp(newMoney, 0, Number.MAX_VALUE);
        alt.logs.addLog(`Игроку ${player.getSyncedMeta("name")} было назначено с ${player.money} на ${newMoney} наличных денег`, 'money', player.account.id, player.sqlId, { oldMoney: player.money, newMoney: newMoney });
        var diff = newMoney - player.money;
        if (diff == 0) return;
        alt.emitClient(player, `hudControl.updateMoney`, newMoney);
        player.utils.setLocalVar("money", newMoney);
        player.money = newMoney;
        DB.Query("UPDATE characters SET money=? WHERE id=?", [player.money, player.sqlId], callback);
        if (dontTouchInventory) return;
    };
    
    player.utils.bank = (title, text) => {
        alt.emitClient(player, "BN_ShowWithPicture", title, "Банк", text, "CHAR_BANK_MAZE", 2);
    };
    
    player.utils.setFaction = (faction, rank = 0) => {
        //debug(`player.utils.setFaction: ${faction}`);
        alt.fullDeleteItemsByFaction(player.sqlId, player.faction);
        alt.broadcastExitFactionPlayers(player);
        player.faction = Math.clamp(faction, 0, alt.factions.length);
        player.rank = rank;
        if (player.faction && !rank) player.rank = 1;
        player.utils.setLocalVar("faction", player.faction);
        player.utils.setLocalVar("factionRank", player.rank);
        DB.Query("UPDATE characters SET faction=?,rank=? WHERE id=?", [player.faction, player.rank, player.sqlId]);
        if (player.faction > 0) {
            var faction = alt.factions.getBySqlId(player.faction);
            var rankName = alt.factions.getRankName(player.faction, player.rank);
            var rankPay = alt.factions.getRankPay(player.faction, player.rank);
            player.utils.setSpawn(2);
            player.utils.setLocalVar("factionRankPay", rankPay);
            player.utils.setLocalVar("factionName", faction.name);
            player.utils.setLocalVar("factionRankName", rankName);
            player.utils.setLocalVar("factionLeader", faction.leaderName);
            player.utils.setLocalVar("factionLastRank", alt.factionRanks[player.faction].length - 1);
            alt.broadcastEnterFactionPlayers(player);

            if (alt.factions.isGangFaction(player.faction)) {
                alt.bandZonesUtils.initBandZones(player);
            } else alt.emitClient(player, `bandZones.enable`, false);
            
            let forDataFactionList = {
                id: player.sqlId,
                name: player.getSyncedMeta("name")
            };
            
            alt.factionPlayerList[player.faction].push(forDataFactionList);
            
            const factionListLoad = alt.factionPlayerList[player.faction];
            
            for (var i in factionListLoad) {
                try {
                    let factionPlayer = alt.Player.getBySqlId(factionListLoad[i].id);
                    if (factionPlayer){
                        if (player.sqlId !== factionPlayer.sqlId) {
                            alt.emitClient(player, `familiar.addFactions`, factionListLoad[i].name, factionPlayer.sqlId);
                            alt.emitClient(factionPlayer, `familiar.addFactions`, player.getSyncedMeta("name"), player.sqlId);
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        }

    };
    
    player.utils.setFactionRank = (rank = 1) => {
        if (rank < 1) rank = 1;
        player.rank = rank;
        if (player.faction && !rank) player.rank = 1;
        player.utils.setLocalVar("factionRank", player.rank);
        DB.Query("UPDATE characters SET rank=? WHERE id=?", [player.rank, player.sqlId]);
        if (player.faction > 0) {
            var faction = alt.factions.getBySqlId(player.faction);
            var rankName = alt.factions.getRankName(player.faction, player.rank);
            var rankPay = alt.factions.getRankPay(player.faction, player.rank);
            player.utils.setLocalVar("factionRankPay", rankPay);
            player.utils.setLocalVar("factionRankName", rankName);
            player.utils.setLocalVar("factionLeader", faction.leaderName);
            alt.setFactionRank(player);
        }
    };
    player.utils.setAdmin = (adminLevel) => {
        player.admin = Math.clamp(adminLevel, 0, Config.maxLevelAdmin);
        player.utils.setLocalVar("admin", player.admin);
        player.setSyncedMeta("admin", player.admin);
        DB.Query("UPDATE characters SET admin=? WHERE id=?", [player.admin, player.sqlId]);
        if (player.admin) initPlayerReports(player);
    };
    player.utils.changeJob = (job) => { // ВРЕМЕННЫЙ ВАРИАНТ
        if (job < 0) job = 0;
        player.job = job;
        if (job !== 0) {
            var jobName = alt.jobs[player.job - 1].name;
            player.utils.setLocalVar("jobName", jobName);
        }
        player.utils.setLocalVar("job", player.job);
    };
    player.utils.setJob = (job) => {
        if (job < 0) job = 0;
        player.job = job;
        if (job !== 0) {
            var jobName = alt.jobs[player.job - 1].name;
            player.utils.setLocalVar("jobName", jobName);
        }
        player.utils.setLocalVar("job", player.job);
        DB.Query("UPDATE characters SET job=? WHERE id=?", [player.job, player.sqlId]);
    };
    player.utils.setJobSkills = (job, exp) => {
        job = Math.clamp(job, 1, alt.jobs.length - 1);
        if (!player.jobSkills[job - 1]) {
            DB.Query("INSERT INTO jobs_skills (playerId, jobId, exp) VALUES (?,?,?)",
                [player.sqlId, job, exp]);
        } else if (!exp) {
            DB.Query("DELETE FROM jobs_skills WHERE playerId=? AND jobId=?", [player.sqlId, job]);
        } else {
            DB.Query("UPDATE jobs_skills SET exp=? WHERE playerId=? AND jobId=?",
                [exp, player.sqlId, job]);
        }
        player.jobSkills[job - 1] = exp;
    };
    player.utils.setWanted = (newWanted) => {
        //debug(`player.utils.setWanted: ${newWanted}`)
        newWanted = Math.clamp(newWanted, 0, Config.maxWantedLevel);
        var crime = 0;
        alt.emitClient(player, `hudControl.updateWanted`, newWanted);
        if (newWanted > player.wanted) crime = newWanted - player.wanted;
        player.crimes += crime;
        player.law -= crime;
        player.utils.setLocalVar("wanted", newWanted);
        //player.setSyncedMeta("wanted", newWanted);

        if (player.wanted != newWanted) DB.Query("UPDATE characters SET wanted=?,law=?,crimes=? WHERE id=?", [newWanted, player.law, player.crimes, player.sqlId]);
        player.wanted = newWanted;
        if (!player.wanted) return;

        //таймер на автом. снятие розыска
        var playerId = player.sqlId;
        var playerSqlId = player.sqlId;
        if (player.wantedTimer) clearSaveInterval(player.wantedTimer);
        player.wantedTimer = setSaveInterval(() => {
            try {
                var rec = alt.Player.getBySqlId(playerId);
                if (!rec || rec.sqlId != playerSqlId || rec.wanted <= 0) {
                    clearSaveInterval(player.wantedTimer);
                    return 0;
                }
                rec.wanted--;
                alt.emitClient(rec, `hudControl.updateWanted`, rec.wanted);
                rec.utils.setLocalVar("wanted", rec.wanted);
                if (!rec.wanted) rec.utils.success(`Ваш уровень розыска очищен!`);
                DB.Query("UPDATE characters SET wanted=? WHERE id=?", [rec.wanted, rec.sqlId]);
                if (rec.wanted <= 0) clearSaveInterval(player.wantedTimer);
            } catch (err) {
                terminal.log(err.stack);
            }
        }, alt.economy["clear_wanted_time"].value);
    };
    player.utils.setArrestTime = (arrestSeconds) => {
        //debug(`${player.getSyncedMeta("name")} setArrestTime ${arrestSeconds}`);
        if (arrestSeconds < 0) arrestSeconds = 0;
        player.arrestTime = arrestSeconds;

        DB.Query("UPDATE characters SET arrestTime=? WHERE id=?", [arrestSeconds, player.sqlId]);
    };
    player.utils.doArrest = (cellIndex, arrestSeconds, isSpawn) => {
        //debug(`player doArrest ${player.getSyncedMeta("name")}<br/>cellIndex: ${cellIndex}<br/>seconds: ${arrestSeconds} isSpawn:  ${isSpawn}`);
        cellIndex = Math.clamp(cellIndex, 0, alt.policeCells.length - 1);
        if (player.vehicle) alt.emitClient(player, `Vehicle::leave`, player.vehicle);
        player.startArrest = parseInt(new Date().getTime() / 1000);
        player.arrestCell = cellIndex;
        // TODO: одевать в форму тюремщика
        if (player.hasCuffs) {
            delete player.hasCuffs;
            alt.emitClient(player, `Anim::play`, "special_ped@tonya@intro", 'idle', 1, 49);
            player.utils.setLocalVar("hasCuffs", false)
            alt.emit(`setClothes`, player, 7, 0, 0, 0);
        }
        alt.emitClient(player, "stopFollowToPlayer");
        if (isSpawn) player.spawn(alt.policeCells[cellIndex].x, alt.policeCells[cellIndex].y, alt.policeCells[cellIndex].z);
        else player.pos = alt.policeCells[cellIndex];
        player.rot = new alt.Vector3(0, 0, alt.policeCells[cellIndex].h);

        player.utils.setArrestTime(arrestSeconds);

        var playerId = player.sqlId;
        var playerSqlId = player.sqlId;
        if (player.arrestUpdaterId) clearSaveInterval(player.arrestUpdaterId);
        player.arrestUpdaterId = setSaveInterval(() => {
            try {
                var rec = alt.Player.getBySqlId(playerId);
                if (!rec || rec.sqlId != playerSqlId || rec.arrestTime <= 0) {
                    clearInterval(player.arrestUpdaterId);
                    return 0;
                }

                rec.utils.setArrestTime(rec.arrestTime - 120);
                if (rec.arrestTime - 120 <= 0) {
                    clearSaveInterval(player.arrestUpdaterId);
                    delete rec.arrestUpdaterId;
                }
            } catch (err) {
                terminal.error(err.stack);
            }
        }, 120000);
        if (player.arrestTimerId) clearSaveInterval(player.arrestTimerId);
        player.arrestTimerId = setSaveTimeout(() => {
            try {
                var rec = alt.Player.getBySqlId(playerId);
                if (!rec || rec.sqlId != playerSqlId || rec.arrestTime <= 0) {
                    clearSaveInterval(player.arrestTimerId);
                    return 0;
                }
                delete rec.startArrest;
                delete rec.arrestCell;
                delete rec.arrestUpdaterId;
                delete rec.arrestTimerId;

                rec.pos = alt.policeCellsExit;
                //rec.spawn(alt.policeCellsExit);
                rec.rot = new alt.Vector3(0, 0, alt.policeCellsExit.h);

                rec.utils.setArrestTime(0);
                DB.Query("UPDATE characters SET arrestCell=? WHERE id=?", [0, rec.sqlId]);
                rec.utils.success(`Вы выпущены на свободу! Пожалуйста, соблюдайте законы штата`);
            } catch (err) {
                console.log(err.stack);
            }
        }, arrestSeconds * 1000);
    };
    player.utils.clearArrest = () => {
        delete player.startArrest;
        delete player.arrestCell;
        delete player.arrestUpdaterId;
        delete player.arrestTimerId;

        player.pos = alt.policeCellsExit;
        //rec.spawn(alt.policeCellsExit);
        player.rot = new alt.Vector3(0, 0, alt.policeCellsExit.h);

        player.utils.setArrestTime(0);
        DB.Query("UPDATE characters SET arrestCell=? WHERE id=?", [0, player.sqlId]);
    };
    player.utils.setCuffs = (enable) => {
        if (enable) {
            alt.emitClient(player, `Anim::play`, "mp_arresting", 'idle', 1, 49);
            player.utils.setLocalVar("hasCuffs", true);
            var index = (player.sex == 1) ? 41 : 25;
            alt.emit(`setClothes`, player, 7, index, 0, 0);
            player.hasCuffs = true;
        } else {
            delete player.hasCuffs;
            alt.emitClient(player, `Anim::play`, "special_ped@tonya@intro", 'idle', 1, 49);
            player.utils.setLocalVar("hasCuffs", false)
            alt.emit(`setClothes`, player, 7, 0, 0, 0);
        }
    };
    player.utils.setTie = (enable) => {
        if (enable) {
            alt.emitClient(player, `Anim::play`, "mp_arresting", 'idle', 1, 49);
            player.utils.setLocalVar("hasCuffs", true);
            var index = (player.sex == 1) ? 41 : 25;
            alt.emit(`setClothes`, player, 7, index, 0, 0);
            player.setSyncedMeta("hasTie", true);
            player.hasTie = true;
        } else {
            delete player.hasCuffs;
            alt.emitClient(player, `Anim::play`, "special_ped@tonya@intro", 'idle', 1, 49);
            player.utils.setLocalVar("hasCuffs", false)
            alt.emit(`setClothes`, player, 7, 0, 0, 0);
            player.setSyncedMeta("hasTie", null);
            delete player.hasTie;
        }
    };
    player.utils.giveWeapon = (item) => {
        if (!item.params.weaponHash) return;
        player.giveWeapon(item.params.weaponHash, parseInt(item.params.ammo), false);
    };
    player.utils.setSpawn = (spawnPoint) => {
        player.spawnPoint = spawnPoint;
        DB.Query(`UPDATE characters SET spawn = ? WHERE id = ?`,
            [spawnPoint, player.sqlId]);
            alt.emitClient(player, `playerMenu.setSpawn`, player.spawnPoint, 'server');
    };
    player.utils.setHouseId = (houseId) => {
        player.houseId = houseId;
        DB.Query(`UPDATE characters SET houseId = ? WHERE id = ?`,
            [houseId, player.sqlId]);
            alt.emitClient(player, `playerMenu.setHouseId`, player.houseId, 'server');
    };
    player.utils.addHouse = (house) => {
        var houses = {
            sqlId: house.sqlId,
            class: house.class,
            price: house.price,
            garage: house.garage,
            status: house.closed,
            rentPrice: parseInt(house.price / 100) * alt.economy["house_tax"].value,
            x: house.h,
            y: house.y,
            z: house.z,
            h: house.h
        };

        alt.emitClient(player, `playerMenu.addHouse`, houses);
    };
    player.utils.removeHouse = (house) => {
        alt.emitClient(player, `playerMenu.removeHouse`, house.sqlId);
    };
    player.utils.setAchievement = () => {
        if (player.achievements.items !== 0) {
            alt.emitClient(player, `playerMenu.achievementsPlayer`, player.achievements.items);
        } else {
            alt.emitClient(player, `playerMenu.achievementsPlayer`, undefined);
        }
    };
    player.utils.addBiz = (biz) => {
        var bizes = {
            sqlId: biz.id,
            bizType: biz.bizType,
            name: biz.name,
            price: biz.price,
            status: biz.status,
            rentPrice: parseInt(biz.price / 100) * alt.economy["biz_tax"].value,
            x: biz.h,
            y: biz.y,
            z: biz.z
        };

        alt.emitClient(player, `playerMenu.addBiz`, bizes);
    };
    player.utils.removeBiz = (biz) => {
        alt.emitClient(player, `playerMenu.removeBiz`, biz.id);
    };
    player.utils.setReport = (event, param) => {
        if (event == 'setNewReport') return alt.emitClient(player, `reportSystem.reports`, JSON.stringify(param));
        if (event == 'setNewMessage') return alt.emitClient(player, `reportSystem.messages`, JSON.stringify(param));
        if (event == 'closeTicket') return alt.emitClient(player, `reportSystem.close`, param);
    };
    player.utils.takeObject = (model) => {
        player.setSyncedMeta("attachedObject", model);
    };
    player.utils.putObject = () => {
        player.setSyncedMeta("attachedObject", null);
    };
    player.utils.setSatiety = (newSatiety) => {
        player.satiety = Math.clamp(newSatiety, 0, 100);
        DB.Query("UPDATE characters SET satiety=? WHERE id=?", [player.satiety, player.sqlId]);
        alt.emitClient(player, `inventory.setSatiety`, player.satiety);

        if (player.satiety <= 10) {
            // player.utils.drawTextOverPlayer(`хочет перекусить`);
            player.utils.error(`Вы проголодались! Необходимо подкрепиться!`);
        }
    };
    player.utils.setThirst = (newThirst) => {
        player.thirst = Math.clamp(newThirst, 0, 100);
        DB.Query("UPDATE characters SET thirst=? WHERE id=?", [player.thirst, player.sqlId]);
        alt.emitClient(player, `inventory.setThirst`, player.thirst);

        if (player.thirst <= 10) {
            player.utils.error(`Вы испытываете жажду! Необходимо попить!`);
        }
    };
    player.utils.setSafeQuitPosition = (position) => {
        player.safeQuitPosition = position;
    };
}

function initLocalParams(player) {
    if (player.faction != 0) {
        var faction = alt.factions.getBySqlId(player.faction);
        var rankName = alt.factions.getRankName(player.faction, player.rank);
        var rankPay = alt.factions.getRankPay(player.faction, player.rank);
        player.utils.setLocalVar("factionRankPay", rankPay);
        player.utils.setLocalVar("factionName", faction.name);
        player.utils.setLocalVar("factionRankName", rankName);
        player.utils.setLocalVar("factionLeader", faction.leaderName);
        player.utils.setLocalVar("factionLastRank", alt.factionRanks[player.faction].length - 2);
    }

    if (player.job != 0) {
        var jobName = alt.jobs[player.job - 1].name;
        player.utils.setLocalVar("jobName", jobName);
    }

    var houses = alt.houses.getHouseArrayByOwner(player.sqlId);
    var bizes = alt.bizes.getArrayByOwner(player.sqlId);

    if (houses.length != 0) {
        alt.emitClient(player, `playerMenu.houses`, houses, alt.economy["house_tax"].value);
    }

    if (bizes.length != 0) {
        alt.emitClient(player, `playerMenu.bizes`, bizes, alt.economy["biz_tax"].value);
    }

    DB.Query(`SELECT * FROM characters WHERE accountId = ?`,
    [player.account.id], (e, character) => {
        var characters = {
            minutes: 0
        };

        for (var i = 0; i < character.length; i++) {
            characters.minutes += character[i].minutes;
        }

        player.account.minutes = characters.minutes;

        player.utils.setLocalVar("accountHours", parseInt(characters.minutes));
    });


    DB.Query(`SELECT * FROM unitpay_payments WHERE account = ? ORDER BY id DESC LIMIT 5`,
    [player.account.login], (e, result) => {
        if (result.length >= 0) {
            var payments = [];
            for (var i = 0; i < result.length; i++) {
                var r = result[i];
                if (r.status == 1) {
                    payments.push({
                        sqlId: r.id,
                        sum: r.sum,
                        dateComplete: r.dateComplete
                    });
                }
            }

            alt.emitClient(player, `donateSystem.paymentsAccount`, payments);
        }
    });

    var characterLevel = alt.convertMinutesToLevelRest(player.minutes);

    player.utils.setLocalVar("admin", player.admin);
    player.utils.setLocalVar("level", characterLevel.level);
    player.utils.setLocalVar("exp", characterLevel.rest);
    player.utils.setLocalVar("nextLevel", characterLevel.nextLevel);
    player.utils.setLocalVar("accountLogin", player.account.login);
    player.utils.setLocalVar("accountEmail", player.account.email);
    player.utils.setLocalVar("accountConfirmEmail", player.account.confirmEmail);
    player.utils.setLocalVar("accountSqlId", player.account.id);
    player.utils.setLocalVar("accountExp", player.account.exp);
    player.utils.setLocalVar("accountRP", player.account.rp);
    player.utils.setLocalVar("charactersCount", player.characters.length);
    player.utils.setLocalVar("hours", parseInt(player.minutes));
    player.utils.setLocalVar("sqlId", player.sqlId);
    player.utils.setLocalVar("RP", player.rp);
    player.utils.setLocalVar("sex", player.sex);
    player.utils.setLocalVar("faction", player.faction);
    player.utils.setLocalVar("factionRank", player.rank);
    player.utils.setLocalVar("donate", player.account.donate);
    player.utils.setLocalVar("factionDate", player.factionDate);
    player.utils.setLocalVar("job", player.job);
    player.utils.setLocalVar("jobDate", player.jobDate);
    player.utils.setLocalVar("afkTimer", 0);
    player.utils.setLocalVar("relationshipName", player.relationshipName);
    player.utils.setLocalVar("relationshipDate", player.relationshipDate);
    player.utils.setLocalVar("wanted", player.wanted);
    player.utils.setLocalVar("build", Config.build);
    player.utils.setLocalVar("bank", player.bank);
    alt.emitClient(player, `playerMenu.setSpawn`, player.spawnPoint, 'server');
    alt.emitClient(player, `playerMenu.setHouseId`, player.houseId, 'server');
    alt.emitClient(player, `playerMenu.skills`, player.skills);
    
    
    if (player.faction >= 0) {
        const factionListLoad = alt.factionPlayerList[player.faction];
        for (var i in factionListLoad) {
            try {
                let factionPlayer = alt.Player.getBySqlId(factionListLoad[i].id);
                if (factionPlayer){
                    if (player.sqlId !== factionPlayer.sqlId) {
                        alt.emitClient(player, `familiar.addFactions`, factionListLoad[i].name, factionPlayer.sqlId);
                        alt.emitClient(factionPlayer, `familiar.addFactions`, player.getSyncedMeta("name"), player.sqlId);
                    }
                }
            } catch (e) {
                    console.log(e);
            }
        }
    }

    alt.logs.addLog(`${player.getSyncedMeta("name")}[${player.sqlId}] авторизовался на сервере. IP: ${player.ip}, socialClub: ${player.socialId}`, 'auth', player.account.id, player.sqlId, { socialClub: player.socialId, id: player.sqlId, ip: player.ip });
}

const SpawnInfo = {
    user_spawn: [],
    demorgan: {
        x: 1651.41,
        y: 2570.28,
        z: 45.56,
        h: 0
    },
    demorgan_exit: {
        x: 463.62,
        y: -998.10,
        z: 24.91,
        h: 270
    }
};
module.exports.SpawnInfo = SpawnInfo;

function getPlayerSpawnPos(player) {
    const houses = alt.houses.getArrayByOwner(player.sqlId);
    let spawn = SpawnInfo.user_spawn[getRandom(0, SpawnInfo.user_spawn.length - 1)];
    let houseSpawn = houses[getRandom(0, houses.length - 1)];
    var pos;

    if (player.demorgan > 0) {
        pos = {x:SpawnInfo.demorgan.x, y:SpawnInfo.demorgan.y, z:SpawnInfo.demorgan.z};
        pos.h = SpawnInfo.demorgan.h;
        if (player.demorganTimerId) return pos;
        let startDemorgan = parseInt(new Date().getTime() / 1000);
        player.utils.setLocalVar("demorganSet", { startTime: startDemorgan, demorgan: player.demorgan });
        player.startDemorgan = startDemorgan;
        player.demorganTimerId = setSaveTimeout(() => {
            try {
                player.utils.leaveDemorgan();
            } catch (err) {
                console.log(err.stack);
            }
        }, player.demorgan * 60 * 1000);
        return pos;
    }

    if (player.spawnPoint == 1) {
        if (houses.length != 0 && player.houseId != 0) {
            var house = alt.houses.getBySqlId(player.houseId);
            pos = {x: house.x, y: house.y, z: house.z};
            pos.h = house.h;
        } else if (houses.length != 0) {
            pos = {x: houseSpawn.x, y:houseSpawn.y, z:houseSpawn.z};
            pos.h = houseSpawn.h;
        } else {
            pos = {x:spawn.x, y:spawn.y, z:spawn.z};
            pos.h = spawn.h;
        }
    } else if (player.spawnPoint == 2) {
        if (player.faction != 0) {
            var faction = alt.factions.getBySqlId(player.faction);
            pos = faction.pos;
            pos.h = faction.h;
        } else {
            pos = {x:spawn.x, y:spawn.y, z:spawn.z};
            pos.h = spawn.h;
        }
    } else if (player.spawnPoint == 3) {
        pos = {x:spawn.x, y:spawn.y, z:spawn.z};
        pos.h = spawn.h;
    } else if (player.spawnPos.length !== 0 && player.spawnPoint == 4) {
        return player.spawnPos;
    } else if (player.spawnPoint == 0 && player.spawnPoint >= 5) {
        pos = { x: spawn.x, y: spawn.y, z: spawn.z };
        pos.h = spawn.h;
    }

    return pos;
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function initFinesCount(player) {
    DB.Query(`SELECT * FROM fines WHERE recipient=?`, [player.sqlId], (e, result) => {
        player.fines = result.length;
    });
}

function initSatietyTimer(player) {
    var playerId = player.sqlId;
    var playerSqlId = player.sqlId;
    player.satietyTimer = setSaveInterval(() => {
        try {
            var rec = alt.Player.getBySqlId(playerId);
            if (!rec || rec.sqlId != playerSqlId) {
                clearSaveInterval(player.satietyTimer);
                return 0;
            }

            if (rec.satiety <= 0) {
                rec.health -= alt.economy["satiety_satiety_health"].value;
                if (rec.health <= 0) return rec.utils.error(`Вы умерли от голода!`);
                //rec.utils.drawTextOverPlayer(`держится за живот`);
                if (rec.health < 130) rec.utils.error(`Вы проголодались! Посетите закусочную или купите что нибудь из еды!`);
                return;
            }
            if (rec.thirst <= 0) {
                rec.health -= alt.economy["satiety_thirst_health"].value;
                if (rec.health <= 0) return rec.utils.error(`Вы умерли от жажды!`);
               // rec.utils.drawTextOverPlayer(`тяжело дышит`);
                if (rec.health < 130) rec.utils.error(`Вы погибаете от жажды! Срочно выпейте напиток!`);
                return;
            }
            rec.utils.setSatiety(rec.satiety - alt.economy["satiety_satiety_value"].value);
            rec.utils.setThirst(rec.thirst - alt.economy["satiety_thirst_value"].value);
        } catch (err) {
            terminal.error(err.stack);
        }
    }, alt.economy["satiety_time"].value * 60 * 1000);

}

function initJobSkills(player) {
    player.jobSkills = [];
    alt.jobs.forEach((job) => player.jobSkills.push(0));

    DB.Query("SELECT * FROM jobs_skills WHERE playerId=?", player.sqlId, (e, result) => {
        for (var i = 0; i < result.length; i++) {
            player.jobSkills[Math.clamp(result[i].jobId - 1, 0, player.jobSkills.length - 1)] = result[i].exp;
        }
    });
}

function spawnPlayerCars(player) {
    try {
        player.carIds = [];
        player.cars = [];
        DB.Query("SELECT * FROM vehicles WHERE owner=?", [2000 + player.sqlId], async (e, result) => {
            let streetCars = alt.economy["player_streetcars_count"].value;
            for (var i = 0; i < result.length; i++) {
                let v = result[i];
                if (!v.x && !v.y) continue;
                if (v.dimension && streetCars > 0) {
                    streetCars--;
                    const pos = { x: v.x, y: v.y, z: v.z };
                    pos.h = v.h;
            
                    const vehicle = await alt.gameEntityCreate(v.model, new alt.Vector3(pos.x, pos.y, pos.z), new alt.Vector3(0, 0, pos.h  * Math.PI / 180));
                    vehicle.engineOn = false;
                    vehicle.lockState = 2;
                    vehicle.numberPlateText = "Cyber State";
                    vehicle.primaryColor = v.color1;
                    vehicle.secondaryColor = v.color2;
                    vehicle.dimension = 1;
                    vehicle.spawnPos = pos;
                    vehicle.name = v.model.toLowerCase();
                    vehicle.sqlId = v.id;
                    vehicle.vehPropData.engineBroken = v.engineBroken;
                    vehicle.vehPropData.oilBroken = v.oilBroken;
                    vehicle.vehPropData.accumulatorBroken = v.accumulatorBroken;
                    vehicle.vehPropData.fuel = v.fuel;
                    vehicle.vehPropData.maxFuel = v.maxFuel;
                    vehicle.vehPropData.consumption = v.consumption;
                    vehicle.vehPropData.mileage = v.mileage;
                    vehicle.bodyHealth = v.health;
                    vehicle.license = v.license;
                    vehicle.owner = v.owner;

                    try {
                        await tuningVehicle(vehicle, v);
                    } catch (tunError) {
                        console.log(`Tuning not setted for vehicle with id '${v.id}'. ${tunError}`);
                    }

                    player.carIds.push(vehicle.id);
                    initVehicleInventory(vehicle);
                }

                player.cars.push({
                    id: v.id,
                    name: v.model
                });
            }

            if (player.cars.length != 0) {
                alt.emitClient(player, `playerMenu.cars`, player.cars);
            }
        });
    } catch (err) {
        console.error(err);
    }
}

function showRegError(player, errorText) {
    alt.emitClient(player, "character_creation::continue");
    player.utils.error(errorText);
}

function showChangeError(player, errorText) {
    alt.emitClient(player, "character_change::continue");
    player.utils.error(errorText);
}

function initCutscenes(player) {
    alt.emitClient(player, `initPointsForMoveCam`, alt.cutscenes);
}

function initPlayerReports(player) {
    if (player.admin) {
        var values = Object.values(alt.v2_reports);
        if (values.length) alt.emitClient(player, `console.pushReport`, values);
    } else {

    }
}
