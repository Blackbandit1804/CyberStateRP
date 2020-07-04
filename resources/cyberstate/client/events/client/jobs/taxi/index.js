alt.on(`Client::init`, (view) => {
  let keyDownE;
  const JobTaxi = {
    type: true,
    colshape: undefined,
    colshape_go: undefined,
    marker: undefined,
    blip: undefined,
    blacklist: [],
    orders_today: 0,
    earnmoney_today: 0,
    stats_today: 0,
    interval: undefined,
    time: -1
  };

  alt.onServer('setTaxiJobStatus', (status) => { keyDownE = status; });
  alt.onServer('getTaxiJobStatus', (status) => {
      if (status !== "cancel") {
        alt.emit("prompt.show", `Нажмите <span class=\"hint-main__info-button\">Е</span> для взаимодействия`);
        keyDownE = status;
      } else {
        keyDownE = null;
      }
  });

  alt.onServer('update.taxi.stats', (money) => {
    JobTaxi.orders_today++;
    JobTaxi.earnmoney_today += money;
    view.emit(`app.updateTaxiStats`, JobTaxi.orders_today, JobTaxi.earnmoney_today);
  });

  view.on('clear.taxi.filtration', (type) => {
    JobTaxi.blacklist = [];
    alt.emit(`BN_ShowWithPicture`, 'Информация', 'Downtown Cab Co.', 'Вы ~y~сбросили ~w~фильтрацию заказов.', 'CHAR_TAXI');
  });

  view.on('add.taxi.filtration', (name) => {
    if (!JobTaxi.blacklist.includes(name)) {
      JobTaxi.blacklist.push(name);
      alt.emit(`BN_ShowWithPicture`, 'Информация', 'Downtown Cab Co.',  '~y~' + name + ' ~w~добавлен в фильтрацию и не будет отображаться.', 'CHAR_TAXI');
    }
  });

  alt.onServer('show.taxi.menu', (name) => {
    view.emit(`app.setNameForPassword`, name);
  });

  alt.onServer('control.taxi.menu', (type, del) => {
    if (type === true) {
      view.emit(`appStyleDisplayBlock`);
      //if (CEF) CEF.execute("document.getElementById('app').style.display = 'block';");
      if (del === true) JobTaxi.time = -1;
    } else {
      view.emit(`appStyleDisplayNone`);
      //if (CEF) CEF.execute("document.getElementById('app').style.display = 'none';");
      if (del === false) JobTaxi.time = 10; // 10 * 6 = 60 секунд
    }
  });

  view.on('cant.finish.taxi.job', () => {
    alt.emit(`BN_ShowWithPicture`, 'Информация', 'Downtown Cab Co.', 'Вы ~y~не завершили ~w~вызов.', 'CHAR_TAXI');
  });

  alt.onServer('remove.taxi.order', (name) => {
    view.emit(`app.removeFromTaxi`, name);
  });

  alt.onServer('take.taxi.order', (name) => {
    alt.emitServer('take.taxi.order', name);
  });

  view.on('take.taxi.order', (name) => {
    alt.emitServer('take.taxi.order', name);
  });

  alt.onServer('accept.taxi.order', (pos) => {
      JobTaxi.blip = alt.helpers.blip.new(280, pos, { alpha: 255, color: 5, scale: 0.9, name: "Клиент" });
      JobTaxi.blip.route = true;
      JobTaxi.blip.routeColor = 5;
      JobTaxi.colshape = new alt.ColshapeSphere(pos.x, pos.y, pos.z, 6);
      JobTaxi.marker = alt.helpers.marker.new(1, new alt.Vector3(pos.x, pos.y, pos.z - 1.5), 12, { visible: true, dimension: 0, color: [255, 0, 0, 40] });
      view.emit(`app.setselect`);
      view.emit(`app.startTime`, 0, getZoneName(pos));
  });

  alt.onServer('destroy.taxi.colshape', () => {
    if (JobTaxi.blip !== undefined) {
      JobTaxi.blip.route = false;
      JobTaxi.blip.destroy();
    }
    if (JobTaxi.colshape_go !== undefined) JobTaxi.colshape_go.destroy();
    if (JobTaxi.marker !== undefined) JobTaxi.marker.destroy();
    if (JobTaxi.colshape !== undefined) JobTaxi.colshape.destroy();
    delete JobTaxi.blip, delete JobTaxi.colshape, delete JobTaxi.colshape_go, delete JobTaxi.marker;
  });
  
  alt.on(`keydown`, (key) => {
    if (key === 0x60) {
      if (player.vehicle && JobTaxi.interval !== undefined) alt.emitServer("key.taxi.down.numpad_zero");
    }
  });

  alt.on('entityEnterColshape', (shape) => {
      if (shape === JobTaxi.colshape && player.vehicle) alt.emitServer("enter.taxi.colshape");
  });

  alt.on('entityLeaveColshape', (shape) => {
      if (shape === JobTaxi.colshape_go) alt.emitServer("cancel.taxi.player");
  });

  alt.onServer('displace.taxi.menu', () => {
    if (JobTaxi.type === true) {
      view.emit(`app.taxiPage`, false);
      JobTaxi.type = false;
    } else {
      view.emit(`app.taxiPage`, true);
      JobTaxi.type = true;
    }
  });

  alt.onServer('delete.taxi.player.colshape', () => {
    if (JobTaxi.colshape_go !== undefined) JobTaxi.colshape_go.destroy();
    if (JobTaxi.marker !== undefined) JobTaxi.marker.destroy();
    delete JobTaxi.colshape_go, delete JobTaxi.marker;
  });

  alt.onServer('create.taxi.player.colshape', () => {
    JobTaxi.marker = alt.helpers.marker.new(1, new alt.Vector3(player.pos.x, player.pos.y, player.pos.z - 1.5), 12, { visible: true, dimension: 0, color: [255, 0, 0, 40] });
    JobTaxi.colshape_go = new alt.ColshapeSphere(player.pos.x, player.pos.y, player.pos.z, 6);
  });

  alt.onServer('update.taxi.interval', (type) => {
    if (type) {
      JobTaxi.interval = alt.setInterval(() => {
        alt.emitServer("update.taxi.orders");
        if (JobTaxi.time > -1) JobTaxi.time--;
        if (JobTaxi.time === 0) {
          alt.emitServer("end.taxi.day");
          return;
        }
      }, 6000);
    } else {
      alt.clearInterval(JobTaxi.interval);
      delete JobTaxi.interval;
    }
  });

  alt.onServer('update.taxi.orders', (arr) => {
    let orders = JSON.parse(arr);
    orders.forEach(function(order) {
      if (!JobTaxi.blacklist.includes(order.client_name) && order.taxist_name === undefined) {
        view.emit(`app.addToTaxi`, order.client_name, Math.trunc(game.getDistanceBetweenCoords(player.pos.x, player.pos.y, player.pos.z, order.start_position.x, order.start_position.y, order.start_position.z, true)));      
      }
    });
  });

  alt.onServer('get.taxi.waypoint.driver', (name, money, pos) => {
      if (JobTaxi.blip !== undefined) {
        JobTaxi.blip.route = false;
        JobTaxi.blip.destroy();
      }
      if (JobTaxi.colshape !== undefined) JobTaxi.colshape.destroy();
      if (JobTaxi.marker !== undefined) JobTaxi.marker.destroy();
      delete JobTaxi.blip, delete JobTaxi.colshape, delete JobTaxi.marker;

      JobTaxi.blip = alt.helpers.blip.new(1, pos, { alpha: 255, color: 5, scale: 0.9, name: "Пункт назначения" });
      JobTaxi.blip.route = true;
      JobTaxi.blip.routeColor = 5;

      view.emit(`app.setInfo`, name, money, getZoneName(pos));
  });

  alt.onServer('get.taxi.waypoint', (target) => {
    let pos = getWaypointPosition();
    if (pos === undefined) {
      alt.emit(`BN_ShowWithPicture`, 'Информация', 'Downtown Cab Co.', 'Вы ~y~не установили ~w~метку на карте.', 'CHAR_TAXI');
      return;
    }

    let dist = game.getDistanceBetweenCoords(player.pos.x, player.pos.y, player.pos.z, pos.x, pos.y, 0, false);
    alt.emitServer("set.taxi.waypoint", target, dist, pos.x, pos.y, player.pos.z);
  });

  alt.onServer('cancel.taxi.order', (type) => {
    if (JobTaxi.blip !== undefined) {
      JobTaxi.blip.route = false;
      JobTaxi.blip.destroy();
    }
    if (JobTaxi.colshape !== undefined) JobTaxi.colshape.destroy();
    if (JobTaxi.marker !== undefined) JobTaxi.marker.destroy();
    if (JobTaxi.interval !== undefined && type === true) alt.clearInterval(JobTaxi.interval);
    JobTaxi.type = true;
    if (type === true) {
      JobTaxi.blacklist = [];
      JobTaxi.time = -1;
    }
    delete JobTaxi.blip, delete JobTaxi.colshape, delete JobTaxi.marker, delete JobTaxi.interval;
  });

  alt.onServer('close.taxi.control', () => {
    view.emit(`app.deleteselect`);
  });

  alt.on('close.taxi.menu', () => {
    if (CEF) {
      CEF.destroy();
      CEF = null;
      // При подключение в браузер удалять все бесполезное с меню.
    }
  });

  alt.on(`keydown`, (key) => {
    if (key === 0x45) {
      if (keyDownE !== undefined) {
        if (game.getDistanceBetweenCoords(player.pos.x, player.pos.y, player.pos.z, 894.892, -179.171, 74.700, true) < 4){
          alt.emit(`Cursor::show`, true);
          if (keyDownE === true) {
              alt.emit("choiceMenu.show", "accept_job_taxi", {name: "уволиться из Таксопарка?"});
          } else {
              alt.emit("choiceMenu.show", "accept_job_taxi", {name: "устроиться в Таксопарк?"});
          }
        }
      }
      if (player.vehicle) alt.emitServer("key.taxi.down.e");
    }
  });

  // Functions
  function getZoneName(vector) {
      const getStreet = game.getStreetNameAtCoord(vector.x, vector.y, vector.z, 0, 0);
      zoneName = game.getLabelText(game.getNameOfZone(vector.x, vector.y, vector.z));
      streetName = game.getStreetNameFromHashKey(getStreet.streetName);
      if (getStreet.crossingRoad && getStreet.crossingRoad !== getStreet.streetName) streetName += ` / ${game.getStreetNameFromHashKey(getStreet.crossingRoad)}`;
      return zoneName;
  }
  function getWaypointPosition() {
      const interator = game.getBlipInfoIdIterator();
      let blipHandle = game.getFirstBlipInfoId(interator);
      do {
          if (game.getBlipInfoIdType(blipHandle)) {
              return game.getBlipInfoIdCoord(blipHandle);
          }
          blipHandle = game.getNextBlipInfoId(interator);
      } while (game.doesBlipExist(blipHandle));
      return undefined;
  }
});