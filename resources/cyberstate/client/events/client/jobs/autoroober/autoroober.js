import alt from 'alt';
import game from 'natives';
const player = alt.Player.local

alt.on(`keyup`, (key) => {
	if (key === 0x45) {
		if (player.getSyncedMeta("keydownevariable2") != undefined) {
			if (player.getSyncedMeta("keydownevariable2") === true && !openMenu) alt.emit("showRooberMenu");
		}
	}
});

let openMenu;
let blipz, blipz2, bmark, time = -1, timer, timebar, vehic, find = false, vehname, hack = -1, hacktimer, gmoney, gtimer;
let rooberVehColShape = new alt.Vector3(126.815, -3105.666, 5.595); // Колшейп для сдачи угнанного ТС

alt.onServer('createRooberPlace', (x, y, z, sec, vname, veh, givemoneys) => {
	try
	{
		blipz = game.addBlipForRadius(x, y, z, 250);
		game.setBlipAlpha(blipz, 175);
		game.setBlipColour(blipz, 1);
		alt.emit(`BN_ShowWithPicture`, "Сообщение", "Симон", "Ты должен найти ~b~" + vname + " ~w~и привезти его в порт!", "CHAR_SIMEON", 2);
		time = sec;
		vehic = veh;
		vehname = vname;
		gmoney = givemoneys;
		timeBar = alt.helpers.timebar.new("ОСТАЛОСЬ");
		gtimer = alt.helpers.timebar.new("ПРИБЫЛЬ");
    	gtimer.text = "$" + givemoneys;
		gtimer.textColor = [114, 204, 114, 255];
	  	let moneylock = (gmoney / 100) * 30;
		timer = alt.setInterval(() => {
		   if (time > -1) {
			   time--;

			   if (vehic === undefined) {
				     alt.emitServer("destroy.roober.place");
					 alt.emit(`BN_ShowWithPicture`, "Сообщение", "Симон", "~r~Вы провалили задание!", "CHAR_SIMEON", 2);
				   return;
			   }

			    timeBar.text = getSynsedTimeBar(time);
					if (moneylock < gmoney) getHealthMoney(givemoneys);
			    if (find == false)  {
				     const pPos = player.pos;
				     let dist = game.getDistanceBetweenCoords(pPos.x, pPos.y, pPos.z, vehic.pos.x, vehic.pos.y, vehic.pos.z, true);
				     if (dist < 10.0) {
						  alt.emit(`BN_Show`, "Вы обнаружили ~b~" + vehname);
					      blipz.destroy();
					      blipz = null;
						  blipz = alt.helpers.blip.new(669, x, y, z, { alpha: 255, color: 74, name: vehname });
						  blipz.zAlpha = 255;
				          blipz2 = alt.helpers.blip.new(473, 126.815, -3105.666, 5.595, { alpha: 255, color: 74, scale: 0.8, name: "Склад" });
						  bmark = alt.helpers.marker.new(1, new alt.Vector3(126.815, -3105.666, 4.095), undefined, undefined, 4, {r: 0, g: 125, b: 255, alpha: 175}, undefined, true, 2);
						  blipz2.route = true;
						  blipz2.routeColor = 74;
						  find = true;
				     }
			    } else {
					if (player.vehicle == vehic) {
						if (blipz.zAlpha !== 0) {
							blipz.zAlpha = 0;
						}
					} else {
						if (blipz.zAlpha !== 255) {
							blipz.zAlpha = 255;
						}
					}
				}

		   }
	     if (hack > 0) {
			   hacktimer.progress += 0.01;
			   hack--;
		   }
			 if (hack == 0) {
				 game.freezeEntityPosition(player.scriptID, false);
				 alt.emit(`BN_Show`, "~r~Вы закончили взлом транспорта!");
				 hacktimer.visible = false;
				 hacktimer = null;
				 game.stopAnimTask(player.scriptID, "veh@break_in@0h@p_m_one@", "low_force_entry_ps", 0);
				 hack = -1;
			 }
		   if (time == 0) {
			   alt.emitServer("destroy.roober.place");
			   alt.emit(`BN_ShowWithPicture`, "Сообщение", "Симон", "~r~Вы провалили задание!", "CHAR_SIMEON", 2);
		   }
		}, 1000);
	} catch (err) {
		alt.emit(`BN_Show`, "~r~" + err);
		return;
	}
});

alt.onServer('startRoobingVehicle', (time) => {
	game.clearPedTasksImmediately(player.scriptID);
    game.freezeEntityPosition(player.scriptID, true);
	game.taskPlayAnim(player.scriptID, "veh@break_in@0h@p_m_one@", "low_force_entry_ps", 8.0, 0.0, -1, 49, 0, false, false, false);
	alt.emit(`BN_Show`, "~r~Вы начали взлом транспорта!");
	hacktimer = alt.helpers.timebar.new("ВЗЛОМ", true);
	hacktimer.progress = 0;
	hacktimer.pbarFgColor = [0, 125, 255, 220];
	hacktimer.pbarBgColor = [255, 255, 255, 255];
	hack = time;
});

alt.on("showRooberMenu", () => {
	openMenu = true;
	alt.emit("selectMenu.show", "rooberauto_menu");
});

alt.onServer("hideRooberMenu", () => {
	openMenu = false;
	alt.emit("selectMenu.hide", "rooberauto_menu");
});

alt.on(`Client::init`, (view) => {
	view.on("selectMenu.itemSelected", (menuName, itemName, itemValues, itemIndex) => {
		if (menuName === "rooberauto_menu") {
			alt.emit("hideRooberMenu");
			if (itemName === "Автоугон") alt.emitServer("create.roober.place");
			//else
		}
	});
});

alt.onServer('destroyRooberPlace', () => {
	destroyInfo();
});

function getSynsedTimeBar(time) {
	try
	{
    let minute, second;
    minute = Math.trunc(time / 60);
    second = time - minute * 60;
    if (second < 10) second = "0" + second;
    if (minute < 10) minute = "0" + minute;
    let text = minute + ":" + second;
    return text;
  }
  catch (err) {
    alt.emit(`BN_Show`, "~r~" + err);
    return;
  }
}

function destroyInfo() {
	find = false;
	alt.clearInterval(timer);
	blipz.destroy();
	timeBar.visible = false;
	gtimer.visible = false
	if (hack > -1) {
		hacktimer.visible = false;
		hack = -1;
		game.stopAnimTask(player.scriptID, "veh@break_in@0h@p_m_one@", "low_force_entry_ps", 0);
	}
	if (blipz2 !== undefined) {
		blipz2.route = false;
		blipz2.destroy();
		blipz2 = null, bmark = null;
  }
	timer = null, timebar = null, gtimer = null, hacktimer = null, blipz = null, vehname = null, vehic = null, time = -1, gmoney = null;
}

function getHealthMoney(gmoneys) {
	try
	{
		if (vehic !== undefined) {
			let countback = gmoneys / 1000;
			gmoney = Math.round(game.getVehicleBodyHealth(vehic.scriptID) * countback);
			gtimer.text = "$" + gmoney;
		}
	}
	catch (err) {
		alt.emit(`BN_Show`, "~r~" + err);
		return;
	}
}

alt.on(`update`, () => {
	if (find == true) {
		blipz.pos = vehic.pos;
		game.drawDebugText(`Доберитесь до ~b~места ликвидации транспорта`, 0.5, 0.95, { scale: 0.9, color: [255, 255, 255, 255], font: 4, outline: true });
	 } else if (find == false && blipz != undefined) {
		game.drawDebugText(`Угоните ~b~` + vehname, 0.5, 0.95, 0, { scale: 0.9, color: [255, 255, 255, 255], font: 4, outline: true });
	 }
});

alt.setInterval(() => {
	const pPos = player.pos;
	if (alt.vdist(pPos, rooberVehColShape) <= 4) {
		if (player.inColshape) return;
		player.inColshape = true;
		if (player.vehicle && vehic !== undefined) {
			if (player.vehicle == vehic) {
				alt.emit("ShowMidsizedShardMessage", "УГОН ЗАВЕРШЕН", "Вы заработали ~g~$" + gmoney, 2, false, true, 6000);
				alt.emitServer("pass.roober.place", gmoney);
			}
		}
	} else {
		if (player.inColshape) player.inColshape = false;
	}
}, 200);