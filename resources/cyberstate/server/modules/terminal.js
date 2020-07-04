module.exports = {
    log: (text, player) => {
        if (player) return alt.emitClient(player, `console.push`, 'log', text);
        alt.Player.all.forEach((rec) => {
            if (rec.admin) alt.emitClient(rec, `console.push`, 'log', text);
        });
        alt.log(text);
    },

    info: (text, player) => {
        if (player) return alt.emitClient(player, `console.push`, 'info', text);
        alt.Player.all.forEach((rec) => {
            if (rec.admin) alt.emitClient(rec, `console.push`, 'info', text);
        });
        alt.log(text);
    },

    warning: (text, player) => {
        if (player) return alt.emitClient(player, `console.push`, 'warning', text);
        alt.Player.all.forEach((rec) => {
            if (rec.admin) alt.emitClient(rec, `console.push`, 'warning', text);
        });
        alt.log(text);
    },

    error: (text, player) => {
        if (player) return alt.emitClient(player, `console.push`, 'error', text);
        alt.Player.all.forEach((rec) => {
            if (rec.admin) alt.emitClient(rec, `console.push`, 'error', text);
        });
        alt.log(text);
    },

    debug: (text, player) => {
        if (player) return alt.emitClient(player, `console.push`, 'debug', text);
        alt.Player.all.forEach((rec) => {
            if (rec.admin) alt.emitClient(rec, `console.push`, 'debug', text);
        });
        alt.log(text);
    },

    disable: (player, enable) => {
        alt.emitClient(player, `console.disable`, enable);
    },
}
