import React, { useCallback, useState, useEffect } from 'react'
import MouseBackEnd from 'react-dnd-mouse-backend'
import { DndProvider } from 'react-dnd'
import { find, findIndex, remove } from 'lodash'

import PersonInventory from './PersonInventory'
import RightInventory from './RightInventory'
import LeftInventory from './LeftInventory'
import InventoryContext from './InventoryContext'
import InventoryModal from './InventoryModal'
import InventoryMenu from './InventoryMenu'
import InventoryDragModal from './InventoryDragModal'
import ResponsiveStyler from './ResponsiveStyler'

import '../../../assets/css/playerInventory.css'

import {
    getNameByFactionId,
    isPersonItem,
    isContainerItem,
    indexToXY,
} from '../utils/InventoryUtils'
import { initEvents } from '../utils/InventoryEvents'
import { popupSettings } from '../utils/InventoryPopupSettings'

const Inventory = props => {
    const itemMenus = popupSettings()

    const updateDraggedItem = item => {
        setInv(prevState => { // eslint-disable-line no-use-before-define
            return {
                ...prevState,
                draggedItem: item,
            }
        })
    }
    const updateInventory = inventory => {
        // сохранение clientStorage.inventoryItems
        setInv(prevState => { // eslint-disable-line no-use-before-define
            return {
                ...prevState,
                personInventory: inventory,
            }
        })
    }
    const updateVehicleInventory = inventory => {
        // сохранение clientStorage.inventoryItems
        //console.log(`inventory: ${JSON.stringify(inventory)}`)
        setInv(prevState => { // eslint-disable-line no-use-before-define
            return {
                ...prevState,
                vehicleInventory: inventory,
            }
        })
    }
    const updateHoverIndexes = indx => {
        // сохранение clientStorage.inventoryItems
        setInv(prevState => { // eslint-disable-line no-use-before-define
            return {
                ...prevState,
                hoverIndexes: indx,
            }
        })
    }
    const updateVehicleInventorySettings = settings => {
        // сохранение clientStorage.inventoryItems
        setInv(prevState => { // eslint-disable-line no-use-before-define
            return {
                ...prevState,
                vehicleInventorySettings: settings,
            }
        })
    }
    const updateItemPos = (sqlId, parentId, index, inVehicle) => {
        alt.emit(
            'events.emitServer',
            'item.updatePos',
            JSON.stringify([sqlId, parentId, index, inVehicle])
        )
    }
    const mergeItems = (sqlId, targetSqlId) => {
        alt.emit(
            'events.emitServer',
            'items.merge',
            JSON.stringify([sqlId, targetSqlId])
        )
    }
    const updatePersonItems = personItems => {
        // сохранение clientStorage.inventoryItems
        setInv(prevState => { // eslint-disable-line no-use-before-define
            return {
                ...prevState,
                personItems,
            }
        })
    }
    const findItemBySqlId = sqlId => {
        const aItem = find(inv.personInventory, { sqlId }) // eslint-disable-line
        if (aItem) return aItem
        for (let i = 0; i < inv.personInventory.length; i++) { // eslint-disable-line
            const bItem = find(inv.personInventory[i].items, { sqlId }) // eslint-disable-line
            if (bItem) return bItem
        }
    }
    const findVehItemBySqlId = (vehInv, sqlId) => {
        const aItem = find(
            vehInv, // eslint-disable-line
            item => item.sqlId === sqlId
        )
        if (aItem) return aItem
        return null
    }
    const showModal = (modalVisible, item, bounds) => {
        setInv(prevState => { // eslint-disable-line no-use-before-define
            return {
                ...prevState,
                modal: {
                    active: modalVisible,
                    top: bounds.top - 25,
                    left: bounds.right + 5,
                    desc: getItemName(item.sqlId), // eslint-disable-line no-use-before-define
                },
            }
        })
    }
    const hideItemMenu = () => {
        setInv(prevState => { // eslint-disable-line no-use-before-define
            return {
                ...prevState,
                itemMenu: {
                    active: false,
                },
            }
        })
    }
    const hideModal = () => {
        setInv(prevState => { // eslint-disable-line no-use-before-define
            return {
                ...prevState,
                modal: {
                    active: false,
                },
            }
        })
    }
    const hideModals = () => {
        setInv(prevState => { // eslint-disable-line no-use-before-define
            return {
                ...prevState,
                modal: {
                    active: false,
                },
                itemMenu: {
                    active: false,
                },
            }
        })
    }
    const showItemMenu = (modalVisible, item, bounds) => {
        setInv(prevState => { // eslint-disable-line no-use-before-define
            //console.log(bounds)
            return {
                ...prevState,
                itemMenu: {
                    active: modalVisible,
                    top: bounds.bottom + 5,
                    left: bounds.right + 5,
                    sqlId: item.sqlId,
                    menu: itemMenus[item.itemId],
                },
            }
        })
    }

    const inventoryData = {
        personInventory: [],
        vehicleInventory: [],
        draggedItem: {},
        forbiddenItems: {
            7: [3, 7, 8, 9, 13],
            8: [3, 7, 8, 9, 13],
            13: [13],
        },
        modal: {
            active: false,
            top: 0,
            left: 0,
            desc: '',
        },
        itemMenu: {
            active: false,
            top: 0,
            left: 0,
            desc: '',
        },
        vehicleInventorySettings: {
            width: 5,
            height: 10,
            sqlId: -1,
            name: '',
        },
        personItems: {
            money: 0,
            bankMoney: 0,
            health: 0,
            satiety: 0,
            thirst: 0,
            armor: 0,
        },
        weaponAmmo: {
            20: 37, // 9mm
            21: 38, // 12mm
            22: 40, // 5.56mm
            23: 39, // 7.62mm
            44: 37,
            45: 37,
            46: 37,
            47: 37,
            48: 37,
            49: 38,
            50: 39,
            51: 40,
            52: 39,
            53: 39,
            100: 39,
        },
        drugsIds: [55, 56, 57, 58],
        hoverIndexes: {},
        updateDraggedItem,
        updateInventory,
        updateVehicleInventory,
        updateHoverIndexes,
        updatePersonItems,
        updateItemPos,
        updateVehicleInventorySettings,
        showModal,
        showItemMenu,
        hideItemMenu,
        hideModal,
        findVehItemBySqlId,
        findItemBySqlId,
        mergeItems,
    }
    // set extra fields
    const [inv, setInv] = useState(inventoryData)
    const [active, setActive] = useState(false)
    // settings defaults

    useEffect(() => {
        initEvents()
    }, [])
    // findItem
    const findArrayItemByItemId = itemIds => {
        const array = {}
        for (let i = 0; i < itemIds.length; i++) {
            find(inv.personInventory, item => item.itemId === itemIds[i])
        }
        return array
    }
    const updateItemInInv = (sqlId, params, inventory) => {
        const immInv = inventory
        const item = find(immInv, { sqlId })
        if (item) {
            const newItem = { ...item, params }
            remove(
                immInv,
                aItem => aItem.sqlId === sqlId
            )
            immInv.push(newItem)
        } else {
            for (let i = 0; i < immInv.length; i++) {
                if (Object.prototype.hasOwnProperty.call(immInv[i], 'items')) {
                    const parentItem = immInv[i]
                    const finalItem = find(parentItem.items, { sqlId })
                    if (finalItem) {
                        const newItem = { ...finalItem, params }
                        remove(
                            parentItem.items,
                            aItem => aItem.sqlId === sqlId
                        )
                        parentItem.items.push(newItem)
                        const parentIndex = findIndex(
                            immInv,
                            singleItem => singleItem.sqlId === parentItem.sqlId
                        )
                        immInv.splice(parentIndex, 1, parentItem)
                    }
                }
            }
        }
        return immInv
    }

    const invItemNames = {
        3: item => { // armour
            const info = window.clientStorage.inventoryItems[item.itemId - 1]
            let { name } = info
            if (item.params.faction) name += ` ${getNameByFactionId(item.params.faction)}`
            return `${name} [${item.params.armour}%]`
        },
        5: item => { // VISA
            const info = window.clientStorage.inventoryItems[item.itemId - 1]
            return `${info.name} ${item.params.count}$`
        },
        6: item => { // hat
            const info = window.clientStorage.inventoryItems[item.itemId - 1]
            if (item.params.faction) return `${info.name} ${getNameByFactionId(item.params.faction)}`
            return info.name
        },
        7: item => { // top
            const info = window.clientStorage.inventoryItems[item.itemId - 1]
            if (item.params.faction) return `${info.name} ${getNameByFactionId(item.params.faction)}`
            return info.name
        },
        8: item => { // legs
            const info = window.clientStorage.inventoryItems[item.itemId - 1]
            if (item.params.faction) return `${info.name} ${getNameByFactionId(item.params.faction)}`
            return info.name
        },
        9: item => { // feets
            const info = window.clientStorage.inventoryItems[item.itemId - 1]
            if (item.params.faction) return `${info.name} ${getNameByFactionId(item.params.faction)}`
            return info.name
        },
        24: item => { // аптечка
            const info = window.clientStorage.inventoryItems[item.itemId - 1]
            return `${info.name} [${item.params.count} ед.]`
        },
        25: item => { // пластырь
            const info = window.clientStorage.inventoryItems[item.itemId - 1]
            return `${info.name} [${item.params.count} ед.]`
        },
        29: item => { // удостоверение PD
            const info = window.clientStorage.inventoryItems[item.itemId - 1]
            return `${info.name} №${item.params.owner}`
        },
        34: item => { // пачка сигарет
            const info = window.clientStorage.inventoryItems[item.itemId - 1]
            return `${info.name} [${item.params.count} шт.]`
        },
        36: item => { // канистра
            const info = window.clientStorage.inventoryItems[item.itemId - 1]
            return `${info.name} [${item.params.count}/${item.params.maxCount} л.]`
        },
        37: item => { // патроны
            const info = window.clientStorage.inventoryItems[item.itemId - 1]
            return `${info.name} [${item.params.ammo} шт.]`
        },
        38: item => { // патроны
            const info = window.clientStorage.inventoryItems[item.itemId - 1]
            return `${info.name} [${item.params.ammo} шт.]`
        },
        39: item => { // патроны
            const info = window.clientStorage.inventoryItems[item.itemId - 1]
            return `${info.name} [${item.params.ammo} шт.]`
        },
        40: item => { // патроны
            const info = window.clientStorage.inventoryItems[item.itemId - 1]
            return `${info.name} [${item.params.ammo} шт.]`
        },
        54: item => { // ключи авто
            const info = window.clientStorage.inventoryItems[item.itemId - 1]
            return `${info.name} ${item.params.model}`
        },
        55: item => { // нарко
            const info = window.clientStorage.inventoryItems[item.itemId - 1]
            return `${info.name} [${item.params.count} г.]`
        },
        56: item => { // нарко
            const info = window.clientStorage.inventoryItems[item.itemId - 1]
            return `${info.name} [${item.params.count} г.]`
        },
        57: item => { // нарко
            const info = window.clientStorage.inventoryItems[item.itemId - 1]
            return `${info.name} [${item.params.count} г.]`
        },
        58: item => { // нарко
            const info = window.clientStorage.inventoryItems[item.itemId - 1]
            return `${info.name} [${item.params.count} г.]`
        },
        59: item => { // ключи дома
            const info = window.clientStorage.inventoryItems[item.itemId - 1]
            return `${info.name} №${item.params.house}`
        },
    }
    const getItemName = sqlId => {
        let item = findItemBySqlId(sqlId)
        if (!item) item = window.inventoryAPI.getVehItem(sqlId);
        if (!item) return 'Неизвестный'
        if (!invItemNames[item.itemId]) return window.clientStorage.inventoryItems[item.itemId - 1].name
        return invItemNames[item.itemId](item)
    }

    const handleUserKeyPress = useCallback(event => {
        const { keyCode } = event
        if (keyCode === 73) {
            window.inventoryAPI.show(!window.inventoryAPI.active())
        }
    }, [])

    window.inventoryAPI = {
        active: () => {
            return active
        },
        add: (_sqlId, _item) => {
            const item = _item
            const { personInventory } = inv
            const fullInv = personInventory
            // console.log(`isPersonItem item: ${JSON.stringify(item)}`)
            if (isPersonItem(item)) {
                const newItem = {
                    ...item,
                    gridX: 0,
                    gridY: 0,
                    width: window.clientStorage.inventoryItems[item.itemId - 1].width,
                    height: window.clientStorage.inventoryItems[item.itemId - 1].height,
                    parentId: -1,
                }
                if (isContainerItem(item)) {
                    newItem.items = []
                    // console.log(`Container item: ${JSON.stringify(item)}`)
                    Object.keys(item.items).forEach(key => {
                        const { gridX, gridY } = indexToXY(
                            window.clientStorage.inventoryItems[item.itemId - 1].width,
                            window.clientStorage.inventoryItems[item.itemId - 1].height,
                            item.items[key].index
                        )
                        const subItem = {
                            ...item.items[key],
                            gridX,
                            gridY,
                            width: window.clientStorage.inventoryItems[item.items[key].itemId - 1].width,
                            height: window.clientStorage.inventoryItems[item.items[key].itemId - 1].height,
                        }
                        newItem.items.push(subItem)
                    })
                }
                // console.log(`newItem ${JSON.stringify(newItem)}`)
                fullInv.push(newItem)
            } else {
                // console.log(`item: ${JSON.stringify(item)}`)
                const parentItem = window.inventoryAPI.getItem(item.parentId)
                // console.log(`parentItem: ${JSON.stringify(parentItem)}`)
                const { gridX, gridY } = indexToXY(
                    window.clientStorage.inventoryItems[parentItem.itemId - 1].width,
                    window.clientStorage.inventoryItems[parentItem.itemId - 1].height,
                    item.index
                )
                const newItem = {
                    ...item,
                    gridX,
                    gridY,
                    width: window.clientStorage.inventoryItems[item.itemId - 1].width,
                    height: window.clientStorage.inventoryItems[item.itemId - 1].height,
                }
                if (isContainerItem(newItem)) {
                    newItem.items = []
                    Object.keys(item.items).forEach(key => {
                        const { aGridX, aGridY } = indexToXY(
                            window.clientStorage.inventoryItems[item.itemId - 1].width,
                            window.clientStorage.inventoryItems[item.items[key].itemId - 1].height,
                            item.items[key].index
                        )
                        const subItem = {
                            ...item.items[key],
                            aGridX,
                            aGridY,
                            width: window.clientStorage.inventoryItems[item.items[key].itemId - 1].width,
                            height: window.clientStorage.inventoryItems[item.items[key].itemId - 1].height,
                        }
                        newItem.items.push(subItem)
                    })
                }
                parentItem.items.push(newItem)
                const parentIndex = findIndex(
                    fullInv,
                    singleItem => singleItem.sqlId === parentItem.sqlId
                )
                fullInv.splice(parentIndex, 1, parentItem)
            }
            //console.log(JSON.stringify(inv.personInventory))
            updateInventory(fullInv)
        },
        updateData: (sqlId, newSqlId, parentSqlId) => {
            // могут быть баги
            //console.log(`${sqlId}, ${newSqlId}, ${parentSqlId}`)
            const newInv = updateItemInInv(
                sqlId,
                { parentId: parentSqlId, sqlId: newSqlId },
                inv.personInventory
            )
            updateInventory(newInv)

            //console.log(`1: ${JSON.stringify(newInv)}`)
        },
        updateDataVeh: (sqlId, newSqlId, parentSqlId) => {
            // могут быть баги
            //console.log(`${sqlId}, ${newSqlId}, ${parentSqlId}`)
            const vehInv = updateItemInInv(sqlId, { sqlId: newSqlId }, inv.vehicleInventory)
            updateVehicleInventory(vehInv)

            //console.log(`10: ${JSON.stringify(vehInv)}`)
        },
        addVehicleItems: (_items, _veh, rows, cols) => {
            const items = _items
            const veh = _veh

            //console.log(`VEHITEMS: ${JSON.stringify(_items)}`)

            const immVehInv = []
            updateVehicleInventorySettings(
                {
                    width: cols,
                    height: rows,
                    name: veh.name,
                    sqlId: veh.sqlId,
                }
            )
            updateVehicleInventory([])
            Object.keys(items).forEach(key => {
                const vehItem = items[key]
                const { gridX, gridY } = indexToXY(cols, rows, vehItem.index)
                const fullItem = { 
                    ...vehItem, 
                    gridX, 
                    gridY, 
                    width: window.clientStorage.inventoryItems[vehItem.itemId - 1].width,
                    height: window.clientStorage.inventoryItems[vehItem.itemId - 1].height, 
                    inVehicle: true 
                }
                
                immVehInv.push(fullItem)
            })
            updateVehicleInventory(immVehInv)

            //console.log(`2: ${JSON.stringify(immVehInv)}`)
        },
        delete: sqlId => {
            const invImm = inv.personInventory
            // console.log(`SQLID: ${sqlId}`)
            const item = findItemBySqlId(sqlId)
           // console.log(`ITEM: ${JSON.stringify(item)}`)
            if (item) {
                if (item.parentId === -1 || !item.parentId) {
                    //console.log(`ITEM: ${JSON.stringify(item)}`)
                    remove(invImm, aItem => aItem.sqlId === sqlId)
                } else {
                    const parentItem = findItemBySqlId(item.parentId)
                    //console.log(`PARENT: ${JSON.stringify(parentItem)}`)
                    remove(parentItem.items, aItem => aItem.sqlId === sqlId)
                    const parentIndex = findIndex(
                        invImm,
                        singleItem => singleItem.sqlId === parentItem.sqlId
                    )
                    invImm.splice(parentIndex, 1, parentItem)
                }

                updateInventory(invImm)
                // window.clientStorage.inventoryWeight = window.inventoryAPI.getCommonWeight()
                // выставить размер инвентаря
                // $('#inventory .weight').text(clientStorage.inventoryWeight.toFixed(1))
            }
        },
        deleteVehicleItems: () => {
            updateVehicleInventory([])
        },
        enable: enable => {
            if (enable) {
                window.addEventListener('keydown', handleUserKeyPress)
            } else {
                window.inventoryAPI.show(enable)
                window.removeEventListener('keydown', handleUserKeyPress)
            }
        },
        getItem: sqlId => {
            return findItemBySqlId(sqlId)
        },
        getArrayByItemId: _itemIds => {
            let itemIds = ''
            if (typeof _itemIds === 'string') itemIds = JSON.parse(_itemIds)
            if (!Array.isArray(itemIds)) itemIds = [itemIds]
            return findArrayItemByItemId(itemIds)
        },
        getVehItem: (sqlId) => {
            const aItem = find(
                inv.vehicleInventory, // eslint-disable-line
                item => item.sqlId === sqlId
            )
            if (aItem) return aItem
            return null
        },
        setHealth: _value => {
            const value = parseInt(_value, 10)
            updatePersonItems({ health: value })
        },
        setSatiety: _value => {
            const value = parseInt(_value, 10)
            updatePersonItems({ satiety: value })
        },
        setThirst: _value => {
            const value = parseInt(_value, 10)
            updatePersonItems({ thirst: value })
        },
        setArmour: _value => {
            const value = parseInt(_value, 10)
            const immInv = inv.personInventory
            const item = find(immInv, aItem => (aItem.itemId === 3 && aItem.parentId === -1))
            if (!item) {
                const newItem = { ...item, params: { armour: value } }
                remove(immInv, aItem => (aItem.itemId === 3 && aItem.parentId === -1))
                immInv.push(newItem)
            }
            updatePersonItems(immInv)
        },
        show: enable => {
            if (enable) {
                if (window.medicTablet.active()
                || window.pdTablet.active()
                || window.clientStorage.hasCuffs
                || window.telePhone.active()
                //|| window.armyTablet.active()
                // || window.sheriffTablet.active()
                //|| window.fibTablet.active()
                || window.playerMenu.active()
                || window.consoleAPI.active()
                || window.modalAPI.active()
                || window.playerMenu.active()
                || window.chatAPI.active()
                //|| window.tradeAPI.active()
                || window.documentsAPI.active()
                || window.houseMenu.__vue__.active()) return
                alt.emit('Cursor::show', true)
                alt.emit('setInventoryActive', true)
                alt.emit('setBlockControl', true)
                alt.emit('toBlur', 200)
                setActive(enable)
            } else {
                if (window.consoleAPI.active()) return
                alt.emit('setInventoryActive', false)
                alt.emit('Cursor::show', false)
                alt.emit('setBlockControl', false)
                hideItemMenu()
                hideModal()
                alt.emit('fromBlur', 200)
                setActive(enable)
            }
        },
        updateParams: (_sqlId, _params) => {
            const sqlId = parseInt(_sqlId, 10)
            const params = _params
            const newInv = updateItemInInv(sqlId, params, inv.personInventory)
            updateInventory(newInv)
        },
        updateParamsVeh: (_sqlId, _params) => {
            const sqlId = parseInt(_sqlId, 10)
            const params = JSON.parse(_params)
            const newInv = updateItemInInv(sqlId, { params }, inv.vehicleInventory)
            updateInventory(newInv)
        },
        vehAdd: (_sqlId, _item) => {
            // const sqlId = parseInt(_sqlId, 10)
            const item = _item
            const { vehicleInventory } = inv
            const fullInv = vehicleInventory
            let newItem = item
            newItem.inVehicle = true

            if (!item.parentId || item.parentId === -1) {
                delete item.parentId
            }
            const { gridX, gridY } = indexToXY(
                inv.vehicleInventorySettings.width,
                inv.vehicleInventorySettings.height,
                item.index
            )
            newItem = {
                ...newItem,
                gridX,
                gridY,
                width: window.clientStorage.inventoryItems[item.itemId - 1].width,
                height: window.clientStorage.inventoryItems[item.itemId - 1].height,
                inVehicle: true,
            }
            fullInv.push(newItem)
            updateVehicleInventory(fullInv)
            //console.log(`3: ${JSON.stringify(fullInv)}`)
        },
        vehDelete: sqlId => {
            const invImm = inv.vehicleInventory
            const item = findVehItemBySqlId(invImm, sqlId)
            if (item.parentId === -1 || !item.parentId) {
                remove(invImm, { sqlId })
            } else {
                const parentItem = findItemBySqlId(item.parentId)
                remove(parentItem.items, { sqlId })
                const parentIndex = findIndex(
                    invImm,
                    singleItem => singleItem.sqlId === parentItem.sqlId
                )
                invImm.splice(parentIndex, 1, parentItem)
            }
            // vehicle check weight
        },
    }
    return (
        active &&
        <DndProvider backend={MouseBackEnd}>
            <InventoryContext.Provider
                value={{ inv }}
            >
                <div id="invWrapper">
                    <ResponsiveStyler>
                        <div
                            id="playerInventory"
                            style={{ display: active ? 'grid' : 'none' }}
                            role="presentation"
                            onClick={hideModals}
                        >
                            { window.clientStorage.bootVehicleId !== -1
                                && <LeftInventory />
                            }
                            <PersonInventory />
                            <RightInventory />
                        </div>
                    </ResponsiveStyler>
                    <InventoryMenu />
                    <InventoryModal />
                    <InventoryDragModal />
                </div>
            </InventoryContext.Provider>
        </DndProvider>
    )
}
export default Inventory
