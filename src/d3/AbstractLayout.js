import * as d3 from 'd3'
import * as selectionLib from '../lib/selectionLib'

class AbstractLayout {
    constructor (el, props) {
        // console.log('create', el)
        if (el) {
            this.el = el
            this.draw(props)
            this.resize(props)
        }
    }
    update (el, props) {
        // console.log('update', this.el)
        if (el) {
            this.el = el
            this.draw(props)
            this.resize(props)
            this.checkSelection(props)
        }
        // console.log('vidé ?', this.el)
    }
    destroy (el) {
        this.el = el
        // console.log('destroy', this.el)
        d3.select(this.el)
            .selectAll('*')
            .remove()
    }
    draw (props) {}
    resize (props) {}
    checkSelection (props) {
    }
    drawSelection (props) {
        const zoneDimensions = selectionLib.getRectSelection(props.display.selectedZone[props.zone])
        const selectedZone = {
            x1: zoneDimensions.x1 - props.display.viz.horizontal_margin,
            y1: zoneDimensions.y1 - props.display.viz.vertical_margin,
            x2: zoneDimensions.x2 - props.display.viz.horizontal_margin,
            y2: zoneDimensions.y2 - props.display.viz.vertical_margin
        }
        d3.select(this.el).selectAll('rect.selection')
            .data([selectedZone])
            .enter()
            .append('rect')
            .attr('class', 'selection')
            .on('mouseup', d => {
                props.handleMouseUp({ pageX: d3.event.pageX, pageY: d3.event.pageY }, props.zone)
            })

        d3.select(this.el).select('rect.selection')
            .attr('width', selectedZone.x2 - selectedZone.x1)
            .attr('height', selectedZone.y2 - selectedZone.y1)
            .attr('x', selectedZone.x1)
            .attr('y', selectedZone.y1)
    }
}

export default AbstractLayout
