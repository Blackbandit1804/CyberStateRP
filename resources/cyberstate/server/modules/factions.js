module.exports = {
    Init: () => {
        alt.factions = [];
        alt.factionRanks = {};
        alt.factionPlayerList = {};
        initFactionsUtils();
        DB.Query("SELECT * FROM factions", (e, result) => {
            for (var i = 0; i < result.length; i++) {
                result[i].sqlId = result[i].id;
                delete result[i].id;

                const marker = alt.createFactionMarker(result[i]);
                marker.warehouse = alt.createWarehouseMarker(result[i]);
                marker.storage = alt.createStorageMarker(result[i]);

                alt.factions.push(marker);
            }

            alt.emit(`Faction::init::service::marker`);
            alt.emit(`Faction::init::products::marker`);

            alt.log(`Организации загружены: ${i} шт.`);

            alt.factions.forEach((faction) => {
                alt.factionRanks[faction.sqlId] = [];
                alt.factionPlayerList[faction.sqlId] = [];
            });

            DB.Query("SELECT * FROM faction_ranks", (e, result) => {
                for (var i = 0; i < result.length; i++) {
                    alt.factionRanks[result[i].factionId][result[i].rank] = result[i];
                    delete result[i].id;
                    delete result[i].factionId;
                    delete result[i].rank;
                }
                alt.log(`Ранги загружены: ${i} шт.`);
            });

            DB.Query("SELECT id,name,faction,rank FROM characters Where faction>0", (e, result) => {
                for (var i = 0; i < result.length; i++) {
                    let data = {
                        id: result[i].id,
                        name: result[i].name,
                    };

                    alt.factionPlayerList[result[i].faction].push(data);

                    delete result[i].id;
                    delete result[i].name;
                    delete result[i].faction;
                }
                alt.log(`Игроки фракций загружены: ${i} шт.`);
            });
        });
    }
}

function initFactionsUtils() {
    alt.factions.getBySqlId = (sqlId) => {
        if (!sqlId) return null;
        sqlId = Math.clamp(sqlId, 1, alt.factions.length);
        var result;
        alt.factions.forEach((faction) => {
            if (faction.sqlId == sqlId) {
                result = faction;
                return;
            }
        });
        return result;
    };
    alt.factions.getRankName = (factionId, rank) => {
        factionId = Math.clamp(factionId, 1, alt.factions.length);
        rank = Math.clamp(rank, 1, alt.factionRanks[factionId].length - 1);
        return alt.factionRanks[factionId][rank].name;
    };
    alt.factions.getRankPay = (factionId, rank) => {
        factionId = Math.clamp(factionId, 1, alt.factions.length);
        rank = Math.clamp(rank, 1, alt.factionRanks[factionId].length - 1);
        return alt.factionRanks[factionId][rank].pay;
    };
    alt.factions.setRankName = (factionId, rank, name) => {
        factionId = Math.clamp(factionId, 1, alt.factions.length);
        rank = Math.clamp(rank, 1, alt.factionRanks[factionId].length - 1);
        alt.factionRanks[factionId][rank].name = name;
        DB.Query("UPDATE faction_ranks SET name=? WHERE factionId=? AND rank=?", [name, factionId, rank]);
    };
    alt.factions.setRankPay = (factionId, rank, pay) => {
        factionId = Math.clamp(factionId, 1, alt.factions.length);
        rank = Math.clamp(rank, 1, alt.factionRanks[factionId].length - 1);
        pay = Math.clamp(pay, 0, 20000);
        alt.factionRanks[factionId][rank].pay = pay;
        DB.Query("UPDATE faction_ranks SET pay=? WHERE factionId=? AND rank=?", [pay, factionId, rank]);
    };
    alt.factions.isPoliceFaction = (factionId) => {
        return factionId == 2 || factionId == 3;
    };
    alt.factions.isFibFaction = (factionId) => {
        return factionId == 4;
    };
    alt.factions.isGoverFaction = (factionId) => {
        return factionId == 1;
    };
    alt.factions.isNewsFaction = (factionId) => {
        return factionId == 6;
    };
    alt.factions.isHospitalFaction = (factionId) => {
        return factionId == 5;
    };
    alt.factions.isMexicFaction = (factionId) => {
        return factionId == 15;
    };
    alt.factions.isGangFaction = (factionId) => {
        return factionId == 7 || factionId == 8 || factionId == 10 || factionId == 11;
    };
    alt.factions.isBikerFaction = (factionId) => {
        return factionId == 16;
    };
    alt.factions.isArmyFaction = (factionId) => {
        return factionId == 9999;
    };
    alt.factions.isMafiaAccess = (factionId) => {
        return factionId == 12 || factionId == 13 || factionId == 14 || factionId == 15 || factionId == 17;
    };
    alt.factions.isLegalFaction = (factionId) => {
        return factionId == 1 || factionId == 2 || factionId == 3 || factionId == 4;
    };
    alt.factions.isInLegalFaction = (factionId) => {
        return factionId >= 7 && factionId <= 17 && factionId != 9;
    };
}

function initFactionUtils(faction) {
    faction.setName = (name) => {
        faction.name = name;
        alt.emitClient(null, `Faction::setParams`, `blip_name`, faction.sqlId, JSON.stringify({name: name}));
        DB.Query("UPDATE factions SET name=? WHERE id=?", [faction.name, faction.sqlId]);
    };
    faction.setLeader = (sqlId, name) => {
        //debug(`faction.setLeader: ${sqlId} ${name}`);
        if (sqlId < 1) {
            sqlId = 0;
            name = "";
        } else {
            for (var i = 0; i < alt.factions.length; i++) {
                var f = alt.factions[i];
                if (f.sqlId != faction.sqlId && f.leader && f.leader == sqlId) {
                    f.setLeader(0);
                }
            }
        }

        if (faction.leader > 0) {
            var leader = alt.Player.getBySqlId(faction.leader);
            if (leader) leader.utils.setFaction(0);
            else DB.Query("UPDATE characters SET faction=?,rank=? WHERE id=?", [0, 0, faction.leader]);
            alt.fullDeleteItemsByFaction(faction.leader, faction.sqlId);
        }
        //todo init maxRank for faction leader
        var player = alt.Player.getBySqlId(sqlId);
        if (player) player.utils.setFaction(faction.sqlId, alt.factionRanks[faction.sqlId].length - 1);
        else DB.Query("UPDATE characters SET faction=?,rank=? WHERE id=?", [faction.sqlId, alt.factionRanks[faction.sqlId].length - 1, sqlId]);

        faction.leader = sqlId;
        faction.leaderName = name;
        DB.Query("UPDATE factions SET leader=?,leaderName=? WHERE id=?", [sqlId, name, faction.sqlId]);
    };
    faction.setProducts = (products) => {
        faction.products = Math.clamp(products, 0, faction.maxProducts);
        alt.emitClient(null, `Faction::update::products::label`, faction.sqlId, `~b~${faction.products}/${faction.maxProducts}`)
        if (faction.label) faction.label.text = `~b~${faction.products}/${faction.maxProducts}`;
        DB.Query("UPDATE factions SET products=? WHERE id=?", [faction.products, faction.sqlId]);
    };
    faction.setMaxProducts = (maxProducts) => {
        if (maxProducts < 1) maxProducts = 1;
        faction.maxProducts = maxProducts;
        DB.Query("UPDATE factions SET maxProducts=? WHERE id=?", [faction.maxProducts, faction.sqlId]);
    };
    faction.setBlip = (blip) => {
        if (blip < 1) blip = 1;
        alt.emitClient(null, `Faction::setParams`, `blip_sprite`, faction.sqlId, JSON.stringify({sprite: blip}));
        DB.Query("UPDATE factions SET blip=? WHERE id=?", [blip, faction.sqlId]);
    };
    faction.setBlipColor = (blipColor) => {
        if (blipColor < 1) blipColor = 1;
        alt.emitClient(null, `Faction::setParams`, `blip_color`, faction.sqlId, JSON.stringify({color: blipColor}));
        DB.Query("UPDATE factions SET blipColor=? WHERE id=?", [blipColor, faction.sqlId]);
    };
    faction.setPosition = (pos, heading) => {
        pos.z -= 1.5;
        faction.pos = pos;
        pos.z += 1.5;
        alt.emitClient(null, `Faction::setParams`, `blip_pos`, faction.sqlId, JSON.stringify({position: pos}));
        faction.h = heading;

        faction.showColshape.destroy();
        faction.colshape.destroy();

        //для стриминга игрокам, которые в радиусе
        faction.showColshape = new alt.ColshapeCircle(faction.pos.x, faction.pos.y, 60);
        faction.showColshape.marker = faction;

        //для отловки события входа
        faction.colshape = new alt.ColshapeSphere(faction.pos.x, faction.pos.y, faction.pos.z, 2);
        faction.colshape.faction = faction;

        DB.Query("UPDATE factions SET x=?,y=?,z=?,h=? WHERE id=?", [pos.x, pos.y, pos.z, faction.h, faction.sqlId]);
    };
    faction.setWarehousePosition = (pos) => {
        if (!faction.warehouse) return;
        var warehouse = faction.warehouse;
        pos.z -= 1.5;
        alt.emitClient(null, `Faction::setParams`, `warehouse_pos`, faction.sqlId, JSON.stringify({position: pos}));
        warehouse.position = pos;
        pos.z += 1.5;

        warehouse.showColshape.destroy();
        warehouse.colshape.destroy();

        //для стриминга игрокам, которые в радиусе
        warehouse.showColshape = new alt.ColshapeCircle(warehouse.position.x, warehouse.position.y, 60);
        warehouse.showColshape.marker = warehouse;

        //для отловки события входа
        warehouse.colshape = new alt.ColshapeSphere(warehouse.position.x, warehouse.position.y, warehouse.position.z, 2);
        warehouse.colshape.warehouse = warehouse;

        DB.Query("UPDATE factions SET wX=?,wY=?,wZ=? WHERE id=?", [pos.x, pos.y, pos.z, faction.sqlId]);
    };
    faction.setStoragePosition = (pos) => {
        if (!faction.storage) return;
        var storage = faction.storage;
        pos.z -= 1.5;
        storage.position = pos;
        alt.emitClient(null, `Faction::setParams`, `storage_pos`, faction.sqlId, JSON.stringify({position: pos}));
        pos.z += 1.5;

        storage.showColshape.destroy();
        storage.colshape.destroy();

        //для стриминга игрокам, которые в радиусе
        storage.showColshape = new alt.ColshapeCircle(storage.position.x, storage.position.y, 60);
        storage.showColshape.marker = storage;

        //для отловки события входа
        storage.colshape = new alt.ColshapeSphere(storage.position.x, storage.position.y, storage.position.z, 2);
        storage.colshape[propNames[faction.sqlId - 1]] = storage;
        storage.colshape.menuName = menuNames[faction.sqlId - 1];

        DB.Query("UPDATE factions SET sX=?,sY=?,sZ=? WHERE id=?", [pos.x, pos.y, pos.z, faction.sqlId]);
    };
}
var menuNames = ['gover_storage', 'police_storage', 'police_storage_2', 'fib_storage', 'hospital_storage', 'news_storage'];
var propNames = ['goverStorage', 'policeStorage', 'policeStorage', 'fibStorage', 'hospitalStorage', 'newsStorage'];
var models = ['prop_box_ammo04a', 'prop_box_ammo04a', 'prop_box_ammo04a', 'prop_box_ammo04a', 'ex_office_swag_pills4',
    'prop_box_ammo04a', 'prop_box_ammo04a', 'prop_box_ammo04a', 'prop_box_ammo04a', 'prop_box_ammo04a', 'prop_box_ammo04a',
    'prop_box_ammo04a', 'prop_box_ammo04a', 'prop_box_ammo04a', 'prop_box_ammo04a', 'prop_box_ammo04a', 'prop_box_ammo04a',
    'prop_box_ammo04a', 'prop_box_ammo04a'
];

// Организации, который могут брать маты с бесконечного склада.
var factionIds = [
    [5, 6, 7], 
    [6, 7],
    [7],
];

alt.createFactionMarker = (marker) => {
    var pos = new alt.Vector3(marker.x, marker.y, marker.z);
    pos.z -= 1;
    marker.pos = pos;

    //для стриминга
    var colshape = new alt.ColshapeCircle(marker.y, marker.z, 60);
    colshape.dimension = 1;
    colshape.marker = marker;
    marker.showColshape = colshape;

    //для отловки события входа
    var colshape = new alt.ColshapeSphere(marker.x, marker.y, marker.z, 2);
    colshape.dimension = 1;
    colshape.faction = marker;
    marker.colshape = colshape;

    initFactionUtils(marker);

    return marker;
};

alt.createWarehouseMarker = (warehouseMarker) => {
    //для стриминга
    var colshape = new alt.ColshapeCircle(warehouseMarker.wX, warehouseMarker.wY, 60);
    colshape.dimension = 1;
    colshape.marker = warehouseMarker;
    warehouseMarker.showColshape = colshape;

    //для отловки события входа
    var colshape = new alt.ColshapeSphere(warehouseMarker.wX, warehouseMarker.wY, warehouseMarker.wZ, 2);
    colshape.dimension = 1;
    colshape.warehouse = warehouseMarker;
    warehouseMarker.colshape = colshape;

    return warehouseMarker;
};

alt.createStorageMarker = (storageMarker) => {
    //для стриминга
    var colshape = new alt.ColshapeCircle(storageMarker.sX, storageMarker.sY, 60);
    colshape.dimension = 1;
    colshape.marker = storageMarker;
    storageMarker.showColshape = colshape;
    storageMarker.faction = storageMarker.sqlId;

    //для отловки события входа
    var colshape = new alt.ColshapeSphere(storageMarker.sX, storageMarker.sY, storageMarker.sZ, 2);
    colshape.dimension = 1;
    colshape[propNames[storageMarker.sqlId - 1]] = storageMarker;
    storageMarker.colshape = colshape;
    colshape.menuName = menuNames[storageMarker.sqlId - 1];

    return storageMarker;
};

alt.on(`Faction::init::products::marker`, (marker) => {
    var positions = [new alt.Vector3(3607.36, 3720.41, 29.69), new alt.Vector3(1248.69, -3017.11, 9.32), new alt.Vector3(3108.95, -4818.94, 15.26)];

    for (var i = 0; i < positions.length; i++) {
        var pos = positions[i];
        pos.z -= 1.5;

        marker = pos;
        marker.factionIds = factionIds[i];
        marker.modelName = models[i][0] - 1;

        //для стриминга
        var colshape = new alt.ColshapeCircle(pos.x, pos.y, 60);
        colshape.dimension = 1;
        colshape.marker = marker;
        marker.showColshape = colshape;

        //для отловки события входа
        var colshape = new alt.ColshapeSphere(pos.x, pos.y, pos.z, 2);
        colshape.dimension = 1;
        colshape.factionProducts = marker;
        marker.colshape = colshape;
    }
});

alt.on(`Faction::init::service::marker`, (marker) => {
    var positions = [new alt.Vector3(441.07, -981.72, 30.69), new alt.Vector3(-447.20, 6013.94, 31.72)];
    var menuNames = ["police_service", "police_service_2"];

    for (var i = 0; i < positions.length; i++) {
        var pos = positions[i];
        pos.z -= 0.5;

        marker = pos;
        marker.menuName = menuNames[i];

        //для стриминга
        var colshape = new alt.ColshapeCircle(pos.x, pos.y, 60);
        colshape.dimension = 1;
        colshape.marker = marker;
        marker.showColshape = colshape;

        //для отловки события входа
        var colshape = new alt.ColshapeSphere(pos.x, pos.y, pos.z, 1.5);
        colshape.dimension = 1;
        colshape.factionService = marker;
        colshape.menuName = menuNames[i];
        marker.colshape = colshape;
    }
});

alt.on(`Faction::init::products::marker::send`, (player) => {
    var positions = [new alt.Vector3(3607.36, 3720.41, 29.69), new alt.Vector3(1248.69, -3017.11, 9.32), new alt.Vector3(3108.95, -4818.94, 15.26)];
    var blips = [153, 473, 473];
    var blipNames = [`Медикаменты`, `Боеприпасы`, `Боеприпасы`];

    for (var i = 0; i < positions.length; i++) {
        var pos = positions[i];
        pos.z -= 1.5;
        alt.emitClient(player, `Faction::init::products::marker`, JSON.stringify(pos), blips[i], blipNames[i], factionIds[i], models[i][0] - 1);
    }
});

alt.on(`Faction::init::service::marker::send`, (player) => {
    var positions = [new alt.Vector3(441.07, -981.72, 30.69), new alt.Vector3(-447.20, 6013.94, 31.72)];
    var menuNames = ["police_service", "police_service_2"];

    for (var i = 0; i < positions.length; i++) {
        alt.emitClient(player, `Faction::init::service::marker`, JSON.stringify(positions[i]), menuNames[i]);
    }
});