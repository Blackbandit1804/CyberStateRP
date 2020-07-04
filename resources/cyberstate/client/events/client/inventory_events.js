import alt from 'alt';
import game from 'natives';

alt.on(`Client::init`, (view) => {
    alt.on("inventory.enable", (enable) => {
        view.emit(`inventory.enable`, enable);
    });

    alt.onServer("inventory.add", (items) => {
        items = JSON.parse(items);

        var items = convertIndexesToSqlId(items);
        
        for (var key in items) {
            view.emit(`inventory.add`, key, JSON.stringify(items[key]));
        }
    });

    alt.onServer("inventory.vehAdd", (items) => {
        items = JSON.parse(items);
        
        var items = convertIndexesToSqlId(items);
        for (var key in items) {
            view.emit(`inventory.vehAdd`, key, JSON.stringify(items[key]));
        }
    });

    alt.onServer("inventory.delete", (sqlId) => {
        view.emit(`inventory.delete`, sqlId);
    });

    alt.onServer("inventory.vehDelete", (sqlId) => {
        view.emit(`inventory.vehDelete`, sqlId);
    });

    alt.onServer("inventory.updateParams", (sqlId, params) => {
        view.emit(`inventory.updateParams`, sqlId, params);
    });

    alt.onServer("inventory.updateParamsVeh", (sqlId, params) => {
        view.emit(`inventory.updateParamsVeh`, sqlId, JSON.stringify(params));
    });

    alt.onServer("inventory.updateData", (sqlId, newSqlId, parentSqlId = -1) => {
        view.emit(`inventory.updateData`, sqlId, newSqlId, parentSqlId);
    });

    alt.onServer("inventory.updateDataVeh", (sqlId, newSqlId, parentSqlId = -1) => {
        view.emit(`inventory.updateDataVeh`, sqlId, newSqlId, parentSqlId);
    });

    view.on("setInventoryActive", (enable) => {
        alt.inventoryActive = enable;
    });

    alt.on("inventory.setHealth", (value) => {
        view.emit(`inventory.setHealth`, value);
    });

    alt.onServer("inventory.setSatiety", (value) => {
        view.emit(`inventory.setSatiety`, value);
    });

    alt.onServer("inventory.setThirst", (value) => {
        view.emit(`inventory.setThirst`, value);
    });

    alt.onServer("inventory.addVehicleItems", (items, veh, rows, cols) => {
        view.emit(`inventory.addVehicleItems`, items, JSON.stringify(veh), rows, cols);
    });

    alt.onServer("inventory.deleteVehicleItems", () => {
        //return;
        view.emit(`inventory.deleteVehicleItems`);
    });
});

/* Конвертируем новую серверную структуру в старую. */
function convertIndexesToSqlId(items) {
    var result = {};
    for (var index in items) {
        var item = items[index];
        if (item.items) item.items = convertIndexesToSqlId(item.items);
        result[item.id] = item;
    }
    items = null;
    return result;
}
