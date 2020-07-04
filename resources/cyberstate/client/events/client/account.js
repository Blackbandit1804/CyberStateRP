import alt from 'alt';
import game from 'natives';

alt.on(`Client::init`, (view) => {
    view.on("sendEmailCode", (email, login) => {
        alt.emitServer("sendEmailCode", email, login);
    });

    view.on("confirmEmail", (email, login) => {
        alt.emitServer("confirmEmail", email, login);
    });

    view.on("regAccount", (data) => {
        alt.emitServer("regAccount", data);
    });

    view.on("recoveryAccount", (loginOrEmail) => {
        alt.emitServer(`recoveryAccount`, loginOrEmail);
    });

    view.on("confirmEmailCode", (loginOrEmail, code) => {
        alt.emitServer(`confirmEmailCode`, loginOrEmail, code);
    });

    view.on("confirmRecoveryCode", (loginOrEmail, code) => {
        alt.emitServer(`confirmRecoveryCode`, loginOrEmail, code);
    });

    view.on("recoveryAccountNewPassword", (password) => {
        alt.emitServer(`recoveryAccountNewPassword`, password);
    });

    view.on("authAccount", (loginOrEmail, password) => {
        alt.emitServer(`authAccount`, loginOrEmail, password);
    });

    view.on("nSuccess", (text) => {
        alt.emit("BN_Show", text, true, -1, 166);
    });

    view.on("nError", (text) => {
        alt.emit("BN_Show", text, true, -1, 174);
    });
});