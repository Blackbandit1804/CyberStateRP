module.exports = {
    Init: () => {
        DB.Query("SELECT * FROM markers_tp", (e, result) => {
            for (var i = 0; i < result.length; i++) {

                createTpMarker(result[i]);
            }

            alt.log(`ТП-Маркеры загружены: ${i} шт.`);
        });
    }
}

global.createTpMarker = (data) => {
    var pos = new alt.Vector3(data.x, data.y, data.z + 0.5);
    var tpPos = new alt.Vector3(data.tpX, data.tpY, data.tpZ + 0.5);

    var marker = pos;
    marker.h = data.h;
    marker.sqlId = data.id;
    
    var targetMarker = tpPos;
    targetMarker.h = data.tpH;
    targetMarker.sqlId = data.id;

    //для стриминга
    var colshape = new alt.ColshapeCircle(pos.x, pos.y, 60);
    colshape.marker = data;
    marker.showColshape = colshape;

    //для отловки события входа
    var colshape = new alt.ColshapeSphere(pos.x, pos.y, pos.z, 2);
    colshape.tpMarker = data;
    colshape.targetMarker = targetMarker;
    marker.colshape = colshape;

    //для стриминга
    var colshape = new alt.ColshapeCircle(tpPos.x, tpPos.y, 60);
    colshape.marker = targetMarker;
    targetMarker.showColshape = colshape;

    //для отловки события входа
    var colshape = new alt.ColshapeSphere(tpPos.x, tpPos.y, tpPos.z, 2);
    colshape.tpMarker = targetMarker;
    colshape.targetMarker = data;
    targetMarker.colshape = colshape;
}
