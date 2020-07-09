import React, { useContext } from 'react'

import PhoneContext from '../../utils/PhoneContext'
import ContactsMenu from '../UI/Contacts/ContactsMenu'

const Contacts = props => {
    const { phone } = useContext(PhoneContext)
    const getContacts = () => {
        const knownContacts = phone.contacts
        const contactsToRender = []
        for (let i = 0; i < knownContacts.length; i++) {
            const c = knownContacts[i]
            contactsToRender.push(
                <div className="contact-wrapper" key={c.id}>
                    <div
                        className="contact"
                        role="presentation"
                        onClick={() => {
                            phone.setInteracting(c.id)
                            phone.setActiveTab(1, 3)
                        }}
                    >
                        {c.name}
                    </div>
                </div>
            )
        }
        return contactsToRender
    }
    return (
        <div className="app contacts">
            <div className="container">
                <div className="control-bar">
                    <div className="control inactive" />
                    <div className="title">Contacts</div>
                    <div
                        className="control add"
                        role="presentation"
                        onClick={() => {
                            phone.setActiveTab(1, 4)
                        }}
                    >
                        <div className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
                                <path d="M8 0h2v18h-2zM0 8h18v2h-18z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="workspace">
                    <div className="my-number">
                        <b>My number:</b>
                        &nbsp;
                        { phone.myNumber }
                    </div>
                    <div className="contacts-group">
                        {getContacts()}
                    </div>
                </div>
            </div>
            <ContactsMenu />
        </div>
    )
}
export default Contacts
