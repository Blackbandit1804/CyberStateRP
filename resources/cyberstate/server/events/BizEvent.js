const { startDressing } = require("../modules/clothesShop/index");

alt.onClient("getBizInfo", (player) => {
    if (!player.colshape || !player.colshape.biz) return player.utils.error(`Вы не у бизнеса!`);
    var biz = player.colshape.biz;
    if (!biz.isOwner(player)) return player.utils.error(`Вы не являетесь владельцем бизнеса!`);

    var values = [biz.sqlId, biz.name, biz.bizType, biz.ownerName, biz.products, biz.maxProducts,
        biz.productPrice, biz.balance, biz.status, biz.staff.length, biz.price
    ];
    alt.emitClient(player, "infoTable.show", "biz_info", values);
});
alt.onClient("biz.balance.get", (player) => {
    if (!player.colshape || !player.colshape.biz) return player.utils.error(`Вы не у бизнеса!`);
    var biz = player.colshape.biz;
    if (!biz.isOwner(player)) return player.utils.error(`Вы не являетесь владельцем бизнеса!`);

    player.utils.bank("Финансовый отчет", `На кассе ~y~${biz.name}~g~ ${biz.balance}$`);
});
alt.onClient("biz.balance.add", (player, value) => {
    //debug(`biz.balance.add: ${value}`);
    if (!player.colshape || !player.colshape.biz) return player.utils.error(`Вы не у бизнеса!`);
    var biz = player.colshape.biz;
    if (!biz.isOwner(player)) return player.utils.error(`Вы не являетесь владельцем бизнеса!`);

    value = Math.clamp(value, 0, player.money);
    player.utils.bank(`Отчет бизнеса`, `Касса ~y~${biz.name}~w~ пополнена на ~g~${value}$. ~w~Всего: ~g~${biz.balance + value}$.`);
    biz.setBalance(biz.balance + value);
    player.utils.setMoney(player.money - value);
});
alt.onClient("biz.balance.take", (player, value) => {
    //debug(`biz.balance.take: ${value}`)
    if (!player.colshape || !player.colshape.biz) return player.utils.error(`Вы не у бизнеса!`);
    var biz = player.colshape.biz;
    if (!biz.isOwner(player)) return player.utils.error(`Вы не являетесь владельцем бизнеса!`);

    value = Math.clamp(value, 0, biz.balance);
    player.utils.bank(`Отчет бизнеса`, `С кассы ~y~${biz.name}~w~ снято ~g~${value}$. ~w~Всего: ~g~${biz.balance - value}$.`);
    biz.setBalance(biz.balance - value);
    player.utils.setMoney(player.money + value);
});
alt.onClient("biz.getStats", (player, offset) => {
    //debug(`biz.getStats: ${offset}`);
    if (!player.colshape || !player.colshape.biz) return player.utils.error(`Вы не у бизнеса!`);
    var biz = player.colshape.biz;
    if (!biz.isOwner(player)) return player.utils.error(`Вы не являетесь владельцем бизнеса!`);

    if (offset < 0) offset = 0;
    DB.Query("SELECT * FROM logs_bizes WHERE bizId=? ORDER BY id DESC LIMIT ?,30", [biz.sqlId, offset], (e, result) => {
        for (var i = 0; i < result.length; i++) {
            delete result[i].bizId;
            delete result[i].playerId;
        }
        //alt.log(result);
        alt.emitClient(player, "bizLogs.init", result, offset);
    });
});
alt.onClient("biz.products.buy", (player, products) => {
    //debug(`biz.products.buy: ${products}`);
    if (!player.colshape || !player.colshape.biz) return player.utils.error(`Вы не у бизнеса!`);
    var biz = player.colshape.biz;
    if (!biz.isOwner(player)) return player.utils.error(`Вы не являетесь владельцем бизнеса!`);
    if (biz.products == biz.maxProducts) return player.utils.error(`Склад полный!`);

    products = Math.clamp(products, 1, biz.maxProducts - biz.products);
    var sum = products * alt.economy[`product_price_biz_${biz.bizType}`].value;
    if (sum > player.money) return player.utils.error(`У Вас недостаточно наличных!`);

    player.utils.bank("Отчет бизнеса", `Склад ~y~${biz.name}~w~ пополнен на ~g~${products}~w~ ед. товара. Всего: ~g~${biz.products + products}/${biz.maxProducts}~w~ ед.`);
    biz.setProducts(biz.products + products);
    player.utils.setMoney(player.money - sum);
});
alt.onClient("biz.products.sell", (player, products) => {
    //debug(`biz.products.sell: ${products}`);
    if (!player.colshape || !player.colshape.biz) return player.utils.error(`Вы не у бизнеса!`);
    var biz = player.colshape.biz;
    if (!biz.isOwner(player)) return player.utils.error(`Вы не являетесь владельцем бизнеса!`);
    if (biz.products == 0) return player.utils.error(`На складе нет товара!`);

    products = Math.clamp(products, 1, biz.products);
    var sum = products * alt.economy[`product_price_biz_${biz.bizType}`].value * alt.economy.product_price_biz_sell.value;

    player.utils.bank("Отчет бизнеса", `Со склада ~y~${biz.name}~w~ списано ~g~${products}~w~ ед. товара. Всего: ~g~${biz.products - products}/${biz.maxProducts}~w~ ед.`);
    biz.setProducts(biz.products - products);
    player.utils.setMoney(player.money + sum);
});
alt.onClient("biz.products.price", (player, productPrice) => {
    //debug(`biz.products.price: ${productPrice}`);
    if (!player.colshape || !player.colshape.biz) return player.utils.error(`Вы не у бизнеса!`);
    var biz = player.colshape.biz;
    if (!biz.isOwner(player)) return player.utils.error(`Вы не являетесь владельцем бизнеса!`);
    if (alt.economy[`product_price_biz_${biz.bizType}`].value > productPrice || 10 < productPrice) return player.utils.error(`Доступно от $${alt.economy[`product_price_biz_${biz.bizType}`].value} до $10`);
    productPrice = Math.clamp(productPrice, alt.economy[`product_price_biz_${biz.bizType}`].value, 10);

    biz.setProductPrice(productPrice);
    player.utils.bank("Отчет бизнеса", `Новая цена товара: ${biz.productPrice}$`);
});
alt.onClient("biz.setStatus", (player, status) => {
    //debug(`biz.setStatus: ${status}`)
    if (!player.colshape || !player.colshape.biz) return player.utils.error(`Вы не у бизнеса!`);
    var biz = player.colshape.biz;
    if (!biz.isOwner(player)) return player.utils.error(`Вы не являетесь владельцем бизнеса!`);

    if (biz.status == status) {
        if (biz.status == 0) return player.utils.error(`Бизнес уже закрыт!`);
        else return player.utils.error(`Бизнес уже открыт!`);
    }
    biz.setStatus(status);
    //player.utils.addBiz(biz);
    if (status == 0) player.utils.bank("Отчет бизнеса", `Бизнес ~y~${biz.name} ~r~закрыт~w~!`);
    else player.utils.bank("Отчет бизнеса", `Бизнес ~y~${biz.name} ~g~открыт~w~!`);

});
alt.onClient("biz.sellToGov", (player) => {
    if (!player.colshape || !player.colshape.biz) return player.utils.error(`Вы не у бизнеса!`);
    var biz = player.colshape.biz;
    if (!biz.isOwner(player)) return player.utils.error(`Вы не являетесь владельцем бизнеса!`);

    biz.setOwner(0);
    player.utils.setMoney(player.money + biz.price * alt.economy.biz_sell.value);
    player.utils.removeBiz(biz);
    player.utils.success(`Вы продали бизнес государству!`);
    alt.logs.addLog(`${player.getSyncedMeta("name")} продал бизнес ${biz.sqlId} государству. Цена: ${biz.price}`, 'biz', player.account.id, player.sqlId, { bizId: biz.sqlId, price: biz.price });
});
alt.onClient("biz.sell", (player, values) => {
    //debug(`biz.sell: ${values}`);
    if (!player.colshape || !player.colshape.biz) return player.utils.error(`Вы не у бизнеса!`);
    var biz = player.colshape.biz;
    if (!biz.isOwner(player)) return player.utils.error(`Вы не являетесь владельцем бизнеса!`);

    values = JSON.parse(values);
    var buyerName = values[0];
    var price = values[1];
    if (price < 1) price = 1;
    var invitePlayer = alt.Player.getByName(buyerName);
    const bizes = alt.bizes.getArrayByOwner(invitePlayer.sqlId);
    if (bizes.length >= buyerName.donateBizes) return player.utils.error(`Игрок имеет максимальное количество бизнесов`);
    if (buyerName == player.getSyncedMeta("name")) return player.utils.error(`Нельзя продать бизнес самому себе!`);

    var buyer;
    alt.Player.forEach((rec) => {
        if (alt.Player.dist(player.pos, rec.pos) <= 5) {
            if (rec.getSyncedMeta("name") == buyerName) buyer = rec;
        }
    });
    if (!buyer) return player.utils.error(`${buyerName} не рядом с Вами!`);

    buyer.buyBiz = {
        seller: player,
        biz: biz,
        price: price
    };

    player.utils.success(`Предложение создано!`);
    alt.emitClient(buyer, "modal.hide");
    alt.emitClient(buyer, "choiceMenu.show", "accept_sell_biz", {
        owner: player.getSyncedMeta("name"),
        type: alt.bizes.getNameByType(biz.bizType),
        price: price
    });
});
alt.onClient("biz.sell.accept", (player) => {
    if (!player.buyBiz) return player.utils.error(`Предложение о покупке бизнеса истекло!`);
    var seller = player.buyBiz.seller;
    var biz = player.buyBiz.biz;
    var price = player.buyBiz.price;
    delete player.buyBiz;
    if (!seller || alt.Player.dist(player.pos, seller.pos) > 5) return player.utils.error(`Продавец не рядом с Вами!`);
    if (!biz.isOwner(seller)) return player.utils.error(`Продавец уже не владеет бизнесом!`);
    if (player.money < price) return player.utils.error(`Недостаточно средств!`);

    player.utils.setMoney(player.money - price);
    seller.utils.setMoney(seller.money + price);

    player.utils.success(`Вы купили бизнес!`);
    seller.utils.success(`Вы продали бизнес!`);

    alt.logs.addLog(`${seller.name} продал бизнес ${biz.sqlId} игроку ${player.getSyncedMeta("name")}. Цена: ${price}`, 'biz', seller.account.id, seller.sqlId, { bizId: biz.sqlId, price: price });
    alt.logs.addLog(`${player.getSyncedMeta("name")} купил бизнес ${biz.sqlId} у игрока ${seller.name}. Цена: ${price}`, 'biz', player.account.id, player.sqlId, { bizId: biz.sqlId, price: price });

    seller.utils.removeBiz(biz);
    player.utils.addBiz(biz);

    biz.setOwner(player.sqlId, player.getSyncedMeta("name"));
});
alt.onClient("biz.sell.cancel", (player) => {
    if (player.buyBiz.seller) player.buyBiz.seller.utils.warning(`Предложение отклонено!`);
    delete player.buyBiz;
    player.utils.success(`Предложение отклонено!`);
});
alt.onClient("biz.buy", (player) => {
    if (!player.colshape || !player.colshape.biz) return player.utils.error(`Вы не у бизнеса!`);
    var biz = player.colshape.biz;
    if (biz.owner != 0) return player.utils.error(`Бизнес уже имеет владельца!`);
    const bizes = alt.bizes.getArrayByOwner(player.sqlId);
    if (bizes.length >= player.donateBizes) return player.utils.error(`Вы имеете максимальное количество бизнесов`);
    if (player.money < biz.price) return player.utils.error(`Недостаточно средств!`);

    player.utils.setMoney(player.money - biz.price);
    biz.setOwner(player.sqlId, player.getSyncedMeta("name"));
    player.utils.addBiz(biz);
    alt.logs.addLog(`${player.getSyncedMeta("name")} купил бизнес ${biz.sqlId}. Цена: ${biz.price}`, 'biz', player.account.id, player.sqlId, { bizId: biz.sqlId, price: biz.price });
    player.utils.success(`Вы купили бизнес!`);
});
alt.onClient("biz.show", (player, name) => {
    return player.utils.error(`Покупка бизнеса не доступна!`);
    if (!player.colshape || !player.colshape.biz) return player.utils.error(`Вы не у бизнеса!`);
    var biz = player.colshape.biz;
    var whiteList = ["biz_buy"]; // for all players
    if (whiteList.indexOf(name) == -1 && !biz.isOwner(player)) return player.utils.error(`Вы не являетесь владельцем бизнеса!`);

    var values;
    var names = {
        "biz_sell_to_player": () => {
            values = {
                type: alt.bizes.getNameByType(biz.bizType),
                balance: biz.balance,
                staff: biz.staff.length,
                products: biz.products,
                maxProducts: biz.maxProducts
            };
        },
        "biz_sell_to_gov": () => {
            values = {
                type: alt.bizes.getNameByType(biz.bizType),
                balance: biz.balance,
                staff: biz.staff.length,
                products: biz.products,
                maxProducts: biz.maxProducts,
                price: biz.price,
                ratio: alt.economy.biz_sell.value
            };
        },
        "biz_products_buy": () => {
            values = {
                productPrice: alt.economy[`product_price_biz_${biz.bizType}`].value,
                products: biz.products,
                maxProducts: biz.maxProducts
            };
        },
        "biz_products_sell": () => {
            values = {
                productPriceSell: alt.economy.product_price_biz_sell.value,
                productPrice: alt.economy[`product_price_biz_${biz.bizType}`].value,
                products: biz.products,
                maxProducts: biz.maxProducts
            };
        },
        "biz_products_price": () => {
            values = {
                productPrice: biz.productPrice,
            };
        },
        "biz_buy": () => {
            values = {
                type: alt.bizes.getNameByType(biz.bizType),
                staff: biz.staff.length,
                products: biz.products,
                maxProducts: biz.maxProducts,
                price: biz.price
            };
        }
    };

    if (names[name]) {
        names[name]();
        alt.emitClient(player, "modal.show", name, values);
    }
});

/* Магазин одежды */
alt.onClient("biz_3.clearItems", (player, interior = 0) => {
    if (!player.colshape || !player.colshape.biz) return player.utils.error(`Вы не у бизнеса!`);
    var biz = player.colshape.biz;
    if (biz.bizType != 3) return player.utils.error(`Неверный тип бизнеса!`);
        if (!biz.status) return player.utils.error(`Бизнес закрыт!`);

        if (!startDressing(player, interior)) {
            return;
        }

    player.dressingBiz = biz;
    player.body.clearItems();
});

alt.onClient("biz_3.buyItem", (player, type, index, texture) => {
    // debug(`biz_3.buyItem: ${player.getSyncedMeta("name")} ${type} ${index} ${texture}`)
    if ((!player.colshape || !player.colshape.biz) && !player.inDressingRoom) return player.utils.error(`Вы не у бизнеса!`);
    var biz = player.dressingBiz || player.colshape.biz;
    if (biz.bizType != 3) return player.utils.error(`Неверный тип бизнеса!`);
    if (!biz.status) return player.utils.error(`Бизнес закрыт!`);

    var clothes = alt.clothes[type][player.sex][index];
    if (!clothes) return player.utils.error(`Одежда ${index} не найдена!`);
    if (clothes.textures[texture] == null) return player.utils.error(`Текстура ${texture} одежды ${index} не найдена!`);

    // TODO: Подобрать расход продуктов бизнеса для магазина одежды.
    var products = parseInt(clothes.price / 10);
    if (player.money < clothes.price) return player.utils.error(`Необходимо ${clothes.price}$`);
    if (biz.products < products) return player.utils.error(`У бизнеса недостаточно товара!`);
    // alt.log(clothes);

    var types = ["top","legs","feets","hats","glasses","bracelets","ears","masks","ties","watches","underwear"];
    var itemIds = [7, 8, 9, 6, 1, 12, 10, 14, 2, 11, 4];
    var itemId = itemIds[types.indexOf(type)];

    var params = {
        sex: player.sex,
        owner: player.sqlId,
        variation: clothes.variation,
        texture: clothes.textures[texture]
    };
    if (type == "top") {
        params.rows = clothes.rows;
        params.cols = clothes.cols;
        params.torso = clothes.torso;
    } else if (type == "legs") {
        params.rows = clothes.rows;
        params.cols = clothes.cols;
    }

    player.inventory.add(itemId, params, {}, (e) => {
        if (e) return player.utils.error(e);

        if(player.admin <= 0) {
            biz.setProducts(biz.products - products);
            biz.setBalance(biz.balance + clothes.price);
        }

        player.utils.setMoney(player.money - clothes.price);
        player.utils.success(`Вы купили ${alt.inventory.getItem(itemId).name}!`);
        biz.log(player.sqlId, `${player.getSyncedMeta("name")} купил ${alt.inventory.getItem(itemId).name}`, clothes.price, products);
    });

});

/* АЗС */
alt.onClient("biz_5.buyItem", (player, index, fuel) => {
    //debug(`biz_5.buyItem: ${player.getSyncedMeta("name")} ${index} ${fuel}`)
    if (!player.colshape || !player.colshape.biz) return player.utils.error(`Вы не у бизнеса!`);
    var biz = player.colshape.biz;
    if (biz.bizType != 5) return player.utils.error(`Неверный тип бизнеса!`);
    if (!biz.status) return player.utils.error(`Бизнес закрыт!`);

    if (index == 0) { // заправить авто
        var veh = alt.getNearVehicle(biz.pos, Config.gasRange)
        if (!veh) return player.utils.error(`Подгоните авто!`);
        fuel = Math.clamp(fuel, 0, veh.vehPropData.maxFuel - veh.vehPropData.fuel);
        if (!fuel) return player.utils.error(`Бак полный!`);
        if (veh.owner > 0 && veh.owner < 9) {
            veh.utils.setFuel(veh.vehPropData.fuel + fuel);
            player.utils.success(`Заправлено ${veh.vehPropData.fuel}/${veh.vehPropData.maxFuel} л.`);
            player.utils.error("Транспорт заправлен за счет государства!");
            return;
        }
        var price = fuel * biz.productPrice;
        if (player.money < price) return player.utils.error(`Необходимо ${price}$`);
        if (biz.products < fuel) return player.utils.error(`У бизнеса недостаточно товара!`);

        if (player.admin <= 0) {
            biz.setProducts(biz.products - fuel);
            biz.setBalance(biz.balance + price);
        }

        veh.utils.setFuel(veh.vehPropData.fuel + fuel);
        player.utils.setMoney(player.money - price);
        player.utils.success(`Заправлено ${veh.vehPropData.fuel}/${veh.vehPropData.maxFuel} л.`);
        biz.log(player.sqlId, `${player.getSyncedMeta("name")} заправил ${veh.name}`, price, fuel);

    } else if (index == 1) { //заправить канистру
        var canisters = player.inventory.getArrayByItemId(36);
        if (!Object.keys(canisters).length) return player.utils.error(`Необходима канистра!`);
        for (var key in canisters) {
            var item = canisters[key];
            var fuel = item.params.maxCount - item.params.count;
            if (fuel > 0) {
                var price = fuel * biz.productPrice;
                if (player.money < price) return player.utils.error(`Необходимо ${price}$`);
                if (biz.products < fuel) return player.utils.error(`У бизнеса недостаточно товара!`);

                if(player.admin <= 0) {
                    biz.setProducts(biz.products - fuel);
                    biz.setBalance(biz.balance + price);
                }

                item.params.count = item.params.maxCount;
                player.inventory.updateParams(item.id, item);
                player.utils.setMoney(player.money - price);
                player.utils.success(`Канистра заправлена!`);
                biz.log(player.sqlId, `${player.getSyncedMeta("name")} заправил канистру`, price, fuel);
                return;
            }
        }
        player.utils.error(`Канистры уже полные!`);
    }
});

/* Магазин 24/7 */
alt.onClient("biz_6.buyItem", (player, itemId) => {
    //debug(`biz_6.buyItem: ${player.getSyncedMeta("name")} ${itemId}`)
    if (!player.colshape || !player.colshape.biz) return player.utils.error(`Вы не у бизнеса!`);
    var biz = player.colshape.biz;
    if (biz.bizType != 6) return player.utils.error(`Неверный тип бизнеса!`);
    if (!biz.status) return player.utils.error(`Бизнес закрыт!`);
    // При смене продуктов меняем их в OnentityEnterColshape | 68 строка - biz6INfo
    var biz6INfo = {
        30: {
            products: 10,
            params: {
                satiety: 10,
                thirst: 50,
            },
        },
        31: {
            products: 8,
            params: {
                satiety: 25,
                thirst: -30,
            },
        },
        32: {
            products: 12,
            params: {
                satiety: 35,
                thirst: -25,
            },
        },
        33: {
            products: 5,
            params: {
                satiety: 35,
                thirst: -15,
            },
        },
        34: {
            products: 15,
            params: {
                count: 20
            },
        },
        35: {
            products: 20,
            params: {
                satiety: 10,
                thirst: 30,
            },
        },
        15: {
            products: 40,
            params: {
                owner: player.sqlId
            },
        },
        13: {
            products: 20,
            params: {
                sex: player.sex,
                variation: 45,
                texture: 0,
                rows: 10,
                cols: 5
            },
        },
        36: {
            products: 30,
            params: {
                count: 0,
                maxCount: 20
            },
        },
        25: {
            products: 20,
            params: {
                count: 15,
            },
        },
    };
    if (!biz6INfo[itemId]) return player.utils.error(`Предмет не найден!`);
    var info = biz6INfo[itemId];
    var price = info.products * biz.productPrice;
    if (player.money < price) return player.utils.error(`Необходимо ${price}$`);
    if (biz.products < info.products) return player.utils.error(`У бизнеса недостаточно товара!`);
    if (player.waitOperation) return player.utils.error(`Дождитесь выполнения предыдущей операции!`);
    player.inventory.add(itemId, info.params, {}, (e) => {
        if (e) return player.utils.error(e);

        if(player.admin <= 0) {
            biz.setProducts(biz.products - info.products);
            biz.setBalance(biz.balance + price);
        }

        player.utils.setMoney(player.money - price);
        player.utils.success(`Вы купили ${alt.inventory.getItem(itemId).name}`);
        biz.log(player.sqlId, `${player.getSyncedMeta("name")} купил ${alt.inventory.getItem(itemId).name}`, price, info.products);
    });
});

/* Оружейный магазин. */
alt.onClient("biz_8.buyItem", (player, itemId) => {
    //debug(`biz_8.buyItem: ${player.getSyncedMeta("name")} ${itemId}`);
    if (!player.colshape || !player.colshape.biz) return player.utils.error(`Вы не у бизнеса!`);
    var biz = player.colshape.biz;
    if (biz.bizType != 8) return player.utils.error(`Неверный тип бизнеса!`);
    if (!biz.status) return player.utils.error(`Бизнес закрыт!`);
    // При смене продуктов меняем их в OnentityEnterColshape | 68 строка - biz8INfo
    var biz8INfo = {
        41: {
            products: 60,
            params: {
                weaponHash: jhash("weapon_bat"),
            },
        },
        42: {
            products: 50,
            params: {
                weaponHash: jhash("weapon_knuckle"),
            },
        },
        43: {
            products: 70,
            params: {
                weaponHash: jhash("weapon_knife"),
            },
        },
        44: {
            products: 180,
            params: {
                weaponHash: jhash("weapon_pistol"),
            },
        },
        45: {
            products: 240,
            params: {
                weaponHash: jhash("weapon_appistol"),
            },
        },
        47: {
            products: 280,
            params: {
                weaponHash: jhash("weapon_microsmg"),
            },
        },
        48: {
            products: 300,
            params: {
                weaponHash: jhash("weapon_smg"),
            },
        },
        49: {
            products: 350,
            params: {
                weaponHash: jhash("weapon_sawnoffshotgun"),
            },
        },
    };
    if (!biz8INfo[itemId]) return player.utils.error(`Оружие не найдено!`);
    var info = biz8INfo[itemId];
    var price = info.products * biz.productPrice;
    if (itemId > 43 && !alt.checkLic(player, 10)) return player.utils.error(`Вы не имеете лицензию на оружие`);
    if (player.money < price) return player.utils.error(`Необходимо ${price}$`);
    if (biz.products < info.products) return player.utils.error(`У бизнеса недостаточно товара!`);
    if (player.waitOperation) return player.utils.error(`Дождитесь выполнения предыдущей операции!`);
    info.params.owner = player.sqlId;
    info.params.ammo = 0;

    player.inventory.add(itemId, info.params, {}, (e) => {
        if (e) return player.utils.error(e);
        if (player.admin <= 0) {
            biz.setProducts(biz.products - info.products);
            biz.setBalance(biz.balance + price);
        }
        player.utils.setMoney(player.money - price);
        player.utils.success(`Вы купили ${alt.inventory.getItem(itemId).name}`);
        biz.log(player.sqlId, `${player.getSyncedMeta("name")} купил ${alt.inventory.getItem(itemId).name}`, price, info.products);
    });
});

alt.onClient("biz_8.buyAmmo", (player, index, ammo) => {
    // debug(`biz_8.takeAmmo: ${index} ${ammo}`);
    if (!player.colshape || !player.colshape.biz) return player.utils.error(`Вы не у бизнеса!`);
    var biz = player.colshape.biz;
    if (biz.bizType != 8) return player.utils.error(`Неверный тип бизнеса!`);
    if (!biz.status) return player.utils.error(`Бизнес закрыт!`);

    var itemIds = [37, 38, 40, 39];
    var index = Math.clamp(index, 0, itemIds.length - 1);
    var price = ammo * biz.productPrice;
    if (!alt.checkLic(player, 10)) return player.utils.error(`Вы не имеете лицензию на оружие`);
    if (player.money < price) return player.utils.error(`Необходимо ${price}$`);
    if (biz.products < ammo) return player.utils.error(`У бизнеса недостаточно товара!`);
    if (player.waitOperation) return player.utils.error(`Дождитесь выполнения предыдущей операции!`);

    var params = {
        ammo: ammo,
    };
    player.inventory.add(itemIds[index], params, {}, (e) => {
        if (e) return player.utils.error(e);

        if(player.admin <= 0) {
            biz.setProducts(biz.products - ammo);
            biz.setBalance(biz.balance + price);
        }

        player.utils.setMoney(player.money - price);
        player.utils.success(`Вы купили ${alt.inventory.getItem(itemIds[index]).name}!`);
        biz.log(player.sqlId, `${player.getSyncedMeta("name")} купил ${alt.inventory.getItem(itemIds[index]).name}`, price, ammo);

    });
});
