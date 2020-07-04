module.exports = {
    Init: () => {
        loadFarmsFromDB();
        loadFarmFieldsFromDB();
    }
}

var cropNames = ["-", "Тыква", "Капуста", "Травка"];

function loadFarmsFromDB() {
    alt.farms = [];
    DB.Query("SELECT * FROM farms", (e, result) => {
        for (var i = 0; i < result.length; i++) {
            var pos = new alt.Vector3(result[i].x, result[i].y, result[i].z);
            var marker = alt.helpers.marker.new(1, pos, 1, {
                color: [0, 187, 255, 100],
                visible: false
            });
            marker.sqlId = result[i]["id"];
            marker.owner = result[i]["owner"];
            marker.grains = result[i]["grains"];
            marker.pumpkins = result[i]["pumpkins"];
            marker.cabbages = result[i]["cabbages"];
            marker.weeds = result[i]["weeds"];
            marker.pumpkinPrice = result[i]["pumpkinPrice"];
            marker.cabbagePrice = result[i]["cabbagePrice"];
            marker.weedPrice = result[i]["weedPrice"];
            marker.grainPrice = result[i]["grainPrice"];
            marker.price = result[i]["price"];
            marker.balance = result[i]["balance"];
            marker.taxBalance = result[i]["taxBalance"];
            marker.pay = result[i]["pay"];

            var colshape = alt.colshapes.newCircle(pos["x"], pos["y"], 60);
            colshape.marker = marker;
            marker.showColshape = colshape;

            //дл¤ отловки событи¤ входа в маркер
            var colshape = new alt.ColshapeSphere(pos["x"], pos["y"], pos["z"] + 1, 1); //+1 to fix bug
            colshape.farm = marker;
            marker.colshape = colshape;
            colshape.menuName = `enter_farm`;

            var blip = alt.helpers.blip.new(88, pos, {
                color: 60,
                name: `Ферма №${result[i]["id"]}`,
                shortRange: 10,
                scale: 0.7
            });
            marker.blip = blip;

            initFarmLabels(marker);
            initFarmWarehouse(marker);
            initFarmUtils(marker);
            alt.farms.push(marker);
        }

        alt.log(`Фермы загружены: ${i} шт.`);
    });
    initFarmsUtils();
}

function initFarmsUtils() {
    alt.farms.getBySqlId = (sqlId) => {
        if (!sqlId) return null;
        var result;
        alt.farms.forEach((farm) => {
            if (farm.sqlId == sqlId) {
                result = farm;
                return;
            }
        });
        return result;
    };
    alt.farms.getJobTypeByModel = (model) => {
        var types = {
            "bodhi2": 1,
            "rebel": 1,
            "tractor2": 2,
            "duster": 3,
        };
        if (!types[model]) return -1;
        return types[model];
    };
    alt.farms.getJobName = (jobType) => {
        var names = ["Рабочий", "Фермер", "Тракторист", "Пилот"];
        jobType = Math.clamp(jobType, 0, names.length - 1);
        return names[jobType];
    };
    alt.farms.getNearTractor = (pos, range) => {
        var nearVehicle;
        var minDist = 99999;
        alt.Vehicle.all.forEach((veh) => {
            if (alt.Vehicle.dist(veh.pos, pos) <= range) {
                if (!alt.isFarmVehicle(veh) || alt.farms.getJobTypeByModel(veh.name) != 2) return;
                var distance = alt.Vehicle.dist(veh.pos, pos);
                if (distance < minDist) {
                    nearVehicle = veh;
                    minDist = distance;
                }
            }
        });
        return nearVehicle;
    }
    alt.farms.getNearPickup = (pos, range) => {
        var nearVehicle;
        var minDist = 99999;
        alt.Vehicle.all.forEach((veh) => {
            if (alt.Vehicle.dist(veh.pos, pos) <= range) {
                if (!alt.isFarmVehicle(veh) || alt.farms.getJobTypeByModel(veh.name) != 1) return;
                var distance = alt.Vehicle.dist(veh.pos, pos);
                if (distance < minDist) {
                    nearVehicle = veh;
                    minDist = distance;
                }
            }
        });
        return nearVehicle;
    }
}

function initFarmFieldsUtils() {
    alt.farmFields.getBySqlId = (sqlId) => {
        for (var i = 0; i < alt.farmFields.length; i++) {
            var field = alt.farmFields[i];
            if (field.sqlId == sqlId) return field;
        }
        return null;
    };
}

function loadFarmFieldsFromDB() {
    alt.farmFields = [];
    DB.Query("SELECT * FROM farms_fields", (e, result) => {
        for (var i = 0; i < result.length; i++) {
            result[i].p1 = JSON.parse(result[i].p1);
            result[i].p2 = JSON.parse(result[i].p2);
            result[i].p3 = JSON.parse(result[i].p3);
            result[i].p4 = JSON.parse(result[i].p4);
            result[i].labelPos = JSON.parse(result[i].labelPos);
            result[i].sqlId = result[i].id;
            result[i].cropType = result[i].type;
            result[i].state = 3;
            delete result[i].id;
            delete result[i].type;

            /*result[i].label = alt.labels.new(`~y~Ферма ~w~№${result[i].sqlId}\n ~b~Pay: ~w~${data[i].pay}$`, new alt.Vector3(pos.x, pos.y, pos.z + 2), {
                los: true,
                font: 4,
                drawDistance: 30,
                color: [0, 187, 255, 255],
            });*/

            initFarmFieldUtils(result[i]);
            initFarmFieldObjects(result[i]);
            initFarmFieldLabels(result[i]);
            alt.farmFields.push(result[i]);
        }
        alt.log(`Поля фермы загружены: ${i} шт.`);
    });
    initFarmFieldsUtils();
}

function getWarehousePosByFarmId(farmId) {
    var positions = [
        [
            new alt.Vector3(1981.6806640625, 5029.39892578125, 42.03016662597656),
            new alt.Vector3(1985.9840087890625, 5023.95458984375, 42.088829040527344),
            new alt.Vector3(1991.2686767578125, 5018.3994140625, 42.13268280029297),
            new alt.Vector3(1982.4197998046875, 5020.7783203125, 42.205257415771484)
        ],
        [
            new alt.Vector3(0, 0, 0),
            new alt.Vector3(0, 0, 0),
            new alt.Vector3(0, 0, 0),
            new alt.Vector3(0, 0, 0),
        ],
    ];
    farmId = Math.clamp(farmId, 1, positions.length);
    return positions[farmId - 1];
}

function initFarmUtils(farm) {
    farm.setBalance = (balance) => {
        if (balance < 0) balance = 0;
        farm.balance = balance;
        DB.Query("UPDATE farms SET balance=? WHERE id=?", [farm.balance, farm.sqlId]);
    }
    farm.setTaxBalance = (newTaxBalance) => {
        farm.taxBalance = Math.clamp(newTaxBalance, 0, 1200);
        DB.Query("UPDATE farms SET taxBalance=? WHERE id=?", [farm.taxBalance, farm.sqlId]);
    }
    farm.sellToGos = () => {
        var oldOwner = alt.Player.getBySqlId(farm.owner);
        var fullSum = farm.balance + farm.price * 0.8;
        if (oldOwner) {
            oldOwner.utils.info(`Ваша ферма продана! Деньги с баланса и 80% стоимости бизнеса возвращены!`);
            oldOwner.utils.setBankMoney(oldOwner.bank + price);
            oldOwner.utils.bank(`Ферма`, `Начислено: ~g~$${fullSum}`);
        } else {
            DB.Query(`UPDATE characters SET bank=bank+? WHERE id=?`, [fullSum, farm.owner]);
        }

        farm.owner = 0;
        farm.ownerName = "";
        farm.grains = 0;
        farm.pumpkins = 0;
        farm.cabbages = 0;
        farm.weeds = 0;
        farm.pumpkinPrice = 10;
        farm.cabbagePrice = 10;
        farm.weedPrice = 10;
        farm.grainPrice = 4;
        farm.balance = 0;
        farm.taxBalance = 100;
        farm.pay = 5;

        var query = "UPDATE farms SET grains=?,pumpkins=?,cabbages=?,weeds=?,pumpkinPrice=?,cabbagePrice=?,weedPrice=?,grainPrice=?,owner=?,balance=?,taxBalance=?,pay=? WHERE id=?";
        DB.Query(query, [0, 0, 0, 0, 10, 10, 10, 4, 0, 0, 100, 5, farm.sqlId]);

        // TODO: Init Labels.

        alt.log(`Ферма ${farm.sqlId} продана в гос!`);
    }
    farm.setGrains = (grains) => {
        farm.grains = Math.clamp(grains, 0, 8000);
        DB.Query("UPDATE farms SET grains=? WHERE id=?", [farm.grains, farm.sqlId]);
        farm.grainLabel.text = `~b~Прием зерна: ~w~${farm.grains} из 8000 ед.\n~g~Цена: ~w~${farm.grainPrice}$`;
    }
    farm.setPumpkins = (count) => {
        farm.pumpkins = Math.clamp(count, 0, 2000);
        DB.Query("UPDATE farms SET pumpkins=? WHERE id=?", [farm.pumpkins, farm.sqlId]);
        farm.pumpkinLabel.text = `~y~Тыква: ~w~${farm.pumpkins} из 2000 ед.\n~g~Цена: ~w~${farm.pumpkinPrice}$`;
    }
    farm.setCabbages = (count) => {
        farm.cabbages = Math.clamp(count, 0, 2000);
        DB.Query("UPDATE farms SET cabbages=? WHERE id=?", [farm.cabbages, farm.sqlId]);
        farm.cabbageLabel.text = `~y~Капуста: ~w~${farm.cabbages} из 2000 ед.\n~g~Цена: ~w~${farm.cabbagePrice}$`;
    }
    farm.setWeeds = (count) => {
        farm.weeds = Math.clamp(count, 0, 2000);
        DB.Query("UPDATE farms SET weeds=? WHERE id=?", [farm.weeds, farm.sqlId]);
        farm.weedLabel.text = `~y~Травка: ~w~${farm.weeds} из 2000 ед.\n~g~Цена: ~w~${farm.weedPrice}$`;
    }

}

function initFarmFieldUtils(field) {
    field.setCount = (count) => {
        field.count = Math.clamp(count, 0, 600);
        if (field.count % 20 == 0) DB.Query("UPDATE farms_fields SET count=? WHERE id=?", [field.count, field.sqlId]);
        if (field.count == 0) field.setCropType(0);
    };
    field.setCropType = (cropType) => {
        field.cropType = Math.clamp(cropType, 0, cropNames.length - 1);
        field.label.text = `~y~Поле ~w~№${field.sqlId}\n ~y~Урожай: ~w~${cropNames[field.cropType]}`;
        DB.Query("UPDATE farms_fields SET type=? WHERE id=?", [field.cropType, field.sqlId]);
    };
    field.fill = (type) => {
        // debug(`field.fill: ${type}`)
        // debug(`Зерно посеяно на поле ${field.sqlId}`);
        if (field.objects) {
            field.objects.forEach((object) => {
                object.destroy();
            });
        }
        field.state = 0;
        field.objects = [];
        field.cropType = Math.clamp(type, 0, 3);
        field.count = 600;
        DB.Query("UPDATE farms_fields SET type=?,count=? WHERE id=?", [field.cropType, field.count, field.sqlId]);
        field.label.text = `~y~Поле ~w~№${field.sqlId}\n ~y~Урожай: ~w~${cropNames[field.cropType]}`;
        var timerId = setSaveInterval(() => {
            try {
                field.state++;
                // debug(`Поле ${field.sqlId} созревает. Этап: ${field.state}`);
                if (field.state == 1) {
                    var objPositions = field.getObjPositions();
                    for (var i = 0; i < objPositions.length; i++) {
                        objPositions[i].z = field.p1.z - 0.5;
                        var object = alt.objects.new(jhash("prop_veg_crop_04"), objPositions[i], {
                            rotation: new alt.Vector3(0, 0, 0),
                            alpha: 255,
                            heading: 90
                        });
                        object.count = parseInt(600 / objPositions.length);
                        object.field = field;
                        field.objects.push(object);
                    }
                    // debug(`Поле ${field.sqlId} проросло!`)
                } else if (field.state == 2) {
                    for (var i = 0; i < field.objects.length; i++) {
                        var pos = field.objects[i].position;
                        pos.z += 0.25;
                        field.objects[i].position = pos;
                    }
                    // debug(`Поле ${field.sqlId} почти созрело!`)
                } else if (field.state == 3) {
                    for (var i = 0; i < field.objects.length; i++) {
                        var pos = field.objects[i].position;
                        pos.z += 0.25;
                        field.objects[i].position = pos;
                    }

                    // debug(`Поле ${field.sqlId} созрело!`)
                    clearSaveInterval(timerId);
                }
            } catch (e) {
                alt.log(e);
            }
        }, alt.economy["wait_farm_field_time"].value);
    };
    field.startFilling = (player, vehicle) => {
        if (field.count > 0) return player.utils.error(`Поле уже засеяно!`);
        if (vehicle.products.count < 200) return player.utils.error(`В авто недостаточно зерна!`);
        alt.emitClient(player, "checkpoint.clearForTractor");

        var pointsLeft = alt.getPointsOnInterval(field.p1, field.p3, 4);
        var pointsRight = alt.getPointsOnInterval(field.p2, field.p4, 4);
        if (pointsLeft.length > pointsRight.length) pointsLeft.splice(pointsRight.length);
        if (pointsLeft.length < pointsRight.length) pointsRight.splice(pointsLeft.length);
        var route = [];
        var k = 0;
        pointsLeft.forEach((point) => {
            point.z = field.p1.z - 1;
            route[k] = point;
            k += 2;
        });
        k = 1;
        pointsRight.forEach((point) => {
            point.z = field.p1.z - 1;
            route[k] = point;
            k += 2;
        });

        // route.splice(2); //for test

        player.farmJob.routeIndex = 0;
        player.farmJob.route = route;

        var pos = player.farmJob.route[player.farmJob.routeIndex];
        var data = {
            position: pos,
            type: 1,
            scale: 4,
            params: {
                isForTractor: true
            },
            color: [0, 187, 255, 255],
            direction: route[1]
        };

        alt.emitClient(player, "checkpoint.create", JSON.stringify(data));
        alt.emitClient(player, "setNewWaypoint", pos.x, pos.y);

        //дл¤ отловки событи¤ входа в маркер
        var colshape = new alt.ColshapeSphere(pos["x"], pos["y"], pos["z"] + 1, 3); //+1 to fix bug
        colshape.isForTractor = true;
        player.farmJob.tractorField = field;
        player.farmJob.tractorColshape = colshape;

        player.utils.success(`Рабочее поле выбрано!`);
        player.utils.success(`Следуйте к метке для начала посева!`);
    };
    field.getObjPositions = () => {
        var step = 5;
        var pointsLeft = alt.getPointsOnInterval(field.p1, field.p3, 5);
        var pointsRight = alt.getPointsOnInterval(field.p2, field.p4, 5);
        if (pointsLeft.length > pointsRight.length) pointsLeft.splice(pointsRight.length);
        if (pointsLeft.length < pointsRight.length) pointsRight.splice(pointsLeft.length);

        var objPositions = [];
        for (var i = 0; i < pointsLeft.length; i++) {
            var points = alt.getPointsOnInterval(pointsLeft[i], pointsRight[i], 5);
            objPositions = objPositions.concat(points);
        }
        return objPositions;
    };
}

function initFarmLabels(farm) {
    var pos = farm.position;
    pos.z++;
    farm.label = alt.labels.new(`~y~Ферма ~w~№${farm.sqlId}\n ~b~Pay: ~w~${farm.pay}$`, pos, {
        los: true,
        font: 4,
        drawDistance: 30,
        color: [0, 187, 255, 255],
    });

    var positions = getWarehousePosByFarmId(farm.sqlId);
    farm.pumpkinLabel = alt.labels.new(`~y~Тыква: ~w~${farm.pumpkins} из 2000 ед.\n~g~Цена: ~w~${farm.pumpkinPrice}$`, positions[0], {
        los: false,
        font: 4,
        drawDistance: 30,
        color: [0, 187, 255, 255],
    });

    farm.cabbageLabel = alt.labels.new(`~y~Капуста: ~w~${farm.cabbages} из 2000 ед.\n~g~Цена: ~w~${farm.cabbagePrice}$`, positions[1], {
        los: false,
        font: 4,
        drawDistance: 30,
        color: [0, 187, 255, 255],
    });

    farm.weedLabel = alt.labels.new(`~y~Травка: ~w~${farm.weeds} из 2000 ед.\n~g~Цена: ~w~${farm.weedPrice}$`, positions[2], {
        los: false,
        font: 4,
        drawDistance: 30,
        color: [0, 187, 255, 255],
    });

    farm.grainLabel = alt.labels.new(`~b~Прием зерна: ~w~${farm.grains} из 8000 ед.\n~g~Цена: ~w~${farm.grainPrice}$`, positions[3], {
        los: false,
        font: 4,
        drawDistance: 30,
        color: [0, 187, 255, 255],
    });
}

function initFarmWarehouse(farm) {
    var pos = getWarehousePosByFarmId(farm.sqlId)[3];
    pos.z -= 2;
    var marker = alt.helpers.marker.new(1, pos, 1, {
        color: [187, 255, 0, 80],
        visible: false
    });

    //для стриминга
    var colshape = alt.colshapes.newCircle(pos["x"], pos["y"], alt.economy["markers_stream_dist"].value);
    colshape.marker = marker;
    marker.showColshape = colshape;

    //для отловки события входа
    var colshape = new alt.ColshapeSphere(pos["x"], pos["y"], pos["z"], 2);
    colshape.warehouse = marker;
    colshape.farm = farm;
    marker.colshape = colshape;
    colshape.menuName = `farm_warehouse`;
}

function initFarmFieldLabels(field) {
    var pos = field.labelPos;
    pos.z++;
    field.label = alt.labels.new(`~y~Поле ~w~№${field.sqlId}\n ~y~Урожай: ~w~${cropNames[field.cropType]}`, pos, {
        font: 4,
        drawDistance: 30,
        color: [0, 187, 255, 255],
    });
}

function initFarmFieldObjects(field) {
    var count = field.count;
    var objPositions = field.getObjPositions();
    field.objects = [];
    for (var j = 0; j < objPositions.length; j++) {
        var fieldCount = Math.clamp(parseInt(600 / objPositions.length), 0, count);
        count -= fieldCount;
        if (fieldCount <= 0) break;
        objPositions[j].z = field.p1.z;
        var object = alt.objects.new(jhash("prop_veg_crop_04"), objPositions[j], {
            rotation: new alt.Vector3(0, 0, 0),
            alpha: 255,
            heading: 90
        });
        object.count = fieldCount;
        object.field = field;
        field.objects.push(object);

    }
}

global.saveFarmFieldsDBParams = () => {
    for (var i = 0; i < alt.farmFields.length; i++) {
        var field = alt.farmFields[i];
        DB.Query("UPDATE farms_fields SET type=?,count=? WHERE id=?", [field.cropType, field.count, field.sqlId]);
    }
}
