import * as d3 from 'd3'
// import color from '../lib/paletteLib'
import config from '../lib/configLib'
import data from '../lib/dataLib'
import { addSelection, removeSelection } from '../actions/selectionActions';


const create = (el, props) => {
    // console.log('create', config.getSelectedConfig(props.configs, props.zone))
    if (el && data.areLoaded(props.data, props.zone)) {
        const { configs, palettes, zone, getPropPalette, setLegend } = props
        const selectedConfig = config.getSelectedConfig(configs, zone)
        const selectedData = data.getResults(props.data, zone)
        const nestedData = data.groupTimeData(selectedData, 'prop1', selectedConfig.selectedMatch.properties[0].format, 150)
        //        
        const prop2Data = d3.nest().key(legend => {
            return (legend.labelprop2.value !== '') ? legend.labelprop2.value : legend.prop2.value
        }).entries(selectedData)
        const prop2 = selectedConfig.selectedMatch.properties[1].path
        const palette = getPropPalette(palettes, prop2, prop2Data.length)
        const paletteObj = prop2Data.map((p, i) => {
            return { key: p.key, color: palette[i] }
        })
        draw(el, { ...props, nestedData, paletteObj })
        resize(el, { ...props, selectedData })
        assignBehavior(el, props)
        setLegend(paletteObj)
    }
}

const update = (el, props) => {
    //
    if (el && props.data) {
        const { display } = props
        const selectedData = data.getResults(props.data, props.zone)
        resize(el, { ...props, selectedData })
        assignBehavior(el, props)
    }
}

const destroy = (el) => {
    //
}

const draw = (el, props) => {
    const { nestedData, paletteObj, createSelection } = props
    const timeUnits = d3.select(el)
        .selectAll('g.time')
        .data(nestedData)
        .enter()
        .append('g')
        .attr('class', 'time')
    const bookUnits = timeUnits.selectAll('line')
        .data(d => d.values)
        .enter()
        .append('line')
        .attr('stroke', d => paletteObj.filter(p => (p.key === d.prop2.value || p.key === d.labelprop2.value))[0].color )
    const bookIndex = d3.selectAll('line')
        .attr('id', (d, i) => `book_${i}`)
}

const assignBehavior = (el, props) => {
    const { selections, zone, isSelected, addSelection, removeSelection } = props
    const bookIndex = d3.selectAll('line')
        .classed('selected', (d, i) => isSelected(`book_${i}`, zone, selections)) // check id in selection
        .on('click', (d, i) => {
            console.log(selections)
            isSelected(`book_${i}`, zone, selections) ?
                removeSelection(zone, `book_${i}`) : addSelection(zone, `book_${i}`, [{ uri: d.entrypoint }])
        })
}

const resize = (el, props) => {
    const { selectedData, display } = props
    const xScale = d3.scaleLinear()
        .domain([Number(selectedData[0].prop1.value), Number(selectedData[selectedData.length - 1].prop1.value)])
        .range([0, display.viz.useful_width])
    let maxUnitsPerYear = 1
    const timeUnits = d3.select(el)
        .selectAll('g.time')
        .attr('transform', d => `translate(${xScale(Number(d.key))}, 0)`)
        .each(d => {
            if (d.values.length > maxUnitsPerYear) maxUnitsPerYear = d.values.length
        })
    const bookUnits = timeUnits.selectAll('line')
    const unitHeight = Math.floor(display.viz.useful_height / maxUnitsPerYear)
    const unitWidth = Math.floor(display.viz.useful_width / timeUnits.size())
    bookUnits
        .attr('x1', Math.ceil(unitWidth / 2))
        .attr('x2', Math.ceil(unitWidth / 2))
        .attr('y1', (d, i) => display.viz.useful_height - (i * unitHeight))
        .attr('y2', (d, i) => display.viz.useful_height - (i * unitHeight + unitHeight - 1))
        .attr('stroke-width', unitWidth - 1)

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
