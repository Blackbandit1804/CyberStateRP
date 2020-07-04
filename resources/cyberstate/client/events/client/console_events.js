import alt from 'alt';
import game from 'natives';

alt.on(`Client::init`, (view) => {
    const localPlayer = alt.Player.local

    alt.onServer("console.push", (type, text) => {
        if (typeof text != "string") text = JSON.stringify(text);
        var types = ['log', 'info', 'warning', 'error', 'debug'];
        var index = types.indexOf(type);
        if (index == -1) return view.emit(`consoleAPI.error`, `Тип лога не распознан!`);
        //menu.execute(`alert('push')`);
        view.emit(`consoleAPI.${type}`, text);
    });

    alt.on("console.push", (type, text) => {
        if (typeof text != "string") text = JSON.stringify(text);
        var types = ['log', 'info', 'warning', 'error', 'debug'];
        var index = types.indexOf(type);
        if (index == -1) return view.emit(`consoleAPI.error`, `Тип лога не распознан!`);
        //menu.execute(`alert('push')`);
        view.emit(`consoleAPI.${type}`, text);
    });

    alt.on("console.enable", (enable) => {
        view.emit(`consoleAPI.enable`, enable);
    });

    view.on("console.send", (message) => {
       /*if (!isFlood())*/ alt.emitServer(`console.send`, message);
    });

    view.on("setConsoleActive", (enable) => {
        alt.consoleActive = enable;
    });

    alt.onServer("console.pushReport", (data) => {
        if (!Array.isArray(data)) data = [data];
        for (var i = 0; i < data.length; i++) {
            if (!data[i]) return;
            data[i].messages.forEach((m) => {
                var rec = alt.getPlayerByName(m.name);
                m.playerRemoteId = (rec) ? rec.getSyncedMeta("id") : "off";
            });
        }
        view.emit(`consoleAPI.pushReport`, JSON.stringify(data));
    });
    

    alt.onServer("console.removeReport", (sqlId) => {
        view.emit(`consoleAPI.removeReport`, sqlId);
    });

    alt.onServer("console.addReportMessage", (sqlId, messages) => {
        if (!Array.isArray(messages)) messages = [messages];
        messages.forEach((m) => {
            var rec = alt.getPlayerByName(m.name);
            m.playerRemoteId = (rec) ? rec.getSyncedMeta("id") : "off";
        });
        view.emit(`consoleAPI.addReportMessage`, sqlId, JSON.stringify(messages));
    });

    alt.onServer("console.chat", (player, text) => {
        view.emit(`consoleAPI.chat`, JSON.stringify(player), text);
    });

    alt.onServer("console.setReportAdminId", (sqlId, adminId) => {
        view.emit(`consoleAPI.setReportAdminId`, sqlId, adminId);
    });
});
