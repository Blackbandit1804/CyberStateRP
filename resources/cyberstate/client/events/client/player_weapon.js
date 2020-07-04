import alt from 'alt';
import game from 'natives';

const localPlayer = alt.Player.local

localPlayer.getAmmoWeapon = (weaponhash) => game.getAmmoInPedWeapon(localPlayer.scriptID, weaponhash);
localPlayer.removeWeapon = (weaponhash) => game.removeWeaponFromPed(localPlayer.scriptID, weaponhash);
localPlayer.setWeaponAmmo = (weaponhash, ammo) => game.setPedAmmo(localPlayer.scriptID, weaponhash, ammo);
localPlayer.currentWeapon = () => game.getCurrentPedWeapon(localPlayer.scriptID);

alt.on("removeWeapon", (weaponhash) => {
    localPlayer.removeWeapon(weaponhash);
});

alt.onServer("addWeaponAmmo", (weaponhash, add) => {
    localPlayer.setWeaponAmmo(weaponhash, add);
});

alt.on("weapon.throw", (itemSqlId, weaponHash) => {
    var ammo = localPlayer.getAmmoWeapon(weaponHash);
    alt.emitServer(`weapon.throw`, itemSqlId, ammo);
});

alt.on("playerWeaponShot", () => {
    var weaponHash = localPlayer.currentWeapon();
    var ammo = localPlayer.getAmmoWeapon(weaponHash);
    if (ammo % 10 == 0) alt.emitServer("weapon.updateAmmo", weaponHash, ammo);
});