import React, { useContext } from 'react'

import settingsImg from '../../../assets/img/phone/apps_icons/settings.svg'
import navigationImg from '../../../assets/img/phone/apps_icons/navigation.svg'
import phoneImg from '../../../assets/img/phone/apps_icons/phone.svg'
import messagesImg from '../../../assets/img/phone/apps_icons/message.svg'

import PhoneContext from '../utils/PhoneContext'

const HomeScreen = props => {
    const { phone } = useContext(PhoneContext)
    return (
        <div className="app homescreen">
            <div className="container">
                <div className="apps" />
            </div>
            <ul className="screen-dots">
                <li className="active" />
            </ul>
            <div className="dock">
                <ul className="dock-apps">
                    <li className="app">
                        <div
                            className="icon"
                            onClick={() => phone.setActiveTab(1, 1)}
                            role="presentation"
                        >
                            <img src={phoneImg} alt="" />
                        </div>
                    </li>
                    <li className="app">
                        <div
                            className="icon"
                            onClick={() => phone.setActiveTab(2)}
                            role="presentation"
                        >
                            <img src={messagesImg} alt="" />
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}
export default HomeScreen
