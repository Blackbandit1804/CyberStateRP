let whitelist = [];

function checkPlayer(player) {
	const socialClub = player.socialId.toLowerCase();

	if (whitelist.indexOf(socialClub) >= 0) {
		return;
	}

	//player.kick("Вы отсутствуете в Whitelist.");
}

function initwhitelist(isRefresh = false) {
	if (whitelist.length > 0) {
		whitelist = [];
	}

	DB.Query("SELECT * FROM whitelist WHERE enabled=1", (e, result) => {
		if (e) {
			alt.log(`Whitelist не загружен, ${e}`);
			return;
		}

		for (const row of result) {
			whitelist.push(row.socialClub.toLowerCase());
		}

		if (!isRefresh) {
			alt.onClient("playerJoin", checkPlayer);
		}

		alt.Player.all.forEach(checkPlayer);

		alt.log(`WhiteList: Загружено ${whitelist.length} записей`);
	});
}

module.exports = {
	Init: () => {
		initwhitelist();
	},
	Refresh() {
		initwhitelist(true);
	}
}
