import alt from 'alt';
import game from 'natives';

const player = alt.Player.local
const JobBus = {
	timeout: undefined,
	keyDownE: undefined,
	mush: [],
	current: 0,
	max: 999,
	blip: undefined,
	marker: undefined,
	colshape: undefined,
	vehicle: undefined,
	joinColshape: new alt.Vector3(436.19, -644.39, 28.74),
	info: [
		{
			blipcolor: 60,
			markercolor: [255, 255, 0, 200],
			blipname: "Промежуток"
		},
		{
			blipcolor: 1,
			markercolor: [255, 0, 0, 200],
			blipname: "Остановка"
		}
	]
};

alt.setInterval(() => {
	const pPos = player.pos;
	if (!player.colshape) {
		if (alt.vdist(pPos, JobBus.joinColshape) <= 1.25) {
			player.colshape = true;
			alt.emit("prompt.show", `Нажмите <span class=\"hint-main__info-button\">Е</span> для взаимодействия`);
			JobBus.keyDownE = true;
		} else if (alt.vdist(pPos, JobBus.colshape) <= 4 && player.vehicle) {
			player.colshape = true;
			if (JobBus.vehicle == player.vehicle) {
				let mash = JobBus.mush[JobBus.current];
				if (JobBus.current == JobBus.max - 1) {
					game.freezeEntityPosition(player.vehicle.scriptID, true);
					clearMash();
					alt.emit("selectMenu.show", "bus_mash");
					alt.emitServer("pay.bus.salary");
					return;
				}
				if (mash.type == 0) {
					JobBus.current++;
					sendMash();
				} else if (mash.type == 1) {
					alt.setTimeout(() => {
						game.freezeEntityPosition(player.vehicle.scriptID, true);
					}, 150);
					alt.emit("nInfo", "Ожидайте 15 секунд на остановке!");
					alt.setTimeout(() => {
						try {
							JobBus.current++;
							sendMash();
							game.freezeEntityPosition(player.vehicle.scriptID, false);
						} catch (err) {
							return;
						}
					}, 15000);
				}
			}
		}
	} else {
		if (alt.vdist(pPos, JobBus.joinColshape) > 1.25) {
			delete JobBus.keyDownE;
			player.colshape = false;
			alt.emit("prompt.hide");
		}
	}
}, 200);

alt.onServer("time.add.back.bus", (time) => {
	if (JobBus.timeout === undefined) {
		JobBus.timeout = alt.setTimeout(() => {
			alt.emitServer("leave.bus.job");
		}, time);
	}
});

alt.onServer("time.remove.back.bus", () => {
	if (JobBus.timeout !== undefined) {
		alt.clearTimeout(JobBus.timeout);
		delete JobBus.timeout;
	}
});

alt.onServer("start.bus.mash", (veh, mush) => {
	JobBus.current = 0;
	JobBus.max = mush.length;
	JobBus.mush = mush;
	JobBus.vehicle = veh;
	sendMash();
});

alt.onServer("clear.bus.data", () => {
	clearMash();
});

alt.on(`keyup`, (key) => {
	if (key === 0x45) {
		if (JobBus.keyDownE) {
			if (alt.clientStorage["job"] != 0 && alt.clientStorage["job"] != 2) return alt.emit(`nError`, `Вы уже где-то работаете!`);
			alt.emit(`Cursor::show`, true);
			if (alt.clientStorage["job"] == 2) alt.emit("choiceMenu.show", "accept_job_bus", {name: "уволиться из Автобусного Парка?"});
			else alt.emit("choiceMenu.show", "accept_job_bus", {name: "устроиться в Автобусный Парк?"});
		}
	}
});

function sendMash() {
	let mash = JobBus.mush[JobBus.current];
	let info = JobBus.info[mash.type];
	clearMash();
	JobBus.blip = alt.helpers.blip.new(1, mash.x, mash.y, 0, { alpha: 255, color: info.blipcolor, name: info.blipname });
	JobBus.blip.route = true;
	JobBus.blip.routeColor = info.blipcolor;
	JobBus.marker = alt.helpers.marker.new(1, new alt.Vector3(mash.x, mash.y, mash.z - 2.0), undefined, undefined, 4, {r: info.markercolor[0], g: info.markercolor[1], b: info.markercolor[2], alpha: info.markercolor[3]}, undefined, true, 2);
	JobBus.colshape = new alt.Vector3(mash.x, mash.y, mash.z);
}
 function clearMash() {
	 if (JobBus.blip) {
		 JobBus.blip.route = false;
		 JobBus.blip.destroy();
	 }
	 delete JobBus.blip, delete JobBus.marker, delete JobBus.colshape;
 }
