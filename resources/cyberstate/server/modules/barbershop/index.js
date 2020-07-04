const barberInfo = require("./info");

barberInfo.interiors = barberInfo.places.map((place) => place.interior);

const rawBarberInfo = JSON.stringify(barberInfo);

alt.onClient("playerBrowserReady", (player) => {
	alt.emitClient(player, "barbershop::load_info", rawBarberInfo);
});

alt.onClient("barbershop::onStart", (player) => {
	player.dimension = player.sqlId + 1;

	alt.emitClient(player, "barbershop::startBarber", player.hairColor, player.hairHighlightColor, player.eyeColor);
});

alt.onClient("barbershop::onStop", (player) => {
	player.dimension = 1;
});

alt.onClient("barbershop::setHair", (player, hair, color, highlightColor) => {
	alt.emit(`setClothes`, player, 2, hair, 0, 0);
	alt.emit(`Hair::set::color`, player, color, highlightColor);

	DB.Query("UPDATE characters SET hair=?, hairColor=?, hairHighlightColor=? WHERE id=?", [hair, color, highlightColor, player.sqlId]);
});

alt.onClient("barbershop::setEyeColor", (player, color) => {
	alt.emit(`Face::set::eye::color`, player, color);
	player.eyeColor = color;

	DB.Query("UPDATE characters SET eyeColor=? WHERE id=?", [color, player.sqlId]);
});

alt.onClient("barbershop::setHeadOverlay", (player, overlayId, index, opacity, color, clearOverlayId) => {
	console.log(`${color}`)
	color = color === -1 ? 0 : color;
	opacity = opacity === -1 ? 1 : opacity;

	alt.emit(`Head::set::overlay`, player, overlayId, index, opacity);
	if (overlayId === 10 || overlayId === 2 || overlayId === 1) {
		alt.emitClient(player, `Head::set::overlay::color`, overlayId, 1, color, color);
	} else if (overlayId === 8 || overlayId === 5) {
		alt.emitClient(player, `Head::set::overlay::color`, overlayId, 2, color, color);
	} else {
		alt.emitClient(player, `Head::set::overlay::color`, overlayId, 0, color, color);
	}

	console.log(`${color}`)

	DB.Query(`
		INSERT INTO 
			characters_headoverlays(character_id, overlay_id, overlay_index, opacity, first_color, second_color)
		VALUES 
			(?, ?, ?, ?, ?, ?)
		ON DUPLICATE KEY UPDATE
				overlay_index = ?,
				opacity = ?,
				first_color = ?,
				second_color = ?
		;
	`, [player.sqlId, overlayId, index, opacity, color, color, index, opacity, color, color]);

	if (typeof(clearOverlayId) === "number") {
		alt.emit(`Head::set::overlay`, player, clearOverlayId, 255, 1);
		alt.emitClient(player, `Head::set::overlay::color`, clearOverlayId, 1, 0, 0);

		DB.Query("DELETE FROM characters_headoverlays WHERE character_id = ? AND overlay_id = ?", [player.sqlId, clearOverlayId]);
	}
});

alt.onClient("barbershop::checkPrice", (player, menuIndex, itemIndex, isMale) => {
	const prices = barberInfo.prices[menuIndex];

	if (!Array.isArray(prices)) {
		alt.emitClient(player, "barbershop::checkPriceResponse", false);
		return;
	}

	const price = Array.isArray(prices[0]) ? prices[(isMale ? 0 : 1)][itemIndex] : prices[itemIndex];

	if (typeof(price) !== "number") {
		alt.emitClient(player, "barbershop::checkPriceResponse", false);
		return;
	}

	const newPlayerMoney = player.money - price;

	if (newPlayerMoney >= 0) {
		alt.emitClient(player, "barbershop::checkPriceResponse", true);
		player.utils.setMoney(newPlayerMoney);
	} else {
		player.utils.error("У вас недостаточно средств!");
		alt.emitClient(player, "barbershop::checkPriceResponse", false);
	}
});
