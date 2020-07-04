import alt from 'alt';
import game from 'natives';

class CameraRotator {
	start(camera, basePosition, lookAtPosition, offsetVector, heading, fov = undefined) {
		this.camera = camera;
		this.basePosition = basePosition;
		this.lookAtPosition = lookAtPosition;
		this.offsetVector = offsetVector;
		this.heading = heading;
		this.baseHeading = heading;
		this.currentPoint = { x: 0, y: 0 };
		this.isPause = false;
		this.zUp = 0;
		this.zUpMultipler = 1;
		this.xBound = [ 0, 0 ];
		this.zBound = [ -0.01, 0.8 ];

		this.changePosition();

		game.pointCamAtCoord(camera, lookAtPosition.x, lookAtPosition.y, lookAtPosition.z);

		if (fov) {
			game.setCamFov(camera, fov);
		}

		this.activate(true);
	}

	pause(state) {
		this.isPause = state;
	}

	stop() {
		this.activate(false);
	}

	reset() {
		this.heading = this.baseHeading;
		this.zUp = 0;
		this.changePosition();
	}

	setXBound(min, max) {
		this.xBound = [ min, max ];
	}

	setZBound(min, max) {
		this.zBound = [ min, max ];
	}

	setZUpMultipler(value) {
		this.zUpMultipler = value;
	}

	getRelativeHeading() {
		return this.normilizeHeading(this.baseHeading - this.heading);
	}

	activate(state) {
		/* this.camera.setActive(state);
		alt.game.cam.renderScriptCams(state, false, 3000, true, false); */
		this.isActive = state;
	}

	onMouseMove(dX, dY) {
		this.heading = this.normilizeHeading(this.heading + dX * 100);

		let relativeHeading = this.getRelativeHeading();

		if (relativeHeading > this.xBound[0] && relativeHeading < this.xBound[1]) {
			relativeHeading = Math.abs(this.xBound[0] - relativeHeading) > Math.abs(this.xBound[1] - relativeHeading) 
				? this.xBound[1]
				: this.xBound[0];
		}

		this.heading = this.normilizeHeading(-relativeHeading + this.baseHeading);
		this.zUp += dY * this.zUpMultipler * -1;

		if (this.zUp > this.zBound[1]) {
			this.zUp = this.zBound[1];
		} else if (this.zUp < this.zBound[0]) {
			this.zUp = this.zBound[0];
		}

		this.changePosition();
	}

	changePosition() {
		const position = game.getObjectOffsetFromCoords(this.basePosition.x, this.basePosition.y,
			this.basePosition.z + this.zUp, this.heading, this.offsetVector.x, this.offsetVector.y, this.offsetVector.z);
		
		game.setCamCoord(this.camera, position.x, position.y, position.z);
	}

	isPointEmpty() {
		return this.currentPoint.x === 0 && this.currentPoint.y === 0;
	}

	setPoint(x, y) {
		this.currentPoint = { x, y };
	}

	getPoint() {
		return this.currentPoint;
	}

	normilizeHeading(heading) {
		if (heading > 360) {
			heading = heading - 360;
		} else if (heading < 0) {
			heading = 360 + heading;
		}

		return heading;
	}
}

const cameraRotatorHelper = new CameraRotator();

alt.on("update", () => {
	if (!cameraRotatorHelper.isActive || cameraRotatorHelper.isPause) {
		return;
	}

	const x = game.getDisabledControlNormal(2, 239);
	const y = game.getDisabledControlNormal(2, 240);

	if (cameraRotatorHelper.isPointEmpty()) {
		cameraRotatorHelper.setPoint(x, y);
	}

	const currentPoint = cameraRotatorHelper.getPoint();
	const dX = currentPoint.x - x;
	const dY = currentPoint.y - y;
	
	cameraRotatorHelper.setPoint(x, y);
	
	if (game.isDisabledControlPressed(2, 237)) {
		cameraRotatorHelper.onMouseMove(dX, dY);
	}
});

export default cameraRotatorHelper;