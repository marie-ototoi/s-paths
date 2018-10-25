import * as d3 from 'd3'
import AbstractLayout from './AbstractLayout'
import * as dataLib from '../lib/dataLib'
import * as selectionLib from '../lib/selectionLib'
import { getRelativeRectangle } from '../lib/scaleLib'

class StackedChartLayout extends AbstractLayout {
    draw (props) {
        const { nestedProp1, display, legend, selections, zone } = props
        //console.log(selections)
        const timeUnits = d3.select(this.el)
            .selectAll('g.time')
            .data(nestedProp1)
        timeUnits
            .enter()
            .append('g')
            .attr('class', 'time')
        timeUnits
            .exit()
            .remove()
        const elementUnits = d3.select(this.el).selectAll('g.time').selectAll('g.elements')
            .data(d => d.values)
        elementUnits
            .enter()
            .append('g')
            .attr('class', 'elements')
            .append('rect')
            .attr('class', 'element')
            
        elementUnits
            .exit()
            .remove()

        d3.select(this.el)
            .selectAll('g.time .elements')
            .each((d, i) => {
                d.color = legend.info.filter(p => (p.key === d.prop2.value || (d.labelprop2 && p.key === d.labelprop2.value)))[0].color
                // console.log(zone, d)
                d.selection = {
                    selector: `stackedchart_element_${dataLib.makeId(d.entrypoint.value)}_${i}_${zone}`,
                    index: i,
                    query: {
                        type: 'uri',
                        value: d.entrypoint.value
                    }
                }
                d.shape = 'rectangle'
                d.zone = {}
                d.selected = selectionLib.areSelected([d.selection], zone, selections)
            })
            .attr('id', d => d.selection.selector) // only needed to better understand html source code
            .classed('selected', d => d.selected)
            .attr('fill', d => d.color)
            .attr('opacity', d => {
                d.opacity = (selections.length > 0 && ((selections.some(s => s.zone === zone) && d.selected !== true) || !selections.some(s => s.zone === zone))) ? display.faded[zone] : 1
                return d.opacity
            })
    }
    getElements (propName, value, propCategory) {
        const isArray = Array.isArray(value)
        let elements = []
        d3.select(this.el).selectAll('.elements').each(d => {
            if (d[propName]) {
                let propValue
                if (propCategory === 'datetime') {
                    propValue = Number(d.year)
                } else if (propCategory === 'text' || propCategory === 'uri') {
                    propValue = d[propName].value
                } else if (propCategory === 'number') {
                    propValue = Number(d[propName].value)
                } else if (propCategory === 'aggregate') {
                    //propValue = Number(d[propName].value)
                }
                if (isArray) {
                    if (propValue >= value[0] && propValue <= value[1]) {
                        elements.push(d.selection)
                    }
                } else if (propValue === value) {
                    elements.push(d.selection)
                }
            }
        })
        return elements
    }
    getElementsForTransition (props) {
        let results = []
        d3.select(this.el).selectAll('.elements').each(d => {
            results.push({ zone: d.zone, ...d.selection, color: d.color, opacity: d.opacity, shape: d.shape, rotation: 0 })
        })
        // console.log(results)
        return results
    }
    getElementsInZone (props) {
        let { display, zone, zoneDimensions } = props
        let selectedElements = []
        let relativeZone = getRelativeRectangle(zoneDimensions, zone, display)
        d3.select(this.el).selectAll('.elements')
            .each(function (d, i) {
                if (selectionLib.detectRectCollision(relativeZone, d.zone)) selectedElements.push(d.selection)
            })
        return selectedElements
    }
    resize (props) {
        const { nestedProp1, display, selectedConfig, zone } = props
        let category = selectedConfig.properties[0].category
        let dico = dataLib.getDict(nestedProp1)
        const xScale = d3.scaleLinear().range([0, display.viz[zone + '_useful_width']])
        if (category === 'number' || category === 'datetime') {
            xScale.domain([Number(nestedProp1[0].key), Number(nestedProp1[nestedProp1.length - 1].key)])
        } else if (category === 'text' || category === 'uri') {
            xScale.domain([0, nestedProp1.length - 1])
        }
        let maxUnitsPerYear = 1
        d3.select(this.el)
            .selectAll('g.time')
            .attr('transform', d => {
                let x
                if (category === 'number' || category === 'datetime') {
                    x = xScale(Number(d.key)) + 1
                } else {
                    x = xScale(Number(dico[d.key]))
                }
                return `translate(${x}, 0)`
            })
            .each(d => {
                if (d.values.length > maxUnitsPerYear) maxUnitsPerYear = d.values.length
            })
        let unitWidth = Math.floor(display.viz[zone + '_useful_width'] / dataLib.getNumberOfUnits(nestedProp1, category))
        if (unitWidth < 1) unitWidth = 1
        const unitHeight = (display.viz[zone + '_useful_height'] / maxUnitsPerYear)
        const group = nestedProp1[0].group 
        d3.select(this.el).selectAll('g.time').selectAll('.elements')
            .attr('transform', (d, i) => `translate(0, ${display.viz[zone + '_useful_height'] - (i * unitHeight)})`)
        d3.select(this.el).selectAll('g.time').selectAll('.elements')
            .each((d, i) => {
                let x1
                if (category === 'number' || category === 'datetime') {
                    x1 = xScale(Number(d[group])) + 1
                } else {
                    x1 = xScale(Number(dico[d.prop1.value]))
                }
                const y1 = display.viz[zone + '_useful_height'] - (i * unitHeight)
                d.zone = {
                    x1: x1,
                    y1: y1 - unitHeight,
                    x2: x1 + unitWidth - 2,
                    y2: y1,
                    width: unitWidth - 2,
                    height: unitHeight
                }
            })
        d3.select(this.el).selectAll('g.time').selectAll('.element')
            .attr('x', d => 1)
            .attr('width', d => unitWidth - 1)
            .attr('y', -unitHeight)
            .attr('height', d => unitHeight)
        props.handleTransition(props, this.getElementsForTransition(props))
    }
}

export default StackedChartLayout