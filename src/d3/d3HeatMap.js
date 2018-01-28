import * as d3 from 'd3'
import d3Legend from './d3Legend'
import dataLib from '../lib/dataLib'
import {getQuantitativeColors} from '../lib/paletteLib.js'
import config from '../lib/configLib'
import {dragSelection} from './d3DragSelector'
import selectionLib from '../lib/selectionLib'

const create = (el, props) => {
    // console.log('create')
    if (el && props.data) {
        draw(el, props)
        resize(el, props)
        props.handleTransition(props.zone, props.role, getElementsForTransition(el, props))
    }
}

const destroy = (el) => {

}

const draw = (el, props) => {
    const { nestedProp1, legend, selectedConfig, selectElement, selections, zone } = props
    // console.log(nestedProp1)
    const xUnits = d3.select(el)
        .selectAll('g.xUnits')
        .data(nestedProp1)
    xUnits
        .enter()
        .append('g')
        .attr('class', 'xUnits')
    xUnits
        .exit()
        .remove()
    const yUnits = d3.select(el).selectAll('g.xUnits').selectAll('g.yUnits')
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

    d3.select(el)
        .selectAll('g.xUnits g.yUnits')
        .each((d, i) => {
            console.log(legend, d)
            d.color = legend.info.filter(p => (p.key[0] <= Number(d.countprop2) && p.key[1] >= Number(d.countprop2)))[0].color
            d.selection = {
                selector: `heatmap_element_p1_${dataLib.makeId(d.parent.key)}_p2_${dataLib.makeId(d.key)}`,
                query: {
                    type: 'set',
                    value: [{
                        category: selectedConfig.properties[0].category,
                        value: dataLib.getDateRange(d.parent.key, nestedProp1[0].group),
                        propName: 'prop1'
                    }, {
                        category: selectedConfig.properties[1].category,
                        value: d.key,
                        propName: 'prop2'
                    }]
                }
            }
            //console.log(d.selection.selector)
            d.shape = 'rectangle'
            d.zone = {}
            d.selected = selectionLib.areSelected([d.selection], zone, selections)
        })
        .attr('id', d => d.selection.selector) // only needed to better understand html source code
        .classed('selected', d => d.selected)
        .attr('fill', d => d.color)
        .attr('opacity', d => {
            d.opacity = (selections.length > 0 && d.selected !== true) ? 0.5 : 1
            return d.opacity
        })
        .on('mouseup', d => {
            props.handleMouseUp({ pageX: d3.event.pageX, pageY: d3.event.pageY })
        })
}

const drawSelection = (el, props) => {
    const zoneDimensions = selectionLib.getRectSelection(props.display.selectedZone)
    const selectedZone = {
        x1: zoneDimensions.x1 - props.display.viz.horizontal_margin,
        y1: zoneDimensions.y1 - props.display.viz.vertical_margin,
        x2: zoneDimensions.x2 - props.display.viz.horizontal_margin,
        y2: zoneDimensions.y2 - props.display.viz.vertical_margin
    }
    d3.select(el).selectAll('rect.selection')
        .data([selectedZone])
        .enter()
        .append('rect')
        .attr('class', 'selection')
        .on('mouseup', d => {
            props.handleMouseUp({ pageX: d3.event.pageX, pageY: d3.event.pageY })
        })

    d3.select(el).select('rect.selection')
        .attr('width', selectedZone.x2 - selectedZone.x1)
        .attr('height', selectedZone.y2 - selectedZone.y1)
        .attr('x', selectedZone.x1)
        .attr('y', selectedZone.y1)
}

const getElements = (el, propName, value, propCategory) => {
    const isArray = Array.isArray(value)
    let elements = []
    d3.select(el).selectAll('.yUnits').each(d => {
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

const getElementsForTransition = (el, props) => {
    let results = []
    d3.select(el).selectAll('.yUnits').each(d => {
        results.push({ zone: d.zone, ...d.selection, color: d.color, opacity: d.opacity, shape: d.shape })
    })
    // console.log(results)
    return results
}

const getElementsInZone = (el, props) => {
    const zoneDimensions = selectionLib.getRectSelection(props.display.selectedZone)
    const selectedZone = {
        x1: zoneDimensions.x1 - props.display.viz.horizontal_margin,
        y1: zoneDimensions.y1 - props.display.viz.vertical_margin,
        x2: zoneDimensions.x2 - props.display.viz.horizontal_margin,
        y2: zoneDimensions.y2 - props.display.viz.vertical_margin
    }
    let selectedElements = []
    d3.select(el).selectAll('.yUnit')
        .each(function (d, i) {
            // console.log(d.zone)
            // console.log(selectionLib.detectRectCollision(selectedZone, elementZone), d3.select(this).node().parentNode.getAttribute('id'), d.selection)
            if (selectionLib.detectRectCollision(selectedZone, d.zone)) selectedElements.push(d.selection)
        })
    // console.log(selectedElements, selectedZone)
    return selectedElements
}

const resize = (el, props) => {
    const { nestedProp1, nestedProp2, display } = props
    let mapY = {} 
    nestedProp2.forEach((p, i) => {
        mapY[p.key] = nestedProp2.length - 2 - i
    })
    const xScale = d3.scaleLinear()
        .domain([Number(nestedProp1[0].key), Number(nestedProp1[nestedProp1.length - 1].key)])
        .range([0, display.viz.useful_width])
    let maxUnitsPerYear = 1
    d3.select(el)
        .selectAll('g.xUnits')
        .attr('transform', d => `translate(${xScale(Number(d.key))}, 0)`)
        .each(d => {
            if (d.values.length > maxUnitsPerYear) maxUnitsPerYear = d.values.length
        })
    const unitWidth = Math.floor(display.viz.useful_width / (props.nestedProp1.length - 1))
    const unitHeight = Math.floor(display.viz.useful_height / (props.nestedProp2.length - 1))
    d3.select(el).selectAll('g.xUnits').selectAll('.yUnits')
        .attr('transform', (d, i) => `translate(0, ${display.viz.useful_height - (mapY[d.key] * unitHeight)})`)
    d3.select(el).selectAll('g.xUnits').selectAll('.yUnit')
        .attr('x', d => 1)
        .attr('width', d => unitWidth - 1)
        .attr('y', -unitHeight)
        .attr('height', d => unitHeight - 1)
        .each((d, i) => {
            const x1 = xScale(Number(d.parent.key)) + 1
            const y1 = display.viz.useful_height - (mapY[d.key] * unitHeight)
            d.zone = {
                x1,
                y1: y1 - unitHeight,
                x2: x1 + unitWidth - 2,
                y2: y1 - 1,
                width: unitWidth - 2,
                height: unitHeight - 1
            }
        })
}

const update = (el, props) => {
    if (el && props.data) {
        draw(el, props)
        resize(el, props)
        if (props.display.selectedZone.x1 !== null) {
            drawSelection(el, props)
        } else {
            d3.select(el).selectAll('rect.selection').remove()
        }
        props.handleTransition(props.zone, 'origin', getElementsForTransition(el, props))
    }
}

exports.create = create
exports.destroy = destroy
exports.drawSelection = drawSelection
exports.getElements = getElements
exports.getElementsInZone = getElementsInZone
exports.update = update
