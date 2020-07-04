import alt from 'alt';

alt.on(`Client::init`, (view) => {
    alt.on("infoTable.setValues", (infoTableName, values) => {
        menu.execute(`infoTableAPI.setValues('${infoTableName}', '${JSON.stringify(values)}')`);
    });

    alt.on("infoTable.show", (infoTableName, params = null) => {
        //alert(`infoTable.show: ${infoTableName} ${params}`);
        menu.execute(`infoTableAPI.show('${infoTableName}', '${JSON.stringify(params)}')`);
    });

    alt.on("infoTable.hide", () => {
        menu.execute(`infoTableAPI.hide()`);
    });
});
