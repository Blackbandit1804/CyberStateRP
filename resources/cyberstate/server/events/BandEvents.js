const { StorageController } = require(`../modules/gang_storage`);

alt.onClient("bandDealer.buyGun", (player, itemId) => {
    if (!alt.factions.isInLegalFaction(player.faction)) return player.utils.error(`Недостаточно доступа!`);

    var gunsInfo = {
        41: {
            price: 200,
            params: {
                weaponHash: jhash("weapon_bat")
            },
        },
        67: {
            price: 150,
            params: {
                weaponHash: jhash("weapon_crowbar")
            },
        },
        18: {
            price: 50,
            params: {
                weaponHash: jhash("weapon_flashlight")
            },
        },
        42: {
            price: 75,
            params: {
                weaponHash: jhash("weapon_knuckle")
            },
        },
        72: {
            price: 200,
            params: {
                weaponHash: jhash("weapon_switchblade")
            },
        },
        44: {
            price: 2810,
            params: {
                weaponHash: jhash("weapon_pistol")
            },
        },
        49: {
            price: 4000,
            params: {
                weaponHash: jhash("weapon_sawnoffshotgun")
            },
        },
        50: {
            price: 8500,
            params: {
                weaponHash: jhash("weapon_assaultrifle")
            },
        },
        22: {
            price: 9700,
            params: {
                weaponHash: jhash("weapon_carbinerifle")
            },
        },
        100: {
            price: 12000,
            params: {
                weaponHash: jhash("weapon_advancedrifle")
            },
        },
        52: {
            price: 7500,
            params: {
                weaponHash: jhash("weapon_compactrifle")
            },
        },
        47: {
            price: 3820,
            params: {
                weaponHash: jhash("weapon_microsmg")
            },
        },
        48: {
            price: 4650,
            params: {
                weaponHash: jhash("weapon_smg")
            },
        },
        89: {
            price: 5700,
            params: {
                weaponHash: jhash("weapon_machinepistol")
            },
        },
        21: {
            price: 4550,
            params: {
                weaponHash: jhash("weapon_pumpshotgun")
            },
        },
        125: {
            price: 7000,
            params: {
                weaponHash: jhash("weapon_pistol50")
            },
        },
        90: {
            price: 3900,
            params: {
                weaponHash: jhash("weapon_minismg")
            },
        },
        94: {
            price: 8000,
            params: {
                weaponHash: jhash("weapon_musket")
            },
        },
        52: {
            price: 7500,
            params: {
                weaponHash: jhash("weapon_compactrifle")
            },
        },
        53: {
            price: 16000,
            params: {
                weaponHash: jhash("weapon_mg")
            },
        },
        111: {
            price: 40000,
            params: {
                weaponHash: jhash("weapon_rpg")
            },
        }
    };

    if (!alt.factions.isMafiaAccess(player.faction)) return player.utils.error(`Недостаточно прав!`);

    if (!gunsInfo[itemId]) return player.utils.error(`Оружие не найдено!`);
    var info = gunsInfo[itemId];
    if (player.money < info.price) return player.utils.error(`Необходимо ${info.price}$`);
    info.params.ammo = 0;

    player.inventory.add(itemId, info.params, {}, (e) => {
        if (e) return player.utils.error(e);

        var zone = alt.bandZonesUtils.getByPos(player.pos);
        if (zone && zone.bandId != player.faction) {
            let storage = StorageController.functions.inGetStorage(zone.bandId);
            storage.setBalance(storage.balance + price * alt.economy["dealer_storage_procent"].value / 100);
        }

        player.utils.setMoney(player.money - info.price);
        player.utils.success(`Вы купили ${alt.inventory.getItem(itemId).name}`);
    });
});
alt.onClient("bandDealer.buyAmmo", (player, index, ammo) => {
    // debug(`bandDealer.buyAmmo: ${player.getSyncedMeta("name")} ${index} ${ammo}`)
    // TODO: Проверка, стоит ли игрок в колшейпе. Васина контрабанда.
    if (!alt.factions.isInLegalFaction(player.faction)) return player.utils.error(`Недостаточно доступа!`);

    var itemIds = [37, 38, 40, 39];
    var prices = [6, 7, 7, 6];
    var index = Math.clamp(index, 0, itemIds.length - 1);
    var price = ammo * prices[index];
    if (player.money < price) return player.utils.error(`Необходимо ${price}$`);

    var params = {
        ammo: ammo,
    };

    player.inventory.add(itemIds[index], params, {}, (e) => {
        if (e) return player.utils.error(e);

        var zone = alt.bandZonesUtils.getByPos(player.pos);
        if (zone && zone.bandId != player.faction) {
            let storage = StorageController.functions.inGetStorage(zone.bandId);
            storage.setBalance(storage.balance + price * alt.economy["dealer_storage_procent"].value / 100);
        }

        player.utils.setMoney(player.money - price);
        player.utils.success(`Вы купили ${alt.inventory.getItem(itemIds[index]).name}!`);
    });
});
alt.onClient("bandDealer.buyDrgus", (player, index, count) => {
    // debug(`bandDealer.buyDrgus: ${player.getSyncedMeta("name")} ${index} ${count}`)
    // TODO: Проверка, стоит ли игрок в колшейпе. Васина контрабанда.
    if (!alt.factions.isInLegalFaction(player.faction)) return player.utils.error(`Вы не состоите в нелегальное организации!`);
    if (!alt.factions.isGangFaction(player.faction)) return player.utils.error(`Недостаточно доступа!`);
    var itemIds = [55, 56, 57, 58];
    var index = Math.clamp(index, 0, itemIds.length - 1);
    var prices = [6, 10, 8, 9];
    var price = count * prices[index];
    if (player.money < price) return player.utils.error(`Необходимо ${price}$`);

    var params = {
        count: count,
    };
    player.inventory.add(itemIds[index], params, {}, (e) => {
        if (e) return player.utils.error(e);

        var zone = alt.bandZonesUtils.getByPos(player.pos);
        if (zone && zone.bandId != player.faction) {
            let storage = StorageController.functions.inGetStorage(zone.bandId);
            storage.setBalance(storage.balance + price * alt.economy["dealer_storage_procent"].value / 100);
        }

        player.utils.setMoney(player.money - price);
        player.utils.success(`Вы купили ${alt.inventory.getItem(itemIds[index]).name}!`);
    });
});
alt.onClient("bandDealer.buyItems", (player, index) => {
    // Добавил покупку предметов ( Tomat )
    if (!alt.factions.isInLegalFaction(player.faction)) return player.utils.error(`Вы не состоите в нелегальное организации!`);
    var itemIds = [126];
    var index = Math.clamp(index, 0, itemIds.length - 1);
    var prices = [150];
    var price = prices[index];
    if (player.money < price) return player.utils.error(`Необходимо ${price}$`);
    var params = {
        faction: player.faction,
        owner: player.sqlId
    }; // Если params разные, выводим их в массив
    player.inventory.add(itemIds[index], params, {}, (e) => {
        if (e) return player.utils.error(e);

        var zone = alt.bandZonesUtils.getByPos(player.pos);
        if (zone && zone.bandId != player.faction) {
            let storage = StorageController.functions.inGetStorage(zone.bandId);
            storage.setBalance(storage.balance + price * alt.economy["dealer_storage_procent"].value / 100);
        }

        player.utils.setMoney(player.money - price);
        player.utils.success(`Вы купили ${alt.inventory.getItem(itemIds[index]).name}!`);
    });
});
alt.onClient("bandDealer.buyMasks", (player, index) => {
    if (!alt.factions.isInLegalFaction(player.faction)) return player.utils.error(`Вы не состоите в нелегальное организации!`);

    var masksParams;
    if (player.sex == 1) {
        masksParams = {
            sex: 1,
            variation: [57, 54, 51, 49, 116, 107, 101, 15, 20, 2][index],
            texture: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0][index]
        };
    } else {
        masksParams = {
            sex: 0,
            variation: [57, 54, 51, 49, 116, 107, 101, 15, 20, 2][index],
            texture: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0][index]
        };
    };

    masksParams.owner = player.sqlId;
    var prices = [ 3000, 3200, 3400, 3600, 3800, 4000, 4200, 4400, 4600, 4800 ];
    var price = prices[index];
    if (player.money < price) return player.utils.error(`Необходимо ${price}$`);
    player.inventory.add(14, masksParams, {}, (e) => {
        if (e) return player.utils.error(e);

        var zone = alt.bandZonesUtils.getByPos(player.pos);
        if (zone && zone.bandId != player.faction) {
            let storage = StorageController.functions.inGetStorage(zone.bandId);
            storage.setBalance(storage.balance + price * alt.economy["dealer_storage_procent"].value / 100);
        }

        player.utils.setMoney(player.money - price);
        player.utils.success(`Вы купили маску!`);
    });
});
alt.onClient("use.gang.tie", (player, recId, status) => {
    let rec = alt.Player.getBySqlId(recId);
    if (!rec) return player.utils.error(`Игрок не найден!`);
    if (rec === player) return player.utils.error(`Вы не можете использовать это на себе!`);
    if (!alt.factions.isInLegalFaction(player.faction)) return player.utils.error(`Вы не состоите в нелегальное организации!`);
    if (rec.vehicle) return player.utils.error(`Игрок в авто!`);
    if (player.hasCuffs) return player.utils.error(`Вы в наручниках!`);
    if (player.hasTie) return player.utils.error(`На вас надеты стяжки!`);
    let dist = alt.Player.dist(player.pos, rec.pos);
    if (dist > Config.maxInteractionDist) return player.utils.error(`Игрок далеко!`);
    if (!status) {
        if (rec.hasTie) return player.utils.error(`Игрок уже в стяжках!`);
        var cuffsItems = player.inventory.getArrayByItemId(126);
        if (!Object.keys(cuffsItems).length) return player.utils.error(`У вас нет стяжек!`);
        player.inventory.delete(Object.values(cuffsItems)[0].id);
        rec.utils.success(`${player.getSyncedMeta("name")} надел на Вас стяжки`);
        player.utils.success(`${rec.getSyncedMeta("name")} в стяжках`);
    } else {
        if (!rec.hasTie) return player.utils.error(`Игрок не в стяжках!`);

        rec.utils.success(`${player.getSyncedMeta("name")} снял с Вас стяжки`);
        player.utils.success(`${rec.getSyncedMeta("name")} без стяжек`);
    }
    rec.utils.setTie(!rec.hasTie);
});
alt.onClient("roob.gang.tie", (player, recId) => {
    let rec = alt.Player.getBySqlId(recId);
    if (!rec) return player.utils.error(`Игрок не найден!`);
    if (rec === player) return player.utils.error(`Вы не можете использовать это на себе!`);
    if (player.hasCuffs) return player.utils.error(`Вы в наручниках!`);
    if (player.hasTie) return player.utils.error(`На вас надеты стяжки!`);
    if (!alt.factions.isInLegalFaction(player.faction)) return player.utils.error(`Вы не состоите в нелегальное организации!`);
    let dist = alt.Player.dist(player.pos, rec.pos);
    if (dist > Config.maxInteractionDist) return player.utils.error(`Игрок далеко!`);
    if (rec.money < 100) return player.utils.error(`У игрока меньше $100`);
    if (alt.getGangRoobers(false, rec.getSyncedMeta("name")) > 0) return player.utils.error(`Данного игрока уже недавно грабили!`);
    if (alt.getGangRoobers(true, player.getSyncedMeta("name")) > 1) return player.utils.error(`Вы уже ограбили 2 человека в течение часа!`);
    if (rec.vehicle) return player.utils.error(`Игрок в авто!`);
    if (!rec.hasTie) return player.utils.error(`Вы не надели стяжки на игрока!`);
    let RoobMoney = [
        { money: 4999, procent: 25 },
        { money: 24999, procent: 15 },
        { money: 49999, procent: 10 },
        { money: 249999, procent: 5 },
        { money: 9999999999999, procent: 15000 }
    ]
    for (let i = 0; i < RoobMoney.length; i++) {
      if (RoobMoney[i].money >= rec.money) {
          let money = Math.round(rec.money / 100 * RoobMoney[i].procent);
          if (RoobMoney[i].procent > 100) money = RoobMoney[i].procent;
          alt.pushGangRoobers(false, rec.getSyncedMeta("name"));
          alt.pushGangRoobers(true, player.getSyncedMeta("name"));
          rec.utils.setMoney(rec.money - money);
          rec.utils.error(`Вас ограбили на $${money}`);
          player.utils.setMoney(player.money + money);
          player.utils.success(`Вы совершили ограбление на $${money}`);
          return;
      }
    }
});
alt.onClient("band.capture.start", (player) => {
    if (!alt.factions.isGangFaction(player.faction)) return player.utils.error(`Вы не член группировки!`);
    if (player.rank < alt.economy["capt_rank"].value) return player.utils.error(`Вы не можете начать захват территории!`);
    // TODO: Calculate current players' band-zone.
    var zone = alt.bandZonesUtils.getByPos(player.pos);
    if (!zone) return player.utils.error(`Вы не на территории гетто!`);

    var faction = alt.factions.getBySqlId(player.faction);
    if (zone.bandId == player.faction) return player.utils.error(`Территория уже под контролем ${faction.name}!`);

    if (zone.capture) return player.utils.error(`На данной территории уже происходит захват!`);
    for (var id in alt.bandZones) {
        let z = alt.bandZones[id];
        if (!z.capture) continue;
        if (z.capture.bandId == player.faction) return player.utils.error(`${faction.name} уже напала на территорию!`);
        if (z.bandId == player.faction && z.capture.bandId == zone.bandId) return player.utils.error(`${alt.factions.getBySqlId(zone.bandId).name} напала на Вас раньше!`);
    }

    if (alt.economy["capt_interval"].value) {
        var minutes = new Date().getMinutes();
        if (minutes) return player.utils.error(`Не подходящее время для захвата!`);
        var hours = new Date().getHours();
        if (hours % alt.economy["capt_interval"].value) return player.utils.error(`В данный период захват не доступен!`);
    }

    zone.startCapture(player.faction);
});
alt.onClient("band.capture.exitBandZone", (player) => {
    var gangwar = player.getSyncedMeta("gangwar");
    if (!gangwar) return;
    var zone = alt.bandZones[gangwar];
    if (!zone.contains(player.pos)) {
        zone.leaveCapture(player);
        player.utils.success(`Вы покинули захват!`);
    }
});
