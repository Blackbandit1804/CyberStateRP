import React from 'react';
import { connect } from 'react-redux';

import '../../assets/css/speedoMetr.css';

class SpeedoMeter extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
           speedStatus: false,
           engineStatus: false,
           accumulatorStatus: false,
           oilStatus: false,
           left: false,
           right: false,
           emergency: false,
           locked: false,
           belt: false,
           rotation: 0,
           margin: 16,
           width: 360,
           lights: 0,
           mileage: 0,
           data: {}
        };

    }

    componentDidMount() {
        alt.on(`speedoMeter`, (event, options) => {
            if (event === 'VehPropHandler') {
                this.setState({ data: options });
            } else if(event === 'MileageHandler') {
                this.setState({ mileage: parseInt(options * 10) });
            } else if(event === 'engineStatus') {
                this.setState({ speedStatus: options });
            } else if(event === 'accumulatorStatus') {
                this.setState({ accumulatorStatus: options });
            } else if(event === 'OilBrokenHandler') {
                this.setState({ oilStatus: options });
            } else if(event === 'LeftSignalHandler') {
                this.setState({ left: options });
            } else if(event === 'RightSignalHandler') {
                this.setState({ right: options });
            } else if(event === 'EmergencyHandler') {
                this.setState({ emergency: options });
            } else if(event === 'LockedHandler') {
                this.setState({ locked: options });
            } else if(event === 'BeltHandler') {
                this.setState({ belt: options });
            } else if(event === 'LightsHandler') {
                this.setState({ lights: options });
            }
        });
        window.speedoMetr = {
            enable: (enable) => {
                if (enable) {
                    this.setState({ speedStatus: true });
                } else {
                    this.setState({ speedStatus: false });
                }
            },
            active: () => {
                return this.state.speedStatus;
            },
        };
    }

    render() {

        var test;
        if(this.state.data.velocity < 1 && this.state.data.velocity >= 0 && this.state.data.rpm > 0.5) {
            test = 1;
        } else if(this.state.data.velocity != 0 && this.state.data.gear == 0) {
            test = 'R';
        } else if(this.state.data.velocity < 1 && this.state.data.velocity >= 0) {
            test = 'N';
        } else {
            test = this.state.data.gear;
        }
        
        var rotation;

        if ((this.state.data.rpm * 0.09) * 100 === 0) { 
           rotation = -27.0;
        } else {
            var speed;
            let max_rpm = 10, max_rpm_rot = 10;
            let speed2 = (this.state.data.rpm * 0.09) * 100;
            if(speed < 0.0) speed = 0.0;
            speed2 = (this.state.data.rpm * 0.09) * 100;
            if(speed2 > max_rpm) speed2 = max_rpm;
            rotation = -47.0 + ((speed2 * 251.0) / max_rpm_rot);
        }

    

        return (
            <div id="speedo" style={{display: this.state.speedStatus === true ? 'flex' : 'none'}}>
                <div className="speedo-fuel">
                    <span className="icon"></span>
                    <span>{parseInt(this.state.data.fuel) > 5 ? parseInt(this.state.data.fuel) : parseInt(this.state.data.fuel)}</span>
                </div>
                <div className="speedo-speed">
                    <span className="icon"></span>
                    <span>{parseInt(this.state.data.velocity)}</span>
                </div>
                <div className="speedo-mileage">
                    <span className="icon"></span>
                    {parseInt(this.state.mileage / 10) <= 9 ? <span>00000{parseInt(this.state.mileage / 10)}</span> : null}
                    {parseInt(this.state.mileage / 10) > 9 && parseInt(this.state.mileage / 10) <= 99 ? <span>0000{parseInt(this.state.mileage / 10)}</span> : null}
                    {parseInt(this.state.mileage / 10) > 99 && parseInt(this.state.mileage / 10) <= 999 ? <span>000{parseInt(this.state.mileage / 10)}</span> : null}
                    {parseInt(this.state.mileage / 10) > 999 && parseInt(this.state.mileage / 10) <= 9999 ? <span>00{parseInt(this.state.mileage / 10)}</span> : null}
                    {parseInt(this.state.mileage / 10) > 9999 && parseInt(this.state.mileage / 10) <= 9999 ? <span>0{parseInt(this.state.mileage / 10)}</span> : null}
                    {parseInt(this.state.mileage / 10) > 99999 ? <span>{parseInt(this.state.mileage / 10)}</span> : null}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {

    };
};

const connected = connect(mapStateToProps)(SpeedoMeter);
export { connected as SpeedoMeter }; 