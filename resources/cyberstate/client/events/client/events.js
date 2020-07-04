import alt from 'alt';
import game from 'natives';

const player = alt.Player.local
const storage = alt.LocalStorage.get();
const maxStringLength = 50;

alt.clientStorage = {};

alt.cursorState = false;

alt.on(`Client::init`, (view) => {
    function draw3dText(x, y, z, name) {
        const [bol, _x, _y] = game.getScreenCoordFromWorldCoord(x, y, z);
        const camCord = game.getGameplayCamCoords();
        const dist = game.getDistanceBetweenCoords(camCord.x, camCord.y, camCord.z, x, y, z, 1)
    
        if (dist > 20) return;
    
        let scale = (4.00001/dist) * 0.3
        if (scale > 0.2)
            scale = 0.2;
    
        const fov = (1/game.getGameplayCamFov())*100;
        scale = scale*fov;
      
        if (bol) {
            game.setTextScale(scale, scale);
            game.setTextFont(0);
            game.setTextProportional(true);
            game.setTextColour(255, 255, 255, 255);
            game.setTextDropshadow(0, 0, 0, 0, 255);
            game.setTextEdge(2, 0, 0, 0, 150);
            game.setTextDropShadow();
            game.setTextOutline();
            game.setTextCentre(true);
            game.beginTextCommandDisplayText("STRING");
            game.addTextComponentSubstringPlayerName(name);
            game.endTextCommandDisplayText(_x,_y + 0.025);
        }
    }

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
    alt.on("nSuccess", (text) => {
        alt.emit("BN_Show", text, true, -1, 166);
    });
    
    alt.on("nError", (text) => {
        alt.emit("BN_Show", text, true, -1, 174);
    });

    alt.on(`Clothes::set`, (componentNumber, drawable, texture, palette) => {
        game.setPedComponentVariation(game.playerPedId(), componentNumber, drawable, texture, palette);
    });

    alt.on(`Prop::set`, (componentId, drawableId, TextureId, attach = true) => {
        game.setPedPropIndex(game.playerPedId(), componentId, drawableId, TextureId, attach);
    });

    alt.on(`Hair::set::color`, (colorID, highlightColorID) => {
        game.setPedHairColor(game.playerPedId(), colorID, highlightColorID);
    });

    alt.on(`Head::set::blend`, (shapeFirstID, shapeSecondID, shapeThirdID, skinFirstID, skinSecondID, skinThirdID, shapeMix, skinMix, thirdMix, isParent = false) => {
        game.setPedHeadBlendData(game.playerPedId(), shapeFirstID, shapeSecondID, shapeThirdID, skinFirstID, skinSecondID, skinThirdID, shapeMix, skinMix, thirdMix, isParent); 
    });

    alt.on(`Face::set::feature`, (faceFeatures) => {
        for (var i = 0; i < faceFeatures.length; i++) {
            game.setPedFaceFeature(game.playerPedId(), faceFeatures[i], 1);
        }
        
        player.faceFeatures = faceFeatures;
    });

    alt.on(`Face::set::eye::color`, (color) => {
        game.setPedEyeColor(game.playerPedId(), color);
    });

    alt.on(`Head::set::overlay`, (overlayID, index, opacity, color) => {
        player.overlayColors[overlayID] = [color, color];
        
        game.setPedHeadOverlay(game.playerPedId(), overlayID, index, opacity);
    });
    
    alt.on("BN_Show", (message, flashing = false, textColor = -1, bgColor = -1, flashColor = [255, 255, 255, 200]) => {
        if (textColor > -1) game.setNotificationColorNext(textColor);
        if (bgColor > -1) game.setNotificationBackgroundColor(bgColor);
        if (flashing) game.setNotificationFlashColor(flashColor[0], flashColor[1], flashColor[2], flashColor[3]);
    
        game.setNotificationTextEntry("CELL_EMAIL_BCON");
        for (let i = 0, msgLen = message.length; i < msgLen; i += maxStringLength) game.addTextComponentSubstringPlayerName(message.substr(i, Math.min(maxStringLength, message.length - i)));
        game.drawNotification(flashing, true);
    });
    
    alt.on("BN_ShowWithPicture", (title, sender, message, notifPic, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [255, 255, 255, 200]) => {
        if (textColor > -1) game.setNotificationColorNext(textColor);
        if (bgColor > -1) game.setNotificationBackgroundColor(bgColor);
        if (flashing) game.setNotificationFlashColor(flashColor[0], flashColor[1], flashColor[2], flashColor[3]);
    
        game.setNotificationTextEntry("CELL_EMAIL_BCON");
        for (let i = 0, msgLen = message.length; i < msgLen; i += maxStringLength) game.addTextComponentSubstringPlayerName(message.substr(i, Math.min(maxStringLength, message.length - i)));
        game.setNotificationMessage(notifPic, notifPic, flashing, icon, title, sender);
        game.drawNotification(false, true);
    });
    
    alt.on("closedMode.open", (pin) => {
        alt.emitServer("closedMode.open", pin);
    });
    
    alt.on("toBlur", (time = 1000) => {
        game.transitionToBlurred(time);
    });
    
    alt.on("fromBlur", (time = 1000) => {
        game.transitionFromBlurred(time);
    });

    view.on("toBlur", (time = 1000) => {
        game.transitionToBlurred(time);
    });
    
    view.on("fromBlur", (time = 1000) => {
        game.transitionFromBlurred(time);
    });
    
    alt.on('effect', (effect, duration) => {
        game.animpostfxPlay(effect, duration, false);
    });

    alt.on('update', () => {
        game.drawRect(0, 0, 0, 0, 0, 0, 0, 0);
    });
    
    alt.on('Cursor::show', (enable) => {
        if (alt.tabletActive || alt.chatActive || alt.autoSaloonActive || alt.consoleActive || alt.inventoryActive || /*|| alt.tradeActive */ alt.playerMenuActive || alt.documentsActive || alt.houseMenuActive || alt.enableTelephone) return;
        if (enable === alt.cursorState) return;
        alt.cursorState = enable;
        //view.emit(`inventoryAPI.mouseupHandler`);
        alt.showCursor(enable);
        alt.emit(`setBlockControl`, enable);
        if (enable) {
            alt.toggleGameControls(false);
            view.focus();
        } else {
            alt.toggleGameControls(true);
            view.unfocus();
        }
    });

    alt.on("setNewWaypoint", (x, y) => {
        game.setNewWaypoint(x, y);
    });

    alt.onServer("setNewWaypoint", (x, y) => {
        game.setNewWaypoint(x, y);
    });

    alt.setInterval(() => {
        const pPos = player.pos;

        alt.labels.forEach((label) => {
            if (alt.vdist(pPos, label.pos) <= 4) draw3dText(label.pos.x, label.pos.y, label.pos.z, label.text);
        });
    
        alt.markers.forEach((marker) => {
            if (alt.vdist(pPos, marker.pos) <= 150) game.drawMarker(marker.type, marker.pos.x, marker.pos.y, marker.pos.z, 0.0, 0.0, 0.0, 0.0, marker.rot, 0.0, marker.scale, marker.scale, marker.scale, marker.color.r, marker.color.g, marker.color.b, marker.color.alpha, false, true, marker.range, null, null, true);
        });
    }, 0);

    view.on('Cursor::show', (enable) => {
        if (alt.tabletActive || alt.chatActive || alt.autoSaloonActive || alt.consoleActive || alt.inventoryActive || /*|| alt.tradeActive */ alt.playerMenuActive || alt.documentsActive || alt.houseMenuActive || alt.enableTelephone) return;
        if (enable === alt.cursorState) return;
        alt.cursorState = enable;
        alt.showCursor(enable);
        alt.emit(`setBlockControl`, enable);
        if (enable) {
            alt.toggleGameControls(false);
            view.focus();
        } else {
            alt.toggleGameControls(true);
            view.unfocus();
        }
    });
    
    alt.on("lightTextField", (el) => {
        menu.execute(`lightTextField('${el}', '#b44')`);
    });
    
    alt.on("lightTextFieldError", (el, text) => {
        menu.execute(`lightTextFieldError('${el}', '${text}')`);
    });
    
    alt.on("setFreeze", (pedNumber, freeze) => {
        game.freezeEntityPosition(pedNumber, freeze);
        player.isFreeze = freeze;
    });
    
    alt.on("setBlockControl", (enable) => {
        player.isBlockControl = enable;
    });

    view.on(`events.emitServer`, (event, data) => {
        alt.emitServer(event, data);
    });

    view.on("setBlockControl", (enable) => {
        player.isBlockControl = enable;
    });
    
    alt.on("setLocalVar", (key, value) => {
        alt.clientStorage[key] = value;
        view.emit(`setLocalVar`, key, JSON.stringify(value));
        if (localVarHandlers[key]) localVarHandlers[key](value);
    });

    view.on("setLocalVar", (key, value) => {
        alt.clientStorage[key] = value;
        view.emit(`setLocalVar`, key, JSON.stringify(value));
        if (localVarHandlers[key]) localVarHandlers[key](value);
    });

    alt.on(`update`, () => {
        if (player.isFreeze || player.isBlockControl) game.disableAllControlActions(0);

        if (alt.clientStorage.hasCuffs) {
            game.disableAllControlActions(0);
            game.enableControlAction(0, 1, true);
            game.enableControlAction(0, 2, true);
            game.enableControlAction(0, 3, true);
            game.enableControlAction(0, 4, true);
            game.enableControlAction(0, 5, true);
            game.enableControlAction(0, 6, true);
            game.enableControlAction(0, 26, true);
            game.enableControlAction(0, 30, true);
            game.enableControlAction(0, 31, true);
            game.enableControlAction(0, 32, true);
            game.enableControlAction(0, 33, true);
            game.enableControlAction(0, 34, true);
            game.enableControlAction(0, 35, true);
        }

        if (alt.clientStorage.hasCuffs && game.isPedJumping(player.scriptID) || alt.clientStorage.hasCuffs && game.isPedShooting(player.scriptID) || alt.clientStorage.hasCuffs && game.isPedSwimming(player.scriptID) || alt.clientStorage.hasCuffs && game.isPedFalling(player.scriptID)) alt.emitServer(`arrestAnimation`, player);

        if (player.getSyncedMeta("attachedObject") && !player.throwAttachedObject && 
        (game.isPedJumping(player.scriptID) || game.isPedShooting(player.scriptID) || game.isPedSwimming(player.scriptID) ||
                game.isPedFalling(player.scriptID))) {
            player.throwAttachedObject = true;
            alt.emitServer("attachedObject.throw");
        }
    });

    alt.helpers.blip.new(513, 436.19, -644.39, 28.74, {
        alpha: 255,
        scale: 0.7,
        color: 2,
        name: "Автобусный Парк",
        shortRange: true
    });

    alt.helpers.blip.new(545, -915.20, -2038.27, 9.40, {
        color: 0,
        name: "Driving School",
        shortRange: true,
        scale: 0.7
    });

    alt.helpers.blip.new(318, -629.18, -1634.45, 26.04, {
        alpha: 255,
        scale: 0.7,
        color: 25,
        name: "Центр утилизации",
        shortRange: true
    });

    alt.helpers.marker.new(1, new alt.Vector3(-915.20, -2038.27, 9.40-1), undefined, undefined, 1, {r: 187, g: 255, b: 0, alpha: 70}, undefined, true, 2);

    
    alt.helpers.blip.new(616, -258.56, -841.53, 31.42, { name: 'Почтовый курьер Go Postal', color: 4, scale: 0.7, shortRange: true});
    alt.helpers.blip.new(103, 538.54, 101.79, 96.54, { name: 'Курьер пиццерии', color: 1, scale: 0.7, shortRange: true});
    alt.helpers.blip.new(566, -95.052, -1014.401, 27.275, { name: 'Стройка', scale: 0.7, shortRange: true});
    alt.helpers.blip.new(351, -410.083, -2700.001, 6.000, {
        name: 'Портовый рабочий',
        color: 5,
        scale: 0.7,
        shortRange: true
    });

    alt.onServer(`Blip::dealer::create`, (blip, pos, object) => {
        pos = JSON.parse(pos);
        object = JSON.parse(object);

        alt.helpers.blip.new(blip, pos.x, pos.y, pos.z, {
            name: object.name,
            color: object.color,
            scale: object.scale,
            shortRange: object.shortRange
        });
    });

    alt.setMsPerGameMinute(60000);
});