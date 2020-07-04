import React, { useContext } from 'react'

import InventoryContext from './InventoryContext'

const InventoryMenu = props => {
    const { inv } = useContext(InventoryContext)
    const { itemMenu } = inv
    const { active, top, left, sqlId, menu } = itemMenu
    if (!sqlId || !active || !menu) return ''


    const menuClickHandler = handler => {
        handler(sqlId)
        inv.hideItemMenu()
    }

    const generateMenuList = menuList => {
        const menuItemList = []
        for (let i = 0; i < menuList.length; i++) {
            const menuItem = menuList[i]
            menuItemList.push(
                <div // eslint-disable-line
                    key={i}
                    className="invMenuItem"
                    onClick={() => menuClickHandler(menuItem.handler)}
                >
                    {menuItem.text}
                </div>
            )
        }
        return menuItemList
    }

    return (
        <div
            className="inventoryMenu"
            style={
                {
                    display: active ? 'block' : 'none',
                    top,
                    left,
                }
            }
        >
            {generateMenuList(menu)}
        </div>
    )
}
export default InventoryMenu
