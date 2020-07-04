$(document).ready(() => {
    window.currentChoiceMenu;
    var menus = {
        "accept_sell_biz": {
            text: "Egor Moiseew предлагает Вам купить бизнес 'Закусочная' за 10000$.",
            on: (values) => {
                menus["accept_sell_biz"].text = `${values.owner} предлагает Вам купить бизнес '${values.type}' за ${values.price}$.`;
            },
            yes: () => {
                alt.emit(`events.emitServer`, "biz.sell.accept");
            },
            no: () => {
                alt.emit(`events.emitServer`, "biz.sell.cancel");
            },
        },
        "accept_trade": {
            text: "Egor Moiseew хочет с Вами торговаться.",
            on: (values) => {
                menus["accept_trade"].text = `${values.name} хочет с Вами торговаться.`;
            },
            yes: () => {
                alt.emit(`events.emitServer`, "trade.offer.agree");
            },
            no: () => {
                alt.emit(`events.emitServer`, "trade.offer.cancel");
            },
        },
        "accept_invite": {
            text: "Egor Moiseew предлагает Вам вступить в Правительство.",
            on: (values) => {
                menus["accept_invite"].text = `${values.name} предлагает Вам вступить в ${values.faction}.`;
            },
            yes: () => {
                alt.emit(`events.emitServer`, "factions.offer.agree");
            },
            no: () => {
                alt.emit(`events.emitServer`, "factions.offer.cancel");
            },
        },
        "accept_health": {
            text: "Egor Moiseew предлагает Вам лечение за 9999$.",
            on: (values) => {
                menus["accept_health"].text = `${values.name} предлагает Вам лечение за ${values.price}$.`;
            },
            yes: () => {
                alt.emit(`events.emitServer`, "hospital.health.agree");
            },
            no: () => {
                alt.emit(`events.emitServer`, "hospital.health.cancel");
            },
        },
        "acccept_trash_team": {
            text: "Tomat Petruchkin предлагает Вам вступить в Бригаду.",
            on: (values) => {
                menus["acccept_trash_team"].text = `${values.name} предлагает Вам вступить в Бригаду.`;
            },
            yes: () => {
                alt.emit(`events.emitServer`, "trash.team.agree");
            },
            no: () => {
                alt.emit(`events.emitServer`, "trash.team.cancel");
            },
        },
        "acccept_gopostal_team": {
            text: "Tomat Petruchkin предлагает Вам вступить в Группу.",
            on: (values) => {
                menus["acccept_gopostal_team"].text = `${values.name} предлагает Вам вступить в Группу.`;
            },
            yes: () => {
                alt.emit(`events.emitServer`, "gopostal.team.agree");
            },
            no: () => {
                alt.emit(`events.emitServer`, "gopostal.team.cancel");
            },
        },
        "accept_job_builder": {
            text: "Вы хотите начать работу <Работа>?",
            on: (values) => {
                menus["accept_job_builder"].text = `Вы хотите ${values.name}`;
            },
            yes: () => {
                alt.emit(`events.emitServer`, "job.builder.agree");
            },
            no: () => {
                alt.emit("client.job.cursor.cancel");
            },
        },
        "accept_job_taxi": {
            text: "Вы хотите начать работу <Работа>?",
            on: (values) => {
                menus["accept_job_taxi"].text = `Вы хотите ${values.name}`;
            },
            yes: () => {
                alt.emit(`events.emitServer`, "job.taxi.agree");
            },
            no: () => {
                alt.emit("client.job.cursor.cancel");
            },
        },
        "accept_job_waterfront": {
            text: "Вы хотите начать работу <Работа>?",
            on: (values) => {
                menus["accept_job_waterfront"].text = `Вы хотите ${values.name}`;
            },
            yes: () => {
                alt.emit(`events.emitServer`, "job.waterfront.agree");
            },
            no: () => {
                alt.emit("client.job.cursor.cancel");
            },
        },
        "accept_job_trucker": {
            text: "Вы хотите начать работу <Работа>?",
            on: (values) => {
                menus["accept_job_trucker"].text = `Вы хотите ${values.name}`;
            },
            yes: () => {
                alt.emit(`events.emitServer`, "job.trucker.agree");
            },
            no: () => {
                alt.emit("client.job.cursor.cancel");
            },
        },
        "accept_job_pizza": {
            text: "Вы хотите начать работу <Работа>?",
            on: (values) => {
                menus["accept_job_pizza"].text = `Вы хотите ${values.name}`;
            },
            yes: () => {
                alt.emit(`events.emitServer`, "job.pizza.agree");
            },
            no: () => {
                alt.emit("client.job.cursor.cancel");
            },
        },
        "accept_job_postal": {
            text: "Вы хотите начать работу <Работа>?",
            on: (values) => {
                menus["accept_job_postal"].text = `Вы хотите ${values.name}`;
            },
            yes: () => {
                alt.emit(`events.emitServer`, "job.gopostal.agree");
            },
            no: () => {
                alt.emit("client.job.cursor.cancel");
            },
        },
        "accept_job_trash": {
            text: "Вы хотите начать работу <Работа>?",
            on: (values) => {
                menus["accept_job_trash"].text = `Вы хотите ${values.name}`;
            },
            yes: () => {
                alt.emit(`events.emitServer`, "job.trash.agree");
            },
            no: () => {
                alt.emit("client.job.cursor.cancel");
            },
        },
        "invite_inhouse_confirm": {
            text: "Egor Moiseew приглашает Вас в свой дом.",
            on: (values) => {
                houseMenu.__vue__.exitMenu();
                menus["invite_inhouse_confirm"].text = `${values.name} приглашает Вас в свой дом.`;
            },
            yes: () => {
                houseMenu.__vue__.exitMenu();
                alt.emit(`events.emitServer`, "house.invite.agree");
            },
            no: () => {
                alt.emit(`events.emitServer`, "house.invite.cancel");
            }
        },
        "sellhousegov_confirm": {
            text: "Вы действительно хотите продать свой дом государству за $100.",
            on: (values) => {
                houseMenu.__vue__.exitMenu();
                menus["sellhousegov_confirm"].text = `Вы действительно хотите продать свой дом государству за $${values.price}.`;
            },
            yes: () => {
                houseMenu.__vue__.exitMenu();
                alt.emit(`events.emitServer`, "house.sellgov.agree");
            },
            no: () => {}
        },
        "sellhouseplayer_confirm": {
            text: "Вы действительно хотите продать свой дом Carter за $100?",
            on: (values) => {
                houseMenu.__vue__.exitMenu();
                menus["sellhouseplayer_confirm"].text = `Вы действительно хотите продать свой дом ${values.name} за $${values.price}?`;
            },
            yes: () => {
                houseMenu.__vue__.exitMenu();
                alt.emit(`events.emitServer`, "house.sellplayer.agree");
            },
            no: () => {
                alt.emit(`events.emitServer`, "house.sellplayer.cancel");
            }
        },
        "buyhouseplayer_confirm": {
            text: "Carter предлагает Вам купить его Дом 1 за $1000.",
            on: (values) => {
                houseMenu.__vue__.exitMenu();
                menus["buyhouseplayer_confirm"].text = `${values.name} предлагает Вам купить его Дом ${values.houseid} за $${values.price}.`;
            },
            yes: () => {
                houseMenu.__vue__.exitMenu();
                alt.emit(`events.emitServer`, "house.buyhouseplayer.agree");
            },
            no: () => {
                alt.emit(`events.emitServer`, "house.buyhouseplayer.cancel");
            }
        },
        "accept_familiar": {
            text: "Гражданин хочет с Вами познакомиться.",
            yes: () => {
                alt.emit(`events.emitServer`, "familiar.offer.agree");
            },
            no: () => {
                alt.emit(`events.emitServer`, "familiar.offer.cancel");
            },
        },
        "accept_delete_character": {
            text: "Удалить персонажа Alex Cortez?",
            on: (values) => {
                menus["accept_delete_character"].text = `Удалить персонажа ${values.name}?`;
                menus["accept_delete_character"].name = values.name;
            },
            yes: () => {
                var name = menus["accept_delete_character"].name;
                alt.emit(`events.emitServer`, "deleteCharacter", name);
            },
            no: () => {},
        },
        "sellcar_confirm": {
            text: "Вы действительно хотите продать Infernus Egor Moiseew за $100?",
            on: (values) => {
                menus["sellcar_confirm"].text = `Вы действительно хотите продать ${values.model} за ${values.price * 0.70}$-${values.price * 0.80}$?`;
            },
            yes: () => {
                alt.emit(`events.emitServer`, "car.sell.agree");
            },
            no: () => {
                alt.emit(`events.emitServer`, "car.sell.cancel");
            }
        },
        "sellcarplayer_confirm": {
            text: "Вы действительно хотите продать Infernus Egor Moiseew за $100?",
            on: (values) => {
                menus["sellcarplayer_confirm"].text = `Вы действительно хотите продать ${values.model} ${values.name} за $${values.price}?`;
            },
            yes: () => {
                alt.emit(`events.emitServer`, "car.sellplayer.agree");
            },
            no: () => {
                alt.emit(`events.emitServer`, "car.sellplayer.cancel");
            }
        },
        "buycarplayer_confirm": {
            text: "Carter предлагает Вам купить Infernus за $1000.",
            on: (values) => {
                menus["buycarplayer_confirm"].text = `${values.name} предлагает Вам купить ${values.model} за $${values.price}.`;
            },
            yes: () => {
                alt.emit(`events.emitServer`, "car.buycarplayer.agree");
            },
            no: () => {
                alt.emit(`events.emitServer`, "car.buycarplayer.cancel");
            }
        },
        "accept_fix_car": {
            text: "Вы уверены, что хотите доставить транспорт за 0$?",
            on: (sqlId) => {
                menus["accept_fix_car"].text = `Вы уверены, что хотите доставить транспорт за 0$?`;
                menus["accept_fix_car"].sqlid = sqlId;
            },
            yes: () => {
                var sqlid = menus["accept_fix_car"].sqlid;
                alt.emit(`events.emitServer`, "car.fix.accept", sqlid);
            },
            no: () => {}
        }
    };

    var timerId;
    window.choiceMenuAPI = {
        show: (name, values) => {
            var menu = menus[name];
            if (!menu) return;
            currentChoiceMenu = menu;

            $("#notification").slideDown("fast");
            if (menu.on && values) menu.on(JSON.parse(values));
            $("#notification .body .text").html(menu.text);

            $('#notification').css('left', Math.max(0, (($(window).width() - $('#notification').outerWidth()) / 2) + $(window).scrollTop()) + 'px');
            $('#notification').css('top', '10vh');

            var times = 9;
            $("#notification .body .body__buttons .danger").html(`Закрыть (<span>${times}с</span>)`);
            clearInterval(timerId);
            timerId = setInterval(() => {
                times--;
                $("#notification .body .body__buttons .danger").html(`Закрыть (<span>${times}с</span>)`);
                if (times < 1) {
                    clearInterval(timerId);
                    choiceMenuAPI.hide();
                }
            }, 1000);

            $("#notification .body .body__buttons .danger").on("click", () => {
                currentChoiceMenu.no();
                choiceMenuAPI.hide();
            });
            $("#notification .body .body__buttons .success").on("click", () => {
                currentChoiceMenu.yes();
                choiceMenuAPI.hide();
            });
            $(document).keydown(choiceMenuAPI.handler);

            promptAPI.showByName("choiceMenu_help");
        },
        hide: () => {
            $("#notification .body .body__buttons .danger").off("click");
            $("#notification .body .body__buttons .success").off("click");
            $(document).unbind('keydown', choiceMenuAPI.handler);
            currentChoiceMenu = null;
            $("#notification").slideUp("fast");
            clearInterval(timerId);
            promptAPI.hide();
        },
        handler: (e) => {
            if (window.medicTablet.active()
            || window.pdTablet.active()
            || window.clientStorage.hasCuffs
            //|| window.armyTablet.active()
            // || window.sheriffTablet.active()
            //|| window.fibTablet.active()
            || window.playerMenu.active()
            || window.consoleAPI.active()
            || window.modalAPI.active()
            || window.playerMenu.active()
            || window.chatAPI.active()
            || window.documentsAPI.active()
            || window.telePhone.active()
            || window.houseMenu.__vue__.active()) return
            if (e.keyCode == 78) { // N
                currentChoiceMenu.no();
                choiceMenuAPI.hide();
            } else if (e.keyCode == 89) { // Y
                currentChoiceMenu.yes();
                choiceMenuAPI.hide();
            }
        },
    };
});

alt.on(`choiceMenuAPI.show`, (name, values) => {
    choiceMenuAPI.show(name, values);
});

alt.on(`choiceMenuAPI.hide`, () => {
    choiceMenuAPI.hide();
});