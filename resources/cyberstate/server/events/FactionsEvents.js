alt.onClient("factions.invite", (player, recId) => {
    //debug(`${player.getSyncedMeta("name")} factions.invite ${recId}`);
    var rec = alt.Player.getBySqlId(recId);
    if (!rec) return player.utils.error(`Гражданин не найден!`);
    var dist = alt.Player.dist(player.pos, rec.pos);
    if (dist > Config.maxInteractionDist) return player.utils.error(`Гражданин далеко!`);

    if (rec.faction) return player.utils.error(`Гражданин уже в огранизации!`);

    rec.inviteOffer = {
        leaderId: player.sqlId
    };

    player.utils.success(`Вы пригласили ${rec.getSyncedMeta("name")} в организацию`);
    rec.utils.success(`Получено приглашение в организацию`);

    alt.emitClient(rec, "choiceMenu.show", "accept_invite", {
        name: player.getSyncedMeta("name"),
        faction: alt.factions.getBySqlId(player.faction).name
    });
});


alt.onClient("factions.giverank", (player, recId) => {
    var rec = alt.Player.getBySqlId(recId);
    if (!rec) return player.utils.error(`Гражданин не найден!`);
    if (!player.faction || player.rank < alt.factionRanks[player.faction].length - 2) return player.utils.error(`У вас нет прав!`);
    if (rec.faction != player.faction) return player.utils.error(`Гражданин не в Вашей организации!`);
    if (rec.rank >= player.rank - 1) return player.utils.error(`Невозможно повысить выше!`);

    var rankName = alt.factionRanks[rec.faction][rec.rank + 1].name;
    rec.utils.setFactionRank(rec.rank + 1);
    player.utils.success(`${rec.getSyncedMeta("name")} повышен до ${rankName}`);
    rec.utils.success(`${player.getSyncedMeta("name")} повысил Вас до ${rankName}`);

    alt.logs.addLog(`${player.getSyncedMeta("name")} повысил игрока ${rec.getSyncedMeta("name")} в должности. Ранг: ${rec.rank + 1}`, 'faction', player.account.id, player.sqlId, { rank: rec.rank + 1, faction: rec.faction });
    alt.logs.addLog(`${rec.getSyncedMeta("name")} был повышен игроком ${player.getSyncedMeta("name")} в должности. Ранг: ${rec.rank + 1}`, 'faction', rec.account.id, rec.sqlId, { rank: player.rank, faction: player.faction });
});
alt.onClient("factions.ungiverank", (player, recId) => {
    var rec = alt.Player.getBySqlId(recId);
    if (!rec) return player.utils.error(`Гражданин не найден!`);
    if (!player.faction || player.rank < alt.factionRanks[player.faction].length - 2) return player.utils.error(`У вас нет прав!`);
    if (rec.faction != player.faction) return player.utils.error(`Гражданин не в Вашей организации!`);
    if (player.rank == alt.factionRanks[player.faction].length - 2 && rec.rank == alt.factionRanks[rec.faction].length - 2) return player.utils.error(`У вас нет прав!`);
    if (rec.rank == alt.factionRanks[rec.faction].length - 1) return player.utils.error(`Невозможно понизить лидера!`);
    if (rec.rank <= 1) return player.utils.error(`Невозможно понизить ниже!`);

    var rankName = alt.factionRanks[rec.faction][rec.rank - 1].name;
    rec.utils.setFactionRank(rec.rank - 1);
    player.utils.success(`${rec.getSyncedMeta("name")} понижен до ${rankName}`);
    rec.utils.success(`${player.getSyncedMeta("name")} понизил Вас до ${rankName}`);

    alt.logs.addLog(`${player.getSyncedMeta("name")} понизил игрока ${rec.getSyncedMeta("name")} в должности. Ранг: ${rec.rank - 1}`, 'faction', player.account.id, player.sqlId, { rank: rec.rank - 1, faction: rec.faction });
    alt.logs.addLog(`${rec.getSyncedMeta("name")} был понижен игроком ${player.getSyncedMeta("name")} в должности. Ранг: ${rec.rank - 1}`, 'faction', rec.account.id, rec.sqlId, { rank: player.rank, faction: player.faction });

});
alt.onClient("factions.uninvite", (player, recId) => {
    //debug(`${player.getSyncedMeta("name")} factions.uninvite ${recId}`);
    var rec = alt.Player.getBySqlId(recId);
    if (!rec) return player.utils.error(`Гражданин не найден!`);

    if (rec.faction != player.faction) return player.utils.error(`Гражданин не в Вашей организации!`);
    if (rec.rank == alt.factionRanks[rec.faction].length - 1) return player.utils.error(`Невозможно уволить лидера!`);

    /*удаляем игрока из списка игроков состоящих во фраке*/
    for (var i = 0; i < alt.factionPlayerList[player.faction].length; i++) {
        if (alt.factionPlayerList[player.faction][i].id === rec.sqlId) {
            delete alt.factionPlayerList[player.faction][i];
        }
    }

    rec.utils.setFaction(0);

    player.utils.success(`Вы уволили ${rec.getSyncedMeta("name")} из организации`);
    rec.utils.success(`${player.getSyncedMeta("name")} уволил Вас из организации`);
    alt.logs.addLog(`${player.getSyncedMeta("name")} уволил игрока ${rec.getSyncedMeta("name")} из организации. Ранг: ${rec.rank}`, 'faction', player.account.id, player.sqlId, { rank: rec.rank, faction: rec.faction });
    alt.logs.addLog(`${rec.getSyncedMeta("name")} был уволен игроком ${player.getSyncedMeta("name")} из организации. Ранг: ${rec.rank}`, 'faction', rec.account.id, rec.sqlId, { rank: player.rank, faction: player.faction });
});
alt.onClient("factions.offer.agree", (player) => {
    if (!player.inviteOffer) return player.utils.error(`Предложение не найдено!`);
    var rec = alt.Player.getBySqlId(player.inviteOffer.leaderId);
    if (!rec) return player.utils.error(`Игрок не найден!`);
    var dist = alt.Player.dist(player.pos, rec.pos);
    if (dist > 5) return player.utils.error(`Игрок слишком далеко!`);
    if (!rec.faction || rec.rank < alt.factionRanks[rec.faction].length - 2) return player.utils.error(`У гражданина не имеется прав!`);
    if (player.faction) return player.utils.error(`Вы уже в организации!`);

    delete player.inviteOffer;

    player.utils.setFaction(rec.faction);

    player.utils.success(`Приглашение принято!`);
    rec.utils.success(`${player.getSyncedMeta("name")} принял приглашение!`);

    alt.logs.addLog(`${rec.getSyncedMeta("name")} принял игрока ${player.getSyncedMeta("name")} в организацию. Ранг: ${player.rank}`, 'faction', rec.account.id, rec.sqlId, { rank: rec.rank, faction: rec.faction });
    alt.logs.addLog(`${player.getSyncedMeta("name")} был принят игроком ${rec.getSyncedMeta("name")} в организацию. Ранг: ${player.rank}`, 'faction', player.account.id, player.sqlId, { rank: player.rank, faction: player.faction });
});
alt.onClient("factions.offer.cancel", (player) => {
    if (!player.inviteOffer) return player.utils.error(`Предложение не найдено!`);

    var rec = alt.Player.getBySqlId(player.inviteOffer.leaderId);
    delete player.inviteOffer;
    player.utils.success(`Приглашение отклонено`);
    if (!rec) return;
    delete rec.inviteOffer;

    rec.utils.success(`${player.getSyncedMeta("name")} отклонил приглашение`);
});
alt.onClient("warehouse.push", (player) => {
    if (!player.getSyncedMeta("attachedObject")) return player.utils.error(`Вы не имеете груз!`);
    if (!player.colshape || !player.colshape.warehouse) return player.utils.error(`Вы не у склада!`);
    var factionIds = [2, 3, 4, 7, 6, 5];
    var models = ['prop_box_ammo04a', 'prop_box_ammo04a', 'prop_box_ammo04a', 'prop_box_ammo04a', 'prop_box_ammo04a', 'ex_office_swag_pills4'];
    var weights = [500, 500, 500, 500, 500, 500];
    var index = factionIds.indexOf(player.colshape.warehouse.faction);
    if (index == -1) return player.utils.error(`Склад организации не найден!`);
    if (models[index] != player.getSyncedMeta("attachedObject")) return player.utils.error(`Неверный тип товара!`);
    player.setSyncedMeta("attachedObject", null);

    var faction = alt.factions.getBySqlId(player.colshape.warehouse.faction);
    if (faction.products + weights[index] > faction.maxProducts) player.utils.error(`Склад заполнен!`);

    faction.setProducts(faction.products + weights[index]);

    if (alt.factions.isArmyFaction(player.faction)) {
        alt.emit('army.getInfoWareHouse');
    }

    player.utils.success(`Склад: ${faction.products} / ${faction.maxProducts} ед.`);
});
alt.onClient("products.take", (player) => {
    if (player.getSyncedMeta("attachedObject")) return player.utils.error(`Недостаточно выносливости!`);
    if(!player.factionProducts) return player.utils.error(`Вы не у склада!`);

    player.utils.setLocalVar("insideProducts", false);
    player.setSyncedMeta("attachedObject", player.factionProducts.modelName);
});
