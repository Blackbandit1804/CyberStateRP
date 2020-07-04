const greenZones = new Set();

alt.onClient("playerBrowserReady", (player) => {
	alt.emitClient(player, "green_zone::load", JSON.stringify([...greenZones]));
});

alt.onClient("green_zone::add", (player, interior) => {
	if (interior === 0) {
		terminal.error("Нелья добавить зелёную зону на улице", player);
		return;
	}

	if (greenZones.has(interior)) {
		terminal.error("Такая зелёная зона уже существует", player);
		return;
	}

	DB.Query("INSERT INTO green_zones (interior_id) VALUES(?)", [interior], (e) => {
		if (e) {
			alt.log(`Ошибка добавления зелёной зоны. ${e}`);
			terminal.error("Зелёная зона не добавлена. Попробуйте позже", player);
			return;
		}

		terminal.info("Зелёная зона успешно добавлена", player);
		greenZones.add(interior);
		alt.emitClient(null, "green_zone::add", interior);
	});
});

alt.onClient("green_zone::remove", (player, interior) => {
	if (!greenZones.has(interior)) {
		terminal.error("Данная область не является зелёной зоной", player);
		return;
	}

	DB.Query("DELETE FROM green_zones WHERE interior_id = ? LIMIT 1", [interior], (e) => {
		if (e) {
			alt.log(`Ошибка удаления зелёной зоны. ${e}`);
			terminal.error("Зелёная зона не удалена. Попробуйте позже", player);
			return;
		}

		terminal.info("Зелёная зона успешно удалена", player);
		greenZones.delete(interior);
		alt.emitClient(null, "green_zone::remove", interior);
	});
});

module.exports = {
	Init: () => {
		return new Promise((resolve, reject) => {
			DB.Query("SELECT * FROM green_zones", (e, result) => {
				if (e) {
					alt.log(`Не удалось загрузить зелёные зоны. ${e}`);
					reject(e);
					return;
				}

				for (const greenZone of result) {				
					greenZones.add(greenZone.interior_id);
				}

				alt.log(`Загружено ${result.length} зелёных зон`);
				resolve();
			});
		});
	}
};
