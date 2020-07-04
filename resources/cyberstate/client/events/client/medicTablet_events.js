import alt from 'alt';
import game from 'natives';

alt.on(`Client::init`, (view) => {
    view.on('tablet.medic.sendAdvert', (data) => {
        alt.emitServer('hospital.advert', JSON.stringify(data));
    });

    alt.onServer('tablet.medic.addCall', (data) => {
        var call = { id: data.id, name: data.name, dist: alt.vdist(data.pos, alt.Player.local.pos), pos: data.pos, message: data.message };
        view.emit(`medicTablet`, `addCall`, call);
    });

    alt.onServer('tablet.medic.removeCall', (playerId) => {
        view.emit(`medicTablet`, `removeCall`, playerId);
    });

    alt.onServer('tablet.medic.addTeamPlayer', (data) => {
        view.emit(`medicTablet`, `addTeamPlayer`, data);
    });

    alt.onServer('tablet.medic.removeTeamPlayer', (playerId) => {
        view.emit(`medicTablet`, `removeTeamPlayer`, playerId);
    });

    view.on('tablet.medic.callTeamHelp', () => {
        alt.emitServer('hospital.callTeamHelp');
    });

    view.on('tablet.medic.callPoliceHelp', () => {
        alt.emitServer('hospital.callPoliceHelp');
    });

    alt.on("tablet.medic.setEnable", (enable) => {
        view.emit(`medicTablet`, `enable`, enable);
    });

    view.on("tablet.medic.acceptCall", (playerId, x, y) => {
        alt.emitServer('hospital.acceptCall', playerId, x, y);
    });

    view.on("setTabletActive", (enable) => {
        alt.tabletActive = enable;
    });
});
