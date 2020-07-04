import React, { useState, useCallback, useEffect } from 'react'
import { find, findIndex, remove } from 'lodash'
import posed from 'react-pose'

import PhoneContext from '../utils/PhoneContext'
import PhoneLayout from './UI/PhoneLayout'
import HomeScreen from './HomeScreen'
import ContactsApp from './ContactsApp'
import MessagesApp from './MessagesApp'
import Caller from './Callers/Caller'
import IncomingCall from './Callers/IncomingCall'

import { initEvents } from '../utils/PhoneEvents'

// ALT
import '../../../assets/css/phone.css'

const PhoneAnimate = posed.div({
    hidden: {
        position: 'absolute',
        bottom: '-1500px',
        right: '0px',
    },
    visible: {
        position: 'absolute',
        bottom: '0px',
        right: '0px',
    },
})

const Phone = props => {
    const setActiveTab = (tab, sub = 0) => {
        setPhone(prevState => {
            return {
                ...prevState,
                activeTab: tab,
                subTab: sub,
            }
        })
    }
    const setInteracting = id => {
        setPhone(prevState => {
            return {
                ...prevState,
                interactingWith: id,
            }
        })
    }
    const setMessaging = (num) => {
        setPhone(prevState => {
            return {
                ...prevState,
                messagingWith: num,
            }
        })
    }
    const setVisibility = visible => {
        setPhone(prevState => {
            return {
                ...prevState,
                active: visible,
            }
        })
    }
    const fetchContact = num => {
        const _num = parseInt(num, 10)
        const contact = phone.contacts.find(c => c.num === _num)
        if (!contact) return _num
        return contact.name
    }
    const callId = num => {
        // позвонить кому-то
        setPhone(prevState => {
            return {
                ...prevState,
                activeTab: 3,
                talkingToPhone: false,
                callingNumber: num,
            }
        })
    }
    const receiveCall = num => {
        // новый входящий
        setPhone(prevState => {
            return {
                ...prevState,
                activeTab: 4,
                talkingToPhone: false,
                incomingCall: num,
            }
        })
    }
    const callAccepted = () => {
        // принят исходящий тем, кому звонишь
        setPhone(prevState => {
            return {
                ...prevState,
                talkingToPhone: true,
            }
        })
    }
    const acceptCall = () => {
        // ты принял входящий
        setPhone(prevState => {
            return {
                ...prevState,
                activeTab: 3,
                talkingToPhone: true,
                callingNumber: prevState.incomingCall,
            }
        })
    }
    const declineCall = () => {
        // отклонен входящий
        setPhone(prevState => {
            return {
                ...prevState,
                activeTab: 0,
                talkingToPhone: false,
                callingNumber: -1,
                incomingCall: -1,
            }
        })
    }
    const setNumber = num => {
        // отклонен входящий
        setPhone(prevState => {
            return {
                ...prevState,
                myNumber: num
            }
        })
    }
    const sendMessage = ({ id, text, sender_num, creator_num }) => {
        // отправить сообщение
        const newMessages = phone.messages
        const _id = parseInt(id, 10)
        const _creatorNum = parseInt(creator_num, 10)
        const _senderNum = parseInt(sender_num, 10)
        newMessages.push({ id: _id, text, sender_num: _senderNum, creator_num: _creatorNum })
        setPhone(prevState => {
            return {
                ...prevState,
                messages: newMessages,
            }
        })
    }
    const createContact = ({ id, name, num }) => {
        const newContacts = phone.contacts
        newContacts.push({ id, name, num })
        setPhone(prevState => {
            return {
                ...prevState,
                contacts: newContacts,
            }
        })
    }
    const editContact = ({ id, name, num }) => {
        // редактировать контакт
        const newContacts = phone.contacts
        const item = find(newContacts, c => c.id === id)
        if (item) {
            remove(newContacts, c => c.id === id)
            newContacts.push({ id, name, num })
             setPhone(prevState => {
                return {
                    ...prevState,
                    contacts: newContacts,
                }
            })
        }
    }
    const deleteContact = id => {
        // удалить контакт
        //console.log(id)
        const newContacts = phone.contacts
        const item = find(newContacts, c => c.id === id)
        if (item) {
             remove(newContacts, c => c.id === id)
             setPhone(prevState => {
                return {
                    ...prevState,
                    contacts: newContacts,
                }
            })
        }
    }
    const emitCallAccept = num => {
        alt.emit(`accept.telephone.call`, num)
    }
    const emitCallDecline = num => {
        alt.emit(`call.decline`, num)
    }
    const emitPhoneCallId = num => {
        alt.emit(`phone.callId`, num)
    }
    const emitSaveContact = values => {
        if (Object.prototype.hasOwnProperty.call(values, 'id')) {
            alt.emit(`selectChangeContact`, values.id, `${values.firstName} ${values.lazstName}`, values.num)
        } else {
            alt.emit(`select.add.contact`, `${values.firstName} ${values.lastName}`, values.num)
        }
    }
    const emitDeleteContact = id => {
        alt.emit(`deleteContact`, id)

        setInteracting(-1)
        setActiveTab(1, 1)
    }
    const emitSendMessage = (messagingWith, messageText) => {
        alt.emit(`sendMessage`, messagingWith, messageText)
    }
    const phoneState = {
        active: false,
        myNumber: 0,
        messages: [],
        contacts: [{id: 24224, name: "Полиция", num: 103}, {id: 24225, name: "Скорая помощь", num: 105}],
        lastCalls: [],
        currentMessages: [],
        activeTab: 0,
        subTab: 1,
        interactingWith: -1,
        messagingWith: -1,
        callingNumber: -1,
        incomingCall: -1,
        talkingToPhone: false,
        setActiveTab,
        setInteracting,
        setMessaging,
        createContact,
        editContact,
        fetchContact,
        deleteContact,
        setNumber,
        callId,
        sendMessage,
        acceptCall,
        callAccepted,
        declineCall,
        receiveCall,
        emitCallAccept,
        emitCallDecline,
        emitPhoneCallId,
        emitSaveContact,
        emitDeleteContact,
        emitSendMessage,
    }

    const [phone, setPhone] = useState(phoneState)

    useEffect(() => {
        initEvents()
    }, [])

    const keyPressHandler = useCallback(event => {
        const { keyCode } = event
        if (keyCode === 40) {
            alt.emit('telephone.active', false)
            window.telePhone.show(false)
        } else if (keyCode === 38) {
            if (window.medicTablet.active()
            || window.pdTablet.active()
            || window.clientStorage.hasCuffs
            || window.selectMenuAPI.active()
            // || window.armyTablet.active()
            // || window.sheriffTablet.active()
            // || window.fibTablet.active()
            || window.playerMenu.active()
            || window.consoleAPI.active()
            || window.modalAPI.active()
            || window.playerMenu.active()
            || window.chatAPI.active()
            // || window.tradeAPI.active()
            || window.documentsAPI.active()
            || window.houseMenu.__vue__.active()) return
            alt.emit('telephone.active', true)
            window.telePhone.show(true)
        }
    }, [])

    window.telePhone = {
        active: () => {
            return phone.active
        },
        show: visible => {
            setVisibility(visible)
        },
        enable: enable => {
            if (enable) {
                window.addEventListener('keydown', keyPressHandler)
            } else {
                window.telePhone.show(enable)
                window.removeEventListener('keydown', keyPressHandler)
            }
        },
        setNumber: num => {
            phone.setNumber(num);
        },
        createContact: data => {
            phone.createContact(data)
        },
        editContact: data => {
            phone.editContact(data)
        },
        deleteContact: id => {
            phone.deleteContact(id)
        },
        sendMessage: data => {
            phone.sendMessage(data)
        },
        call: num => {
            // исходящий
            phone.callId(num)
        },
        startedTalking: () => {
            // человек взял трубку
            phone.callAccepted()
        },
        acceptCall: () => {
            // входящий
            phone.acceptCall()
        },
        receiveCall: num => {
            phone.receiveCall(num);
        },
        finishCall: () => {
            // конец/отмена звонка
            phone.declineCall()
        },
    }
    return (
        <PhoneContext.Provider value={{ phone }}>
            <PhoneAnimate pose={phone.active ? 'visible' : 'hidden'}>
                <PhoneLayout>
                    { phone.activeTab === 0 && <HomeScreen /> }
                    { phone.activeTab === 1 && <ContactsApp />}
                    { phone.activeTab === 2 && <MessagesApp />}
                    { phone.activeTab === 3 && <Caller />}
                    { phone.activeTab === 4 && <IncomingCall />}
                </PhoneLayout>
            </PhoneAnimate>
        </PhoneContext.Provider>
    )
}

export default Phone
