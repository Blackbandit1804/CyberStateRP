alt.onClient("reportSystem.sendMessage", (player, reportId, message) => {
    // debug(`reportSystem.sendMessage: ${player.getSyncedMeta("name")} ${reportId} ${message}`);
    var report = alt.v2_reports[reportId];
    if (!report) return player.utils.error(`Тикет с ID: ${reportId} не найден!`);
    return report.pushMessage(player, message);
});

alt.onClient("reportSystem.createTicket", (player, message, reason) => {
    // debug(`reportSystem.createTicket: ${player.getSyncedMeta("name")} ${message} ${reason}`)
    if (reason == "Вопрос") alt.v2_reportsUtils.createHelp(player, message);
    else alt.v2_reportsUtils.createClaim(player, message);
    return player.utils.success(`Ожидайте ответ от Администрации!`);
});

// Carter's console reports
alt.onClient("report.addMessage", (player, data) => {
    // debug(`report.addMessage: ${player.getSyncedMeta("name")} ${data}`)
    data = JSON.parse(data);
    var reportId = data[0];
    var text = data[1].substr(0, 540).trim();
    var report = alt.v2_reports[reportId];
    if (!report) return player.utils.error(`Тикет с ID: ${reportId} не найден!`);
    report.pushMessage(player, text);
});

alt.onClient("report.attach", (player, reportId) => {
    // debug(`report.attach: ${player.getSyncedMeta("name")} ${reportId}`);
    if (!player.admin) return player.utils.error(`Вы не админ!`);
    var report = alt.v2_reports[reportId];
    if (!report) return player.utils.error(`Тикет с ID: ${reportId} не найден!`);
    if (report.adminId && report.adminId != player.sqlId) {
        const rec = alt.Player.getBySqlId(report.adminId);
        return player.utils.error(`Тикет занят администратором ${rec.getSyncedMeta('name')}!`);
    }
    if (!report.adminId) {
        report.setAdminId(player.sqlId);
        player.utils.success(`Тикет закреплен!`);
    } else {
        report.setAdminId(0);
        player.utils.success(`Тикет откреплен!`);
    }
});

alt.onClient("report.close", (player, reportId) => {
    // debug(`report.close: ${player.getSyncedMeta("name")} ${reportId}`);
    if (!player.admin) return player.utils.error(`Вы не админ!`);
    var report = alt.v2_reports[reportId];
    if (!report) return player.utils.error(`Тикет с ID: ${reportId} не найден!`);
    if (!report.adminId) return player.utils.error(`Тикет должен быть закреплен за администратором!`);
    if (report.adminId != player.sqlId) {
        const rec = alt.Player.getBySqlId(report.adminId);
        return player.utils.error(`Тикет занят администратором ${rec.getSyncedMeta("name")}!`);
    }
    if (!report.status) return player.utils.error(`Тикет уже закрыт!`);

    report.setStatus(0);
    player.utils.success(`Тикет закрыт!`);
});

alt.onClient("report.goto", (player, reportId) => {
    if (!player.admin) return player.utils.error(`Вы не админ!`);
    if (player.admin < 2) return player.utils.error(`Ваш уровень мал!`);
    var report = alt.v2_reports[reportId];
    if (!report) return player.utils.error(`Тикет с ID: ${reportId} не найден!`);

    var rec = alt.Player.getBySqlId(report.playerId);
    if (!rec) return player.utils.error(`Игрок оффлайн!`);

    var pos = rec.pos;
    pos.x += 2;
    player.pos = pos;
    player.dimension = rec.dimension;
});

alt.onClient("report.gethere", (player, reportId) => {
    if (!player.admin) return player.utils.error(`Вы не админ!`);
    if (player.admin < 3) return player.utils.error(`Ваш уровень мал!`);
    var report = alt.v2_reports[reportId];
    if (!report) return player.utils.error(`Тикет с ID: ${reportId} не найден!`);

    var rec = alt.Player.getBySqlId(report.playerId);
    if (!rec) return player.utils.error(`Игрок оффлайн!`);

    var pos = player.pos;
    pos.x += 2;
    rec.pos = pos;
    rec.dimension = player.dimension;
    rec.utils.success(`Вы были телепортированы Администрацией`);
});