import * as d3 from 'd3'

class AbstractLayout {
    constructor (el, props) {
        // console.log('create', el)
        if (el) {
            this.el = el
            this.draw(props)
            this.resize(props)
        }
    }
    draw (props) {}
    update (el, props) {
        // console.log('update', this.el)
        if (el) {
            this.el = el
            this.draw(props)
            this.resize(props)
            
        }
        // console.log('vidé ?', this.el)
    }
    resize (props) {}
    destroy (el) {
        this.el = el
        // console.log('destroy', this.el)
        d3.select(this.el)
            .selectAll('*')
            .remove()
    }    
    getElementsInZone(props) {
        return []
    }
}

export default AbstractLayout
