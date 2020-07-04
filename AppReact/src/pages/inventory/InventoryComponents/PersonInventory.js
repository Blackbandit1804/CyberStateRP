import React, { useContext, useState } from 'react'
import _ from 'lodash'

import InventoryItemsLayer from './InventoryItemsLayer'
import InventoryContext from './InventoryContext'

import { calGridXY, getFirstCollison } from '../utils/InventoryUtils'

const PersonInventory = props => {
    const { inv } = useContext(InventoryContext)

    const invSettings = {
        itemSize: 50,
        margin: [5, 5],
        containerPadding: [0, 0],
    }
    const [settings] = useState(invSettings)

    const returnItemBack = () => {
        inv.updateDraggedItem({})
    }

    const updateInventories = invs => {
        inv.updateInventory(invs)
    }

    const onCardHoverInGroupItem = (dragItem, dropItem, x, y) => {
        inv.updateHoverIndexes({})
    }

    const onCardDropInGroupItem = (dragItem, dropItem, x, y) => {
        inv.updateHoverIndexes({})
        const { personInventory, vehicleInventory, draggedItem } = inv
        const { margin, itemSize } = settings
        const groupIndex = dropItem.index
        const fullInv = personInventory
        const vehInv = vehicleInventory

        let curItem = inv.findVehItemBySqlId(vehInv, dragItem.sqlId)
        if (!curItem) curItem = inv.findItemBySqlId(dragItem.sqlId)
        if (!curItem) return

        const { gridX, gridY } = calGridXY(
            x,
            y,
            curItem,
            margin,
            itemSize,
            1,
            1,
        )
        const newItem = { ...curItem, gridX, gridY, parentId: -1, inVehicle: false }
        const collision = getFirstCollison(
            _.filter(fullInv, item => item.itemId === groupIndex && item.parentId === -1),
            newItem
        )
        if (collision) {
            returnItemBack()
            return
        }
        // удаляем старый предмет
        if (curItem.parentId === -1 || !curItem.parentId) {
            // надето на теле
            _.remove(
                fullInv,
                item => {
                    return item.sqlId === draggedItem.sqlId
                }
            )
        } else {
            const fromIndex = _.findIndex(
                fullInv,
                singleItem => singleItem.sqlId === curItem.parentId
            )
            _.remove(
                fullInv[fromIndex].items,
                item => {
                    return item.sqlId === draggedItem.sqlId
                }
            )
        }
        if (!dragItem.inVehicle) {
            fullInv.push(newItem)
        }
        // обновляем
        inv.updateItemPos(
            curItem.sqlId,
            -1,
            dropItem.index - 1,
            dragItem.inVehicle
        )
        updateInventories(fullInv)
        inv.updateVehicleInventory(vehInv)
        inv.updateDraggedItem({})
    }

    const initPersonLoadout = id => {
        const items = _.filter(inv.personInventory, item => item.itemId === id && item.parentId === -1)
        return (
            <InventoryItemsLayer
                key={id}
                id={id}
                type="personItems"
                index={id}
                cards={items}
                length={items.length}
                onCardDropInGroupItem={onCardDropInGroupItem}
                onCardHoverInGroupItem={onCardHoverInGroupItem}
                layout={invSettings}
                updateGroupList={updateInventories}
            />
        )
    }
    return (
        <div className="personInventory">
            <div className="playerView inventoryBlock">
                <div className="inventoryHeader">
                    <h4>
                        Инвентарь:&nbsp;
                        { window.clientStorage.name }
                    </h4>
                </div>
                <div className="playerLoadout">
                    <div className="playerLoadoutItem smallItem">
                        <div className="itemIcon itemGlasses" />
                        {initPersonLoadout(1)}
                    </div>
                    <div className="playerLoadoutItem centerItem">
                        <div className="itemIcon itemCap" />
                        {initPersonLoadout(6)}
                    </div>
                    <div className="playerLoadoutItem smallItem lastItem">
                        <div className="itemIcon itemNeck" />
                        {initPersonLoadout(10)}
                    </div>
                    <div className="playerLoadoutItem smallItem">
                        <div className="itemIcon itemTie" />
                        {initPersonLoadout(2)}
                    </div>
                    <div className="playerLoadoutItem centerItem">
                        <div className="itemIcon itemJacket" />
                        {initPersonLoadout(7)}
                    </div>
                    <div className="playerLoadoutItem smallItem lastItem">
                        <div className="itemIcon itemArm" />
                        {initPersonLoadout(12)}
                    </div>
                    <div className="playerLoadoutItem smallItem">
                        <div className="itemIcon itemVest" />
                        {initPersonLoadout(3)}
                    </div>
                    <div className="playerLoadoutItem centerItem">
                        <div className="itemIcon itemShirt" />
                        {initPersonLoadout(4)}
                    </div>
                    <div className="playerLoadoutItem smallItem lastItem">
                        <div className="itemIcon itemClocks" />
                        {initPersonLoadout(11)}
                    </div>
                    <div className="playerLoadoutItem smallItem">
                        <div className="itemIcon itemPassport" />
                        {initPersonLoadout(16)}
                    </div>
                    <div className="playerLoadoutItem centerItem expandedItem">
                        <div className="itemIcon itemPants" />
                        {initPersonLoadout(8)}
                    </div>
                    <div className="playerLoadoutItem smallItem lastItem">
                        <div className="itemIcon itemBackpack" />
                        {initPersonLoadout(13)}
                    </div>
                    <div className="playerLoadoutItem smallItem">
                        <div className="itemIcon itemPhone" />
                        {initPersonLoadout(15)}
                    </div>
                    <div className="playerLoadoutItem smallItem lastItem">
                        <div className="itemIcon itemMask" />
                        {initPersonLoadout(14)}
                    </div>
                    <div className="playerLoadoutItem smallItem">
                        <div className="itemIcon itemKeyCar" />
                        {initPersonLoadout(54)}
                    </div>
                    <div className="playerLoadoutItem centerItem">
                        <div className="itemIcon itemBoots" />
                        {initPersonLoadout(9)}
                    </div>
                    <div className="playerLoadoutItem smallItem lastItem">
                        <div className="itemIcon itemKeyHome" />
                        {initPersonLoadout(59)}
                    </div>
                </div>
            </div>
            <div className="playerStates inventoryBlock">
                <div className="playerState playerWater">
                    <div className="stateIcon" />
                    <div className="stateBar">
                        <div style={{ width: `${inv.personItems.thirst}%` }} />
                    </div>
                </div>
                <div className="playerState playerHP">
                    <div className="stateIcon" />
                    <div className="stateBar">
                        <div style={{ width: `${inv.personItems.health}%` }} />
                    </div>
                </div>
                <div className="playerState playerFood">
                    <div className="stateIcon" />
                    <div className="stateBar">
                        <div style={{ width: `${inv.personItems.satiety}%` }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PersonInventory
