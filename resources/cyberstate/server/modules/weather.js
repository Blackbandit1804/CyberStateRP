const fetch = require(`node-fetch`);

module.exports = {
    Init: () => {
        new Weather();
    }
}

class Weather {
    constructor() {
        this.apiKey = `648d20f8dad7b29f2e2d5631ecfacdc0`;
        this.city = `Moscow`;
        this.countryCode = `RU`;
        this.url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city},${this.countryCode}&appid=${this.apiKey}`;
        this.interval = null;
        this.dateInterval = null;
        this.currentWeatherData = {};
        this.currentWeatherType = 0;
        this.currentDate = new Date();
        this.registerEvents();
        this.init();
        this.initWeatherData();
        this.startSync();
    }

    registerEvents() {
        alt.on('playerConnect', (player) => {
            player.setWeather(this.currentWeatherType);
            this.setDate(player);
        });
    }

    async initWeatherData() {
        try {
            let res = await fetch(this.url);
            let json = await res.json();
            if (json !== undefined) {
                this.currentWeatherData = json;
                this.currentWeatherType = await this.getWeatherType();
                this.syncNewData();
            } else {
                console.log("Weather data couldn´t be updated");
            }
        } catch (err) {
            console.error('Fetching weather failed: ' + err);
        }
    }

    getWeatherType(){
        switch (this.currentWeatherData.weather[0].main) {
            case 'Drizzle'      : return 8;
            case 'Clear'        : return 1;
            case 'Clouds'       : return 2;
            case 'Rain'         : return 6;
            case 'Thunderstorm' : return 7;
            case 'Thunder'      : return 7;
            case 'Foggy'        : return 4;
            case 'Fog'          : return 4;
            case 'Mist'         : return 4;
            case 'Smoke'        : return 4;
            case 'Smog'         : return 3;
            case 'Overcast'     : return 5;
            case 'Snowing'      : return 10;
            case 'Snow'         : return 10;
            case 'Blizzard'     : return 11;
            default             : return 1;
        }
    }

    init() {
        this.dateInterval = setSaveInterval(() => {
            if (alt.Player.all.length !== 0) {
                this.currentDate = new Date();
                alt.Player.all.forEach((player) => {
                    this.setDate(player);
                });
            }
        }, 3000);
        this.interval = setSaveInterval(() => this.initWeatherData(), 900000);
    }

    syncNewData() {
        if (alt.Player.all.length !== 0) {
            this.currentDate = new Date();
            alt.Player.all.forEach((player) => {
                player.setWeather(this.currentWeatherType);
                this.setDate(player);
            });
        }
    }

    setDate(player){
        player.setDateTime(
            this.currentDate.getDate(), 
            this.currentDate.getMonth(), 
            this.currentDate.getFullYear(),
            this.currentDate.getHours(), 
            this.currentDate.getMinutes(), 
            this.currentDate.getSeconds()
        );
    }

    startSync() {
        if (this.interval) {
            clearInterval(this.interval);
        }

        if (this.dateInterval) {
            clearInterval(this.dateInterval);
        }

        this.initWeatherData();
        this.init();
    }
}