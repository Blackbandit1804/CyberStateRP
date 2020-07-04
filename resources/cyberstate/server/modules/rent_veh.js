const RentInfo = {
    price: 0,
    time: 60000 // 1 минута
}

alt.on("playerDisconnect", function playerDisconnectHandler(player, reason) {
    if (player.rent_owner) leaveRent(player);
});

alt.on("playerEnteredVehicle", function playerEnteredVehicleHandler(player, vehicle, seat) {
    try {
        if (vehicle.owner === -4001 && seat === 1) {
            if (vehicle.rent_owner) {
                if (!alt.Player.exists(vehicle.rent_owner)) {
                  delete vehicle.rent_owner;
                  return;
                } else if (vehicle.rent_owner.rent_owner != vehicle) {
                  delete vehicle.rent_owner;
                  return;
                } else if (vehicle.rent_owner === player) {
                    alt.emitClient(player, "control.rent.vehicle.time", 0);
                  return;
                } else {
                    alt.emitClient(player, `Vehicle::leave`, vehicle);
                    player.utils.error("Данный транспорт уже арендован!");
                    return;
                }
            }
            alt.emitClient(player, "start.rent.vehicle", RentInfo.price);
        }
    } catch (err) {
        alt.log(err);
        return;
    }
});

alt.on("playerLeftVehicle", function playerLeftVehicleHandler(player, vehicle, seat) {
    try {
        if (vehicle.owner === -4001 && seat === 1) {
            if (vehicle.rent_owner === player) {
                alt.emitClient(player, "control.rent.vehicle.time", RentInfo.time);
                player.utils.error("У вас есть 60 секунд, чтобы вернуться в транспорт!");
            } else {
                alt.emitClient(player, "stop.rent.vehicle", false);
            }
        }
    } catch (err) {
        alt.log(err);
        return;
    }
});

function leaveRent(player) {
    let vehicle = player.rent_owner;
    if (vehicle) {
        delete player.rent_owner;
        delete vehicle.rent_owner;
        removePlayersFromVehicle(vehicle);
        player.utils.error("Ваш скутер отбуксирован!");
        setSaveTimeout(() => {
            try {
                alt.emitClient(player, `Vehicle::repair`, vehicle);
                vehicle.dimension = 1;
                vehicle.pos = vehicle.spawnPos;
                vehicle.rot = new alt.Vector3(0, 0, vehicle.spawnPos.h * Math.PI / 180);
                vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
                vehicle.engineOn = false;
            } catch (err) {
                alt.log(err);
                return;
            }
        }, 200);
    }
}

alt.onClient("delete.vehicle.faggio.rent", (player) => {
    leaveRent(player);
});

function rentVehicle(player) {
  let vehicle = player.vehicle;
  if (vehicle) {
        if (player.money < RentInfo.price) {
            player.utils.error("У вас недостаточно средств!");
            alt.emitClient(player, `Vehicle::leave`, vehicle);
            return;
        }

        if (player.rent_owner !== undefined) {
            player.utils.error("Вы уже арендовали скутер!");
            alt.emitClient(player, `Vehicle::leave`, vehicle);
            return;
        }

        player.utils.setMoney(player.money - RentInfo.price);
        player.utils.success("Вы арендовали скутер за $" + RentInfo.price);
        player.rent_owner = vehicle;
        vehicle.rent_owner = player;
        vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
        alt.emitClient(player, "stop.rent.vehicle", false);
    }
}

alt.onClient("rent.vehicle.faggio", (player) => {
    rentVehicle(player);
});

function removePlayersFromVehicle(vehicle) {
    try {
        alt.Player.all.forEach((rec) => { if (rec.vehicle && rec.vehicle == vehicle) alt.emitClient(rec, `Vehicle::leave`, vehicle); });
    } catch (err) {
        alt.log(err);
        return;
    }
}
