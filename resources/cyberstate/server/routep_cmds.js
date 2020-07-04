module.exports = {
    "add_routep": {
        description: "Добавить точку маршрута.",
        minLevel: 2,
        syntax: "[name]:s [type]:n",
        handler: (player, args) => {
            if ((args[1] ^ 0) !== args[1]) return terminal.error(`Параметр [type] должен быть целым числом!`, player);

            var lastStep = -1;
            alt.routeps.forEach((routep) => {
                if (routep.type == args[1] && routep.step > lastStep)
                    lastStep = routep.step;
            });

            var pos = player.pos;

            DB.Query("INSERT INTO routeps (name, type, step, data, x, y, z) VALUES (?,?,?,?,?,?,?)",
                [args[0], args[1], lastStep + 1, JSON.stringify({}), pos.x, pos.y, pos.z - 1], (e, result) => {

                    var routep = {
                        id: result.insertId,
                        name: args[0],
                        type: args[1],
                        step: lastStep + 1,
                        data: {},
                        x: pos.x,
                        y: pos.y,
                        z: pos.z - 1,
                    }

                    alt.routeps.push(routep);

                    var colshape = alt.colshapes.newCircle(pos.x, pos.y, 3, 0);
                    colshape.routep = routep;

                    terminal.info(`${player.getSyncedMeta("name")} создал точку с ID: ${result.insertId} на маршруте: ${args[1]}`);

                    var route = alt.routeps.getRoute(args[1]);
                    player.debugRoute = args[1];
                    alt.Player.all.forEach((recipient) => {
                        if (recipient.debugRoute == args[1]) {
                            alt.emitClient(recipient, "checkpoints.create", route);
                        }
                    });
                    //terminal.info(alt.routeps);
                });
        }
    },

    "delete_routep": {
        description: "Удалить точку маршрута.",
        minLevel: 2,
        syntax: "[routepId]:n",
        handler: (player, args) => {
            if ((args[0] ^ 0) !== args[0]) return terminal.error(`Параметр [id] должен быть целым числом!`, player);

            var routep = alt.routeps.getBySqlId(args[0]);
            var type = routep.type;
            if (!routep) return terminal.error(`Точка с ID: ${args[0]} не найдена`, player);

            alt.routeps.delete(routep, (e) => {
                if (e) return terminal.error(e, player);
                terminal.info(`${player.getSyncedMeta("name")} удалил точку с ID: ${args[0]}`);
            });

            var route = alt.routeps.getRoute(type);

            player.debugRoute = type;
            alt.Player.all.forEach((recipient) => {
                if (recipient.debugRoute == type) {
                    alt.emitClient(recipient, "checkpoints.create", route);
                }
            });
            //terminal.info(alt.routeps);
        }
    },

    "set_step_routep": {
        description: "Изменить порядковый номер точки",
        minLevel: 2,
        syntax: "[routepId]:n [step]:n",
        handler: (player, args) => {
            alt.routeps.updateStep(args[0], args[1], (e, type) => {
                if (e) return terminal.error(e, player);

                var route = alt.routeps.getRoute(type);
                player.debugRoute = type;
                alt.Player.all.forEach((recipient) => {
                    if (recipient.debugRoute == type) {
                        alt.emitClient(recipient, "checkpoints.create", route);
                    }
                });
                terminal.info(`${player.getSyncedMeta("name")} у точки с ID: ${args[0]} изменил step: ${args[1]}`);
            });
        }
    },

    "set_name_routep": {
        description: "Изменить название точки",
        minLevel: 2,
        syntax: "[routepId]:n [name]:s",
        handler: (player, args) => {
            alt.routeps.updateName(args[0], args[1], (e, type) => {
                if (e) return terminal.error(e, player);

                var route = alt.routeps.getRoute(type);
                player.debugRoute = type;
                alt.Player.all.forEach((recipient) => {
                    if (recipient.debugRoute == type) {
                        alt.emitClient(recipient, "checkpoints.create", route);
                    }
                });
                terminal.info(`${player.getSyncedMeta("name")} у точки с ID: ${args[0]} изменил name: ${args[1]}`);
            });
        }
    },

    "set_type_routep": {
        description: "Изменить тип (номер маршрута) точки",
        minLevel: 2,
        syntax: "[routepId]:n [type]:n",
        handler: (player, args) => {
            alt.routeps.updateType(args[0], args[1], (e) => {
                if (e) return terminal.error(e, player);

                var route = alt.routeps.getRoute(args[1]);
                player.debugRoute = args[1];
                alt.Player.all.forEach((recipient) => {
                    if (recipient.debugRoute == args[1]) {
                        alt.emitClient(recipient, "checkpoints.create", route);
                    }
                });
                terminal.info(`${player.getSyncedMeta("name")} у точки с ID: ${args[0]} изменил type: ${args[1]}`);
            });
        }
    },

    "set_pos_routep": {
        description: "Изменить позицию точки",
        minLevel: 2,
        syntax: "[routepId]:n [x]:n [y]:n [z]:n",
        handler: (player, args) => {
            alt.routeps.updatePosition(args[0], args[1], args[2], args[3], (e, type) => {
                if (e) return terminal.error(e, player);

                var route = alt.routeps.getRoute(type);
                player.debugRoute = type;
                alt.Player.all.forEach((recipient) => {
                    if (recipient.debugRoute == type) {
                        alt.emitClient(recipient, "checkpoints.create", route);
                    }
                });
                terminal.info(`${player.getSyncedMeta("name")} у точки с ID: ${args[0]} изменил позицию`);
            });
        }
    },

    "set_station_routep": {
        description: "Изменить позицию точки",
        minLevel: 2,
        syntax: "[routepId]:n",
        handler: (player, args) => {
            alt.routeps.setStation(args[0], (e, type) => {
                if (e) return terminal.error(e, player);

                var route = alt.routeps.getRoute(type);
                player.debugRoute = type;
                alt.Player.all.forEach((recipient) => {
                    if (recipient.debugRoute == type) {
                        alt.emitClient(recipient, "checkpoints.create", route);
                    }
                });
                terminal.info(`${player.getSyncedMeta("name")} сделал точку с ID: ${args[0]} остановкой`);
            });
        }
    },

    "show_route": {
        description: "Показать маршрут полностью.",
        minLevel: 2,
        syntax: "[playerId]:n [routeType]:n",
        handler: (player, args) => {
            if ((args[0] ^ 0) !== args[0]) return terminal.error(`Параметр [playerId] должен быть целым числом!`, player);
            if ((args[1] ^ 0) !== args[1]) return terminal.error(`Параметр [routeType] должен быть целым числом!`, player);

            var recipient = alt.Player.getBySqlId(args[0]);
            if (!recipient) return terminal.error(`Игрок с ID: ${args[0]} не найден!`);

            var route = alt.routeps.getRoute(args[1]);

            if (!route[0]) return terminal.error(`Маршрут с TYPE: ${args[1]} не существует!`);

            recipient.debugRoute = args[1];

            alt.emitClient(recipient, "checkpoints.create", route);
            terminal.info(`${player.getSyncedMeta("name")} следит за маршрутом с TYPE: ${args[1]}`);
        }
    },

    "hide_route": {
        description: "Скрыть маршрут.",
        minLevel: 2,
        syntax: "[playerId]:n",
        handler: (player, args) => {
            if ((args[0] ^ 0) !== args[0]) return terminal.error(`Параметр [playerId] должен быть целым числом!`, player);

            var recipient = alt.Player.getBySqlId(args[0]);
            if (!recipient) return terminal.error(`Игрок с ID: ${args[0]} не найден!`);

            alt.emitClient(recipient, "checkpoints.create", []);

            terminal.info(`${player.getSyncedMeta("name")} теперь не следит за маршрутом с TYPE: ${recipient.debugRoute}`);
            recipient.debugRoute = null;
        }
    },

    "start_route": {
        description: "Начать маршрут.",
        minLevel: 2,
        syntax: "[playerId]:n [routeType]:n",
        handler: (player, args) => {
            var recipient = alt.Player.getBySqlId(args[0]);
            recipient.route = alt.routeps.getRoute(args[1]);

            recipient.currentRoutepIndex = 0;
            var direction = (player.route[1]) ? new alt.Vector3(player.route[1].x, player.route[1].y, player.route[1].z, ) : null;

            alt.emitClient(recipient, "checkpoint.create", recipient.route[0], direction);
        }
    }
}
