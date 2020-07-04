import React, { useContext, useState, useEffect } from 'react'
import Sound from 'react-sound'

import PhoneContext from '../../utils/PhoneContext'
import PhoneIcon from '../../../../assets/img/phone/callscreen/phone_icon.svg'
import DialingSound from '../../../../assets/sounds/caller.mp3'

const Caller = props => {
    const [timer, setTimer] = useState(0)
    const { phone } = useContext(PhoneContext)
    const num = phone.callingNumber
    if (num === -1) {
        phone.setActiveTab(0)
    }
    useEffect(() => {
        let interval
        setTimer(0)
        if (phone.talkingToPhone) {
            interval = setInterval(() => {
                setTimer(prevState => {
                    return prevState + 1
                })
                console.log(`Caller: ${interval}`)
            }, 1000)
        }
        return () => {
            clearInterval(interval)
        }
    }, [phone.talkingToPhone])
    const styleTimer = time => {
        const minutes = Math.floor(time / 60)
        const seconds = time - minutes * 60
        const m = (minutes < 10) ? `0${minutes}` : minutes
        const s = (seconds < 10) ? `0${seconds}` : seconds
        return `${m}:${s}`
    }
    const contact = phone.fetchContact(num)
    return (
        <div className="app callscreen active">
            <div className="container">
                <div className="call-header">
                    <div className="caller">{contact}</div>
                    <div className="call-type">
                        { !phone.talkingToPhone
                            ? 'Вызов iPhone...'
                            : styleTimer(timer)
                        }
                    </div>
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
                </div>
            </div>
            { !phone.talkingToPhone
                && <Sound
                    url={DialingSound}
                    playStatus={Sound.status.PLAYING}
                    playFromPosition={0}
                    loop
                />
            }
        </div>
    )
}
export default Caller
