import React from 'react';
import { connect } from 'react-redux';

import '../../assets/css/documents.css';

class Documents extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            cerfStatus: false,
            data: {},
            page: 1,
            playerPage: -1,
            statusPage: "showAll"
        };
        
        this._handleKeyDown = this._handleKeyDown.bind(this);
        this.changePage = this.changePage.bind(this);

    }
 
    _handleKeyDown = (event) => {
        switch(event.which) {
            case 69:
                if (documentsAPI.active()) {
                    documentsAPI.hide();
                }
                break;
            default: 
                break;
        }
    }

    changePage(page) {
        this.setState({ page: page });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data) {
            this.setState({ data: nextProps.data });
        }
    }

    componentDidMount() {
        alt.on(`documents`, (event, enable, data) => {
            if (event === "showPassport") {
                if (enable) {
                    alt.emit('Cursor::show', enable);
                    alt.emit('setBlockControl', enable);
                    alt.emit("setDocumentsActive", enable);
                    this.setState({ cerfStatus: enable });
                    this.setState({ page: 1 });
                    this.setState({ statusPage: "showPassport" });
                    this.setState({ data: data });
                    window.promptAPI.showByName("documents_help", -1);
                    document.addEventListener("keydown", this._handleKeyDown);
                } else {
                    window.documentsAPI.hide();
                }
            } else if (event === "showLicenses") {
                if (enable) {
                    alt.emit('Cursor::show', enable);
                    alt.emit('setBlockControl', enable);
                    alt.emit("setDocumentsActive", enable);
                    this.setState({ cerfStatus: enable });
                    this.setState({ page: 2 });
                    this.setState({ data: data });
                    this.setState({ statusPage: "showLicenses" });
                    window.promptAPI.showByName("documents_help", -1);
                    document.addEventListener("keydown", this._handleKeyDown);
                } else {
                    window.documentsAPI.hide();
                }
            } else if (event === "showAll") {
                if (enable) {
                    alt.emit('Cursor::show', enable);
                    alt.emit('setBlockControl', enable);
                    alt.emit("setDocumentsActive", enable);
                    window.inventoryAPI.show(false);
                    this.setState({ cerfStatus: enable });
                    this.setState({ page: 1 });
                    this.setState({ data: data });
                    console.log(`${JSON.stringify(data)}`)
                    this.setState({ statusPage: "showAll" });
                    window.promptAPI.showByName("documents_help", -1);
                    document.addEventListener("keydown", this._handleKeyDown);
                } else {
                    window.documentsAPI.hide();
                }
            }
        });
        window.documentsAPI = {
            active: () => {
                return this.state.cerfStatus;
            },
            changeOptions: (data) => {
                this.setState({ data: data });
            },
            hide: () => {
                alt.emit("setDocumentsActive", false);
                alt.emit('Cursor::show', false);
                alt.emit('setBlockControl', false);
                this.setState({ cerfStatus: false }); 
                this.setState({ playerPage: 0 });
                this.setState({ data: {} });
                window.promptAPI.hide();
                document.removeEventListener("keydown", this._handleKeyDown);
            }
        };
    }

    render() {
        const { data, cerfStatus } = this.state;

        function getCorrectId(id, length = 8) {
            id += "";
            var result = id;
    
            for (var i = 0; i < length - id.length; i++)
                result = "0" + result;
    
            return result;
        }

        return (
            <div id="documents" style={cerfStatus === true ? {display: 'flex'} : {display: 'none'}}>
                {this.state.page === 1 ?
                    <div className="content">
                        <div className="labelPage">
                            The passport
                        </div>
                        <div className="simcard">
                            <img src={require('../../assets/img/documents/sim-card-chip.png')}/>
                            <img src={require('../../assets/img/documents/qr.png')}/>
                        </div>
                        <div className="passportBox">
                            <div className="numberPass">
                                {getCorrectId(this.state.data.id)}
                            </div>
                            <div className="infoBox">
                                <div className="images">
                                    <img src={require('../../assets/img/documents/pers.png')}/>
                                </div>
                                <ul className="stats">
                                    <li>
                                        <div className="params">Name</div>
                                        <div className="value">{this.state.data.name !== undefined ? this.state.data.name.split(' ')[0] : null}</div>
                                    </li>
                                    <li>
                                        <div className="params">Surname</div>
                                        <div className="value">{this.state.data.name !== undefined ? this.state.data.name.split(' ')[1] : null}</div>
                                    </li>
                                    <li>
                                        <div className="params">Floor</div>
                                        <div className="value">{this.state.data.sex == 0 ? "Female" : "Male"}</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>: null}
                {this.state.page === 2 ?
                <div className="content">
                    <div className="labelPage">
                        Licenses
                    </div>
                    {this.state.data.licenses !== undefined &&
                        <div className="licensesBox">
                            <ul className="licensesList">
                                <li className={this.state.data.licenses.indexOf(1) !== -1 ? "" : "disabled"}>
                                    <div className="icon">
                                        <img src={require('../../assets/img/documents/icon_car.png')}/>
                                    </div>
                                    <div className="name">
                                        Auto
                                    </div>
                                </li>
                    
                                <li className={(this.state.data.licenses.indexOf(3) || this.state.data.licenses.indexOf(4)) !== -1 ? "" : "disabled"}>
                                    <div className="icon">
                                        <img src={require('../../assets/img/documents/icon_boat.png')}/>
                                    </div>
                                    <div className="name">
                                        Boat
                                    </div>
                                </li>
                                <li className={this.state.data.licenses.indexOf(10) !== -1 ? "" : "disabled"}>
                                    <div className="icon">
                                        <img src={require('../../assets/img/documents/icon_gun.png')}/>
                                    </div>
                                    <div className="name">
                                        Weapon
                                    </div>
                                </li>
                                <li className={(this.state.data.licenses.indexOf(11) || this.state.data.licenses.indexOf(12)) !== -1 ? "" : "disabled"}>
                                    <div className="icon">
                                        <img src={require('../../assets/img/documents/icon_plane.png')}/>
                                    </div>
                                    <div className="name">
                                        Plane
                                    </div>
                                </li>
                                <li className="disabled">
                                    <div className="icon">
                                        <img src={require('../../assets/img/documents/icon-archery.png')}/>
                                    </div>
                                    <div className="name">
                                        Hunting
                                    </div>
                                </li>
                                <li className="disabled">
                                    <div className="icon">
                                        <img src={require('../../assets/img/documents/icon_case.png')}/>
                                    </div>
                                    <div className="name">
                                        Business
                                    </div>
                                </li>
                            </ul>
                        </div>
                    }
                </div> : null}
                <ul className="menu">
                    <li>
                        <img onClick={() => this.changePage(1)} src={require('../../assets/img/documents/icon_user.png')}/>
                    </li>
                    {this.state.statusPage === "showAll" &&
                        <li>
                            <img onClick={() => this.changePage(2)} src={require('../../assets/img/documents/icon_docs.png')}/>
                        </li>
                    }
                </ul>
            </div> 
        );
    }
}

function mapStateToProps(state) {
    return {};
};

const connected = connect(mapStateToProps)(Documents);
export { connected as Documents }; 