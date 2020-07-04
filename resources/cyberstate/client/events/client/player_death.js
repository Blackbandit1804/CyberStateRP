import alt from 'alt';
import game from 'natives';

const localPlayer = alt.Player.local
var healthData = {
    lastHealth: game.getEntityHealth(localPlayer.scriptID),
    lastArmour: game.getPedArmour(localPlayer.scriptID),
};
debugger;
var healthBar;
let healthBarTimer = 0;
const WAIT_RESPAWN = 5 * 60 * 1000;

alt.on("syncedMetaChange", (entity, key, value) => {
    if (key === "knockDown") {
        var knockDown = value || false;
        game.clearPedTasksImmediately(entity.scriptID);
        if (knockDown) game.setPedToRagdoll(entity.scriptID, 1000, 1000, 0, 0, 0, 0);
        if (entity.id === localPlayer.id) {
            alt.clearInterval(healthBarTimer);
            if (knockDown) {
                healthBar = alt.helpers.timebar.new("СМЕРТЬ", true);
                healthBar.progress = 1;
                healthBar.pbarFgColor = [224, 50, 50, 255];
                healthBar.pbarBgColor = [112, 25, 25, 255];
                healthBarTimer = alt.setInterval(() => {
                    healthBar.progress -= 0.01;
                    if (healthBar.progress <= 0 || !game.getEntityHealth(localPlayer.scriptID)) {
                        alt.clearInterval(healthBarTimer);
                        game.resetPedRagdollTimer(localPlayer.scriptID);
                        alt.emitServer("hospital.respawn");
                        healthBar.visible = false;
                    }
                }, WAIT_RESPAWN / 100);
            } else if (healthBar) {
                healthBar.visible = false;
            }

            alt.emit(`effect`, `MP_Killstreak_Out`, 800);
            if (localPlayer.getSyncedMeta("id") !== null) alt.emit("inventory.enable", !knockDown);
        }
    }
});

alt.on(`update`, () => {
    if (localPlayer.getSyncedMeta("knockDown")) game.disableAllControlActions(0);
    var health = game.getEntityHealth(localPlayer.scriptID);
    var armour = game.getPedArmour(localPlayer.scriptID);

    if (health <= 110) game.setPedToRagdoll(localPlayer.scriptID, 1000, 1000, 0, 0, 0, 0);

    if (healthData.lastHealth > 110 && healthData.lastHealth > health && health <= 110 && health > 100 && !game.isPedSwimming(localPlayer.scriptID)) {
        alt.log(`true ${healthData.lastHealth}, ${health}`)
        if (localPlayer.getSyncedMeta("gangwar")) return;
        alt.emit(`selectMenu.hide`);
        game.clearPedTasksImmediately(localPlayer.scriptID);
        game.setPedToRagdoll(localPlayer.scriptID, 1000, 1000, 0, 0, 0, 0);
        game.setEntityInvincible(localPlayer.scriptID, true);
        game.disablePlayerFiring(localPlayer.scriptID, true);
        if (localPlayer.vehicle) game.taskLeaveVehicle(localPlayer.scriptID, localPlayer.vehicle.scriptID, 16);
        if (localPlayer.getSyncedMeta("id") !== null) alt.emit("inventory.enable", false);
        alt.emitServer("knockDown", true);
    }

    if (healthData.lastHealth <= 110 && healthData.lastHealth < health && health > 110) {
        alt.log(`false ${healthData.lastHealth}, ${health}`)
        game.clearPedTasksImmediately(localPlayer.scriptID);
        game.setPedToRagdoll(localPlayer.scriptID, 1000, 1000, 0, 0, 0, 0);
        game.resetPedRagdollTimer(localPlayer.scriptID);
        game.setEntityInvincible(localPlayer.scriptID, false);
        if (localPlayer.getSyncedMeta("id") !== null) alt.emit("inventory.enable", true);
        alt.emitServer("knockDown", false);
    }

    healthData.lastHealth = health;
    healthData.lastArmour = armour;
});
