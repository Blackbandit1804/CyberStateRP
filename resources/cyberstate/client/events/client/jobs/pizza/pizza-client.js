import alt from 'alt';
import game from 'natives';

const player = alt.Player.local
const PizzaJob = {
  keyDownE: undefined,
	storage_blip: undefined,
  storage_marker: undefined,
  active: false,
	blips: [],
	colshapes: [],
	markers: []
};

alt.onServer('create.pizza.storagemarker', (type) => {
		if (type === false) {
      delete PizzaJob.storage_marker;
			if (PizzaJob.storage_blip !== undefined) {
        PizzaJob.storage_blip.route = false;
				PizzaJob.storage_blip.destroy();
			  delete PizzaJob.storage_blip;
			}
      for (let i = 0; i < PizzaJob.blips.length; i++) if (PizzaJob.blips[i] !== undefined) {
        if (PizzaJob.blips[i].valid) PizzaJob.blips[i].destroy(), delete PizzaJob.colshapes[i], delete PizzaJob.markers[i];
      }
      PizzaJob.blips = [], PizzaJob.colshapes = [], PizzaJob.markers = [];
		} else {
      PizzaJob.storage_marker = alt.helpers.marker.new(20, new alt.Vector3(573.03, 128.86, 99.47 - 0.5), undefined, 180, 1, {r: 255, g: 0, b: 0, alpha: 180}, undefined, true, 2);
      PizzaJob.storage_blip = alt.helpers.blip.new(473, 573.03, 128.86, 0, { alpha: 255, name: "Склад Пиццерии", scale: 0.8, color: 1 });
			PizzaJob.storage_blip.route = true;
			PizzaJob.storage_blip.routeColor = 1;
		}
});

alt.onServer('create.pizza.places', (arg, arg1, arg2) => {
  if (PizzaJob.storage_blip !== undefined) {
    PizzaJob.storage_blip.route = false;
    PizzaJob.storage_blip.destroy();
    delete PizzaJob.storage_blip;
  }

  let arr = [arg, arg1, arg2];
  for (let i = 0; i < arr.length; i++) {
      PizzaJob.blips[i] = alt.helpers.blip.new(1, arr[i].x, arr[i].y, 0, { alpha: 255, scale: 1.1, name: "Точка сдачи пиццы", color: 1, shortRange: false });
      PizzaJob.colshapes[i] = new alt.Vector3(arr[i].x, arr[i].y, arr[i].z + 1.0);
      PizzaJob.markers[i] = {type: 20, pos: new alt.Vector3(arr[i].x, arr[i].y, arr[i].z + 1.0), dir: undefined, rot: 180, scale: 1, color: {r: 255, g: 0, b: 0, alpha: 180}, range: 2};
  }
});

alt.onServer('setPizzaJobStatus', (status) => { PizzaJob.keyDownE = status; });
alt.onServer('getPizzaJobStatus', (status) => {
  if (status !== "cancel") {
    alt.emit("prompt.show", `Нажмите <span class=\"hint-main__info-button\">Е</span> для взаимодействия`);
    PizzaJob.keyDownE = status;
  } else {
    PizzaJob.keyDownE = null;
  }
});

alt.onServer('delete.pizza.colshape', (i, pizza) => {
  PizzaJob.active = true;
  delete PizzaJob.colshapes[i], delete PizzaJob.markers[i];
  PizzaJob.blips[i].destroy();
  PizzaJob.active = false;
  if (pizza < 1) {
    PizzaJob.blips = [], PizzaJob.colshapes = [], PizzaJob.markers = [];
    PizzaJob.storage_blip = alt.helpers.blip.new(473, 573.03, 128.86, 0, { alpha: 255, name: "Склад Пиццерии", scale: 0.8, color: 1 });
    PizzaJob.storage_blip.route = true;
    PizzaJob.storage_blip.routeColor = 1;
  }
});

alt.setInterval(() => {
  const pPos = player.pos;

  if (PizzaJob.markers.length >= 1) {
    PizzaJob.markers.forEach((marker) => {
      if (alt.vdist(pPos, marker.pos)) game.drawMarker(marker.type, marker.pos.x, marker.pos.y, marker.pos.z, 0.0, 0.0, 0.0, 0.0, marker.rot, 0.0, marker.scale, marker.scale, marker.scale, marker.color.r, marker.color.g, marker.color.b, marker.color.alpha, false, true, marker.range, null, null, true);
    });
  }
}, 0);

alt.on(`keyup`, (key) => { // E key
  if (key === 0x45) {
    if (PizzaJob.keyDownE !== undefined) {
      if (game.getDistanceBetweenCoords(player.pos.x, player.pos.y, player.pos.z, 538.54, 101.79, 96.54, true) < 1.75) {
        alt.emit(`Cursor::show`, true)
        if (PizzaJob.keyDownE === true) {
            alt.emit("choiceMenu.show", "accept_job_pizza", { name: "уволиться из Пиццерии?" });
        } else {
            alt.emit("choiceMenu.show", "accept_job_pizza", { name: "устроиться в Пиццерию?" });
        }
      }
    }
  }
});

alt.setInterval(() => {
  const pPos = player.pos;
  if (PizzaJob.colshapes.length >= 1) {
    if (player.inColshape) return;
      for (let i = 0; i < PizzaJob.colshapes.length; i++) {
        if (alt.vdist(pPos, PizzaJob.colshapes[i]) <= 1.0) {
          if (player.vehicle) return;
          //alt.takeObject(player, "prop_pizza_box_02");
          game.freezeEntityPosition(player.scriptID, true);
          alt.emitServer("give.pizza.item", i);
          //alt.putObject(player, "prop_pizza_box_02");
          game.freezeEntityPosition(player.scriptID, false);
          return;
        }
      }
  } else {
    if (player.inColshape) {
      player.inColshape = false;
    }
  }
}, 200);
