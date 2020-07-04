module.exports = {
	Init: () => {
		DB.Query("SELECT * FROM ipls", (e, result) => {
			if (e) {
				alt.log(`Ipl loading ${e}`);
				return;
			}

			for (const ipl of result) {				
				if (ipl.request === 1) {
					alt.world.requestIpl(ipl.name);
				} else {
					alt.world.removeIpl(ipl.name);
				}
			}
		});
	}
};
