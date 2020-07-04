import React, { useContext } from 'react'
import Clock from 'react-live-clock';
import PhoneContext from '../../utils/PhoneContext'

const StatusBar = props => {
    const { phone } = useContext(PhoneContext)
    return (
        <div className={phone.activeTab === 0 ? 'status-bar' : 'status-bar dark'}>
            <div className="bar">
                <div className="time"><Clock format={'HH:mm'} ticking={true} timezone={'Europe/Moscow'} /></div>
                <div className="status-icons">
                    <div className="icon service-icon" data-state="4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 8">
                            <path d="M12.365 0h.835a.781.781 0 0 1 .8.762v6.476a.781.781 0 0 1-.8.762h-.835a.781.781 0 0 1-.8-.762v-6.476a.781.781 0 0 1 .8-.762z" />
                            <path d="M8.51 1.714h.835a.781.781 0 0 1 .8.762v4.762a.781.781 0 0 1-.8.762h-.835a.782.782 0 0 1-.8-.762v-4.762a.782.782 0 0 1 .8-.762z" />
                            <path d="M4.655 3.614h.835a.782.782 0 0 1 .8.762v2.862a.782.782 0 0 1-.8.762h-.835a.781.781 0 0 1-.8-.762v-2.857a.781.781 0 0 1 .8-.762z" />
                            <path d="M.8 5.143h.835a.781.781 0 0 1 .8.762v1.333a.781.781 0 0 1-.8.762h-.835a.781.781 0 0 1-.8-.762v-1.338a.781.781 0 0 1 .8-.757z" />
                        </svg>
                    </div>
                    <div className="icon battery-icon" data-battery-percent="100">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 9" height="9" width="20">
                            <g>
                                <path d="M2.062.001a2.021 2 0 0 0-2.062 1.957v5.085a2.021 2 0 0 0 2.062 1.957h14.02a2.021 2 0 0 0 2.062-1.957v-5.085a2.021 2 0 0 0-2.062-1.957zm0 .783h14.02a1.212 1.2 0 0 1 1.237 1.174v5.085a1.212 1.2 0 0 1-1.237 1.174h-14.02a1.212 1.2 0 0 1-1.237-1.174v-5.085a1.212 1.2 0 0 1 1.237-1.174zM18.97 2.611a1.938 1.918 0 0 1 0 3.389z" />
                            </g>
                            <rect x="1.633" y="1.565" rx=".799" height="5.87" width="14.694" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default StatusBar
