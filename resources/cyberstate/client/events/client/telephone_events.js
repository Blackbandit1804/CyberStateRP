import alt from 'alt';
import game from 'natives';


alt.on(`Client::init`, (view) => {
    const player = alt.Player.local;
    let our_number;

    alt.onServer('update.player.telephone', (num) => {
      if (!num) return;
      our_number = num;
      view.emit(`telePhone.setnum`, our_number);
    })

    alt.onServer('update.telephone.messages', (_result) => {
      const result = JSON.parse(_result);

      for (let i = 0; i < result.length; i++) {
        view.emit(`telePhone.sendMessage`, { id: result[i].id, text: result[i].text, sender_num: result[i].sender_num, creator_num: result[i].creator_num });
      }
    })

    alt.onServer('start.telephone.call', (num) => {
      view.emit(`start.telephone.call`, num);
    });

    alt.onServer('create.telephone.call', (num) => {
      view.emit(`create.telephone.call`, num);
    });

    view.on(`phone.callId`, (num) => {
      if (!num) return alt.emit("nWarning", "Номер не найден!");
      if (num.length < 3) return alt.emit("nWarning", "Номер не действителен!");
      if (num.length > 8) return alt.emit("nWarning", "Номер не действителен!");
      alt.emitServer('call.player.contact', num)
    });

    alt.onServer('create.telephone.message', (id, text, sender_num, creator_num) => {
      view.emit(`telePhone.sendMessage`, { id, text, sender_num, creator_num });
    })

    alt.on("telephone.enable", (enable) => {
        view.emit(`telePhone`, `enable`, enable);
    });

    view.on("telephone.active", (enable) => {
      if (!our_number) return alt.emit(`nError`, `Номер телефона не загружен!`);
      if (enable) {
        alt.emit(`Cursor::show`, enable);
        alt.enableTelephone = enable;
      } else {
        alt.enableTelephone = enable;
        alt.emit(`Cursor::show`, enable);
      }
      if (enable) {
        game.taskUseMobilePhone(player.scriptID, true);
      } else game.taskUseMobilePhone(player.scriptID, false);
    });

    alt.onServer('update.telephone.contacts', (_result) => {
        const result = JSON.parse(_result);

        for (let i = 0; i < result.length; i++) {
            view.emit(`telePhone::new::contact`, { id: result[i].id, name: result[i].name, num: result[i].num });
        }
    })

    view.on(`accept.telephone.call`, (num) => {
        alt.emitServer(`accept.telephone.call`, num);
    });

    alt.onServer(`player.telephone.accept`, () => {
      player.callIsActive = true;
      view.emit(`player.telephone.accept`);
    });

    alt.onServer(`target.telephone.accept`, () => {
      player.callIsActive = true;
      view.emit(`target.telephone.accept`);
    });

    alt.on(`update`, () => {
      if (player.callIsActive) alt.enableVoiceInput();
    });

    view.on(`call.decline`, (num) => {
      player.callIsActive = false;
      alt.disableVoiceInput();
      alt.emitServer(`call.decline`, num);
    });

    alt.onServer(`call.decline`, () => {
      player.callIsActive = false;
      alt.disableVoiceInput();
      view.emit(`call.decline`);
    });

    alt.onServer('change.telephone.contact', (id, name, num) => {
        view.emit(`telePhone::change::contact`, { id: id, name: name, num: num });
    });

    alt.onServer('delete.telephone.contact', (id) => {
      view.emit(`telePhone::delete::contact`, id);
    });

    alt.onServer('create.telephone.contact', (id, name, num) => {
        view.emit(`telePhone::new::contact`, { id: id, name: name, num: num });
    })

    view.on('selectChangeContact', (id, contactName, contactNumber) => {
      if (!contactName || !contactNumber) return alt.emit("nWarning", "Заполните поле корректно!");
      if (!contactNumber.match(/[0-9]/g)) return alt.emit("nWarning", "Заполните поле корректно!");
      if (contactName.length > 25) return alt.emit("nWarning", "Слишком длинный текст!");
      if (contactNumber.length < 3) return alt.emit("nWarning", "Слишком короткий номер!");
      if (contactNumber.length > 8) return alt.emit("nWarning", "Слишком длинный номер!");
      alt.emitServer('change.player.contact', id, contactName, contactNumber)
    })

    view.on('deleteContact', (id) => {
        alt.emitServer('delete.player.contact', id)
    })

    view.on('sendMessage', (num, textMessage) => {
        if (!textMessage) return alt.emit("nWarning", "Заполните поле корректно!");
        if (textMessage.length < 1) return alt.emit("nWarning", "Слишком короткий текст!");
        if (textMessage.length > 250) return alt.emit("nWarning", "Слишком длинный текст!");
        alt.emitServer('send.player.phonemessage', num, textMessage)
    })

    view.on('select.add.contact', (contactName, contactNumber) => {
      if (!contactName || !contactNumber) return alt.emit("nWarning", "Заполните поле корректно!");
      if (!contactNumber.match(/[0-9]/g)) return alt.emit("nWarning", "Заполните поле корректно!");
      if (contactName.length > 25) return alt.emit("nWarning", "Слишком длинный текст!");
      if (contactNumber.length < 3) return alt.emit("nWarning", "Слишком короткий номер!");
      if (contactNumber.length > 8) return alt.emit("nWarning", "Слишком длинный номер!");
      alt.emitServer('create.player.contact', contactName, contactNumber)
    })
});
