import * as d3 from 'd3'
import d3Legend from './d3Legend'
import dataLib from '../lib/dataLib'
import {getQuantitativeColors} from '../lib/paletteLib.js'
import config from '../lib/configLib'
import {dragSelection} from './d3DragSelector'
import selectionLib from '../lib/selectionLib'

const selectDrag = (props, el, position) => {
    console.log(props, el, position)
    let listRect = []
    if (position.x1 > position.x2) { let inter = position.x1; position.x1 = position.x2; position.x2 = inter }
    if (position.y1 > position.y2) { let inter = position.y1; position.y1 = position.y2; position.y2 = inter }
    d3.select(el).select('#center').selectAll('rect')
        .each(function (d) {
            let maxgauche = Math.max(Number(this.getAttribute('x')), position.x1)
            let mindroit = Math.min(Number(this.getAttribute('x')) + Number(this.getAttribute('width')), position.x2)
            let maxbas = Math.max(Number(this.getAttribute('y')), position.y1)
            let minhaut = Math.min(Number(this.getAttribute('y')) + Number(this.getAttribute('height')), position.y2)
            if (maxgauche < mindroit && maxbas < minhaut) {
                listRect.push(d.selection)
            }
        })
    console.log(listRect)
    props.selectElements(listRect)
}

const create = (el, props) => {
    // console.log('create')
    if (el && props.data) {
        reset(el, props)
        draw(el, props)
        resize(el, props)
    }
}

const reset = (el, props) => {
    console.log('reset')
    d3.select(el).selectAll('*').remove()

    let div = d3.select(el).append('g').attr('id', 'heatMapCenterPanel')
    d3.select(el).append('g').attr('id', 'centerPatternLib')
    div.append('g').attr('id', 'center')
    div.append('g').attr('id', 'selectionCenter')
}

const draw = (el, props) => {
    // console.log(el, props)
    if (!(el && props.data)) return

    let data = props.dataStat
    let xElements = d3.set(data.data.map(item => item.prop1)).values()
    let yElements = d3.set(data.data.map(item => item.prop2)).values()

    /* ******************************************************************************************************** */
    /* *****************************    Create group and bind data    ***************************************** */
    /* ******************************************************************************************************** */
    const { nestedProp1, legend, selectedConfig, selectElement, selections, zone } = props
    console.log(selections)
    d3.select(el).select('#center').selectAll('rect')
        .data(data.data)
        .enter()
        .append('rect')
        .attr('id', d => 'id-' + xElements.indexOf(d.prop1) + '-' + yElements.indexOf(d.prop2) + '-')
        .attr('idProp', d => 'id-' + d.prop1 + '-' + d.prop2 + '-')
        .attr('stroke', 'transparent')
        .attr('fill', function (d) {
            return d.color
        })
        .each((d, i) => {
            // console.log(d, d.selection)
            d.id = d.id || `heatmap_element_${dataLib.guid()}`
            // d.color = legend.info.filter(p => (p.key === d.prop2.value || (d.labelprop2 && p.key === d.labelprop2.value)))[0].color
            d.selection = {
                selector: d.id,
                props: [
                    { path: selectedConfig.properties[0].path, value: d.prop1 },
                    { path: selectedConfig.properties[1].path, value: d.prop2 }
                //    { path: selectedConfig.properties[2].path, value: d.prop3 }
                ]
            }
            d.selected = selectionLib.areSelected([d.selection], zone, selections)
        })
        .classed('selected', d => d.selected)
        .attr('opacity', d => (selections.length > 0 && d.selected === true) ? 1 : 0.4)

        /* ******************************************************************************************************** */
        /* *****************************    Assign behavior to data    ******************************************** */
        /* ******************************************************************************************************** */
    const { selectElements } = props
    d3.select(el).select('#center').selectAll('rect')
        .on('mouseover', function () {
            this.setAttribute('stroke-width', 3)
            this.setAttribute('stroke', 'black')
        })
        .on('mouseleave', function () {
            this.setAttribute('stroke-width', 0.5)
            this.setAttribute('stroke', 'transparent')
        })
        .on('click', d => {
            selectElement(d.selection)
        })

    /* ******************************************************************************************************** */
    /* *****************************    SELEC DRAG    ********************************************************* */
    /* ******************************************************************************************************** */
    d3.select(el).select('#heatMapCenterPanel').call(dragSelection(d3.select(el).select('#heatMapCenterPanel')._groups[0][0], selectDrag.bind(this, props), () => {}))

    resize(el, props)
}

const update = (el, props) => {
    if (el && props.data) {
        reset(el, props)
        draw(el, props)
        resize(el, props)
        // redraw(el, props)
    }
}

const destroy = (el) => {

}

const resize = (el, props) => {
    const { nestedProp1, selectedConfig, display } = props
    let xElements = d3.set(props.dataStat.data.map(item => item.prop1)).values()
    let yElements = d3.set(props.dataStat.data.map(item => item.prop2)).values()

    let width = props.display.viz.useful_width
    let height = props.display.viz.useful_height

    let itemSizeX = width / xElements.length
    let itemSizeY = height / yElements.length
    const categoryProp1 = selectedConfig.properties[0].category

    let xScale = null
    if (categoryProp1 === 'datetime') {
        xScale = d3.scaleLinear()
            .domain([Number(nestedProp1[0].key), Number(nestedProp1[nestedProp1.length - 1].key)])
            .range([0, width])
    } else {
        xScale = d3.scaleBand()
            .domain(xElements)
            .range([0, width])
    }
    let yScale = d3.scaleBand()
        .range([0, height])
        .domain(yElements)

    d3.select(el).select('#center').selectAll('rect')
        .attr('width', itemSizeX - 1)
        .attr('height', itemSizeY - 1)
        .attr('x', d => { return xScale(d.prop1) + 0.5 })
        .attr('y', d => yScale(d.prop2) + 0.5)
}

const getElements = (el, color) => {
    let listRect = []
    d3.select(el).select('#center').selectAll('rect').filter(function () {
        return this.getAttribute('fill').includes(color)
    }).each(function (d) {
        listRect.push(d.selection)
    })
    console.log(listRect)
    return listRect
}

exports.create = create
exports.destroy = destroy
exports.update = update
exports.getElements = getElements
