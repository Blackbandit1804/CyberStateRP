import alt from 'alt';
import game from 'natives';

const bigmap = [];

bigmap.status = 0;
bigmap.timer = null;

game.setRadarZoom(1.0);
game.setBigmapActive(false, false);

alt.on('update', () => {
    if (alt.chatActive || alt.consoleActive || alt.inventoryActive || alt.playerMenuActive) return;

    game.disableControlAction(0, 48, true);
    if (game.isDisabledControlJustPressed(0, 48)) {
        if (bigmap.status === 0) {
            game.setRadarZoom(0.0);
            bigmap.status = 1;

            bigmap.timer = alt.setTimeout(() => {
                game.setBigmapActive(false, true);
                game.setRadarZoom(1.0);

                bigmap.status = 0;
                bigmap.timer = null;
            }, 10000);
        } else if (bigmap.status === 1) {
            if (bigmap.timer != null) {
                alt.clearTimeout(bigmap.timer);
                bigmap.timer = null;
            }

            game.setBigmapActive(true, false);
            game.setRadarZoom(0.0);
            bigmap.status = 2;

            //TODO: menu.execute('mapAPI.on()');

            bigmap.timer = alt.setTimeout(() => {
                game.setBigmapActive(false, true);
                game.setRadarZoom(1.0);

                bigmap.status = 0;
                bigmap.timer = null;
                //menu.execute('mapAPI.off()');
            }, 10000);
        } else {
            if (bigmap.timer != null) {
                alt.clearTimeout(bigmap.timer);
                bigmap.timer = null;
            }

            game.setBigmapActive(false, false);
            game.setRadarZoom(1.0);
            bigmap.status = 0;

            //TODO: menu.execute('mapAPI.off()');
        }
    }
});
