const JobWaterFront = {
  job_colshape: undefined,
  job_marker: undefined,
  job_gmarker: undefined,
  job_blip: undefined,
  clothes_marker: undefined,
  keyDownE: undefined,
  job_status: -1,
  timeout: undefined,
  item: undefined
};

alt.on("time.add.back.watefront", (player) => {
    try
    {
      if (JobWaterFront.timeout === undefined) {
         JobWaterFront.timeout = setTimeout(() => {
            alt.emitServer("leave.watefront.job");
         }, 60000);
      }
    }
    catch (err) {
        alt.emit(`BN_Show`, err);
        return;
    }
});
alt.on("time.remove.back.waterfront", (player) => {
    try
    {
      if (JobWaterFront.timeout !== undefined) {
           clearTimeout(JobWaterFront.timeout);
           delete JobWaterFront.timeout;
      }
    }
    catch (err) {
        alt.emit(`BN_Show`, err);
        return;
    }
});

alt.on('create.waterfront.clothmarker', (type) => {
	try
	{
		if (type === false)
			JobWaterFront.job_marker.destroy();
		else
			JobWaterFront.job_marker = alt.helpers.marker.new(20, new alt.Vector3(-413.36, -2699.29, 6.00), 1, { visible: true, color: [255, 0, 0, 180], rotation: 180 });
	} catch (err) {
		alt.emit(`BN_Show`, "~r~" + err);
		return;
	}
});

alt.on('setWaterFrontJobStatus', (status) => { JobWaterFront.keyDownE = status; });
alt.on('getWaterFrontJobStatus', (status) => {
  if (status !== "cancel") {
    alt.emit("prompt.show", `Нажмите <span class=\"hint-main__info-button\">Е</span> для взаимодействия`);
    JobWaterFront.keyDownE = status;
  } else {
    JobWaterFront.keyDownE = null;
  }
});
alt.keys.bind(0x45, false, function () { // E key
	if (JobWaterFront.keyDownE !== undefined) {
		if (game.getDistanceBetweenCoords(player.pos.x, player.pos.y, player.pos.z, -410.083, -2700.001, 6.000, true) < 1.75){
      alt.emit(`Cursor::show`, true);
      if (JobWaterFront.keyDownE === true) {
          alt.emit("choiceMenu.show", "accept_job_waterfront", {name: "уволиться с Порта?"});
      } else {
					alt.emit("choiceMenu.show", "accept_job_waterfront", {name: "устроиться в Порт?"});
      }
		}
	}
});
alt.on('entityEnterColshape', (shape) => {
    if (shape === JobWaterFront.job_colshape) if (JobWaterFront.job_status !== -1) alt.emitServer("use.watefrontfunctions.job",  JobWaterFront.job_status);
});

alt.on('create.watefront.boxveh', (entity) => {
  try
	{
    JobWaterFront.item = alt.objects.new(game.getHashKey("prop_boxpile_06b"), new alt.Vector3(entity.pos.x, entity.pos.y, entity.pos.z), { rotation: 0.0 });
    JobWaterFront.item.attachTo(entity.handle, 4, 0.0, 0.075, 0.075, 0.0, 0.0, 0.0, true, true, true, false, 0, true);
	} catch (err) {
		alt.emit(`BN_Show`, "~r~" + err);
		return;
	}
});
alt.on('create.watefront.loader', (posx, posy, posz, contin, status) => {
  try
	{
    JobWaterFront.job_status = status;
		if (JobWaterFront.job_gmarker !== undefined) {
			JobWaterFront.job_gmarker.destroy();
			JobWaterFront.job_blip.destroy();
      JobWaterFront.job_colshape.destroy();
      delete JobWaterFront.job_gmarker, delete JobWaterFront.job_blip, delete JobWaterFront.job_colshape;
		}
    if (JobWaterFront.item !== undefined) {
      JobWaterFront.item.destroy();
      delete JobWaterFront.item;
    }
		if (contin === true) {
			JobWaterFront.job_gmarker = alt.helpers.marker.new(1, new alt.Vector3(posx, posy, posz - 1.35), 0.65, { visible: true, dimension: 0, color: [255, 0, 0, 190] });
			JobWaterFront.job_blip = alt.helpers.blip.new(1, new alt.Vector3(posx, posy), { alpha: 255, color: 1 });
      JobWaterFront.job_colshape = new alt.ColshapeSphere(posx, posy, posz, 2);
		}
	} catch (err) {
		alt.emit(`BN_Show`, "~r~" + err);
		return;
	}
});

alt.on('create.watefront.item', (contin, create, status, posx, posy, posz) => {
  try
	{
    JobWaterFront.job_status = status;
		if (JobWaterFront.job_gmarker !== undefined) {
			JobWaterFront.job_gmarker.destroy();
			JobWaterFront.job_blip.destroy();
      JobWaterFront.job_colshape.destroy();
      delete JobWaterFront.job_gmarker, delete JobWaterFront.job_blip, delete JobWaterFront.job_colshape;
		}
    if (JobWaterFront.item !== undefined) {
      JobWaterFront.item.destroy();
      delete JobWaterFront.item;
    }
		if (contin === true) {
			JobWaterFront.job_gmarker = alt.helpers.marker.new(1, new alt.Vector3(posx, posy, posz - 1.2), 1, { visible: true, dimension: 0, color: [255, 0, 0, 180] });
			JobWaterFront.job_blip = alt.helpers.blip.new(1, new alt.Vector3(posx, posy), { alpha: 255, color: 1 });
      JobWaterFront.job_colshape = new alt.ColshapeSphere(posx, posy, posz, 1);
		}
	} catch (err) {
		alt.emit(`BN_Show`, "~r~" + err);
		return;
	}
});
