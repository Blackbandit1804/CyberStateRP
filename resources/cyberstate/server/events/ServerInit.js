alt.on("ServerInit", () => {
    alt.log("Запуск сервера...");
    initMpUtils();
    initPoliceCells();
    //initBlackMarket();

    require('../modules/economy.js').Init(async () => {
        require('../modules/mailSender.js').Init();
        require('../modules/houses.js').Init();
        require('../modules/interiors.js').Init();
        //require('../modules/garages.js').Init();
        require('../modules/timers.js').InitPayDay();
        require('../modules/bizes.js').Init();
        require('../modules/inventory.js').Init();
        //require(`../modules/achievements.js`).Init();
        require('../modules/factions.js').Init();
        require('../modules/vehicles.js').Init();
        require('../modules/objects.js').Init();
        require('../modules/weather.js').Init();
        // require('../modules/routep.js').Init();
        require('../modules/jobs/trash/trash.js').Init();
        require('../modules/jobs/gopostal/gopostal.js');
        require('../modules/jobs/pizza/index.js');
        require('../modules/jobs/waterfront/index.js');
        require('../modules/jobs/builder/index.js');
        require('../modules/jobs/autoroober/index.js');
        require('../modules/jobs/bus/bus.js');
        require('../modules/jobs/taxi/index.js');
        require('../modules/jobs/smuggling/index.js');
        require('../modules/clothes.js').Init();
        require('../modules/ls_customs/index.js');
        require('../modules/rent_veh.js');
        require('../modules/logs.js').Init();
        require(`../modules/promocodes.js`).Init();
        require('../modules/v2_reports.js').Init();
        require('../modules/donate.js').Init();
        require('../modules/autosaloons.js').Init();
        require('../modules/bank.js');
        require(`../modules/jobs.js`).Init();
        require(`../modules/driving_school.js`).Init();
        //require(`../modules/jobs/trucker/trucker.js`).Init();
        require('../modules/barbershop/index.js');
        require(`../modules/markers.js`).Init();
        require(`../modules/peds.js`).Init();
        //require(`../modules/farms.js`).Init();
        require('../modules/doorControl.js');
        //require('../modules/cutscenes.js').Init();
        require('../modules/spawn.js').Init();
        //require('../modules/ipl.js').Init();
        //require('../modules/whitelist.js').Init();
        await require('../modules/green_zones.js').Init();
        require('../modules/phone.js').Init();
        require('../modules/bandZones.js').Init();
        require('../modules/clothesShop/index.js');
        require(`../modules/gang_storage.js`).Init();
    });

    require('../modules/forefinger.js');
    alt.log("Сервер запущен!");
});

let Gangs = {
  tie: {
    roobers: [],
    patients: []
  }
};

function initMpUtils() {
    //------------ВЫНЕСТИ В ОТДЕЛЬНЫЙ ФАЙЛ------------//
    alt.pushGangRoobers = (status, name) => {
        if (status) Gangs.tie.roobers.push(name);
        else Gangs.tie.patients.push(name);
    }
    alt.getGangRoobers = (status, name) => {
        let roober_length = 0;
        let array = status == true ? Gangs.tie.roobers : Gangs.tie.patients;
        for (let i = 0; i < array.length; i++) if (array[i] == name) roober_length++;
        return roober_length;
    }
    alt.clearGangRoobers = () => {
        Gangs.tie.roobers = []
        Gangs.tie.patients = [];
        alt.log("[Банды] Обнулены массивы для ограблений банд!");
    }
    //-----------------------------------------------//
    alt.randomInteger = (min, max) => {
        var rand = min - 0.5 + Math.random() * (max - min + 1)
        rand = Math.round(rand);
        return rand;
    }

    alt.Player.exists = (player) => {
        if (!player) return null;
        var result = false;
        alt.Player.all.forEach((rec) => {
            if (rec == player) {
                result = true;
                return;
            }
        });
        return result;
    };

    alt.Player.dist = (pos, recPos) => {
        if (!pos) return null;
        var result;
        result = Math.sqrt(Math.pow(pos.x-recPos.x, 2) + Math.pow(pos.y-recPos.y, 2) + Math.pow(pos.z-recPos.z, 2));
        return result;
    };

    alt.Vehicle.dist = (pos, recPos) => {
        if (!pos) return null;
        var result;
        result = Math.sqrt(Math.pow(pos.x-recPos.x, 2) + Math.pow(pos.y-recPos.y, 2) + Math.pow(pos.z-recPos.z, 2));
        return result;
    };

    alt.Player.getBySqlId = (sqlId) => {
        if (!sqlId) return null;
        var result;
        alt.Player.all.forEach((recipient) => {
            if (recipient.sqlId == sqlId) {
                result = recipient;
                return;
            }
        });
        return result;
    }

    alt.Player.getByLogin = (login) => {
        if (!login) return null;
        var result;
        alt.Player.all.forEach((recipient) => {
            if (recipient.sqlId) {
                if (recipient.account.login == login) {
                    result = recipient;
                    return;
                }
            }
        });
        return result;
    }

    alt.Player.getBySocialClub = (socialClub) => {
        if (!socialClub) return null;
        var result;
        alt.Player.all.forEach((recipient) => {
            if (recipient.sqlId) {
                if (recipient.socialClub == socialClub) {
                    result = recipient;
                    return;
                }
            }
        });
        return result;
    }

    alt.Player.getByName = (name) => {
        if (!name) return null;
        var result;
        alt.Player.all.forEach((recipient) => {
            if (recipient.getSyncedMeta("name") == name) {
                result = recipient;
                return;
            }
        });
        return result;
    }

    alt.Vehicle.getBySqlId = (sqlId) => {
        if (!sqlId) return null;
        var result;
        alt.Vehicle.all.forEach((veh) => {
            if (veh.sqlId == sqlId) {
                result = veh;
                return;
            }
        });
        return result;
    }

    alt.Vehicle.at = (id) => {
        if (!id) return null;
        var result;
        alt.Vehicle.all.forEach((veh) => {
            if (veh.id == id) {
                result = veh;
                return;
            }
        });
        return result;
    }

    /* Полное удаление предметов инвентаря с сервера. */
    alt.fullDeleteItemsByParams = (itemId, keys, values) => {
        //debug(`fullDeleteItemsByParams: ${itemId} ${keys} ${values}`);
        /* Для всех игроков. */
        alt.Player.all.forEach((rec) => {
            if (rec.sqlId) rec.inventory.deleteByParams(itemId, keys, values);
        });
        /* Для всех объектов на полу. */
        alt.objects.forEach((obj) => {
            if (obj.sqlId > 0) {
                var item = obj.item;
                var doDelete = true;
                for (var i = 0; i < keys.length; i++) {
                    var param = item.params[keys[i]];
                    if (!param) {
                        doDelete = false;
                        break;
                    }
                    if (param && param != values[i]) {
                        doDelete = false;
                        break;
                    }
                }
                if (doDelete) {
                    DB.Query(`DELETE FROM inventory_players WHERE id=?`, obj.sqlId);
                    alt.objects.destroy(obj.sqlId);
                }
            }
        });
        /* Для всех игроков из БД. */
        // TODO: ^^
    }

    alt.fullDeleteItemsByFaction = (playerSqlId, factionId) => {
        // debug(`fullDeleteItemsByFaction: ${playerSqlId} ${factionId}`);
        var items = {
            "2": [1, 2, 3, 6, 7, 8, 9, 10, 14, 17, 18, 19, 20, 21, 22, 23, 27, 29], // LSPD
            "3": [1, 2, 3, 6, 7, 8, 9, 10, 14, 17, 18, 19, 20, 21, 22, 23, 27, 29], // BCSO
            "4": [1, 2, 3, 6, 7, 8, 9, 10, 14, 17, 18, 19, 20, 21, 22, 23, 29, 61], // FIB
            "5": [1, 2, 3, 6, 7, 8, 9, 10, 14, 24, 25, 27, 63], // EMC
            "6": [1, 2, 3, 6, 7, 8, 9, 10, 14, 20, 21, 22, 23, 27, 60], // Fort Zancudo
            "7": [1, 2, 3, 6, 7, 8, 9, 10, 14, 20, 21, 22, 23, 27, 60], // Air Army
        };
        if (items[factionId]) {
            items[factionId].forEach((itemId) => {
                alt.fullDeleteItemsByParams(itemId, ["owner", "faction"], [playerSqlId, factionId]);
            });
        }
    }

    alt.getNearVehicle = (pos, range) => {
        var nearVehicle;
        var minDist = 99999;
        alt.Vehicle.all.forEach((veh) => {
            if (alt.Vehicle.dist(veh.pos, pos) <= range) {
                var distance = alt.Vehicle.dist(veh.pos, pos);
                if (distance < minDist) {
                    nearVehicle = veh;
                    minDist = distance;
                }
            }
        });
        return nearVehicle;
    }

    alt.setVehSpawnTimer = (vehicle) => {
        var havePlayers = 0;
        alt.Player.all.forEach((rec) => { if (rec.vehicle && rec.vehicle == vehicle) havePlayers += 1; });
        if (!havePlayers) vehicle.utils.setSpawnTimer(alt.economy["car_spawn_time"].value);
    }

    alt.getLicName = (license) => {
        var names = {
            1: "Лицензия на автомобиль",
            2: "Лицензия на мототехнику",
            3: "Лицензия на лодку",
            4: "Лицензия на яхту",
            10: "Лицензия на оружие",
            11: "Лицензия на вертолёт",
            12: "Лицензия на самолёт",
        };
        if (!names[license]) return "Лицензия";
        return names[license];
    }

    alt.convertMinutesToLevelRest = (minutes) => {
        var exp = parseInt(minutes / 60);
        if (exp < 4) return {
            level: 1,
            nextLevel: 4,
            rest: exp
        };
        var i = 2;
        var add = 8;
        var temp = 12;
        while (i < 200) {
            if (exp < temp) {
                return {
                    level: i,
                    nextLevel: add,
                    rest: exp - (temp - add)
                };
            }
            i++;
            add += 4;
            temp += add;
        }
        return -1;
    }

    alt.broadcastEnterFactionPlayers = (player) => {
        if (!player.faction) return;
        var rankName = alt.factions.getRankName(player.faction, player.rank);
        if (player.faction == 2) {
            alt.Player.all.forEach((rec) => {
                if (rec.faction == player.faction) {
                    if (rec.sqlId != player.sqlId) alt.emitClient(rec, `tablet.police.addTeamPlayer`, {
                        id: player.sqlId,
                        name: player.getSyncedMeta("name"),
                        rank: rankName
                    });
                    alt.emitClient(player, `tablet.police.addTeamPlayer`, {
                        id: rec.sqlId,
                        name: rec.getSyncedMeta("name"),
                        rank: alt.factions.getRankName(rec.faction, rec.rank)
                    });
                }
            });
        } else if (player.faction == 5) {
            alt.Player.all.forEach((rec) => {
                if (rec.faction == player.faction) {
                    if (rec.sqlId != player.sqlId) alt.emitClient(rec, `tablet.medic.addTeamPlayer`, {
                        id: player.sqlId,
                        name: player.getSyncedMeta("name"),
                        rank: rankName
                    });
                    alt.emitClient(player, `tablet.medic.addTeamPlayer`, {
                        id: rec.sqlId,
                        name: rec.getSyncedMeta("name"),
                        rank: alt.factions.getRankName(rec.faction, rec.rank)
                    });
                }
            });
        }
    }

    alt.setFactionRank = (player) => {
        if (!player.faction) return;
        let faction = player.faction;
        if (faction === 2) {
            alt.Player.all.forEach((rec) => {
                if (rec.faction === faction) {
                    alt.emitClient(rec, `tablet.police.removeTeamPlayer`, player.sqlId);
                    alt.emitClient(rec, `tablet.police.addTeamPlayer`, {
                        id: player.sqlId,
                        name: player.getSyncedMeta("name"),
                        rank: alt.factions.getRankName(player.faction, player.rank)
                    });
                }
            });
        } else if (faction === 5) {
            alt.Player.all.forEach((rec) => {
                if (rec.faction === faction) {
                    alt.emitClient(rec, `tablet.medic.removeTeamPlayer`, player.sqlId);
                    alt.emitClient(rec, `tablet.medic.addTeamPlayer`, {
                        id: player.sqlId,
                        name: player.getSyncedMeta("name"),
                        rank: alt.factions.getRankName(player.faction, player.rank)
                    });
                }
            });
        }
    }

    /* Оповещаем членов организации о том, что вышел коллега. */
    alt.broadcastExitFactionPlayers = (player) => {
        if (!player.faction) return;
        let faction = player.faction;
        if (faction === 2) {
            alt.Player.all.forEach((rec) => {
                if (rec.faction == faction) {
                    alt.emitClient(rec, `tablet.police.removeTeamPlayer`, player.sqlId);
                    alt.emitClient(player, `tablet.police.removeTeamPlayer`, rec.sqlId);
                }
            });
        } else if (faction === 5) {
            alt.Player.all.forEach((rec) => {
                if (rec.faction == faction) {
                    alt.emitClient(rec, `tablet.medic.removeTeamPlayer`, player.sqlId);
                    alt.emitClient(player, `tablet.medic.removeTeamPlayer`, rec.sqlId);
                }
            });
        }
    }

    alt.getPointsOnInterval = (point1, point2, step) => {
        var vectorX = point2.x - point1.x;
        var vectorY = point2.y - point1.y;

        var vectorLenght = Math.sqrt(Math.pow(vectorX, 2) + Math.pow(vectorY, 2));
        var countOfPoint = parseInt(vectorLenght / step);

        var stepX = vectorX / countOfPoint;
        var stepY = vectorY / countOfPoint;

        var pointsOnInterval = [];

        for (var i = 1; i < countOfPoint; i++) {
            var point = {
                x: point1.x + stepX * i,
                y: point1.y + stepY * i
            }
            pointsOnInterval.push(point);
        }

        return pointsOnInterval;
    }

    alt.broadcastAdmins = (text) => {
        alt.Player.all.forEach((rec) => {
            if (rec.sqlId && rec.admin) alt.emitClient(rec, "chat.custom.push", text, "ff6666");
        });
    }

}

/*function initBlackMarket() {
    var pos = new alt.Vector3(1538.55, 1699.69, 109.706);
    pos.z -= 1.5;
    var marker = alt.helpers.marker.new(1, pos, 0, {});
    marker.visible = false;
    var blip = alt.helpers.blip.new(500, pos, { alpha: 255, scale: 0.7, color: 4, name: "Авто-перекупщик", shortRange: true });
    marker.blip = blip;
    //для стриминга
    var colshape = alt.colshapes.newCircle(pos.x, pos.y, 60);
    colshape.marker = marker;
    marker.showColshape = colshape;

    //для отловки события входа
    var colshape = new alt.ColshapeSphere(pos.x, pos.y, pos.z, 2);
    colshape.blackMarket = marker;
    colshape.menuName = "sell_car";
    marker.colshape = colshape;
}*/

function initPoliceCells() {
    var cellOne = new alt.Vector3(460.03, -994.1, 24.91);
    cellOne.h = 268.34;

    var cellTwo = new alt.Vector3(460.09, -998.03, 24.91);
    cellTwo.h = 268.34;

    var cellThree = new alt.Vector3(460.02, -1001.57, 24.91);
    cellThree.h = 268.34;

    var cellsExit = new alt.Vector3(461.64, -989.16, 24.91);
    cellsExit.h = 93.45;

    alt.policeCells = [cellOne, cellTwo, cellThree];
    alt.policeCellsExit = cellsExit;
}
