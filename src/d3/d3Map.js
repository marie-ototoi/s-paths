import * as d3 from 'd3'
import dataLib from '../lib/dataLib'
import { worldJson } from '../constants/worldGeoJson'

const create = (el, props) => {
    if (!(el && dataLib.areLoaded(props.data, props.zone))) return
    let width = props.display.viz.useful_width
    let height = props.display.viz.useful_height
    d3.select(el).append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'white')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)

    let projection = d3.geoMercator()
    //    .scale(10)
    //    .translate([ width / 2, height / 2 ])
    let geoPath = d3.geoPath()
        .projection(projection)
    d3.select(el).append('g').attr('id', 'mapPaths')
        .selectAll('path')
        .data(worldJson.features)
        .enter()
        .append('path')
        .attr('id', function (d) { return d.id })
        .attr('stroke-width', 0.5)
        .attr('stroke', 'black')
        .attr('fill', 'white') // change land color
        .attr('d', geoPath)

    let bBoxScale = d3.select('#mapPaths').node().getBoundingClientRect()
    let scaleX = width / bBoxScale.width
    let scaleY = height / bBoxScale.height
    d3.select('#mapPaths').attr('transform', 'scale(' + scaleX + ',' + scaleY + ')')
    let bBoxTrans = d3.select('#mapPaths').node().getBoundingClientRect()
    d3.select('#mapPaths').attr('transform', 'scale(' + scaleX + ',' + scaleY + ')' +
     ' translate(' + (1 / scaleX) * (props.display.viz.horizontal_margin - bBoxTrans.x) + ',' + (1 / scaleY) * (props.display.viz.vertical_margin - bBoxTrans.y) + ')')

    /* ******************************************************************************************************** */
    /* *****************************    init legend    ********************************************************* */
    /* ******************************************************************************************************** */

    /* ******************************************************************************************************** */
    /* *****************************    compute size/placement of items    ************************************ */
    /* ******************************************************************************************************** */
    resize(el, props)
}

const update = (el, props) => {
    if (el && props.data) {
        resize(el, props)
        redraw(el, props)
    }
}

const destroy = (el) => {

}

const redraw = (el, props) => {

}

const resize = (el, props) => {

}

exports.create = create
exports.destroy = destroy
exports.update = update
