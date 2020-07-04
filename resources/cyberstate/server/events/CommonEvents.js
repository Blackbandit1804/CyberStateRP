
alt.onClient("get.players.ping", (player) => {
    var pings = [];
    alt.Player.all.forEach((rec) => {
        if (rec.sqlId) pings.push(rec.ping);
    });

    alt.emitClient(player, "setLocalVar", "playerPings", pings);
});

alt.onClient("playAnimation", (player, animIndex) => {
    var list = require('../anim_list.js');
    var params = list[animIndex].split(' ');
    if (animIndex < 0) animIndex = 0;
    if (animIndex >= list.length) animIndex = list.length - 1;
    alt.emitClient(player, `Anim::play`, params[0], params[1], 1, 1);
    alt.emitClient(player, "setLocalVar", "animName", list[animIndex]);
});

alt.onClient("arrestAnimation", (player) => {
    alt.emitClient(player, `Anim::play`, "mp_arresting", 'idle', 1, 49);
});

alt.onClient("anim", (player, animDict, animName, flag = 0, time = 3000) => {
    alt.emitClient(player, `Anim::play`, animDict, animName, 1, 1);
    var playerId = player.sqlId;
    setSaveTimeout(() => {
        try {
            player = alt.Player.getBySqlId(playerId);
            if (!player) return -1;
            alt.emitClient(player, `Anim::play`, "missheist_agency2aig_13", "pickup_briefcase_upperbody", 1, flag);
        } catch (e) {
            alt.log(e);
        }
    }, time);
});

alt.onClient("mpStorage.update", (player, hashes) => {
    //debug(`${player.getSyncedMeta("name")} called mpStorage.update: ${hashes}`);
    hashes = JSON.parse(hashes);
    var keys = {
        "inventoryItems": () => {
            return alt.inventory.items;
        }
    };
    for (var key in hashes) {
        var value = keys[key]();
        var hash = getHash(JSON.stringify(value));
        if (hash != hashes[key]) alt.emitClient(player, "setMpStorageVar", key, value);
    }
});

alt.onClient("item.eat", (player, sqlId) => {
    var item = player.inventory.getItem(sqlId);
    if (!item) return player.utils.error(`Предмет не найден!`);
    if (!item.params.satiety && !item.params.thirst) return player.utils.error(`Предмет несъедобный!`);

    player.utils.setSatiety(player.satiety + item.params.satiety);
    player.utils.setThirst(player.thirst + item.params.thirst);
    player.utils.success(`Сытость ${player.satiety}/100 ед.`);
    player.utils.success(`Жажда ${player.thirst}/100 ед.`);

    player.inventory.delete(sqlId);
});

alt.onClient("item.fuelCar", (player, vehId) => {
    var veh = alt.Vehicle.at(vehId);
    if (!veh) return player.utils.error(`Авто не найдено!`);
    var dist = alt.Player.dist(player.pos, veh.pos);
    if (dist > Config.maxInteractionDist) return player.utils.error(`Авто далеко!`);

    var canisters = player.inventory.getArrayByItemId(36);
    if (!Object.keys(canisters).length) return player.utils.error(`Канистра не найдена!`);

    for (var key in canisters) {
        var item = canisters[key];
        var fuel = Math.clamp(item.params.count, 0, veh.vehPropData.maxFuel - veh.vehPropData.fuel);
        if (!fuel) continue;
        item.params.count -= fuel;
        player.inventory.updateParams(item.id, item);
        veh.utils.setFuel(veh.vehPropData.fuel + fuel);
        return player.utils.success(`Бак ${veh.vehPropData.fuel}/${veh.vehPropData.maxFuel} л.`);
    }
    return player.utils.error(`Канистры пустые!`);
});

alt.onClient("item.throwfromvehicle", (player, vehId, playerId) => {
    var veh = alt.Vehicle.at(vehId);
    if (!veh) return player.utils.error(`Авто не найдено!`);
    var dist = alt.Player.dist(player.pos, veh.pos);
    if (dist > Config.maxInteractionDist && !player.vehicle) return player.utils.error(`Авто далеко!`);

    var keys = player.inventory.getArrayByItemId(54);
    if (!keys) return player.utils.error(`Ключи авто не найдены!`);
    var rec = alt.Player.getBySqlId(playerId);
    for (var key in keys) {
        if (keys[key].params.car == veh.sqlId) {
            if (!rec) return player.utils.error(`Пассажир не найден!`, player);
            if (rec.vehicle == veh) {
                player.utils.success("Вы выкинули пассажира из транспорта!");
                alt.emitClient(rec, `Vehicle::leave`, veh);
                rec.utils.error("Водитель выкинул вас из транспорта!");
                return;
            } else {
                return player.utils.error("Пассажир не в вашем транспорте!");
            }
        }
    }
    if (rec.hasTie) {
        player.utils.success("Вы выкинули пассажира из транспорта!");
        alt.emitClient(rec, `Vehicle::leave`, veh);
        rec.utils.error("Водитель выкинул вас из транспорта!");
        return;
    }
    player.utils.error(`Ключи от ${veh.name} не найдены!`);
});

alt.onClient("item.lockCar", (player, vehId) => {
    var veh = alt.Vehicle.at(vehId);
    if (!veh) return player.utils.error(`Авто не найдено!`);
    var dist = alt.Player.dist(player.pos, veh.pos);
    if (dist > Config.maxInteractionDist && !player.vehicle) return player.utils.error(`Авто далеко!`);

    var keys = player.inventory.getArrayByItemId(54);
    if (!keys) return player.utils.error(`Ключи авто не найдены!`);

    for (var key in keys) {
        if (keys[key].params.car == veh.sqlId) {
            veh.lockState = veh.lockState !== 2 ? 2 : 1;
            if (veh.lockState !== 1) return player.utils.success(`${veh.name} закрыт`);
            else return player.utils.success(`${veh.name} открыт`);
        }
    }
    player.utils.error(`Ключи от ${veh.name} не найдены!`);
});

alt.onClient("item.lockCarByKeys", (player, keysSqlId) => {
    var keys = player.inventory.getItem(keysSqlId);
    if (!keys) return player.utils.error(`Ключи авто не найдены!`);
    if (!keys.params.car) return player.utils.error(`Авто от ключей неизвестно!`);

    var veh = alt.Vehicle.getBySqlId(keys.params.car);
    if (!veh) return player.utils.error(`Авто не найдено!`);
    var dist = alt.Player.dist(player.pos, veh.pos);
    if (dist > Config.maxInteractionDist) return player.utils.error(`Авто далеко!`);

    veh.lockState = veh.lockState !== 2 ? 2 : 1;
    if (veh.lockState !== 1) return player.utils.success(`${veh.name} закрыт`);
    else return player.utils.success(`${veh.name} открыт`);
});

alt.onClient("item.searchCarByKeys", (player, keysSqlId) => {
    var keys = player.inventory.getItem(keysSqlId);
    if (!keys) return player.utils.error(`Ключи авто не найдены!`);
    if (!keys.params.car) return player.utils.error(`Авто от ключей неизвестно!`);

    var veh = alt.Vehicle.getBySqlId(keys.params.car);
    if (!veh) return player.utils.error(`Авто не найдено!`);

    alt.emitClient(player, "setNewWaypoint", veh.pos.x, veh.pos.y);
    player.utils.success(`${veh.name} отмечен на карте`);
});

alt.onClient("item.fixCarByKeys", (player, keysSqlId, outPosition, outHeading) => {
    var keys = player.inventory.getItem(keysSqlId);
    if (!keys.params.car) return player.utils.error(`Авто от ключей неизвестно!`);

    var veh = alt.Vehicle.getBySqlId(keys.params.car);
    if (!veh) return player.utils.error(`Авто не найдено!`);
    if (veh.owner != player.sqlId + 2000) return player.utils.error(`Вы не владелец авто!`);

    let occupants = 0;

    alt.Player.all.forEach((rec) => {
        if (rec.vehicle && rec.vehicle === veh) occupants += 1;
    });

    if (occupants > 0) return player.utils.error(`Авто занято!`);

    if (player.money < 0) return player.utils.error(`Недостаточно средств!`);

    var pos = JSON.parse(outPosition);

    alt.emitClient(player, `Vehicle::repair`, veh);
    veh.pos = new alt.Vector3(pos.x, pos.y - 8, pos.z + 0.5);
    veh.rot = new alt.Vector3(0, 0, parseFloat(outHeading) * Math.PI / 180);
    veh.engineOn = false;

    veh.setSyncedMeta("leftSignal", false);
    veh.setSyncedMeta("rightSignal", false);

    alt.emitClient(player, "setNewWaypoint", veh.pos.x, veh.pos.y);
    player.utils.setMoney(player.money - 0);
    player.utils.success(`${veh.name} отмечен на карте`);
});

alt.onClient("item.searchHouseByKeys", (player, keysSqlId) => {
    var keys = player.inventory.getItem(keysSqlId);
    if (!keys) return player.utils.error(`Ключи не найдены!`);
    if (!keys.params.house) return player.utils.error(`Дом от ключей неизвестен!`);

    var house = alt.houses.getBySqlId(keys.params.house);
    if (!house) return player.utils.error(`Дом не найден!`);

    alt.emitClient(player, "setNewWaypoint", house.pos.x, house.pos.y);
    player.utils.success(`Дом №${house.sqlId} отмечен на карте`);
});

alt.onClient("item.parkCarByKeys", (player, keysSqlId) => {
    var keys = player.inventory.getItem(keysSqlId);
    if (!keys) return player.utils.error(`Ключи авто не найдены!`);
    if (!keys.params.car) return player.utils.error(`Авто от ключей неизвестно!`);

    var veh = alt.Vehicle.getBySqlId(keys.params.car);
    if (!veh) return player.utils.error(`Авто не найдено!`);
    var dist = alt.Player.dist(player.pos, veh.pos);
    if (dist > Config.maxInteractionDist) return player.utils.error(`Авто далеко!`);
    veh.pos.z += 0.5;

    var pos = veh.pos;
    pos.rot = new alt.Vector3(0, 0, veh.rot.z * Math.PI / 180);
    veh.utils.setSpawnPos(pos);
    player.utils.success(`${veh.name} припаркован!`);
});

alt.onClient("setInvis.admin", (rec) => {
    if (rec.admin <= 0) return;
    if (rec.getSyncedMeta("ainvis")) {
        rec.setSyncedMeta("ainvis", null);
    } else {
        rec.setSyncedMeta("ainvis", true);
    }
});

alt.onClient("requestClothes", (player, clientCounts) => {
    // debug(`requestClothes: ${player.getSyncedMeta("name")} ${clientCounts}`)
    clientCounts = JSON.parse(clientCounts);
    var serverCounts = alt.getArrayClothesCounts();
    // debug(`serverCounts: ${serverCounts}`);
    const clothes = [];

    var names = ["bracelets", "ears", "feets", "glasses", "hats", "legs", "masks", "ties", "top", "watches", "underwear"];

    for (var i = 0; i < serverCounts.length; i++) {
        if (clientCounts[i] != serverCounts[i]) {
            clothes.push(alt.clothes[names[i]]);
        }
    }

    alt.emitClient(player, `setMpStorageVarClothes`, JSON.stringify(clothes));
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

alt.onClient("vehicle.hood", (player, vehId) => {
    var veh = alt.Vehicle.at(vehId);
    if (!veh) return player.utils.error(`Авто не найдено!`);
    var dist = alt.Player.dist(player.pos, veh.pos);
    if (dist > 10) return player.utils.error(`Авто далеко!`);
    if (!veh.getSyncedMeta("hood") && veh.lockState !== 1) return player.utils.error(`Авто закрыто!`);


    if (!veh.sqlId || alt.isFactionVehicle(veh) || alt.isJobVehicle(veh)) {
        veh.setSyncedMeta("hood", !veh.getSyncedMeta("hood"));
        if (veh.getSyncedMeta("hood")) return player.utils.success(`Капот открыт`);
        else return player.utils.success(`Капот закрыт`);
    }

    var keys = player.inventory.getArrayByItemId(54);
    if (Object.keys(keys).length == 0) return player.utils.error(`Ключи авто не найдены!`);
    for (var sqlId in keys) {
        if (keys[sqlId].params.car == veh.sqlId) {
            veh.setSyncedMeta("hood", !veh.getSyncedMeta("hood"));
            if (veh.getSyncedMeta("hood")) return player.utils.success(`Капот открыт`);
            else return player.utils.success(`Капот закрыт`);
        }
    }
    player.utils.error(`Ключи от ${veh.name} не найдены!`);
});

alt.onClient("vehicle.boot", (player, vehId) => {
    var veh = alt.Vehicle.at(vehId);
    if (!veh) return player.utils.error(`Авто не найдено!`);
    var dist = alt.Player.dist(player.pos, veh.pos);
    if (dist > 10) return player.utils.error(`Авто далеко!`);
    if (veh.bootPlayerId != null && veh.bootPlayerId != player.sqlId && veh.getSyncedMeta("boot")) return player.utils.error(`Нельзя закрыть багажник вовремя взаимодействия другого гражданина!`);
    if (!veh.inventory) return player.utils.error(`Авто не имеет багажник!`);
    if (!veh.getSyncedMeta("boot") && veh.lockState !== 1) return player.utils.error(`Авто закрыто!`);

    if (!veh.sqlId || alt.isFactionVehicle(veh) || alt.isJobVehicle(veh)) {
        if (alt.isFactionVehicle(veh)) {
            if (player.faction != veh.owner) {
                return player.utils.error(`Вы не состоите в ${alt.factions.getBySqlId(veh.owner).name}`);
            } else {
                veh.setSyncedMeta("boot", !veh.getSyncedMeta("boot"));
                if (veh.getSyncedMeta("boot")) return player.utils.success(`Багажник открыт`);
                else return player.utils.success(`Багажник закрыт`);
            }
        } else {
            veh.setSyncedMeta("boot", !veh.getSyncedMeta("boot"));
            if (veh.getSyncedMeta("boot")) return player.utils.success(`Багажник открыт`);
            else return player.utils.success(`Багажник закрыт`);
        }
    }
    if (alt.isFarmVehicle(veh)) {
        if (!player.farmJob) return player.utils.error(`Вы не работаете на ферме!`);
        var jobName = alt.farms.getJobName(1);
        if (player.farmJob.type != 1) return player.utils.error(`Вы не ${jobName}!`);
        veh.setSyncedMeta("boot", !veh.getSyncedMeta("boot"));
        if (veh.getSyncedMeta("boot")) return player.utils.success(`Багажник открыт`);
        else return player.utils.success(`Багажник закрыт`);
    }

    var keys = player.inventory.getArrayByItemId(54);
    if (Object.keys(keys).length == 0) return player.utils.error(`Ключи авто не найдены!`);
    for (var sqlId in keys) {
        if (keys[sqlId].params.car == veh.sqlId) {
            veh.setSyncedMeta("boot", !veh.getSyncedMeta("boot"));
            if (veh.getSyncedMeta("boot")) return player.utils.success(`Багажник открыт`);
            else return player.utils.success(`Багажник закрыт`);
        }
    }
    player.utils.error(`Ключи от ${veh.name} не найдены!`);
});

alt.onClient("vehicle.products", (player, vehId) => {
    var veh = alt.Vehicle.at(vehId);
    if (!veh) return player.utils.error(`Авто не найдено!`);
    var dist = alt.Player.dist(player.pos, veh.pos);
    if (dist > 10) return player.utils.error(`Авто далеко!`);
    if (!veh.getSyncedMeta("boot")) return player.utils.error(`Багажник закрыт!`);
    if (alt.isFactionVehicle(veh)) {
        var attachedObject = player.getSyncedMeta("attachedObject");
        if (!veh.products) veh.products = 0;
        var models = ["prop_box_ammo04a", "ex_office_swag_pills4"];
        var index = models.indexOf(attachedObject);
        var max = alt.economy["faction_products_veh_maxcount"].value;
        if (index != -1) {
            player.utils.putObject();
            if (index == 0 && !alt.factions.isArmyFaction(veh.owner)) return player.utils.error(`Неверный тип товара!`);
            if (index == 1 && !alt.factions.isHospitalFaction(veh.owner)) return player.utils.error(`Неверный тип товара!`);
            if (veh.products > max) return player.utils.error(`Багажник заполнен!`);
            veh.products += alt.economy["faction_products_count"].value;
            if (veh.products > max) veh.products = max;
        } else {
            if (!veh.products || veh.products < alt.economy["faction_products_count"].value)
                return player.utils.error(`В авто недостаточно товара!`);

            var model = null;
            if (alt.factions.isArmyFaction(veh.owner)) model = models[0];
            if (alt.factions.isHospitalFaction(veh.owner)) model = models[1];
            if (!model) return player.utils.error(`В багажнике запрещенный товар!`);

            veh.products -= alt.economy["faction_products_count"].value;
            if (veh.products < 0) veh.products = alt.economy["faction_products_count"].value;

            player.utils.takeObject(model);
        }
        player.utils.success(`Товар: ${veh.products} из ${max} ед.`);
    } else if (alt.isFarmVehicle(veh)) {
        if (!player.farmJob) return player.utils.error(`Вы не работаете на ферме!`);
        var jobName = alt.farms.getJobName(player.farmJob.type);
        if (player.farmJob.type != 0 && player.farmJob.type != 1) return player.utils.error(`Должность ${jobName} не занимается сбором урожая!`);


        var attachedObject = player.getSyncedMeta("attachedObject");
        var models = ["prop_veg_crop_03_pump", "prop_veg_crop_03_cab", "prop_weed_02"];
        var index = models.indexOf(attachedObject);
        var max = 200;
        if (index != -1) {
            if (!veh.crop) veh.crop = {
                type: index + 1,
                count: 0
            };
            player.utils.putObject();
            if (veh.crop.type != index + 1) return player.utils.error(`Неверный тип урожая!`);
            if (veh.crop.count > max) return player.utils.error(`Багажник заполнен!`);
            veh.crop.count++;
        } else {
            return player.utils.error(`Соберите урожай!`);
        }
        setVehCropLoad(veh);
        player.utils.success(`Урожай: ${veh.crop.count} из ${max} ед.`);
    } else {
        player.utils.error(`В авто нельзя положить товар!`);
    }
});

alt.onClient("knockDown", (player, enable) => {
    if (enable) alt.emit("hospital.addCall", player, "Необходима реанимация.");
    else {
        alt.Player.all.forEach((rec) => {
            if (alt.factions.isHospitalFaction(rec.faction)) {
                alt.emitClient(rec, `tablet.medic.removeCall`, player.sqlId);
            }
        });
        delete player.hospitalCallTime;
    }

    player.setSyncedMeta("knockDown", enable);
});

alt.onClient("familiar.createOffer", (player, recId) => {
    var rec = alt.Player.getBySqlId(recId);
    if (!rec) return player.utils.error(`Гражданин не найден!`);
    var dist = alt.Player.dist(player.pos, rec.pos);
    if (dist > Config.maxInteractionDist) return player.utils.error(`Гражданин далеко!`);
    if (player.hasCuffs) return player.utils.error(`Вы в наручниках!`);
    if (rec.hasCuffs) return player.utils.error(`Гражданин в наручниках!`);

    rec.offer = { playerId: player.sqlId };

    alt.emitClient(rec, `choiceMenu.show`, "accept_familiar");
    player.utils.success(`Вы предложили познакомиться`);
});

alt.onClient("familiar.offer.agree", (player) => {
    if (!player.offer) return player.utils.error(`Предложение не найдено!`);

    var rec = alt.Player.getBySqlId(player.offer.playerId);
    if (!rec) return player.utils.error(`Гражданин не найден!`);

    var dist = alt.Player.dist(player.pos, rec.pos);
    if (dist > Config.maxInteractionDist) return player.utils.error(`Гражданин далеко!`);
    if (player.hasCuffs) return player.utils.error(`Вы в наручниках!`);
    if (rec.hasCuffs) return player.utils.error(`Гражданин в наручниках!`);


    delete player.offer;

    //alt.emit(`animation.set`, player, 33);
    //alt.emit(`animation.set`, rec, 34);

    alt.emitClient(player, `familiar.add`, rec.getSyncedMeta("name"), rec.sqlId);
    alt.emitClient(rec, `familiar.add`, player.getSyncedMeta("name"), player.sqlId);
});

alt.onClient("familiar.offer.cancel", (player) => {
    if (!player.offer) return player.utils.error(`Предложение не найдено!`);

    var rec = alt.Player.getBySqlId(player.offer.playerId);
    delete player.offer;
    player.utils.success(`Знакомство отклонено`);
    if (!rec) return;
    delete rec.offer;

    rec.utils.success(`Гражданин отклонил знакомство`);
});

alt.onClient("attachedObject.throw", (player) => {
    if (player.job === 9 && player.getSyncedMeta("attachedObject") === "hei_prop_heist_binbag") return;
    //debug(`attachedObject.throw: ${player.getSyncedMeta("name")}`)
    if (player.job === 7) {
        let jobOpen = require("../modules/jobs/builder/job.js");
        if (player.builder) jobOpen.stopBringingLoad(player);
        else if (player.getSyncedMeta("attachedObject") === "hei_prop_heist_wooden_box" && player.jobbuilderfloor > -1) jobOpen.stopBringingBox(player);
    }
    if (player.job === 8) {
        let jobOpen = require("../modules/jobs/waterfront/waterfront.js");
        if (player.getSyncedMeta("attachedObject") === "hei_prop_heist_wooden_box" && player.boxwaterfront) jobOpen.stopBringingBox(player);
    }
    player.utils.putObject();
    player.utils.success(`Вы уронили груз!`);
});

alt.onClient("emotions.set", (player, index) => {
    // debug(`emotions.set: ${player.getSyncedMeta("name")} ${index}`)
    var emotions = [null, "mood_aiming_1", "mood_angry_1", "mood_happy_1", "mood_stressed_1", "mood_sulk_1"];
    index = Math.clamp(index, 0, emotions.length - 1);
    player.setSyncedMeta("emotion", emotions[index]);
});

alt.onClient("walking.set", (player, index) => {
    // debug(`walking.set: ${player.getSyncedMeta("name")} ${index}`)
    var walkings = [null, "move_m@brave", "move_m@confident", "move_m@shadyped@a", "move_m@quick", "move_m@sad@a", "move_m@fat@a"];
    index = Math.clamp(index, 0, walkings.length - 1);
    player.setSyncedMeta("walking", walkings[index]);
});

alt.on("animation.set", (player, index) => {
    if (player.getSyncedMeta("attachedObject")) return;
    if (player.getSyncedMeta("animation") === index) index = null;
    player.setSyncedMeta("animation", index);
});

alt.onClient("scenario.set", (player, index) => {
    if (player.getSyncedMeta("attachedObject")) return;
    if (player.getSyncedMeta("scene") === index) return;
    player.setSyncedMeta("scene", index);
});

alt.onClient("animation.set", (player, index) => {
    if (player.getSyncedMeta("attachedObject")) return;
    if (player.getSyncedMeta("animation") === index) return;
    player.setSyncedMeta("animation", index);
});

alt.onClient('toggleSmoke', (player) => {
    // debug(`toggleSmoke: ${player.getSyncedMeta("name")}`);
    if (player && player.vehicle && player.seat === 1) player.vehicle.setSyncedMeta('smokeActive', !player.vehicle.getSyncedMeta('smokeActive'));
});

alt.onClient('admin.chat.push', (player, data) => {
    // debug(`admin.chat.push: ${player.getSyncedMeta("name")} ${data}`)
    data = JSON.parse(data);
    var message = data[0].substr(0, 100).trim();
    alt.Player.all.forEach((rec) => {
        if (rec.sqlId && rec.admin) alt.emitClient(rec, `console.chat`, {
            admin: player.admin,
            name: player.getSyncedMeta("name"),
            id: player.sqlId
        }, message);
    });
});
