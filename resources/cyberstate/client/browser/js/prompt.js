$(document).ready(() => {
    const SHOW_TIME = 10000;
    var prompts = {
        "select_menu": {
            text: "Используйте <span class=\"hint-main__info-button\">&uarr;</span> <span class=\"hint-main__info-button\">&darr;</span> <span class=\"hint-main__info-button\">&crarr;</span> для выбора пункта в меню.",
            showTime: 60000
        },
        "vehicle_engine": {
            text: "Нажмите <span class=\"hint-main__info-button\">2</span>, чтобы завести двигатель автомобиля."
        },
        "vehicle_repair": {
            text: "Автомобиль поломался. Необходимо вызвать механика."
        },
        "choiceMenu_help": {
            text: "Используйте клавиши <span class=\"hint-main__info-button\">Y</span> и <span class=\"hint-main__info-button\">N</span>",
            header: "Диалог предложения",
        },
        "documents_help": {
            text: "Нажмите <span class=\"hint-main__info-button\">E</span> для закрытия",
            header: "Документы",
        },
        "health_help": {
            text: "Приобрести медикаменты можно в больнице.",
            header: "Лечение",
        },
        "police_service_recovery_carkeys": {
            text: "Вызовите службу, чтобы пригнать авто к участку.",
            header: "Восстановление ключей",
        },
        "band_zones_attack_win": {
            text: "Влияние Вашей группировки увеличилось!",
            header: "Гетто",
        },
        "band_zones_attack_lose": {
            text: "Вашей группировке не удалось увеличить влияние!",
            header: "Гетто",
        },
        "band_zones_defender_win": {
            text: "Ваша группировка отстояла территорию!",
            header: "Гетто",
        },
        "band_zones_defender_lose": {
            text: "Влияние Вашей группировки уменьшилось!",
            header: "Гетто",
        },
    }

    window.promptAPI = {
        showByName: (name, eventId) => {
            var info = prompts[name];
            if (!info) return;
            var showTime = SHOW_TIME;
            if (info.showTime) showTime = info.showTime;

            promptAPI.show(info.text, info.header, showTime, eventId);
        },
        show: (text, header = "Подсказка", showTime = SHOW_TIME, eventId) => {
            $(".hint .hint-header .hint-header__title").text(header);
            $(".hint .hint-main .hint-main__info").html(text);

            var height = Math.abs(parseFloat($(".hint .hint-header .hint-header__title").height()) + parseFloat($(".hint .hint-main .hint-main__info").height()));
            $(".hint .body").height(height);
            $(".hint").slideDown("fast");

            if (eventId != -1) {
                setTimeout(() => {
                    promptAPI.hide();
                }, showTime);
            }
        },
        hide: () => {
            $(".hint").slideUp("fast");
        }
    };
});

alt.on(`promptAPI.show`, (text, header) => {
    promptAPI.show(text, header);
});

alt.on(`promptAPI.showByName`, (text, header) => {
    promptAPI.showByName(text, header);
});

alt.on(`promptAPI.hide`, () => {
    promptAPI.hide();
});