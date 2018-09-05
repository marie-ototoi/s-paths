import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { analyseResources, loadStats } from '../../actions/dataActions'

class Settings extends React.PureComponent {
    constructor (props) {
        super(props)
        this.state = {}
    }
    render () {
        const { dataset, dimensions, zone } = this.props
        const { x, y, width, height } = dimensions
        return (<g
            className = "Settings"
            transform = { `translate(${x}, ${y})` }
        >
            <foreignObject
                width = { width }
                height = { height }
                fill = "#fff"
            >
                <div className = "box">
                    <div className = "content">
                        <div className = "field">
                            <label className = "label">Graphs</label>
                            <div className ="control">
                                to do
                            </div>
                        </div>
                        <div className = "field">
                            <label className = "label">Max depth</label>
                            <div className ="control">
                               to do
                            </div>
                        </div>

                        { dataset.resources.lenght === 0 &&
                        <button
                            onClick = { e => {
                                //console.log(this.props.dataset)
                                this.props.analyseResources({ ...this.props.dataset, forceUpdate: true }, [])
                            } }
                        >
                            Get Resources
                        </button>
                        }
                        <table className = "table is-bordered">
                            <tbody>
                                { dataset.resources.map((resource, ri) => {
                                    return (<tr key = { `resource_${zone}_${ri}` }>
                                        <td>{ resource.type }</td>
                                        <td><a onClick = { e => this.props.analyseResources(dataset, [resource.type]) }>generate subgraph</a></td>
                                        <td><a onClick = { e => {
                                            this.props.loadStats({
                                                ...dataset,
                                                analyse: true,
                                                resourceGraph: resource.type,
                                                entrypoint: resource.type,
                                                totalInstances: resource.total,
                                                selectionInstances: resource.total
                                            })
                                        } }>analyze stats</a></td>
                                    </tr>)
                                }) }
                            </tbody>
                        </table>                   
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
    analyseResources: PropTypes.func,
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
        analyseResources: analyseResources(dispatch),
        loadStats: loadStats(dispatch)
    }
}

const SettingsConnect = connect(mapStateToProps, mapDispatchToProps)(Settings)

export default SettingsConnect
