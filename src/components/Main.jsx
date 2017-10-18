import React from 'react'

class Main extends React.Component {

    componentDidMount () {
    }

    componentWillUpdate () {
    }
    
    render () {
        return (<g className = "main" transform = { `translate(${35 * this.props.displayRatio }, ${ 35 })` }>
            <rect x = {1} y = {7} width = { 6 } height = { 19 } />
            <rect x = {7} y = {1} width = { 35 } height = { 6 } />
            <rect x = {7} y = {7} width = { 35 } height = { 19 } />
            <rect x = {43} y = {7} width = { 6 } height = { 19 } />
            <rect x = {7} y = {26} width = { 35 } height = { 6 } />
        </g>)
    }
}

export default Main
