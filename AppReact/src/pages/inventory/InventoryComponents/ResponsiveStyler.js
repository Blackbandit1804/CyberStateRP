import React from 'react'

const ResponsiveStyler = props => {
    const calculateScale = () => {
        const width = window.innerWidth
        const height = window.innerHeight
        const scaleX = width / 1920
        const scaleY = height / 1080
        const scale = (scaleX > scaleY) ? scaleX : scaleY
        return scale
    }
    const { children } = props
    return (
        <div style={{
            WebkitTransform: `scale(${calculateScale()})`,
        }}
        >
            {children}
        </div>
    )
}
export default ResponsiveStyler
