import * as d3 from 'd3'

class AbstractLayout {
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
            this.checkSelection(props)
        }
    }
    destroy () {
        d3.select(this.el)
            .selectAll('*')
            .remove()
    }
    draw (props) {}
    resize (props) {}
    checkSelection (props) {}
}

export default AbstractLayout
