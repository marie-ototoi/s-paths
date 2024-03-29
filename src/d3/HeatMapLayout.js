import * as d3 from 'd3'
import AbstractLayout from './AbstractLayout'
import * as dataLib from '../lib/dataLib'
import { areSelected, detectRectCollision } from '../lib/selectionLib'
import { getRelativeRectangle } from '../lib/scaleLib'

class HeatMapLayout extends AbstractLayout {
    draw (props) {
        const { nestedProp1, legend, display, selectedConfig, selections, step, zone } = props
        // console.log(nestedProp1)
        const xUnits = d3.select(this.el)
            .selectAll('g.xUnits')
            .data(nestedProp1)
        xUnits
            .enter()
            .append('g')
            .attr('class', 'xUnits')
        xUnits
            .exit()
            .remove()
        const yUnits = d3.select(this.el).selectAll('g.xUnits').selectAll('g.yUnits')
            .data(d => d.values)
        yUnits
            .enter()
            .append('g')
            .attr('class', 'yUnits')
            .append('rect')
            .attr('class', 'yUnit')
        yUnits
            .exit()
            .remove()
        //console.log(props.config)
        let thisZone = selections.some(s => s.zone === zone)
        d3.select(this.el)
            .selectAll('g.xUnits g.yUnits')
            .each((d, i) => {
                // console.log(d.countprop2)
                let filteredLegend = legend.info.filter(p => {
                    return (p.key[0] <= Number(d.countprop2) && p.key[1] >= Number(d.countprop2)) ||
                        (d.countprop2.value && p.key[0] <= Number(d.countprop2.value) && p.key[1] >= Number(d.countprop2.value))
                })
                if (filteredLegend.length > 0) d.color = filteredLegend[0].color
                d.selection = {
                    selector: `heatmap_element_p1_${dataLib.makeId(d.values[0].prop1.value)}_p2_${dataLib.makeId(d.values[0].prop2.value)}`,
                    count: Number(d.countprop2),
                    index: i,
                    config: props.config,
                    query: {
                        type: 'set',
                        value: [{
                            category: selectedConfig.properties[0].category,
                            format: selectedConfig.properties[0].format,
                            group: d.values[0].group,
                            value: (selectedConfig.properties[0].category === 'datetime') ? d.range : d.values[0].prop1.value,
                            propName: 'prop1',
                            path: selectedConfig.properties[0].path
                        }, {
                            category: selectedConfig.properties[1].category,
                            value: d.key,
                            propName: 'prop2',
                            path: selectedConfig.properties[1].path
                        }]
                    }
                }
                d.shape = 'rectangle'
                d.zone = {}
                d.selected = areSelected([d.selection], zone, selections)
            })
            .attr('id', d => d.selection.selector) // only needed to better understand html source code
            .classed('selected', d => d.selected)
            .attr('fill', d => {
                return selections.length > 0 && 
                    ((thisZone && d.selected !== true) ||
                    (!thisZone && selections.length > 0)) ? '#ddd' : d.color
            })
            .attr('opacity', 1)
    }

    getElements (propName, value, propCategory) {
        const isArray = Array.isArray(value)
        let elements = []
        d3.select(this.el).selectAll('.yUnits').each(d => {
            let propValue
            if (propCategory === 'datetime') {
                propValue = Number(d.parent)
            } else if (propCategory === 'text' || propCategory === 'uri') {
                propValue = (propName === 'prop1') ? d.parent : d.key
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
        d3.select(this.el).selectAll('.yUnits').each(d => {
            results.push({ zone: d.zone, ...d.selection, color: d.color, opacity: d.opacity, shape: d.shape, rotation: 0 })
        })
        // console.log(results)
        return results
    }

    getElementsInZone (props) {
        let { display, zone, zoneDimensions } = props
        let selectedElements = []
        let relativeZone = getRelativeRectangle(zoneDimensions, zone, display)
        d3.select(this.el).selectAll('.yUnits')
            .each(function (d, i) {
                if (detectRectCollision(relativeZone, d.zone)) selectedElements.push(d.selection)
            })
        // console.log(selectedElements)
        return selectedElements
    }

    resize (props) {
        const { nestedProp1, nestedProp2, display, selectedConfig, zone } = props
        let mapY = {}
        nestedProp2.forEach((p, i) => {
            mapY[p.key] = nestedProp2.length - 2 - i
        })
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
            .selectAll('g.xUnits')
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
        const unitHeight = Math.round(display.viz[zone + '_useful_height'] / (props.nestedProp2.length - 1))
        // todo : s'il n'y a pas de unitHeigth sauvé pour cette config on recalcule
        d3.select(this.el).selectAll('g.xUnits').selectAll('.yUnits')
            .each((d, i) => {
                let x1
                if (category === 'number' || category === 'datetime') {
                    x1 = xScale(Number(d.parent)) + 1
                } else {
                    x1 = xScale(Number(dico[d.parent]))
                }
                let y1 = display.viz[zone + '_useful_height'] - (mapY[d.key] * unitHeight)
                d.zone = {
                    x1: x1,
                    y1: y1 - unitHeight,
                    x2: x1 + unitWidth - 2,
                    y2: y1 - 2,
                    width: unitWidth - 2,
                    height: unitHeight - 1
                }
            })
            .attr('transform', (d, i) => `translate(0, ${d.zone.y1})`)
        d3.select(this.el).selectAll('g.xUnits').selectAll('.yUnit')
            .attr('x', d => 1)
            .attr('width', d => unitWidth - 1)
            .attr('y', 0)
            .attr('height', d => unitHeight - 1)
        //console.log('UPDATE ?')
        props.handleTransition(props, this.getElementsForTransition(props))
        //console.log('UPDATE !')
    }
}

export default HeatMapLayout