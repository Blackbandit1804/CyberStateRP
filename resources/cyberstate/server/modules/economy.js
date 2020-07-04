module.exports.Init = function(callback) {

    DB.Query("SELECT * FROM economy", (e, result) => {
        alt.economy = {};
        for (var i = 0; i < result.length; i++) {
            alt.economy[result[i].key] = {
                key: result[i].key,
                value: result[i].value,
                description: result[i].description
            };
            initEconomyUtils(alt.economy[result[i].key]);
        }

        alt.log(`Переменные экономики загружены: ${i} шт.`);
        if (callback) callback();
    });
}

function initEconomyUtils(item) {
    item.setValue = (value) => {
        value = parseFloat(value);
        if (isNaN(value)) return;
        item.value = value;
        DB.Query("UPDATE economy SET value=? WHERE `key`=?", [item.value, item.key]);
    };
}
