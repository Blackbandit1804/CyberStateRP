import React, { useContext, useRef } from 'react'
import { useDrop } from 'react-dnd'
import _ from 'lodash'

import InventoryItem from './InventoryItem'
import InventoryContext from './InventoryContext'

const InventoryItemsLayer = props => {
    const ref = useRef(null)
    const { inv } = useContext(InventoryContext)

    const [, drop] = useDrop({
        accept: 'card',
        canDrop(item, monitor) {
            //console.log(`ItemsLayer: ${JSON.stringify(item)}`)
            let hasError = false
            // проверка для сумок, что можно в них класть
            if (Object.prototype.hasOwnProperty.call(props, 'itemId')) {
                if (Object.prototype.hasOwnProperty.call(inv.forbiddenItems, props.itemId)) {
                    if (_.includes(inv.forbiddenItems[props.itemId], item.itemId)) {
                        hasError = true
                    }
                }
            }
            if (item.width > props.width || item.height > props.height) {
                hasError = true
            }
            // проверка повтора
            if (!Object.prototype.hasOwnProperty.call(props, 'itemId')) {
                const itemExists = _.find(
                    inv.personInventory,
                    singleItem => (singleItem.parentId === -1 && singleItem.itemId === item.itemId))
                if (itemExists) hasError = true
                if (item.itemId > 16 && item.itemId !== 54 && item.itemId !== 59) hasError = true
            }
            if (Object.prototype.hasOwnProperty.call(props, 'itemId')) {
                if (props.itemId === item.itemId) hasError = true
            }
            if (props.type === 'vehicle') {
                hasError = false
                // проверка есть ли вещи внутри
                if (Object.prototype.hasOwnProperty.call(inv.forbiddenItems, item.itemId)) {
                    let curItem = inv.findItemBySqlId(item.sqlId)
                    if (!curItem) curItem = inv.findVehItemBySqlId(inv.vehicleInventory, item.sqlId)
                    if (!curItem) return
                    if (Object.prototype.hasOwnProperty.call(curItem, 'items')) {
                        if (curItem.items.length > 0) {
                            hasError = true
                        }
                    }
                }
            }
            //console.log(`hasError: ${hasError}`)
            if (hasError) {
                return false
            }
            return true
        },
        hover(item, monitor) {
            if (item.type === 'card') {
                const hoverItem = props
                const { x, y } = monitor.getClientOffset()
                const groupItemBoundingRect = ref.current.getBoundingClientRect()
                const groupItemX = groupItemBoundingRect.left
                const groupItemY = groupItemBoundingRect.top
                props.onCardHoverInGroupItem(item, hoverItem, x - groupItemX, y - groupItemY)
            }
        },
        drop: (item, monitor) => {
            if (item.type === 'card') {
                const hoverItem = props
                const offset = monitor.getClientOffset()
                if (!offset) return {}
                const { x, y } = offset
                const groupItemBoundingRect = ref.current.getBoundingClientRect()
                const groupItemX = groupItemBoundingRect.left
                const groupItemY = groupItemBoundingRect.top
                props.onCardDropInGroupItem(item, hoverItem, x - groupItemX, y - groupItemY)
            }
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    })
    const createCards = (cards, groupID, index) => {
        const { layout } = props
        const itemDoms = []
        _.forEach(cards, (c, i) => {
            itemDoms.push(
                <InventoryItem
                    dragCardID={-1}
                    type="card"
                    card={c}
                    sqlId={c.sqlId}
                    inVehicle={c.inVehicle}
                    itemId={c.itemId}
                    index={i}
                    gridX={c.gridX}
                    gridY={c.gridY}
                    width={c.width}
                    height={c.height}
                    parentId={c.parentId}
                    key={`${groupID}_${c.sqlId}`}
                    layout={layout}
                />
            )
        })
        return itemDoms
    }
    const {
        id,
        index,
        cards,
    } = props

    drop(ref)
    return (
        <div
            ref={ref}
            className="itemsGrid"
        >
            {createCards(cards, id, index)}
        </div>
    )
}
export default InventoryItemsLayer
