import alt from 'alt';
import game from 'natives';

const localPlayer = alt.Player.local
const AdminInfo = {
    freeze_timer: undefined,
    camera: undefined,
    save_entity: undefined
}

alt.onServer('admin.set.invisible', (type) => {
    game.setEntityVisible(localPlayer.scriptID, type, type);
});