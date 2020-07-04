import React from 'react';
import { connect } from 'react-redux';

import '../../assets/css/specMenu.css';

class SpecMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            specMenu: false,
            data: []
        };
    }

    componentDidMount() {
        window.specMenu = {
            enable: (enable) => {
                if(enable) {
                    mp.invoke('focus', true);
                    mp.trigger('setBlockControl', true);
                    this.setState({ specMenu: true });
                } else {
                    mp.invoke('focus', false);
                    mp.trigger('setBlockControl', false);
                    this.setState({ specMenu: false });
                }
            },
            changeOptions: (data) => {
                this.setState({ data: data });
            },
        }
    }

    render() {
        var specifications = [
            {
                name: 'Скорость'    
            },
            {
                name: 'Ускорение'    
            },
            {
                name: 'Торможение'    
            },
            {
                name: 'Сцепление'    
            }
        ];

        return(
            <div id="custom" style={this.state.specMenu === true ? {display: 'block'} : {display: 'none'}}>
                <div className="header">Основные характеристики</div>
                <div className="body">
                    {specifications.map((item, i) => (
                    <div className="category" key={i}>
                        <div className="title">{item.name}</div>
                        <div class="skill-box">  
                            <div class="progress">
                                <div style={{width: this.state.data[i] + '%'}}></div>
                            </div>
                        </div>
                    </div>))}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {

    };
}

const connected = connect(mapStateToProps)(SpecMenu);
export { connected as SpecMenu };
