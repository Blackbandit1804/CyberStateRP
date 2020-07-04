import alt from 'alt';
import game from 'natives';

const RentInfo = {
   timer: undefined
}

const localPlayer = alt.Player.local

alt.on(`Client::init`, (view) => {
  alt.onServer('start.rent.vehicle', (price) => {
    let vehicle = localPlayer.vehicle;
    if (vehicle) {
      game.freezeEntityPosition(vehicle.scriptID, true);
      let items = [{ text: "Арендовать транспорт - $" + price }, { text: "Закрыть" } ];
      alt.emit("selectMenu.setSpecialItems", "rent_faggio", items);
      alt.emit("selectMenu.show", "rent_faggio");
    }
  });

  alt.onServer('stop.rent.vehicle', (type) => { stopRent(type); });

  function stopRent(status) {
    let vehicle = localPlayer.vehicle;
    alt.emit("selectMenu.hide", "rent_faggio");
    if (vehicle) {
      game.freezeEntityPosition(vehicle.scriptID, false);
      if (status) game.taskLeaveVehicle(localPlayer.scriptID, vehicle.scriptID, 16);
    }
  }

  view.on("selectMenu.itemSelected", (menuName, itemName, itemValue, itemIndex) => {
    if (menuName === "rent_faggio") {
      if (itemName === "Закрыть") {
        stopRent(true);
        alt.emit("selectMenu.hide", "rent_faggio");
      } else {
        alt.emit("selectMenu.hide", "rent_faggio");
        alt.emitServer("rent.vehicle.faggio");
      }
    }
  });

  alt.onServer('control.rent.vehicle.time', (time) => {
    if (time === 0) {
      if (RentInfo.timer !== undefined) {
        alt.clearTimeout(RentInfo.timer);
        delete RentInfo.timer;
      }
      return;
    }

    if (RentInfo.timer === undefined) {
      RentInfo.timer = alt.setTimeout(() => {
        alt.emitServer("delete.vehicle.faggio.rent");
      }, time);
    }
  });
});
