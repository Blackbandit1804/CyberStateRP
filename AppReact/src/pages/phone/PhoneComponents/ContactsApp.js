import React, { useContext } from 'react'

import PhoneContext from '../utils/PhoneContext'
import ContactList from './Contacts/ContactList'
import ContactRecent from './Contacts/ContactRecent'
import ContactDial from './Contacts/ContactDial'
import ContactInfo from './Contacts/ContactInfo'
import ContactCreate from './Contacts/ContactCreate'

const ContactsApp = props => {
    const { phone } = useContext(PhoneContext)
    return (
        <React.Fragment>
            { phone.subTab === 0 && <ContactRecent /> }
            { phone.subTab === 1 && <ContactList />}
            { phone.subTab === 2 && <ContactDial /> }
            { phone.subTab === 3 && <ContactInfo /> }
            { phone.subTab === 4 && <ContactCreate /> }
        </React.Fragment>
    )
}
export default ContactsApp
