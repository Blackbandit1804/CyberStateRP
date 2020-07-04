import React, { useState, useContext } from 'react'
import _ from 'lodash'

import InventoryItemsLayer from './InventoryItemsLayer'
import { calGridXY, getFirstCollison, xyToIndex } from '../utils/InventoryUtils'

import InventoryContext from './InventoryContext'

const InventoryJacket = props => {
    const { children, settings, itemId, onHover } = props
    const { width, height } = settings
    return (
        <div className="subInventory inventoryBlock row5">
            <BackgroundLayer
                onHover={onHover}
                itemId={itemId}
                width={width}
                height={height}
            />
            {children}
        </div>
    )
}
const InventoryBelt = props => {
    const { children, settings, itemId, onHover } = props
    const { width, height } = settings
    return (
        <div className="subInventory inventoryBlock row3">
            <BackgroundLayer
                onHover={onHover}
                itemId={itemId}
                width={width}
                height={height}
            />
            {children}
        </div>
    )
}
const InventoryBackpack = props => {
    const { children, settings, itemId, onHover } = props
    const { width, height } = settings
    return (
        <div className="subInventory inventoryBlock row5 backpackBlock">
            <BackgroundLayer
                onHover={onHover}
                itemId={itemId}
                width={width}
                height={height}
            />
            {children}
        </div>
    )
}

const BackgroundLayer = props => {
    const inventoryElements = []
    for (let i = 0; i < props.width * props.height; i++) {
        const isActive = (
            props.itemId === props.onHover.item
            && !props.onHover.vehicle
            && _.includes(props.onHover.items, i)
        )
        inventoryElements.push(
            <div
                className={`slot + ${isActive ? 'active' : ''}`}
                key={i}
            />
        )
    }
    return <div className="inventoryGrid">{inventoryElements}</div>
}


const RightInventory = props => {
    const invSettings = {
        itemSize: 40,
        margin: [5, 5],
        containerPadding: [0, 0],
    }
    const [settings] = useState(invSettings)
    const { inv } = useContext(InventoryContext)

    const updateInventories = invs => {
        inv.updateInventory(invs)
    }

    const returnItemBack = () => {
        inv.updateDraggedItem({})
    }

    const onCardHoverInGroupItem = (dragItem, dropItem, x, y) => {
        const { personInventory, draggedItem, vehicleInventory } = inv
        const { margin, itemSize } = settings
        const groupIndex = dropItem.index
        const fullInv = personInventory
        const vehInv = vehicleInventory

        let curItem = inv.findVehItemBySqlId(vehInv, draggedItem.sqlId)
        if (!curItem) curItem = inv.findItemBySqlId(draggedItem.sqlId)
        if (!curItem) return
        //console.log(`Right: ${JSON.stringify(curItem)}`)
        
        const toIndex = _.findIndex(
            fullInv,
            singleItem => singleItem.sqlId === groupIndex
        )
        const { gridX, gridY } = calGridXY(
            x,
            y,
            curItem,
            margin,
            itemSize,
            fullInv[toIndex].width,
            fullInv[toIndex].height
        )
        const hoverInd = []
        for (let w = 0; w < curItem.width; w++) {
            for (let h = 0; h < curItem.height; h++) {
                hoverInd.push((gridY + h) * (fullInv[toIndex].width) + gridX + w)
            }
        }
        inv.updateHoverIndexes({ item: fullInv[toIndex].itemId, items: hoverInd })
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

        const toIndex = _.findIndex(
            fullInv,
            singleItem => singleItem.sqlId === groupIndex
        )

        // console.log(`DRAG: ${JSON.stringify(draggedItem)}`)
        // console.log(`CUR: ${JSON.stringify(curItem)}`)

        const { gridX, gridY } = calGridXY(
            x,
            y,
            curItem,
            margin,
            itemSize,
            fullInv[toIndex].width,
            fullInv[toIndex].height
        )
        const newItem = { ...curItem, gridX, gridY, parentId: groupIndex, inVehicle: false }
        const collision = getFirstCollison(
            _.filter(fullInv[toIndex].items, item => item.sqlId !== draggedItem.sqlId),
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
        const newToIndex = _.findIndex(
            fullInv,
            singleItem => singleItem.sqlId === dropItem.index
        )
        // обновляем
        inv.updateItemPos(
            curItem.sqlId,
            groupIndex,
            xyToIndex(fullInv[newToIndex].width, fullInv[newToIndex].height, { x: gridX, y: gridY }),
            dragItem.inVehicle
        )
        // добавляем новый
        if (!dragItem.inVehicle) {
            fullInv[newToIndex].items.unshift(newItem)
        }
        updateInventories(fullInv)
        inv.updateVehicleInventory(vehInv)
        inv.updateDraggedItem({})
    }

    const initInventory = parentItem => {
        const { itemId, sqlId, items } = parentItem
        return (
            <InventoryItemsLayer
                key={sqlId}
                id={sqlId}
                type="backpackItems"
                index={sqlId}
                itemId={itemId}
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
        <div className="rightInventory">
            {_.map(inv.personInventory, item => {
                switch (item.itemId) {
                case 7:
                    if (!item.parentId || item.parentId === -1) {
                        return (
                            <InventoryJacket
                                settings={item}
                                key={item.sqlId}
                                itemId={item.itemId}
                                onHover={inv.hoverIndexes}
                            >
                                {initInventory(item)}
                            </InventoryJacket>
                        )
                    }
                    break
                case 8:
                    if (!item.parentId || item.parentId === -1) {
                        return (
                            <InventoryBelt
                                settings={item}
                                key={item.sqlId}
                                itemId={item.itemId}
                                onHover={inv.hoverIndexes}
                            >
                                {initInventory(item)}
                            </InventoryBelt>
                        )
                    }
                    break
                case 13:
                    if (!item.parentId || item.parentId === -1) {
                        return (
                            <InventoryBackpack
                                settings={item}
                                key={item.sqlId}
                                itemId={item.itemId}
                                onHover={inv.hoverIndexes}
                            >
                                {initInventory(item)}
                            </InventoryBackpack>
                        )
                    }
                    break
                default:
                    return ''
                }
            })}
        </div>
    )
}

export default RightInventory
