import React, { useContext, useRef } from 'react'
import { useDrop } from 'react-dnd'

import InventoryContext from './InventoryContext'

const InventoryMergeLayer = props => {
    const ref = useRef(null)
    const { inv } = useContext(InventoryContext)
    const canMergeItems = (itemSqlId, targetItemSqlId) => {
        const item = inv.findItemBySqlId(itemSqlId)
        const targetItem = inv.findItemBySqlId(targetItemSqlId)
        if (!item || !targetItem) {
            // REMOVE
            alt.emit('nError', 'Client: Один из предметов для слияния не найден!')
            return false
        }
        //console.log(JSON.stringify(item))
        //console.log(JSON.stringify(targetItem))
        const can = ( // патроны
            item.params.ammo
            && !item.params.weaponHash
            && targetItem.params.ammo
            && !targetItem.params.weaponHash
            && item.itemId === targetItem.itemId
        ) || ( // патроны на пушку
            item.params.ammo != null
                && !item.params.weaponHash
                && targetItem.params.weaponHash
                && item.itemId === inv.weaponAmmo[targetItem.itemId]
        ) || ( // нарко на нарко
            item.itemId === targetItem.itemId
            && inv.drugsIds.indexOf(item.itemId) !== -1
        ) || ( // сигарета на пачку
            item.itemId === 62
            && targetItem.itemId === 34
            && targetItem.params.count < 20
        )
        return can
    }

    const doItemsMerge = (itemSqlId, targetItemSqlId) => {
        const item = inv.findItemBySqlId(itemSqlId)
        const targetItem = inv.findItemBySqlId(itemSqlId)
        //console.log(`DRAG ITEM: ${JSON.stringify(item)}`)
        //console.log(`MERGE ITEM: ${JSON.stringify(props)}`)
        if (!item || !targetItem) {
            // REMOVE
            alt.emit('nError', 'Client: Один из предметов для слияния не найден!')
            return false
        }
        // патроны
        if (
            item.params.ammo
            && targetItem.params.ammo
            && item.itemId === targetItem.itemId
        ) {
            window.inventoryAPI.delete(itemSqlId)
            return true
        }
        // патроны на пушку
        if (
            item.params.ammo !== null
            && !item.params.weaponHash
            && targetItem.params.weaponHash
            && item.itemId === inv.weaponAmmo[targetItem.itemId]
        ) {
            window.inventoryAPI.delete(itemSqlId)
            return true
        }
        // наркота
        if (
            item.itemId === targetItem.itemId
            && inv.drugsIds.indexOf(item.itemId) !== -1
        ) {
            window.inventoryAPI.delete(itemSqlId)
            return true
        }
        // сигареты
        if (
            item.itemId === 62
            && targetItem.itemId === 34
        ) {
            if (targetItem.params.count >= 20) {
                // REMOVE
                alt.emit('nError', 'Client: Один из предметов для слияния не найден!')
                return false
            }
            window.inventoryAPI.delete(itemSqlId)
            return true
        }

        return false
    }

    const [, drop] = useDrop({
        accept: 'card',
        canDrop: (item, monitor) => {
            //console.log(`MergeLayer: ${JSON.stringify(item)}`)
            if (monitor.id === item.sqlId) return false
            return true
        },
        hover: (item, monitor) => {
            //console.log(`${JSON.stringify(item)}, ${JSON.stringify(monitor)}`)
            if (item.type === 'card') {
                const { x, y } = monitor.getClientOffset()
                //console.log(`${x}, ${y}`)
            }
        },
        drop: (item, monitor) => {
            //console.log(`DRAG ITEM: ${JSON.stringify(item)}`)
            //console.log(`MERGE ITEM: ${JSON.stringify(props)}`)
            if (!item.inVehicle && !props.inVehicle) {
                if (item.sqlId === props.id) {
                    return {}
                }
                //console.log(canMergeItems(item.sqlId, props.id))
                if (canMergeItems(item.sqlId, props.id)) {
                    inv.mergeItems(item.sqlId, props.id)
                    doItemsMerge(item.sqlId, props.id)
                }
            }
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    })

    drop(ref)
    return (
        <div
            ref={ref}
            className="mergeLayer"
        />
    )
}
export default InventoryMergeLayer