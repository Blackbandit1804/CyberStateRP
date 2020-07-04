alt.onClient("atmMenu.addMoney", (player, money) => {
    try {
        BankInfo.functions.putBalanceMoney(player, money);
    } catch (err) {
        alt.log(err);
        return;
    }
});
    
alt.onClient("atmMenu.withdrawMoney", (player, money) => {
    try {
    BankInfo.functions.takeBalanceMoney(player, money);
    } catch (err) {
        alt.log(err);
        return;
    }
});