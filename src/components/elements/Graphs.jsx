import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { getCurrentConfigs, getSelectedMatch, getSelectedView } from '../../lib/configLib'
import { getGraphsColors } from '../../lib/paletteLib'
import { showGraphs } from '../../actions/displayActions'

class Graphs extends React.PureComponent {
    constructor (props) {
        super(props)
        this.state = {}
    }
    render () {
        
        const { configs, dimensions, zone } = this.props
        const { x, y, width, height } = dimensions

        let selectedConfig = getSelectedView(getCurrentConfigs(configs, zone, 'active'))
        let selectedProperties = getSelectedMatch(selectedConfig).properties

        let allgraphs = [...new Set(selectedProperties.reduce((acc, cur) => {
            acc.push(...cur.graphs)
            return acc
        }, []))]

        const colors = getGraphsColors()

        const graphs = {}
        selectedProperties[0].graphs.forEach((graph, gi) => {
            graphs[graph] = colors[gi]
        })

        let displayedResource = this.props.dataset.resources.find((resource) =>
            resource.type === this.props.dataset.entrypoint
        )
        return (<div
            className = "Graphs box"
            style = {
                {
                    width,
                    minHeight: height,
                    zIndex: 12,
                    position: 'absolute',
                    left: x + 'px',
                    top: y + 'px'
                }
            }
        >
            <div className = "content">
                <span
                    className='icon closebox'
                    onClick={() => { this.props.showGraphs() }}
                >
                    <i className='fas fa-window-close' />
                </span>

                <strong>Traversed graphs: </strong>
                <ul className="graphList">
                    {allgraphs.map((graph, gi) => (
                        <li
                            style={{ color: graphs[graph] }}
                            key={`graph_${zone}_${gi}`}
                        >
                            {graph}
                        </li>
                    ))}
                </ul>
                {selectedProperties.map((prop, pi) => (
                    <div
                        className='path'
                        key={`path_${zone}_${pi}`}
                    >
                        <strong>Path {(pi + 1)}:&nbsp;</strong>
                        <span
                            style={{ borderBottom: `1px solid ${graphs[prop.triplesGraphs[0]]}` }}
                        >
                            {displayedResource.label} /&nbsp;
                        </span>
                        {prop.readablePath.map((rp, rpi) => (
                            <span
                                className='triple'
                                style={{
                                    borderBottom: `1px solid ${graphs[prop.triplesGraphs[rpi]]}`,
                                    paddingLeft: `${5 + (rpi < 1 ? 0 : 20)}px`,
                                    paddingBottom: `${(rpi % 2 === 0 ? 0 : 1) * 3}px`,
                                    position: 'relative',
                                    left: `-${5 + (rpi * 20)}px`
                                }}
                                key={`path_${zone}_${pi}_triple_${rpi}`}
                            >
                                <span
                                    className='pathlabel'
                                    title={rp.comment}
                                >
                                    { rp.label }
                                </span>
                                &nbsp;/ * / 
                            </span>
                        ))}
                    </div>
                ))}

            </div>
        </div>)
    }
}

Graphs.propTypes = {
    configs: PropTypes.object,
    dataset: PropTypes.object,
    dimensions: PropTypes.object,
    display: PropTypes.object,
    views: PropTypes.array,
    zone: PropTypes.string,
    analyseResources: PropTypes.func,
    loadStats: PropTypes.func,
    showGraphs: PropTypes.func
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
        showGraphs: showGraphs(dispatch)
    }
}

const GraphsConnect = connect(mapStateToProps, mapDispatchToProps)(Graphs)

export default GraphsConnect
