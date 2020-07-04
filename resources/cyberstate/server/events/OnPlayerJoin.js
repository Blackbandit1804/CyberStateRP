const globalVoice = new alt.VoiceChannel(true, 15);

alt.on("playerConnect", (player) => {
    player.model = jhash("MP_M_Freemode_01");
    player.rot = new alt.Vector3(0, 0, -2.67);
    player.dimension = 10000 + player.id; //чтобы игроки не стримились друг другу
    alt.emitClient(player, `Player::connected`);

    alt.emit(`Faction::init::service::marker::send`, player);
    alt.emit(`Faction::init::products::marker::send`, player);

    globalVoice.addPlayer(player);
    alt.emitClient(player, `peds.create`, JSON.stringify(alt.dbPeds));

    alt.bizes.forEach((result) => {
        const biz = {
            name: result.name, owner: result.owner, ownerName: result.ownerName,
            price: result.price, products: result.products, maxProducts: result.maxProducts,
            productPrice: result.productPrice, balance: result.balance,
            bizType: result.bizType, status: result.status, staff: result.staff,
            x: result.x, y: result.y, z: result.z, sqlId: result.sqlId, pos: result.pos
        };

        alt.emit(`Biz::init::marker`, player, biz);
    });

    alt.factions.forEach((result) => {
        const faction = {
            name: result.name, leader: result.leader, 
            leaderName: result.leaderName, products: result.products,
            maxProducts: result.maxProducts, blip: result.blip,
            blipColor: result.blipColor, x: result.x, y: result.y, z: result.z,
            wX: result.wX, wY: result.wY, wZ: result.wZ,
            sX: result.sX, sY: result.sY, sZ: result.sZ, sqlId: result.sqlId
        };

        alt.emit(`Marker::init`, player, faction);
        alt.emit(`Warehouse::init`, player, faction);
        alt.emit(`Storage::init`, player, faction);
        if (result.maxProducts != 0) alt.emit(`Label::init`, player, faction);
    });
    
    alt.houses.forEach((result) => {
        const house = {
            interior: result.interior, balance: result.balance, garage: result.garage,
            cars: result.cars, x: result.x, y: result.y, z: result.z, h: result.h,
            vehX: result.vehX, vehY: result.vehY, vehZ: result.vehZ, vehH: result.vehH,
            garageX: result.garageX, garageY: result.garageY, garageZ: result.garageZ, garageH: result.garageH,
            owner: result.owner, closed: result.closed, garageClosed: result.garageClosed, sqlId: result.sqlId, price: result.price,
            class: result.class, pos: result.pos
        };

        alt.emit(`House::init::marker`, player, house);
    });
});

alt.on(`Marker::init`, (player, data) => {
    alt.emitClient(player, `Faction::init::marker`, JSON.stringify(data));
});

alt.on(`Warehouse::init`, (player, data) => {
    alt.emitClient(player, `Faction::init::warehouse::marker`, JSON.stringify(data));
});

alt.on(`Storage::init`, (player, data) => {
    alt.emitClient(player, `Faction::init::storage::marker`, JSON.stringify(data));
});

alt.on(`Label::init`, (player, data) => {
    alt.emitClient(player, `Faction::init::products::label`, JSON.stringify(data));
});

alt.on(`Biz::init::marker`, (player, data) => {
    data.markers_deltaz = alt.economy["markers_deltaz"].value;
    data.markers_alpha = alt.economy["markers_alpha"].value;
    data.markers_scale = alt.economy["markers_scale"].value;
    data.markers_stream_dist = alt.economy["markers_stream_dist"].value;

    alt.emitClient(player, `Biz::init::marker`, JSON.stringify(data));
});

alt.on(`House::init::marker`, (player, data) => {
    data.markers_alpha = alt.economy["markers_alpha"].value;
    data.markers_scale = alt.economy["markers_scale"].value;

    alt.emitClient(player, `House::init::marker`, JSON.stringify(data));
});