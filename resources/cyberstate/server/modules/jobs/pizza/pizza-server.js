/*
 player.havepizza - кол-во пиццы у игрока
*/
const PizzaJob = {
  salary_min: 10, // Минимальная сумма прибыли
  salary_max: 1000, // Макисмальная сумма прибыли
  colshapes: {
    joinjob: new alt.ColshapeSphere(538.54, 101.79, 96.54, 1.5),
    storage: new alt.ColshapeSphere(573.03, 128.86, 99.47, 1.0)
  },
  functions: {
    leavePizzaJob(player) {
      player.utils.success("Вы уволились из пиццерии!");
      player.utils.changeJob(0);
      delete player.body.denyUpdateView;
      player.body.loadItems();
      alt.emit(`setClothes`, player, 2, player.savehead.drawable, player.savehead.texture, player.savehead.palette);
      alt.emitClient(player, "setPizzaJobStatus", false);
      alt.emitClient(player, "create.pizza.storagemarker", false);
      delete player.havepizza, delete player.savehead;
    },
    joinPizzaJob(player) {
      player.utils.success("Вы устроились в пиццерию!");
      player.havepizza = 0;
      player.utils.changeJob(4);
      player.utils.success("Возьмите пиццу со склада!");
      alt.emitClient(player, "setPizzaJobStatus", true);
      alt.emitClient(player, "create.pizza.storagemarker", true);
      let skill = player.jobSkills[4 - 1];
      player.savehead = { drawable: player.hair, texture: 0, palette: 0 };
      if (skill < 60) {
        player.body.clearItems();
        player.body.denyUpdateView = true;
        alt.emit(`setClothes`, player, 2, 0, 0, 2);
        if (player.sex === 1) {
          // Одежда мужская
          alt.emit(`setClothes`, player, 1, 145, 0, 2);
          alt.emit(`setClothes`, player, 3, 1, 0, 2);
          alt.emit(`setClothes`, player, 4, 8, 3, 2);
          alt.emit(`setClothes`, player, 6, 4, 4, 2);
          alt.emit(`setClothes`, player, 8, 9, 5, 2);
          alt.emit(`setClothes`, player, 11, 88, 0, 2);
        } else {
          // Одежда женская
          alt.emit(`setClothes`, player, 1, 145, 0, 2);
          alt.emit(`setClothes`, player, 3, 1, 0, 2);
          alt.emit(`setClothes`, player, 4, 27, 2, 2);
          alt.emit(`setClothes`, player, 6, 3, 2, 2);
          alt.emit(`setClothes`, player, 11, 81, 0, 2);
        }
      } else {
        if (player.sex === 1) {
          // Одежда мужская
          alt.emit(`setClothes`, player, 3, 1, 0, 2);
          alt.emit(`setClothes`, player, 8, 9, 5, 2);
          alt.emit(`setClothes`, player, 11, 88, 0, 2);
        } else {
          // Одежда женская
          alt.emit(`setClothes`, player, 3, 1, 0, 2);
          alt.emit(`setClothes`, player, 11, 81, 0, 2);
        }
      }
    },
    takePizzaFromStorage(player) {
      if (player.havepizza > 0) {
        player.utils.error("Сначала развезите предыдущую пиццу!");
        return;
      } else if (player.havepizza === 0) {
          player.utils.success("Вы взяли 3 пиццы со склада!");
          alt.emit(`setClothes`, player, 5, 45, 0, 2);
          player.havepizza = 3;
          let arr = getFreeHousePos();
          alt.emitClient(player, "create.pizza.places", alt.houses[arr[0]].pos, alt.houses[arr[1]].pos, alt.houses[arr[2]].pos);
      }
    }
  }
};

alt.on("entityEnterColshape", function onentityEnterColshape(shape, player) {
    try {
        if (!player.vehicle) {
          if (shape === PizzaJob.colshapes.joinjob) alt.emitClient(player, "getPizzaJobStatus", player.job !== 4 ? false : true);
          else if (shape === PizzaJob.colshapes.storage && player.job === 4) PizzaJob.functions.takePizzaFromStorage(player);
        }
    } catch (err) {
        alt.log(err);
        return;
    }
});

alt.on("entityLeaveColshape", function onentityLeaveColshape(player, shape) {
    try {
      if (shape === PizzaJob.colshapes.joinjob) alt.emitClient(player, "getPizzaJobStatus", "cancel");
    } catch (err) {
        alt.log(err);
        return;
    }
});
alt.onClient("job.pizza.agree", (player) => {
    try {
      if (player.job !== 0 && player.job !== 4) {
        player.utils.error("Вы уже где-то работаете!");
        return;
      }

      if (player.job === 4)
        PizzaJob.functions.leavePizzaJob(player);
      else
        PizzaJob.functions.joinPizzaJob(player);
    } catch (err) {
        alt.log(err);
        return;
    }
});

alt.on("playerDeath", function playerDeathHandler(player, reason, killer) {
    if (player.job === 4) PizzaJob.functions.leavePizzaJob(player);
});

alt.onClient("give.pizza.item", (player, i) => {
    try {
      if (player.job !== 4) return;

      if (player.havepizza < 1) {
        player.utils.error("У вас недостаточно пиццы!");
        return;
      }
      
      player.isActive = true;
      let money = 0;
      if (player.jobSkills[4 - 1] < 60) money = Math.trunc(alt.Player.dist(player.pos, PizzaJob.colshapes.storage.pos) * alt.economy["pizza_salary"].value);
      else money = Math.trunc(alt.Player.dist(player.pos, PizzaJob.colshapes.storage.pos) * alt.economy["pizza_salary_sec"].value);

      if (money < PizzaJob.salary_min) money = PizzaJob.salary_min;
      else if (money > PizzaJob.salary_max) money = PizzaJob.salary_max;

      player.havepizza--;
      //debug(player.havepizza)
      alt.emitClient(player, "delete.pizza.colshape", i, player.havepizza);

      if (player.havepizza < 1) {
        player.utils.error("У вас закончилась пицца, направляйтесь на склад!");
        alt.emit(`setClothes`, player, 5, 44, 0, 2);
      }
      player.utils.setMoney(player.money + money);
      alt.logs.addLog(`${player.getSyncedMeta("name")} заработал на работе ${money}$`, 'job', player.account.id, player.sqlId, { money: money });
      player.utils.success("Вы заработали $" + money);
      player.utils.setJobSkills(4, player.jobSkills[4 - 1] + 1);

    } catch (err) {
        alt.log(err);
        return;
    }
});

alt.on("playerEnteredVehicle", function playerEnteredVehicleHandler(player, vehicle, seat) {
  // player.notify("Модель: ~r~" + vehicle.model);
	if (vehicle.owner === -4 && player.job === 4 && seat === 1) {
    let skill = player.jobSkills[4 - 1];
    if (skill < 60 && vehicle.model === 841808271) {
       player.notify("Опыт работы: ~r~" + skill + " ~w~из ~r~" + 60);
       alt.emitClient(player, `Vehicle::leave`, vehicle);
       return;
    }
    if (!haveLicense(player, vehicle)) return;
  }
});

alt.on("playerChangedVehicleSeat", function playerChangedVehicleSeat(player, vehicle, oldseat, newseat) {
  // player.notify("Модель: ~r~" + vehicle.model);
	if (vehicle.owner === -4 && player.job === 4 && newseat === 1) {
    let skill = player.jobSkills[4 - 1];
    if (skill < 60 && vehicle.model === 841808271) {
       player.notify("Опыт работы: ~r~" + skill + " ~w~из ~r~" + 60);
       alt.emitClient(player, `Vehicle::leave`, vehicle);
       return;
    }
    if (!haveLicense(player, vehicle)) return;
  }
});

function haveLicense(player, vehicle) {
    if (!vehicle.license) return true;
    var docs = player.inventory.getArrayByItemId(16);
    for (var sqlId in docs) {
        if (docs[sqlId].params.licenses.indexOf(vehicle.license) != -1) return true;
    }
    return false;
}

// Functions
function getFreeHousePos() {
  try {
    let arr = [-1, -1, -1];
    for (let i = 0; i < arr.length; i++) {
       let num = getRandomNumber(0, alt.houses.length - 1, arr);
       arr[i] = num;
    }
    return arr;
  } catch (err){
      alt.log(err);
      return undefined;
  }
}

function getRandomNumber(min, max, arr) {
    try {
        let massive = 1, num = 0;
        for (let i = 0; i < massive; i++) {
          num = Math.floor(Math.random() * (max - min)) + min;
          if (arr.includes(num)) massive++;
        }
        return num;
    } catch (err){
        alt.log(err);
        return -1;
    }
}
