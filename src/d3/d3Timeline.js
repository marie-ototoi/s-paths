import * as d3 from 'd3'
// import color from '../lib/paletteLib'
import config from '../lib/configLib'
import data from '../lib/dataLib'
import selectionLib from '../lib/selectionLib'
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
            return (legend.labelprop2 && legend.labelprop2.value !== '') ? legend.labelprop2.value : legend.prop2.value
        }).entries(selectedData)
        const prop2 = selectedConfig.selectedMatch.properties[1].path
        const colors = getPropPalette(palettes, prop2, prop2Data.length)
        const palette = prop2Data.map((p, i) => {
            return { key: p.key, color: colors[i] }
        })
        draw(el, { ...props, nestedData, palette, selectedConfig })
        resize(el, { ...props, selectedData })
        assignBehavior(el, props)

        setLegend(palette.map(pal => {
            // gives the list of elemebts to be selected when legend is clicked
            let elements = []
            d3.select(el).selectAll('line').each(d => {
                if ((d.prop2 && pal.key === d.prop2.value) || (d.labelprop2 && pal.key === d.labelprop2.value)) {
                    elements.push(d.selection)
                }
            })
            return {
                ...pal,
                elements
            }
        }))
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
    const { nestedData, palette, selectedConfig , zone, selections } = props
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
        .attr('class', 'elements')
        .attr('stroke', d => palette.filter(p => (p.key === d.prop2.value || (d.labelprop2 && p.key === d.labelprop2.value)))[0].color )
    //console.log(selectedConfig)
    const bookIndex = d3.select(el).selectAll('line.elements')
        .attr('id', (d, i) => `book_${i}`)
        .each((d, i) => {
            d.selection = {
                selector: `book_${i}`, 
                props: [
                    { path: selectedConfig.selectedMatch.properties[0].path, value: d.prop1 },
                    { path: selectedConfig.selectedMatch.properties[1].path, value: d.prop2 },
                    { path: selectedConfig.selectedMatch.properties[2].path, value: d.prop3 }
                ]
            }
        })

}

const assignBehavior = (el, props) => {
    const { selections, zone, select } = props
    const bookIndex = d3.select(el).selectAll('line.elements')
        .each((d, i) => {
            d.selected = selectionLib.isSelected(`book_${i}`, zone, selections)
        })
        .classed('selected', d => d.selected)
        .on('click', (d, i) => select([d.selection], zone, selections))
        // 
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
