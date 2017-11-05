import React from 'react'
import { connect } from 'react-redux'

class Aside extends React.Component {
    componentDidMount () {
    }

    componentWillUpdate () {
    }

    render () {
        const { display } = this.props

        return (<g
            className = "Aside"
            transform = { `translate(${display.zones.aside.x}, ${display.zones.aside.y})` }
        >
            <rect x = {1} y = {1} width = { 10} height = { 24 } fill = '#0F0' />
            <rect x = {12} y = {1} width = { 30 } height = { 24 } fill = '#f00' />
            <rect x = {1} y = {26} width = { 41 } height = { 6 } fill = '#00f' />
        </g>)
    }
}

function mapStateToProps (state) {
    return {
        display: state.display
    }
}
function mapDispatchToProps (state) {
    return {
    }
}
const AsideConnect = connect(mapStateToProps, mapDispatchToProps)(Aside)

export default AsideConnect
