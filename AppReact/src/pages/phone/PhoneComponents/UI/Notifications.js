import React from 'react'

const Notifications = props => {
    return (
        <ul className="notifications">
            <li className="notification">
                <div className="header">
                    <div className="icon">
                        <img src="../assets/img/apps_icons/message.svg" alt="" />
                    </div>
                    <div className="title">Сообщения</div>
                    <div className="age">38 минут назад</div>
                </div>
                <div className="body">
                    <p>ECMS6235 20:12 Покупка $260  MASTERCARD Баланс: $129 570</p>
                </div>
            </li>
        </ul>
    )
}
export default Notifications
