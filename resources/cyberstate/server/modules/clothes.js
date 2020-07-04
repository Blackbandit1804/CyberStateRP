module.exports = {
    Init: () => {
        var names = ["bracelets", "ears", "feets", "glasses", "hats", "legs", "masks", "ties", "top", "watches", "underwear"];
        alt.clothes = {};
        names.forEach((name) => {
            DB.Query(`SELECT * FROM store_${name}`, (e, result) => {
                if (e) alt.log(e)
                alt.clothes[name] = [
                    [],
                    []
                ]; // Ж и М
                for (var i = 0; i < result.length; i++) {
                    delete result[i].name; // TODO: Иниц. имени шмота.
                    result[i].textures = JSON.parse(result[i].textures);
                    alt.clothes[name][result[i].sex].push(result[i]);
                    delete result[i].sex
                }
                alt.log(`${name} loaded: ${i}`);
            });
        });
    }
}

/* Подсчет количества суммарной цены и количества текстур для каждого типа одежды. */
alt.getArrayClothesCounts = () => {
    var counts = [];

    for (var com in alt.clothes) {
        var count = 0;
        for (var i = 0; i < alt.clothes[com].length; i++) {
            for (var j = 0; j < alt.clothes[com][i].length; j++) {
                count += alt.clothes[com][i][j].price;
                count += alt.clothes[com][i][j].textures.length;
                count += alt.clothes[com][i][j].variation;
                if (alt.clothes[com][i][j].rows) count += alt.clothes[com][i][j].rows;
                if (alt.clothes[com][i][j].cols) count += alt.clothes[com][i][j].cols;
            }
        }
        count += i;
        counts.push(count);
    }
    return counts;
}

/* Получить одежду по типу и ид. */
alt.getClothes = (name, id) => {
    if (!alt.clothes[name]) return null;
    for (var i = 0; i < alt.clothes[name][0].length; i++)
        if (alt.clothes[name][0][i].id == id) return alt.clothes[name][0][i];
    for (var i = 0; i < alt.clothes[name][1].length; i++)
        if (alt.clothes[name][1][i].id == id) return alt.clothes[name][1][i];
    return null;
}
