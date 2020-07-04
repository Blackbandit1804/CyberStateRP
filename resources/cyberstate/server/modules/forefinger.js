alt.onClient("fpsync.update", (player, camPitch, camHeading) => {
    alt.emitClient(player, "fpsync.update", player.sqlId, camPitch, camHeading);
});