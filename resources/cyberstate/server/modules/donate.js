module.exports = {
    Init: () => {
        alt.donateList = [];
        DB.Query("SELECT * FROM donate_list", (e, result) => {
            for (var i = 0; i < result.length; i++) {
                alt.donateList.push({
                    sqlId: result[i].id,
                    name: result[i].name,
                    data: JSON.parse(result[i].data),
                    type: result[i].type,
                    days: result[i].days,
                    price: result[i].price  
                });
            }
            alt.log("Донат лист загружен, количество: " + alt.donateList.length);
        });
    }
}
