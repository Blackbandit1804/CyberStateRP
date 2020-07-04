module.exports.Init = function(callback) {
    DB.Query("SELECT * FROM promocodes", (e, result) => {
        alt.promocodes = {};
        for (var i = 0; i < result.length; i++) {
            alt.promocodes[result[i].id] = result[i];
            initPromocodeUtils(alt.promocodes[result[i].id]);
        }

        alt.log(`Промокоды загружены: ${i} шт.`);
        if (callback) callback();
    });
}

function initPromocodeUtils(promo) {
    promo.createPromo = (refferalCode, refReward, mediaReward, level, characterId) => {
        DB.Query(`INSERT INTO promocodes (refferalCode, level, characterId, refReward, mediaReward) VALUES (?,?,?,?,?)`, [refferalCode, level, characterId, refReward, mediaReward], (e, result) => {
            if (e) return alt.log(e);

            alt.promocodes.push({
                id: result.insertId,
                refferalCode: refferalCode,
                level: level,
                refReward: refReward,
                mediaReward: mediaReward,
                characterId: characterId
            });
        });
    };
    promo.deletePromo = (refferalCode) => {
        alt.promocodes.splice(refferalCode, 1);
        DB.Query(`DELETE FROM promocodes WHERE refferalCode = ?`, [refferalCode]);
    };
    promo.setRefferalCode = (refferalCode) => {
        promo.refferalCode = refferalCode;
        DB.Query(`UPDATE promocodes SET refferalCode = ? WHERE id = ?`, [promo.refferalCode, promo.id]);
    };
    promo.setCharacterId = (characterId) => {
        promo.characterId = characterId;
        DB.Query(`UPDATE promocodes SET characterId = ? WHERE id = ?`, [promo.characterId, promo.id]);
    };
    promo.setRefReward = (refReward) => {
        promo.refReward = refReward;
        DB.Query(`UPDATE promocodes SET refReward = ? WHERE id = ?`, [promo.refReward, promo.id]);
    };
    promo.setMediaReward = (mediaReward) => {
        promo.mediaReward = mediaReward;
        DB.Query(`UPDATE promocodes SET mediaReward = ? WHERE id = ?`, [promo.mediaReward, promo.id]);
    };
    promo.setLevel = (level) => {
        promo.level = level;
        DB.Query(`UPDATE promocodes SET level = ? WHERE id = ?`, [promo.level, promo.id]);
    };
    promo.activatePromo = (refferalCode, characterId) => {
        DB.Query(`INSERT INTO promocodes_history (refferalCode,level,refId,mediaId,refReward,mediaReward) VALUES (?,?,?,?,?,?)`, [refferalCode, promo.level, characterId, promo.characterId, promo.refReward, promo.mediaReward]);
    };
}