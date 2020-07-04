module.exports.Init = function() {
    DB.Query("SELECT * FROM houses WHERE closed != ?", [-1], function(e, result) {
        alt.houses = [];
        initHousesUtils();
        for (var i = 0; i < result.length; i++) {
            var marker = alt.createHouseMarker(result[i]);
            result[i].sqlId = result[i].id;
            delete result[i].id;

            alt.houses.push(marker);
        }
        alt.log(`Дома загружены: ${i} шт.`);
    });

    function initHouseUtils(house) {
        house.setInterior = (newInterior) => {
            if (newInterior < 1) newInterior = 1;
            house.interior = newInterior;
            DB.Query("UPDATE houses SET interior=? WHERE id=?",
                [house.interior, house.sqlId]);
        };
        house.setPrice = (price) => {
            house.price = Math.clamp(price, 1000, Number.MAX_VALUE);
            DB.Query("UPDATE houses SET price=? WHERE id=?",
                [house.price, house.sqlId]);
        };
        house.setClass = (newClass) => {
            if (newClass < 1) newClass = 1;
            house.class = newClass;
            DB.Query("UPDATE houses SET class=? WHERE id=?",
                [house.class, house.sqlId]);
        };
        house.setClosed = (closed) => {
            house.closed = Math.clamp(closed, 0, 1);
            DB.Query("UPDATE houses SET closed=? WHERE id=?",
                [house.closed, house.sqlId]);
        };
        house.setOwner = (ownerSqlId, ownerName) => {
            if (ownerSqlId < 1) {
                ownerSqlId = 0;
                ownerName = "";

                house.setColor(ownerSqlId, 0, 187, 0, 70);
                house.setBlipColor(ownerSqlId, 2);
                alt.fullDeleteItemsByParams(59, ["house"], [house.sqlId]);
            } else {
                house.setColor(ownerSqlId, 255, 0, 0, 70);
                house.setBlipColor(ownerSqlId, 49);
            }

            house.owner = ownerSqlId;
            house.ownerName = ownerName;

            DB.Query("UPDATE houses SET owner=?,ownerName=? WHERE id=?", [house.owner, house.ownerName, house.sqlId]);
            house.setClosed(0);
            house.setBalance(house.getTax() * 24);
        };
        house.setColor = (ownerSqlId, r, g, b, a) => {
            alt.emitClient(null, `House::setParams`, 'marker_color', house.sqlId, JSON.stringify({ r: r, g: g, b: b, alpha: a }));
        };
        house.setBlipColor = (ownerSqlId, color) => {
            alt.emitClient(null, `House::setParams`, 'blip_color', house.sqlId, JSON.stringify({color: color, pos: house.pos, owner: ownerSqlId}));
        };
        house.destroy = () => {
            alt.emitClient(null, `House::setParams`, 'house_destroy', house.sqlId);
        };
        house.setVehSpawn = (newSpawn) => {
            house.vehX = newSpawn.x;
            house.vehY = newSpawn.y;
            house.vehZ = newSpawn.z;
            house.vehH = newSpawn.h;
            DB.Query("UPDATE houses SET vehX=?,vehY=?,vehZ=?,vehH=? WHERE id=?",
                [house.vehX, house.vehY, house.vehZ, house.vehH, house.sqlId]);
        };
        house.changeCoord = (pos) => {
            house.x = pos.x;
            house.y = pos.y;
            house.z = pos.z;
            house.h = pos.h;
            DB.Query("UPDATE houses SET x=?,y=?,z=?,h=? WHERE id=?", 
                [house.x, house.y, house.z, house.h, house.sqlId]);
            
            alt.emitClient(null, `House::setParams`, 'house_pos', house.sqlId, JSON.stringify(new alt.Vector3(pos.x, pos.y, pos.z)));

            house.colshape.destroy();
            house.showColshape.destroy();

            house.colshape = alt.createHouseMarker(house);
        };  
        house.setBalance = (balance) => {
            if (balance < 0) balance = 0;
            house.balance = balance;
            DB.Query("UPDATE houses SET balance=? WHERE id=?", [balance, house.sqlId]);
        };
        house.sellToPlayer = (buyer) => {
            if (!buyer) return;
            house.owner = buyer.sqlId;
            house.ownerName = buyer.name;
            house.setBlipColor(house.owner, 49);
            house.balance = 3000;
            house.closed = 0;
            house.garageClosed = 0;

            DB.Query("UPDATE houses SET owner=?,ownerName=?,balance=?,closed=0,garageClosed=? WHERE id=?",
                [house.owner, house.ownerName, house.balance, 0, 0, house.sqlId]);

            player.utils.removeHouse(house);
            buyer.utils.addHouse(house);
            //buyer.markerEnterHouseId = house.id;
        };
        house.getTax = () => {
            return parseInt(house.price / 100) * alt.economy["house_tax"].value;
        };
    }

    function initHousesUtils() {
        alt.houses.getBySqlId = (sqlId) => {
            if (!sqlId) return null;
            var result;
            alt.houses.forEach((house) => {
                if (house.sqlId == sqlId) {
                    result = house;
                    return;
                }
            });
            return result;
        };
        alt.houses.getArrayByOwner = (owner) => {
            if (!owner) return [];
            var array = [];
            alt.houses.forEach((house) => {
                if (house.owner == owner) {
                    array.push(house);
                }
            });
            return array;
        };
        alt.houses.getHouseArrayByOwner = (owner) => {
            if (!owner) return [];
            var array = [];
            alt.houses.forEach((house) => {
                if (house.owner == owner) {
                    array.push({
                        sqlId: house.sqlId,
                        balance: house.balance,
                        owner: house.owner,
                        ownerName: house.ownerName,
                        price: house.price,
                        closed: house.closed,
                        garageClosed: house.garageClosed,
                        interior: house.interior,
                        garage: house.garage,
                        class: house.class,
                        x: house.h,
                        y: house.y,
                        z: house.z,
                        h: house.h,
                        garageX: house.garageX,
                        garageY: house.garageY,
                        garageZ: house.garageZ,
                        garageH: house.garageH
                    });
                }
            });
            return array;
        };
        alt.houses.delete = (house, callback) => {
            var i = alt.houses.indexOf(house);
            if (i == -1) return callback("Дом не найден!");
            alt.houses.splice(i, 1);
            house.colshape.destroy();
            house.showColshape.destroy();
            house.destroy();
            //DB.Query("DELETE FROM houses WHERE id=?", house.sqlId);
            DB.Query("UPDATE houses SET closed=? WHERE id=?", [-1, house.sqlId]);
            if (house.owner) {
                DB.Query("UPDATE characters SET house=? WHERE id=?", [0, house.owner]);
                var owner = alt.Player.getBySqlId(house.owner);
                if (owner) owner.house = 0;

                //todo удаление предметов
                //alt.fullDeleteHouseKeys(house.sqlId);
            }
            if (callback) callback();
            delete house;
        };
    }

    alt.createHouseMarker = (marker) => {
        var pos = new alt.Vector3(marker.x, marker.y, marker.z - 1);
        pos.z += alt.economy["markers_deltaz"].value;
        marker.pos = pos;
        
        //для стриминга домов для игроков, которые в радиусе
        var colshape = new alt.ColshapeCircle(marker.pos.x, marker.pos.y, alt.economy["markers_stream_dist"].value);
        colshape.dimension = 1;
        colshape.marker = marker;
        marker.showColshape = colshape;

        //для отловки события входа в дом
        var colshape = new alt.ColshapeSphere(marker.pos.x, marker.pos.y, marker.pos.z, 1.5);
        colshape.dimension = 1;
        colshape.house = marker;
        marker.colshape = colshape;
        // colshape.menuName = "enter_house";

        initHouseUtils(marker);

        return marker;
    }
}
