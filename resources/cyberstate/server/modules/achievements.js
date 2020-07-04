module.exports.Init = function() {
    alt.achievements = {
        items: []
    };
    DB.Query("SELECT * FROM achievements_items", (e, result) => {
        for (var i = 0; i < result.length; i++) {
            alt.achievements.items[result[i].id - 1] = result[i];
            result[i].sqlId = result[i].id;
            delete result[i].id;
            initItemUtils(result[i]);
        } 
        alt.log(`Достижения загружены: ${i} шт.`);
    });

    initAchievementsUtils();
}

function initAchievementsUtils() {
    alt.achievements.getItem = (itemId) => {
        return alt.achievements.items[itemId];
    };
}

global.initPlayerAchievements = function(player) {
    player.achievements = {
        items: [],
        /* Обновить прогресс достижения. */
        updateExp: (itemId, addExp) => {
            var info = alt.achievements.items[itemId];
            var item = player.achievements.items[itemId];
            if (item) {
                item.exp += addExp;
                if (item.exp > info.maxExp) item.exp = info.maxExp;
                DB.Query(`UPDATE achievements_players SET exp=? WHERE id=?`, [item.exp, item.sqlId]);
                player.utils.setAchievement();
            } else {
                var newItem = { exp: addExp, data: {}, date: parseInt(new Date().getTime() / 1000) };
                if (newItem.exp > info.maxExp) newItem.exp = info.maxExp;
                player.achievements.items[itemId] = newItem;
                DB.Query(`INSERT INTO achievements_players (playerId,itemId,exp,date) VALUES (?,?,?,?)`,
                [player.sqlId, itemId, newItem.exp, newItem.date], (e, result) => {
                    if (e) alt.log(e);
                    newItem.sqlId = result.insertId;
                });
                player.utils.setAchievement();
            }
        },
        /* Кол-во выполненных достижений. */
        getFinishedCount: () => {
            var count = 0;
            for (var itemId in player.achievements.items) {
                var item = player.achievements.items[itemId];
                var info = alt.achievements.getItem(itemId);
                if (item.exp >= info.maxExp) count++;
            }
            return count;
        },
    };

    DB.Query("SELECT * FROM achievements_players WHERE accountId=?", [player.account.id], (e, result) => {
        for (var i = 0; i < result.length; i++) {
            player.achievements.items[result[i].itemId] = result[i];
            result[i].sqlId = result[i].id;
            result[i].data = JSON.parse(result[i].data);
            delete result[i].id;
            delete result[i].itemId;
            delete result[i].accountId;
        }
    });
}
