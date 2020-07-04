const PostalJob = {
  salary_min: 10, // Минимальная сумма прибыли
  salary_max: 1000, // Макисмальная сумма прибыли
  order_min: 8, // Минимальное кол-во заказов
  order_max: 15, // Максимальное кол-во заказов
  postals: [],
  colshapes: {
    joinjob: new alt.ColshapeSphere(-258.56, -841.53, 31.42, 1.5),

    //storage: new alt.ColshapeSphere(573.03, 128.86, 99.47, 1.0)
  },
  functions: {
    defaultPostal(player) {
      player.utils.changeJob(0);
      // player.utils.setLocalVar("gopostalLeader", undefined);
      player.body.loadItems();
      alt.emitClient(player, "setPostalJobStatus", false);
      alt.emitClient(player, "remove.all.gopostal.data");
      player.utils.putObject();
    },
    leavePostalJob(player) {
      player.utils.success("Вы уволились из Go Postal!");
      PostalJob.functions.defaultPostal(player);
      PostalJob.functions.leaveVehicle(player);
      let team = getPostalTeam(player);
      if (team) {
        if (team.leader === player) {
          if (team.target) {
             team.target.error("Глава группы уволился, рабочий день закончился!");
             PostalJob.functions.defaultPostal(team.target);
          }
        }
        if (team.target === player) {
          if (team.leader) {
            // team.leader.utils.setLocalVar("gopostalLeader", undefined);
            team.leader.error("Ваш помощник уволился, рабочий день закончился!");
            PostalJob.functions.defaultPostal(team.leader);
          }
        }
        PostalJob.postals.splice(PostalJob.postals.indexOf(team), 1);
      }
    },
    joinPostalJob(player) {
      //if (alt.convertMinutesToLevelRest(player.minutes).level < 3) return player.utils.error("Вы не достигли 3 уровня!");
      player.utils.success("Вы устроились курьером в Go Postal!");
      player.utils.changeJob(10);
      alt.emitClient(player, "setPostalJobStatus", true);
      alt.emitClient(player, "control.gopostal.blip", 1);
      let job = new PostalOrder(player, undefined, undefined, 0, 0, 0, undefined);
      PostalJob.postals.push(job);
    },
    leaveVehicle(player) {
      let team = getPostalTeam(player);
      if (team) {
        team.orders = 0;
        if (team.vehicle) {
          let vehicle = team.vehicle;
          if (player.vehicle === vehicle) alt.emitClient(player, `Vehicle::leave`, vehicle);
          removeAllHumansFromVehicle(vehicle);
          setSaveTimeout(() => {
            try {
              alt.emitClient(player, `Vehicle::repair`, vehicle);
              vehicle.dimension = 1;
              vehicle.pos = vehicle.spawnPos;
              vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
              vehicle.engineOn = false;
              //alt.log("INFORMATION GOPOSTAL: " + vehicle.dimension + " | " + vehicle.spawnPos + " | " + vehicle.vehPropData.fuel + " | " + vehicle.engine + " | " + vehicle.spawnPos.h);
            } catch (err) {
                alt.log(err);
                return;
            }
          }, 200);
        }
      }
    },
    invitePlayer(player, recId) {
      var rec = alt.Player.getBySqlId(recId);
      if (!rec) return player.utils.error(`Гражданин не найден!`);
      if (rec === player) return player.utils.error(`Вы не можете пригласить себя!`);
      var dist = alt.Player.dist(player.pos, rec.pos);
      if (dist > Config.maxInteractionDist) return player.utils.error(`Гражданин далеко!`);
      if (player.job !== 10) return player.utils.error(`Вы не работаете почтальном в Go Postal!`);
      if (rec.job !== 10) return player.utils.error(`Игрок не работает почтальном в Go Postal!`);
      let team = getPostalTeam(player);
      if (team === undefined) return player.utils.error(`Вы не можете пригласить игрока в группу!`);
      if (team.target) return player.utils.error(`У вас уже есть 1 участник в группе!`);
      if (team.orders > 0) return player.utils.error(`Вы не можете создать группу, не закончив заказ!`);
      if (!team.vehicle) return player.utils.error(`У главы группы нет фургона!`);

      rec.inviteOffer = {
          leaderId: player.sqlId
      };

      player.utils.success(`Вы пригласили ${rec.getSyncedMeta("name")} в группу`);
      rec.utils.success(`Получено приглашение в группу`);
      alt.emitClient(rec, "choiceMenu.show", "acccept_gopostal_team", {
          name: player.getSyncedMeta("name")
      });
    },
    uninvitePlayer(player, recId) {
      var rec = alt.Player.getBySqlId(recId);
      if (!rec) return player.utils.error(`Гражданин не найден!`);
      if (rec === player) return player.utils.error(`Вы не можете уволить себя!`);
      var dist = alt.Player.dist(player.pos, rec.pos);
      if (dist > Config.maxInteractionDist) return player.utils.error(`Гражданин далеко!`);
      if (player.job !== 10) return player.utils.error(`Вы не работаете почтальном в Go Postal!`);
      let team = getPostalTeam(player);
      if (team === undefined) return player.utils.error(`Вы не можете уволить игрока из группы!`);
      if (team.target !== rec) return player.utils.error(`У вас нет участников в группе!`);
      if (team.orders > 0) return player.utils.error(`Вы не можете уволить участника, не закончив заказ!`);
      player.utils.error("Вы уволили " + rec.getSyncedMeta("name") + " из группы!");
      rec.utils.error(player.getSyncedMeta("name") + " уволил вас из группы!");
      delete team.target;
    },
    acceptInvite(player) {
      if (!player.inviteOffer) return player.utils.error(`Предложение не найдено!`);
      var rec = alt.Player.getBySqlId(player.inviteOffer.leaderId);
      if (!rec) return player.utils.error(`Отправитель не найден!`);
      var dist = alt.Player.dist(player.pos, rec.pos);
      if (dist > 5) return player.utils.error(`Отправитель слишком далеко!`);
      if (player.job !== 10) return player.utils.error(`Вы не работаете почтальном в Go Postal!`);
      if (rec.job !== 10) return player.utils.error(`Отправить не работает почтальном в Go Postal!`);
      let team = getPostalTeam(rec);
      if (!team) return player.utils.error(`Отправитель больше не является главой группы!`);
      let ourteam = getPostalTeam(player);
      if (ourteam) return player.utils.error(`Вы не можете вступить в группы!`);
      if (team.target) return player.utils.error(`У отправителя уже полная группа!`);
      if (team.orders > 0) return player.utils.error(`Отправитель больше не может создать группу!`);
      if (!team.vehicle) return player.utils.error(`У главы группы нет фургона!`);
      delete player.inviteOffer;

      player.utils.success(`Вы вступили в группу!`);
      rec.utils.success(`${player.getSyncedMeta("name")} принял приглашение в группу!`);
      // rec.utils.setLocalVar("gopostalLeader", 2);
      team.target = player;
      alt.emitClient(player, "control.gopostal.blip", 2);
      alt.emitClient(player, "set.gopostal.vehicle", team.vehicle);
    },
    unacceptInvite(player) {
      if (!player.inviteOffer) return;
      var rec = alt.Player.getBySqlId(player.inviteOffer.leaderId);
      if (rec) rec.utils.error(`${player.getSyncedMeta("name")} отказался вступить в группу!`);
    },
    takeBox(player) {

      if (player.getSyncedMeta("attachedObject") === "v_ind_cs_box02") {
        player.utils.error("Вы уже взяли коробку!");
        return;
      }

      player.utils.takeObject("v_ind_cs_box02");
      player.utils.error("Вы должны погрузить коробку в задний сектор фургона!");
      alt.emitClient(player, "prompt.show", "Для того, чтобы положить коробку нажмите <span class=\"hint-main__info-button\">Е</span>");
    },
    putBox(player) {
      if (player.getSyncedMeta("attachedObject") !== "v_ind_cs_box02") return;
      player.utils.putObject();
      let team = getPostalTeam(player);
      if (!team) return;
      team.boxes++;
      player.utils.error("Загружено коробок " + team.boxes + " из " + team.orders);
      if (team.boxes === team.orders) {
        player.utils.success("Фургон загружен, развезите почту по требуемым местам!");
        alt.emitClient(player, "clear.storage.gopostal");
        let target;
        if (team.leader === player && team.target) target = team.target;
        else if (team.target === player && team.leader) target = team.leader;

        if (target) {
          target.utils.success("Фургон загружен, развезите почту по требуемым местам!");
          alt.emitClient(target, "clear.storage.gopostal");
          target.utils.putObject();
        }
      }
    },
    startDay(player) {
      let team = getPostalTeam(player);
      if (team) {
        if (team.vehicle) {
          if (team.orders > 0) return player.utils.error("Сначала закончите предыдущий заказ!");
          player.utils.success("Вы начали погрузку!");
          let count = grn(PostalJob.order_min, PostalJob.order_max);
          let arr = getFreeHousePos(count);
          alt.emitClient(player, "create.gopostal.day", JSON.stringify(arr));
          alt.emitClient(player, "control.gopostal.blip", 3);
          team.orders = count;
          team.position = player.pos;
          if (team.target) {
            team.target.utils.success("Загрузите фургон почтой!");
            alt.emitClient(team.target, "create.gopostal.day", JSON.stringify(arr));
            alt.emitClient(team.target, "control.gopostal.blip", 3);
            team.orders = count * 2;
          }
        } else {
          player.utils.error("У вас нет используемого транспорта Go Postal!");
        }
      } else {
        player.utils.error("Вы не работаете почтальном в Go Postal!");
      }
    }
  }
};

alt.onClient("give.gopostal.item", (player, i) => {
    try {
      if (player.job !== 10) return;

      let team = getPostalTeam(player);
      if (team) {
        if (team.orders > 0 && team.vehicle) {
            let money = Math.trunc(alt.Player.dist(player.pos, team.position) * alt.economy["postal_salary"].value);

            if (team.target === player) money = Math.round(money / 100 * alt.economy["postal_salary_procent"].value);
            if (money < PostalJob.salary_min) money = PostalJob.salary_min;
            else if (money > PostalJob.salary_max) money = PostalJob.salary_max;

            team.boxes--;
            alt.emitClient(player, "delete.gopostal.colshape", i, team.boxes);
            //debug(`${team.boxes}`)
            team.position = player.pos;
            player.utils.success("Вы заработали $" + money);
            player.utils.setMoney(player.money + money);
            alt.logs.addLog(`${player.getSyncedMeta("name")} заработал на работе ${money}$`, 'job', player.account.id, player.sqlId, { money: money });
            if (team.target) {
              team.target.utils.success("Вы заработали $" + money);
              team.target.utils.setMoney(player.money + money);
              alt.logs.addLog(`${team.target.name} заработал на работе ${money}$`, 'job', team.target.account.id, team.target.sqlId, { money: money });
            }
            if (team.boxes === 0) return team.orders = 0;
            player.utils.success("Отправляйтесь к следующему дому!");
        }
      }
    } catch (err) {
        alt.log(err);
        return;
    }
});

class PostalOrder {
    constructor(owner, target, vehicle, orders, money, countbox, position) {
        this.owner = owner;
        this.target = target;
        this.vehicle = vehicle;
        this.orders = orders;
        this.money = money;
        this.boxes = countbox;
        this.position = position;
    }
}
function getPostalTeam(data) {
    try {
        for (let i = 0; i < PostalJob.postals.length; i++) {
            if (PostalJob.postals[i].owner === data || PostalJob.postals[i].target === data || PostalJob.postals[i].vehicle === data) {
                return PostalJob.postals[i];
            }
        }
        return undefined;
    } catch (err) {
        alt.log(err);
        return undefined;
    }
}
alt.onClient("take.gopostal.object", (player) => {
    try {
      if (player.job === 10) PostalJob.functions.takeBox(player);
    } catch (err) {
        alt.log(err);
        return;
    }
});
alt.onClient("put.gopostal.object", (player) => {
    try {
      if (player.job === 10) PostalJob.functions.putBox(player);
    } catch (err) {
        alt.log(err);
        return;
    }
});

alt.onClient("leave.gopostal.job", (player) => {
    try {
      if (player.job === 10) PostalJob.functions.leavePostalJob(player);
    } catch (err) {
        alt.log(err);
        return;
    }
});

alt.onClient("job.gopostal.agree", (player) => {
    try {
      if (player.job !== 0 && player.job !== 10) {
        player.utils.error("Вы уже где-то работаете!");
        return;
      }

      if (player.job === 10)
        PostalJob.functions.leavePostalJob(player);
      else
        PostalJob.functions.joinPostalJob(player);
    } catch (err) {
        alt.log(err);
        return;
    }
});

alt.on("playerDeath", function playerDeathHandler(player, reason, killer) {
   if (player.job === 10) PostalJob.functions.leavePostalJob(player);
});

alt.on("playerDisconnect", function playerDisconnectHandler(player, exitType, reason) {
  try {
      if (player.job === 10) PostalJob.functions.leavePostalJob(player);
  } catch (err) {
      alt.log(err);
      return;
  }
});

alt.on("entityEnterColshape", function onentityEnterColshape(shape, player) {
    try {
        if (!player.vehicle) {
          if (shape === PostalJob.colshapes.joinjob) alt.emitClient(player, "getPostalJobStatus", player.job !== 10 ? false : true);
        }
    } catch (err) {
        alt.log(err);
        return;
    }
});

alt.on("entityLeaveColshape", function onentityLeaveColshape(shape, player) {
    try {
      if (shape === PostalJob.colshapes.joinjob) alt.emitClient(player, "getPostalJobStatus", "cancel");
    } catch (err) {
        alt.log(err);
        return;
    }
});

alt.on("playerEnteredVehicle", function playerEnteredVehicleHandler(player, vehicle, seat) {
	if (vehicle.owner === -10 && player.job === 10 && seat === 1) {
    let vteam = getPostalTeam(vehicle);
    if (vteam !== undefined) {
      if (!alt.Player.exists(vteam.owner)) {
        delete vteam.vehicle;
      }
      else if (getPostalTeam(player).vehicle != vteam.vehicle) {
        delete vteam.vehicle;
      }
      else if (vteam.owner === player) {
        alt.emitClient(player, "time.remove.back.gopostal");
      } else {
        alt.emitClient(player, `Vehicle::leave`, vehicle);
        player.utils.error("Данное транспортное средство уже занято!");
      }
    } else {
      let team = getPostalTeam(player);
      if (team !== undefined) {
        if (team.vehicle !== undefined) {
          alt.emitClient(player, `Vehicle::leave`, vehicle);
          player.utils.error("Вы уже заняли одно транспортное средство!");
        } else {
         if (!haveLicense(player, vehicle)) return;
         team.vehicle = vehicle;
         vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
         alt.emitClient(player, "control.gopostal.blip", 2);
         alt.emitClient(player, "set.gopostal.vehicle", vehicle);
         // player.utils.setLocalVar("gopostalLeader", 1);
       }
      }
    }
  }
});

alt.on("playerChangedVehicleSeat", function playerChangedVehicleSeat(player, vehicle, oldseat, newseat) {
	if (vehicle.owner === -10 && player.job === 10 && newseat === 1) {
    let vteam = getPostalTeam(vehicle);
    if (vteam !== undefined) {
      if (!alt.Player.exists(vteam.owner)) delete vteam.vehicle;
      else if (getPostalTeam(player).vehicle != vteam.vehicle) delete vteam.vehicle;
      else if (vteam.owner === player) {
        alt.emitClient(player, "time.remove.back.gopostal");
      } else {
        alt.emitClient(player, `Vehicle::leave`, vehicle);
        player.utils.error("Данное транспортное средство уже занято!");
      }
    } else {
      let team = getPostalTeam(player);
      if (team !== undefined) {
        if (team.vehicle !== undefined) {
          alt.emitClient(player, `Vehicle::leave`, vehicle);
          player.utils.error("Вы уже заняли одно транспортное средство!");
        } else {
         if (!haveLicense(player, vehicle)) return;
         team.vehicle = vehicle;
         vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
         alt.emitClient(player, "control.gopostal.blip", 2);
         alt.emitClient(player, "set.gopostal.vehicle", vehicle);
         // player.utils.setLocalVar("gopostalLeader", 1);
       }
      }
    }
  }
});

alt.on("playerLeftVehicle", function playerLeftVehicleHandler(player, vehicle) {
  if (vehicle.owner === -10 && player.job === 10) {
    let team = getPostalTeam(player);
    if (team !== undefined) {
      if (team.vehicle === vehicle) {
        alt.emitClient(player, "time.add.back.gopostal");
        player.utils.error("У вас есть 3 минуты, чтобы вернуться в транспорт.");
      }
    }
  }
});

alt.onClient("begin.jobday.gopostal", (player) => {
    try {
       PostalJob.functions.acceptInvite(player);
    } catch (err) {
        alt.log(err);
        return;
    }
});

alt.onClient("gopostal.team.startday", (player) => {
    try {
       PostalJob.functions.startDay(player);
    } catch (err) {
        alt.log(err);
        return;
    }
});

alt.onClient("gopostal.team.cancel", (player) => {
    try {
       PostalJob.functions.unacceptInvite(player);
    } catch (err) {
        alt.log(err);
        return;
    }
});

alt.onClient("gopostal.invite.player", (player, id) => {
    try {
       PostalJob.functions.invitePlayer(player, id);
    } catch (err) {
        alt.log(err);
        return;
    }
});

alt.onClient("gopostal.uninvite.player", (player, id) => {
    try {
       PostalJob.functions.uninvitePlayer(player, id);
    } catch (err) {
        alt.log(err);
        return;
    }
});

function getFreeHousePos(count) {
  try
  {
    let arr = [];
    for (let i = 0; i < count; i++) {
       let num = getRandomNumber(0, alt.houses.length - 1, arr);
       let house = {x: alt.houses[num].pos.x, y: alt.houses[num].pos.y, z: alt.houses[num].pos.z};
       arr.push(house);
    }
    return arr;
  } catch (err){
      alt.log(err);
      return undefined;
  }
}
function haveLicense(player, vehicle) {
    if (!vehicle.license) return true;
    var docs = player.inventory.getArrayByItemId(16);
    for (var sqlId in docs) {
        if (docs[sqlId].params.licenses.indexOf(vehicle.license) != -1) return true;
    }
    return false;
}
function getRandomNumber(min, max, arr) {
    try {
        let massive = 1, num = 0;
        for (let i = 0; i < massive; i++) {
          num = Math.floor(Math.random() * (max - min)) + min;
          if (arr.includes({x: alt.houses[num].pos.x, y: alt.houses[num].pos.y, z: alt.houses[num].pos.z})) massive++;
        }
        return num;
    } catch (err) {
        alt.log(err);
        return -1;
    }
}
function grn(min, max) {
    try {
        return Math.floor(Math.random() * (max - min)) + min;
    } catch (err){
        alt.log(err);
        return -1;
    }
}

function removeAllHumansFromVehicle(vehicle) {
  try {
    alt.Player.all.forEach((rec) => { if (rec.vehicle && rec.vehicle == vehicle) alt.emitClient(rec, `Vehicle::leave`, vehicle); });
  }
  catch (err) {
      alt.log(err);
      return;
  }
}
