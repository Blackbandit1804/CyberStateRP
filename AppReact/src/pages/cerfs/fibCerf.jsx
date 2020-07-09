import React from 'react';
import { connect } from 'react-redux';

import '../../assets/css/fibCerf.css';

class FibCerf extends React.Component { 
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
                if (window.fibCerf.active()) {
                    window.fibCerf.enable(false);
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
        alt.on(`fib`, (data) => {
            this.setState({ data: data });
            window.fibCerf.enable(true);
        });

        window.fibCerf = {
            enable: (enable) => {
                if (enable) {
                    alt.emit(`toBlur`, 200);
                    alt.emit(`Cursor::show`, true);
                    alt.emit("setCerfActive", true);
                    this.setState({ cerfStatus: true });
                    window.inventoryAPI.show(false);
                    window.promptAPI.showByName("documents_help", -1);
                    document.addEventListener("keydown", this._handleKeyDown);
                } else {
                    alt.emit(`fromBlur`, 200);
                    alt.emit(`Cursor::show`, false);
                    alt.emit("setCerfActive", false);
                    this.setState({ cerfStatus: false }); 
                    window.promptAPI.hide();
                    document.removeEventListener("keydown", this._handleKeyDown);
                }
            },
            active: () => {
                return this.state.cerfStatus;
            }
        };
    }

    render() {
        const { data, cerfStatus } = this.state;

        return (
            <div id="fibCerf" style={cerfStatus === true ? {display: 'flex'} : {display: 'none'}}>
                <div className="content">
                    <div className="header">
                        <div className="enText">
                            Federal Investigation Bureau
                        </div>
                        <div className="ruText">
                            Special Agent Certificate
                        </div>
                    </div>
                    <div className="infoBox">
                        <div className="images">
                            <img src={require('../../assets/img/fibCerf/pers.png')}/>
                        </div>
                        <ul className="stats">
                            <li>
                                <div className="params">Floor</div>
                                <div className="value">
                                    {this.state.data.Sex === 0 ? 'Female' : 'Male'}
                                </div>
                            </li>
                            <li>
                                <div className="params">Rank</div>
                                <div className="value">
                                    {this.state.data.Rank}
                                </div>
                            </li>
                        </ul>
                        <div className="persCode">
                            {this.state.data.ID}
                        </div>
                    </div>
                </div>
                <div className="textBox">
                    The employee has the responsibility to prevent and protect the United States from the threats of terrorism and foreign intelligence.
                </div>
            </div>

        );
    }
}

function mapStateToProps(state) {
    return {};
};

const connected = connect(mapStateToProps)(FibCerf);
export { connected as FibCerf }; 