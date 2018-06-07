import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import formatMessage from 'format-message'
import { getReadablePathsParts, prepareDetailData } from '../../lib/dataLib'
import { hideDetail } from '../../actions/displayActions'

class Detail extends React.PureComponent {
    constructor (props) {
        super(props)
        //this.selectElement = this.selectElement.bind(this)
        this.customState = {
            elementName: `Detail_${props.zone}`
        }
        this.state = {
            selectedIndex: 0
        }
        //this.prepareData(props)
    }
    render () {
        const { dataset, dimensions, elements, zone } = this.props
        let details = elements.length > 0 ? prepareDetailData(elements, dataset) : [[]]
        const { x, y, width, height } = dimensions
        console.log(details)

        return (<g
            className = "Detail"
            transform = { `translate(${x}, ${y})` }
        >
            <foreignObject
                width = { width }
                height = { height }
                fill = "#fff"
            >
                <div className = "box">
                    <span className="icon is-pulled-right" onMouseUp = { () => this.props.hideDetail(zone) }>
                        <i className="fas fa-times-circle"></i>
                    </span>
                    <div className = "tabs">
                        <ul>
                            { Array.from(Array(details.length)).map((el, i) => { return (
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
                        { details[this.state.selectedIndex].map((el, i) => (<p key = { `contenttab_${zone}_${i}` }  className = "is-clipped is-size-7" style = {{ 'maxHeight': 4.3 + 'em' }}>
                            <strong>{ (this.state.selectedIndex === 0) ? '' : 
                                el.readablePath.map((part, index) => {
                                    return <span key = { `${this.state.elementName}_path_${index}` }>
                                        <span title = { part.comment }>&nbsp;{part.label} </span> { (index < el.readablePath.length - 1) ? '/' : '' }
                                    </span>
                                }) }</strong> 
                            <span>{ (this.state.selectedIndex === 0) ? el : el[`prop${(this.state.selectedIndex)}`].map(v => `${v.value}${(v.count > 1) ? ' (' + v.count + '), ' : ', '}`)}</span>
                        </p>)) }
                    </div>
                </div>
            </foreignObject>
        </g>)
    }
}

Detail.propTypes = {
    config: PropTypes.object,
    configs: PropTypes.object,
    dataset: PropTypes.object,
    dimensions: PropTypes.object,
    display: PropTypes.object,
    elements: PropTypes.array,
    offset: PropTypes.object,
    propsLists: PropTypes.array,
    zone: PropTypes.string,
    hideDetail: PropTypes.func
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
        hideDetail: hideDetail(dispatch)
    }
}

const DetailConnect = connect(mapStateToProps, mapDispatchToProps)(Detail)

export default DetailConnect
