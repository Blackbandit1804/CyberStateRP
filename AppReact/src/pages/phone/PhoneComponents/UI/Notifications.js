import React from 'react'

const Notifications = props => {
    return (
        <ul className="notifications">
            <li className="notification">
                <div className="header">
                    <div className="icon">
                        <img src="../assets/img/apps_icons/message.svg" alt="" />
                    </div>
                    <div className="title">Messages</div>
                    <div className="age">38 minutes ago</div>
                </div>
                <div className="body">
                    <p>ECMS6235 20:12 Purchase $260  MASTERCARD Balance: $129 570</p>
                </div>
            </li>
        </ul>
    )
}
export default Notifications
