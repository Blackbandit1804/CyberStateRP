module.exports = {
    Init: () => {
        createDrivingSchoolMarker();
    }
}

function createDrivingSchoolMarker() {
    var pos = new alt.Vector3(-915.20, -2038.27, 9.40);
    //для стриминга
    const marker = {}
    var colshape = new alt.ColshapeCircle(pos.x, pos.y, 60);
    colshape.marker = true;
    marker.showColshape = colshape;

    //для отловки события входа
    var colshape = new alt.ColshapeSphere(pos.x, pos.y, pos.z, 2);
    colshape.drivingSchool = true;
    marker.colshape = colshape;
    colshape.menuName = `enter_driving_school`;
}
