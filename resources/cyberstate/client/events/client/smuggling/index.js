import alt from 'alt';
import game from 'natives';

const player = alt.Player.local;
const dealerInfo = {
	colshapeOffset: new alt.Vector3(1.9, -4, -1),
	pedOffset: new alt.Vector3(1.9, -3, 0.15),
	pedModel: 0xF0EC56E2,
	objectsData: [
		{ model: game.getHashKey("prop_box_ammo03a"), offset: new alt.Vector3(0, -1.3, -0.3), rotation: 0 },
		{ model: game.getHashKey("prop_box_ammo03a"), offset: new alt.Vector3(0, -1.25, 0.15), rotation: 0 },
		{ model: game.getHashKey("ex_office_swag_guns02"), offset: new alt.Vector3(-0.2, -2, -0.3), rotation: 45 }
	],
	vehicles: new Map(), // Key: vehicle remoteId
	pedIds: []
}
const blackMarketInfo = {
	places: [
		{ position: new alt.Vector3(1193.7048, -3250.6465, 7.0952), heading: 90, model: 0xA2E86156, scenario: "WORLD_HUMAN_GUARD_STAND_CLUBHOUSE" },
		{ position: new alt.Vector3(1196.6531, -3249.2712, 7.0952), heading: 136.5924, model: 0x681BD012, scenario: "WORLD_HUMAN_STAND_MOBILE" },
		{ position: new alt.Vector3(1197.1665, -3250.9695, 7.0952), heading: 66.4661, model: 0xEF785A6A, scenario: "WORLD_HUMAN_AA_SMOKE" }
	],
	peds: [],
	colshape: undefined
};

/*alt.on("update", () => {
	if (objects.entities.length === 0) {
		return;
	}

	for (const obj of objects.entities) {
		const inStream = objects.streamed.has(obj);

		if (inStream && obj === 0) {
			objects.streamed.delete(obj);

			alt.emit("gameEntityDestroy", obj);
		} else if (!inStream && obj !== 0) {
			objects.streamed.add(obj);

			alt.emit("gameEntityCreate", obj);
		}
	}
});*/
alt.onServer("smuggling::createPeds", (rawVehiclesData) => {
	const vehiclesData = JSON.parse(rawVehiclesData);

	for (const vehicleData of vehiclesData) {
		const vehicle = alt.Vehicle.atRemoteId(vehicleData.id);

		dealerInfo.vehicles.set(vehicleData.id, {
			position: vehicleData.position,
			heading: vehicleData.heading,
			ped: undefined
		});

		if (vehicle && vehicle.scriptID === 0) {
			continue;
		}


		createBlips(vehiclesData);
		createEntitiesByVehicle(vehicle);
	}
});

alt.on("gameEntityCreate", (entity) => {
	if (dealerInfo.vehicles.has(entity.id)) {
		vehicleStreamIn(entity);
	}
});

function vehicleStreamIn(vehicle) {
	game.freezeEntityPosition(vehicle.scriptID, true);

	const vehicleData = dealerInfo.vehicles.get(vehicle.id);

	game.setEntityCoords(vehicle.scriptID, vehicleData.position.x, vehicleData.position.y, vehicleData.position.z);
	game.setEntityHeading(vehicle.scriptID, vehicleData.heading);
	game.setVehicleDoorOpen(vehicle.scriptID, 2, false, true);
	game.setVehicleDoorOpen(vehicle.scriptID, 3, false, true);
	game.setVehicleDoorCanBreak(vehicle.scriptID, 2, false);
	game.setVehicleDoorCanBreak(vehicle.scriptID, 3, false);

	if (vehicleData.ped !== undefined) {
		return;
	}

	createEntitiesByVehicle(vehicle);
}

function dealerPedStreamIn(ped) {
	game.freezeEntityPosition(ped, false);

	// Wait until ped stands to feet
	const interval = setInterval(() => {
		if (ped === 0) {
			clearInterval(interval);
			return;
		}

		if (!game.isPedOnFoot(ped)) {
			return;
		}

		clearInterval(interval);

		game.freezeEntityPosition(ped, true);
		game.taskStartScenarioInPlace(ped, "WORLD_HUMAN_SMOKING", 0, false);
	}, 50);
}

function createEntitiesByVehicle(vehicle) {
	if (!vehicle) return;
	const vehicleData = dealerInfo.vehicles.get(vehicle.id);
	const position = vehicle.pos;
	const heading = game.getEntityHeading(vehicle.scriptID);
	const ped = createPed(position, heading);

	vehicleData.ped = ped;
}

async function createPed(vehiclePosition, heading) {
	const pedPosition = getObjectOffsetFromCoords(vehiclePosition, heading, dealerInfo.pedOffset);
	const ped = await alt.helpers.ped.createPed(0, dealerInfo.pedModel, pedPosition, heading + 180);

	if (ped !== 0) {
		dealerPedStreamIn(ped);
	}

	dealerInfo.pedIds.push(ped);

	return ped;
}

function createObjects(vehiclePosition, heading) {
	for (const objectData of dealerInfo.objectsData) {
		const position = getObjectOffsetFromCoords(vehiclePosition, heading, objectData.offset);
		const obj = game.createObject(objectData.model, position.x, position.y, position.z, false, false, false);
	}
}

function createBlips(vehiclesData) {
		for (let i = 0; i < vehiclesData.length; i++) {
			alt.helpers.blip.new(84, vehiclesData[i].position.x, vehiclesData[i].position.y, vehiclesData[i].position.z, {
					alpha: 255,
					scale: 0.7,
					color: 25,
			    name: 'Дилер',
					shortRange: true
			});
	}
}

/*function blackMarketPedStreamIn(ped) {
	const place = blackMarketInfo.places[blackMarketInfo.peds.indexOf(ped)];

	game.taskStartScenarioInPlace(ped, place.scenario, 0, false);
}*/

/*createBlackMarket();

async function createBlackMarket() {
	for (const place of blackMarketInfo.places) {
		const ped = await alt.helpers.ped.createPed(0, place.model, place.position, place.heading);

		blackMarketInfo.peds.push(ped);

		if (ped !== 0) {
			blackMarketPedStreamIn(ped);
		}
	}

	blackMarketInfo.colshape = new alt.Vector3(1195.6638, -3250.7002, 7.0952);
}*/

function getObjectOffsetFromCoords(position, heading, offset) {
	return game.getObjectOffsetFromCoords(position.x, position.y, position.z, heading, offset.x, offset.y, offset.z);
}
