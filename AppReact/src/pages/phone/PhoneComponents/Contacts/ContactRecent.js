import React, { useContext } from 'react'

import PhoneContext from '../../utils/PhoneContext'

const ContactRecent = props => {
    const { phone } = useContext(PhoneContext)
    const fetchLastCalls = () => {
        const calls = phone.lastCalls
        const callsList = []
        for (let i = 0; i < calls.length; i++) {
            callsList.push(
                <div className="call-wrapper" key="i">
                    <div className="call missed">
                        <div className="basic-info">
                            <div className="caller">{phone.fetchContact(calls[i].num)}</div>
                            <div className="call-type">{calls[i].type}</div>
                        </div>
                        <div className="datetime">{calls[i].time}</div>
                        <div className="info-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 8">
                                <path d="M.793 7.658v-4.92h-.793v-.307h2.226v5.221h.774v.348h-3v-.342zm.717-6.091a.821.898 0 0 0 .896-.781.821.898 0 0 0-.896-.781.821.898 0 0 0-.896.781.821.898 0 0 0 .896.782z" />
                            </svg>
                        </div>
                    </div>
                </div>
            )
        }
        //console.log(callsList)
        return callsList
    }
    return (
        <div className="app contacts">
            <div className="container">
                <div className="control-bar contact-recent">
                    <div className="control inactive" />
                    <div className="title">Contacts</div>
                    <div className="control inactive" />
                </div>
                <div className="workspace">
                    {fetchLastCalls()}
                </div>
            </div>
            <div className="navigation">
                <ul className="navigation-tabs">
                    <li className="tab active">
                        <div className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 19">
                                <path d="M10.26 10.26v-7.22a.381.381 0 0 0-.38-.38h-.38a.381.381 0 0 0-.38.38v6.84h-4.56a.381.381 0 0 0-.38.38v.38a.381.381 0 0 0 .38.38h5.32a.381.381 0 0 0 .38-.38zm-.76-10.26a9.5 9.5 0 1 1-9.5 9.5 9.5 9.5 0 0 1 9.5-9.5z" />
                            </svg>
                        </div>
                        <div className="title">Recent</div>
                    </li>
                    <li
                        className="tab"
                        onClick={() => phone.setActiveTab(1, 1)}
                        role="presentation"
                    >
                        <div className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 17">
                                <path d="M9.191 16.998c.354-2.2 1.205-2.671 1.839-3.022 1.278-.707 2.612-.45 3.677-1.322a2.114 2.114 0 0 0 .71-1.63 4.965 4.965 0 0 1-2.5-.971.511.511 0 0 1-.166-.5l.59-2.583a3.183 3.183 0 0 0 .082-.721v-2.091c0-2.266.919-3.211 1.654-3.211a2.609 2.609 0 0 1 1.1.189l.549-.282a1.545 1.545 0 0 1 .388-.142c3.391-.7 3.568 3.6 3.514 5.267a3.2 3.2 0 0 0 .229 1.3l.876 2.186a.509.509 0 0 1-.18.612 6.63 6.63 0 0 1-2.776.954 2.108 2.108 0 0 0 .709 1.625c1.065.872 2.4.615 3.677 1.322.634.351 1.485.826 1.839 3.022zm-9.191 0c.378-2.2.735-3.022 1.966-3.778 1.314-.806 2.795-.45 3.933-1.322a1.823 1.823 0 0 0 .7-1.156c-.8-.788-.695-2.215-1.449-3.378v-.006a.948.948 0 0 1-.368-.749v-.756a.956.956 0 0 1 .258-.653c-.039-.669-.074-1.3-.074-1.614a3.494 3.494 0 1 1 6.985 0c0 .312-.035.945-.074 1.614a.956.956 0 0 1 .257.653v.756a.947.947 0 0 1-.367.749v.006c-.25 1.158-.5 2.579-1.451 3.367a1.825 1.825 0 0 0 .7 1.166 3 3 0 0 0 .711.4 5.67 5.67 0 0 0-1.3.513c-.987.546-2.075 1.348-2.5 3.97l-.035.216z" />
                            </svg>
                        </div>
                        <div className="title">Contacts</div>
                    </li>
                    <li
                        className="tab"
                        onClick={() => phone.setActiveTab(1, 2)}
                        role="presentation"
                    >
                        <div className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
                                <path d="M13.124 15.563a2.438 2.438 0 1 1 2.438 2.437 2.438 2.438 0 0 1-2.438-2.437zm-6.561 0a2.437 2.437 0 1 1 2.438 2.437 2.437 2.437 0 0 1-2.437-2.437zm-6.562 0a2.438 2.438 0 1 1 2.437 2.437 2.438 2.438 0 0 1-2.436-2.437zm13.124-6.563a2.438 2.438 0 1 1 2.438 2.437 2.437 2.437 0 0 1-2.438-2.437zm-6.561 0a2.437 2.437 0 1 1 2.437 2.437 2.437 2.437 0 0 1-2.436-2.437zm-6.561 0a2.438 2.438 0 1 1 2.437 2.437 2.437 2.437 0 0 1-2.437-2.437zm13.124-6.563a2.438 2.438 0 1 1 2.438 2.438 2.438 2.438 0 0 1-2.439-2.438zm-6.561 0a2.437 2.437 0 1 1 2.437 2.438 2.437 2.437 0 0 1-2.437-2.438zm-6.562 0a2.438 2.438 0 1 1 2.437 2.438 2.438 2.438 0 0 1-2.437-2.438z" />
                            </svg>
                        </div>
                        <div className="title">Keys</div>
                    </li>
                </ul>
            </div>
        </div>
    )
}
export default ContactRecent
