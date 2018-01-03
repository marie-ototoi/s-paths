import React from 'react'
import pluralize from 'pluralize'
import { connect } from 'react-redux'

class Header extends React.PureComponent {
    render () {
        const { data, dataset, dimensions, zone } = this.props
        // console.log(dataset.labels)
        return (<g className = "Header"
            transform = { `translate(${dimensions.x}, ${dimensions.y})` }
            ref = { `header_${zone}` }
        >
            <text>
                { pluralize(dataset.labels[0].label, data.length) + ' in ' + this.props.dataset.endpoint }
            </text>
        </g>)
    }
    componentDidMount () {
    }
    componentDidUpdate () {
    }
    componentWillUnmount () {
    }
}

function mapStateToProps (state) {
    return {
        dataset: state.dataset.present,
        data: state.data
    }
}

function mapDispatchToProps (dispatch) {
    return {
    }
}

const HeaderConnect = connect(mapStateToProps, mapDispatchToProps)(Header)

export default HeaderConnect
