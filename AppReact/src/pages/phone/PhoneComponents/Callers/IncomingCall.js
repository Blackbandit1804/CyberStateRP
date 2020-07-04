import React, { useContext } from 'react'
import Sound from 'react-sound'

import PhoneContext from '../../utils/PhoneContext'
import PhoneIcon from '../../../../assets/img/phone/callscreen/phone_icon.svg'
import Ringtone from '../../../../assets/sounds/ringtone.mp3'

const IncomingCall = props => {
    const { phone } = useContext(PhoneContext)
    const num = phone.incomingCall
    if (num === -1) {
        phone.setActiveTab(0)
    }
    const contact = phone.fetchContact(num)
    return (
        <div className="app callscreen">
            <div className="container">
                <div className="call-header">
                    <div className="caller">{contact}</div>
                    <div className="call-type">iPhone</div>
                </div>
                <div className="control-buttons">
                    <div
                        className="button decline"
                        onClick={() => phone.emitCallDecline(num)}
                        role="presentation"
                    >
                        <div className="icon">
                            <img src={PhoneIcon} alt="" />
                        </div>
                    </div>
                    <div
                        className="button accept"
                        onClick={() => phone.emitCallAccept(num)}
                        role="presentation"
                    >
                        <div className="icon">
                            <img src={PhoneIcon} alt="" />
                        </div>
                    </div>
                </div>
            </div>
            { !phone.talkingToPhone
                && <Sound
                    url={Ringtone}
                    playStatus={Sound.status.PLAYING}
                    playFromPosition={0}
                    loop
                />
            }
        </div>
    )
}
export default IncomingCall
