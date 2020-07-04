//const Discord = require('discord.js');

module.exports.Init = function() {
    alt.logs = [];
    initLogsUtils();
    alt.log("Система логов загружена");
}

function initLogsUtils() {
    alt.logs.addLog = (message, type, accountId, characterId, data) => {
        DB.Query("INSERT INTO logs (type, accountId, characterId, message, data) VALUES (?,?,?,?,?)", [type, accountId, characterId, message, JSON.stringify(data)]);
    };
}
