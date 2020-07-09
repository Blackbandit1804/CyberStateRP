import React from 'react';
import { connect } from 'react-redux';

import Clock from 'react-live-clock';

import '../../assets/css/bandTablet.css';
import '../../assets/css/vagos.css';
import '../../assets/css/ballas.css';
import '../../assets/css/familly.css';
import '../../assets/css/marabunta.css';

class BandTablet extends React.Component { 
    constructor(props) {
        super(props);

        this.state = {
            Page: 0
        };

        this.changePage = this.changePage.bind(this);
        this._handleKeyDown = this._handleKeyDown.bind(this);
    }

    _handleKeyDown = (event) => {
        switch(event.which) {
            case 113:
                if(window.clientStorage.faction === 9 || window.clientStorage.faction === 10 || window.clientStorage.faction === 11 || window.clientStorage.faction === 12 || window.clientStorage.faction === 13) {
                    //console.log("open tablet");
                    const { showTablet } = this.state;
                    if (window.medicTablet.active() || window.sheriffTablet.active() || window.armyTablet.active() || window.fibTablet.active() || window.inventoryAPI.active() || window.playerMenu.active() || window.modalAPI.active() || window.chatAPI.active() || window.tradeAPI.active() || window.documentsAPI.active()) return;
                    if(showTablet === false) {
                        if (mp) mp.trigger(`toBlur`, 200);
                        mp.invoke('focus', true);
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

    changePage(page) {
        this.setState({ Page: page });
    }

    componentDidMount() {
        window.bandTablet = {
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
            }
        };
    }

    render() {

        var name;
        var template;

        var bands = [
            {
                name: "Families",
                template: "famillyPad"
            },
            {
                name: "Ballas",
                template: "ballasPad"
            },
            {
                name: "Vagos",
                template: "vagosPad"
            },
            {
                name: "Marabunta",
                template: "marabPad"
            }
        ];

        window.clientStorage.faction = 9;

        if(window.clientStorage.faction) {
            if (window.clientStorage.faction === 9) {
                name = bands[0].name;
                template = bands[0].template;
            } else if (window.clientStorage.faction === 10) {
                name = bands[1].name;
                template = bands[1].template;
            } else if (window.clientStorage.faction === 12) {
                name = bands[2].name;
                template = bands[2].template;
            } else if (window.clientStorage.faction === 13) {
                name = bands[3].name;
                template = bands[3].template;
            }
        }

        return (
            <React.Fragment>
            <div className="gangWrap" style={{display: this.state.showTablet === true ? 'block' : 'none'}}>
                <div className="gangPad">
                    <div className={"padBox " + template}>
                        <div className="menuWrap">
                            {this.state.Page === 0 ?
                            <div className="mainPad">
                                <div className="headMainPad">
                                    <div className="left">Home</div>
                                    <div className="right">
                                        <img src={require('../../assets/img/bandTablet/antena.png')}/><Clock format={'HH:mm'} ticking={true} timezone={'Europe/Berlin'} />
                                    </div>
                                    <div style={{clear: 'both'}}></div>
                                </div>
                                
                                <div className="padBtnRow firRow">
                                    <div className="btn btnChat" onClick={() => this.changePage()}><p>Chat {name}</p></div>
                                    <div className="btn btnCar" onClick={() => this.changePage()}><p>Cars {name}</p></div>
                                </div>
                                <div className="padBtnRow secRow">
                                    <div className="btn btnList" onClick={() => this.changePage(1)}>
                                        <p className="textSostav">Composition management</p> 
                                        <p className="countOnline">290</p>
                                        <p  className="textOnline">online</p> 
                                    </div>
                                    <div className="btn btnMap" onClick={() => this.changePage(4)}><p>Map</p></div>
                                </div>
                                <div className="padBtnRow treRow">
                                    <div className="btn btnGBank" onClick={() => this.changePage(3)}>
                                        <p className="textGangBank">Common house</p>
                                        <p className="sumGangBank">1.997.035 $</p>
                                    </div>
                                    <div className="btn btnLester" onClick={() => this.changePage(2)}><p>Leicester</p></div>
                                </div>
                                
                            </div> : null}
                            {this.state.Page === 1 ?
                            <div className="gangList">
                                <div className="headMainPad">
                                    <div className="left">Chat </div>
                                    <div className="right">
                                        <img src={require('../../assets/img/bandTablet/antena.png')}/><Clock format={'HH:mm'} ticking={true} timezone={'Europe/Berlin'} />
                                    </div>
                                    <div style={{clear: 'both'}}></div>
                                </div>
                                
                                <div className="backBtn" onClick={() => this.changePage(0)}>
                                    <img src={require('../../assets/img/bandTablet/backBtn.png')}/>
                                </div>
                                
                                <div className="contentList">
                                    <div className="headerList">
                                        <div className="leftRow">First Name Last Name</div>
                                        <div className="rightRow">Chased</div>
                                    </div>
                                    <div className="gangPlayerList">
                                        <div className="playerNameRow">
                                            <div className="name">1. ILYa GILFANOV</div>
                                            <div className="streetName">НЕГаР</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="footerBtn">
                                    <div className="footBtnP">Boost</div>
                                    <div className="footBtnP">Lower</div>
                                    <div className="footBtnP">Kick out</div>
                                    <div className="footBtnB">Into a black list</div>
                                </div>
                            </div>  : null}
                            {this.state.Page === 2 ?
                            <div className="lesterOptions">
                                <div className="headMainPad">
                                    <div className="left">Leicester</div>
                                    <div className="right">
                                        <img src={require('../../assets/img/bandTablet/antena.png')}/><Clock format={'HH:mm'} ticking={true} timezone={'Europe/Berlin'} />
                                    </div>
                                    <div style={{clear: 'both'}}></div>
                                </div>
                                
                                <div className="backBtn" onClick={() => this.changePage(0)}>
                                    <img src={require('../../assets/img/bandTablet/backBtn.png')}/>
                                </div>
                                
                                <div className="contentList">
                                    <div className="headerList">
                                        <div className="leftRow">Opportunities</div>
                                        <div className="rightRow">Cost $</div>
                                    </div>
                                    <div className="gangLesterOpt">
                                        <div className="lesterNameRow"><div className="option">Remove wanted</div><div className="price">1500$</div></div>
                                        <div className="lesterNameRow selectRow"><div className="option">Reduce Prison Term</div><div className="price">2500$</div></div>
                                    </div>
                                </div>

                                <div className="footerBtn">
                                    <div className="footBtnP">Request</div>
                                </div>
                            </div> : null}
                            {this.state.Page === 3 ?
                            <div className="gangBankInfo">
                                <div className="headMainPad">
                                    <div className="left">Common Ballas</div>
                                    <div className="right"><img src={require('../../assets/img/bandTablet/antena.png')}/><Clock format={'HH:mm'} ticking={true} timezone={'Europe/Berlin'} /></div>
                                    <div style={{clear: 'both'}}></div>
                                </div>
                                
                                <div className="backBtn" onClick={() => this.changePage(0)}>
                                    <img src={require('../../assets/img/bandTablet/backBtn.png')}/>
                                </div>
                                
                                <div className="contentList">
                                    <div className="headerGangBank">
                                        <div className="titleGBank">TOTAL AMOUNT</div>
                                        <div className="summGBank">1.997.035$</div>
                                        <div className="titleTGBank">OPERATIONS</div>
                                    </div>
                                    <div className="gangBankInfoUse">
                                        <div className="bankTransRow"><div className="name">ILYA GILFANOV <b>Put</b></div><div className="price">1500$</div></div>
                                        <div className="bankTransRow"><div className="name">ILYA GILFANOV <b>Put</b></div><div className="price">1500$</div></div>
                                        <div className="bankTransRow"><div className="name">ILYA GILFANOV <b>Put</b></div><div className="price">1500$</div></div>
                                        <div className="bankTransRow"><div className="name">ILYA GILFANOV <b>Put</b></div><div className="price">1500$</div></div>
                                        <div className="bankTransRow"><div className="name">ILYA GILFANOV <b>Put</b></div><div className="price">1500$</div></div>
                                        <div className="bankTransRow"><div className="name">ILYA GILFANOV <b>Put</b></div><div className="price">1500$</div></div>
                                        <div className="bankTransRow"><div className="name">ILYA GILFANOV <b>Put</b></div><div className="price">1500$</div></div>
                                    </div>
                                </div>
								
                                <div className="footerBtn">
                                    <div className="footBtnP">Put</div>
                                    <div className="footBtnP">Снять</div>
                                </div>
                            </div> : null}
                            {this.state.Page === 4 ?
                            <div className="gangMapInfo">
                                <div className="headMainPad">
                                    <div className="left">Map</div>
                                    <div className="right"><img src={require('../../assets/img/bandTablet/antena.png')}/><Clock format={'HH:mm'} ticking={true} timezone={'Europe/Berlin'} /></div>
                                    <div style={{clear: 'both'}}></div>
                                </div>
                                
                                <div className="backBtn" onClick={() => this.changePage(0)}>
                                    <img src={require('../../assets/img/bandTablet/backBtn.png')}/>
                                </div>
                                
                                <div className="contentMap">
                                    <img src={require('../../assets/img/bandTablet/map.png')}/>
                                </div>
                                
                                <div className="gangZonesCount">Areas under your influence: <b>18</b></div>
                                
                                <div className="mapBtn"><img src={require('../../assets/img/bandTablet/plus.png')}/></div>
                                <div className="mapBtn"><img src={require('../../assets/img/bandTablet/minus.png')}/></div>
                            </div> : null}
                        </div>
                    </div>
                    <div class="padGlass"></div>
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

const connectedLoginPage = connect(mapStateToProps)(BandTablet);
export { connectedLoginPage as BandTablet }; 