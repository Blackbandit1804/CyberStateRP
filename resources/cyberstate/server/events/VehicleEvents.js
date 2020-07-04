alt.onClient("vehicle.engine.on", (player) => {
    if (!player.vehicle) return;
    player.vehicle.utils.engineOn();
});

alt.onClient("setLeftSignal", (player, enable) => {
    if (!player.vehicle) return;
    player.vehicle.setSyncedMeta("leftSignal", enable);
    player.vehicle.setSyncedMeta("rightSignal", false);
});

alt.onClient("setRightSignal", (player, enable) => {
    if (!player.vehicle) return;
    player.vehicle.setSyncedMeta("rightSignal", enable);
    player.vehicle.setSyncedMeta("leftSignal", false);
});

alt.onClient("setEmergencySignal", (player, enable) => {
    if (!player.vehicle) return;
    player.vehicle.setSyncedMeta("rightSignal", enable);
    player.vehicle.setSyncedMeta("leftSignal", enable);
});

alt.onClient("belt.putOn", (player, enable) => {
    if (!player.vehicle) return;
});

alt.onClient("sirenSound.on", (player) => {
    //debug(`sirenSound.on`)
    if (!player.vehicle) return;
    var sirenSound = player.vehicle.getSyncedMeta("sirenSound");
    player.vehicle.setSyncedMeta("sirenSound", !sirenSound);
});

alt.onClient("addMileage", (player, value) => {
    //debug(`addMileage: ${value}`)
    // if (!player.vehicle) return terminal.error(`event "addMileage": ${player.getSyncedMeta("name")} не в машине, но таймер обновления пробега сработал!`);
    if (!player.vehicle) return;
    player.vehicle.utils.addMileage(value);
});

alt.onClient("sellCar", (player) => {
    if (!player.colshape || !player.colshape.blackMarket) return player.utils.error(`Вы не возле черного рынка!`);
    if (!player.carIds.length) return player.utils.error(`Нет доступных авто для продажи!`);
    for (var i = 0; i < player.carIds.length; i++) {
        var veh = alt.Vehicle.at(player.carIds[i]);
        var dist = alt.Player.dist(player.pos, veh.pos);
        if (player.sqlId + 2000 != veh.owner) continue;
        if (dist > 15) continue;
        else {
            alt.autosaloons.vehicles.forEach((car) => {
                if (car.modelHash == veh.model) {
                    alt.emitClient(player, "choiceMenu.show", "sellcar_confirm", {
                        price: car.price,
                        model: car.model
                    });

                    player.sellCarOffer = {
                        price: car.price,
                        vehSqlId: veh.sqlId,
                        model: car.model,
                    };
                }
            });
        }
        return;
    }

    return player.utils.error(`Нет доступных авто поблизости!`);
});

alt.onClient("car.sell.agree", (player) => {
    var veh = alt.Vehicle.getBySqlId(player.sellCarOffer.vehSqlId);
    var price = alt.randomInteger(70, 80);
    var count = player.sellCarOffer.price * price / 100;

    alt.fullDeleteItemsByParams(54, ["car", "owner"], [veh.sqlId, veh.owner - 2000]);
    DB.Query(`DELETE FROM vehicles WHERE id=?`, [veh.sqlId]);

    var index = player.carIds.indexOf(veh.id);
    if (index != -1) player.carIds.splice(index, 1);

    for (var i = 0; i < player.cars.length; i++) {
        if (player.cars[i].id == veh.id) {
            player.cars.splice(i, 1);
            i--;
        }
    }

    alt.emitClient(player, `playerMenu.cars`, player.cars);

    player.utils.setMoney(player.money + count);
    player.utils.success(`Автомобиль продан!`);

    veh.destroy();

    delete player.sellCarOffer;
});

alt.onClient("car.sell.cancel", (player) => {
    delete player.sellCarOffer;
});

alt.onClient("sellCarPlayer", (player, params) => {
    params = JSON.parse(params);

    var invitePlayer = null;
    if (parseInt(params[0]) >= 0) invitePlayer = alt.Player.getBySqlId(parseInt(params[0]));
    else invitePlayer = alt.Player.getByName(params[0]);
    if (!invitePlayer) return player.utils.error("Гражданин не найден!");
    if(player.sqlId === invitePlayer.sqlId) return player.utils.error("Нельзя продать авто самому себе!");
    var dist = alt.Player.dist(player.pos, invitePlayer.pos);
    if (dist > Config.maxInteractionDist) return player.utils.error(`Гражданин слишком далеко!`);

    var price = parseInt(params[1]);
    if (price <= 0) return player.utils.error(`Неверная цена!`);

    var keys = player.inventory.getItem(params[2]);
    if (!keys) return player.utils.error(`Ключи от авто не найдены!`);
    if (player.sqlId != keys.params.owner) return player.utils.error(`Вы не владелец авто!`);

    var veh = alt.Vehicle.getBySqlId(keys.params.car);
    if (!veh) return player.utils.error(`Авто не найдено!`);

    var dist = alt.Player.dist(player.pos, veh.pos);
    if (dist > 10) return player.utils.error(`Авто слишком далеко!`);

    alt.emitClient(player, "choiceMenu.show", "sellcarplayer_confirm", {
        name: invitePlayer.getSyncedMeta("name"),
        price: price,
        model: keys.params.model
    });

    player.sellCarOffer = {
        invitePlayerId: invitePlayer.sqlId,
        price: price,
        keysSqlId: params[2],
        model: keys.params.model,
        isHigh: false
    };
});

alt.onClient("car.sellplayer.agree", (player) => {
    if (!player.sellCarOffer) return player.utils.error(`Предложение не найдено!`);

    var invitePlayer = alt.Player.getBySqlId(player.sellCarOffer.invitePlayerId);
    if (!invitePlayer) return player.utils.error(`Покупатель не найден!`);

    var dist = alt.Player.dist(player.pos, invitePlayer.pos);
    if (dist > Config.maxInteractionDist) return player.utils.error(`Покупатель далеко!`);
    if (player.sqlId == invitePlayer.sqlId) return player.utils.error(`Нельзя продать авто самому себе!`);


    alt.emitClient(invitePlayer, "choiceMenu.show", "buycarplayer_confirm", {
        name: player.getSyncedMeta("name"),
        price: player.sellCarOffer.price,
        model: player.sellCarOffer.model,
    });

    invitePlayer.sellCarOffer = {
        ownerId: player.sqlId,
        price: player.sellCarOffer.price
    };
});

alt.onClient("car.sellplayer.cancel", (player) => {
    if (!player.sellCarOffer) return;
    delete player.sellCarOffer;
});

alt.onClient("car.fix.accept", (player, sqlId) => {
    if (player.money < 0) return player.utils.error(`Недостаточно средств!`);
    alt.emitClient(player, "item.fixCarByKeys", sqlId);
});

alt.onClient("car.buycarplayer.agree", (player) => {
    if (!player.sellCarOffer) return player.utils.error(`Предложение не найдено!`);
    if (player.carIds.length + 1 > player.donateCars) return player.utils.error(`Нельзя приобрести больше!`);
    var owner = alt.Player.getBySqlId(player.sellCarOffer.ownerId);
    if (!owner) return player.utils.error(`Продавец не найден!`);

    var dist = alt.Player.dist(player.pos, owner.pos);
    if (dist > Config.maxInteractionDist) return player.utils.error(`Продавец далеко!`);
    // if (player.sqlId == owner.id) return player.utils.error(`Нельзя продать дом самому себе!`);

    if (!owner.sellCarOffer) return player.utils.error(`Предложение у продавца не найдено!`);

    var keys = owner.inventory.getItem(owner.sellCarOffer.keysSqlId);
    if (!keys) {
        player.utils.error(`У продавца нет ключей от авто!`);
        return owner.utils.error(`Ключи от авто не найдены!`);
    }
    if (owner.sqlId != keys.params.owner) return owner.utils.error(`Гражданин не владелец авто!`);

    var veh = alt.Vehicle.getBySqlId(keys.params.car);
    if (!veh) return player.utils.error(`Авто не найдено!`);

    var dist = alt.Player.dist(player.pos, veh.pos);
    if (dist > 10) return player.utils.error(`Авто слишком далеко!`);

    if (veh.owner - 2000 != owner.sqlId) return player.utils.error(`Владелец авто - другой гражданин!`);

    var freeSlot = player.inventory.findFreeSlot(54);
    if (!freeSlot) {
        player.utils.error(`Освободите место для ключей!`);
        return owner.utils.error(`Гражданину необходимо место для ключей!`);
    }

    var price = player.sellCarOffer.price;
    if (player.money < price) {
        owner.utils.error(`${player.getSyncedMeta("name")} не имеет ${price}$`);
        return player.utils.error(`Необходимо: ${price}$`);
    }

    var houses = alt.houses.getArrayByOwner(player.sqlId);
    alt.autosaloons.vehicles.forEach((car) => {
        if (car.modelHash == veh.model) {
            if (car.price >= 30000 && houses.length <= 0) {
                owner.utils.error(`${player.getSyncedMeta("name")} не имеет жилья`);
                player.sellCarOffer.isHigh = true;
                return player.utils.error(`Чтобы приобрести транспорт стоимостью больше 30.000$, требуется приобрести жилье`);
            }
        }
    });

    if (player.sellCarOffer.isHigh) return;

    var params = {
        owner: player.sqlId,
        car: veh.sqlId,
        model: owner.sellCarOffer.model
    };


    player.inventory.add(54, params, null, (e) => {
        if (e) return player.utils.error(e);
        owner.utils.setMoney(owner.money + price);
        player.utils.setMoney(player.money - price);
        veh.utils.setOwner(player.sqlId + 2000);

        alt.logs.addLog(`${owner.name} продал автомобиль ${params.model} за ${price} игроку ${player.getSyncedMeta("name")}`, 'car', owner.account.id, owner.sqlId, { model: params.model, price: price });
        alt.logs.addLog(`${player.getSyncedMeta("name")} купил автомобиль ${params.model} за ${price} у ${owner.name}`, 'car', player.account.id, player.sqlId, { model: params.model, price: price });

        owner.utils.success(`Авто ${veh.name} продано`);
        player.utils.success(`Авто ${veh.name} куплено`);

        var index = owner.carIds.indexOf(veh.id);
        if (index != -1) owner.carIds.splice(index, 1);
        player.cars.push({ id: veh.id, name: params.model });
        player.carIds.push(veh.id);

        owner.inventory.delete(owner.sellCarOffer.keysSqlId);
        delete player.sellCarOffer;
        delete owner.sellCarOffer;

        for (var i = 0; i < owner.cars.length; i++) {
            if (owner.cars[i].name == params.model) {
                owner.cars.splice(i, 1);
                i--;
            }
        }

        alt.emitClient(player, `playerMenu.cars`, player.cars);
        alt.emitClient(owner, `playerMenu.cars`, owner.cars);
    });
});

alt.onClient("car.buycarplayer.cancel", (player) => {
    if (!player.sellCarOffer) return;
    var owner = alt.Player.getBySqlId(player.sellCarOffer.ownerId);
    if (owner) {
        owner.utils.info(`${player.getSyncedMeta("name")} отменил предложение`);
        delete owner.sellCarOffer;
    }
    delete player.sellCarOffer;
});
