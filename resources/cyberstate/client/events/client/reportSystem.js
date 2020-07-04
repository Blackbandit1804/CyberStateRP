import alt from 'alt';
import game from 'natives';

String.prototype.escape = function() {
    return this.replace(/[&"'\\]/g, "");
};

alt.on(`Client::init`, (view) => {
    view.on("reportSystem.createTicket", (message, reason) => {
        message = message.substr(0, 540).escape().trim();
        alt.emitServer("reportSystem.createTicket", message, reason);
    });

    view.on("reportSystem.closeTicket", (reportId) => {
        alt.emitServer("reportSystem.closeTicket", reportId);
    });

    view.on("reportSystem.sendMessage", (reportId, message) => {
        message = message.substr(0, 540).escape().trim();
        alt.emitServer("reportSystem.sendMessage", reportId, message);
    });

    alt.onServer("reportSystem.reports", (reports) => {
        reports = JSON.parse(reports);
        
        view.emit(`playerMenu`, `reports`, reports);
    });

    alt.onServer("reportSystem.messages", (messages) => {
        messages = JSON.parse(messages);

        view.emit(`playerMenu`, `messages`, messages);
    });

    alt.onServer("reportSystem.close", (data) => {
        view.emit(`playerMenu`, `closeTicket`, JSON.stringify(data));
    });

    view.on("reportSystem.addReport", (data) => {
        view.emit(`playerMenu`, `addReport`, JSON.stringify(data));
    });
});
