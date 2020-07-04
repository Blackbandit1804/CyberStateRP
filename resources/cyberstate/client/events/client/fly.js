import * as alt from 'alt';
import * as game from 'natives';

let isNoclip = false;
let noclip_speed = 1.0;
let myPed = 0;
let noclipGo = false;
let noclipBack = false;
let inScenario = false;
let foundScenario = false;
let boosting = false;

const player = alt.Player.local;
const thisInfo = {
  active: false,
  espInited: false
};

function getCamDirection() {
  let heading = game.getGameplayCamRelativeHeading() + game.getEntityHeading(myPed);
  let pitch = game.getGameplayCamRelativePitch();

  let x = -Math.sin(heading * (Math.PI / 180.0));
  let y = Math.cos(heading * (Math.PI / 180.0));
  let z = Math.sin(pitch * Math.PI / 180.0);
  let len = Math.sqrt((x * x) + (y * y) + (z * z));

  if (len != 0) {
    x /= len;
    y /= len;
    z /= len;
  };

  return [x, y, z];
};

const drawText = (text, position, options) => {
  options = { ...{ align: 1, font: 4, scale: 0.3, outline: true, shadow: true, color: [255, 255, 255, 255] }, ...options };

  const font = options.font;
  const scale = options.scale;
  const outline = options.outline;
  const shadow = options.shadow;
  const color = options.color;
  const wordWrap = options.wordWrap;
  const align = options.align;

  game.setNotificationTextEntry("CELL_EMAIL_BCON");
  for (let i = 0; i < text.length; i += 99)
  {
      const subStringText = text.substr(i, Math.min(99, text.length - i));
      game.addTextComponentSubstringPlayerName(subStringText);
  }

  game.setTextFont(font);
  game.setTextScale(scale, scale);
  game.setTextColour(color[0], color[1], color[2], color[3]);

  if (shadow) {
      game.setTextDropshadow();
      game.setTextDropshadow(2, 0, 0, 0, 255);
  }

  if (outline) {
      game.setTextOutline();
  }

  switch (align) {
      case 1: {
          game.setTextCentre(true);
          break;
      }
      case 2: {
          game.setTextRightJustify(true);
          game.setTextWrap(0.0, position[0] || 0);
          break;
      }
  }

  if (wordWrap) {
      game.setTextWrap(0.0, (position[0] || 0) + wordWrap);
  }

  game.drawDebugText(position[0] || 0, position[1] || 0);
};

const notify = (text) => {
  alt.nextTick(() => {
    game.setNotificationTextEntry("STRING");
    game.addTextComponentScaleform(text);
    game.drawNotification(true, true);
  })
};

alt.on('update', async () => {
  if (isNoclip) {
    if (noclipGo) {
      let { x, y, z } = game.getEntityCoords(myPed);
      let [dx, dy, dz] = getCamDirection();
      game.setEntityVelocity(myPed, 0.0001, 0.0001, 0.0001);
      x += noclip_speed * dx;
      y += noclip_speed * dy;
      z += noclip_speed * dz;
      game.setEntityCoordsNoOffset(myPed, x, y, z, true, true, true);
    } else if (noclipBack) {
      let { x, y, z } = game.getEntityCoords(myPed);
      let [dx, dy, dz] = getCamDirection();
      game.setEntityVelocity(myPed, 0.0001, 0.0001, 0.0001);
      x -= noclip_speed * dx;
      y -= noclip_speed * dy;
      z -= noclip_speed * dz;
      game.setEntityCoordsNoOffset(myPed, x, y, z, true, true, true);
    };
    game.blockWeaponWheelThisFrame();
    if (game.isDisabledControlJustPressed(24, 261)) {
      if (noclip_speed < 6.9) {
        noclip_speed += 0.5;
        notify(`Noclip speed: ~b~${noclip_speed}`);
      };
    };
    if (game.isDisabledControlJustPressed(24, 262)) {
      if (noclip_speed > 0.6) {
        noclip_speed -= 0.5;
        notify(`Noclip speed: ~b~${noclip_speed}`);
      };
    };
  };
});

alt.on('update', async () => {
  let { x, y, z } = game.getEntityCoords(myPed);
  if (!game.isPedInAnyVehicle(myPed, false) && game.doesScenarioExistInArea(x, y, z, 2.0, true) && !inScenario) {
    ShowInfo("~INPUT_PICKUP~ чтобы сделать это", 0);
    if (!foundScenario) {
      foundScenario = true;
    }
  } else if (inScenario) {
    ShowInfo("~INPUT_PARACHUTE_BRAKE_LEFT~ чтобы прекратить это", 0);
  } else {
    if (foundScenario) {
      foundScenario = false;
    };
  };
  if (boosting) {
    alt.setTimeout(() => {
      game.setVehicleForwardSpeed(game.getVehiclePedIsIn(myPed), game.getEntitySpeed(game.getVehiclePedIsIn(myPed)) * 1.2);
    }, 100)
  };
});

alt.on('keyup', async (key) => {
  if (player.getSyncedMeta("admin")) {
    if (key === 0x73) { // F4
        let blip = game.getFirstBlipInfoId(8);
    
        if (blip != 0) {
          let tpEnt = myPed;
    
          if (game.isPedInAnyVehicle(tpEnt)) {
            tpEnt = game.getVehiclePedIsIn(myPed, false);
          };
    
          let { x, y } = game.getBlipInfoIdCoord(blip);
          let z = 0.1;
    
          game.freezeEntityPosition(tpEnt, true);
          game.requestCollisionAtCoord(x, y, z);
          game.setEntityCoords(tpEnt, x, y, z);
    
          const interval = alt.setInterval(() => {
            let tpEntCoord = game.getEntityCoords(tpEnt);
            let loaded, ground;
    
            if (z > 1999.0) {
              z = 0.1;
            } else {
              z += 15.1;
            };
    
            game.requestCollisionAtCoord(tpEntCoord.x, tpEntCoord.y, z);
            game.setEntityCoords(tpEnt, x, y, z);
            
            [loaded, ground] = game.getGroundZFor3dCoord(tpEntCoord.x, tpEntCoord.y, tpEntCoord.z);
    
            if (loaded) {
              z = ground;
    
              game.setEntityCoords(tpEnt, x, y, z);
              game.freezeEntityPosition(tpEnt, false);
        
              notify(`~o~Sucessfully teleported to ~n~~s~${x}, ${y}, ${z}`);
              alt.clearInterval(interval);
            };
          }, 0);
        } else if (blip === 0) {
          notify(`~p~Waypoint blip ~s~not found`);
        };
      };
      if (key === 0x57) { // W
        noclipGo = false;
      };
      if (key === 0x53) { // S
        noclipBack = false;
      };
      if (key === 0x69) { // NUM 9
        boosting = false;
      };
  }
});

alt.on('keydown', async (key) => {
  if (player.getSyncedMeta("admin")) {
    if (key === 0x57) { // W
        noclipGo = true;
        if (game.playerPedId() != myPed) {
            myPed = game.playerPedId();
        };
    };
    if (key === 0x53) { // S
        noclipBack = true;
    };
    if (key === 0x69) { // NUM 9
        if (game.getPedInVehicleSeat(game.getVehiclePedIsIn(myPed, false), -1) === myPed) {
            boosting = true;
        };
    };
    if (key === 0x63) { // NUM 3
        if (game.getPedInVehicleSeat(game.GetVehiclePedIsIn(myPed, false), -1) === myPed) {
            game.setVehicleForwardSpeed(game.GetVehiclePedIsIn(myPed, false), 0.0);
        };
    };
    if (key === 0x63) { // NUM 3
        if (game.isPedInAnyVehicle(game.getVehiclePedIsIn(myPed, false))) {
            game.setVehicleForwardSpeed(game.getVehiclePedIsIn(myPed, false), 0.0);
            let veh = game.getVehiclePedIsIn(myPed);
            if (game.canShuffleSeat(veh, true)) {
                game.taskShuffleToNextVehicleSeat(myPed, veh);
            };
        };
    };
    if (key === 0x72) { // F3
        isNoclip = !isNoclip;
        if (isNoclip) {
            game.freezeEntityPosition(myPed, true);
            game.setEntityVisible(myPed, false);
            game.setEntityCollision(myPed, false);
            
            notify(`Noclip ~g~enabled~s~.~n~Noclip speed: ~b~${noclip_speed}`);
        } else if (!isNoclip) {
            game.freezeEntityPosition(myPed, false);
            game.setEntityVisible(myPed, true);
            game.setEntityCollision(myPed, true);
            notify(`Noclip ~r~disabled`);
        };
    };
    if (key === 0x45 && foundScenario && !inScenario) { // E
        let { x, y, z } = game.getEntityCoords(myPed);
        game.taskUseNearestScenarioToCoord(myPed, x, y, z, 2.0, 0);
        inScenario = true;
    };
    if (key === 0x51 && inScenario) { // E
        game.clearPedTasks(myPed);
        inScenario = false;
    };
  }
});

alt.on(`keyup`, (key) => {
  if (player.getSyncedMeta("admin")) {
    if (key === 0x74) {
      if (!thisInfo.espInited) {
        thisInfo.espInited = true;

        const resolution = game.getActiveScreenResolution(0, 0);
        const xPx = 1 / resolution.x;
        const yPx = 1 / resolution.y;

        alt.on('update', () => {
          if (!thisInfo.active) {
            return false;
          }

          const localPlayerPosition = player.pos;

          alt.Player.all.forEach(player => {
            if (player.scriptID !== 0 && player !== alt.Player.local) {
              const position = player.pos;

              const models = game.getModelDimensions(player.model);

              var isAdmin = player.getSyncedMeta("admin");

              game.drawLine(
                localPlayerPosition.x,
                localPlayerPosition.y,
                localPlayerPosition.z,
                position.x,
                position.y,
                position.z,
                255,
                isAdmin ? 0 : 255,
                isAdmin ? 0 : 255,
                255
              );

              const point1 = game.getScreenCoordFromWorldCoord(position.x + models[1].x, position.y, position.z + models[1].z);
              const point2 = game.getScreenCoordFromWorldCoord(position.x + models[2].x, position.y, position.z + models[2].z);

              if (!point1 || !point2) {
                return false;
              }

              const width = point2.x - point1.x;
              const height = point2.y - point1.y;

              game.drawRect(point1.x + (width / 2), point1.y, width, yPx * 2, 255, isAdmin ? 0 : 255, isAdmin ? 0 : 255, 255);
              game.drawRect(point1.x + (width / 2), point1.y + height, width, yPx * 2, 255, isAdmin ? 0 : 255, isAdmin ? 0 : 255, 255);

              game.drawRect(point1.x + width, point1.y + (height / 2), xPx * 2, height, 255, isAdmin ? 0 : 255, isAdmin ? 0 : 255, 255);
              game.drawRect(point1.x, point1.y + (height / 2), xPx * 2, height, 255, isAdmin ? 0 : 255, isAdmin ? 0 : 255, 255);


              drawText(player.id + ' - ' + player.getSyncedMeta("name"), [position.x, position.y, position.z], {
                scale: 0.3,
                outline: true,
                color: isAdmin ? [255, 0, 0, 255] : [255, 255, 255, 255],
                font: 4
              });
            }
          });
        });
      }

      thisInfo.active = !thisInfo.active;
      notify(thisInfo.active ? 'ESP: ~g~Enabled' : 'ESP: ~r~Disabled');
    }
  }
});