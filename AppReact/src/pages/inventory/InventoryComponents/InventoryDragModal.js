import React, { useEffect, useState } from 'react'
import { useDragLayer } from 'react-dnd'

const DragPreviewImage = props => {
    const [itemImage, setItemImage] = useState(null)
    const images = require.context('../../../assets/images/', true)

    const collectedProps = useDragLayer(monitor => {
        return {
            item: monitor.getItem(),
            currentOffset: monitor.getSourceClientOffset(),
            isDragging: monitor.isDragging(),
        }
    })
    const calculateScale = () => {
        const width = window.innerWidth
        const height = window.innerHeight
        const scaleX = width / 1920
        const scaleY = height / 1080
        const scale = (scaleX > scaleY) ? scaleX : scaleY
        return scale
    }
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

    const { isDragging, item, currentOffset } = collectedProps
    useEffect(() => {
        if (item) loadImage(item.itemId)
    }, [item])

    return (isDragging && currentOffset && item) && (
        <div
            className="dragPreviewItem"
            style={{
                width: (item.width * 40) * calculateScale(),
                height: (item.height * 40) * calculateScale(),
                left: currentOffset.x,
                top: currentOffset.y,
            }}
        >
            { itemImage
                 && <div
                     className={`${item.itemId <= 16 || item.itemId === 54 || item.itemId === 59 ? 'svgImage' : 'pngImage'}`}
                     style={{
                         [(item.itemId > 16 && item.itemId !== 54 && item.itemId !== 59 ? 'backgroundImage' : 'WebkitMaskImage')]: `url(${itemImage})`,
                         maxHeight: '80%',
                         maxWidth: '80%',
                         margin: '0 auto',
                         backgroundSize: 'contain',
                         backgroundRepeat: 'no-repeat',
                         backgroundPosition: 'center',
                     }}
                 />
            }
        </div>
    )
}
export default DragPreviewImage