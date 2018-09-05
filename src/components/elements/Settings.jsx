import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

class Settings extends React.PureComponent {
    constructor (props) {
        super(props)
        //this.selectElement = this.selectElement.bind(this)
        this.customState = {
            elementName: `Back_${props.zone}`
        }
        //this.prepareData(props)
    }
    render () {
        const { dataset, dimensions, zone } = this.props
        const { x, y, width, height } = dimensions
        return (<g
            className = "Back"
            transform = { `translate(${x}, ${y})` }
        >
            <foreignObject
                width = { width }
                height = { height }
                fill = "#fff"
            >
                <div className = "box">
                    <div className = "content">
                       Settings               
                    </div>
                </div>
            </foreignObject>
        </g>)
    }
}

Settings.propTypes = {
    dataset: PropTypes.object,
    dimensions: PropTypes.object,
    display: PropTypes.object,
    views: PropTypes.array,
    zone: PropTypes.string,
}

function mapStateToProps (state) {
    return {
        configs: state.configs,
        dataset: state.dataset,
        data: state.data,
        display: state.display,
        views: state.views
    }
}

function mapDispatchToProps (dispatch) {
    return {
    }
}

const SettingsConnect = connect(mapStateToProps, mapDispatchToProps)(Settings)

export default SettingsConnect
