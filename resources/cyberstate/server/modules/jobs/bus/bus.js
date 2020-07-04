const JobBus = {
  bus_route: [],
  functions: {
    leaveJob(player) {
      player.utils.error("Вы уволились из Автобусного Парка!");
      player.utils.changeJob(0);
      alt.emitClient(player, "clear.bus.data");
    },
    paySalary(player) {
      if (!player.busist || player.job != 2) return player.utils.error("Вы не можете получить зарплату!");
      if (player.busist != player.vehicle) return player.utils.error("Вы не в автобусе!");
      let money = JobBus.bus_route[player.vehicle.bussalary].salary;
      player.utils.success("Вы заработали $" + money);
      player.utils.setMoney(player.money + money);
      delete player.vehicle.bussalary;
    },
    leaveVehicle(player) {
      let vehicle = player.busist;
      delete player.busist;
      if (vehicle) {
        if (vehicle === vehicle) alt.emitClient(player, `Vehicle::leave`, vehicle);
        removeAllHumansFromVehicle(vehicle);
        alt.emitClient(player, "time.remove.back.bus");
        setTimeout(() => {
          try {
            alt.emitClient(player, `Vehicle::repair`, vehicle);
            vehicle.dimension = 1;
            vehicle.pos = vehicle.spawnPos;
            vehicle.rot = new alt.Vector3(0, 0, vehicle.spawnPos.h * Math.PI / 180);
            vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
            vehicle.engineOn = false;
            delete vehicle.busist;
          } catch (err) {
              alt.log(err);
              return;
          }
        }, 200);
      }
    }
  }
};
module.exports = {
    Init: () => {
        DB.Query("SELECT * FROM bus_route", (e, result) => {
           for (let i = 0; i < result.length; i++) JobBus.bus_route[result[i].id] = { name: result[i].name, salary: result[i].money, places: [] };
           alt.log("[Автобусы] Загружено маршрутов: " + result.length);
           DB.Query("SELECT * FROM bus_place", (e, bus) => {
              for (let i = 0; i < bus.length; i++) {
                JobBus.bus_route[bus[i].bus].places.push({ id: bus[i].id, x: bus[i].x, y: bus[i].y, z: bus[i].z, type: bus[i].type });
              }
              alt.log("[Автобусы] Загружено точек для маршрутов: " + bus.length);
           });
        });
    }
}

alt.onClient("job.bus.agree", (player) => {
    try {
        if (player.job !== 0 && player.job !== 2) return player.utils.error("Вы уже где-то работаете!");
        if (player.job === 2) {
          JobBus.functions.leaveJob(player);
          JobBus.functions.leaveVehicle(player);
        }
        else {
            if (alt.convertMinutesToLevelRest(player.minutes).level < 4) return player.utils.error("Вы не достигли 4 уровня!");
            player.utils.success("Вы устроились в Автобусный Парк!");
            player.utils.changeJob(2);
        }
    } catch (err) {
        alt.log(err);
        return;
    }
});

alt.onClient("rent.bus.vehicle", (player, id) => {
    try {
        let vehicle = player.vehicle;
        if (player.job !== 2) return player.utils.error("Вы не работаете в Автобусном Парке!");
        else if (!vehicle || !vehicle.owner === -2) return player.utils.error("Вы не можете арендовать транспорт");
        else if (vehicle.busist && vehicle.busist != player) {
          alt.emitClient(player, `Vehicle::leave`, vehicle);
          return player.utils.error("Данный автобус уже занят");
        }
        else {
           alt.emitClient(player, "selectMenu.hide");
           player.utils.success("Вы арендовали транспорт, следуйте по маршруту!");
           alt.emitClient(player, "freezeEntity", vehicle, false);
           vehicle.bussalary = id;
           player.busist = vehicle, vehicle.busist = player;
           alt.emitClient(player, "start.bus.mash", vehicle, JobBus.bus_route[id].places);
        }
    } catch (err) {
        alt.log(err);
        return;
    }
});
alt.onClient("playerDisconnect", function playerDisconnectHandler(player, exitType, reason) {
  if (player.job === 2) JobBus.functions.leaveVehicle(player);
});
alt.onClient("leave.bus.job", (player) => {
  JobBus.functions.leaveJob(player);
  JobBus.functions.leaveVehicle(player);
});
alt.onClient("pay.bus.salary", (player) => {
  JobBus.functions.paySalary(player);
});

alt.on("playerEnteredVehicle", function playerEnteredVehicleHandler(player, vehicle, seat) {
	if (vehicle.owner === -2 && player.job === 2 && seat === 1) {
    if (vehicle.busist && vehicle.busist != player) {
      alt.emitClient(player, `Vehicle::leave`, vehicle);
      player.utils.error("Данный автобус уже занят");
    }
    else if (player.busist && player.busist != vehicle) {
      alt.emitClient(player, `Vehicle::leave`, vehicle);
      player.utils.error("Вы уже арендовали автобус");
    }
    else if (player.busist == vehicle) {
      alt.emitClient(player, "time.remove.back.bus");
      if (!vehicle.bussalary) {
        alt.emitClient(player, "freezeEntity", vehicle, true);
        alt.emitClient(player, "selectMenu.show", "bus_mash");
      }
    }
    else {
      alt.emitClient(player, "freezeEntity", vehicle, true);
      alt.emitClient(player, "selectMenu.show", "bus_mash");
    }
  } else if (vehicle.owner === -2) {
    let driver = alt.getVehicleDriver(vehicle);
    if (!vehicle.busist) {
      alt.emitClient(player, `Vehicle::leave`, vehicle);
      return player.utils.error("Данный автобус не работает из-за отсутствия водителя!");
    } else if (!driver || !driver.busist) {
      alt.emitClient(player, `Vehicle::leave`, vehicle);
      return player.utils.error("Водитель покинул своё рабочее место, дождитесь его прихода!");
    }

    let salary = 15;
    player.utils.setMoney(player.money - salary);
    player.utils.error("Вы заплатили $" + salary + " за проезд!");
    driver.utils.setMoney(driver.money + salary);
    driver.utils.success("Вам зачислено $" + salary + " за пассажира!");
  }
});
alt.on("playerLeftVehicle", function playerLeftVehicleHandler(player, vehicle) {
  if (vehicle.owner === -2 && player.job === 2 && vehicle.busist == player) {
    if (!vehicle.bussalary) {
      alt.emitClient(player, "time.add.back.bus", 15000);
      player.utils.error("У вас есть 15 секунд, чтобы вернуться в транспорт.");
      return;
    }
    alt.emitClient(player, "time.add.back.bus", 180000);
    player.utils.error("У вас есть 3 минуты, чтобы вернуться в транспорт.");
  }
});
alt.on("playerLeftVehicle", function playerStartExitVehicleHandler(player) {
  let vehicle = player.vehicle;
  if (vehicle.owner === -2 && player.job === 2) if (!vehicle.busist) alt.emitClient(player, "selectMenu.hide");  // player.veh доп проверка убрана
});

function removeAllHumansFromVehicle(vehicle) {
    try {
      alt.Player.all.forEach((rec) => { if (rec.vehicle && rec.vehicle == vehicle) alt.emitClient(rec, `Vehicle::leave`, vehicle); });
    } catch (err) {
        alt.log(err);
        return;
    }
};
