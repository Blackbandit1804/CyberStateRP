// Дополнительный элементы: player.jobubildercloth - статус ( одет / не одет ), player.money - деньги, player.emoney - деньги, которые накапливается при сдаче коробки, player.jobbuilderfloor - отметка полученного значения.

const JobBuilder = {
    storage: 1000,
    boxes: [10, 15],
    place_1: new alt.Vector3(382.85, 2909.74, 49.30), // Самосвал
    place_2: new alt.Vector3(1225.19, 1880.16, 78.89), // Цемент
    place_3: new alt.Vector3(-147.62, -952.64, 21.28), // Самосвал
    place_4: new alt.Vector3(-175.82, -1029.61, 27.27), // Цемент
    out_boxes_positions: [
      { x: -149.93, y: -1072.59, z: 30.14, xs: 1.0, floor: 1 },
      { x: -176.97, y: -1102.98, z: 30.14, xs: 1.0, floor: 1 },
      { x: -173.96, y: -1065.82, z: 30.14, xs: 1.0, floor: 1 },
      { x: -175.99, y: -1103.14, z: 36.14, xs: 1.25, floor: 2 },
      { x: -150.16, y: -1072.50, z: 36.14, xs: 1.25, floor: 2 },
      { x: -169.62, y: -1064.14, z: 36.14, xs: 1.25, floor: 2 },
      { x: -165.28, y: -1094.82, z: 42.14, xs: 1.5, floor: 3 },
      { x: -180.80, y: -1061.41, z: 42.14, xs: 1.5, floor: 3 },
      { x: -162.07, y: -1099.03, z: 42.14, xs: 1.5, floor: 3 }
    ],
    out_boxes_colshapes: [
        new alt.ColshapeSphere(-149.93, -1072.59, 30.14, 1.0),
        new alt.ColshapeSphere(-176.97, -1102.98, 30.14, 1.0),
        new alt.ColshapeSphere(-173.96, -1065.82, 30.14, 1.0),
        new alt.ColshapeSphere(-175.99, -1103.14, 36.14, 1.0),
        new alt.ColshapeSphere(-150.16, -1072.50, 36.14, 1.0),
        new alt.ColshapeSphere(-169.62, -1064.14, 36.14, 1.0),
        new alt.ColshapeSphere(-165.28, -1094.82, 42.14, 1.0),
        new alt.ColshapeSphere(-180.80, -1061.41, 42.14, 1.0),
        new alt.ColshapeSphere(-162.07, -1099.03, 42.14, 1.0)
    ]
};
let jobcolshape = new alt.ColshapeSphere(-95.052, -1014.401, 27.275, 1.5); // Колшейп для устройства на работу
let jobclothcolshape = new alt.ColshapeSphere(-97.220, -1014.106, 27.275, 1.0); // Колшейп для раздевалки
let jobstoragebitemcolshape = new alt.ColshapeSphere(-154.730, -1077.751, 21.685, 1.0); // Колшейп для раздевалки

alt.on("playerDeath", function playerDeathHandler(player, reason, killer) {
    if (player.job === 7) {
        stopJobDay(player);
        leaveJob(player);
    }
});

alt.on("playerDisconnect", function playerDisconnectHandler(player, exitType, reason) {
  if (player.job === 7) {
    leaveVehicle(player);
  }
});

alt.on("playerEnteredVehicle", function playerStartEnterVehicleHandler(player, vehicle, seat) {
   if (player.jobbuilderfloor > -1 && !player.builder) stopBringingBox(player);
});

function stopBringingBox(player) {
  alt.emitClient(player, "createJobBuilderMarkBlip", true, false, -154.730, -1077.751, 21.685);
  player.jobbuilderfloor = -1;
}

module.exports.stopBringingBox = stopBringingBox;
alt.on("entityEnterColshape", function onentityEnterColshape(shape, player) {
    try
    {
        if (shape == jobcolshape && !player.vehicle) {
            if (player.job === 7)
                player.setSyncedMeta("keydownevariable", true);
            else
                player.setSyncedMeta("keydownevariable", false);
        }
        else if (shape == jobclothcolshape && player.job === 7) {
          if (player.jobbuilderfloor != -1) {
              player.utils.error("Сначала отнесите ящик на склад!");
              return;
          }

          if (player.jobubildercloth == true) {
              player.utils.success("Вы закончили рабочий день!");
              leaveVehicle(player);
          }
          changeBuilderClothes(player);
        }
        else if (shape == jobstoragebitemcolshape && player.jobubildercloth == true && player.job === 7) takeBoxBuilder(player);
        else if (JobBuilder.out_boxes_colshapes.includes(shape) && player.job === 7 && player.jobubildercloth == true) {
            let num = JobBuilder.out_boxes_colshapes.indexOf(shape);
            if (num == player.jobbuilderfloor) putBoxBuilder(player);
        }
    }
    catch (err){
        alt.log(err);
        return;
    }
});
alt.onClient("entityLeaveColshape", function onentityLeaveColshape(player, shape) {
    if (shape === jobcolshape) player.setSyncedMeta("keydownevariable", undefined);
});

alt.onClient("job.builder.agree", (player) => {
    try
    {
        if (player.job !== 0 && player.job !== 7) {
          player.utils.error("Вы уже где-то работаете!");
          return;
        }
        if (player.job === 7) {
            if (player.jobubildercloth == true) {
                player.utils.error("Вы ещё не закончили рабочий день!");
                return;
            }

            leaveJob(player);
        } else {
            player.utils.success("Вы устроились на стройку!");
            player.utils.error("Теперь переоденьтесь для начала рабочего дня!");
            player.utils.changeJob(7);
            player.jobbuilderfloor = -1;
            alt.emitClient(player, 'createJobBuilderRoom', true);
            player.setSyncedMeta("keydownevariable", true);
        }
    } catch (err){
        alt.log(err);
        return;
    }
});
function leaveJob(player) {
  player.utils.success("Вы уволились со стройки!");
  leaveVehicle(player);
  alt.emitClient(player, 'createJobBuilderRoom', false);
  player.setSyncedMeta("keydownevariable", false);
  player.utils.putObject();
  player.utils.changeJob(0);
  delete player.jobubildercloth;
  delete player.jobbuilderfloor;
  delete player.jobbuilderveh;
}
function mustTakeBoxLoader(player, id) {
  let pos = id === 3347205726 ? JobBuilder.place_1 : JobBuilder.place_2;
  alt.emitClient(player, "create.job.builder.mark", pos.x, pos.y, pos.z, true);
  player.utils.error("Направляйтесь на место загрузки!");
}
function stopBringingLoad(player) {
  let pos = player.builder.model === 3347205726 ? JobBuilder.place_1 : JobBuilder.place_2;
  alt.emitClient(player, "create.job.builder.mark", pos.x, pos.y, pos.z, true);
}
module.exports.stopBringingLoad = stopBringingLoad;
alt.onClient("use.builderfunctions.job", (player) => {
    try
    {
      if (!player.builder) return;
      if (player.job === 7) {
        let vehicle = player.builder;
        if (!player.vehicle) {
          if (player.getSyncedMeta("attachedObject")) {
             player.utils.putObject();
             vehicle.buildernum++;
             player.notify("Заполнено: ~r~" + vehicle.buildernum + " ~w~из ~r~" + vehicle.buildermax);
             if (vehicle.buildernum === vehicle.buildermax) {
               player.utils.success("Направляйтесь на место разгрузки!");
               let pos = vehicle.model === 3347205726 ? JobBuilder.place_3 : JobBuilder.place_4;
               alt.emitClient(player, "createJobNeedBuilderMarkBlip", pos.x, pos.y, pos.z);
               return;
             }
             let pos = vehicle.model === 3347205726 ? JobBuilder.place_1 : JobBuilder.place_2;
             alt.emitClient(player, "create.job.builder.mark", pos.x, pos.y, pos.z, true);
          } else {
             if (alt.Player.dist(player.pos, vehicle.pos) > 500) return player.utils.error("Ваш транспорт слишком далеко!");
             if (alt.Player.dist(player.pos, vehicle.pos) < 9) return player.utils.error("Ваш транспорт слишком близко!");
             let box = vehicle.model === 3347205726 ? "prop_bucket_01a" : "prop_feed_sack_01";
             player.utils.takeObject(box);
             player.utils.error("Положите ящик в задний сектор транспорта!");
             alt.emitClient(player, "create.job.builder.load");
          }
        } else {
          if (vehicle.buildernum === vehicle.buildermax) {
            player.utils.success("Дождитесь окончания разгрузки!");
            alt.emitClient(player, "startBuilderUnload");
          }
        }
      }
    }
    catch (err) {
        alt.log(err);
        return;
    }
});
alt.onClient("stop.builder.unload", (player) => {
    try
    {
      if (!player.builder) return;
      if (player.job === 7) {
        let vehicle = player.builder;
        if (vehicle.buildermax < 1) return player.utils.error("Вы не загружены!");
        if (vehicle.buildernum === vehicle.buildermax) {
          let mon = vehicle.model === 3347205726 ? alt.economy["build_salary_sec"].value : alt.economy["build_salary_third"].value;
          let money = (vehicle.buildernum * alt.economy["build_salary_box"].value) + mon;
          if (isNaN(money)) return player.utils.error("Вы не загружены!");
          player.utils.success("Разгрузка заврешена, вы заработали $" + money);
          player.utils.setMoney(player.money + money);
          alt.logs.addLog(`${player.getSyncedMeta("name")} заработал на работе ${money}$`, 'job', player.account.id, player.sqlId, { money: money });
          vehicle.buildermax = getRandomNumber(JobBuilder.boxes[0], JobBuilder.boxes[1]);
          vehicle.buildernum = 0;
          mustTakeBoxLoader(player, vehicle.model);
        }
      }
    }
    catch (err) {
        alt.log(err);
        return;
    }
});
alt.on("playerChangedVehicleSeat", function playerChangedVehicleSeat(player, vehicle, oldseat, newseat) {
	if (vehicle.owner === -7 && player.job === 7 && newseat === 1) {
     if (player.jobubildercloth) {
       let skill = player.jobSkills[7 - 1];
       if (skill < 50) {
          player.notify("Опыт работы: ~r~" + skill + " ~w~из ~r~" + 50);
          alt.emitClient(player, `Vehicle::leave`, vehicle);
          return;
       }

       if (player.builder && player.builder !== vehicle)  {
          player.utils.error("Вы уже заняли одно транспортное средство!");
          alt.emitClient(player, `Vehicle::leave`, vehicle);
          return;
       }

       if (vehicle.builder) {
         if (!alt.Player.exists(vehicle.builder)) delete vehicle.builder;
         else if (vehicle.builder.builder != vehicle) delete vehicle.builder;
         else if (vehicle.builder !== player) {
           player.utils.error("Данный транспорт уже занят другим рабочим!");
           alt.emitClient(player, `Vehicle::leave`, vehicle);
         } else {
           alt.emitClient(player, "time.remove.back.builder");
         }
         return;
       }
       if (!haveLicense(player, vehicle)) return;
       if (alt.convertMinutesToLevelRest(player.minutes).level < 2) {
         alt.emitClient(player, `Vehicle::leave`, vehicle);
         return player.utils.error("Вы не достигли 2 уровня!");
       }
       vehicle.builder = player;
       player.builder = vehicle;
       alt.emitClient(player, "create.job.builder.vehicle", vehicle);
       mustTakeBoxLoader(player, vehicle.model);
       vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
       vehicle.buildermax = getRandomNumber(JobBuilder.boxes[0], JobBuilder.boxes[1]);
       vehicle.buildernum = 0;
     } else {
       player.utils.error("Вы не начали рабочий день!");
       alt.emitClient(player, `Vehicle::leave`, vehicle);
     }
  }
});
alt.on("playerEnteredVehicle", function playerEnteredVehicleHandler(player, vehicle, seat) {
	if (vehicle.owner === -7 && player.job === 7 && seat === 1) {
     if (player.jobubildercloth) {
       let skill = player.jobSkills[7 - 1];
       if (skill < 50) {
          player.notify("Опыт работы: ~r~" + skill + " ~w~из ~r~" + 50);
          alt.emitClient(player, `Vehicle::leave`, vehicle);
          return;
       }

       if (player.builder && player.builder !== vehicle)  {
          player.utils.error("Вы уже заняли одно транспортное средство!");
          alt.emitClient(player, `Vehicle::leave`, vehicle);
          return;
       }

       if (vehicle.builder) {
         if (!alt.Player.exists(vehicle.builder)) delete vehicle.builder;
         else if (vehicle.builder.builder != vehicle) delete vehicle.builder;
         else if (vehicle.builder !== player) {
           player.utils.error("Данный транспорт уже занят другим рабочим!");
           alt.emitClient(player, `Vehicle::leave`, vehicle);
         } else {
           alt.emitClient(player, "time.remove.back.builder");
         }
         return;
       }
       if (!haveLicense(player, vehicle)) return;
       if (alt.convertMinutesToLevelRest(player.minutes).level < 2) {
         alt.emitClient(player, `Vehicle::leave`, vehicle);
         return player.utils.error("Вы не достигли 2 уровня!");
       }
       vehicle.builder = player;
       player.builder = vehicle;
       alt.emitClient(player, "create.job.builder.vehicle", vehicle);
       mustTakeBoxLoader(player, vehicle.model);
       vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
       vehicle.buildermax = getRandomNumber(JobBuilder.boxes[0], JobBuilder.boxes[1]);
       vehicle.buildernum = 0;
     } else {
       player.utils.error("Вы не начали рабочий день!");
       alt.emitClient(player, `Vehicle::leave`, vehicle);
     }
  }
});
alt.on("playerLeftVehicle", function playerLeftVehicleHandler(player, vehicle) {
  if (vehicle.owner === -7 && player.job === 7) {
    if (vehicle === player.builder) {
      if (alt.Player.dist(player.pos, JobBuilder.place_1) < 100 || alt.Player.dist(player.pos, JobBuilder.place_2) < 100) {
         alt.emitClient(player, "time.add.back.builder", 300000);
         player.utils.error("У вас есть 5 минут, чтобы вернуться в транспорт.");
         return;
      }
      alt.emitClient(player, "time.add.back.builder", 60000);
      player.utils.error("У вас есть 1 минута, чтобы вернуться в транспорт.");
    }
  }
});
alt.onClient("leave.builder.job", (player) => {
    try
    {
      changeBuilderClothes(player);
      leaveJob(player);
    }
    catch (err) {
        alt.log(err);
        return;
    }
});
function leaveVehicle(player) {
  let vehicle = player.builder;
  delete player.builder;
  if (vehicle) {
    // forks_attach
    if (vehicle === vehicle) alt.emitClient(player, `Vehicle::leave`, vehicle);
    alt.emitClient(player, "time.remove.back.builder");
    setSaveTimeout(() => {
      try {
        alt.emitClient(player, `Vehicle::repair`, vehicle);
        vehicle.dimension = 1;
        vehicle.pos = vehicle.spawnPos;
        vehicle.rot = new alt.Vector3(0, 0, vehicle.spawnPos.h * Math.PI / 180);
        vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
        vehicle.engineOn = false;
        delete vehicle.builder, delete vehicle.buildermax, delete vehicle.buildernum;
      } catch (err) {
          alt.log(err);
          return;
      }
    }, 200);
  }
};
function haveLicense(player, vehicle) {
    if (!vehicle.license) return true;
    var docs = player.inventory.getArrayByItemId(16);
    for (var sqlId in docs) {
        if (docs[sqlId].params.licenses.indexOf(vehicle.license) != -1) return true;
    }
    return false;
}
function stopJobDay(player) {
  if (player.jobubildercloth === false) return;
  player.jobubildercloth = false;
  alt.emitClient(player, "createJobBuilderMarkBlip", false, false, -154.730, -1077.751, 21.685);
  // Возвращаем одежду персонажа
  delete player.body.denyUpdateView;
  player.body.loadItems();
}
function changeBuilderClothes(player){
    try
    {
        if (player.job !== 7) return;
        if (player.jobubildercloth == true) {
          stopJobDay(player);
        } else {
            if (player.vehicle) return;
            player.utils.success("Вы начали рабочий день!");
            player.jobubildercloth = true;
            alt.emitClient(player, "createJobBuilderMarkBlip", true, false, -154.730, -1077.751, 21.685);
            player.body.clearItems();
            player.body.denyUpdateView = true;
            if (player.sex === 1) {
              // Одежда мужская
              alt.emit(`setClothes`, player, 3, 61, 0, 2);
              alt.emit(`setClothes`, player, 4, 36, 0, 2);
              alt.emit(`setClothes`, player, 6, 12, 0, 2);
              alt.emit(`setClothes`, player, 8, 59, 1, 2);
              alt.emit(`setClothes`, player, 11, 57, 0, 2);
              // player.setProp(0, 0, 0); - Голова ( наушники )
            } else {
              // Одежда женская
              alt.emit(`setClothes`, player, 3, 62, 0, 2);
              alt.emit(`setClothes`, player, 4, 35, 0, 2);
              alt.emit(`setClothes`, player, 6, 26, 0, 2);
              alt.emit(`setClothes`, player, 8, 36, 1, 2);
              alt.emit(`setClothes`, player, 11, 50, 0, 2);
              // player.setProp(0, 0, 0); - Голова ( наушники )
            }
        }
    } catch (err){
        alt.log(err);
        return;
    }
};

function takeBoxBuilder(player){
    try
    {
        if (player.jobbuilderfloor == -1) {
          player.utils.takeObject("hei_prop_heist_wooden_box");
          player.jobbuilderfloor = getRandomNumber(0, 8);
          player.notify("Отнесите ящик на ~r~ " + JobBuilder.out_boxes_positions[player.jobbuilderfloor].floor + " ~w~этаж!");
          alt.emitClient(player, "createJobBuilderMarkBlip", true, true, JobBuilder.out_boxes_positions[player.jobbuilderfloor].x, JobBuilder.out_boxes_positions[player.jobbuilderfloor].y, JobBuilder.out_boxes_positions[player.jobbuilderfloor].z);
        } else {
            player.utils.error("Вы уже взяли ящик со склада!");
        }
    } catch (err){
        alt.log(err);
        return;
    }
};

function putBoxBuilder(player){
    try
    {
        player.utils.putObject();
        let money = Math.round(alt.economy["build_salary"].value * JobBuilder.out_boxes_positions[player.jobbuilderfloor].xs);
        player.utils.setMoney(player.money + money);
        alt.logs.addLog(`${player.getSyncedMeta("name")} заработал на работе ${money}$`, 'job', player.account.id, player.sqlId, { money: money });
        alt.emitClient(player, "createJobBuilderMarkBlip", true, false, -154.730, -1077.751, 21.685);
        player.utils.setJobSkills(7, player.jobSkills[7 - 1] + 1);
        if (player.jobSkills[7 - 1] === 50) player.utils.error("Вам открыта 2 ступень работы!");
        player.utils.success(`Заработано: ${money}$`);
        player.jobbuilderfloor = -1;
    } catch (err){
        alt.log(err);
        return;
    }
};

function getRandomNumber(min, max) {
    try
    {
        return Math.floor(Math.random() * (max - min)) + min;
    } catch (err){
        alt.log(err);
        return -1;
    }
}
