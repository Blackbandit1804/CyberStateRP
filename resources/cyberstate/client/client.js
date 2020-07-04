import alt from 'alt';
import game from 'natives';
import '/client/events';
import '/client/events/client/helpers';

let view = null;

alt.onServer('Player::connected', () => {
    view = new alt.WebView('http://resource/client/browser/index.html');
    view.on('View::init', () => {
        alt.emit(`Client::init`, view);
    });
});

alt.on(`Client::init`, () => {
    alt.emitServer("playerBrowserReady");
    game.displayRadar(false);
    game.setEntityCoords(game.playerPedId(), 710.78, 1198.04, 348.52);
    game.setEntityAlpha(game.playerPedId(), 0);
    game.setEntityVisible(game.playerPedId(), true, false);
    game.setGameplayCamRelativeHeading(160);
    game.freezePedCameraRotation(game.playerPedId());
    alt.emit("setFreeze", game.playerPedId(), true);
    alt.emit(`effect`, 'MP_job_load', 100000);
});