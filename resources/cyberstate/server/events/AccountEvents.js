function accountIsOnline(sqlId) {
    if (!sqlId) return false;
    var isFind = false;
    alt.Player.all.forEach((rec) => {
        if (rec.account && rec.account.id == sqlId) isFind = true;
    });
    return isFind;
}

function characterIsOnline(sqlId) {
    if (!sqlId) return false;
    var isFind = false;
    alt.Player.all.forEach((rec) => {
        if (rec.sqlId == sqlId) isFind = true;
    });
    return isFind;
}

function initLocalVars(player) {
    alt.emitClient(player, "setLocalVar", "maxCharacters", Config.maxCharacters);
    alt.emitClient(player, "setLocalVar", "maxPickUpItemDist", Config.maxPickUpItemDist);
    alt.emitClient(player, "setLocalVar", "inventoryItems", alt.inventory.items)
} 

alt.emailCodes = new Map();

alt.onClient("sendEmailCode", (player, email, login) => {
    if (player.account) return player.utils.error(`Вы уже вошли в учетную запись!`);
    if (!login || login.length < 5 || login.length > 20) return player.utils.error(`Логин должен состоять из 5-20 символов!`);
    if (!email || email.length > 40) return player.utils.error(`Email должен быть менее 40 символов!`);

    var r = /^[0-9a-z_\.-]{5,20}$/i;
    if (!r.test(login)) return player.utils.error(`Некорректный логин!`);

    var r = /^[0-9a-z-_\.]+\@[0-9a-z-_]{1,}\.[a-z]{1,}$/i;
    if (!r.test(email)) return player.utils.error("Некорректный Email!");

    DB.Query("SELECT login,email FROM accounts WHERE login=? OR (email=? AND confirmEmail=?)", [login, email, 1], (e, result) => {
        if (e) return alt.log(e);
        if (result.length > 0) {
            if (result[0].login == login) return player.utils.error(`Логин занят!`);
            else if (result[0].email == email) return player.utils.error(`Email занят!`);
        }

        var code = alt.randomInteger(100000, 999999);
        alt.mailer.sendMail(email, `Подтверждение электронной почты`, `Код подтверждения: <b>${code}</b>`);
        alt.emailCodes.set(email, code);

        alt.emitClient(player, `showConfirmCode`);
    });
});

alt.onClient("confirmEmail", (player, email, login) => {
    //alt.log(`sendEmailCode: ${email}`);
    //if (player.account) return player.utils.error(`Вы уже вошли в учетную запись!`);
    var r = /^[0-9a-z_\.-]{5,20}$/i;
    if (!r.test(login)) return player.utils.error(`Некорректный логин!`);

    var r = /^[0-9a-z-_\.]+\@[0-9a-z-_]{1,}\.[a-z]{1,}$/i;
    if (!r.test(email)) return player.utils.error("Некорректный Email!");

    var code = alt.randomInteger(100000, 999999);
    alt.mailer.sendMail(email, `Подтверждение электронной почты`, `Код подтверждения: <b>${code}</b>`);
    alt.emailCodes.set(email, code);

    alt.emitClient(player, `showConfirmCode`);
});

alt.onClient("confirmEmailCode", (player, loginOrEmail, emailCode) => {
    //if (player.account.confirmEmail == 1) return player.utils.error(`Email уже подтвержден!`);
    if (alt.emailCodes.get(loginOrEmail) != emailCode) return player.utils.error(`Неверный код подтверждения Email!`);
    player.utils.setLocalVar("accountEmail", loginOrEmail);
    player.utils.setLocalVar("accountConfirmEmail", 1);
    player.account.confirmEmail = 1;
    player.account.email = loginOrEmail;
    DB.Query(`UPDATE accounts SET confirmEmail=? WHERE login=?`, [1, player.account.login]);
    DB.Query(`UPDATE accounts SET email=? WHERE login=?`, [loginOrEmail, player.account.login]);
    return player.utils.success(`Email подтвержден!`);
});


alt.onClient("changePassword", (player, data) => {
    data = JSON.parse(data);
    if (!data.old || !data.new || !data.retry) return player.utils.error("Заполните поле корректно!");
    DB.Query(`SELECT password,login FROM accounts WHERE login=?`, [player.account.login], (e, result) => {
        if (e) return alt.log(e);
        if (result.length > 0) {
            if (!bcrypt.compareSync(data.old, result[0].password)) return player.utils.error("Старый пароль невереный!");
            if (data.new.length < 6 || data.new.length > 20) return player.utils.error(`Пароль должен состоять из 6-20 символов!`);
            if (data.old == data.new) return player.utils.error("Новый пароль не должен быть равен старому!");
            if (data.new != data.retry) return player.utils.error("Повторный новый пароль невереный!");
            DB.Query(`UPDATE accounts SET password=? WHERE login=?`, [bcrypt.hashSync(data.new), result[0].login]);
            alt.logs.addLog(`${player.account.login} сменил данные от аккаунта. Дата: ${Date.Now()}`, 'account', player.account.id, player.sqlId, { socialClub: player.socialId, login: player.account.login });
            return player.utils.success("Вы успешно сменили пароль!");
        }
    });
});

alt.onClient("regAccount", (player, data) => {
    data = JSON.parse(data);

    if (player.accountRegistrated) return player.utils.error(`Вы уже зарегистрировали учетную запись!`);
    if (!data.login || data.login.length < 5 || data.login.length > 20) return player.utils.error(`Логин должен состоять из 5-20 символов!`);
    if (!data.password || data.password.length < 6 || data.password.length > 20) return player.utils.error(`Пароль должен состоять из 6-20 символов!`);
    if (!data.email || data.email.length > 40) return player.utils.error(`Email должен быть менее 40 символов!`);

    var r = /^[0-9a-z_\.-]{5,20}$/i;
    if (!r.test(data.login)) return player.utils.error(`Некорректный логин!`);

    var r = /^[0-9a-z-_\.]+\@[0-9a-z-_]{1,}\.[a-z]{1,}$/i;
    if (!r.test(data.email)) return player.utils.error("Некорректный email!");

    if (data.emailCode && data.emailCode != -1 && alt.emailCodes.get(data.email) != data.emailCode) {
        alt.emitClient(player, `lightEmailCode`);
        return player.utils.error(`Неверный код подтверждения Email!`);
    }
    var confirmEmail = (data.emailCode) ? 1 : 0;

    DB.Query(`SELECT login,email,socialClub FROM accounts WHERE login=? OR socialClub=? OR (email=? AND confirmEmail=?)`, [data.login, player.socialId, data.email, 1], (e, result) => {
        if (result.length > 0) {
            if (result[0].login.toUpperCase() == data.login.toUpperCase()) {
                alt.emitClient(player, `lightLogin`);
                return player.utils.error(`Логин занят!`);
            } else if (result[0].email.toUpperCase() == data.email.toUpperCase()) {
                alt.emitClient(player, `lightEmail`);
                return player.utils.error(`Email занят!`);
            } else if (result[0].socialClub == player.socialId) {
                return player.utils.error(`Аккаунт с Social Club ${player.socialId} уже зарегистрирован!`);
            }
        } else {
            if (data.emailCode == -1) return alt.emitClient(player, "showConfirmCodeModal");

            var values = [data.login, player.socialId, bcrypt.hashSync(data.password), data.email, player.ip, player.ip, confirmEmail, data.promocode.toUpperCase()];
            DB.Query(`INSERT INTO accounts (login,socialClub,password,email,regIp,lastIp,lastDate,confirmEmail,refferal) VALUES (?,?,?,?,?,?,NOW(),?,?)`,
            values, (e, result) => {
                if (e) return alt.log(e);
                player.accountRegistrated = true;
                //TODO: alt.logs.addLog(`${data.login} зарегистрировал аккаунт. Дата: Date.Now()`, 'account', result.insertId, 0, { socialClub: player.socialId, login: data.login });
                alt.emitClient(player, "regAccountSuccess");
                if (data.emailCode) player.utils.success(`Email подтвержден!`);
            });
        }
    });
});

alt.onClient("recoveryAccount", (player, loginOrEmail) => {
    //alt.log(`recoveryAccount: ${loginOrEmail}`);
    if (!loginOrEmail || loginOrEmail.length == 0) return player.utils.error(`Заполните поле!`);
    var regLogin = /^[0-9a-z_\.-]{5,20}$/i;
    var regEmail = /^[0-9a-z-_\.]+\@[0-9a-z-_]{1,}\.[a-z]{1,}$/i;
    if (!regLogin.test(loginOrEmail) && !regEmail.test(loginOrEmail)) {
        alt.emitClient(player, `lightRecoveryLoginOrEmail`);
        return player.utils.error(`Некорректное значение!`);
    }

    DB.Query("SELECT email FROM accounts WHERE (login=? OR email=?) AND confirmEmail=?", [loginOrEmail, loginOrEmail, 1], (e, result) => {
        if (e) return alt.log(e);
        if (result.length == 0) {
            alt.emitClient(player, `lightRecoveryLoginOrEmail`);
            return player.utils.error(`Учетная запись не найдена!`);
        }

        var code = alt.randomInteger(100000, 999999);
        alt.mailer.sendMail(result[0].email, `Восстановление учётной записи`, `Код восстановления: <b>${code}</b>`);
        alt.emailCodes.set(loginOrEmail, code);

        alt.emitClient(player, `recoveryCodeSent`);
    });
});

alt.onClient("confirmRecoveryCode", (player, loginOrEmail, emailCode) => {
    //alt.log(`confirmRecoveryCode: ${loginOrEmail} ${emailCode}`);

    if (emailCode && alt.emailCodes.get(loginOrEmail) != emailCode) {
        alt.emitClient(player, `lightRecoveryCode`);
        return player.utils.error(`Неверный код подтверждения Email!`);
    }

    player.confirmed = true;
    player.loginOrEmail = loginOrEmail;
    alt.emitClient(player, `recoveryCodeSuccess`);
});

alt.onClient("recoveryAccountNewPassword", (player, password) => {
    if (!player.confirmed) return player.utils.error(`Неверный код подтверждения Email!`);
    delete player.confirmed;

    if (!password || password.length < 6 || password.length > 20) return player.utils.error(`Пароль должен состоять из 6-20 символов!`);

    DB.Query("SELECT id FROM accounts WHERE (login=? OR email=?) AND confirmEmail=?", [player.loginOrEmail, player.loginOrEmail, 1], (e, result) => {
        delete player.loginOrEmail;
        if (e) return alt.log(e);
        if (result.length == 0) return player.utils.error(`Учетная запись не найдена!`);

        DB.Query("UPDATE accounts SET password=? WHERE id=?", [bcrypt.hashSync(password), result[0].id], (e) => {
            if (e) return alt.log(e);

            alt.emitClient(player, `recoveryNewPasswordSuccess`);
        });
    });
});

alt.onClient("kickOfAfk", (player, timer) => {
    if (!timer >= 900) return;
    player.utils.error(`Вы были исключены из игры за AFK более 15 минут.`);
    terminal.log(`${player.getSyncedMeta("name")} был исключен из игры за AFK более 15 минут.`);
    alt.logs.addLog(`${player.getSyncedMeta("name")} был исключен из игры за AFK более 15 минут.`, 'disconnect', player.account.id, player.sqlId, { time: player.authTime });
    player.kick();
});

alt.onClient("authAccount", (player, loginOrEmail, password) => {
    //alt.log(`authAccount: ${loginOrEmail} ${password}`);

    if (!loginOrEmail || loginOrEmail.length == 0) {
        alt.emitClient(player, 'lightTextField', "#authAccount .loginOrEmail");
        return player.utils.error(`Заполните поле!`);
    }
    var regLogin = /^[0-9a-z_\.-]{5,20}$/i;
    var regEmail = /^[0-9a-z-_\.]+\@[0-9a-z-_]{1,}\.[a-z]{1,}$/i;
    if (!regLogin.test(loginOrEmail) && !regEmail.test(loginOrEmail)) {
        alt.emitClient(player, 'lightTextField', "#authAccount .loginOrEmail");
        return player.utils.error(`Некорректное значение!`);
    }

    if (password.length < 6 || password.length > 20) {
        alt.emitClient(player, 'lightTextField', "#authAccount .password");
        return player.utils.error(`Неверный пароль!`);
    }

    DB.Query("SELECT ip FROM ip_ban WHERE ip=?", [player.ip], (e, result) => {
        if (result.length > 0) {
            player.utils.error("Вы забанены!");
            player.kick();
            return;
        }
    });

    DB.Query(`SELECT id,login,email,password,confirmEmail,donate,refferal,isRefferal,free_slot,donate_slot,login,socialClub FROM accounts WHERE (login=? OR (email=? AND confirmEmail=?))`,
    [loginOrEmail, loginOrEmail, 1], (e, result) => {
        if (result.length == 0) return player.utils.error(`Неверный логин/пароль!`)
        else {
            if (bcrypt.compareSync(password, result[0].password)) {
            } else {
                return player.utils.error(`Неверный логин/пароль!`);
            }
        }
        
        //if (result[0].socialClub != player.socialId) return player.utils.error(`Неверный Social Club!`);

        if (accountIsOnline(result[0].id)) return player.utils.error(`Аккаунт ${result[0].login} уже авторизован!`);
        
        player.account = {
            id: result[0].id,
            login: result[0].login,
            email: result[0].email,
            confirmEmail: result[0].confirmEmail,
            donate: result[0].donate,
            refferal: result[0].refferal,
            isRefferal: result[0].isRefferal,
            free_slot: (result[0].free_slot == 0) ? false : true,
            donate_slot: (result[0].donate_slot == 0) ? false : true,
        };

        //initPlayerAchievements(player);
        initLocalVars(player);
        player.utils.success(`Здравствуйте, ${result[0].login}!`);
        player.utils.initChoiceCharacter();

    });
});

alt.onClient("closedMode.open", (player, pin) => {
    if (!player.pinCount) player.pinCount = 0;
    if (pin != Config.pin) {
        terminal.info(`${player.getSyncedMeta("name")} ввел неверно PIN! - ${pin}<br />IP: ${player.ip}<br /> Social Club: ${player.socialId}`);
        //alt.logs.addLog(`${player.getSyncedMeta("name")} ввел неверно PIN! - ${pin}<br />IP: ${player.ip}<br /> Social Club: ${player.socialId}`, 'warning', 0, 0, { pin: pin, ip: player.ip, socialClub: player.socialId });
        player.pinCount++;
        if (player.pinCount > 2) return player.kick();
        return alt.emitClient(player, "lightTextFieldError", ".modal .pin", "Неверный PIN!");
    }
    
    delete player.pinCount;

    alt.emitClient(player, "modal.hide");
    alt.emitClient(player, "showAuthAccount");
});