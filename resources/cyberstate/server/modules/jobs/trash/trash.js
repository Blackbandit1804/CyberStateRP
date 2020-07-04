const JobTrash = {
    salary_min: 1, // Минимальная сумма прибыли
    salary_max: 2000, // Макисмальная сумма прибыли
    trash_min: 1, // Минимальное кол-во мусора в тс
    trash_max: 30, // Максимальное кол-во мусора в тс
    distance_min: 700, // Минимальная дистанция от игрока к баку
    distance_max: 4000, // Максимум = минимум + число
    job_colshape: new alt.ColshapeSphere(-629.18, -1634.45, 26.04, 1.5),
    trash_colshape: new alt.ColshapeSphere(-467.69, -1719.06, 18.69, 3),
    backs: [],
    teams: [],
    functions: {
        enjoyJob(player) {
            if (alt.convertMinutesToLevelRest(player.minutes).level < 2) return player.utils.error("Вы не достигли 2 уровня!");
            alt.emitClient(player, "setTrashJobStatus", true);
            player.utils.success("Вы устроились в Центр утилизации!");
            player.utils.success("Выберите свободный мусоровоз или вступите в бригаду с водителем!");
            player.utils.changeJob(9);
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
        },
        leaveJob(player) {
            if (player === undefined) return;
            alt.emitClient(player, "setTrashJobStatus", false);
            player.utils.success("Вы уволились из Центра утилизации!");
            player.utils.changeJob(0);
            alt.emitClient(player, "update.trash.vehicle", "cancel", 0, 0);
            alt.emitClient(player, "createPlaceTrasher", 0, 0, 0, false);
            putTrashBox(player);
            delete player.body.denyUpdateView;
            player.body.loadItems();
            delete player.toldpos, delete player.hastrash;
            JobTrash.functions.leaveVehicle(player);
            player.utils.setLocalVar("trashLeader", undefined);
            let team = getTrashTeam(player);
            if (!team) return;
            if (team.leader === player) {
                if (team.target) {
                    team.target.utils.warning("Водитель уволился, бригада расформированна!");
                    alt.emitClient(team.target, "update.trash.vehicle", "cancel", 0, 0);
                    alt.emitClient(team.target, "createPlaceTrasher", 0, 0, 0, false);
                    team.target.utils.putObject();
                }
                JobTrash.teams.splice(JobTrash.teams.indexOf(team), 1);
            } else {
                team.leader.utils.warning("Помощник уволился, бригада расформированна!");
                delete team.target;
            }
        },
        leaveVehicle(player) {
            let team = getTrashTeam(player);
            if (team) {
                if (team.vehicle) {
                    let vehicle = team.vehicle;
                    if (player.vehicle === vehicle) alt.emitClient(player, `Vehicle::leave`, vehicle);
                    removeAllHumansFromVehicle(vehicle);
                    setSaveTimeout(() => {
                        try {
                            alt.emitClient(player, `Vehicle::repair`, vehicle);
                            vehicle.dimension = 1;
                            vehicle.pos = vehicle.spawnPos;
                            vehicle.rot = new alt.Vector3(0, 0, vehicle.spawnPos.h * Math.PI / 180);
                            vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
                            vehicle.engineOn = false;
                        } catch (err) {
                            alt.log(err);
                        }
                    }, 200);
                }
            }
        },
        leaveClear(player) {
            JobTrash.functions.leaveVehicle(player);
            let team = getTrashTeam(player);
            if (!team) return;
            if (team.leader === player) {
                if (team.target) {
                    team.target.utils.warning("Водитель уволился, бригада расформированна!");
                    alt.emitClient(team.target, "update.trash.vehicle", "cancel", 0, 0);
                    alt.emitClient(team.target, "createPlaceTrasher", 0, 0, 0, false);
                    team.target.utils.putObject();
                }
                JobTrash.teams.splice(JobTrash.teams.indexOf(team), 1);
            } else {
                team.leader.utils.warning("Помощник уволился, бригада расформированна!");
                delete team.target;
            }
        },
        inviteTrashPlayer(player, recId) {
            var rec = alt.Player.getBySqlId(recId);
            if (!rec) return player.utils.error(`Гражданин не найден!`);
            if (rec === player) return player.utils.error(`Вы не можете пригласить себя!`);
            var dist = alt.Player.dist(player.pos, rec.pos);
            if (dist > Config.maxInteractionDist) return player.utils.error(`Гражданин далеко!`);
            if (player.job !== 9) return player.utils.error(`Вы не работаете в Центре утилизации!`);
            if (rec.job !== 9) return player.utils.error(`Игрок не работает в Центре утилизации!`);
            let team = getTrashTeam(player);
            if (team === undefined) return player.utils.error(`Вы не можете пригласить игрока в бригаду!`);
            if (team.target) return player.utils.error(`У вас уже есть 1 участник в бригаде!`);

            rec.inviteOffer = {
                leaderId: player.sqlId
            };

            player.utils.success(`Вы пригласили ${rec.getSyncedMeta("name")} в бригаду`);
            rec.utils.success(`Получено приглашение в бригаду`);
            alt.emitClient(rec, "choiceMenu.show", "acccept_trash_team", {
                name: player.getSyncedMeta("name")
            });
        },
        uninviteTrashPlayer(player, recId) {
            var rec = alt.Player.getBySqlId(recId);
            if (!rec) return player.utils.error(`Гражданин не найден!`);
            if (rec === player) return player.utils.error(`Вы не можете уволить себя!`);
            var dist = alt.Player.dist(player.pos, rec.pos);
            if (dist > Config.maxInteractionDist) return player.utils.error(`Гражданин далеко!`);
            if (player.job !== 9) return player.utils.error(`Вы не работаете в Центре утилизации!`);
            let team = getTrashTeam(player);
            if (team === undefined) return player.utils.error(`Вы не можете уволить игрока из бригады!`);
            if (team.target !== rec) return player.utils.error(`У вас нет участников в бригаде!`);

            player.utils.error("Вы уволили " + rec.getSyncedMeta("name") + " из бригады!");
            rec.utils.error(player.getSyncedMeta("name") + " уволил вас из бригады!");
            player.utils.setLocalVar("trashLeader", 1);
            alt.emitClient(rec, "update.trash.vehicle", "cancel", 0, 0);
            alt.emitClient(rec, "createPlaceTrasher", 0, 0, 0, false);
            delete team.target;
        },
        acceptTrashInvite(player) {
            if (!player.inviteOffer) return player.utils.error(`Предложение не найдено!`);
            var rec = alt.Player.getBySqlId(player.inviteOffer.leaderId);
            if (!rec) return player.utils.error(`Отправитель не найден!`);
            var dist = alt.Player.dist(player.pos, rec.pos);
            if (dist > 5) return player.utils.error(`Отправитель слишком далеко!`);
            if (player.job !== 9) return player.utils.error(`Вы не работаете в Центре утилизации!`);
            if (rec.job !== 9) return player.utils.error(`Отправитель не работает в Центре утилизации!`);
            let team = getTrashTeam(rec);
            if (!team) return player.utils.error(`Отправитель больше не является главой бригады!`);
            let ourteam = getTrashTeam(player);
            if (ourteam) return player.utils.error(`Вы не можете вступить в бригаду!`);
            if (team.target) return player.utils.error(`У отправителя уже полная бригада!`);
            delete player.inviteOffer;

            player.utils.success(`Вы вступили в бригаду!`);
            player.toldpos = player.pos;
            rec.utils.success(`${player.getSyncedMeta("name")} принял приглашение в бригаду!`);
            rec.utils.setLocalVar("trashLeader", 2);
            team.target = player;
            player.utils.success("Направляйтесь к требуемому баку вместе с водителем!");
            
            alt.emitClient(player, "update.trash.vehicle", team.vehicle, team.vehicle.countTrash, JobTrash.trash_max);
            alt.emitClient(player, "createPlaceTrasher", team.place.x, team.place.y, team.place.z, true);
        },
        unacceptTrashInvite(player) {
            if (!player.inviteOffer) return;
            var rec = alt.Player.getBySqlId(player.inviteOffer.leaderId);
            if (rec) rec.utils.error(`${player.getSyncedMeta("name")} отказался вступить в бригаду!`);
        },
    }
}

class TrashTeam {
    constructor(leader, target, vehicle, place) {
        this.leader = leader;
        this.target = target;
        this.vehicle = vehicle;
        this.place = place;
    }
}

function getTrashTeam(data) {
    try {
        for (let i = 0; i < JobTrash.teams.length; i++) {
            if (JobTrash.teams[i].leader === data || JobTrash.teams[i].target === data || JobTrash.teams[i].vehicle === data) {
                return JobTrash.teams[i];
            }
        }
        return undefined;
    } catch (err) {
        alt.log(err);
        return undefined;
    }
}

module.exports = {
    Init: () => {
        DB.Query("SELECT * FROM bins", (e, result) => {
            for (let i = 0; i < result.length; i++) JobTrash.backs.push({
                x: result[i].x,
                y: result[i].y,
                z: result[i].z
            });
        });
    }
}

alt.onClient("trash.team.agree", (player) => {
    try {
        JobTrash.functions.acceptTrashInvite(player);
    } catch (err) {
        alt.log(err);
        return;
    }
});

alt.onClient("trash.team.cancel", (player) => {
    try {
        JobTrash.functions.unacceptTrashInvite(player);
    } catch (err) {
        alt.log(err);
        return;
    }
});

alt.onClient("trash.invite.player", (player, id) => {
    try {
        JobTrash.functions.inviteTrashPlayer(player, id);
    } catch (err) {
        alt.log(err);
        return;
    }
});

alt.onClient("trash.uninvite.player", (player, id) => {
    try {
        JobTrash.functions.uninviteTrashPlayer(player, id);
    } catch (err) {
        alt.log(err);
        return;
    }
});

alt.onClient("take.trash.box", (player) => {
    try {
        player.utils.takeObject("hei_prop_heist_binbag");
        player.hastrash = true;
    } catch (err) {
        alt.log(err);
        return;
    }
});

function putTrashBox(player) {
    player.utils.putObject();
    // delete player.hastrash;
};

alt.onClient("leave.trash.job", (player) => {
    try {
        if (player.job === 9) JobTrash.functions.leaveJob(player);
    } catch (err) {
        alt.log(err);
        return;
    }
});

alt.onClient("job.trash.agree", (player) => {
    try {
        if (player.job !== 0 && player.job !== 9) {
            player.utils.error("Вы уже где-то работаете!");
            return;
        }

        if (player.job === 9) {
            JobTrash.functions.leaveJob(player);
        } else {
            JobTrash.functions.enjoyJob(player);
        }
    } catch (err) {
        alt.log(err);
        return;
    }
});

alt.on("playerDeath", function playerDeathHandler(player, reason, killer) {
    if (player.job === 9) JobTrash.functions.leaveJob(player);
});

alt.onClient("send.trash.end", (player) => {
    try {
        if (player.job === 9) {
            let team = getTrashTeam(player);
            if (!team) return;
            if (team.vehicle.countTrash >= JobTrash.trash_max) {
                player.utils.error("Транспорт уже переполнен, выгрузите мусор на свалку!");
                return;
            }
            let money = Math.trunc(alt.Player.dist(player.pos, player.toldpos) * alt.economy["trash_salary"].value);

            if (money < JobTrash.salary_min) money = JobTrash.salary_min;
            else if (money > JobTrash.salary_max) money = JobTrash.salary_max;

            putTrashBox(player);
            player.toldpos = player.pos;
            team.vehicle.countTrash++;
            player.utils.setMoney(player.money + money);
            alt.logs.addLog(`${player.getSyncedMeta("name")} заработал на работе ${money}$`, 'job', player.account.id, player.sqlId, { money: money });
            player.utils.success("Вы заработали $" + money);
            player.utils.success("Направляйтесь к требуемому баку!");
            if (team.leader === player) {
                let place = getRandomNumber(player);
                team.place = place;
                alt.emitClient(player, "update.trash.vehicle", team.vehicle, team.vehicle.countTrash, JobTrash.trash_max);
                alt.emitClient(player, "createPlaceTrasher", place.x, place.y, place.z, true);
                if (team.target) {
                    if (!team.target.hastrash) return;
                    delete team.target.hastrash, delete player.hastrash;
                    alt.emitClient(team.target, "update.trash.vehicle", team.vehicle, team.vehicle.countTrash, JobTrash.trash_max);
                    alt.emitClient(team.target, "createPlaceTrasher", place.x, place.y, place.z, true);
                }
            } else {
                let nmoney = Math.round(money / 100 * alt.economy["trash_salary_procent"].value);
                if (nmoney < JobTrash.salary_min) nmoney = JobTrash.salary_min;
                else if (nmoney > JobTrash.salary_max) nmoney = JobTrash.salary_max;
                team.leader.utils.success("Прибавка к зарплате $" + nmoney);
                alt.logs.addLog(`${team.leader.name} заработал на работе ${nmoney}$`, 'job', team.leader.account.id, team.leader.sqlId, { money: nmoney });
                team.leader.utils.setMoney(team.leader.money + nmoney);
                alt.emitClient(team.leader, "update.trash.vehicle", team.vehicle, team.vehicle.countTrash, JobTrash.trash_max);
                if (team.leader.hastrash) {
                    delete team.leader.hastrash, delete player.hastrash;
                    alt.emitClient(player, "update.trash.vehicle", team.vehicle, team.vehicle.countTrash, JobTrash.trash_max);
                    alt.emitClient(player, "createPlaceTrasher", team.place.x, team.place.y, team.place.z, true);
                }
            }
        }
    } catch (err) {
        alt.log(err);
        return;
    }
});

alt.on("entityEnterColshape", function onentityEnterColshape(shape, player) {
    try {
        if (!player.vehicle) {
            if (shape === JobTrash.job_colshape) alt.emitClient(player, "getTrashJobStatus", player.job !== 9 ? false : true);
        } else {
            if (shape === JobTrash.trash_colshape) {
                let team = getTrashTeam(player);
                if (team) {
                    if (player.vehicle === team.vehicle) {
                        if (team.vehicle.countTrash < JobTrash.trash_min) {
                            player.utils.error("В транспорте нет мусора!");
                            return;
                        }

                        player.utils.success("Вы разгрузили мусор на свалку!");
                        team.vehicle.countTrash = 0;
                        alt.emitClient(player, "update.trash.vehicle", team.vehicle, 0, JobTrash.trash_max);
                        if (team.target) alt.emitClient(team.target, "update.trash.vehicle", team.vehicle, 0, JobTrash.trash_max);
                    }
                }
            }
        }
    } catch (err) {
        alt.log(err);
        return;
    }
});

alt.on("entityLeaveColshape", function onentityLeaveColshape(player, shape) {
    try {
        if (shape === JobTrash.job_colshape) alt.emitClient(player, "getTrashJobStatus", "cancel");
    } catch (err) {
        alt.log(err);
        return;
    }
});

alt.on("playerEnteredVehicle", function playerEnteredVehicleHandler(player, vehicle, seat) {
    if (vehicle.owner === -9 && player.job === 9 && seat === 1) {
        let vteam = getTrashTeam(vehicle);
        if (vteam !== undefined) {
            if (!alt.Player.exists(vteam.leader)) delete vteam.vehicle;
            else if (getTrashTeam(player).vehicle != vteam.vehicle) delete vteam.vehicle;
            else if (vteam.leader === player) {
                alt.emitClient(player, "time.remove.back.trash");
            } else {
                alt.emitClient(player, `Vehicle::leave`, vehicle);
                player.utils.error("Данное транспортное средство уже занято!");
            }
        } else {
            if (getTrashTeam(player) !== undefined) {
                alt.emitClient(player, `Vehicle::leave`, vehicle);
                player.utils.error("Вы уже заняли одно транспортное средство!");
            } else {
                if (!haveLicense(player, vehicle)) return;
                player.toldpos = player.pos;
                let place = getRandomNumber(player);
                alt.emitClient(player, "createPlaceTrasher", place.x, place.y, place.z, true);
                vehicle.countTrash = 0;
                alt.emitClient(player, "update.trash.vehicle", vehicle, vehicle.countTrash, JobTrash.trash_max);
                player.utils.success("Направляйтесь к требуемому баку!");
                vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
                let team = new TrashTeam(player, undefined, vehicle, place);
                JobTrash.teams.push(team);
                player.utils.setLocalVar("trashLeader", 1);
            }
        }
    }
});

alt.on("playerLeftVehicle", function playerLeftVehicleHandler(player, vehicle) {
    if (vehicle.owner === -9 && player.job === 9) {
        let team = getTrashTeam(player);
        if (team !== undefined) {
            if (team.vehicle === vehicle) {
                alt.emitClient(player, "time.add.back.trash");
                player.utils.error("У вас есть 3 минуты, чтобы вернуться в транспорт.");
            }
        }
    }
});

alt.on("playerDisconnect", function playerDisconnectHandler(player, exitType, reason) {
    try {
        if (player.job === 9) JobTrash.functions.leaveClear(player);
    } catch (err) {
        alt.log(err);
        return;
    }
});

alt.log("[JOB] Trash in Los Santos stared!");

// 0, JobTrash.backs.length
function getRandomNumber(player) {
    try {
        let max = 3; // кол-во попыток
        for (let i = 0; i < max; i++) {
            let buck = JobTrash.backs[grn(0, JobTrash.backs.length - 1)];
            let dist = alt.Player.dist(player.pos, new alt.Vector3(buck.x, buck.y, buck.z));
            if (dist > JobTrash.min_dist && dist < JobTrash.max_dist) return buck;
        }
        return JobTrash.backs[grn(0, JobTrash.backs.length - 1)];
    } catch (err) {
        alt.log(err);
        return -1;
    }
}

function grn(min, max) {
    try {
        return Math.floor(Math.random() * (max - min)) + min;
    } catch (err) {
        alt.log(err);
        return -1;
    }
}

function removeAllHumansFromVehicle(vehicle) {
    try {
        alt.Player.all.forEach((rec) => { if (rec.vehicle && rec.vehicle == vehicle) alt.emitClient(rec, `Vehicle::leave`, vehicle); });
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
