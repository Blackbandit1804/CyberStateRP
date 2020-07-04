const customsInfo = require("./customs_info");

const rawCustomsInfo = JSON.stringify(customsInfo);
const interactionInfo = new Map();

alt.on("playerDisconnect", (player) => { playerDeathOrQuit(player, false); });
alt.on("playerDeath", (player) => { playerDeathOrQuit(player, true); });

alt.onClient("playerBrowserReady", (player) => {
	alt.emitClient(player, "ls_customs::init", rawCustomsInfo);
});

alt.onClient("ls_customs::init", (player, placeId) => {
	/*if (alt.isFactionVehicle(player.vehicle) || alt.isJobVehicle(player.vehicle) || player.vehicle.owner != player.sqlId + 2000) {
		return;
	}*/

	const safePosition = customsInfo.places[placeId].exitVehInfo[0].pos;
	const vehicle = player.vehicle;
	const dimension = player.sqlId + 1;
	
	if (vehicle.modKitsCount <= 0) endOfTuning(player);

	alt.Player.all.forEach((rec) => {
		if (rec.vehicle && rec.vehicle == vehicle) alt.emitClient(rec, "ls_customs::occupant_init");
	});

	let vehiclePrice = 1;

	if (Array.isArray(alt.autosaloons.vehicles)) {
		const vehicleModel = vehicle.model;

		vehiclePrice = alt.autosaloons.vehicles.filter((v) => v.modelHash === vehicleModel).map((v) => v.price)[0] || 10000;
	}
	
	interactionInfo.set(player.sqlId, {
		dimension,
		vehicle,
		placeId,
		vehiclePrice
	});

	vehicle.dimension = dimension;
	vehicle.modKit = 1;

	alt.Player.all.forEach((rec) => {
		if (rec.vehicle && rec.vehicle == vehicle) {
			rec.dimension = dimension;
			rec.utils.setSafeQuitPosition(safePosition);
			alt.emitClient(rec, `Vehicle::putInto`, vehicle, rec.seat);
			alt.emitClient(rec, "ls_customs::start", player.sqlId, vehicle, placeId, vehiclePrice);
		}
	});
});

alt.onClient("ls_customs::end", (player) => {
	endOfTuning(player);
});

alt.onClient("ls_customs::vehicle_reach_point", (player, rawPosition, heading) => {
	alt.Player.all.forEach((rec) => {
		if (rec.vehicle && rec.vehicle == player.vehicle && rec.sqlId != player.sqlId) { alt.emitClient(rec, "ls_customs::show_vehicle", rawPosition, heading); };
	});
});

alt.onClient("ls_customs::repair", (player) => {
	const vehicle = player.vehicle;
	
	alt.emitClient(player, `Vehicle::repair`, vehicle);

	if (isVehicleTuningSave(vehicle)) {
		DB.Query("UPDATE vehicles SET health=1000, engineBroken=0, oilBroken=0, accumulatorBroken=0 WHERE id = ?", [vehicle.sqlId]);
	}
});

alt.onClient("ls_customs::setMod", (player, modType, modIndex) => {
	const vehicle = player.vehicle;

	vehicle.setMod(modType, modIndex);

	if (isVehicleTuningSave(vehicle)) {
		DB.Query(
			"INSERT INTO vehicles_mods (vehicle_id, `type`, `index`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `type`=?, `index`=?;",
			[vehicle.sqlId, modType, modIndex, modType, modIndex]);
	}
});

alt.onClient("ls_customs::enableNeon", (player, rawValues) => {
	const vehicle = player.vehicle;
	const values = JSON.parse(rawValues);

	vehicle.neon = values;

	if (isVehicleTuningSave(vehicle)) {
		DB.Query("UPDATE vehicles SET neon=? WHERE id = ?", [JSON.stringify(values), vehicle.sqlId]);
	}
});

alt.onClient("ls_customs::neonColor", (player, r, g, b) => {
	const vehicle = player.vehicle;

	vehicle.neonColor = { r, g, b };

	if (isVehicleTuningSave(vehicle)) {
		DB.Query("UPDATE vehicles SET neonColor=? WHERE id = ?", [JSON.stringify({ r, g, b }), vehicle.sqlId]);
	}
});

alt.onClient("ls_customs::numberPlateType", (player, type) => {
	const vehicle = player.vehicle;

	vehicle.numberPlateIndex = type;

	if (isVehicleTuningSave(vehicle)) {
		DB.Query("UPDATE vehicles SET numberPlateIndex=? WHERE id = ?", [type, vehicle.sqlId]);
	}
});

alt.onClient("ls_customs::setColor", (player, primaryColor, secondaryColor) => {
	const vehicle = player.vehicle;
	
	vehicle.primaryColor = primaryColor;
	vehicle.secondaryColor = secondaryColor;

	if (isVehicleTuningSave(vehicle)) {
		DB.Query("UPDATE vehicles SET color1=?, color2=? WHERE id = ?", [primaryColor, secondaryColor, vehicle.sqlId]);
	}
});

alt.onClient("ls_customs::setWheel", (player, wheelType, wheelIndex, isBackWheel = false) => {
	const vehicle = player.vehicle;

	vehicle.setWheels(wheelType, wheelIndex);

	if (isVehicleTuningSave(vehicle)) {
		DB.Query(`UPDATE vehicles SET wheelType=?, wheelIndex=? WHERE id = ?`, [wheelType, wheelIndex, vehicle.sqlId]);
	}
});

alt.onClient("ls_customs::setWheelColor", (player, color) => {
	const vehicle = player.vehicle;

	vehicle.wheelColor = color;

	if (isVehicleTuningSave(vehicle)) {
		DB.Query("UPDATE vehicles SET wheelColor=? WHERE id = ?", [color, vehicle.sqlId]);
	}
});

alt.onClient("ls_customs::setCustomTires", (player, value) => {
	const vehicle = player.vehicle;

	vehicle.customTires = value;

	if (isVehicleTuningSave(vehicle)) {
		DB.Query("UPDATE vehicles SET customTires=? WHERE id = ?", [Number(value), vehicle.sqlId]);
	}
});

alt.onClient("ls_customs::setTiresSmokeColor", (player, r, g, b) => {
	const vehicle = player.vehicle;

	vehicle.tireSmokeColor = { r, g, b };

	if (isVehicleTuningSave(vehicle)) {
		DB.Query("UPDATE vehicles SET tireSmokeColor=? WHERE id = ?", [JSON.stringify({ r, g, b }), vehicle.sqlId]);
	}
});

alt.onClient("ls_customs::setWindowTint", (player, value) => {
	const vehicle = player.vehicle;

	vehicle.windowTint = value;

	if (isVehicleTuningSave(vehicle)) {
		DB.Query("UPDATE vehicles SET windowTint=? WHERE id = ?", [value, vehicle.sqlId]);
	}
});

function playerDeathOrQuit(player, isDeath) {
	if (!interactionInfo.has(player.sqlId)) {
		return;
	}

	if (isDeath) alt.emitClient(player, "ls_customs::end_driver");

	endOfTuning(player, !isDeath);
}

function endOfTuning(player, isQuit = false) {
	const playerId = player.sqlId;
	const info = interactionInfo.get(playerId);

	if (!interactionInfo) return;

	const vehicle = info.vehicle;
	const exitVehInfo = customsInfo.places[info.placeId].exitVehInfo;
	const exitInfo = exitVehInfo[Math.floor(Math.random()*exitVehInfo.length)];

	alt.Player.all.forEach((rec) => {
		if (rec.vehicle && rec.vehicle == vehicle) {
			alt.emitClient(rec, "ls_customs::end_occupant");
			rec.dimension = 1;
	
			if (rec.sqlId !== playerId) {
				rec.utils.setSafeQuitPosition(undefined);
			} else if (!isQuit) {
				rec.utils.setSafeQuitPosition(undefined);
			}
		}
	});

	vehicle.dimension = 1;

	vehicle.pos = exitInfo.position;
	vehicle.rot = new alt.Vector3(0, 0, exitInfo.heading * Math.PI / 180);

	interactionInfo.delete(playerId);
}

function isVehicleTuningSave(vehicle) {
	return vehicle.sqlId && vehicle.owner >= 2000;
}

alt.onClient("ls_customs::checkPrice", (player, keyItem, modType = 0, index = 0, repairPrice = undefined) => {
	if (!interactionInfo.has(player.sqlId)) {
		alt.emitClient(player, "ls_customs::checkPriceResponse", false);
		return;
	}

	const vehiclePrice = interactionInfo.get(player.sqlId).vehiclePrice;
	const prices = customsInfo.prices[keyItem];

	let price;

	if (keyItem === "mods") {
		if (Array.isArray(prices[modType])) {
			price = prices[modType][index];
		} else if (typeof(prices[modType]) === "object") {
			price = prices[modType].base + (index * prices[modType].add);
		}
	} else if (keyItem === "repair") {
		price = 0;
	} else {
		if (Array.isArray(prices)) {
			price = prices[index];
		} else if (typeof(prices) === "object") {
			price = prices.base + (index * prices.add);
		}
	}

	if (typeof(price) !== "number") {
		alt.emitClient(player, "ls_customs::checkPriceResponse", false);
		return;
	}

	if (Number.isInteger(repairPrice)) {
		price = repairPrice / 7 + vehiclePrice * 0.001;
	} else {
		price *= vehiclePrice;
	}

	price = Math.round(price);

	const newPlayerMoney = player.money - price;

	if (newPlayerMoney >= 0) {
		alt.emitClient(player, "ls_customs::checkPriceResponse", true);
		player.utils.setMoney(newPlayerMoney);
	} else {
		player.utils.error("У вас недостаточно средств!");
		alt.emitClient(player, "ls_customs::checkPriceResponse", false);
	}
});

module.exports = { 
	tuningVehicle: (vehicle, dbData) => {
		return new Promise((resolve, reject) => {
			if (typeof(dbData.neon) === "string") {
				vehicle.modKit = 1;
				vehicle.neon = JSON.parse(dbData.neon);
			}
			if (typeof(dbData.neonColor) === "string") {
				vehicle.modKit = 1;
				vehicle.neonColor = JSON.parse(dbData.neonColor);
			}
			if (typeof(dbData.wheelType) === "number" && typeof(dbData.wheelIndex) === "number") {
				vehicle.modKit = 1;
				vehicle.setWheels(dbData.wheelType, dbData.wheelIndex);
			}
			if (typeof(dbData.wheelColor) === "number") {
				vehicle.modKit = 1;
				vehicle.wheelColor = dbData.wheelColor;
			}
			if (typeof(dbData.customTires) === "number") {
				vehicle.modKit = 1;
				vehicle.customTires = dbData.customTires === 1;
			}
			if (typeof(dbData.tireSmokeColor) === "string") {
				vehicle.modKit = 1;
				vehicle.tireSmokeColor = JSON.parse(dbData.tireSmokeColor);
			}
			if (typeof(dbData.numberPlateIndex) === "number") {
				vehicle.modKit = 1;
				vehicle.numberPlateIndex = dbData.numberPlateIndex;
			}
			if (typeof(dbData.windowTint) === "number") {
				vehicle.modKit = 1;
				vehicle.windowTint = dbData.windowTint;
			}

			DB.Query("SELECT * FROM vehicles_mods WHERE vehicle_id = ?", [dbData.id], (e, result) => {
				if (e) {
					alt.log(e);
					reject(e);
					return;
				}

				if (result.length === 0) {
					resolve();
					return;
				}

				vehicle.modKit = 1;

				for (const mod of result) {
					vehicle.setMod(mod.type, mod.index);
				}

				resolve();
			});
		});
	}
};

alt.onClient("playerBrowserReady", (player) => {
	for (const place of customsInfo.places) {
		alt.emitClient(player, `ls_customs::blip::set`, JSON.stringify(place.enterPosition));
	}
});
