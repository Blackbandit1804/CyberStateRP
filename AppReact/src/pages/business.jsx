import React from 'react';
import { connect } from 'react-redux';

import '../assets/css/business.css';

class Business extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            Page: 0,
            PageSteps: {
                step: 0
            },
            businessStatus: false
        };
    }

    componentDidMount() {
        window.hudControl = {
            enable: (enable) => {
                if (enable) {
                    this.setState({ businessStatus: true });
                } else {
                    this.setState({ businessStatus: false });
                }
            },
            active: () => {
                return this.state.businessStatus;
            },
            changeOptions: (event, options) => {
            },
        };
    }

    render() {
        return (
            <div id="businessMenu" style={{display: this.state.businessStatus === true ? 'block' : 'none'}}>
                {this.state.Page === 0 ?
                <div class="free">
                    <div class="header">Карточка бизнеса №999 <span id="status" class="green">[Свободно]</span></div>
                    <div class="body">
                        <div class="left">
                            <div class="info">
                                <div class="infoHeader">Основная информация</div><br/>
                                <div class="type"><span class="green">Тип бизнеса:</span> Магазин 24/7</div>
                                <div class="carter"><span class="green">Тип бизнеса:</span> Вайнвуд, грув.</div>
                                <div class="impozit"><span class="green">Ежедневный налог:</span> 1150$.</div>
                            </div>
                            <div class="priceandBuy">
                                <h1>Цена: <span class="green">5.430.000$</span></h1>
                                <div class="fix"><span class="line"></span><button>Купить бизнес</button></div>
                            </div>
                        </div>
                        <div class="right">
                            <img src={require('../assets/img/business/img.png')} style={{width: '370px', height: '300px'}}/>
                            <button><img src={require('../assets/img/business/button icon.png')}/>Выйти из карточки бизнеса</button>
                        </div>
                    </div>
                </div> : null}
                {this.state.Page === 1 ?
                <div class="occupied">
                    <div class="header">Карточка бизнеса №999 <span id="status" class="red">[Занято]</span></div>
                    <div class="body">
                        <div class="left">
                            <div class="info">
                                <div class="infoHeader">Основная информация</div><br/>
                                <div class="type"><span class="red">Тип бизнеса:</span> Магазин 24/7</div>
                                <div class="carter"><span class="red">Тип бизнеса:</span> Вайнвуд, грув.</div>
                                <div class="impozit"><span class="red">Ежедневный налог:</span> 1150$.</div>
                                <div class="impozit"><span class="red">Гос. цена:</span> 5.430.000$.</div>
                            </div>
                            <div class="priceandBuy">
                                <h1>Контролирует</h1>
                                Russian Mafia
                                <img src={require('../assets/img/business/russianmafia_logo.png')}/>
                            </div>
                        </div>
                        <div class="right">
                            <img src={require('../assets/img/business/img.png')} style={{width: '370px', height: '300px'}}/>
                            <button><img src={require('../assets/img/business/button icon.png')}/>Выйти из карточки бизнеса</button>
                        </div>
                    </div>
                </div> : null}
                {this.state.Page === 2 ?
                <div class="businessSettings">
                    <div class="header">Панель управления вашего бизнеса</div>
                    <div class="body">
                        {this.state.PageSteps.step === 0 ?
                        <div class="container">
                            <div><img src={require('../assets/img/business/Заголовок.png')}/></div>
                            <div>
                                <h2>Модернизация</h2>
                                <button>Сигнализация <img src={require('../assets/img/business/Сигнализация.png')}/></button>
                                <button>Вместимость <img src={require('../assets/img/business/Вместимость.png')}/></button>
                            </div>
                            <div class="buttons">
                                <h2>Управления бизнеса</h2>
                                <button><img src={require('../assets/img/business/open-lock.png')}/> Закрыть бизнес</button>
                                <button><img src={require('../assets/img/business//email.png')}/> информация о бизнесе</button>
                                <button><img src={require('../assets/img/business/edit.png')}/> Заменить название бизнеса</button>
                                <button><img src={require('../assets/img/business/cash-register (3).png')}/> Касса</button>
                                <button><img src={require('../assets/img/business/text-documents.png')}/> Доход и расходы</button>
                                <button><img src={require('../assets/img/business/delivery-man.png')}/> Товар</button>
                                <button><img src={require('../assets/img/business/house.png')}/> Продать бизнес государству</button>
                            </div>
                        </div> : null}
                        {this.state.PageSteps.step === 1 ?
                        <div class="container settingss">
                            <div><img src={require('../assets/img/business/Заголовок.png')}/></div>
                            <div>
                                <h2>Модернизация</h2>
                                <button>Сигнализация <img src={require('../assets/img/business/Сигнализация.png')}/></button>
                                <div class="border1" style={{display: 'none'}}></div>
                                <div class="border2" style={{display: 'block'}}></div>
                                <button>Вместимость <img src={require('../assets/img/business/Вместимость.png')}/></button>
                            </div>
                            <div class="buttons">
                                <h2>Управления бизнеса</h2>
                                <button>Купить допольнительный склад</button>
                                <span style={{marginTop: '5px', display: 'flex'}}>
                                    <img src={require('../assets/img/business/checked.png')} style={{marginRight: '3px'}}/>
                                    <button style={{backgroundColor: '#14b654', color: 'white'}}>Склад увеличен на 100%</button>
                                </span>
        
                                <h2>Вместимость</h2>
                                <div class="inform" style={{textAlign: 'center'}}>
                                    <img src={require('../assets/img/business/pallet.png')}/>
                                    <img src={require('../assets/img/business/pallet.png')}/>
                                    <img src={require('../assets/img/business/pallet.png')}/>
                                    <img src={require('../assets/img/business/pallet.png')} style={{opacity: '0.5'}}/>
                                    <img src={require('../assets/img/business/pallet.png')} style={{opacity: '0.5'}}/>
                                </div>
                                <div style={{fontSize: '13px'}}>Поздравляем, вы максимально увеличили свой склад. Теперь вы можете захватить все в бизнес индустрии!</div>
                                <button style={{width: '220px', backgroundColor: '#14b654', color: 'white', position: 'absolute', right: '10px', bottom: '10px'}}>Назад в меню бизнеса</button>
                            </div>
                        </div> : null}
                    </div>
                </div> : null}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {

    };
};

const connected = connect(mapStateToProps)(Business);
export { connected as Business }; 