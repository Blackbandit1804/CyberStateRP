import React, { useContext } from 'react'

import Notifications from './Notifications'
import StatusBar from './StatusBar'
import HomeButton from './HomeButton'
import PhoneContext from '../../utils/PhoneContext'

const PhoneLayout = props => {
    const { phone } = useContext(PhoneContext)
    const { children } = props
    return (
        <div id="iphone">
            <div className="face">
                <div className="forelock" />
                <div className={
                    phone.activeTab === 0
                        || phone.activeTab === 3
                        || phone.activeTab === 4
                        ? 'screen wallpaper'
                        : 'screen'
                }
                >
                    <Notifications />
                    <StatusBar />
                    {children}
                    <HomeButton />
                </div>
            </div>
        </div>
    )
}
export default PhoneLayout
