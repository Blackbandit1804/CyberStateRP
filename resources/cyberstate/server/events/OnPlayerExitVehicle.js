alt.on("playerLeftVehicle", (player, vehicle, seat) => {
    alt.emitClient(player, `playerLeaveVehicle`, vehicle, seat);
    if (vehicle.player == player) delete vehicle.player;
    if (player && player.hasCuffs) alt.emit(`Anim::play`, player, "mp_arresting", 'idle', 1, 49);
    alt.setVehSpawnTimer(vehicle);
    checkPlayerGangwar(player, vehicle, seat);
});

function checkPlayerGangwar(player, vehicle, seat) {
    var gangwar = player.getSyncedMeta("gangwar");
    if (gangwar && seat != 1) vehicle.setSyncedMeta("gangwar", gangwar);
}
