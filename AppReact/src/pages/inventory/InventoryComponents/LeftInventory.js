import React, { useState, useContext } from 'react'
import _ from 'lodash'

import InventoryItemsLayer from './InventoryItemsLayer'
import { calGridXY, getFirstCollison, xyToIndex } from '../utils/InventoryUtils'

import InventoryContext from './InventoryContext'

const InventoryCar = props => {
    const { children, settings, onHover, vehicle } = props
    const { width, height } = settings
    return (
        <div className="subInventory row5">
            <BackgroundLayer
                onHover={onHover}
                vehicle={vehicle}
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
        const isActive = (props.vehicle === props.onHover.vehicle && _.includes(props.onHover.items, i))
        inventoryElements.push(
            <div
                className={`slot + ${isActive ? 'active' : ''}`}
                key={i}
            />
        )
    }
    return <div className="inventoryGrid">{inventoryElements}</div>
}


const LeftInventory = props => {
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
        const { draggedItem } = inv
        const { margin, itemSize } = settings
        let curItem = inv.findVehItemBySqlId(inv.vehicleInventory, draggedItem.sqlId)
        if (!curItem) curItem = inv.findItemBySqlId(draggedItem.sqlId)
        if (!curItem) return

        //console.log(`Left: ${JSON.stringify(curItem)}`)
        const { gridX, gridY } = calGridXY(
            x,
            y,
            curItem,
            margin,
            itemSize,
            inv.vehicleInventorySettings.width,
            inv.vehicleInventorySettings.height
        )
        const hoverInd = []
        for (let w = 0; w < curItem.width; w++) {
            for (let h = 0; h < curItem.height; h++) {
                hoverInd.push((gridY + h) * (inv.vehicleInventorySettings.width) + gridX + w)
            }
        }
        inv.updateHoverIndexes({ vehicle: true, items: hoverInd })
    }

    const onCardDropInGroupItem = (dragItem, dropItem, x, y) => {
        inv.updateHoverIndexes({})
        const { vehicleInventory, draggedItem } = inv
        const { margin, itemSize } = settings
        const fullInv = vehicleInventory
        let curItem = inv.findVehItemBySqlId(fullInv, dragItem.sqlId)
        if (!curItem) curItem = inv.findItemBySqlId(dragItem.sqlId)
        if (!curItem) return
        const { gridX, gridY } = calGridXY(
            x,
            y,
            curItem,
            margin,
            itemSize,
            inv.vehicleInventorySettings.width,
            inv.vehicleInventorySettings.height
        )

        const newItem = { ...curItem, gridX, gridY, parentId: -1, inVehicle: dragItem.inVehicle }
        const collision = getFirstCollison(
            _.filter(fullInv, item => item.sqlId !== dragItem.sqlId),
            newItem
        )
        if (collision) {
            returnItemBack()
            return
        }
        // удаляем старый предмет
        if (dragItem.inVehicle) {
            _.remove(
                fullInv,
                item => {
                    return item.sqlId === draggedItem.sqlId
                }
            )
            fullInv.push(newItem)
            inv.updateVehicleInventory(fullInv)

        }

        // обновляем
        inv.updateItemPos(
            curItem.sqlId,
            dragItem.inVehicle ? null : -2,
            xyToIndex(
                inv.vehicleInventorySettings.width,
                inv.vehicleInventorySettings.height,
                { x: gridX, y: gridY }
            ),
            dragItem.inVehicle
        )
        inv.updateDraggedItem({})
    }

    const initVehicle = () => {
        const vehInv = inv.vehicleInventory
        const { sqlId } = inv.vehicleInventorySettings
        return (
            <InventoryItemsLayer
                key={sqlId}
                id={sqlId}
                type="vehicle"
                index={sqlId}
                cards={vehInv}
                length={vehInv.length}
                onCardDropInGroupItem={onCardDropInGroupItem}
                onCardHoverInGroupItem={onCardHoverInGroupItem}
                layout={invSettings}
                updateGroupList={updateInventories}
            />
        )
    }
    return (
        <div className="leftInventory inventoryBlock">
            <div className="inventoryHeader"><h4>{inv.vehicleInventorySettings.name}</h4></div>
            <InventoryCar
                settings={inv.vehicleInventorySettings}
                vehicle
                onHover={inv.hoverIndexes}
            >
                {initVehicle()}
            </InventoryCar>
        </div>
    )
}

export default LeftInventory
