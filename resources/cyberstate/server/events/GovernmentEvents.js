alt.onClient("goverStorage.takeArmour", (player) => {
    if (!player.colshape || !player.colshape.goverStorage) return player.utils.error(`Вы не у склада Правительства!`);
    if (!alt.factions.isGoverFaction(player.faction)) return player.utils.error(`Вы не работаете в Правительстве!`);

    var faction = alt.factions.getBySqlId(player.faction);
    if (!faction) return player.utils.error(`Организация с ID: ${player.faction} не найдена!`);
    var army = faction.name;

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
        player.utils.success(`Вам выдан бронежилет Правительства!`);
        alt.logs.addLog(`${player.getSyncedMeta("name")} взял со склада Бронежилет Правительства`, 'stuff', player.account.id, player.sqlId, {
            faction: player.faction,
            count: 1
        });
    });
});
alt.onClient("goverStorage.takeClothes", (player, index) => {
    if (!player.colshape || !player.colshape.goverStorage) return player.utils.error(`Вы не у склада Правительства!`);
    if (!alt.factions.isGoverFaction(player.faction)) return player.utils.error(`Вы не работаете в Правительстве!`);
    var faction = alt.factions.getBySqlId(player.faction);
    if (!faction) return player.utils.error(`Организация с ID: ${player.faction} не найдена!`);
    var army = faction.name;

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
        if (alt.factions.isGoverFaction(hats[key].params.faction)) return player.utils.error(`У Вас уже есть головной убор ${army}!`);
    for (var key in tops)
        if (alt.factions.isGoverFaction(tops[key].params.faction)) return player.utils.error(`У Вас уже есть рубашка ${army}!`);
    for (var key in legs)
        if (alt.factions.isGoverFaction(legs[key].params.faction)) return player.utils.error(`У Вас уже есть брюки ${army}!`);
    for (var key in feets)
        if (alt.factions.isGoverFaction(feets[key].params.faction)) return player.utils.error(`У Вас уже есть ботинки ${army}!`);
    for (var key in ears)
        if (alt.factions.isGoverFaction(ears[key].params.faction)) return player.utils.error(`У Вас уже есть наушники ${army}!`);
    for (var key in ties)
        if (alt.factions.isGoverFaction(ties[key].params.faction)) return player.utils.error(`У Вас уже есть аксессуар ${army}!`);
    for (var key in masks)
        if (alt.factions.isGoverFaction(masks[key].params.faction)) return player.utils.error(`У Вас уже есть шлем ${army}!`);
    for (var key in glasses)
        if (alt.factions.isGoverFaction(glasses[key].params.faction)) return player.utils.error(`У Вас уже есть очки ${army}!`);

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
            torso: [4, 4][index],
            variation: [4, 10][index],
            texture: [3, 0][index],
            undershirt: [13, 13][index],
            uTexture: [0, 1][index],
        };
        legsParams = {
            sex: 1,
            variation: [10, 10][index],
            texture: [0, 0][index]
        };
        feetsParams = {
            sex: 1,
            variation: [10, 10][index],
            texture: [0, 0][index]
        };
        earsParams = {
            sex: 1,
            variation: [-1, -1][index],
            texture: [0, 0][index]
        };
        tiesParams = {
            sex: 1,
            variation: [21, 21][index],
            texture: [1, 12][index]
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
            torso: [7, 7][index],
            variation: [25, 91][index],
            texture: [10, 0][index],
            undershirt: [64, 39][index],
            uTexture: [0, 1][index],
        };
        legsParams = {
            sex: 0,
            variation: [6, 7][index],
            texture: [0, 0][index]
        };
        feetsParams = {
            sex: 0,
            variation: [13, 6][index],
            texture: [3, 2][index]
        };
        earsParams = {
            sex: 0,
            variation: [-1, -1][index],
            texture: [0, 0][index]
        };
        tiesParams = {
            sex: 0,
            variation: [-1, -1][index],
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
    topParams.name = army;
    legsParams.name = army;

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

    player.utils.success(`Вам выдана форма ${army}!`);


    faction.setProducts(faction.products - alt.economy["army_mainclothes_products"].value);
    alt.logs.addLog(`${player.getSyncedMeta("name")} взял со склада Форма ${army}`, 'stuff', player.account.id, player.sqlId, {
        faction: player.faction,
        count: 1,
        item: army
    });
});
alt.onClient("goverStorage.takeGun", (player, index) => {
    if (!player.colshape || !player.colshape.goverStorage) return player.utils.error(`Вы не у склада Правительства!`);
    if (!alt.factions.isGoverFaction(player.faction)) return player.utils.error(`Вы не работаете в Правительстве!`);

    var faction = alt.factions.getBySqlId(player.faction);
    if (!faction) return player.utils.error(`Организация с ID: ${player.faction} не найдена!`);
    if (player.rank < 3) return player.utils.error(`Оружие выдается с 3 ранга!`);

    if (faction.products < alt.economy["army_armour_products"].value) return player.utils.error(`Недостаточно боеприпасов!`);

    var itemIds = [20, 21, 22, 19];
    var weaponIds = ["weapon_combatpistol", "weapon_pumpshotgun", "weapon_carbinerifle", "weapon_stungun"];
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
alt.onClient("goverStorage.takeAmmo", (player, index, ammo) => {
    //debug(`policeStorage.takeAmmo: ${index} ${ammo}`);
    if (!player.colshape || !player.colshape.goverStorage) return player.utils.error(`Вы не у склада Правительства!`);
    if (!alt.factions.isGoverFaction(player.faction)) return player.utils.error(`Вы не работаете в Правительстве!`);

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
alt.onClient("goverStorage.takeItem", (player, index) => {
    if (!player.colshape || !player.colshape.goverStorage) return player.utils.error(`Вы не у склада Правительства!`);
    if (!alt.factions.isGoverFaction(player.faction)) return player.utils.error(`Вы не работаете в Правительстве!`);

    var faction = alt.factions.getBySqlId(player.faction);
    if (!faction) return player.utils.error(`Организация с ID: ${player.faction} не найдена!`);

    var itemIds = [27, 28];
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
        alt.logs.addLog(`${player.getSyncedMeta("name")} взял со склада ${alt.inventory.getItem(itemId).name}`, 'stuff', player.account.id, player.sqlId, {
            faction: player.faction,
            item: alt.inventory.getItem(itemId).name,
            count: 1
        });
    });
});
