module.exports = {
    Init: () => {
        loadPedsFromDB();
        initPedsUtils();
    }
}

function loadPedsFromDB() {
    alt.dbPeds = [];
    DB.Query("SELECT * FROM peds", (e, result) => {
        for (var i = 0; i < result.length; i++) {
            var p = result[i];
            p.sqlId = p.id;
            p.position = new alt.Vector3(p.x, p.y, p.z);
            p.heading = p.h;
            p.hash = jhash(p.model);
            delete p.x;
            delete p.y;
            delete p.z;
            delete p.h;
            delete p.model;
            delete p.id;

            alt.dbPeds.push(p);
        }

        alt.log(`Педы загружены: ${i} шт.`);
    });
}

function initPedsUtils() {
    alt.dbPeds.getNear = (player) => {
        var nearPed;
        var minDist = 99999;
        for (var i = 0; i < alt.dbPeds.length; i++) {
            var ped = alt.dbPeds[i];
            var distance = alt.Player.dist(player.pos, ped.position);
            if (distance < minDist) {
                nearPed = ped;
                minDist = distance;
            }
        }

        return nearPed;
    };
    alt.dbPeds.deletePed = (ped) => {
        var index = alt.dbPeds.indexOf(ped);
        if (index == -1) return;

        DB.Query("DELETE FROM peds WHERE id=?", ped.sqlId);
        alt.dbPeds.splice(index, 1);

        alt.Player.all.forEach((rec) => {
            if (rec.sqlId) alt.emitClient(rec, `peds.delete`, ped.sqlId);
        });
    };
}
