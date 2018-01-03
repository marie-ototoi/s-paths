import React from 'react'
import { connect } from 'react-redux'
import { selectProperty } from '../../actions/dataActions'

class PropSelector extends React.PureComponent {
    constructor (props) {
        super(props)
        this.handleSelect = this.handleSelect.bind(this)
        this.state = {
            elementName: `${props.zone}_selector_${props.propIndex} propSelector`,
            selected: false,
            selectedPath: '',
            selectedLabel: props.propList[0].readablePath.map(part => part.label).join(' > ')
        }
    }
    handleSelect (e) {
        const { configs, dataset, propIndex, propList, zone } = this.props
        this.setState({
            selected: false,
            selectedPath: e.target.value,
            selectedLabel: propList[e.target.options.selectedIndex].readablePath.map(part => part.label).join(' > ')
        })
        this.props.selectProperty(configs, zone, propIndex, e.target.value, dataset)
    }
    render () {
        const { align, dimensions, propList } = this.props
        const { x, y, width, height } = dimensions
        const alignClass = (align === 'right') ? 'right' : 'left'
        return (!this.state.selected) ? (
            <g
                transform = { `translate(${x}, ${y})` }
                className = {this.state.elementName}
            >
                <text
                    x = { (align === 'right') ? (width - 5) : 0 }
                    textAnchor = { (align === 'right') ? 'end' : 'start' }
                    y = "15"
                    width = { width }
                    onClick = { (e) => this.setState({ selected: true }) }
                >
                    { this.state.selectedLabel }
                </text>
            </g>
        ) : (
            <foreignObject className = {this.state.elementName}
                transform = { `translate(${x}, ${y})` }
                ref = { this.state.elementName }
                width = { width }
                height = { height }
            >
                <select
                    className = { alignClass }
                    value = { this.state.selectedPath }
                    style = { { width: width + `px` } }
                    onChange = { this.handleSelect }
                >
                    { propList.map((config, i) => {
                        return <option
                            value = { config.path }
                            key = { this.state.elementName + i }
                        >
                            { config.readablePath.map(part => part.label).join(' > ') }
                        </option>
                    }) }
                </select>
            </foreignObject>
        )
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
