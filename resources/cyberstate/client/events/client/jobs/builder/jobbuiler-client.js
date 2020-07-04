import alt from 'alt';
import game from 'natives';

const player = alt.Player.local
const JobBuilder = {
  	timeout: undefined,
	blip: undefined,
	marker: undefined,
	colshape: undefined,
	vehicle: undefined
};

alt.onServer("time.remove.back.builder", (player) => {
    try
    {
      if (JobBuilder.timeout !== undefined) {
           alt.clearTimeout(JobBuilder.timeout);
           delete JobBuilder.timeout;
      }
    }
    catch (err) {
        alt.emit(`BN_Show`, err);
        return;
    }
});

let oshape = new alt.Vector3(-95.052, -1014.401, 27.275);
let marker;

alt.onServer('createJobBuilderRoom', (type) => {
	try
	{
		if (type === false)
			marker = undefined;
		else
		    marker = alt.helpers.marker.new(20, new alt.Vector3(-97.220, -1014.106, 27.075), undefined, 180, 1, {r: 255, g: 0, b: 0, alpha: 180}, undefined, true, 2);
	} catch (err) {
		alt.emit(`BN_Show`, "~r~" + err);
		return;
	}
});

alt.onServer('create.job.builder.vehicle', (vehicle) => {
	try
	{
     JobBuilder.vehicle = vehicle;
	} catch (err) {
		alt.emit(`BN_Show`, "~r~" + err);
		return;
	}
});

alt.onServer('time.add.back.builder', (time) => {
    try
    {
      if (JobBuilder.timeout === undefined) {
         JobBuilder.timeout = alt.setTimeout(() => {
			alt.emitServer("leave.builder.job");
         }, time);
      }
    }
    catch (err) {
        alt.emit(`BN_Show`, err);
        return;
    }
});

alt.onServer('create.job.builder.mark', (posx, posy, posz, type) => {
	try {
      	deleteData();
		if (type === true) {
			JobBuilder.blip = alt.helpers.blip.new(1, posx, posy, 0, { alpha: 255, color: 1, name: "Пункт назначения", shortRange: false });
      		JobBuilder.blip.route = true;
			JobBuilder.blip.routeColor = 1;
			JobBuilder.marker = alt.helpers.marker.new(1, new alt.Vector3(posx, posy, posz - 0.5), undefined, undefined, 0.8, {r: 255, g: 0, b: 0, alpha: 180}, undefined, true, 2);
			JobBuilder.colshape = new alt.Vector3(posx, posy, posz);
		}
	} catch (err) {
		alt.emit(`BN_Show`, "~r~" + err);
		return;
	}
});

alt.onServer('createJobNeedBuilderMarkBlip', (posx, posy, posz) => {
	try {
		deleteData();
		JobBuilder.marker = alt.helpers.marker.new(1, new alt.Vector3(posx, posy, posz - 0.5), undefined, undefined, 4, {r: 255, g: 0, b: 0, alpha: 110}, undefined, true, 2);
		JobBuilder.blip = alt.helpers.blip.new(1, posx, posy, 0, { alpha: 255, color: 1, shortRange: false });
		JobBuilder.blip.route = true;
		JobBuilder.blip.routeColor = 1;
		JobBuilder.colshape = new alt.Vector3(posx, posy, posz);
	} catch (err) {
		alt.emit(`BN_Show`, "~r~" + err);
		return;
	}
});

alt.onServer('createJobBuilderMarkBlip', (type, type2, posx, posy, posz) => {
	try {
      	deleteData();
		if (type === true) {
			JobBuilder.marker = alt.helpers.marker.new(1, new alt.Vector3(posx, posy, posz - 0.5), undefined, undefined, 1, {r: 255, g: 0, b: 0, alpha: 180}, undefined, true, 2);
			JobBuilder.blip = alt.helpers.blip.new(1, posx, posy, 0, { alpha: 255, color: 1, shortRange: false });
		}
	} catch (err) {
		alt.emit(`BN_Show`, "~r~" + err);
		return;
	}
});

function deleteData() {
	if (JobBuilder.marker !== undefined) {
		JobBuilder.blip.route = true;
	  	JobBuilder.blip.destroy();
		delete JobBuilder.marker, delete JobBuilder.blip;
	}
	if (JobBuilder.colshape !== undefined) {
		delete JobBuilder.colshape;
	}
}

alt.onServer('create.job.builder.load', () => {
	try
	{
		if (!JobBuilder.vehicle) {
			alt.emit(`BN_Show`, "~r~ТРАНСПОРТ НЕ ОБНАРУЖЕН!");
			return;
		}
        deleteData();
		let bonePos = game.getWorldPositionOfEntityBone(JobBuilder.vehicle.scriptID, game.getEntityBoneIndexByName(JobBuilder.vehicle.scriptID, 'platelight'));
		JobBuilder.blip = alt.helpers.blip.new(1, bonePos.x, bonePos.y, 0, { alpha: 255, color: 1, name: "Пункт назначения", shortRange: false });
		JobBuilder.marker = alt.helpers.marker.new(1, new alt.Vector3(bonePos.x, bonePos.y, bonePos.z - 1.25), undefined, undefined, 1.35, {r: 255, g: 0, b: 0, alpha: 180}, undefined, true, 2);
		JobBuilder.colshape = new alt.Vector3(bonePos.x, bonePos.y, bonePos.z);
	} catch (err) {
		alt.emit(`BN_Show`, "~r~" + err);
		return;
	}
});

alt.onServer('startBuilderUnload', () => {
  if (JobBuilder.vehicle) {
		game.freezeEntityPosition(JobBuilder.vehicle.scriptID, true);
		const JobBuilder = alt.setTimeout(() => {
			 if (JobBuilder.vehicle) game.freezeEntityPosition(JobBuilder.vehicle.scriptID, false);
			 alt.emitServer("stop.builder.unload");
		}, 7000);
	}
});

alt.on(`Client::init`, (view) => {
	view.on('client.job.cursor.cancel', () => {
		alt.emit(`Cursor::show`, false);
	});
});

alt.setInterval(() => {
	const pPos = player.pos;
	if (alt.vdist(pPos, oshape) <= 2) {
		if (player.inColshape) return;
		player.inColshape = true;
		alt.emit("prompt.show", `Нажмите <span class=\"hint-main__info-button\">Е</span> для взаимодействия`);
	} else if (alt.vdist(pPos, JobBuilder.colshape) <= 2) {
		if (player.inColshape) return;
		player.inColshape = true;
		alt.emitServer("use.builderfunctions.job");
	} else {
	  if (player.inColshape) {
		player.inColshape = false;
	  }
	}
}, 200);

alt.on(`keyup`, (key) => {
	if (key === 0x45) {
		if (player.getSyncedMeta("keydownevariable") != undefined) {
			if (game.getDistanceBetweenCoords(player.pos.x, player.pos.y, player.pos.z, -95.052, -1014.401, 27.275, true) < 4) {
				alt.emit(`Cursor::show`, true);
				if (player.getSyncedMeta("keydownevariable") === true)
					alt.emit("choiceMenu.show", "accept_job_builder", {name: "уволиться со Стройки?"});
				else
					alt.emit("choiceMenu.show", "accept_job_builder", {name: "устроиться на Стройку?"});
			}
		}
	}
});
