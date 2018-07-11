import PropTypes from 'prop-types'
import React from 'react'
import formatMessage from 'format-message'
import { connect } from 'react-redux'
// components
import Coverage from '../elements/Coverage'
import Header from '../elements/Header'
import History from '../elements/History'
import Nav from '../elements/Nav'
import SelectionZone from '../elements/SelectionZone'
// d3

// libs
import { getSelectedMatch } from '../../lib/configLib'
import { prepareDetailData } from '../../lib/dataLib'
// redux functions
import { getPropPalette } from '../../actions/palettesActions'
import { handleMouseDown, handleMouseUp, selectElements } from '../../actions/selectionActions'

class ListAllProps extends React.Component {
    constructor (props) {
        super(props)
        this.selectEnsemble = this.selectEnsemble.bind(this)
        this.customState = {
            elementName: `refListProp_${props.zone}`
        }
        this.state = { selectedIndex: 0 }
        this.prepareData(props)
    }
    shouldComponentUpdate (nextProps, nextState) {
        if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
            this.prepareData(nextProps)
        }
        return (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) ||
            (JSON.stringify(this.props.selections) !== JSON.stringify(nextProps.selections)) ||
            (JSON.stringify(this.props.display) !== JSON.stringify(nextProps.display)) ||
            (this.props.step !== nextProps.step)
    }
    prepareData (nextProps) {
        const { config, data, dataset, zone } = nextProps
        // prepare the data for display
        const selectedConfig = getSelectedMatch(config, zone)
        // First prop

        // const color = getPropPalette(palettes, selectedConfig.properties[0].path, 1)
        let details = prepareDetailData(data, dataset)
        // 

        // Save to reuse in render
        this.customState = {
            ...this.customState,
            details,
            selectedConfig
        }
    }
    selectEnsemble (prop, value, category) {
        const elements = this.layout.getElements(prop, value, category)
        const { selectElements, zone, selections } = this.props
        selectElements(elements, zone, selections)
    }
    getElementsInZone () {
        return []
    }
    render () {
        const { config, dimensions, display, role, selections, step, zone } = this.props
       
        return (<g className = { `ListProp ${this.customState.elementName} role_${role}` } >
            { role !== 'target' &&
            <SelectionZone
                zone = { zone }
                dimensions = { display.zones[zone] }
                handleMouseMove = { this.props.handleMouseMove }
                layout = { this }
                selections = { selections }
            />
            }
            { step !== 'changing' && this.customState.details &&
            <foreignObject
                transform = { `translate(${dimensions.x}, ${dimensions.y})` }
                with = { dimensions.width }
                height = { dimensions.height }
                onMouseMove = { (e) => { this.props.handleMouseMove(e, zone) } }
                onMouseUp = { (e) => { this.props.handleMouseUp(e, zone, display, this, selections) } }
                onMouseDown = { (e) => { this.props.handleMouseDown(e, zone, display) } }
            >
                <div className = "box" style = {{ width: dimensions.width + 'px' }}>
                    <div className = "tabs">
                        <ul>
                            { Array.from(Array(this.customState.details.length)).map((el, i) => { return (
                                <li
                                    className =  { (i === this.state.selectedIndex) ? `is-active` : `` }
                                    key = { `tab_${zone}_${i}` }
                                    onMouseUp = { () => this.setState({ selectedIndex: i }) }
                                ><a>
                                        { (i === 0) ? `entities` : formatMessage(`{ level, plural,
                                            =1 {1st}
                                            =2 {2nd}
                                            =3 {3rd}
                                            other {#th}
                                        } level`, {
                                            level: i
                                        })
                                        }
                                    </a>
                                </li>
                            )}) }
                        </ul>
                    </div>
                    <div className = "content">
                        { (this.state.selectedIndex > 0) &&
                            this.customState.details[this.state.selectedIndex].map((el, i) => (<p key = { `contenttab_${zone}_${i}` }  className = "is-clipped is-size-7" style = {{ 'maxHeight': 4.3 + 'em' }}>
                                <strong>{ (this.state.selectedIndex === 0) ? '' : 
                                    el.readablePath.map((part, index) => {
                                        return <span key = { `${this.state.elementName}_path_${index}` }>
                                            <span title = { part.comment }>&nbsp;{part.label} </span> { (index < el.readablePath.length - 1) ? '/' : '' }
                                        </span>
                                    }) }</strong> 
                                <span>{ (this.state.selectedIndex === 0) ? el : el[`prop${(this.state.selectedIndex)}`].map(v => `${v.value}${(v.count > 1) ? ' (' + v.count + '), ' : ', '}`)}</span>
                            </p>)) 
                        }
                        { (this.state.selectedIndex === 0) &&
                            this.customState.details[this.state.selectedIndex].map((el, i) => (<span key = { `contenttab_${zone}_${i}` }  className = "is-size-7">
                                {el + ', '} 
                            </span>))
                        }
                    </div>
                </div>
            </foreignObject>
            }
            { role !== 'target' &&
            <g>
                <Header
                    zone = { zone }
                    config = { config }
                    propsLists = { [] }
                />
                <Coverage
                    zone = { zone }
                    config = { config }
                />
                <Nav
                    zone = { zone }
                    config = { config }
                    propsLists = { [] }
                />
                <History
                    zone = { zone }
                />
            </g>
            }
        </g>)
    }
    componentDidMount () {
        this.props.handleTransition(this.props, [])
    }
    componentDidUpdate () {
        this.props.handleTransition(this.props, [])
    }
}

ListAllProps.propTypes = {
    config: PropTypes.object,
    data: PropTypes.array,
    dataset: PropTypes.object,
    dimensions: PropTypes.object,
    display: PropTypes.object,
    selections: PropTypes.array,
    role: PropTypes.string,
    step: PropTypes.string,
    zone: PropTypes.string,
    handleKeyDown: PropTypes.func,
    handleMouseDown: PropTypes.func,
    handleMouseMove: PropTypes.func,
    handleMouseUp: PropTypes.func,
    handleTransition: PropTypes.func,
    selectElements: PropTypes.func
}

function mapStateToProps (state) {
    return {
        configs: state.configs,
        dataset: state.dataset,
        display: state.display,
        palettes: state.palettes,
        selections: state.selections
    }
}

function mapDispatchToProps (dispatch) {
    return {
        getPropPalette: getPropPalette(dispatch),
        handleMouseDown: handleMouseDown(dispatch),
        handleMouseUp: handleMouseUp(dispatch),
        selectElements: selectElements(dispatch)
    }
}

const ListAllPropsConnect = connect(mapStateToProps, mapDispatchToProps)(ListAllProps)

export default ListAllPropsConnect
