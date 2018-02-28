import * as d3 from 'd3'
import dataLib from '../lib/dataLib'
import selectionLib from '../lib/selectionLib'

const create = (el, props) => {
    // console.log('create')
    if (el && props.data) {
        // console.log('||||||||||||||||||||||||', props.role, props.nestedProp1)
        draw(el, props)
        resize(el, props)
    }
}

const destroy = (el) => {
    //
    d3.select(el)
        .selectAll('g.time')
        .remove()
}

const draw = (el, props) => {
    const { nestedProp1, legend, selectElement, selections, zone } = props
    //console.log(selections)
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
        .selectAll('g.time .elements')
        .each((d, i) => {
            d.color = legend.info.filter(p => (p.key === d.prop2.value || (d.labelprop2 && p.key === d.labelprop2.value)))[0].color
            // console.log(zone, d)
            d.selection = {
                selector: `timeline_element_${dataLib.makeId(d.entrypoint.value)}`,
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
            d.opacity = (selections.length > 0 && d.selected !== true) ? 0.5 : 1
            return d.opacity
        })
        .on('mouseup', d => {
            props.handleMouseUp({ pageX: d3.event.pageX, pageY: d3.event.pageY }, zone)
        })
}

const drawSelection = (el, props) => {
    const zoneDimensions = selectionLib.getRectSelection(props.display.selectedZone[props.zone])
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
    d3.select(el).selectAll('.elements').each(d => {
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

const getElementsForTransition = (el, props) => {
    let results = []
    d3.select(el).selectAll('.elements').each(d => {
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
    d3.select(el).selectAll('.elements')
        .each(function (d, i) {
            // console.log(selectionLib.detectRectCollision(selectedZone, elementZone), d3.select(this).node().parentNode.getAttribute('id'), d.selection)
            if (selectionLib.detectRectCollision(selectedZone, d.zone)) selectedElements.push(d.selection)
        })
    return selectedElements
}

// const retrieveValues

const resize = (el, props) => {
    const { config, configs, nestedCoverage1, nestedProp1, display, role, zone } = props
    // todo : get Saved Data
    // todo : if none use coverage data and save it
    let maxUnitsPerYear
    if (display.unitDimensions[zone][role] &&
        display.unitDimensions[zone][role].maxUnitsPerYear) {
        maxUnitsPerYear = display.unitDimensions[zone][role].maxUnitsPerYear
    } else {
        maxUnitsPerYear = 1
        d3.select(el)
            .selectAll('g.time')
            .each(d => {
                if (d.values.length > maxUnitsPerYear) maxUnitsPerYear = d.values.length
            })
    }

    const xScale = d3.scaleLinear()
        .domain([Number(nestedCoverage1[0].key), Number(nestedCoverage1[nestedCoverage1.length - 1].key)])
        .range([0, display.viz.useful_width])

    d3.select(el)
        .selectAll('g.time')
        .attr('transform', d => `translate(${xScale(Number(d.key))}, 0)`)

    const unitWidth = Math.floor(display.viz.useful_width / dataLib.getNumberOfTimeUnits(nestedCoverage1))
    const unitHeight = Math.floor(display.viz.useful_height / maxUnitsPerYear)

    d3.select(el).selectAll('g.time').selectAll('.elements')
        .attr('transform', (d, i) => `translate(0, ${display.viz.useful_height - (i * unitHeight)})`)
    d3.select(el).selectAll('g.time').selectAll('.elements')
        .each((d, i) => {
            // console.log(d.group, d[d.group])
            const x1 = xScale(Number(d[d.group])) + 1
            const y1 = display.viz.useful_height - (i * unitHeight)
            d.zone = {
                x1,
                y1: y1 - unitHeight,
                x2: x1 + unitWidth - 2,
                y2: y1,
                width: unitWidth - 2,
                height: unitHeight
            }
        })
    d3.select(el).selectAll('g.time').selectAll('.element')
        .attr('x', d => 1)
        .attr('width', d => unitWidth - 1)
        .attr('y', -unitHeight)
        .attr('height', d => unitHeight)
    // console.log('||||', props.role, props.zone, getElementsForTransition(el, props))
    props.handleTransition(props, getElementsForTransition(el, props))
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

exports.create = create
exports.destroy = destroy
exports.drawSelection = drawSelection
exports.getElements = getElements
exports.getElementsInZone = getElementsInZone
exports.update = update
