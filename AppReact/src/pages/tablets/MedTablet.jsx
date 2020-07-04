import React from 'react'
import Clock from 'react-live-clock'

import emsIconImg from '../../assets/img/tablets/ems/ems-logo.png'

class MedTablet extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            LSMCPage: 'A',
            playersOnline: [],
            showTablet: false,
            calls: [],
            advert: '',
        }

        this.handleOnClick = this.handleOnClick.bind(this)
        this._handleKeyDown = this._handleKeyDown.bind(this)
        this.sendAdvert = this.sendAdvert.bind(this)
        this.onChange = this.onChange.bind(this)
        this.removeCall = this.removeCall.bind(this)
        this.callHelp = this.callHelp.bind(this)
    }

    handleOnClick(page, event) {
        if (event === 'page') {
            this.setState({ LSMCPage: page })
        } else if (event === 'exit') {
            alt.emit('fromBlur', 200)
            alt.emit('setTabletActive', false)
            alt.emit('Cursor::show', false)
            alt.emit('setBlockControl', false)
            this.setState({ showTablet: false })
        }
    }

    _handleKeyDown = event => {
        switch (event.which) {
        case 113:
            if (window.clientStorage.faction === 5) {
                const { showTablet } = this.state
                if (
                    window.pdTablet.active()
                    || window.inventoryAPI.active()
                    || window.playerMenu.active()
                    || window.consoleAPI.active()
                    || window.modalAPI.active()
                    || window.chatAPI.active()
                    || window.telePhone.active()
                    || window.documentsAPI.active()
                ) return
                if (showTablet === false) {
                    alt.emit('toBlur', 200)
                    alt.emit('Cursor::show', true)
                    alt.emit('setBlockControl', true)
                    alt.emit('setTabletActive', true)
                    this.setState({ showTablet: true })
                } else {
                    alt.emit('fromBlur', 200)
                    alt.emit('setTabletActive', false)
                    alt.emit('Cursor::show', false)
                    alt.emit('setBlockControl', false)
                    this.setState({ showTablet: false })
                }
            }
            break
        default:
            break
        }
    }

    sendAdvert(e) {
        e.preventDefault()
        const { advert } = this.state
        if (!advert.replace(/^\s+|\s+$/g, '')) return alt.emit('nError', 'Текст не должен быть пустой!')
        if (advert.length !== 0 && advert.length < 150) {
            alt.emit('tablet.medic.sendAdvert', advert)
            this.setState({ advert: '' })
            this.setState({ LSMCPage: 'A' })
        } else {
            return alt.emit('nError', 'Текст превышает длину 150 символов!')
        }
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    removeCall = (id, x, y) => {
        alt.emit('tablet.medic.acceptCall', id, x, y)
    }

    callHelp = event => {
        if (event === 'callTeamHelp') {
            alt.emit('tablet.medic.callTeamHelp')
        } else if (event === 'callPoliceHelp') {
            alt.emit('tablet.medic.callPoliceHelp')
        }
    }

    componentDidMount() {
        alt.on(`medicTablet`, (event, options) => {
            const { calls, playersOnline } = this.state
            if (event === 'addCall') {
                this.setState({ calls: [...calls, options] })
            } else if (event === 'addTeamPlayer') {
                this.setState({ playersOnline: [...playersOnline, options] })
            } else if (event === 'enable') {
                window.medicTablet.enable(options)
            } else if (event === 'removeTeamPlayer') {
                for (let i = 0; i < playersOnline.length; i++) {
                    if (playersOnline[i].id === options) {
                        playersOnline.splice(i, 1)
                        this.setState({ playersOnline })
                    }
                }
            } else if (event === 'removeCall') {
                this.setState({ calls: calls.filter(call => call.id !== options) })
            }
        });
        window.medicTablet = {
            enable: enable => {
                document.removeEventListener('keydown', this._handleKeyDown)
                if (enable) {
                    document.addEventListener('keydown', this._handleKeyDown)
                }
            },
            active: () => {
                const { showTablet } = this.state
                return showTablet
            }
        }
    }

    render() {
        const {
            advert,
            calls,
            LSMCPage,
            playersOnline,
            showTablet,
        } = this.state
        return (
            showTablet
            && <div id="ems">
                <div className="content">
                    <nav className="nav">
                        <div className="nav-title">
                            Los Santos Medical Center
                            <span>Panel</span>
                        </div>
                        <div className="nav-faction">
                            <img src={emsIconImg} alt="ems" />
                        </div>
                        <div className="nav-time">
                            <Clock
                                format="HH:mm"
                                ticking
                                timezone="Europe/Moscow"
                            />
                        </div>
                        <button
                            className="nav-exit"
                            onClick={() => this.handleOnClick('', 'exit')}
                            type="button"
                        >
                            Выход
                        </button>
                    </nav>
                    {(LSMCPage === 'A')
                        && <div className="main">
                            <div className="content-title">
                                <div className="title">
                                    Навигация
                                    <span>панели</span>
                                </div>
                                <div className="title">
                                    Описание
                                    <span>Действие</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="column">
                                    <ul>
                                        <li>
                                            <button
                                                onClick={() => this.handleOnClick('B', 'page')}
                                                type="button"
                                            >
                                                Вызовы
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() => this.handleOnClick('C', 'page')}
                                                type="button"
                                            >
                                                Список сотрудников
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() => this.handleOnClick('D', 'page')}
                                                type="button"
                                            >
                                                Моя карточка
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() => this.handleOnClick('E', 'page')}
                                                type="button"
                                            >
                                                Запросить помощь
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() => this.handleOnClick('F', 'page')}
                                                type="button"
                                            >
                                                Новость штата
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                                <div className="column">
                                    <div className="img" />
                                    <div className="description">
                                        Используйте базу данных Los Santos Medical Center,
                                        чтобы взять вызов и спасти жизнь
                                        гражданину штата.
                                    </div>
                                </div>
                            </div>
                        </div> }
                    {(LSMCPage === 'B')
                            && <div className="requests">
                                <div className="row">
                                    <div className="column">
                                        {calls.length !== 0
                                            ? <ul className="requests-list">
                                                {calls.map(item => <li>
                                                    <div>
                                                        Имя фамилия
                                                        <span>{item.name}</span>
                                                    </div>
                                                    <div>
                                                        Дистанция
                                                        <span>{parseInt(item.dist, 10)}</span>
                                                    </div>
                                                    <div>
                                                        Сообщение:
                                                        <span>{item.message}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => this.removeCall(
                                                            item.id,
                                                            item.pos.x,
                                                            item.pos.y
                                                        )}
                                                        type="button"
                                                    >
                                                        Принять вызов
                                                    </button>
                                                </li>
                                                )}
                                            </ul> : 'Нет вызовов'
                                        }
                                    </div>
                                    <div className="right-side">
                                        <div className="map" />
                                        <button
                                            className="back"
                                            onClick={() => this.handleOnClick('A', 'page')}
                                            type="button"
                                        >
                                            Назад
                                        </button>
                                    </div>
                                </div>
                            </div>
                    }
                    {(LSMCPage === 'C')
                        && <div className="members">
                            {playersOnline.length !== 0
                                ? <React.Fragment>
                                    <div className="members-title">
                                        <span>Имя Фамилия</span>
                                        <span>Должность</span>
                                        <span>В штате</span>
                                        {(window.clientStorage.factionRank
                                            >= window.clientStorage.factionLastRank)
                                            && <span>Действия</span>
                                        }
                                    </div>
                                    <ul className="members-list">
                                        {playersOnline.map(item => (
                                            <li>
                                                <span>{item.name}</span>
                                                <span>{item.rank}</span>
                                                <span
                                                    className={item.online ? 'yes' : 'no'}
                                                >
                                                    {item.online ? 'Да' : 'Да'}
                                                </span>
                                                {(window.clientStorage.rank
                                                    >= window.clientStorage.factionLastRank)
                                                  && <React.Fragment>
                                                      <button
                                                          onClick={() => alt.emit(
                                                              'events.emitServer',
                                                              'factions.uninvite',
                                                              item.sqlId)
                                                          }
                                                          type="button"
                                                      >
                                                        Уволить
                                                      </button>
                                                      <button
                                                          onClick={() => alt.emit(
                                                              'events.emitServer',
                                                              'factions.giverank',
                                                              item.sqlId
                                                          )}
                                                          type="button"
                                                      >
                                                          Повысить
                                                      </button>
                                                      <button
                                                          onClick={() => alt.emit(
                                                              'events.emitServer',
                                                              'factions.ungiverank',
                                                              item.sqlId)}
                                                          type="button"
                                                      >
                                                          Понизить
                                                      </button>
                                                  </React.Fragment>
                                                }
                                            </li>
                                        ))}
                                    </ul>
                                </React.Fragment>
                                : <div>
                                      Список пуст.
                                </div>
                            }
                            <button
                                className="back"
                                type="button"
                                onClick={() => this.handleOnClick('A', 'page')}
                            >
                                Назад
                            </button>
                        </div>
                    }
                    {(LSMCPage === 'D')
                            && <div className="person">
                                <div className="row">
                                    <div className="column">
                                        <ul>
                                            <li>
                                                Имя Фамилия:
                                                <div>{window.clientStorage.name}</div>
                                            </li>
                                            <li>
                                                Должность:
                                                <div>{window.clientStorage.factionRankName}</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <button
                                    className="back"
                                    onClick={() => this.handleOnClick('A', 'page')}
                                    type="button"
                                >
                                    Назад
                                </button>
                            </div>
                    }
                    {(LSMCPage === 'E')
                            && <div className="help">
                                <div className="help-title">
                                    Запросить помощь
                                </div>
                                <div className="help-list">
                                    <button
                                        onClick={() => this.callHelp('callTeamHelp')}
                                        type="button"
                                    >
                                    Ближайший экипаж
                                    </button>
                                    <button
                                        onClick={() => this.callHelp('callPoliceHelp')}
                                        type="button"
                                    >
                                    Наряд полиции
                                    </button>
                                </div>
                                <div className="help-text">
                                    Использование экстренной связи, даст возможность мгновенно выслать
                                    координаты вашего места нахождения ближайшему
                                    патрульному экипажу с сигналом “SOS”
                                </div>
                                <button
                                    className="back"
                                    onClick={() => this.handleOnClick('A', 'page')}
                                    type="button"
                                >
                                    Назад
                                </button>
                            </div>

                    }
                    {(LSMCPage === 'F')
                        && <div className="advert">
                            <div className="advert-title">
                                Государственное объявление
                            </div>
                            <form>
                                <label htmlFor="reason">
                                    <textarea
                                        id="advert"
                                        name="advert"
                                        maxLength="150"
                                        value={advert}
                                        onChange={this.onChange}
                                        style={{ resize: 'none' }}
                                    />
                                </label>
                                <button
                                    onClick={this.sendAdvert}
                                    type="button"
                                >
                                    Подать объявление
                                </button>
                            </form>
                            <button
                                className="back"
                                onClick={() => this.handleOnClick('A', 'page')}
                                type="button"
                            >
                                Назад
                            </button>
                        </div>
                    }
                </div>
            </div>

        )
    }
}
export default MedTablet
