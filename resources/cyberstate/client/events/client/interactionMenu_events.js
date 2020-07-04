import alt from 'alt';
import game from 'natives';


alt.interactionEntity = null;
var offsetX = 5, offsetY = 10; // смещение меню на экране

alt.on(`Client::init`, (view) => {
    const player = alt.Player.local
    const storage = alt.LocalStorage.get();

    alt.on("interactionMenu.showPlayerMenu", (player, values = null) => {
        alt.interactionEntity = player;
        if (values) values = JSON.stringify(values);
        view.emit(`interactionMenuAPI.showPlayerMenu`, values);
        alt.emit(`Cursor::show`, true);
        if (alt.clientStorage["faction"] > 7 && alt.clientStorage["faction"] < 18) {
          if (!player.getSyncedMeta("hasTie")) {
             // переписать clear massive
             view.emit(`interactionMenuAPI.addItemFactionInventory`, 'default.png', 'Связать', 126, 1);
          } else {
             view.emit(`interactionMenuAPI.addItemFactionInventory`, 'default.png', 'Развязать', 0, 1);
             view.emit(`interactionMenuAPI.addItemFactionInventory`, 'default.png', 'Ограбить', 0, 0);
             view.emit(`interactionMenuAPI.addItemFactionInventory`, 'default.png', 'Вести за собой', 0, 0);
             view.emit(`interactionMenuAPI.addItemFactionInventory`, 'default.png', 'Посадить в авто', 0, 0);
             view.emit(`interactionMenuAPI.addItemFactionInventory`, 'default.png', 'Вытолкнуть из авто', 0, 0);
          }
        }
    });

    alt.on("interactionMenu.showVehicleMenu", (vehicle, values = null) => {
        alt.interactionEntity = vehicle;
        if (values) values = JSON.stringify(values);
        view.emit(`interactionMenuAPI.showVehicleMenu`, values);
        alt.emit(`Cursor::show`, true);
    });

    alt.on("interactionMenu.hide", () => {
        alt.interactionEntity = null;
        view.emit(`interactionMenuAPI.hide`);
    });

    var playerItemHandlers = {
        "Познакомиться": () => {
            if (alt.interactionEntity.getSyncedMeta("knockDown") === true) return alt.emit(`nError`, `Вы не можете взаимодействовать с этим человеком`);
            alt.emitServer(`familiar.createOffer`, alt.interactionEntity.getSyncedMeta("id"));
        },
        "Передать деньги": () => {
            alt.emit("modal.show", "pass_money_player", { target: `${alt.interactionEntity.getSyncedMeta("id")}`, interactionId: alt.interactionEntity.getSyncedMeta("id") });
        },
        "Связать": () => {
            alt.emitServer("use.gang.tie", alt.interactionEntity.getSyncedMeta("id"), false);
        },
        "Развязать": () => {
            alt.emitServer("use.gang.tie", alt.interactionEntity.getSyncedMeta("id"), true);
        },
        "Ограбить": () => {
            alt.emitServer("roob.gang.tie", alt.interactionEntity.getSyncedMeta("id"));
        },
        "Пригласить в бригаду": () => {
            alt.emitServer("trash.invite.player", alt.interactionEntity.getSyncedMeta("id"));
        },
        "Уволить из бригады": () => {
            alt.emitServer("trash.uninvite.player", alt.interactionEntity.getSyncedMeta("id"));
        },
        "Пригласить в группу": () => {
            alt.emitServer("gopostal.invite.player", alt.interactionEntity.getSyncedMeta("id"));
        },
        "Уволить из группы": () => {
            alt.emitServer("gopostal.uninvite.player", alt.interactionEntity.getSyncedMeta("id"));
        },
        "Показать документы": () => {},
        "Удостоверение": () => {
            alt.emitServer("documents.showFaction", alt.interactionEntity.getSyncedMeta("id"));
        },
        "Паспорт": () => {
            alt.emitServer(`documents.show`, alt.interactionEntity.getSyncedMeta("id"), "passport");
        },
        "Лицензии": () => {
            alt.emitServer(`documents.show`, alt.interactionEntity.getSyncedMeta("id"), "licenses");
        },
        "Пригласить в организацию": () => {
            alt.emitServer(`factions.invite`, alt.interactionEntity.getSyncedMeta("id"));
        },
        "Повысить в должности": () => {
            alt.emitServer(`factions.giverank`, alt.interactionEntity.getSyncedMeta("id"));
        },
        "Понизить в должности": () => {
            alt.emitServer(`factions.ungiverank`, alt.interactionEntity.getSyncedMeta("id"));
        },
        "Уволить из организации": () => {
            alt.emitServer(`factions.uninvite`, alt.interactionEntity.getSyncedMeta("id"));
        },
        "Наручники": () => {
            alt.emitServer(`cuffsOnPlayer`, alt.interactionEntity.getSyncedMeta("id"));
        },
        "Розыск": () => {
            alt.emitServer(`showWantedModal`, alt.interactionEntity.getSyncedMeta("id"));
        },
        "Вести за собой": () => {
            alt.emitServer(`startFollow`, alt.interactionEntity.getSyncedMeta("id"));
        },
        "Посадить в авто": () => {
            var veh = alt.getNearVehicle(player.pos);
            if (!veh) return alt.emit(`nError`, `Авто не найдено!`);
            var pos = veh.pos;
            var localPos = player.pos;
            var dist = alt.vdist(new alt.Vector3(pos.x, pos.y, pos.z), new alt.Vector3(localPos.x, localPos.y, localPos.z));
            if (dist > 10) return alt.emit(`nError`, `Авто далеко!`);
            alt.emitServer(`putIntoVehicle`, alt.interactionEntity.getSyncedMeta("id"), veh.id);
        },
        "Вытолкнуть из авто": () => {
            //debug(`Вытолкнуть: occupants.length: ${occupants.length}`);
            if (!alt.interactionEntity) return;
            alt.emitServer(`removeThisVehicle`, alt.interactionEntity);
        },
        "Штраф": () => {
            alt.emitServer(`showFinesModal`, alt.interactionEntity.getSyncedMeta("id"));
        },
        "Арестовать": () => {
            alt.emitServer(`arrestPlayer`, alt.interactionEntity.getSyncedMeta("id"));
        },
        "Выдать лицензию": () => {
            alt.emitServer(`police.giveLic`, alt.interactionEntity.getSyncedMeta("id"));
        },
        "Обыскать": () => {
            alt.emitServer(`friskPlayer`, alt.interactionEntity.getSyncedMeta("id"));
        },
        "Изъять": () => {
            alt.emitServer(`clearFrisk`, alt.interactionEntity.getSyncedMeta("id"));
        },
        "Вылечить": () => {
            alt.emitServer(`hospital.health.createOffer`, alt.interactionEntity.getSyncedMeta("id"));
        },
        "Передать товар": () => {
            var attachedObject = player.getSyncedMeta("attachedObject");
            var haveProducts = (attachedObject == "prop_box_ammo04a" || attachedObject == "ex_office_swag_pills4");
            if (!haveProducts) return alt.emit(`nError`, `Вы не имеете товар!`);

            alt.emitServer(`army.transferProducts`, alt.interactionEntity.getSyncedMeta("id"));
        },
        "Обычный": () => {
            alt.emitServer(`emotions.set`, 0);
        },
        "Угрюмый": () => {
            alt.emitServer(`emotions.set`, 1);
        },
        "Сердитый": () => {
            alt.emitServer(`emotions.set`, 2);
        },
        "Счастливый": () => {
            alt.emitServer(`emotions.set`, 3);
        },
        "Стресс": () => {
            alt.emitServer(`emotions.set`, 4);
        },
        "Надутый": () => {
            alt.emitServer(`emotions.set`, 5);
        },
        "Нормальная": () => {
            alt.emitServer(`walking.set`, 0);
        },
        "Храбрый": () => {
            alt.emitServer(`walking.set`, 1);
        },
        "Уверенный": () => {
            alt.emitServer(`walking.set`, 2);
        },
        "Гангстер": () => {
            alt.emitServer(`walking.set`, 3);
        },
        "Быстрый": () => {
            alt.emitServer(`walking.set`, 4);
        },
        "Грустный": () => {
            alt.emitServer(`walking.set`, 5);
        },
        "Крылатый": () => {
            alt.emitServer(`walking.set`, 6);
        }
    };
    var vehicleItemHandlers = {
        "Выкинуть из транспорта": () => {
            if (!player.vehicle) return alt.emit(`nError`, `Вы не в транспорте!`);
            let players = [];

            alt.Player.all.forEach((rec) => {
                if (rec.vehicle && rec.vehicle == alt.interactionEntity)
                    players.push(rec.id);
            });

            if (players.length < 2) return alt.emit(`nError`, `Транспорт пустой!`);
            alt.emit("interactionMenu.hide");
            alt.emit("modal.show", "throw_from_vehicle", { count: --players.length });
        },
        "Открыть/Закрыть транспорт": () => {
            if (!player.vehicle) return alt.emit(`nError`, `Вы не в транспорте!`);
            alt.emitServer("item.lockCar", alt.interactionEntity.id);
            alt.emit("interactionMenu.hide");
        },
        "Двери": () => {
            var dist = alt.vdist(player.pos, alt.interactionEntity.pos);
            if (dist > 2) return alt.emit(`nError`, `Вы далеко от дверей!`);

            alt.emitServer("item.lockCar", alt.interactionEntity.id);
            alt.emit("interactionMenu.hide");
        },
        "Капот": () => {
            var hoodPos = alt.getHoodPosition(alt.interactionEntity);
            if (!hoodPos) return alt.emit(`nError`, `Капот не найден!`);
            if (alt.vdist(player.pos, hoodPos) > 2) return alt.emit(`nError`, `Вы далеко от капота!`);

            alt.emitServer("vehicle.hood", alt.interactionEntity.id);
            alt.emit("interactionMenu.hide");
        },
        "Багажник": () => {
            var bootPos = alt.getBootPosition(alt.interactionEntity);
            if (!bootPos) return alt.emit(`nError`, `Багажник не найден!`);
            if (alt.vdist(player.pos, bootPos) > 2) return alt.emit(`nError`, `Вы далеко от багажника!`);

            alt.emitServer("vehicle.boot", alt.interactionEntity.id);
            alt.emit("interactionMenu.hide");
        },
        "Товар": () => {
            var bootPos = alt.getBootPosition(alt.interactionEntity);
            if (!bootPos) return alt.emit(`nError`, `Багажник не найден!`);
            if (alt.vdist(player.pos, bootPos) > 2) return alt.emit(`nError`, `Вы далеко от багажника!`);

            alt.emitServer("vehicle.products", alt.interactionEntity.id);
            alt.emit("interactionMenu.hide");
        },
        "Заправить": () => {
            alt.emitServer("item.fuelCar", alt.interactionEntity.id);
            alt.emit("interactionMenu.hide");
        },
        "Вскрыть": () => {
            alt.emitServer("police.lockVeh", alt.interactionEntity.id);
            alt.emit("interactionMenu.hide");
        },
        "Вытолкнуть": () => {
            //player.utils.success("Test #1!");
            var occupants = [];
            alt.Player.all.forEach((rec) => {
                if (rec.vehicle && rec.vehicle.id === alt.interactionEntity.id) occupants.push(rec.getSycnedMeta("name"));
            });
            //debug(`Вытолкнуть: occupants.length: ${occupants.length}`);
            if (!occupants.length) return;
            var names = [];
            for (var i = 0; i < occupants.length; i++) {
                names.push(occupants[i].name);
            }
            alt.emit(`interactionMenu.showVehicleMenu`, alt.interactionEntity, {
                action: "removeFromVehicle",
                names: names
            });
        },
    };

    view.on("interactionMenu.onClickPlayerItem", (itemName) => {
        if (!alt.interactionEntity) return alt.emit(`nError`, `Гражданин далеко!`);
        if (playerItemHandlers[itemName])
            playerItemHandlers[itemName]();
        alt.emit("interactionMenu.hide");
    });

    view.on("interactionMenu.onClickVehicleItem", (itemName) => {
        if (!alt.interactionEntity) return alt.emit(`nError`, `Авто далеко!`);
        if (vehicleItemHandlers[itemName])
            vehicleItemHandlers[itemName]();
    });

    alt.on("update", () => {
        const pPos = player.pos;

        if (alt.interactionEntity) {
            if (!alt.Player.exists(alt.interactionEntity) && !alt.Vehicle.exists(alt.interactionEntity)) alt.interactionEntity = null; //todo fix
            else {
                var pos3d = alt.interactionEntity.pos;
                var dist = alt.vdist(pPos, pos3d);
                if (alt.interactionEntity instanceof alt.Vehicle) {
                    if (dist > 2) {
                        var bootPos = alt.getBootPosition(alt.interactionEntity);
                        var bootDist = 10;
                        if (bootPos) bootDist = alt.vdist(pPos, bootPos);
                        // drawText2d(`Багажник: ${bootDist} m.`);
                        if (bootDist < 1) {
                            pos3d = bootPos;
                        } else {
                            var hoodPos = alt.getHoodPosition(alt.interactionEntity);
                            var hoodDist = 10;
                            if (hoodPos) hoodDist = alt.vdist(pPos, hoodPos);
                            // drawText2d(`Капот: ${hoodDist} m.`, [0.8, 0.55]);
                            if (hoodDist < 1) {
                                pos3d = hoodPos;
                            } else return alt.emit("interactionMenu.hide");
                        }
                    }
                } else if (dist > 2 && alt.interactionEntity instanceof alt.Player) return alt.emit("interactionMenu.hide");

                var pos2d = game.getScreenCoordFromWorldCoord(pos3d.x, pos3d.y, pos3d.z + 1);

                if (!pos2d) return;
                view.emit(`interactionMenuAPI.move`, pos2d[1] * 100 + offsetX, pos2d[2] * 100 + offsetY);
            }
        }
    });
});
