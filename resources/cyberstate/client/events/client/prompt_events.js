import alt from 'alt';

alt.on(`Client::init`, (view) => {
    alt.on("prompt.show", (text, header = "Подсказка") => {
        view.emit(`promptAPI.show`, text, header);
    });

    alt.onServer("prompt.show", (text, header = "Подсказка") => {
        view.emit(`promptAPI.show`, text, header);
    });

    alt.onServer("prompt.showByName", (text, header = "Подсказка") => {
        view.emit(`promptAPI.showByName`, text, header);
    });

    alt.on("prompt.hide", () => {
        view.emit(`promptAPI.hide`);
    });

    alt.onServer("prompt.hide", () => {
        view.emit(`promptAPI.hide`);
    });
});