alt.onClient("newsStorage.takeRation", (player) => {
    if (!player.colshape || !player.colshape.newsStorage) return player.utils.error(`Вы не у склада News!`);
    if (!alt.factions.isNewsFaction(player.faction)) return player.utils.error(`Вы не работаете в News!`);
    var items = player.inventory.getArrayByItemId(27);
    for (var sqlId in items)
        if (alt.factions.isNewsFaction(items[sqlId].params.faction)) return player.utils.error(`У Вас уже есть рация Weazel News!`);
    player.inventory.add(27, { faction: player.faction, owner: player.sqlId }, {}, (e) => {
        if (e) return player.utils.error(e);
        player.utils.success(`Вам выдана рация Weazel News!`);
    });
});
alt.onClient("newsStorage.takeArmour", (player) => {
    if (!player.colshape || !player.colshape.newsStorage) return player.utils.error(`Вы не у склада News!`);
    if (!alt.factions.isNewsFaction(player.faction)) return player.utils.error(`Вы не работаете в News!`);

    var faction = alt.factions.getBySqlId(player.faction);
    if (!faction) return player.utils.error(`Организация с ID: ${player.faction} не найдена!`);
    var army = faction.name;

    if (faction.products < alt.economy["news_armour_products"].value) return player.utils.error(`Недостаточно боеприпасов!`);
    var items = player.inventory.getArrayByItemId(3);

    for (var sqlId in items)
        if (alt.factions.isNewsFaction(items[sqlId].params.faction)) return player.utils.error(`У Вас уже есть бронежилет ${army}!`);

    alt.fullDeleteItemsByParams(3, ["faction", "owner"], [player.faction, player.sqlId]);

    var params;
    if (player.sex == 1) {
        params = {
            variation: 16,
            texture: 2
        };
    } else {
        params = {
            variation: 18,
            texture: 2
        };
    }

    params.faction = player.faction;
    params.owner = player.sqlId;
    params.armour = 100;
    params.sex = player.sex;

    player.inventory.add(3, params, {}, (e) => {
        if (e) return player.utils.error(e);
        player.utils.success(`Вам выдан бронежилет ${army}!`);
        faction.setProducts(faction.products - alt.economy["news_armour_products"].value);
        alt.logs.addLog(`${player.getSyncedMeta("name")} взял со склада Бронежилет News`, 'stuff', player.account.id, player.sqlId, {
            faction: player.faction,
            count: 1
        });
    });
});
