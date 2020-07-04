module.exports = {
    Init: () => {
        alt.autosaloons = {
            saloons: [],
            vehicles: [],
            colorsCFG: []
        };

        DB.Query("SELECT * FROM autosaloons", (e, result) => {
            for (var i = 0; i < result.length; i++) {
                var h = result[i];
                alt.autosaloons.saloons.push({
                    sqlId: h.id,
                    newCarCoord: JSON.parse(h.newCarCoord)
                });
            }
            alt.log(`Автосалоны загружены: ${i} шт.`);
        });

        DB.Query("SELECT * FROM configvehicle ORDER BY price ASC", (e, result) => {
            for (var i = 0; i < result.length; i++) {
                var h = result[i];
                alt.autosaloons.vehicles.push({
                    sqlId: h.id,
                    model: h.model,
                    modelHash: h.modelHash,
                    brend: h.brend,
                    title: h.title,
                    fuelTank: h.fuelTank,
                    fuelRate: h.fuelRate,
                    price: h.price,
                    max: h.max,
                    buyed: h.buyed
                });
            }
            alt.log(`Машины автосалона загружены: ${i} шт.`);
        });

        DB.Query("SELECT * FROM configvehiclecolors", (e, result) => {
            for (var i = 0; i < result.length; i++) {
                var h = result[i];
                alt.autosaloons.colorsCFG.push({
                    sqlId: h.id,
                    gameColor: h.color
                });
            }
            alt.log(`Цвета автосалона загружены: ${i} шт.`);
        });
    }
}
