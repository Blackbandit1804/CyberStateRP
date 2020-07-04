import alt from 'alt';
import game from 'natives';

const pedHelper = {
	createPed: (gender = 0, model, position, heading = 0) => {
		return new Promise((resolve, reject) => {
      		const ped = game.createPed(gender, model, position.x, position.y, position.z, heading, false, false);
      
			if (ped !== 0) {
				resolve(ped);
				return;
			}
		});
	}
};

export default pedHelper;