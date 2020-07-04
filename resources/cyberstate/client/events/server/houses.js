import alt from 'alt';

alt.onServer(`House::init::marker`, (data) => {
    data = JSON.parse(data);

    var pos = new alt.Vector3(data.x, data.y, data.z - 0.7);

    var color = { r: 0, g: 255, b: 0, alpha: data.markers_alpha };
    if (data.owner != 0) color = { r: 255, g: 0, b: 0, alpha: data.markers_alpha };

    var marker = alt.helpers.marker.new(1, pos, undefined, undefined, 0.5, color, undefined, true, 2, data.sqlId + 20000);

    marker.balance = data.balance;
    marker.owner = data.owner;

    if (marker.owner != 0) marker.ownerName = data.ownerName;

    marker.price = data.price;
    marker.closed = data.closed;
    marker.garageClosed = data.garageClosed;
    marker.interior = data.interior;
    marker.garage = data.garage;
    marker.cars = JSON.parse(data.cars);
    marker.class = data.class;
    marker.x = pos.x;
    marker.y = pos.y;
    marker.z = pos.z;
    marker.h = data.h;
    marker.garageX = data.garageX;
    marker.garageY = data.garageY;
    marker.garageZ = data.garageZ;
    marker.garageH = data.garageH;

    var color = 0;

    if (data.owner == 0) color = 2;
    else color = 1;

    var type = (data.owner) ? 40 : 374;

    const blip = alt.helpers.blip.new(type, pos.x, pos.y, pos.z,
        {
            scale: 0.6,
            color: color,
            shortRange: true,
            sqlId: data.sqlId + 20000
        }
    );

    marker.blip = blip;
});

alt.onServer(`House::setParams`, (type, sqlId, param) => {
    param = JSON.parse(param);

    sqlId += 20000;

    if (type === 'marker_color') {
        const marker = alt.markers.get(sqlId);
        if (marker.sqlId === sqlId) marker.color = param;
    } else if (type === 'blip_color') {
        const blip = alt.blips.get(sqlId);

        if (blip.sqlId === sqlId) {
            blip.sprite = param.owner !== 0 ? 40 : 374;
            blip.color = param.color;
        }
    } else if (type === 'house_pos') {
        const blip = alt.blips.get(sqlId);
        const marker = alt.markers.get(sqlId);

        if (blip.sqlId === sqlId) blip.position = param;
        if (marker.sqlId === sqlId) marker.pos = param;
    } else if (type === 'house_destroy') {
        const blip = alt.blips.get(sqlId);
        const marker = alt.markers.get(sqlId);

        if (blip.sqlId = sqlId) blip.destroy();
        if (marker.sqlId === sqlId) alt.markers.delete(sqlId);
    }
});