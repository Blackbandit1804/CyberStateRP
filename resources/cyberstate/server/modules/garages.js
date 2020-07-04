module.exports.Init = function() {
    DB.Query("SELECT * FROM garages", function(e, result) {
        alt.garages = [];
        initGaragesUtils();

        for (var i = 0; i < result.length; i++) {
            alt.garages[i] = result[i];
            alt.garages[i]["slots"] = JSON.parse(alt.garages[i]["slots"]);

            var pos = new alt.Vector3(result[i]["x"], result[i]["y"], result[i]["z"] - 1);
            alt.garages[i].exitMarker = createExitMarker(pos);
            initGarageUtils(alt.garages[i]);
        }

        alt.log(`Гаражи загружены: ${i} шт.`);
    });
}

function initGaragesUtils() {
    alt.garages.getBySqlId = (sqlId) => {
        if (!sqlId) return null;
        var result;
        alt.garages.forEach((garage) => {
            if (garage.id === sqlId) {
                result = garage;
                return;
            }
        });
        return result;
    }
}

function initGarageUtils(garage) {
    garage.setEnter = (pos) => {
        garage.x = pos.x;
        garage.y = pos.y;
        garage.z = pos.z;
        garage.h = pos.h;
        DB.Query(`UPDATE garages SET x=?,y=?,z=?,h=? WHERE id=?`,
            [pos.x, pos.y, pos.z, pos.h, garage.id]);
    }
}

function createExitMarker(pos) {
    /*var exitMarker = alt.helpers.marker.new(1, pos, 1,
    	{
    		color: [0,187,255,70],
    		visible: false,
    		dimension: -1
    	});*/
    //для отловки события входа
    var colshape = new alt.ColshapeSphere(pos["x"], pos["y"], pos["z"], 2);
    colshape.dimension = -1;
    colshape.menuName = "exit_garage";

    return exitMarker;
}
