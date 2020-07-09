import React from 'react';
import { connect } from 'react-redux';

import '../../assets/css/autoSaloon.css';

class BuyCar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            titleText: "Car Dealer",
            basicText: "Main characteristics",
            fullText: "Full specifications",
            panelOptionsText: "vehicle purchase panel",
            colorText: "color selection",
            speedText: "Speed",
            accelerationText: "Acceleration",
            brakingText: "Braking",
            clutchText: "Controllability",
            closeText: "Close",
            id: 0,
            catalogData: null,
            colorSelect: null,
            selectCarId: null,
            selectCarData: null,
            selectCarParam: {
                maxSpeed: 0, 
                braking: 0, 
                acceleration: 0, 
                controllability: 0
            },
            infoShow: false,
            insuranceBtn: false,
            colorBtn: false,
            fullOptBtn: false,
            selectColor: null,
            selectSolorData: { 
                sqlId: 144, 
                color: '' 
            },
            insurancePrice: 0,
            colorPrice: 0,
            summPrice: 0,
            dim: 0,
            buyed: null,
            bizId: 0,
            buyCarMenu: false
        };

        this.selectCarFnc = this.selectCarFnc.bind(this);
        this.fncColorSelect = this.fncColorSelect.bind(this);
        this.switchInsuranceFnc = this.switchInsuranceFnc.bind(this);
        this.switchColorFnc = this.switchColorFnc.bind(this);
        this.buyCar = this.buyCar.bind(this);
        this.testDriveFnc = this.testDriveFnc.bind(this);
        this.switchFullOptFnc = this.switchFullOptFnc.bind(this);
        this.exit = this.exit.bind(this);
    };

    selectCarFnc(car) {
        var price = car.price;
        var Id = car.sqlId;
        this.setState({ selectCarData: car });
        this.setState({ insurancePrice: price * 0.30 });
        this.setState({ colorPrice: price * 0.03 });
        this.setState({ summPrice: price });
        this.setState({ insuranceBtn: false });
        this.setState({ colorBtn: false });
        this.setState({ selectColor: null });
        this.setState({ selectSolorData: { sqlId: 144, color: '' } });

        var showColor = document.getElementById("colorBlock");
        var showColorHead = document.getElementById("colorBlockHead");

        this.setState({ buyed: car.buyed });

        this.setState({ selectCarId: Id });
        this.setState({ infoShow: true });

        showColor.style.display = "none";
        showColorHead.style.display = "none";
        
        var showInfo = document.getElementById("showInfo");
        var showOpti = document.getElementById("showOpti");
        showInfo.style.display = "block";
        showOpti.style.display = "block";
        
        alt.emit("autoSaloon.showCar", JSON.stringify(car), this.state.dim);
    }

    fncColorSelect(id) {
        for (let i = 0; i < this.state.colorSelect.length; i++) {
            if (this.state.colorSelect[i].sqlId === id+1) {
                if (this.state.colorBtn === true) {
                    this.setState({ selectColor: id });
                    var colorSelect = this.state.colorSelect[i];
                    this.setState({ selectSolorData: colorSelect });
                    alt.emit("autoSaloon.updateColor", JSON.stringify(colorSelect));
                }
            }
        }  
    }

    switchInsuranceFnc() {
        var summ = this.state.selectCarData.price;

        var summPrice;

        if(this.state.insuranceBtn === false) {
            this.setState({ insuranceBtn: true });
            
            if(this.state.colorBtn === true) {
                var summPrice = summ + this.state.insurancePrice + this.state.colorPrice;
                this.setState({ summPrice: summPrice });
            }

            if(this.state.colorBtn === false) {
                var summPrice = summ + this.state.insurancePrice;
                this.setState({ summPrice: summPrice });
            }
        } else {
            this.setState({ insuranceBtn: false });
            this.setState({ summPrice: summPrice });

            
            if(this.state.colorBtn === true) {
                var summPrice = summ + this.state.colorPrice;
                this.setState({ summPrice: summPrice });
            }

            if(this.state.colorBtn === false) {
                var summPrice = summ;
                this.setState({ summPrice: summPrice });
            }
        }
    }

    switchColorFnc() {
        var summ = this.state.selectCarData.price;
        var colorPrice;

        var showColor = document.getElementById("colorBlock");
        var showColorHead = document.getElementById("colorBlockHead");

        if(this.state.colorBtn === false) {
            this.setState({ colorBtn: true });
            this.setState({ summPrice: summ });

            if(this.state.insuranceBtn === true) {
                colorPrice = summ + this.state.insurancePrice + this.state.colorPrice;
                this.setState({ summPrice: colorPrice });
            }
    
            if(this.state.insuranceBtn === false) {
                colorPrice = summ + this.state.colorPrice;
                this.setState({ summPrice: colorPrice });
            }

            showColor.style.display = "block";
            showColorHead.style.display = "block";
        } else {
            this.setState({ colorBtn: false });
            this.setState({ summPrice: summ });
            this.setState({ selectSolorData: { sqlId: 144, color: '' } });

            alt.emit("autoSaloon.updateColor", JSON.stringify({ sqlId: 144, color: '' }));
                
            if(this.state.insuranceBtn === false) {
                colorPrice = summ;
            }

            if(this.state.insuranceBtn === true) {
                colorPrice = summ + this.state.insurancePrice;
                this.setState({ summPrice: colorPrice });
            }

            showColor.style.display = "none";
            showColorHead.style.display = "none";
        }
    }

    buyCar() {
        const obj = { model: this.state.selectCarData.model, id: this.state.selectCarData.sqlId, color: this.state.selectSolorData, price: this.state.summPrice, bizId: this.state.bizId };

        var showInfo = document.getElementById("showInfo");
        var showOpti = document.getElementById("showOpti");
        showInfo.style.display = "none";
        showOpti.style.display = "none";

        alt.emit("events.emitServer", "autoSaloon.buyNewCar", JSON.stringify(obj));
        alt.emit("events.emitServer", "autoSaloon.exit");  
        alt.emit("autoSaloon.deleteVehicle");
        alt.emit("autoSaloon.setStatusMenu", false);
        alt.emit("autoSaloon.destroyCam");

        this.setState({ bizId: 0 });
        this.setState({ selectCarData: null });
        this.setState({ insurancePrice: null });
        this.setState({ colorPrice: null });
        this.setState({ summPrice: null });
        this.setState({ insuranceBtn: false });
        this.setState({ colorBtn: false });
        this.setState({ selectColor: null });
        this.setState({ catalogData: null });
        this.setState({ colorSelect: null });
        this.setState({ selectCarId: null });
        this.setState({ infoShow: null });
        this.setState({ selectCarParam: {maxSpeed: 0, braking: 0, acceleration: 0, controllability: 0} });
        this.setState({ dim: 0 });
        this.setState({ id: 0 });
        this.setState({ selectSolorData: { sqlId: 144, color: '' } });
    }

    exit() {
        var showInfo = document.getElementById("showInfo");
        var showOpti = document.getElementById("showOpti");
        showInfo.style.display = "none";
        showOpti.style.display = "none";

        alt.emit("events.emitServer", "autoSaloon.exit");  
        alt.emit("autoSaloon.deleteVehicle");
        alt.emit("autoSaloon.setStatusMenu", false);
        alt.emit("autoSaloon.destroyCam");

        this.setState({ bizId: 0 });
        this.setState({ selectCarData: null });
        this.setState({ insurancePrice: null });
        this.setState({ colorPrice: null });
        this.setState({ summPrice: null });
        this.setState({ insuranceBtn: false });
        this.setState({ colorBtn: false });
        this.setState({ selectColor: null });
        this.setState({ catalogData: null });
        this.setState({ colorSelect: null });
        this.setState({ selectCarId: null });
        this.setState({ infoShow: null });
        this.setState({ selectCarParam: {maxSpeed: 0, braking: 0, acceleration: 0, controllability: 0} });
        this.setState({ dim: 0 });
        this.setState({ id: 0 });
        this.setState({ selectSolorData: { sqlId: 144, color: '' } });
    }

    testDriveFnc() {
        const obj = { model: this.state.selectCarData.model, id: this.state.selectCarData.sqlId, color: this.state.selectSolorData, bizId: this.state.bizId };
        alt.emit("events.emitServer", "autoSaloon.startTestDrive", JSON.stringify(obj));
        alt.emit("autoSaloon.destroyCam");
    }

    switchFullOptFnc() {
        var fullOpt = document.getElementById("fullOpt");
        if(this.state.fullOptBtn) {
            this.setState({ fullOptBtn: false });
            fullOpt.style.display = "none";
        } else {
            this.setState({ fullOptBtn: true });
            fullOpt.style.display = "block";
        }
    }
    

    componentDidMount() {
        alt.on("autoSaloon", (event, options) => {
            if (event === 'selectCarParam') {
                this.setState({ selectCarParam: options });
            } else if (event === 'catalogData') {
                this.setState({ catalogData: options });
                this.selectCarFnc(options[0]);
            } else if (event === 'colorSelect') {
                this.setState({ colorSelect: options });
            } else if (event === 'enable') {
                window.autoSaloon.enable(options);
                window.playerMenu.enable(!options);
                window.chatAPI.enable(!options);
                window.inventoryAPI.enable(!options);
                window.hudControl.enable(!options);

                alt.emit(`Cursor::show`, options);
                alt.emit('autoSaloon.setActive', options);
                alt.emit('setBlockControl', options);
            } else if(event === 'dim') {
                this.setState({ dim: options });
            } else if(event === 'bizId') {
                this.setState({ bizId: options });
            }
        });

        window.autoSaloon = {
            enable: (enable) => {
                if (enable === true) {
                    if (this.state.selectCarData !== null) {
                        this.selectCarFnc(this.state.selectCarData);
                    }
                    this.setState({ buyCarMenu: true });
                } else {
                    this.setState({ buyCarMenu: false });
                }
            },
            active: () => {
                return this.state.buyCarMenu;
            }
        };
    }
 
    render() {
        return (
            <div id="carsBlock" style={this.state.buyCarMenu === false ? {display: 'none'} : {display: 'block'}}>
                <div className="carsBlock">
                    <div className="headBlock">{this.state.titleText}</div>
                    <div className="selectCar" id="selectCar">
                        <div className="listCars">
                            <ul>
                                {this.state.catalogData !== null ?
                                this.state.catalogData.map(item => (
                                item.buyed < item.max ?
                                <li className={this.state.selectCarId === item.sqlId ? 'catalogItem selectedCar': 'catalogItem'} onClick={() => this.selectCarFnc(item)}>
                                    <img src={require('../../assets/img/autoSaloon/brends/1.png')}/>
                                    <div className={'modelCar'}>{item.title}</div>
                                    <div style={{clear: 'both'}}></div>
                                </li> : null)) : null}
                                <div style={{clear: 'both'}}></div>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="infoBlock" id="showInfo">
                    <div className="headBlock">{this.state.basicText}</div>
                    <div className="baseCar">
                        <p>{this.state.speedText}</p>
                            <div className="paramsCar">
                                {this.state.selectCarParam.maxSpeed >= 20 ? <div className="paramVal valTrue"></div> : null}
                                {this.state.selectCarParam.maxSpeed >= 40 ? <div className="paramVal valTrue"></div> : null}
                                {this.state.selectCarParam.maxSpeed >= 50 ? <div className="paramVal valTrue"></div> : null}
                                {this.state.selectCarParam.maxSpeed >= 60 ? <div className="paramVal valTrue"></div> : null}
                                {this.state.selectCarParam.maxSpeed >= 70 ? <div className="paramVal valTrue"></div> : null}
                                {this.state.selectCarParam.maxSpeed < 20 ? <div className="paramVal valFalse"></div> : null}
                                {this.state.selectCarParam.maxSpeed < 40 ? <div className="paramVal valFalse"></div> : null}
                                {this.state.selectCarParam.maxSpeed < 50 ? <div className="paramVal valFalse"></div> : null}
                                {this.state.selectCarParam.maxSpeed < 60 ? <div className="paramVal valFalse"></div> : null}
                                {this.state.selectCarParam.maxSpeed < 70 ? <div className="paramVal valFalse"></div> : null}
                                <div style={{clear: 'both'}}></div>
                            </div>
                        <p>{this.state.accelerationText}</p>
                            <div className="paramsCar">
                                {this.state.selectCarParam.acceleration >= 20 ? <div className="paramVal valTrue"></div> : null}
                                {this.state.selectCarParam.acceleration >= 40 ? <div className="paramVal valTrue"></div> : null}
                                {this.state.selectCarParam.acceleration >= 60 ? <div className="paramVal valTrue"></div> : null}
                                {this.state.selectCarParam.acceleration >= 80 ? <div className="paramVal valTrue"></div> : null}
                                {this.state.selectCarParam.acceleration >= 100 ? <div className="paramVal valTrue"></div> : null}
                                {this.state.selectCarParam.acceleration < 20 ? <div className="paramVal valFalse"></div> : null}
                                {this.state.selectCarParam.acceleration < 40 ? <div className="paramVal valFalse"></div> : null}
                                {this.state.selectCarParam.acceleration < 60 ? <div className="paramVal valFalse"></div> : null}
                                {this.state.selectCarParam.acceleration < 80 ? <div className="paramVal valFalse"></div> : null}
                                {this.state.selectCarParam.acceleration < 100 ? <div className="paramVal valFalse"></div> : null}
                                <div style={{clear: 'both'}}></div>
                            </div>
                        <p>{this.state.brakingText}</p>
                            <div className="paramsCar">
                                {this.state.selectCarParam.braking >= 20 ? <div className="paramVal valTrue"></div> : null}
                                {this.state.selectCarParam.braking >= 40 ? <div className="paramVal valTrue"></div> : null}
                                {this.state.selectCarParam.braking >= 60 ? <div className="paramVal valTrue"></div> : null}
                                {this.state.selectCarParam.braking >= 80 ? <div className="paramVal valTrue"></div> : null}
                                {this.state.selectCarParam.braking >= 100 ? <div className="paramVal valTrue"></div> : null}
                                {this.state.selectCarParam.braking < 20 ? <div className="paramVal valFalse"></div> : null}
                                {this.state.selectCarParam.braking < 40 ? <div className="paramVal valFalse"></div> : null}
                                {this.state.selectCarParam.braking < 60 ? <div className="paramVal valFalse"></div> : null}
                                {this.state.selectCarParam.braking < 80 ? <div className="paramVal valFalse"></div> : null}
                                {this.state.selectCarParam.braking < 100 ? <div className="paramVal valFalse"></div> : null}
                                <div style={{clear: 'both'}}></div>
                            </div>
                        <p>{this.state.clutchText}</p>
                            <div className="paramsCar">
                                {this.state.selectCarParam.controllability >= 1 ? <div className="paramVal valTrue"></div> : null}
                                {this.state.selectCarParam.controllability >= 2 ? <div className="paramVal valTrue"></div> : null}
                                {this.state.selectCarParam.controllability >= 3 ? <div className="paramVal valTrue"></div> : null}
                                {this.state.selectCarParam.controllability >= 4 ? <div className="paramVal valTrue"></div> : null}
                                {this.state.selectCarParam.controllability >= 5 ? <div className="paramVal valTrue"></div> : null}
                                {this.state.selectCarParam.controllability < 1 ? <div className="paramVal valFalse"></div> : null}
                                {this.state.selectCarParam.controllability < 2 ? <div className="paramVal valFalse"></div> : null}
                                {this.state.selectCarParam.controllability < 3 ? <div className="paramVal valFalse"></div> : null}
                                {this.state.selectCarParam.controllability < 4 ? <div className="paramVal valFalse"></div> : null}
                                {this.state.selectCarParam.controllability < 5 ? <div className="paramVal valFalse"></div> : null}
                                <div style={{clear: 'both'}}></div>
                            </div>
                    </div>
                    <div className="headBlock" onClick={() => this.switchFullOptFnc()}>{this.state.fullText} 
                        {this.state.fullOptBtn ? <img src={require('../../assets/img/autoSaloon/infoOpen.png')}/> : <img src={require('../../assets/img/autoSaloon/infoClose.png')}/>}
                    </div>
                    {this.state.selectCarData !== null ?
                    <div className="fullOptCar" id="fullOpt">
                        <p>Brand: <b> {this.state.selectCarData.title}</b></p>
                        <br/>
                        <p>Capacity: <b>{this.state.selectCarParam.maxPassagersCar}</b></p>
                        <br/>
                        <p>Speed: <b>{this.state.selectCarParam.maxSpeedKm} km / h</b></p>
                        <p>Acceleration: <b>{this.state.selectCarParam.acceleration}</b></p>
                        <p>Braking: <b>{this.state.selectCarParam.braking}</b></p>
                        <p>Clutch: <b>{this.state.selectCarParam.controllability}</b></p>
                        <br/>
                        <p>Volume of the tank: <b>{this.state.selectCarData.fuelTank} л.</b></p>
                        <p>Consumption: <b>{this.state.selectCarData.fuelRate} л.</b></p>
                    </div> : null}
                </div>
                <div className="optionBlock" id="showOpti">
                    <div className="headBlock">{this.state.panelOptionsText}</div>
                    <div style={{clear: 'both'}}></div>
                    
                    <div className="buyCarOptions">
                        <div className="optionCar">
                            Insurance: {parseInt(this.state.insurancePrice)}$
                            <div className="btnOption">
                                <div className={this.state.insuranceBtn === false ? 'off' : 'on'} id="btnInsurance"></div>
                            </div>
                        </div>

                        <div style={{clear: 'both'}}></div>

                        <div className="optionCar">
                            New color: {parseInt(this.state.colorPrice)}$
                            <div className="btnOption">
                                <div className={this.state.colorBtn === false ? 'off' : 'on'} id="btnColor" onClick={() => this.switchColorFnc()}></div>
                            </div>
                        </div>

                        <div style={{clear: 'both'}}></div>
                        
                        <div className="summInfo">
                            <p>Total: {parseInt(this.state.summPrice)}$</p>
                            <div className="btnBuyCar" onClick={() => this.buyCar()}>Buy</div>
                        </div>
                    </div>

                    <div className="btnBlock" id="colorBlockHead" style={{display: 'none'}}>
                        <div className="border"></div>
                        <div className="textBtn">{this.state.colorText}</div>
                    </div>

                    <div style={{clear: 'both'}}></div>
                    
                    <div className="selectColorBlock" id="colorBlock" style={{display: 'none'}}>
                        {this.state.colorSelect != null ?
                        this.state.colorSelect.map(item => (
                            <div className={this.state.selectColor === item.sqlId - 1 ? 'selectColor' : 'color'} style={{backgroundColor: '#' + item.gameColor}} onClick={() => this.fncColorSelect(item.sqlId - 1)}></div>
                        )) : null}
                    </div>
                    
                    <div className="btnBlock" onClick={() => this.testDriveFnc()}>
                        <div className="border"></div>
                        <div className="textBtn">Test Drive</div>
                    </div>

                    <div className="btnBlock" onClick={() => this.exit()}>
                        <div className="border"></div>
                        <div className="textBtn">Log off</div>
                    </div>

                    <div style={{clear: 'both'}}></div>
                </div>
            </div>
        );
    }
}

       
function mapStateToProps(state) {
    return {
        
    };
}

const connectedApp = connect(mapStateToProps)(BuyCar);
export { connectedApp as BuyCar };