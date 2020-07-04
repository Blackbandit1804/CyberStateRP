import React, { useContext } from 'react'

import InventoryContext from './InventoryContext'

const InventoryModal = props => {
    const { inv } = useContext(InventoryContext)

    return (
        <div
            className="invModal"
            style={
                {
                    display: inv.modal.active ? 'block' : 'none',
                    top: inv.modal.top,
                    left: inv.modal.left,
                }
            }
        >
            {inv.modal.desc}
        </div>
    )
}
export default InventoryModal
