import React from 'react'

const zonesDef = {
    center: { x: 19, y: 19, width: 60, height: 60 },
    left: { x: 2, y: 19, width: 17, height: 60 },
    top: { x: 19, y: 2, width: 60, height: 17 },
    right: { x: 79, y: 19, width: 17, height: 60 },
    bottom: { x: 19, y: 79, width: 60, height: 17 }
}

class Main extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            zones : zonesDef
        }
    }

    componentDidMount () {
        
    }

    componentWillUpdate () {
        //console.log('update ',this.props)
        //this.setState({ zones })
    }

    render () {
        const { store } = this.context
        let zones = this.scalesZones({ width: this.props.width, height: this.props.height })
        return (<g 
            className = "main" 
            transform = { `translate(${ this.props.x }, ${ this.props.y })` }
        >
            <rect x = { zones.left.x } y = { zones.left.y } width = { zones.left.width } height = { zones.left.height } />
            <rect x = { zones.right.x } y = { zones.right.y } width = { zones.right.width } height = { zones.right.height } />
            <rect x = { zones.top.x } y = { zones.top.y } width = { zones.top.width } height = { zones.top.height } />
            <rect x = { zones.bottom.x } y = { zones.bottom.y } width = { zones.bottom.width } height = { zones.bottom.height } />
            <rect x = { zones.center.x } y = { zones.center.y } width = { zones.center.width } height = { zones.center.height } />
        </g>)
    }
    scalesZones (stage) {
        let zones = {}
        for (let zone in zonesDef) {
            if (zonesDef.hasOwnProperty(zone)) {
                zones [zone] = { 
                    name: zonesDef[zone].name, 
                    x: this.scaleX(zonesDef[zone].x, stage), 
                    y: this.scaleY(zonesDef[zone].y, stage), 
                    width: this.scaleX(zonesDef[zone].width, stage), 
                    height: this.scaleY(zonesDef[zone].height, stage)
                }
            }
        }
        //console.log(zones)
        return zones
    }
    scaleX (xPoint, stage) {
        return Math.floor(stage.width * xPoint / 100) - 1
    }
    scaleY (yPoint, stage) {
        return Math.floor(stage.height * yPoint / 100) - 1
    }
}

Main.contextTypes = { store: React.PropTypes.object }

export default Main
