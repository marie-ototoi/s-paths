import PropTypes from 'prop-types'
import React from 'react'
// import pluralize from 'pluralize'
import { connect } from 'react-redux'
import PropSelector from './PropSelector'
import { getDimensions } from '../../lib/scaleLib'

class Header extends React.PureComponent {
    render () {
        const { config, dataset, display, zone } = this.props
        const dimensions = getDimensions('header', display.zones[zone], display.viz, {})
        const { x, y, width, height } = dimensions
        // console.log(dataset.resources)
        return (
            <g className = "Header">
                <foreignObject
                    transform = { `translate(${x}, ${y})` }
                    ref = { this.state.elementName }
                    width = { width }
                    height = { height }
                >
                    <form>
                        <div className = "line">
                            <div className = "field">
                                <label className = "label">Set of resources</label>
                                <div className ="control">
                                    <div className ="select">
                                        <select>
                                            <option>Award file</option>
                                            <option>...</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <input type="submit" />                            
                        </div>

                        <div className = "line">
                            <div className = "field">
                                <label className = "label">Set of resources</label>
                                <div className ="control">
                                    <input className ="input" type="text" placeholder="Text input" />
                                </div>
                            </div>
                            <input type="submit" />
                        </div>
                    </form>
                </foreignObject>
                <PropSelector
                    type = "header"
                    selected = { false }
                    key = { zone + '_propselector_resources' }
                    propList = { dataset.resources.map((resource, index) => { return { total: resource.total, readablePath: [{ label: resource.label, comment: resource.comment }], path: resource.type, selected: resource.type === dataset.entrypoint } }) }
                    config = { config }
                    dimensions = { getDimensions('header', display.zones[zone], display.viz, { x: 0, y: 0, width: 0, height: 0 }) }
                    zone = { zone }
                />
            </g>
        )
    }
}

Header.propTypes = {
    config: PropTypes.object,
    dataset: PropTypes.object,
    dimensions: PropTypes.object,
    display: PropTypes.object,
    zone: PropTypes.string,
}

function mapStateToProps (state) {
    return {
        dataset: state.dataset,
        data: state.data,
        display: state.display
    }
}

function mapDispatchToProps (dispatch) {
    return {
    }
}

const HeaderConnect = connect(mapStateToProps, mapDispatchToProps)(Header)

export default HeaderConnect
