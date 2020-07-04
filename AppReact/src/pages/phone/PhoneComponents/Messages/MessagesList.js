import React, { useContext } from 'react'
import { forEach, reduce } from 'lodash'

import PhoneContext from '../../utils/PhoneContext'
import Message from '../UI/Messages/Message'

const MessagesList = props => {
    const { phone } = useContext(PhoneContext)
    const getMessages = () => {
        const { myNumber } = phone
        const msgs = phone.messages
        const senders = reduce(msgs, (result, value, key) => {
            if (!result[value.sender_num] && value.sender_num !== myNumber) {
                result[value.sender_num] = [value]
            } else if (value.sender_num !== myNumber) {
                result[value.sender_num].push(value)
            }
            if (!result[value.creator_num] && value.creator_num !== myNumber) {
                result[value.creator_num] = [value]
            } else if (value.creator_num !== myNumber) {
                result[value.creator_num].push(value)
            }
            return result
        }, {})
        const messagesToRender = []
        forEach(senders, (v, k) => {
            //console.log(`${JSON.stringify(v)} ${k}`)
            messagesToRender.push(
                <Message
                    key={k}
                    contactNumber={k}
                    messages={v}
                />
            )
        })
        return messagesToRender
    }
    return (
        <div className="app messages">
            <div className="container">
                <div className="control-bar">
                    <div className="control inactive" />
                    <div className="control new">
                        <div className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23">
                                <path d="M21.735.369l.896.888a1.317 1.283 0 0 1 0 1.783l-.716.713-2.688-2.671.717-.713a1.248 1.216 0 0 1 1.791 0zm-10.736 14.236v.011l-3.021.447a.101.099 0 0 1-.115-.085.154.15 0 0 1 0-.03l.455-3.009h.01l-.01-.011 10.384-10.33.896.888-9.959 9.913a3.323 3.238 0 0 0 .382.517 2.909 2.835 0 0 0 .507.365v.008l9.966-9.91.895.888-10.384 10.336zm4.197-10.759l-1.013 1.009h-13.17v17.138l17.222-.016v-13.09l1.013-1.008v15.121l-19.248-.016v-19.139z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="title-bar">
                    <div className="title">Сообщения</div>
                </div>
                <div className="workspace">
                    {getMessages()}
                </div>
            </div>
        </div>
    )
}
export default MessagesList
