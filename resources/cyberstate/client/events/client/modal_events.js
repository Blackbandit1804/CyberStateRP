import alt from 'alt';

alt.on(`Client::init`, (view) => {
    alt.on("modal.show", (modalName, values = null) => {
        view.emit(`modalAPI.show`, modalName, JSON.stringify(values));
    });

    alt.on("modal.hide", () => {
        view.emit(`modalAPI.hide`);
    });

    alt.onServer("modal.show", (modalName, values = null) => {
        view.emit(`modalAPI.show`, modalName, JSON.stringify(values));
    });

    alt.onServer("modal.hide", () => {
        view.emit(`modalAPI.hide`);
    });
});