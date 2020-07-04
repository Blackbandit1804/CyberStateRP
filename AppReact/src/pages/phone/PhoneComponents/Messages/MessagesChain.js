import React, { useContext, useState } from 'react'
import { filter } from 'lodash'

import PhoneContext from '../../utils/PhoneContext'
import ArrowImg from '../../../../assets/img/phone/input/arrow.svg'

const MessagesChain = props => {
    const { phone } = useContext(PhoneContext)
    const { myNumber, messagingWith } = phone
    const myNum = parseInt(myNumber, 10)
    const hisNum = parseInt(messagingWith, 10)
    const contact = phone.fetchContact(hisNum)

    const handleInputChange = e => {
        const { value } = e.target
        setMessageText(value)
    }

    const [messageText, setMessageText] = useState('')

    const loadMessages = () => {
        const msgs = phone.messages
        const currentMessages = filter(msgs, msg => {
            if (msg.sender_num === hisNum || msg.creator_num === hisNum) return true
            return false
        })
        const messagesToRender = []
        for (let i = 0; i < currentMessages.length; i++) {
            const msg = currentMessages[i]
            if (msg.sender_num === myNum) {
                messagesToRender.push(
                    <div className="messages-group" key={msg.id}>
                        <div className="message">{msg.text}</div>
                    </div>
                )
            } else if (msg.creator_num === myNum) {
                messagesToRender.push(
                    <div className="messages-group my" key={msg.id}>
                        <div className="message">{msg.text}</div>
                    </div>
                )
            }
        }
        //console.log(messagesToRender)
        return messagesToRender
    }
    return (
        <div className="app messages">
            <div className="container">
                <div className="control-bar">
                    <div
                        className="control back"
                        role="presentation"
                        onClick={() => {
                            phone.setActiveTab(2, 0)
                            phone.setInteracting(-1, [])
                        }}
                    >
                        <div className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 10 17">
                                <path d="M9.619,2.1A1.214,1.214,0,0,0,9.66.378,1.229,1.229,0,0,0,7.929.336Q.371,7.61.351,7.631a1.254,1.254,0,0,0,.04,1.78l7.537,7.251a1.229,1.229,0,0,0,1.732-.039A1.214,1.214,0,0,0,9.622,14.9L3.373,8.786a.4.4,0,0,1,0-.57Z" />
                            </svg>
                        </div>
                    </div>
                    <div className="title">{contact}</div>
                    <div className="control inactive" />
                </div>
                <div className="workspace chat">
                    {loadMessages()}
                </div>
            </div>
            <div className="app-input">
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="SMS"
                        onChange={handleInputChange}
                        value={messageText}
                    />
                    <button
                        className="send"
                        type="submit"
                        onClick={() => {
                            phone.emitSendMessage(messagingWith, messageText)
                        }}
                    >
                        <div className="icon">
                            <img src={ArrowImg} alt="" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}
export default MessagesChain
