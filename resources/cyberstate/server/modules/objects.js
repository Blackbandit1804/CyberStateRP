alt.objects = new Map();

module.exports = {
    Init: () => {
        initObjectsUtils();
    }
}

class CreateObject {
    constructor(model, pos = null, rot = null, item = null, sqlId = 0, isNetwork = false, thisScriptCheck = false, dynamic = false, entity = null, value = null) {
        this.model = model;
        this.pos = pos;
        this.rot = rot;
        this.isNetwork = isNetwork;
        this.thisScriptCheck = thisScriptCheck;
        this.dynamic = dynamic;
        this.item = item;
        this.sqlId = sqlId;
        this.entity = entity;
        this.value = value;

        alt.emitClient(null, `Object::new`, model, JSON.stringify(pos), JSON.stringify(rot), sqlId, entity, value);
        alt.objects.set(sqlId, this);
    }
}

function initObjectsUtils() {
    alt.objects.new = (model, pos, rot, item, sqlId, entity, value) => new CreateObject(model, pos, rot, item, sqlId, false, false, false, entity, value);

    alt.objects.destroy = (sqlId) => {
        alt.objects.delete(sqlId);
        alt.emitClient(null, `Object::destroy`, sqlId);
    };

    alt.objects.at = (sqlId) => {
        if (!sqlId) return null;
        var result;
        alt.objects.forEach((obj) => {
            if (obj.sqlId == sqlId) {
                result = obj;
                return;
            }
        });
        return result;
    };
}