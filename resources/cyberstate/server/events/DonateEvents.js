alt.onClient("donateSystem.convertMoney", (player, donate) => {
    if (player.account.donate < donate) return player.utils.error(`У вас недостаточно vc-коинов!`);
    if (donate <= 0) return player.utils.error(`Вы не можете конвертировать нуль vc-коинов!`);
    
    player.utils.setDonate(player.account.donate - donate);
    player.utils.setBankMoney(player.bank + donate * alt.economy["donate_vccoin"].value);
    player.utils.success(`Вы успешно конвертировали ${donate * alt.economy["donate_vccoin"].value}$ валюты`);
    alt.logs.addLog(`${player.getSyncedMeta("name")} конвертировал ${donate * alt.economy["donate_vccoin"].value}$ валюты`, 'donate', player.account.id, player.sqlId, { money: donate * alt.economy["donate_vccoin"].value, type: 'convertMoney' });
});

alt.onClient("donateSystem.buyPackage", (player, package) => {
    var pack = alt.donateList[package - 1];

    if (pack.price > player.account.donate) return player.utils.error(`У вас недостаточно vc-коинов!`);
    if (pack.price <= 0) return player.utils.error(`Вы не можете конвертировать нуль vc-коинов!`);

    if (pack.type == 1) {
        player.utils.setDonate(player.account.donate - pack.price);
        player.utils.setBankMoney(player.bank + pack.data.money);
        player.utils.success(`Вы успешно приобрели пакет ${pack.name}. Приятной игры!`);
        alt.logs.addLog(`${player.getSyncedMeta("name")} приобрел Donate пакет`, 'donate', player.account.id, player.sqlId, { price: pack.price, type: 'donatePackage' });
    }
});

alt.onClient("donateSystem.buyExtension", (player, extension) => {
    var pack = alt.donateList[extension - 1];

    if (pack.price > player.account.donate) return player.utils.error(`У вас недостаточно vc-коинов!`);
    if (pack.price <= 0) return player.utils.error(`Вы не можете конвертировать нуль vc-коинов!`);

    if (pack.sqlId < 7) {
        if (pack.sqlId == 6) {
            if (player.donateBizes >= 2) return player.utils.error(`Вы имеете максимальное количество донат-слотов для бизнеса`);

            player.utils.setDonate(player.account.donate - pack.price);
            player.donateBizes += 1;

            DB.Query("UPDATE characters SET donateBizes = ? WHERE id = ?", [player.donateBizes, player.sqlId]);
            player.utils.success(`Вы успешно приобрели дополнительные слоты для бизнеса. Приятной игры!`);
            alt.logs.addLog(`${player.getSyncedMeta("name")} приобрел дополнительный слот для бизнесов`, 'donate', player.account.id, player.sqlId, { price: pack.price, type: 'donateBizes' });
        } else {
            if (player.donateHouse >= 2) return player.utils.error(`Вы имеете максимальное количество донат-слотов для дома`);

            player.utils.setDonate(player.account.donate - pack.price);
            player.donateHouse += 1;

            DB.Query("UPDATE characters SET donateHouse = ? WHERE id = ?", [player.donateHouse, player.sqlId]);
            player.utils.success(`Вы успешно приобрели дополнительные слоты для дома. Приятной игры!`);
            alt.logs.addLog(`${player.getSyncedMeta("name")} приобрел дополнительный слот для домов`, 'donate', player.account.id, player.sqlId, { price: pack.price, type: 'donateHouses' });
        }
    } else {
        if (player.donateCars >= 10) return player.utils.error(`Вы имеете максимальное количество донат-слотов для машины`);

        player.utils.setDonate(player.account.donate - pack.price);
        player.donateCars += 1;

        DB.Query("UPDATE characters SET donateCars = ? WHERE id = ?", [player.donateCars, player.sqlId]);
        player.utils.success(`Вы успешно приобрели дополнительные слоты для машин. Приятной игры!`);
        alt.logs.addLog(`${player.getSyncedMeta("name")} приобрел дополнительный слот для автомобилей`, 'donate', player.account.id, player.sqlId, { price: pack.price, type: 'donateCars' });
    }
});
    
alt.onClient("donateSystem.buyVip", (player, package) => {
    var pack = alt.donateList[package - 1];
    var getTime = new Date(pack.time) - Date.now();

    if (pack.price > player.account.donate) return player.utils.error(`У вас недостаточно vc-коинов!`);
    if (pack.price <= 0) return player.utils.error(`Вы не можете оплатить нуль vc-коинов!`);

    player.utils.setDonate(player.account.donate - pack.price);
    player.vipDate = pack.time;
    player.utils.success(`Вы успешно приобрели вип-пакет на ${getTime /= 24} дня(ей). Поздравляем!`);
    DB.Query("UPDATE characters SET vipDate = ? WHERE id = ?", [pack.time, player.sqlId]);
});

alt.onClient("donateSystem.changeOptions", (player, option, params) => {
    params = JSON.parse(params);
    option = alt.donateList[option - 1];

    let name = getSpecialName(params.name, player);
    if (!name) return terminal.error(`Формат: Имя_Фамилия`, player);
    let newName = getSpecialName(params.oldName, player);
    if (!newName) return terminal.error(`Формат: Имя_Фамилия`, player);

    if (option.price > player.account.donate) return player.utils.error(`У вас недостаточно vc-коинов!`);
    if (option.price <= 0) return player.utils.error(`Вы не можете оплатить нуль vc-коинов!`);

    var reg = /^([A-Z][a-z]{1,15}) ([A-Z][a-z]{1,15})$/;
    if (!reg.test(params.name)) return player.utils.error(`Имя ${params.name} некорректно!`);

    switch (option.type) {
        case 1:
            player.utils.changeName(params.oldName, params.name);
            player.utils.success(`Вы успешно приобрели смену имени персонажа. Поздравляем!`);
            player.kick();
            break;
        case 2:
            alt.emit(`initChangeCharacter`, player);
            break;
    }
});