import alt from 'alt';
import game from 'natives';

const player = alt.Player.local

alt.on(`Client::init`, (view) => {
    var lastPos, hashDist = 0;
    var vehPropActive = false;

    alt.Vehicle.startMileageCounter = () => {
        //debug(`startMileageCounter`)
        lastPos = player.pos;
        if (alt.Vehicle.mileageTimer !== 0 || alt.Vehicle.mileageUpdater !== 0) stopMileageCounter();
        alt.Vehicle.mileageTimer = alt.setInterval(() => {
            //debug(`mileageTimer tick!`);
            var veh = player.vehicle;
            if (!veh) return stopMileageCounter();

            var dist = (veh.pos.x - lastPos.x) * (veh.pos.x - lastPos.x) + (veh.pos.y - lastPos.y) * (veh.pos.y - lastPos.y) +
                (veh.pos.z - lastPos.z) * (veh.pos.z - lastPos.z);
            dist = Math.sqrt(dist);
            if (dist > 200) dist = 50;
            dist /= 1000;

            hashDist += dist;
            lastPos = veh.pos;

            var mileage = veh.mileage + hashDist;
            //menu.execute(`MileageHandler(${mileage});`);
            view.emit(`speedoMeter`, `MileageHandler`, mileage);
        }, 1000);

        alt.Vehicle.mileageUpdater = alt.setInterval(() => {
            var veh = player.vehicle;
            if (!veh) return stopMileageCounter();
            if (hashDist < 0.1) return;
            alt.emitServer(`addMileage`, hashDist.toFixed(1));
            veh.mileage += hashDist;
            hashDist = 0;
        }, 60000);
    };

    function stopMileageCounter() {
        //debug(`stopMileageCounter`)
        alt.clearInterval(alt.Vehicle.mileageTimer);
        alt.clearInterval(alt.Vehicle.mileageUpdater);
        
        alt.Vehicle.mileageTimer = 0;
        alt.Vehicle.mileageUpdater = 0;

        if (hashDist < 0.1) return;
        alt.emitServer(`addMileage`, hashDist.toFixed(1));
        hashDist = 0;
    };;

    alt.onServer('playerLeaveVehicle', (vehicle, seat) => {
        stopMileageCounter();
    });

    alt.on(`update`, () => {
        if (player.vehicle && game.getVehicleDoorLockStatus(player.vehicle.scriptID) === 2) {
            game.disableControlAction(0, 75, true);
        }
    });

    alt.on('vehicleEngineHandler', () => {
        alt.emit("prompt.hide");
        if (!player.vehicle) return;
        if (game.getPedInVehicleSeat(player.vehicle.scriptID, -1) != player.scriptID) return;
        if (alt.isFlood()) return;

        var engine = player.vehicle.getSyncedMeta("engine");

        if (!engine) {
            var engineBroken = player.vehicle.engineBroken;
            var oilBroken = player.vehicle.oilBroken;
            var accumulatorBroken = player.vehicle.accumulatorBroken;
            if (player.vehicle.fuel <= 0) return alt.emit(`nError`, "Нет топлива!");
            if (engineBroken) return alt.emit(`nError`, "Двигатель поломан!");
            if (oilBroken) return alt.emit(`nError`, "Залейте масло!");
            if (accumulatorBroken) return alt.emit(`nError`, "Аккумулятор поломан!");
        }

        alt.emitServer(`vehicle.engine.on`);
    });

    alt.on("syncedMetaChange", (entity, key, value) => {
        if (key === "leftSignal") {
            var left = value;
            game.setVehicleIndicatorLights(entity.scriptID, 1, left);
            
            if (player.vehicle && entity.id == player.vehicle.id) {
                var right = entity.getSyncedMeta("rightSignal");
                var engine = entity.getSyncedMeta("engine");
                if (engine) {
                    if (!left || !right) {
                    } else {
                    }
                } else {
                }
            }
        } else if (key === "rightSignal") {
            var right = value;
            game.setVehicleIndicatorLights(entity.scriptID, 0, right);
    
            if (player.vehicle && entity.id == player.vehicle.id) {
                var left = player.vehicle.getSyncedMeta("leftSignal");
                var engine = entity.getSyncedMeta("engine");
                if (engine) {
                    if (!left || !right) {
                    } else {
                    }
                } else {
                }
            }
        } else if (key === "hood") {
            var hood = value;
            if (hood) game.setVehicleDoorOpen(entity.scriptID, 4, false, false, false);
            else game.setVehicleDoorShut(entity.scriptID, 4, false);
        } else if (key === "boot") {
            var boot = value;
            if (boot) game.setVehicleDoorOpen(entity.scriptID, 5, false, false, false);
            else game.setVehicleDoorShut(entity.scriptID, 5, false);
        } else if (key === "engine") {
            var vehClass = game.getVehicleClass(entity.scriptID);
            if (vehClass != 14 && vehClass != 16 && entity.model != 0x2189D250 && game.isEntityInWater(entity.scriptID)) return;
            var engine = value;
            game.setVehicleEngineOn(entity.scriptID, engine, true, true);

            if (player.vehicle && player.vehicle.id == entity.id) {
                var left = entity.getSyncedMeta("leftSignal");
                var right = entity.getSyncedMeta("rightSignal");
                var engine = value;
                if (engine) {
                    if (!left || !right) {
                        view.emit(`speedoMeter`, `engineStatus`, true);
                    } else {
                    }
                } else {
                    view.emit(`speedoMeter`, `engineStatus`, false);
                }
            }
        } else if (key === "engineBroken") {
            if (game.getPedInVehicleSeat(entity.scriptID, -1) != player.scriptID) return;
            view.emit(`speedoMeter`, `engineStatus`, engineBroken);
        } else if (key === "oilBroken") {
            if (game.getPedInVehicleSeat(entity.scriptID, -1) != player.scriptID) return;
        } else if (key === "accumulatorBroken") {
            if (game.getPedInVehicleSeat(entity.scriptID, -1) != player.scriptID) return;
        } else if (key === "sirenSound") {
            var sirenSound = value;
            game.setVehicleSiren(entity.scriptID, sirenSound);
        }
    });

    alt.on('gameEntityCreate', (entity) => {
        if (entity instanceof alt.Vehicle) {
            var engine = entity.getSyncedMeta("engine") || false;
            var leftSignal = entity.getSyncedMeta("leftSignal") || false;
            var rightSignal = entity.getSyncedMeta("rightSignal") || false;
            var sirenSound = entity.getSyncedMeta("sirenSound") || false;
            var hood = entity.getSyncedMeta("hood") || false;
            var boot = entity.getSyncedMeta("boot") || false;

            game.setVehicleEngineOn(entity.scriptID, engine, true, true);

            game.setVehicleIndicatorLights(entity.scriptID, 1, leftSignal);
            game.setVehicleIndicatorLights(entity.scriptID, 0, rightSignal);

            game.setVehicleSiren(entity.scriptID, sirenSound);

            if (hood) game.setVehicleDoorOpen(entity.scriptID, 4, false, false, false);
            else game.setVehicleDoorShut(entity.scriptID, 4, false);

            if (boot) game.setVehicleDoorOpen(entity.scriptID, 5, false, false, false);
            else game.setVehicleDoorShut(entity.scriptID, 5, false);
        }
    });

    var data = {
        lastLocked: false,
        lastLights: 0
    };

    alt.on("update", () => {
        if (player.vehicle && game.getPedInVehicleSeat(player.vehicle.scriptID, -1) == player.scriptID) {
            var veh = player.vehicle;
            var vehClass = game.getVehicleClass(veh.scriptID);
            var engine = veh.getSyncedMeta("engine");

            if (vehClass != 14 && vehClass != 16 && veh.model != 0x2189D250 && game.isEntityInWater(veh.scriptID)) {
                let velocity = game.getEntityVelocity(veh.scriptID);
                velocity = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y) * 3;
                if (!velocity) velocity = 0;
                view.emit(`speedoMeter`, `engineStatus`, false);
                view.emit(`speedoMeter`, `VehPropHandler`, { velocity: velocity, fuel: 0, rpm: 0, gear: veh.gear });
                return game.setVehicleEngineOn(veh.scriptID, false, true, true);
            }

            if (!vehPropActive) {
                //menu.execute(`$('#vehProp').fadeIn(0)`);
                vehPropActive = true;

                var left = veh.getSyncedMeta("leftSignal");
                var right = veh.getSyncedMeta("rightSignal");

                if (vehClass == 14 || vehClass == 16 || vehClass == 21) return;

                if (engine) {
                    if (!left || !right) {
                        view.emit(`speedoMeter`, `engineStatus`, true);
                    } else {
                    }
                } else {
                    view.emit(`speedoMeter`, `engineStatus`, false);
                }

                view.emit(`speedoMeter`, `engineStatus`, true);
            }

            var lights = game.getVehicleLightsState(player.vehicle.scriptID, 1, 1);
            var locked = game.getVehicleDoorLockStatus(player.vehicle.scriptID);

            let velocity = game.getEntityVelocity(veh.scriptID);
            velocity = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y) * 3;
            if (!velocity) velocity = 0;
            let fuel = veh.fuel;
            if (!fuel) fuel = 0;
            else if (fuel <= 0 && engine) {
                alt.emitServer(`vehicleEngineOn`);
            }

            locked = (locked == 1) ? true : false;
            if (data.lastLocked != locked) {
                data.lastLocked = locked;
            }

            if (engine) {
                if (veh.engineBroken || veh.oilBroken || veh.accumulatorBroken) alt.emitServer(`vehicle.engine.on`);

                var lightsType = 0;
                var a = lights.lightsOn;
                var b = lights.highbeamsOn;
                if (a == 0 && b == 1) lightsType = 1;
                if (a == 1 && b == 0) lightsType = 2;
                if (a == 1 && b == 1) lightsType = 3;
                if (data.lastLights != lightsType) {
                    data.lastLights = lightsType;
                }
            } else if (data.lastLights != 0) {
                data.lastLights = 0;
            }
            if (!game.getIsVehicleEngineRunning(player.vehicle.scriptID)) {
                view.emit(`speedoMeter`, `VehPropHandler`, { velocity: velocity, fuel: 0, rpm: 0, gear: veh.gear });
            } else {
                view.emit(`speedoMeter`, `engineStatus`, true);
                view.emit(`speedoMeter`, `VehPropHandler`, { velocity: velocity, fuel: fuel, rpm: veh.rpm, gear: veh.gear });
            }
        } else if (vehPropActive) {
            view.emit(`speedoMeter`, `MileageHandler`, 0);
            view.emit(`speedoMeter`, `engineStatus`, false);
            player.belt = false;
            vehPropActive = false;
            data.lastLocked = true;
            data.lastLights = 0;
        }

        //синхронизация двигателя
        if (player.vehicle && alt.Vehicle.exists(player.vehicle)) {
            var engine = player.vehicle.getSyncedMeta('engine');
            game.setVehicleEngineOn(player.vehicle.scriptID, engine, true, true);
        }
    });
});
