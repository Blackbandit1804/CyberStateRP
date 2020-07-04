import alt from 'alt';
import game from 'natives';

alt.on(`Client::init`, (view) => {
    alt.on('tablet.police.showPlayerInfo', (data) => {
        view.emit(`pdTablet`, `showPlayerInfo`, data);
    });

    alt.onServer('tablet.police.addCall', (data) => {
        var call = { id: data.id, name: data.name, dist: alt.vdist(data.pos, alt.Player.local.pos), pos: data.pos, message: data.message };
        view.emit(`pdTablet`, `addCall`, call);
    });

    alt.onServer('tablet.police.removeCall', (playerId) => {
        view.emit(`pdTablet`, `removeCall`, playerId);
    }); 

    alt.onServer('tablet.police.addTeamPlayer', (data) => {
        view.emit(`pdTablet`, `addTeamPlayer`, data);
    });

    alt.onServer('tablet.police.removeTeamPlayer', (playerId) => {
        view.emit(`pdTablet`, `removeTeamPlayer`, playerId);
    });

    alt.onServer("tablet.police.addSearchPlayer", (data) => {
        var houses = [];
        
        for (var i = 0; i < data.houses.length; i++) {
            var h = data.houses[i];
            var getStreet = game.getStreetNameAtCoord(h.pos.x, h.pos.y, h.pos.z, 0, 0);
            var adress = game.getStreetNameFromHashKey(getStreet[1]);
            houses.push({ id: h.sqlId, adress: adress });
        }

        data = { playerId: data.playerId, name: data.name, crimes: data.crimes, faction: data.faction, houses: houses };

        view.emit(`pdTablet`, `addSearchPlayer`, data);
    });

    alt.on("tablet.police.setEnable", (enable) => {
        view.emit(`pdTablet`, `enable`, enable);
    });

    view.on("tablet.police.giveFine", (playerId, reason, summ) => {
        var data = { playerId: playerId, summ: summ, reason: reason };
        alt.emitServer('police.giveFine', JSON.stringify(data));
    });

    view.on("tablet.police.giveWanted", (playerId, stars) => {
        var data = { playerId: playerId, stars: stars };
        alt.emitServer('police.giveWanted', JSON.stringify(data));
    });

    view.on("tablet.police.searchPlayer", (event, param) => {
        alt.emitServer('police.searchPlayer', event, param);
    });

    view.on('tablet.police.callTeamHelp', () => {
        alt.emitServer('police.callTeamHelp');
    });

    view.on('tablet.police.callFibHelp', () => {
        alt.emitServer('police.callFibHelp');
    });

    view.on('tablet.police.callHospitalHelp', () => {
        alt.emitServer('police.callHospitalHelp');
    });

    view.on("tablet.police.acceptCall", (playerId, x, y) => {
        alt.emitServer('police.acceptCall', playerId, x, y);
    });

    view.on("setTabletActive", (enable) => {
        alt.tabletActive = enable;
    });

    alt.on("setTabletActive", (enable) => {
        alt.tabletActive = enable;
    });
});
