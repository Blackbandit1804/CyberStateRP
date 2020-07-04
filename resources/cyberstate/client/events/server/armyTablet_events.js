import alt from 'alt';
import game from 'natives';

alt.on(`Client::init`, (view) => {
    alt.onServer('tablet.army.showPlayerInfo', (data) => {
        menu.execute(`alt.emit('armyTablet', { showPlayerInfo: ${JSON.stringify(data)}, event: 'showPlayerInfo' })`);
    });

    alt.onServer('tablet.army.addCall', (data) => {
        menu.execute(`alt.emit('armyTablet', { addCall: ${JSON.stringify(data)}, event: 'addCall'})`);
    });

    alt.onServer('tablet.army.removeCall', (playerId) => { 
        menu.execute(`alt.emit('armyTablet', { removeCall: ${playerId}, event: 'removeCall' })`);
    });

    alt.onServer('tablet.army.addTeamPlayer', (data) => {
        menu.execute(`alt.emit('armyTablet', { addTeamPlayer: ${JSON.stringify(data)}, event: 'addTeamPlayer' })`);
    });

    alt.onServer('tablet.army.removeTeamPlayer', (playerId) => {
        menu.execute(`alt.emit('armyTablet', { removeTeamPlayer: ${playerId}, event: 'removeTeamPlayer' })`);
    });

    alt.on('tablet.army.sendAdvert', (data) => {
        alt.emitServer('army.advert', data);
    });

    alt.onServer("tablet.army.getInfoWareHouse", () => {
        alt.emitServer('army.getInfoWareHouse');
    });

    alt.onServer("tablet.army.setInfoWareHouse", (data) => {
        menu.execute(`alt.emit('armyTablet', { setInfoWareHouse: ${JSON.stringify(data)}, event: 'setInfoWareHouse' })`);
    });

    alt.on("tablet.army.setEnable", (enable) => {
        menu.execute(`alt.emit('armyTablet', { status: ${enable}, event: 'enable' })`);
    });

    alt.on("setTabletActive", (enable) => {
        alt.tabletActive = enable;
    });
});
