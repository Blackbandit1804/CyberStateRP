import React from 'react';
import { Router } from 'react-router-dom';
import { history } from '../helpers/history';

//import { MedicTablet } from '../pages/tablets/MedicTablet';
//import { FibTablet } from '../pages/tablets/FibTablet';
//import { ArmyTablet } from '../pages/tablets/ArmyTablet';
import MedTablet from '../pages/tablets/MedTablet';
import PoliceTablet from '../pages/tablets/PoliceTablet';
import { PlayerMenu } from '../pages/PlayerMenu';
import { BuyCar } from '../pages/autoSaloon/BuyCar';
//import { SheriffTablet } from '../pages/tablets/SheriffTablet';
//import { BandTablet } from '../pages/tablets/BandTablet';
import { MedicCerf } from '../pages/cerfs/MedicCerf';
import { SheriffCerf } from '../pages/cerfs/SheriffCerf';
import { FibCerf } from '../pages/cerfs/FibCerf';
import { PoliceCerf } from '../pages/cerfs/PoliceCerf';
import { Documents } from '../pages/cerfs/Documents';
import ResponsiveStyler from './utils/ResponsiveStyler'
import { SpeedoMeter } from '../pages/carSystem/SpeedoMeter';
//import { SpecMenu } from '../pages/carSystem/SpecMenu';
//import { Business } from '../pages/Business';
//import { AtmMenu } from '../pages/AtmMenu';
import Hud from '../pages/Hud';
import Phone from '../pages/phone/PhoneComponents/Phone';
import Inventory from './inventory/InventoryComponents/Inventory'

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router history={history}>
                <React.Fragment>
                    <Hud />
                    <Phone />
                    <Documents/>
                    <PoliceCerf/>
                    <SpeedoMeter/>
                    <FibCerf/>
                    <SheriffCerf/>
                    <PoliceTablet/>
                    <MedTablet/>
                    <MedicCerf/>
                    <Inventory/>
                    <PlayerMenu/>
                    <BuyCar/>
                </React.Fragment>
            </Router>
        );
    }
}

export default App;
