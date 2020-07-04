module.exports = {
    Init: () => {
        alt.bizes = [];
        initBizesUtils();
        DB.Query("SELECT * FROM bizes WHERE status != ?", [-1], (e, result) => {
            for (var i = 0; i < result.length; i++) {
                result[i].sqlId = result[i].id;
                delete result[i].id;

                var marker = alt.createBizMarker(result[i]);
                alt.bizes.push(marker);
            }
            alt.log(`Бизнесы загружены: ${i} шт.`);
        });
    }
}

var bizesInfo = [{
        name: "Закусочная",
        blip: 106
    },
    {
        name: "Бар",
        blip: 93
    },
    {
        name: "Магазин одежды",
        blip: 73
    },
    {
        name: "Барбершоп",
        blip: 71
    },
    {
        name: "АЗС",
        blip: 361
    },
    {
        name: "24/7",
        blip: 52
    },
    {
        name: "Тату салон",
        blip: 75
    },
    {
        name: "Оружейный магазин",
        blip: 110
    },
    {
        name: "Автосалон",
        blip: 524
    },
    {
        name: "LS Customs",
        blip: 72
    },
    {
        name: "СТО",
        blip: 446
    }
];

function initBizesUtils() {
    alt.bizes.getBySqlId = (sqlId) => {
        if (!sqlId) return null;
        var result;
        alt.bizes.forEach((biz) => {
            if (biz.sqlId == sqlId) {
                result = biz;
                return;
            }
        });
        return result;
    };

    alt.bizes.getArrayByOwner = (owner) => {
        if (!owner) return [];
        var array = [];
        alt.bizes.forEach((biz) => {
            if (biz.owner == owner) {
                array.push({
                    sqlId: biz.sqlId,
                    balance: biz.balance,
                    owner: biz.owner,
                    ownerName: biz.ownerName,
                    name: biz.name,
                    price: biz.price,
                    maxProducts: biz.maxProducts,
                    productPrice: biz.productPrice,
                    bizType: biz.bizType,
                    balance: biz.balance,
                    status: biz.class,
                    x: biz.h,
                    y: biz.y,
                    z: biz.z
                });
            }
        });
        return array;
    };

    alt.bizes.getNameByType = (type) => {
        return bizesInfo[type - 1].name;
    };

    alt.bizes.create = (name, price, bizType, pos) => {
        if (price < 1) price = 1;
        bizType = Math.clamp(bizType, 1, 11);
        DB.Query("INSERT INTO bizes (name,price,bizType,staff,x,y,z) VALUES (?,?,?,?,?,?,?)", [name, price, bizType, '[]', pos.x, pos.y, pos.z], (e, result) => {
            if (e) return terminal.error(e);

            DB.Query("SELECT * FROM bizes WHERE id=?", result.insertId, (e, result) => {
                result[0].sqlId = result[0].id;
                delete result[0].id;
                var marker = alt.createBizMarker(result[0]);
                marker.markers_deltaz = alt.economy["markers_deltaz"].value;
                marker.markers_alpha = alt.economy["markers_alpha"].value;
                marker.markers_scale = alt.economy["markers_scale"].value;
                marker.markers_stream_dist = alt.economy["markers_stream_dist"].value;
            
                alt.emitClient(null, `Biz::init::marker`, JSON.stringify(marker));
                alt.bizes.push(marker);
            });
        });
    };

    alt.bizes.delete = (bizSqlId, callback) => {
        var biz = alt.bizes.getBySqlId(bizSqlId);
        if (callback) {
            if (!biz) return callback("Бизнес не найден!");
        }

        var i = alt.bizes.indexOf(biz);

        alt.bizes.splice(i, 1);
        biz.colshape.destroy();
        biz.showColshape.destroy();
        biz.destroy();

        //DB.Query("DELETE FROM bizes WHERE id=?", biz.sqlId);
        DB.Query("UPDATE bizes SET status=? WHERE id=?", [-1, bizSqlId]);
        if (callback) callback();
        delete biz;
    }
}

function initBizUtils(biz) {
    biz.setName = (name) => {
        biz.name = name;
        biz.blip.name = biz.name;
        DB.Query("UPDATE bizes SET name=? WHERE id=?", [biz.name, biz.sqlId]);
    };
    biz.setOwner = (ownerSqlId, ownerName) => {
        // debug(`biz.setOwner: ${ownerSqlId} ${ownerName}`);
        if (ownerSqlId < 1) {
            ownerSqlId = 0;
            ownerName = "";
        }

        biz.owner = ownerSqlId;
        biz.ownerName = ownerName;
        biz.products = 0;
        biz.productPrice = 1;
        // biz.balance = biz.getTax() * 24;
        biz.balance = 0;
        biz.status = 1;
        biz.staff = [];
        DB.Query("UPDATE bizes SET owner=?,ownerName=?,products=?,productPrice=?,balance=?,status=?,staff=? WHERE id=?",
            [biz.owner, biz.ownerName, biz.products, biz.productPrice, biz.balance, biz.status, JSON.stringify(biz.staff), biz.sqlId]);
    };
    biz.destroy = () => {
        alt.emitClient(null, `Bizes::setParams`, 'biz_destroy', biz.sqlId);
    };
    biz.setPrice = (price) => {
        if (price < 1) price = 1;
        biz.price = price;
        DB.Query("UPDATE bizes SET price=? WHERE id=?", [price, biz.sqlId]);
    };
    biz.setProducts = (products) => {
        biz.products = Math.clamp(products, 0, biz.maxProducts);
        DB.Query("UPDATE bizes SET products=? WHERE id=?", [biz.products, biz.sqlId]);
    };
    biz.setMaxProducts = (maxProducts) => {
        if (maxProducts < 1) maxProducts = 1;
        biz.maxProducts = maxProducts;
        DB.Query("UPDATE bizes SET maxProducts=? WHERE id=?", [maxProducts, biz.sqlId]);
    };
    biz.setProductPrice = (productPrice) => {
        biz.productPrice = Math.clamp(productPrice, 1, 10);
        DB.Query("UPDATE bizes SET productPrice=? WHERE id=?", [biz.productPrice, biz.sqlId]);
    };
    biz.setBalance = (balance) => {
        if (balance < 0) balance = 0;
        biz.balance = balance;
        DB.Query("UPDATE bizes SET balance=? WHERE id=?", [balance, biz.sqlId]);
    };
    biz.setType = (bizType) => {
        biz.bizType = Math.clamp(bizType, 1, 11);
        biz.colshape.menuName = `enter_biz_${biz.bizType}`;
        biz.blip.model = bizesInfo[biz.bizType - 1].blip;
        DB.Query("UPDATE bizes SET bizType=? WHERE id=?", [biz.bizType, biz.sqlId]);
    };
    biz.setStatus = (status) => {
        biz.status = Math.clamp(status, 0, 1);
        DB.Query("UPDATE bizes SET status=? WHERE id=?", [biz.status, biz.sqlId]);
    };
    biz.setPosition = (pos) => {
        pos.z--;
        biz.pos = pos;
        pos.z++;
        alt.emitClient(null, `Bizes::setParams`, 'biz_pos', biz.sqlId, JSON.stringify(pos));
        biz.showColshape.destroy();
        biz.colshape.destroy();

        //для стриминга игрокам, которые в радиусе
        biz.showColshape = new alt.ColshapeCircle(biz.pos.x, biz.pos.y, 60);
        biz.showColshape.marker = biz;

        //для отловки события входа
        biz.colshape = new alt.ColshapeSphere(biz.pos.x, biz.pos.y, biz.pos.z, 2);
        biz.colshape.biz = biz;
        biz.colshape.menuName = `enter_biz_${biz.bizType}`;

        DB.Query("UPDATE bizes SET x=?,y=?,z=? WHERE id=?", [pos.x, pos.y, pos.z, biz.sqlId]);
    };
    biz.isOwner = (player) => {
        return player.sqlId == biz.owner;
    };
    biz.getTax = () => {
        return parseInt(biz.price / 100) * alt.economy["biz_tax"].value;
    };
    biz.log = (playerId, text, price, products) => {
        DB.Query("INSERT INTO logs_bizes (bizId,playerId,text,price,products) VALUES (?,?,?,?,?)",
            [biz.sqlId, playerId, text, price, products]);
    };

}

alt.createBizMarker = (marker) => {
    var pos = new alt.Vector3(marker.x, marker.y, marker.z - 1);
    pos.z -= 0.5;
    
    marker.pos = pos;

    //для стриминга бизнесов для игроков, которые в радиусе
    var colshape = new alt.ColshapeCircle(marker.pos.x, marker.pos.y, alt.economy["markers_stream_dist"].value);
    colshape.dimension = 1;
    colshape.marker = marker;
    marker.showColshape = colshape;

    //для отловки события входа в дом
    var colshape = new alt.ColshapeSphere(marker.pos.x, marker.pos.y, marker.pos.z, 2);
    colshape.dimension = 1;
    colshape.biz = marker;
    marker.colshape = colshape;
    colshape.menuName = `enter_biz_${marker.bizType}`;

    initBizUtils(marker);

    return marker;
};