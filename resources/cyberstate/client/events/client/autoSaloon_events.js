import alt from 'alt';
import game from 'natives';

alt.on(`Client::init`, (view) => {
    let auto = { model: null, color: null, entity: null };
    let camera = null;

    let checkTestDrive = false;
    let startTestDrive = 0;
    
    const player = alt.Player.local

    const autoSaloon = alt.setInterval(function () {
        if (checkTestDrive) {
            if (new Date().getTime() - startTestDrive > (1000*60)) {
                checkTestDrive = false;
                alt.emit("autoSaloon.setStatusMenu", true);
                alt.emitServer("autoSaloon.endTestDrive");
            }
            if (new Date().getTime() - startTestDrive > 2000) {
                if (!player.vehicle) {
                    checkTestDrive = false;
                    alt.emit("autoSaloon.setStatusMenu", true);
                    alt.emitServer("autoSaloon.endTestDrive");
                }
            }
        }
    }, 1000);

    function createCam(x, y, z, rx, ry, rz, viewangle) {
        camera = game.createCam("DEFAULT_SCRIPTED_CAMERA", false);
        game.setCamCoord(camera, x, y, z);
        game.setCamRot(camera, rx, ry, rz, 2);
        game.setCamFov(camera, viewangle);
        game.setCamActive(camera, true);
        
        const vehPosition = new alt.Vector3(-43.9, -1096.6, 26.1);

        alt.helpers.cameraRotator.start(camera, vehPosition, vehPosition, new alt.Vector3(-3.0, 3.5, 0.5), 180);
        alt.helpers.cameraRotator.setZBound(-0.8, 1.8);
        alt.helpers.cameraRotator.setZUpMultipler(5);
        alt.helpers.cameraRotator.pause(true);

        game.renderScriptCams(true, false, 3000, true, false);
    }

    alt.onServer('autoSaloon.openBuyerMenu', (data) => {
        //debug(`Test: ${JSON.stringify(data)}`);
        view.emit(`autoSaloon`, 'enable', true);
        view.emit(`autoSaloon`, 'bizId', data.bizId);
        view.emit(`autoSaloon`, 'catalogData', data.vehicles);
        view.emit(`autoSaloon`, 'colorSelect', data.colorsCFG);
        view.emit(`autoSaloon`, 'dim', data.dim);
        createCam(-48.1, -1099.7, 26.5, 0, 0, 308, 60);
        game.displayRadar(false);
    });

    alt.onServer('item.fixCarByKeys', (sqlId) => {
        const playerPos = player.pos;
        const data = game.getClosestVehicleNodeWithHeading(playerPos.x, playerPos.y, playerPos.z, new alt.Vector3(-3.0, 3.5, 0.5), 1, 5, 3.0, 0);
        alt.emitServer("item.fixCarByKeys", sqlId, JSON.stringify(data[1]), JSON.stringify(data[2]));
    });

    view.on('autoSaloon.deleteVehicle', () => {
        alt.helpers.cameraRotator.stop();
        if (auto.entity !== null) {
            game.deleteVehicle(auto.entity);
            auto = { model: null, color: null, entity: null };
        }
    });

    alt.onServer('autoSaloon.deleteVehicle', () => {
        alt.helpers.cameraRotator.stop();
        if (auto.entity !== null) {
            game.deleteVehicle(auto.entity);
            auto = { model: null, color: null, entity: null };
        }
    });


    view.on('autoSaloon.setStatusMenu', (enable) => {
        if (enable === true) {
            createCam(-48.1, -1099.7, 26.5, 0, 0, 308, 60);
            game.displayRadar(false);
            view.emit(`autoSaloon`, `enable`, true);
        } else {
            game.displayRadar(true);
            view.emit(`autoSaloon`, `enable`, false);
        }
    });

    alt.on('autoSaloon.setStatusMenu', (enable) => {
        if (enable === true) {
            createCam(-48.1, -1099.7, 26.5, 0, 0, 308, 60);
            game.displayRadar(false);
            view.emit(`autoSaloon`, `enable`, true);
        } else {
            game.displayRadar(true);
            view.emit(`autoSaloon`, `enable`, false);
        }
    });


    alt.onServer('autoSaloon.setStatusMenu', (enable) => {
        if (enable === true) {
            createCam(-48.1, -1099.7, 26.5, 0, 0, 308, 60);
            game.displayRadar(false);
            view.emit(`autoSaloon`, `enable`, true);
        } else {
            game.displayRadar(true);
            view.emit(`autoSaloon`, `enable`, false);
        }
    });

    function loadModelAsync(model) {
        return new Promise((resolve, reject) => {
          if(typeof model === 'string') {
            model = game.getHashKey(model);
          }
        
          if(!game.isModelValid(model))
            return resolve(false);
      
          if(game.hasModelLoaded(model))
            return resolve(true);
      
          game.requestModel(model);
      
          let interval = alt.setInterval(() => {
            if (game.hasModelLoaded(model)) {
              alt.clearInterval(interval);
              return resolve(true);
            }
          }, 0);
        });
    }

    view.on('autoSaloon.showCar', async (car, dim) => {
        let carData = JSON.parse(car);
        await loadModelAsync(carData.model);
        
        if (auto.entity !== null) {
            game.deleteVehicle(auto.entity);

            auto.entity = game.createVehicle(game.getHashKey(carData.model), -43.9, -1096.6, 26.1, 0, false, false);

            game.setVehicleColours(auto.entity, 144, 0);
            game.setVehicleOnGroundProperly(auto.entity);
            game.setEntityRotation(auto.entity, 0, 0, 180, 2, true);
        } else {
            auto.entity = game.createVehicle(game.getHashKey(carData.model), -43.9, -1096.6, 26.1, 0, false, false);

            game.setVehicleColours(auto.entity, 144, 0);
            game.setVehicleOnGroundProperly(auto.entity);
            game.setEntityRotation(auto.entity, 0, 0, 180, 2, true);
        }

        alt.helpers.cameraRotator.pause(false);
        
        let paramsCar = {
            maxSpeed: game.getVehicleModelMaxSpeed(game.getHashKey(carData.model)), 
            braking: (game.getVehicleModelMaxBraking(game.getHashKey(carData.model)) * 100).toFixed(2), 
            acceleration: (game.getVehicleModelAcceleration(game.getHashKey(carData.model)) * 100).toFixed(2), 
            controllability: game.getVehicleModelMaxTraction(game.getHashKey(carData.model)).toFixed(2),
            maxPassagersCar: game.getVehicleModelNumberOfSeats(game.getHashKey(carData.model)),
            maxSpeedKm: ((game.getVehicleModelMaxSpeed(game.getHashKey(carData.model)) * 3.6).toFixed(0)), 
        }

        view.emit(`autoSaloon`, `selectCarParam`, paramsCar);

    });

    alt.onServer('autoSaloon.testDriveStart', () => {
		alt.helpers.cameraRotator.pause(true);
        startTestDrive = new Date().getTime();
        checkTestDrive = true;
        alt.emit("autoSaloon.setStatusMenu", false);
    });

    view.on('autoSaloon.setActive', (enable) => {
        alt.autoSaloonActive = enable;
    });

    view.on('autoSaloon.updateColor', (data) => {
        let colorData = JSON.parse(data);
        game.setVehicleColours(auto.entity, colorData.sqlId-1, 0);
    });

    view.on('autoSaloon.destroyCam', () => {
        alt.helpers.cameraRotator.stop();
        if (!camera) return;
        game.setCamActive(camera, false);
        game.renderScriptCams(false, false, 3000, true, false);
        game.destroyCam(camera);
        camera = null;
	});
});
