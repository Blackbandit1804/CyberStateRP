import React, { useContext } from 'react'

import PhoneContext from '../utils/PhoneContext'
import MessagesList from './Messages/MessagesList'
import MessagesChain from './Messages/MessagesChain'

const ContactsApp = props => {
    const { phone } = useContext(PhoneContext)
    return (
        <React.Fragment>
            { phone.subTab === 0 && <MessagesList /> }
            { phone.subTab === 1 && <MessagesChain />}
        </React.Fragment>
    )
}
export default ContactsApp
