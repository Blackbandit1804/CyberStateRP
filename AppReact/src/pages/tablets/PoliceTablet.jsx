import React from 'react'
import Clock from 'react-live-clock'

import personImg from '../../assets/img/tablets/police/person.png'
import policeIconImg from '../../assets/img/tablets/police/police-icon.png'

import '../../assets/css/tablets.css';

class PoliceTablet extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            PDPage: 'A',
            pageD: {
                step: 0,
            },
            pageB: {
                step: 0,
            },
            pageE: {
                step: 0,
            },
            stars: null,
            showTablet: false,
            playersOnline: [],
            calls: [],
            searchPlayer: null,
            name: null,
            surname: null,
            reason: null,
            summ: null,
            playerId: null,
            data: {},
        }

        this.handleonClickBOne = this.handleonClickBOne.bind(this)
        this.handleOnClickBTwo = this.handleOnClickBTwo.bind(this)
        this.handleOnClick = this.handleOnClick.bind(this)
        this.handleOnClickD = this.handleOnClickD.bind(this)
        this.onChange = this.onChange.bind(this)
        this.handleOnClickE = this.handleOnClickE.bind(this)
        this._handleKeyDown = this._handleKeyDown.bind(this)
        this.removeCall = this.removeCall.bind(this)
        this.callHelp = this.callHelp.bind(this)
        this.sendSearchPlayer = this.sendSearchPlayer.bind(this)
        this.giveFine = this.giveFine.bind(this)
        this.handleOnClickED = this.handleOnClickED.bind(this)
        this.handleOnClickEB = this.handleOnClickEB.bind(this)
        this.giveWanted = this.giveWanted.bind(this)
        this.isNumber = this.isNumber.bind(this)
        this.handleClickReturnE = this.handleClickReturnE.bind(this)
        this.handleClickReturnD = this.handleClickReturnD.bind(this)
        this.handleClickReturnB = this.handleClickReturnB.bind(this)
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    isNumber = _evt => {
        const evt = (_evt) || window.event
        const charCode = (evt.which) ? evt.which : evt.keyCode
        if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
            evt.preventDefault()
        } else {
            return true
        }
    }

    sendSearchPlayer(e) {
        const { pageB, pageD, pageE, playerId, name, surname } = this.state
        e.preventDefault()
        if (pageE.step === 1 || pageD.step === 1 || pageB.step === 0) {
            const param = `${name} ${surname}`
            alt.emit('tablet.police.searchPlayer', 'name', param)
        } else if (pageE.step === 2 || pageD.step === 2 || pageB.step === 2) {
            alt.emit('tablet.police.searchPlayer', 'playerId', playerId)
        }
    }

    giveFine(e) {
        const { searchPlayer, reason, summ } = this.state
        e.preventDefault()
        alt.emit('tablet.police.giveFine', searchPlayer, reason, summ)
        this.setState({ pageE: { step: 0 } })
        this.setState({ searchPlayer: null })
        this.setState({ reason: null })
        this.setState({ summ: null })
        this.setState({ playerId: null })
        this.setState({ name: null })
        this.setState({ surname: null })
    }

    giveWanted(e) {
        const { searchPlayer, stars } = this.state
        e.preventDefault()
        alt.emit('tablet.police.giveWanted', searchPlayer, stars)
        this.setState({ pageD: { step: 0 } })
        this.setState({ searchPlayer: null })
        this.setState({ stars: null })
        this.setState({ playerId: null })
        this.setState({ name: null })
        this.setState({ surname: null })
    }

    handleChange(e) {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    handleClickReturnE(page, step) {
        const { pageE, searchPlayer, playerId, name } = this.state
        if (pageE.step === 0) {
            this.setState({ PDPage: 'A' })
        } else if (pageE.step === 2 || pageE.step === 1) {
            this.setState({ [page]: { step: 0 } })
        } else if (searchPlayer !== null && playerId === null) {
            this.setState({ [page]: { step: 1 } })
        } else if (searchPlayer !== null && name === null) {
            this.setState({ [page]: { step: 2 } })
        }
        this.setState({ searchPlayer: null })
        this.setState({ reason: null })
        this.setState({ summ: null })
        this.setState({ playerId: null })
        this.setState({ name: null })
        this.setState({ surname: null })
    }

    handleClickReturnD = (page, step) => {
        const { pageD, searchPlayer, playerId, name } = this.state
        if (pageD.step === 0) {
            this.setState({ PDPage: 'A' })
        } else if (pageD.step === 2 || pageD.step === 1) {
            this.setState({ [page]: { step: 0 } })
        } else if (searchPlayer !== null && playerId === null) {
            this.setState({ [page]: { step: 1 } })
        } else if (searchPlayer !== null && name === null) {
            this.setState({ [page]: { step: 2 } })
        }
        this.setState({ searchPlayer: null })
        this.setState({ stars: null })
        this.setState({ playerId: null })
        this.setState({ name: null })
        this.setState({ surname: null })
    }

    handleClickReturnB = (page, step) => {
        const { pageB, searchPlayer, playerId, name } = this.state
        if (pageB.step === 0) {
            this.setState({ PDPage: 'A' })
        } else if (pageB.step === 3 || pageB.step === 1) {
            this.setState({ [page]: { step: 0 } })
        } else if (searchPlayer !== null && playerId === null) {
            this.setState({ [page]: { step: 1 } })
        } else if (searchPlayer !== null && name === null) {
            this.setState({ [page]: { step: 2 } })
        }
        this.setState({ searchPlayer: null })
        this.setState({ stars: null })
        this.setState({ playerId: null })
        this.setState({ data: {} })
        this.setState({ name: null })
        this.setState({ surname: null })
    }

    _handleKeyDown = event => {
        switch (event.which) {
        case 113:
            if (window.clientStorage.faction === 2) {
                const { showTablet } = this.state
                if (
                    window.inventoryAPI.active()
                    || window.playerMenu.active()
                    || window.modalAPI.active()
                    || window.chatAPI.active()
                    || window.medicTablet.active()
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

    componentDidMount() {
        alt.on(`pdTablet`, (event, options) => {
            const { calls, playersOnline, PDPage } = this.state
            if (event === 'addCall') {
                this.setState({ calls: [...calls, options] })
            } else if (event === 'addSearchPlayer') {
                if (PDPage === 'E') {
                    this.setState({ pageE: { step: 3 } })
                    this.setState({ searchPlayer: options.playerId })
                } else if (PDPage === 'D') {
                    this.setState({ pageD: { step: 3 } })
                    this.setState({ searchPlayer: options.playerId })
                } else if (PDPage === 'B') {
                    this.setState({ pageB: { step: 3 } })
                    this.setState({ data: options })
                    this.setState({ searchPlayer: options.playerId })
                }
            } else if (event === 'addTeamPlayer') {
                this.setState({ playersOnline: [...playersOnline, options] })
            } else if (event === "enable") {
                window.pdTablet.enable(options)
            } else if (event === 'removeTeamPlayer') {
                for (let i = 0; i < playersOnline.length; i++) {
                    if (playersOnline[i].id === options) {
                        playersOnline.splice(i, 1)
                        this.setState({ playersOnline })
                        break
                    }
                }
            } else if (event === 'removeCall') {
                this.setState({ calls: calls.filter(call => call.id !== options) })
            }
        });
        window.pdTablet = {
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

    removeCall = (id, x, y) => {
        alt.emit('tablet.police.acceptCall', id, x, y)
    }

    callHelp = event => {
        if (event === 'callTeamHelp') {
            alt.emit('tablet.police.callTeamHelp')
        } else if (event === 'callHospitalHelp') {
            alt.emit('tablet.police.callHospitalHelp')
        } else if (event === 'callFibHelp') {
            alt.emit('tablet.police.callFibHelp')
        }
    }

    handleonClickBOne = () => {
        const { pageB } = this.state
        if (pageB.step === 0) {
            this.setState({ PDPage: 'A' })
        } else if (pageB.step === 1) {
            this.setState({ pageB: { step: 0 } })
        } else if (pageB.step === 2) {
            this.setState({ pageB: { step: 0 } })
        }
    }

    handleOnClickBTwo = () => {
        const { pageB } = this.state
        if (pageB.step === 3) {
            this.setState({ pageB: { step: 0 } })
        } else {
            this.setState({ PDPage: 'A' })
        }
    }

    handleOnClickD = () => {
        const { pageD } = this.state
        if (pageD.step === 0) {
            this.setState({ PDPage: 'A' })
        } else if (pageD.step === 1) {
            this.setState({ pageB: { step: 0 } })
        } else if (pageD.step === 2) {
            this.setState({ pageB: { step: 0 } })
        }
    }

    handleOnClickE = (step, event) => {
        this.setState({ pageE: { step } })

        if (event === 'exit') {
            alt.emit('fromBlur', 200)
            alt.emit('setTabletActive', false)
            alt.emit('Cursor::show', false)
            alt.emit('setBlockControl', false)
            this.setState({ PDPage: 'A' })
            this.setState({ pageE: { step: 0 } })
            this.setState({ showTablet: false })
            this.setState({ searchPlayer: null })
            this.setState({ reason: null })
            this.setState({ summ: null })
            this.setState({ playerId: null })
            this.setState({ name: null })
            this.setState({ surname: null })
        }
    }

    handleOnClickED = (step, event) => {
        this.setState({ pageD: { step } })

        if (event === 'exit') {
            alt.emit('fromBlur', 200)
            alt.emit('setTabletActive', false)
            alt.emit('Cursor::show', false)
            alt.emit('setBlockControl', false)
            this.setState({ PDPage: 'A' })
            this.setState({ pageD: { step: 0 } })
            this.setState({ showTablet: false })
            this.setState({ searchPlayer: null })
            this.setState({ stars: null })
            this.setState({ playerId: null })
            this.setState({ name: null })
            this.setState({ surname: null })
        }
    }

    handleOnClickEB = (step, event) => {
        this.setState({ pageB: { step } })

        if (event === 'exit') {
            alt.emit('fromBlur', 200)
            alt.emit('setTabletActive', false)
            alt.emit('Cursor::show', false)
            alt.emit('setBlockControl', false)
            this.setState({ PDPage: 'A' })
            this.setState({ pageB: { step: 0 } })
            this.setState({ showTablet: false })
            this.setState({ searchPlayer: null })
            this.setState({ stars: null })
            this.setState({ data: {} })
            this.setState({ playerId: null })
            this.setState({ name: null })
            this.setState({ data: {} })
            this.setState({ surname: null })
        }
    }

    handleOnClick = (page, event, value) => {
        if (page === 'D' && event === 'step') {
            this.setState({ pageD: { step: value } })
        } else if (event === 'page') {
            this.setState({ PDPage: page })
        } else if (event === 'exit') {
            alt.emit('fromBlur', 200)
            alt.emit('setTabletActive', false)
            alt.emit('Cursor::show', false)
            alt.emit('setBlockControl', false)
            this.setState({ PDPage: 'A' })
            this.setState({ showTablet: false })
        }
    }

    render() {
        const {
            calls,
            PDPage,
            pageD,
            pageB,
            data,
            playersOnline,
            searchPlayer,
            pageE,
            playerId,
            name,
            surname,
            showTablet,
            stars,
            reason,
            summ,
        } = this.state
        return (
            showTablet
                && <div id="police">
                    <div className="content">
                        <nav className="nav">
                            <div className="nav-title">
                                Los Santos Police
                                <span>Panel</span>
                            </div>
                            <div className="nav-faction">
                                <img src={policeIconImg} alt="police" />
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
                        {(PDPage === 'A')
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
                                                    Поиск гражданина
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
                                                    Объявить розыск
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={() => this.handleOnClick('E', 'page')}
                                                    type="button"
                                                >
                                                    Выписать штраф
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={() => this.handleOnClick('F', 'page')}
                                                    type="button"
                                                >
                                                    Запросить помощь
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={() => this.handleOnClick('G', 'page')}
                                                    type="button"
                                                >
                                                    Вызовы
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="column">
                                        <div className="img" />
                                        <div className="description">
                                              Используйте базу данных Los Santos Police Department,
                                              чтобы найти преступников среди
                                              невинных людей. Сделайте этот город безопастным для общества!
                                        </div>
                                    </div>
                                </div>
                            </div> }
                        {(PDPage === 'B')
                            && <React.Fragment>
                                {(pageB.step === 0 && searchPlayer === null)
                                    && <div className="check">
                                        <div className="check-title">
                                        Поиск по базе
                                        </div>
                                        <div className="check-text">
                                          Заполните следующие поля:
                                        </div>
                                        <form>
                                            <label htmlFor="name">
                                                <div>Имя:</div>
                                                <input
                                                    name="name"
                                                    id="name"
                                                    value={name}
                                                    onChange={this.onChange}
                                                />
                                            </label>
                                            <label htmlFor="surname">
                                                <div>Фамилия:</div>
                                                <input
                                                    name="surname"
                                                    id="surname"
                                                    value={surname}
                                                    onChange={this.onChange}
                                                />
                                            </label>
                                            <button
                                                onClick={this.sendSearchPlayer}
                                                type="button"
                                            >
                                              Найти информацию
                                            </button>
                                        </form>
                                        <button
                                            className="back"
                                            onClick={() => this.handleClickReturnB(
                                                'pageB',
                                                pageB.step
                                            )}
                                            type="button"
                                        >
                                            Назад
                                        </button>
                                    </div>
                                }
                                {(pageB.step === 3 && searchPlayer !== null)
                                        && <div className="person">
                                            <div className="row">
                                                <div className="column">
                                                    <ul>
                                                        <li>
                                                            Имя Фамилия:
                                                            <div>{data.name}</div>
                                                        </li>
                                                        <li>
                                                            Номер паспорта:
                                                            <div>{data.playerId}</div>
                                                        </li>
                                                        <li>
                                                            Место жительства:
                                                            {data.houses.length !== 0
                                                                ? data.houses.map(house => (
                                                                    <div>
                                                                        {house.adress}
                                                                        [Дом №
                                                                        {house.id}
                                                                        ]
                                                                    </div>
                                                                ))
                                                                : <div>
                                                                Бездомный
                                                                </div>
                                                            }
                                                        </li>
                                                        {
                                                  // <li>
                                                  //   Транспортные средства:
                                                  //   <div>Elegy [W321A]</div>
                                                  //   <div>Sulatn [S342F]</div>
                                                  //   <div>XLS [F002F]</div>
                                                  // </li>
                                                        }
                                                        <li>
                                                            Преступлений:
                                                            <div>{data.crimes}</div>
                                                        </li>
                                                        <li>
                                                            Место работы:
                                                            <div>{data.faction}</div>
                                                        </li>
                                                        <li>
                                                            Уровень розыска:
                                                            <div>{data.wanted}</div>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="column">
                                                    <div className="photo">
                                                        <img src={personImg} alt="person" />
                                                    </div>
                                                    {
                                                  // <div className="wanted">
                                                  //   <div className="star"></div>
                                                  //   <div className="star"></div>
                                                  //   <div className="star"></div>
                                                  //   <div className="star"></div>
                                                  //   <div className="star"></div>
                                                  //   <div className="star"></div>
                                                  // </div>
                                                    }
                                                    <button
                                                        className="find"
                                                        onClick={() => this.handleOnClick('B', 'page')}
                                                        type="button"
                                                    >
                                                        Начать поиск
                                                    </button>
                                                    <button
                                                        className="back"
                                                        onClick={() => this.handleClickReturnB('pageB', pageB.step)}
                                                        type="button"
                                                    >
                                                        Назад
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                }
                            </React.Fragment>
                        }
                        {(PDPage === 'C')
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
                                                    {(window.clientStorage.factionRank
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
                                                                  'factions.ungiverank',
                                                                  item.sqlId
                                                              )}
                                                              type="button"
                                                          >
                                                              Повысить
                                                          </button>
                                                          <button
                                                              onClick={() => alt.emit(
                                                                  'events.emitServer',
                                                                  'factions.giverank',
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
                        {(PDPage === 'D')
                            && <React.Fragment>
                                {pageD.step === 0 && searchPlayer === null
                                        && <div className="addWanted">
                                            <div className="addWanted-title">
                                                Объявить в розыск
                                            </div>
                                            <div className="addWanted-text">
                                                  Офицеры и сержанты! Будьте внимательнее при объявлении
                                                  в розыск человека/преступника.
                                                  Введя не верные или ложные данные, может пострадать
                                                  невинный гражданин штата San
                                                  Andreas.
                                            </div>
                                            <div className="row">
                                                <div className="column">
                                                    <ul>
                                                        <li>
                                                            <button
                                                                onClick={() => this.handleOnClickED(1)}
                                                                type="button"
                                                            >
                                                            По имени и фамилии
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                onClick={() => this.handleOnClickED(2)}
                                                                type="button"
                                                            >
                                                            По номеру паспорта
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <button
                                                className="back"
                                                onClick={() => this.handleClickReturnD(
                                                    'pageD',
                                                    pageD.step
                                                )}
                                                type="button"
                                            >
                                                Назад
                                            </button>
                                        </div>
                                }
                                {pageD.step === 1 && searchPlayer === null
                                        && <div className="addWanted">
                                            <div className="addWanted-title">
                                                Объявить в розыск
                                            </div>
                                            <div className="addWanted-text">
                                                  Офицеры и сержанты! Будьте внимательнее при объявлении
                                                  в розыск человека/преступника.
                                                  Введя не верные или ложные данные, может пострадать
                                                  невинный гражданин штата San
                                                  Andreas.
                                            </div>
                                            <form>
                                                <label htmlFor="name">
                                                    <div>Имя:</div>
                                                    <input
                                                        name="name"
                                                        id="name"
                                                        value={name}
                                                        onChange={this.onChange}
                                                    />
                                                </label>
                                                <label htmlFor="surname">
                                                    <div>Фамилия:</div>
                                                    <input
                                                        name="surname"
                                                        id="surname"
                                                        value={surname}
                                                        onChange={this.onChange}
                                                    />
                                                </label>
                                                <button
                                                    onClick={this.sendSearchPlayer}
                                                    type="button"
                                                >
                                                  Найти информацию
                                                </button>
                                            </form>
                                            <button
                                                className="back"
                                                onClick={() => this.handleClickReturnD(
                                                    'pageD',
                                                    pageD.step
                                                )}
                                                type="button"
                                            >
                                                Назад
                                            </button>
                                        </div>
                                }
                                {pageD.step === 2 && searchPlayer === null
                                        && <div className="addWanted">
                                            <div className="addWanted-title">
                                                Объявить в розыск
                                            </div>
                                            <div className="addWanted-text">
                                                  Офицеры и сержанты! Будьте внимательнее при объявлении
                                                  в розыск человека/преступника.
                                                  Введя не верные или ложные данные, может пострадать
                                                  невинный гражданин штата San
                                                  Andreas.
                                            </div>
                                            <form>
                                                <label htmlFor="playerId">
                                                    <div>Номер паспорта:</div>
                                                    <input
                                                        maxLength="6"
                                                        id="playerId"
                                                        name="playerId"
                                                        value={playerId}
                                                        onChange={this.onChange}
                                                        onKeyPress={this.isNumber}
                                                    />
                                                </label>
                                                <button
                                                    onClick={this.sendSearchPlayer}
                                                    type="button"
                                                >
                                                    Найти информацию
                                                </button>
                                            </form>
                                            <button
                                                className="back"
                                                onClick={() => this.handleClickReturnD(
                                                    'pageD',
                                                    pageD.step
                                                )}
                                                type="button"
                                            >
                                                Назад
                                            </button>
                                        </div>
                                }
                                {pageD.step === 3 && searchPlayer !== null
                                        && <div className="addWanted">
                                            <div className="addWanted-title">
                                                Объявить в розыск
                                            </div>
                                            <div className="addWanted-text">
                                                 Введите данные
                                            </div>
                                            <form>
                                                <label htmlFor="stars">
                                                    <div>Звезд:</div>
                                                    <input
                                                        maxLength="1"
                                                        name="stars"
                                                        id="stars"
                                                        value={stars}
                                                        onKeyPress={this.isNumber}
                                                        onChange={this.onChange}
                                                    />
                                                </label>
                                                <button
                                                    onClick={this.giveWanted}
                                                    type="button"
                                                >
                                                    Объявить в розыск
                                                </button>
                                            </form>
                                            <button
                                                className="back"
                                                onClick={() => this.handleClickReturnD(
                                                    'pageD',
                                                    pageD.step
                                                )}
                                                type="button"
                                            >
                                                Назад
                                            </button>
                                        </div>
                                }
                            </React.Fragment>
                        }
                        {(PDPage === 'E')
                            && <React.Fragment>
                                {pageE.step === 0 && searchPlayer === null
                                        && <div className="addWanted">
                                            <div className="addWanted-title">
                                                Выписать штраф
                                            </div>
                                            <div className="addWanted-text">
                                                Офицеры и сержанты! Будьте внимательнее при
                                                выписки штрафа на человека. Введя не верные или
                                                ложные данные, может пострадать невинный гражданин штата San
                                                Andreas.
                                            </div>
                                            <div className="row">
                                                <div className="column">
                                                    <ul>
                                                        <li>
                                                            <button
                                                                onClick={() => this.handleOnClickE(1)}
                                                                type="button"
                                                            >
                                                            По имени и фамилии
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                onClick={() => this.handleOnClickE(2)}
                                                                type="button"
                                                            >
                                                            По номеру паспорта
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <button
                                                className="back"
                                                onClick={() => this.handleClickReturnE(
                                                    'pageE',
                                                    pageE.step
                                                )}
                                                type="button"
                                            >
                                                Назад
                                            </button>
                                        </div>
                                }
                                {pageE.step === 1 && searchPlayer === null
                                        && <div className="addWanted">
                                            <div className="addWanted-title">
                                                Выписать штраф
                                            </div>
                                            <div className="addWanted-text">
                                                Офицеры и сержанты! Будьте внимательнее при
                                                выписки штрафа на человека. Введя не верные или
                                                ложные данные, может пострадать невинный гражданин штата San
                                                Andreas.
                                            </div>
                                            <form>
                                                <label htmlFor="name">
                                                    <div>Имя:</div>
                                                    <input
                                                        name="name"
                                                        id="name"
                                                        value={name}
                                                        onChange={this.onChange}
                                                    />
                                                </label>
                                                <label htmlFor="surname">
                                                    <div>Фамилия:</div>
                                                    <input
                                                        name="surname"
                                                        id="surname"
                                                        value={surname}
                                                        onChange={this.onChange}
                                                    />
                                                </label>
                                                <button
                                                    onClick={this.sendSearchPlayer}
                                                    type="button"
                                                >
                                                  Найти информацию
                                                </button>
                                            </form>
                                            <button
                                                className="back"
                                                onClick={() => this.handleClickReturnE(
                                                    'pageE',
                                                    pageE.step
                                                )}
                                                type="button"
                                            >
                                                Назад
                                            </button>
                                        </div>
                                }
                                {pageE.step === 2 && searchPlayer === null
                                        && <div className="addWanted">
                                            <div className="addWanted-title">
                                                Выписать штраф
                                            </div>
                                            <div className="addWanted-text">
                                                Офицеры и сержанты! Будьте внимательнее при
                                                выписки штрафа на человека. Введя не верные или
                                                ложные данные, может пострадать невинный гражданин штата San
                                                Andreas.
                                            </div>
                                            <form>
                                                <label htmlFor="playerId">
                                                    <div>Номер паспорта:</div>
                                                    <input
                                                        maxLength="6"
                                                        id="playerId"
                                                        name="playerId"
                                                        value={playerId}
                                                        onChange={this.onChange}
                                                        onKeyPress={this.isNumber}
                                                    />
                                                </label>
                                                <button
                                                    onClick={this.sendSearchPlayer}
                                                    type="button"
                                                >
                                                    Найти информацию
                                                </button>
                                            </form>
                                            <button
                                                className="back"
                                                onClick={() => this.handleClickReturnE(
                                                    'pageE',
                                                    pageE.step
                                                )}
                                                type="button"
                                            >
                                                Назад
                                            </button>
                                        </div>
                                }
                                {pageE.step === 3 && searchPlayer !== null
                                        && <div className="addWanted">
                                            <div className="addWanted-title">
                                                Выписать штраф
                                            </div>
                                            <div className="addWanted-text">
                                                 Введите данные
                                            </div>
                                            <form>
                                                <label htmlFor="reason">
                                                    <div>Причина:</div>
                                                    <input
                                                        maxLength="16"
                                                        name="reason"
                                                        id="reason"
                                                        value={reason}
                                                        onChange={this.onChange}
                                                    />
                                                </label>
                                                <label htmlFor="summ">
                                                    <div>Сумма:</div>
                                                    <input
                                                        maxLength="8"
                                                        name="summ"
                                                        id="summ"
                                                        value={summ}
                                                        onChange={this.onChange}
                                                        onKeyPress={this.isNumber}
                                                    />
                                                </label>
                                                <button
                                                    onClick={this.giveFine}
                                                    type="button"
                                                >
                                                    Выписать штраф
                                                </button>
                                            </form>
                                            <button
                                                className="back"
                                                onClick={() => this.handleClickReturnE(
                                                    'pageE',
                                                    pageE.step
                                                )}
                                                type="button"
                                            >
                                                Назад
                                            </button>
                                        </div>
                                }
                            </React.Fragment>
                        }
                        {(PDPage === 'F')
                                && <div className="help">
                                    <div className="help-title">
                                        Запросить помощь
                                    </div>
                                    <div className="help-list">
                                        <button
                                            onClick={() => this.callHelp('callFibHelp')}
                                            type="button"
                                        >
                                        Ближайший экипаж FIB
                                        </button>
                                        <button
                                            onClick={() => this.callHelp('callTeamHelp')}
                                            type="button"
                                        >
                                        Наряд полиции
                                        </button>
                                        <button
                                            onClick={() => this.callHelp('callHospitalHelp')}
                                            type="button"
                                        >
                                            Наряд медиков
                                        </button>
                                    </div>
                                    <div className="help-text">
                                        Использование экстренной связи, даст возможность мгновенно
                                        выслать координаты вашего места нахождения ближайшему
                                        патрульному экипажу с сигналом “SOS”
                                    </div>
                                    <button
                                        className="back"
                                        onClick={() => this.handleOnClickD('A', 'page')}
                                        type="button"
                                    >
                                        Назад
                                    </button>
                                </div>

                        }
                        {(PDPage === 'G')
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
                                            onClick={() => {
                                                // !********************
                                            }}
                                            type="button"
                                            className="gps"
                                        >
                                            Проложить путь в GPS
                                        </button>
                                        <button
                                            className="back"
                                            onClick={() => this.handleOnClickD('A', 'page')}
                                            type="button"
                                        >
                                            Назад
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
        )
    }
}
export default PoliceTablet
