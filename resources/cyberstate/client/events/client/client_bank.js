import alt from 'alt';
import game from 'natives';

alt.on(`Client::init`, (view) => {
  const player = alt.Player.local
  const BankInfo = {
      blip: alt.helpers.blip.new(207, 235.43, 216.95, 106.29, { alpha: 255, name: 'Банк', color: 25, scale: 0.7, shortRange: true}),
      keydown_E: false,
      enter: 0,
      main_show: false,
      balance: 0,
      hbalance: [],
      houses: [],
      buttons: [
      { text: "Пополнить баланс" },
      { text: "Снять с баланса" },
      { text: "Перевести на другой счёт" },
      { text: "Пополнить баланс дома" },
      { text: "Снять с баланса дома" },
      { text: "Закрыть"}]
    }

    alt.onServer(`BankInfo::keyDown`, (enable) => {
      if (enable) {
        alt.emit("prompt.show", `Нажмите <span class=\"hint-main__info-button\">E</span> для взаимодействия`);
        BankInfo.keydown_E = true;
        BankInfo.enter++;
      } else {
        BankInfo.keydown_E = false;
        BankInfo.main_show = false;
        BankInfo.enter = 0;
        alt.emit("selectMenu.hide", "bank_menu");
      }
    });

    alt.on(`keydown`, (key) => {
      if (key === 0x45) {
        if (BankInfo.keydown_E && !BankInfo.main_show && !player.vehicle) {
          alt.emitServer("show.bank.menu");
          BankInfo.main_show = true;
        } else if (BankInfo.main_show) {
          alt.emit("selectMenu.hide", "bank_menu");
          BankInfo.main_show = false;
        }
      }
    });

    alt.onServer('show.bank.menu', (money, bmoney, houses, isAtm = false) => {
      BankInfo.balance = money;
      BankInfo.hbalance = bmoney;
      if (houses.length > 0) {
        BankInfo.buttons[3] = { text: "Пополнить баланс дома", values: houses };
        BankInfo.buttons[4] = { text: "Снять с баланса дома", values: houses };
        BankInfo.houses = houses;
      }
      else {
        BankInfo.buttons[3] = { text: "Пополнить баланс дома" };
        BankInfo.buttons[4] = { text: "Снять с баланса дома" };
        BankInfo.houses = -1;
      }
      alt.emit("selectMenu.setHeader", "bank_menu", "Ваш Баланс $" + money);
  
      if (isAtm) {
          const items = [ BankInfo.buttons[0], BankInfo.buttons[1], BankInfo.buttons[BankInfo.buttons.length - 1] ];
  
          alt.emit("selectMenu.setSpecialItems", "bank_menu", items);
      } else {
          alt.emit("selectMenu.setSpecialItems", "bank_menu", BankInfo.buttons);
      }
    
      alt.emit("selectMenu.show", "bank_menu");
    });
    
    view.on("selectMenu.itemSelected", (menuName, itemName, itemValues, itemIndex) => {
        if (menuName === "bank_menu") {
        alt.emit("selectMenu.hide", "bank_menu");
        switch (itemName) {
          case "Закрыть":
            BankInfo.main_show = false;
            break;
          case "Пополнить баланс":
            alt.emit("modal.show", "bank_money_put", { money: BankInfo.balance });
            break;
          case "Снять с баланса":
            alt.emit("modal.show", "bank_money_take", { money: BankInfo.balance });
            break;
          case "Перевести на другой счёт":
            alt.emit("modal.show", "bank_money_transfer", { money: BankInfo.balance });
            break;
          case "Пополнить баланс дома":
            if (checkHouse()) alt.emit("modal.show", "bank_money_house_give", { money: BankInfo.balance, house: itemValues, bhouse: BankInfo.hbalance[BankInfo.houses.indexOf(itemValues)] });
            break;
          case "Снять с баланса дома":
            if (checkHouse()) alt.emit("modal.show", "bank_money_house_take", { money: BankInfo.balance, house: itemValues, bhouse: BankInfo.hbalance[BankInfo.houses.indexOf(itemValues)] });
            break;
          default:
        }
      }
    });
    
    view.on('update.bank.main.open', (status) => { BankInfo.main_show = status; });
    view.on('put.bank.money', (money) => {
      let newMoney = simpleCheck(money);
      if (newMoney !== false) alt.emitServer("put.bank.money", newMoney);
    });
    view.on('take.bank.money', (money) => {
      let newMoney = simpleCheck(money);
      if (newMoney !== false) alt.emitServer("take.bank.money", newMoney);
    });
    view.on('pass.player.money', (money, interactionId) => {
      let newMoney = simpleCheck(money);
      if (newMoney !== false) alt.emitServer("pass.player.money", newMoney, interactionId);
    });
    view.on('give.bank.money.house', (money, id) => {
      let newMoney = simpleCheck(money);
      var house = id.split("№");
      if (newMoney !== false) alt.emitServer("give.bank.money.house", money, parseInt(house[1], 10));
    });
    view.on('take.bank.money.house', (money, id) => {
      let newMoney = simpleCheck(money);
      var house = id.split("№");
      if (newMoney !== false) alt.emitServer("take.bank.money.house", money, parseInt(house[1], 10));
    });
    view.on('transfer.bank.money', (name, money) => {
      if (name.toLowerCase() === player.getSyncedMeta("name").toLowerCase()) {
        alt.emit("nWarning", "Вы не можете перечислить деньги на свой счёт!");
        return;
      }
      let newMoney = simpleCheck(money);
      if (newMoney !== false) alt.emitServer("transfer.bank.money", name, newMoney);
    });

    function checkHouse() {
      if (BankInfo.houses === -1) {
        alt.emit("nWarning", "У вас нет дома!");
        BankInfo.main_show = false;
        return false;
      }
      return true;
    }

    function simpleCheck(value) {
      let num = parseInt(value, 10);
      if (isNaN(num)) {
        alt.emit("nWarning", "Заполните поле корректно!");
        return false;
      }
      return num;
    }
});