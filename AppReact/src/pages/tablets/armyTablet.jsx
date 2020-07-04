import React from 'react';
import { connect } from 'react-redux';
import Clock from 'react-live-clock';

import logo from '../../assets/img/armyTablet/logo.png';
import map from '../../assets/img/armyTablet/map.png';
import profil from '../../assets/img/armyTablet/profil.png';

import '../../assets/css/armyTablet.css';

class ArmyTablet extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            LSAMPage: 'A',
            playerInfo: [],
            playersOnline: [],
            showTablet: false,
            calls: [],
            advert: '',
            warehouse: {}
        }; 

        this.handleOnClick = this.handleOnClick.bind(this);
        this._handleKeyDown = this._handleKeyDown.bind(this);
        this.sendAdvert = this.sendAdvert.bind(this);
        this.onChange = this.onChange.bind(this);
        this.removeCall = this.removeCall.bind(this);
    }

    handleOnClick(page, event) {
        if(event === 'page') {
            this.setState({ LSAMPage: page });
        } else if(event === 'exit') {
            if (mp) mp.trigger(`fromBlur`, 200);
            mp.invoke('focus', false);
            mp.trigger('setBlockControl', false);
            mp.trigger("setTabletActive", false);    
            this.setState({ LSAMPage: 'A' });
            this.setState({ showTablet: false });
        }
    }
 
    _handleKeyDown = (event) => {
        switch(event.which) {
            case 113:
                if(window.clientStorage.faction === 6) {
                    const { showTablet } = this.state;
                    if (window.fibTablet.active() || window.medicTablet.active() || window.pdTablet.active() || window.playerMenu.active() || window.sheriffTablet.active() || window.inventoryAPI.active() || window.consoleAPI.active() || window.modalAPI.active() || window.chatAPI.active() || window.tradeAPI.active() || window.documentsAPI.active()) return;
                    if(showTablet === false) {
                        if (mp) mp.trigger(`toBlur`, 200);
                        mp.invoke('focus', true);
                        mp.trigger('tablet.army.getInfoWareHouse');
                        mp.trigger('setBlockControl', true);
                        mp.trigger("setTabletActive", true);
                        this.setState({ showTablet: true });
                    } else {
                        if (mp) mp.trigger(`fromBlur`, 200);
                        mp.invoke('focus', false);
                        mp.trigger('setBlockControl', false);
                        mp.trigger("setTabletActive", false);  
                        this.setState({ showTablet: false });
                    }
                }
                break;
            default: 
                break;
        }
    }

    sendAdvert(e) {
        e.preventDefault();
        const { advert } = this.state;
        if (!advert.replace(/^\s+|\s+$/g,"")) return mp.trigger(`nError`, `Текст не должен быть пустой!`);
        if (advert.length != 0 && advert.length < 150) {
            mp.trigger('tablet.army.sendAdvert', advert);
            this.setState({ advert: '' });
            this.setState({ LSAMPage: 'A' });
        } else {
            return mp.trigger(`nError`, `Текст превышает длину 150 символов!`);
        }
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    removeCall(id) {
        let calls = this.state.calls.filter(item => item.id !== id);
        this.setState({ calls: calls });
    }

    componentDidMount() {
        window.armyTablet = {
            enable: (enable) => {
                document.removeEventListener("keydown", this._handleKeyDown);
                if (enable) {
                    document.addEventListener("keydown", this._handleKeyDown);
                }
            },
            active: () => {
                return this.state.showTablet;
            },
            changeOptions: (event, options) => {
                const { calls, playersOnline } = this.state;
                if(event === 'addCall') {
                    this.setState({ calls: [...calls, options] });
                } else if(event === 'addTeamPlayer') {
                    this.setState({ playersOnline: [...playersOnline, options] });
                } else if(event === 'setInfoWareHouse') {
                    this.setState({ warehouse: options });
                } else if(event === 'removeTeamPlayer') {
                    for (var i = 0; i < playersOnline.length; i++) {
                        if(playersOnline[i].id === options) {
                            playersOnline.splice(i, 1);
                            this.setState({ playersOnline: playersOnline });
                            break;
                        }
                    }
                }
            },
        };
    }
    
    render() {
        const { showTablet } = this.state;
        return (
            <div id="army-tablet">
                <div className="tablet-background" style={{position: 'absolute', zIndex: '99', display: showTablet === true ? 'block' : 'none'}}>
                    <div className="imurfather">
                        <div className="header">
                            <div className="ARMY newyorksixty">UNITED STATES army</div>
                            <div className="subtext londonsixty">Единая государственная база данных</div>
                            <hr/>
                            <img src={logo} style={{width: '90px', height: '90px'}}/>
                            <div className="time londonsixty"><Clock format={'HH:mm'} ticking={true} timezone={'Europe/Moscow'} /></div>
                        </div>
                        {this.state.LSAMPage === 'A' ?
                        <div id="pageA">
                            <div className="pageA">
                                <div className="buttons">
                                    <button onClick={() => this.handleOnClick('B', 'page')}>Список солдат</button>
                                    <button onClick={() => this.handleOnClick('C', 'page')}>Информация по базе</button>
                                    <button onClick={() => this.handleOnClick('D', 'page')}>Моя карточка</button>
                                    <button onClick={() => this.handleOnClick('E', 'page')}>Запросить помощь</button>
                                    <button onClick={() => this.handleOnClick('F', 'page')}>Список задач <div className="number">1</div></button>
                                    <button onClick={() => this.handleOnClick('G', 'page')}>Новость штата</button>
                                </div>
                                <div className="text">
                                    Используйте базу данных United States Army, чтобы знать стратегию своих потенциальных
                                    врагов.
                                </div>
                                <div className="buttons_nav">
                                    <button className="exitbutton focus" onClick={() => this.handleOnClick('', 'exit')} style={{float: 'right', top: '12.5em'}}>Выход</button>
                                </div>
                            </div>
                        </div> : null}
                        {this.state.LSAMPage === 'C' ?
                        <div id="pageC_info">
                            <div style={{top: '48px', position: 'relative', left: '57px'}}>
                                <div className="left">
                                    <button>Боеприпасы</button>
                                </div>
                                <div className="right">
                                    <div className="info">
                                        <div className="fst">
                                            <table>
                                                <tbody><tr>
                                                    <th>Склад материалов № 1</th>
                                                </tr>
                                                <tr>
                                                    <td>{this.state.warehouse.warehouse_1}</td>
                                                </tr>
                                            </tbody></table>
                                            <img src={require('../../assets/img/armyTablet/storage.png')}/>
                                        </div>
                                        <div className="scnd">
                                            <table>
                                                <tbody><tr>
                                                    <th>Склад материалов № 2</th>
                                                </tr>
                                                <tr>
                                                    <td>{this.state.warehouse.warehouse_2}</td>
                                                </tr>
                                            </tbody></table>
                                            <img src={require('../../assets/img/armyTablet/storage.png')}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="buttons_nav">
                                <button className="back focus" onClick={() => this.handleOnClick('A', 'page')} style={{float: 'left'}}>Назад</button>
                                <button className="exitbutton focus" onClick={() => this.handleOnClick('', 'exit')} style={{float: 'right'}}>Выход</button>
                            </div>
                        </div> : null}
                        {this.state.LSAMPage === 'F' ?
                        <div id="pageF_Map">
                            <div className="calls">
                                <div className="calls_overflow">
                                    {this.state.calls.length !== 0 ?
                                    <div>
                                        {this.state.calls.map(item =>
                                        <div className="call">
                                            <div className="color">Задача от:</div>
                                            {item.rank} {item.name}
                                            <div className="color">Расстояние:</div>
                                            TO DO
                                            <div className="color">Сообщение:</div>
                                            {item.message}
                                            <div className="color">Выполняют:</div>
                                            {item.members}
                                            <button onClick={() => this.removeCall(item.id)} className="getcall">Принять</button>
                                        </div>
                                        )}
                                    </div> :
                                    <div>
                                        <div className="londonsixty" style={{color: 'white', fontSize: '18px', textAlign: 'center'}}>Список пуст.</div>
                                    </div>}
                                </div>
                            </div>
                            <div className="map">
                                <img src={map} style={{width: '520px', height: '334px'}}/>
                                <div onClick={() => this.handleOnClick('A', 'page')} className="buttons_nav"><button className="exitbutton focus">Назад</button></div>
                            </div>
                        </div> : null}
                        {this.state.LSAMPage === 'B' ?
                        <div id="pageB_users">
                            {this.state.playersOnline.length !== 0 ?
                            <div style={{height: '58%', top: '2em', position: 'relative', overflow: 'auto'}}>
                                <table style={{width: '85%', borderCollapse: 'collapse'}}>
                                    <tr className="header">
                                        <th>Имя Фамилия</th>
                                        <th>Должность</th>
                                    </tr>
                                    {this.state.playersOnline.length !== 0 ?
                                    this.state.playersOnline.map(item => (
                                    <tr className="users">
                                        <td>{item.name}</td>
                                        <td>{item.rank}</td>
                                    </tr>)) : null}
                                </table>
                            </div> :
                            <div>
                                <div className="londonsixty" style={{color: 'white', fontSize: '18px', textAlign: 'center'}}>Список пуст.</div>
                            </div>}
                            <div className="buttons_nav">
                                <button className="back focus" onClick={() => this.handleOnClick('A', 'page')} style={{float: 'left'}}>Назад</button>
                                <button className="exitbutton focus" onClick={() => this.handleOnClick('', 'exit')} style={{float: 'right'}}>Выход</button>
                            </div>
                        </div> : null}
                        {this.state.LSAMPage === 'D' ?
                        <div id="pageD_User">
                            <div className="info">
                                <div className="nameHeader">Имя Фамилия</div>
                                <div className="name">{window.clientStorage.name}</div>
                                <div className="postHeader">Должность</div>
                                <div className="post">{window.clientStorage.factionRankName}</div>
                                <div className="postHeader">Выполнено</div>
                                <div className="post mission">16 <div style={{display: 'contents', color: '#d9c997'}}>миссий</div> </div>
                            </div>
                            <div className="image">
                                <img src={profil} style={{width: '140px', height: '140px'}}/>
                            </div>
                            <div className="buttons_nav">
                                <button className="back focus" onClick={() => this.handleOnClick('A', 'page')} style={{float: 'left'}}>Назад</button>
                                <button className="exitbutton focus" onClick={() => this.handleOnClick('', 'exit')} style={{float: 'right'}}>Выход</button>
                            </div>
                        </div> : null}
                        {this.state.LSAMPage === 'E' ?
                        <div id="pageE_Help">
                            <div className="header">Запросить помощь по экстренной связи</div>
                            <div className="buttons">
                                <button className="back focus">Ближайший экипаж</button>
                                <button className="exitbutton focus">Экипаж полиции</button>
                                <button className="exitbutton focus">Экипаж ФРБ</button>
                                <button className="exitbutton focus">Экипаж Медиков</button>
                                <button className="exitbutton focus">Код #999</button>
                            </div>
                            <div className="buttons_nav">
                                <button className="back focus" onClick={() => this.handleOnClick('A', 'page')} style={{float: 'left'}}>Назад</button>
                                <button className="exitbutton focus" onClick={() => this.handleOnClick('', 'exit')} style={{float: 'right'}}>Выход</button>
                            </div>
                        </div> : null}
                        {this.state.LSAMPage === 'G' ?
                        <div id="pageG_News">
                            <div className="news">
                                <div className="header">ГОСУДАРСТВЕННОЕ ОБЪЯВЛЕНИЕ</div>
                                <div className="input">
                                    <textarea id="advert" name="advert" maxLength="150" value={this.state.advert} onChange={this.onChange}></textarea>
                                </div>
                                <button className="buttonGoodWay" onClick={this.sendAdvert}>Подать ОБЪЯВЛЕНИЕ</button>
                            </div>
                            <div className="buttons_nav">
                                <button className="back focus" onClick={() => this.handleOnClick('A', 'page')} style={{float: 'left'}}>Назад</button>
                                <button className="exitbutton focus" onClick={() => this.handleOnClick('', 'exit')} style={{float: 'right'}}>Выход</button>
                            </div>
                        </div> : null}
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {

    };
};

const connected = connect(mapStateToProps)(ArmyTablet);
export { connected as ArmyTablet }; 