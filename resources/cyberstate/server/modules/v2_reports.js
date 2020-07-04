module.exports = {
    Init: () => {
        loadOpenReportsFromDB();
    }
}

function loadOpenReportsFromDB() {
    alt.v2_reports = {};
    initReportsUtils();
    DB.Query("SELECT * FROM v2_reports WHERE status=?", 1, (e, result) => {
        for (var i = 0; i < result.length; i++) {
            initReportUtils(result[i]);
            alt.v2_reports[result[i].id] = result[i];
            alt.v2_reports[result[i].id].messages = [];
        }

        alt.log(`Открытые репорты загружены: ${i} шт.`);

        var keys = Object.keys(alt.v2_reports);
        var array = [];
        keys.forEach((k) => {
            array.push("?");
        });
        DB.Query(`SELECT * FROM v2_reports_messages WHERE reportId IN (${array})`, keys, (e, result) => {
            if(result && result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    var report = alt.v2_reports[result[i].reportId];
                    if (report !== undefined && report !== null) {
                        if (report.messages.length > 30) continue;
                        report.messages.push(result[i]);
                    }
                }
                alt.log(`Сообщения репорта загружены: ${i} шт.`);
            } else {
                alt.log(`No new reports in database found.`);
            }
        });
    });
}

function initReportUtils(report) {
    report.pushMessage = (player, text) => {
        // debug(`report.pushMessage: ${player.getSyncedMeta("name")} ${text}`)
        var message = {
            playerId: player.sqlId,
            name: player.getSyncedMeta("name"),
            text: text.substr(0, 540).escape().trim(),
            date: parseInt(new Date().getTime() / 1000)
        };
        if (player.admin) {
            if (!report.adminId) {
                report.setAdminId(player.sqlId);
            } else if (report.adminId != player.sqlId) {
                return player.utils.error(`Репорт занят другим администратором!`);
            }
        }
        if (report.messages.length > 30) report.messages.splice(0, 1);
        report.messages.push(message);
        DB.Query("INSERT INTO v2_reports_messages (reportId,playerId,name,text,date) VALUES (?,?,?,?,?)",
            [report.id, message.playerId, message.name, message.text, message.date], (e, result) => {
                message.id = result.insertId;
            });

        alt.Player.all.forEach((rec) => {
            if (rec.sqlId && rec.admin) alt.emitClient(rec, `console.addReportMessage`, report.id, message);
            /*else */
            if (rec.sqlId == report.playerId) {
                // Send to report's owner.
                rec.utils.setReport('setNewMessage', {
                    reportId: report.id,
                    name: player.getSyncedMeta("name"),
                    serverId: player.sqlId,
                    playerId: player.sqlId,
                    message: message.text,
                    date: Math.floor(Date.now() / 1000)
                });
            }
        });
    };
    report.setAdminId = (id) => {
        report.adminId = id;
        DB.Query("UPDATE v2_reports SET adminId=? WHERE id=?", [id, report.id]);
        alt.Player.all.forEach((rec) => {
            if (rec.sqlId && rec.admin) alt.emitClient(rec, `console.setReportAdminId`, report.id, report.adminId);
        });
    };
    report.setStatus = (status) => {
        report.status = status;
        DB.Query("UPDATE v2_reports SET status=? WHERE id=?", [status, report.id]);
        alt.Player.all.forEach((rec) => {
            if (rec.sqlId && rec.admin) alt.emitClient(rec, `console.removeReport`, report.id);
        });
        if (!report.status) delete alt.v2_reports[report.id];
    };
}

function initReportsUtils() {
    alt.v2_reportsUtils = {
        createClaim: (player, text) => {
            createReport("claim", player, text);
        },
        createHelp: (player, text) => {
            createReport("help", player, text);
        },
        unattachReports: (playerSqlId) => {
            for (var id in alt.v2_reports) {
                var report = alt.v2_reports[id];
                if (report.adminId == playerSqlId) report.setAdminId(0);
            }
        },
    };
}

function createReport(type, player, text) {
    var time = parseInt(new Date().getTime() / 1000);
    DB.Query("INSERT INTO v2_reports (playerId,type,date) VALUES (?,?,?)", [player.sqlId, type, time], (e, result) => {
        if (e) return alt.log(e);

        var report = {
            id: result.insertId,
            playerId: player.sqlId,
            adminId: 0,
            type: type,
            status: 1,
            date: time,
            messages: [],
        };
        alt.Player.all.forEach((rec) => {
            if (rec.sqlId && rec.admin) alt.emitClient(rec, `console.pushReport`, report);
        });
        initReportUtils(report);
        alt.v2_reports[report.id] = report;

        report.pushMessage(player, text);

        // Send to report's owner.
        player.utils.setReport('setNewReport', {
            sqlId: report.id,
            reason: (report.type == "claim") ? "Жалоба" : "Помощь",
            playerId: player.sqlId,
            adminId: null,
            updated_at: Math.floor(Date.now() / 1000),
            created_at: Math.floor(Date.now() / 1000),
            status: 0
        });
    });
}
