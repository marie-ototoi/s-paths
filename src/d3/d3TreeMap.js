import * as d3 from 'd3'
import d3Legend from './d3Legend'
import dataLib from '../lib/dataLib'
import {getQuantitativeColors} from '../lib/paletteLib.js'
import config from '../lib/configLib'
import {dragSelection} from './d3DragSelector'
import selectionLib from '../lib/selectionLib'

const create = (el, props) => {
    console.log('create')
    if (el && props.data) {
        draw(el, props)
        resize(el, props)
        // props.handleTransition(props, getElementsForTransition(el, props))
    }
}

const destroy = (el) => {

}

const draw = (el, props) => {
    const { nestedProp1, legend, selectedConfig, selectElement, selections, zone } = props
    console.log(nestedProp1)
    const units = d3.select(el)
        .selectAll('rect.units')
        .data(nestedProp1)
    units
        .enter()
        .append('rect')
        .attr('class', 'units')
    units
        .exit()
        .remove()

    d3.select(el)
        .selectAll('rect.units')
        .each((d, i) => {
            //console.log(d, legend)
            //d.color = legend.info.filter(p => (p.key === d.values[0].prop2.value || (d.values[0].labelprop2 && p.key === d.values[0].labelprop2.value)))[0].color
            d.selection = {
                selector: `treemap_element_p1_${dataLib.makeId(d.key)}`,
                count: Number(d.values.length),
                query: {
                    type: 'set',
                    value: [{
                        category: selectedConfig.properties[0].category,
                        value: d.key,
                        propName: 'prop1'
                    }]
                }
            }
            //console.log(d.selection.selector)
            d.shape = 'rectangle'
            d.zone = {}
            d.selected = selectionLib.areSelected([d.selection], zone, selections)
            //console.log(d)
        })
        .attr('id', d => d.selection.selector) // only needed to better understand html source code
        .classed('selected', d => d.selected)
        //.attr('fill', d => d.color)
        .attr('opacity', d => {
            return (selections.length > 0 && d.selected !== true) ? 0.5 : 1
        })
        .on('mouseup', d => {
            props.handleMouseUp({ pageX: d3.event.pageX, pageY: d3.event.pageY }, zone)
        })
        console.log("on ira... ou tu voudras")
}

const drawSelection = (el, props) => {
    const zoneDimensions = selectionLib.getRectSelection(props.display.selectedZone[props.zone])
    // console.log(zoneDimensions)
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
            props.handleMouseUp({ pageX: d3.event.pageX, pageY: d3.event.pageY }, props.zone)
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
    d3.select(el).selectAll('.units').each(d => {
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
    d3.select(el).selectAll('.units').each(d => {
        results.push({ zone: d.zone, ...d.selection, color: d.color, opacity: d.opacity, shape: d.shape })
    })
    // console.log(results)
    return results
}

const getElementsInZone = (el, props) => {
    const zoneDimensions = selectionLib.getRectSelection(props.display.selectedZone[props.zone])
    const selectedZone = {
        x1: zoneDimensions.x1 - props.display.viz.horizontal_margin,
        y1: zoneDimensions.y1 - props.display.viz.vertical_margin,
        x2: zoneDimensions.x2 - props.display.viz.horizontal_margin,
        y2: zoneDimensions.y2 - props.display.viz.vertical_margin
    }
    let selectedElements = []
    d3.select(el).selectAll('.units')
        .each(function (d, i) {
            // console.log(d.zone)
            // console.log(selectionLib.detectRectCollision(selectedZone, elementZone), d3.select(this).node().parentNode.getAttribute('id'), d.selection)
            if (selectionLib.detectRectCollision(selectedZone, d.zone)) selectedElements.push(d.selection)
        })
    // console.log(selectedElements, selectedZone)
    return selectedElements
}

const resize = (el, props) => {
    const { nestedCoverage1, nestedProp2, display } = props
    console.log("et l'on s'aimera encore")
    
    props.handleTransition(props, getElementsForTransition(el, props))
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
    }
}

exports.create = create
exports.destroy = destroy
exports.drawSelection = drawSelection
exports.getElements = getElements
exports.getElementsInZone = getElementsInZone
exports.update = update
