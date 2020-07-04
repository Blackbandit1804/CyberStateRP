const beds = require("./beds");

const patientInfo = new Map();

alt.onClient("playerBrowserReady", (player) => {
	const data = {};

	for (const info of patientInfo) {
		const value = info[1];

		if (!value.inBed) {
			continue;
		}
		

		data[info[0]] = { position: value.position, heading: value.heading };
	}

	alt.emitClient(player, "hospital::loadPatients", JSON.stringify(data));
});

alt.onClient("hospital::standUp", (player) => {
	if (!patientInfo.has(player.sqlId)) {
		return;
	}

	player.setSyncedMeta("walking", "move_m@injured");

	const info = patientInfo.get(player.sqlId);

	info.bed.isEmpty = true;
	info.inBed = false;

	alt.emitClient(null, "hospital::removePatient", player.sqlId, true);
});

alt.onClient("hospital::endHospital", (player) => {
	if (!patientInfo.has(player.sqlId)) {
		return;
	}

	const info = patientInfo.get(player.sqlId);

	player.setSyncedMeta("walking", info.walking);

	if (info.inBed) {
		info.bed.isEmpty = true;
		alt.emitClient(null, "hospital::removePatient", player.sqlId, true);
	}

	patientInfo.delete(player.sqlId);
});

function spawnAtHospital(player, phase = 1, health = 120) {
	if (patientInfo.has(player.sqlId)) {
		const info = patientInfo.get(player.sqlId);

		if (info.bed) { 
			info.bed.isEmpty = true; 
		}

		patientInfo.delete(player.sqlId);
	}

	player.dimension = 1;

	if (phase === 1) {
		const bed = getEmptyBed();

		let position = new alt.Vector3(355.13, -1404.67, 32.43);
		let heading = 0;

		if (bed) {
			bed.isEmpty = false;
			position = new alt.Vector3(bed.x, bed.y, bed.z + 1.4);
			heading = bed.heading - 40;

			patientInfo.set(player.sqlId, {
				walking: player.getSyncedMeta("walking"),
				bed,
				position,
				heading,
				inBed: true
			});
		}

		player.spawn(position.x, position.y, position.z);
		player.rot = new alt.Vector3(0, 0, heading);
		player.health = health;

		alt.emitClient(player, "hospital::start", player.sqlId, JSON.stringify({ position, heading }));
	} else if (phase === 2) {
		patientInfo.set(player.sqlId, {
			walking: player.getSyncedMeta("walking"),
			inBed: false
		});
		
		player.setSyncedMeta("walking", "move_m@injured");
		alt.emitClient(player, "hospital::enableRegeneration");
	}
}


function getEmptyBed() {
	for (const floorBeds of beds) {
		const emptyBeds = floorBeds.filter((bed) => bed.isEmpty);

		if (emptyBeds.length === 0) {
			continue;
		}

		return emptyBeds[Math.floor(Math.random()*emptyBeds.length)]; // Random empty bed
	}

	return undefined;
}



module.exports = {
	spawnAtHospital,
	isPlayerInHospital: (player) => patientInfo.has(player.sqlId),
	getHospitalPhase: (player) => {
		if (!patientInfo.has(player.sqlId)) {
			return 0;
		}

		const info = patientInfo.get(player.sqlId);

		return info.inBed ? 1 : 2;
	},
	removeHospitalPatient: (player) => {
		if (!patientInfo.has(player.sqlId)) {
			return;
		}
	
		const info = patientInfo.get(player.sqlId);
	
		if (info.bed) {
			info.bed.isEmpty = true;
		}
	
		patientInfo.delete(player.sqlId);
	
		alt.emitClient(null, "hospital::removePatient", player.sqlId);
	}
}
