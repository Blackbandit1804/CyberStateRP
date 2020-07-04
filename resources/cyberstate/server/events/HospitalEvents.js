alt.onClient("hospitalStorage.takeClothes", (player, index) => {
    if (!player.colshape || !player.colshape.hospitalStorage) return player.utils.error(`Вы не у склада FIB!`);
    var hospitalStorageMarker = player.colshape.hospitalStorage;
    if (!alt.factions.isHospitalFaction(player.faction)) return player.utils.error(`Вы не являетесь секретным агентом!`);

    var faction = alt.factions.getBySqlId(player.faction);
    if (!faction) return player.utils.error(`Организация с ID: ${player.faction} не найдена!`);
    var hospital = faction.name;

    if (faction.products < alt.economy["police_mainclothes_products"].value) return player.utils.error(`Недостаточно боеприпасов!`);
    var hats = player.inventory.getArrayByItemId(6);
    var tops = player.inventory.getArrayByItemId(7);
    var legs = player.inventory.getArrayByItemId(8);
    var feets = player.inventory.getArrayByItemId(9);
    var ears = player.inventory.getArrayByItemId(10);
    var ties = player.inventory.getArrayByItemId(2);
    var masks = player.inventory.getArrayByItemId(14);
    var glasses = player.inventory.getArrayByItemId(1);

    for (var key in hats)
        if (alt.factions.isHospitalFaction(hats[key].params.faction)) return player.utils.error(`У Вас уже есть головной убор ${hospital}!`);
    for (var key in tops)
        if (alt.factions.isHospitalFaction(tops[key].params.faction)) return player.utils.error(`У Вас уже есть рубашка ${hospital}!`);
    for (var key in legs)
        if (alt.factions.isHospitalFaction(legs[key].params.faction)) return player.utils.error(`У Вас уже есть брюки ${hospital}!`);
    for (var key in feets)
        if (alt.factions.isHospitalFaction(feets[key].params.faction)) return player.utils.error(`У Вас уже есть ботинки ${hospital}!`);
    for (var key in ears)
        if (alt.factions.isHospitalFaction(ears[key].params.faction)) return player.utils.error(`У Вас уже есть наушники ${hospital}!`);
    for (var key in ties)
        if (alt.factions.isHospitalFaction(ties[key].params.faction)) return player.utils.error(`У Вас уже есть аксессуар ${hospital}!`);
    for (var key in masks)
        if (alt.factions.isHospitalFaction(masks[key].params.faction)) return player.utils.error(`У Вас уже есть шлем ${hospital}!`);
    for (var key in glasses)
        if (alt.factions.isHospitalFaction(glasses[key].params.faction)) return player.utils.error(`У Вас уже есть очки ${hospital}!`);

    alt.fullDeleteItemsByParams(6, ["faction", "owner"], [player.faction, player.sqlId]);
    alt.fullDeleteItemsByParams(7, ["faction", "owner"], [player.faction, player.sqlId]);
    alt.fullDeleteItemsByParams(8, ["faction", "owner"], [player.faction, player.sqlId]);
    alt.fullDeleteItemsByParams(9, ["faction", "owner"], [player.faction, player.sqlId]);
    alt.fullDeleteItemsByParams(10, ["faction", "owner"], [player.faction, player.sqlId]);
    alt.fullDeleteItemsByParams(2, ["faction", "owner"], [player.faction, player.sqlId]);
    alt.fullDeleteItemsByParams(14, ["faction", "owner"], [player.faction, player.sqlId]);
    alt.fullDeleteItemsByParams(1, ["faction", "owner"], [player.faction, player.sqlId]);

    var hatParams, topParams, legsParams, feetsParams, earsParams, tiesParams, masksParams, glassesParams;
    if (player.sex == 1) {
        hatParams = {
            sex: 1,
            variation: [-1, -1][index],
            texture: [0, 0][index]
        };
        topParams = {
            sex: 1,
            torso: [90, 85][index],
            variation: [249, 250][index],
            texture: [0, 0][index],
            undershirt: [-1, -1][index],
        };
        legsParams = {
            sex: 1,
            variation: [96, 96][index],
            texture: [0, 0][index]
        };
        feetsParams = {
            sex: 1,
            variation: [8, 7][index],
            texture: [0, 0][index]
        };
        earsParams = {
            sex: 1,
            variation: [-1, -1][index],
            texture: [0, 0][index]
        };
        tiesParams = {
            sex: 1,
            variation: [126, 0][index],
            texture: [0, 0][index]
        };
        masksParams = {
            sex: 1,
            variation: [-1, -1][index],
            texture: [0, 0][index]
        };
        glassesParams = {
            sex: 1,
            variation: [-1, -1][index],
            texture: [0, 0][index]
        };
    } else {
        hatParams = {
            sex: 0,
            variation: [-1, -1][index],
            texture: [0, 0][index]
        };
        topParams = {
            sex: 0,
            torso: [98, 98][index],
            variation: [250, 283][index],
            texture: [1, 0][index]
        };
        legsParams = {
            sex: 0,
            variation: [99, 99][index],
            texture: [0, 0][index]
        };
        feetsParams = {
            sex: 0,
            variation: [19, 19][index],
            texture: [0, 0][index]
        };
        earsParams = {
            sex: 0,
            variation: [-1, -1][index],
            texture: [0, 0][index]
        };
        tiesParams = {
            sex: 0,
            variation: [-1, 96][index],
            texture: [0, 0][index]
        };
        masksParams = {
            sex: 0,
            variation: [-1, -1][index],
            texture: [0, 0][index]
        };
        glassesParams = {
            sex: 0,
            variation: [-1, -1][index],
            texture: [0, 0][index]
        };
    }
    if (topParams.undershirt == -1) delete topParams.undershirt;

    hatParams.faction = player.faction;
    topParams.faction = player.faction;
    legsParams.faction = player.faction;
    feetsParams.faction = player.faction;
    earsParams.faction = player.faction;
    tiesParams.faction = player.faction;
    masksParams.faction = player.faction;
    glassesParams.faction = player.faction;

    topParams.rows = 5;
    topParams.cols = 5;
    legsParams.rows = 3;
    legsParams.cols = 3;
    topParams.name = hospital;
    legsParams.name = hospital;

    hatParams.owner = player.sqlId;
    topParams.owner = player.sqlId;
    legsParams.owner = player.sqlId;
    feetsParams.owner = player.sqlId;
    earsParams.owner = player.sqlId;
    tiesParams.owner = player.sqlId;
    masksParams.owner = player.sqlId;
    glassesParams.owner = player.sqlId;

    var response = (e) => {
        if (e) player.utils.error(e);
    };

    if (hatParams.variation != -1) player.inventory.add(6, hatParams, {}, (e) => {
        if (e) return alt.log(e);
    });
    if (topParams.variation != -1) player.inventory.add(7, topParams, {}, (e) => {
        if (e) return alt.log(e);
    });
    if (legsParams.variation != -1) player.inventory.add(8, legsParams, {}, (e) => {
        if (e) return alt.log(e);
    });
    if (feetsParams.variation != -1) player.inventory.add(9, feetsParams, {}, (e) => {
        if (e) return alt.log(e);
    });
    if (earsParams.variation != -1) player.inventory.add(10, earsParams, {}, (e) => {
        if (e) return alt.log(e);
    });
    if (tiesParams.variation != -1) player.inventory.add(2, tiesParams, {}, (e) => {
        if (e) return alt.log(e);
    });
    if (masksParams.variation != -1) player.inventory.add(14, masksParams, {}, (e) => {
        if (e) return alt.log(e);
    });
    if (glassesParams.variation != -1) player.inventory.add(1, glassesParams, {}, (e) => {
        if (e) return alt.log(e);
    });

    player.utils.success(`Вам выдана форма ${hospital}!`);


    faction.setProducts(faction.products - alt.economy["police_mainclothes_products"].value);
    alt.logs.addLog(`${player.getSyncedMeta("name")} взял со склада Форма ${hospital}`, 'stuff', player.account.id, player.sqlId, {
        faction: player.faction,
        count: 1,
        item: hospital
    });
});

alt.onClient("hospitalStorage.takeItem", (player, index, count = 1) => {
    if (!player.colshape || !player.colshape.hospitalStorage) return player.utils.error(`Вы не у склада Hospital!`);
    if (!alt.factions.isHospitalFaction(player.faction)) return player.utils.error(`Вы не являетесь медиком!`);
    var faction = alt.factions.getBySqlId(player.faction);
    if (!faction) return player.utils.error(`Организация с ID: ${player.faction} не найдена!`);
    if (faction.products < alt.economy["hospital_mainclothes_products"].value * count) return player.utils.error(`Недостаточно принадлежностей!`);
    var itemIds = [24, 25, 63, 27];
    var healths = [100, 15, 0, 0];
    index = Math.clamp(index, 0, itemIds.length - 1);
    var itemId = itemIds[index];
    if (itemId == 63 || itemId == 27) {
        var haveItem = Object.keys(player.inventory.getArrayByItemId(itemId)).length > 0;
        if (haveItem) return player.utils.error(`У Вас уже есть ${alt.inventory.getItem(itemId).name}!`);
    }
    var params = {
        faction: player.faction,
        owner: player.sqlId
    };
    if (healths[index]) params.count = healths[index];
    player.inventory.add(itemId, params, {}, (e) => {
        if (e) return player.utils.error(e);
        player.utils.success(`Вам выдано ${alt.inventory.getItem(itemId).name}!`);
        faction.setProducts(faction.products - alt.economy["hospital_mainclothes_products"].value);
        alt.logs.addLog(`${player.getSyncedMeta("name")} взял со склада ${alt.inventory.getItem(itemId).name}`, 'stuff', player.account.id, player.sqlId, {
            faction: player.faction,
            item: alt.inventory.getItem(itemId).name,
            count: count
        });
    });
});

alt.onClient("hospital.health.createOffer", (player, recId) => {
    var rec = alt.Player.getBySqlId(recId);
    if (!rec) return player.utils.error(`Гражданин не найден!`);
    var dist = alt.Player.dist(player.pos, rec.pos);
    if (dist > Config.maxInteractionDist) return player.utils.error(`Гражданин далеко!`);
    if (!alt.factions.isHospitalFaction(player.faction)) return player.utils.error(`Вы не медик!`);
    if (rec.health >= 198) return player.utils.error(`${rec.getSyncedMeta("name")} полностью здоров!`);

    var items = player.inventory.getArrayByItemId([24, 25]);
    var count = Object.keys(items).length;
    if (!count) {
        alt.emitClient(player, `prompt.showByName`, "health_help");
        return player.utils.error(`Нет принадлежностей!`);
    }
    var health = 0;
    for (var sqlId in items) health += items[sqlId].params.count;
    if (health < parseInt(200 - rec.health)) return player.utils.error(`Недостаточно медикаментов!`);

    var price = parseInt((200 - rec.health) * alt.economy["hospital_health_price"].value);
    rec.offer = {
        medicId: player.sqlId,
        health: parseInt(200 - rec.health),
    };

    player.utils.success(`Вы предложили лечение`);
    rec.utils.success(`Получено предложение лечения`);
    alt.emitClient(rec, "choiceMenu.show", "accept_health", {
        name: player.getSyncedMeta("name"),
        price: price
    });
});

alt.onClient("hospital.health.agree", (player) => {
    if (!player.offer) return player.utils.error(`Предложение не найдено!`);

    var medic = alt.Player.getBySqlId(player.offer.medicId);
    if (!medic || !alt.factions.isHospitalFaction(medic.faction)) return player.utils.error(`Медик не найден!`);
    var dist = alt.Player.dist(player.pos, medic.pos);
    if (dist > Config.maxInteractionDist) return player.utils.error(`Медик слишком далеко!`);

    var items = medic.inventory.getArrayByItemId([24, 25]);
    var count = Object.keys(items).length;
    if (!count) {
        player.utils.error(`У медика нет принадлежностей!`);
        alt.emitClient(medic, `prompt.showByName`, "health_help");
        return medic.utils.error(`Нет принадлежностей!`);
    }

    if (player.health + player.offer.health > 200) {
        player.utils.error(`Вы не настолько больны!`);
        return medic.utils.error(`${player.getSyncedMeta("name")} не настолько болен!`);
    }
    var price = player.offer.health * alt.economy["hospital_health_price"].value;
    if (player.money - price < 0) {
        player.utils.error(`Необходимо ${price}$!`);
        return medic.utils.error(`${player.getSyncedMeta("name")} не имеет ${price}$!`);
    }

    var health = 0;
    for (var key in items) health += items[key].params.count;
    if (health < player.offer.health) return player.utils.error(`Недостаточно медикаментов!`);

    for (var key in items) {
        var item = items[key];
        var add = Math.clamp(item.params.count, 0, Math.ceil(200 - player.health));
        player.health += add;
        player.offer.health -= add;
        item.params.count -= add;
        if (item.params.count <= 0) medic.inventory.delete(item.id);
        else medic.inventory.updateParams(item.id, item);
        if (player.health >= 200 || player.offer.health <= 100) break;
    }

    player.utils.setMoney(player.money - price);
    medic.utils.setMoney(medic.money + price);

    delete player.offer;

    player.utils.success(`Вас вылечили!`);
    medic.utils.success(`Вы вылечили пострадавшего!`);
});

alt.onClient("hospital.health.cancel", (player) => {
    if (!player.offer) return player.utils.error(`Предложение не найдено!`);

    var medic = alt.Player.getBySqlId(player.offer.medicId);
    delete player.offer;
    player.utils.success(`Лечение отклонено`);
    if (!medic) return;
    delete medic.offer;

    medic.utils.info(`${player.getSyncedMeta("name")} отклонил лечение`);
});

alt.onClient("hospital.callTeamHelp", (player) => {
    // TODO: Вызов медиков.
});

alt.onClient("hospital.callPoliceHelp", (player) => {;
    // TODO: Вызов полиции.
});

alt.onClient("hospital.advert", (player, text) => {
    if (!alt.factions.isHospitalFaction(player.faction)) return player.utils.error(`Вы не сотрудник больницы!`);
    // TODO: Уведомление всем игрокам, у которых есть телефон.
    text = text.substr(0, 100);
    alt.Player.all.forEach((rec) => {
        if (rec.sqlId) alt.emitClient(rec, "chat.custom.push", `[LSMC] ${player.getSyncedMeta("name")}: ${text}`, "#0fff17");
    });
});

alt.on("hospital.addCall", (player, text) => {
    // TODO: Проверка на наличие мобилы.
    alt.Player.all.forEach((rec) => {
        if (alt.factions.isHospitalFaction(rec.faction)) {
            alt.emitClient(rec, `tablet.medic.addCall`, {
                id: player.sqlId,
                name: player.getSyncedMeta("name"),
                pos: player.pos,
                message: text
            });
        }
    });
    player.hospitalCallTime = new Date().getTime();
    player.utils.success(`Вызов отправлен!`);
});

alt.onClient("hospital.acceptCall", (player, playerId, x, y) => {
    if (!alt.factions.isHospitalFaction(player.faction)) return player.utils.error(`Вы не сотрудник больницы!`);
    var rec = alt.Player.getBySqlId(playerId);
    if (!rec) return player.utils.error(`Гражданин не найден!`);
    if (!rec.hospitalCallTime) return player.utils.error(`Вызов принят/отклонен другим медиком!`);

    alt.Player.all.forEach((rec) => {
        if (alt.factions.isHospitalFaction(rec.faction)) {
            alt.emitClient(rec, `tablet.medic.removeCall`, playerId);
            alt.emitClient(player, "setNewWaypoint", x, y);
        }
    });

    delete rec.hospitalCallTime;
    player.utils.success(`Вызов принят!`);
    rec.utils.success(`${player.getSyncedMeta("name")} принял Ваш вызов!`);
});

alt.onClient("hospital.respawn", (player) => {
    if (player.health > 115) return player.utils.error(`Вы здоровы!`);
    player.health = 0;
    player.setSyncedMeta("knockDown", false);
});
