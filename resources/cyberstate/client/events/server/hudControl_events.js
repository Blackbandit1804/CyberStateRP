import alt from 'alt';
import game from 'natives';

alt.on(`Client::init`, (view) => {
    let lastServerOnline = 0;

    alt.onServer('hudControl.setData', (data) => {
        view.emit(`hudControl`, 'setData', data);
    });

    alt.onServer('hudControl.updateMoney', (money) => {
        var data = { money: money };
        view.emit(`hudControl`, 'updateMoney', data);
    });

    alt.onServer('hudControl.updateWanted', (wanted) => {
        var data = { wanted: wanted };
        view.emit(`hudControl`, 'updateWanted', data);
    });
    
    alt.onServer('hudControl.updateBank', (bank) => {
        var data = { bank: bank };
        view.emit(`hudControl`, 'updateBank', data);
    });

    alt.on("hudControl.enable", (enable) => {
        view.emit(`hudControl`, 'enable', enable);
    });
    
    alt.on('update', () => {
        game.hideHudComponentThisFrame(1);
        game.hideHudComponentThisFrame(2);
        game.hideHudComponentThisFrame(3);
        game.hideHudComponentThisFrame(13);
        game.hideHudComponentThisFrame(4);

        if (alt.Player.all.length != lastServerOnline) {
            lastServerOnline = alt.Player.all.length;
            view.emit(`hudControl`, 'setOnline', lastServerOnline);
        }
    });
});