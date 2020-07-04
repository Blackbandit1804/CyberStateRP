$(document).ready(() => {
    $("#authenticationApp .login .switch input").on("click", () => {
        window.autoLogin = !window.autoLogin;
    });

    $("#authenticationApp .registration input").on("keyup", (e) => {
        if (e.keyCode == 13) { //enter
            regAccountHandler(-1);
        }
    });

    $("#authenticationApp .login input").on("keyup", (e) => {
        if (e.keyCode == 13) { //enter
            authAccountHandler();
        }
    });

    $("#authenticationApp .recovery-modal input").on("keyup", (e) => {
        if (e.keyCode == 13) { //enter
            recoveryAccountHandler();
        }
    });
});
//
function showAuthAccount(loginOrEmail = null, password = null) {
    if (loginOrEmail && password) {
        $(".authentication .login .loginOrEmail").val(loginOrEmail);
        $(".authentication .login .password").val(password);
        $(".authentication .login .switch input").attr("checked", true);
        window.autoLogin = true;
    } else {
        clearForm(".login");
    }
    showWelcomeScreen();
    alt.emit(`Cursor::show`, true);
}

alt.on("showAuthAccount", (loginOrEmail, password) => {
    if (loginOrEmail && password) showAuthAccount(loginOrEmail, password);
    else showAuthAccount();
});

function clearForm(form) {
    $(form).find("input[type='text']").each((index, input) => {
        $(input).val("");
    });
    $(form).find("input[type='password']").each((index, input) => {
        $(input).val("");
    });
}
//
function regAccountHandler(emailCode) {
    var data = {
        login: $(`#authenticationApp .registration #reg-login`).val().trim(),
        email: $(`#authenticationApp .registration #reg-email`).val().trim(),
        password: $(`#authenticationApp .registration #reg-password`).val().trim(),
        promocode: $(`#authenticationApp .registration #promocode`).val().trim()
    };

    if (data.email.length == 0) {
        return lightTextFieldError("#authenticationApp .registration #reg-email", "Введите Email!");
    }

    if (data.login.length == 0) {
        return lightTextFieldError("#authenticationApp .registration #reg-login", "Введите логин!");
    }

    if (data.password.length == 0) {
        return lightTextFieldError("#authenticationApp .registration #reg-password", "Введите пароль!");
    }
    var password2 = $(`#authenticationApp .registration #reg-password2`).val().trim();
    if (password2.length == 0) {
        return lightTextFieldError("#authenticationApp .registration #reg-password2", "Повторите пароль!");
    }

    if (data.login.length < 5 || data.login.length > 20) {
        return lightTextFieldError("#authenticationApp .registration #reg-login", "Логин должен состоять из 5-20 символов!");
    }
    if (data.email.length > 40) {
        return lightTextFieldError("#authenticationApp .registration #reg-email", "Email должен быть менее 40 символов!");
    }
    var r = /^[0-9a-z_\.-]{5,20}$/i;
    if (!r.test(data.login)) {
        return lightTextFieldError("#authenticationApp .registration #reg-login", "Некорректный логин!");
    }

    if (data.password.length < 6 || data.password.length > 20) {
        return lightTextFieldError("#authenticationApp .registration #reg-password", "Пароль должен состоять из 6-20 символов!");
    }

    var r = /^[0-9a-z-_\.]+\@[0-9a-z-_]{1,}\.[a-z]{1,}$/i;
    if (!r.test(data.email)) {
        return lightTextFieldError("#authenticationApp .registration #reg-email", "Некорректный email!");
    }
    if (password2 != data.password) {
        return lightTextFieldError("#authenticationApp .registration #reg-password2", "Пароли не совпадают!");
    }

    if (emailCode) data.emailCode = emailCode;
    alt.emit(`regAccount`, JSON.stringify(data));
}
//
function sendEmailCode() {
    if (isFlood()) return;
    if (window.confirmEmailSent) return alt.emit(`nError`, `Код уже отправлен!`);
    var email = $(`#authenticationApp .registration #reg-email`).val().trim();
    var login = $(`#authenticationApp .registration #reg-login`).val().trim();
    alt.emit(`sendEmailCode`, email, login);
}
//
function initConfirmEmailHandler() {
    var handler = () => {
        if (isFlood()) return;
        var code = parseInt($("#authenticationApp .email-confirm-modal #email-confirm-code").val().trim());
        if (isNaN(code) || (code + "").length != 6) {
            return lightTextFieldError($("#authenticationApp .email-confirm-modal #email-confirm-code"), "Неверный код!");
        }
        regAccountHandler(code);
    };
    $("#authenticationApp .email-confirm-modal #email-confirm-code").focus();
    $("#authenticationApp .email-confirm-modal #email-confirm-code").off("keyup");
    $("#authenticationApp .email-confirm-modal #email-confirm-code").on("keyup", (e) => {
        if (e.keyCode == 13) { //enter
            handler();
        }
    });

    window.confirmEmailSent = true;
    $("#authenticationApp .email-confirm-modal .email-confirm-button").off();
    $("#authenticationApp .email-confirm-modal .email-confirm-button").click(handler);
}
//
function recoveryCodeEntered() {
    if (isFlood()) return;
    var code = parseInt($("#authenticationApp .recovery-modal #recovery-code").val().trim());
    if (isNaN(code) || (code + "").length != 6) {
        return lightTextFieldError($("#authenticationApp .recovery-modal #recovery-code"), "Неверный код!");
    }
    var loginOrEmail = $('#authenticationApp .recovery #recovery-login').val().trim();
    alt.emit(`confirmRecoveryCode`, loginOrEmail, code);
}
//
function showRecoveryCodeTextField() {
    $("#authenticationApp .authentication-screen").fadeOut(500).promise().done(function() {
        $("#authenticationApp .recovery-modal").fadeIn(250).promise().done(function() {
            $("#authenticationApp .recovery-modal #recovery-code").focus();
            $("#authenticationApp .recovery-modal #recovery-code").off("keyup");
            $("#authenticationApp .recovery-modal #recovery-code").on("keyup", (e) => {
                if (e.keyCode == 13) { //enter
                    recoveryCodeEntered();
                }
            });
            window.recoveryCodeSent = true;
        });
    });
}

alt.on("recoveryCodeSent", () => {
    alt.emit(`nSuccess`, `Код отправлен!`);
    showRecoveryCodeTextField();
});

//
function regAccountSuccess() {
    alt.emit(`nSuccess`, `Учетная запись зарегистрирована!`);
    authenticationApp.showAuthAccount();
    clearForm("#authenticationApp .registration");
    $("#authenticationApp .registration .button").attr("onclick", "");
    $("#authenticationApp .registration .button").on("click", () => {
        alt.emit(`nError`, `Вы уже зарегистрировали учетную запись!`);
    });
}

alt.on("regAccountSuccess", () => {
    regAccountSuccess();
});

//
function recoveryAccountHandler() {
    var loginOrEmail = $(`#authenticationApp .recovery #recovery-login`).val().trim();
    if (!loginOrEmail || loginOrEmail.length == 0) {
        return lightTextFieldError("#authenticationApp .recovery #recovery-login", "Заполните поле!");
    }
    var regLogin = /^[0-9a-z_\.-]{5,20}$/i;
    var regEmail = /^[0-9a-z-_\.]+\@[0-9a-z-_]{1,}\.[a-z]{1,}$/i;
    if (!regLogin.test(loginOrEmail) && !regEmail.test(loginOrEmail)) {
        return lightTextFieldError("#authenticationApp .recovery #recovery-login", "Некорректное значение!");
    }

    alt.emit("recoveryAccount", loginOrEmail);
}
//
function recoveryChangePassword() {
    if (isFlood()) return;
    var password = $("#authenticationApp .forgot-password-modal #forgot-password").val().trim();
    var password2 = $("#authenticationApp .forgot-password-modal #forgot-password2").val().trim();

    if (password.length == 0) {
        return lightTextFieldError("#authenticationApp .forgot-password-modal #forgot-password", "Введите пароль!");
    }
    if (password2.length == 0) {
        return lightTextFieldError("#authenticationApp .forgot-password-modal #forgot-password2", "Повторите пароль!");
    }
    if (password.length < 6 || password.length > 20) {
        return lightTextFieldError("#authenticationApp .forgot-password-modal #forgot-password", "Пароль должен состоять из 6-20 символов!");
    }
    if (password2 != password) {
        return lightTextFieldError("#authenticationApp .forgot-password-modal #forgot-password2", "Пароли не совпадают!");
    }

    var loginOrEmail = $('#authenticationApp .recovery #recovery-login').val().trim();
    alt.emit(`recoveryAccountNewPassword`, password);
};
//
function recoveryCodeSuccess() {
    $("#authenticationApp .recovery-modal").fadeOut(500).promise().done(function() {
        $("#authenticationApp .forgot-password-modal").fadeIn(250);
    });
    $("#authenticationApp .forgot-password-modal #forgot-password").focus();
    $("#authenticationApp .forgot-password-modal input").off("keyup");
    $("#authenticationApp .forgot-password-modal input").on("keyup", (e) => {
        if (e.keyCode == 13) { //enter
            recoveryChangePassword();
        }
    });
}

alt.on("recoveryCodeSuccess", () => {
    recoveryCodeSuccess();
});

//
function recoveryNewPasswordSuccess() {
    $("#authenticationApp .forgot-password-modal").fadeOut(500).promise().done(function() {
        $("#authenticationApp .authentication-screen").fadeIn(250).promise().done(function() {
            var handler = () => {
                alt.emit(`nError`, `Вы уже восстановили учетную запись!`);
            };

            alt.emit(`nSuccess`, `Пароль успешно изменён!`);

            $("#authenticationApp .recovery input").off("keyup");
            $("#authenticationApp input").on("keyup", (e) => {
                if (e.keyCode == 13) { //enter
                    handler();
                }
            });

            $("#authenticationApp .forgot-password-modal #forgot-password").val("");
            $("#authenticationApp .forgot-password-modal #forgot-password2").val("");
            $("#authenticationApp .recovery #recovery-login").val("");
            $("#authenticationApp .recovery .recovery-status").text("На Ваш email будет отправлен проверочный код.");
            $("#authenticationApp .recovery .recovery-button").off("click");
            $("#authenticationApp .recovery .recovery-button").on("click", handler);
        });
    });
}

alt.on("recoveryNewPasswordSuccess", () => {
    recoveryNewPasswordSuccess();
});

//
function authAccountHandler() {
    if (isFlood()) return;
    var loginOrEmail = $(".authentication .login #login-email").val().trim();
    if (!loginOrEmail || loginOrEmail.length == 0) {
        lightTextField(".authentication .login #login-email", "#b44");
        return nError(`Заполните поле!`);
    }

    var regLogin = /^[0-9a-z_\.-]{5,20}$/i;
    var regEmail = /^[0-9a-z-_\.]+\@[0-9a-z-_]{1,}\.[a-z]{1,}$/i;
    if (!regLogin.test(loginOrEmail) && !regEmail.test(loginOrEmail)) {
        lightTextField(".authentication .login #login-email", "#b44");
        return nError(`Некорректное значение!`);
    }

    var password = $(".authentication .login .password").val().trim();
    if (password.length < 6 || password.length > 20) {
        lightTextField(".authentication .login #login-password", "#b44");
        return nError(`Неверный пароль!`);
    }

    alt.emit(`account.setAutoLogin`, window.autoLogin, loginOrEmail, password);

    alt.emit("authAccount", loginOrEmail, password);
}

const nameRegex = /^([A-Z][a-z]{1,15})$/;

function regCharacterHandler() {
	const firstName = selectMenuAPI.getValue("character_main", "Имя").trim();
	const lastName = selectMenuAPI.getValue("character_main", "Фамилия").trim();

	if (!nameRegex.test(firstName)) {
		selectMenuAPI.show("character_main", 7);
		//nInfo(`Используйте шаблон 'Имя'`);
        return alt.emit(`nError`, `Имя '${firstName}' некорректно!`);
	}

	if (!nameRegex.test(lastName)) {
		selectMenuAPI.show("character_main", 7);
		//nInfo(`Используйте шаблон 'Фамилия'`);
        alt.emit(`nError`, `Фамилия '${lastName}' некорректна!`);
	}

	alt.emit("regCharacter", `${firstName} ${lastName}`);
}

alt.on(`regCharacterHandler`, () => {
    regCharacterHandler();
});

function showSelectorCharacters(data) {
    data = JSON.parse(data);
    $(`#selectorCharacters .user-block`).hide();
    $(`#selectorCharacters .donate`).text(data.donate);

    var access = [true, data.isFree, data.isDonate];
    var classes = [".slot", ".free-slot", ".donate-slot"];
    for (var i = 0; i < 3; i++) {
        var character = data.characters[i];
        if (character) {
            var slot = $(`#selectorCharacters .busy:eq(0)`).clone();
            $(`#selectorCharacters .user-blocks`).append(slot);

            var levelRest = convertMinutesToLevelRest(character.minutes);
            var maxExp = convertLevelToMaxExp(levelRest.level);
            if (!character.faction) character.faction = "-";

            slot.find(".regDate").text(convertMillsToDate(character.regDate * 1000));
            slot.find(".hours").text(parseInt(character.minutes / 60));
            slot.find(".playerName").text(character.name);
            slot.find(".level").text(levelRest.level);
            slot.find(".exp").text(levelRest.rest + "/" + maxExp);
            slot.find(".faction").text(character.faction);
            slot.find(".money").text(character.money + "$");
            slot.find(".bank").text(character.bank + "$");
            slot.find(".auth-btn").attr("onclick", `choiceMenuAPI.hide(); alt.emit('authCharacter', ${i})`);
            slot.find(".delete-button").attr("onclick", `choiceMenuAPI.show('accept_delete_character', '{"name": "${character.name}"}')`);

            slot.show();
        } else {
            var c = classes[0];
            if (!access[i]) c = classes[i];
            var slot = $(`#selectorCharacters ${c}:eq(0)`).clone();
            $(`#selectorCharacters .user-blocks`).append(slot);

            if (classes.indexOf(c) == 1) {
                slot.find(".open-btn").attr("onclick", `alt.emit('events.emitServer', 'characters.openSlot', 'free')`);
            } else if (classes.indexOf(c) == 2) {
                slot.find(".open-btn").attr("onclick", `alt.emit('events.emitServer', 'characters.openSlot', 'donate')`);
            }

            slot.show();
        }
    }

    $(`#selectorCharacters`).fadeIn("fast");
}


alt.on("showSelectorCharacters", (data) => {
    showSelectorCharacters(`${JSON.stringify(data)}`);
});

function showCharacterInfo(values) {
    values = JSON.parse(values);
    for (var i = 0; i < values.length; i++) {
        $(".characterInfo tr").eq(i).children("td").eq(1).text(values[i]);
    }
    $(".characterInfo").slideDown('fast');
}

alt.on(`copyPed`, (d) => {
    showCharacterInfo(`${JSON.stringify([d.name,d.carsCount+" шт.",d.house,d.biz,d.faction,d.job,d.family])}`);
});

alt.on(`choiceCharacter.left`, (d) => {
    showCharacterInfo(`${JSON.stringify([d.name,d.carsCount+" шт.",d.house,d.biz,d.faction,d.job,d.family])}`);
});

alt.on(`choiceCharacter.right`, (d) => {
    showCharacterInfo(`${JSON.stringify([d.name,d.carsCount+" шт.",d.house,d.biz,d.faction,d.job,d.family])}`);
});

function showCreateCharacterButton() {
    $("#createCharacter").show();
    $('#createCharacter').css('left', Math.max(0, (($(window).width() - $('#createCharacter').outerWidth()) / 2) + $(window).scrollTop()) + 'px');
}

alt.on(`copyPed`, () => {
    showCreateCharacterButton();
});

//
function createCharacter() {
    if (clientStorage.charactersCount >= clientStorage.maxCharacters)
    return nError("У Вас макс. количество персонажей!");
    alt.emit("events.emitServer", "newCharacter", 1);
}
