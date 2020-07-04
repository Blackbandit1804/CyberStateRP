import React, { useContext } from 'react'

import PhoneContext from '../../utils/PhoneContext'

const HomeButton = props => {
    const { phone } = useContext(PhoneContext)
    return (
        <div
            className={phone.activeTab === 0 ? 'home-button-zone' : 'home-button-zone dark'}
            onClick={() => phone.setActiveTab(0)}
            role="presentation"
        >
            <div className="home-button-wrapper">
                <div className="home-button" />
            </div>
        </div>
    )
}
export default HomeButton
