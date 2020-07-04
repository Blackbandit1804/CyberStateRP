const whitelist = require("./modules/whitelist");
const exec = require("exec");

module.exports = {
    "veh": {
        description: "Создать автомобиль.",
        minLevel: 3,
        syntax: "[model]:s",
        handler: async (player, args) => {
            try {
                var pos = player.pos;
                pos.x += 2.0;

                if (!args[0]) return terminal.error(`Модель ${args[0]} не найдена!<br/>Сообщите команде проекта, если Вы не ошиблись в названии.`, player);
                const vehicle = await alt.gameEntityCreate(args[0].trim(), new alt.Vector3(pos.x, pos.y, pos.z), new alt.Vector3(0, 0, 0  * Math.PI / 180));
                if (vehicle === undefined) return terminal.error(`Модель ${args[0]} не найдена!<br/>Сообщите команде проекта, если Вы не ошиблись в названии.`, player);

                vehicle.numberPlateText = "Cyber State";
                vehicle.primaryColor = 0;
                vehicle.secondaryColor = 0;
                vehicle.engineOn = false;
                vehicle.name = args[0];
                vehicle.owner = 0;
                vehicle.utils.setFuel(30);
                vehicle.maxFuel = 70;
                vehicle.dimension = player.dimension;
                vehicle.license = 0;
                terminal.info(`${player.getSyncedMeta("name")} создал авто ${args[0]}`);
                alt.logs.addLog(`${player.getSyncedMeta("name")} создал авто. Марка: ${args[0]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, model: args[0] });
            } catch(err) {
                console.error(err);
            }
        }
    },
    "delete_veh": {
        description: "Удалить авто. Если авто есть в БД, то также удаляется.",
        minLevel: 3,
        syntax: "",
        handler: (player, args) => {
            var veh = player.vehicle;
            if (!veh) return terminal.error(`Вы не в авто!`, player);

            if (veh.sqlId) {
                terminal.info(`${player.getSyncedMeta("name")} удалил авто из БД`, player);
                alt.logs.addLog(`${player.getSyncedMeta("name")} удалил авто из БД`, 'admin', player.account.id, player.sqlId, { level: player.admin });
                DB.Query(`DELETE FROM vehicles WHERE id=?`, [veh.sqlId]);
            } else terminal.info(`${player.getSyncedMeta("name")} удалил авто`, player);
            veh.destroy();
        }
    },
    "veh_color": {
        description: "Изменить цвет авто.",
        minLevel: 3,
        syntax: "[colorA]:n [colorB]:n",
        handler: (player, args) => {
            var veh = player.vehicle;
            if (!veh) return player.utils.error(`Вы не в авто!`, player);
            veh.primaryColor = args[0];
            veh.secondaryColor = args[1];
            alt.logs.addLog(`${player.getSyncedMeta("name")} изменил цвет автомобилия для авто с ID: ${veh.id}`, 'admin', player.account.id, player.sqlId, { level: player.admin, vehId: veh.id });
            terminal.log(`Цвет авто изменен`, player);
        }
    },
    "veh_license": {
        description: "Изменить лицензию для вождения авто. Типы:<br/>1 - авто<br/>2 - мото<br/>3 - Лодка<br/>4 - Яхта<br/>11 - вертолёт<br/>12 - самолёт",
        minLevel: 3,
        syntax: "[license]:n",
        handler: (player, args) => {
            var veh = player.vehicle;
            if (!veh) return player.utils.error(`Вы не в авто!`, player);
            var types = [1, 2, 3, 4, 11, 12];
            if (args[0] && types.indexOf(args[0]) == -1) return terminal.error(`Неверный тип лицензии!`, player);

            veh.utils.setLicense(args[0]);
            alt.logs.addLog(`${player.getSyncedMeta("name")} изменил категорию лицензии для авто с ID: ${veh.id}`, 'admin', player.account.id, player.sqlId, { level: player.admin, vehId: veh.id });
            terminal.info(`${player.getSyncedMeta("name")} изменил категорию лицензии для авто с ID: ${veh.id}`);
        }
    },
    "fix": {
        description: "Починить авто.",
        minLevel: 2,
        syntax: "",
        handler: (player) => {
            if (!player.vehicle) return terminal.error(`Вы не в машине!`, player);
            alt.emitClient(player, `Vehicle::repair`, player.vehicle);
            player.vehicle.utils.setEngineBroken(false);
            player.vehicle.utils.setOilBroken(false);
            player.vehicle.utils.setAccumulatorBroken(false);
            alt.logs.addLog(`${player.getSyncedMeta("name")} починил авто с ID: ${player.vehicle.id}`, 'admin', player.account.id, player.sqlId, { level: player.admin, vehId: player.vehicle.id });
            terminal.info(`${player.getSyncedMeta("name")} починил авто с ID: ${player.vehicle.id}`);
        }
    },
    "tp": {
        description: "Телепортироваться по координатам.",
        minLevel: 2,
        syntax: "[x]:n [y]:n [z]:n",
        handler: (player, args) => {
            player.pos = new alt.Vector3(args[0], args[1], args[2]);
            terminal.info(`Вы телепортировались`, player);
        }
    },
    "tps": {
        description: "Телепортироваться по координатам.",
        minLevel: 2,
        syntax: "[str]:s",
        handler: (player, args) => {
            args = args.map((a) => a.replace(",", "").replace("f", ""));

            player.pos = new alt.Vector3(parseFloat(args[0]), parseFloat(args[1]), parseFloat(args[2]));
            terminal.info(`Вы телепортировались`, player);
        }
    },
    "hp": {
        description: "Пополнить здоровье себе.",
        minLevel: 2,
        syntax: "",
        handler: (player) => {
            player.health = 200;
            terminal.info(`Здоровье пополнено!`, player);
        }
    },
    "armour": {
        description: "Пополнить броню себе.",
        minLevel: 2,
        syntax: "",
        handler: (player) => {
            player.armour = 100;
            terminal.info(`Броня пополнена!`, player);
        }
    },
    "kill": {
        description: "Убить себя.",
        minLevel: 2,
        syntax: "",
        handler: (player) => {
            player.health = 0;
            terminal.info(`Вы убиты!`, player);
        }
    },

    "goto": {
        description: "Телепортироваться к игроку.",
        minLevel: 1,
        syntax: "[id/name]:s",
        handler: (player, args) => {
            if (getPlayerStatus(args[0]) === "on") {
               let recipient = alt.Player.getBySqlId(args[0]);
               if (!recipient) return terminal.error("Игрок не найден!", player);
               var pos = recipient.pos;
               pos.x += 2;
               player.pos = pos;
               player.dimension = recipient.dimension;
               terminal.info(`Вы телепортировались к ${recipient.getSyncedMeta("name")}`, player);
               alt.logs.addLog(`${player.getSyncedMeta("name")} телепортировался к ${recipient.getSyncedMeta("name")}. Координаты: ${recipient.pos}`, 'admin', player.account.id, player.sqlId, { level: player.admin, pos: recipient.pos });
            } else {
                let name = getSpecialName(args[0], player);
                if (!name) return terminal.error(`Формат: Имя_Фамилия`, player);
                let recipient = alt.Player.getByName(name);
                if (!recipient) return terminal.error(`Игрок ${args[0]} не найден!`, player);
                //if (recipient.admin > player.admin) return terminal.error(`Нельзя телепортироваться к админу с более высоким уровнем!`, player);
                var pos = recipient.pos;
                pos.x += 2;
                player.pos = pos;
                player.dimension = recipient.dimension;
                terminal.info(`Вы телепортировались к ${recipient.getSyncedMeta("name")}`, player);
                alt.logs.addLog(`${player.getSyncedMeta("name")} телепортировался к ${recipient.getSyncedMeta("name")}. Координаты: ${recipient.pos}`, 'admin', player.account.id, player.sqlId, { level: player.admin, pos: recipient.pos });
            }
        }
    },
    "gethere": {
        description: "Телепортировать игрока к себе.",
        minLevel: 1,
        syntax: "[id/name]:s",
        handler: (player, args) => {
          if (getPlayerStatus(args[0]) === "on") {
              let recipient = alt.Player.getBySqlId(args[0]);
              if (!recipient) return terminal.error("Игрок не найден!", player);
              var pos = player.pos;
              pos.x += 2;
              recipient.pos = pos;
              recipient.dimension = player.dimension;
              recipient.utils.info(`${player.getSyncedMeta("name")} телепортировал Вас к себе`);
              terminal.info(`${recipient.getSyncedMeta("name")} телепортирован к Вам`, player);
              alt.logs.addLog(`${player.getSyncedMeta("name")} телепортировал к себе ${recipient.getSyncedMeta("name")}. Координаты: ${player.pos}`, 'admin', player.account.id, player.sqlId, { level: player.admin, pos: player.pos });
          } else {
              let name = getSpecialName(args[0], player);
              if (!name) return terminal.error(`Формат: Имя_Фамилия`, player);
              let recipient = alt.Player.getByName(name);
              if (!recipient) return terminal.error(`Игрок ${args[0]} не найден!`, player);
              var pos = player.pos;
              pos.x += 2;
              recipient.pos = pos;
              recipient.dimension = player.dimension;
              recipient.utils.info(`${player.getSyncedMeta("name")} телепортировал Вас к себе`);
              terminal.info(`${recipient.getSyncedMeta("name")} телепортирован к Вам`, player);
              alt.logs.addLog(`${player.getSyncedMeta("name")} телепортировал к себе ${recipient.getSyncedMeta("name")}. Координаты: ${player.pos}`, 'admin', player.account.id, player.sqlId, { level: player.admin, pos: player.pos });
          }
        }
    },
    "sp": {
        description: "Начать слежку за игроком.",
        minLevel: 3,
        syntax: "[player_id]:n",
        handler: (player, args) => {
            var rec = alt.Player.getBySqlId(args[0]);
            if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);
            let pos = player.pos;
            if (player === rec) return terminal.error(`Вы не можете начать за собой слежку!`, player);
            if (!player.lastsp) player.lastsp = {
                x: pos.x,
                y: pos.y,
                z: pos.z,
                h: player.rot,
                dim: player.dimension
            };
            player.setSyncedMeta("ainvis", true);
            player.pos = new alt.Vector3(rec.pos.x, rec.pos.y, rec.pos.z);
            alt.logs.addLog(`${player.getSyncedMeta("name")} начал слжеку за игроком ${rec.getSyncedMeta("name")}. Координаты: ${rec.pos}`, 'admin', player.account.id, player.sqlId, { level: player.admin, pos: rec.pos });
            alt.emitClient(player, `admin.start.spectate`, rec);
        }
    },
    "global": {
        description: "Написать сообщение всем игрокам.",
        minLevel: 3,
        syntax: "[text]:s",
        handler: (player, args) => {
            terminal.info(`${player.getSyncedMeta("name")} написал сообщение всем игрокам`);
            var text = args.join(" ");
            alt.Player.all.forEach((rec) => {
                if (rec.sqlId) alt.emitClient(rec, "chat.custom.push", `<a style="color: ${adm_color}">[A] ${player.getSyncedMeta("name")}:</a> ${text}`, adm_color);
            });
        }
    },
    "del_acc": {
        description: "Удалить аккаунт игрока.",
        minLevel: 7,
        syntax: "[login]:s",
        handler: (player, args) => {
            if(player.account.login == args[0]) return player.utils.error("Нельзя удалить свой же аккаунт");
            alt.Player.all.forEach((rec) => {
                if(rec.sqlId) {
                    if(rec.account.login == args[0]) rec.kick();
                }
            });
            DB.Query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Игрок с логином: ${args[0]} не найден!`, player);
                let rec = result;
                if (rec) {
                    DB.Query("DELETE FROM accounts WHERE login=?", [args[0]], (e, result) => {
                        if (e) return terminal.error(e);
                        if (result.length < 1) return;
                    });
                    DB.Query("SELECT * FROM characters WHERE accountId=?", [result[0].id], (e, result) => {
                        if (e) return terminal.error(e);
                        if (result.length < 1) return;
                        result.forEach((recipient) => {
                            DB.Query("DELETE FROM characters WHERE id=?", [recipient.id], (e, result) => {
                                if (e) return terminal.error(e);
                                if (result.length < 1) return;
                            });
                            DB.Query("SELECT * FROM vehicles WHERE owner=?", [2000 + recipient.id], (e, result) => {
                                if (e) return terminal.error(e);
                                if (result.length < 1) return;
                                result.forEach((recipient) => {
                                    DB.Query("SELECT * FROM vehicles_mods WHERE vehicle_id=?", [recipient.id], (e, result) => {
                                        if (e) return terminal.error(e);
                                        if (result.length < 1) return;
                                        result.forEach((recipient) => {
                                            DB.Query("DELETE FROM vehicles_mods WHERE vehicle_id=?", [recipient.vehicle_id]);
                                        });
                                    });
                                    DB.Query("DELETE FROM vehicles WHERE owner=?", [recipient.owner]);
                                });
                            });
                            DB.Query("SELECT * FROM houses WHERE owner=?", [recipient.id], (e, result) => {
                                if (e) return terminal.error(e);
                                if (result.length < 1) return;
                                result.forEach((recipient) => {
                                    var house = alt.houses.getBySqlId(recipient.id);
                                    house.setOwner(0);
                                });
                            });
                            DB.Query("SELECT * FROM inventory_players WHERE playerId=?", [recipient.id], (e, result) => {
                                if (e) return terminal.error(e);
                                if (result.length < 1) return;
                                result.forEach((recipient) => {
                                    DB.Query("DELETE FROM inventory_players WHERE playerId=?", [recipient.playerId]);
                                });
                            });
                            DB.Query("SELECT * FROM jobs_skills WHERE playerId=?", [recipient.id], (e, result) => {
                                if (e) return terminal.error(e);
                                if (result.length < 1) return;
                                result.forEach((recipient) => {
                                    DB.Query("DELETE FROM jobs_skills WHERE playerId=?", [recipient.playerId]);
                                });
                            });
                            DB.Query("SELECT * FROM bizes WHERE owner=?", [recipient.id], (e, result) => {
                                if (e) return terminal.error(e);
                                if (result.length < 1) return;
                                result.forEach((recipient) => {
                                    var biz = alt.bizes.getBySqlId(recipient.id);
                                    biz.setOwner(0);
                                });
                            });
                            DB.Query("SELECT * FROM characters_headoverlays WHERE character_id=?", [recipient.id], (e, result) => {
                                if (e) return terminal.error(e);
                                if (result.length < 1) return;
                                result.forEach((recipient) => {
                                    DB.Query("DELETE FROM characters_headoverlays WHERE character_id=?", [recipient.character_id]);
                                });
                            });
                        });


                        terminal.info(`${player.getSyncedMeta("name")} удалил аккаунт ${args[0]}`);
                        alt.logs.addLog(`${player.getSyncedMeta("name")} удалил аккаунт ${args[0]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, login: args[0] });
                        alt.logs.addLog(`${args[0]} удален из базы данных`, 'admin', result[0].id, 0, { login: args[0] });
                    });
                }
            });
        }
    },
    "del_char": {
        description: "Удалить персонажа аккаунта.",
        minLevel: 7,
        syntax: "[name]:s",
        handler: (player, args) => {
            let name = getSpecialName(args[0], player);
            if (!name) return terminal.error(`Формат: Имя_Фамилия`, player);
            if (player.getSyncedMeta("name") == args[0]) return player.utils.error("Нельзя удалить своего же персонажа!");

            alt.Player.all.forEach((rec) => {
                if (rec.sqlId) {
                    if (rec.getSyncedMeta("name") == name) rec.kick();
                }
            });

            DB.Query("SELECT * FROM characters WHERE name=?", [name], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return;

                DB.Query("DELETE FROM characters WHERE id=?", [result[0].id], (e, result) => {
                    if (e) return terminal.error(e);
                    if (result.length < 1) return;
                });

                DB.Query("SELECT * FROM vehicles WHERE owner=?", [2000 + recipient.id], (e, result) => {
                    if (e) return terminal.error(e);
                    if (result.length < 1) return;
                    result.forEach((recipient) => {
                        DB.Query("SELECT * FROM vehicles_mods WHERE vehicle_id=?", [recipient.id], (e, result) => {
                            if (e) return terminal.error(e);
                            if (result.length < 1) return;
                            result.forEach((recipient) => {
                                DB.Query("DELETE FROM vehicles_mods WHERE vehicle_id=?", [recipient.vehicle_id]);
                            });
                        });
                        DB.Query("DELETE FROM vehicles WHERE owner=?", [recipient.owner]);
                    });
                });

                DB.Query("SELECT * FROM inventory_players WHERE playerId=?", [recipient.id], (e, result) => {
                    if (e) return terminal.error(e);
                    if (result.length < 1) return;
                    result.forEach((recipient) => {
                        DB.Query("DELETE FROM inventory_players WHERE playerId=?", [recipient.playerId]);
                    });
                });

                DB.Query("SELECT * FROM jobs_skills WHERE playerId=?", [recipient.id], (e, result) => {
                    if (e) return terminal.error(e);
                    if (result.length < 1) return;
                    result.forEach((recipient) => {
                        DB.Query("DELETE FROM jobs_skills WHERE playerId=?", [recipient.playerId]);
                    });
                });

                DB.Query("SELECT * FROM houses WHERE owner=?", [result[0].id], (e, result) => {
                    if (e) return terminal.error(e);
                    if (result.length < 1) return;
                    result.forEach((recipient) => {
                        var house = alt.houses.getBySqlId(recipient.id);
                        house.setOwner(0);
                    });
                });
                DB.Query("SELECT * FROM bizes WHERE owner=?", [result[0].id], (e, result) => {
                    if (e) return terminal.error(e);
                    if (result.length < 1) return;
                    result.forEach((recipient) => {
                        var biz = alt.bizes.getBySqlId(recipient.id);
                        biz.setOwner(0);
                    });
                });

                DB.Query("SELECT * FROM characters_headoverlays WHERE character_id=?", [result[0].id], (e, result) => {
                    if (e) return terminal.error(e);
                    if (result.length < 1) return;
                    result.forEach((recipient) => {
                        DB.Query("DELETE FROM characters_headoverlays WHERE character_id=?", [recipient.character_id]);
                    });
                });

                terminal.info(`${player.getSyncedMeta("name")} удалил персонажа ${name}`);
                alt.logs.addLog(`${player.getSyncedMeta("name")} удалил персонажа ${name}`, 'admin', player.account.id, player.sqlId, { level: player.admin, name: name });
                alt.logs.addLog(`${name} удален из базы данных`, 'admin', result[0].id, 0, { name: name });

            });
        }
    },
    "get_login_name": {
        description: "Узнать логин аккаунта по игровому никнеймы.",
        minLevel: 7,
        syntax: "[name]:s",
        handler: (player, args) => {
            let name = getSpecialName(args[0], player);
            if (!name) return terminal.error(`Формат: Имя_Фамилия`, player);
            DB.Query("SELECT * FROM characters WHERE name=?", [name], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Игрок с Имя_Фамилия: ${args[0]} не найден!`, player);
                let rec = result[0];
                if (rec) {
                    DB.Query("SELECT * FROM accounts WHERE id=?", [rec.accountId], (e, result) => {
                        terminal.info(`${player.getSyncedMeta("name")} посмотрел логин персонажа ${name}`);
                        terminal.log(`Login: <b>${result[0].login}</b><br/>`, player);
                        alt.logs.addLog(`${player.getSyncedMeta("name")} посмотрел логин персонажа ${name}`, 'admin', player.account.id, player.sqlId, { level: player.admin, name: name });
                    });
                }
            });
        }
    },
    "get_login_sc": {
        description: "Узнать логин аккаунта по игровому никнеймы.",
        minLevel: 7,
        syntax: "[socialClub]:s",
        handler: (player, args) => {
            DB.Query("SELECT * FROM accounts WHERE socialClub=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Игрок с SC: ${args[0]} не найден!`, player);
                let rec = result[0];
                if (rec) {
                    terminal.info(`${player.getSyncedMeta("name")} посмотрел логин персонажа ${args[0]}`);
                    terminal.log(`Login: <b>${rec.login}</b><br/>`, player);
                    alt.logs.addLog(`${player.getSyncedMeta("name")} посмотрел логин персонажа ${args[0]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, socialClub: args[0] });
                }
            });
        }
    },
    "info_acc": {
        description: "Информация об аккаунте.",
        minLevel: 7,
        syntax: "[login]:s",
        handler: (player, args) => {
            DB.Query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Игрок с логином: ${args[0]} не найден!`, player);
                let rec = result[0];
                if (rec) {
                    terminal.info(`${player.getSyncedMeta("name")} посмотрел информацию об аккаунте ${args[0]}`);
                    terminal.log(`Login: <b>${rec.login}</b><br/>SC: <b>${rec.socialId}</b><br/>Email: <b>${rec.email} (${rec.confirmEmail === 1 ? 'Подтвержден' : 'Не подтвержден'})</b><br/>RegIP: <b>${rec.regIp}</b><br/>LastIP: <b>${rec.lastIp}</b><br/>LastDate: <b>${rec.lastDate}</b><br/>`, player);
                    alt.logs.addLog(`${player.getSyncedMeta("name")} посмотрел информацию об аккаунте ${args[0]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, login: args[0] });
                }
            });
        }
    },
    "info_id": {
        description: "Узнать ID по дате. Пример: 101 2019-04-22 16:23",
        minLevel: 6,
        syntax: "[id]:n [date]:s [time]:s",
        handler: (player, args) => {
            DB.Query("SELECT * FROM logs WHERE message LIKE '%[?] авторизовался%' AND created_at < (?) ORDER BY created_at DESC LIMIT 1", [args[0], args[1] + ' ' + args[2]], (e, result) => {
                if (e) return alt.log(e);
                if (result.length < 1) return terminal.error(`Игрок с ID ${args[0]} по дате: ${args[1] + ' ' + args[2]} не найден!`, player);
                let rec = result[0];
                if (rec) {
                    DB.Query("SELECT * FROM characters WHERE id=?", [result[0].characterId], (e, result) => {
                        if (e) return terminal.error(e);
                        let rec = alt.Player.getBySqlId(result[0].characterId);
                        if (!rec) terminal.log(`Name: <b>${result[0].name}</b><br/>Статус: <b>Оффлайн</b><br/>`, player);
                        else terminal.log(`Name: <b>${rec.getSyncedMeta("name")}</b><br/>Id: <b>${rec.sqlId}</b><br/>Статус: <b>Онлайн</b><br/>`, player);
                        alt.logs.addLog(`${player.getSyncedMeta("name")} посмотрел ID игрока ${result[0].name} по дате ${args[1]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, id: args[0], date: args[1] + ' ' + args[2] });
                    });
                }
            });
        }
    },
    "change_login": {
        description: "Изменить логин.",
        minLevel: 7,
        syntax: "[oldLogin]:s [login]:s",
        handler: (player, args) => {
            DB.Query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Игрок с логином: ${args[0]} не найден!`, player);
                let rec = result[0];
                let recPlayer = alt.Player.getByLogin(args[0]);
                if (rec) {
                    terminal.info(`${player.getSyncedMeta("name")} изменил аккаунту ${result[0].login} с логина ${args[0]} на логин ${args[1]}`);
                    alt.logs.addLog(`${player.getSyncedMeta("name")} изменил аккаунту ${result[0].login} с логина ${args[0]} на логин ${args[1]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, oldLogin: args[0], login: args[1] });
                    if(recPlayer) {
                        recPlayer.account.login = args[1];
                        recPlayer.utils.success(`Администратор ${player.getSyncedMeta("name")} изменил Вам логин аккаунт на ${args[1]}`);
                    }
                    DB.Query(`UPDATE accounts SET login=? WHERE login=?`, [args[1], args[0]]);
                }
            });
        }
    },
    "change_sc": {
        description: "Сменить SC.",
        minLevel: 7,
        syntax: "[oldSC]:s [SC]:s",
        handler: (player, args) => {
            DB.Query("SELECT * FROM accounts WHERE socialClub=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Игрок с SC: ${args[0]} не найден!`, player);
                let rec = result[0];
                let recPlayer = alt.Player.getBySocialClub(args[0]);
                if (rec) {
                    terminal.info(`${player.getSyncedMeta("name")} изменил аккаунту ${result[0].login} с SC ${args[0]} на SC ${args[1]}`);
                    alt.logs.addLog(`${player.getSyncedMeta("name")} изменил аккаунту ${result[0].login} с SC ${args[0]} на SC ${args[1]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, oldSC: args[0], SC: args[1] });
                    DB.Query(`UPDATE accounts SET socialClub=? WHERE socialClub=?`, [args[1], args[0]]);
                    if(recPlayer) {
                        recPlayer.socialId = args[1];
                        recPlayer.utils.success(`Администратор ${player.getSyncedMeta("name")} изменил Вам socialClub аккаунта на ${args[1]}`);
                    }
                }
            });
        }
    },
    "change_name": {
        description: "Сменить имя персонажа.",
        minLevel: 6,
        syntax: "[oldName]:s [newName]:s",
        handler: (player, args) => {
            let name = getSpecialName(args[0], player);
            if (!name) return terminal.error(`Формат: Имя_Фамилия`, player);
            let newName = getSpecialName(args[1], player);
            if (!newName) return terminal.error(`Формат: Имя_Фамилия`, player);
            DB.Query(`SELECT * FROM characters WHERE name=?`, [name], (e, result) => {
                if (e) return alt.log(e);
                if (result.length < 1) return terminal.error(`Игрок с именем: ${args[0]} не найден!`, player);
                player.utils.changeName(name, newName);
                terminal.info(`${player.getSyncedMeta("name")} изменил имя персонажа ${args[0]} на ${args[1]}`);
                alt.logs.addLog(`${player.getSyncedMeta("name")} изменил имя персонажа ${args[0]} на ${args[1]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, pass: args[1], login: args[0] });
            });
        },
    },
    "change_character": {
        description: "Смена внешности.",
        minLevel: 6,
        syntax: "[id/name]:s",
        handler: (player, args) => {
            if (getPlayerStatus(args[0]) === "on") {
                let rec = alt.Player.getBySqlId(args[0]);
                if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);
                if (rec) {
                    alt.emit(`initChangeCharacter`, rec);
                }
            } else {
                let name = getSpecialName(args[0], player);
                if (!name) return terminal.error(`Формат: Имя_Фамилия`, player);
                DB.Query("SELECT * FROM characters WHERE name=?", [name], (e, result) => {
                    if (e) return terminal.error(e);
                    if (result.length < 1) return terminal.error(`Игрок с именем: ${name} не найден!`, player);
                    let rec = result[0];
                    let recPlayer = alt.Player.getBySqlId(result[0].id);
                    if (rec) {
                        if (recPlayer) {
                            alt.emit(`initChangeCharacter`, recPlayer);
                        }
                    }
                });
            }
        },
    },
    "change_pass": {
        description: "Сменить пароль.",
        minLevel: 7,
        syntax: "[login]:s [pass]:s",
        handler: (player, args) => {
            DB.Query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Игрок с логином: ${args[0]} не найден!`, player);
                let rec = result[0];
                let recPlayer = alt.Player.getByLogin(args[0]);
                if (rec) {
                    terminal.info(`${player.getSyncedMeta("name")} изменил пароль аккаунта ${args[0]} на ${args[1]}`, player);
                    alt.logs.addLog(`${player.getSyncedMeta("name")} изменил пароль аккаунта ${args[0]} на ${args[1]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, pass: args[1], login: args[0] });
                    DB.Query(`UPDATE accounts SET password=? WHERE login=?`, [bcrypt.hashSync(args[1]), args[0]]);
                    if (recPlayer) recPlayer.utils.success(`Администратор ${player.getSyncedMeta("name")} изменил Вам пароль аккаунта на ${args[1]}`);
                }
            });
        }
    },
    "change_email": {
        description: "Изменить почту.",
        minLevel: 7,
        syntax: "[login]:s [email]:s",
        handler: (player, args) => {
            DB.Query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Игрок с логином: ${args[0]} не найден!`, player);
                let rec = result[0];
                let recPlayer = alt.Player.getByLogin(args[0]);
                if (rec) {
                    terminal.info(`${player.getSyncedMeta("name")} изменил почту аккаунта ${args[0]} на ${args[1]}`, player);
                    alt.logs.addLog(`${player.getSyncedMeta("name")} изменил почту аккаунта ${args[0]} на ${args[1]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, email: args[1], login: args[0] });
                    DB.Query(`UPDATE accounts SET email=? WHERE login=?`, [args[1], args[0]]);
                    if (recPlayer) recPlayer.utils.success(`Администратор ${player.getSyncedMeta("name")} изменил Вам email аккаунта на ${args[1]}`);
                }
            });
        }
    },
    "email_confirm": {
        description: "Подтвердить почту. Статус 1 - подтвержден, 0 - не подтвержден.",
        minLevel: 7,
        syntax: "[login]:s [status]:n",
        handler: (player, args) => {
            DB.Query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Игрок с логином: ${args[0]} не найден!`, player);
                let rec = result[0];
                let recPlayer = alt.Player.getByLogin(args[0]);
                if (rec) {
                    terminal.info(`${player.getSyncedMeta("name")} изменил статус почты аккаунта ${args[0]} на ${args[1] === 1 ? 'Подтвержден' : "Не подтвержден"}`);
                    alt.logs.addLog(`${player.getSyncedMeta("name")} изменил статус почты аккаунта ${args[0]} на ${args[1] === 1 ? 'Подтвержден' : "Не подтвержден"}`, 'admin', player.account.id, player.sqlId, { level: player.admin, email: result[0].confirmEmail, status: args[1], login: args[0] });
                    DB.Query(`UPDATE accounts SET confirmEmail=? WHERE login=?`, [args[1], args[0]]);
                    if (recPlayer) {
                        recPlayer.account.confirmEmail = args[1];
                        recPlayer.utils.success(`Администратор ${player.getSyncedMeta("name")} изменил Вам статус email аккаунта на ${args[1] === 1 ? 'Подтвержден' : "Не подтвержден"}`);
                    }
                }
            });
        }
    },
    "info_rpr": {
        description: "Информация об аккаунте.",
        minLevel: 7,
        syntax: "[login]:s",
        handler: (player, args) => {
            DB.Query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Игрок с логином: ${args[0]} не найден!`, player);
                let rec = result[0];
                if (rec) {
                    terminal.info(`${player.getSyncedMeta("name")} посмотрел информацию об RP рейтинге аккаунта ${args[0]}`);
                    terminal.log(`Login: <b>${result[0].login}</b><br/>RP рейтинг: <b>${result[0].rp}</b><br/>`, player);
                    alt.logs.addLog(`${player.getSyncedMeta("name")} посмотрел информацию об RP рейтинге аккаунта ${args[0]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, login: args[0] });
                }
            });
        }
    },
    "set_rpr": {
        description: "Установить RP рейтинг.",
        minLevel: 7,
        syntax: "[login]:s [RP]:n",
        handler: (player, args) => {
            DB.Query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Игрок с логином: ${args[0]} не найден!`, player);
                let rec = result[0];
                let recPlayer = alt.Player.getByLogin(args[0]);
                if (rec) {
                    terminal.info(`${player.getSyncedMeta("name")} установил ${args[1]} RP рейтинг аккаунту ${args[0]}`);
                    alt.logs.addLog(`${player.getSyncedMeta("name")} установил ${args[1]} RP рейтинг аккаунту ${args[0]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, rp: args[1], login: args[0] });
                    if(recPlayer) recPlayer.utils.success(`Администратор ${player.getSyncedMeta("name")} установил Вам RP рейтинг аккаунта на ${args[1]}`);
                    DB.Query(`UPDATE accounts SET rp=? WHERE login=?`, [args[1], args[0]]);
                }
            });
        }
    },
    "give_rpr": {
        description: "Выдать RP рейтинг.",
        minLevel: 7,
        syntax: "[login]:s [RP]:n",
        handler: (player, args) => {
            DB.Query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Игрок с логином: ${args[0]} не найден!`, player);
                let rec = result[0];
                let recPlayer = alt.Player.getByLogin(args[0]);
                if (rec) {
                    terminal.info(`${player.getSyncedMeta("name")} добавил ${args[1]} RP рейтинга аккаунту ${args[0]}`);
                    alt.logs.addLog(`${player.getSyncedMeta("name")} добавил ${args[1]} RP рейтинга аккаунту ${args[0]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, rp: result[0].rp + args[1], login: args[0] });
                    if(recPlayer) recPlayer.utils.success(`Администратор ${player.getSyncedMeta("name")} добавил Вам ${args[1]} RP рейтинг аккаунта`);
                    DB.Query(`UPDATE accounts SET rp=rp + ? WHERE login=?`, [args[1], args[0]]);
                }
            });
        }
    },
    "take_rpr": {
        description: "Забрать RP рейтинг.",
        minLevel: 7,
        syntax: "[login]:s [RP]:n",
        handler: (player, args) => {
            DB.Query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Игрок с логином: ${args[0]} не найден!`, player);
                let rec = result[0];
                let recPlayer = alt.Player.getByLogin(args[0]);
                if (rec) {
                    if (args[1] > result[0].rp) return player.utils.error(`Игрок имеет только ${result[0].rp} VC!`)
                    terminal.info(`${player.getSyncedMeta("name")} забрал ${args[1]} RP рейтинга у аккаунта ${args[0]}`);
                    alt.logs.addLog(`${player.getSyncedMeta("name")} забрал ${args[1]} RP рейтинга у аккаунта ${args[0]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, rp: result[0].rp - args[1], login: args[0] });
                    if (recPlayer) recPlayer.utils.success(`Администратор ${player.getSyncedMeta("name")} забрал у Вас ${args[1]} RP рейтинга аккаунта`);
                    DB.Query(`UPDATE accounts SET rp=rp - ? WHERE login=?`, [args[1], args[0]]);
                }
            });
        }
    },
    "info_vc": {
        description: "Информация о VC.",
        minLevel: 7,
        syntax: "[login]:s",
        handler: (player, args) => {
            DB.Query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Игрок с логином: ${args[0]} не найден!`, player);
                let rec = result[0];
                if (rec) {
                    terminal.info(`${player.getSyncedMeta("name")} посмотрел информацию об VC аккаунта ${args[0]}`);
                    terminal.log(`Login: <b>${result[0].login}</b><br/>VC: <b>${result[0].donate}</b><br/>`, player);
                    alt.logs.addLog(`${player.getSyncedMeta("name")} посмотрел информацию об VC аккаунта ${args[0]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, login: args[0] });
                }
            });
        }
    },
    "set_money": {
        description: "Установить деньги.",
        minLevel: 7,
        syntax: "[money]:n [id/name]:s",
        handler: (player, args) => {
            if (getPlayerStatus(args[1]) === "on") {
                let rec = alt.Player.getBySqlId(args[1]);
                if (!rec) return terminal.error(`Игрок с ID: ${args[1]} не найден!`, player);

                rec.utils.setMoney(args[0]);
                rec.utils.success(`Администратор ${player.getSyncedMeta("name")} установил Вам ${args[0]}$ денег`);

                terminal.info(`${player.getSyncedMeta("name")} установил ${args[0]}$ денег персонажу ${rec.getSyncedMeta("name")}`);
                alt.logs.addLog(`${player.getSyncedMeta("name")} установил ${args[0]}$ денег персонажу ${rec.getSyncedMeta("name")}`, 'admin', player.account.id, player.sqlId, { level: player.admin, money: rec.money, name: rec.getSyncedMeta("name") });
                alt.logs.addLog(`У аккаунта ${args[1]} установил ${player.getSyncedMeta("name")} - ${args[0]}$ денег`, 'admin', rec.account.id, rec.sqlId, { level: player.admin, money: rec.money, name: rec.getSyncedMeta("name") });
            } else {
                let name = getSpecialName(args[0], player);
                if (!name) return terminal.error(`Формат: Имя_Фамилия`, player);
                DB.Query("SELECT * FROM characters WHERE name=?", [name], (e, result) => {
                    if (e) return terminal.error(e);
                    if (result.length < 1) return terminal.error(`Игрок с именем: ${name} не найден!`, player);
                    let rec = result[0];
                    let recPlayer = alt.Player.getBySqlId(result[0].id);
                    if (rec) {
                        if(recPlayer) {
                            recPlayer.utils.setMoney(args[0]);
                            recPlayer.utils.success(`Администратор ${player.getSyncedMeta("name")} установил Вам деньги аккаунта на ${args[1]}`);
                        } else {
                            DB.Query(`UPDATE characters SET money=? WHERE name=?`, [args[1], name]);
                        }

                        terminal.info(`${player.getSyncedMeta("name")} установил ${args[1]} денег персонажу ${name}`);
                        alt.logs.addLog(`${player.getSyncedMeta("name")} установил ${args[1]} денег персонажу ${name}`, 'admin', player.account.id, player.sqlId, { level: player.admin, money: rec.money, name: name });
                        alt.logs.addLog(`У аккаунта ${args[0]} установил ${player.getSyncedMeta("name")} - ${args[1]} денег`, 'admin', result[0].accountId, result[0].id, { level: player.admin, money: rec.money, name: name });

                    }
                });
            }
        }
    },
    "give_money": {
        description: "Выдать деньги.",
        minLevel: 7,
        syntax: "[money]:n [id/name]:s",
        handler: (player, args) => {
            if (getPlayerStatus(args[1]) === "on") {
                let rec = alt.Player.getBySqlId(args[1]);
                if (!rec) return terminal.error(`Игрок с ID: ${args[1]} не найден!`, player);

                rec.utils.setMoney(rec.money + args[0]);
                rec.utils.success(`Администратор ${player.getSyncedMeta("name")} добавил Вам ${args[0]}$ денег`);

                terminal.info(`${player.getSyncedMeta("name")} добавил ${args[0]}$ денег персонажу ${rec.getSyncedMeta("name")}`);
                alt.logs.addLog(`${player.getSyncedMeta("name")} добавил ${args[0]}$ денег персонажу ${rec.getSyncedMeta("name")}`, 'admin', player.account.id, player.sqlId, { level: player.admin, money: rec.money, name: rec.getSyncedMeta("name") });
                alt.logs.addLog(`У аккаунта ${args[1]} добавил ${player.getSyncedMeta("name")} - ${args[0]}$ денег`, 'admin', rec.account.id, rec.sqlId, { level: player.admin, money: rec.money, name: rec.getSyncedMeta("name") });
            } else {
                let name = getSpecialName(args[1], player);
                if (!name) return terminal.error(`Формат: Имя_Фамилия`, player);
                DB.Query("SELECT * FROM characters WHERE name=?", [name], (e, result) => {
                    if (e) return terminal.error(e);
                    if (result.length < 1) return terminal.error(`Игрок с именем: ${name} не найден!`, player);
                    let rec = result[0];
                    let recPlayer = alt.Player.getBySqlId(result[0].id);
                    if (rec) {
                        if (recPlayer) {
                            recPlayer.utils.setMoney(recPlayer.money + args[0]);
                            recPlayer.utils.success(`Администратор ${player.getSyncedMeta("name")} добавил Вам ${args[0]}$ денег`);
                        } else {
                            DB.Query(`UPDATE characters SET money=money + ? WHERE name=?`, [args[0], name]);
                        }
                        terminal.info(`${player.getSyncedMeta("name")} добавил ${args[0]}$ денег персонажу ${name}`);
                        alt.logs.addLog(`${player.getSyncedMeta("name")} добавил ${args[0]}$ денег персонажу ${name}`, 'admin', player.account.id, player.sqlId, { level: player.admin, money: rec.money, name: name });
                        alt.logs.addLog(`У аккаунта ${args[1]} добавил ${player.getSyncedMeta("name")} - ${args[0]}$ денег`, 'admin', result[0].accountId, result[0].id, { level: player.admin, money: rec.money, name: name });
                    }
                });
            }
        }
    },
    "take_money": {
        description: "Забрать деньги.",
        minLevel: 7,
        syntax: "[money]:n [id/name]:s",
        handler: (player, args) => {
            if (getPlayerStatus(args[1]) === "on") {
                let rec = alt.Player.getBySqlId(args[1]);
                if (!rec) return terminal.error(`Игрок с ID: ${args[1]} не найден!`, player);
                if (args[0] > rec.money) return player.utils.error(`Игрок имеет только ${rec.money} денег!`);
                rec.utils.success(`Администратор ${player.getSyncedMeta("name")} забрал у Вас ${args[0]}$ денег`);
                rec.utils.setMoney(rec.money - args[0]);
                terminal.info(`${player.getSyncedMeta("name")} забрал ${args[0]}$ денег у персонажа ${rec.getSyncedMeta("name")}`);
                alt.logs.addLog(`${player.getSyncedMeta("name")} забрал ${args[0]}$ денег у персонажа ${rec.getSyncedMeta("name")}`, 'admin', player.account.id, player.sqlId, { level: player.admin, money: rec.money, name: rec.getSyncedMeta("name") });
                alt.logs.addLog(`У аккаунта ${args[1]} забрал ${player.getSyncedMeta("name")} - ${args[0]}$ денег`, 'admin', rec.account.id, rec.sqlId, { level: player.admin, money: rec.money, name: rec.getSyncedMeta("name") });
            } else {
                let name = getSpecialName(args[1], player);
                if (!name) return terminal.error(`Формат: Имя_Фамилия`, player);
                DB.Query("SELECT * FROM characters WHERE name=?", [name], (e, result) => {
                    if (e) return terminal.error(e);
                    if (result.length < 1) return terminal.error(`Игрок с именем: ${name} не найден!`, player);
                    let rec = result[0];
                    let recPlayer = alt.Player.getBySqlId(result[0].id);
                    if (rec) {
                        if (args[0] > result[0].money) return player.utils.error(`Игрок имеет только ${result[0].money}$ денег!`);
                        if (recPlayer) {
                            recPlayer.utils.success(`Администратор ${player.getSyncedMeta("name")} забрал у Вас ${args[0]}$ денег`);
                            recPlayer.utils.setMoney(recPlayer.money - args[0]);
                        } else {
                            DB.Query(`UPDATE characters SET money=money - ? WHERE name=?`, [args[0], name]);
                        }

                        terminal.info(`${player.getSyncedMeta("name")} забрал ${args[0]}$ денег у персонажа ${name}`);
                        alt.logs.addLog(`${player.getSyncedMeta("name")} забрал ${args[0]}$ денег у персонажа ${name}`, 'admin', player.account.id, player.sqlId, { level: player.admin, money: result[0].money, name: name });
                        alt.logs.addLog(`У аккаунта ${args[1]} установил ${player.getSyncedMeta("name")} - ${args[0]}$ денег`, 'admin', result[0].accountId, result[0].id, { level: player.admin, money: result[0].money, name: name });

                    }
                });
            }
        }
    },
    "set_vc": {
        description: "Установить VC.",
        minLevel: 7,
        syntax: "[name]:s [VC]:n",
        handler: (player, args) => {
            DB.Query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Игрок с логином: ${args[0]} не найден!`, player);
                let rec = result[0];
                let recPlayer = alt.Player.getByLogin(args[0]);
                if (rec) {

                    if (recPlayer) {
                        recPlayer.utils.setDonate(args[1]);
                        recPlayer.utils.success(`Администратор ${player.getSyncedMeta("name")} установил Вам VC аккаунта на ${args[1]}`);
                    } else {
                        DB.Query(`UPDATE accounts SET donate=? WHERE login=?`, [args[1], args[0]]);
                    }

                    terminal.info(`${player.getSyncedMeta("name")} установил ${args[1]} VC аккаунту ${args[0]}`);
                    alt.logs.addLog(`${player.getSyncedMeta("name")} установил ${args[1]} VC аккаунту ${args[0]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, donate: args[1], login: args[0] });
                    alt.logs.addLog(`У аккаунта ${args[0]} установил ${player.getSyncedMeta("name")} - ${args[1]} VC`, 'admin', result[0].id, 0, { level: player.admin, donate: args[1], login: args[0] });
                }
            });
        }
    },
    "give_vc": {
        description: "Выдать VC.",
        minLevel: 7,
        syntax: "[login]:s [VC]:n",
        handler: (player, args) => {
            DB.Query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Игрок с логином: ${args[0]} не найден!`, player);
                let rec = result[0];
                let recPlayer = alt.Player.getByLogin(args[0]);
                if (rec) {
                    if(recPlayer) {
                        recPlayer.utils.setDonate(recPlayer.account.donate + args[1]);
                        recPlayer.utils.success(`Администратор ${player.getSyncedMeta("name")} добавил Вам ${args[1]} VC аккаунта`);
                    } else {
                        DB.Query(`UPDATE accounts SET donate=donate + ? WHERE login=?`, [args[1], args[0]]);
                    }

                    terminal.info(`${player.getSyncedMeta("name")} добавил ${args[1]} VC аккаунту ${args[0]}`);
                    alt.logs.addLog(`${player.getSyncedMeta("name")} добавил ${args[1]} VC аккаунту ${args[0]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, donate: result[0].donate + args[1], login: args[0] });
                    alt.logs.addLog(`У аккаунта ${args[0]} добавил ${player.getSyncedMeta("name")} - ${args[1]} VC`, 'admin', result[0].id, 0, { level: player.admin, donate: result[0].donate + args[1], login: args[0] });
                }
            });
        }
    },
    "take_vc": {
        description: "Забрать VC.",
        minLevel: 7,
        syntax: "[login]:s [VC]:n",
        handler: (player, args) => {
            DB.Query("SELECT * FROM accounts WHERE login=?", [args[0]], (e, result) => {
                if (e) return terminal.error(e);
                if (result.length < 1) return terminal.error(`Игрок с логином: ${args[0]} не найден!`, player);
                let rec = result[0];
                let recPlayer = alt.Player.getByLogin(args[0]);
                if (rec) {
                    if (args[1] > result[0].donate) return player.utils.error(`Игрок имеет только ${result[0].donate} VC!`);
                    if (recPlayer) {
                        recPlayer.utils.success(`Администратор ${player.getSyncedMeta("name")} забрал у Вас ${args[1]} VC аккаунта`);
                        recPlayer.utils.setDonate(recPlayer.account.donate - args[1]);
                    } else {
                        DB.Query(`UPDATE accounts SET donate=donate - ? WHERE login=?`, [args[1], args[0]]);
                    }

                    terminal.info(`${player.getSyncedMeta("name")} забрал ${args[1]} VC у аккаунта ${args[0]}`);
                    alt.logs.addLog(`${player.getSyncedMeta("name")} забрал ${args[1]} VC у аккаунта ${args[0]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, donate: result[0].donate - args[1], login: args[0] });
                    alt.logs.addLog(`У аккаунта ${args[0]} забрал ${player.getSyncedMeta("name")} - ${args[1]} VC`, 'admin', result[0].id, 0, { level: player.admin, donate: result[0].donate - args[1], login: args[0] });
                }
            });
        }
    },
    "unsp": {
        description: "Закончить слежку за игроком.",
        minLevel: 3,
        syntax: "",
        handler: (player, args) => {
            if (!player.lastsp) return terminal.error(`Вы не ведете слежку!`, player);
            player.setSyncedMeta("ainvis", null);
            alt.emitClient(player, `admin.start.spectate`, undefined);
            player.alpha = 255;
            player.pos = new alt.Vector3(player.lastsp.x, player.lastsp.y, player.lastsp.z);
            player.rot = new alt.Vector3(0, 0, player.lastsp.h);
            player.dimension = player.lastsp.dim;
            player.utils.error("Вы прекратили слежку!");
            delete player.lastsp;
        }
    },
    "kick": {
        description: "Кикнуть игрока с сервера.",
        minLevel: 1,
        syntax: "[playerId]:n [reason]:s",
        handler: (player, args) => {
            var recipient = alt.Player.getBySqlId(args[0]);
            if (!recipient) return terminal.error("Игрок не найден!", player);
            args.splice(0, 1);
            var reason = args.join(" ");
            recipient.utils.error(`${player.getSyncedMeta("name")} кикнул Вас`);
            recipient.utils.error(`Причина: ${reason}`);
            recipient.kick();
            terminal.info(`${player.getSyncedMeta("name")} кикнул ${recipient.getSyncedMeta("name")}: ${reason}`);
            alt.logs.addLog(`${player.getSyncedMeta("name")} кикнул ${recipient.getSyncedMeta("name")}. Причина: ${reason}`, 'admin', player.account.id, player.sqlId, { level: player.admin, reason: reason });
            alt.logs.addLog(`${recipient.getSyncedMeta("name")} был кикнут администратором ${player.getSyncedMeta("name")}. Причина: ${reason}`, 'admin', recipient.account.id, recipient.sqlId, { level: player.admin, reason: reason });
            alt.Player.all.forEach((rec) => {
                if (rec.sqlId) alt.emitClient(rec, "chat.custom.push", `<a style="color: ${adm_color}">[A] ${player.getSyncedMeta("name")}</a> кикнул <a style="color: ${adm_color}">${recipient.getSyncedMeta("name")}.</a> Причина: <a style="color: ${adm_color}">${reason}`, adm_color);
            });
        }
    },
    "skick": {
        description: "Кикнуть игрока с сервера ( без уведомления игрока )",
        minLevel: 1,
        syntax: "[playerId]:n [reason]:s",
        handler: (player, args) => {
            var recipient = alt.Player.getBySqlId(args[0]);
            if (!recipient) return terminal.error("Игрок не найден!", player);
            args.splice(0, 1);
            var reason = args.join(" ");
            terminal.info(`${player.getSyncedMeta("name")} тихо кикнул ${recipient.getSyncedMeta("name")}: ${reason}`);
            alt.logs.addLog(`${player.getSyncedMeta("name")} тихо кикнул ${recipient.getSyncedMeta("name")}. Причина: ${reason}`, 'admin', player.account.id, player.sqlId, { level: player.admin, reason: reason });
            alt.logs.addLog(`${recipient.getSyncedMeta("name")} был тихо кикнут администратором ${player.getSyncedMeta("name")}. Причина: ${reason}`, 'admin', recipient.account.id, recipient.sqlId, { level: player.admin, reason: reason });
            recipient.kick(reason);
        }
    },
    "hp_radius": {
        description: "Изменить игрокам здоровье в радиусе.",
        minLevel: 3,
        syntax: "[radius]:n [health]:n",
        handler: (player, args) => {
            let dist = args[0];
            if (dist < 1 || dist > 20000) return terminal.error(`Дистанция от 1 до 20000!`, player);
            alt.Player.all.forEach((rec) => {
                var recDist = Math.sqrt(Math.pow(player.pos.x-rec.pos.x, 2) + Math.pow(player.pos.y-rec.pos.y, 2) + Math.pow(player.pos.z-rec.pos.z, 2));
                if (recDist <= dist) {
                    rec.health = Math.clamp(args[1] + 100, 100, 200);
                    rec.utils.success(`${player.getSyncedMeta("name")} изменил ваше здоровье на ${Math.clamp(args[1] + 100, 100, 200)}`);
                }
            });
            terminal.info(`${player.getSyncedMeta("name")} изменил здоровье всем игрокам в радиусе ${dist}м. на ${Math.clamp(args[1] + 100, 100, 200)}хп.`);
        }
    },
    "set_hp": {
        description: "Изменить здоровье игрока.",
        minLevel: 3,
        syntax: "[player_id]:n [health]:n",
        handler: (player, args) => {
            var rec = alt.Player.getBySqlId(args[0]);
            if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);
            if (args[1] === 0) rec.health = 0;
            else rec.health = Math.clamp(args[1] + 100, 100, 200);
            rec.utils.success(`${player.getSyncedMeta("name")} изменил ваше здоровье на ${args[1] !== 0 ? Math.clamp(args[1] + 100, 100, 200) : 0}`);
            terminal.info(`${player.getSyncedMeta("name")} изменил здоровье ${rec.getSyncedMeta("name")} на ${args[1] !== 0 ? Math.clamp(args[1] + 100, 100, 200) : 0}`);
        }
    },
    "id": {
        description: "Узнать имя игрока.",
        minLevel: 1,
        syntax: "[id/name]:s",
        handler: (player, args) => {
            if (getPlayerStatus(args[0]) === "on") {
                let rec = alt.Player.getBySqlId(args[0]);
                if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);
                terminal.log(`ID: ${rec.sqlId} | ИМЯ: ${rec.getSyncedMeta("name")}`, player);
            } else {
                let name = getSpecialName(args[0], player);
                if (!name) return terminal.error(`Формат: Имя_Фамилия`, player);
                let rec = alt.Player.getByName(name);
                if (!rec) return terminal.error(`Игрок ${args[0]} не найден!`, player);
                terminal.log(`ID: ${rec.sqlId} | ИМЯ: ${rec.getSyncedMeta("name")}`, player);
            }
        }
    },
    "set_armor": {
        description: "Изменить броню игрока.",
        minLevel: 3,
        syntax: "[player_id]:n [armor]:n",
        handler: (player, args) => {
            var rec = alt.Player.getBySqlId(args[0]);
            if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);
            rec.armour = Math.clamp(args[1], 0, 100);
            rec.utils.success(`${player.getSyncedMeta("name")} изменил вашу броню на ${rec.armour}`);
            terminal.info(`${player.getSyncedMeta("name")} изменил броню ${rec.getSyncedMeta("name")} на ${rec.armour}`);
        }
    },
    "dm": {
        description: "Посадить игрока в деморган.",
        minLevel: 3,
        syntax: "[id/name]:s [time]:n [reason]:s",
        handler: (player, args) => {
            if (args[1] < 1 || args[1] > 5000) return terminal.error(`Деморган от 1 мин. до 5000 мин.!`, player);
            if (getPlayerStatus(args[0]) === "on") {
                let rec = alt.Player.getBySqlId(args[0]);
                if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);
                if (rec.demorgan > 0) return terminal.error(`Игрок с ID: ${args[0]} уже сидит в деморгане!`, player);
                let spawnOpen = require("./events/CharacterEvents.js");
                rec.pos = new alt.Vector3(spawnOpen.SpawnInfo.demorgan.x, spawnOpen.SpawnInfo.demorgan.y, spawnOpen.SpawnInfo.demorgan.z);
                rec.rot = new alt.Vector3(0, 0, spawnOpen.SpawnInfo.demorgan.h);
                let startDemorgan = parseInt(new Date().getTime() / 1000);
                rec.utils.setLocalVar("demorganSet", { startTime: startDemorgan, demorgan: args[1] });
                rec.startDemorgan = startDemorgan;
                rec.demorganTimerId = setSaveTimeout(() => {
                    try {
                        rec.utils.leaveDemorgan();
                    } catch (err) {
                        alt.log(err.stack);
                    }
                }, args[1] * 60 * 1000);
                rec.demorgan = args[1];
                rec.utils.error(`${player.getSyncedMeta("name")} посадил Вас в деморган на ${args[1]} минут.`);
                rec.utils.error(`Причина: ${args[2]}`);
                DB.Query("UPDATE characters SET demorgan=? WHERE id=?", [args[1], rec.sqlId]);
                terminal.info(`${player.getSyncedMeta("name")} посадил ${rec.getSyncedMeta("name")} в деморган на ${args[1]} минут. Причина: ${args[2]}`);

                alt.logs.addLog(`${player.getSyncedMeta("name")} посадил ${rec.getSyncedMeta("name")} в деморган на ${args[1]} минут. Причина: ${args[2]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, time: args[1], reason: args[2] });
                alt.logs.addLog(`${rec.getSyncedMeta("name")} был посажен администратором ${player.getSyncedMeta("name")} в деморган на ${args[1]} минут. Причина: ${args[2]}`, 'admin', rec.account.id, rec.sqlId, { time: args[1], reason: args[2] });

                alt.Player.all.forEach((newrec) => {
                    if (newrec.sqlId) alt.emitClient(newrec, "chat.custom.push", `<a style="color: ${adm_color}">[A] ${player.getSyncedMeta("name")}</a> посадил <a style="color: ${adm_color}">${rec.getSyncedMeta("name")}</a> в деморган на <a style="color: ${adm_color}">${args[1]}</a> минут. <br/><a style="color: ${adm_color}">Причина:</a> ${args[2]}`, adm_color);
                });
            } else {
                let name = getSpecialName(args[0], player);
                if (!name) return terminal.error(`Формат: Имя_Фамилия`, player);
                DB.Query("SELECT * FROM characters WHERE name=?", [name], (e, result) => {
                    if (e) {
                        callback("Ошибка выполнения запроса в БД!");
                        return terminal.error(e);
                    }
                    if (result.length < 1) return terminal.error(`Игрок с именем: ${args[0]} не найден!`, player);
                    let rec = result[0];
                    if (rec) {
                        DB.Query("UPDATE characters SET demorgan=? WHERE id=?", [args[1], rec.id]);
                        terminal.info(`${player.getSyncedMeta("name")} посадил оффлайн ${rec.name} в деморган на ${args[1]} минут. Причина: ${args[2]}`);

                        alt.logs.addLog(`${player.getSyncedMeta("name")} посадил оффлайн ${rec.name} в деморган на ${args[1]} минут. Причина: ${args[2]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, time: args[1], reason: args[2] });
                        alt.logs.addLog(`${rec.name} был посажен администратором ${player.getSyncedMeta("name")} в оффлайн деморган на ${args[1]} минут. Причина: ${args[2]}`, 'admin', rec.accountId, rec.id, { time: args[1], reason: args[2] });

                        alt.Player.all.forEach((newrec) => {
                            if (newrec.sqlId) alt.emitClient(newrec, "chat.custom.push", `<a style="color: ${adm_color}">[A] ${player.getSyncedMeta("name")}</a> посадил <a style="color: ${adm_color}">${rec.name}</a> в деморган на <a style="color: ${adm_color}">${args[1]}</a> минут. <br/><a style="color: ${adm_color}">Причина:</a> ${args[2]}`, adm_color);
                        });
                    }
                });
            }
        }
    },
    "undm": {
        description: "Выпустить игрока из деморгана.",
        minLevel: 3,
        syntax: "[id/name]:s",
        handler: (player, args) => {
            if (getPlayerStatus(args[0]) === "on") {
                let rec = alt.Player.getBySqlId(args[0]);
                if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);
                if (rec.demorgan === 0) return terminal.error(`Игрок с ID: ${args[0]} не сидит в деморгане!`, player);
                rec.utils.leaveDemorgan();
                rec.utils.error(`${player.getSyncedMeta("name")} выпустил Вас из деморгана.`);
                terminal.info(`${player.getSyncedMeta("name")} выпустил ${rec.getSyncedMeta("name")} из деморгана.`);

                alt.logs.addLog(`${player.getSyncedMeta("name")} выпустил ${rec.getSyncedMeta("name")} из деморгана`, 'admin', player.account.id, player.sqlId, { level: player.admin });
                alt.logs.addLog(`${rec.getSyncedMeta("name")} был выпущен администратором ${player.getSyncedMeta("name")} из деморгана.`, 'admin', rec.account.id, rec.sqlId, { level: player.admin });

                alt.Player.all.forEach((newrec) => {
                    if (newrec.sqlId) alt.emitClient(newrec, "chat.custom.push", `<a style="color: ${adm_color}">[A] ${player.getSyncedMeta("name")}</a> выпустил <a style="color: ${adm_color}">${rec.getSyncedMeta("name")}</a> из деморгана.`, adm_color);
                });
            } else {
                let name = getSpecialName(args[0], player);
                if (!name) return terminal.error(`Формат: Имя_Фамилия`, player);
                DB.Query("SELECT * FROM characters WHERE name=?", [name], (e, result) => {
                    if (e) {
                        callback("Ошибка выполнения запроса в БД!");
                        return terminal.error(e);
                    }
                    if (result.length < 1) return terminal.error(`Игрок с именем: ${args[0]} не найден!`, player);
                    let rec = result[0];
                    if (rec) {
                        if (rec.demorgan === 0) return terminal.error(`Игрок не сидит в деморгане!`, player);
                        DB.Query("UPDATE characters SET demorgan=? WHERE id=?", [0, rec.id]);
                        terminal.info(`${player.getSyncedMeta("name")} выпустил оффлайн ${rec.name} из деморгана.`);

                        alt.logs.addLog(`${player.getSyncedMeta("name")} выпустил оффлайн ${rec.name} из деморгана`, 'admin', player.account.id, player.sqlId, { level: player.admin });
                        alt.logs.addLog(`${rec.name} был выпущен администратором ${player.getSyncedMeta("name")} из оффлайн деморгана`, 'admin', rec.accountId, rec.id, { level: player.admin });

                        alt.Player.all.forEach((newrec) => {
                            if (newrec.sqlId) alt.emitClient(newrec, "chat.custom.push", `<a style="color: ${adm_color}">[A] ${player.getSyncedMeta("name")}</a> выпустил <a style="color: ${adm_color}">${rec.name}</a> из деморгана.`, adm_color);
                        });
                    }
                });
            }
        }
    },
    "stats": {
        description: "Просмотреть статистику игрока.",
        minLevel: 3,
        syntax: "[id/name]:s",
        handler: (player, args) => {
            if (getPlayerStatus(args[0]) === "on") {
                var rec = alt.Player.getBySqlId(args[0]);
                if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);
                let add_text;
                DB.Query("SELECT * FROM characters WHERE id=?", [rec.sqlId], (e, result) => {
                    add_text = `Дата регистрации: <b>${result[0].regDate}</b><br/>IP: <b>${rec.ip}</b><br/>IP при регистрации: <b>${result[0].regIp}</b><br/>`;
                    terminal.log(`Игрок: <b>${rec.getSyncedMeta("name")}</b><br/>Деньги: <b>$${rec.money}</b><br/>Банк: <b>$${rec.bank}</b><br/>Донат: <b>${rec.account.donate}</b><br/>Отыгранно: <b>${rec.minutes} минут</b><br/>Варны: <b>${rec.warn}</b><br/>Организация: <b>${rec.faction === 0 ? "нет" : alt.factions.getBySqlId(rec.faction).name}</b><br/>Ранг: <b>${rec.rank === 0 ? "нет" : alt.factions.getRankName(rec.faction, rec.rank)}</b><br/>Работа: <b>${rec.job  === 0 ? "нет" : alt.jobs[rec.job - 1].name}</b><br/>Кол-во домов: <b>${alt.houses.getArrayByOwner(rec.sqlId).length}</b><br/>SC: <b>${rec.socialId}</b><br/>Общий донат: <b>${rec.account.allDonate}</b><br/>` + add_text, player);
                    terminal.info(`${player.getSyncedMeta("name")} просмотрел статистику ${rec.getSyncedMeta("name")}`);
                });
            } else {
                let name = getSpecialName(args[0], player);
                if (!name) return terminal.error(`Формат: Имя_Фамилия`, player);
                DB.Query("SELECT * FROM characters WHERE name=?", [name], (e, result) => {
                    if (e) {
                        callback("Ошибка выполнения запроса в БД!");
                        return terminal.error(e);
                    }
                    if (result.length < 1) return terminal.error(`Игрок с именем: ${args[0]} не найден!`, player);
                    let target = result[0];
                    if (target) {
                        terminal.log(`Игрок: <b>${target.name}</b><br/>Деньги: <b>$${target.money}</b><br/>Банк: <b>$${target.bank}</b><br/>Донат: <b>${target.donate}</b><br/>Отыгранно: <b>${target.minutes} минут</b><br/>Варны: <b>${target.warn}</b><br/>Организация: <b>${target.faction === 0 ? "нет" : alt.factions.getBySqlId(target.faction).name}</b><br/>Ранг: <b>${target.rank === 0 ? "нет" : alt.factions.getRankName(target.faction, target.rank)}</b><br/>Работа: <b>${target.job  === 0 ? "нет" : alt.jobs[target.job - 1].name}</b><br/>Кол-во домов: <b>${alt.houses.getArrayByOwner(target.sqlId).length}</b><br/>Дата регистрации: <b>${target.regDate}</b><br/>IP при последнем заходе: <b>${target.lastIp}</b><br/>IP при регистрации: <b>${target.regIp}</b><br/>`, player);
                        terminal.info(`${player.getSyncedMeta("name")} просмотрел оффлайн статистику ${target.name}`);
                    }
                });
            }
        }
    },
    "clist": {
        description: "Включение/выключение отображения админ-цвета в никнейме.",
        minLevel: 1,
        syntax: "",
        handler: (player, args) => {
          if (!player.getSyncedMeta("admin")) {
            player.setSyncedMeta("admin", player.admin);
            player.utils.success("Вы включили отображение админ-цвета!");
          } else {
            player.setSyncedMeta("admin", null);
            player.utils.error("Вы выключили отображение админ-цвета!");
          }
        }
    },
    "makeadminoff": {
        description: "Снять администратора оффлайн",
        minLevel: 9,
        syntax: "[name]:s [reason]:s",
        handler: (player, args) => {
            let name = getSpecialName(args[0], player);
            if (!name) return terminal.error(`Формат: Имя_Фамилия`, player);
            DB.Query("SELECT * FROM characters WHERE name=?", [name], (e, result) => {
                if (e) {
                    callback("Ошибка выполнения запроса в БД!");
                    return terminal.error(e);
                }
                if (result.length < 1) return terminal.error(`Игрок с именем: ${args[0]} не найден!`, player);
                let target = result[0];
                if (target) {
                    if (target.admin === 0) return terminal.error(`Данный игрок не является администратором!`, player);
                    if (target.admin > player.admin) return terminal.error(`Данный администратор выше вас уровнем!`, player);
                    DB.Query("UPDATE characters SET admin=? WHERE id=?", [0, target.id]);
                    terminal.info(`${player.getSyncedMeta("name")} снял администратора ${target.name}. Причина: ${args[1]}`);
                    alt.logs.addLog(`${player.getSyncedMeta("name")} снял администратора персонажа ${target.name}. Причина: ${args[1]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, reason: args[1] });
                }
            });
        }
    },
    "spawncars": {
        description: "Заспавнить свободные авто на сервере.",
        minLevel: 4,
        syntax: "",
        handler: (player, args) => {
            terminal.log(`${player.getSyncedMeta("name")} начал спавн всего свободного транспорта на сервере.`);
            alt.Player.all.forEach((newrec) => {
              if (newrec.sqlId) alt.emitClient(newrec, "chat.custom.push", `<a style="color: ${adm_color}">[A]</a> Все транспортные средства будут заспавнены через <a style="color: ${adm_color}">${Config.spawnCarsWaitTime / 1000}</a> секунд.`, adm_color);
            });
            setSaveTimeout(() => {
                var startTime = new Date().getTime();
                var spawnCount = 0,
                    destroyCount = 0;
                try {
                    alt.Vehicle.all.forEach((vehicle) => {
                        var players = 0;
                        alt.Player.all.forEach((rec) => {
                            if (rec.vehicle && rec.vehicle == vehicle) players += 1; 
                        });
                        if (players.length == 0) {
                            if (vehicle.spawnPos) {
                                let pos = vehicle.spawnPos;
                                var dist = (vehicle.pos["x"] - pos["x"]) * (vehicle.pos["x"] - pos["x"]) + (vehicle.pos["y"] - pos["y"]) * (vehicle.pos["y"] - pos["y"]) +
                                    (vehicle.pos["z"] - pos["z"]) * (vehicle.pos["z"] - pos["z"]);

                                if (dist >= 10) {
                                    alt.emitClient(player, `Vehicle::repair`, vehicle);
                                    vehicle.utils.setFuel(30);
                                    vehicle.maxFuel = 70;
                                    vehicle.pos = pos;
                                    vehicle.rot = new alt.Vector3(0, 0, pos.h * Math.PI / 180);
                                    vehicle.setSyncedMeta("leftSignal", false);
                                    vehicle.setSyncedMeta("rightSignal", false);
                                    if (vehicle.getSyncedMeta("engine"))
                                        vehicle.utils.engineOn();
                                    spawnCount++;
                                }
                            } else {
                                destroyCount++;
                                vehicle.destroy();
                            }
                        }
                    });
                    var ms = new Date().getTime() - startTime;
                    alt.Player.all.forEach((newrec) => {
                      if (newrec.sqlId) alt.emitClient(newrec, "chat.custom.push", `<a style="color: ${adm_color}">[A]</a> Все транспортные средства заспавнены.`, adm_color);
                    });
                    terminal.info(`${player.getSyncedMeta("name")} заспавнил свободную технику<br/>Авто на сервере: ${alt.Vehicle.all.length}<br/>Заспавнено: ${spawnCount}<br/>Удалено: ${destroyCount}<br/>Время: ${ms} ms`);
                } catch (err) {
                    terminal.log(err.stack);
                }
            }, Config.spawnCarsWaitTime);
        }
    },
    "fuel_all": {
        description: "Заправить все транспортные средства на сервере.",
        minLevel: 5,
        syntax: "",
        handler: (player, args) => {
            terminal.log(`${player.getSyncedMeta("name")} начал заправлять весь транспорт на сервере.`);
            alt.Player.all.forEach((newrec) => {
              if (newrec.sqlId) alt.emitClient(newrec, "chat.custom.push", `<a style="color: ${adm_color}">[A]</a> Все транспортные средства будут заправлены через <a style="color: ${adm_color}">${Config.spawnCarsWaitTime / 1000}</a> секунд.`, adm_color);
            });
            setSaveTimeout(() => {
                var startTime = new Date().getTime();
                try {
                    alt.Vehicle.all.forEach((vehicle) => {
                       if (vehicle.owner < 1101) vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
                    });
                    var ms = new Date().getTime() - startTime;
                    terminal.info(`${player.getSyncedMeta("name")} заправил весь транспорт! <br/>Время: ${ms} ms`);
                    alt.Player.all.forEach((newrec) => {
                      if (newrec.sqlId) alt.emitClient(newrec, "chat.custom.push", `<a style="color: ${adm_color}">[A]</a> Все транспортные средства заправлены.`, adm_color);
                    });
                } catch (err) {
                    terminal.log(err.stack);
                }
            }, Config.spawnCarsWaitTime);
        }
    },
    "del_car": {
        description: "Удалить авто.",
        minLevel: 3,
        syntax: "",
        handler: (player, args) => {
            var veh = player.vehicle;
            if (!veh) return terminal.error(`Вы не в авто!`, player);
            terminal.info(`${player.getSyncedMeta("name")} удалил авто`, player);
            veh.destroy();
        }
    },
    "admins": {
        description: "Просмотреть список администраторов онлайн.",
        minLevel: 3,
        syntax: "",
        handler: (player, args) => {
          DB.Query("SELECT * FROM characters WHERE admin>?", [0], (e, result) => {
              if (e) {
                  callback("Ошибка выполнения запроса в БД!");
                  return terminal.error(e);
              }
              if (result.length < 1) return terminal.error(`Ошибка, нет администраторов!`, player);
              let admins = ``;
              for (let i = 0; i < result.length; i++) {
                let target = alt.Player.getBySqlId(result[i].id);
                admins += `[${i + 1}] Имя: <b>${result[i].name}</b> | Уровень прав: <b>${result[i].admin}</b> | Онлайн: <b>${target === undefined ? `нет` : `да ( id: ${target.sqlId} )`}</b> <br/>`;
              }
              terminal.log(`${admins}`, player);
          });
        }
    },
    "warn": {
        description: "Выдать предупреждение.",
        minLevel: 3,
        syntax: "[id/name]:s [reason]:s",
        handler: (player, args) => {
            let date = new Date();
            if (getPlayerStatus(args[0]) === "on") {
                let rec = alt.Player.getBySqlId(args[0]);
                if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);
                let warn = ++rec.warn;
                rec.utils.error(`${player.getSyncedMeta("name")} выдал Вам варн! ( ${warn}/3 )`);
                rec.utils.error(`Причина: ${args[1]}`);

                terminal.info(`${player.getSyncedMeta("name")} выдал варн ${rec.getSyncedMeta("name")}. (${warn}/3) Причина: ${args[1]}`);

                alt.logs.addLog(`${player.getSyncedMeta("name")} выдал варн ${rec.getSyncedMeta("name")}. (${warn}/3) Причина: ${args[1]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, reason: args[1], warn: warn });
                alt.logs.addLog(`${rec.getSyncedMeta("name")} получил варн ${player.getSyncedMeta("name")}. (${warn}/3) Причина: ${args[1]}`, 'admin', rec.account.id, rec.sqlId, { time: args[1], warn: warn });

                alt.Player.all.forEach((newrec) => {
                    if (newrec.sqlId) alt.emitClient(newrec, "chat.custom.push", `<a style="color: ${adm_color}">[A] ${player.getSyncedMeta("name")}</a> выдал ${warn} предупреждение <a style="color: ${adm_color}">${rec.getSyncedMeta("name")}.</a> <br/><a style="color: ${adm_color}">Причина:</a> ${args[1]}`, adm_color);
                });

                if (warn > 2) {
                    DB.Query("UPDATE characters SET warn=? WHERE id=?", [0, rec.sqlId]);
                    DB.Query("UPDATE characters SET warntime=? WHERE id=?", [0, rec.sqlId]);
                    DB.Query("UPDATE characters SET ban=? WHERE id=?", [date.getTime() / 1000 + 30 * 24 * 60 * 60, rec.sqlId]);
                    rec.utils.error(`Ваш аккаунт забанен на 30 дней!`);
                } else {
                    DB.Query("UPDATE characters SET warn=? WHERE id=?", [warn, rec.sqlId]);
                    DB.Query("UPDATE characters SET warntime=? WHERE id=?", [date.getTime() / 1000 + 15 * 24 * 60 * 60, rec.sqlId]);
                }
                rec.kick();
            } else {
                let name = getSpecialName(args[0], player);
                if (!name) return terminal.error(`Формат: Имя_Фамилия`, player);
                DB.Query("SELECT * FROM characters WHERE name=?", [name], (e, result) => {
                    if (e) {
                        callback("Ошибка выполнения запроса в БД!");
                        return terminal.error(e);
                    }
                    if (result.length < 1) return terminal.error(`Игрок с именем: ${args[0]} не найден!`, player);
                    let target = result[0];
                    if (target) {
                        let warn = ++target.warn;
                        if (warn > 2) {
                            DB.Query("UPDATE characters SET warn=? WHERE id=?", [0, target.id]);
                            DB.Query("UPDATE characters SET warntime=? WHERE id=?", [0, target.id]);
                            DB.Query("UPDATE characters SET ban=? WHERE id=?", [date.getTime() / 1000 + 30 * 24 * 60 * 60, target.id]);
                        } else {
                            DB.Query("UPDATE characters SET warn=? WHERE id=?", [target, target.id]);
                            DB.Query("UPDATE characters SET warntime=? WHERE id=?", [date.getTime() / 1000 + 15 * 24 * 60 * 60, target.id]);
                        }
                        terminal.info(`${player.getSyncedMeta("name")} выдал варн оффлайн ${target.name}. ( ${warn}/3 ) Причина: ${args[1]}`);

                        alt.logs.addLog(`${player.getSyncedMeta("name")} выдал варн оффлайн ${target.name}. (${warn}/3) Причина: ${args[1]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, reason: args[1], warn: warn });
                        alt.logs.addLog(`${target.name} получил оффлайн варн ${player.getSyncedMeta("name")}. (${warn}/3) Причина: ${args[1]}`, 'admin', target.accountId, target.id, { time: args[1], warn: warn });

                        alt.Player.all.forEach((newrec) => {
                            if (newrec.sqlId) alt.emitClient(newrec, "chat.custom.push", `<a style="color: ${adm_color}">[A] ${player.getSyncedMeta("name")}</a> выдал ${warn} предупреждение <a style="color: ${adm_color}">${target.name}.</a> <br/><a style="color: ${adm_color}">Причина:</a> ${args[1]}`, adm_color);
                        });
                    }
                });
            }
        }
    },
    "unwarn": {
        description: "Снять предупреждение.",
        minLevel: 3,
        syntax: "[id/name]:s [reason]:s",
        handler: (player, args) => {
            let date = new Date();
            if (getPlayerStatus(args[0]) === "on") {
                let rec = alt.Player.getBySqlId(args[0]);
                if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);
                if (rec.warn < 1) return terminal.error(`У данного игрока 0 варнов!`, player);
                let warn = --rec.warn;
                rec.utils.error(`${player.getSyncedMeta("name")} снял с вас варн! ( ${warn}/3 )`);
                rec.utils.error(`Причина: ${args[1]}`);
                if (warn > 0) {
                    DB.Query("UPDATE characters SET warn=? WHERE id=?", [warn, rec.sqlId]);
                    DB.Query("UPDATE characters SET warntime=? WHERE id=?", [0, rec.sqlId]);
                } else {
                    DB.Query("UPDATE characters SET warn=? WHERE id=?", [0, rec.sqlId]);
                    DB.Query("UPDATE characters SET warntime=? WHERE id=?", [0, rec.sqlId]);
                }
                terminal.info(`${player.getSyncedMeta("name")} снял варн ${rec.getSyncedMeta("name")}. ( ${warn}/3 ) Причина: ${args[1]}`);

                alt.logs.addLog(`${player.getSyncedMeta("name")} снял варн ${rec.getSyncedMeta("name")}. (${warn}/3) Причина: ${args[1]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, reason: args[1], warn: warn });
                alt.logs.addLog(`${rec.getSyncedMeta("name")} был снят варн администратором ${player.getSyncedMeta("name")}. (${warn}/3) Причина: ${args[1]}`, 'admin', rec.account.id, rec.sqlId, { time: args[1], warn: warn });

                alt.Player.all.forEach((newrec) => {
                    if (newrec.sqlId) alt.emitClient(newrec, "chat.custom.push", `<a style="color: ${adm_color}">[A] ${player.getSyncedMeta("name")}</a> снял предупреждение <a style="color: ${adm_color}">${rec.getSyncedMeta("name")}.</a>`, adm_color);
                });
            } else {
                let name = getSpecialName(args[0], player);
                if (!name) return terminal.error(`Формат: Имя_Фамилия`, player);
                DB.Query("SELECT * FROM characters WHERE name=?", [name], (e, result) => {
                    if (e) {
                        callback("Ошибка выполнения запроса в БД!");
                        return terminal.error(e);
                    }
                    if (result.length < 1) return terminal.error(`Игрок с именем: ${args[0]} не найден!`, player);
                    let target = result[0];
                    if (target) {
                        if (target.warn < 1) return terminal.error(`У данного игрока 0 варнов!`, player);
                        let warn = --target.warn;
                        if (warn > 0) {
                            DB.Query("UPDATE characters SET warn=? WHERE id=?", [warn, target.id]);
                            DB.Query("UPDATE characters SET warntime=? WHERE id=?", [0, target.id]);
                        } else {
                            DB.Query("UPDATE characters SET warn=? WHERE id=?", [0, target.id]);
                            DB.Query("UPDATE characters SET warntime=? WHERE id=?", [0, target.id]);
                        }
                        terminal.info(`${player.getSyncedMeta("name")} снял варн оффлайн ${target.name}. ( ${warn}/3 ) Причина: ${args[1]}`);

                        alt.logs.addLog(`${player.getSyncedMeta("name")} снял варн оффлайн ${target.name}. (${warn}/3) Причина: ${args[1]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, reason: args[1], warn: warn });
                        alt.logs.addLog(`${target.name} был снят оффлайн варн администратором ${player.getSyncedMeta("name")}. (${warn}/3) Причина: ${args[1]}`, 'admin', target.accountId, target.id, { time: args[1], warn: warn });

                        alt.Player.all.forEach((newrec) => {
                            if (newrec.sqlId) alt.emitClient(newrec, "chat.custom.push", `<a style="color: ${adm_color}">[A] ${player.getSyncedMeta("name")}</a> снял предупреждение <a style="color: ${adm_color}">${target.name}.</a>`, adm_color);
                        });
                    }
                });
            }
        }
    },
    "get_ip": {
        description: "Узнать IP адрес игрока.",
        minLevel: 3,
        syntax: "[id/name]:s",
        handler: (player, args) => {
            if (getPlayerStatus(args[0]) === "on") {
                let rec = alt.Player.getBySqlId(args[0]);
                if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);
                terminal.info(`${player.getSyncedMeta("name")} проверил IP адрес ${rec.getSyncedMeta("name")} ( IP: ${rec.ip} ) `);
            } else {
                let name = getSpecialName(args[0], player);
                if (!name) return terminal.error(`Формат: Имя_Фамилия`, player);
                DB.Query("SELECT * FROM characters WHERE name=?", [name], (e, result) => {
                    if (e) {
                        callback("Ошибка выполнения запроса в БД!");
                        return terminal.error(e);
                    }
                    if (result.length < 1) return terminal.error(`Игрок с именем: ${args[0]} не найден!`, player);
                    let target = result[0];
                    if (target) terminal.info(`${player.getSyncedMeta("name")} проверил оффлайн IP адрес ${target.name} ( IP при последнем заходе: ${target.lastIp} | IP при регистрации: ${target.regIp} )`);
                });
            }
        }
    },
    "ban_ip": {
        description: "Забанить ip адрес.",
        minLevel: 3,
        syntax: "[ip]:s",
        handler: (player, args) => {
            DB.Query("SELECT * FROM ip_ban WHERE ip=?", args[0], (e, result) => {
                if (e) {
                    callback("Ошибка выполнения запроса в БД!");
                    return terminal.error(e);
                }
                if (result.length > 0) {
                    terminal.log("IP - " + args[0] + " уже внесен в список забаненых IP адресов!", player);
                    return;
                }

                DB.Query("INSERT INTO ip_ban (ip) VALUES (?)", args[0], (error, sresult) => {
                    if (error) {
                        callback("Ошибка выполнения запроса в БД!");
                        return terminal.error(error);
                    }
                    terminal.info(`${player.getSyncedMeta("name")} забанил IP - ${args[0]}`);
                    alt.logs.addLog(`${player.getSyncedMeta("name")} забанил IP - ${args[0]}`, 'admin', player.account.id, player.sqlId, { ip: args[0] });

                });
            });
        }
    },
    "unban_ip": {
        description: "Разбанить ip адрес.",
        minLevel: 3,
        syntax: "[ip]:s",
        handler: (player, args) => {
            DB.Query("SELECT * FROM ip_ban WHERE ip=?", args[0], (e, result) => {
                if (e) {
                    callback("Ошибка выполнения запроса в БД!");
                    return terminal.error(e);
                }
                if (result.length < 1) {
                    terminal.log("IP - " + args[0] + " не внесен в список забаненых IP адресов!", player);
                    return;
                }

                DB.Query(`DELETE FROM ip_ban WHERE ip=?`, args[0], (e, results) => {
                    if (e) {
                        callback("Ошибка выполнения запроса в БД!");
                        return terminal.error(e);
                    }
                });
                terminal.info(`${player.getSyncedMeta("name")} разбанил IP - ${args[0]}`);
                alt.logs.addLog(`${player.getSyncedMeta("name")} разбанил IP - ${args[0]}`, 'admin', player.account.id, player.sqlId, { ip: args[0] });
            });
        }
    },
    "freeze": {
        description: "Заморозить игрока.",
        minLevel: 3,
        syntax: "[player_id]:n [time]:n",
        handler: (player, args) => {
            var rec = alt.Player.getBySqlId(args[0]);
            if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);
            if (args[1] < 1) return terminal.error(`Время от 0 секунд!`, player);
            rec.isFreeze = true;
            alt.emitClient(rec, `admin.control.freeze`, args[1]);
            rec.utils.success(`${player.getSyncedMeta("name")} заморозил Вас на ${args[1]} секунд`);
            terminal.info(`${player.getSyncedMeta("name")} заморозил ${rec.getSyncedMeta("name")} на ${args[1]} секунд`);
        }
    },
    "gg": {
        description: "Пожелать приятной игры игроку.",
        minLevel: 3,
        syntax: "[player_id]:n",
        handler: (player, args) => {
            var rec = alt.Player.getBySqlId(args[0]);
            if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);
            rec.utils.error("Администрация Cyber State RP желает Вам приятной игры!");
            terminal.info(`${player.getSyncedMeta("name")} пожелал приятной игры ${rec.getSyncedMeta("name")}`);
        }
    },
    "mute": {
        description: "Выдать мут игроку.",
        minLevel: 3,
        syntax: "[player_id]:n [time]:n [reason]:s",
        handler: (player, args) => {
            var rec = alt.Player.getBySqlId(args[0]);
            if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);
            if (args[1] < 1 || args[1] > 5000) return terminal.error(`Мут от 1 мин. до 5000 мин.!`, player);
            if (rec.mute > 0) return terminal.error(`Игрок уже в муте!`, player);
            rec.startMute = parseInt(new Date().getTime() / 1000);
            rec.muteTimerId = setSaveTimeout(() => {
                try {
                    rec.utils.stopMute();
                } catch (err) {
                    alt.log(err.stack);
                }
            }, args[1] * 60 * 1000);
            rec.mute = args[1];
            rec.utils.error(`${player.getSyncedMeta("name")} выдал Вам мут на ${args[1]} минут.`);
            rec.utils.error(`Причина: ${args[2]}`);
            DB.Query("UPDATE characters SET mute=? WHERE id=?", [args[1], rec.sqlId]);
            terminal.info(`${player.getSyncedMeta("name")} выдал мут ${rec.getSyncedMeta("name")} на ${args[1]} минут. Причина: ${args[2]}`);

            alt.logs.addLog(`${player.getSyncedMeta("name")} выдал мут ${rec.getSyncedMeta("name")} на ${args[1]} минут. Причина: ${args[2]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, time: args[1], reason: args[2] });
            alt.logs.addLog(`${rec.getSyncedMeta("name")} получил мут администратором ${player.getSyncedMeta("name")} на ${args[1]} минут. Причина: ${args[2]}`, 'admin', rec.account.id, rec.sqlId, { time: args[1], reason: args[2] });

            alt.Player.all.forEach((newrec) => {
                if (newrec.sqlId) alt.emitClient(newrec, "chat.custom.push", `<a style="color: ${adm_color}">[A] ${player.getSyncedMeta("name")}</a> заблокировал чат <a style="color: ${adm_color}">${rec.getSyncedMeta("name")}</a> на <a style="color: ${adm_color}">${args[1]}</a> минут. <br/><a style="color: ${adm_color}">Причина:</a> ${args[2]}`, adm_color);
            });
        }
    },
    "unmute": {
        description: "Снять мут с игрока.",
        minLevel: 3,
        syntax: "[player_id]:n",
        handler: (player, args) => {
            var rec = alt.Player.getBySqlId(args[0]);
            if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);
            if (rec.mute < 1) return terminal.error(`У игрока нет мута!`, player);
            rec.mute = 0;
            rec.utils.error(`${player.getSyncedMeta("name")} снял с Вас мут.`);
            DB.Query("UPDATE characters SET mute=? WHERE id=?", [0, rec.sqlId]);
            terminal.info(`${player.getSyncedMeta("name")} снял мут с ${rec.getSyncedMeta("name")}`);

            alt.logs.addLog(`${player.getSyncedMeta("name")} снял мут с ${rec.getSyncedMeta("name")}`, 'admin', player.account.id, player.sqlId, { level: player.admin });
            alt.logs.addLog(`${rec.getSyncedMeta("name")} снят мут администратором ${player.getSyncedMeta("name")}`, 'admin', rec.account.id, rec.sqlId, { });

            alt.Player.all.forEach((newrec) => {
                if (newrec.sqlId) alt.emitClient(newrec, "chat.custom.push", `<a style="color: ${adm_color}">[A] ${player.getSyncedMeta("name")}</a> разблокировал чат <a style="color: ${adm_color}">${rec.getSyncedMeta("name")}.</a>`, adm_color);
            });
        }
    },
    "mute_voice": {
        description: "Выдать voice-мут игроку.",
        minLevel: 3,
        syntax: "[player_id]:n [time]:n [reason]:s",
        handler: (player, args) => {
            var rec = alt.Player.getBySqlId(args[0]);
            if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);
            if (args[1] < 1 || args[1] > 5000) return terminal.error(`Voice-мут от 1 мин. до 5000 мин.!`, player);
            if (rec.vmute > 0) return terminal.error(`Игрок уже в voice-муте!`, player);
            rec.startVoiceMute = parseInt(new Date().getTime() / 1000);
            rec.muteVoiceTimerId = setSaveTimeout(() => {
                try {
                    rec.utils.stopVoiceMute(); // rec.utils.leaveDemorgan();
                } catch (err) {
                    alt.log(err.stack);
                }
            }, args[1] * 60 * 1000);
            rec.vmute = args[1];
            rec.utils.error(`${player.getSyncedMeta("name")} выдал Вам мут микрофона на ${args[1]} минут.`);
            rec.utils.error(`Причина: ${args[2]}`);
            alt.emitClient(rec, "control.voice.chat", true);
            DB.Query("UPDATE characters SET vmute=? WHERE id=?", [args[1], rec.sqlId]);
            terminal.info(`${player.getSyncedMeta("name")} выдал voice-мут ${rec.getSyncedMeta("name")} на ${args[1]} минут. Причина: ${args[2]}`);

            alt.logs.addLog(`${player.getSyncedMeta("name")} выдал voice-мут ${rec.getSyncedMeta("name")} на ${args[1]} минут. Причина: ${args[2]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, time: args[1], reason: args[2] });
            alt.logs.addLog(`${rec.getSyncedMeta("name")} выдан voice-мут администраоором ${player.getSyncedMeta("name")} на ${args[1]} минут. Причина: ${args[2]}`, 'admin', rec.account.id, rec.sqlId, { time: args[1], reason: args[2] });

            alt.Player.all.forEach((newrec) => {
                if (newrec.sqlId) alt.emitClient(newrec, "chat.custom.push", `<a style="color: ${adm_color}">[A] ${player.getSyncedMeta("name")}</a> заблокировал микрофон <a style="color: ${adm_color}">${rec.getSyncedMeta("name")}</a> на <a style="color: ${adm_color}">${args[1]}</a> минут. <br/><a style="color: ${adm_color}">Причина:</a> ${args[2]}`, adm_color);
            });
        }
    },
    "unmute_voice": {
        description: "Снять voice-мут с игрока.",
        minLevel: 3,
        syntax: "[player_id]:n",
        handler: (player, args) => {
            var rec = alt.Player.getBySqlId(args[0]);
            if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);
            if (rec.vmute < 1) return terminal.error(`У игрока нет voice-мута!`, player);
            rec.vmute = 0;
            rec.utils.error(`${player.getSyncedMeta("name")} снял с Вас мут микрофона.`);
            alt.emitClient(rec, "control.voice.chat", false);
            DB.Query("UPDATE characters SET vmute=? WHERE id=?", [0, rec.sqlId]);
            terminal.info(`${player.getSyncedMeta("name")} снял мут микрофона с ${rec.getSyncedMeta("name")}`);

            alt.logs.addLog(`${player.getSyncedMeta("name")} снял мут микрофона с ${rec.getSyncedMeta("name")}`, 'admin', player.account.id, player.sqlId, { level: player.admin });
            alt.logs.addLog(`${rec.getSyncedMeta("name")} снят мут микрофона администратором ${player.getSyncedMeta("name")}`, 'admin', rec.account.id, rec.sqlId, {  });

            alt.Player.all.forEach((newrec) => {
                if (newrec.sqlId) alt.emitClient(newrec, "chat.custom.push", `<a style="color: ${adm_color}">[A] ${player.getSyncedMeta("name")}</a> разблокировал микрофон <a style="color: ${adm_color}">${rec.getSyncedMeta("name")}.</a>`, adm_color);
            });
        }
    },
    "invis": {
        description: "Сделать игрока видимым/невидимым.",
        minLevel: 3,
        syntax: "[player_id]:n",
        handler: (player, args) => {
            var rec = alt.Player.getBySqlId(args[0]);
            if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);
            if (rec.getSyncedMeta("ainvis")) {
                rec.setSyncedMeta("ainvis", false);
                alt.emitClient(rec, `admin.set.invisible`, true);
                player.utils.error(`Вы сделали ${rec.getSyncedMeta("name")} видимым`);
                rec.utils.error(`${player.getSyncedMeta("name")} сделал Вас видимым`);
            } else {
                rec.setSyncedMeta("ainvis", true);
                alt.emitClient(rec, `admin.set.invisible`, false);
                player.utils.error(`Вы сделали ${rec.getSyncedMeta("name")} невидимым`);
                rec.utils.error(`${player.getSyncedMeta("name")} сделал Вас невидимым`);
            }
        }
    },
    "ban_char": {
        description: "Выдать бан персонажу",
        minLevel: 3,
        syntax: "[id/name]:s [days]:n [reason]:s",
        handler: (player, args) => {
            if (args[1] < 1 || args[1] > 5000) return terminal.error(`Бан от 1 дня до 5000 дней!`, player);
            if (getPlayerStatus(args[0]) === "on") {
                let rec = alt.Player.getBySqlId(args[0]);
                if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);
                let date = new Date();

                terminal.info(`${player.getSyncedMeta("name")} забанил персонажа ${rec.getSyncedMeta("name")} на ${args[1]} дней. Причина: ${args[2]}`);
                alt.logs.addLog(`${player.getSyncedMeta("name")} забанил персонажа ${rec.getSyncedMeta("name")} на ${args[1]} дней. Причина: ${args[2]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, days: args[1], reason: args[2] });
                alt.logs.addLog(`${rec.getSyncedMeta("name")} забанен по персонажу администратором ${player.getSyncedMeta("name")} на ${args[1]} дней. Причина: ${args[2]}`, 'admin', rec.account.id, rec.sqlId, { days: args[1], reason: args[2] });

                alt.Player.all.forEach((newrec) => {
                    if (newrec.sqlId) alt.emitClient(newrec, "chat.custom.push", `<a style="color: ${adm_color}">[A] ${player.getSyncedMeta("name")}</a> забанил <a style="color: ${adm_color}">${rec.getSyncedMeta("name")}</a> на <a style="color: ${adm_color}">${args[1]}</a> дней. <br/><a style="color: ${adm_color}">Причина:</a> ${args[2]}`, adm_color);
                });

                DB.Query("UPDATE characters SET ban=? WHERE id=?", [date.getTime() / 1000 + args[1] * 24 * 60 * 60, rec.sqlId]);
                rec.utils.error(`${player.getSyncedMeta("name")} забанил Вас`);
                rec.utils.error(`Причина: ${args[2]}`);
                rec.kick();
            } else {
                let name = getSpecialName(args[0], player);
                if (!name) return terminal.error(`Формат: Имя_Фамилия`, player);
                DB.Query("SELECT * FROM characters WHERE name=?", [name], (e, result) => {
                    if (e) {
                        callback("Ошибка выполнения запроса в БД!");
                        return terminal.error(e);
                    }
                    if (result.length < 1) return terminal.error(`Игрок с именем: ${args[0]} не найден!`, player);
                    let target = result[0];
                    if (target) {
                        let date = new Date();
                        DB.Query("UPDATE characters SET ban=? WHERE id=?", [date.getTime() / 1000 + args[1] * 24 * 60 * 60, target.id]);
                        terminal.info(`${player.getSyncedMeta("name")} забанил персонажа оффлайн ${target.name} на ${args[1]} дней. Причина: ${args[2]}`);

                        alt.logs.addLog(`${player.getSyncedMeta("name")} забанил оффлайн персонажа ${rec.getSyncedMeta("name")} на ${args[1]} дней. Причина: ${args[2]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, days: args[1], reason: args[2] });
                        alt.logs.addLog(`${target.name} забанен по оффлайн персонажу администратором ${player.getSyncedMeta("name")} на ${args[1]} дней. Причина: ${args[2]}`, 'admin', target.accountId, target.id, { days: args[1], reason: args[2] });

                        alt.Player.all.forEach((newrec) => {
                            if (newrec.sqlId) alt.emitClient(newrec, "chat.custom.push", `<a style="color: ${adm_color}">[A] ${player.getSyncedMeta("name")}</a> забанил <a style="color: ${adm_color}">${target.name}</a> на <a style="color: ${adm_color}">${args[1]}</a> дней. <br/><a style="color: ${adm_color}">Причина:</a> ${args[2]}`, adm_color);
                        });
                    }
                });
            }
        }
    },
    "unban_char": {
        description: "Разбанить персонажа",
        minLevel: 3,
        syntax: "[name]:s [reason]:s",
        handler: (player, args) => {
            let name = getSpecialName(args[0], player);
            if (!name) return terminal.error(`Формат: Имя_Фамилия`, player);
            DB.Query("SELECT * FROM characters WHERE name=?", [name], (e, result) => {
                if (e) {
                    callback("Ошибка выполнения запроса в БД!");
                    return terminal.error(e);
                }
                if (result.length < 1) return terminal.error(`Игрок с именем: ${args[0]} не найден!`, player);
                let target = result[0];
                if (target) {
                    if (target.ban === 0) return terminal.error(`Данный игрок не забанен!`, player);
                    DB.Query("UPDATE characters SET ban=? WHERE id=?", [0, target.id]);
                    terminal.info(`${player.getSyncedMeta("name")} разбанил персонажа ${target.name}. Причина: ${args[1]}`);

                    alt.logs.addLog(`${player.getSyncedMeta("name")} разбанил персонажа ${target.name}. Причина: ${args[1]}`, 'admin', player.account.id, player.sqlId, { level: player.admin, reason: args[1] });
                    alt.logs.addLog(`${target.name} разбанен по персонажу администратором ${player.getSyncedMeta("name")}. Причина: ${args[1]}`, 'admin', target.accountId, target.id, { reason: args[1] });

                    alt.Player.all.forEach((newrec) => {
                        if (newrec.sqlId) alt.emitClient(newrec, "chat.custom.push", `<a style="color: ${adm_color}">[A] ${player.getSyncedMeta("name")}</a> разбанил <a style="color: ${adm_color}">${target.name}.</a>`, adm_color);
                    });
                }
            });
        }
    },
    "unfreeze": {
        description: "Разморозить игрока.",
        minLevel: 3,
        syntax: "[player_id]:n",
        handler: (player, args) => {
            var rec = alt.Player.getBySqlId(args[0]);
            if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);
            if (!rec.isFreeze) return terminal.error(`Данный игрок не заморожен!`, player);
            delete rec.isFreeze;
            alt.emitClient(rec, `admin.control.freeze`, 0);
            rec.utils.success(`${player.getSyncedMeta("name")} разморозил Вас`);
            terminal.info(`${player.getSyncedMeta("name")} разморозил ${rec.getSyncedMeta("name")}`);
        }
    },
    "freeze_radius": {
        description: "Заморозить игроков в радиусе.",
        minLevel: 3,
        syntax: "[radius]:n [time]:n",
        handler: (player, args) => {
            let dist = args[0];
            if (dist < 1 || dist > 20000) return terminal.error(`Дистанция от 1 до 20000!`, player);
            if (args[1] < 1) return terminal.error(`Время от 0 секунд!`, player);
            alt.Player.all.forEach((rec) => {
                var recDist = Math.sqrt(Math.pow(player.pos.x-rec.pos.x, 2) + Math.pow(player.pos.y-rec.pos.y, 2) + Math.pow(player.pos.z-rec.pos.z, 2));
                if (recDist <= dist) {
                    rec.isFreeze = true;
                    alt.emitClient(rec, `admin.control.freeze`, args[1]);
                    rec.utils.success(`${player.getSyncedMeta("name")} заморозил Вас на ${args[1]} секунд`);
                }
            });
            terminal.info(`${player.getSyncedMeta("name")} заморозил всех игроков в радиусе ( ${dist}м. )`);
        }
    },
    "unfreeze_radius": {
        description: "Разморозить игроков в радиусе.",
        minLevel: 3,
        syntax: "[radius]:n",
        handler: (player, args) => {
            let dist = args[0];
            if (dist < 1 || dist > 20000) return terminal.error(`Дистанция от 1 до 20000!`, player);
            alt.Player.all.forEach((rec) => {
                var recDist = Math.sqrt(Math.pow(player.pos.x-rec.pos.x, 2) + Math.pow(player.pos.y-rec.pos.y, 2) + Math.pow(player.pos.z-rec.pos.z, 2));
                if (recDist <= dist) {
                    if (rec.isFreeze) {
                        delete rec.isFreeze;
                        alt.emitClient(rec, `admin.control.freeze`, 0);
                        rec.utils.success(`${player.getSyncedMeta("name")} разморозил Вас`);
                    }
                }
            });
            terminal.info(`${player.getSyncedMeta("name")} разморозил всех игроков в радиусе ( ${dist}м. )`);
        }
    },
    "aspawn": {
        description: "Заспавнить игрока на возможных спавнах.",
        minLevel: 3,
        syntax: "[player_id]:n",
        handler: (player, args) => {
            var rec = alt.Player.getBySqlId(args[0]);
            if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);
            let spawnOpen = require("./events/CharacterEvents.js");
            if (spawnOpen.SpawnInfo.user_spawn.length < 1) return terminal.error(`На сервере отсутствуют спавны!`, player);
            let spawn = spawnOpen.SpawnInfo.user_spawn[getRandom(0, spawnOpen.SpawnInfo.user_spawn.length)];

            terminal.info(`${player.getSyncedMeta("name")} зареспавнил ${rec.getSyncedMeta("name")}`);
            rec.pos = new alt.Vector3(spawn.x, spawn.y, spawn.z);
            rec.rot = new alt.Vector3(0, 0, spawn.h);
            rec.dimension = 1;
            rec.utils.success(`${player.getSyncedMeta("name")} зареспавнил вас`);
        }
    },
    "bone_index": {
        description: "Получить индекс кости по названию.",
        minLevel: 5,
        syntax: "[bone]:s",
        handler: (player, args) => {
            alt.emitClient(player, "admin.get.boneindex", args[0]);
        }
    },

    "fuel": {
        description: "Изменить количество топлива в машине.",
        minLevel: 3,
        syntax: "[fuel]:n",
        handler: (player, args) => {
            if (!player.vehicle) return terminal.error("Вы не в машине!", player);
            var veh = player.vehicle;
            if (!veh.maxFuel) veh.maxFuel = 70;
            if (veh.maxFuel < args[0]) return terminal.error(`Вместимость бака: ${veh.maxFuel} л.`, player);

            veh.utils.setFuel(args[0]);
            alt.emitClient(player, "setVehicleVar", veh, "fuel", args[0]);

            terminal.info(`${player.getSyncedMeta("name")} заправил авто с ID: ${veh.id} на ${args[0]} л.`);
        }
    },

    "settime": {
        description: "Изменить время на сервере.",
        minLevel: 5,
        syntax: "[hours]:n",
        handler: (player, args) => {
            alt.world.time.hour = parseInt(args[0]);
            terminal.info(`${player.getSyncedMeta("name")} изменил время на сервере на ${args[0]} ч.`);
        }
    },

    "alock": {
        description: 'Открыть/закрыть машины в радиусе 5 м.',
        minLevel: 2,
        syntax: "",
        handler: (player) => {
            var count = 0;
            alt.Vehicle.all.forEach((veh) => {
                var vehDist = Math.sqrt(Math.pow(player.pos.x-veh.pos.x, 2) + Math.pow(player.pos.y-veh.pos.y, 2) + Math.pow(player.pos.z-veh.pos.z, 2));
                if (vehDist <= 5) {
                    veh.lockState = veh.lockState !== 2 ? 2 : 1;
                    count++;
                }
            });
            if (count == 0) return terminal.error(`Нет машин поблизости!`, player);
            terminal.info(`Машин открыто/закрыто: ${count} шт.`, player);
        }
    },

    "animator": {
        description: 'Вкл/Выкл режим проигрывания анимаций.',
        minLevel: 2,
        syntax: "",
        handler: (player) => {
            alt.emitClient(player, "animator");
            terminal.info(`Режим проигрывания анимаций Вкл/Выкл!`, player);
        }
    },

    "anim": {
        description: 'Проиграть определенную анимацию.',
        minLevel: 2,
        syntax: "[animDict]:s [animName]:s",
        handler: (player, args) => {
            alt.emit("anim", player, args[0], args[1]);
        }
    },

    "tp_interior": {
        description: "Телепортироваться в интерьер.",
        minLevel: 3,
        syntax: "[ид_интерьера]:n",
        handler: (player, args) => {
            var interior = alt.interiors.getBySqlId(args[0]);
            if (!interior) return terminal.error(`Интерьер с ID: ${args[0]} не найден!`, player);
            player.pos = new alt.Vector3(interior.x, interior.y, interior.z);
            player.rot = new alt.Vector3(0, 0, interior.h);

            terminal.info(`Вы телепортировались в интерьер с ID: ${args[0]}`, player);
        }
    },

    "tp_garage": {
        description: "Телепортироваться в гараж.",
        minLevel: 3,
        syntax: "[ид_гаража]:n",
        handler: (player, args) => {
            var garage = alt.garages.getBySqlId(args[0]);
            if (!garage) return terminal.error(`Гараж с ID: ${args[0]} не найден!`, player);
            player.pos = new alt.Vector3(garage.x, garage.y, garage.z);
            player.rot = new alt.Vector3(0, 0, garage.h);

            terminal.info(`Вы телепортировались в гараж с ID: ${args[0]}`, player);
        }
    },

    "tp_vehicle": {
        description: "Телепортироваться к авто.",
        minLevel: 3,
        syntax: "[vehicle_id]:n",
        handler: (player, args) => {
            var veh = alt.Vehicle.at(args[0]);
            if (!veh) return terminal.error(`Авто с ID: ${args[0]} не найдено!`, player);
            var pos = veh.pos;
            player.pos = new alt.Vector3(pos.x, pos.y, pos.z + 1);
            player.rot = new alt.Vector3(0, 0, veh.rot.z * Math.PI / 180);

            terminal.info(`Вы телепортировались к авто с ID: ${args[0]}`, player);
        }
    },
    
    "economy_list": {
        description: "Просмотреть экономику сервера.",
        minLevel: 5,
        syntax: "",
        handler: (player, args) => {
            var text = "Экономика сервера:<br/>";
            for (var key in alt.economy) {
                var item = alt.economy[key];
                text += `${key} = ${item.value} (${item.description})<br/>`;
            }
            terminal.log(text, player);
        }
    },

    "set_economy": {
        description: "Изменить экономику сервера. (просмотр всех переменных - economy_list)",
        minLevel: 5,
        syntax: "[имя]:s [значение]:n",
        handler: (player, args) => {
            if (!alt.economy[args[0]]) return terminal.error(`Переменная ${args[0]} не найдена!`, player);

            alt.economy[args[0]].setValue(args[1]);
            terminal.info(`${player.getSyncedMeta("name")} изменил переменную ${args[0]}=${args[1]} (экономика сервера)`);
            alt.logs.addLog(`${player.getSyncedMeta("name")} изменил переменную ${args[0]}=${args[1]} (экономика сервера)`, 'admin', player.account.id, player.sqlId, { level: player.admin, old: args[0], new: args[1] });
        }
    },

    "request_ipl": {
        description: "Загрузить IPL. (для дополнительных интерьеров и локаций)",
        minLevel: 9,
        syntax: "[iplName]:s",
        handler: (player, args) => {
            DB.Query("INSERT INTO ipls (name, request) VALUES (?, 1) ON DUPLICATE KEY UPDATE request=1", [args[0]], (e) => {
                if (e) {
                    alt.log(`Request ipl ${e}`);
                    terminal.error(`IPL: ${args[0]} не загружен. Ошибка`)
                    return;
                }

                alt.world.requestIpl(args[0]);
                terminal.info(`IPL: ${args[0]} загружен!`, player);
            });
        }
    },

    "remove_ipl": {
        description: "Выгрузить IPL. (для дополнительных интерьеров и локаций)",
        minLevel: 9,
        syntax: "[iplName]:s",
        handler: (player, args) => {
            DB.Query("INSERT INTO ipls (name, request) VALUES (?, 0) ON DUPLICATE KEY UPDATE request=0", [args[0]], (e) => {
                if (e) {
                    alt.log(`Remove ipl ${e}`);
                    terminal.error(`IPL: ${args[0]} не выгружен. Ошибка`)
                    return;
                }

                alt.world.removeIpl(args[0]);
                terminal.info(`IPL: ${args[0]} выгружен!`, player);
            });
        }
    },
    "set_faction": {
        description: "Изменить организацию игрока. (0 - уволить)",
        minLevel: 5,
        syntax: "[playerId]:n [factionId]:n",
        handler: (player, args) => {
            var rec = alt.Player.getBySqlId(args[0]);
            if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);

            for (var i = 0; i < alt.factions.length; i++) {
                var f = alt.factions[i];
                if (f.leader && f.leader == rec.sqlId) {
                    f.leader = 0;
                    f.leaderName = "";
                    DB.Query("UPDATE factions SET leader=?,leaderName=? WHERE id=?", [0, "", f.sqlId]);
                }
            }

            if (args[1] == 0) {
                if (!rec.faction) return terminal.error(`Игрок не состоит в организации!`, player);
                rec.utils.setFaction(0);
                rec.utils.success(`${player.getSyncedMeta("name")} уволил Вас из организации`);
                return terminal.info(`${player.getSyncedMeta("name")} уволил игрока ${rec.getSyncedMeta("name")} из организации`);
            }
            
            var faction = alt.factions.getBySqlId(args[1]);
            if (!faction) return terminal.error(`Организация с ID: ${args[1]} не найдена!`);

            if (rec) rec.utils.setFaction(faction.sqlId);
            rec.utils.success(`${player.getSyncedMeta("name")} принял Вас в ${faction.name}`);
            terminal.info(`${player.getSyncedMeta("name")} принял игрока ${rec.getSyncedMeta("name")} в организацию ${faction.name}`);
        }
    },

    "set_dimension": {
        description: "Сменить измерение.",
        minLevel: 3,
        syntax: "[dimension]:n",
        handler: (player, args) => {
            player.dimension = args[0];
            terminal.info(`Вы сменили измерение на ${args[0]}!`);
        }
    },

    "makeadmin": {
        description: "Назначить игрока администратором.",
        minLevel: 6,
        syntax: "[player_id]:n [admin_level]:n",
        handler: (player, args) => {
            var rec = alt.Player.getBySqlId(args[0]);
            if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);
            if (player.admin < args[1]) return terminal.error(`Макс. уровень для выдачи - ${player.admin}!`, player);
            if (rec.admin > player.admin) return terminal.error(`${rec.getSyncedMeta("name")} имеет более высокий уровень администратора!`, player);

            rec.utils.setAdmin(args[1]);
            terminal.info(`${player.getSyncedMeta("name")} назначил администратором ${rec.getSyncedMeta("name")}`);
            rec.utils.success(`${player.getSyncedMeta("name")} назначил Вас администратором!`);
        }
    },

    "godmode": {
        description: "Режим бессмертия для игрока.",
        minLevel: 3,
        syntax: "[player_id]:n",
        handler: (player, args) => {
            var rec = alt.Player.getBySqlId(args[0]);
            if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);

            rec.isGodmode = !rec.isGodmode;
            rec.utils.setLocalVar("godmode", rec.isGodmode);
            if (rec.isGodmode) {
                rec.utils.success(`${player.getSyncedMeta("name")} сделал Вас бессмертным`);
            } else {
                rec.utils.success(`${player.getSyncedMeta("name")} выключил бессмертие Вас`);
            }
        }
    },

    "weapon": {
        description: "Выдать временное оружие игроку.",
        minLevel: 3,
        syntax: "[player_id]:n [model]:s [ammo]:n",
        handler: (player, args) => {
            var rec = alt.Player.getBySqlId(args[0]);
            if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);

            rec.giveWeapon(jhash(args[1]), parseInt(args[2]), true);
            rec.utils.success(`${player.getSyncedMeta("name")} выдал Вам оружие`);
            terminal.info(`${player.getSyncedMeta("name")} выдал оружие ${args[1]} ${args[2]}`);
        }
    },

    "spawn_faction_cars": {
        description: "Заспавнить свободные авто организации на сервере.",
        minLevel: 4,
        syntax: "[faction_id]:n",
        handler: (player, args) => {
            var faction = alt.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Организация с ID: ${args[0]} не найдена!`, player);
            terminal.log(`Свободная техника ${faction.name} будет заспавнена через ${Config.spawnCarsWaitTime/1000} сек.`);
            setSaveTimeout(() => {
                var startTime = new Date().getTime();
                var spawnCount = 0,
                    destroyCount = 0;
                try {
                    alt.Vehicle.all.forEach((vehicle) => {
                        if (vehicle.owner == faction.sqlId) {
                            var result = vehicle.utils.spawn();
                            if (result == 0) spawnCount++;
                            else if (result == 2) destroyCount++;
                        }
                    });
                    var ms = new Date().getTime() - startTime;
                    terminal.info(`${player.getSyncedMeta("name")} заспавнил свободную технику ${faction.name}<br/>Авто на сервере: ${alt.Vehicle.all.length}<br/>Заспавнено: ${spawnCount}<br/>Удалено: ${destroyCount}<br/>Время: ${ms} ms`);
                } catch (err) {
                    terminal.log(err.stack);
                }
            }, Config.spawnCarsWaitTime);
        }
    },

    "spawn_job_cars": {
        description: "Заспавнить свободные рабочие авто на сервере.",
        minLevel: 4,
        syntax: "[job_id]:n",
        handler: (player, args) => {
            var job = alt.jobs.getBySqlId(args[0]);
            if (!job) return terminal.error(`Работа с ID: ${args[0]} не найдена!`, player);
            terminal.log(`Свободная техника работы ${job.name} будет заспавнена через ${Config.spawnCarsWaitTime/1000} сек.`);
            setSaveTimeout(() => {
                var startTime = new Date().getTime();
                var spawnCount = 0,
                    destroyCount = 0;
                try {
                    alt.Vehicle.all.forEach((vehicle) => {
                        if (vehicle.owner == -job.sqlId) {
                            var result = vehicle.utils.spawn();
                            if (result == 0) spawnCount++;
                            else if (result == 2) destroyCount++;
                        }
                    });
                    var ms = new Date().getTime() - startTime;
                    terminal.info(`${player.getSyncedMeta("name")} заспавнил свободную технику работы ${job.name}<br/>Авто на сервере: ${alt.Vehicle.all.length}<br/>Заспавнено: ${spawnCount}<br/>Удалено: ${destroyCount}<br/>Время: ${ms} ms`);
                } catch (err) {
                    terminal.log(err.stack);
                }
            }, Config.spawnCarsWaitTime);
        }
    },

    "spawn_range_cars": {
        description: "Заспавнить свободные авто в радиусе.",
        minLevel: 4,
        syntax: "[range]:n",
        handler: (player, args) => {
            args[0] = Math.clamp(args[0], 10, 500);
            terminal.log(`Свободная техника в радиусе ${args[0]} м. будет заспавнена через ${Config.spawnCarsWaitTime/1000} сек.`);
            setSaveTimeout(() => {
                var startTime = new Date().getTime();
                var spawnCount = 0,
                    destroyCount = 0;
                try {
                    alt.Vehicle.all.forEach((vehicle) => {
                        if (alt.Vehicle.dist(vehicle.pos, player.pos) <= args[0]) {
                            var result = vehicle.utils.spawn();
                            if (result == 0) spawnCount++;
                            else if (result == 2) destroyCount++;
                        }
                    });
                    var ms = new Date().getTime() - startTime;
                    terminal.info(`${player.getSyncedMeta("name")} заспавнил свободную технику в радиусе ${args[0]} м.<br/>Авто на сервере: ${alt.Vehicle.all.length}<br/>Заспавнено: ${spawnCount}<br/>Удалено: ${destroyCount}<br/>Время: ${ms} ms`);
                } catch (err) {
                    terminal.log(err.stack);
                }
            }, Config.spawnCarsWaitTime);
        }
    },

    "save_obj": {
        description: "Сохранить объект в БД (берется из /obj).",
        minLevel: 5,
        syntax: "",
        handler: (player, args) => {
            return terminal.warning(`Ожидаем фикс...`, player);
            if (!player.debugObj) return terminal.error(`Объект не найден! Создайте с помощью /obj.`, player);
            var obj = player.debugObj;
            alt.objects.save(obj.name, obj.pos, obj.rot.z);
            terminal.info(`${player.getSyncedMeta("name")} сохранил объект ${obj.name} в БД`);
        }
    },

    "add_rent_veh": {
        description: "Добавить/обновить арендованное авто.",
        minLevel: 5,
        syntax: "[цвет1]:n [цвет2]:n",
        handler: (player, args) => {
            var newVehicle = player.vehicle;
            if (!newVehicle) return terminal.error(`Вы не в машине!`, player);
            if (args[0] < 0 || args[1] < 0) return terminal.error(`Цвет не может быть меньше 0!`, player);
            if (newVehicle.sqlId) {
                if (alt.isOwnerVehicle(newVehicle)) return player.utils.error(`Это личное авто!`);
                DB.Query("UPDATE vehicles SET owner=?,model=?,color1=?,color2=?,x=?,y=?,z=?,h=?,license=? WHERE id=?",
                [-4001, newVehicle.name, args[0], args[1],
                    newVehicle.pos.x, newVehicle.pos.y, newVehicle.pos.z, newVehicle.rot.z, 0, newVehicle.sqlId
                ], (e) => {
                    terminal.info(`${player.getSyncedMeta("name")} обновил авто для аренды`, player);
                });
            } else {
                DB.Query("INSERT INTO vehicles (owner,model,color1,color2,x,y,z,h,license) VALUES (?,?,?,?,?,?,?,?,?)",
                [-4001, newVehicle.name, args[0], args[1],
                    newVehicle.pos.x, newVehicle.pos.y, newVehicle.pos.z,
                    newVehicle.rot.z, 0
                ], (e, result) => {
                    newVehicle.sqlId = result.insertId;
                    terminal.info(`${player.getSyncedMeta("name")} добавил авто для аренды`);
                });
            }

            newVehicle.owner = -4001;
            newVehicle.spawnPos = newVehicle.pos;
        }
    },

    "add_job_veh": {
        description: "Добавить/обновить рабочее авто (цвет2 нужно указывать, пока не будет фикс RAGEMP).",
        minLevel: 5,
        syntax: "[ид_работы]:n [цвет2]:n",
        handler: (player, args) => {
            var job = alt.jobs.getBySqlId(args[0]);
            if (!job) return terminal.error(`Работа с ID: ${args[0]} не найдена!`, player);

            var newVehicle = player.vehicle;
            if (!newVehicle) return terminal.error(`Вы не в машине!`, player);
            args[0] *= -1;

            if (newVehicle.sqlId) {
                if (alt.isOwnerVehicle(newVehicle)) return player.utils.error(`Это личное авто!`);
                DB.Query("UPDATE vehicles SET owner=?,model=?,color1=?,color2=?,x=?,y=?,z=?,h=? WHERE id=?",
                [args[0], newVehicle.name, newVehicle.primaryColor, args[1],
                    newVehicle.pos.x, newVehicle.pos.y, newVehicle.pos.z, newVehicle.rot.z, newVehicle.sqlId
                ], (e) => {
                    terminal.info(`${player.getSyncedMeta("name")} обновил рабочее авто для ${job.name}`, player);
                });
            } else {
                DB.Query("INSERT INTO vehicles (owner,model,color1,color2,x,y,z,h) VALUES (?,?,?,?,?,?,?,?)",
                [args[0], newVehicle.name, newVehicle.primaryColor, newVehicle.secondaryColor,
                    newVehicle.pos.x, newVehicle.pos.y, newVehicle.pos.z,
                    newVehicle.rot.z
                ], (e, result) => {
                    newVehicle.sqlId = result.insertId;
                    terminal.info(`${player.getSyncedMeta("name")} добавил рабочее авто для ${job.name}`);
                });
            }

            newVehicle.owner = args[0];
            newVehicle.spawnPos = newVehicle.pos;
        }
    },

    "add_autosaloon_veh": {
        description: "Добавить автомобиль для автосалона. Тип: 1 - мото, 2 - авто",
        minLevel: 9,
        syntax: "[title]:s [type]:n [price]:n [max]:n",
        handler: (player, args) => {
            const newVehicle = player.vehicle;
            if (!newVehicle) {
                return terminal.error(`Вы не в машине!`, player);
            }
            const modelHash = vehicle.model;
            DB.Query("INSERT INTO configvehicle (model, modelHash, brend, title, fuelTank, fuelRate, price, max) VALUES (?,?,?,?,?,?,?,?)",
            [newVehicle.name, modelHash, args[1], args[0], 50, 10, args[2], args[3]], (e, result) => {
                if (e) alt.log(e);
                alt.autosaloons.vehicles.push({
                    sqlId: alt.autosaloons.vehicles.length + 1,
                    modelHash,
                    model: newVehicle.name,
                    brend: args[1],
                    title: args[0],
                    fuelTank: 50,
                    fuelRate: 10,
                    price: args[2],
                    max: args[3],
                    buyed: 0
                });
                newVehicle.destroy();
                terminal.info(`${player.getSyncedMeta("name")} добавил транспорт ${newVehicle.name} в автосалон. ID: ${result.insertId}`);
            });
        }
    },
    "delete_autosaloon_veh": {
        description: "Удалить автомобиль для автосалона.",
        minLevel: 9,
        syntax: "[model]:s",
        handler: (player, args) => {
            DB.Query(`DELETE FROM configvehicle WHERE model = ?`, [args[0]], (e, result) => {
                if (result.length <= 0) return player.utils.error(`Данный транспорт в автосалоне не найден`);
                for (var car in alt.autosaloons.vehicles) { if (alt.autosaloons.vehicles[car].model == args[0]) delete alt.autosaloons.vehicles[car]; }
                terminal.info(`${player.getSyncedMeta("name")} удалил транспорт ${newVehicle.name} автосалона. ID: ${result.insertId}`);
            });
        }
    },

    "add_newbie_veh": {
        description: "Добавить/обновить авто для новичков (цвет2 нужно указывать, пока не будет фикс RAGEMP).",
        minLevel: 5,
        syntax: "[цвет2]:n",
        handler: (player, args) => {
            var newVehicle = player.vehicle;
            if (!newVehicle) return terminal.error(`Вы не в машине!`, player);

            if (newVehicle.sqlId) {
                if (alt.isOwnerVehicle(newVehicle)) return player.utils.error(`Это личное авто!`);
                DB.Query("UPDATE vehicles SET owner=?,model=?,color1=?,color2=?,x=?,y=?,z=?,h=? WHERE id=?",
                [-1001, newVehicle.name, newVehicle.primaryColor, args[0],
                    newVehicle.pos.x, newVehicle.pos.y, newVehicle.pos.z, newVehicle.rot.z, newVehicle.sqlId
                ], (e) => {
                    terminal.info(`${player.getSyncedMeta("name")} обновил авто для новичков`, player);
                });
            } else {
                DB.Query("INSERT INTO vehicles (owner,model,color1,color2,x,y,z,h) VALUES (?,?,?,?,?,?,?,?)",
                [-1001, newVehicle.name, newVehicle.primaryColor, newVehicle.secondaryColor,
                    newVehicle.pos.x, newVehicle.pos.y, newVehicle.pos.z,
                    newVehicle.rot.z
                ], (e, result) => {
                    newVehicle.sqlId = result.insertId;
                    terminal.info(`${player.getSyncedMeta("name")} добавил авто для новичков`);
                });
            }

            newVehicle.owner = -1001;
            newVehicle.spawnPos = newVehicle.pos;
        }
    },

    "add_lic_veh": {
        description: "Добавить/обновить авто для автошколы (цвет2 нужно указывать, пока не будет фикс RAGEMP).",
        minLevel: 5,
        syntax: "[цвет2]:n",
        handler: (player, args) => {
            var newVehicle = player.vehicle;
            if (!newVehicle) return terminal.error(`Вы не в машине!`, player);

            if (newVehicle.sqlId) {
                if (alt.isOwnerVehicle(newVehicle)) return player.utils.error(`Это личное авто!`);
                DB.Query("UPDATE vehicles SET owner=?,model=?,color1=?,color2=?,x=?,y=?,z=?,h=? WHERE id=?",
                [-2001, newVehicle.name, newVehicle.primaryColor, args[0],
                    newVehicle.pos.x, newVehicle.pos.y, newVehicle.pos.z, newVehicle.rot.z, newVehicle.sqlId
                ], (e) => {
                    terminal.info(`${player.getSyncedMeta("name")} обновил авто для автошколы`, player);
                });
            } else {
                DB.Query("INSERT INTO vehicles (owner,model,color1,color2,x,y,z,h) VALUES (?,?,?,?,?,?,?,?)",
                [-2001, newVehicle.name, newVehicle.primaryColor, newVehicle.secondaryColor,
                    newVehicle.pos.x, newVehicle.pos.y, newVehicle.pos.z,
                    newVehicle.rot.z
                ], (e, result) => {
                    newVehicle.sqlId = result.insertId;
                    terminal.info(`${player.getSyncedMeta("name")} добавил авто для автошколы`);
                });
            }

            newVehicle.owner = -2001;
            newVehicle.spawnPos = newVehicle.pos;
        }
    },

    "add_farm_veh": {
        description: "Добавить/обновить авто для фермы (цвет2 нужно указывать, пока не будет фикс RAGEMP).",
        minLevel: 5,
        syntax: "[цвет2]:n",
        handler: (player, args) => {
            var newVehicle = player.vehicle;
            if (!newVehicle) return terminal.error(`Вы не в машине!`, player);

            if (newVehicle.sqlId) {
                if (alt.isOwnerVehicle(newVehicle)) return player.utils.error(`Это личное авто!`);
                DB.Query("UPDATE vehicles SET owner=?,model=?,color1=?,color2=?,x=?,y=?,z=?,h=? WHERE id=?",
                [-3001, newVehicle.name, newVehicle.getColor(0), args[0],
                    newVehicle.pos.x, newVehicle.pos.y, newVehicle.pos.z, newVehicle.rot.z, newVehicle.sqlId
                ], (e) => {
                    terminal.info(`${player.getSyncedMeta("name")} обновил авто для фермы`, player);
                });
            } else {
                DB.Query("INSERT INTO vehicles (owner,model,color1,color2,x,y,z,h) VALUES (?,?,?,?,?,?,?,?)",
                [-3001, newVehicle.name, newVehicle.getColor(0), newVehicle.getColor(1),
                    newVehicle.pos.x, newVehicle.pos.y, newVehicle.pos.z,
                    newVehicle.rot.z
                ], (e, result) => {
                    newVehicle.sqlId = result.insertId;
                    terminal.info(`${player.getSyncedMeta("name")} добавил авто для фермы`);
                });
            }

            newVehicle.owner = -3001;
            newVehicle.spawnPos = newVehicle.pos;
        }
    },

    "restart": {
        description: "Рестарт сервера (только для linux).",
        minLevel: 5,
        syntax: "",
        handler: (player, args) => {
            terminal.info(`${player.getSyncedMeta("name")} запустил рестарт сервера через ${Config.restartWaitTime / 1000} сек.`);
            alt.Player.all.forEach((rec) => {
                if (rec.sqlId) {
                    rec.utils.success(`${player.getSyncedMeta("name")} запустил рестарт сервера через 10 секунд...`);
                    savePlayerDBParams(rec);
                    //saveFarmFieldsDBParams();
                }
            });
            setSaveTimeout(() => {
                process.exit();
            }, Config.restartWaitTime);
        }
    },

    "update": {
        description: "Обновить мод до последней версии.",
        minLevel: 5,
        syntax: "[branch]:s",
        handler: (player, args) => {
            var branches = ["master", "testing", "feature/console"];
            if (!branches.includes(args[0])) return terminal.error(`Неверная ветка! (${branches})`);
            terminal.info(`${player.getSyncedMeta("name")} обновляет сервер...`);
            exec(`cd ${__dirname} && git clean -d -f && git stash && git checkout ${args[0]} && git pull`, (error, stdout, stderr) => {
                if (error) alt.log(stderr);
                alt.log(stdout);
                terminal.log(`Последняя версия мода обновлена! Необходим рестарт.`);

                alt.Player.all.forEach((rec) => {
                    if (rec.sqlId) {
                        rec.utils.success(`${player.getSyncedMeta("name")} обновил версию мода! (${args[0]})`);
                    }
                });
            });
        }
    },

    "jobs_list": {
        description: "Посмотреть список работ.",
        minLevel: 5,
        syntax: "",
        handler: (player) => {
            var text = "";
            for (var i = 0; i < alt.jobs.length; i++) {
                var job = alt.jobs[i];
                text += `${job.sqlId}) ${job.name} (${job.level} lvl)<br/>`;
            }

            terminal.log(text, player);
        }
    },

    "set_job_name": {
        description: "Изменить название работы.",
        minLevel: 5,
        syntax: "[job_id]:n [name]:s",
        handler: (player, args) => {
            var job = alt.jobs.getBySqlId(args[0]);
            if (!job) return terminal.error(`Работа с ID: ${args[0]} не найдена!`, player);

            terminal.info(`${player.getSyncedMeta("name")} сменил имя у организации с ID: ${args[0]}!`);
            args.splice(0, 1);
            job.setName(args.join(" "));
        }
    },

    "set_job_level": {
        description: "Изменить мин. уровень игрока для работы.",
        minLevel: 5,
        syntax: "[job_id]:n [level]:n",
        handler: (player, args) => {
            var job = alt.jobs.getBySqlId(args[0]);
            if (!job) return terminal.error(`Работа с ID: ${args[0]} не найдена!`, player);

            terminal.info(`${player.getSyncedMeta("name")} сменил имя мин. уровень у работы с ID: ${args[0]}!`);
            job.setLevel(args[1]);
        }
    },

    "set_job": {
        description: "Изменить работу игрока.",
        minLevel: 3,
        syntax: "[player_id]:n [job_id]:n",
        handler: (player, args) => {
            var rec = alt.Player.getBySqlId(args[0]);
            if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);

            rec.utils.setJob(args[1]);
            terminal.info(`${player.getSyncedMeta("name")} сменил работу у ${rec.getSyncedMeta("name")}`);
        }
    },

    "set_job_skills": {
        description: "Изменить навыки работы игрока.",
        minLevel: 3,
        syntax: "[player_id]:n [job_id]:n [exp]:n",
        handler: (player, args) => {
            var rec = alt.Player.getBySqlId(args[0]);
            if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);

            var job = alt.jobs.getBySqlId(args[1]);
            if (!job) return terminal.error(`Работа с ID: ${args[1]} не найдена!`, player);

            rec.utils.setJobSkills(job.sqlId, args[2]);
            terminal.info(`${player.getSyncedMeta("name")} изменил навыки работы у ${rec.getSyncedMeta("name")}`);
        }
    },

    "set_temp_skin": {
        description: "Изменить свой скин.",
        minLevel: 3,
        syntax: "[skin]:s",
        handler: (player, args) => {
            player.model = jhash(args[0]);
        }
    },

    "set_skin": {
        description: "Изменить скин игрока.",
        minLevel: 6,
        syntax: "[id/name]:s [skin]:s",
        handler: (player, args) => {
            if (getPlayerStatus(args[0]) === "on") {
                var rec = alt.Player.getBySqlId(args[0]);
                if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);

                rec.model = jhash(args[1]);
                terminal.info(`${player.getSyncedMeta("name")} изменил скин у ${rec.getSyncedMeta("name")}`);

                DB.Query(`UPDATE characters SET skin = ? WHERE id = ?`, [args[1], rec.sqlId]);
            } else {
                let name = getSpecialName(args[0], player);
                DB.Query(`SELECT * FROM characters SET skin = ? WHERE name = ?`, [args[1], name], (e, result) => {
                    if (e) return alt.log(e);
                    if (result.length <= 0) return terminal.error(`Игрок с именем: ${name} не найден!`, player);

                    var rec = alt.Player.getBySqlId(result[0].id);
                    if (rec) rec.model = jhash(args[1]);

                    terminal.info(`${player.getSyncedMeta("name")} изменил скин у ${name}`);
                    DB.Query(`UPDATE characters SET skin = ? WHERE id = ?`, [args[1], result[0].id]);
                });
            }
        }
    },


    "set_walking": {
        description: "Изменить походку игрока.",
        minLevel: 3,
        syntax: "[player_id]:n [animSet]:s",
        handler: (player, args) => {
            var rec = alt.Player.getBySqlId(args[0]);
            if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);

            rec.setSyncedMeta("walking", args[1]);
        }
    },

    "give_licenses": {
        description: "Выдать все лицензии игроку.",
        minLevel: 4,
        syntax: "[player_id]:n",
        handler: (player, args) => {
            var rec = alt.Player.getBySqlId(args[0]);
            if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);

            var docs = rec.inventory.getArrayByItemId(16);
            if (!Object.keys(docs).length) {
                var params = {
                    owner: rec.sqlId,
                    licenses: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
                    weapon: [0, 0, 0, 0, 0, 0, 0],
                    work: []
                };
                alt.fullDeleteItemsByParams(16, ["owner"], [rec.sqlId]);
                rec.inventory.add(16, params, null, (e) => {
                    if (e) return terminal.error(e, player);
                    terminal.info(`${player.getSyncedMeta("name")} выдал документы с лицензиями игроку ${rec.getSyncedMeta("name")}`);
                });
            } else {
                for (var key in docs) {
                    if (docs[key].params.owner == rec.sqlId) {
                        docs[key].params.licenses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
                        rec.inventory.updateParams(docs[key].id, docs[key]);
                        return terminal.info(`${player.getSyncedMeta("name")} добавил лицензии в документы игрока ${rec.getSyncedMeta("name")}`);
                    }
                }
                terminal.error(`Не получилось выдать лицензии!`, player);
            }
        }
    },

    "give_clothes": {
        description: "Выдать одежду",
        minLevel: 10,
        syntax: "[player_id]:n [type]:n [texture]:n [drawable]:n",
        handler: (player, args) => {
            var rec = alt.Player.getBySqlId(args[0]);
            if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);
            var params;
            if (player.sex == 1) {
                params = { 
                    sex: 1, 
                    variation: [args[4]][0], 
                    texture: [0][args[3]]
                };
            } else {
                params = { 
                    sex: 0, 
                    variation: [args[4]][0], 
                    texture: [0][args[3]]
                };
            }

            if (params.undershirt == -1) delete params.undershirt;
            if (params.uTexture == -1) delete params.uTexture;
            if (params.tTexture == -1) delete params.tTexture;

            if (args[1] == 7) {
                params.rows = 5;
                params.cols = 5;
            } 

            if (args[1] == 8) {
                params.rows = 3;
                params.cols = 3;
            }

            params.owner = rec.sqlId;

            rec.inventory.add(args[1], params, {}, (e) => {
                if (e) return player.utils.error(e);
                rec.utils.success(`Администратор ${player.getSyncedMeta("name")} выдал вам элемент одежды ${alt.inventory.getItem(args[1]).name}`);
            });
        }
    },

    "terminal_cmd_name": {
        description: "Изменить название команды.",
        minLevel: 6,
        syntax: "[cmd_name]:s [name]:s",
        handler: (player, args) => {
            var cmd = cmds[args[0]];
            if (!cmd) return terminal.error(`Команда ${args[0]} не найдена!`, player);
            if (cmds[args[1]]) return terminal.error(`Команда ${args[1]} уже существует!`, player);

            DB.Query(`SELECT * FROM terminal_cmds WHERE name=?`, [args[0]], (e, result) => {
                terminal.info(`${player.getSyncedMeta("name")} изменил команду ${args[0]} на ${args[1]}`);
                if (!result.length) {
                    DB.Query(`INSERT INTO terminal_cmds (cmd,name,description,minLevel) VALUES (?,?,?,?)`, [args[0], args[1], cmd.description, cmd.minLevel]);
                } else {
                    DB.Query(`UPDATE terminal_cmds SET name=? WHERE name=?`, [args[1], args[0]]);
                }
                delete cmds[args[0]];
                cmds[args[1]] = cmd;
            });
        }
    },

    "terminal_cmd_description": {
        description: "Изменить описание команды.",
        minLevel: 6,
        syntax: "[cmd_name]:s [description]:s",
        handler: (player, args) => {
            var cmdName = args[0];
            args.splice(0, 1);
            var description = args.join(" ");
            var cmd = cmds[cmdName];
            if (!cmd) return terminal.error(`Команда ${cmdName} не найдена!`, player);

            DB.Query(`SELECT * FROM terminal_cmds WHERE name=?`, [cmdName], (e, result) => {
                terminal.info(`${player.getSyncedMeta("name")} изменил описание команды ${cmdName}`);
                if (!result.length) {
                    DB.Query(`INSERT INTO terminal_cmds (cmd,name,description,minLevel) VALUES (?,?,?,?)`, [cmdName, cmdName, description, cmd.minLevel]);
                } else {
                    DB.Query(`UPDATE terminal_cmds SET description=? WHERE name=?`, [description, cmdName]);
                }
                cmd.description = description;
            });
        }
    },

    "terminal_cmd_minlevel": {
        description: "Изменить мин. уровень команды.",
        minLevel: 6,
        syntax: "[cmd_name]:s [minLevel]:n",
        handler: (player, args) => {
            var cmdName = args[0];
            var cmd = cmds[cmdName];
            if (!cmd) return terminal.error(`Команда ${cmdName} не найдена!`, player);
            if (player.admin < args[1]) return terminal.error(`Макс. уровень для изменения - ${player.admin}!`, player);
            if (cmd.minLevel > player.admin) return terminal.error(`Вам недоступна эта команда!`, player);

            DB.Query(`SELECT * FROM terminal_cmds WHERE name=?`, [cmdName], (e, result) => {
                terminal.info(`${player.getSyncedMeta("name")} изменил мин. уровень команды ${cmdName}`);
                if (!result.length) {
                    DB.Query(`INSERT INTO terminal_cmds (cmd,name,description,minLevel) VALUES (?,?,?,?)`,
                        [cmdName, cmdName, cmd.description, args[1]]);
                } else {
                    DB.Query(`UPDATE terminal_cmds SET minLevel=? WHERE name=?`, [args[1], cmdName]);
                }
                cmd.minLevel = args[1];
            });
        }
    },

    "create_tpmarker": {
        description: "Создать маркер для телепорта. (укажите координаты конечного маркера)",
        minLevel: 6,
        syntax: "[x]:n [y]:n [z]:n [h]:n",
        handler: (player, args) => {
            var data = {
                x: player.pos.x,
                y: player.pos.y,
                z: player.pos.z - 1,
                h: player.rot.z,
                tpX: args[0],
                tpY: args[1],
                tpZ: args[2] - 1,
                tpH: args[3],
            };
            var dist = alt.Player.dist(player.pos, new alt.Vector3(data.tpX, data.tpY, data.tpZ));
            if (dist < 2) return terminal.error(`Маркеры слишком близки друг к другу!`, player);
            DB.Query("INSERT INTO markers_tp (x,y,z,h,tpX,tpY,tpZ,tpH) VALUES (?,?,?,?,?,?,?,?)",
            [data.x, data.y, data.z, data.h, data.tpX, data.tpY, data.tpZ, data.tpH], (e, result) => {
                data.id = result.insertId;
                createTpMarker(data);
                terminal.info(`${player.getSyncedMeta("name")} создал ТП-маркер №${data.id}`);
            });
        }
    },

    "delete_tpmarker": {
        description: "Удалить маркер для телепорта.",
        minLevel: 6,
        syntax: "",
        handler: (player, args) => {
            alt.markers.forEachInRange(player.pos, 2, (m) => {
                if (m.colshape.tpMarker) {
                    DB.Query("DELETE FROM markers_tp WHERE id=?", m.sqlId);
                    terminal.error(`${player.getSyncedMeta("name")} удалил ТП-Маркер №${m.sqlId}`);

                    delete m.colshape.targetMarker;
                    m.destroy();
                }
            });
        }
    },

    "create_ped": {
        description: "Создать педа.",
        minLevel: 6,
        syntax: "[model]:s",
        handler: (player, args) => {
            var pos = player.pos;
            DB.Query("INSERT INTO peds (model,x,y,z,h) VALUES (?,?,?,?,?)",
            [args[0], pos.x, pos.y, pos.z, player.rot], (e, result) => {
                var data = {
                    sqlId: result.insertId,
                    position: pos,
                    heading: player.rot,
                    hash: jhash(args[0].trim()),
                };
                alt.dbPeds.push(data);
                alt.Player.all.forEach((rec) => {
                    if (rec.sqlId) alt.emitClient(rec, `peds.create`, [data]);
                });

                terminal.info(`${player.getSyncedMeta("name")} создал педа с ID: ${data.sqlId}`);
            });
        }
    },
    "delete_ped": {
        description: "Удалить ближайшего педа.",
        minLevel: 6,
        syntax: "",
        handler: (player, args) => {
            var ped = alt.dbPeds.getNear(player);
            if (!ped) return terminal.error(`Пед поблизости не найден!`, player);

            alt.dbPeds.deletePed(ped);
            terminal.info(`${player.getSyncedMeta("name")} удалил педа с ID: ${ped.sqlId}`);
        }
    },

    "clear_chat": {
        description: "Очистить чат.",
        minLevel: 6,
        syntax: "",
        handler: (player, args) => {
            alt.Player.all.forEach((rec) => {
                if (rec.sqlId) alt.emitClient(rec, `chat.clear`, player.sqlId);
            });
            terminal.info(`${player.getSyncedMeta("name")} очистил чат`);
        }
    },

    "refresh_whitelist": {
        description: "Обновить whitelist.",
        minLevel: 9,
        syntax: "",
        handler: (player, args) => {
            whitelist.Refresh();
        }
    },

    "give_car_keys": {
        description: "Сделать админ-авто личным и выдать ключи.",
        minLevel: 9,
        syntax: "",
        handler: (player, args) => {
            if (!player.vehicle) return terminal.error(`Вы не в авто!`, player);
            if (player.vehicle.sqlId) return terminal.error(`Авто не является админским!`);
            var freeSlot = player.inventory.findFreeSlot(54);
            if (!freeSlot) return terminal.error(`Освободите место для ключей!`, player);
            var veh = player.vehicle;
            veh.owner = player.sqlId + 2000;

            DB.Query("INSERT INTO vehicles (owner,model,color1,color2,x,y,z,h) VALUES (?,?,?,?,?,?,?,?)",
                [veh.owner, veh.name, veh.primaryColor, veh.secondaryColor,
                    veh.pos.x, veh.pos.y, veh.pos.z,
                    veh.rot.z
                ], (e, result) => {
                    veh.sqlId = result.insertId;
                    terminal.info(`${player.getSyncedMeta("name")} сделал авто ${veh.name} личным `);

                    var params = {
                        owner: player.sqlId,
                        car: veh.sqlId,
                        model: veh.name
                    };
                    
                    player.carIds.push(veh.id);
                    initVehicleInventory(veh);

                    player.inventory.add(54, params, null, (e) => {
                        if (e) return terminal.error(e, player);
                    });
                });

            veh.spawnPos = veh.pos;
        }
    },
    "add_green_zone": {
        description: "Добавить зелёную зону",
        minLevel: 9,
        syntax: "",
        handler: (player) => {
            alt.emitClient(player, "green_zone::addRemove", true);
        }
    },
    "remove_green_zone": {
        description: "Удалить зелёную зону",
        minLevel: 9,
        syntax: "",
        handler: (player) => {
            alt.emitClient(player, "green_zone::addRemove", false);
        }
    },

    "q": {
        description: "Отключиться от сервера.",
        minLevel: 1,
        syntax: "",
        handler: (player, args) => {
            player.kick();
        }
    },
    "set_bandzone_band": {
        description: "Изменить банду у ганг-зоны.",
        minLevel: 6,
        syntax: "[zoneId]:n [bandId]:n",
        handler: (player, args) => {
            var zone = alt.bandZones[args[0]];
            if (!zone) return alt.terminal.error(`Зона с ID: ${args[0]} не найдена!`, player);
            var band = alt.factions.getBySqlId(args[1]);
            if (!band) return terminal.error(`Организация с ID: ${args[1]} не найдена!`, player);
            if (!alt.factions.isGangFaction(band.sqlId)) return terminal.error(`${band.name} не является бандой!`, player);

            zone.setBand(band.sqlId);
            terminal.info(`${player.getSyncedMeta("name")} изменил банду у зоны ${zone.id} на ${band.name}`);
        }
    },
    "cutscene": {
        description: "Запустить катсцену по названию.",
        minLevel: 1,
        syntax: "[cutsceneName]:s",
        handler: (player, args) => {
            alt.emitClient(player, "startCutscene", args[0]);
            terminal.info(`Катсцена запущена.`, player);
        }
    },
}
// Functions | Изменить
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getPlayerStatus(char) {
    let num = parseInt(char, 10);
    if (isNaN(num)) return "off";
    else return "on";
}

function getSpecialName(name, player) {
    if (!name.includes("_")) return false;
    let text = name.split("_");
    return text[0] + " " + text[1];
}

alt.onClient("delete.player.admin.freeze", (player) => {
    if (player.isFreeze) delete player.isFreeze;
});

var adm_color = "#ff6666"; // Цвет для реальных пацанов: #FF0000
