import { forIn } from 'lodash'

export const popupSettings = () => {
    const itemMenus = {
        1: [],
        2: [],
        3: [],
        4: [{
            text: 'Split up',
            handler: sqlId => {
                window.inventoryAPI.show(false)
                window.modalAPI.show('item_split', JSON.stringify({
                    itemSqlId: sqlId,
                }))
            },
        }],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
        11: [],
        12: [],
        13: [],
        14: [],
        15: [],
        16: [{
            text: 'Look',
            handler: sqlId => {
                alt.emit('events.emitServer', 'showDocuments', sqlId)
            },
        }],
        17: [],
        18: [],
        19: [],
        20: [],
        21: [],
        22: [],
        23: [],
        24: [],
        25: [{
            text: 'Use',
            handler: sqlId => {
                alt.emit('events.emitServer', 'item.useHealth', sqlId)
            },
        }],
        26: [],
        27: [],
        28: [],
        29: [{
            text: 'Look',
            handler: sqlId => {
                alt.emit('events.emitServer', 'documents.showFaction', -1)
            },
        }],
        30: [{
            text: 'Drink',
            handler: sqlId => {
                alt.emit('events.emitServer', 'item.eat', sqlId)
            },
        }],
        31: [{
            text: 'Eat',
            handler: sqlId => {
                alt.emit('events.emitServer', 'item.eat', sqlId)
            },
        }],
        32: [{
            text: 'Eat',
            handler: sqlId => {
                alt.emit('events.emitServer', 'item.eat', sqlId)
            },
        }],
        33: [{
            text: 'Suck',
            handler: sqlId => {
                alt.emit('events.emitServer', 'item.eat', sqlId)
            },
        }],
        34: [{
            text: 'To get',
            handler: sqlId => {
                alt.emit('events.emitServer', 'item.takeSmoke', sqlId)
            },
        }],
        35: [{
            text: 'Drink',
            handler: sqlId => {
                alt.emit('events.emitServer', 'item.eat', sqlId)
            },
        }],
        36: [],
        37: [{
            text: 'Split up',
            handler: sqlId => {
                window.inventoryAPI.show(false)
                window.modalAPI.show('item_split', JSON.stringify({
                    itemSqlId: sqlId,
                }))
            },
        }],
        38: [{
            text: 'Split up',
            handler: sqlId => {
                window.inventoryAPI.show(false)
                window.modalAPI.show('item_split', JSON.stringify({
                    itemSqlId: sqlId,
                }))
            },
        }],
        39: [{
            text: 'Split up',
            handler: sqlId => {
                window.inventoryAPI.show(false)
                window.modalAPI.show('item_split', JSON.stringify({
                    itemSqlId: sqlId,
                }))
            },
        }],
        40: [{
            text: 'Split up',
            handler: sqlId => {
                window.inventoryAPI.show(false)
                window.modalAPI.show('item_split', JSON.stringify({
                    itemSqlId: sqlId,
                }))
            },
        }],
        41: [],
        42: [],
        43: [],
        44: [],
        45: [],
        46: [],
        47: [],
        48: [],
        49: [],
        50: [],
        51: [],
        52: [],
        53: [],
        54: [{
            text: 'Parking',
            handler: sqlId => {
                alt.emit('events.emitServer', 'item.parkCarByKeys', sqlId)
            },
        },
        {
            text: 'Doors',
            handler: sqlId => {
                alt.emit('events.emitServer', 'item.lockCarByKeys', sqlId)
            },
        },
        {
            text: 'Search',
            handler: sqlId => {
                alt.emit('events.emitServer', 'item.searchCarByKeys', sqlId)
            },
        },
        {
            text: 'Deliver',
            handler: sqlId => {
                const item = window.inventoryAPI.getItem(sqlId)
                if (!item) return alt.emit('nError', 'No keys found!')
                const { model } = item.params
                if (window.clientStorage.sqlId !== item.params.owner) {
                    return alt.emit('nError', `You are not the owner ${model}!`)
                }
                window.inventoryAPI.show(false)
                alt.emit('choiceMenu.show', 'accept_fix_car', sqlId)
            },
        },
        {
            text: 'To sell',
            handler: sqlId => {
                const item = window.inventoryAPI.getItem(sqlId)
                if (!item) return alt.emit('nError', 'No keys found!')
                const { model } = item.params
                if (window.clientStorage.sqlId !== item.params.owner) {
                    return alt.emit('nError', `You are not the owner ${model}!`)
                }
                window.inventoryAPI.show(false)
                window.modalAPI.show('sell_player_car', JSON.stringify({ sqlId }))
            },
        },
        ],
        55: [{
            text: 'To use',
            handler: sqlId => {
                alt.emit('events.emitServer', 'item.useDrugs', sqlId)
            },
        },
        {
            text: 'Split up',
            handler: sqlId => {
                window.inventoryAPI.show(false)
                window.modalAPI.show('item_split', JSON.stringify({
                    itemSqlId: sqlId,
                }))
            },
        },
        ],
        56: [{
            text: 'To use',
            handler: sqlId => {
                alt.emit('events.emitServer', 'item.useDrugs', sqlId)
            },
        },
        {
            text: 'Split up',
            handler: sqlId => {
                window.inventoryAPI.show(false)
                window.modalAPI.show('item_split', JSON.stringify({
                    itemSqlId: sqlId,
                }))
            },
        },
        ],
        57: [{
            text: 'To use',
            handler: sqlId => {
                alt.emit('events.emitServer', 'item.useDrugs', sqlId)
            },
        },
        {
            text: 'Split up',
            handler: sqlId => {
                window.inventoryAPI.show(false)
                window.modalAPI.show('item_split', JSON.stringify({
                    itemSqlId: sqlId,
                }))
            },
        },
        ],
        58: [{
            text: 'To use',
            handler: sqlId => {
                alt.emit('events.emitServer', 'item.useDrugs', sqlId)
            },
        },
        {
            text: 'Split up',
            handler: sqlId => {
                window.inventoryAPI.show(false)
                window.modalAPI.show('item_split', JSON.stringify({
                    itemSqlId: sqlId,
                }))
            },
        },
        ],
        59: [{
            text: 'Search',
            handler: sqlId => {
                alt.emit('events.emitServer', 'item.searchHouseByKeys', sqlId)
            },
        }],
        60: [{
            text: 'Look',
            handler: sqlId => {
                alt.emit('events.emitServer', 'documents.showFaction', -1)
            },
        }],
        61: [{
            text: 'Look',
            handler: sqlId => {
                alt.emit('events.emitServer', 'documents.showFaction', -1)
            },
        }],
        62: [{
            text: 'To smoke',
            handler: sqlId => {
                alt.emit('events.emitServer', 'item.useSmoke', sqlId)
            },
        }],
        63: [{
            text: 'Look',
            handler: sqlId => {
                alt.emit('events.emitServer', 'documents.showFaction', -1)
            },
        }],
        64: [{
            text: 'Look',
            handler: sqlId => {
                alt.emit('events.emitServer', 'documents.showFaction', -1)
            },
        }],
        65: [],
        66: [],
        67: [],
        68: [],
        69: [],
        70: [],
        71: [],
        72: [],
        73: [],
        74: [],
        75: [],
        76: [],
        77: [],
        78: [],
        79: [],
        80: [],
        81: [],
        82: [],
        83: [],
        84: [],
        85: [],
        86: [],
        87: [],
        88: [],
        89: [],
        90: [],
        91: [],
        92: [],
        93: [],
        94: [],
        95: [],
        96: [],
        97: [],
        98: [],
        99: [],
        100: [],
        101: [],
        102: [],
        103: [],
        104: [],
        105: [],
        106: [],
        107: [],
        108: [],
        109: [],
        110: [],
        111: [],
        112: [],
        113: [],
        114: [],
        115: [],
        116: [],
        117: [],
        118: [],
        119: [],
        120: [],
        121: [],
        122: [],
        123: [],
        124: [],
        125: [],
        126: [],
    }
    forIn(itemMenus, (value, key) => {
        itemMenus[key].push({
            text: 'Throw away',
            handler: sqlId => {
                alt.emit('events.emitServer', 'item.throw', sqlId)
            },
        })
    })
    delete itemMenus[4]
    return itemMenus
}
