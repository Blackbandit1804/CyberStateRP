import alt from 'alt';
import game from 'natives';

const player = alt.Player.local;
const JobTrash = {
  keyDownE: undefined,
  blip: undefined,
  colshape: undefined,
  object: undefined,
  marker: undefined,
  smarker: undefined,
  vehicle: undefined,
  timeout: undefined,
  trashinfo: undefined,
  count: 0,
  request: false,
  jobtype: 0
}

alt.onServer('setTrashJobStatus', (status) => { JobTrash.keyDownE = status; });
alt.onServer('getTrashJobStatus', (status) => {
  if (status !== "cancel") {
    alt.emit("prompt.show", `Нажмите <span class=\"hint-main__info-button\">Е</span> для взаимодействия`);
    JobTrash.keyDownE = status;
  } else {
    JobTrash.keyDownE = null;
  }
});
alt.on(`keyup`, (key) => {
  if (key === 0x45) {
    if (JobTrash.keyDownE !== undefined) {
      if (game.getDistanceBetweenCoords(player.pos.x, player.pos.y, player.pos.z, -629.18, -1634.45, 26.04, true) < 1.75){
        alt.emit(`Cursor::show`, true);
        if (JobTrash.keyDownE === true) {
            alt.emit("choiceMenu.show", "accept_job_trash", { name: "уволиться из Центра утилизации?" });
        } else {
            alt.emit("choiceMenu.show", "accept_job_trash", { name: "устроиться в Центр утилизации?" });
        }
      }
    }
  
    if (JobTrash.jobtype === 1) {
      if (JobTrash.vehicle !== undefined && JobTrash.request === false) {
        let bonePos = game.getWorldPositionOfEntityBone(JobTrash.vehicle.scriptID, game.getEntityBoneIndexByName(JobTrash.vehicle.scriptID, "boot"));
        let distance = alt.vdist(player.pos, bonePos);
        if (distance < 3) {
          JobTrash.request = true;
          game.taskPlayAnim(player.scriptID, "anim@narcotics@trash", "drop_front", 8.0, 0.0, -1, 49, 0, false, false, false);
          game.freezeEntityPosition(player.scriptID, true);
          game.clearPedTasksImmediately(player.scriptID);
          alt.setTimeout(() => {
             game.freezeEntityPosition(player.scriptID, false);
             alt.emitServer("send.trash.end");
             game.clearPedTasksImmediately(player.scriptID);
          }, 1500);
          return;
        }
      }
    }
  }
});

alt.onServer('createPlaceTrasher', (x, y, z, status) => {
  deleteDefaultData(true);
  if (status === true) {
    JobTrash.marker = alt.helpers.marker.new(1, new alt.Vector3(x, y, z), undefined, 180, 1, {r: 255, g: 0, b: 0, alpha: 40}, undefined, true, 2);
		JobTrash.object = alt.helpers.object.new(game.getHashKey("hei_prop_heist_binbag"), new alt.Vector3(x, y, z + 0.5), null, 0);
    JobTrash.blip = alt.helpers.blip.new(1, x, y, 0, { alpha: 255, color: 3, shortRange: false, name: "Мусорный бак" });
    JobTrash.blip.route = true;
    JobTrash.colshape = new alt.Vector3(x, y, z + 1.0);
  }
});

alt.onServer('update.trash.vehicle', (vehicle, min, max) => {
  try {
    if (vehicle === "cancel") {
      if (JobTrash.timeout !== undefined) {
           alt.clearTimeout(JobTrash.timeout);
           delete JobTrash.timeout;
      }
      if (JobTrash.smarker) JobTrash.smarker.destroy();
      if (JobTrash.trashinfo) JobTrash.trashinfo.visible = false;
      delete JobTrash.vehicle, delete JobTrash.trashinfo, delete JobTrash.smarker;
      return;
    }
    JobTrash.vehicle = vehicle;
    if (!JobTrash.smarker) JobTrash.smarker = alt.helpers.marker.new(1, new alt.Vector3(-467.69, -1719.06, 18.69 - 1.30), undefined, 180, 1, {r: 255, g: 0, b: 0, alpha: 50}, undefined, true, 2);
    if (!JobTrash.trashinfo) JobTrash.trashinfo = alt.helpers.timebar.new("ВМЕСТИМОСТЬ", true);
    JobTrash.trashinfo.text = min + "/" + max;
    JobTrash.count = min;
  }
  catch (err) {
      alt.emit(`BN_Show`, err);
      return;
  }
});
alt.onServer("time.add.back.trash", (player) => {
    try
    {
      if (JobTrash.timeout === undefined) {
         JobTrash.timeout = alt.setTimeout(() => {
            alt.emitServer("leave.trash.job");
         }, 180000);
      }
    }
    catch (err) {
        alt.emit(`BN_Show`, err);
        return;
    }
});
alt.onServer("time.remove.back.trash", (player) => {
    try
    {
      if (JobTrash.timeout !== undefined) {
           alt.clearTimeout(JobTrash.timeout);
           delete JobTrash.timeout;
      }
    }
    catch (err) {
        alt.emit(`BN_Show`, err);
        return;
    }
});

alt.setInterval(() => {
  const pPos = player.pos;

  if (alt.vdist(pPos, JobTrash.colshape) <= 1 && !player.vehicle && JobTrash.jobtype !== 1) {
     if (JobTrash.count >= 30) {
       alt.emit("nWarning", "Ваш транспорт переполнен, выгрузите мусор на свалку!");
       return;
     }
     JobTrash.jobtype = 1;
     game.taskPlayAnim(player.scriptID, "anim@move_m@trash", "pickup", 8.0, 0.0, -1, 48, 0, false, false, false);
     game.freezeEntityPosition(player.scriptID, true);
     const trash2 = alt.setTimeout(() => {
       game.freezeEntityPosition(player.scriptID, false);
       alt.emit("nWarning", "Положите мешок в задний сектор мусоровоза!");
       alt.emit("prompt.show", `Нажмите <span class=\"hint-main__info-button\">E</span>, чтобы положить мешок в задний сектор!`);
       deleteDefaultData(false);
       alt.emitServer("take.trash.box");
     }, 650);
   }
}, 100);

function deleteDefaultData(type) {
  try {
    if (JobTrash.blip !== undefined) {
      JobTrash.blip.route = false;
      JobTrash.blip.destroy();
      game.deleteObject(JobTrash.object.scriptID);
      if (JobTrash.trashinfo) JobTrash.trashinfo.visible = false;
      delete JobTrash.blip, delete JobTrash.colshape, delete JobTrash.object, delete JobTrash.marker, delete JobTrash.trashinfo;
    }
    JobTrash.request = false;
    if (type === true) JobTrash.jobtype = 0;
  }
  catch (err) {
      alt.emit(`BN_Show`, err);
      return;
  }
}
// Анимации
game.requestAnimDict("anim@narcotics@trash");
game.requestAnimDict("anim@move_m@trash");