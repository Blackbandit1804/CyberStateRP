import alt from 'alt';
import game from 'natives';

alt.on(`Client::init`, (view) => {
    alt.on('tablet.fib.showPlayerInfo', (data) => {
        view.emit(`fibTablet`, `showPlayerInfo`, data);
    });

    alt.onServer('tablet.fib.addCall', (data) => {
        var call = { id: data.id, name: data.name, dist: alt.vdist(data.pos, alt.Player.local.pos), pos: data.pos, message: data.message };
        view.emit(`fibTablet`, `addCall`, call);
    });

    alt.onServer('tablet.fib.removeCall', (playerId) => {
        view.emit(`fibTablet`, `removeCall`, playerId);
    }); 

    alt.onServer('tablet.fib.addTeamPlayer', (data) => {
        view.emit(`fibTablet`, `addTeamPlayer`, data);
    });

    alt.onServer('tablet.fib.removeTeamPlayer', (playerId) => {
        view.emit(`fibTablet`, `removeTeamPlayer`, playerId);
    });

    alt.onServer("tablet.fib.addSearchPlayer", (data) => {
        var houses = [];
        
        for (var i = 0; i < data.houses.length; i++) {
            var h = data.houses[i];
            var getStreet = game.getStreetNameAtCoord(h.pos.x, h.pos.y, h.pos.z, 0, 0);
            var adress = game.getStreetNameFromHashKey(getStreet[1]);
            houses.push({ id: h.sqlId, adress: adress });
        }

        data = { playerId: data.playerId, name: data.name, crimes: data.crimes, faction: data.faction, houses: houses };

        view.emit(`fibTablet`, `addSearchPlayer`, data);
    });

    alt.on("tablet.fib.setEnable", (enable) => {
        view.emit(`fibTablet`, `enable`, enable);
    });

    view.on("tablet.fib.giveFine", (playerId, reason, summ) => {
        var data = { playerId: playerId, summ: summ, reason: reason };
        alt.emitServer('fib.giveFine', JSON.stringify(data));
    });

    view.on("tablet.fib.giveWanted", (playerId, stars) => {
        var data = { playerId: playerId, stars: stars };
        alt.emitServer('fib.giveWanted', JSON.stringify(data));
    });

    view.on("tablet.fib.searchPlayer", (event, param) => {
        alt.emitServer('fib.searchPlayer', event, param);
    });

    view.on('tablet.fib.callTeamHelp', () => {
        alt.emitServer('fib.callTeamHelp');
    });

    view.on('tablet.fib.callFibHelp', () => {
        alt.emitServer('fib.callFibHelp');
    });

    view.on('tablet.fib.callHospitalHelp', () => {
        alt.emitServer('fib.callHospitalHelp');
    });

    view.on("tablet.fib.acceptCall", (playerId, x, y) => {
        alt.emitServer('fib.acceptCall', playerId, x, y);
    });

    view.on("setTabletActive", (enable) => {
        alt.tabletActive = enable;
    });

    alt.on("setTabletActive", (enable) => {
        alt.tabletActive = enable;
    });
});
