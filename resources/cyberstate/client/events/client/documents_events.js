import alt from 'alt';
import game from 'natives';

alt.on(`Client::init`, (view) => {
    view.on("setDocumentsActive", (enable) => {
        alt.documentsActive = enable;
    });

    alt.onServer("documents.showAll", (data) => {
        data.houses = convertDocHousesToStreets(data.houses);
        view.emit(`documents`, `showAll`, true, data);
    });

    alt.onServer("documents.showPassport", (data) => {
        view.emit(`documents`, `showPassport`, true, data);
    });

    alt.onServer("documents.showLicenses", (data) => {
        view.emit(`documents`, `showLicenses`, true, data);
    });

    alt.onServer("documents.showFaction", (data) => {
        if (data.faction == 2) {
            view.emit(`police`, data);
        } else if (data.faction == 3) {
            view.emit(`sheriff`, data);
        } else if (data.faction == 4) {
            view.emit(`fib`, data);
        } else if (data.faction == 5) {
            view.emit(`medic`, data);
        }
    });
});

function convertDocHousesToStreets(houses) {
    for (var i = 0; i < houses.length; i++) {
        let getStreet = game.getStreetNameAtCoord(houses[i].position.x, houses[i].position.y, houses[i].position.z, 0, 0);
        let streetName = game.getStreetNameFromHashKey(getStreet[1]);
        houses[i] = ` ${streetName}, №${houses[i].id}`;
    }
    return houses;
}
