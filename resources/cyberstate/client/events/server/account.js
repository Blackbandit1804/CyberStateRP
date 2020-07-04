import alt from 'alt';
import game from 'natives';

alt.on(`Client::init`, (view) => {
    const storage = alt.LocalStorage.get();

    alt.onServer("showSelectorCharacters", (data) => {
        game.setEntityAlpha(game.playerPedId(), 0);
        view.emit(`hideEnterAccount`);
        view.emit(`selectMenu.hide`);
        view.emit(`showSelectorCharacters`, data);
        alt.emit(`effect`, 'MP_job_load', 100000);
    });
    
    alt.onServer("showConfirmCodeModal", () => {
        view.emit(`showConfirmCodeModal`);
    });
    
    alt.onServer("showAuthAccount", () => {
        if (storage.get(`account`)) {
            var loginOrEmail = storage.get(`account`).loginOrEmail;
            var password = storage.get(`account`).password;
            view.emit(`showAuthAccount`, loginOrEmail, password);
        } else {
            view.emit(`showAuthAccount`);
        }
    });
    
    alt.onServer("lightLogin", () => {
        view.emit(`lightLogin`);
    });
    
    alt.onServer("lightEmail", () => {
        view.emit(`lightEmail`);
    });
    
    alt.onServer("lightEmailCode", () => {
        view.emit(`lightEmailCode`);
    });
    
    alt.onServer("lightRecoveryLoginOrEmail", () => {
        view.emit(`lightRecoveryLoginOrEmail`);
    });
    
    alt.onServer("lightRecoveryCode", () => {
        view.emit(`lightRecoveryCode`);
    });
    
    alt.onServer("lightCharacterName", () => {
        view.emit(`lightCharacterName`);
    });
    
    alt.onServer("recoveryCodeSent", () => {
        view.emit(`recoveryCodeSent`);
    });
    
    alt.onServer("regAccountSuccess", () => {
        view.emit(`regAccountSuccess`);
    });
    
    alt.onServer("recoveryCodeSuccess", () => {
        view.emit(`recoveryCodeSuccess`);
    });
    
    alt.onServer("recoveryNewPasswordSuccess", () => {
        view.emit(`recoveryNewPasswordSuccess`);
    });
});