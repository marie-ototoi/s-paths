import * as d3 from 'd3'
import dataLib from '../lib/dataLib'
import selectionLib from '../lib/selectionLib'
import { parseSvg } from 'd3-interpolate/src/transform/parse'

const create = (el, props) => {
    // console.log('create')
    if (el && props.data) {
        draw(el, props)
        resize(el, props)
    }
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
const getElementsInZone = (el, props) => {
    const zoneDimensions = selectionLib.getRectSelection(props.display.selectedZone)
    const selectedZone = {
        x1: zoneDimensions.x1 - props.display.viz.horizontal_margin,
        y1: zoneDimensions.y1 - props.display.viz.vertical_margin,
        x2: zoneDimensions.x2 - props.display.viz.horizontal_margin,
        y2: zoneDimensions.y2 - props.display.viz.vertical_margin
    }
    let selectedElements = []
    d3.select(el).selectAll('.element')
        .each(function (d, i) {
            const width = Number(d3.select(this).attr('width'))
            const height = Number(d3.select(this).attr('height'))
            const x1 = Number(parseSvg(d3.select(this).node().parentNode.parentNode.getAttribute('transform')).translateX)
            const y1 = Number(parseSvg(d3.select(this).node().parentNode.getAttribute('transform')).translateY)
            const elementZone = {
                x1,
                y1,
                x2: x1 + width,
                y2: y1 + height
            }
            // console.log(selectedZone, elementZone, selectionLib.detectRectCollision(selectedZone, elementZone))
            if (selectionLib.detectRectCollision(selectedZone, elementZone)) selectedElements.push(d.selection)
        })
    return selectedElements
}

const getElements = (el, propName, value, propCategory) => {
    const isArray = Array.isArray(value)
    let elements = []
    d3.select(el).selectAll('.elements').each(d => {
        if (d[propName]) {
            let propValue
            if (propCategory === 'datetime') {
                propValue = Number(d.year)
            } else if (propCategory === 'text' || propCategory === 'uri') {
                propValue = d[propName].value
            } else if (propCategory === 'number') {
                propValue = Number(d[propName].value)
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

const update = (el, props) => {
    //
    if (el && props.data) {
        draw(el, props)
        resize(el, props)
        //
        if (props.display.selectedZone.x1 !== null) {
            drawSelection(el, props)
        } else {
            d3.select(el).selectAll('rect.selection').remove()
        }
    }
}

const destroy = (el) => {
    //
}

const draw = (el, props) => {
    const { nestedProp1, legend, selectedConfig, selectElement, selections, zone } = props
    // console.log(nestedProp1)
    const timeUnits = d3.select(el)
        .selectAll('g.time')
        .data(nestedProp1)
    timeUnits
        .enter()
        .append('g')
        .attr('class', 'time')
    timeUnits
        .exit()
        .remove()
    const elementUnits = d3.select(el).selectAll('g.time').selectAll('g.elements')
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

    d3.select(el)
        .selectAll('g.time g.elements')
        .each((d, i) => {
            // console.log(d, d.selection)
            d.id = d.id || `timeline_element_${dataLib.guid()}`
            d.color = legend.info.filter(p => (p.key === d.prop2.value || (d.labelprop2 && p.key === d.labelprop2.value)))[0].color
            d.selection = {
                selector: d.id,
                query: {
                    type: 'uri',
                    value: d.entrypoint.value
                }
            }
            //console.log(d.selection)
            d.selected = selectionLib.areSelected([d.selection], zone, selections)
        })
        .attr('id', d => d.id)
        .classed('selected', d => d.selected)
        .attr('fill', d => d.color)
        .attr('opacity', d => {
            // bug to be fixed console.log('what sup ', selections.length, d.selected, d.entrypoint )
            return (selections.length > 0 && d.selected !== true) ? 0.5 : 1
        })
        .on('mousedown', d => {
            selectElement(d.selection)
        })
        .on('mouseup', d => {
            // console.log(d3.event.pageX)
            props.handleMouseUp({ pageX: d3.event.pageX, pageY: d3.event.pageY })
        })
}

const resize = (el, props) => {
    const { nestedProp1, display, selections } = props
    const xScale = d3.scaleLinear()
        .domain([Number(nestedProp1[0].key), Number(nestedProp1[nestedProp1.length - 1].key)])
        .range([0, display.viz.useful_width])
    let maxUnitsPerYear = 1
    d3.select(el)
        .selectAll('g.time')
        .attr('transform', d => `translate(${xScale(Number(d.key))}, 0)`)
        .each(d => {
            if (d.values.length > maxUnitsPerYear) maxUnitsPerYear = d.values.length
        })
    const unitWidth = nestedProp1.reduce((acc, current) => {
        if (acc.prev) {
            let dif = xScale(Number(current.key)) - xScale(Number(acc.prev.key))
            if (!acc.dif || dif < acc.dif) acc.dif = dif
        }
        acc.prev = current
        return acc
    }, {}).dif
    const unitHeight = Math.floor(display.viz.useful_height / maxUnitsPerYear)
    d3.select(el).selectAll('g.time').selectAll('.elements')
        .attr('transform', (d, i) => `translate(0, ${display.viz.useful_height - (i * unitHeight)})`)
    d3.select(el).selectAll('g.time').selectAll('.element')
        .attr('x', d => 1)
        .attr('width', d => unitWidth - 2)
        .attr('y', -unitHeight)
        .attr('height', d => unitHeight)
    //.attr('stroke-width', 1 )
    //.attr('stroke', d => (d.selected === true) ? '#000' : d.color)
    // .attr('stroke-width', )
}

exports.create = create
exports.destroy = destroy
exports.drawSelection = drawSelection
exports.getElements = getElements
exports.getElementsInZone = getElementsInZone
exports.update = update
