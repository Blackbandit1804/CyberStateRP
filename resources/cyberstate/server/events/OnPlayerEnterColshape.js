const { StorageController } = require(`../modules/gang_storage`);

var menuHandlers = {
    "enter_garage": (player, colshape) => {
        var house = alt.houses.getBySqlId(player.inHouse);
        if (!player.inHouse) {
            if(player.colshape.garage.houseSqlId) {
                house = alt.houses.getBySqlId(player.colshape.garage.houseSqlId); // с улицы в гараж
            }
        } else {
            house = alt.houses.getBySqlId(player.inHouse); // из дома в гараж
        }

        if (!house) return player.utils.error(`Дом не найден!`);

        if (house.garage) alt.emitClient(player, "selectMenu.show", "enter_garage");
    },
    "police_storage": (player, colshape) => {
        if (player.faction !== colshape.policeStorage.faction) return player.utils.error(`Нет доступа!`);
        alt.emitClient(player, "selectMenu.show", "police_storage");
    },
    "sell_car": (player) => {
        alt.emitClient(player, "selectMenu.show", "sell_car");
    },
    "police_storage_2": (player, colshape) => {
        if (player.faction !== colshape.policeStorage.faction) return player.utils.error(`Нет доступа!`);
        alt.emitClient(player, "selectMenu.show", "police_storage_2");
    },
    "army_storage": (player, colshape) => {
        if (player.faction != colshape.armyStorage.faction) return player.utils.error(`Нет доступа!`);
        alt.emitClient(player, "selectMenu.show", "army_storage");
    },
    "army_storage_2": (player, colshape) => {
        if (player.faction != colshape.armyStorage.faction) return player.utils.error(`Нет доступа!`);
        alt.emitClient(player, "selectMenu.show", "army_storage_2");
    },
    "news_storage": (player, colshape) => {
        if (player.faction != colshape.newsStorage.faction) return player.utils.error(`Нет доступа!`);
        alt.emitClient(player, "selectMenu.show", "news_storage");
    },
    "hospital_storage": (player, colshape) => {
        if (player.faction != colshape.hospitalStorage.faction) return player.utils.error(`Нет доступа!`);
        alt.emitClient(player, "selectMenu.show", "hospital_storage");
    },
    "police_service": (player, colshape) => {
        var list = alt.houses.getArrayByOwner(player.sqlId);
        var ids = [];
        list.forEach((h) => {
            ids.push(h.sqlId)
        });
        if (!ids.length) ids = null;
        alt.emitClient(player, "selectMenu.show", "police_service", 0, ids);
    },
    "police_service_2": (player, colshape) => {
        var list = alt.houses.getArrayByOwner(player.sqlId);
        var ids = [];
        list.forEach((h) => {
            ids.push(h.sqlId)
        });
        if (!ids.length) ids = null;
        alt.emitClient(player, "selectMenu.show", "police_service_2", 0, ids);
    },
    "fib_storage": (player, colshape) => {
        if (player.faction !== colshape.fibStorage.faction) return player.utils.error(`Нет доступа!`);
        alt.emitClient(player, "selectMenu.show", "fib_storage");
    },
    "info_smuggling": (player, colshape) => {
        if (alt.factions.isPoliceFaction(player.faction) || alt.factions.isFibFaction(player.faction) || alt.factions.isInLegalFaction(player.faction)) {
            alt.emitClient(player, "selectMenu.show", "info_smuggling");
        }
    },
    "band_dealer_menu": (player, colshape) => {
        if (alt.factions.isInLegalFaction(player.faction)) {
            alt.emitClient(player, "selectMenu.show", "band_dealer_menu");
        }
    }
};
for (var i = 1; i <= 11; i++)
    menuHandlers[`enter_biz_${i}`] = (player, colshape) => {
        var biz = colshape.biz;
        var isOwner = biz.owner === player.sqlId;
        alt.emitClient(player, "selectMenu.show", `enter_biz_${biz.bizType}`, 0, {
            isOwner: isOwner,
            owner: biz.owner
        });
        if (biz.bizType == 6) {
          let biz6INfo = [10, 8, 12, 5, 15, 20, 40, 20, 30, 20];
          let prices = [];
          for (let i = 0; i < biz6INfo.length; i++) {
            let price = biz6INfo[i] * biz.productPrice;
            prices.push(price);
          }
          alt.emitClient(player, "food.shop.setFoodShopName", prices, biz.productPrice);
        } else if (biz.bizType == 8) {
          let biz8INfo = [60, 50, 70, 180, 240, 280, 300, 350];
          let prices = [];
          for (let i = 0; i < biz8INfo.length; i++) {
            let price = biz8INfo[i] * biz.productPrice;
            prices.push(price);
          }
          alt.emitClient(player, "weapon.shop.setAmmoShopName", prices, biz.productPrice);
        }
    };


alt.onClient(`colshapeHandler`, (player) => {
    if (!player.inColshapeUse) return;
    if (player.inColshapeUse.menuName) {
        console.log(player.inColshapeUse.menuName)
        if (player.vehicle) return player.utils.error(`Выйдите из авто!`);
        if (menuHandlers[player.inColshapeUse.menuName]) menuHandlers[player.inColshapeUse.menuName](player, player.inColshapeUse);
        else alt.emitClient(player, "selectMenu.show", player.inColshapeUse.menuName);
    } else if (player.inColshapeUse.tpMarker || player.inColshapeUse.targetMarker) {
        if (player.lastTpMarkerId != null) return;
        if (player.vehicle) return player.utils.error(`Выйдите из авто!`);
        var pos = new alt.Vector3(player.inColshapeUse.targetMarker.x, player.inColshapeUse.targetMarker.y, player.inColshapeUse.targetMarker.z);
        pos.z++;
        player.pos = pos;
        player.rot = new alt.Vector3(0, 0, player.inColshapeUse.targetMarker.h);
        player.lastTpMarkerId = player.inColshapeUse.tpMarker.id;
    } else if (player.inColshapeUse.gangId && !player.vehicle) {
        player.gangId = player.inColshapeUse.gangId;
        let storage = StorageController.functions.getStorage(player.gangId);
        if (storage.faction == player.faction) {
          if (storage.isLock(player)) return player.utils.error("Склад закрыт!");
          alt.emitClient(player, "selectMenu.show", "gang_storage");
          alt.emitClient(player, "update.gang.storage", storage.balance, storage.weapon_rank, storage.ammo_rank, storage.storage_rank, storage.drugs_rank, storage.money_rank, StorageController.functions.getPlayerDrugs(player), storage.drugs, StorageController.functions.getPlayerAmmo(player), storage.ammo, StorageController.functions.getPlayerWeapons(player), storage.weapons, StorageController.max);
        } else return player.utils.error("Вам недоступен данный склад!");
    }
});

alt.on("entityEnterColshape", (colshape, player) => {
    if (player instanceof alt.Player && player.sqlId) {
        player.colshape = colshape;

        if (colshape.menuName || colshape.tpMarker || colshape.targetMarker || colshape.gangId) {
            alt.emitClient(player, "prompt.show", `Нажмите <span class=\"hint-main__info-button\">Е</span> для взаимодействия`);
            alt.emitClient(player, `Colshape::enable`, true);
            player.inColshapeUse = colshape;
        }

        if (colshape.routep) {
            if (colshape.routep === player.route[player.currentRoutepIndex]) { //currentRoutepIndex - index в массиве маршрута
                if (player.currentRoutepIndex < player.route.length - 1) {
                    var index = ++player.currentRoutepIndex;
                    var direction = (index + 1 < player.route.length) ? new alt.Vector3(player.route[index + 1].x, player.route[index + 1].y, player.route[index + 1].z, ) : null;
                    alt.emitClient(player, "checkpoint.create", player.route[index], direction);
                } else {
                    alt.emitClient(player, "checkpoint.create");
                }
            }
        } else if (colshape.factionProducts) {
            var index = colshape.factionProducts.factionIds.indexOf(player.faction);
            if (index == -1 || player.getSyncedMeta("attachedObject")) return;
            player.utils.setLocalVar("insideProducts", true);
            player.factionProducts = colshape.factionProducts;
        } else if (colshape.warehouse && player instanceof alt.Player) {
            if (!player.getSyncedMeta("attachedObject")) return;
            player.utils.setLocalVar("insideWarehouseProducts", true);
        } else if (colshape.isForTractor) {
            var veh = player.vehicle;
            if (!veh || !alt.isFarmVehicle(veh)) return;
            colshape.destroy();

            if (player.farmJob.routeIndex == player.farmJob.route.length - 1) {
                var farmField = player.farmJob.tractorField;
                farmField.fill(veh.products.type);

                player.utils.success(`Вы успешно засеяли поле!`);
                player.utils.success(`Урожай созревает...`);
                alt.emitClient(player, "checkpoint.clearForTractor");
                alt.emitClient(player, "removeWaypoint");
                veh.products.type = 0;
                veh.products.count = 0;
                delete player.farmJob.routeIndex;
                delete player.farmJob.route;
                var farm = player.farmJob.farm;
                var pay = farm.pay * alt.economy["farm_tractor_pay"].value;
                if (farm.balance < pay) player.utils.error(`На ферме недостаточно средств для оплаты труда! Обратитесь к владельцу фермы!`);
                else {
                    farm.setBalance(farm.balance - pay);
                    player.utils.setMoney(player.money + pay);
                }
            } else {
                player.farmJob.routeIndex++;

                var pos = player.farmJob.route[player.farmJob.routeIndex];
                var data = {
                    position: pos,
                    type: 1,
                    scale: 4,
                    params: {
                        isForTractor: true
                    },
                    color: [255, 255, 255, 255]
                }
                if (player.farmJob.routeIndex < player.farmJob.route.length - 1) data.direction = player.farmJob.route[player.farmJob.routeIndex + 1];
                //дл¤ отловки событи¤ входа в маркер
                var colshape = new ColshapeSphere(pos["x"], pos["y"], pos["z"] + 1, 3); //+1 to fix bug
                colshape.isForTractor = true;
                player.farmJob.tractorColshape = colshape;
                alt.emitClient(player, "checkpoint.create", JSON.stringify(data));
                alt.emitClient(player, "setNewWaypoint", pos.x, pos.y);
            }
        }
    }
});

alt.onClient("houseHandler", (player) => {
    if (player.colshape) {
        if (player.colshape.house) {
            let house = player.colshape.house;
            if (house) {
                var interior = alt.interiors.getBySqlId(house.interior);
                if (!interior) return player.utils.error(`Интерьер не найден!`);
                var values = [house.sqlId, house.class, house.interior, house.ownerName, house.garage, house.closed, house.price, house.pos, interior.rooms, interior.square];
                alt.emitClient(player, "houseMenu.show", values);
            }
        } else if (player.colshape.menuName === "exit_house") {
            alt.emitClient(player, "exitHouse");
        } else if (player.colshape.menuName === "exit_garage") {
            alt.emit("goExitGarage", player);
        }
    }
});

alt.onClient("houseMenuHandler", (player) => {
    var house = alt.houses.getBySqlId(player.inHouse);
    if (house && house.owner === player.sqlId) {
        alt.emitClient(player, "houseOwnerMenu.update", false, house.closed);
    } else if (player.colshape && player.colshape.house && player.colshape.house.owner === player.sqlId) {
        alt.emitClient(player, "houseOwnerMenu.update", false, player.colshape.house.closed);
    }
});
