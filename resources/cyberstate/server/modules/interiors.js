module.exports.Init = function() {
    DB.Query("SELECT * FROM interiors", function(e, result) {
        alt.interiors = [];
        initInteriorsUtils();
        for (var i = 0; i < result.length; i++) {
            alt.interiors[i] = result[i];
            var pos = new alt.Vector3(alt.interiors[i]["x"], alt.interiors[i]["y"], alt.interiors[i]["z"] - 1);

            var colshape = new alt.ColshapeSphere(pos["x"], pos["y"], pos["z"], 2);
            colshape.dimension = 0;
            colshape.menuName = "exit_house";

            //alt.interiors[i].exitMarker = alt.createInteriorExitMarker(pos);


            //var pos = new alt.Vector3(alt.interiors[i]["garageX"], alt.interiors[i]["garageY"], alt.interiors[i]["garageZ"] - 1);

            //if (pos.x != 0 && pos.y != 0) alt.interiors[i].garageMarker = alt.createInteriorGarageMarker(pos);

            initInteriorUtils(alt.interiors[i]);
        }

        alt.log(`Интерьеры загружены: ${i} шт.`);
    });
}

function initInteriorsUtils() {
    alt.interiors.getBySqlId = (sqlId) => {
        if (!sqlId) return null;
        var result;
        alt.interiors.forEach((interior) => {
            if (interior.id == sqlId) {
                result = interior;
                return;
            }
        });
        return result;
    }
}

function initInteriorUtils(interior) {
    interior.setSpawn = (newSpawn) => {
        interior.spawnX = newSpawn.x;
        interior.spawnY = newSpawn.y;
        interior.spawnZ = newSpawn.z;
        interior.spawnH = newSpawn.h;
        DB.Query(`UPDATE interiors SET spawnX=?,spawnY=?,spawnZ=?,spawnH=? WHERE id=?`,
            [newSpawn.x, newSpawn.y, newSpawn.z, newSpawn.h, interior.id]);
    }
    interior.setEnter = (newSpawn) => {
        interior.x = newSpawn.x;
        interior.y = newSpawn.y;
        interior.z = newSpawn.z;
        interior.h = newSpawn.h;
        DB.Query(`UPDATE interiors SET x=?,y=?,z=?,h=? WHERE id=?`,
            [newSpawn.x, newSpawn.y, newSpawn.z, newSpawn.h, interior.id]);
    }
    interior.setGarage = (newSpawn) => {
        interior.garageX = newSpawn.x;
        interior.garageY = newSpawn.y;
        interior.garageZ = newSpawn.z;
        interior.garageH = newSpawn.h;
        DB.Query(`UPDATE interiors SET garageX=?,garageY=?,garageZ=?,garageH=? WHERE id=?`,
            [newSpawn.x, newSpawn.y, newSpawn.z, newSpawn.h, interior.id]);

        if (interior.garageMarker) {
            interior.garageMarker.colshape.destroy();
            interior.garageMarker.destroy();
            delete interior.garageMarker;
        }
        //TODO: interior.garageMarker = alt.createInteriorGarageMarker(pos);
    }
    interior.setRooms = (rooms) => {
        interior.rooms = Math.clamp(rooms, 0, 50);
        DB.Query(`UPDATE interiors SET rooms=? WHERE id=?`,
            [interior.rooms, interior.id]);
    }
    interior.setSquare = (square) => {
        interior.square = Math.clamp(square, 0, 1000);
        DB.Query(`UPDATE interiors SET square=? WHERE id=?`,
            [interior.square, interior.id]);
    }
}