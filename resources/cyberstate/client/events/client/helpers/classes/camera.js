import alt from 'alt';
import game from 'natives';

let interpolateInfo = undefined;

const localPlayer = alt.Player.local

class Camera {
	constructor (name) {
		this._camera = game.createCam(name, false);
		this._interpolateCamera = undefined;
	}

	get active() {
		return game.isCamActive(this._camera);
	}

	set active(state) {
		game.setCamActive(this._camera, state);
	}

	get fov() {
		return game.getCamFov(this._camera);
	}

	set fov(value) {
		game.setCamFov(this._camera, value);
	}

	get position() {
		return game.getCamCoord(this._camera);
	}

	set position(position) {
		game.setCamCoord(this._camera, position.x, position.y, position.z);
	}

	get rotation() {
		return game.getCamRot(this._camera, 2);
	}

	set rotation(rotation) {
		game.setCamRot(this._camera, rotation.x, rotation.y, rotation.z);
	}

	destroy() {
		if (!this._camera) return;

		try {
			game.destroyCam(this._camera);
		} catch {
			return;
		}
	}

	isInterpolating() {
		return this._interpolateCamera ? game.isCamInterpolating(this._interpolateCamera) : false;
	}

	moveToPoint(position, rotation = undefined, duration = 1000, callBack = undefined, easeLocation = 1, easeRotation = 1) {
		if (interpolateInfo) {
			throw new Error("One of cameras already moving");
		}
		const cameraLookAt = game.getOffsetFromEntityInWorldCoords(localPlayer.scriptID, 0, 0, 0);

		this._interpolateCamera = game.createCamWithParams("DEFAULT_SCRIPTED_FLY_CAMERA", position.x, position.y, position.z, 0, 0, 0, this.fov, false, 2);
		game.pointCamAtCoord(this._interpolateCamera, cameraLookAt.x, cameraLookAt.y, cameraLookAt.z);

		if (!this.active) {
			this.active = true;
		}

		this.stopPointing();

		interpolateInfo = {
			camera: this,
			callback: () => {	
				const currentCamera = this._camera;
	
				this._camera = this._interpolateCamera;
				game.destroyCam(currentCamera);
				interpolateInfo = undefined;

				if (callBack) {
					callBack();
				}
			}
		};

		game.setCamActiveWithInterp(this._interpolateCamera, this._camera, duration, easeLocation, easeRotation);
	}

	pointAtCoord(position) {
		game.pointCamAtCoord(this._camera, position.x, position.y, position.z);
	}

	stopPointing() {
		game.stopCamPointing(this._camera);
	}
}

alt.on("update", () => {
	if (!interpolateInfo) {
		return;
	}

	if (game.isCamInterpolating(interpolateInfo.camera)) {
		return;
	}

	interpolateInfo.callback();
});

const cameraHelper = {
	"new": (name) => new Camera(name),
	renderCams: (state, ease = false, duration = 1000) => game.renderScriptCams(state, ease, duration, true, false)
};

export default cameraHelper;
