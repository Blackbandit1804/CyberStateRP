const clothesShopInfo = require("./info");

function startDressing(player, interiorId) {
	const dressingPlace = clothesShopInfo.dressingPlaces[interiorId];

	if (!dressingPlace) {
		player.utils.error("Неправильный интерьер магазина");
		alt.log(`Clothes_Shop: Invalid place ${dressingPlace}`);
		return false;
	}

	player.inDressingRoom = true;
	player.dimension = player.sqlId + 1;
	alt.emitClient(player, "clothes_shop::dressing_start", dressingPlace.position, dressingPlace.heading);

	return true;
};

alt.onClient("clothes_shop::stopDressing", (player) => {
	player.inDressingRoom = undefined;
	player.dimension = 1;
	player.body.loadItems(); 
	alt.emitClient(player, "clothes_shop::stopDressing");
});

module.exports = {
	startDressing
};
