import alt from 'alt';
import game from 'natives';

alt.markers = new Map();
let totalMarkers = 1000;

class DrawMarker {
    constructor(type, pos, dir, rot, scale, color, enterColor, deleteOnEnter, range, sqlId = 0) {
        this.type = type;
        this.pos = pos;
        this.dir = dir;
        this.rot = rot;
        this.scale = scale;
        this.color = color;
        this.deleteOnEnter = deleteOnEnter;
        this.markForDelete = false;
        this.range = range;
        this.sqlId = sqlId;

        if (enterColor !== undefined)
            this.color2 = enterColor;

        if (dir === undefined || dir === null)
            this.dir = 0;

        if (rot === undefined || rot === null)
            this.rot = 180.0;

        totalMarkers += 1;
        this.uniqueID = totalMarkers;

        if (sqlId !== 0) alt.markers.set(sqlId, this);
        else alt.markers.set(this.uniqueID, this);
    }
}

const markerHelper = {
	"new": (type, pos, dir, rot, scale, color, enterColor, deleteOnEnter, range, sqlId) => new DrawMarker(type, pos, dir, rot, scale, color, enterColor, deleteOnEnter, range, sqlId)
};

export default markerHelper;