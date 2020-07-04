alt.on("playerDeath", (player, killer, weapon) => {
    if (player.sqlId && player instanceof alt.Player) alt.emitClient(player, `playerDeath`, player);
    const TIME_WAIT = (player.admin > 0) ? 1000 : 1000;
    var playerId = player.sqlId;
    var playerSqlId = player.sqlId;

    var killerId = -1,
        killerSqlId = -1;
    if (killer) {
        killerId = killer.id;
        killerSqlId = killer.sqlId;
        if (player.sqlId != killer.id) giveWantedHandler(killer);
    }

    if (player.demorgan <= 0) {
        player.hospital = true;
    }
    player.removeAllWeapons();
    checkGangwar(player);
    const timeout = setSaveTimeout(() => {
        try {
            var player = alt.Player.getBySqlId(playerId);
            if (!player || player.sqlId != playerSqlId) return clearSaveInterval(timeout);

            if (killerId != -1) {
                var killer = alt.Player.getBySqlId(killerId);
                if (killer && killer.sqlId == killerSqlId) {
                    doArrestHandler(player, killer);
                }
            }

            if (player.hasCuffs) player.utils.setCuffs(false);
            if (player.getSyncedMeta("attachedObject")) player.setSyncedMeta("attachedObject", null);
            clearJobHandler(player);
            player.inventory.loadWeapons();
            player.body.loadItems();
            player.utils.spawn(120);
        } catch (err) {
            alt.log(err);
        }
    }, TIME_WAIT);
});

function giveWantedHandler(player) {
    var wanted = alt.economy["wanted_level"].value;
    if (player.faction != 2 && wanted) {
        player.utils.setWanted(player.wanted + wanted);
        player.utils.error(`Ваш уровень преступности повысился!`);
    }
}

function doArrestHandler(player, killer) {
    if (player.sqlId == killer.id) return;
    if (killer.faction != 2 || player.wanted <= 0) return;

    var rand = alt.randomInteger(0, 2);
    player.utils.doArrest(rand, (alt.economy["wanted_arrest_time"].value / 1000) * player.wanted);
    player.utils.setWanted(0);

    player.utils.success(`${killer.name} посадил Вас в тюрьму!`);
    killer.utils.success(`${player.getSyncedMeta("name")} посажен в тюрьму!`);
}

function clearJobHandler(player) {
    if (player.farmJob) alt.emit("farm.stopJob", player, true);
    // TODO: Перенести увольнение с других работа сюда.
}

function removeAllWeapons(player) {
  let cold_weapons = [
    18, // Фонарик
    17, // Дубинка
    41, // Бита
    42, // Кастет
    43, // Нож
    65, // Старинный кинжал
    66, // Разбитая бутылка
    67, // Лом
    68, // Клюшка
    69, // Молоток
    70, // Топор
    71, // Мачете
    72, // Складной нож
    73, // Гаечный ключ
    74, // Боевой топор
    75, // Кий
    76 // Каменный топор
  ];
  let items = player.inventory.getArrayWeapons();
  for (let key in items) if (!cold_weapons.includes(items[key].itemId)) player.inventory.delete(items[key].id);
}

function removeAllAmmo(player) {
  let items = player.inventory.getArrayByItemId([37,38,39,40]);
  for (let key in items) player.inventory.delete(items[key].id);
}

function checkGangwar(player) {
    var gangwar = player.getSyncedMeta("gangwar");
    if (gangwar) alt.bandZones[gangwar].leaveCapture(player);
}
