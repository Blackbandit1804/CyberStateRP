import React, { useContext } from 'react'

import PhoneContext from '../../../utils/PhoneContext'

const Message = props => {
    const { phone } = useContext(PhoneContext)
    const { contactNumber, messages } = props
    const contact = phone.fetchContact(contactNumber)
    return (
        <div
            className="message-wrapper"
            role="presentation"
            onClick={() => {
                phone.setActiveTab(2, 1)
                phone.setMessaging(contactNumber)
            }}
        >
            <div className="dot-block" />
            <div className="icon-wrapper">
                <div className="icon img">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35">
                        <g transform="matrix(1.039 0 0 1.039 .358 .359)">
                            <circle cx="15.845" cy="15.845" r="15.845" transform="translate(.655 .655)" />
                            <path d="M16.845 1a15.845 15.845 0 0 0 0 31.69h.2a16.567 16.567 0 0 1-11.027-4.424c2.443-2.179 6.734-2.311 7.592-4.555.066-1.056.066-1.783.066-2.773a5.458 5.458 0 0 1-1.519-3.238c-.4 0-.99-.4-1.122-1.849a1.379 1.379 0 0 1 .528-1.386c-1.254-4.952-.594-9.243 5.282-9.375 1.452 0 2.575.4 3.037 1.188 4.291.594 2.971 6.338 2.377 8.187a1.519 1.519 0 0 1 .528 1.386c-.2 1.452-.792 1.849-1.122 1.849a5.1 5.1 0 0 1-1.518 3.235 19.679 19.679 0 0 0 .066 2.773c.858 2.245 5.15 2.443 7.592 4.621a19.83 19.83 0 0 1-9.441 4.357 15.883 15.883 0 0 0-1.519-31.686z" transform="translate(-.345 -.345)" />
                        </g>
                    </svg>
                </div>
            </div>
            <div className="message">
                <div className="basic-info">
                    <div className="sender">{contact}</div>
                    <div className="info">
                        <div className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 9">
                                <path d="M.191 1.112a.67.67 0 0 1-.021-.912.59.59 0 0 1 .865-.022l3.79 3.862a.692.692 0 0 1-.02.942l-3.769 3.839a.591.591 0 0 1-.866-.021.67.67 0 0 1 .019-.912l3.125-3.237a.219.219 0 0 0 0-.3z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="message-text">
                    <p>{messages[messages.length - 1].text}</p>
                </div>
            </div>
        </div>
    )
}
export default Message
