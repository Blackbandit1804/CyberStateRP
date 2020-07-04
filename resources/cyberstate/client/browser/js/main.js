window.clientStorage = {
    bandZonesRect: {
        x1: -830.50,
        x2: 2035.06,
        y1: -2673.91,
        y2: -529.23,
    },
};

window.globalConstants = {
    houseClasses: ["-", "A", "B", "C", "D", "E", "F"],
    garageClasses: ["-", "A", "B", "C"],
    garageMaxCars: [0, 2, 6, 10],
    doors: ["Открыта", "Закрыта"],
    bizesInfo: [{
            name: "Закусочная",
            blip: 106
        },
        {
            name: "Бар",
            blip: 93
        },
        {
            name: "Магазин одежды",
            blip: 73
        },
        {
            name: "Барбершоп",
            blip: 71
        },
        {
            name: "АЗС",
            blip: 361
        },
        {
            name: "24/7",
            blip: 52
        },
        {
            name: "Тату салон",
            blip: 75
        },
        {
            name: "Оружейный магазин",
            blip: 110
        },
        {
            name: "Автосалон",
            blip: 524
        },
        {
            name: "LS Customs",
            blip: 72
        },
        {
            name: "СТО",
            blip: 446
        }
    ],
    bizStatus: ["Закрыт", "Открыт"],

};
var mp;
if (mp != null) {
    alt.eventCallRemote = (name, values) => {
        alt.emitServer(name, JSON.stringify(values));
    };
}

function getNameByFactionId(id) {
    var names = ["Мэрия", "LSPD", "BCSO", "FIB", "EMC", "Fort Zancudo", "Merryweather", "Weazel News", "The families",
        "The Ballas Gang", "Varios Los Aztecas Gang", "Los Santos Vagos", "Marabunta Grande", "Русская мафия",
        "Итальянская мафия", "Японская мафия", "Мексиканская мафия"
    ];
    id = Math.clamp(id, 1, names.length - 1);
    return names[id - 1];
}

function setLocalVar(key, value) {
    window.clientStorage[key] = JSON.parse(value);
}

alt.on(`setLocalVar`, (key, value) => {
    setLocalVar(key, value);
});

function debug(text) {
    consoleAPI.debug(text);
}

function setOnlyInt(textField) {
    $(textField).keypress(function(e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });
}

function clearOnlyInt(textField) {
    $(textField).off("keypress");
}

function isFlood() {
    return false;
    if (window.antiFlood) {
        alt.emit(`nError`, 'Anti-FLOOD!');
        return true;
    }
    window.antiFlood = true;
    setTimeout(() => {
        window.antiFlood = false;
    }, 1000);

    return false;
}

function nSuccess(text) {
    alt.emit(`nSuccess`, text);
}

function nError(text) {
    console.error(text);
    alt.emit(`nError`, text);
}

function nInfo(text) {
    alt.emit(`nInfo`, text);
}

// выделить текстовое поле
var lightTextFieldTimer;

function lightTextField(textField, color) {
    if (lightTextFieldTimer) return;
    $(textField).focus();
    var oldColor = $(textField).css("border-color");
    $(textField).css("border-color", color);
    lightTextFieldTimer = setTimeout(() => {
        $(textField).css("border-color", oldColor);
        lightTextFieldTimer = null;
    }, 1000);
}

function lightTextFieldError(textField, text) {
    lightTextField(textField, "#b44");
    //nError(text);
}

alt.on("lightLogin", () => {
    lightTextField('#authenticationApp .block div .login', '#b44');
});

alt.on("lightEmail", () => {
    lightTextField('#authenticationApp .email', '#b44');
});

alt.on("lightEmailCode", () => {
    lightTextField('#authenticationApp .code', '#b44');
});

alt.on("lightRecoveryLoginOrEmail", () => {
    lightTextField('#authenticationApp .loginOrEmail', '#b44');
});

alt.on("lightRecoveryCode", () => {
    lightTextField('#authenticationApp .recovery .code', '#b44');
});

alt.on("lightCharacterName", () => {
    lightTextField('.modal .characterName', '#b44');
});

alt.on(`authCharacterSuccess`, () => {
    $('.bottomHUD').show();
});

function convertMillsToDate(mills) {
    var date = new Date(mills);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var hours = date.getHours();
    var minutes = date.getMinutes();
    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    return day + "." + month + "." + date.getFullYear() + " " + hours + ":" + minutes;
}

function convertMinutesToLevelRest(minutes) {
    var exp = parseInt(minutes / 60);
    if (exp < 4) return {
        level: 1,
        rest: exp
    };
    var i = 2;
    var add = 8;
    var temp = 12;
    while (i < 200) {
        if (exp < temp) {
            return {
                level: i,
                rest: exp - (temp - add)
            };
        }
        i++;
        add += 4;
        temp += add;
    }
    return -1;
}

function convertLevelToMaxExp(level) {
    return 4 + (level - 1) * 4;
}

Math.clamp = function(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

Math.randomInteger = (min, max) => {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}

function getPaddingNumber(str, max = 5) {
    const string = str.toString();
    return string.length < max ? getPaddingNumber(`0${string}`, max) : string;
}

String.prototype.escape = function() {
    return this.replace(/[&"'\\]/g, "");
};


//Function to convert rgb color to hex format
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

var hexDigits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
function hex(x) {
    return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}

// объединение объектов
Object.extend = function(destination, source) {
    for (var property in source) {
        if (source.hasOwnProperty(property)) {
            destination[property] = source[property];
        }
    }
    return destination;
};
