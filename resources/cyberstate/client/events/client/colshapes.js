import alt from 'alt';

let inColshapeUse = false;

alt.onServer("Colshape::enable", (enable) => {
    inColshapeUse = enable;
});

alt.on(`keyup`, (key) => {
    if (key === 0x45) {
        if (alt.selectMenuActive && inColshapeUse) return alt.emit(`selectMenu.hide`);
        if (inColshapeUse) {
            alt.emitServer("colshapeHandler");
            alt.emit("prompt.hide");
        }
    }
});