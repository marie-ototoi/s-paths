import * as d3 from 'd3'
import dataLib from '../lib/dataLib'
import { worldJson, places } from '../constants/worldGeoJson'

const fishEye = () => {
    console.log('fisheye')
}

const computeCliping = (el, props, k, x, y) => {
    let width = props.display.viz.useful_width
    let height = props.display.viz.useful_height
    d3.select(el).selectAll('path')
        .attr('transform', 'scale(' + k + ') ' + 'translate(' + x / k + ',' + y / k + ')')

    let xClip = Math.abs(x * (1 / k))
    let yClip = Math.abs(y * (1 / k))
    let widthClip = xClip + (width * (1 / k))
    let heightClip = yClip + (height * (1 / k))

    let projection = d3.geoMercator()
        .fitExtent([[0, 0], [width, height]], worldJson)
        .clipExtent([[xClip, yClip], [widthClip, heightClip]], worldJson)
    let geoPath2 = d3.geoPath()
        .projection(projection)

    d3.select(el).selectAll('path').attr('d', geoPath2)
}

const create = (el, props) => {
    if (!(el && dataLib.areLoaded(props.data, props.zone))) return
    let width = props.display.viz.useful_width
    let height = props.display.viz.useful_height
    console.log(width, height)
    let projection = d3.geoMercator()
        .fitExtent([[0, 0], [width, height]], worldJson)
        .clipExtent([[0, 0], [props.display.viz.useful_width, props.display.viz.useful_height]])

    let zoom = d3.zoom()
        .wheelDelta(function () {
            return -d3.event.deltaY * (d3.event.deltaMode ? 120 : 1) / 800
        })
        .scaleExtent([1, 10])
        .on('zoom', function () {
            console.log(d3.event)
            console.log(d3.event.transform)
            computeCliping(el, props, d3.event.transform.k, d3.event.transform.x, d3.event.transform.y)
        })

    d3.select(el).call(zoom)

    d3.select(el).append('rect')
        .attr('id', 'clip')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'white')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .on('mousemove', function () {
            fishEye()
        })

    let geoPath = d3.geoPath()
        .projection(projection)

    d3.select(el).append('g').attr('id', 'mapPaths')
        .selectAll('path')
        .data(worldJson.features)
        .enter()
        .append('path')
    d3.select(el).select('#mapPaths').selectAll('path')
        .attr('id', function (d) { return d.id })
        .attr('stroke-width', 0.35)
        .attr('stroke', 'black')
        .attr('fill', 'white')
        .attr('d', geoPath)
        .each(function (d) {
            if (this.getBoundingClientRect().width < 40 || this.getBoundingClientRect().height < 40) this.setAttribute('fill', '#888')
        })
        .on('mousemove', function () {
            fishEye()
        })
        .on('mouseover', function (d, i) {
            this.setAttribute('fill', 'red')
        })
        .on('mouseleave', function (d, i) {
            this.setAttribute('fill', 'white')
        })
        .on('click', function (d) {
            console.log(d)
            console.log(projection.invert(d3.mouse(el)))
            /*
                let id = this.getAttribute('id')
                d3.select(el).selectAll('path').filter(function () { return id !== this.getAttribute('id') })
                    .each(function () {
                        // this.setAttribute('transform', 'scale(0.8,0.8)')
                    })
                    */
        })

    /*    d3.select(el).append('g').attr('id', 'places')
        .selectAll('circle')
        .data(places.results.bindings)
        .enter()
        .append('circle')
        .attr('id', function (d) { return d.name.value })
        .attr('r', 4)
        .attr('fill', 'blue')
        .attr('cx', function (d) { return projection([d.longitude.value, d.latitude.value])[0] })
        .attr('cy', function (d) { return projection([d.longitude.value, d.latitude.value])[1] })

    /*    let bBoxScale = d3.select(el).select('#places').node().getBoundingClientRect()
    console.log(bBoxScale)
    let clipX = bBoxScale.x - 10 - xMargin
    let clipY = bBoxScale.y - 10 - yMargin
    let clipWidth = clipX + bBoxScale.width + 10
    let clipHeight = clipY + bBoxScale.height + 10
    console.log(clipX, clipY, clipWidth, clipHeight)
    projection.clipExtent([[clipX, clipY], [clipWidth, clipHeight]])

    let bBoxScale = d3.select(el).select('#places').node().getBoundingClientRect()
    let k = bBoxScale.width > bBoxScale.height ? width / (bBoxScale.width + 20) : height / (bBoxScale.height + 20)
    let x = -((bBoxScale.x - props.display.viz.horizontal_margin + (bBoxScale.width / 2)) * (k - 1))
    let y = -((bBoxScale.y - props.display.viz.vertical_margin + (bBoxScale.height / 2)) * (k - 1))
    computeCliping(el, props, k, x, y)
    d3.select(el).selectAll('circle')
        .attr('transform', 'scale(' + k + ') ' + 'translate(' + x / k + ',' + y / k + ')') */
    /* ******************************************************************************************************** */
    /* *****************************    init legend    ********************************************************* */
    /* ******************************************************************************************************** */

    /* ******************************************************************************************************** */
    /* *****************************    compute size/placement of items    ************************************ */
    /* ******************************************************************************************************** */
    resize(el, props)
}

const getPositionOfData = (x, y) => {
    var projX = d3.geoMercator()([x, y])[0]
    var projY = d3.geoMercator()([x, y])[1]
    return {projX, projY}
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
