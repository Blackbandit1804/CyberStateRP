let jobWaterFrontColShape = new alt.ColshapeSphere(-410.083, -2700.001, 6.000, 1.5);
let jobWaterFrontColShapeClothes = new alt.ColshapeSphere(-413.36, -2699.29, 6.00, 1);
let radiusColShape = new alt.ColshapeSphere(-429.05, -2738.54, 4.80, 190);
const JobWaterFront = {
    markers: [{
            pos: new alt.Vector3(-471.43, -2687.80, 8.76),
            money_x: 1
        },
        {
            pos: new alt.Vector3(-469.09, -2685.48, 8.76),
            money_x: 1
        },
        {
            pos: new alt.Vector3(-466.62, -2682.96, 8.76),
            money_x: 1
        },
        {
            pos: new alt.Vector3(-464.37, -2680.49, 8.76),
            money_x: 1
        },
        {
            pos: new alt.Vector3(-461.86, -2678.06, 8.76),
            money_x: 1
        },
        {
            pos: new alt.Vector3(-459.39, -2675.72, 8.76),
            money_x: 1
        },

        {
            pos: new alt.Vector3(-450.38, -2666.83, 8.76),
            money_x: 1.20
        },
        {
            pos: new alt.Vector3(-448.02, -2664.47, 8.76),
            money_x: 1.20
        },
        {
            pos: new alt.Vector3(-445.50, -2661.89, 8.76),
            money_x: 1.20
        },
        {
            pos: new alt.Vector3(-442.84, -2659.54, 8.76),
            money_x: 1.20
        },
        {
            pos: new alt.Vector3(-440.51, -2657.30, 8.76),
            money_x: 1.20
        },
        {
            pos: new alt.Vector3(-438.12, -2654.82, 8.76),
            money_x: 1.20
        },

        {
            pos: new alt.Vector3(-431.08, -2643.24, 8.76),
            money_x: 1.35
        },
        {
            pos: new alt.Vector3(-428.64, -2640.60, 8.76),
            money_x: 1.35
        },
        {
            pos: new alt.Vector3(-426.16, -2638.14, 8.76),
            money_x: 1.35
        },
        {
            pos: new alt.Vector3(-423.81, -2635.63, 8.76),
            money_x: 1.35
        },
        {
            pos: new alt.Vector3(-421.28, -2633.02, 8.76),
            money_x: 1.35
        },
        {
            pos: new alt.Vector3(-418.80, -2630.59, 8.76),
            money_x: 1.35
        },

        {
            pos: new alt.Vector3(-410.04, -2621.99, 8.76),
            money_x: 1.5
        },
        {
            pos: new alt.Vector3(-407.63, -2619.45, 8.76),
            money_x: 1.5
        },
        {
            pos: new alt.Vector3(-405.08, -2617.03, 8.76),
            money_x: 1.5
        },
        {
            pos: new alt.Vector3(-402.64, -2614.43, 8.75),
            money_x: 1.5
        },
        {
            pos: new alt.Vector3(-400.10, -2612.02, 8.80),
            money_x: 1.5
        },
        {
            pos: new alt.Vector3(-397.59, -2609.45, 8.81),
            money_x: 1.5
        },
    ],
    storage: new alt.Vector3(-381.40, -2677.20, 6.02),
    markers_2: [{
            pos: new alt.Vector3(-443.06, -2793.09, 6.00),
            money_x: 1
        },
        {
            pos: new alt.Vector3(-452.34, -2801.94, 6.00),
            money_x: 1
        },
        {
            pos: new alt.Vector3(-461.55, -2810.76, 6.00),
            money_x: 1
        },
        {
            pos: new alt.Vector3(-478.93, -2829.16, 6.00),
            money_x: 1.10
        },
        {
            pos: new alt.Vector3(-497.23, -2846.97, 6.00),
            money_x: 1.10
        },
        {
            pos: new alt.Vector3(-506.39, -2856.06, 6.00),
            money_x: 1.15
        },
        {
            pos: new alt.Vector3(-524.12, -2874.18, 6.00),
            money_x: 1.15
        }
    ],
    load_num: [11, 12, 13, 15, 17, 18, 20],
    storage_2: [{
            pos: new alt.Vector3(-366.65, -2668.36, 6.00)
        },
        {
            pos: new alt.Vector3(-374.54, -2676.27, 6.00)
        }
    ]
};

function putBox(player) {
  try {
    if (player.waterfrontfloor === undefined) return;
    player.utils.putObject();
    let money = Math.round(alt.economy["waterfront_salary"].value * JobWaterFront.markers[player.waterfrontfloor].money_x);
    player.utils.success(`Заработано: ${money}$`);
    player.utils.setMoney(player.money + money);
    alt.logs.addLog(`${player.getSyncedMeta("name")} заработал на работе ${money}$`, 'job', player.account.id, player.sqlId, { money: money });
    player.utils.setJobSkills(8, player.jobSkills[8 - 1] + 1);
    if (player.jobSkills[8 - 1] === 50) player.utils.error("Вам открыта 2 ступень работы!");
    delete player.waterfrontfloor;
    delete player.boxwaterfront;
    sendBox(player);
  } catch (err) {
      alt.log(err);
      return;
  }
}

function takeBox(player) {
    if (player.waterfrontfloor === undefined) return;
    player.utils.takeObject("hei_prop_heist_wooden_box");
    alt.emitClient(player, "create.watefront.item", true, true, 2, JobWaterFront.storage.x, JobWaterFront.storage.y, JobWaterFront.storage.z);
    player.utils.error("Отнесите ящик на склад!");
    player.boxwaterfront = true;
}

function sendBox(player) {
    if (player.waterfrontfloor !== undefined) return;
    let place = getRandomNumber(0, JobWaterFront.markers.length);
    alt.emitClient(player, "create.watefront.item", true, false, 1, JobWaterFront.markers[place].pos.x, JobWaterFront.markers[place].pos.y, JobWaterFront.markers[place].pos.z);
    player.waterfrontfloor = place;
    player.utils.error("Возьмите ящик с " + (place + 1) + " платформы!");
}
alt.on("playerEnteredVehicle", function playerStartEnterVehicleHandler(player, vehicle, seat) {
    if (player.job === 8) if (player.boxwaterfront) stopBringingBox(player);
});

function stopBringingBox(player) {
  try {
    let place = getRandomNumber(0, JobWaterFront.markers.length);
    alt.emitClient(player, "create.watefront.item", true, false, 1, JobWaterFront.markers[place].pos.x, JobWaterFront.markers[place].pos.y, JobWaterFront.markers[place].pos.z);
    player.waterfrontfloor = place;
    delete player.boxwaterfront;
  } catch (err) {
      alt.log(err);
      return;
  }
}
module.exports.stopBringingBox = stopBringingBox;

function mustTakeBoxLoader(player) {
  try {
    if (!player.porter) return;
    let place = getRandomNumber(0, JobWaterFront.storage_2.length);
    alt.emitClient(player, "create.watefront.loader", JobWaterFront.storage_2[place].pos.x, JobWaterFront.storage_2[place].pos.y, JobWaterFront.storage_2[place].pos.z, true, 1);
    player.utils.error("Погрузите ящик со склада!");
  } catch (err) {
      alt.log(err);
      return;
  }
}

function takeBoxLoader(player) {
  try {
    if (!player.porter) return;
    // player.utils.takeObject("hei_prop_heist_wooden_box");
    let place = getRandomNumber(0, JobWaterFront.markers_2.length);
    alt.emitClient(player, "create.watefront.loader", JobWaterFront.markers_2[place].pos.x, JobWaterFront.markers_2[place].pos.y, JobWaterFront.markers_2[place].pos.z, true, 2);
    alt.emitClient(player, "create.watefront.boxveh", player.porter);
    player.utils.error("Погрузите ящик на " + JobWaterFront.load_num[place] + " платформу!");
    player.waterfrontfloor = place;
    // player.porter.setSyncedMeta("syncWaterFront", true);
  } catch (err) {
      alt.log(err);
      return;
  }
}

function putBoxLoader(player) {
  try {
    if (!player.porter) return;
    let money = Math.round(alt.economy["waterfront_salary_sec"].value * JobWaterFront.markers_2[player.waterfrontfloor].money_x);
    player.utils.success(`Заработано: ${money}$`);
    player.utils.setMoney(player.money + money);
    alt.logs.addLog(`${player.getSyncedMeta("name")} заработал на работе ${money}$`, 'job', player.account.id, player.sqlId, { money: money });
    // player.porter.setSyncedMeta("syncWaterFront", null);
    delete player.waterfrontfloor;
    mustTakeBoxLoader(player);
  } catch (err) {
      alt.log(err);
      return;
  }
}

function haveLicense(player, vehicle) {
    if (!vehicle.license) return true;
    var docs = player.inventory.getArrayByItemId(16);
    for (var sqlId in docs) {
        if (docs[sqlId].params.licenses.indexOf(vehicle.license) != -1) return true;
    }
    return false;
}

alt.onClient("use.watefrontfunctions.job", (player, num) => {
    try {
        switch (num) {
            case 1:
                if (player.vehicle) {
                    if (player.vehicle === player.porter && player.st_porter) takeBoxLoader(player);
                } else {
                    if (!player.st_porter) takeBox(player);
                }
                break;
            case 2:
                if (player.vehicle && player.st_porter) {
                    if (player.vehicle === player.porter) putBoxLoader(player);
                } else {
                    if (!player.st_porter) putBox(player);
                }
                break;
        }
    } catch (err) {
        alt.log(err);
        return;
    }
});
alt.on("playerEnteredVehicle", function playerEnteredVehicleHandler(player, vehicle, seat) {
    if (vehicle.owner === -8 && player.job === 8 && seat === 1) {
        if (player.jobcloth) {
            let skill = player.jobSkills[8 - 1];
            if (skill < 50) {
                player.notify("Опыт работы: ~r~" + skill + " ~w~из ~r~" + 50);
                alt.emitClient(player, `Vehicle::leave`, vehicle);
                return;
            }

            if (player.porter && player.porter !== vehicle) {
                player.utils.error("Вы уже заняли одно транспортное средство!");
                alt.emitClient(player, `Vehicle::leave`, vehicle);
                return;
            }

            if (vehicle.porter) {
                if (!alt.Player.exists(vehicle.porter)) delete vehicle.porter;
                else if (vehicle.porter.porter != vehicle) delete vehicle.porter;
                else if (vehicle.porter !== player) {
                    player.utils.error("Данный транспорт уже занят другим рабочим!");
                    alt.emitClient(player, `Vehicle::leave`, vehicle);
                    return;
                } else {
                    alt.emitClient(player, "time.remove.back.waterfront");
                    return;
                }
            }
            if (!haveLicense(player, vehicle)) return;

            vehicle.porter = player;
            player.porter = vehicle;
            player.st_porter = true;
            mustTakeBoxLoader(player);
            vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
            delete player.boxwaterfront;
        } else {
            player.utils.error("Вы не начали рабочий день!");
            alt.emitClient(player, `Vehicle::leave`, vehicle);
        }
    }
});
alt.on("playerLeftVehicle", function playerLeftVehicleHandler(player, vehicle) {
    if (vehicle.owner === -8 && player.job === 8) {
        if (vehicle === player.porter) {
            alt.emitClient(player, "time.add.back.watefront");
            player.utils.error("У вас есть 1 минута, чтобы вернуться в транспорт.");
        }
    }
});
alt.on("entityEnterColshape", function onentityEnterColshape(shape, player) {
    try {
        if (!player.vehicle) {
            if (shape === jobWaterFrontColShape) alt.emitClient(player, "getWaterFrontJobStatus", player.job !== 8 ? false : true);
            else if (shape === jobWaterFrontColShapeClothes) {
                if (player.job === 8) {
                    if (player.jobcloth === undefined) {
                        if (player.vehicle) return;
                        player.utils.success("Вы начали рабочий день!");
                        player.jobcloth = true;
                        sendBox(player);
                        player.body.clearItems();
                        player.body.denyUpdateView = true;
                        if (player.sex === 1) {
                            // Одежда мужская
                            alt.emit(`setClothes`, player, 3, 52, 0, 2);
                            alt.emit(`setClothes`, player, 4, 36, 0, 2);
                            alt.emit(`setClothes`, player, 6, 12, 0, 2);
                            alt.emit(`setClothes`, player, 8, 59, 1, 2);
                            alt.emit(`setClothes`, player, 11, 56, 0, 2);
                            alt.emit(`Prop::set`, player, 0, 2, 0);
                        } else {
                            // Одежда женская
                            alt.emit(`setClothes`, player, 3, 70, 0, 2);
                            alt.emit(`setClothes`, player, 4, 35, 0, 2);
                            alt.emit(`setClothes`, player, 6, 26, 0, 2);
                            alt.emit(`setClothes`, player, 8, 36, 0, 2);
                            alt.emit(`setClothes`, player, 11, 49, 0, 2);
                            alt.emit(`Prop::set`, player, 0, 12, 0);
                        }
                    } else {
                        if (player.boxwaterfront === true) {
                            player.utils.error("Сначала отнесите ящик на склад!");
                            return;
                        }

                        delete player.body.denyUpdateView;
                        player.body.loadItems();
                        leaveVehicle(player);
                        player.utils.success("Вы закончили рабочий день!");
                        player.utils.error("Не забудьте забрать прибыль!");
                        delete player.jobcloth;
                        delete player.waterfrontfloor;
                        delete player.boxwaterfront;
                        delete player.st_porter;
                        alt.emitClient(player, "create.watefront.item", false, false, -1, 0, 0, 0);
                    }
                }
            }
        }
    } catch (err) {
        alt.log(err);
        return;
    }
});
alt.on("playerDeath", function playerDeathHandler(player, reason, killer) {
    leavePort(player);
});

alt.on("entityLeaveColshape", function onentityLeaveColshape(player, shape) {
    try {
        if (shape === jobWaterFrontColShape) alt.emitClient(player, "getWaterFrontJobStatus", "cancel");
        else if (shape === radiusColShape) leavePort(player);
    } catch (err) {
        alt.log(err);
        return;
    }
});

function leavePort(player) {
    if (player.job === 8) {
        player.utils.success("Вы уволились с порта!");
        delete player.body.denyUpdateView;
        player.body.loadItems();
        player.utils.putObject();
        leaveVehicle(player);
        alt.emitClient(player, "create.waterfront.clothmarker", false);
        alt.emitClient(player, "create.watefront.item", false, false, -1, 0, 0, 0);
        player.utils.changeJob(0);
        delete player.jobcloth, delete player.waterfrontfloor, delete player.boxwaterfront, delete player.st_porter;
    }
}
alt.onClient("leave.watefront.job", (player) => {
    try {
        leavePort(player);
    } catch (err) {
        alt.log(err);
        return;
    }
});

function leaveVehicle(player) {
    let vehicle = player.porter;
    delete player.porter;
    if (vehicle) {
        // forks_attach
        if (player.vehicle === vehicle) alt.emitClient(player, `Vehicle::leave`, vehicle);
        alt.emitClient(player, "time.remove.back.waterfront");
        setSaveTimeout(() => {
            try {
                // vehicle.setSyncedMeta("syncWaterFront", null);
                alt.emitClient(player, `Vehicle::repair`, vehicle);
                vehicle.dimension = 1;
                vehicle.pos = vehicle.spawnPos;
                vehicle.rot = new alt.Vector3(0, 0, vehicle.spawnPos.h * Math.PI / 180);
                vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
                vehicle.engineOn = false;
                delete vehicle.porter;
            } catch (err) {
                alt.log(err);
                return;
            }
        }, 200);
    }
};
alt.on("playerDisconnect", function playerDisconnectHandler(player, exitType, reason) {
    if (player.job === 8) leaveVehicle(player); // leaveVehicle(player);
});
alt.onClient("job.waterfront.agree", (player) => {
    try {
        if (player.job !== 0 && player.job !== 8) {
            player.utils.error("Вы уже где-то работаете!");
            return;
        }

        if (player.job === 8) {
            if (player.jobcloth !== undefined) {
                player.utils.error("Вы не закончили рабочий день!");
                return;
            }
            player.utils.success("Вы уволились с порта!");
            alt.emitClient(player, "setWaterFrontJobStatus", false);
            alt.emitClient(player, "create.waterfront.clothmarker", false);
            player.utils.changeJob(0);
        } else {
            player.utils.success("Вы устроились в порт!");
            player.utils.changeJob(8);
            player.utils.success("Переоденьтесь для начала рабочего дня!");
            alt.emitClient(player, "setWaterFrontJobStatus", true);
            alt.emitClient(player, "create.waterfront.clothmarker", true);
        }
    } catch (err) {
        alt.log(err);
        return;
    }
});

function getRandomNumber(min, max) {
    try {
        return Math.floor(Math.random() * (max - min)) + min;
    } catch (err) {
        alt.log(err);
        return -1;
    }
}
