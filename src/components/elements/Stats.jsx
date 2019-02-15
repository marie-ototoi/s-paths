import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { analyseResources, loadResources, loadStats, countPaths } from '../../actions/dataActions'
import { showStats } from '../../actions/displayActions'
import { saveGraphs } from '../../actions/configActions'

class Stats extends React.PureComponent {
    constructor (props) {
        super(props)
        this.state = { graphs: props.dataset.graphs.join(', ') }
    }
    render () {
        const { dataset, dimensions, zone } = this.props
        const { x, y, width, height } = dimensions
        // console.log(dataset)
        return (<div
            className = "Stats box"
            style = {
                {
                    width,
                    height,
                    position: 'absolute',
                    left: x + 'px',
                    top: y + 'px',
                    overflowY: 'scroll'
                }
            }
        >
            <div className = "content">
                <span
                    className='icon closebox'
                    onClick={() => { this.props.showStats() }}
                >
                    <i className='fas fa-window-close' />
                </span>
                <h2>Graphs</h2>
                <div className = "field">
                    <label className = "label">Graphs
                        <input
                            value={this.state.graphs}
                            onChange={e => this.setState({ graphs: e.target.value })}
                        />
                    </label>
                </div>
                <button
                    onClick = { e => {
                        //console.log(this.props.dataset)
                        let graphs = this.state.graphs.split(",").map(g => g.trim())
                        this.props.loadResources({...dataset, graphs}, this.props.views)
                    } }
                >
                    Save graphs
                </button>
                { dataset.resources.length === 0 &&
                <button
                    onClick = { e => {
                        //console.log(this.props.dataset)
                        this.props.analyseResources({ ...this.props.dataset, forceUpdate: true })
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
                                <td>{ resource.total }</td>
                                <td>{ resource.pathsNumber }</td>
                                <td><a onMouseUp = { e => {
                                    this.props.countPaths({
                                        ...dataset,
                                        entrypoint: resource.type
                                    })
                                } }>count paths</a></td>
                                <td><a onMouseUp = { e => {
                                    this.props.loadStats({
                                        ...dataset,
                                        analyse: true,
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
        </div>)
    }
}

Stats.propTypes = {
    dataset: PropTypes.object,
    dimensions: PropTypes.object,
    display: PropTypes.object,
    views: PropTypes.array,
    zone: PropTypes.string,
    analyseResources: PropTypes.func,
    loadStats: PropTypes.func,
    saveGraphs: PropTypes.func,
    showStats: PropTypes.func,
    loadResources: PropTypes.func,
    countPaths: PropTypes.func
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
        countPaths: countPaths(dispatch),
        loadStats: loadStats(dispatch),
        loadResources: loadResources(dispatch),
        showStats: showStats(dispatch),
        saveGraphs: saveGraphs(dispatch)
    }
}

const StatsConnect = connect(mapStateToProps, mapDispatchToProps)(Stats)

export default StatsConnect
