import alt from 'alt';
import game from 'natives';

function wait(ms) {
    return new Promise(resolve => alt.setTimeout(resolve, ms));
}

alt.Player.atRemoteId = (playerId) => {
    if (playerId === undefined || playerId === null) return null;
	var result;
	alt.Player.all.forEach((rec) => {
		if (rec.getSyncedMeta("id") == playerId) {
			result = rec;
			return;
		}
	});
	return result;
};

alt.on(`Client::init`, (view) => {
    const localPlayer = alt.Player.local

    alt.onServer("chat.push", (playerId, text, tag, value) => {
        var player = alt.Player.atRemoteId(playerId);
        var localId = localPlayer.getSyncedMeta("id");
        if (!player) return;
        var showText = text;
        
        if (tag === "Риск") {
            if (value > 0) {
                showText = text + ' [Удачно]';
            } else {
                showText = text + ' [Неудачно]';
            }
        }

        alt.addPlayerChatBubble(playerId, showText);
        var name = (player.isFamiliar || playerId == localId || tag == "Рация") ? player.getSyncedMeta("name") : "Незнакомец";
        view.emit(`chatAPI.push`, name, playerId, text, tag, value);

        // playChatAnim(player, tag);
        playChatSound(player, tag);
    });

    view.on(`chatMessage`, (data) => {
        alt.emitServer(`chatMessage`, data);
    });

    alt.onServer("chat.custom.push", (text, color) => {
        view.emit(`chatAPI.custom_push`, text, color);
    });

    alt.on("chat.enable", (state) => {
        view.emit(`chatAPI.enable`, state);
    });

    alt.onServer("chat.clear", (playerId) => {
        var player = alt.Player.atRemoteId(playerId);
        view.emit(`chatAPI.clear`, player.getSyncedMeta("name"));
    });

    view.on("setChatActive", (enable) => {
        alt.chatActive = enable;
    });

    alt.onServer("chat.playRadio", (playerId) => {
        var player = alt.Player.atRemoteId(playerId);
        if (!player) return;
        const playerPos = localPlayer.pos;
        if (alt.vdist(player.pos, playerPos) > 20) return;
        game.playSoundFromEntity(1488, "End_Squelch", localPlayer.scriptID, "CB_RADIO_SFX", false, 0);
        playChatAnim(player, "Рация");
    });

    async function playChatAnim(player, tag) {
        const playerPos = localPlayer.pos;
        if (tag != "Сказать" && tag != "Рация") return;
        if (alt.vdist(player.pos, playerPos) > 50) return;
        if (player.vehicle) return;
        game.clearPedTasksImmediately(player.scriptID);
        var anim = getAnimByChatTag(tag);
        game.requestAnimDict(anim[0]);

        while (!game.hasAnimDictLoaded(anim[0])) {
            await wait(0);
        }

        game.taskPlayAnim(player.scriptID, anim[0], anim[1], 8, 0, -1, 49, 0, false, false, false);
        var playerId = player.getSyncedMeta("id");

        alt.setTimeout(() => {
            var rec = alt.Player.atRemoteId(playerId);
            if (rec) game.clearPedTasksImmediately(rec.scriptID);
        }, 3000);
    }

    function getAnimByChatTag(tag) {
        var anim = ["special_ped@baygor@monologue_3@monologue_3f", "trees_can_talk_5"];
        if (tag == "Рация") anim = ["random@arrests", "generic_radio_chatter"];
        return anim;
    }

    function playChatSound(player, tag) {
        if (tag != "Рация") return;
        if (alt.vdist(player.pos, localPlayer.pos) > 20) game.playSoundFrontend(-1, "Off_High", "MP_RADIO_SFX", true);
    }
});