import React from 'react';
import { connect } from 'react-redux';

import '../../assets/css/sheriffCerf.css';

class PoliceCerf extends React.Component { 
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
                if (window.policeCerf.active()) {
                    window.policeCerf.enable(false);
                }
                break;
            default: 
                break;
        }
    }

    componentDidMount() {
        alt.on(`police`, (data) => {
            this.setState({ data: data });
            window.policeCerf.enable(true);
        });

        window.policeCerf = {
            enable: (enable) => {
                if (enable) {
                    alt.emit(`toBlur`, 200);
                    alt.emit(`Cursor::show`, true);
                    alt.emit("setCerfActive", true);
                    this.setState({ cerfStatus: true });
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
            <div id="LSSDpass" style={cerfStatus === true ? {display: 'block'} : {display: 'none'}}>
                <div className="content">
                    <div className="header">
                        LSPD
                    </div>
                    <ul className="stats">
                        <li>
                            <div className="params">
                                Имя
                            </div>
                            <div className="value">
                                {this.state.data.Name}
                            </div>
                        </li>
                        <li>
                            <div className="params">
                                Пол
                            </div>
                            <div className="value">
                                {this.state.data.Sex === 0 ? 'Женский' : 'Мужской'}
                            </div>
                        </li>
                        <li>
                            <div className="params">
                                Звание
                            </div>
                            <div className="value">
                                {this.state.data.Rank}
                            </div>
                        </li>
                    </ul>
                    <div className="persImages">
                        <img src={require('../../assets/img/sheriffCerf/man.png')}/>
                    </div>
                </div>
                <div className="numberDocs">
                   {this.state.data.ID}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
};

const connected = connect(mapStateToProps)(PoliceCerf);
export { connected as PoliceCerf }; 