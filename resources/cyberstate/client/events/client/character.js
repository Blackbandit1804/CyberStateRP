import alt from 'alt';
import game from 'natives';

alt.on(`Client::init`, (view) => {
    const player = alt.Player.local
    const storage = alt.LocalStorage.get();
    let timer;

    view.on("authCharacter", (characterIndex) => {
        game.playSoundFrontend(-1, "Start", "DLC_HEIST_HACKING_SNAKE_SOUNDS", true);
        alt.emitServer("authCharacter", characterIndex);
        alt.emit("finishMoveCam");
		alt.emit("setFreeze", game.playerPedId(), false);
    });

    view.on("account.setAutoLogin", (enabled, loginOrEmail, password) => {
        if (enabled) {
            storage.set('account', {
                loginOrEmail: loginOrEmail,
                password: password
            });
        } else delete storage.delete('account');

        storage.save();
    });

    alt.onServer("throw.fromvehicle.withkey", (id) => {
        alt.emit("modal.hide");
        if (!player.vehicle) return alt.emit(`nError`, `Вы не в транспорте!`);
        if (player.getSyncedMeta("id") == id) return alt.emit(`nError`, `Вы не можете себя выкинуть!`);
        /* TODO: let players = getOccupants(player.vehicle.remoteId);
        if (players.length < 2) return alt.emit(`nError`, `Транспорт пустой!`);*/
        for (let i = 0; i < players.length; i++) {
            if (players[i] == id) return alt.emitServer("item.throwfromvehicle", player.vehicle.id, players[i]);
        }
        return alt.emit(`nError`, "Пассажир не найден!");
    });

    alt.on(`update`, () => {
        game.hideHudComponentThisFrame(6);
        game.hideHudComponentThisFrame(7);
        game.hideHudComponentThisFrame(8);
        game.hideHudComponentThisFrame(9);
    });

    alt.onServer(`Vehicle::leave`, (entity) => {
        game.taskLeaveVehicle(player.scriptID, entity.scriptID, 16);
    });

    alt.onServer(`Vehicle::putInto`, (vehicle, seat) => {
        if (seat === 1) seat = -1;
        if (seat === 2) seat = 0;
        if (seat === 3) seat = 1;
        if (seat === 4) seat = 2;
        let counter = 0;
        timer = alt.setInterval(() => {
            if (vehicle.scriptID != 0) {
                game.setPedIntoVehicle(game.playerPedId(), vehicle.scriptID, seat);
                alt.clearInterval(timer);
            }

            if (counter++ > 3000) {
                alt.clearInterval(timer);
            }
        }, 50);
    });

    alt.onServer(`Vehicle::repair`, (vehicle) => {
        game.setVehicleFixed(vehicle.scriptID);
        game.setVehicleTyreBurst(vehicle.scriptID, 1, 1, 1000.00)
        game.setVehicleUndriveable(vehicle.scriptID, true)
        game.stopEntityFire(vehicle.scriptID);
    });

    alt.on(`Vehicle::repair`, (vehicle) => {
        game.setVehicleFixed(vehicle.scriptID);
        game.setVehicleTyreBurst(vehicle.scriptID, 1, 1, 1000.00)
        game.setVehicleUndriveable(vehicle.scriptID, true)
        game.stopEntityFire(vehicle.scriptID);
    });

    alt.Vehicle.atRemoteId = (vehicleId) => {
        if (!vehicleId) return null;
        var result;
        alt.Vehicle.all.forEach((veh) => {
            if (veh.id == vehicleId) {
                result = veh;
                return;
            }
        });
        return result;
    };

    alt.Vehicle.exists = (vehicle) => {
        if (!vehicle) return null;
        var result = false;
        alt.Vehicle.all.forEach((veh) => {
            if (veh == vehicle) {
                result = true;
                return;
            }
        });
        return result;
    };

    alt.Player.exists = (player) => {
        if (!player) return null;
        var result = false;
        alt.Player.all.forEach((rec) => {
            if (rec == player) {
                result = true;
                return;
            }
        });
        return result;
    };

});
