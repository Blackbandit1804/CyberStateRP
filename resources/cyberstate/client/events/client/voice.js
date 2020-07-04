import alt from 'alt';
import game from 'natives';

alt.initVoice(48000);

const player = alt.Player.local

alt.on(`Client::init`, (view) => {
    let mute_player = false;

    alt.on(`keydown`, (key) => {
        if (key === 78) {
            if (alt.cursorState || alt.chatActive || alt.consoleActive) return;
            if (mute_player) return alt.emit("nError", "Микрофон заблокирован!");
            alt.emit("setLocalVar", "afkTimer", 0);
            alt.enableVoiceInput();
            view.emit(`voiceAPI.on`);
        }
    });

    alt.on(`keyup`, (key) => {
        if (key === 78) {
            alt.disableVoiceInput();
            view.emit(`voiceAPI.off`);
        }
    });

    alt.onServer("control.voice.chat", (status) => {
       mute_player = status;
       alt.disableVoiceInput();
       view.emit(`voiceAPI.off`);
    });
});