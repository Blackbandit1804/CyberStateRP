module.exports = {
    Init: () => {
        loadVehiclesFromDB();
    }
}

function loadVehiclesFromDB() {
    try {
        DB.Query("SELECT * FROM vehicles WHERE owner < ?", [1000], async (e, result) => {
            for (var i = 0; i < result.length; i++) {
                var v = result[i];
                if (!v.x && !v.y) continue;
                var pos = new alt.Vector3(v.x, v.y, v.z);
                pos.h = v.h;
                const vehicle = await alt.gameEntityCreate(v.model, new alt.Vector3(pos.x, pos.y, pos.z), new alt.Vector3(0, 0, pos.h * Math.PI / 180));
                vehicle.numberPlateText = "Cyber State";
                vehicle.dimension = 1;
                vehicle.lockState = 1;
                vehicle.engineOn = false;
                vehicle.spawnPos = pos;
                vehicle.name = v.model.toLowerCase();
                vehicle.sqlId = v.id;
                vehicle.primaryColor = v.color1;
                vehicle.secondaryColor = v.color2;
                vehicle.vehPropData.engineBroken = v.engineBroken;
                vehicle.vehPropData.oilBroken = v.oilBroken;
                vehicle.vehPropData.accumulatorBroken = v.accumulatorBroken;
                vehicle.vehPropData.fuel = v.fuel;
                vehicle.vehPropData.maxFuel = v.maxFuel;
                vehicle.vehPropData.consumption = v.consumption;
                vehicle.vehPropData.mileage = v.mileage;
                vehicle.bodyHealth = v.health;
                vehicle.license = v.license;
                vehicle.owner = v.owner;
                vehicle.dbData = JSON.parse(v.data);

                initVehicleInventory(vehicle);
                initAddictiveVehicleParams(vehicle);
                initJobVehicleFuel(vehicle);
            }
            alt.log(`Авто загружены: ${i} шт.`);
        });
    } catch(err) {
        console.error(err);
    }
}

function initAddictiveVehicleParams(vehicle) {
    if (alt.isFarmVehicle(vehicle)) {
        vehicle.products = {
            type: 0,
            count: 0,
            maxCount: 600,
        };
    }
}

function initJobVehicleFuel(vehicle) {
    if (alt.isJobVehicle(vehicle) && vehicle.vehPropData.fuel < alt.economy["jobveh_count_fuel"].value) {
        vehicle.utils.setFuel(alt.economy["jobveh_count_fuel"].value);
    }
}
