import alt from 'alt';
import game from 'natives';

const localPlayer = alt.Player.local
localPlayer.belt = false;

alt.on('keyup', (key) => {
    if (key == 100) {
        if (alt.chatActive || alt.consoleActive) return;
        var veh = localPlayer.vehicle;
        if (!veh) return;
        var leftSignal = veh.getSyncedMeta(`leftSignal`);
        var rightSignal = veh.getSyncedMeta(`rightSignal`);
        var isDriver = game.getPedInVehicleSeat(veh.scriptID, -1) == localPlayer.scriptID;
    
        if ((!leftSignal || !rightSignal) && isDriver && !alt.isFlood()) {
            alt.emitServer(`setLeftSignal`, !leftSignal);
        }
    } else if (key == 102) {
        if (alt.chatActive || alt.consoleActive) return;
        var veh = localPlayer.vehicle;
        if (!veh) return;
        var leftSignal = veh.getSyncedMeta(`leftSignal`);
        var rightSignal = veh.getSyncedMeta(`rightSignal`);
        var isDriver = game.getPedInVehicleSeat(veh.scriptID, -1) == localPlayer.scriptID;
    
        if ((!leftSignal || !rightSignal) && isDriver && !alt.isFlood()) {
            alt.emitServer(`setRightSignal`, !rightSignal);
        }
    } else if (key == 101) {
        if (alt.chatActive || alt.consoleActive) return;
        var veh = localPlayer.vehicle;
        if (!veh) return;
        var leftSignal = veh.getSyncedMeta(`leftSignal`);
        var rightSignal = veh.getSyncedMeta(`rightSignal`);
        var isDriver = game.getPedInVehicleSeat(veh.scriptID, -1) == localPlayer.scriptID;
        if (!isDriver || alt.isFlood()) return;
    
        if (leftSignal && rightSignal) {
            alt.emitServer(`setEmergencySignal`, false);
        } else {
            alt.emitServer(`setEmergencySignal`, true);
        }
    } else if (key == 89) {
        if (alt.chatActive || alt.consoleActive) return;
        var veh = localPlayer.vehicle;
        if (!veh) return;
        var isDriver = game.getPedInVehicleSeat(veh.scriptID, -1) == localPlayer.scriptID;
        if (!isDriver || game.getVehicleClass(veh.scriptID) != 18 || alt.isFlood()) return;
        alt.emitServer(`sirenSound.on`);
    } else if (key == 66) {
        if (alt.chatActive || alt.consoleActive) return;
        var veh = localPlayer.vehicle;
        if (!veh) return;
        var isDriver = game.getPedInVehicleSeat(veh.scriptID, -1) == localPlayer.scriptID;
        if (!isDriver || alt.isFlood()) return;
    
        localPlayer.belt = !localPlayer.belt;
        alt.emitServer(`belt.putOn`, localPlayer.belt);
        //TODO: menu.execute(`alt.emit('carSystem', { belt: ${!localPlayer.belt}, event: 'BeltHandler' })`);
    }
});