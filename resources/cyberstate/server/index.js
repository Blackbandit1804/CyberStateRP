"use strict";

Math.clamp = function(value, min, max) {
    return Math.max(min, Math.min(max, value));
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

global.alt = require('alt');
global.bcrypt = require('bcrypt-nodejs');
global.DB = require('./modules/DB');
global.Config = require('./config.js');
global.terminal = require('./modules/terminal.js');
global.debug = (text) => {
    terminal.debug(text);
};

var fs = require('fs');
var path = require('path');

function convertToUnsigned(value) {
    return (value >>> 0);
}

process.on('uncaughtException', function(error) {
  console.error(error);
});

process.on('unhandledRejection', function(reason, p){
  console.error(reason);
  console.error(p);
});

global.jhash = function(key) {
    let keyLowered = key.toLowerCase();
    let length = keyLowered.length;
    let hash, i;

    for (hash = i = 0; i < length; i++){
        hash += keyLowered.charCodeAt(i);
        hash += (hash << 10);
        hash ^= (hash >>> 6);
    }

    hash += (hash << 3);
    hash ^= (hash >>> 11);
    hash += (hash << 15);

    return convertToUnsigned(hash);
}

global.setSaveTimeout = require('safe-timers').setTimeout;
global.setSaveTimeoutAt = require('safe-timers').setTimeoutAt;
global.setSaveInterval = require('safe-timers').setInterval;
global.clearSaveInterval = require('safe-timers').clearInterval;

var Events = [];

DB.Connect(function() {
    fs.readdirSync(path.resolve(__dirname, 'events')).forEach(function(i) {
        Events = Events.concat(require('./events/' + i));
    });

    setSaveTimeout(() => {
        alt.emit('ServerInit');
    }, 1000);
});

process.on("SIGINT", function () {
    alt.Player.all.forEach((rec) => {
        if (rec.sqlId) {
            savePlayerDBParams(rec);
        }
    });
    process.exit();
});

global.getHash = function(str) {
    var sum = 0;
    for (var i = 0; i < str.length; i++) {
        sum += str.charCodeAt(i);
    }
    return sum;
}

String.prototype.escape = function() {
    return this.replace(/[&"'\\]/g, "");
};
