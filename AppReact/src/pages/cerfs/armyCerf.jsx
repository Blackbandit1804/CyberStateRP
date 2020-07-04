import React from 'react';
import { connect } from 'react-redux';

import '../../assets/css/armyCerf.css';

class ArmyCerf extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            cerfStatus: false,
            data: {}
        };
        
        this._handleKeyDown = this._handleKeyDown.bind(this);

    }
 
    _handleKeyDown = (event) => {
        switch(event.which) {
            case 69:
                if (window.armyCerf.active()) {
                    window.armyCerf.enable(false);
                }
                break;
            default: 
                break;
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data) {
            this.setState({ data: nextProps.data });
        }
    }

    componentDidMount() {
        window.armyCerf = {
            enable: (enable) => {
                if (enable) {
                    if (mp) mp.trigger(`toBlur`, 200);
                    mp.invoke('focus', true);
                    mp.trigger("setCerfActive", true);
                    this.setState({ cerfStatus: true });
                    window.inventoryAPI.show(false);
                    window.promptAPI.showByName("documents_help", -1);
                    document.addEventListener("keydown", this._handleKeyDown);
                } else {
                    if (mp) mp.trigger(`fromBlur`, 200);
                    mp.invoke('focus', false);
                    mp.trigger("setCerfActive", false);
                    this.setState({ cerfStatus: false }); 
                    window.promptAPI.hide();
                    document.removeEventListener("keydown", this._handleKeyDown);
                }
            },
            active: () => {
                return this.state.cerfStatus;
            },
            changeOptions: (data) => {
                this.setState({ data: data });
            }
        };
    }

    render() {
        const { data, cerfStatus } = this.state;

        return (
            <div id="documentArmy" style={{display: cerfStatus === true ? 'flex' : 'none'}}>
                <div className="content">
                    <div className="header">
                        <div className="imagesPers">
                            <img src={require('../../assets/img/armyCerf/imagesPers.png')}/>
                        </div>
                        <div className="info">
                            <img src={require('../../assets/img/armyCerf/america.png')}/>
                            <div className="fractionName">
                                Army of the <br/>
                                United States of America
                            </div>
                            <ul className="headInfo">
                                <li>
                                    <div className="label">Имя:</div>
                                    <div className="value">{this.state.data.Name}</div>
                                </li>
                                <li>
                                    <div className="label">Ранг:</div>
                                    <div className="value">{window.clientStorage.factionRank}</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <ul className="stats">
                        <li>
                            <div className="label">Звание:</div>
                            <div className="value">{this.state.data.Rank}</div>
                        </li>
                    </ul>
                    <div className="footer">
                        <img src={require('../../assets/img/armyCerf/sim-card-chip.png')}/>
                        <img src={require('../../assets/img/armyCerf/qr_code.png')}/>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
};

const connected = connect(mapStateToProps)(ArmyCerf);
export { connected as ArmyCerf }; 