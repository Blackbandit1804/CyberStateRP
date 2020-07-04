import alt from 'alt';

alt.labels = [];

alt.onServer(`Faction::init::marker`, (data) => {
    data = JSON.parse(data);

    var pos = new alt.Vector3(data.x, data.y, data.z - 0.5);
    
    var marker = alt.helpers.marker.new(21, pos, undefined, undefined, 1, {r: 255, g: 187, b: 0, alpha: 0}, undefined, true, 2, data.sqlId);

    var keys = ["sqlId", "name", "leader", "leaderName", "products", "maxProducts", "h"];
    keys.forEach((key) => {
        marker[key] = data[key];
    });

    var blip = alt.helpers.blip.new(data.blip, pos.x, pos.y, pos.z,
        {
            name: data.name,
            scale: 0.7,
            color: data.blipColor,
            shortRange: true,
            sqlId: data.sqlId
        }
    );
    
    marker.blip = blip;
    marker.faction = data.sqlId;
    marker.sqlId = data.sqlId;
});

alt.onServer(`Faction::init::warehouse::marker`, (data) => {
    data = JSON.parse(data);

    var pos = new alt.Vector3(data.wX, data.wY, data.wZ - 0.5);

    var warehouseMarker = alt.helpers.marker.new(21, pos, undefined, undefined, 1, {r: 0, g: 187, b: 255, alpha: 70}, undefined, true, 2);

    warehouseMarker.faction = data.sqlId;
});

alt.onServer(`Faction::init::storage::marker`, (data) => {
    data = JSON.parse(data);

    var pos = new alt.Vector3(data.sX, data.sY, data.sZ - 0.5);

    var storageMarker = alt.helpers.marker.new(21, pos, undefined, undefined, 1, {r: 0, g: 187, b: 255, alpha: 70}, undefined, true, 2);

    storageMarker.faction = data.sqlId;
});

alt.onServer(`Faction::init::products::label`, (data) => {
    data = JSON.parse(data);

    var label = { faction: data.sqlId, text: `~b~${data.products}/${data.maxProducts}`, pos: new alt.Vector3(data.sX, data.sY, data.sZ) };
    alt.labels[data.sqlId] = label;
});

alt.onServer(`Faction::update::products::label`, (sqlId, text) => {
    alt.labels[sqlId].text = text;
});

alt.onServer(`Faction::init::service::marker`, (pos, menuName) => {
    pos = JSON.parse(pos);
    pos.z -= 0.5;

    alt.helpers.marker.new(21, pos, undefined, undefined, 1, {r: 0, g: 187, b: 255, alpha: 70}, undefined, true, 2, menuName);
});

alt.onServer(`Faction::init::products::marker`, (pos, blip, blipName, factionIds, model) => {
    pos = JSON.parse(pos);

    var marker = alt.helpers.marker.new(21, pos, undefined, undefined, 2, {r: 0, g: 187, b: 255, alpha: 70}, undefined, true, 2);

    marker.factionIds = factionIds;
    marker.modelName = model;

    var blip = alt.helpers.blip.new(blip, pos.x, pos.y, pos.z,
        {
            name: blipName,
            scale: 1.2,
            color: 1,
            shortRange: true
        }
    );

    marker.blip = blip;
});

alt.onServer(`Faction::setParams`, (type, sqlId, params) => {
    params = JSON.parse(params);

    if (type === "blip_sptite") {
        const blip = alt.blips.get(sqlId);

        if (blip.sqlId === sqlId) blip.sprite = params.sprite;
    } else if (type === "blip_color") {
        const blip = alt.blips.get(sqlId);

        if (blip.sqlId === sqlId) blip.color = params.color;
    } else if (type === "blip_name") {
        const blip = alt.blips.get(sqlId);

        if (blip.sqlId === sqlId) blip.name = params.name;
    } else if (type === "blip_pos") {
        const blip = alt.blips.get(sqlId);

        if (blip.sqlId === sqlId) blip.position = new alt.Vector3(params.position.x, params.position.y, params.position.z);
    } else if (type === "warehouse_pos") {
        const marker = alt.markers.get(sqlId);

        if (marker.sqlId === sqlId) marker.pos = params.position;
    } else if (type === "storage_pos") {
        const marker = alt.markers.get(sqlId);

        if (marker.sqlId === sqlId) marker.pos = params.position;
    }
});