import React from 'react'
import { connect } from 'react-redux'
import Main from './Main'
import Aside from './Aside'
import Debug from './Debug'
import svgScale from '../svg/scale'
import explore from '../model/explore'
import select from '../model/select'
import rank from '../model/rank'



// definitions as percentage
const displayDef = {
    dev: { x: 0, y: 0, width: 100, height: 100},
    full: { x: 35, y: 35, width: 40, height: 40},
    main: { x: 35, y: 35, width: 30, height: 30},
    aside: { x: 70, y: 35, width: 30, height: 30}
}

class App extends React.Component {
    constructor (props) {
        super(props)
        this.resize = this.resize.bind(this)
        window.addEventListener("resize", this.resize)
    }
    componentWillMount () {
        
    }
    componentDidMount () {
        console.log('did Mount',)
        //this.viewSelection()
        this.resize()
    }

    addToSelection () {

    }
    
    /*viewSelection () {
        explore.exploreProperties(this.state.selection)
        .then(stats => {
            this.setState({ stats })
            return rank.rankViews(stats)
        })
        .then(views => {
            this.setState({ views })
            return select.selectView({ options: 'to_be_defined' })
        })
        .then(selectedView => {
            this.setState({ selectedView })
            return datapoint.getData(this.state.selection, this.state.selectedView)
        })
        .then(selectedView => {
            this.setState({ selectedView })
            return datapoint.getData(this.state.selection, this.state.selectedView)
        })
        .catch(err => {
            console.error(err)
        })
    }*/
    
    componentWillUpdate () {
        //console.log('will update')
    }

    render () {
        const { display } = this.props
        
        return (<div 
            className = "view" 
            style = {{ width: display.screen.width + 'px' }}
        >
            <svg
                ref = "view"
                width = { display.screen.width }
                height = { display.screen.height }
                viewBox = { `${ display.viewBox.x }, ${ display.viewBox.y }, ${ display.viewBox.width }, ${ display.viewBox.height }` }
                preserveAspectRatio = "xMinYMin meet"
            >
                { this.props.env === "dev" &&
                    <Debug  />
                }
                <Main />
                <Aside />
            </svg>
        </div>)
    }

    setError(error) {
        //console.log('error', error)
      
    }

    resize () {
        const { display } = this.props

        let screen = {}
        screen.height = window.innerHeight - 5
        screen.width = window.innerWidth - 5
        
        let viewBoxDef = (this.props.env === 'dev')? display.zonesDefPercent.dev : display.zonesDefPercent[this.props.mode]
        let stage = svgScale.scaleStage(viewBoxDef, screen)
        let viewBox = svgScale.scaleViewBox(viewBoxDef, stage)
        let grid = svgScale.getGrid(display.gridDefPercent, stage)

        let zones = {}
        zones.main =  svgScale.scaleViewBox(display.zonesDefPercent.main, stage)
        zones.aside = svgScale.scaleViewBox(display.zonesDefPercent.aside, stage)
        zones.aside.rotation = 0
        zones.full =  svgScale.scaleViewBox(display.zonesDefPercent.full, stage)
        zones.dev =  svgScale.scaleViewBox(display.zonesDefPercent.dev, stage)
        
        const { store } = this.context
        store.dispatch({
            type: 'SET_DISPLAY',
            screen,
            viewBox, 
            stage, 
            grid,
            zones
        })
    }


}
App.contextTypes = { store: React.PropTypes.object }

function mapStateToProps(state) {
    return {
        display: state.display
    }
}
function mapDispatchToProps(state) {
    return {
    }
}
const AppConnect = connect(mapStateToProps, mapDispatchToProps)(App)

export default AppConnect
