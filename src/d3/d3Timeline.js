import * as d3 from 'd3'
// import color from '../lib/paletteLib'
import config from '../lib/configLib'
import data from '../lib/dataLib'
import selectionLib from '../lib/selectionLib'
import { addSelection, removeSelection } from '../actions/selectionActions'

const create = (el, props) => {
    // console.log('create', config.getSelectedConfig(props.configs, props.zone))
    if (el && data.areLoaded(props.data, props.zone)) {
        const { configs, palette, zone, getPropPalette, setLegend } = props

        draw(el, props)
        redraw(el, props)
        resize(el, props)
        assignBehavior(el, props)

        setLegend(makeLegend(el, props))
    }
}

const makeLegend = (el, props) => {
    const { palette } = props
    return palette.map(pal => {
        // gives the list of elemebts to be selected when legend is clicked
        let elements = []
        d3.select(el).selectAll('.elements').each(d => {
            if ((d.prop2 && pal.key === d.prop2.value) || (d.labelprop2 && pal.key === d.labelprop2.value)) {
                elements.push(d.selection)
            }
        })
        return {
            ...pal,
            elements
        }
    })
}

const update = (el, props) => {
    //
    if (el && props.data) {
        redraw(el, props)
        resize(el, props)
    }
}

const destroy = (el) => {
    //
}

const draw = (el, props) => {
    const { nestedData, palette, selectedConfig } = props
    // console.log(nestedData)
    const timeUnits = d3.select(el)
        .selectAll('g.time')
        .data(nestedData)
        .enter()
        .append('g')
        .attr('class', 'time')
    const elementUnits = timeUnits.selectAll('line')
        .data(d => d.values)
        .enter()
        .append('g')
        .attr('class', 'elements')
    elementUnits
        .append('line')
        .attr('class', 'element')
        .attr('stroke', d => d.color)
    // console.log(selectedConfig)
    elementUnits
        .append('line')
        .attr('class', 'selection')
    const elementIndex = d3.select(el).selectAll('.element')
        .attr('id', (d, i) => `timeline_element_${i}`)
        .each((d, i) => {
            d.color = palette.filter(p => (p.key === d.prop2.value || (d.labelprop2 && p.key === d.labelprop2.value)))[0].color
            d.selection = {
                selector: `timeline_element_${i}`,
                props: [
                    { path: selectedConfig.selectedMatch.properties[0].path, value: d.prop1 },
                    { path: selectedConfig.selectedMatch.properties[1].path, value: d.prop2 },
                    { path: selectedConfig.selectedMatch.properties[2].path, value: d.prop3 }
                ]
            }
        })
    elementUnits
        .attr('stroke', d => d.color)
}

const assignBehavior = (el, props) => {
    const { selectElements } = props
    const elementIndex = d3.select(el).selectAll('.elements')
        .on('click', (d, i) => {
            selectElements([d.selection])
        })
        //
}

const redraw = (el, props) => {
    // change color or class when component is rerendered
    const { selections, zone, selectElements } = props
    const elementIndex = d3.select(el).selectAll('.elements')
        .each((d, i) => {
            // console.log(d.selection)
            d.selected = selectionLib.areSelected([d.selection], zone, selections)
        })
        .classed('selected', d => d.selected)
}

const resize = (el, props) => {
    const { dataZone, nestedData, display } = props
    const xScale = d3.scaleLinear()
        .domain([Number(nestedData[0].key), Number(nestedData[nestedData.length - 1].key)])
        .range([0, display.viz.useful_width])
    let maxUnitsPerYear = 1
    const timeUnits = d3.select(el)
        .selectAll('g.time')
        .attr('transform', d => `translate(${xScale(Number(d.key))}, 0)`)
        .each(d => {
            if (d.values.length > maxUnitsPerYear) maxUnitsPerYear = d.values.length
        })
    const elementUnits = timeUnits.selectAll('.elements')
    const unitHeight = Math.floor(display.viz.useful_height / maxUnitsPerYear)
    const unitWidth = Math.floor(display.viz.useful_width / timeUnits.size())
    elementUnits
        .attr('transform', (d, i) => `translate(0, ${display.viz.useful_height - (i * unitHeight)})`)
    const elements = elementUnits.selectAll('.element')
        .attr('x1', Math.ceil(unitWidth / 2))
        .attr('x2', Math.ceil(unitWidth / 2))
        .attr('y1', 0)
        .attr('y2', -unitHeight + 1)
        .attr('stroke-width', d => d.selected ? 4 : unitWidth - 1)

    d3.select(el).selectAll('.xaxis').remove()
    const xAxis = d3.axisBottom()
        .scale(xScale)
        .tickFormat(d3.format('.0f'))

    d3.select(el).append('g')
        .attr('class', 'xaxis')
        .attr('transform', `translate(0, ${display.viz.useful_height})`)
        .call(xAxis)
}

exports.create = create
exports.destroy = destroy
exports.update = update
