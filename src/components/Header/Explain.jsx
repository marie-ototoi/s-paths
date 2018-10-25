import React from 'react'
import PropTypes from 'prop-types'
import pluralize from 'pluralize'
import { connect } from 'react-redux'
import { getCurrentConfigs, getSelectedMatch, getSelectedView } from '../../lib/configLib'
import { getGraphsColors } from '../../lib/paletteLib'
import { showGraphs } from '../../actions/displayActions'

import './Explain.css'

class Explain extends React.Component {
    render () {
        const { configs, zone } = this.props

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

        return (
            <div
                className='Explain'
                style={{
                    marginLeft: `${this.props.display.viz.horizontal_padding}px`
                }}
            >
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
                <span className='resource-def' onClick={(e) => this.props.showGraphs() }>?</span>
            </div>
        )
    }

    static propTypes = {
        configs: PropTypes.object,
        dataset: PropTypes.object,
        display: PropTypes.object,
        zone: PropTypes.string,
        options: PropTypes.object.isRequired,
        showGraphs: PropTypes.func
    }
}

const ExplainConnect = connect(
    (state) => ({
        configs: state.configs,
        dataset: state.dataset,
        display: state.display
    }),
    (dispatch) => ({
        showGraphs: showGraphs(dispatch)
    })
)(Explain)

export default ExplainConnect
