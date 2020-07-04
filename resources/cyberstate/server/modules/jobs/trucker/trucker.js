module.exports.Init = function() {
    alt.truckerData = {};

    initTruckerUtils();
    initLoadPoints();
    initLoadReceivers();
}

function initTruckerUtils() {
    alt.trucker = {
        getSkill: (exp) => {
            if (exp < 8) return {
                level: 1,
                rest: exp
            };
            if (exp >= 5096) return {
                level: 50,
                rest: exp - 5096
            };
            var i = 2;
            var add = 16;
            var temp = 20;
            while (i < 100000) {
                if (exp < temp) return {
                    level: i,
                    rest: exp - (temp - add + 4)
                };
                i++;
                temp += add;
                add += 4;
            }
            return -1;
        },
        getMaxLoad: (vehModel) => {
            var models = ["phantom", "packer", "hauler"];
            var index = models.indexOf(vehModel);
            if (index == -1) return 0;
            var maxLoads = [15, 30, 60];
            return maxLoads[index];
        },
        getMinLevel: (vehModel) => {
            var models = ["phantom", "packer", "hauler"];
            var index = models.indexOf(vehModel);
            if (index == -1) return 1;
            var levels = [1, 15, 25];
            return levels[index];
        },
        getTrailerModel: (loadType) => {
            var models = ["trailerlogs", "trailers", "tanker"];
            loadType = Math.clamp(loadType, 1, models.length);
            return models[loadType - 1];
        },
    };
}

function initLoadPoints() {
    alt.truckerData.loadPoints = [];

    var positions = [
        new alt.Vector3(-522.13, 5245.28, 78.68), new alt.Vector3(-797.59, 5411.85, 33.12),
        new alt.Vector3(300.4, 2893.21, 42.61), new alt.Vector3(989.76, -1961.37, 29.72),
        new alt.Vector3(2930.27, 4303.78, 49.63), new alt.Vector3(2717.1, 1422.49, 23.49)
    ];
    var loadTypes = [1, 1, 2, 2, 3, 3];
    var loadTypeNames = ["Дерево", "Дерево", "Уголь", "Уголь", "Нефть", "Нефть"];
    var prices = [40, 60, 40, 60, 40, 60];
    var trailerPositions = [
        new alt.Vector3(-515.42, 5242.60, 80.23), new alt.Vector3(-773, 5430.48, 36.37),
        new alt.Vector3(271.34, 2881.28, 43.61), new alt.Vector3(978.81, -1950.1, 30.9),
        new alt.Vector3(2929.03, 4327.05, 50.42), new alt.Vector3(2729.04, 1452.22, 24.5)
    ];
    var trailerHeadings = [70.1, 94.15, 299.56, 260.3, 197.04, 170.04];
    var blipColors = [43, 43, 47, 47, 67, 67];
    var blipNames = [`Лесопилка №1`, `Лесопилка №2`, `Добыча угля №1`, `Добыча угля №2`, `Нефтяной завод №1`, `Нефтяной завод №2`];
    for (var i = 0; i < positions.length; i++) {
        var pos = positions[i];

        var marker = alt.helpers.marker.new(1, pos, 1, {
            color: [0, 187, 255, 100],
            visible: false
        });

        marker.loadType = loadTypes[i];
        marker.loadTypeName = loadTypeNames[i];
        marker.price = prices[i];
        marker.trailerPos = trailerPositions[i];
        marker.trailerPos.h = trailerHeadings[i];

        var blip = alt.helpers.blip.new(479, pos, {
            color: blipColors[i],
            name: blipNames[i],
            scale: 0.7,
            shortRange: true
        });

        marker.label = alt.labels.new(`${loadTypeNames[i]}\n ~b~Тонна: ~w~${prices[i]}$`, new alt.Vector3(pos.x, pos.y, pos.z + 2), {
            los: true,
            font: 4,
            drawDistance: 30,
            color: [0, 187, 255, 255],
        });

        var colshape = alt.colshapes.newCircle(pos["x"], pos["y"], 60);
        colshape.marker = marker;

        //дл¤ отловки событи¤ входа в маркер
        var colshape = new alt.ColshapeSphere(pos["x"], pos["y"], pos["z"] + 1, 1); //+1 to fix bug
        colshape.truckerLoad = marker;
        colshape.menuName = "trucker_load";

        alt.truckerData.loadPoints.push(marker);
    }

}

function initLoadReceivers() {
    alt.truckerData.loadReceivers = [];

    var positions = [new alt.Vector3(528.45, -3048.61, 5.07), new alt.Vector3(-73.29, 6269.16, 30.37)];
    // var positions = [new alt.Vector3(-547, 5257, 73), new alt.Vector3(-73.29, 6269.16, 30.37)]; // test
    var prices = [
        [60, 40, 60],
        [40, 60, 40]
    ];
    var blips = [410, 270];
    var blipNames = [`Порт`, `Завод (прием груза)`];

    for (var i = 0; i < positions.length; i++) {
        var pos = positions[i];
        var marker = alt.helpers.marker.new(1, pos, 4, {
            color: [0, 187, 255, 100],
            visible: false
        });
        marker.prices = prices[i];

        var blip = alt.helpers.blip.new(blips[i], pos, {
            color: 1,
            scale: 0.7,
            name: blipNames[i],
            shortRange: true
        });

        marker.label = alt.labels.new(`~g~Дерево: ~w~${prices[i][0]}$\n ~y~Уголь: ~w~${prices[i][1]}$\n ~b~Нефть: ~w~${prices[i][2]}$`, new alt.Vector3(pos.x, pos.y, pos.z + 2), {
            los: true,
            font: 4,
            drawDistance: 30,
            color: [0, 187, 255, 255],
        });

        var colshape = alt.colshapes.newCircle(pos["x"], pos["y"], 60);
        colshape.marker = marker;

        //дл¤ отловки событи¤ входа в маркер
        colshape = new alt.ColshapeSphere(pos["x"], pos["y"], pos["z"] + 1, 15); //+1 to fix bug
        colshape.truckerReceiver = marker;

        alt.truckerData.loadReceivers.push(marker);
    }
}

alt.on("playerEnteredVehicle", function playerEnteredVehicleHandler(player, vehicle, seat) {
    if (vehicle.trucker) {
        if (!alt.Player.exists(vehicle.trucker)) delete vehicle.trucker;
        else if (vehicle.trucker.trucker != vehicle) delete vehicle.trucker;
        else if (vehicle.trucker != player) {
          player.utils.error("Данный транспорт уже занят другим рабочим!");
          alt.emitClient(player, `Vehicle::leave`, vehicle);
        } else {
          alt.emitClient(player, "time.remove.back.trucker");
        }
        return;
    }
    if (vehicle.owner === -5 && player.job === 5 && seat === 1) {
        if (!vehicle.trucker) {
          if (player.trucker) {
            alt.emitClient(player, `Vehicle::leave`, vehicle);
            return player.utils.error("Вы уже арендовали фуру!");
          }
          var skill = alt.trucker.getSkill(player.jobSkills[5 - 1]);
          let vehSkill = alt.trucker.getMinLevel(vehicle.name);
          if (skill.level < vehSkill) {
            alt.emitClient(player, `Vehicle::leave`, vehicle);
              return player.utils.error(`Ваш навык для этого транспорта не подходит: ${skill.level}/${vehSkill}`);
          }
          vehicle.trucker = player;
          player.trucker = vehicle;
          alt.emitClient(player, "setNewWaypoint", 989.88, -1961.89);
          player.utils.success(`Вы арендовали фуру!`);
          player.utils.success("Вы можете загрузить уголь, нефть и дерево!");
      }
    }
});

alt.onClient("leave.trucker.job", (player) => {
    try
    {
      leaveJob(player);
    }
    catch (err) {
        alt.log(err);
        return;
    }
});

alt.onClient("playerLeftVehicle", function playerLeftVehicleHandler(player, vehicle) {
    if (vehicle.owner === -5 && player.job === 5) {
      if (vehicle === player.trucker) {
        alt.emitClient(player, "time.add.back.trucker", 60000);
        player.utils.error("У вас есть 1 минута, чтобы вернуться в транспорт.");
      }
    }
});

alt.onClient("job.trucker.agree", (player) => {
  if (player.job !== 0 && player.job !== 5) return player.utils.error("Вы уже где-то работаете!");
  if (player.job === 5) {
      leaveJob(player);
  } else {
      player.utils.success("Вы устроились Дальнобойщиком!");
      player.utils.changeJob(5);
  }
});

alt.onClient("playerDisconnect", function playerDisconnectHandler(player, exitType, reason) {
    if (player.job === 5) {
      leaveVehicle(player);
    }
});

alt.onClient("playerDeath", function playerDeathHandler(player, reason, killer) {
    if (player.job === 5) {
        leaveJob(player);
    }
});

function leaveJob(player) {
    player.utils.error("Вы уволились из Дальнобойщиков!");
    leaveVehicle(player);
    player.utils.putObject();
    player.utils.changeJob(0);
}

function leaveVehicle(player) {
    let vehicle = player.trucker;
    let trailer = player.trailer;
    delete player.trucker;
    delete player.trailer;
    if (vehicle) {
      // forks_attach
      if (vehicle === vehicle) alt.emitClient(player, `Vehicle::leave`, vehicle);
      alt.emitClient(player, "time.remove.back.trucker");
      setTimeout(() => {
        try {
          alt.emitClient(player, `Vehicle::repair`, vehicle);
          vehicle.dimension = 1;
          vehicle.pos = vehicle.spawnPos;
          vehicle.rot = new alt.Vector3(0, 0, vehicle.spawnPos.h * Math.PI / 180);
          vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
          vehicle.engineOn = false;
          if (trailer) trailer.destroy();
          delete vehicle.trucker;
        } catch (err) {
            alt.log(err);
            return;
        }
      }, 200);
    }
};
