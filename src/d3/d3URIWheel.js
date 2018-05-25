import * as d3 from 'd3'
import * as queryLib from '../lib/queryLib'
import * as selectionLib from '../lib/selectionLib'

export const create = (el, props) => {
    // console.log('create')
    if (el && props.data) {
        // console.log('||||||||||||||||||||||||', props.role, props.nestedProp1)
        draw(el, props)
        resize(el, props)
    }
}

export const destroy = (el) => {
    //
    d3.select(el)
        .selectAll('g.radius')
        .remove()
}

const draw = (el, props) => {
    const { color, nestedProp1, selections, zone } = props
    //console.log(selections)
    const radii = d3.select(el)
        .selectAll('g.radius')
        .data(nestedProp1)
        // .data(nestedProp1.slice(0,3))
    const newradii = radii
        .enter()
        .append('g')
        .attr('class', 'radius')
    /* const grad = d3.select(el)
        .append('linearGradient')
        .attr('id', 'gradientWheel' + zone)
    grad.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#bbb')
    grad.append('stop')
        .attr('offset', '60%')
        .attr('stop-color', '#bbb')
    grad.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#f00') */
    newradii
        .append('path')
        .attr('fill', 'none')
        .attr('id', (d, i) => 'radius' + i + 'zone' )
    const grad = newradii
        .append('linearGradient')
        .attr('id', (d, i) => 'gradientWheel' + zone + d.key)
    grad.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#bbb')
    grad.append('stop')
        .attr('offset', (d) => {
            const startUri = queryLib.getRoot(d.key)
            console.log(d.key, startUri, startUri.length, d.key.length, (startUri.length / d.key.length * 100))
            let percent = (startUri.length / d.key.length * 100)
            if (startUri.length === 0 || d.key.length === 0 || !(percent > 0)) {
                percent = 60
            } else if (percent > 20) {
                //
            }
            d.percent = percent
            return `${percent}%`
        })
        .attr('stop-color', '#bbb')
    grad.append('stop')
        .attr('offset', d => `${(d.percent + 1)}%`)
        .attr('stop-color', color)
    grad.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', color)
    newradii
        .append('text')
        .attr('width', 250)
        .append('textPath')
        .attr('xlink:xlink:href', (d, i) => '#radius' + i + 'zone')
        .attr('fill', (d, i) => `url(#${'gradientWheel' + zone + d.key})`)
        .text(d => d.key)

    radii
        .attr('fill', (d, i) => `url(#${'gradientWheel' + zone + d.key})`)
    radii
        .exit()
        .remove()

    d3.select(el)
        .selectAll('g.radius')
        .each((d, i) => {
            d.color = color
            d.selection = {
                selector: 'radius' + i + 'zone',
                query: {
                    type: 'set',
                    value: [{
                        category: 'uri',
                        value: d.key,
                        propName: 'prop1'
                    }]
                }
            }
            d.shape = 'textPath'
            d.zone = {}
            d.selected = selectionLib.areSelected([d.selection], zone, selections)
        })
        .attr('id', d => d.selection.selector) // only needed to better understand html source code
        .classed('selected', d => d.selected)
        .attr('opacity', d => {
            d.opacity = (selections.filter(s => s.zone === zone).length > 0 && d.selected !== true) ? 0.5 : 1
            return d.opacity
        })
        .on('mouseup', d => {
            props.handleMouseUp({ pageX: d3.event.pageX, pageY: d3.event.pageY }, zone)
        })
}

export const drawSelection = (el, props) => {
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

export const getElements = (el, propName, value, propCategory) => {
    let elements = []
    d3.select(el).selectAll('.elements').each(d => {
        if (d.key === value) {
            elements.push(d.selection)
        }
    })
    return elements
}

const getElementsForTransition = (el, props) => {
    let results = []
    d3.select(el).selectAll('.radius').each(d => {
        results.push({ zone: d.zone, ...d.selection, color: d.color, opacity: d.opacity, shape: d.shape, rotation: d.rotation })
    })
    // console.log(results)
    return results
}

export const getElementsInZone = (el, props) => {
    const zoneDimensions = selectionLib.getRectSelection(props.display.selectedZone[props.zone])
    const selectedZone = {
        x1: zoneDimensions.x1 - props.display.viz.horizontal_margin,
        y1: zoneDimensions.y1 - props.display.viz.vertical_margin,
        x2: zoneDimensions.x2 - props.display.viz.horizontal_margin,
        y2: zoneDimensions.y2 - props.display.viz.vertical_margin
    }
    let selectedElements = []
    d3.select(el).selectAll('.radius path')
        .each(function (d, i) {
            // console.log(d.zone)
            if (selectionLib.detectPathCollision(d.controlPoints, selectedZone)) selectedElements.push(d.selection)
        })
    return selectedElements
}

// const retrieveValues

const resize = (el, props) => {
    const { display, nestedProp1 } = props

    let angle = 360 / (nestedProp1.length - 1)
    // console.log(angle)
    let center = { x: display.viz.useful_width/2, y: display.viz.useful_height/2 }
    d3.select(el).selectAll('.radius')
        .attr('transform', (d, i) => `translate(${center.x}, ${center.y}) rotate(${(i * angle)} 0 0)`)
    // let witnesses = []
    let path = [
        {x: 0, y: 0},
        {x: 36, y: -168},
        {x: 202, y: -42},
        {x: 272, y: 2},
        {x: 283, y:85},
        {x: 303, y:208},
        {x: 201, y:232}

    ]
    d3.select(el).selectAll('.radius')
        .each((d, i) => {
            // console.log(i * angle, selectionLib.getRotatedPoints(path, (i * angle) - 2, center))
            d.zone = {
                x1: path[0].x + center.x,
                y1: path[0].y + center.y,
                x2: path[4].x + center.x,
                y2: path[4].y + center.y,
                width: path[4].x - path[0].x,
                height: path[4].y - path[0].y
            }
            d.rotation = (i * angle)
            d.controlPoints = selectionLib.extrapolatePath(selectionLib.getRotatedPoints(path, (i * angle) - 2, center))
            // witnesses.push(d.zone)
        })

    d3.select(el).selectAll('.radius path')
        .attr('d', (d, i) => {
            // let path = d.zone
            return `M${path[0].x},${path[0].y}Q${path[1].x},${path[1].y},${path[2].x},${path[2].y}Q${path[3].x},${path[3].y},${path[4].x},${path[4].y}Q${path[5].x},${path[5].y},${path[6].x},${path[6].y}`
        })

    /* d3.select(el).selectAll('.witness')
        .data(witnesses)
        .enter()
        .append('g')
        .attr('class', 'witness')
        .selectAll('circle')
        .data((d, i) => d)
        .enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 5)
        .attr('fill', 'black')
        // console.log('||||', props.role, props.zone, getElementsForTransition(el, props)) */
    props.handleTransition(props, getElementsForTransition(el, props))
}

export const update = (el, props) => {
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
