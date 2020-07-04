import alt from 'alt';
import game from 'natives';

alt.on(`Client::init`, (view) => {
    alt.on('keydown', (key) => {
        if (alt.isFlood()) return;
        if (key === 0x45) {
            alt.emitServer(`houseHandler`);
        } else if (key === 0x48) {
            alt.emitServer(`houseMenuHandler`);
        }
    });

    view.on("setHouseMenuActive", (enable) => {
        alt.houseMenuActive = enable;
    });

    alt.onServer("houseMenu.show", (params) => {
        var houseOwner = "";
        if (params[3]) houseOwner = params[3];

        var haveGarage = "Отсутствует";
        if (params[4]) haveGarage = "Присутствует";

        var garagePlace = "";
        if (params[4]) garagePlace = "1";
        else garagePlace = "Отсутствует";

        let getStreet = game.getStreetNameAtCoord(params[7].x, params[7].y, params[7].z, 0, 0);
        let streetName = game.getStreetNameFromHashKey(getStreet[1]);

        view.emit(`houseMenu.__vue__.showMenu`, params, houseOwner, streetName, haveGarage, garagePlace);
        alt.emit(`Cursor::show`, true);
    });

    var houseMenuStatus = false;

    alt.onServer("houseOwnerMenu.update", (update, lock) => {
        if (!update) {
            if (!houseMenuStatus) view.emit(`houseMenu.__vue__.showOwnerMenu`, lock);
            else view.emit(`houseMenu.__vue__.hideOwnerMenu`);

            houseMenuStatus = !houseMenuStatus;
            alt.emit(`Cursor::show`, houseMenuStatus);
        } else {
            view.emit(`houseMenu.__vue__.showOwnerMenu`, lock);
        }
    });

    view.on("inspectHouse", () => {
        if (!alt.isFlood()) alt.emitServer(`goEnterHouse`); //goInspectHouse");
    });

    view.on("lockUnlockHouse", () => {
        if (!alt.isFlood()) alt.emitServer(`goLockUnlockHouse`);
    });

    view.on("enterHouse", () => {
        if (!alt.isFlood()) alt.emitServer(`goEnterHouse`);
    });

    view.on("enterGarage", () => {
        if (!alt.isFlood()) alt.emitServer(`goEnterGarage`);
    });

    view.on("exitHouse", () => {
        if (!alt.isFlood()) alt.emitServer(`goEnterStreet`);
    });

    alt.onServer("exitHouse", () => {
        if (!alt.isFlood()) alt.emitServer(`goEnterStreet`);
    });

    view.on("buyHouse", () => {
        if (!alt.isFlood()) alt.emitServer(`goBuyHouse`);
    });

    view.on("invitePlayer", () => {
        if (!alt.isFlood()) alt.emit(`modal.show`, "invite_player_inhouse", {});
    });

    view.on("sellHouseToGov", () => {
        if (!alt.isFlood()) alt.emitServer(`sellHouseToGov`);
    });

    view.on("sellHouseToPlayer", () => {
        if (!alt.isFlood()) alt.emit(`modal.show`, "sell_player_house", {});
    });

    view.on("exitHouseMenu", (hidemenu) => {
        if (hidemenu) view.emit(`houseMenu.__vue__.exitMenu`);
        alt.emit(`Cursor::show`, false);
    });

    alt.onServer("exitHouseMenu", (hidemenu) => {
        if (hidemenu) view.emit(`houseMenu.__vue__.exitMenu`);
        alt.emit(`Cursor::show`, false);
    });
});
