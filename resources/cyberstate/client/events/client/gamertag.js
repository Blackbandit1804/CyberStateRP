import alt from 'alt';
import game from 'natives';
 
const width = 0.025;
const height = 0.004;
const border = 0.001;
 
let isActive = true;
let isActiveNickname = true;
let isActiveNickId = true;
let resolution;
let iconCount = 0;
let iconsWidth = 0.0;
let widthText = 0.05;
let scale = 0.35;

let familiarList = {};

alt.on(`Client::init`, (view) => {
    const localPlayer = alt.Player.local
    const storage = alt.LocalStorage.get();

    if (!storage.get("familiar")) storage.set("familiar", familiarList);
    familiarList = storage.get("familiar");
 
    alt.on('gameEntityCreate', (entity) => {
        if (entity instanceof alt.Player) {
          let name = entity.getSyncedMeta('name');
          if (familiarList[name] !== undefined) {
            entity.isFamiliar = true;
          }
        }
    });
       
    alt.onServer("familiar.add", (name, playerId) => {
        if (familiarList[name] !== undefined) {
            return alt.emit(`nError`, `Вы уже знакомы с ${name}!`);
        }
        familiarList[name] = true;
        storage.set("familiar", familiarList);
        storage.save();
        if (alt.Player.atRemoteId(playerId)) alt.Player.atRemoteId(playerId).isFamiliar = true;
        alt.emit(`nSuccess`, `${name} - Ваш новый знакомый`);
    });
 
    /*дублируется `familiar.add` c одниим исключением, не отображается статус знакомства*/
    alt.onServer("familiar.addFactions", (name, playerId) => {
        //if (familiarList.indexOf(name) != -1) return mp.events.call(`nError`, `Вы уже знакомы с ${name}!`);
        familiarList[name] = true;
        storage.set("familiar", familiarList);
        storage.save();
        if (alt.Player.atRemoteId(playerId)) alt.Player.atRemoteId(playerId).isFamiliar = true;
        //mp.events.call(`nSuccess`, `${name} - Ваш новый знакомый`);
    });

    alt.on("nametags::show", (state) => {
        isActive = state;
    });
 
    view.on("nametags::nickname", (state) => {
        isActiveNickname = state;
        storage.set("nickname", state);
    });
 
    view.on("nametags::nickId", (state) => {
        isActiveNickId = state;
        storage.set("nickId", state);
    });
 
    let inter = alt.setInterval(() => {
      resolution = game.getActiveScreenResolution(0, 0);
    }, 1000);
 
    alt.on('update', () => {
      if (!isActive)
        return;
      if (!isActiveNickname && !isActiveNickId)
        return;
 
      alt.Player.all.forEach((player) => {
          if (
              player.scriptID != 0 &&
              player.id != localPlayer.id &&
              game.getEntityAlpha(player.scriptID) != 0 &&
              game.hasEntityClearLosToEntity(localPlayer.scriptID, player.scriptID, 17)
          ) {
            if(player.getSyncedMeta("ainvis"))
              return;
 
            let shouldSeeName = (player.isFamiliar && isActiveNickname);
            let shouldSeeId = isActiveNickId;
 
            let parts = [];
            if(shouldSeeId && localPlayer.getSyncedMeta("id") !== null) {
              if (localPlayer.getSyncedMeta("admin")) {
                parts.push(`${player.getSyncedMeta("name")} [${player.getSyncedMeta("id")}]`)
              } else {
                parts.push(`[${player.getSyncedMeta("id")}]`)
              }
            }
            if(shouldSeeName && !localPlayer.getSyncedMeta("admin") && localPlayer.getSyncedMeta("id") !== null) {
              parts.push(player.getSyncedMeta("name"));
            }
            let username = parts.join(' ');
 
            drawMpGamerTag(player, username, 0, 0);
          }
      });
    });
 
    alt.playerChatBubbles = {};
 
    alt.addPlayerChatBubble = (playerId, text) => {
        if (alt.playerChatBubbles[playerId]) alt.clearTimeout(alt.playerChatBubbles[playerId].timerId);
 
        alt.playerChatBubbles[playerId] = {
            text: text,
            timerId: alt.setTimeout(() => {
                delete alt.playerChatBubbles[playerId];
            }, 5000)
        };
    }
 
    function drawMpGamerTag(player, name, x, y) {
      game.setDrawOrigin(player.pos.x, player.pos.y, player.pos.z + 1, 0);
      const posPlayer = localPlayer.pos;
      var distance = alt.vdist(posPlayer, player.pos);
      if (distance > 20.0) return;
 
      if (player.vehicle) {
        y += 0.07;
      }
 
      if (alt.playerChatBubbles[player.scriptID] && alt.playerChatBubbles[player.scriptID].text) gamertag_DrawText(x, y - 0.03, alt.playerChatBubbles[player.scriptID].text, 255);
 
      if (!isTargetPlayer(player)) {
        drawGamerNameAndIcons(player, name, x, y, distance, 210, false);
      } else {
        drawGamerNameAndIcons(player, name, x, y, distance, 255, true);
      }
 
      game.clearDrawOrigin();
    }
 
    function getVoiceSprite(distance) {
        if (distance < 5) return "leaderboard_audio_3";
        if (distance < 10) return "leaderboard_audio_2";
        return "leaderboard_audio_1";
    }
 
    function getVoiceSpriteColor(name) {
        if (name == "leaderboard_audio_1") return [255, 255, 255, 200];
        if (name == "leaderboard_audio_2") return [255, 255, 255, 220];
        if (name == "leaderboard_audio_3") return [255, 255, 255, 255];
        return [255, 255, 255, 255];
    }
 
    function getNicknameColor(player) {
        var admin = player.getSyncedMeta("admin");
        if (!admin) return [255, 255, 255];
        if (admin >= 1 && admin < 6) return [0, 128, 128];
        if (admin >= 6 && admin <= 8) return [50, 205, 50];
        if (admin == 9) return [255, 0, 0];
        return [0, 0, 0];
    }
 
    function isTargetPlayer(player) {
        return (
            game.isPlayerFreeAimingAtEntity(player.scriptID) 
            ||
            game.isPlayerTargettingEntity(player.scriptID)
        );
    }
 
    function drawGamerNameAndIcons(player, name, x, y, distance, alpha, healthammobar) {
      widthText = gamertag_GetWidthText(name);
  
      var voiceSprite = getVoiceSprite(distance);
      var voiceSpriteColor = getVoiceSpriteColor(voiceSprite);
  
      if (player.isTalking) gamertag_AddNameIcon("mpleaderboard", voiceSprite, voiceSpriteColor, false, 0.5, 0.5);

      var color = getNicknameColor(player);
  
      gamertag_DrawText(0, 0, name, alpha, color);//Center
    }
  
    function gamertag_AddNameIcon(dict, name, color) {
      //onlytarget soon
      if (!game.hasStreamedTextureDictLoaded(dict)) {
          game.requestStreamedTextureDict(dict, true);
          return;
      }

      var textureResolution = game.getTextureResolution(dict, name);

      var scalex = (0.9 * textureResolution.x) / 1920;
      var scaley = (0.9 * textureResolution.y) / 1080;

      game.drawSprite(dict, name, 0, -0.02, scalex, scaley, 0, color[0], color[1], color[2], color[3]);
    }
    
 
    function gamertag_GetWidthText(text) {
        game.beginTextCommandWidth("STRING");
        game.addTextComponentSubstringPlayerName(text);
        game.setTextFont(4);
        game.setTextScale(scale, scale);
        return game.endTextCommandGetWidth(true);
    }
 
    function gamertag_DrawText(x, y, text, alpha, color = [255, 255, 255]) {
        game.setTextFont(4);
        game.setTextScale(scale, scale);
        game.setTextColour(color[0], color[1], color[2], alpha);
        game.setTextJustification(0);
        game.setTextOutline();
        game.beginTextCommandDisplayText("STRING");
        game.addTextComponentSubstringPlayerName(text);
        game.endTextCommandDisplayText(x, y);
    }
});