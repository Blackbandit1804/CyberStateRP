import React from 'react';
import { connect } from 'react-redux';
import upperCase from 'upper-case';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faAddressCard, faExclamationTriangle, faCog, faShoppingCart } from '@fortawesome/free-solid-svg-icons'

import playerArt from '../assets/img/playerMenu/playerArt.png';
import lock from '../assets/img/playerMenu/lock.png';
import onedollarcoins from '../assets/img/playerMenu/one-dollar-coins.png';
import home from '../assets/img/playerMenu/home.png';
import achc from '../assets/img/playerMenu/ach-c.png';
import bell from '../assets/img/playerMenu/bell.png';
import vc from '../assets/img/playerMenu/vc.png';
import dl from '../assets/img/playerMenu/dl.png';
import vehicleImg from '../assets/img/playerMenu/sedan-car-front.svg';

import '../assets/css/menuList.css';
import '../assets/css/newPlayerMenu.css';

class PlayerMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            PMPage: 'A',
            pageB: {
                step: 1
            },
            pageC: {
                step: 1
            },
            pageD: {
                step: 1
            },
            pageE: {
                step: 1
            },
            pageESteps: {
                step: 1
            },
            pageDSteps: {
                step: 1
            },
            pageCSteps: {
                step: 1
            },
            pageFSteps: {
                step: 1
            },
            pageF: {
                step: 1
            },
            menuListSteps: {
                step: 0
            },
            skillsMenu: {
                step: 1
            },
            skills: [],
            hud: null,
            chat: null,
            nickname: null,
            nickId: null,
            reportChat: false,
            businessList: false,
            messages: [],
            done: 0,
            myReports: false,
            bizes: [],
            houses: [],
            spawn: null,
            houseId: null,
            paymentsAccount: [],
            reportId: null,
            vehicles: [],
            reports: [],
            achievements: [],
            achievementsPlayer: [],
            showPlayerMenu: false,
            showJobRequirements: 0,
            message: '',
            virtualCoins: 0,
            dollars: 0,
            relationshipName: "-" || null,
            oldPassword: '',
            newPassword: '',
            retryPassword: '',
            changePass: false,
            changeEmail: false,
            confirmEmail: false,
            code: 0,
            confirmEmailState: false
        };

        this.handleOnClick = this.handleOnClick.bind(this);
        this._handleKeyDown = this._handleKeyDown.bind(this);
        this.menuList = this.menuList.bind(this);
        this.getStreet = this.getStreet.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onChangeCoins = this.onChangeCoins.bind(this);
        this.onChangeDollars = this.onChangeDollars.bind(this);
        this.sendReport = this.sendReport.bind(this);
        this.changeOptions = this.changeOptions.bind(this);
        this.convertDonate = this.convertDonate.bind(this);
        this.openReport = this.openReport.bind(this);
        this.openMyReports = this.openMyReports.bind(this);
        this.clearReport = this.clearReport.bind(this);
        this.closeSteps = this.closeSteps.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.updateScroll = this.updateScroll.bind(this);
        this.isNumber = this.isNumber.bind(this);
        this.updateDonate = this.updateDonate.bind(this);
        this.buyPackage = this.buyPackage.bind(this);
        this.buyExtension = this.buyExtension.bind(this);
        this.showJobRequirements = this.showJobRequirements.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.changePassWindow = this.changePassWindow.bind(this);
        this.changeEmailWindow = this.changeEmailWindow.bind(this);
        this.confirmEmail = this.confirmEmail.bind(this);
        this.confirmEmailWindow = this.confirmEmailWindow.bind(this);
        this.confirmEmailDone = this.confirmEmailDone.bind(this);
        this.testEmail = this.testEmail.bind(this);
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    changePassWindow(status) {
        this.setState({ changePass: status });
    }

    changeEmailWindow(status) {
        this.setState({ changeEmail: status });
    }

    confirmEmailWindow(status) {
        this.setState({ confirmEmail: status });
    }

    confirmEmailState(status) {
        this.setState({ confirmEmailState: status });
    }

    testEmail() {
        var r = /^[0-9a-z-_\.]+\@[0-9a-z-_]{1,}\.[a-z]{1,}$/i;
        if (window.clientStorage.accountEmail == this.state.newPassword) return alt.emit("nWarning", "Старая почта не должна совпадать с новой!");
        if (this.state.newPassword != this.state.retryPassword) return alt.emit("nWarning", "Повторная почта не совпадает!");
        if (window.clientStorage.confirmEmail === 0) {
            if (!r.test(window.clientStorage.accountEmail)) return alt.emit("nWarning", "Некорректный Email!");
            if (!window.clientStorage.accountEmail || window.clientStorage.accountEmail.length > 40) return alt.emit("nWarning", "Email должен быть менее 40 символов!");
        } else {
            if (!r.test(this.state.retryPassword)) return alt.emit("nWarning", "Некорректный Email!");
            if (!this.state.retryPassword || this.state.retryPassword.length > 40) return alt.emit("nWarning", "Email должен быть менее 40 символов!");
        }

        this.confirmEmailWindow(true);
        this.confirmEmail();
    }

    confirmEmailDone() {
        if (window.clientStorage.confirmEmail == 0) {
            alt.emit("confirmEmailCode", window.clientStorage.accountEmail, this.state.code);
        } else {
            alt.emit("confirmEmailCode", this.state.retryPassword, this.state.code);
        }

        this.setState({ newPassword: undefined });
        this.setState({ retryPassword: undefined });
        this.setState({ code: 0 });
        this.changeEmailWindow(false);
        this.confirmEmailWindow(false);
    }

    changePassword() {
        alt.emit("events.emitServer", "changePassword", JSON.stringify({old: this.state.oldPassword, new: this.state.newPassword, retry: this.state.retryPassword}) );
        this.setState({ changePass: false });
        this.setState({ oldPassword: undefined });
        this.setState({ newPassword: undefined });
        this.setState({ retryPassword: undefined });
    }

    updateScroll() {
        document.querySelector("#report .report_chat .messages.scroll").scrollTop = 9999;
    }

    confirmEmail() {
        if (window.clientStorage.confirmEmail == 0) {
            alt.emit("confirmEmail", window.clientStorage.accountEmail, window.clientStorage.accountLogin);
            this.confirmEmailWindow(true);
        } else {
            alt.emit("confirmEmail", this.state.retryPassword, window.clientStorage.accountLogin);
            this.confirmEmailWindow(true);
        }
    }

    openReport(reportId) {
        this.setState({ reportId: reportId });
        this.setState({ reportChat: true });
        this.setState({ message: '' });
    }

    openMyReports(page, step) {
        this.setState({ [page]: { step: step } });
    }

    showJobRequirements(id) {
        this.setState({ showJobRequirements: id });
    }

    closeSteps() {
        this.setState({ pageESteps: { step: 1 } });
        this.setState({ pageCSteps: { step: 1 } });
        this.setState({ pageDSteps: { step: 1 } });
        this.setState({ pageFSteps: { step: 1 } });
        this.setState({ pageB: { step: 1 } });
        this.setState({ pageC: { step: 1 } });
        this.setState({ pageE: { step: 1 } });
        this.setState({ pageF: { step: 1 } });
        this.setState({ pageD: { step: 1 } });
        this.setState({ reportId: null });
        this.setState({ reportChat: false });
        this.setState({ PMPage: 'A' });
        this.setState({ message: '' });
    }


    onChangeCoins(e) {
        var k = (e.target.value !== "0") ? Math.ceil((e.target.value + '').replace(/\,/g, '')) : null;
        this.setState({
            [e.target.name]: k
        });
    }

    onChangeDollars(e) {
        var k = (e.target.value !== "0") ? Math.round((e.target.value + '').replace(/\,/g, '')) : null;
        this.setState({
            [e.target.name]: k
        });
    }

    clearReport() {
        this.setState({ message: '' });
    }

    handleKeyPress(event) {
        event = (event) || window.event;
        let charCode = (event.which) ? event.which : event.keyCode;

        if(charCode === 77) {
            return false;
        }

        if(event.key === 'Enter') {
            const { message, reportId } = this.state;
            if (message === '' || reportId === null) return;
            if (!message.replace(/^\s+|\s+$/g,"")) return alt.emit(`nError`, `Текст не должен быть пустой!`);
            if (message.length !== 0 && message.length <= 250) {
                alt.emit('reportSystem.sendMessage', reportId, message);
                this.setState({ message: '' });
            } else {
                return alt.emit(`nError`, `Текст превышает длину 250 символов!`);
            }
        }
    }

    _handleKeyDown = (event) => {
        switch(event.which) {
            case 77:
                if (document.activeElement === ReactDOM.findDOMNode(this.refs.searchInput)) return;
                if (
                    window.inventoryAPI.active() 
                    || window.consoleAPI.active() 
                    || window.modalAPI.active() 
                    || window.chatAPI.active() 
                    || window.telePhone.active()
                    || window.pdTablet.active()
                    || window.medicTablet.active()
                ) return;
                const { showPlayerMenu } = this.state;
                if (this.state.menuList === true) return;
                if (showPlayerMenu === false) {
                    alt.emit(`toBlur`, 200);
                    alt.emit(`Cursor::show`, true);
                    alt.emit('setBlockControl', true);
                    alt.emit("setPlayerMenuActive", true);
                    this.setState({ showPlayerMenu: true });
                } else {
                    alt.emit(`fromBlur`, 200);
                    alt.emit("setPlayerMenuActive", false);
                    alt.emit(`Cursor::show`, false);
                    alt.emit('setBlockControl', false);
                    this.setState({ showPlayerMenu: false });
                    this.closeSteps();
                }
                break;
            default:
                break;
        }
    }

    updateDonate() {
        alt.emit("events.emitServer", "donateSystem.updateDonate");
    }


    changeOptions(event, options) {
        if (event === 'hud') {
            this.setState({ hud: options });
            alt.emit("playerMenu.Hud", options);
        } else if(event === 'chat') {
            this.setState({ chat: options });
            alt.emit(`hudControl`, 'chat', options);
            window.chatAPI.changeOptions(options);
        } else if(event === 'nickname') {
            this.setState({ nickname: options });
            alt.emit("nametags::nickname", options);
        } else if(event === 'nickId') {
            this.setState({ nickId: options });
            alt.emit("nametags::nickId", options);
        } else if(event === 'spawn') {
            this.setState({ spawn: options });
            alt.emit("playerMenu.setSpawn", options, 'client');
        } else if(event === 'houseId') {
            this.setState({ houseId: options });
            alt.emit("playerMenu.setHouseId", options, 'client');
        }
    }

    menuList(event, step) {
        if (event === 'open') {
            this.setState({ menuListSteps: { step: step } });
            this.setState({ menuList: true });
            this.setState({ showPlayerMenu: false });

            if (this.state.menuList === true) {
                document.querySelector("#menuList .body .child").scrollTop = 0;
            }
        } else if (event === 'return') {
            if(this.state.menuList === true) {
                document.querySelector("#menuList .body .child").scrollTop = 0;
            }

            this.setState({ menuListSteps: { step: 0 } });
            this.setState({ menuList: false });
            this.setState({ showPlayerMenu: true });
        } else if (event === 'close') {
            alt.emit(`fromBlur`, 200);
            alt.emit("setPlayerMenuActive", false);
            alt.emit(`Cursor::show`, false);
            alt.emit('setBlockControl', false);
            this.setState({ menuListSteps: { step: 0 } });
            this.setState({ menuList: false });
            this.closeSteps();
        }

    }

    handleOnClick(page, event, step) {
        if(event === 'page') {
            this.setState({ PMPage: page });
        } else if(event === 'pageStep') {
            this.setState({ [page]: { step: step } });
            this.setState({ reportChat: false });
            this.setState({ reportId: null });
            this.setState({ message: '' });
            if(this.state.PMPage === 'C') {
                document.getElementById("ach-list").scrollTop = 0;
            }
        }
    }

    isNumber(evt) {
        evt = (evt) || window.event;
        let charCode = (evt.which) ? evt.which : evt.keyCode;
        if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
            evt.preventDefault();
        } else {
            return true;
        }
    }

    getStreet(event, i, x, y, z) {
        alt.emit('playerMenu.getStreet', event, i, x, y, z);
    }

    buyPackage(packageC) {
        alt.emit("events.emitServer", "donateSystem.buyPackage", packageC);
        alt.emit(`fromBlur`, 200);
        alt.emit("setPlayerMenuActive", false);
        alt.emit(`Cursor::show`, false);
        alt.emit('setBlockControl', false);
        this.setState({ showPlayerMenu: false });
        this.closeSteps();
    }

    buyExtension(extension) {
        alt.emit("events.emitServer", "donateSystem.buyExtension", extension);
        alt.emit(`fromBlur`, 200);
        alt.emit("setPlayerMenuActive", false);
        alt.emit(`Cursor::show`, false);
        alt.emit('setBlockControl', false);
        this.setState({ showPlayerMenu: false });
        this.closeSteps();
    }

    sendReport(e) {
        e.preventDefault();
        const { message } = this.state;
        if(this.state.pageD.step === 1) {
            var reason = 'Жалоба';
        } else if(this.state.pageD.step === 2) {
            var reason = 'Вопрос';
        } else if(this.state.pageD.step === 3) {
            if(this.state.pageDSteps.step === 1) {
                var reason = 'Маппинг';
            } else if(this.state.pageDSteps.step === 2) {
                var reason = 'Ошибка в тексте';
            } else if(this.state.pageDSteps.step === 3) {
                var reason = 'Баг';
            } else if(this.state.pageDSteps.step === 4) {
                var reason = 'Меню сервера';
            }
        }
        if (!message.replace(/^\s+|\s+$/g,"")) return alt.emit(`nError`, `Текст не должен быть пустой!`);
        if(message.length != 0 && message.length < 540) {
            alt.emit('reportSystem.createTicket', message, reason);
            alt.emit(`fromBlur`, 200);
            alt.emit("setPlayerMenuActive", false);
            alt.emit(`Cursor::show`, false);
            alt.emit('setBlockControl', false);
            this.setState({ showPlayerMenu: false });
            this.setState({ message: '' });
            this.closeSteps();
        } else {
            return alt.emit(`nError`, `Текст превышает длину 540 символов!`);
        }
    }
    convertDonate(e) {
        e.preventDefault();
        const { virtualCoins } = this.state;
        alt.emit('events.emitServer', 'donateSystem.convertMoney', virtualCoins);
        alt.emit(`fromBlur`, 200);
        alt.emit("setPlayerMenuActive", false);
        alt.emit(`Cursor::show`, false);
        alt.emit('setBlockControl', false);
        this.setState({ showPlayerMenu: false });
        this.setState({ virtualCoins: 0 });
        this.closeSteps();
    }

    componentDidMount() {
        alt.on(`playerMenu`, (event, options) => {
            const { houses, bizes, reports, messages } = this.state;
            
            if(event === 'chat') {
                this.setState({ chat: options });
            } else if(event === 'hud') {
                this.setState({ hud: options });
            } else if(event === 'nickname') {
                this.setState({ nickname: options });
            } else if (event === 'enable') {
                window.playerMenu.enable(options);
            } else if(event === 'nickId') {
                this.setState({ nickId: options });
            } else if(event === 'achievements') {
                this.setState({ achievements: options });
            } else if(event === 'reports') {
                this.setState({ reports: [...reports, options] });
                if(this.state.reportChat) this.updateScroll();
            } else if(event === 'messages') {
                this.setState({ messages: [...messages, options] });
                if(this.state.reportChat) this.updateScroll();
            }  else if(event === 'paymentsAccount') {
                this.setState({ paymentsAccount: options });
            } else if(event === 'achievementsPlayer') {
                this.setState({ achievementsPlayer: options });
            } else if(event === 'cars') {
                this.setState({ vehicles: options });
            } else if(event === 'spawn') {
                this.setState({ spawn: options });
            } else if(event === 'houseId') {
                this.setState({ houseId: options });
            } else if(event === 'bizes') {
                this.setState({ bizes: options });
            } else if(event === 'houses') {
                this.setState({ houses: options });
            } else if(event === 'closeTicket') {
                var test = reports;
                for (var i = 0; i < test.length; i++) {
                    var r = test[i];
                    if(r.sqlId === options.reportId) {
                        r.status = options.status;
                        r.updated_at = options.updated_at;
                    }
                }
                this.setState({ reports: test });
            } else if(event === 'addHouse') {
                this.setState({ houses: [...houses, options] });
            } else if(event === 'addReport') {
                this.setState({ reports: [...reports, options] });
            } else if(event === 'skills') {
                this.setState({ skills: options });
            } else if(event === 'removeHouse') {
                for (var i = 0; i < houses.length; i++) {
                    if(houses[i].sqlId === options) {
                        houses.splice(i, 1);
                        this.setState({ houses: houses });
                        break;
                    }
                }
            } else if(event === 'addBiz') {
                this.setState({ bizes: [...bizes, options] });
            } else if(event === 'removeBiz') {
                for (var i = 0; i < bizes.length; i++) {
                    if(bizes[i].sqlId === options) {
                        bizes.splice(i, 1);
                        this.setState({ bizes: bizes });
                        break;
                    }
                }
            }
        }),
        window.playerMenu = {
            enable: (enable) => {
                document.removeEventListener("keydown", this._handleKeyDown);
                if (enable) {
                    document.addEventListener("keydown", this._handleKeyDown);
                }
            },
            active: () => {
                return this.state.showPlayerMenu;
            },
        }
    }

    render() {
        const { PMPage } = this.state;

        function playerIdStr() {
            var id = window.clientStorage.accountSqlId + "";
            var result = "НОМЕР АККАУНТА: ";

            for (var i = 0; i < 8 - id.length; i++)
                result += "0"

            return result += id;
        }

        function characterIdStr() {
            var id = window.clientStorage.sqlId + "";
            var result = "НОМЕР ПЕРСОНАЖА: ";

            for (var i = 0; i < 8 - id.length; i++)
                result += "0";

            return result += id;
        }

        var accountPageItems = [{
                head: "Ваш опыт",
                img: "circle",
                numInBody: window.clientStorage.exp,
                class: "exp",
            },
            {
                head: "Часов",
                img: "clock",
                numInBody: parseInt(window.clientStorage.accountHours / 60),
                class: "hours",
            },
            {
                head: "Уровень",
                img: "star",
                numInBody: window.clientStorage.level,
                class: "rating",
            }, {
                head: "Персонажей",
                img: "characters",
                numInBody: window.clientStorage.charactersCount,
                class: "characters",
            }
        ];

        var factionParams = [{
                head: "Goverment",
                color: "rgba(255, 255, 255, 1)",
            },
            {
                head: "Los Santos Police Department",
                color: "rgba(4, 0, 230, 1)",
            },
            {
                head: "Los Santos County Sheriff",
                color: "rgba(213, 178, 21, 1)",
            },
            {
                head: "FIB",
                color: "rgba(0, 0, 0, 1)",
            },
            {
                head: "Los Santos Medical Service",
                color: "rgba(250, 5, 5, 1)",
            },
            {
                head: "Army - Fort Zancundo",
                color: "rgba(14, 90, 7, 1)",
            },
            {
                head: "United States Navy",
                color: "rgba(0, 170, 255, 1)",
            },
            {
                head: "Weazel News",
                color: "rgba(128, 0, 0, 1)",
            },
            {
                head: "The Families",
                color: "rgba(15, 179, 0, 1)",
            },
            {
                head: "The Ballas Gang",
                color: "rgba(166, 12, 140, 1)",
            },
            {
                head: "Varios Los Aztecas Gang",
                color: "rgba(0, 255, 255, 1)",
            },
            {
                head: "Los Santos Vagos",
                color: "rgba(255, 225, 0, 1)",
            },
            {
                head: "Marabunta Grande",
                color: "rgba(38, 0, 255, 1)",
            },
            {
                head: "Русская мафия",
                color: "rgba(128, 128, 128, 1)",
            },
            {
                head: "Итальянская мафия",
                color: "rgba(255, 255, 0, 1)",
            },
            {
                head: "Triada Mafia",
                color: "rgba(255, 127, 80, 1)",
            },
            {
                head: "Мексиканская мафия",
                color: "rgba(168, 104, 0, 1)",
            },
            {
                head: "Biker Brotherhood",
                color: "rgba(165, 42, 42, 1)",
            },
            {
                head: "Biker The Lost MC",
                color: "rgba(160, 82, 45, 1)",
            }
        ];

        function getParamsOfFaction(faction) {
            var params = factionParams[faction];
            if (!params) params = {
                head: "Вы нигде не состоите",
                color: "white"
            };
            return params;
        }

        function title() {
            return (this.state.relationshipName == "-") ? "Не женат" : "Женат на";
        }

        return (
            <React.Fragment>
                <div className="player-menu" style={this.state.showPlayerMenu === true ? {pointerEvents: 'auto'} : {pointerEvents: 'auto', display: this.state.showPlayerMenu === true ? 'grid' : 'none'}}>
                    <div className="user">
                    </div>

                    {PMPage === 'B' ?
                    <div className="menu">
                        <div className={this.state.pageB.step === 1 ? 'menu-item active' : 'menu-item'} onClick={() => this.handleOnClick('pageB', 'pageStep', 1)}>
                            <span>Жилье</span>
                        </div>
                        <div className={this.state.pageB.step === 2 ? 'menu-item active' : 'menu-item'} onClick={() => this.handleOnClick('pageB', 'pageStep', 2)}>
                            <span>Бизнес</span>
                        </div>
                        <div className={this.state.pageB.step === 3 ? 'menu-item active' : 'menu-item'} onClick={() => this.handleOnClick('pageB', 'pageStep', 3)}>
                            <span>Транспорт</span>
                        </div>
                        <div className={this.state.pageB.step === 4 ? 'menu-item active' : 'menu-item'} onClick={() => this.handleOnClick('pageB', 'pageStep', 4)}>
                            <span>Информация</span>
                        </div>
                    </div> : null}
                    {PMPage === 'D' ?
                    <div className="menu">
                        <div className={this.state.pageD.step === 1 ? 'menu-item active' : 'menu-item'} onClick={() => this.handleOnClick('pageD', 'pageStep', 1)}>
                            <span>Отправить жалобу</span>
                        </div>
                        <div className={this.state.pageD.step === 2 ? 'menu-item active' : 'menu-item'} onClick={() => this.handleOnClick('pageD', 'pageStep', 2)}>
                            <span>Мне нужна помощь</span>
                        </div>
                        <div className={this.state.pageD.step === 3 ? 'menu-item active' : 'menu-item'} onClick={() => this.handleOnClick('pageD', 'pageStep', 3)}>
                            <span>Мои репорты</span>
                        </div>
                    </div> : null}
                    {PMPage === 'E' ?
                    <div className="menu">
                        <div className={this.state.pageE.step === 1 ? 'menu-item active' : 'menu-item'} onClick={() => this.handleOnClick('pageE', 'pageStep', 1)}>
                            <span>Безопасность</span>
                        </div>
                        <div className={this.state.pageE.step === 2 ? 'menu-item active' : 'menu-item'} onClick={() => this.handleOnClick('pageE', 'pageStep', 2)}>
                            <span>Персонаж</span>
                        </div>
                        <div className={this.state.pageE.step === 3 ? 'menu-item active' : 'menu-item'} onClick={() => this.handleOnClick('pageE', 'pageStep', 3)}>
                            <span>Интерфейс</span>
                        </div>
                    </div> : null}
                    {PMPage === 'F' ?
                    <div className="menu">
                        <div className={this.state.pageF.step === 1 ? 'menu-item active' : 'menu-item'} onClick={() => this.handleOnClick('pageF', 'pageStep', 1)}>
                            <span>Баланс</span>
                        </div>
                        <div className={this.state.pageF.step === 2 ? 'menu-item active' : 'menu-item'} onClick={() => this.handleOnClick('pageF', 'pageStep', 2)}>
                            <span>Конвертировать</span>
                        </div>
                        <div className={this.state.pageF.step === 3 ? 'menu-item active' : 'menu-item'} onClick={() => this.handleOnClick('pageF', 'pageStep', 3)}>
                            <span>Пакеты</span>
                        </div>
                        <div className={this.state.pageF.step === 5 ? 'menu-item active' : 'menu-item'} onClick={() => this.handleOnClick('pageF', 'pageStep', 5)}>
                            <span>Расширения</span>
                        </div>
                    </div> : null}

                    <div className="sidebar">
                        <div onClick={() => this.handleOnClick('A', 'page')} className={PMPage === 'A' ? 'sidebar-item active' : 'sidebar-item'}>
                            <FontAwesomeIcon icon={faUser} className="custom-fa"/>
                        </div>
                        <div onClick={() => this.handleOnClick('B', 'page')} className={PMPage === 'B' ? 'sidebar-item active' : 'sidebar-item'}>
                            <FontAwesomeIcon icon={faAddressCard} className="custom-fa"/>
                        </div>
                        <div onClick={() => this.handleOnClick('D', 'page')} className={PMPage === 'D' ? 'sidebar-item active' : 'sidebar-item'}>
                            <FontAwesomeIcon icon={faExclamationTriangle} className="custom-fa"/>
                        </div>
                        <div onClick={() => this.handleOnClick('E', 'page')} className={PMPage === 'E' ? 'sidebar-item active' : 'sidebar-item'}>
                            <FontAwesomeIcon icon={faCog} className="custom-fa"/>
                        </div>
                        <div onClick={() => this.handleOnClick('F', 'page')} className={PMPage === 'F' ? 'sidebar-item active' : 'sidebar-item'}>
                            <FontAwesomeIcon icon={faShoppingCart} className="custom-fa"/>
                        </div>
                    </div>

                    <div className="main">
                        { PMPage === 'A' ?
                        <div className="card user-page">
                            <div className="player">
                                <div className="player-block">
                                    <div className="player-name"><h1>{upperCase(window.clientStorage.accountLogin)}</h1></div>
                                    <div className="player-id">{playerIdStr()}</div>
                                </div>
                                <div className="player-image">
                                    <img src={playerArt}/>
                                </div>
                            </div>
                            {accountPageItems.map(item => (
                                <div className="item">
                                    <div className="item-header"><h2>{item.head}</h2></div>
                                    <div className="item-image">
                                        <div className={item.class}><h1>{item.numInBody}</h1></div>
                                        <img src={require('../assets/img/playerMenu/'+item.img+'.png')} />
                                    </div>
                                </div>
                            ))}
                        </div> : null }

                        { PMPage === 'B' ?
                        <div className="card character-page">
                            {this.state.pageB.step === 1 ?
                                <div className="character-carousel">
                                    {this.state.houses.length !== 0 ?
                                        this.state.houses.map((houses, i) => (
                                            <div className="apartment" key={i}>
                                                <div>
                                                    <img src={require('../assets/img/playerMenu/houses/'+window.globalConstants.houseClasses[houses.class]+'.jpg')} />
                                                </div>
                                                <div>
                                                    <span>Дом: </span>№{houses.sqlId}<br />
                                                    <span>Адрес: </span>{houses.adress}<br />
                                                    <span>Класс дома: </span>{window.globalConstants.houseClasses[houses.class]}<br />
                                                    <span>Гараж: </span>{houses.garage !== 0 ? 'Присутствует' : 'Отсутствует'} <br />
                                                    <span>Квартплата: </span>{parseInt(houses.rentPrice)}$ <br />
                                                </div>
                                            </div>
                                        ))
                                    : null}
                                    {this.state.houses.length === 0 ?
                                        <div className="character-no-home">
                                            <div className="top child-card">
                                                <div className="nothing-image"><img src={home} /></div>
                                                <div className="no-home-text">
                                                    <p>На данный момент у вас нет жилья. Но вы всегда можете приложить к этому усилия..</p>
                                                    <button className="btn" onClick={() => this.menuList('open', 5)}>Список доступных классов</button>
                                                </div>
                                            </div>
                                            <div className="bottom child-card">
                                                <p>Пока у вас нет возможности приобрести себе дом или квартиру, вы можете арендовать номер в отеле, выберите для себя удобную в LS местность:</p>
                                                <button className="btn">Ближайший отель</button>
                                            </div>
                                        </div>
                                    : null}
                                </div>
                            : null }
                            {this.state.pageB.step === 2 ?
                                <div style={this.state.bizes ? this.state.bizes.length >= 2 ? {overflow: 'auto'} : null : null}>
                                    {this.state.bizes.length === 0 ?
                                    <div className="nothing-image">
                                        <img src={onedollarcoins} />
                                    </div> : null}
                                    {this.state.bizes.length !== 0 ?
                                    this.state.bizes.map((bizes, i) => (
                                        <div className="business child-card" key={i} style={i >= 1 ? {marginTop: '50px'} : null}>
                                            <div className="businessImg">
                                                {bizes.bizType === 10 ? <img src={require('../assets/img/playerMenu/business/bs-customs.jpg')} /> : null}
                                                {bizes.bizType === 7 ? <img src={require('../assets/img/playerMenu/business/bs-tatoo.jpg')} /> : null}
                                                {bizes.bizType === 4 ? <img src={require('../assets/img/playerMenu/business/bs-barber.jpg')} /> : null}
                                                {bizes.bizType === 5 ? <img src={require('../assets/img/playerMenu/business/bs-fuel.jpg')} /> : null}
                                                {bizes.bizType === 6 ? <img src={require('../assets/img/playerMenu/business/bs-shop24-7.jpg')} /> : null}
                                                {bizes.bizType === 3 ? <img src={require('../assets/img/playerMenu/business/bs-wear.jpg')} /> : null}
                                                {bizes.bizType === 8 ? <img src={require('../assets/img/playerMenu/business/bs-ammo.jpg')} /> : null}
                                            </div>
                                            <div>
                                                <span>Бизнес: </span>№{bizes.sqlId}<br />
                                                <span>Название: </span>{bizes.name}<br/>
                                                <span>Адрес: </span>{bizes.adress}<br />
                                                <span>Тип бизнеса: </span>{window.globalConstants.bizesInfo[bizes.bizType - 1].name}<br />
                                                <span>Налог: </span>{parseInt(bizes.rentPrice)}$ <br />
                                            </div>
                                        </div>)) :
                                    <div className="no-biz child-card">
                                        <h4>Вы не владеете бизнесом.</h4>
                                        <p>Предназначение бизнеса - помочь твоим жизненным планам. <br />
                                        Бизнес - это не главное, не самоцель, это только средство для их реализации.</p>
                                        <button className="btn" onClick={() => this.menuList('open', 1)}>Типы бизнесов</button>
                                    </div>}
                                </div>
                            : null }
                            {this.state.pageB.step === 3 ?
                                <div>
                                    {this.state.vehicles.length !== 0 ?
                                    <div className="vehicles-carousel">
                                        {this.state.vehicles.map(vehicle => (
                                        <div className="vehicle">
                                            <div className="veh-name">{vehicle.name}</div>
                                            <div className="carImg">
                                                <img src={vehicleImg} style={{marginLeft: '2.5vh', marginTop: '1.5vh'}} />
                                            </div>
                                            <div className="veh-states">
                                                <div>Макс. скорость:</div>
                                                <div className="progress">
                                                    <div style={{width: vehicle.maxSpeed+'%'}}></div>
                                                </div>
                                                <div className="veh-percent">{vehicle.maxSpeedKm}</div>
                                                <div>Торможение:</div>
                                                <div className="progress">
                                                    <div style={{width: (vehicle.braking / 2)+'%'}}></div>
                                                </div>
                                                <div className="veh-percent">{parseInt(vehicle.braking)}</div>
                                                <div>Ускорение:</div>
                                                <div className="progress">
                                                    <div style={{width: vehicle.acceleration+'%'}}></div>
                                                </div>
                                                <div className="veh-percent">{parseInt(vehicle.acceleration)}</div>
                                                <div>Управляемость:</div>
                                                <div className="progress">
                                                    <div style={{width: vehicle.controllability+'%'}}></div>
                                                </div>
                                                <div className="veh-percent">{parseInt(vehicle.controllability)}</div>
                                            </div>
                                        </div>))}
                                    </div> :

                                    <div className="no-car">
                                        <div className="top child-card">
                                            <div>
                                                <div className="nothing-image">
                                                    <img src={vehicleImg} />
                                                </div>
                                            </div>
                                            <div className="no-car-desc">
                                                <p>Вы можете владеть наземным, воздушным и водным транспортом. Тут будет отобржаться фото вашего транспортного средства и его основные характеристики с показателями
                                                скорости и управляемости.</p>
                                                <button className="btn no-car-btn" onClick={() => this.menuList('open', 3)}>Купить т/с</button>
                                            </div>
                                        </div>
                                        <div className="bottom">
                                            <div className="child-card">
                                                <h4>ПАРУ СЛОВ О ТЮНИНГЕ</h4>
                                                <p>Изменить можно: крылья, капот, решетку радиатора, раму, крышу, добавить спойлер, оттенок стекол, покраска, кузова, колеса, цвет дыма от шин, бамперов, выхлопная труба, гудок и фары.</p>
                                            </div>
                                            <div className="child-card">
                                                <h4>ВСЕГО ТЕХНИКИ</h4>
                                                <p>Машин — 352 <br />
                                                Мотоциклов — 45 <br />
                                                Велосипедов — 7 <br />
                                                Самолетов — 31 <br />
                                                Вертолетов — 16 <br />
                                                Лодок — 13 <br />
                                                Всего — 470 <br /></p>
                                            </div>
                                        </div>
                                    </div>}
                                </div>
                            : null }
                            {this.state.pageB.step === 4 ?
                                <div className="information">
                                    {window.clientStorage.faction !== 0 ?
                                    <div className="organization child-card">
                                        <div className="organization-head"><h1>ОРГАНИЗАЦИЯ</h1>
                                            <span style={{color: getParamsOfFaction(window.clientStorage.faction - 1).color }}>{window.clientStorage.factionName}</span>
                                        </div>
                                        <div className="organization-img">
                                            {window.clientStorage.faction === 1 ? <img src={require('../assets/img/playerMenu/jetons/government_logo.png')} /> : null}
                                            {window.clientStorage.faction === 2 ? <img src={require('../assets/img/playerMenu/jetons/lspd_logo.png')} /> : null}
                                            {window.clientStorage.faction === 3 ? <img src={require('../assets/img/playerMenu/jetons/sanandreas_sheriff_logo.png')} /> : null}
                                            {window.clientStorage.faction === 4 ? <img src={require('../assets/img/playerMenu/jetons/fib_logo.png')} /> : null}
                                            {window.clientStorage.faction === 5 ? <img src={require('../assets/img/playerMenu/jetons/ambulance_logo.png')} /> : null}
                                            {window.clientStorage.faction === 6 ? <img src={require('../assets/img/playerMenu/jetons/army_logo.png')} /> : null}
                                            {window.clientStorage.faction === 7 ? <img src={require('../assets/img/playerMenu/jetons/navy_logo.png')} /> : null}
                                            {window.clientStorage.faction === 8 ? <img src={require('../assets/img/playerMenu/jetons/weazelnews_logo_2.png')} /> : null}
                                            {window.clientStorage.faction === 9 ? <img src={require('../assets/img/playerMenu/jetons/thefamilies_logo.png')} /> : null}
                                            {window.clientStorage.faction === 10 ? <img src={require('../assets/img/playerMenu/jetons/ballas_logo.png')} /> : null}
                                            {window.clientStorage.faction === 11 ? <img src={require('../assets/img/playerMenu/jetons/aztecas_logo.png')} /> : null}
                                            {window.clientStorage.faction === 12 ? <img src={require('../assets/img/playerMenu/jetons/vagos_logo.png')} /> : null}
                                            {window.clientStorage.faction === 13 ? <img src={require('../assets/img/playerMenu/jetons/marabuntagrande_logo.png')} /> : null}
                                            {window.clientStorage.faction === 14 ? <img src={require('../assets/img/playerMenu/jetons/russianmafia_logo.png')} /> : null}
                                            {window.clientStorage.faction === 15 ? <img src={require('../assets/img/playerMenu/jetons/cosanostra_logo.png')} /> : null}
                                            {window.clientStorage.faction === 16 ? <img src={require('../assets/img/playerMenu/jetons/triada_logo.png')} /> : null}
                                            {window.clientStorage.faction === 17 ? <img src={require('../assets/img/playerMenu/jetons/mexican_mafia_logo.png')} /> : null}
                                            {window.clientStorage.faction === 18 ? <img src={require('../assets/img/playerMenu/jetons/angels_of_death_logo.png')} /> : null}
                                            {window.clientStorage.faction === 19 ? <img src={require('../assets/img/playerMenu/jetons/the_lost_logo.png')} /> : null}
                                        </div>
                                        <div className="organization-body">
                                            <div><span style={{color: getParamsOfFaction(window.clientStorage.faction - 1).color}}>Должность: </span>{window.clientStorage.factionRankName}</div>
                                            <div><span style={{color: getParamsOfFaction(window.clientStorage.faction - 1).color}}>Время работы: </span>-</div>
                                            <div><span style={{color: getParamsOfFaction(window.clientStorage.faction - 1).color}}>Зарплата: </span>{window.clientStorage.factionRankPay}$ в час</div>
                                            <div><span style={{color: getParamsOfFaction(window.clientStorage.faction - 1).color}}>Начальник: </span>{window.clientStorage.factionLeader}</div>
                                        </div>
                                    </div> :
                                    <div className="organization child-card">
                                        <div className="not-at-faction">
                                            <div className="top">
                                                <div className="nothing-image"><img src={require('../assets/img/playerMenu/factions/university-with-a-flag.svg')} /></div>
                                                <div>
                                                    <div>На данный момент вы не состоите в организации. Но вы всегда можете приложить к этому усилия.</div>
                                                    <button className="btn" onClick={() => this.menuList('open', 4)}>Список организаций</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>}
                                    {window.clientStorage.job !== 0 ?
                                    <div className="job child-card">
                                        <div className="job-head">
                                            <h1>МЕСТО РАБОТЫ</h1>
                                            <span>{window.clientStorage.jobName}</span>
                                        </div>
                                        <div className="job-body">
                                            <div><span>Время работы: </span>-</div>
                                            <div><span>Зарплата: </span>-</div>
                                        </div>
                                    </div> :
                                    <div className="child-card">
                                        <div className="not-at-job">
                                            <div className="top">
                                                <div className="nothing-image"><img src={require('../assets/img/playerMenu/rabota.svg')} /></div>
                                                <div>
                                                    <div>На данный момент вы не работаете. Но вы всегда можете приложить к этому усилия.</div>
                                                    <button className="btn" onClick={() => this.menuList('open', 2)}>Список доступных работ</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>}

                                    {this.state.test ?
                                    <div className="marital-status">
                                        <div className="info-head">СЕМЕЙНОЕ ПОЛОЖЕНИЕ</div>
                                        <div className="info-body">
                                            <div><span>{title()} </span>{this.state.relationshipName}</div>
                                            <div><span>Дата регистрации: </span>-</div>
                                            <div><span>Время в браке: </span>-</div>
                                            <div><span>Всего браков: </span>0</div>
                                        </div>
                                    </div> : null}
                                </div>
                            : null }
                        </div>
                        : null}

                        { PMPage === 'D' ?
                        <div class="card report-page" style={this.state.pageD.step === 4 ? {gridTemplateColumns: '1fr 2fr 2fr'} : null}>
                            {this.state.pageD.step === 1 ?
                                <div class="child-card">
                                    <h4>ПОДОЗРЕНИЕ В НЕЧЕСТНОЙ ИГРЕ</h4>
                                    <textarea ref="searchInput" id="message" name="message" maxlength="540" value={this.state.message} onChange={this.onChange}></textarea>
                                    <div className="message-length">{this.state.message.length}/540</div>
                                    <div className="buttons">
                                        <div className="btn" onClick={this.sendReport}>Отправить</div>
                                        <div className="btn" onClick={this.clearReport}>Отмена</div>
                                    </div>
                                </div>
                            : null}
                            {this.state.pageD.step === 2 ?
                                <div class="child-card">
                                    <h4>ЗАДАТЬ НУЖНЫМ ВАМ ВОПРОС</h4>
                                    <textarea ref="searchInput" id="message" name="message" maxlength="540" value={this.state.message} onChange={this.onChange}></textarea>
                                    <div className="message-length">{this.state.message.length}/540</div>
                                    <div className="buttons">
                                        <div className="btn" onClick={this.sendReport}>Отправить</div>
                                        <div className="btn" onClick={this.clearReport}>Отмена</div>
                                    </div>
                                </div>
                            : null}
                            {this.state.pageD.step === 3 ?
                            <div className="report-third">
                                <div className="reportBlock child-card h4-center h4-margin">
                                    <h4>Ваши репорты</h4>
                                    {this.state.reports.length !== 0 ?
                                    this.state.reports.map((report, i) => (
                                        <div className={this.state.reportId === report.sqlId ? 'report active' : 'report'} key={i} onClick={() => this.openReport(report.sqlId)}>Жалоба №{report.sqlId}</div>))
                                    : null }
                                </div>
                                { this.state.reportChat === false ?
                                    <div className="chat child-card h4-center h4-margin">
                                        <h4>Чат и переписка</h4>
                                    </div>
                                : null}
                                { this.state.reportChat !== false ?
                                    <div className="child-card h4-center h4-margin" id="report">
                                        <h4>Переписка</h4>
                                        <div className="report_chat">
                                            <div className="messages scroll">
                                                {this.state.reports.length !== 0 ?
                                                this.state.reports.map((report, i) => (
                                                    this.state.reportId === report.sqlId ?
                                                    this.state.messages.map((data, i) => (
                                                        data.reportId === report.sqlId ?
                                                        data.playerId === report.playerId ?
                                                        <div className="message bg" key={i}>{data.name}: {data.message}</div> :
                                                        <div className="message" key={i}>{data.name}: {data.message}</div> : null)) : null
                                                    )) : null}
                                            </div>
                                            <input type="text" ref="searchInput" className="report-input" name="message" id="message" value={this.state.message} onKeyPress={this.handleKeyPress} onChange={this.onChange} placeholder="Сообщение"/>
                                        </div>
                                    </div>
                                : null}
                            </div> : null}
                        </div>
                        : null}

                        { PMPage === 'E' ?
                            <div className="settings-page card">
                                {this.state.pageE.step === 1 ?
                                    <div className="password">
                                        <div className="child-card">
                                            <h4>ЧТО ТАКОЕ ПАРОЛЬ?</h4>
                                            <p>Персональный идентификационный номер) — аналог пароля. В ходе авторизации операции используется одновременно как пароль доступа держателя карты к терминалу (банкомату) и как секретный ключ для цифровой подписи запроса.</p>
                                            <button className="btn" onClick={() => this.changePassWindow(true)}>
                                                ИЗМЕНИТЬ ПАРОЛЬ
                                            </button>
                                        </div>
                                        <div className="child-card">
                                            <h4>ЧТО ТАКОЕ ЭЛЕКТРОННАЯ ПОЧТА?</h4>
                                            <p>Персональный идентификационный номер) — аналог пароля. В ходе авторизации операции используется одновременно как пароль доступа держателя карты к терминалу (банкомату) и как секретный ключ для цифровой подписи запроса.</p>
                                            {window.clientStorage.confirmEmail === 1 ?
                                                <button className="btn" onClick={() => this.confirmEmailState(true)}>
                                                    ИЗМЕНИТЬ ПОЧТУ
                                                </button> :
                                                <button className="btn" onClick={() => this.changeEmailWindow(true)}>
                                                    ПОДТВЕРДИТЬ
                                                </button>
                                            }
                                        </div>
                                    </div>
                                : null}
                                {this.state.pageE.step === 2 ?
                                    <div>
                                        <div className="child-card">
                                            <h4>МЕСТО ПОЯВЛЕНИЯ ПЕРСОНАЖА</h4>
                                            <p>
                                                Место появление зависит от вас, от вашего желания.
                                                Сегодня вы можете появляться в отеле, а завтра уже дома.
                                                Действуйте и выберите подходящее для себя место для появления в начале игры.
                                            </p>
                                        </div>
                                        <div className="child-card h4-margin">
                                            <h4>УСТАНОВИТЬ МЕСТО ПОЯВЛЕНИЯ</h4>
                                            <div class="spawns-grid">
                                                <div class="spawn-houses">
                                                    {this.state.houses ?
                                                        this.state.houses.length !== 0 ?
                                                        <div>
                                                            <button className={this.state.spawn === 1 ? "selector active" : "selector"} onClick={() => this.changeOptions('spawn', 1)}>У СЕБЯ В ДОМЕ</button>
                                                            {this.state.spawn === 1 ?
                                                                this.state.houses.map((house, i) => (
                                                                    <button className={this.state.houseId === house.sqlId ? 'selector active' : 'selector'} onClick={() => this.changeOptions('houseId', house.sqlId)}>Дом №{house.sqlId}</button>
                                                                ))
                                                            : null}
                                                        </div> : null
                                                    : null}
                                                </div>
                                                <div>
                                                    {window.clientStorage.faction !== 0 ?
                                                        <button className={this.state.spawn === 2 ? 'selector active' : 'selector'} onClick={() => this.changeOptions('spawn', 2)}>У СЕБЯ В ОРГАНИЗАЦИИ</button>
                                                    : null}
                                                </div>
                                                <div><button className={this.state.spawn === 3 ? 'selector active' : 'selector'} onClick={() => this.changeOptions('spawn', 3)}>НАЧАЛЬНЫЙ СПАВН</button></div>
                                                <div><button className={this.state.spawn === 4 ? 'selector active' : 'selector'} onClick={() => this.changeOptions('spawn', 4)}>НА ПОСЛЕДНЕЙ ПОЗИЦИИ</button></div>
                                            </div>
                                        </div>
                                    </div>
                                : null}
                                {this.state.pageE.step === 3 ?
                                <div className="ui-settings">
                                    <div className="ui-settings-hud">
                                        <div className="child-card">
                                            <h4>ЧТО ТАКОЕ HUD?</h4>
                                            <p>
                                                Heads-Up Display, аббр. HUD (англ. head-up — предназначенный для просмотра без наклона головы, display — индикация) — часть визуального интерфейса игрока,
                                                отображающаяся на фоне виртуального игрового пространства в видео игре.
                                            </p>
                                        </div>
                                        <div className="child-card h4-margin">
                                            <h4>ОТОБРАЖЕНИЕ HUD В ИГРЕ</h4>
                                            <button className={this.state.hud === false ? 'selector active' : 'selector'} onClick={() => this.changeOptions('hud', false)}>ВЫКЛЮЧИТЬ</button>
                                            <button className={this.state.hud === true ? 'selector active' : 'selector'} onClick={() => this.changeOptions('hud', true)}>ВКЛЮЧИТЬ</button>
                                        </div>
                                    </div>
                                    <div className="ui-settings-hud">
                                        <div className="child-card h4-margin">
                                            <h4>ОТОБРАЖЕНИЕ НИКНЕЙМА В ИГРЕ</h4>
                                            <button className={this.state.nickname === false ? 'selector active' : 'selector'} onClick={() => this.changeOptions('nickname', false)}>ВЫКЛЮЧИТЬ</button>
                                            <button className={this.state.nickname === true ? 'selector active' : 'selector'} onClick={() => this.changeOptions('nickname', true)}>ВКЛЮЧИТЬ</button>
                                        </div>
                                        <div className="child-card h4-margin">
                                            <h4>ОТОБРАЖЕНИЕ ID ИГРОКОВ</h4>
                                            <button className={this.state.nickId === false ? 'selector active' : 'selector'} onClick={() => this.changeOptions('nickId', false)}>ВЫКЛЮЧИТЬ</button>
                                            <button className={this.state.nickId === true ? 'selector active' : 'selector'} onClick={() => this.changeOptions('nickId', true)}>ВКЛЮЧИТЬ</button>
                                        </div>
                                    </div>
                                    <div className="ui-settings-hud">
                                        <div className="child-card h4-margin">
                                            <h4>ЧТО ТАКОЕ ЧАТ?</h4>
                                            <p>
                                                Heads-Up Display, аббр. HUD (англ. head-up — предназначенный для просмотра без наклона головы, display — индикация) — часть визуального интерфейса игрока, отображающаяся на фоне виртуального игрового пространства в видео игре.
                                            </p>
                                        </div>
                                        <div className="child-card h4-margin">
                                            <h4>НАСТРОЙКИ ЧАТА?</h4>
                                            <button className={this.state.chat === 1 ? 'selector active' : 'selector'} onClick={() => this.changeOptions('chat', 1)}>ОТКЛЮЧИТЬ</button>
                                            <button className={this.state.chat === 2 ? 'selector active' : 'selector'} onClick={() => this.changeOptions('chat', 2)}>ЧАТ СЛЕВА</button>
                                            <button className={this.state.chat === 3 ? 'selector active' : 'selector'} onClick={() => this.changeOptions('chat', 3)}>ЧАТ СПРАВА</button>
                                        </div>
                                    </div>
                                </div> : null}
                            </div> : null}

                        { PMPage === 'F' ?
                        <div className="playermenu-shop">
                            {this.state.pageF.step === 1 ?
                                <div className="shop-balance card">
                                    <div>
                                        <div className="child-card coins-desc">
                                            <p><img src={vc}/><b>VIRTUAL COINS.</b> Валюта которая поступает на ваш аккаунт при пополнении с донатов.</p>
                                            <p><img src={dl}/><b>DOLLARS.</b> Игровая валюта, вы можете заработать в игре или конвертировать из VC.</p>
                                        </div>
                                        <div className="child-card">
                                            <p>Игровая валюта – это денежные средства, которые используются в какой-либо онлайн-игре. Ее можно
                                            как заработать в игре, так и купить за реальные деньги, а потом использовать в игровых целях.
                                            Зачем нужна игровая валюта? Заядлые геймеры найдут сотню мест, где можно потратить виртуальные
                                            деньги. И все это в пределах мира одной онлайн-игры! Покупка игровой валюты нужна для того,
                                            чтобы обеспечить своего персонажа едой, снаряжением, усовершенствованным оружием и навыка...</p>
                                        </div>
                                    </div>
                                    <div className="child-card h4-center">
                                        <h4>ИСТОРИЯ ПОПОЛНЕНИЙ</h4>
                                        {this.state.paymentsAccount.length !== 0 ?
                                            this.state.paymentsAccount.map(index => (
                                                <ul className="payments">
                                                    <li><span>+ {index.sum} RUB</span></li>
                                                </ul>
                                            ))
                                        : null}
                                    </div>
                                </div>
                            : null}
                            {this.state.pageF.step === 2 ?
                            <div className="conversion-page card">
                                <div className="child-card">
                                    <h4>КОНВЕРТИРОВАНИЕ ВАЛЮТЫ</h4>
                                    <p>Конвертируемость валюты – это способность валюты обмениваться на другие иностранные валюты. Режим обратимости валют может различаться для резидентов и нерезидентов, может распространяться на текущие операции, связанные с повседневной внешнеэкономической деятельностью, и операции, отражающие движение капиталов. ... Конвертируемость – это, по существу, связь внутреннего и мирового рынков через гибкий валютный курс национальной денежной единицы при существующей свободе торговли. Конвертируемость валют в условиях золотого стандарта является абсолютной.</p>
                                </div>
                                <div className="child-card conversion-box">
                                    <p>Вся выбранная сумма поступит на ваш банковский счёт в игре!</p>
                                    <div className="conversion-block">
                                        <div className="top">VIRTUAL COINS</div>
                                        <input id="virtualCoins" name="virtualCoins" maxLength="6" className="conversion-input" value={this.state.virtualCoins} onKeyPress={this.isNumber} onChange={this.onChangeCoins}/>
                                        <div className="bottom">ВАЛЮТА АККАУНТА</div>
                                    </div>
                                    <div className="middle">=</div>
                                    <div className="conversion-block">
                                        <div className="top">DOLLARS</div>
                                        <input id="dollars" name="dollars" className="conversion-input" value={(this.state.virtualCoins * 50 + '').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} onChange={this.onChangeDollars}/>
                                        <div className="bottom">ВАЛЮТА В ИГРЕ</div>
                                    </div>
                                    <button className="btn" onClick={this.convertDonate}>КОНВЕРТИРОВАТЬ</button>
                                </div>
                            </div>
                            : null}
                            {this.state.pageF.step === 3 ?
                            <div className="shop-packages card">
                                <div className="packages-box">
                                    <p>Выберите пакет, чтобы узнать подробнее о нем...</p>
                                    <div className="child-card package">
                                        <div className="package-price"><h4>700,000$</h4></div>
                                        <img src={require('../assets/img/playerMenu/money.png')}/>
                                        <div className="package-description"><h4>БИЗНЕСМЕН</h4></div>
                                        <button className="btn" onClick={() => this.handleOnClick('pageF', 'pageStep', 6)}>СМОТРЕТЬ</button>
                                    </div>
                                    <div className="child-card package">
                                        <div className="package-price"><h4>2,000,000$</h4></div>
                                        <img src={require('../assets/img/playerMenu/money.png')}/>
                                        <div className="package-description"><h4>МИЛЛИОНЕР</h4></div>
                                        <button className="btn" onClick={() => this.handleOnClick('pageF', 'pageStep', 7)}>СМОТРЕТЬ</button>
                                    </div>
                                    <div className="child-card package">
                                        <div className="package-price"><h4>10,000,000$</h4></div>
                                        <img src={require('../assets/img/playerMenu/money.png')}/>
                                        <div className="package-description"><h4>МАГНАТ</h4></div>
                                        <button className="btn" onClick={() => this.handleOnClick('pageF', 'pageStep', 8)}>СМОТРЕТЬ</button>
                                    </div>
                                </div>
                            </div>
                            : null}
                            {this.state.pageF.step === 5 ?
                            <div className="shop-packages card">
                                <div className="packages-box">
                                    <p>Выберите расширения, чтобы узнать подробнее о нем...</p>
                                    <div className="child-card package">
                                        <div className="package-price"><h4>300 VC</h4></div>
                                        <img src={require('../assets/img/playerMenu/money.png')}/>
                                        <div className="package-description"><h4>УВЕЛИЧИТЬ СЛОТЫ НА ДОМ В ДВА РАЗА</h4></div>
                                        <button className="btn"  onClick={() => this.buyExtension(5)}>ПРИОБРЕСТИ</button>
                                    </div>
                                    <div className="child-card package">
                                        <div className="package-price"><h4>800 VC</h4></div>
                                        <img src={require('../assets/img/playerMenu/money.png')}/>
                                        <div className="package-description"><h4>УВЕЛИЧИТЬ СЛОТЫ НА БИЗНЕС В ДВА РАЗА</h4></div>
                                        <button className="btn" onClick={() => this.buyExtension(6)}>ПРИОБРЕСТИ</button>
                                    </div>
                                    <div className="child-card package">
                                        <div className="package-price"><h4>100 VC</h4></div>
                                        <img src={require('../assets/img/playerMenu/money.png')}/>
                                        <div className="package-description"><h4>УВЕЛИЧИТЬ СЛОТ НА АВТОМОБИЛЬ (10 макс)</h4></div>
                                        <button className="btn" onClick={() => this.buyExtension(7)}>ПРИОБРЕСТИ</button>
                                    </div>
                                </div>
                            </div>
                            : null}
                            {this.state.pageF.step === 6 ?
                                <div className="full-package-desc card">
                                    <div className="child-card">
                                        <h4>ПАКЕТ БИЗНЕСМЕН</h4>
                                        <div className="package-price">700,000$</div>
                                        <img src={require('../assets/img/playerMenu/money.png')}/>
                                        <div className="package-description"> 700,000$ НА СЧЕТ</div>
                                        <button className="btn" onClick={() => this.buyPackage(8)}><span>13,000</span><img src={vc}/></button>
                                        <button className="btn back-btn" onClick={() => this.handleOnClick('pageF', 'pageStep', 3)}>‹ НАЗАД</button>
                                    </div>
                                </div>
                            : null}
                            {this.state.pageF.step === 7 ?
                                <div className="full-package-desc card">
                                    <div className="child-card">
                                        <h4>ПАКЕТ МИЛЛИОНЕР</h4>
                                        <div className="package-price">2,000,000$</div>
                                        <img src={require('../assets/img/playerMenu/money.png')}/>
                                        <div className="package-description"> 2,000,000$ НА СЧЕТ</div>
                                        <button className="btn" onClick={() => this.buyPackage(9)}><span>35,000</span><img src={vc}/></button>
                                        <button className="btn back-btn" onClick={() => this.handleOnClick('pageF', 'pageStep', 3)}>‹ НАЗАД</button>
                                    </div>
                                </div>
                            : null}
                            {this.state.pageF.step === 8 ?
                                <div className="full-package-desc card">
                                    <div className="child-card">
                                        <h4>ПАКЕТ МАГНАТ</h4>
                                        <div className="package-price">10,000,000$</div>
                                        <img src={require('../assets/img/playerMenu/money.png')}/>
                                        <div id="package-description">МАГНАТ</div>
                                        <button className="btn" onClick={() => this.buyPackage(10)}><span>180,000</span><img src={vc}/></button>
                                        <button className="btn back-btn" onClick={() => this.handleOnClick('pageF', 'pageStep', 3)}>‹ НАЗАД</button>
                                    </div>
                                </div>
                            : null}
                            {this.state.pageF.step === 9 ?
                            <div id="buy-skills-page">
                                <div className="head">ХАРАКТЕРИСТИКИ ПЕРСОНАЖА</div>
                                <div className="info-head">Характеристики персонажа — это перечень основных и дополнительных параметров, а также навыков и умений, которыми обладает игровой персонаж.</div>
                                <div className="body">
                                    <div className="menu">
                                        <div className="left-menu-items">
                                            <div className={this.state.pageFSteps.step === 1 ? 'green-line' : ''}></div>
                                            <div onClick={() => this.handleOnClick('pageFSteps', 'pageStep', 1)}>Изменить никнейм</div>
                                        </div>
                                        <div className="left-menu-items">
                                            <div className={this.state.pageFSteps.step === 2 ? 'green-line' : ''}></div>
                                            <div onClick={() => this.handleOnClick('pageFSteps', 'pageStep', 2)}>Изменить внешность</div>
                                        </div>
                                        {/*<div className="left-menu-items">
                                            <div className={this.state.pageFSteps.step === 3 ? 'green-line' : ''}></div>
                                            <div onClick={() => this.handleOnClick('pageFSteps', 'pageStep', 3)}>Изменить возраст</div>
                                        </div>
                                        <div className="left-menu-items">
                                            <div className={this.state.pageFSteps.step === 4 ? 'green-line' : ''}></div>
                                            <div onClick={() => this.handleOnClick('pageFSteps', 'pageStep', 4)}>Законопослушность +10 ед.</div>
                                        </div>
                                        <div className="left-menu-items">
                                            <div className={this.state.pageFSteps.step === 5 ? 'green-line' : ''}></div>
                                            <div onClick={() => this.handleOnClick('pageFSteps', 'pageStep', 5)}>Наркозависимость -10 ед.</div>
                                        </div>
                                        <div className="left-menu-items">
                                            <div className={this.state.pageFSteps.step === 6 ? 'green-line' : ''}></div>
                                            <div onClick={() => this.handleOnClick('pageFSteps', 'pageStep', 6)}>Навыки</div>
                                            <div className="arrow" style={this.state.pageFSteps.step === 6 ? {clipPath: 'polygon(0px 0px, 100% 50%, 0px 100%)'} : null}></div>
                                        </div>
                                        <div className="left-menu-items">
                                            <div className={this.state.pageFSteps.step === 7 ? 'green-line' : ''}></div>
                                            <div onClick={() => this.handleOnClick('pageFSteps', 'pageStep', 7)}>Лицензии</div>
                                            <div className="arrow" style={this.state.pageFSteps.step === 7 ? {clipPath: 'polygon(0px 0px, 100% 50%, 0px 100%)'} : null}></div>
                                        </div>
                                        <div className="left-menu-items">
                                            <div className={this.state.pageFSteps.step === 8 ? 'green-line' : ''}></div>
                                            <div onClick={() => this.handleOnClick('pageFSteps', 'pageStep', 8)}>Наказания</div>
                                            <div className="arrow" style={this.state.pageFSteps.step === 8 ? {clipPath: 'polygon(0px 0px, 100% 50%, 0px 100%)'} : null}></div>
                                        </div>*/}
                                    </div>
                                    {this.state.pageFSteps.step === 1 ?
                                    <div className="shop-buy-box box">
                                        <div className="buy">
                                            <div>КУПИТЬ ЗА</div>
                                            <div>10,000</div>
                                            <div><img src={vc}/></div>
                                        </div>
                                    </div>
                                    : null}
                                    {this.state.pageFSteps.step === 2 ?
                                    <div className="shop-buy-box box">
                                        <div className="buy">
                                            <div>КУПИТЬ ЗА</div>
                                            <div>10,000</div>
                                            <div><img src={vc}/></div>
                                        </div>
                                    </div>
                                    : null}
                                    {this.state.pageFSteps.step === 3 ?
                                    <div className="shop-buy-box box">
                                        <div className="buy">
                                            <div>КУПИТЬ ЗА</div>
                                            <div>10,000</div>
                                            <div><img src={vc}/></div>
                                        </div>
                                    </div>
                                    : null}
                                    {this.state.pageFSteps.step === 4 ?
                                    <div className="shop-buy-box box">
                                        <div className="right-buy-menu">
                                            <div className="green-line"></div>
                                            <div>
                                                <div className="menu-items menu-items-focus">
                                                    <div>Законопослушность</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="buy">
                                            <div>КУПИТЬ ЗА</div>
                                            <div>10,000</div>
                                            <div><img src={vc}/></div>
                                        </div>
                                        <div className="buy">
                                            <div>КУПИТЬ ЗА</div>
                                            <div>16,000</div>
                                            <div><img src={dl}/></div>
                                        </div>
                                        <div className="description"><span>ЗАКОНОПОСЛУШНОСТЬ</span> Купив этот параметр, у вашего персонажа будет +10 единиц от общей единицы к параметру законопослушность. </div>
                                    </div> : null}
                                    {this.state.pageFSteps.step === 5 ?
                                    <div className="shop-buy-box box">
                                        <div className="right-buy-menu">
                                            <div className="green-line"></div>
                                            <div>
                                                <div className="menu-items menu-items-focus">
                                                    <div>НАРКОЗАВИСИМОСТЬ</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="buy">
                                            <div>КУПИТЬ ЗА</div>
                                            <div>10,000</div>
                                            <div><img src={vc}/></div>
                                        </div>
                                        <div className="buy">
                                            <div>КУПИТЬ ЗА</div>
                                            <div>16,000</div>
                                            <div><img src={dl}/></div>
                                        </div>
                                        <div className="description"><span>НАРКОЗАВИСИМОСТЬ</span> Купив этот параметр, у вашего персонажа будет +10 единиц от общей единицы к параметру законопослушность. </div>
                                    </div> : null}
                                    {this.state.pageFSteps.step === 6 ?
                                    <div className="shop-buy-box box">
                                        <div className="right-buy-menu">
                                            <div className="green-line"></div>
                                            <div>
                                                <div className={this.state.skillsMenu.step !== 1 ? 'menu-items' : 'menu-items menu-items-focus'}>
                                                    <div onClick={() => this.handleOnClick('skillsMenu', 'pageStep', 1)}>ВЛАДЕНИЕ ОРУЖИЕМ</div>
                                                </div>
                                                <div className={this.state.skillsMenu.step !== 2 ? 'menu-items' : 'menu-items menu-items-focus'}>
                                                    <div onClick={() => this.handleOnClick('skillsMenu', 'pageStep', 2)}>ВЫНОСЛИВОСТЬ</div>
                                                </div>
                                                <div className={this.state.skillsMenu.step !== 3 ? 'menu-items' : 'menu-items menu-items-focus'}>
                                                    <div onClick={() => this.handleOnClick('skillsMenu', 'pageStep', 3)}>СИЛА</div>
                                                </div>
                                                <div className={this.state.skillsMenu.step !== 4 ? 'menu-items' : 'menu-items menu-items-focus'}>
                                                    <div onClick={() => this.handleOnClick('skillsMenu', 'pageStep', 4)}>ВОЖДЕНИЕ</div>
                                                </div>
                                                <div className={this.state.skillsMenu.step !== 5 ? 'menu-items' : 'menu-items menu-items-focus'}>
                                                    <div onClick={() => this.handleOnClick('skillsMenu', 'pageStep', 5)}>ЗДОРОВЬЕ</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="buy">
                                            <div>КУПИТЬ ЗА</div>
                                            <div>10,000</div>
                                            <div><img src={vc}/></div>
                                        </div>
                                        <div className="buy">
                                            <div>КУПИТЬ ЗА</div>
                                            <div>16,000</div>
                                            <div><img src={dl}/></div>
                                        </div>
                                        <div className="description"><span>ВЛАДЕНИЕ ОРУЖИЕМ</span> Купив этот параметр, у вашего персонажа будет +10 единиц от общей единицы к параметру владение оружием. </div>
                                    </div> : null}
                                </div>
                            </div>
                            : null}
                            <div className="current-balance card">
                                <div className="child-card">
                                    <div className="balance">БАЛАНС <span>{window.clientStorage.donate}</span><img src={vc}/></div>
                                    <div className="donate-reference"><p>Чтобы пополнить баланс вашего счёта, перейдите по адресу:</p><p onClick="">http://cyberstate.ru/donate</p></div>
                                </div>
                            </div>
                        </div> : null }
                    </div>
                </div>

                {this.state.confirmEmailState === true ?
                    <div id="edit-window">
                    <div className="close" onClick={() => this.changeEmailWindow(false)}>✖</div>
                    {window.clientStorage.accountConfirmEmail === 1 ?
                        <React.Fragment>
                            {this.state.confirmEmail === false ?
                                <React.Fragment>
                                    <div className="edit-pin box">
                                        <div className="head">ТЕКУЩАЯ ПОЧТА</div>
                                        <input disabled="disabled" type="text" value={window.clientStorage.accountEmail} className="pass" style={{marginTop: '10px', fontSize: '12pt', letterSpacing: '0'}}/>
                                        <div className="head">ВВЕДИТЕ НОВУЮ ПОЧТУ</div>
                                        <input id="newPassword" name="newPassword" type="text" value={this.state.newPassword} style={{fontSize: '12pt', letterSpacing: '0'}} className="pass" onChange={this.onChange}/>
                                        <input id="retryPassword" name="retryPassword" type="text" value={this.state.retryPassword} className="pass" style={{marginTop: '-2px', fontSize: '12pt', letterSpacing: '0'}} onChange={this.onChange}/>
                                        <div className="button green-button">
                                            <div onClick={() => this.testEmail()}>OK</div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            :
                                <React.Fragment>
                                    <div className="edit-pin box">
                                        <div class="head">ВВЕДИТЕ КОД С ПОЧТЫ</div>
                                        <input id="code" name="code" type="text" class="pass" value={this.state.code} style={{marginTop: '10px', fontSize: '15pt', letterSpacing: '0'}} onChange={this.onChange}/>
                                        <div class="button green-button">
                                            <div onClick={() => this.confirmEmailDone()}>OK</div>
                                        </div>
                                    </div>
                                </React.Fragment>}
                        </React.Fragment>
                    : null}
                </div> : null}

                {this.state.changeEmail === true ?
                <div id="edit-window">
                    <div className="close" onClick={() => this.changeEmailWindow(false)}>✖</div>
                    {this.state.changeEmail === true  ?
                        <React.Fragment>
                            {this.state.confirmEmail === false ?
                                <React.Fragment>
                                    <div className="edit-email box">
                                        <div class="button gray-button">
                                            <div onClick={() => this.confirmEmail()}>ПОДТВЕРДИТЬ ПОЧТУ</div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            :
                                <React.Fragment>
                                    <div className="edit-pin box">
                                        <div class="head">ВВЕДИТЕ КОД С ПОЧТЫ</div>
                                        <input id="code" name="code" type="text" class="pass" value={this.state.code} style={{marginTop: '10px', fontSize: '15pt', letterSpacing: '0'}} onChange={this.onChange}/>
                                        <div class="button green-button">
                                            <div onClick={() => this.confirmEmailDone()}>OK</div>
                                        </div>
                                    </div>
                                </React.Fragment>}
                        </React.Fragment>
                    : null}
                </div> : null}
                {this.state.changePass === true ?
                <div id="edit-window">
                    <div className="close" onClick={() => this.changePassWindow(false)}>✖</div>
                    <div className="headblocker">СМЕНА ПАРОЛЯ НА АККАУНТЕ</div>
                    <div className="edit-pin box">
                        <div className="head">ВВЕДИТЕ СТАРЫЙ ПАРОЛЬ</div>
                        <input id="oldPassword" name="oldPassword" type="password" value={this.state.oldPassword} className="pass" style={{marginTop: '10px'}} onChange={this.onChange}/>
                        <div className="head">ВВЕДИТЕ НОВЫЙ ПАРОЛЬ</div>
                        <input id="newPassword" name="newPassword" type="password" value={this.state.newPassword} className="pass" onChange={this.onChange}/>
                        <input id="retryPassword" name="retryPassword" type="password" value={this.state.retryPassword} className="pass" style={{marginTop: '-2px'}} onChange={this.onChange}/>
                        <div className="button green-button">
                            <div onClick={() => this.changePassword()}>OK</div>
                        </div>
                        <div>Персональный идентификационный номер) — аналог пароля. В ходе авторизации операции используется одновременно как пароль доступа держателя карты к терминалу (банкомату) и как секретный ключ для цифровой подписи запроса.</div>
                    </div>
                </div> : null}

                <div id="menuList" style={{display: this.state.menuList === true && this.state.showPlayerMenu === false ? 'flex' : 'none'}}>
                    {this.state.menuListSteps.step === 1 ? <div className="header">Типы бизнесов</div> : null}
                    {this.state.menuListSteps.step === 2 ? <div className="header">Список доступных работ</div> : null}
                    {this.state.menuListSteps.step === 3 ? <div className="header">Типы салонов</div> : null}
                    {this.state.menuListSteps.step === 4 ? <div className="header">Список организаций</div> : null}
                    {this.state.menuListSteps.step === 5 ? <div className="header">Список классов домов</div> : null}
                    <div className="body">
                        <div className="child">
                            {this.state.menuListSteps.step === 1 ?
                            <div>
                                <div className="builder">
                                    <div className="child_header clothes">Магазин одежды</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/business/bs-wear.jpg')}/>
                                    <div className="text">
                                        У нас в штате располагаются множество магазинов одежды, каждый из них хорош по своему.
                                        Только у нас в штате Вы сможете найти эксклюзивную одежду на любой день!
                                    </div>
                                    <div className="helpInfo">
                                        <button style={{width: '24.3264vh'}}><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать ближайший адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header bs">Барбершоп</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/business/bs-barber.jpg')}/>
                                    <div className="text">
                                        Наши Барбершопы уже прославились на весь мир своей уникальностью.
                                        Я советую тебе заглянуть именно туда, чтобы ты смог насладиться этим уникальным чувством.
                                    </div>
                                    <div className="helpInfo">
                                        <button style={{width: '24.3264vh'}}><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать ближайший адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header shop247">Магазин 24/7</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/business/bs-shop24-7.jpg')}/>
                                    <div className="text">
                                        В магазинах 24/7 Вы сможете найти любые  виды товаров, которые будут вам необходимы, чтобы чувствовать себя комфортно у нас в штате.
                                    </div>
                                    <div className="helpInfo">
                                        <button style={{width: '24.3264vh'}}><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать ближайший адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header lsc">LS Customs</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/business/bs-customs.jpg')}/>
                                    <div className="text">
                                        Смотрю Вы уже заинтересовались где можно качественно протюнинговать свой автомобиль?
                                        Вам нужно скорее ехать в наши мастерские.
                                        Ведь только именно там, Вы сможете сделать свой автомобиль уникальным в Штате.
                                    </div>
                                    <div className="helpInfo">
                                        <button style={{width: '24.3264vh'}}><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать ближайший адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header sm">Оружейный Магазин</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/business/bs-ammo.jpg')}/>
                                    <div className="text">
                                        Чтобы максимально быть уверенным за свою жизнь, мы рекомендуем вам посетить наши Оружейный Магазины.
                                        Вы сможете приобрести качественное оружие на любой вкус!
                                    </div>
                                    <div className="helpInfo">
                                        <button style={{width: '24.3264vh'}}><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать ближайший адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header sfuel">АЗС / Заправка</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/business/bs-fuel.jpg')}/>
                                    <div className="text">
                                        Если у вас есть машина, значит вы 100% должны пользоваться заправкой.
                                        У нас в штате располагается огромное количество заправочных станций с качественным бензином. Не то что у наших конкурентов.
                                    </div>
                                    <div className="helpInfo">
                                        <button style={{width: '24.3264vh'}}><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать ближайший адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header ts">Тату салон</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/business/bs-tatoo.jpg')}/>
                                    <div className="text">
                                        Если ты хочешь изменить в себе любую часть тела, а также стать уникальным в Штате.
                                        Тебе стоит заглянуть в Тату Салоны, ты сможешь набить себе тату разной сложности за приятную цену.
                                    </div>
                                    <div className="helpInfo">
                                        <button style={{width: '24.3264vh'}}><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать ближайший адрес по sms</button>
                                    </div>
                                </div>
                            </div>  : null}
                            {this.state.menuListSteps.step === 2 ?
                            <div>
                                <div className="builder">
                                    <div className="child_header builder">Работа Строителем</div>
                                    <img className="imgresize" src={require('../assets/img/jobList/builder.png')}/>
                                    <div className="jubRequirement" style={this.state.showJobRequirements === 0 ? {display: 'block'} : {display: 'none'}}>
                                        <a>Требования:</a><br/>
                                        <a>1. Уровень: <bold>01</bold></a><br/>
                                        <a>2. Вод. Удостоверения: <bold>C</bold></a>
                                    </div>
                                    <div className="text">
                                        Надежная строительная компания, которая профессионально занимается проектированием, строительством, реконструкцией и ремонтом зданий и сооружений всех типов.
                                    </div>
                                    <div className="helpInfo">
                                        <button onClick={() => this.showJobRequirements(0)}><img className="helpimg" src={require('../assets/img/jobList/i_info.png')}/>Требования к работе</button>
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header port">Портовый Рабочий</div>
                                    <img className="imgresize" src={require('../assets/img/jobList/port.png')}/>
                                    <div className="jubRequirement" style={this.state.showJobRequirements === 1 ? {display: 'block'} : {display: 'none'}}>
                                        <a>Требования:</a><br/>
                                        <a>1. Уровень: <bold>01</bold></a><br/>
                                        <a>2. Вод. Удостоверения: <bold>A</bold></a>
                                    </div>
                                    <div className="text">
                                        Крупнейший грузовой речной порт, занимается перевозкой грузов по внутренним водным путям, а также по железной дороге.
                                        Производит погрузочно-разгрузочные работы, хранение грузов.
                                    </div>
                                    <div className="helpInfo">
                                        <button onClick={() => this.showJobRequirements(1)}><img className="helpimg" src={require('../assets/img/jobList/i_info.png')}/>Требования к работе</button>
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header ecology">Центр Утилизации</div>
                                    <img className="imgresize" src={require('../assets/img/jobList/ecology.png')}/>
                                    <div className="jubRequirement" style={this.state.showJobRequirements === 2 ? {display: 'block'} : {display: 'none'}}>
                                        <a>Требования:</a><br/>
                                        <a>1. Уровень: <bold>02</bold></a><br/>
                                        <a>2. Вод. Удостоверения: <bold>C</bold></a>
                                    </div>
                                    <div className="text">
                                        Основным направлением деятельности компании по утилизации является обработка и утилизация отходов.
                                        Все отходы поступают на мусоросортировочные комплексы компании.
                                        Промышленная сортировка позволяет извлечь и вернуть сырье в хозяйственный оборот.
                                        Тем самым, мы сохраняем первозданные природные ресурсы.
                                    </div>
                                    <div className="helpInfo">
                                        <button onClick={() => this.showJobRequirements(2)}><img className="helpimg" src={require('../assets/img/jobList/i_info.png')}/>Требования к работе</button>
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header pizza">Развозчик пиццы</div>
                                    <img className="imgresize" src={require('../assets/img/jobList/pizza.png')}/>
                                    <div className="jubRequirement" style={this.state.showJobRequirements === 3 ? {display: 'block'} : {display: 'none'}}>
                                        <a>Требования:</a><br/>
                                        <a>1. Уровень: <bold>03</bold></a><br/>
                                        <a>2. Вод. Удостоверения: <bold>A</bold></a>
                                    </div>
                                    <div className="text">
                                        Доставка пиццы — это услуга, при которой заказчику доставляют пиццу по указанному им адресу за определённый период времени.
                                        Заказ обычно совершается по телефону или Интернету.
                                        Стоимость доставки может варьироваться, либо, что чаще всего, уже включена в стоимость пиццы.
                                    </div>
                                    <div className="helpInfo">
                                        <button onClick={() => this.showJobRequirements(3)}><img className="helpimg" src={require('../assets/img/jobList/i_info.png')}/>Требования к работе</button>
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header taxi">Водитель Такси</div>
                                    <img className="imgresize" src={require('../assets/img/jobList/taxi.png')}/>
                                    <div className="jubRequirement" style={this.state.showJobRequirements === 4 ? {display: 'block'} : {display: 'none'}}>
                                        <a>Требования:</a><br/>
                                        <a>1. Уровень: <bold>04</bold></a><br/>
                                        <a>2. Вод. Удостоверения: <bold>B</bold></a>
                                    </div>
                                    <div className="text">
                                        Компания занимается перевозкой пассажиров.
                                        Наши водители работают через приложение, что позволяет экономить время.
                                        Здесь вы сможете осуществить все мечты об идеальной работе.
                                    </div>
                                    <div className="helpInfo">
                                        <button onClick={() => this.showJobRequirements(4)}><img className="helpimg" src={require('../assets/img/jobList/i_info.png')}/>Требования к работе</button>
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header goPostal">Развозчик корреспонденции</div>
                                    <img className="imgresize" src={require('../assets/img/jobList/goPostal.png')}/>
                                    <div className="jubRequirement" style={this.state.showJobRequirements === 5 ? {display: 'block'} : {display: 'none'}}>
                                        <a>Требования:</a><br/>
                                        <a>1. Уровень: <bold>03</bold></a><br/>
                                        <a>2. Вод. Удостоверения: <bold>C</bold></a>
                                    </div>
                                    <div className="text">
                                        В данной сфере, вы будете работать в сплоченной команде.
                                        А также именно благодаря вам, жители штата смогут получить свои письма и посылки. Мы ждем тебя у нас в компании!                                 </div>
                                    <div className="helpInfo">
                                        <button onClick={() => this.showJobRequirements(5)}><img className="helpimg" src={require('../assets/img/jobList/i_info.png')}/>Требования к работе</button>
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header bus">Водитель автобуса</div>
                                    <img className="imgresize" src={require('../assets/img/jobList/bus.png')}/>
                                    <div className="jubRequirement" style={this.state.showJobRequirements === 6 ? {display: 'block'} : {display: 'none'}}>
                                        <a>Требования:</a><br/>
                                        <a>1. Уровень: <bold>04</bold></a><br/>
                                        <a>2. Вод. Удостоверения: <bold>D</bold></a>
                                    </div>
                                    <div className="text">
                                        Основной вид деятельности — оказание транспортных услуг по перевозке пассажиров на комфортабельных автобусах.
                                    </div>
                                    <div className="helpInfo">
                                        <button onClick={() => this.showJobRequirements(6)}><img className="helpimg" src={require('../assets/img/jobList/i_info.png')}/>Требования к работе</button>
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header longtravel">Дальнобойщик</div>
                                    <img className="imgresize" src={require('../assets/img/jobList/longtravel.png')}/>
                                    <div className="jubRequirement" style={this.state.showJobRequirements === 7 ? {display: 'block'} : {display: 'none'}}>
                                        <a>Требования:</a><br/>
                                        <a>1. Уровень: <bold>05</bold></a><br/>
                                        <a>2. Вод. Удостоверения: <bold>C</bold></a>
                                    </div>
                                    <div className="text">
                                        Наша компания занимается оказанием полного спектра транспортно-экспедиционных услуг.
                                    </div>
                                    <div className="helpInfo">
                                        <button onClick={() => this.showJobRequirements(7)}><img className="helpimg" src={require('../assets/img/jobList/i_info.png')}/>Требования к работе</button>
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                            </div> : null}
                            {this.state.menuListSteps.step === 3 ?
                            <div>
                                {/*<div className="builder">
                                    <div className="child_header clothes">Авиасалон</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/business/Avia_pokupka_I_Prodazha.png')}/>
                                    <div className="text">
                                        Ну что… вот и пришло время для чего-то серьезного?
                                        Я могу тебе посоветовать наши высококлассные авиасалоны, ты можешь приобрести в них технику на любой вкус.
                                        Так начинай же изучать воздушное пространство штата!
                                    </div>
                                    <div className="helpInfo">
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>*/}
                                <div className="builder">
                                    <div className="child_header bs">Автосалон</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/business/Avtosalon.png')}/>
                                    <div className="text">
                                        Тебе надоело быть пешеходом?
                                        Все твои друзья уже имеют качественный автомобиль?
                                        Тогда чего же ты стоишь!?
                                        Заглядывай в автосалоны и покупай машину, стань самым опытным водителем в штате!
                                    </div>
                                    <div className="helpInfo">
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header shop247">Мотосалон</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/business/Motosalon.png')}/>
                                    <div className="text">
                                        Ты жаждешь скорости?
                                        Ты хочешь чувствовать порывы ветра на скорости свыше 200 км/ч ?
                                        У меня есть для тебя отличное предложение…
                                        У нас в штате есть множество мотосалонов, здесь ты можешь приобрести технику любой скорости!
                                        Что же ты медлишь? Давай скорее заглядывай к нам.
                                    </div>
                                    <div className="helpInfo">
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                            </div>  : null}
                            {this.state.menuListSteps.step === 4 ?
                            <div>
                                <div className="builder">
                                    <div className="child_header builder">Goverment</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/factions/Meria.jpg')}/>
                                    <div className="text">
                                        Правоохранительный орган города Los-Santos, штата San-Andreas, USA.
                                        Является ведущим департаментом города Los-Santos, в юрисдикцию которого входит сам город и его ближайшие автомагистрали.
                                        Первостепенная задача Los-Santos Police Department’a - это осуществление деятельности по охране правопорядка и законности, защите прав и свобод человека.
                                    </div>
                                    <div className="helpInfo">
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header port">Los Santos Police Department</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/factions/LSPD.jpg')}/>
                                    <div className="text">
                                        Правоохранительный орган города Los-Santos, штата San-Andreas, USA.
                                        Является ведущим департаментом города Los-Santos, в юрисдикцию которого входит сам город и его ближайшие автомагистрали.
                                        Первостепенная задача Los-Santos Police Department’a - это осуществление деятельности по охране правопорядка и законности, защите прав и свобод человека.
                                    </div>
                                    <div className="helpInfo">
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header ecology">Los Santos County Sheriff</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/factions/Sherife.jpg')}/>
                                    <div className="text">
                                        Правоохранительный орган округа Blaine, штата San-Andreas, USA.
                                        Является вторым департаментом штата, в юрисдикцию которого входит весь округ Blaine.
                                        Первостепенная задача Blaine County Sheriff Office - это осуществление деятельности по охране правопорядка и законности, защите прав и свобод человека.                                </div>
                                    <div className="helpInfo">
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header pizza">FIB</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/factions/FIB.jpg')}/>
                                    <div className="text">
                                        Является руководящим органом контрразведки и антитеррористической деятельности штата, и одновременно, федеральной правоохранительной структурой .
                                        Имеет полномочия в расследование нарушений федерального законодательства штата, и обеспечения безопасности штата, нации, губернатора.                                </div>
                                    <div className="helpInfo">
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header taxi">Los Santos Medical Service</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/factions/Meria.jpg')}/>
                                    <div className="text">
                                        Является частью военных вооруженных сил USA.
                                        Создано для поддержки безопасности штата и его морского пространства.
                                        Основные задачи ВМС обнаружение внешних противников при помощи новейших радиолокационных станций расположенных на авианосце и поддержка стабильности в регионе.
                                        Имеют высокую боевую силу и постоянно находятся в состоянии активности.
                                    </div>
                                    <div className="helpInfo">
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header goPostal">Army - Fort Zancundo</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/factions/FortZancudo.jpg')}/>
                                    <div className="text">
                                        Является частью военных вооруженных сил USA.
                                        Созданы для устранения внутренних и внешних угроз штата.
                                        Основная задача защита штата от любого рода внешних и внутренних раздражителей.
                                        Fort Zancudo Army в любое время находятся в полной боевой готовности.
                                        Является регулярными войсками штата
                                    </div>
                                    <div className="helpInfo">
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header bus">United States Navy</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/factions/Meria.jpg')}/>
                                    <div className="text">
                                        Является военно-морской службой вооруженных сил Штата.
                                        Это самый большой и самый способный военно-морской флот в мире.
                                        В учебных руководствах ВМС США говорится, что задача Вооруженных сил США заключается в том, чтобы «быть готовым к проведению быстрых и длительных боевых действий в поддержку национальных интересов».
                                    </div>
                                    <div className="helpInfo">
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header longtravel">Weazel News</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/factions/WeazelNews.jpg')}/>
                                    <div className="text">
                                        Новостная компания Weazel News, начала свою работу в штате в 2018 году.
                                        За свой огромный опыт работы в этой сфере они смогли доказать миру, они самые лучшие в сфере Новостей.                                 </div>
                                    <div className="helpInfo">
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header builder">The Families</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/factions/TheFamilies.jpg')}/>
                                    <div className="text">
                                        Афроамериканская банда базирующаяся в Южном Лос-Сантосе, по большей части в районах Чемберлен-Хиллз.
                                        На данный момент члены банды принимают участие в спортивных соревнованиях и даже имеют свою бейсбольную команду «Feud».
                                        Банда также промышляет торговлей оружием, наркотиками, убийствами и грабежами.
                                    </div>
                                    <div className="helpInfo">
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header port">The Ballas Gang</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/factions/Ballas.jpg')}/>
                                    <div className="text">
                                        Уличная банда, одна из криминальных группировок в Los-Santos, состоящая по большей части из афроамериканцев.
                                        Основную прибыль банда получает с торговли наркотиками и оружием, а также занимается крышеванием, рэкетом и сутенёрства.
                                    </div>
                                    <div className="helpInfo">
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header pizza">Los Santos Vagos</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/factions/Vagos.jpg')}/>
                                    <div className="text">
                                        Мексиканская уличная банда, самая большая и многочисленная преступная группировка в городе.
                                        Контролирует северную и восточную части Лос-Сантоса.
                                        Войну за владение территориями ведут очень жестко и нападают большими группами, из-за чего имеют репутацию жестокой и сильной банды.                                </div>
                                    <div className="helpInfo">
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header taxi">Marabunta Grande</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/factions/Marabunta.jpg')}/>
                                    <div className="text">
                                        Хорошо организованная преступная группировка из Сальвадора, является одной из самых быстрорастущих банд в городе.
                                        Основной заработок банды, это незаконный оборот наркотиков и оружия в округе, а также контрабанды.
                                    </div>
                                    <div className="helpInfo">
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header goPostal">Русская мафия</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/factions/RussianMafia.jpg')}/>
                                    <div className="text">
                                        Зародившееся в сталинских лагерях преступное сообщество "Воров в законе" входит в число самых крупных криминальных кланов в мире.
                                        По своей структуре данная криминальная группа, это уникальное сообщество созданное, как попытка представителей элиты советского преступного мира объединиться в "красную мафию".                                </div>
                                    <div className="helpInfo">
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header bus">Итальянская мафия</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/factions/LKN.jpg')}/>
                                    <div className="text">
                                        Американская Cosa Nostra зародилась в конце XIX, начале XX века, в результате массовой иммиграции итальянцев в штаты.
                                        В основу мафии вошли переехавшие члены неаполитанской Камморы, Ндрагенты и сицилийской мафии.
                                    </div>
                                    <div className="helpInfo">
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header longtravel">Triada Mafia</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/factions/TriadMafia.jpg')}/>
                                    <div className="text">
                                        Скрытное сообщество, с многовековой историей.
                                        Редко проявляют себя в обществе, узнают друг друга с помощью отличительных знаков, жестов и специальных слов.
                                        По одной из Китайских легенд, основателями Триады стали монахи, которые поклялись отомстить за разрушение храма.
                                        Работает Триада очень чисто и грамотно. Члены группировки уничтожают всех свидетелей и улики, чаще всего используя холодное оружие.                                </div>
                                    <div className="helpInfo">
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header builder">Мексиканская мафия</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/factions/MexicanMafia.jpg')}/>
                                    <div className="text">
                                        Если её конечно можно так назвать, была сформирована в конце 1950-ых годов членами банды Чикано, состоявшей из заключенных тюрьмы Дюэль.
                                        Основателями криминального сообщества можно считать тринадцать мексикано-американцев из Восточного Лос-Анджелеса, называвшие себя - Mexikanemi.
                                        Первоначальной функцией мексиканской мафии была защита и поддержка членов группировки от других тюремных банд, а также от чиновников и полиции.                                </div>
                                    <div className="helpInfo">
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header port">Biker Brotherhood</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/factions/AngelsofDeathMC.jpg')}/>
                                    <div className="text">
                                        Не следует, однако забывать, что новая модель организационной деятельности позволяет оценить значение соответствующий условий активизации.
                                    </div>
                                    <div className="helpInfo">
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header ecology">Biker The Lost MC</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/factions/TheLost.jpg')}/>
                                    <div className="text">
                                        Не следует, однако забывать, что новая модель организационной деятельности позволяет оценить значение соответствующий условий активизации.
                                    </div>
                                    <div className="helpInfo">
                                        <button><img className="helpimg" src={require('../assets/img/jobList/i_sms.png')}/>Выслать адрес по sms</button>
                                    </div>
                                </div>
                            </div>  : null}
                            {this.state.menuListSteps.step === 5 ?
                            <div>
                                <div className="builder">
                                    <div className="child_header clothes">Дом класса A</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/houses/1.jpg')}/>
                                    <div className="text">
                                        Это самый дорогой дом, который есть у нас в штате.
                                        Он сделан из качественных строительных материалов.
                                        Каждая знаменитость в штате мечтает об этом доме.
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header bus">Дом класса B</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/houses/5.jpg')}/>
                                    <div className="text">
                                        Особняк обычно большое красивое здание, богато декорированный отдельно стоящий частный дом.
                                        Многие люди хотели бы себе этот дом.
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header port">Дом класса C</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/houses/3.jpg')}/>
                                    <div className="text">
                                        Большой Дом - это настоящая мечта коренного жителя штата.
                                        Который может себе позволить жить чуть выше среднего.
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header longtravel">Дом класса D</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/houses/4.jpg')}/>
                                    <div className="text">
                                        Средний дом, может себе позволить практически любой среднестатистический житель штата.
                                        Данный дом пригоден для жизни.
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header goPostal">Дом класса E</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/houses/6.jpg')}/>
                                    <div className="text">
                                        Это дом пониженной комфортности.
                                        Зачастую эти дома приобретают люди чей доход не превышает среднего.
                                    </div>
                                </div>
                                <div className="builder newSubText">
                                    <div className="child_header taxi">Дом класса F</div>
                                    <img className="imgresize" src={require('../assets/img/playerMenu/houses/2.jpg')}/>
                                    <div className="text">
                                        Зачастую трейлеры находятся вне города.
                                        И каждый кто хотел бы его приобрести задумывается о его состоянии, и во многих случаях трейлеры находятся в аварийном состоянии.
                                    </div>
                                </div>
                            </div>  : null}
                        </div>
                    </div>

                    <div className="buttons">
                        <div className="left">
                            <button onClick={() => this.menuList('return')}>Назад в меню</button>
                        </div>
                        <div className="right">
                            <button onClick={() => this.menuList('close')}>Закрыть</button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {

    };
};

const connected = connect(mapStateToProps)(PlayerMenu);
export { connected as PlayerMenu };
