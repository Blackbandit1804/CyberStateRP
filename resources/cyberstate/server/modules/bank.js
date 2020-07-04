const BankInfo = {
  minimal_summa: 1, // Минимальная сумма пополнения|снятия
  maximum_summa: 1000000, // Макисмальная сумма пополнения|снятия
  colshapes: [
    new alt.ColshapeSphere(241.36, 225.22, 106.29, 1.0),
    new alt.ColshapeSphere(243.20, 224.54, 106.29, 1.0),
    new alt.ColshapeSphere(246.55, 223.38, 106.29, 1.0),
    new alt.ColshapeSphere(248.39, 222.71, 106.29, 1.0),
    new alt.ColshapeSphere(251.75, 221.49, 106.29, 1.0),
    new alt.ColshapeSphere(253.57, 220.83, 106.29, 1.0)
  ],
  functions: {
    updateBalanceMoney(player, isAtm = false) {
      //console.log(`${player}, ${isAtm}`)
			if (isAtm) {
				alt.emitClient(player, "show.bank.menu", player.bank, [], [], true);
				return;
			}

			let houses = alt.houses.getArrayByOwner(player.sqlId);
			let id_houses = [], houses_balance = [];

			for (let i = 0; i < houses.length; i++) {
				let hprice = houses[i].getTax();

				id_houses.push("№" + houses[i].sqlId);
				houses_balance.push("$" + houses[i].balance + " из " + Math.round(hprice * 24 * 14));
			}

			alt.emitClient(player, "show.bank.menu", player.bank, houses_balance, id_houses);
    },
    putBalanceMoney(player, money) {
      if (money < BankInfo.minimal_summa) {
        player.utils.error("Минимальная сумма пополнения $" + BankInfo.minimal_summa);
        return;
      }

      if (money > BankInfo.maximum_summa) {
        player.utils.error("Максимальная сумма пополнения $" + BankInfo.maximum_summa);
        return;
      }

      if (player.money < money) {
        player.utils.error("У вас недостаточно денег!");
        return;
      }

      // let bmoney = player.bank + money;
      player.utils.setMoney(player.money - money);
      alt.logs.addLog(`${player.getSyncedMeta("name")} положил на банковский счет ${money}$`, 'bank', player.account.id, player.sqlId, { money: money });
      player.utils.setBankMoney(player.bank + money);
      player.utils.bank("Пополнение счёта", "На ваш счет зачисленно ~g~$" + money);
      alt.emitClient(player, "modal.hide");
    },
    takeBalanceMoney(player, money) {
      if (money < BankInfo.minimal_summa) {
        player.utils.error("Минимальная сумма вывода $" + BankInfo.minimal_summa);
        return;
      }

      if (money > BankInfo.maximum_summa) {
        player.utils.error("Максимальная сумма вывода $" + BankInfo.maximum_summa);
        return;
      }

      if (player.bank < money) {
        player.utils.error("На балансе недостаточно денег!");
        return;
      }

      player.utils.setBankMoney(player.bank - money);
      alt.logs.addLog(`${player.getSyncedMeta("name")} вывел с банковского счета ${money}$`, 'bank', player.account.id, player.sqlId, { money: money });
      player.utils.setMoney(player.money + money);
      player.utils.bank("Вывод с счёта", "С вашего счёта снято ~r~$" + money);
      alt.emitClient(player, "modal.hide");
    },
    giveBankMoneyHouse(player, money, house) {
      // return player.utils.error("Налоги на дом выключены!");
      let houses = alt.houses.getArrayByOwner(player.sqlId);
      let id_houses = [], myhouse;
      for (let i = 0; i < houses.length; i++) id_houses.push(houses[i].sqlId);

      if (id_houses.includes(house)) {
        myhouse = houses[id_houses.indexOf(house)];
      } else {
        player.utils.error("Вы не владеете домом №" + house);
        return;
      }

      if (money < BankInfo.minimal_summa) {
        player.utils.error("Минимальная сумма пополнения $" + BankInfo.minimal_summa);
        return;
      }

      if (money > BankInfo.maximum_summa) {
        player.utils.error("Максимальная сумма пополнения $" + BankInfo.maximum_summa);
        return;
      }

      if (player.bank < money) {
        player.utils.error("На балансе недостаточно денег!");
        return;
      }

      let hprice = myhouse.getTax() * 24 * 14;
      let hbalance = parseInt(myhouse.balance, 10) + parseInt(money, 10);
      if (hbalance > hprice) {
        player.utils.error("Вы не можете положить столько денег на счёт!");
        return;
      }

      myhouse.setBalance(hbalance);
      player.utils.setBankMoney(player.bank - parseInt(money, 10));
      player.utils.bank("Пополнение счёта", "На счет вашего дома ~g~№" + house + " ~w~зачисленно ~g~$" + money);
      alt.emitClient(player, "modal.hide");
    },
    takeBankMoneyHouse(player, money, house) {
      // return player.utils.error("Налоги на дом выключены!");
      let houses = alt.houses.getArrayByOwner(player.sqlId);
      let id_houses = [], myhouse;
      for (let i = 0; i < houses.length; i++) id_houses.push(houses[i].sqlId);

      if (id_houses.includes(house)) {
        myhouse = houses[id_houses.indexOf(house)];
      } else {
        player.utils.error("Вы не владеете домом №" + house);
        return;
      }

      if (money < BankInfo.minimal_summa) {
        player.utils.error("Минимальная сумма вывода $" + BankInfo.minimal_summa);
        return;
      }

      if (money > BankInfo.maximum_summa) {
        player.utils.error("Максимальная сумма вывода $" + BankInfo.maximum_summa);
        return;
      }

      if (myhouse.balance < money) {
        player.utils.error("На балансе дома недостаточно денег!");
        return;
      }

      let hbalance = parseInt(myhouse.balance, 10) - parseInt(money, 10);
      myhouse.setBalance(hbalance);
      player.utils.setBankMoney(player.bank + parseInt(money, 10));
      player.utils.bank("Пополнение счёта", "На ваш счет зачисленно ~g~$" + money);
      alt.emitClient(player, "modal.hide");
    },
    transferBalanceMoney(player, name, money) {
      if (alt.convertMinutesToLevelRest(player.minutes).level < 2) return player.utils.error("Вы не достигли 2 уровня!");
      DB.Query("SELECT * FROM characters WHERE name=?", [name], (e, result) => {
          if (e) {
            callback("Ошибка выполнения запроса в БД!");
            return terminal.error(e);
          }
          if (result.length < 1) {
            player.utils.error("Игрока с таким именем не существует!");
            return;
          }

          let dbplayer = result[0];

          if (money < BankInfo.minimal_summa) {
            player.utils.error("Минимальная сумма перевода $" + BankInfo.minimal_summa);
            return;
          }

          if (money > BankInfo.maximum_summa) {
            player.utils.error("Максимальная сумма перевода $" + BankInfo.maximum_summa);
            return;
          }

          if (player.bank < money) {
            player.utils.error("На балансе недостаточно денег!");
            return;
          }

          let target = alt.Player.getBySqlId(dbplayer.sqlId);
          if (target === undefined) {
            DB.Query("UPDATE characters SET bank=bank+? WHERE id=?", [money, dbplayer.sqlId], (e, result) => {
                if (e) {
                    if (callback) callback("Ошибка выполнения запроса в БД!");
                    return terminal.error(e);
                  }
                  alt.logs.addLog(`${name} получил на банковский счет ${money} от ${player.getSyncedMeta("name")}`, 'bank', dbplayer.accountId, dbplayer.id, { money: money });
                });
          } else {
            target.utils.setBankMoney(target.bank + money);
            alt.logs.addLog(`${name} получил на банковский счет ${money} от ${player.getSyncedMeta("name")}`, 'bank', target.account.id, target.sqlId, { money: money });
            target.utils.bank("Пополнение счёта", "~g~" + player.getSyncedMeta("name") + " ~w~перечислил на ваш счёт ~g~$" + money);
          }

          player.utils.setBankMoney(player.bank - money);
          alt.logs.addLog(`${player.getSyncedMeta("name")} перевел на банковскй счет ${name} - ${money}$`, 'bank', player.account.id, player.sqlId, { money: money });
          player.utils.bank("Перевод средств", "Вы перевели " + dbplayer.name + " ~g~$" + money);
          alt.emitClient(player, "modal.hide");
          return;
      });
    }
  }
}

alt.on(`entityEnterColshape`, (shape, player) => {
  if (BankInfo.colshapes.includes(shape) && !player.vehicle) {
    alt.emitClient(player, "BankInfo::keyDown", true);
  }
});

alt.on(`entityLeaveColshape`, (shape, player) => {
  if (BankInfo.colshapes.includes(shape)) {
    alt.emitClient(player, "BankInfo::keyDown", false);
  }
});

alt.onClient("show.bank.menu", (player, isAtm = false) => {
    try
    {
       BankInfo.functions.updateBalanceMoney(player, isAtm);
    }
    catch (err) {
        alt.log(err);
        return;
    }
});
alt.onClient("take.bank.money", (player, money) => {
    try
    {
       BankInfo.functions.takeBalanceMoney(player, money);
    }
    catch (err) {
        alt.log(err);
        return;
    }
});
alt.onClient("put.bank.money", (player, money) => {
    try
    {
       BankInfo.functions.putBalanceMoney(player, money);
    }
    catch (err) {
        alt.log(err);
        return;
    }
});
alt.onClient("transfer.bank.money", (player, name, money) => {
    try
    {
       BankInfo.functions.transferBalanceMoney(player, name, money);
    }
    catch (err) {
        alt.log(err);
        return;
    }
});
alt.onClient("give.bank.money.house", (player, money, house) => {
    try
    {
       BankInfo.functions.giveBankMoneyHouse(player, money, house);
    }
    catch (err) {
        alt.log(err);
        return;
    }
});
alt.onClient("take.bank.money.house", (player, money, house) => {
    try
    {
       BankInfo.functions.takeBankMoneyHouse(player, money, house);
    }
    catch (err) {
        alt.log(err);
        return;
    }
});
alt.onClient("pass.player.money", (player, money, recId) => {
    try
    {
      var rec = alt.Player.getBySqlId(recId);
      if (!rec) return player.utils.error(`Гражданин не найден!`);
      var dist = alt.Player.dist(player.pos, rec.pos);
      if (dist > Config.maxInteractionDist) return player.utils.error(`Гражданин далеко!`);
      if (money < 1) return player.utils.error(`Вы не можете передать меньше $1`);
      if (money > 25000) return player.utils.error(`Вы не можете передать больше $25000`);
      if (money > player.money) return player.utils.error("У вас недостаточно денег!");
      if (alt.convertMinutesToLevelRest(player.minutes).level < 2) return player.utils.error("Вы не достигли 2 уровня!");
      player.utils.success(`Вы передали ${rec.getSyncedMeta("name")} - $${money}`);
      rec.utils.success(`${player.getSyncedMeta("name")} передал вам $${money}`);
      alt.emitClient(player, "modal.hide");
      player.utils.setMoney(player.money - money);
      if (rec) rec.utils.setMoney(rec.money + money);
      alt.logs.addLog(`${player.getSyncedMeta("name")} перевел деньги ${rec.getSyncedMeta("name")} - ${money}$`, 'bank', player.account.id, player.sqlId, { money: money });
    }
    catch (err) {
        alt.log(err);
        return;
    }
});
