import alt from 'alt';

import animationHelper from 'client/events/client/helpers/animHelper.js';
import cameraHelper from 'client/events/client/helpers/classes/camera.js';
import cameraRotatorHelper from 'client/events/client/helpers/cameraRotator.js';
import controlsDisablerHelper from 'client/events/client/helpers/controlsDisabler.js';
import interiorHelper from 'client/events/client/helpers/interiorHelper.js';
import instructionButtonsDrawler from 'client/events/client/helpers/instructionButtonsDrawler.js';
import loadingPromptHelper from 'client/events/client/helpers/loadingPrompt.js';
import pedHelper from 'client/events/client/helpers/pedHelper.js';
import scaleformHelper from 'client/events/client/helpers/scaleformHelper.js';
import screenHelper from 'client/events/client/helpers/screenHelper.js';
import stringHelper from 'client/events/client/helpers/stringHelper.js';
import vehicleHelper from 'client/events/client/helpers/vehicleHelper.js';
import markerHelper from 'client/models/DrawMarker.js';
import blipHelper from 'client/models/PointBlip.js';
import timebarHelper from 'client/events/client/helpers/timebarHelper.js';
import objectHelper from 'client/models/CreateObject.js';

alt.helpers = {
    animation: animationHelper,
    camera: cameraHelper,
    cameraRotator: cameraRotatorHelper,
    controlsDisabler: controlsDisablerHelper,
    interior: interiorHelper,
    instructionButtonsDrawler: instructionButtonsDrawler,
    loadingPrompt: loadingPromptHelper,
    ped: pedHelper,
    scaleform: scaleformHelper,
    screen: screenHelper,
    string: stringHelper,
    vehicle: vehicleHelper,
    marker: markerHelper,
    blip: blipHelper,
    timebar: timebarHelper,
    object: objectHelper
};