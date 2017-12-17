import React from 'react'
import { connect } from 'react-redux'
import { selectProperty } from '../../actions/dataActions'

class PropSelector extends React.PureComponent {
    constructor (props) {
        super(props)
        this.state = {
            elementName: `${props.zone}_selector_${props.propIndex}`
        }
    }
    render () {
        const { configs, dataset, dimensions, propIndex, propList, zone } = this.props
        const { x, y, width, height } = dimensions
        return (<foreignObject className = {this.state.elementName}
            transform = { `translate(${x}, ${y})` }
            ref = { this.state.elementName }
            width = { width }
            height = { height }
        >
            <select style = {{ width: width + `px` }} className = "propSelector" onChange = { (e) => this.props.selectProperty(configs, zone, propIndex, e.target.value, dataset) }>
                { propList.map((config, i) => {
                    return <option value={config.path} key={ this.state.elementName + i }>{config.path}</option>
                }) }
            </select>
        </foreignObject>)
    }
}

function mapStateToProps (state) {
    return {
        dataset: state.dataset.present
    }
}

function mapDispatchToProps (dispatch) {
    return {
        selectProperty: selectProperty(dispatch)
    }
}

const PropSelectorConnect = connect(mapStateToProps, mapDispatchToProps)(PropSelector)

export default PropSelectorConnect
