import alt from 'alt';
import game from 'natives';

const ScreenCoords = {
    // base coords
    baseX: 0.918,
    baseY: 0.984,

    // title (left text) coords
    titleOffsetX: 0.012,
    titleOffsetY: -0.009,

    // value (right text) coords
    valueOffsetX: 0.0785,
    valueOffsetY: -0.0165,

    // progress bar coords
    pbarOffsetX: 0.047,
    pbarOffsetY: 0.0015
};

const Sizes = {
    // bar dimensions
    timerBarWidth: 0.165,
    timerBarHeight: 0.035,
    timerBarMargin: 0.038,

    // progress bar dimensions
    pbarWidth: 0.0616,
    pbarHeight: 0.0105
};

function wait(ms) {
    return new Promise(resolve => alt.setTimeout(resolve, ms));
}

const HUDComponents = {
    VehicleName: 6,
    AreaName: 7,
    VehicleClass: 8,
    StreetName: 9
};

const activeTimerBars = [];

const drawText = (text, position, options) => {
    options = { ...{ align: 1, font: 4, scale: 0.3, outline: true, shadow: true, color: [255, 255, 255, 255] }, ...options };

    const font = options.font;
    const scale = options.scale;
    const outline = options.outline;
    const shadow = options.shadow;
    const color = options.color;
    const wordWrap = options.wordWrap;
    const align = options.align;

    game.setNotificationTextEntry("CELL_EMAIL_BCON");
    for (let i = 0; i < text.length; i += 99)
    {
        const subStringText = text.substr(i, Math.min(99, text.length - i));
        game.addTextComponentSubstringPlayerName(subStringText);
    }

    game.setTextFont(font);
    game.setTextScale(scale, scale);
    game.setTextColour(color[0], color[1], color[2], color[3]);

    if (shadow) {
        game.setTextDropshadow();
        game.setTextDropshadow(2, 0, 0, 0, 255);
    }

    if (outline) {
        game.setTextOutline();
    }

    switch (align) {
        case 1: {
            game.setTextCentre(true);
            break;
        }
        case 2: {
            game.setTextRightJustify(true);
            game.setTextWrap(0.0, position[0] || 0);
            break;
        }
    }

    if (wordWrap) {
        game.setTextWrap(0.0, (position[0] || 0) + wordWrap);
    }

    game.drawDebugText(position[0] || 0, position[1] || 0);
}

// timerbar class
class TimerBar {
    constructor(title, useProgressBar = false) {
        this.title = title;
        this.useProgressBar = useProgressBar;
        this.text = "";
        this._pbarValue = 0.0;
        this.textColor = [255, 255, 255, 255];
        this.pbarBgColor = [155, 155, 155, 255];
        this.pbarFgColor = [255, 255, 255, 255];

        this.load();

        this._visible = true;
        activeTimerBars.push(this);
    }

    async load() {
        if (!game.hasStreamedTextureDictLoaded("timerbars")) {
            game.requestStreamedTextureDict("timerbars", true);
            while (!game.hasStreamedTextureDictLoaded("timerbars")) {
                await wait(0);
            }
        }
    }

    get progress() {
        return this._pbarValue;
    }

    set progress(value) {
        this._pbarValue = value <= 0.0 ? 0.0 : value >= 1.0 ? 1.0 : value;
    }

    get visible() {
        return this._visible;
    }

    set visible(value) {
        let idx = activeTimerBars.indexOf(this);
        if (value) {
            if (idx != -1) return;
            activeTimerBars.push(this);
        } else {
            if (idx == -1) return;
            activeTimerBars.splice(idx, 1);
        }

        this._visible = value;
    }
}

// draw timerbars
alt.on("update", () => {
    let safeZone = game.getSafeZoneSize();
    let safeZoneX = (1.0 - safeZone) * 0.5;
    let safeZoneY = (1.0 - safeZone) * 0.5;
    let max = activeTimerBars.length;

    if (max > 0) {
        game.hideHudComponentThisFrame(HUDComponents.VehicleName);
        game.hideHudComponentThisFrame(HUDComponents.AreaName);
        game.hideHudComponentThisFrame(HUDComponents.VehicleClass);
        game.hideHudComponentThisFrame(HUDComponents.StreetName);
    }

    for (let i = 0; i < max; i++) {
        let drawY = (ScreenCoords.baseY - safeZoneY) - (i * Sizes.timerBarMargin);

        // draw bg
        game.drawSprite("timerbars", "all_black_bg", ScreenCoords.baseX - safeZoneX, drawY, Sizes.timerBarWidth, Sizes.timerBarHeight, 0.0, 255, 255, 255, 160);

        // draw title
        drawText(activeTimerBars[i].title, [(ScreenCoords.baseX - safeZoneX) + ScreenCoords.titleOffsetX, drawY + ScreenCoords.titleOffsetY], {
            font: 0,
            color: activeTimerBars[i].textColor,
            scale: 0.3,
            outline: false,
            align: 2,
            shadow: false
        });

        if (activeTimerBars[i].useProgressBar) {
            let pbarX = (ScreenCoords.baseX - safeZoneX) + ScreenCoords.pbarOffsetX;
            let pbarY = drawY + ScreenCoords.pbarOffsetY;
            let width = Sizes.pbarWidth * activeTimerBars[i]._pbarValue;

            // draw background
            game.drawRect(pbarX, pbarY, Sizes.pbarWidth, Sizes.pbarHeight, activeTimerBars[i].pbarBgColor[0], activeTimerBars[i].pbarBgColor[1], activeTimerBars[i].pbarBgColor[2], activeTimerBars[i].pbarBgColor[3]);

            // draw foreground
            game.drawRect((pbarX - Sizes.pbarWidth / 2) + width / 2, pbarY, width, Sizes.pbarHeight, activeTimerBars[i].pbarFgColor[0], activeTimerBars[i].pbarFgColor[1], activeTimerBars[i].pbarFgColor[2], activeTimerBars[i].pbarFgColor[3]);
        } else {
            // draw text
            drawText(activeTimerBars[i].text, [(ScreenCoords.baseX - safeZoneX) + ScreenCoords.valueOffsetX, drawY + ScreenCoords.valueOffsetY], {
                font: 0,
                color: activeTimerBars[i].textColor,
                scale: 0.425,
                outline: false,
                align: 2,
                shadow: false
            });
        }
    }
});

const timerbarHelper = {
	"new": (name, useProgressBar) => new TimerBar(name, useProgressBar)
};

export default timerbarHelper;