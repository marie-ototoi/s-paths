import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { loadResources, loadStats } from '../../actions/dataActions'

class Back extends React.PureComponent {
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
                        <button
                            onClick = { e => {
                                //console.log(this.props.dataset)
                                this.props.loadResources({ ...this.props.dataset, forceUpdate: true }, this.props.views)
                            } }
                        >
                            Resources
                        </button>
                        <button
                            onClick = { e => {
                                //console.log(this.props.dataset)
                                this.props.loadStats({ ...this.props.dataset, forceUpdate: true })
                            } }
                        >
                            Stats
                        </button>                    
                    </div>
                </div>
            </foreignObject>
        </g>)
    }
}

Back.propTypes = {
    dataset: PropTypes.object,
    dimensions: PropTypes.object,
    display: PropTypes.object,
    views: PropTypes.array,
    zone: PropTypes.string,
    loadResources: PropTypes.func,
    loadStats: PropTypes.func,
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
        loadResources: loadResources(dispatch),
        loadStats: loadStats(dispatch)
    }
}

const BackConnect = connect(mapStateToProps, mapDispatchToProps)(Back)

export default BackConnect
