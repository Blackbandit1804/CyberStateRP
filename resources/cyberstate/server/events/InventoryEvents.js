alt.onClient("item.throw", (player, sqlId) => {
    var item = player.inventory.getItem(sqlId);
    if (!item) {
        alt.emitClient(player, `inventory.delete`, sqlId);
        return player.utils.error(`Выбросить нечего!`);
    }
    if (player.vehicle) return player.utils.error(`Выйдите из авто!`);
    if (player.hasCuffs) return player.utils.error(`Вы в наручниках!`);
    // TODO: Поумнее сделать.
    if (item.itemId == 4) return player.utils.error(`Невозможно выбросить данный предмет!`); // < 100)

    player.inventory.delete(sqlId, (e) => {
        if (e) return player.utils.error(e);
        var info = alt.inventory.getItem(item.itemId);
        var pos = player.pos;
        pos.z--;
        pos.z += info.deltaZ;
        pos.z += 0.5;

        //debug(`${item.sqlId}`)

        var newObj = alt.objects.new(jhash(info.model), pos, new alt.Vector3(info.rX, info.rY, player.rot.z), item, item.sqlId);

        player.utils.success(`Вы выбросили предмет!`);
        alt.logs.addLog(`${player.getSyncedMeta("name")} выбросил на землю ${alt.inventory.getItem(item.itemId).name}`, 'inventory', player.account.id, player.sqlId, { socialClub: player.socialId, item: alt.inventory.getItem(item.itemId).name, coord: newObj.pos, obj: newObj });

        var sqlId = newObj.sqlId;

        newObj.timerId = setSaveTimeout(() => {
            try {
                var o = alt.objects.at(sqlId);
                if (!o || o.sqlId != sqlId) return;

                alt.objects.destroy(o.sqlId);
            } catch (e) {
                alt.log(e);
            }
        }, alt.economy["alive_ground_item"].value);

        for (var i = 0; i < player.inventory.ground.length; i++) {
            var gr = player.inventory.ground[i];
            if (gr == sqlId) {
                player.inventory.ground.splice(i, 1);
                i--;
            }
        }

        player.inventory.ground.push(sqlId);
        if (player.inventory.ground.length > alt.economy["ground_items_count"].value) {
            var gr = player.inventory.ground.shift();
            alt.objects.forEach((o) => {
                if (o.sqlId == gr) {
                    clearSaveInterval(o.timerId);
                    alt.objects.destroy(o.sqlId);
                }
            });
        }
        // debug(JSON.stringify(player.inventory.ground));

    });
});
alt.onClient("item.pickUp", (player, objId) => {
    //debug(`${player.getSyncedMeta("name")} called item.pickUp: ${objId}`);
    var itemObj = alt.objects.at(objId);
    if (!itemObj) return player.utils.error(`Объект не найден!`);
    if (!itemObj.sqlId || !itemObj.item) return player.utils.error(`Объект не является предметом!`);
    if (itemObj.denyPickUp) return player.utils.error(`Другой гражданин начал поднимать первее!`);
    if (player.hasCuffs) return player.utils.error(`Вы в наручниках!`);
    var dist = alt.Player.dist(player.pos, itemObj.pos);
    if (dist > Config.maxPickUpItemDist) return player.utils.error(`Вы слишком далеко от предмета!`);
    var freeSlot = player.inventory.findFreeSlot(itemObj.item.itemId);
    if (!freeSlot) {
        alt.objects.forEach((obj) => {
            if (alt.Player.dist(obj.pos, player.pos) <= Config.maxPickUpItemDist) {
                if (obj.sqlId && !obj.denyPickUp) {
                    var item = obj.item;
                    if (item.itemId == 7 || item.itemId == 8 || item.itemId == 13) {
                        var slot = player.inventory.findFreeSlot(item.itemId);
                        if (slot) itemObj = obj;
                        return;
                    }
                }
            }
        });
    }

    if (itemObj.item.params.sex != null && itemObj.item.params.sex != player.sex) return player.utils.error(`Одежда не подходит!`);
    itemObj.denyPickUp = true;
    player.inventory.addOld(itemObj.item.id, itemObj.item, (e) => {
        delete itemObj.denyPickUp;
        if (e) return player.utils.error(e);
        player.utils.success(`Предмет добавлен!`);
        clearSaveInterval(itemObj.timerId);
        alt.objects.destroy(itemObj.sqlId);
    });
});

alt.on("anim", (player, animDict, animName, flag = 0, time = 3000) => {
    alt.emitClient(player, "Anim::play", animDict, animName, 1, 1);
    setSaveTimeout(() => {
        try {
            alt.emitClient(player, "Anim::play", "missheist_agency2aig_13", "pickup_briefcase_upperbody", 1, flag);
        } catch (e) {
            console.log(e);
        }
    }, time);
});

alt.onClient("item.updatePos", (player, data) => {
    data = JSON.parse(data);
    var sqlId = data[0];
    var parentSqlId = data[1];
    var index = data[2];
    var inVehicle = data[3] || false;

    //debug(`${JSON.stringify(data)}`)
    if (inVehicle) {
        if (player.bootVehicleId == null) return player.utils.error(`Вы не взаимодействуете с багажником авто!`);
        var veh = alt.Vehicle.at(player.bootVehicleId);
        if (!veh) return player.utils.error(`Авто с ID: ${vehId} не найдено!`);
        var dist = alt.Player.dist(player.pos, veh.pos);
        if (dist > Config.maxInteractionDist * 2) return player.utils.error(`Авто слишком далеко!`);
        if (!veh.getSyncedMeta("boot")) return player.utils.error(`Багажник закрыт!`);
        if (!veh.inventory) return player.utils.error(`Авто не имеет инвентаря!`);
        if (!veh.sqlId) return player.utils.error(`Авто не находится в БД!`);
        if (!parentSqlId) {
            return veh.inventory.updatePos(sqlId, parentSqlId, index);
        }
        if (parentSqlId == -1) {
            // надели на игрока
            var item = veh.inventory.getItem(sqlId);
            if (!item) return player.utils.error(`Предмет не найден!`);
            veh.inventory.delete(sqlId);
            console.log(`${JSON.stringify(item.items)}`)
            player.inventory.add(item.itemId, item.params, item.items || {}, (e) => {
                if (e) return player.utils.error(e);
                if (player.waitOperation) return player.utils.error(`Дождитесь выполнения предыдущей операции!`);
                player.utils.success(`Вы взяли предмет из багажника`);
            });
        } else {
            // из багажника в вещь игрока
            var item = veh.inventory.getItem(sqlId);
            if (!item) return player.utils.error(`Предмет не найден!`);
            var parentItem = player.inventory.getItem(parentSqlId);
            if (!parentItem) return player.utils.error(`Вещь не найдена!`);
            veh.inventory.delete(sqlId);
            player.inventory.addToItem(item, parentSqlId, index, (e, insertId) => {
                if (e) return player.utils.error(e);
                if (player.waitOperation) return player.utils.error(`Дождитесь выполнения предыдущей операции!`);
                player.utils.success(`Вы взяли предмет из багажника`);
            });
        }
    } else {
        if (parentSqlId == -2) {
            if (player.bootVehicleId == null) return player.utils.error(`Вы не взаимодействуете с багажником авто!`);
            var veh = alt.Vehicle.at(player.bootVehicleId);
            if (!veh) return player.utils.error(`Авто с ID: ${vehId} не найдено!`);
            var dist = alt.Player.dist(player.pos, veh.pos);
            if (dist > Config.maxInteractionDist * 2) return player.utils.error(`Авто слишком далеко!`);
            if (!veh.getSyncedMeta("boot")) return player.utils.error(`Багажник закрыт!`);
            if (!veh.inventory) return player.utils.error(`Авто не имеет инвентаря!`);
            if (!veh.sqlId) return player.utils.error(`Авто не находится в БД!`);
            var item = player.inventory.getItem(sqlId);
            if (!item) return player.utils.error(`Предмет не найден!`);
            if (item.items && Object.keys(item.items).length > 0) return player.utils.error(`Освободите карманы!`);
            player.inventory.delete(sqlId);
            veh.inventory.add(item.itemId, item.params, item.items || {}, (e, insertId) => {
                if (e) return player.utils.error(e);
                if (veh.waitOperation) return player.utils.error(`Дождитесь выполнения предыдущей операции!`);
                alt.emitClient(player, "inventory.updateDataVeh", sqlId, insertId);
                player.utils.success(`Вы положили предмет в багажник`);
            }, false, index);
        } else {
            player.inventory.updatePos(sqlId, parentSqlId, index, (e) => {
                if (e) return player.utils.error(e);
            });
        }
    }
});
alt.onClient("items.merge", (player, data) => {
    data = JSON.parse(data);
    //debug(`items.merge: ${player.getSyncedMeta("name")} ${data}`);
    var item = player.inventory.getItem(data[0]);
    var targetItem = player.inventory.getItem(data[1]);
    if (!item || !targetItem) return player.utils.error(`Один из предметов для слияния не найден!`);
    var drugsIds = [55, 56, 57, 58];

    if (item.itemId == 4 && targetItem.itemId == 4) { // слияние денег
        targetItem.params.count += item.params.count;
        item.params.count = 0;
        //player.utils.setMoney(player.money + item.params.count);
        player.inventory.delete(data[0]);
        player.inventory.updateParams(data[1], targetItem);
    } else if (item.params.ammo && !item.params.weaponHash && targetItem.params.ammo && !targetItem.params.weaponHash && item.itemId == targetItem.itemId) { //слияние патрон
        targetItem.params.ammo += item.params.ammo;
        item.params.ammo = 0;
        //player.utils.setMoney(player.money + item.params.count);
        player.inventory.delete(data[0]);
        player.inventory.updateParams(data[1], targetItem);
    } else if (item.params.ammo != null && !item.params.weaponHash && targetItem.params.weaponHash) {
        var weaponAmmo = {
            "20": 37, //9mm
            "21": 38, //12mm
            "22": 40, //5.56mm
            "23": 39, //7.62mm
            "44": 37,
            "45": 37,
            "46": 37,
            "47": 37,
            "48": 37,
            "49": 38,
            "50": 39,
            "51": 40,
            "52": 39,
            "53": 39,
            "100": 39,
        };
        if (item.itemId != weaponAmmo[targetItem.itemId]) return player.utils.error(`Неверный тип патрон!`);

        targetItem.params.ammo += item.params.ammo;
        alt.emitClient(player, `addWeaponAmmo`, targetItem.params.weaponHash, parseInt(targetItem.params.ammo));
        player.inventory.delete(data[0]);
        player.inventory.updateParams(data[1], targetItem);
    } else if (item.itemId == targetItem.itemId && drugsIds.indexOf(item.itemId) != -1) {
        targetItem.params.count += item.params.count;
        item.params.count = 0;
        player.inventory.delete(data[0]);
        player.inventory.updateParams(data[1], targetItem);
    } else if (item.itemId == 62 && targetItem.itemId == 34) {
        if (targetItem.params.count >= 20) return player.utils.error(`Пачка полная!`);
        targetItem.params.count++;
        player.inventory.delete(data[0]);
        player.inventory.updateParams(data[1], targetItem);
    }
});
alt.onClient("item.split", (player, data) => {
    // return player.utils.error(`Разделение выключено!`);
    data = JSON.parse(data);
    //debug(`item.split: ${player.getSyncedMeta("name")} ${JSON.stringify(data)}`);
    var item = player.inventory.getItem(data[0]);

    if (!item) return player.utils.error(`Предмет не найден!`);
    var itemIds = [4, 37, 38, 39, 40, 55, 56, 57, 58];
    if (itemIds.indexOf(item.itemId) == -1) return player.utils.error(`Неверный тип предмета!`);

    if (item.params.ammo) { // разделение патрон
        var count = Math.clamp(data[1], 0, item.params.ammo - 1);
        var freeSlot = player.inventory.findFreeSlot(item.itemId);
        if (!freeSlot) return player.utils.error(`Свободный слот не найден!`);
        if (count >= item.params.ammo) return player.utils.error(`Неверное количество!`);
        item.params.ammo -= count;
        player.inventory.updateParams(data[0], item);
        player.inventory.add(item.itemId, {
            ammo: count
        }, {}, (e) => {
            if (e) return alt.log(e);
        });
    } else {
        var count = Math.clamp(data[1], 0, item.params.count - 1);
        var freeSlot = player.inventory.findFreeSlot(item.itemId);
        if (!freeSlot) return player.utils.error(`Свободный слот не найден!`);
        if (count >= item.params.count) return player.utils.error(`Неверное количество!`);
        item.params.count -= count;
        player.inventory.updateParams(data[0], item);
        player.inventory.add(item.itemId, {
            count: count
        }, null, null, true, (e) => {
            if (e) return alt.log(e);
        });
    }

    player.utils.success(`Предмет разделен!`);
});
alt.onClient("weapon.throw", (player, itemSqlId, ammo) => {
    //debug(`weapon.throw: ${itemSqlId} ${ammo}`);
    var item = player.inventory.getItem(itemSqlId);
    if (!item) return player.utils.error(`Оружие не найдено!`);
    ammo = Math.clamp(ammo, 0, 10000);
    item.params.ammo = ammo;
    player.inventory.updateParams(itemSqlId, item);
    alt.emit("item.throw", player, itemSqlId, ammo);
});

alt.onClient("weapon.updateAmmo", (player, weaponHash, ammo) => {
    //debug(`weapon.updateAmmo: ${weaponHash} ${ammo}`);
    //debug(jhash("weapon_carbinerifle"));
    var weapons = player.inventory.getArrayWeapons();
    var fixHashes = {
        "-2084633992": "2210333304",
        "-1569615261": "2210333304",
        "-1045183535": "2210333304",
        "-1786099057": "2210333304",
        "-656458692": "2210333304",
        "-1716189206": "2210333304",
        "453432689": "2210333304",
        "584646201": "2210333304",
        "324215364": "2210333304",
        "736523883": "2210333304",
        "487013001": "2210333304",
        "2017895192": "2210333304",
        "-1074790547": "2210333304",
        "2132975508": "2210333304",
        "1649403952": "2210333304",
        "-1660422300": "2210333304",
        "100416529": "2210333304",
        "1737195953": "2210333304",
        "-1951375401": "2210333304",
        "911657153": "2210333304",
        "1593441988": "2210333304",
    }; //to do дополнить
    for (var key in weapons) {
        var item = weapons[key];
        var invWeaponHash = item.params.weaponHash;
        var fixHash = fixHashes[weaponHash];
        if (invWeaponHash == weaponHash || (fixHash && fixHash == invWeaponHash)) {
            ammo = Math.clamp(ammo, 0, 10000);
            item.params.ammo = ammo;
            player.inventory.updateParams(item.id, item);
            return;
        }
    }
});
alt.onClient("vehicle.requestItems", (player, vehId) => {
    // debug(`vehicle.requestItems: ${player.getSyncedMeta("name")} ${vehId}`)
    var veh = alt.Vehicle.at(vehId);
    if (!veh) return player.utils.error(`Авто с ID: ${vehId} не найдено!`);
    var dist = alt.Player.dist(player.pos, veh.pos);
    if (dist > Config.maxInteractionDist * 2) return player.utils.error(`Авто слишком далеко!`);
    if (!veh.getSyncedMeta("boot")) return player.utils.error(`Багажник закрыт!`);
    if (!veh.inventory) return player.utils.error(`Авто не имеет багажник!`);
    if (!veh.sqlId) return player.utils.error(`Авто не находится в БД!`);
    if (veh.bootPlayerId != null) return player.utils.error(`С багажником взаимодействует другой гражданин!`);

    veh.bootPlayerId = player.sqlId;
    player.bootVehicleId = veh.id;

    alt.emitClient(player, `inventory.addVehicleItems`, JSON.stringify(veh.inventory.items), {
        name: veh.name,
        sqlId: veh.sqlId
    }, 10, 5);
    // alt.log(veh);
});

/* Игрок закончил взаимодействие с багажником. */
alt.onClient("vehicle.requestClearItems", (player, vehId) => {
    // debug(`vehicle.requestClearItems: ${player.getSyncedMeta("name")} ${vehId}`)
    var veh = alt.Vehicle.at(vehId);
    alt.emitClient(player, `inventory.deleteVehicleItems`);
    delete player.bootVehicleId;

    if (veh && player.sqlId == veh.bootPlayerId) {
        delete veh.bootPlayerId;
    }
});
/* Индивидуальная Функциональность предметов инвентаря. */
alt.onClient("showDocuments", (player, itemSqlId) => {
    //debug(`showDocuments: ${itemSqlId}`);
    var item = player.inventory.getItem(itemSqlId);
    if (!item || item.itemId != 16) {
        alt.emitClient(player, "inventory.delete", itemSqlId);
        return player.utils.error(`Предмет не найден!`);
    }
    if (!item.params.owner) return player.utils.error(`Владелец предмета не найден!`);
    DB.Query(`SELECT id,name,sex,minutes,law,relationshipName,relationshipDate
                FROM characters WHERE id=?`, [item.params.owner], (e, result) => {
        if (result.length == 0) return player.utils.error(`Игрок с ID: ${item.params.owner} не найден!`);

        var data = {};
        for (var key in result[0]) data[key] = result[0][key];
        data.houses = convertHousesToDocHouses(alt.houses.getArrayByOwner(item.params.owner));
        data.licenses = JSON.parse(JSON.stringify(item.params.licenses || []));
        data.weapon = JSON.parse(JSON.stringify(item.params.weapon || []));
        data.work = JSON.parse(JSON.stringify(item.params.work || []));

        for (var i = 0; i < data.work.length; i++) {
            var faction = alt.factions.getBySqlId(data.work[i].faction);
            data.work[i].faction = faction.name;
            data.work[i].rank = alt.factions.getRankName(faction.sqlId, data.work[i].rank);
        }

        alt.emitClient(player, `documents.showAll`, data);
    });
});
alt.onClient("documents.show", (player, recId, docType) => {
    var rec = alt.Player.getBySqlId(recId);
    if (!rec) return player.utils.error(`Гражданин не найден!`);
    var dist = alt.Player.dist(player.pos, rec.pos);
    if (dist > Config.maxInteractionDist) return player.utils.error(`Гражданин далеко!`);

    var items = player.inventory.getArrayByItemId(16); // документы
    var keys = Object.keys(items);
    if (keys.length == 0) return player.utils.error(`Документы не найдены!`);
    var item = items[keys[0]];
    if (!item.params.owner) return player.utils.error(`Владелец предмета не найден!`);

    var data = {};
    switch (docType) {
        case "passport":
            DB.Query(`SELECT * FROM characters WHERE id=?`, [item.params.owner], (e, result) => {
                if (e) alt.log(e);
                if (result.length <= 0) return player.utils.error(`Игрок с ID: ${item.params.owner} не найден!`);
                for (var key in result[0]) data[key] = result[0][key];
                data.houses = convertHousesToDocHouses(alt.houses.getArrayByOwner(item.params.owner));
                alt.emitClient(rec, `documents.showPassport`, data);
            });
            break;
        case "licenses":
            data.licenses = JSON.parse(JSON.stringify(item.params.licenses || []));
            alt.emitClient(rec, `documents.showLicenses`, data);
            break;
        case "weapon":
            data.weapon = JSON.parse(JSON.stringify(item.params.weapon || []));
            alt.emitClient(rec, `documents.showWeapon`, data);
            break;
        case "work":
            data.work = JSON.parse(JSON.stringify(item.params.work || []));
            for (var i = 0; i < data.work.length; i++) {
                var faction = alt.factions.getBySqlId(data.work[i].faction);
                data.work[i].faction = faction.name;
                data.work[i].rank = alt.factions.getRankName(faction.sqlId, data.work[i].rank);
            }
            alt.emitClient(rec, `documents.showWork`, data);
            break;
        default:
            player.utils.error(`Типа документа не опознан!`);
            return;
    }

    player.utils.success(`Вы показали документы`);
    rec.utils.success(`${player.getSyncedMeta("name")} показал Вам документы`);
});
alt.onClient("documents.showFaction", (player, recId) => {
    // debug(`documents.showFaction: ${player.getSyncedMeta("name")} ${recId}`);
    if (recId == -1) recId = player.sqlId;
    var rec = alt.Player.getBySqlId(recId);
    if (!rec) return player.utils.error(`Гражданин не найден!`);
    var dist = alt.Player.dist(player.pos, rec.pos);
    if (dist > Config.maxInteractionDist) return player.utils.error(`Гражданин далеко!`);

    if (!player.faction) return player.utils.error(`Вы не состоите в организации!`);
    var itemId;
    if (player.faction == 2) itemId = 29;
    else if (player.faction == 3) itemId = 64;
    else if (alt.factions.isFibFaction(player.faction)) itemId = 61;
    else if (alt.factions.isHospitalFaction(player.faction)) itemId = 63;
    else if (alt.factions.isArmyFaction(player.faction)) itemId = 60;

    var items = player.inventory.getArrayByItemId(itemId); // удостоверение
    var keys = Object.keys(items);
    if (keys.length == 0) return player.utils.error(`Удостоверение не найдено!`);
    var item = items[keys[0]];
    if (!item.params.owner) return player.utils.error(`Владелец предмета не найден!`);
    if (item.params.owner != player.sqlId) return player.utils.error(`Нельзя показать чужое удостоверение!`);
    if (item.params.faction != player.faction) return player.utils.error(`Нельзя показать удостоверение другой организации!`);

    var data = {
        Name: player.getSyncedMeta("name"),
        Sex: player.sex,
        Minutes: player.minutes,
        Rank: alt.factions.getRankName(player.faction, player.rank),
        ID: player.sqlId,
        Area: '#1',
        faction: player.faction
    };

    alt.emitClient(rec, `documents.showFaction`, data);

    if (recId != player.sqlId) {
        player.utils.success(`Вы показали удостоверение`);
        rec.utils.success(`${player.getSyncedMeta("name")} показал Вам удостоверение`);
    }
});

/* События копов. */
alt.onClient("cuffsOnPlayer", (player, recId) => { // надеть/снять наручники
    var rec = alt.Player.getBySqlId(recId);
    if (!rec) return player.utils.error(`Гражданин не найден!`);
    var dist = alt.Player.dist(player.pos, rec.pos);
    if (dist > Config.maxInteractionDist) return player.utils.error(`Гражданин далеко!`);
    if (!alt.factions.isLegalFaction(player.faction)) return player.utils.error(`Вы не сотрудник порядка!`);
    if (rec.vehicle) return player.utils.error(`Гражданин в авто!`);
    if (player.hasCuffs) return player.utils.error(`Вы в наручниках!`);
    if (player.hasTie) return player.utils.error(`На вас надеты стяжки!`);

    if (!rec.hasCuffs) {
        var cuffsItems = player.inventory.getArrayByItemId(28);
        if (!Object.keys(cuffsItems).length) return player.utils.error(`Вы не имеете наручники!`);
        player.inventory.delete(Object.values(cuffsItems)[0].id);

        rec.utils.success(`${player.getSyncedMeta("name")} надел на Вас наручники`);
        player.utils.success(`${rec.getSyncedMeta("name")} в наручниках`);
    } else {
        var params = {
            faction: player.faction,
            owner: player.sqlId
        };
        player.inventory.add(28, params, {}, (e) => {
            if (e) return player.utils.error(e);
        });

        rec.utils.success(`${player.getSyncedMeta("name")} снял с Вас наручники`);
        player.utils.success(`${rec.getSyncedMeta("name")} без наручников`);

        delete rec.isFollowing;
        alt.emitClient(rec, `stopFollowToPlayer`);
    }

    rec.utils.setCuffs(!rec.hasCuffs);
});
alt.onClient("showWantedModal", (player, recId) => { // показать окно выдачи розыска
    const rec = alt.Player.getBySqlId(recId);
    if (!rec) return player.utils.error(`Гражданин не найден!`);
    //var dist = alt.Player.dist(player.pos, rec.pos);
    //if (dist > Config.maxInteractionDist) return player.utils.error(`Гражданин далеко!`);
    if (!alt.factions.isPoliceFaction(player.faction) && !alt.factions.isFibFaction(player.faction)) return player.utils.error(`Вы не сотрудник порядка!`);
    if (rec.wanted >= Config.maxWantedLevel) return player.utils.error(`${rec.getSyncedMeta("name")} имеет максимальный уровень розыска!`);

    alt.emitClient(player, `modal.show`, "give_wanted", {
        "playerId": recId,
        "playerName": rec.getSyncedMeta("name"),
        "wanted": rec.wanted
    });
});

alt.onClient("giveWanted", (player, data) => {
    //debug(`giveWanted: ${data}`);
    data = JSON.parse(data);
    var recId = data[0],
        wanted = data[1],
        reason = data[2];
    var rec = alt.Player.getBySqlId(recId);
    if (!rec) return player.utils.error(`Гражданин не найден!`);

    if (!alt.factions.isPoliceFaction(player.faction) && !alt.factions.isFibFaction(player.faction)) return player.utils.error(`Вы не сотрудник порядка!`);
    if (wanted > Config.maxWantedLevel) return player.utils.error(`Выберите от 1 до ${Config.maxWantedLevel} уровня розыска!`);
    if (rec.wanted >= Config.maxWantedLevel) return player.utils.error(`${rec.getSyncedMeta("name")} имеет максимальный уровень розыска!`);

    rec.utils.setWanted(rec.wanted + wanted);
    player.utils.success(`${rec.getSyncedMeta("name")} объявлен в розыск`);
    rec.utils.error(`${player.getSyncedMeta("name")} объявил Вас в розыск`);
    alt.logs.addLog(`${player.getSyncedMeta("name")} объявил игрока ${rec.getSyncedMeta("name")} в розыск. Звезд: ${wanted}`, 'faction', player.account.id, player.sqlId, { faction: player.faction, wanted: wanted });
    alt.logs.addLog(`${rec.getSyncedMeta("name")} был объявлен игроком ${player.getSyncedMeta("name")} в розыск. Звезд: ${wanted}`, 'faction', rec.account.id, rec.sqlId, { faction: rec.faction, wanted: wanted });
});

alt.onClient("showFinesModal", (player, recId) => { // показать окно выписки штрафа
    var rec = alt.Player.getBySqlId(recId);
    if (!rec) return player.utils.error(`Гражданин не найден!`);
    //var dist = alt.Player.dist(player.pos, rec.pos);
    //if (dist > Config.maxInteractionDist) return player.utils.error(`Гражданин далеко!`);
    if (!alt.factions.isPoliceFaction(player.faction)) return player.utils.error(`Вы не сотрудник порядка!`);

    alt.emitClient(player, `modal.show`, "give_fine", {
        "playerId": recId,
        "playerName": rec.getSyncedMeta("name"),
        "wanted": rec.wanted
    });
});

alt.onClient("giveFine", (player, data) => {
    //debug(`giveWanted: ${data}`);
    data = JSON.parse(data);
    var recId = data[0],
        sum = data[1],
        reason = data[2].trim();
    sum = Math.clamp(sum, 1, alt.economy["max_fine_sum"].value);
    var rec = alt.Player.getBySqlId(recId);
    if (!rec) return player.utils.error(`Гражданин не найден!`);
    if (!alt.factions.isPoliceFaction(player.faction)) return player.utils.error(`Вы не сотрудник порядка!`);
    rec.fines++;
    DB.Query("INSERT INTO fines (cop,recipient,reason,price,date) VALUES (?,?,?,?,?)",
    [player.sqlId, rec.sqlId, reason, sum, new Date().getTime() / 1000], (e) => {
        if (e) terminal.error(e);
    });

    player.utils.success(`${rec.getSyncedMeta("name")} получил штраф на ${sum}$`);
    rec.utils.error(`${player.getSyncedMeta("name")} выписал Вам штраф на ${sum}$`);

    alt.logs.addLog(`${player.getSyncedMeta("name")} выписал штраф игроку ${rec.getSyncedMeta("name")}. Причина: ${reason}, сумма: ${sum}`, 'faction', player.account.id, player.sqlId, { faction: player.faction, reason: reason, sum: sum });
    alt.logs.addLog(`${rec.getSyncedMeta("name")} был выписан штраф игроком ${player.getSyncedMeta("name")}. Причина: ${reason}, сумма: ${sum}`, 'faction', rec.account.id, rec.sqlId, { faction: rec.faction, reason: reason, sum: sum });
});

alt.onClient("startFollow", (player, recId) => {
    // debug(`startFollow: ${recId}`)
    var rec = alt.Player.getBySqlId(recId);
    if (!rec) return player.utils.error(`Гражданин не найден!`);
    //var dist = alt.Player.dist(player.pos, rec.pos);
    //if (dist > Config.maxInteractionDist) return player.utils.error(`Гражданин далеко!`);
    if (!alt.factions.isLegalFaction(player.faction) && rec.hasCuffs) return player.utils.error(`Вы не сотрудник порядка!`);

    if (!rec.isFollowing) {
        if (!rec.hasCuffs && !rec.hasTie ) return player.utils.error(`Гражданин не в наручниках!`);
        rec.isFollowing = true;
        alt.emitClient(rec, `startFollowToPlayer`, player.sqlId);
    } else {
        delete rec.isFollowing;
        alt.emitClient(rec, `stopFollowToPlayer`);
    }
});

alt.onClient("friskPlayer", (player, recId) => {
    var rec = alt.Player.getBySqlId(recId);
    if (!rec) return player.utils.error(`Гражданин не найден!`);
    var dist = alt.Player.dist(player.pos, rec.pos);
    if (dist > Config.maxInteractionDist) return player.utils.error(`Гражданин далеко!`);
    if (!alt.factions.isLegalFaction(player.faction)) return player.utils.error(`Вы не сотрудник порядка!`);
    let drugs = 0, weapons = 0;
    // Наркотики    player.utils.error(`Наркотики${drugs > 0 ? `: ${drugs}`:` не обнаружены`}`);
    let items = rec.inventory.getArrayByItemId([55, 56, 57, 58]);
    for (let key in items) drugs += items[key].params.count;
    if (drugs > 0) player.utils.error(`Наркотики: ${drugs}г.`);
    else player.utils.success(`Наркотики не обнаружены`);
    // Оружие
    let weapon_items = rec.inventory.getArrayWeapons();

    for (let key in weapon_items) {
        let weapon = weapon_items[key];
        player.utils.error(`Оружие: ${alt.inventory.getItem(weapon.itemId).name}`);
        weapons++;
    }

    if (weapons < 1) player.utils.success(`Оружие не обнаружено`);

    rec.utils.error(`${player.getSyncedMeta("name")} произвёл обыск`);
});

alt.onClient("clearFrisk", (player, recId) => {
    var rec = alt.Player.getBySqlId(recId);
    if (!rec) return player.utils.error(`Гражданин не найден!`);
    var dist = alt.Player.dist(player.pos, rec.pos);
    if (dist > Config.maxInteractionDist) return player.utils.error(`Гражданин далеко!`);
    if (!alt.factions.isLegalFaction(player.faction)) return player.utils.error(`Вы не сотрудник порядка!`);
    if (rec.clearingFrisk) return player.utils.error(`У гражданина уже проводят изъятие, подождите!`);
    rec.clearingFrisk = true;
    let drugs = 0, weapons = 0;
    // Наркотики
    let items = rec.inventory.getArrayByItemId([55, 56,57,58]);
    for (let key in items) {
        let new_drug = items[key];
        drugs += new_drug.params.count;
        rec.inventory.delete(new_drug.id, (e) => {
            if (e) return player.utils.error(e);
            player.inventory.add(new_drug.itemId, new_drug.params, {}, (e) => {
                if (e) return player.utils.error(e);
            });
        });
    }
    if (drugs > 0) player.utils.error(`Вы изъяли ${drugs}г. наркотиков`);
    // Оружие
    let weapon_items = rec.inventory.getArrayWeapons();
    let count = Object.keys(weapon_items).length;
    for (let key in weapon_items) {
        let weapon = weapon_items[key];
        weapons++;
        player.utils.error(`Вы изъяли оружие: ${alt.inventory.getItem(weapon.itemId).name}`);
        rec.inventory.delete(weapon.id, (e) => {
            if (e) {
                delete rec.clearingFrisk;
                return player.utils.error(e);
            }
            if (weapons == count) delete rec.clearingFrisk;
            player.inventory.add(weapon.itemId, weapon.params, {}, (e) => {
                if (e) return player.utils.error(e);
            });
        });
    }
    if (weapons < 1 && drugs < 1) {
        delete rec.clearingFrisk;
        player.utils.success(`У гражданина нет предметов для изъятия!`);
        return;
    }

    rec.utils.error(`${player.getSyncedMeta("name")} изъял у вас нелегальные предметы!`);
});

alt.onClient("putIntoVehicle", (player, recId, vehId) => {
    //debug(`putIntoVehicle ${recId} ${vehId}`);
    var rec = alt.Player.getBySqlId(recId);
    if (!rec) return player.utils.error(`Гражданин не найден!`);
    if (rec.vehicle) return player.utils.error(`Гражданин за рулем!`);
    //var dist = alt.Player.dist(player.pos, rec.pos);
    //if (dist > Config.maxInteractionDist) return player.utils.error(`Гражданин далеко!`);
    if (!alt.factions.isLegalFaction(player.faction) && rec.hasCuffs) return player.utils.error(`Вы не сотрудник порядка!`);
    if (!rec.hasCuffs && !rec.hasTie ) return player.utils.error(`Гражданин не в наручниках!`);
    
    var veh = alt.Vehicle.at(vehId);
    if (!veh) return player.utils.error(`Авто не найдено!`);
    var freeSeat = [3, 4];
    var occupants = [];

    alt.Player.all.forEach((rec) => {
        if (rec.vehicle && rec.vehicle === veh) occupants.push(rec);
    });

    for (var i = 0; i < occupants.length; i++) {
        var occ = occupants[i];
        var index = freeSeat.indexOf(occ.seat);
        if (index != -1) freeSeat.splice(index, 1);
    }

    if (freeSeat.length == 0) return player.utils.error(`В машине нет места!`);
    alt.emitClient(rec, `stopFollowToPlayer`);
    alt.emitClient(rec, `Vehicle::putInto`, veh, freeSeat[0]);
    player.utils.success(`${rec.getSyncedMeta("name")} в машине!`);
    rec.utils.success(`${player.getSyncedMeta("name")} посадил Вас в машину!`);
});

alt.onClient("removeFromVehicle", (player, recName) => {
    //debug(`removeFromVehicle: ${recName}`);
    var rec = alt.Player.getByName(recName);
    if (!rec) return player.utils.error(`Гражданин не найден!`);

    if (rec.vehicle) alt.emitClient(rec, `Vehicle::leave`, rec.vehicle);

    rec.utils.success(`${player.getSyncedMeta("name")} вытащил Вас!`);
    player.utils.success(`${rec.getSyncedMeta("name")} вытащен`);
});

alt.onClient("removeThisVehicle", (player, rec) => {
    //debug(`removeFromVehicle: ${recName}`);
    if (!rec) return player.utils.error(`Гражданин не найден!`);

    if (rec.vehicle) alt.emitClient(rec, `Vehicle::leave`, rec.vehicle);

    rec.utils.success(`${player.getSyncedMeta("name")} вытащил Вас!`);
    player.utils.success(`${rec.getSyncedMeta("name")} вытащен`);
});

alt.onClient("arrestPlayer", (player, recId) => {
    var rec = alt.Player.getBySqlId(recId);
    if (!rec) return player.utils.error(`Гражданин не найден!`);
    if (!alt.factions.isPoliceFaction(player.faction) && !alt.factions.isFibFaction(player.faction)) return player.utils.error(`Вы не сотрудник порядка!`);
    if (rec.arrestTime > 0) {
        rec.utils.clearArrest();
        return rec.utils.success(`${player.getSyncedMeta("name")} выпустил Вас на свободу`);
    }
    if (rec.wanted < 1) return player.utils.error(`Гражданин не является преступником!`);

    var dist = alt.Player.dist(player.pos, alt.policeCells[0]);
    var cellIndex = 0;
    for (var i = 1; i < alt.policeCells.length; i++) {
        if (alt.Player.dist(player.pos, alt.policeCells[i]) < dist) {
            dist = alt.Player.dist(player.pos, alt.policeCells[i]);
            cellIndex = i;
        }
    }
    if (dist > 5) return player.utils.error(`Вы должны находиться у камеры!`);
    if (rec.hasCuffs) {
        var params = {
            faction: player.faction,
            owner: player.sqlId
        };
        player.inventory.add(28, params, {}, (e) => {
            if (e) return player.utils.error(e);
        });
    }

    DB.Query("UPDATE characters SET arrestCell=? WHERE id=?", [cellIndex, rec.sqlId]);

    rec.utils.doArrest(cellIndex, rec.wanted * (alt.economy["wanted_arrest_time"].value / 1000));
    rec.utils.setWanted(0);

    rec.utils.success(`${player.getSyncedMeta("name")} посадил Вас в тюрьму!`);

    player.utils.setMoney(player.money + alt.economy["police_arrest_pay"].value);
    player.utils.success(`Вы посадили ${rec.getSyncedMeta("name")}!`);
    alt.logs.addLog(`${player.getSyncedMeta("name")} арестовал игрока ${rec.getSyncedMeta("name")}. Время ареста: ${rec.wanted * (alt.economy["wanted_arrest_time"].value / 1000)}`, 'faction', player.account.id, player.sqlId, { faction: player.faction, time: rec.wanted * (alt.economy["wanted_arrest_time"].value / 1000) });
    alt.logs.addLog(`${rec.getSyncedMeta("name")} был арестован игроком ${player.getSyncedMeta("name")}. Время ареста: ${rec.wanted * (alt.economy["wanted_arrest_time"].value / 1000)}`, 'faction', rec.account.id, rec.sqlId, { faction: rec.faction, time: rec.wanted * (alt.economy["wanted_arrest_time"].value / 1000) });
});

alt.onClient("police.lockVeh", (player, vehId) => {
    var veh = alt.Vehicle.at(vehId);
    if (!veh) return player.utils.error(`Авто не найдено!`);
    if (!alt.factions.isPoliceFaction(player.faction) && !alt.factions.isFibFaction(player.faction)) return player.utils.error(`Вы не сотрудник порядка!`);
    if (veh.lockState !== 1) return player.utils.error(`Авто не требуется вскрывать!`);
    if (veh.isSmuggling) return player.utils.error(`Нельзя вскрыть авто диллера!`);
    veh.lockState = 2;
    player.utils.success(`Авто вскрыто!`);
});

alt.onClient("item.useDrugs", (player, sqlId) => {
    var drugs = player.inventory.getItem(sqlId);
    if (!drugs) return player.utils.error(`Наркотик не найден!`);
    var drugsIds = [55, 56, 57, 58];
    var effects = ["DrugsDrivingOut", "DrugsMichaelAliensFightOut", "DrugsTrevorClownsFightOut", "DrugsTrevorClownsFightOut"];
    var index = drugsIds.indexOf(drugs.itemId);
    if (index == -1) return player.utils.error(`Предмет не является наркотиком!`);
    if (!drugs.params.count) {
        player.inventory.delete(sqlId);
        return player.utils.error(`Осталось 0 грамм!`);
    }

    var count = Math.clamp(drugs.params.count, 1, 5);
    player.health = Math.clamp(player.health + count * 115, 115, 200);
    drugs.params.count -= count;
    if (drugs.params.count <= 0) player.inventory.delete(sqlId);
    else player.inventory.updateParams(sqlId, drugs);

    alt.emitClient(player, "effect", effects[index], count * alt.economy["drugs_effect_time"].value);
    player.utils.success(`Вы употребили наркотик!`);
});

alt.onClient("item.useSmoke", (player, sqlId) => {
    var smoke = player.inventory.getItem(sqlId);
    if (!smoke) return player.utils.error(`Сигарета не найдена!`);
    player.health = Math.clamp(player.health, 102, 200);
    player.inventory.delete(sqlId);
    alt.emitClient(player, "effect", "DrugsDrivingOut", 10000);
    if (player.vehicle) return;
    alt.emitClient(player, `playAnim`, player.sqlId, 31);
});

alt.onClient("item.takeSmoke", (player, sqlId) => {
    var smokeBox = player.inventory.getItem(sqlId);
    if (!smokeBox) return player.utils.error(`Пачка не найдена!`);
    if (smokeBox.params.count <= 0) return player.utils.error(`Пачка пустая!`);

    player.inventory.add(62, {}, {}, (e) => {
        if (e) return player.utils.error(e);

        smokeBox.params.count--;
        player.inventory.updateParams(sqlId, smokeBox);
    });
});

alt.onClient("item.useHealth", (player, sqlId) => {
    var item = player.inventory.getItem(sqlId);
    if (!item || item.itemId != 25) return player.utils.error(`Пластырь не найден!`);
    if (player.health + item.params.count > 200) return player.utils.error(`Вы здоровы!`);
    if (player.getSyncedMeta("knockDown")) return player.utils.error(`Вы не в состоянии вылечиться самостоятельно!`);
    player.health = Math.clamp(player.health + item.params.count, 115, 200);
    player.inventory.delete(sqlId);
    player.utils.success(`Пластырь использован!`);
    // TODO: Анимку использования пластыря.
});

/* Конвертирует дома в простые данные для документов. */
function convertHousesToDocHouses(houses) {
    var data = [];
    houses.forEach((house) => {
        data.push({
            id: house.id,
            position: house.pos
        });
    });

    return data;
}
