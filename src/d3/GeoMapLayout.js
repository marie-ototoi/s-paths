import * as d3 from 'd3'
import AbstractLayout from './AbstractLayout'
// import * as dataLib from '../lib/dataLib'
import * as selectionLib from '../lib/selectionLib'

class GeoMapLayout extends AbstractLayout {

    draw (props) {

    }
    drawSelection = (props) => {
        const zoneDimensions = selectionLib.getRectSelection(props.display.selectedZone[props.zone])
        // console.log(zoneDimensions)
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

    getElements (propName, value, propCategory) {
        const isArray = Array.isArray(value)
        let elements = []
        d3.select(this.el).selectAll('g.units').each(d => {
            let propValue
            if (propCategory === 'datetime') {
                propValue = Number(d.parent.key)
            } else if (propCategory === 'text' || propCategory === 'uri') {
                propValue = d.key
            } else if (propCategory === 'number') {
                propValue = Number(d[propName].value)
            } else if (propCategory === 'aggregate') {
                propValue = Number(d[propName])
            }
            if (isArray) {
                if (propValue >= value[0] && propValue <= value[1]) {
                    elements.push(d.selection)
                }
            } else if (propValue === value) {
                elements.push(d.selection)
            }
        })
        return elements
    }

    getElementsForTransition (props) {
        let results = []
        d3.select(this.el).selectAll('g.units').each(d => {
            results.push({ zone: d.zone, ...d.selection, color: d.color, opacity: d.opacity, shape: d.shape })
        })
        // console.log(results)
        return results
    }

    getElementsInZone (props) {
        const zoneDimensions = selectionLib.getRectSelection(props.display.selectedZone[props.zone])
        const selectedZone = {
            x1: zoneDimensions.x1 - props.display.viz.horizontal_margin,
            y1: zoneDimensions.y1 - props.display.viz.vertical_margin,
            x2: zoneDimensions.x2 - props.display.viz.horizontal_margin,
            y2: zoneDimensions.y2 - props.display.viz.vertical_margin
        }
        let selectedElements = []
        d3.select(this.el).selectAll('g.units')
            .each(function (d, i) {
                // console.log(d.zone)
                // console.log(selectionLib.detectRectCollision(selectedZone, elementZone), d3.select(this).node().parentNode.getAttribute('id'), d.selection)
                if (selectionLib.detectRectCollision(selectedZone, d.zone)) selectedElements.push(d.selection)
            })
        // console.log(selectedElements, selectedZone)
        return selectedElements
    }

    resize (props) {
        
    }

    checkSelection (props) {
        if (props.display.selectedZone.x1 !== null) {
            this.drawSelection(props)
        } else {
            d3.select(this.el).selectAll('rect.selection').remove()
        }
    }
}
export default GeoMapLayout
