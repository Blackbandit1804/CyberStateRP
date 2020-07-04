import alt from 'alt';

alt.on(`Client::init`, (view) => {
    alt.onServer("bandZones.setBand", (zoneIds, bandIds, captures) => {
        // debug(`bandZones.setBand: ${zoneIds} ${bandIds}`)
        view.emit(`bandZonesAPI.setBand`, zoneIds, bandIds);
        if (captures) {
            for (var id in captures) {
                var capt = captures[id];
                view.emit(`bandZonesAPI.startCapture`, id, capt.bandId);
                if (capt.my) alt.emit("bandZones.showCaptureProgress", capt.my);
            }
        }
    });

    alt.onServer("bandZones.startCapture", (zoneId, bandId) => {
        view.emit(`bandZonesAPI.startCapture`, zoneId, bandId);
    });

    alt.on("bandZones.setPlayerPos", (x, y) => {
        view.emit(`bandZonesAPI.setPlayerPos`, x, y);
    });

    alt.onServer("bandZones.setRect", (x1, x2, y1, y2) => {
        view.emit(`bandZonesAPI.setRect`, x1, x2, y1, y2);
    });

    alt.onServer("bandZones.showCaptureProgress", (data) => {
        view.emit(`bandZonesAPI.showCaptureProgress`, data)
    });

    alt.onServer("bandZones.setCaptureProgress", (bandId, score, max) => {
        view.emit(`bandZonesAPI.setCaptureProgress`, bandId, score, max);
    });

    alt.onServer("bandZones.show", (enable) => {
        view.emit(`bandZonesAPI.show`, enable);
    });

    alt.onServer("bandZones.enable", (enable) => {
        view.emit(`bandZonesAPI.enable`, enable);
    });

    alt.on("bandZones.checkInZone", (player) => {
        var x = player.pos.x;
        var y = player.pos.y;
        var gangwar = player.getSyncedMeta("gangwar");
        view.emit(`bandZonesAPI.checkInZone`, x, y, gangwar);
    });
});
