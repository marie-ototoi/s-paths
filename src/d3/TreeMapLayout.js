import * as d3 from 'd3'
import AbstractLayout from './AbstractLayout'
import * as dataLib from '../lib/dataLib'
import * as selectionLib from '../lib/selectionLib'

class TreeMapLayout extends AbstractLayout {
    draw (props) {
        const { color, nestedProp1, selectedConfig, selections, zone } = props
        // console.log(nestedProp1)
        const units = d3.select(this.el)
            .selectAll('g.units')
            .data(nestedProp1)
        const unitsEnter = units
            .enter()
            .append('g')
            .attr('class', 'units')

        unitsEnter
            .append('rect')
        unitsEnter
            .append('text')
            .text(d => d.key)
        units
            .exit()
            .remove()

        d3.select(this.el)
            .selectAll('g.units')
            .each((d, i) => {
                // console.log(d)
                // d.color = legend.info.filter(p => (p.key === d.values[0].prop2.value || (d.values[0].labelprop2 && p.key === d.values[0].labelprop2.value)))[0].color
                d.color = color
                d.selection = {
                    selector: `treemap_element_p1_${dataLib.makeId(d.key)}`,
                    count: (d.values.length > 0) ? Number(d.values[0].countprop1.value) : 1,
                    query: {
                        type: 'set',
                        value: [{
                            category: selectedConfig.properties[0].category,
                            value: d.key,
                            propName: 'prop1'
                        }]
                    }
                }
                // console.log(d.selection.selector)
                d.shape = 'rectangle'
                d.zone = {}
                d.selected = selectionLib.areSelected([d.selection], zone, selections)
                // console.log(d)
            })
            .attr('id', d => d.selection.selector) // only needed to better understand html source code
            .classed('selected', d => d.selected)
            // .attr('fill', d => d.color)
            .attr('opacity', d => {
                return (selections.length > 0 && d.selected !== true) ? 0.5 : 1
            })
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
            results.push({ zone: d.zone, ...d.selection, color: d.color, opacity: d.opacity, shape: d.shape, rotation: 0 })
        })
        // console.log(results)
        return results
    }

    getElementsInZone (props) {
        const selectedZone = {
            x1: props.zoneDimensions.x1 - props.display.viz.horizontal_margin,
            y1: props.zoneDimensions.y1 - props.display.viz.vertical_margin,
            x2: props.zoneDimensions.x2 - props.display.viz.horizontal_margin,
            y2: props.zoneDimensions.y2 - props.display.viz.vertical_margin
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
        const { display, nestedProp1 } = props
        let width = display.viz.useful_width
        let height = display.viz.useful_height // Math.floor(display.viz.useful_height * displayedInstances / dataset.stats.selectionInstances)
        if (height > display.viz.useful_height) height = display.viz.useful_height
        let map = dataLib.splitRectangle({ x1: 0, y1: 0, width, height }, nestedProp1.map(propgroup => {
            return (propgroup.values.length > 0) ? {
                name: propgroup.key,
                size: Number(propgroup.values[0].countprop1.value)
            } : propgroup
        }))
        // console.log(display.viz.useful_height, displayedInstances, dataset.stats.selectionInstances, height)
        d3.select(this.el).selectAll('g.units')
            .each((d, i) => {
                d.zone = {
                    ...map[i].zone,
                    y1: (display.viz.useful_height - height) + map[i].zone.y1
                }
            })
            .attr('transform', (d, i) => `translate(${map[i].zone.x1}, ${(display.viz.useful_height - height) + map[i].zone.y1})`)
        d3.select(this.el).selectAll('g.units rect')
            .attr('width', (d, i) => map[i].zone.width)
            .attr('height', (d, i) => map[i].zone.height)
            .attr('fill', d => d.color)
        d3.select(this.el).selectAll('g.units text')
            .attr('x', 5)
            .attr('y', 20)
            .attr('fill', '#fff')
        props.handleTransition(props, this.getElementsForTransition(props))
    }
}
export default TreeMapLayout