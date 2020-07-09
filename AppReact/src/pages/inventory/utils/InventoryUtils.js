import _ from 'lodash'

export const invSettings = {
    weight: 0,
    maxWeight: 30,
}
export const setPropertyValueForCards = (groups, property, value) => {
    _.forEach(groups, (g, index) => {
        _.forEach(g.items, a => {
            a[property] = value
        })
    })
}
export const calColWidth = (containerWidth, col, containerPadding, margin) => {
    if (margin) {
        return (containerWidth - containerPadding[0] * 2 - margin[0] * (col + 1)) / col
    }
    return (containerWidth - containerPadding[0] * 2 - 0 * (col + 1)) / col
}
export const calColCount = (defaultCalWidth, containerWidth, containerPadding, margin) => {
    if (margin) {
        return Math.floor(
            (containerWidth - containerPadding[0] * 2 - margin[0])
            / (defaultCalWidth + margin[0]))
    }
}
export const layoutBottom = layout => {
    let max = 0
    let bottomY
    for (let i = 0, len = layout.length; i < len; i++) {
        bottomY = layout[i].gridY + layout[i].height
        if (bottomY > max) max = bottomY
    }
    return max
}
export const layoutHorizontalRowLength = layout => {
    let max = 0
    let rowX
    for (let i = 0, len = layout.length; i < len; i++) {
        rowX = layout[i].gridX + layout[i].width
        if (rowX > max) max = rowX
    }
    return max
}

export const calGridItemPosition = (gridX, gridY, margin, itemSize) => {
    const x = Math.round(gridX * itemSize + margin[0] * (gridX + 1))
    const y = Math.round(gridY * itemSize + margin[1] * (gridY + 1))
    return {
        x,
        y,
    }
}
export const checkInContainer = (_gridX, _gridY, groupW, groupH, card) => {
    let gridX = _gridX
    let gridY = _gridY
    if (_gridX + card.width > groupW - 1) gridX = groupW - card.width
    if (_gridX < 0) gridX = 0
    if (_gridY + card.height > groupH - 1) gridY = groupH - card.height
    if (_gridY < 0) gridY = 0
    return { gridX, gridY }
}
export const calGridXY = (x, y, card, margin, itemSize, groupW, groupH) => {
    const gridX = Math.floor(x / (itemSize * groupW + margin[0] * (groupW + 1)) * groupW)
    const gridY = Math.floor(y / (itemSize * groupH + margin[0] * (groupH + 1)) * groupH)
    return checkInContainer(gridX, gridY, groupW, groupH, card)
}
export const calWHtoPx = (w, h, margin, itemSize) => {
    const wPx = Math.round(w * itemSize + (w - 1) * margin[0])
    const hPx = Math.round(h * itemSize + (h - 1) * margin[1])
    return { wPx, hPx }
}
export const collision = (a, b) => {
    if (a.gridX === b.gridX && a.gridY === b.gridY && a.width === b.width && a.height === b.height) {
        return true
    }

    if (a.gridX + a.width <= b.gridX) return false
    if (a.gridX >= b.gridX + b.width) return false
    if (a.gridY + a.height <= b.gridY) return false
    if (a.gridY >= b.gridY + b.height) return false
    return true
}
export const isContainerItem = item => {
    const ids = [7, 8, 13]
    return ids.indexOf(item.itemId) !== -1
}

export const isPersonItem = item => {
    return item.itemId >= 0 && (item.itemId <= 16 || item.itemId === 54 || item.itemId === 59) && (item.parentId === -1 || !item.parentId)
}

export const indexToXY = (width, height, index) => {
    if (!width || !height) return null
    const gridX = index % width
    const gridY = (index - gridX) / width
    if (gridX >= width || gridY >= height) return null
    return {
        gridX,
        gridY,
    }
}

export const xyToIndex = (width, height, coord) => {
    if (!width || !height) return -1
    return coord.y * width + coord.x
}

export const getNameByFactionId = _id => {
    const names = ['City Hall', 'LSPD', 'BCSO', 'FIB', 'EMC', 'Fort Zancudo', 'Merryweather', 'Weazel News',
        'The Families', 'The Ballas Gang', 'Varios Los Aztecas Gang', 'Los Santos Vagos',
        'Marabunta Grande', 'Russian Mafia', 'Italian Mafia', 'Japanese Mafia', 'Mexican Mafia',
    ]
    const id = Math.clamp(_id, 1, names.length - 1)
    return names[id - 1]
}
export const getItemWH = (inv, item) => {
    const parentItem = _.find(inv, searchItem => searchItem.sqlId === item)
    if (parentItem) {
        return {
            width: parentItem.width,
            height: parentItem.height,
        }
    }
    return null
}
export const getFirstCollison = (items, item) => {
    for (let i = 0, { length } = items; i < length; i++) {
        if (collision(items[i], item)) {
            return items[i]
        }
    }
    return null
}
