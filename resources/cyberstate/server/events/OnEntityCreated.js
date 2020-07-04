alt.gameEntityCreate = (model, pos, rot) => {
    const entity = new alt.Vehicle(model, pos.x, pos.y, pos.z, rot.x, rot.y, rot.z);

    entity.setSyncedMeta("engine", false);
    entity.setSyncedMeta("leftSignal", false);
    entity.setSyncedMeta("rightSignal", false);
    entity.setSyncedMeta("hood", false);
    entity.setSyncedMeta("boot", false);

    entity.vehPropData = {
        engineBroken: false,
        oilBroken: false,
        accumulatorBroken: false,
        fuel: 5,
        maxFuel: 70,
        consumption: 1,
        mileage: 0
    };

    entity.utils = {
        setFuel: (fuel) => {
            //debug(`setFuel: ${fuel}`)
            fuel = parseFloat(fuel);
            fuel = Math.clamp(fuel, 0, entity.vehPropData.maxFuel);
            entity.vehPropData.fuel = fuel;
            if (entity.sqlId)
                DB.Query(`UPDATE vehicles SET fuel=? WHERE id=?`, [fuel, entity.sqlId]);

            if (entity.player) {
                alt.emitClient(entity.player, "setVehicleVar", entity, "fuel", fuel);
            }

            if (fuel <= 0) {
                if (entity.player) {
                    entity.player.utils.error(`Заправьте автомобиль!`);
                }
                entity.setSyncedMeta("engine", false);
            }
        },
        addMileage: (add) => {
            add = parseFloat(add);
            if (add < 0.1) return;
            entity.vehPropData.mileage += add;
            if (entity.sqlId)
                DB.Query(`UPDATE vehicles SET mileage=? WHERE id=?`, [entity.vehPropData.mileage, entity.sqlId]);
        },
        setEngineBroken: (enable) => {
            entity.vehPropData.engineBroken = enable;
            if (enable) {
                if (entity.player) {
                    entity.player.utils.error(`Двигатель поломан!`);
                    alt.emitClient(entity.player, "prompt.showByName", "vehicle_repair");

                }
                if (entity.getSyncedMeta("engine")) entity.utils.engineOn();
            }
            if (entity.player) alt.emitClient(entity.player, "setVehicleVar", entity, "engineBroken", enable);
            if (entity.sqlId) {
                enable = (enable) ? 1 : 0;
                DB.Query(`UPDATE vehicles SET engineBroken=? WHERE id=?`, [enable, entity.sqlId]);
            }
        },
        setOilBroken: (enable) => {
            entity.vehPropData.oilBroken = enable;
            if (enable) {
                if (entity.player) {
                    entity.player.utils.error(`Моторное масло потеряло свои свойства!`);
                    alt.emitClient(entity.player, "prompt.showByName", "vehicle_repair");
                }
                if (entity.getSyncedMeta("engine")) entity.utils.engineOn();
            }
            if (entity.player) alt.emitClient(entity.player, "setVehicleVar", entity, "oilBroken", enable);
            if (entity.sqlId) {
                enable = (enable) ? 1 : 0;
                DB.Query(`UPDATE vehicles SET oilBroken=? WHERE id=?`, [enable, entity.sqlId]);
            }
        },
        setAccumulatorBroken: (enable) => {
            entity.vehPropData.accumulatorBroken = enable;
            if (enable) {
                if (entity.player) {
                    entity.player.utils.error(`Аккумулятор поломан!`);
                    alt.emitClient(entity.player, "prompt.showByName", "vehicle_repair");
                }
                if (entity.getSyncedMeta("engine")) entity.utils.engineOn();
            }
            if (entity.player) alt.emitClient(entity.player, "setVehicleVar", entity, "accumulatorBroken", enable);
            if (entity.sqlId) {
                enable = (enable) ? 1 : 0;
                DB.Query(`UPDATE vehicles SET accumulatorBroken=? WHERE id=?`, [enable, entity.sqlId]);
            }
        },
        engineOn: () => {
            var vehBroken = (entity.vehPropData.engineBroken || entity.vehPropData.oilBroken || entity.vehPropData.accumulatorBroken);
            var engine = entity.getSyncedMeta("engine");
            if (vehBroken) engine = true;
            entity.setSyncedMeta("engine", !engine);
            if (entity.fuelTimerId) clearSaveInterval(entity.fuelTimerId);
            if (engine) {
                delete entity.fuelTimerId;
            } else {
                var consumption = entity.consumption;
                if (!consumption) consumption = 1;

                var vehId = entity.id;
                entity.fuelTimerId = setSaveInterval(() => {
                    try {
                        var veh = alt.Vehicle.at(vehId);
                        if (!veh) return clearSaveInterval(entity.fuelTimerId);

                        var engine = veh.getSyncedMeta("engine");
                        if (!engine) return clearSaveInterval(entity.fuelTimerId);
                        var possibilities = [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE];
                        var engineBroken = alt.randomInteger(0, possibilities[0]);
                        var oilBroken = alt.randomInteger(0, possibilities[1]);
                        var accumulatorBroken = alt.randomInteger(0, possibilities[2]);
                        if (engineBroken == 0) veh.utils.setEngineBroken(true);
                        if (oilBroken == 0) veh.utils.setOilBroken(true);
                        if (accumulatorBroken == 0) veh.utils.setAccumulatorBroken(true);

                        veh.utils.setFuel(veh.vehPropData.fuel - 1);
                        if (veh.vehPropData.fuel <= 0) clearSaveInterval(entity.fuelTimerId);
                    } catch (err) {
                        terminal.error(err);
                    }
                }, 60000 / consumption);
            }
        },
        setSpawnPos: (pos) => {
            entity.spawnPos = pos;
            if (entity.sqlId) DB.Query(`UPDATE vehicles SET x=?,y=?,z=?,h=? WHERE id=?`, [pos.x, pos.y, pos.z, pos.rot.z, entity.sqlId]);
        },
        setLicense: (license) => {
            var types = [1, 2, 3, 4, 11, 12];
            if (license && types.indexOf(license) == -1) return;
            entity.license = parseInt(license);
            if (entity.sqlId) DB.Query(`UPDATE vehicles SET license=? WHERE id=?`,
                [entity.license, entity.sqlId]);
        },
        setOwner: (owner) => {
            entity.owner = owner;
            DB.Query("UPDATE vehicles SET owner=? WHERE id=?", [owner, entity.sqlId]);
        },
        setSpawnTimer: (ms) => {
            var vehicleId = entity.id;
            if (entity.spawnTimerId) clearSaveInterval(entity.spawnTimerId);
            entity.spawnTimerId = setSaveTimeout(() => {
                try {
                    let vehicle = alt.Vehicle.at(vehicleId);
                    if (!vehicle) {
                        clearSaveInterval(entity.spawnTimerId);
                        return 0;
                    }
                    var havePlayers = 0;
                    alt.Player.all.forEach((rec) => { if (rec.vehicle && rec.vehicle == vehicle) havePlayers += 1; });
                    if (!havePlayers) {
                        if (!vehicle.sqlId) return vehicle.destroy();
                        if (alt.isOwnerVehicle(vehicle)) {
                            clearSaveInterval(entity.spawnTimerId);
                            delete vehicle.spawnTimerId;
                            return 0;
                        }

                        if (vehicle.spawnPos) {
                            let pos = vehicle.spawnPos;
                            var dist = (vehicle.pos["x"] - pos["x"]) * (vehicle.pos["x"] - pos["x"]) + (vehicle.pos["y"] - pos["y"]) * (vehicle.pos["y"] - pos["y"]) +
                                (vehicle.pos["z"] - pos["z"]) * (vehicle.pos["z"] - pos["z"]);

                            if (dist < 10) return;
                            alt.emitClient(null, `Vehicle::repair`, vehicle);
                            vehicle.pos = pos;
                            vehicle.rot = new alt.Vector3(0, 0, pos.h * Math.PI / 180);
                            vehicle.engineOn = false;
                            if (vehicle.vehPropData.fuel < 10) vehicle.vehPropData.fuel = 10;
                        }
                    }
                } catch (err) {
                    alt.log(err);
                }
            }, ms);
        },
        spawn: () => {
            //todo не спавнить тачки, в которые загружают продукты
            var players = 0;
            alt.Player.all.forEach((rec) => { if (rec.vehicle && rec.vehicle == entity) players += 1; });
            if (players == 0) {
                if (entity.spawnPos) {
                    let pos = entity.spawnPos;
                    var dist = (entity.pos["x"] - pos["x"]) * (entity.pos["x"] - pos["x"]) + (entity.pos["y"] - pos["y"]) * (entity.pos["y"] - pos["y"]) +
                        (entity.pos["z"] - pos["z"]) * (entity.pos["z"] - pos["z"]);

                    if (dist >= 10) {
                        alt.emitClient(null, `Vehicle::repair`, entity);
                        entity.utils.setFuel(30);
                        entity.maxFuel = 70;
                        entity.pos = pos;
                        entity.rot = new alt.Vector3(0, 0, pos.h * Math.PI / 180);
                        entity.setSyncedMeta("leftSignal", false);
                        entity.setSyncedMeta("rightSignal", false);
                        if (entity.getSyncedMeta("engine"))
                            entity.utils.engineOn();
                        return 0; // spawned
                    }
                } else {
                    entity.destroy();
                    return 2; // destroyed
                }
            }
            return 1; // not spawned
        },
    };


    return entity;
};