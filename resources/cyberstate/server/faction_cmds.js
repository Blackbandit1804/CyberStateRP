module.exports = {
    "factions_list": {
        description: "Посмотреть список организаций.",
        minLevel: 5,
        syntax: "",
        handler: (player) => {
            var text = "ID) Имя (Лидер) [товар] [цвет блипа]<br/>";
            for (var i = 0; i < alt.factions.length; i++) {
                var faction = alt.factions[i];
                text += `${faction.sqlId}) ${faction.name} (${faction.leaderName}) [${faction.products}/${faction.maxProducts} ед.] [${faction.blipColor}] <br/>`;
            }

            terminal.log(text, player);
        }
    },
    "set_faction_name": {
        description: "Сменить имя организации.",
        minLevel: 5,
        syntax: "[ид_организации]:n [имя]:s",
        handler: (player, args) => {
            var faction = alt.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Организация с ID: ${args[0]} не найдена!`, player);

            terminal.info(`${player.getSyncedMeta("name")} сменил имя у организации с ID: ${args[0]}!`);
            args.splice(0, 1);
            faction.setName(args.join(" ").trim());
        }
    },
    "set_faction_leader": {
        description: "Сменить лидера организации. Используйте несуществующий ник для удаления владельца.",
        minLevel: 5,
        syntax: "[ид_организации]:n [имя]:s [фамилия]:s",
        handler: (player, args) => {
            var faction = alt.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Организация с ID: ${args[0]} не найдена!`, player);

            var name = `${args[1]} ${args[2]}`;
            DB.Characters.getSqlIdByName(name, (sqlId) => {
                //if (!sqlId) return terminal.error(`Персонаж с именем ${name} не найден!`, player);
                faction.setLeader(sqlId, name);
                if (sqlId) {
                    terminal.info(`${player.getSyncedMeta("name")} изменил владельца у организации ${faction.name}`);
                    var rec = alt.Player.getBySqlId(sqlId);
                    if (rec) {
                        rec.utils.success(`${player.getSyncedMeta("name")} назначил Вас лидером ${faction.name}`);
                    }
                } else terminal.info(`${player.getSyncedMeta("name")} удалил владельца у организации ${faction.name}`);
            });
        }
    },
    "set_faction_products": {
        description: "Изменить количество товара на складе организации.",
        minLevel: 5,
        syntax: "[ид_организации]:n [товар]:n",
        handler: (player, args) => {
            var faction = alt.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Организация с ID: ${args[0]} не найдена!`, player);

            faction.setProducts(args[1]);
            terminal.info(`${player.getSyncedMeta("name")} изменил количество товара у организации с ID: ${args[0]}`);
        }
    },
    "set_faction_maxproducts": {
        description: "Изменить вместимость товара на складе организации.",
        minLevel: 5,
        syntax: "[ид_организации]:n [вместимость]:n",
        handler: (player, args) => {
            var faction = alt.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Организация с ID: ${args[0]} не найдена!`, player);

            faction.setMaxProducts(args[1]);
            terminal.info(`${player.getSyncedMeta("name")} изменил вместимость склада у организации с ID: ${args[0]}`);
        }
    },
    "set_faction_blipcolor": {
        description: "Изменить цвет блипа на карте у организации.",
        minLevel: 5,
        syntax: "[ид_организации]:n [цвет_блипа]:n",
        handler: (player, args) => {
            var faction = alt.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Организация с ID: ${args[0]} не найдена!`, player);

            faction.setBlipColor(args[1]);
            terminal.info(`${player.getSyncedMeta("name")} изменил цвет блипа у организации с ID: ${args[0]}`);
        }
    },
    "set_faction_blip": {
        description: "Изменить блипа на карте у организации.",
        minLevel: 5,
        syntax: "[ид_организации]:n [блип]:n",
        handler: (player, args) => {
            var faction = alt.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Организация с ID: ${args[0]} не найдена!`, player);

            faction.setBlip(args[1]);
            terminal.info(`${player.getSyncedMeta("name")} изменил  блипа у организации с ID: ${args[0]}`);
        }
    },
    "set_faction_position": {
        description: "Изменить позицию организации. Позиция берется от игрока.",
        minLevel: 5,
        syntax: "[ид_организации]:n",
        handler: (player, args) => {
            var faction = alt.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Организация с ID: ${args[0]} не найдена!`, player);

            faction.setPosition(player.pos, player.rot);
            terminal.info(`${player.getSyncedMeta("name")} изменил позицию у организации с ID: ${args[0]}`);
        }
    },

    "set_faction_warehouse": {
        description: "Изменить позицию склада организации. Позиция берется от игрока.",
        minLevel: 5,
        syntax: "[ид_организации]:n",
        handler: (player, args) => {
            var faction = alt.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Организация с ID: ${args[0]} не найдена!`, player);

            faction.setWarehousePosition(player.pos);
            terminal.info(`${player.getSyncedMeta("name")} изменил позицию склада у организации с ID: ${args[0]}`);
        }
    },

    "set_faction_storage": {
        description: "Изменить позицию выдачи предметов организации. Позиция берется от игрока.",
        minLevel: 5,
        syntax: "[ид_организации]:n",
        handler: (player, args) => {
            var faction = alt.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Организация с ID: ${args[0]} не найдена!`, player);

            faction.setStoragePosition(player.pos);
            terminal.info(`${player.getSyncedMeta("name")} изменил позицию выдачи предметов у организации с ID: ${args[0]}`);
        }
    },

    "tp_faction": {
        description: "Телепортироваться к организации.",
        minLevel: 3,
        syntax: "[ид_организации]:n",
        handler: (player, args) => {
            var faction = alt.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Организация с ID: ${args[0]} не найдена!`, player);
            var pos = faction.pos;
            player.pos = pos;
            terminal.info(`Вы телепортировались к организации с ID: ${args[0]}`, player);
        }
    },

    "set_faction_rankname": {
        description: "Изменить название ранга.",
        minLevel: 5,
        syntax: "[ид_организации]:n [ид_ранга]:n [название]:s",
        handler: (player, args) => {
            var faction = alt.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Организация с ID: ${args[0]} не найдена!`, player);

            var factionId = args[0];
            var rank = args[1];

            args.splice(0, 2);
            alt.factions.setRankName(factionId, rank, args.join(" ").trim());
            terminal.info(`${player.getSyncedMeta("name")} изменил название ранга у организации с ID: ${factionId}`);
        }
    },

    "set_faction_rankpay": {
        description: "Изменить зарплату ранга.",
        minLevel: 5,
        syntax: "[ид_организации]:n [ид_ранга]:n [цена]:n",
        handler: (player, args) => {
            var faction = alt.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Организация с ID: ${args[0]} не найдена!`, player);

            alt.factions.setRankPay(args[0], args[1], args[2]);
            terminal.info(`${player.getSyncedMeta("name")} изменил зарплату ранга у организации с ID: ${args[0]}`);
        }
    },

    "ranks_list": {
        description: "Получить список рангов для фракции.",
        minLevel: 5,
        syntax: "[ид_организации]:n",
        handler: (player, args) => {
            var faction = alt.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Организация с ID: ${args[0]} не найдена!`, player);

            var text = `Организация ${faction.name}:<br/>`;
            var ranks = alt.factionRanks[faction.sqlId];
            for (var i = 1; i <= ranks.length - 1; i++) text += `${i}) ${ranks[i].name} - ${ranks[i].pay}$<br/>`;

            terminal.log(text, player);
        }
    },

    "add_faction_veh": {
        description: "Добавить/обновить авто организации (цвет2 нужно указывать, пока не будет фикс RAGEMP).",
        minLevel: 5,
        syntax: "[ид_организации]:n [цвет2]:n",
        handler: (player, args) => {
            var faction = alt.factions.getBySqlId(args[0]);
            if (!faction) return terminal.error(`Организация с ID: ${args[0]} не найдена!`, player);

            var newVehicle = player.vehicle;
            if (!newVehicle) return terminal.error(`Вы не в машине!`, player);

            if (newVehicle.sqlId) {
                if (alt.isOwnerVehicle(newVehicle)) return player.utils.error(`Это личное авто!`);
                DB.Query("UPDATE vehicles SET owner=?,model=?,color1=?,color2=?,x=?,y=?,z=?,h=? WHERE id=?",
                    [args[0], newVehicle.name, newVehicle.primaryColor, args[1],
                    newVehicle.pos.x, newVehicle.pos.y, newVehicle.pos.z, newVehicle.rot.z, newVehicle.sqlId
                    ], (e) => {
                        terminal.info(`${player.getSyncedMeta("name")} обновил авто организации ${faction.name}`, player);
                    });
            } else {
                DB.Query("INSERT INTO vehicles (owner,model,color1,color2,x,y,z,h) VALUES (?,?,?,?,?,?,?,?)",
                    [args[0], newVehicle.name, newVehicle.primaryColor, newVehicle.secondaryColor,
                    newVehicle.pos.x, newVehicle.pos.y, newVehicle.pos.z,
                        newVehicle.rot.z
                    ], (e, result) => {
                        newVehicle.sqlId = result.insertId;
                        terminal.info(`${player.getSyncedMeta("name")} добавил авто для организации ${faction.name}`);
                    });
            }
            newVehicle.owner = args[0];
            newVehicle.spawnPos = newVehicle.pos;
        }
    },

    "set_faction_veh_rank": {
        description: "Добавить/обновить мин. ранг для доступа к авто организации.",
        minLevel: 5,
        syntax: "[rank]:n",
        handler: (player, args) => {
            var newVehicle = player.vehicle;
            var faction = alt.factions.getBySqlId(newVehicle.owner);
            if (!faction) return terminal.error(`Организация с ID: ${args[0]} не найдена!`, player);
            if (!newVehicle) return terminal.error(`Вы не в машине!`, player);
            if (!newVehicle.sqlId || !alt.isFactionVehicle(newVehicle)) return player.utils.error(`Авто не принадлежит организации!`);
            var rank = alt.factionRanks[newVehicle.owner][args[0]];
            if (!rank) return player.utils.error(`Неверный ранг!`);
            newVehicle.dbData.rank = args[0];

            DB.Query("UPDATE vehicles SET data=? WHERE id=?",
                [JSON.stringify(newVehicle.dbData), newVehicle.sqlId], (e) => {
                    terminal.info(`${player.getSyncedMeta("name")} обновил мин. ранг авто организации ${faction.name} на ${rank.name}`, player);
                });
        }
    },

    "uval": {
        description: "Уволить игрока из организации.",
        minLevel: 3,
        syntax: "[ид_игрока]:n",
        handler: (player, args) => {
            var rec = alt.Player.getBySqlId(args[0]);
            if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);
            if (!rec.faction) return terminal.error(`${rec.getSyncedMeta("name")} не состоит в организации!`);
            var faction = alt.factions.getBySqlId(rec.faction);
            if (rec.rank == alt.factionRanks[rec.faction].length) {
                faction.setLeader(0);
                rec.utils.success(`${player.getSyncedMeta("name")} снял Вас с лидерки ${faction.name}`);
                terminal.info(`${player.getSyncedMeta("name")} снял ${rec.getSyncedMeta("name")} с лидерки ${faction.name}`);
            } else {
                rec.utils.setFaction(0);
                rec.utils.success(`${player.getSyncedMeta("name")} уволил Вас из ${faction.name}`);
                terminal.info(`${player.getSyncedMeta("name")} уволил ${rec.getSyncedMeta("name")} из организации ${faction.name}`);
            }
        }
    },

    "clear_faction_items": {
        description: "Удалить предметы инвентаря от организации, принадлежащие игроку с сервера.",
        minLevel: 5,
        syntax: "[ид_игрока]:n [ид_организации]:n",
        handler: (player, args) => {
            var rec = alt.Player.getBySqlId(args[0]);
            if (!rec) return terminal.error(`Игрок с ID: ${args[0]} не найден!`, player);
            args[1] = Math.clamp(args[1], 0, alt.factions.length - 1);

            alt.fullDeleteItemsByFaction(rec.sqlId, args[1]);
        }
    },

}
