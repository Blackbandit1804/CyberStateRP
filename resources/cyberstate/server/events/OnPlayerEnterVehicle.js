alt.on(`playerChangedVehicleSeat`, (player, vehicle, oldseat, newseat) => {
    clearVehSpawnTimer(vehicle);
    alt.emitClient(player, `playerEnteredVehicle`, vehicle, newseat);
    if (newseat == 1) { // водительское место
        if (!haveLicense(player, vehicle)) {
            alt.emitClient(player, `Vehicle::leave`, vehicle);
            return player.utils.error(`Вам необходима ${alt.getLicName(vehicle.license)}!`);
        }
        if (alt.isFactionVehicle(vehicle)) {
            if (player.faction != vehicle.owner) {
                alt.emitClient(player, `Vehicle::leave`, vehicle);
                return player.utils.error(`Вы не состоите в ${alt.factions.getBySqlId(vehicle.owner).name}`);
            } else if (vehicle.dbData && player.rank && vehicle.dbData.rank > player.rank) {
                alt.emitClient(player, `Vehicle::leave`, vehicle);
                return player.utils.error(`Необходим ранг: ${alt.factions.getRankName(player.faction, vehicle.dbData.rank)}`);
            }
        } else if (alt.isJobVehicle(vehicle)) {
            if (player.job != -vehicle.owner) {
                alt.emitClient(player, `Vehicle::leave`, vehicle);
                var job = alt.jobs.getBySqlId(-vehicle.owner);
                if (!job) return player.utils.error(`Работа с ID: ${-vehicle.owner} не найдена!`);
                return player.utils.error(`Вы не ${job.name}`);
            }
        } else if (alt.isFarmVehicle(vehicle)) {
            if (!player.farmJob) {
                alt.emitClient(player, `Vehicle::leave`, vehicle);
                return player.utils.error(`Вы не работаете на ферме!`);
            }
            if (player.farmJob.farm.sqlId != -vehicle.owner - 3000) {
                alt.emitClient(player, `Vehicle::leave`, vehicle);
                return player.utils.error(`Вы работаете на другой ферме!`);
            }
            var jobType = alt.farms.getJobTypeByModel(vehicle.name);
            var jobName = alt.farms.getJobName(jobType);
            if (jobType != player.farmJob.type) {
                alt.emitClient(player, `Vehicle::leave`, vehicle);
                return player.utils.error(`Необходимо иметь должность на ферме: ${jobName}`);
            }
            if (jobType == 1) { // фермер
                alt.emitClient(player, `selectMenu.show`, `farm_crop_loading`);
            } else if (jobType == 2) { // тракторист
                if (!vehicle.products.count) player.utils.success(`Загрузить зерно возможно у склада`);
                player.utils.success(`Зерно: ${vehicle.products.count} / ${vehicle.products.maxCount} ед.`);
            }
        }
        if (!vehicle.getSyncedMeta("engine")) alt.emitClient(player, "prompt.showByName", "vehicle_engine");
        for (var key in vehicle.vehPropData) {
            alt.emitClient(player, "setVehicleVar", vehicle, key, vehicle.vehPropData[key]);
        }
        checkPlayerGangwar(player, vehicle, newseat);
        vehicle.player = player;
    }
});

alt.on("playerEnteredVehicle", (player, vehicle, seat) => {
    clearVehSpawnTimer(vehicle);
    alt.emitClient(player, `playerEnteredVehicle`, vehicle, seat);
    if (seat == 1) { // водительское место
        if (!haveLicense(player, vehicle)) {
            alt.emitClient(player, `Vehicle::leave`, vehicle);
            return player.utils.error(`Вам необходима ${alt.getLicName(vehicle.license)}!`);
        }
        if (alt.isFactionVehicle(vehicle)) {
            if (player.faction != vehicle.owner) {
                alt.emitClient(player, `Vehicle::leave`, vehicle);
                return player.utils.error(`Вы не состоите в ${alt.factions.getBySqlId(vehicle.owner).name}`);
            } else if (vehicle.dbData && player.rank && vehicle.dbData.rank > player.rank) {
                alt.emitClient(player, `Vehicle::leave`, vehicle);
                return player.utils.error(`Необходим ранг: ${alt.factions.getRankName(player.faction, vehicle.dbData.rank)}`);
            }
        } else if (alt.isJobVehicle(vehicle)) {
            if (player.job != -vehicle.owner) {
                alt.emitClient(player, `Vehicle::leave`, vehicle);
                var job = alt.jobs.getBySqlId(-vehicle.owner);
                if (!job) return player.utils.error(`Работа с ID: ${-vehicle.owner} не найдена!`);
                return player.utils.error(`Вы не ${job.name}`);
            }
        } else if (alt.isFarmVehicle(vehicle)) {
            if (!player.farmJob) {
                alt.emitClient(player, `Vehicle::leave`, vehicle);
                return player.utils.error(`Вы не работаете на ферме!`);
            }
            if (player.farmJob.farm.sqlId != -vehicle.owner - 3000) {
                alt.emitClient(player, `Vehicle::leave`, vehicle);
                return player.utils.error(`Вы работаете на другой ферме!`);
            }
            var jobType = alt.farms.getJobTypeByModel(vehicle.name);
            var jobName = alt.farms.getJobName(jobType);
            if (jobType != player.farmJob.type) {
                alt.emitClient(player, `Vehicle::leave`, vehicle);
                return player.utils.error(`Необходимо иметь должность на ферме: ${jobName}`);
            }
            if (jobType == 1) { // фермер
                alt.emitClient(player, `selectMenu.show`, `farm_crop_loading`);
            } else if (jobType == 2) { // тракторист
                if (!vehicle.products.count) player.utils.success(`Загрузить зерно возможно у склада`);
                player.utils.success(`Зерно: ${vehicle.products.count} / ${vehicle.products.maxCount} ед.`);
            }
        }
        if (!vehicle.getSyncedMeta("engine")) alt.emitClient(player, "prompt.showByName", "vehicle_engine");
        for (var key in vehicle.vehPropData) {
            alt.emitClient(player, "setVehicleVar", vehicle, key, vehicle.vehPropData[key]);
        }
        checkPlayerGangwar(player, vehicle, seat);
        vehicle.player = player;
    }
});

function haveLicense(player, vehicle) {
    if (!vehicle.license) return true;
    var docs = player.inventory.getArrayByItemId(16);
    for (var key in docs) {
        if (!docs[key].params || !docs[key].params.licenses) return false;
        if (docs[key].params.licenses.indexOf(vehicle.license) != -1) return true;
    }
    return false;
}

alt.checkLic = (player, lic) => {
    var docs = player.inventory.getArrayByItemId(16);
    for (var key in docs) {
        if (!docs[key].params || !docs[key].params.licenses) return false;
        if (docs[key].params.licenses.indexOf(lic) != -1) return true;
    }
    return false;
}

alt.isFactionVehicle = (vehicle) => {
    return vehicle.owner > 0 && vehicle.owner < 101;
}

alt.isJobVehicle = (vehicle) => {
    return vehicle.owner > -101 && vehicle.owner < 0;
}

alt.isOwnerVehicle = (vehicle) => {
    return vehicle.owner > 1000;
}

alt.isNewbieVehicle = (vehicle) => {
    return vehicle.owner == -1001;
}

alt.isLicVehicle = (vehicle) => {
    return vehicle.owner == -2001;
}

alt.isFarmVehicle = (vehicle) => {
    return vehicle.owner >= -4000 && vehicle.owner <= -3001;
}

function clearVehSpawnTimer(vehicle) {
    if (vehicle.spawnTimerId) {
        clearSaveInterval(vehicle.spawnTimerId);
        delete vehicle.spawnTimerId;
    }
}

function checkPlayerGangwar(player, vehicle, seat) {
    var gangwar = player.getSyncedMeta("gangwar");
    if (gangwar && seat == 1) vehicle.setSyncedMeta("gangwar", gangwar);
}
