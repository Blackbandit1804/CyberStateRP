module.exports = {
    Init: () => {
        loadBandZonesFromDB();
        initBandZonesUtils();
    }
}

function loadBandZonesFromDB() {
    alt.bandZones = {};
    DB.Query("SELECT * FROM band_zones", (e, result) => {
        for (var i = 0; i < result.length; i++) {
            initBandZoneUtils(result[i]);
            alt.bandZones[result[i].id] = result[i];
            result[i].minX = Number.MAX_VALUE;
            result[i].maxX = -Number.MAX_VALUE;
            result[i].minY = Number.MAX_VALUE;
            result[i].maxY = -Number.MAX_VALUE;
            result[i].collider = [];
        }

        alt.log(`Банд-зоны загружены: ${i} шт.`);
        DB.Query("SELECT * FROM band_zones_points", (e, result) => {
            for (var i = 0; i < result.length; i++) {
                var zone = alt.bandZones[result[i].zoneId];
                if (zone.minX > result[i].x) zone.minX = result[i].x;
                if (zone.maxX < result[i].x) zone.maxX = result[i].x;
                if (zone.minY > result[i].y) zone.minY = result[i].y;
                if (zone.maxY < result[i].y) zone.maxY = result[i].y;
                zone.collider.push(result[i]);
            }
            alt.log(`Коллайдеры банд-зон загружены: ${i} шт.`);
        });
    });
}

function initBandZonesUtils() {
    alt.bandZonesUtils = {
        initBandZones: (player) => {
            if (alt.factions.isGangFaction(player.faction)) {
                var zoneIds = [];
                var bandIds = [];
                var captures = {};
                for (var id in alt.bandZones) {
                    var zone = alt.bandZones[id];
                    zoneIds.push(id);
                    bandIds.push(zone.bandId);
                    if (zone.capture) {
                        captures[id] = {
                            bandId: zone.capture.bandId
                        };
                        if (player.faction == zone.bandId || player.faction == zone.capture.bandId) {
                            captures[id].my = {
                                left: [{
                                    bandId: zone.bandId,
                                    score: zone.capture.score,
                                    max: zone.capture.scoreMax,
                                }],
                                right: [{
                                    bandId: zone.capture.bandId,
                                    score: zone.capture.enemyScore,
                                    max: zone.capture.enemyScoreMax,
                                }],
                                seconds: parseInt(zone.capture.allSeconds - (Date.now() - zone.capture.startTime) / 1000),
                            };
                        }
                    }
                }
                alt.emitClient(player, `bandZones.setBand`, zoneIds, bandIds, captures);
                alt.emitClient(player, `bandZones.enable`, true);
            }
        },
        getByPos: (pos) => {
            for (var zoneId in alt.bandZones) {
                var zone = alt.bandZones[zoneId];
                if (inZone(pos, zone)) return zone;
            }
            return null;
        },
    };
}

function initBandZoneUtils(zone) {
    zone.setBand = (bandId) => {
        var band = alt.factions.getBySqlId(bandId);
        if (!band || !alt.factions.isGangFaction(band.sqlId)) return;
        zone.bandId = band.sqlId;
        DB.Query("UPDATE band_zones SET bandId=? WHERE id=?", [zone.bandId, zone.id]);
        alt.Player.all.forEach((rec) => {
            if (rec.sqlId && alt.factions.isGangFaction(rec.faction)) alt.emitClient(rec, `bandZones.setBand`, zone.id, zone.bandId);
        });
    };
    zone.startCapture = (bandId) => {
        var band = alt.factions.getBySqlId(bandId);
        if (!band || !alt.factions.isGangFaction(band.sqlId)) return;
        if (zone.capture) return;
        zone.capture = {
            bandId: band.sqlId,
            score: 0,
            scoreMax: 0,
            enemyScore: 0,
            enemyScoreMax: 0,
            startTime: Date.now(),
            allSeconds: alt.economy["capt_preparing_wait"].value,
            preparing: true
        };
        zone.timerId = setSaveTimeout(() => {
            try {
                delete zone.capture.preparing;
                zone.capture.allSeconds = alt.economy["capt_duration"].value;
                zone.capture.startTime = Date.now();
                var bandPlayers = getPlayersInZoneByFaction(zone.id, zone.bandId);
                var enemyPlayers = getPlayersInZoneByFaction(zone.id, zone.capture.bandId);
                zone.capture.score = zone.capture.scoreMax = bandPlayers.length;
                zone.capture.enemyScore = zone.capture.enemyScoreMax = enemyPlayers.length;
                var data = {
                    left: [{
                        bandId: zone.bandId,
                        score: zone.capture.score,
                        max: zone.capture.scoreMax,
                    }],
                    right: [{
                        bandId: zone.capture.bandId,
                        score: zone.capture.enemyScore,
                        max: zone.capture.enemyScoreMax,
                    }],
                    seconds: zone.capture.allSeconds
                };
                bandPlayers.forEach((rec) => {
                    alt.emitClient(rec, `bandZones.showCaptureProgress`, data);
                    rec.setSyncedMeta(`gangwar`, zone.id);
                });
                enemyPlayers.forEach((rec) => {
                    alt.emitClient(rec, `bandZones.showCaptureProgress`, data);
                    rec.setSyncedMeta(`gangwar`, zone.id);
                });
                zone.timerId = setSaveTimeout(() => {
                    zone.stopCapture();
                    clearSaveInterval(zone.timerId);
                }, zone.capture.allSeconds * 1000);
            } catch (e) {
                alt.log(e);
            }
        }, zone.capture.allSeconds * 1000);

        alt.Player.all.forEach((rec) => {
            if (rec.sqlId && alt.factions.isGangFaction(rec.faction)) {
                alt.emitClient(rec, `bandZones.startCapture`, zone.id, bandId);
                if (rec.faction == zone.bandId || rec.faction == bandId) {
                    var data = {
                        left: [{
                            bandId: zone.bandId
                        }],
                        right: [{
                            bandId: bandId
                        }],
                        seconds: zone.capture.allSeconds
                    };
                    alt.emitClient(rec, `bandZones.showCaptureProgress`, data);
                }
            }
        });
    };
    zone.stopCapture = () => {
        //debug(JSON.stringify(zone.capture))
        if (!zone.capture) return;
        // TODO: Calculate scores...
        var winBandId = (zone.capture.score >= zone.capture.enemyScore) ? zone.bandId : zone.capture.bandId;
        var loseBandId = (zone.capture.score < zone.capture.enemyScore) ? zone.bandId : zone.capture.bandId;

        alt.Player.all.forEach((rec) => {
            if (rec.sqlId) {
                if (rec.faction == winBandId) {
                    var str = (zone.bandId == winBandId)? 'defender' : 'attack';
                    alt.emitClient(rec, `prompt.showByName`, `band_zones_${str}_win`);
                    if (rec.getSyncedMeta("gangwar") == zone.id) rec.setSyncedMeta("gangwar", null);
                }
                else if (rec.faction == loseBandId) {
                    var str = (zone.bandId == loseBandId)? 'defender' : 'attack';
                    alt.emitClient(rec, `prompt.showByName`, `band_zones_${str}_lose`);
                    if (rec.getSyncedMeta("gangwar") == zone.id) rec.setSyncedMeta("gangwar", null);
                }
            }
        });
        zone.setBand(winBandId);
        delete zone.capture;
    };
    zone.leaveCapture = (player) => {
        if (!zone.capture) return;
        var gangwar = player.getSyncedMeta("gangwar");
        player.setSyncedMeta("gangwar", null);
        if (!gangwar || gangwar != zone.id) return;
        if (!alt.factions.isGangFaction(player.faction)) return;

        if (player.faction == zone.bandId) {
            zone.capture.score--;
            alt.Player.all.forEach((rec) => {
                if (rec.sqlId && rec.getSyncedMeta("gangwar") == gangwar)
                alt.emitClient(rec, `bandZones.setCaptureProgress`, player.faction, zone.capture.score, zone.capture.scoreMax);
            });
        } else {
            zone.capture.enemyScore--;
            alt.Player.all.forEach((rec) => {
                if (rec.sqlId && rec.getSyncedMeta("gangwar") == gangwar)
                alt.emitClient(rec, `bandZones.setCaptureProgress`, player.faction, zone.capture.enemyScore, zone.capture.enemyScoreMax);
            });
        }
        if (!zone.capture.score || !zone.capture.enemyScore) zone.stopCapture();
    };
    zone.contains = (pos) => {
        return inZone(pos, zone);
    };
}

// принадлежит ли позиция зоне
function inZone(pos, zone) {
    if (pos.x < zone.minX || pos.x > zone.maxX) return false;
    if (pos.y < zone.minY || pos.y > zone.maxY) return false;

    var polygon = zone.collider;

    var parity = 0;
    for (var i = 0; i < polygon.length - 1; i++) {
        var v = {
            x1: polygon[i].x,
            y1: polygon[i].y,
            x2: polygon[i + 1].x,
            y2: polygon[i + 1].y
        }
        switch (edgeType(v, pos)) {
            case 0:
                return 2;
                break;
            case 1:
                parity = 1 - parity;
                break;
        }
    }
    var v = {
        x1: polygon[polygon.length - 1].x,
        y1: polygon[polygon.length - 1].y,
        x2: polygon[0].x,
        y2: polygon[0].y
    }
    switch (edgeType(v, pos)) {
        case 0:
            return 2;
            break;
        case 1:
            parity = 1 - parity;
            break;
    }
    return parity;
}

// ребро касается, пересекается или пох
function edgeType(vector, a) {
    switch (classify(vector, a.x, a.y)) {
        case 1:
            return ((vector.y1 < a.y) && (a.y <= vector.y2)) ? 1 : 2;
            break;
        case -1:
            return ((vector.y2 < a.y) && (a.y <= vector.y1)) ? 1 : 2;
            break;
        case 0:
            return 0;
            break;
    }
}

// слева от вектора, справа от вектора, или принадлежит вектору
function classify(vector, x1, y1) {
    var pr = (vector.x2 - vector.x1) * (y1 - vector.y1) - (vector.y2 - vector.y1) * (x1 - vector.x1);
    if (pr > 0)
        return 1;
    if (pr < 0)
        return -1;
    return 0;
}

function getPlayersInZoneByFaction(zoneId, faction) {
    var zone = alt.bandZones[zoneId];
    var dX = zone.maxX - zone.minX;
    var dY = zone.maxY - zone.minY;
    var radius = (dX > dY) ? dX : dY;
    var pos = {
        x: zone.minX + dX,
        y: zone.minY + dY,
        z: 0
    };
    var players = [];
    alt.Player.all.forEach((rec) => {
        if (alt.Player.dist(rec.pos, pos) <= radius * 3) {
            if (rec.sqlId && rec.faction == faction && inZone(rec.pos, zone)) {
                players.push(rec);
            }
        }
    });
    return players;
}
