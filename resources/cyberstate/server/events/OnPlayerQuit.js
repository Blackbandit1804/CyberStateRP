const { getHospitalPhase, removeHospitalPatient } = require("../modules/hospital/hospitalSpawn");

alt.on("playerDisconnect", (player, reason) => {
    if (player.vehicle && player.vehicle.player == player) delete player.vehicle.player;
    if (player.bootVehicleId != null) {
        var veh = alt.Vehicle.at(player.bootVehicleId);
        if (veh) delete veh.bootPlayerId;
    }

    savePlayerDBParams(player);
    checkPlayerCuffs(player);
    checkDemorgan(player);
    checkMute(player);

    if (player.callId) player.phone.decline(player.callId);

    if (player.sqlId) alt.logs.addLog(`${player.getSyncedMeta("name")}[${player.sqlId}] покинул сервер. IP: ${player.ip}`, 'disconnect', player.account.id, player.sqlId, { socialClub: player.socialId, ip: player.ip });
    if (player.satietyTimer) clearSaveInterval(player.satietyTimer);

    destroyPlayerCars(player);

    if (player.vehicle) alt.setVehSpawnTimer(player.vehicle);
    if (player.admin) alt.v2_reportsUtils.unattachReports(player.sqlId);
    checkGangwar(player);
});

/* Сохранение параметров игрока. */
global.savePlayerDBParams = (player) => {
    if (!player.authTime) player.authTime = new Date().getTime();
    var minutes = parseInt((new Date().getTime() - player.authTime) / 1000 / 60);
    let pos;

    if (player.autoSaloon == true) {
        pos = player.cancelPos;
        player.autoSaloon = false;
    } else {
        pos = player.safeQuitPosition || player.pos;
    }

    //TODO: const hospitalPhase = getHospitalPhase(player);

    DB.Query("UPDATE characters SET minutes=minutes+?,armour=?,health=?,x=?,y=?,z=?,h=?,hospital=? WHERE id=?", [minutes, player.armour, player.health, pos.x, pos.y, pos.z - 1, player.rot.z, false, player.sqlId]);

    //TODO: removeHospitalPatient(player);
}

/* Если игрок в наручниках, то сажаем его. Если игрок в КПЗ, то отнимаем оставшийся срок. */
function checkPlayerCuffs(player) {
    if (player.hasCuffs && player.wanted) {
        var rand = alt.randomInteger(0, 2);
        player.utils.doArrest(rand, (alt.economy["wanted_arrest_time"].value / 1000) * player.wanted);
        player.utils.setWanted(0);
    } else {
        if (player.arrestTime) {
            var now = new Date().getTime() / 1000;
            var diff = now - player.startArrest;
            player.utils.setArrestTime(player.arrestTime - diff);
        }
    }
}
/* Если игрок в наручниках, то сажаем его. Если игрок в КПЗ, то отнимаем оставшийся срок. */
function checkDemorgan(player) {
    if (player.demorgan > 0) {
        var now = parseInt(new Date().getTime() / 1000);
        var diff = player.startDemorgan - now;
        DB.Query("UPDATE characters SET demorgan=? WHERE id=?", [(player.demorgan + Math.ceil(diff / 60)).toFixed(0), player.sqlId]);
    }
}

function checkMute(player) {
    if (player.mute > 0) {
        var now = parseInt(new Date().getTime() / 1000);
        var diff = player.startMute - now;
        DB.Query("UPDATE characters SET mute=? WHERE id=?", [(player.mute + Math.ceil(diff / 60)).toFixed(0), player.sqlId]);
    }

    if (player.vmute > 0) {
        var now = parseInt(new Date().getTime() / 1000);
        var diff = player.startVoiceMute - now;
        DB.Query("UPDATE characters SET vmute=? WHERE id=?", [(player.vmute + Math.ceil(diff / 60)).toFixed(0), player.sqlId]);
    }
}


/* Уничтожение личных авто игрока. */
function destroyPlayerCars(player) {
    if (!player.carIds) return;
    for (var i = 0; i < player.carIds.length; i++) {
        var veh = alt.Vehicle.at(player.carIds[i]);
        if (veh) veh.destroy();
    }
}

function checkGangwar(player) {
    var gangwar = player.getSyncedMeta("gangwar");
    if (gangwar) alt.bandZones[gangwar].leaveCapture(player);
}