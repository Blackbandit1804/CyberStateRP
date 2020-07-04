alt.onClient("armyStorage.takeClothes", (player, index) => {
    if (!player.colshape || !player.colshape.armyStorage) return player.utils.error(`Вы не у склада Army!`);
    if (!alt.factions.isArmyFaction(player.faction)) return player.utils.error(`Вы не являетесь военным!`);

    var faction = alt.factions.getBySqlId(player.faction);
    if (!faction) return player.utils.error(`Организация с ID: ${player.faction} не найдена!`);
    var army = faction.name;

    if (faction.products < alt.economy["army_mainclothes_products"].value) return player.utils.error(`Недостаточно боеприпасов!`);
    var hats = player.inventory.getArrayByItemId(6);
    var tops = player.inventory.getArrayByItemId(7);
    var legs = player.inventory.getArrayByItemId(8);
    var feets = player.inventory.getArrayByItemId(9);
    var masks = player.inventory.getArrayByItemId(14);
    var glasses = player.inventory.getArrayByItemId(1);

    for (var key in hats)
        if (alt.factions.isArmyFaction(hats[key].params.faction)) return player.utils.error(`У Вас уже есть головной убор ${army}!`);
    for (var key in tops)
        if (alt.factions.isArmyFaction(tops[key].params.faction)) return player.utils.error(`У Вас уже есть рубашка ${army}!`);
    for (var key in legs)
        if (alt.factions.isArmyFaction(legs[key].params.faction)) return player.utils.error(`У Вас уже есть брюки ${army}!`);
    for (var key in feets)
        if (alt.factions.isArmyFaction(feets[key].params.faction)) return player.utils.error(`У Вас уже есть ботинки ${army}!`);
    for (var key in masks)
        if (alt.factions.isArmyFaction(masks[key].params.faction)) return player.utils.error(`У Вас уже есть шлем ${army}!`);
    for (var key in glasses)
        if (alt.factions.isArmyFaction(glasses[key].params.faction)) return player.utils.error(`У Вас уже есть очки ${army}!`);

    alt.fullDeleteItemsByParams(6, ["faction", "owner"], [player.faction, player.sqlId]);
    alt.fullDeleteItemsByParams(7, ["faction", "owner"], [player.faction, player.sqlId]);
    alt.fullDeleteItemsByParams(8, ["faction", "owner"], [player.faction, player.sqlId]);
    alt.fullDeleteItemsByParams(9, ["faction", "owner"], [player.faction, player.sqlId]);
    alt.fullDeleteItemsByParams(10, ["faction", "owner"], [player.faction, player.sqlId]);
    alt.fullDeleteItemsByParams(2, ["faction", "owner"], [player.faction, player.sqlId]);
    alt.fullDeleteItemsByParams(14, ["faction", "owner"], [player.faction, player.sqlId]);
    alt.fullDeleteItemsByParams(1, ["faction", "owner"], [player.faction, player.sqlId]);

    var hatParams, topParams, legsParams, feetsParams, masksParams, glassesParams;
    var f = player.faction - 6;
    if (player.sex == 1) {
        hatParams = {
            sex: 1,
            variation: [
                [-1, 117, 107, 107, 39, -1, -1, -1],
                [124, 114, 114, 113, -1]
            ][f][index],
            texture: [
                [0, 13, 3, 0, 0, 0, 0, 0],
                [10, 4, 9, 4, -1]
            ][f][index]
        };
        topParams = {
            sex: 1,
            torso: [
                [0, 136, 5, 5, 5, 4, 20, 42],
                [60, 1, 94, 1, 36]
            ][f][index],
            tTexture: [
                [-1, 5, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1],
            ][f][index],
            variation: [
                [208, 50, 239, 239, 251, 248, 209, 209],
                [220, 192, 192, 221, 228]
            ][f][index],
            texture: [
                [4, 0, 3, 0, 1, 0, 11, 10],
                [11, 0, 0, 10, 0]
            ][f][index],
            undershirt: [
                [-1, -1, -1, -1, -1, -1, -1, -1],
                [-1, 101, 101, 130, -1]
            ][f][index],
            uTexture: [
                [-1, -1, -1, -1, -1, -1, -1, -1],
                [0, 10, 10, 0, 0]
            ][f][index],
        };
        legsParams = {
            sex: 1,
            variation: [
                [86, 86, 86, 86, 98, 98, 86, 86],
                [86, 86, 86, 86, 92]
            ][f][index],
            texture: [
                [4, 5, 3, 0, 1, 1, 11, 10],
                [16, 10, 10, 10, 0]
            ][f][index]
        };
        feetsParams = {
            sex: 1,
            variation: [
                [35, 72, 24, 24, 24, 60, 60, 60],
                [50, 27, 27, 27, 51]
            ][f][index],
            texture: [
                [0, 5, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0]
            ][f][index]
        };
        masksParams = {
            sex: 1,
            variation: [
                [-1, 114, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1]
            ][f][index],
            texture: [
                [-1, 9, -1, -1, -1, -1, -1, -1],
                [0, 0, 0, 0, 0]
            ][f][index]
        };
        glassesParams = {
            sex: 1,
            variation: [
                [-1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1]
            ][f][index],
            texture: [
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0]
            ][f][index]
        };
    } else {
        hatParams = {
            sex: 0,
            variation: [
                [-1, -1, 106, 106, 38, -1, -1, -1],
                [123, 113, 113, 113, -1]
            ][f][index],
            texture: [
                [0, 0, 0, 0, 0, 0, 0, 0],
                [12, 0, 7, 6, 0]
            ][f][index]
        };
        topParams = {
            sex: 0,
            torso: [
                [14, 3, 14, 14, 14, 20, 20, 42],
                [60, 67, 57, 31, 67]
            ][f][index],
            variation: [
                [212, 54, 212, 212, 213, 212, 213, 213],
                [230, 194, 194, 224, 232]
            ][f][index],
            texture: [
                [4, 0, 0, 0, 3, 0, 11, 10],
                [17, 0, 10, 10, 10]
            ][f][index],
            undershirt: [
                [-1, -1, -1, -1, -1, -1, -1, -1],
                [-1, 127, 136, -1, -1]
            ][f][index],
            uTexture: [
                [-1, -1, -1, -1, -1, -1, -1, -1],
                [0, 10, 10, 0, 0]
            ][f][index],
        };
        legsParams = {
            sex: 0,
            variation: [
                [90, 89, 89, 89, 89, 92, 89, 89],
                [89, 89, 89, 89, 86]
            ][f][index],
            texture: [
                [4, 5, 3, 0, 3, 0, 11, 10],
                [15, 10, 10, 10, 8]
            ][f][index]
        };
        feetsParams = {
            sex: 0,
            variation: [
                [36, 62, 55, 55, 55, 55, 55, 55],
                [25, 77, 26, 25, 70]
            ][f][index],
            texture: [
                [0, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0]
            ][f][index]
        };
        masksParams = {
            sex: 0,
            variation: [
                [-1, 114, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1]
            ][f][index],
            texture: [
                [0, 9, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0]
            ][f][index]
        };
        glassesParams = {
            sex: 0,
            variation: [
                [-1, -1, -1, -1, 27, -1, -1, -1],
                [-1, -1, -1, -1, -1]
            ][f][index],
            texture: [
                [0, 0, 0, 0, 4, 0, 0, 0],
                [0, 0, 0, 0, 0]
            ][f][index]
        };
    }
    if (topParams.undershirt == -1) delete topParams.undershirt;
    if (topParams.uTexture == -1) delete topParams.uTexture;
    if (topParams.tTexture == -1) delete topParams.tTexture;

    hatParams.faction = player.faction;
    topParams.faction = player.faction;
    legsParams.faction = player.faction;
    feetsParams.faction = player.faction;
    masksParams.faction = player.faction;
    glassesParams.faction = player.faction;

    topParams.rows = 5;
    topParams.cols = 5;
    legsParams.rows = 3;
    legsParams.cols = 3;
    topParams.name = army;
    legsParams.name = army;

    hatParams.owner = player.sqlId;
    topParams.owner = player.sqlId;
    legsParams.owner = player.sqlId;
    feetsParams.owner = player.sqlId;
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
    if (masksParams.variation != -1) player.inventory.add(14, masksParams, {}, (e) => {
        if (e) return alt.log(e);
    });
    if (glassesParams.variation != -1) player.inventory.add(1, glassesParams, {}, (e) => {
        if (e) return alt.log(e);
    });

    player.utils.success(`Вам выдана форма ${army}!`);

    faction.setProducts(faction.products - alt.economy["army_mainclothes_products"].value);
    alt.logs.addLog(`${player.getSyncedMeta("name")} взял со склада Форма ${army}`, 'stuff', player.account.id, player.sqlId, {
        faction: player.faction,
        count: 1,
        item: army
    });
});

alt.onClient("armyStorage.takeArmour", (player) => {
    if (!player.colshape || !player.colshape.armyStorage) return player.utils.error(`Вы не у склада Army!`);
    if (!alt.factions.isArmyFaction(player.faction)) return player.utils.error(`Вы не являетесь военным!`);

    var faction = alt.factions.getBySqlId(player.faction);
    if (!faction) return player.utils.error(`Организация с ID: ${player.faction} не найдена!`);
    var army = faction.name;

    if (faction.products < alt.economy["army_armour_products"].value) return player.utils.error(`Недостаточно боеприпасов!`);
    var items = player.inventory.getArrayByItemId(3);

    for (var sqlId in items)
        if (alt.factions.isArmyFaction(items[sqlId].params.faction)) return player.utils.error(`У Вас уже есть бронежилет ${army}!`);

    alt.fullDeleteItemsByParams(3, ["faction", "owner"], [player.faction, player.sqlId]);

    var params;
    if (player.sex == 1) {
        params = {
            variation: 16,
            texture: 2
        };
    } else {
        params = {
            variation: 18,
            texture: 2
        };
    }

    params.faction = player.faction;
    params.owner = player.sqlId;
    params.armour = 100;
    params.sex = player.sex;

    player.inventory.add(3, params, {}, (e) => {
        if (e) return player.utils.error(e);
        player.utils.success(`Вам выдан бронежилет ${army}!`);
        faction.setProducts(faction.products - alt.economy["army_armour_products"].value);
        alt.logs.addLog(`${player.getSyncedMeta("name")} взял со склада Бронежилет Army`, 'stuff', player.account.id, player.sqlId, {
            faction: player.faction,
            count: 1
        });
    });
});

alt.onClient("armyStorage.takeGun", (player, index) => {
    if (!player.colshape || !player.colshape.armyStorage) return player.utils.error(`Вы не у склада Army!`);
    if (!alt.factions.isArmyFaction(player.faction)) return player.utils.error(`Вы не являетесь военным!`);

    var faction = alt.factions.getBySqlId(player.faction);
    if (!faction) return player.utils.error(`Организация с ID: ${player.faction} не найдена!`);

    if (player.rank < 3) return player.utils.error(`Оружие выдается с 3 ранга!`);

    if (faction.products < alt.economy["army_armour_products"].value) return player.utils.error(`Недостаточно боеприпасов!`);

    var itemIds = [20, 21, 22, 23];
    var weaponIds = ["weapon_combatpistol", "weapon_pumpshotgun", "weapon_carbinerifle", "weapon_sniperrifle"];
    index = Math.clamp(index, 0, itemIds.length - 1);
    var itemId = itemIds[index];

    var guns = player.inventory.getArrayByItemId(itemId);
    if (Object.keys(guns).length > 0) return player.utils.error(`У Вас уже есть ${alt.inventory.getItem(itemId).name}!`);

    alt.fullDeleteItemsByParams(itemId, ["faction", "owner"], [player.faction, player.sqlId]);
    var params = {
        weaponHash: jhash(weaponIds[index]),
        ammo: 0,
        faction: player.faction,
        owner: player.sqlId
    };

    player.inventory.add(itemId, params, {}, (e) => {
        if (e) return player.utils.error(e);
        player.utils.success(`Вам выдано оружие ${alt.inventory.getItem(itemId).name}!`);
        faction.setProducts(faction.products - alt.economy["army_armour_products"].value);
        alt.emit('army.getInfoWareHouse');
        alt.logs.addLog(`${player.getSyncedMeta("name")} взял со склада оружие ${alt.inventory.getItem(itemId).name}`, 'stuff', player.account.id, player.sqlId, {
            faction: player.faction,
            item: alt.inventory.getItem(itemId).name,
            count: 1
        });
    });
});

alt.onClient("armyStorage.takeAmmo", (player, index, ammo) => {
    //debug(`policeStorage.takeAmmo: ${index} ${ammo}`);
    if (!player.colshape || !player.colshape.armyStorage) return player.utils.error(`Вы не у склада Army!`);
    if (!alt.factions.isArmyFaction(player.faction)) return player.utils.error(`Вы не являетесь военным!`);

    var faction = alt.factions.getBySqlId(player.faction);
    if (!faction) return player.utils.error(`Организация с ID: ${player.faction} не найдена!`);

    var itemIds = [37, 38, 40, 39];
    index = Math.clamp(index, 0, itemIds.length - 1);
    var products = [0, 1, 3, 2];
    products = alt.economy[`ammo_${products[index]}_products_price`].value * ammo;
    if (faction.products < products) return player.utils.error(`Недостаточно боеприпасов!`);

    // alt.fullDeleteItemsByParams(itemIds[index], ["faction", "owner"], [player.faction, player.sqlId]);
    var params = {
        ammo: ammo,
        faction: player.faction,
        owner: player.sqlId
    };
    player.inventory.add(itemIds[index], params, {}, (e) => {
        if (e) return player.utils.error(e);
        player.utils.success(`Вам выданы ${alt.inventory.getItem(itemIds[index]).name}!`);
        faction.setProducts(faction.products - products);
        alt.emit('army.getInfoWareHouse');
        alt.logs.addLog(`${player.getSyncedMeta("name")} взял со склада ${alt.inventory.getItem(itemIds[index]).name}. Количество: ${ammo}`, 'stuff', player.account.id, player.sqlId, {
            faction: player.faction,
            item: alt.inventory.getItem(itemIds[index]).name,
            count: ammo
        });
    });
});

alt.onClient("armyStorage.takeItem", (player, index) => {
    if (!player.colshape || !player.colshape.armyStorage) return player.utils.error(`Вы не у склада Army!`);
    if (!alt.factions.isArmyFaction(player.faction)) return player.utils.error(`Вы не являетесь военным!`);

    var faction = alt.factions.getBySqlId(player.faction);
    if (!faction) return player.utils.error(`Организация с ID: ${player.faction} не найдена!`);

    if (faction.products < alt.economy["army_armour_products"].value) return player.utils.error(`Недостаточно боеприпасов!`);

    var itemIds = [60, 27, 28];
    index = Math.clamp(index, 0, itemIds.length - 1);
    var itemId = itemIds[index];

    var items = player.inventory.getArrayByItemId(itemId);
    if (Object.keys(items).length > 0) return player.utils.error(`У Вас уже есть ${alt.inventory.getItem(itemId).name}!`);

    alt.fullDeleteItemsByParams(itemId, ["faction", "owner"], [player.faction, player.sqlId]);
    var params = {
        faction: player.faction,
        owner: player.sqlId
    };

    player.inventory.add(itemId, params, {}, (e) => {
        if (e) return player.utils.error(e);
        player.utils.success(`Вам выдано ${alt.inventory.getItem(itemId).name}!`);
        faction.setProducts(faction.products - alt.economy["army_armour_products"].value);
        alt.emit('army.getInfoWareHouse');
        alt.logs.addLog(`${player.getSyncedMeta("name")} взял со склада ${alt.inventory.getItem(itemId).name}`, 'stuff', player.account.id, player.sqlId, {
            faction: player.faction,
            item: alt.inventory.getItem(itemId).name,
            count: 1
        });
    });
});

alt.onClient("army.transferProducts", (player, recId) => {
    var rec = alt.Player.getBySqlId(recId);
    if (!rec) return player.utils.error(`Гражданин не найден!`);
    var dist = alt.Player.dist(player.pos, rec.pos);
    if (dist > Config.maxInteractionDist) return player.utils.error(`Гражданин далеко!`);
    if (rec.faction != player.faction) return player.utils.error(`Гражданин не в Вашей организации!`);
    var model = player.getSyncedMeta("attachedObject");
    var haveProducts = (model == "prop_box_ammo04a" || model == "ex_office_swag_pills4");
    if (!haveProducts) return player.utils.error(`Вы не имеете товар!`);

    var recModel = rec.getSyncedMeta("attachedObject");
    var haveProducts = (recModel == "prop_box_ammo04a" || recModel == "ex_office_swag_pills4");
    if (haveProducts) return player.utils.error(`${rec.getSyncedMeta("name")} уже имеет товар!`);

    player.utils.putObject();
    rec.utils.takeObject(model);
});

alt.onClient("army.getInfoWareHouse", (player) => {
    if (!alt.factions.isArmyFaction(player.faction)) return player.utils.error(`Вы не являетесь военным!`);
    var army = alt.factions.getBySqlId(6);
    var navy = alt.factions.getBySqlId(7);
    alt.emitClient(player, `tablet.army.setInfoWareHouse`, {
        warehouse_1: army.products + '/' + army.maxProducts,
        warehouse_2: navy.products + '/' + navy.maxProducts
    });
});

alt.onClient("army.advert", (player, text) => {
    if (!alt.factions.isArmyFaction(player.faction)) return player.utils.error(`Вы не являетесь военным!`);
    // TODO: Уведомление всем игрокам, у которых есть телефон.
    text = text.substr(0, 100);
    alt.Player.all.forEach((rec) => {
        if (rec.sqlId) alt.emitClient(rec, "chat.custom.push", `[ARMY] ${player.getSyncedMeta("name")}: ${text}`, "#0fff17");
    });
});

