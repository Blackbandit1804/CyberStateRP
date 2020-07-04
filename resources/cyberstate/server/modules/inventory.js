module.exports.Init = function() {
    alt.inventory = {};
    DB.Query("SELECT * FROM inventory_items", (e, result) => {
        for (var i = 0; i < result.length; i++) {
            result[i].sqlId = result[i].id;
            delete result[i].id;
            initItemUtils(result[i]);
        }
        alt.inventory.items = result;
        alt.log(`Предметы инвентаря загружены: ${i} шт.`);
    });
    // очищаем мусор
    DB.Query("DELETE FROM inventory_vehicles WHERE vehicleId=?", [-1]);
    DB.Query("DELETE FROM inventory_players WHERE playerId=?", [-1]);
    initInventoryUtils();
}
/* Доступные предметы для ячеек основного инвентаря. */
var mainItemIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 54, 59];
/* Черный список типов предметов для хранителей. */
var blackList = {
    7: [3, 7, 8, 9, 13], // топ
    8: [3, 7, 8, 9, 13], // брюки
    13: [13] // сумка
};
/* Предметы-хранители. */
var storageItemIds = [7, 8, 13];


function initItemUtils(item) {
    item.setName = (name) => {
        item.name = name;
        DB.Query("UPDATE inventory_items SET name=? WHERE id=?", [item.name, item.sqlId]);
    }
    item.setDescription = (description) => {
        item.description = description;
        DB.Query("UPDATE inventory_items SET description=? WHERE id=?", [item.description, item.sqlId]);
    }
    item.setWeight = (weight) => {
        item.weight = Math.clamp(weight, 0.01, 30);
        DB.Query("UPDATE inventory_items SET weight=? WHERE id=?", [item.weight, item.sqlId]);
    }
    item.setSize = (height, width) => {
        item.height = Math.clamp(height, 1, 10);
        item.width = Math.clamp(width, 1, 10);
        DB.Query("UPDATE inventory_items SET height=?,width=? WHERE id=?", [item.height, item.width, item.sqlId]);
    }
    item.setModel = (model) => {
        item.model = model;
        DB.Query("UPDATE inventory_items SET model=? WHERE id=?", [item.model, item.sqlId]);
    }
    item.setDeltaZ = (deltaZ) => {
        item.deltaZ = deltaZ;
        DB.Query("UPDATE inventory_items SET deltaZ=? WHERE id=?", [item.deltaZ, item.sqlId]);
    }
    item.setRotation = (x, y) => {
        item.rX = x;
        item.rY = y;
        DB.Query("UPDATE inventory_items SET rX=?,rY=? WHERE id=?", [item.rX, item.rY, item.sqlId]);
    }
}

function initInventoryUtils() {
    alt.inventory.getItem = (itemId) => {
        for (var i = 0; i < alt.inventory.items.length; i++)
            if (alt.inventory.items[i].sqlId == itemId) return alt.inventory.items[i];
        return null;
    }
    alt.inventory.indexToXY = (rows, cols, index) => {
        //debug(`inv.indexToXY`)
        if (!rows || !cols) return null;
        var x = index % cols;
        var y = (index - x) / cols;
        if (x >= cols || y >= rows) return null;
        return {
            x: x,
            y: y
        };
    }
    alt.inventory.xyToIndex = (rows, cols, coord) => {
        //debug(`xyToIndex: ${rows} ${cols} ${JSON.stringify(coord)}`)
        if (!rows || !cols) return -1;
        return coord.y * cols + coord.x;
    }
    alt.inventory.genMatrix = (parent, ignoreItems = {}) => {
        //debug(`genMatrix`)
        if (!parent.items || !parent.params.rows || !parent.params.cols) return null;
        var matrix = [];
        /* Создаем пустую матрицу. */
        for (var i = 0; i < parent.params.cols; i++) {
            matrix[i] = [];
            for (var j = 0; j < parent.params.rows; j++) {
                matrix[i][j] = 0;
            }
        }
        //console.log(`MATRIX1 ${JSON.stringify(matrix)}`)
        /* Наполняем матрицу занятами ячейками. */
        for (var id in parent.items) {
            var coord = alt.inventory.indexToXY(parent.params.rows, parent.params.cols, parent.items[id].index);
            if (coord && !ignoreItems[id]) {
                matrix[coord.x][coord.y] = 1;
                var info = alt.inventory.getItem(parent.items[id].itemId);
                //console.log(`MATRIX3 ${JSON.stringify(info)}`)
                if (info) {
                    for (var i = 0; i < info.height; i++) {
                        //console.log(`MATRIX2 ${JSON.stringify(info)}`)
                        for (var j = 0; j < info.width; j++) {
                            //console.log(`MATRIX2 ${JSON.stringify(info)}`)
                            matrix[coord.x + j][coord.y + i] = 1;
                        }
                    }
                }
            }
        }

        //console.log(JSON.stringify(matrix))

        return matrix;
    }
    alt.inventory.findFreeIndexMatrix = (matrix, itemId) => {
        //debug(`findFreeIndexMatrix`)
        var info = alt.inventory.getItem(itemId);
        if (!info || !matrix) return -1;
        var w = info.width;
        var h = info.height;

        for (var i = 0; i < matrix.length - w + 1; i++) {
            for (var j = 0; j < matrix[i].length - h + 1; j++) {
                var doBreak = false;
                for (var x = 0; x < w; x++) {
                    for (var y = 0; y < h; y++) {
                        if (matrix[i + x][j + y] == 1) {
                            doBreak = true;
                            break;
                        }
                    }
                    if (doBreak) break;
                }
                if (!doBreak) return alt.inventory.xyToIndex(matrix[0].length, matrix.length, {
                    x: i,
                    y: j
                });
                //if (!doBreak) alt.log({x: j, y: i});
            }
        }

        return -1;
    }
    alt.inventory.itemsToItemIds = (items) => {
        var itemIds = [];
        for (var sqlId in items) {
            itemIds.push(items[sqlId].itemId);
        }
        return itemIds;
    }
    alt.inventory.isAvailable = (itemId, parentItemId) => {
        if (!blackList[parentItemId]) return true;
        var index = blackList[parentItemId].indexOf(itemId);
        return index == -1;
    }
}

global.initPlayerInventory = function(player) {
    //debug(`initPlayerInventory: ${player.getSyncedMeta("name")}`);
    player.inventory = {};
    player.inventory.ground = [];

    /* Поиск предмета по его sqlId. */
    player.inventory.getItem = (sqlId) => {
        return findItemBySqlId(sqlId, player.inventory.items);
    };
    player.inventory.getItemKey = (sqlId) => {
        return findItemByCarId(sqlId, player.inventory.items);
    };
    player.inventory.getArrayByItemId = (itemIds) => {
        if (!Array.isArray(itemIds)) itemIds = [itemIds]; //если одно число
        return findArrayItemByItemId(itemIds, player.inventory.items);
    };
    player.inventory.getArrayWeapons = () => {
        //debug(`player.inventory.getArrayWeapons called`);
        return findArrayWeapons(player.inventory.items);
    };
    /* Добавляет в инвентарь новый предмет. */
    player.inventory.add = (itemId, params, items, callback = () => {}, dontTouchHandlers) => {
        //debug(`inventory.add: ${itemId} ${params} ${items}`);
        if (!alt.inventory.getItem(itemId)) return callback(`Неверный ITEM ID: ${itemId} предмета!`);
        var freeSlot = player.inventory.findFreeSlot(itemId);
        if (!freeSlot) return callback(`Свободный слот для предмета не найден! Предмет: ${alt.inventory.getItem(itemId).name}`);
        if (itemId == 24 || itemId == 25) {
            if (Object.keys(player.inventory.getArrayByItemId(itemId)).length >= 3) return player.utils.error(`Вы имеете максимальное количество!`);
        }
        //debug(`Свободный слот: ${JSON.stringify(freeSlot)}`) // неверный freeSlot.parentSqlId - bug #42

        var weight = player.inventory.getCommonWeight();
        if (weight + alt.inventory.items[itemId - 1].weight > Config.maxInventoryWeight) return callback("Недостаточно выносливости!");

        if (freeSlot.parentSqlId == -1) player.body.updateView(itemId, params);
        
        var item = {
            itemId: itemId,
            index: freeSlot.freeIndex,
            params: params,
            parentId: freeSlot.parentSqlId,
        }

        if (params.rows && params.cols) item.items = items || {};

        if (item.params.weaponHash) {
            var alreadyExists = Object.keys(player.inventory.getArrayByItemId(item.itemId)).length > 0;
            if (alreadyExists) return callback(`Оружие ${alt.inventory.getItem(item.itemId).name} уже имеется!`);
            //debug(`${JSON.stringify(item)}`)
            player.utils.giveWeapon(item);
        }

        if (item.parentId == -1 || !item.parentId) player.inventory.items[item.index] = item;
        else {
            var parentItem = player.inventory.getItem(freeSlot.parentSqlId);
            if (!parentItem) return callback(`Контейнер для предмета не найден! (обр. к разработчику)!`);
            player.inventory.items[parentItem.index].items[item.index] = item;
        }

        var handlers = {
            4: (params) => { // money
                player.utils.setMoney(player.money + params.count, true);
            },
        };
        if (!dontTouchHandlers) {
            if (handlers[itemId]) handlers[itemId](params);
        }
        if (item.items) {
            for (var key in item.items) {
                var child = item.items[key];
                if (handlers[child.itemId]) handlers[child.itemId](child.params);
                if (child.items) {
                    for (var key2 in child.items) {
                        var child3 = child.items[key2];
                        if (handlers[child3.itemId]) handlers[child3.itemId](child3.params);
                        if (child3.items) {
                            for (var key3 in child3.items) {
                                var child4 = child3.items[key3];
                                if (handlers[child4.itemId]) handlers[child4.itemId](child4.params);
                            }
                        }
                    }
                }
            }
        }

        player.waitOperation = true;
        DB.Query("INSERT INTO inventory_players (playerId,itemId,`index`,parentId,params) VALUES (?,?,?,?,?)",
            [player.sqlId, item.itemId, item.index, item.parentId, JSON.stringify(item.params)], (e, result) => {
                delete player.waitOperation;
                if (e) {
                    callback("Ошибка выполнения запроса в БД!");
                    return terminal.error(e);
                }

                item.id = result.insertId;
                item.sqlId = result.insertId;

                var data = {};
                data[item.id] = item;
                //debug(`TEST555: ${JSON.stringify(data)}`);
                alt.emitClient(player, "inventory.add", JSON.stringify(data));
                if (callback) callback();
            });
    };
    player.inventory.addToItem = (item, parentSqlId, index, callback = () => {}, dontTouchHandlers) => {
        //debug(`inventory.addToItem: ${JSON.stringify(item)} ${parentSqlId} ${index}`);

        var weight = player.inventory.getCommonWeight();
        if (weight + alt.inventory.items[item.itemId - 1].weight > Config.maxInventoryWeight) return callback("Недостаточно выносливости!");

        item.index = index;
        item.parentId = parentSqlId;
        
        if (item.params.weaponHash) {
            var alreadyExists = Object.keys(player.inventory.getArrayByItemId(item.itemId)).length > 0;
            if (alreadyExists) return callback(`Оружие ${alt.inventory.getItem(item.itemId).name} уже имеется!`);
            //debug(`${JSON.stringify(item)}`)
            player.utils.giveWeapon(item);
        }

        player.waitOperation = true;

        var handlers = {
            4: (params) => { // money
                player.utils.setMoney(player.money + params.count, true);
            },
        };
        if (!dontTouchHandlers) {
            if (handlers[item.itemId]) handlers[item.itemId](item.params);
        }
        if (item.items) {
            for (var key in item.items) {
                var child = item.items[key];
                if (handlers[child.itemId]) handlers[child.itemId](child.params);
                if (child.items) {
                    for (var key2 in child.items) {
                        var child3 = child.items[key2];
                        if (handlers[child3.itemId]) handlers[child3.itemId](child3.params);
                        if (child3.items) {
                            for (var key3 in child3.items) {
                                var child4 = child3.items[key3];
                                if (handlers[child4.itemId]) handlers[child4.itemId](child4.params);
                            }
                        }
                    }
                }
            }
        }

        DB.Query("INSERT INTO inventory_players (playerId,itemId,`index`,parentId,params) VALUES (?,?,?,?,?)",
            [player.sqlId, item.itemId, item.index, item.parentId, JSON.stringify(item.params)], (e, result) => {
                delete player.waitOperation;
                if (e) {
                    callback("Ошибка выполнения запроса в БД!");
                    return terminal.error(e);
                }
                
                item.id = result.insertId;
                item.sqlId = result.insertId;

                var parentItem = player.inventory.getItem(item.parentId);
                if (!parentItem) return callback(`Контейнер для предмета не найден! (обр. к разработчику)!`);
                player.inventory.items[parentItem.index].items[item.index] = item;

                var data = {};
                data[item.id] = item;

                alt.emitClient(player, "inventory.add", JSON.stringify(data));

                callback(null, result.insertId);
            });
    };
    /* Добавляет в инвентарь предмет, который уже имеет sqlId. */
    player.inventory.addOld = (sqlId, item, callback = () => {}, dontTouchHandlers) => {
        //debug(`inventory.addOld: ${sqlId} ${JSON.stringify(item)}`);
        if (!alt.inventory.getItem(item.itemId)) return callback("Неверный ID предмета!");
        var freeSlot = player.inventory.findFreeSlot(item.itemId);
        if (!freeSlot) return callback("Свободный слот для предмета не найден!");
        var weight = player.inventory.getCommonWeight();
        if (weight + alt.inventory.items[item.itemId - 1].weight > Config.maxInventoryWeight) return callback("Недостаточно выносливости!");

        item.index = freeSlot.freeIndex;
        item.parentId = freeSlot.parentSqlId;

        if (item.params.weaponHash) {
            var alreadyExists = Object.keys(player.inventory.getArrayByItemId(item.itemId)).length > 0;
            if (alreadyExists) return callback(`Оружие ${alt.inventory.getItem(item.itemId).name} уже имеется!`);
            //debug(`${JSON.stringify(item)}`)
            player.utils.giveWeapon(item);
        }

        if (item.parentId == -1 || !item.parentId) {
            player.inventory.items[item.index] = item;
            player.body.updateView(item.itemId, item.params);
        } else {
            var parentItem = player.inventory.getItem(freeSlot.parentSqlId);
            if (!parentItem) return callback(`Контейнер для предмета не найден! (обр. к разработчику)!`);
            player.inventory.items[parentItem.index].items[item.index] = item;
        }

        var handlers = {
            4: (params) => { // money
                player.utils.setMoney(player.money + params.count, true);
            },
        };
        if (!dontTouchHandlers) {
            if (handlers[item.itemId]) handlers[item.itemId](item.params);
        }
        if (item.items) {
            for (var key in item.items) {
                var child = item.items[key];
                if (handlers[child.itemId]) handlers[child.itemId](child.params);
                if (child.params.weaponHash) {
                    var alreadyExists = Object.keys(player.inventory.getArrayByItemId(child.itemId)).length > 0;
                    // TODO: Придумать что-то с проверкой этой.
                    // if (alreadyExists) return callback(`Оружие ${alt.inventory.getItem(child.itemId).name} уже имеется!`);
                    //debug(`${JSON.stringify(child)}`)
                    player.utils.giveWeapon(child);
                }
                if (child.items) {
                    for (var key2 in child.items) {
                        var child2 = child.items[key2];
                        if (handlers[child2.itemId]) handlers[child2.itemId](child2.params);
                        if (child2.params.weaponHash) {
                            var alreadyExists = Object.keys(player.inventory.getArrayByItemId(child2.itemId)).length > 0;
                            // TODO: Придумать что-то с проверкой этой.
                            // if (alreadyExists) return callback(`Оружие ${alt.inventory.getItem(child2.itemId).name} уже имеется!`);
                            //debug(`${JSON.stringify(child2)}`)
                            player.utils.giveWeapon(child2);
                        }
                        if (child2.items) {
                            for (var key3 in chil2.items) {
                                var child3 = chil2.items[key3];
                                if (handlers[child3.itemId]) handlers[child3.itemId](child3.params);
                            }
                        }
                    }
                }
            }
        }

        player.waitOperation = true;
        DB.Query("UPDATE inventory_players SET playerId=?,`index`=?,parentId=? WHERE id=?",
        [player.sqlId, freeSlot.freeIndex, freeSlot.parentSqlId, sqlId], (e, result) => {
            delete player.waitOperation;
            if (e) {
                callback("Ошибка выполнения запроса в БД!");
                return terminal.error(e);
            }

            var data = {};
            data[sqlId] = item;
            alt.emitClient(player, "inventory.add", JSON.stringify(data));
    
            if (callback) callback();
        });

        if (item.items) {
            for (var key in item.items) {
                DB.Query("UPDATE inventory_players SET playerId=? WHERE parentId=?",
                [player.sqlId, item.items[key].parentId], (e, result) => {
                    if (e) return terminal.error(e);
                });
            }
        }
    };
    /* Поиск свободного слота у игрока для предмета. */
    player.inventory.findFreeSlot = (itemId) => {
        //debug(`findFreeSlot: ${itemId}`);
        var info = alt.inventory.getItem(itemId);
        if (!info) return null;

        if (mainItemIds.indexOf(itemId) != -1) {
            var isFind = false;
            for (var key in player.inventory.items) {
                var item = player.inventory.items[key];
                if (item.index == mainItemIds.indexOf(itemId)) {
                    isFind = true;
                    break;
                }
            }
            if (!isFind) return {
                parentSqlId: -1,
                freeIndex: mainItemIds.indexOf(itemId)
            };
        }

        for (var key in player.inventory.items) {
            var parent = player.inventory.items[key];
            //debug(JSON.stringify(parent));
            var isAvailable = alt.inventory.isAvailable(itemId, parent.itemId);
            if (storageItemIds.indexOf(parent.itemId) == -1) delete parent.items;
            if (parent.items && parent.params.rows && parent.params.cols && isAvailable) {
                var matrix = alt.inventory.genMatrix(parent);
                if (!matrix) continue;

                //alt.log(`matrix`)
                //alt.log(matrix)

                var freeIndex = alt.inventory.findFreeIndexMatrix(matrix, itemId);
                if (freeIndex != -1 && parent.id) return {
                    parentSqlId: parent.id,
                    freeIndex: freeIndex
                }; //невеный key - bug #42
            }
        }

        return null;
    };
    /* Поиск  свободноых слотов у игрока для предметов. */
    player.inventory.findFreeSlots = (itemIds, ignoreItems) => {
        //debug(`player.inventory.findFreeSlots: ${itemIds} ${ignoreItems}`);
        var freeSlots = [];
        for (var key in player.inventory.items) {
            var parent = player.inventory.items[key];
            if (storageItemIds.indexOf(parent.itemId) == -1) delete parent.items;
            if (parent.items && parent.params.rows && parent.params.cols) {
                var matrix = alt.inventory.genMatrix(parent, ignoreItems);
                if (!matrix) continue;
                //alt.log(`matrix`)
                //alt.log(matrix)

                itemIds.forEach((itemId) => {
                    var freeIndex = alt.inventory.findFreeIndexMatrix(matrix, itemId);
                    var isAvailable = alt.inventory.isAvailable(itemId, parent.itemId);
                    if (freeIndex != -1 && isAvailable) {
                        freeSlots.push({
                            parentSqlId: parent.id,
                            freeIndex: freeIndex
                        });
                        //fill matrix
                        var coord = alt.inventory.indexToXY(matrix.length, matrix[0].length, freeIndex);
                        //debug(`coods: ${JSON.stringify(coord)}`);
                        matrix[coord.y][coord.x] = 1;
                        var info = alt.inventory.getItem(itemId);
                        if (info) {
                            for (var i = 0; i < info.width; i++) {
                                for (var j = 0; j < info.height; j++) {
                                    matrix[coord.y + j][coord.x + i] = 1;
                                }
                            }
                        }
                    }
                });
                if (freeSlots.length == itemIds.length) break;
            }
        }
        //debug(`freeSlots: ${JSON.stringify(freeSlots)}`);
        return freeSlots;
    };
    /* Удаление предмета у игрока. */
    player.inventory.delete = (sqlId, callback = () => {}, dontTouchHandlers) => {
        //debug(`player.inventory.delete: ${sqlId}`)
        var item = player.inventory.getItem(sqlId);
        if (!item) {
            alt.emitClient(player, "inventory.delete", sqlId);
            return callback("Предмет не найден!");
        }

        //debug(`iitem: ${JSON.stringify(item)}`)

        var handlers = {
            4: (params) => { // money
                player.utils.setMoney(player.money - params.count, true);
            },
        };
        if (!dontTouchHandlers) {
            if (handlers[item.itemId]) handlers[item.itemId](item.params);
        }
        if (item.params.weaponHash) {
            alt.emitClient(player, `addWeaponAmmo`, item.params.weaponHash, 0);
            player.removeWeapon(item.params.weaponHash);
        }
        if (item.items) {
            for (var key in item.items) {
                var child = item.items[key];
                if (child.params.weaponHash) {
                    alt.emitClient(player, `addWeaponAmmo`, child.params.weaponHash, 0);
                    player.removeWeapon(child.params.weaponHash);
                }
                if (handlers[child.itemId]) handlers[child.itemId](child.params);
                if (child.items) {
                    for (var key2 in child.items) {
                        var child2 = child.items[key2];
                        if (child2.params.weaponHash) {
                            alt.emitClient(player, `addWeaponAmmo`, child2.params.weaponHash, 0);
                            player.removeWeapon(child2.params.weaponHash);
                        }
                        if (handlers[child2.itemId]) handlers[child2.itemId](child2.params);
                        if (child2.items) {
                            for (var key3 in child2.items) { 
                                var child3 = child2.items[key3];
                                if (child3.params.weaponHash) {
                                    alt.emitClient(player, `addWeaponAmmo`, child3.params.weaponHash, 0);
                                    player.removeWeapon(child3.params.weaponHash);
                                }
                                if (handlers[child3.itemId]) handlers[child3.itemId](child3.params);
                            }
                        }
                    }
                }
            }
        }

        if (item.parentId == -1 || !item.parentId) {
            player.body.updateView(item.itemId, null);
            delete player.inventory.items[item.index];
        } else {
            var parentItem = player.inventory.getItem(item.parentId);
            delete parentItem.items[item.index];
        }

        DB.Query("UPDATE inventory_players SET playerId=? WHERE id=?", [-1, sqlId]);
        
        if (item.items) {
            for (var key in item.items) {
                DB.Query("UPDATE inventory_players SET playerId=? WHERE parentId=?", [-1, sqlId]);
            }
        }

        alt.emitClient(player, "inventory.delete", sqlId);
        
        if (callback) callback();
    };
    /* Обновление позиции предмета. */
    player.inventory.updatePos = (sqlId, parentSqlId, index, callback) => {
        //debug(`updatePos: ${sqlId} ${parentSqlId} ${index}`)
        var item = player.inventory.getItem(sqlId);
        if (!item) {
            alt.emitClient(player, "inventory.delete", sqlId);
            return callback("Предмет не найден!");
        }
        var parentItem = player.inventory.getItem(item.parentId);
        DB.Query("UPDATE inventory_players SET parentId=?,`index`=? WHERE id=?", [parentSqlId, index, sqlId], (e) => {
            if (e) alt.log(e);
        });
        if (item.parentId != parentSqlId) {
            if (!parentSqlId || parentSqlId == -1) player.body.updateView(item.itemId, item.params);
            else player.body.updateView(item.itemId, null);
        }

        if (parentSqlId == -1 || !parentSqlId) {
            if (parentItem) delete parentItem.items[item.index];
            player.inventory.items[index] = item;
        } else {
            if (parentItem) delete parentItem.items[item.index];
            if (item.parentId != parentSqlId) {
                var newParentItem = player.inventory.getItem(parentSqlId);
                newParentItem.items[index] = item;
                if (!item.parentId || item.parentId == -1) delete player.inventory.items[item.index];
            } else {
                parentItem.items[index] = item;
            }
        }

        item.parentId = parentSqlId;
        if (item.parentId == -1 || !item.parentId) delete item.parentId;
        item.index = index;
    };
    /* Обновление параметров предмета. */
    player.inventory.updateParams = (sqlId, item) => {
        //debug(`player.inv.updateParams: ${sqlId} ${JSON.stringify(item)}`);
        alt.emitClient(player, "inventory.updateParams", sqlId, item.params);
        DB.Query("UPDATE inventory_players SET params=? WHERE id=?", [JSON.stringify(item.params), sqlId]);
    };
    /* Обмен предметами между двумя игроками. */
    player.inventory.swapItems = (recipientId, playerItems, recipientItems, playerSlots, recipientSlots) => {
        var recipient = alt.Player.getBySqlId(recipientId);
        if (!recipient) return terminal.error(`player.inventory.swapItems: второй игрок с ID: ${recipientId} не найден!`);
        for (var key in playerItems) {
            var item = playerItems[key];
            player.inventory.delete(item.id, (e) => {
                if (e) return player.utils.error(e);
                recipient.inventory.addOld(item.id, item);
            });
        }
        for (var key in recipientItems) {
            var item = recipientItems[key];
            recipient.inventory.delete(item.id, (e) => {
                if (e) return recipient.utils.error(e);
                player.inventory.addOld(item.id, item, (e) => {if (e) return recipient.utils.error(e);});
            });
        }
    };
    /* Получить вес предмета. */
    player.inventory.getWeight = (sqlId) => {
        return getWeightItemBySqlId(sqlId, player.inventory.items);
    };
    /* Получить общий вес всех предметов игрока. */
    player.inventory.getCommonWeight = () => {
        var weight = 0;
        for (var key in player.inventory.items) {
            var item = player.inventory.items[key];
            weight += player.inventory.getWeight(item.id);
        }
        return weight;
    };
    /* Загрузка оружия у игрока на основе предметов-оружия в инвентаре. */
    player.inventory.loadWeapons = () => {
        var weapons = player.inventory.getArrayWeapons();
        //debug(`loadWeapons: ${JSON.stringify(weapons)}`);
        for (var key in weapons) {
            var item = weapons[key];
            if (!item.params.weaponHash) continue;
            player.utils.giveWeapon(item);
        }
    };
    /* Удаление предметов по параметрам. */
    player.inventory.deleteByParams = (itemId, keys, values, callback) => {
        //debug(`deleteByParams: ${player.getSyncedMeta("name")} ${itemId} ${keys} ${values}`);
        if (!callback) callback = (e) => {
            if (e) terminal.error(e);
        };
        if (keys.length != values.length) return callback(`Количество ключей и значений параметров предмета не совпадает!<br/>${player.getSyncedMeta("name")}<br/>keys: ${keys}<br/>values: ${values}`);
        var items = player.inventory.getArrayByItemId(itemId);
        if (Object.keys(items).length == 0) return;
        for (var key in items) {
            var item = items[key];
            var doDelete = true;
            for (var i = 0; i < keys.length; i++) {
                var param = item.params[keys[i]];
                if (!param) {
                    doDelete = false;
                    break;
                }
                if (param && param != values[i]) {
                    doDelete = false;
                    break;
                }
            }
            if (doDelete) player.inventory.delete(item.id);
        }
        if (callback) callback();
    };

    DB.Query("SELECT * FROM inventory_players WHERE playerId=? ORDER BY parentId", [player.sqlId], (e, result) => {
        player.inventory.items = {};

        for (var i = 0; i < result.length; i++) {
            result[i].params = JSON.parse(result[i].params);
            if (result[i].params.rows && result[i].params.cols && !result[i].items) result[i].items = {};
        }

        for (var i = 0; i < result.length; i++) {
            result[i].sqlId = result[i].id;
            if (result[i].parentId == -1 || !result[i].parentId) {
                delete result[i].parentId;
            } else {
                for (var j = 0; j < result.length; j++) {
                    if (result[j].id == result[i].parentId) {
                        result[j].items[result[i].index] = result[i];
                        break;
                    }
                }
            }
        }

        for (var i = 0; i < result.length; i++) {
            if (!result[i].parentId) {
                player.inventory.items[result[i].index] = result[i];
            }

            delete result[i].playerId;
        }

        alt.emitClient(player, `inventory.add`, JSON.stringify(player.inventory.items));

        player.body.loadItems();
        player.inventory.loadWeapons();
    });
}

global.initVehicleInventory = function(vehicle) {
    //debug(`initVehicleInventory: ${vehicle.name}`);
    vehicle.inventory = {};

    /* Поиск предмета по его sqlId. */
    vehicle.inventory.getItem = (sqlId) => {
        return findItemBySqlId(sqlId, vehicle.inventory.items);
    };
    vehicle.inventory.getArrayByItemId = (itemIds) => {
        if (!Array.isArray(itemIds)) itemIds = [itemIds]; //если одно число
        return findArrayItemByItemId(itemIds, vehicle.inventory.items);
    };
    /* Добавляет в инвентарь новый предмет. */
    vehicle.inventory.add = (itemId, params, items, callback = () => {}, dontTouchHandlers, index = -1) => {
        if (!alt.inventory.getItem(itemId)) return callback(`Неверный ITEM ID: ${itemId} предмета!`);

        var freeSlot = { parentSqlId: -1, freeIndex: index };

        if (index == -1) return callback(`Свободный слот для предмета не найден! Предмет: ${alt.inventory.getItem(itemId).name}`);

        var weight = vehicle.inventory.getCommonWeight();
        if (weight + alt.inventory.items[itemId - 1].weight > Config.maxVehInventoryWeight) return callback("Недостаточно грузоподъемности!");

        var item = {
            id: 0,
            itemId: itemId,
            index: freeSlot.freeIndex,
            params: params,
            parentId: freeSlot.parentSqlId,
        }

        //debug(`${JSON.stringify(item)}`)

        vehicle.waitOperation = true;

        if (item.parentId == -1 || !item.parentId) vehicle.inventory.items[item.index] = item;

        var handlers = {};

        if (!dontTouchHandlers) {
            if (handlers[itemId]) handlers[itemId](params);
        }

        if (item.items) {
            for (var key in item.items) {
                var child = item.items[key];
                if (handlers[child.itemId]) handlers[child.itemId](child.params);
                if (child.items) {
                    for (var key2 in child.items) {
                        var child3 = child.items[key2];
                        if (handlers[child3.itemId]) handlers[child3.itemId](child3.params);
                        if (child3.items) {
                            for (var key3 in child3.items) {
                                var child4 = child3.items[key3];
                                if (handlers[child4.itemId]) handlers[child4.itemId](child4.params);
                            }
                        }
                    }
                }
            }
        }

        DB.Query("INSERT INTO inventory_vehicles (vehicleId,itemId,`index`,parentId,params) VALUES (?,?,?,?,?)",
        [vehicle.sqlId, item.itemId, item.index, item.parentId, JSON.stringify(item.params)], (e, result) => {
            if (e) { callback("Ошибка выполнения запроса в БД!"); return terminal.error(e); }

            delete vehicle.waitOperation;

            item.id = result.insertId;
            item.sqlId = result.insertId;

            if (item.parentId == -1) delete item.parentId;

            var data = {};
            data[item.id] = item;

            //console.log(vehicle.bootPlayerId);

            if (vehicle.bootPlayerId != null) {
                var player = alt.Player.getBySqlId(vehicle.bootPlayerId);
                if (player) alt.emitClient(player, "inventory.vehAdd", JSON.stringify(data));
            }

            callback(null, result.insertId);
        });
    };

    /* Добавляет в инвентарь предмет, который уже имеет sqlId. */
    vehicle.inventory.addOld = (sqlId, item, callback = () => {}, dontTouchHandlers) => {
        //debug(`inventory.addOld: ${sqlId} ${item}`);
        if (!alt.inventory.getItem(item.itemId)) return callback("Неверный ID предмета!");
        var freeSlot = vehicle.inventory.findFreeSlot(item.itemId);
        if (!freeSlot) return callback("Свободный слот для предмета не найден!");
        var weight = vehicle.inventory.getCommonWeight();
        if (weight + alt.inventory.items[item.itemId - 1].weight > Config.maxVehInventoryWeight) return callback("Недостаточно грузоподъемности!");

        item.index = freeSlot.freeIndex;
        item.parentId = freeSlot.parentSqlId;

        if (item.parentId == -1 || !item.parentId) vehicle.inventory.items[item.index] = item;
        else vehicle.inventory.items[freeSlot.parentSqlId].items[item.index] = item;

        var data = {};
        data[sqlId] = item;

        var handlers = {};

        if (!dontTouchHandlers) {
            if (handlers[item.itemId]) handlers[item.itemId](item.params);
        }
        if (item.items) {
            for (var key in item.items) {
                var child = item.items[key];
                if (handlers[child.itemId]) handlers[child.itemId](child.params);
                if (child.items) {
                    for (var key2 in child.items) {
                        var child2 = child.items[key2];
                        if (handlers[child2.itemId]) handlers[child2.itemId](child2.params);
                        if (child2.items) {
                            for (var key3 in chil2.items) {
                                var child3 = chil2.items[key3];
                                if (handlers[child3.itemId]) handlers[child3.itemId](child3.params);
                            }
                        }
                    }
                }
            }
        }

        DB.Query("UPDATE inventory_vehicles SET vehicleId=?,`index`=?,parentId=? WHERE id=?",
        [vehicle.sqlId, freeSlot.freeIndex, freeSlot.parentSqlId, sqlId], (e, result) => {
            if (e) {
                callback("Ошибка выполнения запроса в БД!");
                return terminal.error(e);
            }
            if (callback) callback();
        });
    };
    /* Поиск свободного слота у игрока для предмета. */
    vehicle.inventory.findFreeSlot = (itemId) => {
        //debug(`findFreeSlot: ${itemId}`);
        var info = alt.inventory.getItem(itemId);
        if (!info) return null;

        if (mainItemIds.indexOf(itemId) != -1) {
            var isFind = false;
            for (var key in vehicle.inventory.items) {
                var item = vehicle.inventory.items[key];
                if (item.index == mainItemIds.indexOf(itemId)) {
                    isFind = true;
                    break;
                }
            }
            if (!isFind) return {
                parentSqlId: -1,
                freeIndex: mainItemIds.indexOf(itemId)
            };
        }

        for (var key in vehicle.inventory.items) {
            var parent = vehicle.inventory.items[key];
            //debug(JSON.stringify(parent));
            var isAvailable = alt.inventory.isAvailable(itemId, parent.itemId);
            if (storageItemIds.indexOf(parent.itemId) == -1) delete parent.items;
            if (parent.items && parent.params.rows && parent.params.cols && isAvailable) {
                var matrix = alt.inventory.genMatrix(parent);
                if (!matrix) continue;

                //alt.log(`matrix`)
                //alt.log(matrix)

                var freeIndex = alt.inventory.findFreeIndexMatrix(matrix, itemId);
                if (freeIndex != -1) return {
                    parentSqlId: key,
                    freeIndex: freeIndex
                }; //невеный key - bug #42
            }
        }

        return null;
    };
    /* Поиск  свободноых слотов у игрока для предметов. */
    vehicle.inventory.findFreeSlots = (itemIds, ignoreItems) => {
        //debug(`vehicle.inventory.findFreeSlots: ${itemIds} ${ignoreItems}`);
        var freeSlots = [];
        for (var key in vehicle.inventory.items) {
            var parent = vehicle.inventory.items[key];
            if (storageItemIds.indexOf(parent.itemId) == -1) delete parent.items;
            if (parent.items && parent.params.rows && parent.params.cols) {
                var matrix = alt.inventory.genMatrix(parent, ignoreItems);
                if (!matrix) continue;
                //alt.log(`matrix`)
                //alt.log(matrix)

                itemIds.forEach((itemId) => {
                    var freeIndex = alt.inventory.findFreeIndexMatrix(matrix, itemId);
                    var isAvailable = alt.inventory.isAvailable(itemId, parent.itemId);
                    if (freeIndex != -1 && isAvailable) {
                        freeSlots.push({
                            parentSqlId: key,
                            freeIndex: freeIndex
                        });
                        //fill matrix
                        var coord = alt.inventory.indexToXY(matrix.length, matrix[0].length, freeIndex);
                        //debug(`coods: ${JSON.stringify(coord)}`);
                        matrix[coord.y][coord.x] = 1;
                        var info = alt.inventory.getItem(itemId);
                        if (info) {
                            for (var i = 0; i < info.width; i++) {
                                for (var j = 0; j < info.height; j++) {
                                    matrix[coord.y + j][coord.x + i] = 1;
                                }
                            }
                        }
                    }
                });
                if (freeSlots.length == itemIds.length) break;
            }
        }
        //debug(`freeSlots: ${JSON.stringify(freeSlots)}`);
        return freeSlots;
    };
    /* Удаление предмета у игрока. */
    vehicle.inventory.delete = (sqlId, callback = () => {}, dontTouchHandlers) => {
        //debug(`player.inventory.delete: ${sqlId}`)
        var item = vehicle.inventory.getItem(sqlId);
        if (!item) {
            if (vehicle.bootPlayerId != null) {
                var player = alt.Player.getBySqlId(vehicle.bootPlayerId);
                if (player) alt.emitClient(player, "inventory.vehDelete", sqlId);
            }
            return callback("Предмет не найден!");
        }

        var handlers = {};

        if (!dontTouchHandlers) {
            if (handlers[item.itemId]) handlers[item.itemId](item.params);
        }
        if (item.items) {
            for (var key in item.items) {
                var child = item.items[key];
                if (handlers[child.itemId]) handlers[child.itemId](child.params);
                if (child.items) {
                    for (var key2 in child.items) {
                        var child2 = child.items[key2];
                        if (handlers[child2.itemId]) handlers[child2.itemId](child2.params);
                        if (child2.items) {
                            for (var key3 in child2.items) {
                                var child3 = child2.items[key3];
                                if (handlers[child3.itemId]) handlers[child3.itemId](child3.params);
                            }
                        }
                    }
                }
            }
        }

        if (item.parentId == -1 || !item.parentId) {
            delete vehicle.inventory.items[item.index];
        } else {
            var parentItem = vehicle.inventory.getItem(item.parentId);
            delete parentItem.items[item.index];
        }

        DB.Query("DELETE FROM inventory_vehicles WHERE id=?", [sqlId]);

        if (vehicle.bootPlayerId != null) {
            var player = alt.Player.getBySqlId(vehicle.bootPlayerId);
            if (player) alt.emitClient(player, "inventory.vehDelete", sqlId);
        }

        if (callback) callback();
    };
    vehicle.inventory.updatePos = (sqlId, parentSqlId = -1, index, callback) => {
        //debug(`updatePos: ${sqlId} ${parentSqlId} ${index}`)
        var item = vehicle.inventory.getItem(sqlId);
        if (!item) {
            if (vehicle.bootPlayerId != null) {
                var player = alt.Player.getBySqlId(vehicle.bootPlayerId);
                if (player) alt.emitClient(player, "inventory.vehDelete", sqlId);
            }
            return callback("Предмет не найден!");
        }
        
        DB.Query("UPDATE inventory_vehicles SET parentId=?,`index`=? WHERE id=?", [parentSqlId, index, sqlId], (e) => {
            if (e) alt.log(e);
        });

        if (parentSqlId == -1 || !parentSqlId) {
            delete vehicle.inventory.items[item.index];
            vehicle.inventory.items[index] = item;
        }
        
        item.parentId = parentSqlId;
        if (item.parentId == -1 || !item.parentId) delete item.parentId;
        item.index = index;

    };
    /* Обновление параметров предмета. */
    vehicle.inventory.updateParams = (sqlId, item) => {
        //debug(`vehicle.inv.updateParams: ${sqlId} ${JSON.stringify(item)}`);
        alt.emitClient(vehicle, "inventory.updateParamsVeh", sqlId, item.params);
        DB.Query("UPDATE inventory_vehicles SET params=? WHERE id=?", [JSON.stringify(item.params), sqlId]);
    };
    /* Обмен предметами между двумя игроками. */
    vehicle.inventory.swapItems = (recipientId, vehicleItems, recipientItems, vehicleSlots, recipientSlots) => {
        var recipient = alt.Vehicle.at(recipientId);
        if (!recipient) return terminal.error(`vehicle.inventory.swapItems: второй игрок с ID: ${recipientId} не найден!`);
        for (var sqlId in vehicleItems) {
            vehicle.inventory.delete(sqlId, (e) => {
                if (e) return vehicle.utils.error(e);
                recipient.inventory.addOld(sqlId, vehicleItems[sqlId]);
            });
        }
        for (var sqlId in recipientItems) {
            recipient.inventory.delete(sqlId, (e) => {
                if (e) return recipient.utils.error(e);
                vehicle.inventory.addOld(sqlId, recipientItems[sqlId]);
            });
        }
    };
    /* Получить вес предмета. */
    vehicle.inventory.getWeight = (sqlId) => {
        return getWeightItemBySqlId(sqlId, vehicle.inventory.items);
    };
    /* Получить общий вес всех предметов игрока. */
    vehicle.inventory.getCommonWeight = () => {
        var weight = 0;
        for (var sqlId in vehicle.inventory.items) {
            weight += vehicle.inventory.getWeight(sqlId);
        }
        return weight;
    };
    /* Загрузка оружия у игрока на основе предметов-оружия в инвентаре. */
    vehicle.inventory.loadWeapons = () => {
        var weapons = vehicle.inventory.getArrayWeapons();
        //debug(`loadWeapons: ${JSON.stringify(weapons)}`);
        for (var sqlId in weapons) {
            var item = weapons[sqlId];
            if (!item.params.weaponHash) continue;
            vehicle.utils.giveWeapon(item);
        }
    };
    /* Удаление предметов по параметрам. */
    vehicle.inventory.deleteByParams = (itemId, keys, values, callback) => {
        //debug(`deleteByParams: ${vehicle.name} ${itemId} ${keys} ${values}`);
        if (!callback) callback = (e) => {
            if (e) terminal.error(e);
        };
        if (keys.length != values.length) return callback(`Количество ключей и значений параметров предмета не совпадает!<br/>${vehicle.name}<br/>keys: ${keys}<br/>values: ${values}`);
        var items = vehicle.inventory.getArrayByItemId(itemId);
        if (Object.keys(items).length == 0) return;
        for (var sqlId in items) {
            var item = items[sqlId];
            var doDelete = true;
            for (var i = 0; i < keys.length; i++) {
                var param = item.params[keys[i]];
                if (!param) {
                    doDelete = false;
                    break;
                }
                if (param && param != values[i]) {
                    doDelete = false;
                    break;
                }
            }
            if (doDelete) vehicle.inventory.delete(sqlId);
        }
        if (callback) callback();
    };

    DB.Query("SELECT * FROM inventory_vehicles WHERE vehicleId=? ORDER BY parentId", [vehicle.sqlId], (e, result) => {
   
        vehicle.inventory.items = {};
        
        for (var i = 0; i < result.length; i++) {
            result[i].params = JSON.parse(result[i].params);
            if (result[i].params.rows && result[i].params.cols && !result[i].items) result[i].items = {};
        }

        for (var i = 0; i < result.length; i++) {
            result[i].sqlId = result[i].id;
            if (result[i].parentId == -1 || !result[i].parentId) {
                delete result[i].parentId;
            } else {
                for (var j = 0; j < result.length; j++) {
                    if (result[j].id == result[i].parentId) {
                        result[j].items[result[i].index] = result[i];
                        break;
                    }
                }
            }
        }

        for (var i = 0; i < result.length; i++) {
            if (!result[i].parentId) {
                vehicle.inventory.items[result[i].index] = result[i];
            }

            delete result[i].vehicleId;
        }
    });
}
function findItemBySqlId(sqlId, items) {
    // alt.log(`findItemBySqlId: ${sqlId} ${JSON.stringify(items)}`);
    var result = Object.values(items).find((item) => {
        return item.id == sqlId;
    });
    if (result) return result;
    for (var key in items) {
        if (items[key].items) {
            var item = findItemBySqlId(sqlId, items[key].items);
            if (item) return item;
        }
    }
    return null;
}

function findItemByCarId(sqlId, items) {
    var result = Object.values(items).find((item) => {
        return item.params.car == sqlId;
    });
    if (result) return result;
    for (var key in items) {
        if (items[key].items) {
            var item = findItemByCarId(sqlId, items[key].items);
            if (item) return item;
        }
    }
    return null;
}


function findArrayItemByItemId(itemIds, items) {
    //alert(`findItemBySqlId: ${JSON.stringify(items)}`);
    var array = {};
    for (var key in items) {
        if (itemIds.indexOf(items[key].itemId) != -1) {
            array[key] = items[key];
        }
        if (items[key].items) {
            Object.extend(array, findArrayItemByItemId(itemIds, items[key].items));
        }
    }
    return array;
}

function findArrayWeapons(items) {
    //debug(`findArrayWeapons: ${JSON.stringify(items)}`);
    var array = {};
    for (var key in items) {
        if (items[key].params.weaponHash) {
            array[key] = items[key];
        }
        if (items[key].items) {
            Object.extend(array, findArrayWeapons(items[key].items));
        }
    }
    return array;
}

function getWeightItemBySqlId(sqlId, items, weight = 0) {
    // debug(`getWeightItemBySqlId: ${sqlId} ${items} ${weight}`)
    var item = Object.values(items).find((item) => {
        return item.id == sqlId;
    });
    if (item) {
        weight += alt.inventory.items[item.itemId - 1].weight;
        if (item.items) {
            for (var key in item.items) {
                weight += getWeightItemBySqlId(item.items[key].id, item.items, 0);
            }
        }
    } else {
        for (var key in items) {
            if (items[key].items) {
                weight = getWeightItemBySqlId(sqlId, items[key].items, weight);
            }
        }
    }
    return weight;
}