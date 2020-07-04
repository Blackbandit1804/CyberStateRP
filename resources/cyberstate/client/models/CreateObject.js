import alt from 'alt';
import game from 'natives';

const player = alt.Player.local

alt.objects = new Map();
let totalObjects = 0;

class CreateObject {
    constructor(model, pos, rot = null, sqlId, entity = null, isNetwork = false, thisScriptCheck = false, dynamic = false) {
        this.model = model;
        this.pos = pos;
        this.rot = rot;
        this.isNetwork = isNetwork;
        this.thisScriptCheck = thisScriptCheck;
        this.dynamic = dynamic;
        this.scriptID = 0;
        this.entity = entity;
        this.sqlId = sqlId;

        totalObjects += 1;
        this.uniqueID = totalObjects;

        alt.objects.set(sqlId, this);
    }
}

const objectHelper = {
	"new": (model, pos, rot, sqlId, entity) => new CreateObject(model, pos, rot, sqlId, entity)
};

alt.onServer(`Object::new`, (model, pos, rot, sqlId) => {
    const _pos = JSON.parse(pos);
    const _rot = JSON.parse(rot);
    const obj = objectHelper.new(model, _pos, _rot, sqlId);
    const pPos = player.pos;

    if (alt.vdist(pPos, obj.pos) <= 50) {
        createObject_SqlId(obj);
    }

});

alt.onServer(`Object::destroy`, (sqlId) => {
    const obj = alt.objects.get(sqlId);
    
    if (obj) {
        if (obj.scriptID !== 0) game.deleteObject(obj.scriptID);
        alt.objects.delete(sqlId);
    }
});

alt.on(`gameEntityCreate`, (entity) => {
    alt.objects.forEach((obj) => {
        if (obj.scriptID === 0) {
            if (!obj.value) {
                createObject_SqlId(obj);
            }
        }
    });
});

alt.on(`update`, () => {
    const pPos = player.pos;

    alt.objects.forEach((obj) => {
        if (alt.vdist(pPos, obj.pos) >= 50) {
            game.deleteObject(obj.scriptID);
            obj.scriptID = 0;
        }
    });
});

alt.on(`disconnect`, () => {
    alt.objects.forEach((obj) => {
        if (obj.scriptID !== 0) game.deleteObject(obj.scriptID);
    });
});

function createObject_SqlId(obj) {
    obj.scriptID = game.createObject(obj.model, obj.pos.x, obj.pos.y, obj.pos.z, obj.isNetwork, obj.thisScriptCheck, obj.dynamic);
    game.placeObjectOnGroundProperly(obj.scriptID);
    if (obj.rot !== null) game.setEntityRotation(obj.scriptID, obj.rot.x, obj.rot.y, obj.rot.z, 1, true);
    game.freezeEntityPosition(obj.scriptID, true);
}

export default objectHelper;