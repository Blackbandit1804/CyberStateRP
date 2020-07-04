import alt from 'alt';
import game from 'natives';

import '/client/events/client/account.js';
import '/client/events/client/events.js';
import '/client/events/client/character.js';
import '/client/events/client/bigmap.js';
import '/client/events/client/selectMenu.js';
import '/client/events/client/forefinger.js';
import '/client/events/client/houseMenu.js';
import '/client/events/client/clothesShop.js';
import '/client/events/client/character_creation';
import '/client/events/client/inventory_events.js';
import '/client/events/client/console_events.js';
import '/client/events/client/prompt_events.js';
import '/client/events/client/vehProp.js';
import '/client/events/client/indicators.js';
import '/client/events/client/chat_events.js';
import '/client/events/client/rent_veh.js';
import '/client/events/client/jobs';
import '/client/events/client/doorControl.js'
import '/client/events/client/closed_doors.js'
import '/client/events/client/interactionMenu_events.js';
import '/client/events/client/peds_events.js';
import '/client/events/client/atm_trigger.js';
import '/client/events/client/gamertag.js';
import '/client/events/client/player_weapon.js';
import '/client/events/client/player_death.js';
import '/client/events/client/reportSystem.js';
import '/client/events/client/telephone_events.js';
import '/client/events/client/green_zones.js';
import '/client/events/client/gang_storage.js';
import '/client/events/client/custom_events/interior_changed.js';
import '/client/events/client/ls_customs';
import '/client/events/client/barbershop';
import '/client/events/client/emotions_events.js';
import '/client/events/client/client_bank.js';
import '/client/events/client/walking_events.js';
import '/client/events/client/bandZones_events.js';
import '/client/events/client/browser.js';
import '/client/events/client/voice.js';
import '/client/events/client/fly.js';
import '/client/events/client/admin.js';
import '/client/events/client/colshapes.js';
import '/client/events/client/smuggling/index.js';
import '/client/events/client/smuggling/info.js';
import '/client/events/client/modal_events.js';
import '/client/events/client/documents_events.js';
import '/client/events/client/autoSaloon_events.js';
import '/client/events/client/ipls.js';
import '/client/events/client/test.js';
import '/client/events/client/playerMenu.js';
import '/client/events/client/pdTablet_events.js';
import '/client/events/client/medicTablet_events.js';
//import '/client/events/client/jobs/smuggling/index.js';
//import '/client/events/client/jobs/smuggling/objectStreamer.js';
import '/client/events/client/choiceMenu_events.js';

function wait(ms) {
    return new Promise(resolve => alt.setTimeout(resolve, ms));
}

const player = alt.Player.local

alt.onServer(`test_scenario`, (scenario) => {
	game.taskStartScenarioInPlace(player.scriptID, scenario, 0, false);
});

alt.isFlood = () => {
    return false;
    if (alt.antiFlood) {
        alt.emit(`nError`, `Anti-FLOOD! ${lastFloodTime/1000} сек.`);
        alt.clearTimeout(floodTimerId);
        lastFloodTime = Math.clamp(lastFloodTime + 1000, 0, MAX_FLOOD_TIME);
        floodTimerId = alt.setTimeout(() => {
            alt.antiFlood = false;
        }, lastFloodTime);
        return true;
    }
    alt.antiFlood = true;
    floodTimerId = alt.setTimeout(() => {
        alt.antiFlood = false;
    }, FLOOD_TIME);
    lastFloodTime = FLOOD_TIME;

    return false;
};

alt.vdist = (posA, posB) => {
    if (!posA || !posB) return Number.MAX_VALUE;
    return Math.sqrt(Math.pow(posA.x - posB.x, 2) + Math.pow(posA.y - posB.y, 2) + Math.pow(posA.z - posB.z, 2));
};

alt.getPlayerByName = (name) => {
    if (!name) return null;
    var result;
    alt.Player.all.forEach((recipient) => {
        if (recipient.getSyncedMeta("name") == name) {
            result = recipient;
            return;
        }
    });
    return result;
};

alt.getNearPlayer = (pos) => {
    var nearPlayer;
    var minDist = 99999;
    alt.Player.all.forEach((rec) => {
        if (rec == player) return;
        var distance = alt.vdist(pos, rec.pos);
        if (distance < minDist) {
            nearPlayer = rec;
            minDist = distance;
        }
    });
    return nearPlayer;
};

Math.clamp = function(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

alt.getHoodPosition = (veh) => {
    if (!veh) return null
    var vehPos = veh.pos;
    var hoodPos = game.getWorldPositionOfEntityBone(veh.scriptID, game.getEntityBoneIndexByName(veh.scriptID, "bonnet"));
    var hoodDist = alt.vdist(vehPos, hoodPos);
    if (hoodDist > 10) return null;
    return game.getOffsetFromEntityInWorldCoords(veh.scriptID, 0, hoodDist + 2, 0);
};

alt.getBootPosition = (veh) => {
    if (!veh) return null;
    var vehPos = veh.pos;
    var bootPos = game.getWorldPositionOfEntityBone(veh.scriptID, game.getEntityBoneIndexByName(veh.scriptID, "boot"));
    var bootDist = alt.vdist(vehPos, bootPos);
    if (bootDist > 10) return null;
    return game.getOffsetFromEntityInWorldCoords(veh.scriptID, 0, -bootDist - 1, 0);
};

alt.getNearVehicle = (pos, range = 10) => {
    var nearVehicle;
    var minDist = 99999;
    alt.Vehicle.all.forEach((veh) => {
        var distToVeh = alt.vdist(pos, veh.pos);
        if (distToVeh < range) {
            var distToHood = alt.vdist(pos, alt.getHoodPosition(veh));
            var distToBoot = alt.vdist(pos, alt.getBootPosition(veh));
            var dist = Math.min(distToVeh, distToHood, distToBoot);
            if (dist < minDist) {
                nearVehicle = veh;
                minDist = dist;
            }
        }
    });
    if (nearVehicle) nearVehicle.minDist = minDist;
    return nearVehicle;
};

alt.debug = (text) => {
    alt.emit("console.push", "debug", text);
}

alt.getNearPlayerOrVehicle = (pos, range = 10) => {
    var nearPlayer = alt.getNearPlayer(pos);
    var nearVehicle = alt.getNearVehicle(pos);
    if (!nearPlayer) return nearVehicle;
    if (!nearVehicle) return nearPlayer;
    var distToPlayer = alt.vdist(pos, nearPlayer.pos);
    if (distToPlayer <= nearVehicle.minDist) return nearPlayer;
    else return nearVehicle;
};

alt.setPassiveMode = (entity, enable) => {
    if (enable) game.setEntityAlpha(entity.scriptID, 100);
    else game.setEntityAlpha(entity.scriptID, 255);
    game.setEntityNoCollisionEntity(entity.scriptID, player.scriptID, !enable);
    game.setEntityNoCollisionEntity(player.scriptID, player.scriptID, !enable);
};

alt.requestAnimDicts = async () => {
    var anims = ["anim@heists@box_carry@", "amb@world_human_bum_slumped@male@laying_on_left_side@base",
        "amb@world_human_gardener_plant@female@base"
    ];
    for (var i = 0; i < anims.length; i++) {
        game.requestAnimDict(anims[i]);
        while (!game.hasAnimDictLoaded(anims[i])) {
            await wait(0);
        }
    }
};
