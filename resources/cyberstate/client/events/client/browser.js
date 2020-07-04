import alt from 'alt';
import game from 'natives';

alt.on(`Client::init`, (view) => {
    var safeZone = null;

    alt.on('update', () => {
        var lastsafezone = game.getSafeZoneSize();
        var screen = game.getActiveScreenResolution(0, 0);
        if (lastsafezone != safeZone) {
            safeZone = lastsafezone;
            view.emit(`safeZone.update`, screen[1], screen[2], safeZone);
        }
    });
});