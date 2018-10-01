import * as d3 from 'd3'
import AbstractLayout from './AbstractLayout'
import * as dataLib from '../lib/dataLib'
import * as queryLib from '../lib/queryLib'
import * as selectionLib from '../lib/selectionLib'

class URIWheelLayout extends AbstractLayout {
    draw (props) {
        const { color, nestedProp1, selections, zone } = props
        //console.log(selections)
        const radii = d3.select(this.el)
            .selectAll('g.radius')
            .data(nestedProp1)
            // .data(nestedProp1.slice(0,3))
        const newradii = radii
            .enter()
            .append('g')
            .attr('class', 'radius')
        newradii
            .append('path')
            .attr('fill', 'none')
            .attr('id', (d, i) => 'radius' + i + 'zone' )
        const grad = newradii
            .append('linearGradient')
            .attr('id', (d, i) => 'gradientWheel' + zone + dataLib.makeId(d.key))
        grad.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#bbb')
        grad.append('stop')
            .attr('offset', (d) => {
                const startUri = queryLib.getRoot(d.key)
                
                let percent = (startUri.length / d.key.length * 100)
                if (startUri.length === 0 || d.key.length === 0 || !(percent > 0) || d.key.length > 49) {
                    percent = (startUri.length / 49 * 100)
                }
                // console.log(d.key, startUri, startUri.length, d.key.length, (startUri.length / d.key.length * 100), percent)
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
            .text(d => d.key)

        radii
            .exit()
            .remove()

        d3.select(this.el)
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
    }
    
    getElements (propName, value, propCategory) {
        let elements = []
        d3.select(this.el).selectAll('.elements').each(d => {
            if (d.key === value) {
                elements.push(d.selection)
            }
        })
        return elements
    }

    getElementsForTransition (props) {
        let results = []
        d3.select(this.el).selectAll('.radius').each(d => {
            results.push({ zone: d.zone, ...d.selection, color: d.color, opacity: d.opacity, shape: d.shape, rotation: d.rotation })
        })
        // console.log(results)
        return results
    }

    getElementsInZone (props) {
        let { display, zone, zoneDimensions } = props
        const selectedZone = zoneDimensions
        let selectedElements = []
        d3.select(this.el).selectAll('.radius path')
            .each(function (d, i) {
                // console.log(d.zone)
                if (selectionLib.detectPathCollision(d.controlPoints, selectedZone)) selectedElements.push(d.selection)
            })
        return selectedElements
    }

    resize (props) {
        const { display, nestedProp1, zone } = props
        let angle = 360 / (nestedProp1.length - 1)
        // console.log(angle)
        let center = { x: display.viz[zone + '_useful_width']/2, y: display.viz[zone + '_useful_height']/2 }
        d3.select(this.el).selectAll('.radius')
            .attr('transform', (d, i) => `translate(${center.x}, ${center.y}) rotate(${(i * angle)} 0 0)`)

        // d3.select(el).selectAll('.radius linearGradient')
        //.attr('gradientTransform', (d, i) => `rotate(0)`)
        
        d3.select(this.el).selectAll('.radius textPath')
            .attr('fill', (d, i) => `url(#${'gradientWheel' + zone + dataLib.makeId(d.key)})`)
        // let witnesses = []
        let path = [
            {x: 0, y: 0},
            {x: 36, y: -168},
            {x: 202, y: -42},
            {x: 271, y: 14},
            {x: 283, y:86},
            {x: 310, y:225},
            {x: 227, y:312}
        ]

        d3.select(this.el).selectAll('.radius')
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

        d3.select(this.el).selectAll('.radius path')
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
        props.handleTransition(props, this.getElementsForTransition(props))
    }

    checkSelection (props) {
        //
        if (props.display.selectedZone.x1 !== null) {
            this.drawSelection(props)
        } else {
            d3.select(this.el).selectAll('rect.selection').remove()
        }
    }

}

export default URIWheelLayout
