import React from 'react';
import { connect } from 'react-redux';

import '../../assets/css/medicCerf.css';

class MedicCerf extends React.Component { 
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
                if (window.medicCerf.active()) {
                    window.medicCerf.enable(false);
                }
                break;
            default: 
                break;
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.data) {
            this.setState({ data: nextProps.data });
        }
    }

    componentDidMount() {
        alt.on(`medic`, (data) => {
            this.setState({ data: data });
            window.medicCerf.enable(true);
        });

        window.medicCerf = {
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
            },
        };
    }

    render() {
        const { data, cerfStatus } = this.state;

        return (
            <div id="medPass" style={{display: cerfStatus === true ? 'flex' : 'none'}}>
                <div className="images">
                    <img src={require('../../assets/img/medicCerf/man.png')}/>
                </div>
                <div className="statsBlock">
                    <div className="label">Name Surname</div>
                    <div className="value">{data.Name}</div>
                </div>
                <div className="statsBlock">
                        <div className="label">Position</div>
                        <div className="value">{data.Rank}</div>
                    </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        data: state.documents.medic
    };
};

const connected = connect(mapStateToProps)(MedicCerf);
export { connected as MedicCerf }; 