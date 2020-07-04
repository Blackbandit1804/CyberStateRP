

import React from 'react';
import { connect } from 'react-redux';

import '../assets/css/atmMenu.css';

class AtmMenu extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            atmStatus: false,
            page: 1,
            money: 0
        };

        this.onChange = this.onChange.bind(this);
        this.changePage = this.changePage.bind(this);
        this.addMoney = this.addMoney.bind(this);
        this.withdrawMoney = this.withdrawMoney.bind(this);
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    changePage(page) {
        if(page === 1) this.setState({ money: 0 });
        this.setState({ page: page });
    }

    addMoney() {
        mp.trigger('put.bank.money', this.state.money);
        this.setState({ money: 0 });
        this.closeSteps();
    }

    withdrawMoney(money) {
        mp.trigger('take.bank.money', money);
        this.setState({ money: 0 });
        this.closeSteps();
    }

    closeSteps() {
        this.setState({ atmStatus: false });
        this.setState({ page: 1 });
        this.setState({ money: 0 });
        mp.invoke('focus', false);
        mp.trigger('setBlockControl', false);
    }

    componentDidMount() {
        window.atmMenu = {
            enable: (enable) => {
                if (window.fibTablet.active() || window.sheriffTablet.active() || window.playerMenu.active() || window.medicTablet.active() || window.armyTablet.active() || window.pdTablet.active() || window.inventoryAPI.active() || window.consoleAPI.active() || window.modalAPI.active() || window.chatAPI.active() || window.tradeAPI.active() || window.documentsAPI.active()) return;
                if (enable) {
                    mp.invoke('focus', true);
                    mp.trigger('setBlockControl', true);
                    this.setState({ atmStatus: true });
                } else {
                    mp.invoke('focus', false);
                    mp.trigger('setBlockControl', false);
                    this.setState({ atmStatus: false });
                }
            },
            active: () => {
                return this.state.atmStatus;
            }
        };
    }


    render() {
        const { atmStatus } = this.state;

        return (
            <div className="bankMain" style={atmStatus === true ? {display: 'block'} : {display: 'none'}}>
                <div className="topLine"></div>
                <div className="menuBox">
                    <div className="headBank">
                        <div className="logo">
                            <img src={require('../assets/img/atm/logo.png')}/>
                        </div>
                        <div className="numberBank">БАНКОМАТ</div>
                        <div className="headBLineClear"></div>
                    </div>
                    <div className="leftBg">
                        <img src={require('../assets/img/atm/left.png')}/>
                    </div>
                    <div className="activeMenu">
                        <div className="enterPin" style={{display: 'none'}}></div>
                        <div className="mainMenu" style={this.state.page === 1 ? {display: 'block'} : {display: 'none'}}>
                            <div className="infoBlockB">
                                <div className="iconPlayer">
                                    <img src={require('../assets/img/atm/ava.png')}/>
                                </div>
                                <div className="cardInfo">
                                    <div className="nameCart">{window.clientStorage.name}</div>
                                </div>
                            </div>
                            <div style={{clear: 'both'}}></div>
                            <div className="buttonsBlock">
                                <div className="leftBtn">
                                    <div className="btn" onClick={() => this.changePage(2)}>ИНФОРМАЦИЯ О БАЛАНСЕ КАРТЫ</div>
                                    <div className="btn" onClick={() => this.changePage(3)}>ОБНАЛИЧИТЬ БАЛАНС КАРТЫ</div>
                                    <div className="btn" onClick={() => this.changePage(6)}>ПОПОЛНИТЬ БАЛАНС КАРТЫ</div>
                                </div>
                                <div className="rightBtn">
                                    <div className="btn" onClick={() => this.closeSteps()}>ЗАВeРШИТЬ</div>
                                </div>
                            </div>
                        </div>
                        <div className="infoMoney" style={this.state.page === 2 ? {display: 'block'} : {display: 'none'}}>
                            <div className="infoBlockB">
                                <div className="iconPlayer">
                                    <img src={require('../assets/img/atm/ava.png')}/>
                                </div>
                                <div className="cardInfo">
                                    <div className="nameCart">{window.clientStorage.name}</div>
                                </div>
                            </div>
                            <div style={{clear: 'both'}}></div>
                            <div className="balanceInfo">
                                <div className="balanceInfoHead">ИНФОРМАЦИЯ о БАЛАНСЕ КАРТЫ</div>
                                <div className="balanceInfoInAccount">НА ВАШЕМ СЧЕТУ:</div>
                                <div className="balanceInfoSum">{window.clientStorage.bank}$</div>
                            </div>
                            <div className="rightBtn">
                                <div className="btn" onClick={() => this.changePage(1)}>назад</div>
                                <div className="btn" onClick={() => this.closeSteps()}>ЗАВeРШИТЬ</div>
                            </div>
                        </div>
                        <div className="withdrawMoney" style={this.state.page === 3 ? {display: 'block'} : {display: 'none'}}>
                            <div className="infoBlockB">
                                <div className="iconPlayer">
                                    <img src={require('../assets/img/atm/ava.png')}/>
                                </div>
                                <div className="cardInfo">
                                    <div className="nameCart">{window.clientStorage.name}</div>
                                </div>
                            </div>
                            <div style={{clear: 'both'}}></div>
                            <div className="balanceInfo">
                                <div className="balanceInfoHead">ОБНАЛИЧИТЬ БАЛАНС КАРТЫ</div>
                                <div className="balanceInfoHelp">ВЫБЕРИТЕ СУММУ, КОТОРУЮ ЖЕЛАЕТЕ СНЯТЬ</div>
                                <div className="withdrawBtns">
                                    <div className="rowWithdraw left">
                                        <div className="btn" onClick={() => this.withdrawMoney(500)}>500$</div>
                                        <div className="btn" onClick={() => this.withdrawMoney(5000)}>5000$</div>
                                        <div className="btn" onClick={() => this.withdrawMoney(50000)}>50000$</div>
                                    </div>
                                    <div className="rowWithdraw right">
                                        <div className="btn" onClick={() => this.withdrawMoney(1000)}>1000$</div>
                                        <div className="btn" onClick={() => this.withdrawMoney(10000)}>10000$</div>
                                        <div className="btn" onClick={() => this.changePage(4)}>Другая сумма</div>
                                    </div>
                                </div>
                            </div>
                            <div className="rightBtn">
                                <div className="btn" onClick={() => this.changePage(1)}>назад</div>
                                <div className="btn" onClick={() => this.closeSteps()}>ЗАВeРШИТЬ</div>
                            </div>
                        </div>
                        <div className="withdrawOther" style={this.state.page === 4 ? {display: 'block'} : {display: 'none'}}>
                            <div className="infoBlockB">
                                <div className="iconPlayer">
                                    <img src={require('../assets/img/atm/ava.png')}/>
                                </div>
                                <div className="cardInfo">
                                    <div className="nameCart">{window.clientStorage.name}</div>
                                </div>
                            </div>
                            <div style={{clear: 'both'}}></div>
                            <div className="balanceInfo">
                                <div className="balanceInfoHead">ОБНАЛИЧИТЬ БАЛАНС КАРТЫ</div>
                                <div className="balanceInfoHelp">другая сумма</div>
                                <div className="OtherWithdHelp">ВЫБЕРИТЕ СУММУ, КОТОРУЮ ЖЕЛАЕТЕ СНЯТЬ</div>
                                <center>
                                    <input className="withdrawtSum" id="money" name="money" type="text" value={this.state.money} onChange={this.onChange}/>
                                </center>
                                <div className="btn withdrawBtn" onClick={() => this.withdrawMoney(this.state.money)}>Снять</div>   
                            </div>
                            <div className="rightBtn">
                                <div className="btn" onClick={() => this.changePage(1)}>назад</div>
                                <div className="btn" onClick={() => this.closeSteps()}>ЗАВeРШИТЬ</div>
                            </div>
                        </div>
                        <div className="withdrawOther" style={this.state.page === 6 ? {display: 'block'} : {display: 'none'}}>
                            <div className="infoBlockB">
                                <div className="iconPlayer">
                                    <img src={require('../assets/img/atm/ava.png')}/>
                                </div>
                                <div className="cardInfo">
                                    <div className="nameCart">{window.clientStorage.name}</div>
                                </div>
                            </div>
                            <div style={{clear: 'both'}}></div>
                            <div className="balanceInfo">
                                <div className="balanceInfoHead">ПОПОЛНЕНИЕ БАЛАНСА КАРТЫ</div>
                                <div className="OtherWithdHelp">ВЫБЕРИТЕ СУММУ, КОТОРУЮ ЖЕЛАЕТЕ ПОПОЛНИТЬ</div>
                                <center>
                                    <input className="withdrawtSum" type="text" id="money" name="money" value={this.state.money} onChange={this.onChange}/>
                                </center>
                                <div className="btn withdrawBtn" onClick={() => this.addMoney()}>Пополнить</div>   
                            </div>
                            <div className="rightBtn">
                                <div className="btn" onClick={() => this.changePage(1)}>назад</div>
                                <div className="btn" onClick={() => this.closeSteps()}>ЗАВeРШИТЬ</div>
                            </div>
                        </div>
                    </div>
                
                    <div className="bottomLine">
                        Официальный сайт банка maze-bank.com
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

const connected = connect(mapStateToProps)(AtmMenu);
export { connected as AtmMenu }; 