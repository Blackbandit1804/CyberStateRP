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
    const scale = calculateScale()
    return (
        <div style={{
            WebkitTransform: `scale(${scale})`,
            WebkitTransformOrigin: '0 0',
            width: `${100 / scale}%`,
            height: `${100 / scale}%`,
            position: 'absolute',
            overflow: 'hidden',
        }}
        >
            {children}
        </div>

    )
}
export default ResponsiveStyler
