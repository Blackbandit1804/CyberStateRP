import alt from 'alt';
import game from 'natives';

const player = alt.Player.local

alt.peds = [];
let isLoaded = false;

alt.onServer("peds.create", async (list) => {
    list = JSON.parse(list);
    
    for (var i = 0; i < list.length; i++) {
        list[i].position.z -= 1;
        
        alt.peds[list[i].sqlId] = { id: 0, sqlId: list[i].sqlId, pos: list[i].position, model: list[i].hash, heading: list[i].heading, isStreamed: false };
    }

    isLoaded = true;
});

function loadModelAsync(model) {
	return new Promise((resolve, reject) => {
	  if (typeof model === 'string') {
		model = game.getHashKey(model);
	  }
	
	  if (!game.isModelValid(model))
		return resolve(false);
  
	  if (game.hasModelLoaded(model))
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

alt.setInterval(async () => {
    const pPos = player.pos;
    if (isLoaded) {
        for (var key in alt.peds) {
            if (alt.vdist(pPos, alt.peds[key].pos) <= 50) {
                if (alt.peds[key].id === 0) {
                    await loadModelAsync(alt.peds[key].model);
                    alt.peds[key].id = game.createPed(3, alt.peds[key].model, alt.peds[key].pos.x, alt.peds[key].pos.y, alt.peds[key].pos.z, alt.peds[key].heading, false, false);

                    game.setEntityInvincible(alt.peds[key].id, true);
                    game.freezeEntityPosition(alt.peds[key].id, true);
                    game.setBlockingOfNonTemporaryEvents(alt.peds[key].id, true);
                }
            } else {
                if (alt.peds[key].id !== 0) {
                    game.deletePed(alt.peds[key].id);
                    alt.peds[key].id = 0;
                }
            }
        }
    }
}, 1000);

alt.on(`disconnect`, () => {
    for (var key in alt.peds) {
        if (alt.peds[key].id !== 0) {
            game.deletePed(alt.peds[key].id);
            alt.peds[key].id = 0;
        }
    }

    delete alt.peds;
});

alt.onServer("peds.delete", (pedSqlId) => {
    var ped = alt.getPedBySqlId(pedSqlId);
    if (ped) {
        game.deletePed(ped.sqlId);
        delete alt.peds[ped.sqlId];
    }
});

alt.getPedBySqlId = (sqlId) => {
    if (!sqlId) return null;
    var result;
    alt.peds.forEach((ped) => {
        if (ped.sqlId == sqlId) {
            result = ped;
            return;
        }
    });
    return result;
}