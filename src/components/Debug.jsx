import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

class Debug extends React.Component {
    render () {
        const { display } = this.props
        let xLines
        let yLines
        if (display.grid) {
            xLines = display.grid.xPoints.map(point => {
                return (<line
                    x1 = { point }
                    y1 = "0"
                    x2 = { point }
                    y2 = { display.stage.height }
                    key = { `x${point}` }
                    className = "gridline"
                />)
            })
            yLines = display.grid.yPoints.map(point => {
                return (<line
                    y1 = { point }
                    x1 = "0"
                    y2 = { point }
                    x2 = { display.stage.width }
                    key = { `y${point}` }
                    className = "gridline"
                />)
            })
        }
        return (<g className = "Debug">
            {xLines}
            {yLines}
        </g>)
    }
}

Debug.propTypes = {
    display: PropTypes.string
}

function mapStateToProps (state) {
    return {
        display: state.display
    }
}

function mapDispatchToProps (state) {
    return {
    }
}

const DebugConnect = connect(mapStateToProps, mapDispatchToProps)(Debug)

export default DebugConnect
