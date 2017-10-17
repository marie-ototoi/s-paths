import React from 'react'

class Debug extends React.Component {

    componentDidMount () {
    }
    componentWillUpdate () {
    }
    render () {
        return (<g className = "debug">
            <line x1 = "30" y1 = "100" x2 = "30" y2 = "20"  style = {{ strokeDasharray: "1, 1", stroke: 'black', strokeWidth: 1 }} />
            <line x1 = "30" y1 = "100" x2 = "30" y2 = "20"  style = {{ strokeDasharray: "1, 1", stroke: 'black', strokeWidth: 1 }} />
        </g>)
    }
}

export default Debug
