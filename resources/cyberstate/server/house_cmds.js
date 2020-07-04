module.exports = {
    "create_house": {
        description: "Создать новый дом. Позиция выхода из дома берётся по положению игрока (не забывайте про поворот туловища, чтобы игрок смотрел в противоп. сторону от двери).",
        minLevel: 5,
        syntax: "[interior]:n [garage]:n [price]:n [class]:n",
        handler: (player, args) => {
            var pos = player.pos;
            DB.Query("INSERT INTO houses (interior,garage,x,y,z,h,price,class) VALUES (?,?,?,?,?,?,?,?)",
            [args[0], args[1], pos.x, pos.y, pos.z, player.rot.z, args[2], args[3]], (e, result) => {
                DB.Query("SELECT * FROM houses WHERE id=?", result.insertId, (e, result) => {
                    if (result.length == 0) return terminal.error(`Ошибка создания дома!`, player);
                    result[0].sqlId = result[0].id;
                    alt.houses.push(alt.createHouseMarker(result[0]));
                    result[0].markers_alpha = alt.economy["markers_alpha"].value;
                    result[0].markers_scale = alt.economy["markers_scale"].value;
                    alt.emitClient(null, `House::init::marker`, JSON.stringify(result[0]));
                    terminal.info(`${player.getSyncedMeta("name")} создал дом с ID: ${result[0].id}`);
                });
            });
        }
    },
    "delete_house": {
        description: "Удалить дом.",
        minLevel: 5,
        syntax: "[houseId]:n",
        handler: (player, args) => {
            var house = alt.houses.getBySqlId(args[0]);
            if (!house) return terminal.error(`Дом с ID: ${args[0]} не найден!`, player);

            alt.houses.delete(house, (e) => {
                if (e) return terminal.error(e);
                terminal.info(`${player.getSyncedMeta("name")} удалил дом с ID: ${args[0]}`);
            });
        }
    },
    "set_house_interior": {
        description: "Изменить интерьер дома.",
        minLevel: 4,
        syntax: "[houseId]:n [interior]:n",
        handler: (player, args) => {
            var house = alt.houses.getBySqlId(args[0]);
            if (!house) return terminal.error(`Дом с ID: ${args[0]} не найден!`, player);
            terminal.info(`${player.getSyncedMeta("name")} изменил интерьер ${house.interior}=>${args[1]} у дома с ID: ${house.sqlId}`);
            house.setInterior(args[1]);
        },
    },
    "set_house_position": {
        description: "Изменить позицию дома.",
        minLevel: 4,
        syntax: "[houseId]:n",
        handler: (player, args) => {
            var pos = player.pos;
            var house = alt.houses.getBySqlId(args[0]);
            if (!house) return terminal.error(`Дом с ID: ${args[0]} не найден!`, player);
            terminal.info(`${player.getSyncedMeta("name")} изменил позицию у дома с ID: ${house.sqlId}`);
            house.changeCoord(pos);
        },
    },
    "set_house_price": {
        description: "Изменить цену дома.",
        minLevel: 4,
        syntax: "[houseId]:n [price]:n",
        handler: (player, args) => {
            var house = alt.houses.getBySqlId(args[0]);
            if (!house) return terminal.error(`Дом с ID: ${args[0]} не найден!`, player);
            terminal.info(`${player.getSyncedMeta("name")} изменил цену ${house.price}$=>${args[1]}$ у дома с ID: ${house.sqlId}`);
            house.setPrice(args[1]);
        },
    },
    "set_house_class": {
        description: "Изменить класс дома. Классы: A,B,C,D,E,F.",
        minLevel: 4,
        syntax: "[houseId]:n [class]:s",
        handler: (player, args) => {
            var house = alt.houses.getBySqlId(args[0]);
            if (!house) return terminal.error(`Дом с ID: ${args[0]} не найден!`, player);
            var classes = ["A", "B", "C", "D", "E", "F"];
            if (classes.indexOf(args[1]) == -1) return terminal.error(`Класс ${args[1]} неверный!`, player);


            terminal.info(`${player.getSyncedMeta("name")} изменил класс ${classes[house.class - 1]}=>${args[1]} у дома с ID: ${house.sqlId}`);
            house.setClass(classes.indexOf(args[1]) + 1);
        }
    },
    "set_house_owner": {
        description: "Изменить владельца дома.",
        minLevel: 4,
        syntax: "[houseId]:n [playerName]:s [playerSecondName]:s",
        handler: (player, args) => {
            var house = alt.houses.getBySqlId(args[0]);
            if (!house) return terminal.error(`Дом с ID: ${args[0]} не найден!`, player);
            var fullName = args[1] + " " + args[2];
            DB.Query(`SELECT id FROM characters WHERE name=?`, [fullName], (e, result) => {
                if (result.length == 0) return terminal.error(`Персонаж <b>${fullName}</b> не найден!`, player);
                var str = (house.owner == 0) ? fullName : `${house.ownerName}=>${fullName}`;
                terminal.info(`${player.getSyncedMeta("name")} изменил владельца ${str} у дома с ID: ${house.sqlId}`);
                house.setOwner(result[0].id, fullName);
            });
        }
    },
    "set_house_garage": {
        description: "Изменить гараж дома.",
        minLevel: 4,
        syntax: "[houseId]:n [garage]:n",
        handler: (player, args) => {
            var house = alt.houses.getBySqlId(args[0]);
            if (!house) return terminal.error(`Дом с ID: ${args[0]} не найден!`, player);

            terminal.info(`${player.getSyncedMeta("name")} изменил гараж ${house.garage}=>${args[1]} у дома с ID: ${house.sqlId}`);
            house.setGarage(args[1]);
        }
    },
    "set_house_vehspawn": {
        description: "Установить позицию спавна авто при выезде из гаража. Установка происходит по позиции авто, в котором находится игрок.",
        minLevel: 4,
        syntax: "[houseId]:n",
        handler: (player, args) => {
            if (!player.vehicle) return terminal.error(`Вы не в машине!`, player);
            var house = alt.houses.getBySqlId(args[0]);
            if (!house) return terminal.error(`Дом с ID: ${args[0]} не найден!`, player);
            var pos = player.vehicle.pos;
            pos.h = player.vehicle.rot.z;

            terminal.info(`${player.getSyncedMeta("name")} установил позицию спавна авто у дома с ID: ${house.sqlId}`);
            house.setVehSpawn(pos);
        }
    },
    "set_house_garageenter": {
        description: "Установить позицию входа в гараж с улицы. Установка происходит по позиции игрока.",
        minLevel: 4,
        syntax: "[houseId]:n",
        handler: (player, args) => {
            var house = alt.houses.getBySqlId(args[0]);
            if (!house) return terminal.error(`Дом с ID: ${args[0]} не найден!`, player);
            var pos = player.pos;
            pos.h = player.rot.z;

            terminal.info(`${player.getSyncedMeta("name")} изменил позицию входа в гараж с улицы для дома с ID: ${house.sqlId}`);
            house.setGarageEnter(pos);
        }
    },
    "set_interior_spawn": {
        description: "Установить позицию спавна в интерьере. Установка происходит по позиции игрока.",
        minLevel: 5,
        syntax: "[interiorId]:n",
        handler: (player, args) => {
            var interior = alt.interiors.getBySqlId(args[0]);
            if (!interior) return terminal.error(`Интерьер с ID: ${args[0]} не найден!`, player);
            var pos = player.pos;
            pos.h = player.rot.z;

            terminal.info(`${player.getSyncedMeta("name")} изменил позицию спавна в интерьере с ID: ${interior.id}`);
            interior.setSpawn(pos);
        }
    },
    "set_interior_enter": {
        description: "Установить позицию входа из интерьера в гараж. Установка происходит по айди интерьера.",
        minLevel: 5,
        syntax: "[interiorId]:n",
        handler: (player, args) => {
            var interior = alt.interiors.getBySqlId(args[0]);
            if (!interior) return terminal.error(`Интерьер с ID: ${args[0]} не найден!`, player);
            var pos = player.pos;
            pos.h = player.rot.z;

            terminal.info(`${player.getSyncedMeta("name")} изменил позицию входа в интерьер с ID: ${interior.id}`);
            interior.setEnter(pos);
        }
    },
    "set_interior_garage": {
        description: "Установить интерьер в гараже. Установка происходит по айди интерьера.",
        minLevel: 5,
        syntax: "[interiorId]:n",
        handler: (player, args) => {
            var interior = alt.interiors.getBySqlId(args[0]);
            if (!interior) return terminal.error(`Интерьер с ID: ${args[0]} не найден!`, player);
            var pos = player.pos;
            pos.h = player.rot.z;

            terminal.info(`${player.getSyncedMeta("name")} изменил позицию входа в гараж в интерьере с ID: ${interior.id}`);
            interior.setGarage(pos);
        }
    },
    "set_interior_rooms": {
        description: "Установить количество комнат у интерьера.",
        minLevel: 5,
        syntax: "[interiorId]:n [rooms]:n",
        handler: (player, args) => {
            var interior = alt.interiors.getBySqlId(args[0]);
            if (!interior) return terminal.error(`Интерьер с ID: ${args[0]} не найден!`, player);

            terminal.info(`${player.getSyncedMeta("name")} изменил количество комнат в интерьере с ID: ${interior.id}`);
            interior.setRooms(args[1]);
        }
    },
    "set_interior_square": {
        description: "Установить площадь у интерьера.",
        minLevel: 5,
        syntax: "[interiorId]:n [square]:n",
        handler: (player, args) => {
            var interior = alt.interiors.getBySqlId(args[0]);
            if (!interior) return terminal.error(`Интерьер с ID: ${args[0]} не найден!`, player);

            terminal.info(`${player.getSyncedMeta("name")} изменил пощадь в интерьере с ID: ${interior.id}`);
            interior.setSquare(args[1]);
        }
    },
    "set_garage_enter": {
        description: "Установить позицию входа в гараж. Установка происходит по позиции игрока.",
        minLevel: 5,
        syntax: "[garageId]:n",
        handler: (player, args) => {
            var garage = alt.garages.getBySqlId(args[0]);
            if (!garage) return terminal.error(`Гараж с ID: ${args[0]} не найден!`, player);
            var pos = player.pos;
            pos.h = player.rot.z;

            terminal.info(`${player.getSyncedMeta("name")} изменил позицию входа в гараж с ID: ${garage.id}`);
            garage.setEnter(pos);
        }
    },
    "tp_house": {
        description: "Телепортироваться в дому.",
        minLevel: 3,
        syntax: "[houseId]:n",
        handler: (player, args) => {
            var house = alt.houses.getBySqlId(args[0]);
            if (!house) return terminal.error(`Дом с ID: ${args[0]} не найден!`, player);
            var pos = house.pos;
            pos.z++;
            player.pos = pos;
            terminal.info(`Вы телепортировались в дому с ID: ${args[0]}`, player);
        }
    },
}
