function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

var spawn = 0;

alt.onClient('autoSaloon.openBuyerMenu', (player) => {
    if (!player.colshape || !player.colshape.biz) return player.utils.error(`Вы не у автосалона!`);
    var biz = player.colshape.biz;
    if (biz.bizType != 9) return player.utils.error(`Неверный тип бизнеса!`);
    //if (!biz.status) return player.utils.error(`Бизнес закрыт!`);
    if (player.vehicle) return;
    const dim = player.sqlId + 10;
    player.cancelPos = player.pos;
    player.dimension = dim;
    player.autoSaloon = true;
    var data = { bizId: biz.sqlId, vehicles: alt.autosaloons.vehicles, colorsCFG: alt.autosaloons.colorsCFG, dim: dim };
    alt.emitClient(player, "autoSaloon.openBuyerMenu", data);
});
    
alt.onClient('autoSaloon.buyNewCar', async (player, str) => {
    const d = JSON.parse(str);
    var pos;
    //var biz = alt.bizes.getBySqlId(d.bizId);
    if (player.money < d.price) {
        alt.emit("autoSaloon.cancel", player);
        return player.utils.error(`Необходимо ${d.price}$`);
    }
    var houses = alt.houses.getArrayByOwner(player.sqlId);
    if (d.price >= 30000 && houses.length <= 0) {
        alt.emit("autoSaloon.cancel", player);
        return player.utils.error(`Чтобы приобрести транспорт стоимостью больше 30.000$, требуется приобрести жилье`);
    }
    if (player.cars.length >= player.donateCars) {
        alt.emit("autoSaloon.cancel", player);
        return player.utils.error(`Вы имеете максимальное количество машин`);
    }
    //if (biz.products < 10) {
        //alt.emit("autoSaloon.cancel");
        //return player.utils.error(`У бизнеса недостаточно товара!`);
    //}
    for (var i = 0; i < alt.autosaloons.saloons.length; i++) {
        var a = alt.autosaloons.saloons[i];
        if(a.sqlId == d.bizId) {
            pos = a.newCarCoord[spawn];
            spawn += 1;
            if (a.newCarCoord.length - 1 == spawn) {
                spawn = 0;
            }
            alt.autosaloons.vehicles[d.id - 1].buyed += 1;
            DB.Query("UPDATE configvehicle SET buyed = buyed + 1 WHERE model = ?", [d.model]);
        }
    }
    var freeSlot = player.inventory.findFreeSlot(54);
    if (!freeSlot)  {
        alt.emit("autoSaloon.cancel", player);
        return player.utils.error(`Освободите место для ключей!`);
    }

    const newVehicle = await alt.gameEntityCreate(d.model, new alt.Vector3(pos.x, pos.y, pos.z), new alt.Vector3(0, 0, 0  * Math.PI / 180));

    DB.Query("INSERT INTO vehicles (owner,model,color1,color2,x,y,z,h) VALUES (?,?,?,?,?,?,?,?)",
        [player.sqlId + 2000, d.model, d.color.sqlId-1, 0,
            newVehicle.pos.x, newVehicle.pos.y, newVehicle.pos.z,
            newVehicle.rot.z
    ], (e, result) => {
        if (e) alt.log(e);
        
        newVehicle.lockState = 2;
        newVehicle.engineOn = false;
        newVehicle.primaryColor = d.color.sqlId-1;
        newVehicle.secondaryColor = 0;
        newVehicle.dimension = 1;
        newVehicle.rot = new alt.Vector3(0, 0, pos.rot * Math.PI / 180);

        newVehicle.sqlId = result.insertId;
        newVehicle.utils.setFuel(30);
        newVehicle.maxFuel = 70;
        newVehicle.owner = player.sqlId + 2000;
        newVehicle.name = d.model.toLowerCase();
        newVehicle.spawnPos = newVehicle.pos;
        var params = {
            owner: player.sqlId,
            car: result.insertId,
            model: d.model
        };
        player.inventory.add(54, params, {}, (e) => {
            if (e) {
                alt.emit("autoSaloon.cancel", player);
                newVehicle.destroy();
                return player.utils.error(e);
            }
            player.utils.setMoney(player.money - d.price);
            player.carIds.push(newVehicle.id);
            player.cars.push({ id: newVehicle.id, name: d.model });
            alt.logs.addLog(`${player.getSyncedMeta("name")} купил автомобиль ${d.model} за ${d.price} в автосалоне`, 'car', player.account.id, player.sqlId, { model: d.model, price: d.price });
            player.utils.success(`Вы успешно приобрели "${d.model}" за ${d.price}$`);
            alt.emitClient(player, `playerMenu.cars`, player.cars);
            //biz.setProducts(biz.products - 10);
            //biz.setBalance(biz.balance + price / 1000);
        });
        initVehicleInventory(newVehicle);
    });
});

alt.onClient('autoSaloon.startTestDrive', async (player, str) => {
    try {
        const d = JSON.parse(str);
        let car;
        if (!d.color) d.color.sqlId = 0;
        const dim = player.sqlId + 33;

        if (player.testDrive > Math.floor(Date.now() / 1000)) {
            alt.emit("autoSaloon.cancel", player);
            return player.utils.error(`Подождите некоторое время чтобы снова протестировать машину!`);
        }

        for (var i = 0; i < alt.autosaloons.saloons.length; i++) {
            var a = alt.autosaloons.saloons[i];
            if(a.sqlId == d.bizId) {
                car = a.newCarCoord[getRandom(0, a.newCarCoord.length)];
            }
        }
        
        const vehicle = await alt.gameEntityCreate(d.model, new alt.Vector3(car.x, car.y, car.z), new alt.Vector3(0, 0, 0  * Math.PI / 180));

        vehicle.numberPlateText = "Cyber State";
        vehicle.lockState = 2;
        vehicle.engineOn = false;
        vehicle.primaryColor = d.color.sqlId-1;
        vehicle.secondaryColor = 0;
        vehicle.dimension = dim;
        vehicle.rot = new alt.Vector3(0, 0, car.rot);

        vehicle.name = d.model;
        vehicle.owner = 0;
        vehicle.utils.setFuel(30);
        vehicle.maxFuel = 70;
        vehicle.license = 0;
        
        player.dimension = dim;
        player.pos = new alt.Vector3(car.x, car.y, car.z);
        player.testDriveVeh = vehicle;
        
        alt.emitClient(player, `Vehicle::putInto`, vehicle, -1);
        player.testDrive = Math.floor(Date.now() / 1000) + 3600;
    
        alt.emitClient(player, `autoSaloon.deleteVehicle`);
        alt.emitClient(player, `autoSaloon.testDriveStart`);
    
        DB.Query("UPDATE characters SET testDrive = ? WHERE id = ?", [Math.floor(Date.now() / 1000) + 3600, player.sqlId]);
    } catch(err) {
        console.error(err);
    }
});

alt.onClient('autoSaloon.endTestDrive', (player) => {
    if (player.testDriveVeh) player.testDriveVeh.destroy();
    player.cancelPos.x -= 4;
    player.pos = player.cancelPos;
});

alt.onClient("autoSaloon.exit", (player) => {
    player.autoSaloon = false;
    player.pos = player.cancelPos;
    player.dimension = 1;
});
    
alt.on("autoSaloon.cancel", (player) => {
    player.dimension = 1;
    player.autoSaloon = false;
    player.pos = player.cancelPos;
    alt.emitClient(player, 'autoSaloon.deleteVehicle');
    alt.emitClient(player, "autoSaloon.setStatusMenu", false);
});