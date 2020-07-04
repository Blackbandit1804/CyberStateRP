const JobTrucker = {
  keyDownE: undefined,
  timeout: undefined,
  colshape: new alt.ColshapeSphere(-775.109, -2632.27, 13.9446, 1.25)
};

alt.on('entityEnterColshape', (shape) => {
    if (shape === JobTrucker.colshape) {
      alt.emit("prompt.show", `Нажмите <span class=\"hint-main__info-button\">Е</span> для взаимодействия`);
      JobTrucker.keyDownE = true;
    }
});
alt.on('entityLeaveColshape', (shape) => {
    if (shape === JobTrucker.colshape) {
      delete JobTrucker.keyDownE;
      alt.emit("prompt.hide");
    }
});

alt.on("time.add.back.trucker", (player) => {
  try
  {
    if (JobTrucker.timeout === undefined) {
      JobTrucker.timeout = setTimeout(() => {
          alt.emitServer("leave.trucker.job");
      }, 60000);
    }
  }
  catch (err) {
      alt.emit(`BN_Show`, err);
      return;
  }
});

alt.on("time.remove.back.trucker", (player) => {
  try
  {
    if (JobTrucker.timeout !== undefined) {
        clearTimeout(JobTrucker.timeout);
        delete JobTrucker.timeout;
    }
  }
  catch (err) {
      alt.emit(`BN_Show`, err);
      return;
  }
});

alt.keys.bind(0x45, false, function () { // E key
	if (JobTrucker.keyDownE) {
    if (alt.clientStorage["job"] != 0 && alt.clientStorage["job"] != 5) return alt.emit(`nError`, `Вы уже где-то работаете!`);
    alt.gui.cursor.show(true, true);
    if (alt.clientStorage["job"] == 5) alt.emit("choiceMenu.show", "accept_job_trucker", {name: "уволиться из Дальнобойщиков?"});
    else alt.emit("choiceMenu.show", "accept_job_trucker", {name: "устроиться Дальнобойщиком?"});
	}
});
