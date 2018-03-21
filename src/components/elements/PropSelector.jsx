import React from 'react'
import { connect } from 'react-redux'

import { getDimensions } from '../../lib/scaleLib'

import { selectProperty } from '../../actions/dataActions'

class PropSelector extends React.PureComponent {
    constructor (props) {
        super(props)
        this.handleSelect = this.handleSelect.bind(this)
        this.state = {
            elementName: `${props.zone}_selector_${props.propIndex} propSelector`,
            selected: props.selected
        }
    }
    handleSelect (e) {
        const { config, dataset, propIndex, propList, zone } = this.props
        this.setState({
            selected: this.props.selected
        })
        this.props.selectProperty(propIndex, e.target.value, config, dataset, zone)
    }
    render () {
        const { align, dimensions, display, offset, propList, type, zone } = this.props
        // const dimensions = getDimensions('propSelector' + type, display.zones[zone], display.viz, offset)
        const { x, y, width, height } = dimensions
        const alignClass = (align === 'right') ? 'right' : 'left'
        const selectedProp = propList.filter(p => p.selected)[0]
        return (
            <foreignObject className = {this.state.elementName}
                transform = { `translate(${x}, ${y})` }
                ref = { this.state.elementName }
                width = { width }
                height = { height }
            >
                { (!this.state.selected) &&
                    <p
                        className = { alignClass }
                        onClick = { (e) => this.setState({ selected: true }) }
                    >
                        { selectedProp && selectedProp.readablePath.map((part, index) => {
                            return <span key = { `${this.state.elementName}_path_${index}` }>
                                <span title = { part.comment }>{part.label}</span> { (index < selectedProp.readablePath.length - 1) ? ' / ' : '' }
                            </span>
                        }) }
                    </p>
                }
                { (this.state.selected) &&
                <select
                    className = { alignClass }
                    style = { { width: width + `px` } }
                    onChange = { this.handleSelect }
                    value = { selectedProp.path }
                >
                    { propList.map((config, i) => {
                        return <option
                            value = { config.path }
                            key = { this.state.elementName + i }
                        >
                            { config.readablePath.map(part => part.label).join(' / ') }
                        </option>
                    }) }
                </select>
                }
            </foreignObject>
        )
    }
}

function mapStateToProps (state) {
    return {
        dataset: state.dataset.present,
        display: state.display
    }
}

function mapDispatchToProps (dispatch) {
    return {
        selectProperty: selectProperty(dispatch)
    }
}

const PropSelectorConnect = connect(mapStateToProps, mapDispatchToProps)(PropSelector)

export default PropSelectorConnect
