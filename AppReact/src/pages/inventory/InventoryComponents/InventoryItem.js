import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDrag } from 'react-dnd'

import { calGridItemPosition, calWHtoPx } from '../utils/InventoryUtils'

import InventoryMergeLayer from './InventoryMergeLayer'
import InventoryContext from './InventoryContext'

const InventoryItem = props => {
    const [itemImage, setItemImage] = useState(null)
    const ref = useRef(null)
    const { inv } = useContext(InventoryContext)
    const images = require.context('../../../assets/images/', true)

    const [{ isDragging }, drag] = useDrag({
        item: {
            sqlId: props.sqlId,// eslint-disable-line
            type: props.type,// eslint-disable-line
            itemId: props.itemId,// eslint-disable-line
            width: props.width,// eslint-disable-line
            height: props.height,// eslint-disable-line
            inVehicle: props.inVehicle,// eslint-disable-line
        },
        begin: monitor => {
            inv.updateDraggedItem(
                {
                    sqlId: props.sqlId,
                    itemId: props.itemId,
                    x: props.gridX,
                    y: props.gridY,
                    initGroup: props.parentId,
                }
            )
        },
        end: (item, monitor) => {
            if (!monitor.didDrop()) {
                inv.updateHoverIndexes({})
            }
        },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    })
    const loadSVG = imageName => {
        setItemImage(images(`./${imageName}.svg`))
    }

    const loadImage = imageName => {
        switch (imageName) {
        case 1:
            loadSVG('glasses')
            break
        case 2:
            loadSVG('tie')
            break
        case 3:
            loadSVG('vest')
            break
        case 4:
            loadSVG('tshirt')
            break
        case 5:
            loadSVG('visa-card')
            break
        case 6:
            loadSVG('cap')
            break
        case 7:
            loadSVG('jacket')
            break
        case 8:
            loadSVG('pants')
            break
        case 9:
            loadSVG('shoes')
            break
        case 10:
            loadSVG('chain')
            break
        case 11:
            loadSVG('apple-watch')
            break
        case 12:
            loadSVG('arm')
            break
        case 13:
            loadSVG('backpack')
            break
        case 14:
            loadSVG('mask')
            break
        case 15:
            loadSVG('phone')
            break
        case 16:
            loadSVG('passport')
            break
        case 54:
            loadSVG('keycar')
            break
        case 59:
            loadSVG('keyhome')
            break
        default:
            setItemImage(images(`./items/${imageName}.png`))
        }
    }

    const showModal = active => {
        inv.showModal(active, props, ref.current.getBoundingClientRect())
    }
    const showMenu = active => {
        inv.showItemMenu(active, props, ref.current.getBoundingClientRect())
    }

    const { gridX, gridY, width, height, layout, itemId, parentId, sqlId, inVehicle } = props
    useEffect(() => {
        loadImage(itemId)
    }, [])
    const { margin, itemSize } = layout
    const realM = (itemId >= 1 && (itemId <= 16 || itemId === 54 || itemId === 59) && parentId === -1) ? 0 : margin
    const { x, y } = calGridItemPosition((gridX < 0) ? 0 : gridX, (gridY < 0) ? 0 : gridY, realM, itemSize)
    const { wPx, hPx } = calWHtoPx(width, height, realM, itemSize)
    const realW = (itemId >= 1 && (itemId <= 16 || itemId === 54 || itemId === 59) && parentId === -1 && (inVehicle === false || !inVehicle)) ? '100%' : wPx
    const realH = (itemId >= 1 && (itemId <= 16 || itemId === 54 || itemId === 59) && parentId === -1 && (inVehicle === false || !inVehicle)) ? '100%' : hPx
    drag(ref)
    // loadImage(itemId)
    return (
        <React.Fragment>
            <div
                ref={ref}
                onMouseEnter={() => showModal(true)}
                onMouseLeave={() => showModal(false)}
                onContextMenu={() => showMenu(true)}
                role="presentation"
                key={sqlId}
                className="card"
                style={{
                    width: realW,
                    height: realH,
                    opacity: isDragging ? 0.4 : 1,
                    transform: `translate(${x}px, ${y}px)`,
                }}
            >
                <div
                    className={`${itemId <= 16 || itemId === 54 || itemId === 59 ? 'svgImage' : 'pngImage'}`}
                    style={{
                        [(itemId > 16 && itemId !== 54 && itemId !== 59 ? 'backgroundImage' : 'WebkitMaskImage')]:
                        itemImage ? `url(${itemImage})` : '',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                    }}
                />
                <InventoryMergeLayer
                    key={sqlId}
                    id={sqlId}
                    type="mergeLayer"
                    index={sqlId}
                    inVehicle={!!inVehicle}
                />
            </div>
        </React.Fragment>

    )
}

export default InventoryItem