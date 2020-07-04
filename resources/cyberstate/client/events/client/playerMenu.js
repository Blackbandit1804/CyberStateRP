import alt from 'alt';
import game from 'natives';

alt.on(`Client::init`, (view) => {
    const storage = alt.LocalStorage.get();
    var UI = false;

    if (!storage.get("hud") && !storage.get("chat") && !storage.get("nickname") && !storage.get("nickId")) {
        storage.set("hud", true);
        storage.set("nickname", true);
        storage.set("nickId", true);
        storage.set("chat", 2);
        storage.save();
    }

    alt.on("control.player.hud", (type) => {
        view.emit(`controlServerHud`, type);
    });

    view.on("playerMenu.Hud", (enable) => {
        if (enable == false) {
            UI = false;
            view.emit(`hudControl`, `enable`, false);
            storage.set("hud", enable);
            storage.save();
            game.displayHud(false);
            game.displayRadar(false);
            alt.emit("control.player.hud", false);
        } else {
            UI = true;
            view.emit(`hudControl`, `enable`, true);
            storage.set("hud", enable);
            storage.save();
            game.displayHud(true);
            game.displayRadar(true);
            alt.emit("control.player.hud", true);
        }
    });

    view.on("playerMenu.Chat", (set) => {
        storage.set("chat", set);
        storage.save();
    });

    alt.onServer("playerMenu.skills", (data) => {
        view.emit(`playerMenu`, `skills`, data);
    });

    alt.onServer("playerMenu.houses", (data, value) => {
        var houses = [];
        for (var i = 0; i < data.length; i++) {
            var h = data[i];
            var pos = new alt.Vector3(h.x, h.y, h.z);
            var getStreet = game.getStreetNameAtCoord(pos.x, pos.y, pos.z, 0, 0);
            var adress = game.getStreetNameFromHashKey(getStreet[1]);
            houses.push({ sqlId: h.sqlId, class: h.class, garage: h.garage, rentPrice: parseInt(h.price / 100) * value, adress: adress });
        }
        view.emit(`playerMenu`, `houses`, houses);
    });

    alt.onServer("playerMenu.bizes", (data, value) => {
        var bizes = [];
        for (var i = 0; i < data.length; i++) {
            var b = data[i];
            var pos = new alt.Vector3(b.x, b.y, b.z);
            var getStreet = game.getStreetNameAtCoord(pos.x, pos.y, pos.z, 0, 0);
            var adress = game.getStreetNameFromHashKey(getStreet[1]);
            bizes.push({ sqlId: b.sqlId, name: b.name, bizType: b.bizType, rentPrice: parseInt(b.price / 100) * value, adress: adress });
        }
        view.emit(`playerMenu`, `bizes`, bizes);
    });

    alt.onServer("playerMenu.addHouse", (data) => {
        var pos = new alt.Vector3(data.x, data.y, data.z);
        var getStreet = game.getStreetNameAtCoord(pos.x, pos.y, pos.z, 0, 0);
        var adress = game.getStreetNameFromHashKey(getStreet[1]);
        var houses = { sqlId: data.sqlId, class: data.class, garage: data.garage, rentPrice: data.rentPrice, adress: adress };
        view.emit(`playerMenu`, `addHouse`, houses);
    });

    alt.onServer("playerMenu.removeHouse", (Id) => {
        view.emit(`playerMenu`, `removeHouse`, Id);
    });

    alt.onServer("playerMenu.removeBiz", (Id) => {
        view.emit(`playerMenu`, `removeBiz`, Id);
    });

    alt.onServer("playerMenu.addBiz", (data) => {
        var pos = new alt.Vector3(data.x, data.y, data.z);
        var getStreet = game.getStreetNameAtCoord(pos.x, pos.y, pos.z, 0, 0);
        var adress = game.getStreetNameFromHashKey(getStreet[1]);
        var bizes = { sqlId: data.sqlId, name: data.name, bizType: data.bizType, rentPrice: data.rentPrice, adress: adress };
        view.emit(`playerMenu`, `addBiz`, JSON.stringify(bizes));
    });
    
    alt.onServer("playerMenu.setSpawn", (set, event) => {
        view.emit(`playerMenu`, `spawn`, set);
    });

    view.on("playerMenu.setSpawn", (set, event) => {
        alt.emitServer('setSpawn', set);
    });

    alt.onServer("playerMenu.setHouseId", (set, event) => {
        view.emit(`playerMenu`, `houseId`, set);
    });

    view.on("playerMenu.setHouseId", (set, event) => {
        alt.emitServer('setHouseId', set);
    });

    alt.on("playerMenu.enable", (enable) => {
        view.emit(`hudControl`, `chat`, storage.get("chat"));
        view.emit(`playerMenu`, `chat`, storage.get("chat"));
        view.emit(`playerMenu`, `hud`, storage.get("hud"));
        view.emit(`playerMenu`, `nickname`, storage.get("nickname"));
        view.emit(`playerMenu`, `nickId`, storage.get("nickId"));
        view.emit(`playerMenu`, `enable`, enable);

        if (storage.get(`hud`) == false) {
            UI = false;
            view.emit(`hudControl`, `enable`, false);
            storage.set("hud", enable);
            storage.save();
            game.displayHud(false);
            game.displayRadar(false);
            alt.emit("control.player.hud", false);
        } else {
            UI = true;
            view.emit(`hudControl`, `enable`, true);
            storage.set("hud", enable);
            storage.save();
            game.displayHud(true);
            game.displayRadar(true);
            alt.emit("control.player.hud", true);
        }
    });

    alt.onServer("playerMenu.achievements", (achievements) => {
        view.emit(`playerMenu`, `achievements`, achievements);
    });

    alt.onServer("playerMenu.achievementsPlayer", (achievements) => {
        view.emit(`playerMenu`, `achievementsPlayer`, achievements);
    });

    alt.onServer("playerMenu.cars", (cars) => {
        var list = [];
        for (var i = 0; i < cars.length; i++) {
            var c = cars[i];
            list.push({
                name: c.name,
                maxSpeed: game.getVehicleModelMaxSpeed(game.getHashKey(c.name)), 
                braking: (game.getVehicleModelMaxBraking(game.getHashKey(c.name)) * 100).toFixed(2), 
                acceleration: (game.getVehicleModelAcceleration(game.getHashKey(c.name)) * 100).toFixed(2), 
                controllability: game.getVehicleModelMaxTraction(game.getHashKey(c.name)).toFixed(2),
                maxSpeedKm: ((game.getVehicleModelMaxSpeed(game.getHashKey(c.name)) * 3.6).toFixed(0))
            });
        }
        view.emit(`playerMenu`, `cars`, list);
    });
    
    view.on("setPlayerMenuActive", (enable) => {
        alt.playerMenuActive = enable;
    });
});
