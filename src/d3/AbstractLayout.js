// import * as d3 from 'd3'

export class AbstractLayout { 
    constructor (el, props) {
        if (el) {
            this.el = el
            this.draw(props)
            this.resize(props)
        }
    }
    update (props) {
        if (this.el) {
            this.draw(props)
            this.resize(props)
        }
    }
    destroy () {
        // d3.select(this.el)
            // .selectAll('*')
            // .remove()
    }
    draw (props) {
    }
    resize (props) {
    }
}