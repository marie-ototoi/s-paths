import React from 'react'

class Debug extends React.Component {

    componentDidMount () {
    }

    componentWillUpdate () {
    }
    
    render () {
        const { store } = this.context
        console.log('state', store.getState())
        let xLines 
        let yLines
        if(this.props.grid){
            xLines = this.props.grid.xPoints.map(point => {
                return (<line 
                    x1 = { point } 
                    y1 = "0" 
                    x2 = { point } 
                    y2 = { this.props.stage.height } 
                    key = { `x${ point }` } 
                    className = "gridline" 
                />)
            })
            yLines =  this.props.grid.yPoints.map(point => {
                return (<line 
                    y1 = { point } 
                    x1 = "0" 
                    y2 = { point } 
                    x2 = { this.props.stage.width }  
                    key = { `y${ point }` } 
                    className = "gridline" 
                />)
            })
        }
        return (<g className = "debug">
            {xLines}
            {yLines}
        </g>)
    }
}

Debug.contextTypes = { store: React.PropTypes.object }

export default Debug
