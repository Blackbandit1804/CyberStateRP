import alt from 'alt';
import game from 'natives';

const GangController = {
  balance: 0,
  storage_rank: 100,
  weapon_rank: 100,
  ammo_rank: 100,
  drugs_rank: 100,
  money_rank: 100,
  drugs: [0, 0, 0, 0],
  drugs_in: [0, 0, 0, 0],
  drugs_name: ["Марихуана", "МДМА", "Кокаин", "Метамфетамин"],
  ammo: [0, 0, 0, 0],
  ammo_in: [0, 0, 0, 0],
  ammo_name: ["Патроны 9mm", "Патроны 12mm", "Патроны 7.62mm", "Патроны 5.56mm"],
  weapons: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 81
  weapons_in: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  weapons_name_1: ["Старинный кинжал", "Бита", "Разбитая бутылка", "Лом", "Фонарик", "Клюшка", "Молоток", "Топор",
  "Кастет", "Нож", "Мачете", "Складной нож", "Полицейская дубинка", "Гаечный ключ", "Боевой топор", "Кий",
  "Каменный топор"],
  weapons_name_2: ["Pistol", "Pistol Mk II", "Combat Pistol", "AP Pistol", "Stun Gun", "Pistol 50", "SNS Pistol",
  "SNS Pistol Mk II", "Heavy Pistol", "Vintage Pistol", "Flare Gun", "Marksman Pistol", "Heavy Revolver", "Heavy Revolver Mk II",
  "Double Action Revolver"],
  weapons_name_3: ["Micro SMG", "SMG", "SMG Mk II", "Assault SMG", "Combat PDW", "Machine Pistol", "Mini SMG"],
  weapons_name_4: ["Pump Shotgun", "Pump Shotgun Mk II", "Sawed-Off Shotgun", "Assault Shotgun", "Bullpup Shotgun",
  "Musket", "Heavy Shotgun", "Double Barrel Shotgun", "Sweeper Shotgun"],
  weapons_name_5: ["Assault Rifle", "Assault Rifle Mk II", "Carbine Rifle", "Carbine Rifle Mk II", "Advanced Rifle",
  "Special Carbine", "Special Carbine Mk II", "Bullpup Rifle", "Bullpup Rifle Mk II", "Compact Rifle"],
  weapons_name_6: ["MG", "Combat MG", "Combat MG Mk II", "Gusenberg Sweeper"],
  weapons_name_7: ["Sniper Rifle", "Heavy Sniper", "Heavy Sniper Mk II", "Marksman Rifle", "Marksman Rifle Mk II"],
  weapons_name_8: ["RPG", "Grenade Launcher", "Minigun", "Firework Launcher", "Railgun", "Homing Launcher",
  "Compact Grenade"],
  weapons_name_9: ["Осколочная граната", "Газовая граната", "Коктейль молотова", "Дымовая граната", "Сигнальная граната"],
  weapons_name_10: ["Парашют", "Огнетушитель"],
  limit: {
    ammo: 0,
    drugs: 0,
    weapons: 0,
    max: [150, 3000, 3000]
  }
};

let global_return = {
  "gang_storage_1":"gang_storage",
  "gang_storage_2":"gang_storage",
  "gang_storage_5":"gang_storage",
  "gang_storage_8":"gang_storage",
  "gang_storage_10":"gang_storage",
  "gang_storage_3":"gang_storage_2",
  "gang_storage_4":"gang_storage_2",
  "gang_storage_6":"gang_storage_5",
  "gang_storage_7":"gang_storage_5",
  "gang_storage_9":"gang_storage_8",
  "gang_storage_11":"gang_storage_10",
  "gang_storage_12":"gang_storage_10",

  "gang_storage_11_1":"gang_storage_11",
  "gang_storage_11_2":"gang_storage_11",
  "gang_storage_11_3":"gang_storage_11",
  "gang_storage_11_4":"gang_storage_11",
  "gang_storage_11_5":"gang_storage_11",
  "gang_storage_11_6":"gang_storage_11",
  "gang_storage_11_7":"gang_storage_11",
  "gang_storage_11_8":"gang_storage_11",
  "gang_storage_11_9":"gang_storage_11",
  "gang_storage_11_10":"gang_storage_11",

  "gang_storage_12_1":"gang_storage_12",
  "gang_storage_12_2":"gang_storage_12",
  "gang_storage_12_3":"gang_storage_12",
  "gang_storage_12_4":"gang_storage_12",
  "gang_storage_12_5":"gang_storage_12",
  "gang_storage_12_6":"gang_storage_12",
  "gang_storage_12_7":"gang_storage_12",
  "gang_storage_12_8":"gang_storage_12",
  "gang_storage_12_9":"gang_storage_12",
  "gang_storage_12_10":"gang_storage_12",
};

alt.on(`Client::init`, (view) => {
  view.on("selectMenu.backspacePressed", (menuName) => {
    let replace = global_return[menuName];
    if (replace) alt.emit("selectMenu.show", replace);
  });

  alt.onServer('update.gang.storage', (balance, wrank, arank, brank, drank, mrank, drugs, drugs_in, ammo, ammo_in, weapons, weapons_in, max) => {
      GangController.balance = balance;
      GangController.drugs = drugs;
      GangController.drugs_in = drugs_in;
      GangController.ammo = ammo;
      GangController.ammo_in = ammo_in;
      GangController.weapon_rank = wrank;
      GangController.ammo_rank = arank;
      GangController.storage_rank = brank;
      GangController.drugs_rank = drank;
      GangController.money_rank = mrank;
      GangController.weapons = weapons;
      GangController.weapons_in = weapons_in;
      GangController.limit.max = max;
      countLimit();
  });

  function countLimit() {
    let count = [0, 0, 0];
    for (var i = 0; i < GangController.ammo_in.length; i++) count[0] += GangController.ammo_in[i];
    for (var i = 0; i < GangController.drugs_in.length; i++) count[1] += GangController.drugs_in[i];
    for (var i = 0; i < GangController.weapons_in.length; i++) count[2] += GangController.weapons_in[i];
    GangController.limit.ammo = count[0], GangController.limit.drugs = count[1], GangController.limit.weapons = count[2];
  }

  alt.on('choose.gang.safe.menu', () => {
    //if (alt.clientStorage["factionRank"] < (alt.clientStorage["factionLastRank"] + 1)) return alt.emit(`nError`, `Сейф доступен только лидеру!`);
    alt.emit("selectMenu.setHeader", "gang_storage_1", "Сейф | Баланс $" + GangController.balance);
    alt.emit("selectMenu.show", "gang_storage_1");
  });

  alt.on('choose.gang.safe.money', (status) => {
    //if (alt.clientStorage["factionRank"] < (alt.clientStorage["factionLastRank"] + 1)) return alt.emit(`nError`, `Сейф доступен только лидеру!`);
    alt.emit("selectMenu.hide");
    if (status) alt.emit("modal.show", "gang_money_put", { money: GangController.balance });
    else alt.emit("modal.show", "gang_money_take", { money: GangController.balance });
  });

  alt.on('choose.gang.control.menu', () => {
    if (alt.clientStorage["factionRank"] < GangController.storage_rank) return alt.emit(`nError`, `Управление доступно c ${GangController.storage_rank} ранга!`);
    alt.emit("selectMenu.show", "gang_storage_8");
  });

  alt.on('choose.gang.ranks.menu', () => {
      if (alt.clientStorage["factionRank"] < (alt.clientStorage["factionLastRank"] + 1)) return alt.emit(`nError`, `Управление рангами доступно только лидеру!`);
      alt.emit("selectMenu.show", "gang_storage_9");
  });

  alt.on('choose.gang.drugs.menu', () => {
      alt.emit("selectMenu.setHeader", "gang_storage_2", `Вместимость: ${GangController.limit.drugs} из ${GangController.limit.max[1]}`);
      alt.emit("selectMenu.show", "gang_storage_2");
  });

  alt.on('choose.gang.ammo.menu', () => {
      alt.emit("selectMenu.setHeader", "gang_storage_5", `Вместимость: ${GangController.limit.ammo} из ${GangController.limit.max[2]}`);
      alt.emit("selectMenu.show", "gang_storage_5");
  });

  alt.on('choose.gang.weapon.menu', () => {
    alt.emit("selectMenu.setHeader", "gang_storage_10", `Вместимость: ${GangController.limit.weapons} из ${GangController.limit.max[0]}`);
    alt.emit("selectMenu.show", "gang_storage_10");
  });

  alt.on('choose.gang.safe.drugs', (id, type) => {
    if (id < 0 || id > 4) return alt.emit(`nError`, `Неверный формат!`);
    if (type) {
      if (GangController.drugs[id] < 1) return alt.emit(`nError`, `У вас недостаточно наркотиков!`);
      alt.emit("modal.show", "gang_drugs_put", { count: GangController.drugs[id] + "г.", drug_name: GangController.drugs_name[id], type: type, id: id  });
    } else {
      if (alt.clientStorage["factionRank"] < GangController.drugs_rank) return alt.emit(`nError`, `Наркотики доступны с ${GangController.drugs_rank} ранга!`);
      if (GangController.drugs_in[id] < 1) return alt.emit(`nError`, `На складе недостаточно наркотиков!`);
      alt.emit("modal.show", "gang_drugs_take", { count: GangController.drugs_in[id] + "г.", drug_name: GangController.drugs_name[id], type: type, id: id  });
    }
    alt.emit("selectMenu.hide");
  });

  alt.on('choose.gang.safe.ammo', (id, type) => {
    if (id < 0 || id > 4) return alt.emit(`nError`, `Неверный формат!`);
    if (type) {
      if (GangController.ammo[id] < 1) return alt.emit(`nError`, `У вас недостаточно боеприпасов!`);
      alt.emit("modal.show", "gang_ammo_put", { count: GangController.ammo[id] + "пт.", drug_name: GangController.ammo_name[id], type: type, id: id  });
    } else {
      if (alt.clientStorage["factionRank"] < GangController.ammo_rank) return alt.emit(`nError`, `Боеприпасы доступны с ${GangController.ammo_rank} ранга!`);
      if (GangController.ammo_in[id] < 1) return alt.emit(`nError`, `На складе недостаточно боеприпасов!`);
      alt.emit("modal.show", "gang_ammo_take", { count: GangController.ammo_in[id] + "пт.", drug_name: GangController.ammo_name[id], type: type, id: id  });
    }
    alt.emit("selectMenu.hide");
  });

  view.on('gang.control.drugs', (count, id, type) => {
    if (id < 0 || id > 4) return alt.emit(`nError`, `Неверный формат!`);
    let newCount = simpleCheck(count);
    if (newCount !== false) {
      if (type) alt.emitServer("gang.put.drugs", newCount, id);
      else alt.emitServer("gang.take.drugs", newCount, id);
    }
  });

  view.on('gang.control.ammo', (count, id, type) => {
    if (id < 0 || id > 4) return alt.emit(`nError`, `Неверный формат!`);
    let newCount = simpleCheck(count);
    if (newCount !== false) {
      if (type) alt.emitServer("gang.put.ammo", newCount, id);
      else alt.emitServer("gang.take.ammo", newCount, id);
    }
  });

  alt.on('take.gang.weapons.safe', (id, type) => {
    alt.emit("selectMenu.hide");
    if (type) alt.emitServer("gang.take.weapons", id);
    else alt.emitServer("gang.put.weapons", id);
  });

  alt.on('gang.set.lock', () => {
    // if (alt.clientStorage["factionRank"] < (alt.clientStorage["factionLastRank"] + 1)) return alt.emit(`nError`, `Управление доступно только лидеру!`);
    if (alt.clientStorage["factionRank"] < GangController.storage_rank) return alt.emit(`nError`, `Управление доступно c ${GangController.storage_rank} ранга!`);
    alt.emitServer("gang.set.lock");
  });

  view.on('gang.control.allow', (id, count) => {
    if (id < 0 || id > 4) return alt.emit(`nError`, `Неверный формат!`);
    let newCount = simpleCheck(count);
    if (newCount !== false) alt.emitServer("gang.control.allow", id, count);
  });

  alt.on('send.gang.allow.menu', (number) => {
    alt.emit("selectMenu.hide");
    if (alt.clientStorage["factionRank"] < (alt.clientStorage["factionLastRank"] + 1)) return alt.emit(`nError`, `Управление доступно только лидеру!`);
    switch (number) {
      case 0: alt.emit("modal.show", "allow_gang_menu0", { rank: GangController.weapon_rank}); break;
      case 1: alt.emit("modal.show", "allow_gang_menu1", { rank: GangController.drugs_rank}); break;
      case 2: alt.emit("modal.show", "allow_gang_menu2", { rank: GangController.ammo_rank }); break;
      case 3: alt.emit("modal.show", "allow_gang_menu3", { rank: GangController.storage_rank }); break;
      case 4: alt.emit("modal.show", "allow_gang_menu4", { rank: GangController.money_rank }); break;
      default: return alt.emit(`nError`, `Неизвестный формат!`);
    }
  });

  alt.on('put.gang.drugs.menu', () => {
    if (GangController.limit.drugs >= GangController.limit.max[1]) return alt.emit(`nError`, `Склад переполнен!`);
    executeDrugsGangStorage(GangController.drugs, "gang_storage_3");
    alt.emit("selectMenu.show", "gang_storage_3");
  });

  alt.on('put.gang.drugs_in.menu', () => {
    if (alt.clientStorage["factionRank"] < GangController.drugs_rank) return alt.emit(`nError`, `Наркотики доступны с ${GangController.drugs_rank} ранга!`);
    executeDrugsGangStorage(GangController.drugs_in, "gang_storage_4");
    alt.emit("selectMenu.show", "gang_storage_4");
  });

  function executeDrugsGangStorage(args, name) {
    alt.emit(`selectMenu.setItemName`, name, 0, {text: `Марихуана - ${args[0]}г.`});
    alt.emit(`selectMenu.setItemName`, name, 1, {text: `МДМА - ${args[1]}г.`});
    alt.emit(`selectMenu.setItemName`, name, 2, {text: `Кокаин - ${args[2]}г.`});
    alt.emit(`selectMenu.setItemName`, name, 3, {text: `Метамфетамин - ${args[3]}г.`});
  }

  alt.on('put.gang.ammo.menu', () => {
    if (GangController.limit.ammo >= GangController.limit.max[2]) return alt.emit(`nError`, `Склад переполнен!`);
    executeAmmoGangStorage(GangController.ammo, "gang_storage_6");
    alt.emit("selectMenu.show", "gang_storage_6");
  });

  alt.on('put.gang.ammo_in.menu', () => {
    if (alt.clientStorage["factionRank"] < GangController.ammo_rank) return alt.emit(`nError`, `Боеприпасы доступны с ${GangController.ammo_rank} ранга!`);
    executeAmmoGangStorage(GangController.ammo_in, "gang_storage_7");
    alt.emit("selectMenu.show", "gang_storage_7");
  });

  function executeAmmoGangStorage(args, name) {
    alt.emit(`selectMenu.setItemName`, name, 0, {text: `Патроны 9mm - ${args[0]}пт.`});
    alt.emit(`selectMenu.setItemName`, name, 1, {text: `Патроны 12mm - ${args[1]}пт.`});
    alt.emit(`selectMenu.setItemName`, name, 2, {text: `Патроны 7.62mm - ${args[2]}пт.`});
    alt.emit(`selectMenu.setItemName`, name, 3, {text: `Патроны 5.56mm - ${args[3]}пт.`});
  }

  alt.on('put.gang.weapon.menu', () => {
    if (GangController.limit.weapons >= GangController.limit.max[0]) return alt.emit(`nError`, `Склад переполнен!`);
    executeWeaponsGangStorage(GangController.weapons, 11);
    alt.emit("selectMenu.show", "gang_storage_11");
  });

  alt.on('put.gang.weapon_in.menu', () => {
    if (alt.clientStorage["factionRank"] < GangController.weapon_rank) return alt.emit(`nError`, `Оружие доступно с ${GangController.weapon_rank} ранга!`);
    executeWeaponsGangStorage(GangController.weapons_in, 12);
    alt.emit("selectMenu.show", "gang_storage_12");
  });

  function executeWeaponsGangStorage(args, type) {
    for (var i = 0; i < GangController.weapons_name_1.length; i++) alt.emit(`selectMenu.setItemName`, `gang_storage_${type}_1`, i, {text: `${GangController.weapons_name_1[i]} - ${args[i]} шт.`});
    for (var i = 0; i < GangController.weapons_name_2.length; i++) alt.emit(`selectMenu.setItemName`, `gang_storage_${type}_2`, i, {text: `${GangController.weapons_name_2[i]} - ${args[i + 17]} шт.`});
    for (var i = 0; i < GangController.weapons_name_3.length; i++) alt.emit(`selectMenu.setItemName`, `gang_storage_${type}_3`, i, {text: `${GangController.weapons_name_3[i]} - ${args[i + 32]} шт.`});
    for (var i = 0; i < GangController.weapons_name_4.length; i++) alt.emit(`selectMenu.setItemName`, `gang_storage_${type}_4`, i, {text: `${GangController.weapons_name_4[i]} - ${args[i + 39]} шт.`});
    for (var i = 0; i < GangController.weapons_name_5.length; i++) alt.emit(`selectMenu.setItemName`, `gang_storage_${type}_5`, i, {text: `${GangController.weapons_name_5[i]} - ${args[i + 48]} шт.`});
    for (var i = 0; i < GangController.weapons_name_6.length; i++) alt.emit(`selectMenu.setItemName`, `gang_storage_${type}_6`, i, {text: `${GangController.weapons_name_6[i]} - ${args[i + 58]} шт.`});
    for (var i = 0; i < GangController.weapons_name_7.length; i++) alt.emit(`selectMenu.setItemName`, `gang_storage_${type}_7`, i, {text: `${GangController.weapons_name_7[i]} - ${args[i + 62]} шт.`});
    for (var i = 0; i < GangController.weapons_name_8.length; i++) alt.emit(`selectMenu.setItemName`, `gang_storage_${type}_8`, i, {text: `${GangController.weapons_name_8[i]} - ${args[i + 67]}шт.`});
    for (var i = 0; i < GangController.weapons_name_9.length; i++) alt.emit(`selectMenu.setItemName`, `gang_storage_${type}_9`, i, {text: `${GangController.weapons_name_9[i]} - ${args[i + 74]} шт.`});
    for (var i = 0; i < GangController.weapons_name_10.length; i++) alt.emit(`selectMenu.setItemName`, `gang_storage_${type}_10`, i, {text: `${GangController.weapons_name_10[i]} - ${args[i + 79]} шт.`});
  }

  view.on('gang.put.money', (money) => {
    let newMoney = simpleCheck(money);
    if (newMoney !== false) alt.emitServer("gang.put.money", newMoney);
  });

  view.on('gang.take.money', (money) => {
    if (alt.clientStorage["factionRank"] < GangController.money_rank) return alt.emit(`nError`, `Деньги доступны с ${GangController.money_rank} ранга!`);
    let newMoney = simpleCheck(money);
    if (newMoney !== false) alt.emitServer("gang.take.money", newMoney);
  });

  function simpleCheck(value) {
    let num = parseInt(value, 10);
    if (isNaN(num)) {
      alt.emit("nWarning", "Заполните поле корректно!");
      return false;
    }
    return num;
  }
});
