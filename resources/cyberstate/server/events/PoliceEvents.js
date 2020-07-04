alt.onClient("policeStorage.takeClothes", (player, index) => {
    if (!player.colshape || !player.colshape.policeStorage) return player.utils.error(`Вы не у склада Police!`);
    var policeStorageMarker = player.colshape.policeStorage;
    if (!alt.factions.isPoliceFaction(player.faction)) return player.utils.error(`Вы не являетесь сотрудником порядка!`);

    var faction = alt.factions.getBySqlId(player.faction);
    if (!faction) return player.utils.error(`Организация с ID: ${player.faction} не найдена!`);
    var police = faction.name;

    if (faction.products < alt.economy["police_mainclothes_products"].value) return player.utils.error(`Недостаточно боеприпасов!`);
    var hats = player.inventory.getArrayByItemId(6);
    var tops = player.inventory.getArrayByItemId(7);
    var legs = player.inventory.getArrayByItemId(8);
    var feets = player.inventory.getArrayByItemId(9);
    var ties = player.inventory.getArrayByItemId(2);
    var masks = player.inventory.getArrayByItemId(14);
    var glasses = player.inventory.getArrayByItemId(1);

    for (var key in hats)
        if (alt.factions.isPoliceFaction(hats[key].params.faction)) return player.utils.error(`У Вас уже есть головной убор ${police}!`);
    for (var key in tops)
        if (alt.factions.isPoliceFaction(tops[key].params.faction)) return player.utils.error(`У Вас уже есть рубашка ${police}!`);
    for (var key in legs)
        if (alt.factions.isPoliceFaction(legs[key].params.faction)) return player.utils.error(`У Вас уже есть брюки ${police}!`);
    for (var key in feets)
        if (alt.factions.isPoliceFaction(feets[key].params.faction)) return player.utils.error(`У Вас уже есть ботинки ${police}!`);
    for (var key in ties)
        if (alt.factions.isPoliceFaction(ties[key].params.faction)) return player.utils.error(`У Вас уже есть аксессуар ${police}!`);
    for (var key in masks)
        if (alt.factions.isPoliceFaction(masks[key].params.faction)) return player.utils.error(`У Вас уже есть шлем ${police}!`);
    for (var key in glasses)
        if (alt.factions.isPoliceFaction(glasses[key].params.faction)) return player.utils.error(`У Вас уже есть очки ${police}!`);

    alt.fullDeleteItemsByParams(6, ["faction", "owner"], [player.faction, player.sqlId]);
    alt.fullDeleteItemsByParams(7, ["faction", "owner"], [player.faction, player.sqlId]);
    alt.fullDeleteItemsByParams(8, ["faction", "owner"], [player.faction, player.sqlId]);
    alt.fullDeleteItemsByParams(9, ["faction", "owner"], [player.faction, player.sqlId]);
    alt.fullDeleteItemsByParams(10, ["faction", "owner"], [player.faction, player.sqlId]);
    alt.fullDeleteItemsByParams(2, ["faction", "owner"], [player.faction, player.sqlId]);
    alt.fullDeleteItemsByParams(14, ["faction", "owner"], [player.faction, player.sqlId]);
    alt.fullDeleteItemsByParams(1, ["faction", "owner"], [player.faction, player.sqlId]);


    var hatParams, topParams, legsParams, feetsParams, tiesParams, masksParams, glassesParams;
    var f = player.faction - 2;
    if (player.sex == 1) {
        hatParams = {
            sex: 1,
            variation: [
                [46, 124, 46],
                [117, -1, -1, 58, -1, -1, 13]
            ][f][index],
            texture: [
                [0, 15, 0],
                [0, 0, 0, 1, 0, 0, 0]
            ][f][index]
        };
        topParams = {
            sex: 1,
            torso: [
                [0, 108, 11],
                [17, 0, 11, 11, 11, 11, 6]
            ][f][index],
            tTexture: [
                [-1, 9, -1],
                [-1, -1, -1, -1, -1, -1, -1]
            ][f][index],
            variation: [
                [55, 89, 13],
                [53, 242, 13, 13, 13, 13, 156]
            ][f][index],
            texture: [
                [0, 0, 1],
                [3, 2, 1, 1, 1, 2, 0]
            ][f][index],
            undershirt: [
                [58, 129, -1],
                [122, 129, 58, 58, 122, 130, 115]
            ][f][index]
        };
        legsParams = {
            sex: 1,
            variation: [
                [35, 59, 35],
                [47, 22, 22, 22, 37, 37, 25]
            ][f][index],
            texture: [
                [0, 9, 0],
                [1, 1, 1, 1, 1, 1, 6]
            ][f][index]
        };
        feetsParams = {
            sex: 1,
            variation: [
                [25, 25, 10],
                [25, 25, 25, 25, 25, 10, 10, 10]
            ][f][index],
            texture: [
                [0, 0, 0],
                [0, 0, 0, 0, 12, 0, 12]
            ][f][index]
        };
        tiesParams = {
            sex: 1,
            variation: [
                [-1, -1, 21],
                [-1, -1, 38, -1, 38, 38, -1]
            ][f][index],
            texture: [
                [0, 0, 1],
                [0, 0, 0, 0, 0, 1, 0]
            ][f][index]
        };
        masksParams = {
            sex: 1,
            variation: [
                [-1, 35, -1],
                [52, -1, -1, -1, -1, -1, -1]
            ][f][index],
            texture: [
                [-1, 0, -1],
                [0, 0, 0, 0, 0, 0, 0]
            ][f][index]
        };
        glassesParams = {
            sex: 1,
            variation: [
                [-1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1]
            ][f][index],
            texture: [
                [0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0]
            ][f][index]
        };
    } else {
        hatParams = {
            sex: 0,
            variation: [
                [45, 124, 45],
                [116, -1, -1, 58, -1, -1, 20]
            ][f][index],
            texture: [
                [0, 0, 0],
                [0, 0, 0, 1, 0, 0, 1]
            ][f][index]
        };
        topParams = {
            sex: 0,
            torso: [
                [31, 23, 31],
                [18, 0, 0, 20, 20, 20, 20]
            ][f][index],
            variation: [
                [48, 103, 48],
                [46, 165, 27, 27, 27, 27, 183]
            ][f][index],
            texture: [
                [0, 0, 0],
                [3, 0, 2, 2, 2, 2, 2]
            ][f][index],
            undershirt: [
                [-1, -1, 35],
                [160, 78, 35, 35, 152, 152, 37]
            ][f][index]
        };
        legsParams = {
            sex: 0,
            variation: [
                [34, 33, 34],
                [49, 41, 64, 64, 41, 37, 37]
            ][f][index],
            texture: [
                [0, 0, 0],
                [1, 1, 2, 2, 1, 6, 6]
            ][f][index]
        };
        feetsParams = {
            sex: 0,
            variation: [
                [29, 25, 29],
                [25, 13, 55, 55, 29, 29, 29]
            ][f][index],
            texture: [
                [0, 0, 0],
                [0, 0, 0, 0, 0, 2, 2]
            ][f][index]
        };
        tiesParams = {
            sex: 1,
            variation: [
                [-1, -1, -1],
                [-1, -1, -1, -1, -1, -1, 95]
            ][f][index],
            texture: [
                [0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0]
            ][f][index]
        };
        masksParams = {
            sex: 0,
            variation: [
                [-1, -1, -1],
                [57, -1, -1, -1, -1, -1, -1]
            ][f][index],
            texture: [
                [0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0]
            ][f][index]
        };
        glassesParams = {
            sex: 0,
            variation: [
                [-1, -1, -1, -1, 27, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1]
            ][f][index],
            texture: [
                [0, 0, 0, 0, 4, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0]
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
    tiesParams.faction = player.faction;
    masksParams.faction = player.faction;
    glassesParams.faction = player.faction;

    topParams.rows = 5;
    topParams.cols = 5;
    legsParams.rows = 3;
    legsParams.cols = 3;
    topParams.name = police;
    legsParams.name = police;

    hatParams.owner = player.sqlId;
    topParams.owner = player.sqlId;
    legsParams.owner = player.sqlId;
    feetsParams.owner = player.sqlId;
    tiesParams.owner = player.sqlId;
    masksParams.owner = player.sqlId;
    glassesParams.owner = player.sqlId;

    var response = (e) => {
        if (e) player.utils.error(e);
    };
    if (hatParams.variation != -1) player.inventory.add(6, hatParams, {}, (e) => {
        if (e) return console.log(e);
    });
    if (topParams.variation != -1) player.inventory.add(7, topParams, {}, (e) => {
        if (e) return console.log(e);
    });
    if (legsParams.variation != -1) player.inventory.add(8, legsParams, {}, (e) => {
        if (e) return console.log(e);
    });
    if (feetsParams.variation != -1) player.inventory.add(9, feetsParams, {}, (e) => {
        if (e) return console.log(e);
    });
    if (tiesParams.variation != -1) player.inventory.add(2, tiesParams, {}, (e) => {
        if (e) return console.log(e);
    });
    if (masksParams.variation != -1) player.inventory.add(14, masksParams, {}, (e) => {
        if (e) return console.log(e);
    });
    if (glassesParams.variation != -1) player.inventory.add(1, glassesParams, {}, (e) => {
        if (e) return console.log(e);
    });

    player.utils.success(`Вам выдана форма ${police}!`);

    faction.setProducts(faction.products - alt.economy["police_mainclothes_products"].value);
    alt.logs.addLog(`${player.getSyncedMeta("name")} взял со склада Форма ${police}`, 'stuff', player.account.id, player.sqlId, {
        faction: player.faction,
        count: 1,
        item: police
    });
});

alt.onClient("policeStorage.takeArmour", (player) => {
    if (!player.colshape || !player.colshape.policeStorage) return player.utils.error(`Вы не у склада PD!`);
    if (!alt.factions.isPoliceFaction(player.faction)) return player.utils.error(`Вы не являетесь сотрудником порядка!`);

    var faction = alt.factions.getBySqlId(player.faction);
    if (!faction) return player.utils.error(`Организация с ID: ${player.faction} не найдена!`);
    var pd = faction.name;

    if (faction.products < alt.economy["police_armour_products"].value) return player.utils.error(`Недостаточно боеприпасов!`);
    var items = player.inventory.getArrayByItemId(3);

    for (var sqlId in items)
        if (alt.factions.isPoliceFaction(items[sqlId].params.faction)) return player.utils.error(`У Вас уже есть бронежилет ${pd}!`);

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
        player.utils.success(`Вам выдан бронежилет ${pd}!`);
        faction.setProducts(faction.products - alt.economy["police_armour_products"].value);
        alt.logs.addLog(`${player.getSyncedMeta("name")} взял со склада Форма Бронежилет LSPD`, 'stuff', player.account.id, player.sqlId, {
            faction: player.faction,
            count: 1
        });
    });

});

alt.onClient("policeStorage.takeGun", (player, index) => {
    if (!player.colshape || !player.colshape.policeStorage) return player.utils.error(`Вы не у склада PD!`);
    var policeStorageMarker = player.colshape.policeStorage;
    if (!alt.factions.isPoliceFaction(player.faction)) return player.utils.error(`Вы не являетесь сотрудником порядка!`);

    var faction = alt.factions.getBySqlId(player.faction);
    if (!faction) return player.utils.error(`Организация с ID: ${player.faction} не найдена!`);

    if (faction.products < alt.economy["police_armour_products"].value) return player.utils.error(`Недостаточно боеприпасов!`);


    var itemIds = [17, 18, 19, 20, 21, 22, 23];
    var weaponIds = ["weapon_nightstick", "weapon_flashlight", "weapon_stungun", "weapon_combatpistol", "weapon_pumpshotgun", "weapon_carbinerifle", "weapon_sniperrifle"];
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
        faction.setProducts(faction.products - alt.economy["police_armour_products"].value);
        alt.logs.addLog(`${player.getSyncedMeta("name")} взял со склада оружие ${alt.inventory.getItem(itemId).name}`, 'stuff', player.account.id, player.sqlId, {
            faction: player.faction,
            item: alt.inventory.getItem(itemId).name,
            count: 1
        });

    });
});

alt.onClient("policeStorage.takeAmmo", (player, index, ammo) => {
    //debug(`policeStorage.takeAmmo: ${index} ${ammo}`);
    if (!player.colshape || !player.colshape.policeStorage) return player.utils.error(`Вы не у склада PD!`);
    var policeStorageMarker = player.colshape.policeStorage;
    if (!alt.factions.isPoliceFaction(player.faction)) return player.utils.error(`Вы не являетесь сотрудником порядка!`);

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
        alt.logs.addLog(`${player.getSyncedMeta("name")} взял со склада ${alt.inventory.getItem(itemIds[index]).name}. Количество: ${ammo}`, 'stuff', player.account.id, player.sqlId, {
            faction: player.faction,
            item: alt.inventory.getItem(itemIds[index]).name,
            count: ammo
        });
    });
});

alt.onClient("policeStorage.takeItem", (player, index) => {
    if (!player.colshape || !player.colshape.policeStorage) return player.utils.error(`Вы не у склада PD!`);
    var policeStorageMarker = player.colshape.policeStorage;
    if (!alt.factions.isPoliceFaction(player.faction)) return player.utils.error(`Вы не являетесь сотрудником порядка!`);
    var faction = alt.factions.getBySqlId(player.faction);
    if (!faction) return player.utils.error(`Организация с ID: ${player.faction} не найдена!`);

    if (faction.products < alt.economy["police_armour_products"].value) return player.utils.error(`Недостаточно боеприпасов!`);

    if(player.faction == 2) {
        var itemIds = [29, 27, 28];
    } else {
        var itemIds = [64, 27, 28];
    }

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
        faction.setProducts(faction.products - alt.economy["police_armour_products"].value);
        alt.logs.addLog(`${player.getSyncedMeta("name")} взял со склада ${alt.inventory.getItem(itemId).name}. Количество: 1`, 'stuff', player.account.id, player.sqlId, {
            faction: player.faction,
            item: alt.inventory.getItem(itemId).name,
            count: 1
        });

    });
});

alt.onClient("policeService.recovery.documents", (player) => {
    if (!player.colshape || !player.colshape.factionService) return player.utils.error(`Вы не возле услуг PD!`);
    if (player.waitOperation) return player.utils.error(`Дождитесь выполнения предыдущей операции!`);
    var docs = player.inventory.getArrayByItemId(16);
    for (var sqlId in docs) {
        if (docs[sqlId].params.owner == player.sqlId) return player.utils.error(`Вы уже имеете документы!`);
    }
    var price = alt.economy["police_recovery_price"].value;
    if (player.money < price) return player.utils.error(`Необходимо: ${price}$`);

    alt.fullDeleteItemsByParams(16, ["owner"], [player.sqlId]);
    var params = {
        owner: player.sqlId,
        licenses: [],
        weapon: [0, 0, 0, 0, 0, 0, 0],
        work: []
    };
    player.inventory.add(16, params, {}, (e) => {
        if (e) return player.utils.error(e);

        player.utils.setMoney(player.money - price);
        player.utils.success(`Документы восстановлены!`);
    });
});

alt.onClient("policeService.recovery.carKeys", (player) => {
    if (!player.colshape || !player.colshape.factionService) return player.utils.error(`Вы не возле услуг PD!`);
    if (!player.carIds.length) return player.utils.error(`Нет доступных авто для восстановления ключей!`);
    if (player.waitOperation) return player.utils.error(`Дождитесь выполнения предыдущей операции!`);
    for (var i = 0; i < player.carIds.length; i++) {
        var veh = alt.Vehicle.at(player.carIds[i]);
        var item = player.inventory.getItemKey(veh.sqlId);
        if (player.sqlId + 2000 != veh.owner) continue;
        if (item) continue;
        var price = alt.economy["police_recovery_price"].value;
        if (player.money < price) continue;

        var params = {
            owner: player.sqlId,
            car: veh.sqlId,
            model: veh.name
        };

        player.inventory.add(54, params, {}, (e) => {
            if (e) return player.utils.error(e);
            player.utils.setMoney(player.money - price);
            player.utils.success(`Ключи от авто восстановлены!`);
        });

        return;
    }
    
    return player.utils.error(`Вы имеете все ключи от автомобилей!`);
});

alt.onClient("policeService.recovery.houseKeys", (player, houseSqlId) => {
    // debug(`recovery.houseKeys: ${player.getSyncedMeta("name")} ${houseSqlId}`)
    if (!player.colshape || !player.colshape.factionService) return player.utils.error(`Вы не возле услуг PD!`);

    var house = alt.houses.getBySqlId(houseSqlId);
    if (!house) return player.utils.error(`Дом с ID: ${houseSqlId} не найден!`);
    if (house.owner != player.sqlId) return player.utils.error(`Вы не владелец дома!`);

    var keys = player.inventory.getArrayByItemId(59);
    for (var index in keys)
        if (keys[index].params.house == house.sqlId) return player.utils.error(`Вы уже имеете ключи от Дома №${houseSqlId}!`);

    alt.fullDeleteItemsByParams(59, ["house"], [house.sqlId]);
    var params = {
        owner: player.sqlId,
        house: house.sqlId
    };
    player.inventory.add(59, params, {}, (e) => {
        if (e) return player.utils.error(e);

        player.utils.setMoney(player.money - alt.economy["police_recovery_price"].value);
        player.utils.success(`Ключи от дома восстановлены!`);
    });
});

alt.onClient("policeService.showClearFine", (player) => {
    // debug(`showClearFine: ${player.getSyncedMeta("name")}`)
    if (!player.colshape || !player.colshape.factionService) return player.utils.error(`Вы не возле услуг PD!`);
    if (player.fines < 1) return player.utils.error(`Вы не имеете штрафов!`);
    DB.Query("SELECT * FROM fines WHERE recipient=? LIMIT 1", player.sqlId, (e, result) => {
        if (!result.length) {
            player.fines = 0;
            return player.utils.error(`Штрафы не найдены!`);
        }
        player.clearFine = result[0];
        alt.emitClient(player, `modal.show`, `clear_fine`, result[0]);
    });
});

alt.onClient("policeService.clearFine", (player) => {
    if (!player.colshape || !player.colshape.factionService) return player.utils.error(`Вы не возле услуг PD!`);
    if (!player.clearFine) return player.utils.error(`Штраф не найден!`);
    if (player.money < player.clearFine.price) return player.utils.eror(`Необходимо: $${player.clearFine.price}`);

    player.utils.setMoney(player.money - player.clearFine.price);
    DB.Query(`DELETE FROM fines WHERE id=?`, [player.clearFine.id]);
    player.fines = Math.clamp(player.fines - 1, 0, Number.MAX_VALUE);
    player.utils.success(`Вы оплатили штраф №${player.clearFine.id}`);
    delete player.clearFine;
});

alt.onClient("police.searchPlayer", (player, event, param) => {
    //debug(`police.searchPlayer: ${player.getSyncedMeta("name")} ${event} ${param}`);
    if (alt.factions.isPoliceFaction(player.faction)) {
        if (event == 'name') {
            var rec = alt.Player.getByName(param.toString());
            if (rec.faction != 0) {
                var faction = alt.factions.getBySqlId(rec.faction);
            } else {
                var faction = "Безработный";
            }
            if (rec) {
                DB.Query("SELECT id,x,y,z FROM houses WHERE owner=?", [rec.sqlId], (e, result) => {
                    var houses = [];
                    for (var i = 0; i < result.length; i++) {
                        var h = result[i];
                        var pos = new alt.Vector3(h.x, h.y, h.z);
                        houses.push({
                            sqlId: h.id,
                            adress: '',
                            pos: pos
                        });
                    }
                    var data = {
                        playerId: rec.sqlId,
                        name: rec.getSyncedMeta("name"),
                        crimes: rec.crimes,
                        wanted: rec.wanted,
                        faction: faction.name,
                        houses: houses
                    }

                    if (player.faction == 2) {
                        alt.emitClient(player, `tablet.police.addSearchPlayer`, data);
                    }
                });

            } else {
                return player.utils.error(`Гражданин не найден!`);
            }
        } else {
            var rec = alt.Player.getBySqlId(param);
            if (rec) {
                if (rec.faction != 0) {
                    var faction = alt.factions.getBySqlId(rec.faction);
                } else {
                    var faction = "Безработный";
                }
                DB.Query("SELECT id,x,y,z FROM houses WHERE owner=?", [rec.sqlId], (e, result) => {
                    var houses = [];
                    for (var i = 0; i < result.length; i++) {
                        var h = result[i];
                        var pos = new alt.Vector3(h.x, h.y, h.z);
                        houses.push({
                            sqlId: h.id,
                            adress: '',
                            pos: pos
                        });
                    }
                    var data = {
                        playerId: rec.sqlId,
                        name: rec.getSyncedMeta("name"),
                        wanted: rec.wanted,
                        crimes: rec.crimes,
                        faction: faction.name,
                        houses: houses
                    }

                    if (player.faction == 2) {
                        alt.emitClient(player, `tablet.police.addSearchPlayer`, data);
                    }
                });
            } else {
                return player.utils.error(`Гражданин не найден!`);
            }
        }
    }
});

alt.onClient("drivingSchool.buyLic", (player, licType) => {
    if (!player.colshape || !player.colshape.drivingSchool) return player.utils.error(`Вы не у центра лицензирования!`);
    var types = [1, 2, 3, 4, 11, 12];
    var prices = [500, 700, 1000, 5000, 2000, 3000];
    var index = types.indexOf(licType);
    if (index == -1) return player.utils.error(`Неверный тип лицензии!`);
    if (player.money < prices[index]) return player.utils.error(`Необходимо: ${prices[index]}$`);

    var docs = player.inventory.getArrayByItemId(16);
    for (var key in docs) {
        var doc = docs[key];
        if (doc.params.owner == player.sqlId) {
            if (doc.params.licenses.indexOf(licType) != -1) return player.utils.error(`Вы уже имеете ${alt.getLicName(licType)}!`);
            player.utils.setMoney(player.money - prices[index]);
            doc.params.licenses.push(licType);
            player.inventory.updateParams(doc.id, doc);
            return player.utils.success(`Вы приобрели лицензию!`);
        }
    }

    return player.utils.error(`Ваши документы не найдены!`);
});

alt.onClient("police.giveLic", (player, recId) => {
    var rec = alt.Player.getBySqlId(recId);
    if (!rec) return player.utils.error(`Гражданин не найден!`);
    if (!player.faction == 2 || !player.faction == 3) return player.utils.error(`Вы не сотрудник порядка!`);
    if (!player.faction || player.rank < alt.factionRanks[player.faction].length - 2) return player.utils.error(`У вас нет прав!`);
    if (rec.sqlId === player.sqlId) return player.utils.error(`Вы не можете выдать сами себе лицензию!`);

    var docs = rec.inventory.getArrayByItemId(16);
    if (!docs || !Object.keys(docs).length) return player.utils.error(`Документы не найдены!`);
    for (var key in docs) {
        var doc = docs[key];
        if (doc.params.owner == rec.sqlId) {
            if (doc.params.licenses.indexOf(10) != -1) return player.utils.error(`Имеет лицензию на оружие!`);
            doc.params.licenses.push(10);
            rec.inventory.updateParams(doc.id, doc);
        }
    }

    player.utils.success(`Вы выдали лицензию на оружие`);
    rec.utils.success(`Вам выдали лицензию на оружие`);

    alt.logs.addLog(`${player.getSyncedMeta("name")} выдал лицензию на оружие игроку ${rec.getSyncedMeta("name")}. `, 'faction', player.account.id, player.sqlId, { faction: player.faction });
    alt.logs.addLog(`${rec.getSyncedMeta("name")} была выдана лицензия на оружие игроком ${player.getSyncedMeta("name")}.`, 'faction', rec.account.id, rec.sqlId, { faction: rec.faction });
});

alt.onClient("police.giveFine", (player, data) => {
    //debug(`giveWanted: ${data}`);
    data = JSON.parse(data);
    var recId = data.playerId,
        sum = data.summ,
        reason = data.reason;
    sum = Math.clamp(sum, 1, alt.economy["max_fine_sum"].value);
    var rec = alt.Player.getBySqlId(recId);
    if (!rec) return player.utils.error(`Гражданин не найден!`);
    if (!player.faction == 2 || !player.faction == 3) return player.utils.error(`Вы не сотрудник порядка!`);
    if (rec.sqlId === player.sqlId) return player.utils.error(`Вы не можете выдать сами себе штраф!`);

    rec.fines++;
    DB.Query("INSERT INTO fines (cop,recipient,reason,price,date) VALUES (?,?,?,?,?)", [player.sqlId, rec.sqlId, reason, sum, new Date().getTime() / 1000], (e) => {
        if (e) terminal.error(e);
    });

    player.utils.success(`${rec.getSyncedMeta("name")} получил штраф на ${sum}$`);
    rec.utils.error(`${player.getSyncedMeta("name")} выписал Вам штраф на ${sum}$`);
    alt.logs.addLog(`${player.getSyncedMeta("name")} выписал штраф игроку ${rec.getSyncedMeta("name")}. Причина: ${reason}, сумма: ${sum}`, 'faction', player.account.id, player.sqlId, {
        faction: player.faction,
        reason: reason,
        sum: sum
    });
    alt.logs.addLog(`${rec.getSyncedMeta("name")} был выписан штраф игроком ${player.getSyncedMeta("name")}. Причина: ${reason}, сумма: ${sum}`, 'faction', rec.account.id, rec.sqlId, {
        faction: rec.faction,
        reason: reason,
        sum: sum
    });
});

alt.onClient("police.giveWanted", (player, data) => {
    data = JSON.parse(data);
    var recId = data.playerId,
        wanted = data.stars;
    var rec = alt.Player.getBySqlId(recId);
    if (!rec) return player.utils.error(`Гражданин не найден!`);
    if (!player.faction == 2 || !player.faction == 3) return player.utils.error(`Вы не сотрудник порядка!`);
    if (wanted > Config.maxWantedLevel) return player.utils.error(`Выберите от 1 до ${Config.maxWantedLevel} уровня розыска!`);
    if (rec.wanted >= Config.maxWantedLevel) return player.utils.error(`${rec.getSyncedMeta("name")} имеет максимальный уровень розыска!`);
    if (rec.sqlId == player.sqlId) return player.utils.error(`Вы не можете выдать сами себе розыск!`);

    rec.utils.setWanted(rec.wanted + wanted);
    player.utils.success(`${rec.getSyncedMeta("name")} объявлен в розыск`);
    rec.utils.error(`${player.getSyncedMeta("name")} объявил Вас в розыск`);
    alt.logs.addLog(`${player.getSyncedMeta("name")} объявил игрока ${rec.getSyncedMeta("name")} в розыск. Звезд: ${wanted}`, 'faction', player.account.id, player.sqlId, {
        faction: player.faction,
        wanted: wanted
    });
    alt.logs.addLog(`${rec.getSyncedMeta("name")} был объявлен игроком ${player.getSyncedMeta("name")} в розыск. Звезд: ${wanted}`, 'faction', rec.account.id, rec.sqlId, {
        faction: rec.faction,
        wanted: wanted
    });
    //todo broadcast for radio
});

alt.on("police.addCall", (player, text) => {
    alt.Player.all.forEach((rec) => {
        if (alt.factions.isPoliceFaction(rec.faction)) {
            alt.emitClient(rec, `tablet.police.addCall`, {
                id: player.sqlId,
                name: player.getSyncedMeta("name"),
                pos: player.pos,
                message: text
            });
        }
    });
    player.policeCallTime = new Date().getTime();
    player.utils.success(`Вызов отправлен!`);
});

alt.onClient("police.acceptCall", (player, playerId, x, y) => {
    if (!alt.factions.isPoliceFaction(player.faction)) return player.utils.error(`Вы не сотрудник порядка!`);
    var rec = alt.Player.getBySqlId(playerId);
    if (!rec) return player.utils.error(`Гражданин не найден!`);
    if (!rec.policeCallTime) return player.utils.error(`Вызов принят/отклонен другим полицейским!`);

    alt.Player.all.forEach((rec) => {
        if (alt.factions.isPoliceFaction(rec.faction)) {
            alt.emitClient(rec, `tablet.police.removeCall`, playerId);
            alt.emitClient(player, "setNewWaypoint", x, y);
        }
    });

    delete rec.policeCallTime;
    player.utils.success(`Вызов принят!`);
    rec.utils.success(`${player.getSyncedMeta("name")} принял Ваш вызов!`);
});