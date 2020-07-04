alt.onClient("goInspectHouse", (player) => {
    alt.log(`goInspectHouse: ${player.getSyncedMeta("name")}`);
});

alt.onClient("goLockUnlockHouse", (player) => {
    var house;
    if (player.colshape) house = player.colshape.house;
    if (!house) house = alt.houses.getBySqlId(player.inHouse);
    if (!house) return player.utils.error(`Вы далеко от дома!`);

    var keys = player.inventory.getArrayByItemId(59);
    for (var sqlId in keys) {
        if (keys[sqlId].params.house == house.sqlId) {
            if (house.closed) house.setClosed(0);
            else house.setClosed(1);
            alt.emitClient(player, "houseOwnerMenu.update", true, house.closed);
            return;
        }
    }
    player.utils.error(`Ключ от дома не найдены!`);
});

alt.onClient("goBuyHouse", (player) => {
    const houses = alt.houses.getArrayByOwner(player.sqlId);
    if (!player.colshape || !player.colshape.house) return player.utils.error(`Вы не у дома!`);
    let house = player.colshape.house;
    if (house.owner) return player.utils.error(`Дом уже куплен!`);

    if (player.money < house.price) return player.utils.error(`Необходимо: ${house.price}$`);
    if (houses.length >= player.donateHouse) return player.utils.error(`Вы имеете максимальное количество жилья`);
    var freeSlot = player.inventory.findFreeSlot(59);
    if (!freeSlot) return player.utils.error(`Освободите место для ключей!`);

    alt.fullDeleteItemsByParams(59, ["house"], [house.sqlId]);
    player.inventory.add(59, {
        owner: player.sqlId,
        house: house.sqlId
    }, null, (e) => {
        if (e) return player.utils.error(e);

        player.utils.setMoney(player.money - house.price);
        house.setOwner(player.sqlId, player.getSyncedMeta("name"));
        player.utils.addHouse(house);

        player.utils.setSpawn(1);
        player.utils.setHouseId(house.sqlId);

        player.utils.success(`Дом ${house.sqlId} куплен`);
        alt.logs.addLog(`${player.getSyncedMeta("name")} купил дом ${house.sqlId}. Цена: ${house.price}`, 'house', player.account.id, player.sqlId, { houseId: house.sqlId, price: house.price });
        alt.emitClient(player, "exitHouseMenu", true);
    });
});

alt.onClient("goEnterHouse", (player) => {
    if (!player.colshape || !player.colshape.house) return player.utils.error(`Вы не у дома!`);
    let house = player.colshape.house;

    if (house.closed) return player.utils.error(`Дом закрыт!`);
    player.inHouse = house.sqlId;

    var interior = alt.interiors.getBySqlId(house.interior);
    if (!interior) return player.utils.error(`Интерьер не найден!`);

    if (house.closed) return player.utils.error(`Дом закрыт!`);

    var pos = new alt.Vector3(interior.x, interior.y, interior.z);
    player.dimension = house.sqlId;
    player.pos = pos;
    player.rot = new alt.Vector3(0, 0, interior.h);
    
    alt.emitClient(player, "exitHouseMenu", true);
});

alt.onClient("goEnterStreet", (player) => {
    if (!player.inHouse) return player.utils.error(`Вы не в доме!`);
    var house = alt.houses.getBySqlId(player.inHouse);
    if (house.closed) return player.utils.error(`Дом закрыт!`);

    player.pos = house.pos;
    player.rot = new alt.Vector3(0, 0, house.h);
    player.dimension = 1;

    var interior = alt.interiors.getBySqlId(house.interior);
    if (!interior) return player.utils.error(`Интерьер не найден!`);

    delete player.inHouse;
});

alt.onClient("goEnterGarage", (player) => {
    var enterHouse = alt.houses.getBySqlId(player.inHouse);
    if (!enterHouse) return player.utils.error(`Вы должны быть в доме!`);

    if (!enterHouse.garage) return player.utils.error(`Дом не имеет гараж!`);
    if (enterHouse.garageClosed) return player.utils.error(`Гараж закрыт!`);

    var garage = alt.garages.getBySqlId(enterHouse.garage);
    if (!garage) return player.utils.error(`Дом не имеет гараж!`);

    delete player.inHouse;
    player.inGarage = enterHouse.sqlId;
    var pos = new alt.Vector3(garage.x, garage.y, garage.z);

    player.dimension = enterHouse.sqlId;
    player.pos = pos;
    player.rot = new alt.Vector3(0, 0, garage.h);

    var interior = alt.interiors.getBySqlId(enterHouse.interior);
    if (!interior) return player.utils.error(`Интерьер не найден!`);

    alt.emitClient(player, "exitHouseMenu", true);
});

alt.onClient("goExitGarage", (player) => {
    if (!player.inGarage) return player.utils.error(`Вы не в гараже!`);

    var house = alt.houses.getBySqlId(player.inGarage);
    if (!house) return player.utils.error(`Дом не найден!`);

    var interior = alt.interiors.getBySqlId(house.interior);
    if (!interior) return player.utils.error(`Интерьер от дома не найден!`);

    var pos = new alt.Vector3(interior.garageX, interior.garageY, interior.garageZ);
    player.dimension = house.sqlId;
    player.pos = pos;
    player.rot = new alt.Vector3(0, 0, interior.garageH);
    player.inHouse = player.inGarage;
    delete player.inGarage;
});

alt.onClient("goEnterStreetFromGarage", (player) => {
    if (!player.inGarage) return player.utils.error(`Вы не в гараже!`);

    var exitHouse = alt.houses.getBySqlId(player.inGarage);
    if (exitHouse.garageClosed) return player.utils.error(`Гараж закрыт!`);
    if (!exitHouse.garageH && !exitHouse.garageZ) return player.utils.error(`Нет выхода на улицу!`);

    var pos = new alt.Vector3(exitHouse.garageX, exitHouse.garageY, exitHouse.garageZ);
    player.dimension = 1;
    player.pos = pos;
    player.rot = new alt.Vector3(0, 0, exitHouse.garageH);

    delete player.inGarage;
});

alt.onClient("getHouseInfo", (player) => {
    if (!player.colshape || !player.colshape.house) return player.utils.error(`Вы не у дома!`);
    let house = player.colshape.house;

    var values = [house.sqlId, house.class, house.interior, house.ownerName, house.garage, house.closed, house.price];
    alt.emitClient(player, "infoTable.show", "house_info", values);
});

alt.onClient("getGarageInfo", (player) => {
    var house;
    if (!player.inHouse) house = alt.houses.getBySqlId(player.colshape.garage.houseSqlId); // с улицы смотрим инфо
    else house = alt.houses.getBySqlId(player.inHouse); // из дома смотрим инфо

    if (!house) return player.utils.error(`Дом от гаража не найден!`);

    alt.emitClient(player, "infoTable.show", "garage_info", house.sqlId, house.garage, house.garageClosed);
});

alt.onClient("invitePlayerInHouse", (player, params) => {
    params = JSON.parse(params);
    if (!player.colshape || !player.colshape.house) return player.utils.error(`Вы не у дома!`);
    var house = player.colshape.house;
    if (house.owner != player.sqlId) return player.utils.error(`Вы не владелец дома!`);

    var invitePlayer = null;
    if (parseInt(params[0]) >= 0) invitePlayer = alt.Player.getBySqlId(parseInt(params[0]));
    else invitePlayer = alt.Player.getByName(params[0]);
    if (!invitePlayer) return player.utils.error("Гражданин не найден!");
    else if (player.sqlId === invitePlayer.sqlId) return player.utils.error("Нельзя пригласить самого себя!");
    var dist = alt.Player.dist(player.pos, invitePlayer.pos);
    if (dist > Config.maxInteractionDist) return player.utils.error(`Гражданин слишком далеко!`);

    alt.emitClient(invitePlayer, "choiceMenu.show", "invite_inhouse_confirm", {
        name: player.getSyncedMeta("name")
    });
    invitePlayer.inviteInHouse = house;
});

alt.onClient("house.invite.agree", (player) => {
    if (!player.inviteInHouse) return player.utils.error(`Вы не были приглашены в дом!`);

    var house = player.inviteInHouse;
    var interior = alt.interiors.getBySqlId(house.interior);
    if (!interior) return player.utils.error(`Интерьер не найден!`);
    if (interior.garageMarker && house.garage) interior.garageMarker.showFor(player);

    var pos = new alt.Vector3(interior.x, interior.y, interior.z);
    player.inHouse = house.sqlId;
    player.dimension = house.sqlId;
    player.pos = pos;
    player.rot = new alt.Vector3(0, 0, interior.h);

    delete player.inviteInHouse;
});

alt.onClient("house.invite.cancel", (player) => {
    delete player.inviteInHouse;
});

alt.onClient("sellHouseToGov", (player) => {
    if (!player.inHouse) return player.utils.error(`Продажа осуществляется в доме!`);
    var house = alt.houses.getBySqlId(player.inHouse);
    if (!house) return player.utils.error(`Дом не найден!`);
    if (house.owner != player.sqlId) return player.utils.error(`Вы не владелец дома!`);

    var balance = house.balance;
    if (balance <= 1000) balance = 0;
    var price = parseInt(house.price * alt.economy["house_sell"].value) + balance;
    alt.emitClient(player, "choiceMenu.show", "sellhousegov_confirm", {
        price: price
    });
});

alt.onClient("house.sellgov.agree", (player) => {
    if (!player.inHouse) return player.utils.error(`Продажа осуществляется в доме!`);
    var house = alt.houses.getBySqlId(player.inHouse);
    if (!house) return player.utils.error(`Дом не найден!`);
    if (house.owner != player.sqlId) return player.utils.error(`Вы не владелец дома!`);

    var balance = house.balance;
    if (balance <= 1000) balance = 0;
    var price = parseInt(house.price * alt.economy["house_sell"].value) + balance;
    player.utils.setBankMoney(player.bank + price);
    house.setOwner(0);
    player.utils.removeHouse(house);
    if (player.houseId == house.sqlId) {
        player.utils.setSpawn(3);
        player.utils.setHouseId(0);
    }
    player.utils.bank(`Недвижимость`, `Начислено: ~g~$${price}`);
    player.utils.success(`Дом ${house.sqlId} продан государству!`);
    alt.logs.addLog(`${player.getSyncedMeta("name")} продал дом ${house.sqlId} государству. Цена: ${house.price}`, 'house', player.account.id, player.sqlId, { houseId: house.sqlId, price: house.price });
});

alt.onClient("sellHousePlayer", (player, params) => {
    params = JSON.parse(params);
    if (!player.inHouse) return player.utils.error(`Продажа осуществляется в доме!`);
    var house = alt.houses.getBySqlId(player.inHouse);
    if (!house) return player.utils.error(`Дом не найден!`);
    if (house.owner != player.sqlId) return player.utils.error(`Вы не владелец дома!`);

    var invitePlayer = null;
    if (parseInt(params[0]) >= 0) invitePlayer = alt.Player.getBySqlId(parseInt(params[0]));
    else invitePlayer = alt.Player.getByName(params[0]);
    if (!invitePlayer) return player.utils.error("Гражданин не найден!");
    const houses = alt.houses.getArrayByOwner(invitePlayer.sqlId);
    if(houses.length >= invitePlayer.donateHouse) return player.utils.error("Игрок имеет максимальное количество жилья");
    if(player.sqlId === invitePlayer.sqlId) return player.utils.error("Нельзя продать дом самому себе!");

    var price = parseInt(params[1]);
    if (price <= 0) return player.utils.error(`Неверная цена!`);

    alt.emitClient(player, "choiceMenu.show", "sellhouseplayer_confirm", {
        name: invitePlayer.getSyncedMeta("name"),
        price: price
    });

    player.sellHouseOffer = {
        invitePlayerId: invitePlayer.sqlId,
        price: price
    };
});

alt.onClient("house.sellplayer.agree", (player) => {
    if (!player.inHouse) return player.utils.error(`Продажа осуществляется в доме!`);
    var house = alt.houses.getBySqlId(player.inHouse);
    if (!house) return player.utils.error(`Дом не найден!`);
    if (house.owner != player.sqlId) return player.utils.error(`Вы не владелец дома!`);
    if (!player.sellHouseOffer) return player.utils.error(`Предложение не найдено!`);

    var invitePlayer = alt.Player.getBySqlId(player.sellHouseOffer.invitePlayerId);
    if (!invitePlayer) return player.utils.error(`Покупатель не найден!`);

    var dist = alt.Player.dist(player.pos, invitePlayer.pos);
    if (dist > Config.maxInteractionDist) return player.utils.error(`Покупатель далеко!`);
    if (player.sqlId == invitePlayer.sqlId) return player.utils.error(`Нельзя продать дом самому себе!`);

    alt.emitClient(invitePlayer, "choiceMenu.show", "buyhouseplayer_confirm", {
        name: player.getSyncedMeta("name"),
        houseid: house.id,
        price: player.sellHouseOffer.price,
    });

    invitePlayer.sellHouseOffer = {
        ownerId: player.sqlId,
        price: player.sellHouseOffer.price
    };
});

alt.onClient("house.sellplayer.cancel", (player) => {
    delete player.sellHouseOffer;
});

alt.onClient("house.buyhouseplayer.agree", (player) => {
    if (!player.sellHouseOffer) return player.utils.error(`Предложение не найдено!`);
    var owner = alt.Player.getBySqlId(player.sellHouseOffer.ownerId);
    if (!owner) return player.utils.error(`Продавец не найден!`);

    var dist = alt.Player.dist(player.pos, owner.pos);
    if (dist > Config.maxInteractionDist) return player.utils.error(`Продавец далеко!`);
    if (player.sqlId == owner.id) return player.utils.error(`Нельзя продать дом самому себе!`);

    if (!owner.inHouse) return player.utils.error(`Продажа осуществляется в доме!`);
    var house = alt.houses.getBySqlId(owner.inHouse);
    if (!house) return player.utils.error(`Дом не найден!`);
    if (house.owner != owner.sqlId) return player.utils.error(`Продавец не владелец дома!`);
    var price = player.sellHouseOffer.price;
    if (player.money < price) {
        owner.utils.info(`${player.getSyncedMeta("name")} не имеет ${price}$`);
        return player.utils.error(`Необходимо: ${price}$`);
    }
    // TODO: Проверка на наличие домов.
    owner.utils.setMoney(owner.money + price);
    player.utils.setMoney(player.money - price);
    house.setOwner(player.sqlId, player.getSyncedMeta("name"));

    owner.utils.success(`Дом ${house.sqlId} продан`);
    player.utils.success(`Дом ${house.sqlId} куплен`);

    alt.fullDeleteItemsByParams(59, ["house"], [house.sqlId]);
    player.inventory.add(59, {
        owner: player.sqlId,
        house: house.sqlId
    }, null, (e) => {
        if (e) return player.utils.error(e);
    });
    
    alt.logs.addLog(`${owner.name} продал дом ${house.sqlId} игроку ${player.getSyncedMeta("name")}. Цена: ${price}`, 'house', owner.account.id, owner.sqlId, { houseId: house.sqlId, price: price });
    alt.logs.addLog(`${player.getSyncedMeta("name")} купил дом ${house.sqlId} у игрока ${owner.name}. Цена: ${price}`, 'house', player.account.id, player.sqlId, { houseId: house.sqlId, price: price });

    player.utils.setSpawn(1);
    player.utils.setHouseId(house.sqlId);

    owner.utils.setHouseId(0);
    owner.utils.setSpawn(3);

    owner.utils.removeHouse(house);
    player.utils.addHouse(house);
});

alt.onClient("house.buyhouseplayer.cancel", (player) => {
    if (!player.sellHouseOffer) return;
    var owner = alt.Player.getBySqlId(player.sellHouseOffer.ownerId);
    if (owner) {
        owner.utils.info(`${player.getSyncedMeta("name")} отменил предложение`);
        delete owner.sellHouseOffer;
    }
    delete player.sellHouseOffer;
});