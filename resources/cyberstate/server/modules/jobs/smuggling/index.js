const inLegalController = {
  points: [ new alt.Vector3(0, 0, 0), new alt.Vector3(0, 0, 0) ],
  infoDealer: undefined
}
const vehiclesData = [
	{ position: new alt.Vector3(1465.8673, -1936.9855, 71.0025), heading: 58.727 },
	{ position: new alt.Vector3(880.0251, -2193.5657, 30.3346), heading: 246.5185 },
	{ position: new alt.Vector3(-88.2306, -2220.7869, 7.6273), heading: 76.1280 },
	// { position: new mp.Vector3(-196.9854, -1818.5649, 1.3514), heading: 35.5612 },
	{ position: new alt.Vector3(-346.7971, -1543.4633, 27.5384), heading: 179.2595 },
	{ position: new alt.Vector3(184.1437, -1270.4662, 29.0136), heading: 163.3553 },
	{ position: new alt.Vector3(-230.5522, -1692.0482, 33.6116), heading: 76.2052 },
	{ position: new alt.Vector3(298.0902, -1720.8209, 29.0760), heading: 303.8684 },
	{ position: new alt.Vector3(824.0117, -785.4179, 25.9988), heading: 25.2672 }
];
const cells = [
  new alt.Vector3(-241.79, -765.28, 32.78),
  new alt.Vector3(140.32, -1032.65, 29.35),
  new alt.Vector3(439.46, -605.65, 28.71),
  new alt.Vector3(453.22, -612.16, 28.57),
  new alt.Vector3(174.57, -1116.99, 29.30),
  new alt.Vector3(288.76, -1280.15, 29.50),
  new alt.Vector3(452.43, -1853.08, 27.90),
  new alt.Vector3(1039.79, -2119.58, 32.87),
  new alt.Vector3(779.22, -1755.39, 29.50),
  new alt.Vector3(823.12, -1040.64, 26.74),
  new alt.Vector3(1156.34, -776.44, 57.59),
  new alt.Vector3(1159.91, -374.33, 67.53),
  new alt.Vector3(175.02, -2017.36, 18.23),
  new alt.Vector3(-1046.47, -2516.40, 13.93),
  new alt.Vector3(-1097.67, -2715.71, 0.80),
  new alt.Vector3(-239.26, -978.40, 29.28),
  new alt.Vector3(234.00, -503.55, 38.82),
  new alt.Vector3(-1363.09, -796.64, 19.32),
  new alt.Vector3(-2075.00, -340.40, 13.31),
  new alt.Vector3(-1818.73, 796.73, 138.13),
  new alt.Vector3(-3039.23, 594.32, 7.81),
  new alt.Vector3(-2562.71, 2315.37, 33.21),
  new alt.Vector3(1051.03, 2662.01, 39.54),
  new alt.Vector3(1181.22, 2702.66, 38.16),
  new alt.Vector3(1987.71, 3056.33, 47.21),
  new alt.Vector3(1401.39, 3601.60, 35.16),
  new alt.Vector3(1861.50, 3695.38, 34.27),
  new alt.Vector3(1662.71, 4842.05, 42.04),
  new alt.Vector3(2681.35, 3291.45, 55.40),
  new alt.Vector3(2559.47, 367.15, 108.61),
  new alt.Vector3(1692.67, 6431.47, 32.75),
  new alt.Vector3(-46.01, 6511.41, 108.61),
  new alt.Vector3(-414.74, 6069.85, 31.49),
  new alt.Vector3(-2200.72, 4273.94, 48.42)
]

function inLegalInit(rec) {
  if (inLegalController.infoDealer !== undefined) {
    alt.emitClient(rec, `Blip::informator::delete`, 989898);
    inLegalController.infoDealer.destroy();
    inLegalController.infoDealer = undefined;
  }
  if (getRandomNumber(0, 100) <= 20) {
    const cell = cells[getRandomNumber(0, cells.length)];
    const colshape = new alt.ColshapeSphere(cell.x, cell.y, cell.z, 2);

    colshape.blip = {
      sprite: 66,
      x: cell.x,
      y: cell.y,
      z: cell.z,
      params: {
        name: "Информатор",
        color: 4,
        scale: 0.7,
        shortRange: false
      }
    };
    colshape.menuName = "info_smuggling";
    colshape.isLegal = false;
    inLegalController.infoDealer = colshape;

    if (getRandomNumber(0, 100) <= 5) {
      if (alt.factions.isPoliceFaction(rec.faction) || alt.factions.isFibFaction(rec.faction)) {
        inLegalController.infoDealer.isLegal = true;
        alt.emitClient(rec, `Blip::informator::create`, JSON.stringify(colshape.blip));
        rec.utils.success(`Мы зафиксировали подозрительное вмешательство в работу нашего таксофона. Просим вас прибыть на место для разбирательства.`);
      }
    }
    if (alt.factions.isInLegalFaction(rec.faction)) {
      alt.emitClient(rec, `Blip::informator::create`, JSON.stringify(colshape.blip));
      rec.utils.success(`Йоу, бро! У меня есть для тебя ценная информация. Выслал тебе координаты места встречи на телефон.`);
    }
  }
}
function getRandomNumber(min, max) {
  try {
    return Math.floor(Math.random() * (max - min)) + min;
  } catch (err) {
    alt.log(err);
    return -1;
  }
}

let vehicleIds = [];

for (const vehData of vehiclesData) {
  const colshape = new alt.ColshapeSphere(vehData.position.x + 1.9, vehData.position.y - 1, vehData.position.z - 1, 2);
	const veh = new alt.Vehicle("gburrito", vehData.position.x, vehData.position.y, vehData.position.z, 0, 0, vehData.heading);
  veh.engineOn = false;
  veh.lockState = 2;
	veh.spawnPos = vehData.position;
	veh.isSmuggling = true;
  veh.dimension = 1;
  colshape.menuName = "band_dealer_menu";

	vehicleIds.push({ id: veh.id, position: vehData.position, heading: vehData.heading});
}

alt.onClient("playerBrowserReady", (player) => {
	alt.emitClient(player, "smuggling::createPeds", JSON.stringify(vehicleIds));
});


module.exports = {
  inLegalController,
  inLegalInit
}
