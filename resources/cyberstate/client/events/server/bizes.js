import alt from 'alt';

var bizesInfo = [{
        name: "Закусочная",
        blip: 106
    },
    {
        name: "Бар",
        blip: 93
    },
    {
        name: "Магазин одежды",
        blip: 73
    },
    {
        name: "Барбершоп",
        blip: 71
    },
    {
        name: "АЗС",
        blip: 361
    },
    {
        name: "24/7",
        blip: 52
    },
    {
        name: "Тату салон",
        blip: 75
    },
    {
        name: "Оружейный магазин",
        blip: 110
    },
    {
        name: "Автосалон",
        blip: 524
    },
    {
        name: "LS Customs",
        blip: 72
    },
    {
        name: "СТО",
        blip: 446
    }
];

alt.onServer(`Biz::init::marker`, (data) => {
    data = JSON.parse(data);

    var pos = new alt.Vector3(data.x, data.y, data.z - 0.7 + data.markers_deltaz);

    var marker = alt.helpers.marker.new(1, pos, undefined, undefined, data.markers_scale, {r: 187, g: 255, b: 0, alpha: data.markers_alpha}, undefined, true, 2, data.sqlId + 10000);

    var keys = ["sqlId", "name", "owner", "ownerName", "price", "products", "maxProducts", "productPrice", "balance", "bizType", "status", "staff"];
    keys.forEach((key) => {
        marker[key] = data[key];
    });

    marker.bizType = data.bizType;
    marker.sqlId = data.sqlId;
    
    var blip = alt.helpers.blip.new(bizesInfo[data.bizType - 1].blip, pos.x, pos.y, pos.z,
        {
            name: bizesInfo[data.bizType - 1].name,
            scale: 0.7,
            color: 0,
            shortRange: true,
            sqlId: data.sqlId + 10000
        }
    );

    marker.blip = blip;
});

alt.onServer(`Bizes::setParams`, (type, sqlId, param) => {
    param = JSON.parse(param);

    sqlId += 10000;

    if (type === 'biz_pos') {
        const marker = alt.markers.get(sqlId);
        const blip = alt.blips.get(sqlId);

        if (marker.sqlId === sqlId) marker.pos = param;
        if (blip.sqlId === sqlId) blip.position = param;
    } else if (type === "biz_name") {
        const blip = alt.markers.get(sqlId);

        if (blip.sqlId === sqlId) blip.name = param;
    } else if (type === "biz_destroy") {
        const marker = alt.markers.get(sqlId);
        const blip = alt.blips.get(sqlId);

        if (marker.sqlId === sqlId) alt.blips.delete(sqlId);
        if (blip.sqlId === sqlId) blip.destroy();
    }
});