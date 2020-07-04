import React, { useContext, useState } from 'react'

import phoneIcon from '../../../../assets/img/phone/callscreen/phone_icon.svg'
import backspaceSvg from '../../../../assets/img/phone/phone/backspace.svg'

import ContactsMenu from '../UI/Contacts/ContactsMenu'
import PhoneContext from '../../utils/PhoneContext'

const ContactDial = props => {
    const { phone } = useContext(PhoneContext)
    const [values, setValues] = useState('')
    const addDigit = dig => {
        setValues(values => `${values}${dig}`)
    }
    const removeDigit = dig => {
        setValues(values => values.slice(0, -1))
    }
    const callNumber = () => {
        const num = parseInt(values, 10)
        if (num === 'NaN') {
            return;
        } else {
            phone.emitPhoneCallId(num)
        }
    }
    return (
        <div className="app phone">
            <div className="container">
                <div className="number-wrapper">
                    <input
                        type="num"
                        className="number"
                        value={values}
                        disabled
                    />
                </div>
                <div className="keypad">
                    <div
                        className="key"
                        role="presentation"
                        onClick={() => addDigit('1')}
                    >
                        <div className="digit">1</div>
                        <div className="chars" />
                    </div>
                    <div
                        className="key"
                        role="presentation"
                        onClick={() => addDigit('2')}
                    >
                        <div className="digit">2</div>
                        <div className="chars">АБВГ</div>
                    </div>
                    <div
                        className="key"
                        role="presentation"
                        onClick={() => addDigit('3')}
                    >
                        <div className="digit">3</div>
                        <div className="chars">ДЕЖЗ</div>
                    </div>
                    <div
                        className="key"
                        role="presentation"
                        onClick={() => addDigit('4')}
                    >
                        <div className="digit">4</div>
                        <div className="chars">ИЙКЛ</div>
                    </div>
                    <div
                        className="key"
                        role="presentation"
                        onClick={() => addDigit('5')}
                    >
                        <div className="digit">5</div>
                        <div className="chars">МНОП</div>
                    </div>
                    <div
                        className="key"
                        role="presentation"
                        onClick={() => addDigit('6')}
                    >
                        <div className="digit">6</div>
                        <div className="chars">РСТУ</div>
                    </div>
                    <div
                        className="key"
                        role="presentation"
                        onClick={() => addDigit('7')}
                    >
                        <div className="digit">7</div>
                        <div className="chars">ФХЦЧ</div>
                    </div>
                    <div
                        className="key"
                        role="presentation"
                        onClick={() => addDigit('8')}
                    >
                        <div className="digit">8</div>
                        <div className="chars">ШЩЪЫ</div>
                    </div>
                    <div
                        className="key"
                        role="presentation"
                        onClick={() => addDigit('9')}
                    >
                        <div className="digit">9</div>
                        <div className="chars">ЬЭЮЯ</div>
                    </div>
                    <div className="key asterisk">
                        <div className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.967 15.131">
                                <path d="M12.95 12.291l1.018-1.846-5.348-2.859 5.348-2.88-1.018-1.866-5.15 3.346.241-6.186h-2.115l.239 6.186-5.127-3.346-1.038 1.866 5.368 2.88-5.368 2.88 1.038 1.825 5.128-3.306-.239 6.146h2.114l-.241-6.126z" />
                            </svg>
                        </div>
                    </div>
                    <div
                        className="key zero"
                        role="presentation"
                        onClick={() => addDigit('0')}
                    >
                        <div className="digit">0</div>
                        <div className="chars">+</div>
                    </div>
                    <div className="key hashtag">
                        <div className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
                                <path d="M5.385 3.462h4.615v-3.462h1.923v3.462h3.077v1.923h-3.077v4.615h3.077v1.923h-3.077v3.077h-1.923v-3.077h-4.615v3.077h-1.923v-3.077h-3.462v-1.923h3.462v-4.615h-3.462v-1.923h3.462v-3.462h1.923zm0 1.923v4.615h4.615v-4.615z" />
                            </svg>
                        </div>
                    </div>
                    <div className="key inactive" />
                    <div
                        className="key call"
                        role="presentation"
                        onClick={callNumber}
                    >
                        <div className="icon">
                            <img src={phoneIcon} alt="" />
                        </div>
                    </div>
                    <div
                        className="key backspace"
                        role="presentation"
                        onClick={() => removeDigit()}
                    >
                        <div className="icon">
                            <img src={backspaceSvg} alt="" />
                        </div>
                    </div>
                </div>
            </div>
            <ContactsMenu />
        </div>
    )
}
export default ContactDial
