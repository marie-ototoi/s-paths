import React from 'react'
import PropTypes from 'prop-types'
import pluralize from 'pluralize'
import { connect } from 'react-redux'
import { getCurrentConfigs, getSelectedMatch, getSelectedView } from '../../lib/configLib'
import { getGraphsColors } from '../../lib/paletteLib'

import './Explain.css'

class Explain extends React.Component {
    render () {
        const { configs, zone } = this.props

        let selectedConfig = getSelectedView(getCurrentConfigs(configs, zone, 'active'), zone)
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

        return (
            <div
                className='Explain'
                style={{
                    marginTop: `${Math.floor((this.props.display.viz.top_margin - 155) / 2)}px`,
                    marginLeft: `${this.props.display.viz.horizontal_padding}px`
                }}>
                <p>
                    You are visualizing
                    <strong>
                        {this.props.options.total} { pluralize('entity', this.props.options.total)}
                    </strong>
                    belonging to the class of resources
                    <strong>
                        {displayedResource.label}
                    </strong>
                    according to
                    <strong>
                        {selectedProperties.length} property {pluralize('path', selectedProperties.length)}
                    </strong>
                    traversing
                    <strong>
                        {allgraphs.length} {pluralize('graph', allgraphs.length)}
                    </strong>
                </p>
                <span className='resource-def'>?
                    <div
                        className='resource-content'
                        style={{ margin: '-55px 0 0 0' }}
                    >
                        <span>Graphs: </span>
                        <ul>
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
                                Path {(pi + 1)}:
                                <span
                                    style={{ borderBottom: `1px solid ${graphs[prop.triplesGraphs[0]]}` }}
                                >
                                    {displayedResource.label} /
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
                                        / * /
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </span>
            </div>
        )
    }

    static propTypes = {
        configs: PropTypes.object,
        dataset: PropTypes.object,
        display: PropTypes.object,
        zone: PropTypes.string,
        options: PropTypes.object.isRequired
    }
}

const ExplainConnect = connect(
    (state) => ({
        configs: state.configs,
        dataset: state.dataset,
        display: state.display
    })
)(Explain)

export default ExplainConnect
