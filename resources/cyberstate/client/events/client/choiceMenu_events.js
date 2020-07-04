import alt from 'alt';
import game from 'natives';

alt.on(`Client::init`, (view) => {
    alt.on("choiceMenu.show", (name, values) => {
        if (values) {
            var player;
            if (values.owner) {
                player = alt.getPlayerByName(values.owner);
                if (player && !player.isFamiliar) values.owner = "Гражданин";
            }
            else if (values.name) {
                player = alt.getPlayerByName(values.name);
                if (player && !player.isFamiliar) values.name = "Гражданин";
            }
        }

        view.emit(`choiceMenuAPI.show`, name, JSON.stringify(values));
    });

    view.on("choiceMenu.show", (name, values) => {
        if (values) {
            var player;
            if (values.owner) {
                player = alt.getPlayerByName(values.owner);
                if (player && !player.isFamiliar) values.owner = "Гражданин";
            }
            else if (values.name) {
                player = alt.getPlayerByName(values.name);
                if (player && !player.isFamiliar) values.name = "Гражданин";
            }
        }

        view.emit(`choiceMenuAPI.show`, name, JSON.stringify(values));
    });

    alt.onServer("choiceMenu.show", (name, values) => {
        if (values) {
            var player;
            if (values.owner) {
                player = alt.getPlayerByName(values.owner);
                if (player && !player.isFamiliar) values.owner = "Гражданин";
            }
            else if (values.name) {
                player = alt.getPlayerByName(values.name);
                if (player && !player.isFamiliar) values.name = "Гражданин";
            }
        }

        view.emit(`choiceMenuAPI.show`, name, JSON.stringify(values));
    });

    alt.on("choiceMenu.hide", () => {
        view.emit(`choiceMenuAPI.hide`);
    });

    alt.onServer("choiceMenu.hide", () => {
        view.emit(`choiceMenuAPI.hide`);
    });
});