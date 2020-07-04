export const initEvents = () => {
    alt.on('inventory.enable', state => {
        window.inventoryAPI.enable(state)
    })

    alt.on('inventory.add', (key, _items) => {
        const items = JSON.parse(_items)
        window.inventoryAPI.add(key, items)
    })

    alt.on('inventory.vehAdd', (key, _items) => {
        const items = JSON.parse(_items)
        window.inventoryAPI.vehAdd(key, items)
    })

    alt.on('inventory.delete', sqlId => {
        window.inventoryAPI.delete(sqlId)
    })

    alt.on('inventory.vehDelete', sqlId => {
        window.inventoryAPI.vehDelete(sqlId)
    })

    alt.on('inventory.updateParams', (sqlId, params) => {
        window.inventoryAPI.updateParams(sqlId, params)
    })

    alt.on('inventory.updateParamsVeh', (sqlId, params) => {
        window.inventoryAPI.updateParamsVeh(sqlId, params)
    })

    alt.on('inventory.updateData', (sqlId, newSqlId, parentSqlId) => {
        window.inventoryAPI.updateData(sqlId, newSqlId, parentSqlId)
    })

    alt.on('inventory.updateDataVeh', (sqlId, newSqlId, parentSqlId) => {
        window.inventoryAPI.updateDataVeh(sqlId, newSqlId, parentSqlId)
    })

    alt.on('inventory.setMoney', value => {
        window.inventoryAPI.setMoney(value)
    })

    alt.on('inventory.setBankMoney', value => {
        window.inventoryAPI.setBankMoney(value)
    })

    alt.on('inventory.setHealth', value => {
        window.inventoryAPI.setHealth(value)
    })

    alt.on('inventory.setSatiety', value => {
        window.inventoryAPI.setSatiety(value)
    })

    alt.on('inventory.setThirst', value => {
        window.inventoryAPI.setThirst(value)
    })

    alt.on('inventory.setArmour', value => {
        window.inventoryAPI.setArmour(value)
    })

    alt.on('inventory.addVehicleItems', (_items, _veh, rows, cols) => {
        const items = JSON.parse(_items)
        const veh = JSON.parse(_veh)
        
        window.inventoryAPI.addVehicleItems(items, veh, rows, cols)
    })

    alt.on('inventory.deleteVehicleItems', () => {
        window.inventoryAPI.deleteVehicleItems()
    })

    alt.on('window.inventoryAPI.mouseupHandler', () => {
        window.inventoryAPI.mouseupHandler()
    })
}
