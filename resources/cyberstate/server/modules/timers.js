const { inLegalInit } = require(`./jobs/smuggling`);

module.exports = {
    InitPayDay: () => {
        var lastPayDayHour = new Date().getHours();
        setSaveInterval(() => {
            try {
                var date = new Date();
                if (date.getMinutes() >= 0 && date.getMinutes() <= 3 && date.getHours() != lastPayDayHour) {
                    //чтобы не умерло соединение с БД (по предположению Carter'а)
                    DB.Query("SELECT null FROM accounts LIMIT 1");

                    lastPayDayHour = date.getHours();
                    alt.clearGangRoobers(); // Обнуляем ограбления игроков для банд
                    allBroadcast();
                    housesTax();
                    // bizesTax();
                    factionsPay(date);
                }
            } catch (e) {
                terminal.error(e);
            }
        }, 60000);
    },
}

/* оповещение всех игроков */
function allBroadcast() {
    alt.Player.all.forEach((rec) => {
        if (rec.sqlId) {
            inLegalInit(rec);
            rec.minutes += parseInt((new Date().getTime() - rec.authTime) / 1000 / 60);
            rec.account.minutes += parseInt((new Date().getTime() - rec.authTime) / 1000 / 60);

            const activity = alt.convertMinutesToLevelRest(rec.minutes);
            rec.utils.setLocalVar("accountHours", rec.account.minutes);
            rec.utils.setLocalVar("hours", rec.minutes);
            rec.utils.setLocalVar("nextLevel", activity.nextLevel);
            rec.utils.setLocalVar("level", activity.level);
            rec.utils.setLocalVar("exp", activity.rest);

            if (rec.account.isRefferal !== 1 && activity.level >= 2) {
                for (let key in alt.promocodes) {
                    if (alt.promocodes[key].refferalCode === rec.account.refferal.toUpperCase() || alt.promocodes[key].refferalCode === rec.account.refferal) {
                        rec.account.isRefferal = 1;
                        DB.Query(`UPDATE accounts SET isRefferal = ? WHERE id = ?`, [1, rec.account.id]);
                        alt.promocodes[key].activatePromo(alt.promocodes[key].refferalCode, rec.sqlId);
                        rec.utils.setMoney(rec.money + alt.promocodes[key].refReward);
                        rec.utils.success(`Вам начислен бонус за реферальный код ${rec.account.refferal} в размере ${alt.promocodes[key].refReward}`);
                    }
                }
            }
        }
    });
}

/* Налоги на дом. */
function housesTax() {
    for (var i = 0; i < alt.houses.length; i++) {
        var house = alt.houses[i];
        if (!house.owner) continue;
        house.setBalance(house.balance - house.getTax());
        var owner = alt.Player.getBySqlId(house.owner);
        if (house.balance <= 0) {
            if (owner) {
                owner.utils.info(`Ваш Дом №${house.sqlId} продан за неуплату налогов!`);
                if(owner.houseId == house.sqlId) {
                    owner.utils.setSpawn(3);
                    owner.utils.setHouseId(0);
                }
                owner.utils.removeHouse(house);
            }
            var price = parseInt(house.price * alt.economy["house_sell"].value);
            if (owner) {
                owner.utils.setBankMoney(owner.bank + price);
                owner.utils.bank(`Недвижимость`, `Начислено: ~g~$${price}`);
            } else {
                DB.Query("UPDATE characters SET bank=bank+? WHERE id=?", [price, house.owner]);
            }
            house.setOwner(0);
        } else if (house.balance <= house.getTax() * 10 && owner) {
            owner.utils.warning(`Пополните счет Дома №${house.sqlId}!`);
        }
    }
}

/* Налоги на бизнес. */
function bizesTax() {
    for (let i = 0; i < alt.bizes.length; i++) {
        const biz = alt.bizes[i];
        if (!biz.owner) continue;
        biz.setBalance(biz.balance - biz.getTax());
        const owner = alt.Player.getBySqlId(biz.owner);
        if (biz.balance <= 0) {
            if (owner) {
                owner.utils.info(`Ваш Бизнес №${biz.sqlId} продан за неуплату налогов!`);
                owner.utils.removeBiz(biz);
            }
            let price = parseInt(biz.price * alt.economy["biz_sell"].value);
            if (owner) {
                owner.utils.setBankMoney(owner.bank + price);
                owner.utils.bank(`Бизнес`, `Начислено: ~g~$${price}`);
            } else {
                DB.Query("UPDATE characters SET bank=bank+? WHERE id=?", [price, biz.owner]);
            }
            biz.setOwner(0);
        } else if (biz.balance <= biz.getTax() * 10 && owner) {
            owner.utils.warning(`Пополните счет Бизнеса №${biz.sqlId}!`);
        }
    }
}

/* Начисление ЗП членам организаций. */
function factionsPay(date) {
    alt.Player.all.forEach((rec) => {
        if (rec.faction) {
            var minutes = parseInt((date.getTime() - rec.authTime) / 1000 / 60);
            if (minutes < 15) return rec.utils.bank(`Организация`, `Вы не отработали 15 минут чтобы получить зарплату!`);
            var pay = alt.factions.getRankPay(rec.faction, rec.rank);
            pay = parseInt(pay);
            rec.utils.setBankMoney(rec.bank + pay);
            rec.utils.bank(`Организация`, `Зарплата: ~g~${pay}$`);
        }
    });
}
