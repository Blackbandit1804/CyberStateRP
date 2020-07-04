import alt from 'alt';
import game from 'natives';

const player = alt.Player.local
const PostalJob = {
  colshape: new alt.Vector3(78.92, 112.55, 81.17),
  keyDownE: undefined,
  blip: undefined,
  timeout: undefined,
  vehicle: undefined,
  arr: undefined,
  hasbox: false,
  active: false,
  storage: {
    marker: undefined,
    omarker: undefined,
    shape: undefined,
    oshape: undefined
  },
  blips: [],
  markers: [],
  colshapes: [],
}

alt.onServer('delete.gopostal.colshape', (i, type) => {
  PostalJob.active = true;
  delete PostalJob.colshapes[i], delete PostalJob.markers[i];
  if (PostalJob.blips[i].valid) PostalJob.blips[i].destroy();
  delete PostalJob.blips[i];
  PostalJob.active = false;
  if (type === 0) {
    PostalJob.blips = [], PostalJob.colshapes = [], PostalJob.markers = [];
    PostalJob.blip = alt.helpers.blip.new(615, 78.92, 112.55, 81.17, { alpha: 255, scale: 1.0, color: 2, name: "Склад Go Postal", shortRange: false });
    PostalJob.blip.route = true;
    PostalJob.blip.routeColor = 2;
    alt.emit("prompt.show", `Направляйтесь на склад и возьмите заказ, после чего загрузите фургон.`);
  }
});

alt.setInterval(() => {
  const pPos = player.pos;

  if (alt.vdist(pPos, PostalJob.colshape) <= 1.60) {
    if (player.inColshape) return;
    player.inColshape = true;
    if (player.vehicle) return;
    alt.emit("prompt.show", `Нажмите <span class=\"hint-main__info-button\">Е</span> для того, чтобы взять заказ!`);
    PostalJob.keyDownE = true;
  } else if (alt.vdist(pPos, PostalJob.storage.shape) <= 2.5 || alt.vdist(pPos, PostalJob.storage.oshape) <= 2.5) {
    if (player.inColshape) return;
    player.inColshape = true;
    if (player.vehicle) {
      alt.emit("nError", "Выйдите из транспортного средства!");
    } else {
      if (!PostalJob.vehicle) {
         alt.emit("nError", "У вас нет фургона, чтобы загрузить почту!");
         return;
      }
      alt.emitServer("take.gopostal.object");
      PostalJob.hasbox = true;
    }
  } else if (PostalJob.colshapes.length >= 1) {
    if (player.inColshape) return;
    for (let i = 0; i < PostalJob.colshapes.length; i++) {
      if (alt.vdist(pPos, PostalJob.colshapes[i]) <= 1.0 && !PostalJob.active) {
        player.inColshape = true;
        if (player.vehicle) return;
        //alt.takeObject(player, "v_ind_cs_box02");
        game.freezeEntityPosition(player.scriptID, true);
        alt.emitServer("give.gopostal.item", i);
        //alt.putObject(player, "v_ind_cs_box02");
        game.freezeEntityPosition(player.scriptID, false);
        return;
      }
    }
  } else {
    if (player.inColshape) {
      player.inColshape = false;
      if (PostalJob.keyDownE !== undefined) delete PostalJob.keyDownE;
    }
  }
}, 200);

alt.onServer('setPostalJobStatus', (status) => { PostalJob.keyDownE = status; });
alt.onServer('getPostalJobStatus', (status) => {
  if (status !== "cancel") {
    alt.emit("prompt.show", `Нажмите <span class=\"hint-main__info-button\">Е</span> для взаимодействия`);
    PostalJob.keyDownE = status;
  } else {
    PostalJob.keyDownE = null;
  }
});

alt.onServer('clear.storage.gopostal', () => {
  deleteStorage();
  deleteMainBlip();
  PostalJob.hasbox = false;
  let arr = PostalJob.arr;
  for (let i = 0; i < arr.length; i++) {
      PostalJob.blips[i] = alt.helpers.blip.new(1, arr[i].x, arr[i].y, 0, { alpha: 255, scale: 1.1, name: "Точка сдачи почты", color: 3, shortRange: false });
      PostalJob.colshapes[i] = new alt.Vector3(arr[i].x, arr[i].y, arr[i].z + 1.0);
      PostalJob.markers[i] = {type: 20, pos: new alt.Vector3(arr[i].x, arr[i].y, arr[i].z + 1.0), dir: undefined, rot: 180, scale: 1, color: {r: 66, g: 170, b: 255, alpha: 180}, range: 2};
  }
  delete PostalJob.arr;
});

alt.setInterval(() => {
  const pPos = player.pos;

  if (PostalJob.markers.length >= 1) {
    PostalJob.markers.forEach((marker) => {
      if (alt.vdist(pPos, marker.pos)) game.drawMarker(marker.type, marker.pos.x, marker.pos.y, marker.pos.z, 0.0, 0.0, 0.0, 0.0, marker.rot, 0.0, marker.scale, marker.scale, marker.scale, marker.color.r, marker.color.g, marker.color.b, marker.color.alpha, false, true, marker.range, null, null, true);
    });
  }
}, 0);

alt.onServer('time.add.back.gopostal', (player) => {
    try
    {
      if (PostalJob.timeout === undefined) {
         PostalJob.timeout = alt.setTimeout(() => {
            alt.emitServer("leave.gopostal.job");
         }, 180000);
      }
    }
    catch (err) {
        alt.emit(`BN_Show`, err);
        return;
    }
});

alt.onServer('remove.all.gopostal.data', (player) => {
    try
    {
      delete PostalJob.arr; // Удаление хранения заказов
      deleteJobTimer();
      deleteMainBlip();
      deleteJobVehicle();
      deleteStorage();
      deleteUsebleBlips();
    }
    catch (err) {
        alt.emit(`BN_Show`, err);
        return;
    }
});

alt.onServer('set.gopostal.vehicle', (vehicle) => { PostalJob.vehicle = vehicle; });
alt.onServer('control.gopostal.blip', (num) => {
  try
  {
    deleteMainBlip();
    if (num === "cancel") return;
    switch (num) {
      case 1:
        PostalJob.blip = alt.helpers.blip.new(501, -321.17, -887.45, 31.07, { alpha: 255, scale: 1.0, color: 2, name: "Парковка Go Postal", shortRange: false });
        alt.emit("prompt.show", `Проследуйте на парковку и возьмите рабочий фургон.`);
        break;
      case 2:
        PostalJob.blip = alt.helpers.blip.new(615, 78.92, 112.55, 81.17, { alpha: 255, scale: 1.0, color: 2, name: "Склад Go Postal", shortRange: false });
        PostalJob.blip.route = true;
        PostalJob.blip.routeColor = 2;
        alt.emit("prompt.show", `Направляйтесь на склад и возьмите заказ, после чего загрузите фургон.`);
        break;
      case 3:
        PostalJob.blip = alt.helpers.blip.new(615, 69.25, 127.65, 79.21, { alpha: 255, scale: 1.0, color: 1, name: "Склад Go Postal", shortRange: false });
        alt.emit("prompt.show", `У вас есть 5 минут, чтобы загрузить почту в фургон.`);
    }
  }
  catch (err) {
      alt.emit(`BN_Show`, err);
      return;
  }
});

alt.onServer('create.gopostal.day', (arr) => {
  arr = JSON.parse(arr);

  deleteJobTimer();
  PostalJob.timeout = alt.setTimeout(() => {
     alt.emitServer("leave.gopostal.job");
  }, 300000);

  PostalJob.storage.marker = alt.helpers.marker.new(1, new alt.Vector3(63.28, 128.00, 79.21 - 0.8), undefined, undefined, 2.5, {r: 255, g: 0, b: 0, alpha: 130}, undefined, true, 2);
  PostalJob.storage.omarker = alt.helpers.marker.new(1, new alt.Vector3(74.27, 124.64, 79.21 - 0.8), undefined, undefined, 2.5, {r: 255, g: 0, b: 0, alpha: 130}, undefined, true, 2);
  PostalJob.storage.shape = new alt.Vector3(63.29, 127.92, 79.21);
  PostalJob.storage.oshape = new alt.Vector3(74.27, 124.64, 79.21);
  PostalJob.arr = arr;
});

alt.onServer('time.remove.back.gopostal', () => {
    try
    {
      deleteJobTimer();
    }
    catch (err) {
        alt.emit(`BN_Show`, err);
        return;
    }
});

alt.on(`disconnect`, () => {
  PostalJob.blips = [], PostalJob.colshapes = [], PostalJob.markers = [];
  delete PostalJob.storage.marker; delete PostalJob.storage.omarker;
  delete PostalJob.storage.shape; delete PostalJob.storage.oshape;
});

alt.on(`keyup`, (key) => { // E key
  if (key === 0x45) {
    if (PostalJob.keyDownE !== undefined) {
      if (game.getDistanceBetweenCoords(player.pos.x, player.pos.y, player.pos.z, -258.56, -841.53, 31.42, true) < 1.75) {
        alt.emit(`Cursor::show`, true);
        if (PostalJob.keyDownE === true) {
            alt.emit("choiceMenu.show", "accept_job_postal", {name: "уволиться из Go Postal?"});
        } else {
            alt.emit("choiceMenu.show", "accept_job_postal", {name: "устроиться в Go Postal?"});
        }
      } else if (game.getDistanceBetweenCoords(player.pos.x, player.pos.y, player.pos.z, 78.92, 112.55, 81.17, true) < 1.60) {
        alt.emitServer("gopostal.team.startday");
      }
    }
    if (PostalJob.vehicle !== undefined) {
      let bonePos = game.getWorldPositionOfEntityBone(PostalJob.vehicle.scriptID, game.getEntityBoneIndexByName(PostalJob.vehicle.scriptID, 'platelight'));
      let distance = alt.vdist(player.pos, bonePos);
      if (distance < 1.0) {
        if (PostalJob.hasbox === true) {
          PostalJob.hasbox = false;
          // player.taskPlayAnim("anim@narcotics@trash", "drop_front", 8.0, 0.0, -1, 49, 0, false, false, false);
          game.freezeEntityPosition(player.scriptID, true);
          alt.emitServer("put.gopostal.object");
          game.freezeEntityPosition(player.scriptID, false);
          return;
        }
      }
    }
  }
});

function deleteJobTimer() {
  if (PostalJob.timeout !== undefined) {
       alt.clearTimeout(PostalJob.timeout);
       delete PostalJob.timeout;
  }
}
function deleteStorage() {
  if (PostalJob.storage.marker !== undefined) {
    delete PostalJob.storage.marker, delete PostalJob.storage.omarker, delete PostalJob.storage.shape, delete PostalJob.storage.oshape;
  }
}
function deleteJobVehicle() {
  if (PostalJob.vehicle !== undefined) delete PostalJob.vehicle;
}
function deleteUsebleBlips() {
  for (let i = 0; i < PostalJob.blips.length; i++) if (PostalJob.blips[i] !== undefined) {
    if (PostalJob.blips[i].valid) PostalJob.blips[i].destroy(), delete PostalJob.colshapes[i], delete PostalJob.markers[i];
  }
  PostalJob.blips = [], PostalJob.colshapes = [], PostalJob.markers = [];
}
function deleteMainBlip() {
  if (PostalJob.blip !== undefined) {
       PostalJob.blip.route = false;
       PostalJob.blip.destroy();
       delete PostalJob.blip;
  }
}
