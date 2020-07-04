import alt from 'alt';
import game from 'natives';

const player = alt.Player.local
const maxStringLength = 50;

player.overlayColors = {};
alt.Vehicle.mileageTimer = 0;
alt.Vehicle.mileageUpdater = 0;

function wait(ms) {
    return new Promise(resolve => alt.setTimeout(resolve, ms));
}

alt.on(`Client::init`, (view) => {
    var localVarHandlers = {
        "admin": (value) => {
            if (value > 0) alt.emit("console.enable", true);
            else alt.emit("console.enable", false);
        },
        "playerPings": (value) => {
            //alert("playerPings");
        },
        "money": (value) => {
            alt.emit("inventory.setMoney", value);
        },
        "bank": (value) => {
            alt.emit("inventory.setBankMoney", value);
        },
        "wanted": (value) => {
            //alt.game.gameplay.setFakeWantedLevel(value);
        },
        "build": (value) => {
            view.emit(`userInterface::build`, value);
        },
        "godmode": (value) => {
            // player.setProofs(value, value, value, value, value, value, value, value);
            game.setPlayerInvincible(game.playerPedId(), value);
        },
    };
    
    var vehicleVarHandlers = {
        "mileage": (value) => {
            if (!alt.Vehicle.mileageTimer) alt.Vehicle.startMileageCounter();
        }
    };

    alt.onServer("nSuccess", (text) => {
        alt.emit("BN_Show", text, true, -1, 166);
    });
    
    alt.onServer("nError", (text) => {
        alt.emit("BN_Show", text, true, -1, 174);
    });
    
    alt.onServer(`Clothes::set`, (componentNumber, drawable, texture, palette) => {
        game.setPedComponentVariation(game.playerPedId(), componentNumber, drawable, texture, palette);
    });

    alt.onServer(`Prop::set`, (componentId, drawableId, TextureId, attach = true) => {
        if (drawableId !== -1) game.setPedPropIndex(game.playerPedId(), componentId, drawableId, TextureId, attach)
        else game.clearPedProp(game.playerPedId(), componentId)
    });

    alt.onServer(`Hair::set::color`, (colorID, highlightColorID) => {
        game.setPedHairColor(game.playerPedId(), colorID, highlightColorID);
    });

    alt.onServer(`Head::set::blend`, (shapeFirstID, shapeSecondID, shapeThirdID, skinFirstID, skinSecondID, skinThirdID, shapeMix, skinMix, thirdMix) => {
        game.setPedHeadBlendData(game.playerPedId(), shapeFirstID, shapeSecondID, shapeThirdID, skinFirstID, skinSecondID, skinThirdID, shapeMix, skinMix, thirdMix, false); 
    });

    alt.onServer(`Face::set::feature`, (faceFeatures) => {
        for (var i = 0; i < faceFeatures.length; i++) {
            game.setPedFaceFeature(game.playerPedId(), i, faceFeatures[i]);
        }
        
        player.faceFeatures = faceFeatures;
    });

    alt.onServer(`Face::set::eye::color`, (color) => {
        game.setPedEyeColor(game.playerPedId(), color);
    });

    alt.onServer("BN_Show", (message, flashing = false, textColor = -1, bgColor = -1, flashColor = [255, 255, 255, 200]) => {
        if (textColor > -1) game.setNotificationColorNext(textColor);
        if (bgColor > -1) game.setNotificationBackgroundColor(bgColor);
        if (flashing) game.setNotificationFlashColor(flashColor[0], flashColor[1], flashColor[2], flashColor[3]);
    
        game.setNotificationTextEntry("CELL_EMAIL_BCON");
        for (let i = 0, msgLen = message.length; i < msgLen; i += maxStringLength) game.addTextComponentSubstringPlayerName(message.substr(i, Math.min(maxStringLength, message.length - i)));
        game.drawNotification(flashing, true);
    });
    
    alt.onServer("BN_ShowWithPicture", (title, sender, message, notifPic, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [255, 255, 255, 200]) => {
        if (textColor > -1) game.setNotificationColorNext(textColor);
        if (bgColor > -1) game.setNotificationBackgroundColor(bgColor);
        if (flashing) game.setNotificationFlashColor(flashColor[0], flashColor[1], flashColor[2], flashColor[3]);
    
        game.setNotificationTextEntry("CELL_EMAIL_BCON");
        for (let i = 0, msgLen = message.length; i < msgLen; i += maxStringLength) game.addTextComponentSubstringPlayerName(message.substr(i, Math.min(maxStringLength, message.length - i)));
        game.setNotificationMessage(notifPic, notifPic, flashing, icon, title, sender);
        game.drawNotification(false, true);
    });

    alt.onServer(`Head::set::overlay`, (overlayID, index, opacity, color) => {
        player.overlayColors[overlayID] = [color, color];

        game.setPedHeadOverlay(game.playerPedId(), overlayID, index, opacity);
    });
    
    alt.onServer(`Head::set::overlay::color`, (overlayID, colorType = 0, firstColorID, secondColorID) => {
        game.setPedHeadOverlayColor(game.playerPedId(), overlayID, colorType, firstColorID, secondColorID);
    });

    alt.onServer(`Anim::play`, async (animDict, animName, speed, flag) => {
        game.requestAnimDict(animDict);

        while (!game.hasAnimDictLoaded(animDict)) {
            await wait(0);
        }

        game.taskPlayAnim(player.scriptID, animDict, animName, speed, 0, -1, flag, 0, false, false, false);
    });

    alt.onServer("setLocalVar", (key, value) => {
        alt.clientStorage[key] = value;
        view.emit(`setLocalVar`, key, JSON.stringify(value));
        if (localVarHandlers[key]) localVarHandlers[key](value);
    });

    alt.onServer("setVehicleVar", (vehicle, key, value) => {
        vehicle[key] = value;
        if (vehicleVarHandlers[key]) vehicleVarHandlers[key](value);
    });
});