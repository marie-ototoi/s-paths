import React from 'react'

class Aside extends React.Component {

    componentDidMount () {
    }
    componentWillUpdate () {
    }
    render () {
        return (<g className = "aside" transform = { `translate(150, 35)` }>
            <rect x = {1} y = {1} width = { 10} height = { 24 } fill = '#0F0' />
            <rect x = {12} y = {1} width = { 30 } height = { 24 } fill = '#f00' />
            <rect x = {1} y = {26} width = { 41 } height = { 6 } fill = '#00f' />
        </g>)
    }
}

export default Aside
