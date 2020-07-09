import React, { useContext, useState } from 'react'
import { find } from 'lodash'

import phoneIcon from '../../../../assets/img/phone/callscreen/phone_icon.svg'
import messageIcon from '../../../../assets/img/phone/callscreen/message_icon.svg'

import PhoneContext from '../../utils/PhoneContext'

const ContactCreate = props => {
    const { phone } = useContext(PhoneContext)

    const handleInputChange = e => {
        const { name, value } = e.target
        setValues({ ...values, [name]: value })
    }
    const editId = phone.interactingWith

    let initVals = {
        firstName: '',
        lastName: '',
        num: 0,
    }
    if (editId !== -1) {
        const allC = phone.contacts
        const { id, name, num } = find(allC, c => c.id === phone.interactingWith)
        initVals = {
            id,
            firstName: name.substr(0, name.indexOf(' ')),
            lastName: name.substr(name.indexOf(' ') + 1),
            num,
        }
    }
    const [values, setValues] = useState(initVals)
    const saveContact = () => {
        phone.emitSaveContact(values)

        setInteracting(-1)
        setActiveTab(1, 1)
    }

    return (
        <div className="app new-contact">
            <div className="container">
                <div className="control-bar">
                    <div
                        className="control"
                        onClick={() => {
                            phone.setInteracting(-1)
                            phone.setActiveTab(1, 1)
                        }}
                        role="presentation"
                    >
                        Отменить
                    </div>
                    <div className="title">Contact</div>
                    <div
                        className="control"
                        onClick={() => saveContact()}
                        role="presentation"
                    >
                        Готово
                    </div>
                </div>
                <div className="workspace">
                    <div className="basic-info">
                        <div className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35">
                                <g transform="matrix(1.039 0 0 1.039 .358 .359)">
                                    <circle cx="15.845" cy="15.845" r="15.845" transform="translate(.655 .655)" />
                                    <path d="M16.845 1a15.845 15.845 0 0 0 0 31.69h.2a16.567 16.567 0 0 1-11.027-4.424c2.443-2.179 6.734-2.311 7.592-4.555.066-1.056.066-1.783.066-2.773a5.458 5.458 0 0 1-1.519-3.238c-.4 0-.99-.4-1.122-1.849a1.379 1.379 0 0 1 .528-1.386c-1.254-4.952-.594-9.243 5.282-9.375 1.452 0 2.575.4 3.037 1.188 4.291.594 2.971 6.338 2.377 8.187a1.519 1.519 0 0 1 .528 1.386c-.2 1.452-.792 1.849-1.122 1.849a5.1 5.1 0 0 1-1.518 3.235 19.679 19.679 0 0 0 .066 2.773c.858 2.245 5.15 2.443 7.592 4.621a19.83 19.83 0 0 1-9.441 4.357 15.883 15.883 0 0 0-1.519-31.686z" transform="translate(-.345 -.345)" />
                                </g>
                            </svg>
                        </div>
                        <div className="rows">
                            <div className="row">
                                <input
                                    name="firstName"
                                    type="text"
                                    placeholder="Name"
                                    onChange={handleInputChange}
                                    value={values.firstName}
                                />
                            </div>
                            <div className="row">
                                <input
                                    name="lastName"
                                    type="text"
                                    placeholder="Surname"
                                    onChange={handleInputChange}
                                    value={values.lastName}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="additional-info">
                        <div className="rows">
                            <div className="row">
                                <div className="action">
                                    <div className="plus icon">
                                        <div className="plus" />
                                        <div className="plus" />
                                    </div>
                                </div>
                                <div className="title">
                                    <input
                                        name="num"
                                        type="number"
                                        placeholder="room"
                                        onChange={handleInputChange}
                                        value={values.num}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ContactCreate
