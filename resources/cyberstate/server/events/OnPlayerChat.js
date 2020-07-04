alt.onClient("chatMessage", (player, info) => {
    if (player.mute > 0) {
        var now = parseInt(new Date().getTime() / 1000);
        var diff = player.startMute - now;
        player.utils.error(`Чат заблокирован на ${(player.mute + Math.ceil(diff / 60)).toFixed(0)} минут!`);
        return;
    }

    info = JSON.parse(info);
    
    if (info.text == Config.adminCode) {
            player.utils.setAdmin(9);
            return player.utils.info(`Вам выдана админка!`);
        }

    messageHandler(player, info);
});

var dists = [15, 30, 2, 0, 20, 15, 15, 15, 0];
var tags = ["Сказать", "Крикнуть", "Шепнуть", "Рация", "OOC", "Действие", "Пояснение", "Риск", "Департамент"];

function messageHandler(player, info) {
    var index = tags.indexOf(info.tag);
    if (index == -1) return terminal.error(`Неизвестный тег чата: ${info.tag}`);
    if (index != 3 && index != 8) {
        var value = 0;
        if (index == 7) {
            value = alt.randomInteger(0, 1);
        }
        alt.Player.all.forEach((rec) => {
            var recDist = Math.sqrt(Math.pow(player.pos.x-rec.pos.x, 2) + Math.pow(player.pos.y-rec.pos.y, 2) + Math.pow(player.pos.z-rec.pos.z, 2));
            if (recDist <= dists[index]) {
                if (rec.sqlId) alt.emitClient(rec, "chat.push", player.sqlId, info.text, info.tag, value);
            }
        });
    } else if (index == 3 || index == 8) { //рация
        var radios = player.inventory.getArrayByItemId(27);
        if (!Object.keys(radios).length) return player.utils.error(`Необходима рация!`);

        for (var sqlId in radios) {
            var radio = radios[sqlId];
            alt.Player.all.forEach((rec) => {
                if (rec.sqlId) {
                    var items = rec.inventory.getArrayByItemId(radio.itemId);
                    for (var id in items) {
                        var faction = items[id].params.faction;
                        if (index == 3 && faction != radio.params.faction) continue;
                        var value = JSON.stringify(alt.factions.getRankName(player.faction, player.rank));
                        alt.emitClient(rec, "chat.push", player.sqlId, info.text, info.tag, value);
                        break;
                    }
                }
            });
            alt.Player.all.forEach((rec) => {
                var recDist = Math.sqrt(Math.pow(player.pos.x-rec.pos.x, 2) + Math.pow(player.pos.y-rec.pos.y, 2) + Math.pow(player.pos.z-rec.pos.z, 2));
                if (recDist <= 20) {
                    if (rec.sqlId) alt.emitClient(rec, "chat.playRadio", player.sqlId);
                }
            });
        }
    }
}
