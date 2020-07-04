// ограничения в TODO
const PhoneControl = {
  free_numbers: [],
  max_numbers: 10000,
  special_numbers: []
};

module.exports = {
    Init: () => {
      DB.Query("SELECT * FROM phone_special", (e, result) => {
        for (let i = 0; i < result.length; i++) PhoneControl.special_numbers.push(result[i].number);
        alt.log(`[Номера] Загружено ${result.length} специальных номеров`);
      });
      DB.Query("SELECT * FROM phone_taken", (e, result) => {
        let max = PhoneControl.max_numbers, array = [];
        for (let i = 0; i < result.length; i++) array.push(result[i].num);
        for (let i = 0; i < max; i++) {
          let num = getRandomNumber(100000, 999999);
          if (!array.includes(num)) PhoneControl.free_numbers.push(num); // alt.log(`[${i}] ТЕЛЕФОН - ${num} | ${result.num}`);
          else max++;
        }
        alt.log(`[Номера] Загружено ${PhoneControl.free_numbers.length} свободных номеров`);
      });
    }
}

global.initPlayerTelephone = function(player) {
  player.phone.createContact = (name, num) => {
    let array = player.phone.contacts;
    if (!array) return;
    if (num == player.phone.number) return player.utils.error("Вы не можете внести свой номер!");
    for (let i = 0; i < array.length; i++) if (array[i].num === num) return player.utils.error("У вас уже есть контакт с таким номером!");
    DB.Query("SELECT * FROM characters WHERE phone=?", [num], (e, sresult) => {
         let sendid = -1;
         if (sresult.length < 1 && !PhoneControl.special_numbers.includes(parseInt(num, 10))) return player.utils.error("Номер не существует!");
         if (PhoneControl.special_numbers.includes(parseInt(num, 10))) sendid = -10;
         else sendid = sresult[0].id;
         DB.Query("INSERT INTO phone_contacts (creator, name, num, sender) VALUES (?,?,?,?)",
         [player.sqlId, name, num, sendid], (e, result) => {
            player.phone.contacts.push({ id: result.insertId, creator: player.sqlId, name: name, num: num, sender: sendid });
            alt.emitClient(player, "create.telephone.contact", result.insertId, name, num);
            player.utils.success("Вы создали новый контакт!");
         });
    });
  };
  player.phone.call = (num) => {
    if (num == player.phone.number) return player.utils.error("Вы не можете позвонить на свой номер!");
    let id = PhoneControl.special_numbers.indexOf(parseInt(num, 10));
    if (id != -1) {
      switch (++id) {
        case 13:
            let taxiOpen = require("./jobs/taxi/taxi.js");
            taxiOpen.recallTaxi(player);
            break;
        case 3:
          alt.emit(`police.addCall`, player, "Нуждаюсь в помощи");
        case 5:
          alt.emit(`hospital.addCall`, player, "Нуждаюсь в помощи");
      }
    } else {
      // Звонки игроков
      DB.Query("SELECT * FROM characters WHERE phone=?", [num], (e, result) => {
        let result_st = result.length < 1 ? false : true;
        let special_st = !PhoneControl.special_numbers.includes(parseInt(num, 10)) ? false : true;
        if (!result_st && !special_st) return player.utils.error("Номер не существует!");
        let target = alt.Player.getBySqlId(result[0].id);
        if (target) {
          if (target.voiceChannel !== undefined) return player.utils.error("Абонент временно недоступен!");
          if (target.phoneCall) return player.utils.error("Абонент временно недоступен!");
          player.phoneCall = true;
          target.phoneCall = true;
          player.callId = num;
          target.callId = player.phone.number;
          alt.emitClient(player, "start.telephone.call", num);
          alt.emitClient(target, "create.telephone.call", player.phone.number);
        } else {
          player.utils.error("Абонент временно недоступен!");
          return;
        }
      });
    }
  };
  player.phone.acceptCall = (num) => {
    if (num == player.phone.number) return player.utils.error("Вы не можете взять трубку на свой номер!");
    DB.Query("SELECT * FROM characters WHERE phone=?", [num], (e, result) => {
      let result_st = result.length < 1 ? false : true;
      let special_st = !PhoneControl.special_numbers.includes(parseInt(num, 10)) ? false : true;
      if (!result_st && !special_st) return player.utils.error("Номер не существует!");
      let target = alt.Player.getBySqlId(result[0].id);
      if (target) {
        const voice = new alt.VoiceChannel(false, 1);
        player.voiceChannel = voice;
        target.voiceChannel = voice;
        voice.addPlayer(player);
        voice.addPlayer(target);
        alt.emitClient(target, "player.telephone.accept");
        alt.emitClient(player, "target.telephone.accept");
      } else {
        player.utils.error("Абонент временно недоступен!");
        return;
      }
    });
  };
  player.phone.decline = (num) => {
    DB.Query("SELECT * FROM characters WHERE phone=?", [num], (e, result) => {
      let result_st = result.length < 1 ? false : true;
      let special_st = !PhoneControl.special_numbers.includes(parseInt(num, 10)) ? false : true;
      if (!result_st && !special_st) return player.utils.error("Номер не существует!");
      let target = alt.Player.getBySqlId(result[0].id);
      if (player.voiceChannel) player.voiceChannel.destroy();
      player.phoneCall = false;
      player.callId = undefined;
      if (target) {
        target.phoneCall = false;
        target.callId = undefined;
        if (target.voiceChannel) delete target.voiceChannel;
        alt.emitClient(target, "call.decline");
        alt.emitClient(player, "call.decline");
      } else {
        player.utils.error("Абонент временно недоступен!");
        return;
      }
    });
  };
  player.phone.changeContact = (id, name, num) => {
    let array = player.phone.contacts;
    if (num == player.phone.number) return player.utils.error("Вы не можете внести свой номер!");
    if (!array) return;
    for (let i = 0; i < array.length; i++) {
      if (array[i].num == num && array[i].id != id) player.utils.error("У вас уже есть контакт с таким номером!");
      else if (array[i].id == id) {
        DB.Query("SELECT * FROM characters WHERE phone=?", [num], (e, result) => {
             let result_st = result.length < 1 ? false : true;
             let special_st = !PhoneControl.special_numbers.includes(parseInt(num, 10)) ? false : true;
             if (!result_st && !special_st) return player.utils.error("Номер не существует!");
             else if (special_st) var status = -10;
             else var status = result[0].id;
             DB.Query("UPDATE phone_contacts SET name=?,num=?,sender=? WHERE id=?", [name, num, status, id]);
             player.phone.contacts[i].name = name, player.phone.contacts[i].num = num, player.phone.contacts[i].sender = status;
             alt.emitClient(player, "change.telephone.contact", id, name, num);
             player.utils.success("Вы отредактировали контакт!");
             return;
        });
      }
    }
  };
  player.phone.deleteContact = (id) =>  {
    let array = player.phone.contacts;
    if (!array) return;
    for (let i = 0; i < array.length; i++) {
      if (array[i].id == id) {
          DB.Query("DELETE FROM phone_contacts WHERE id=?", [id]);
          player.phone.contacts.splice(player.phone.contacts.indexOf(array[i]), 1);
          alt.emitClient(player, "delete.telephone.contact", id);
          player.utils.error("Вы удалили контакт!");
      }
    }
  };
  player.phone.sendMessage = (num, text) => {
    let array = player.phone.contacts;
    if (!array) return;
    for (let i = 0; i < array.length; i++) {
      if (array[i].num == num) {
        if (array[i].num == player.phone.number) return player.utils.error("Вы не можете написать сообщение на свой номер!");
        if (PhoneControl.special_numbers.includes(parseInt(array[i].num, 10))) return player.utils.error("Вы не можете отправить сообщение на данный номер!");
        DB.Handle.query("INSERT INTO phone_messages (text, sender_num, creator_num) VALUES (?,?,?)",
        [text, player.phone.number, array[i].num], (e, result) => {
           // ОГРАНИЧЕНИЕ: player.phone.messages.push({ id: result.insertId, text: text, sender_num: player.phone.number, creator_num: array[i].num });
           alt.emitClient(player, "create.telephone.message", result.insertId, text, player.phone.number, array[i].num);
           player.utils.success("Вы отправили сообщение!");
           let target = alt.Player.getBySqlId(array[i].sender);
           if (target) {
             alt.emitClient(target, "create.telephone.message", result.insertId, text, array[i].num, player.phone.number);
             target.utils.success("Вам пришло сообщение на телефон!");
           }
        });
      }
    }
  };
  alt.emitClient(player, "update.player.telephone", player.phone.number);
  DB.Query(`SELECT * FROM phone_contacts WHERE creator=?`, [player.sqlId], (e, result) => {
		if (e) {
			alt.log(`Контакты телефона не загружены для персонажа '${player.sqlId}'. ${e}`);
			return;
		}

		player.phone.contacts = result;
		alt.emitClient(player, "update.telephone.contacts", JSON.stringify(result));
  });
  DB.Query(`SELECT * FROM phone_messages WHERE sender_num=? OR creator_num=?`, [player.phone.number, player.phone.number], (e, result) => {
      // ОГРАНИЧЕНИЕ: player.phone.messages = result;
      alt.emitClient(player, "update.telephone.messages", JSON.stringify(result));
  });
};

function getPhoneNumber() {
  // if (PhoneControl.free_numbers.length < 1) return getRandomNumber(100000, 999999);
  if (PhoneControl.free_numbers.length < 1) return undefined;
  let num = getRandomNumber(0, PhoneControl.free_numbers.length);
  var number = PhoneControl.free_numbers[num];
  PhoneControl.free_numbers.splice(num, 1);
  return number;
}
module.exports.getPhoneNumber = getPhoneNumber;

// ВРЕМЕННО ДЛЯ ТЕСТОВ!!!
function getPhoneNumbers(player) {
   if (player.phone.number == -1) {
     let num = getRandomNumber(0, PhoneControl.free_numbers.length);
     player.phone.number = PhoneControl.free_numbers[num];
     DB.Query("UPDATE characters SET phone=? WHERE id=?", [player.phone.number, player.sqlId]);
   }
}
module.exports.getPhoneNumbers = getPhoneNumbers;

alt.onClient('create.player.contact', (player, name, num) => {
    player.phone.createContact(name, num);
});
alt.onClient('change.player.contact', (player, id, name, num) => {
    player.phone.changeContact(id, name, num);
});
alt.onClient('call.player.contact', (player, num) => {
    player.phone.call(num);
});
alt.onClient('send.player.phonemessage', (player, num, text) => {
    player.phone.sendMessage(num, text);
});
alt.onClient('delete.player.contact', (player, id) => {
    player.phone.deleteContact(id);
});
alt.onClient(`accept.telephone.call`, (player, num) => {
    player.phone.acceptCall(num);
});
alt.onClient(`call.decline`, (player, num) => {
    player.phone.decline(num);
});
function getRandomNumber(min, max) { return Math.floor(Math.random() * (max - min)) + min; }