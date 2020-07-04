import React from 'react'

import '../assets/css/hud.css'

import starImg from '../assets/img/hud/star_fill.png'
import onlineImg from '../assets/img/hud/multiple-users-silhouette.png'
import bankImg from '../assets/img/hud/bank.png'
import moneyImg from '../assets/img/hud/money.png'
import leftArrow from '../assets/img/hud/left-arrow.png'
import rightArrow from '../assets/img/hud/right-arrow.png'
import upImg from '../assets/img/hud/up.png'
import phoneImg from '../assets/img/hud/003-smartphone.png'
import microOn from '../assets/img/hud/micro-on.png'
import microOff from '../assets/img/hud/micro-off.png'

class Hud extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hudStatus: false,
            leftHudHidden: false,
            data: {},
            lastMoney: 0,
            lastBank: 0,
            online: 0,
            updateMoney: false,
            updateBank: false,
            weaponData: {},
            weaponDataTwo: {},
            chat: 0,
            weaponClip: 0,
            microStatus: false,
        }
        this.updateMoney = this.updateMoney.bind(this)
        this.updateBank = this.updateBank.bind(this)
    }

    componentDidMount() {
        alt.on('hudControl', (event, options) => {
            if (event === 'setOnline') {
                this.setState(prevState => {
                    return {
                        ...prevState,
                        online: options,
                    }
                })
            } else if (event === 'setData') {
                this.setState(prevState => {
                    return {
                        ...prevState,
                        data: options,
                    }
                })
            } else if (event === 'chat') {
                this.setState(prevState => {
                    return {
                        ...prevState,
                        chat: options,
                    }
                })
            } else if (event === 'updateMoney') {
                this.updateMoney(options)
            } else if (event === 'enable') {
                window.hudControl.enable(options)
            } else if (event === 'updateBank') {
                this.updateBank(options)
            } else if (event === 'updateWanted') {
                this.setState(prevState => {
                    return {
                        ...prevState,
                        data: {
                            bank: prevState.data.bank,
                            money: prevState.data.money,
                            wanted: options.wanted,
                        },
                    }
                })
            } else if (event === 'setDataWeapon') {
                this.setState(prevState => {
                    return {
                        ...prevState,
                        weaponData: options,
                    }
                })
            }
        })
        window.hudControl = {
            enable: enable => {
                if (enable) {
                    this.setState(prevState => {
                        return {
                            ...prevState,
                            hudStatus: true,
                        }
                    })
                } else {
                    this.setState(prevState => {
                        return {
                            ...prevState,
                            hudStatus: false,
                        }
                    })
                }
            },
            active: () => {
                const { hudStatus } = this.state
                return hudStatus
            },
        }
        alt.on('voiceAPI.off', () => {
            this.setState(prevState => {
                return {
                    ...prevState,
                    microStatus: false,
                }
            })
        })
        alt.on('voiceAPI.on', () => {
            this.setState(prevState => {
                return {
                    ...prevState,
                    microStatus: true,
                }
            })
        })
    }

    updateMoney(dataMoney) {
        const { data } = this.state
        this.setState(prevState => {
            return {
                ...prevState,
                lastMoney: data.money,
                data: {
                    money: dataMoney.money,
                    bank: prevState.data.bank,
                    wanted: prevState.data.wanted,
                },
                updateMoney: true,
            }
        })
        setTimeout(() => {
            this.setState(prevState => {
                return {
                    ...prevState,
                    updateMoney: false,
                }
            })
        }, 5000)
    }

    updateBank(dataBank) {
        this.setState(prevState => {
            return {
                ...prevState,
                lastBank: prevState.data.bank,
                data: {
                    bank: dataBank.bank,
                    money: prevState.data.money,
                    wanted: prevState.data.wanted,
                },
                updateBank: true,
            }
        })
        setTimeout(() => {
            this.setState(prevState => {
                return {
                    ...prevState,
                    updateBank: false,
                }
            })
        }, 5000)
    }

    getStars() {
        const { data } = this.state
        const starsRender = []
        if (data.wanted) {
            for (let i = 0; i < data.wanted; i++) {
                starsRender.push(
                    <img src={starImg} alt="" />
                )
            }
        }
        return starsRender
    }

    render() {
        const { hudStatus, microStatus, online } = this.state
        function abc2(n) {
            n += ''
            n = new Array(4 - n.length % 3).join('U') + n
            return n.replace(/([0-9U]{3})/g, '$1 ').replace(/U/g, '')
        }
        return (
            hudStatus
            && <div id="HUD">
                <div className="rightHud">
                    <div className="moneyBlock">
                        <div className="money">
                            <img src={moneyImg} alt="" />
                            {this.state.updateMoney === true
                                ? this.state.data.money >= this.state.lastMoney
                                    ? <div id="plusCash" style={{ color: '#48d670' }}>
+
                                        {abc2(this.state.data.money - this.state.lastMoney)}
                                    </div>
                                    : <div id="plusCash" style={{ color: '#ff0000' }}>
-
                                        {abc2(this.state.lastMoney - this.state.data.money)}
                                    </div>
                                : null}
                            <h2>{abc2(this.state.data.money)}</h2>
                        </div>
                        <div className="bank">
                            <img src={bankImg} alt="" />
                            {this.state.updateBank === true
                                ? this.state.data.bank >= this.state.lastBank
                                    ? <div id="cardAddMoney" style={{ color: '#48d670' }}>
+
                                        {abc2(this.state.data.bank - this.state.lastBank)}
                                    </div>
                                    : <div id="cardAddMoney" style={{ color: '#ff0000' }}>
-
                                        {abc2(this.state.lastBank - this.state.data.bank)}
                                    </div>
                                : null}
                            <h2>{abc2(this.state.data.bank)}</h2>
                        </div>
                    </div>
                    <div className="wanted">
                        {this.getStars()}
                    </div>
                    <div className="onlineBlock">
                        <img src={onlineImg} alt="" />
                        <b>{online}</b>
/512
                    </div>
                </div>
                <div id="hints" class="right">
                    <input type="checkbox" class="hints-checkbox" tabIndex="-1"/>
                    <div class="hints-block">
                        <ul class="hints-list">
                            <li class="hints-list__item">
                            <span class="hints-list__item-title">Основное меню</span>
                            <span class="hints-list__item-button">M</span>
                            </li>
                            <li class="hints-list__item">
                            <span class="hints-list__item-title">Инвентарь</span>
                            <span class="hints-list__item-button">I</span>
                            </li>
                            <li class="hints-list__item">
                            <span class="hints-list__item-title">Голосовой чат</span>
                            <span class="hints-list__item-button">N</span>
                            </li>
                            <li class="hints-list__item">
                            <span class="hints-list__item-title">Курсор</span>
                            <span class="hints-list__item-button">ALT</span>
                            </li>
                            <li class="hints-list__item">
                            <span class="hints-list__item-title">Телефон</span>
                            <span class="hints-list__item-button"><img src={require('../assets/img/phone.svg')}/></span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="phoneMicHud">
                    <img src={phoneImg} alt="" className="phone" />
                    { microStatus
                        ? <img src={microOn} className="microphone" alt="" />
                        : <img src={microOff} className="microphone" alt="" />
                    }
                </div>
            </div>
        )
    }
}
export default Hud
