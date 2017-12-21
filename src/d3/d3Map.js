import * as d3 from 'd3'
import dataLib from '../lib/dataLib'
import { worldJson, worldJsonImmutable, places } from '../constants/worldGeoJson'

(function () {
    d3.fisheye = function () {
        var radius = 40,
            power = 6,
            k0,
            k1,
            center = [0, 0]
        function fisheye (d) {
            var dx = d[0] - center[0],
                dy = d[1] - center[1],
                dd = Math.sqrt(dx * dx + dy * dy)
            if (dd >= radius) return d
            var k = k0 * (1 - Math.exp(-dd * k1)) / dd * 0.75 + 0.25
            return [center[0] + dx * k, center[1] + dy * k]
        }

        function rescale () {
            k0 = Math.exp(power)
            k0 = k0 / (k0 - 1) * radius
            k1 = power / radius
            return fisheye
        }

        fisheye.radius = function (_) {
            if (!arguments.length) return radius
            radius = +_
            return rescale()
        }

        fisheye.power = function (_) {
            if (!arguments.length) return power
            power = +_
            return rescale()
        }

        fisheye.center = function (_) {
            if (!arguments.length) return center
            center = _
            return fisheye
        }

        return rescale()
    }
})()

const fishEye = (el, props, projection, geoPath) => {
    if (true) return
    var fisheye = d3.fisheye()
    fisheye.center(projection.invert(d3.mouse(el)))
    /* d3.select(el).select('#lens')
        .attr('cx', d3.event.clientX - props.display.viz.horizontal_margin)
        .attr('cy', d3.event.clientY - props.display.viz.vertical_margin) */
    d3.select(el).select('#places').selectAll('circle').each(function (d) {
        let coord = projection(fisheye([d.longitude.value, d.latitude.value]))
        this.setAttribute('cx', coord[0])
        this.setAttribute('cy', coord[1])
    })
    d3.select(el).select('#mapPaths').selectAll('path').each(function (d, k) {
        for (var i = 0; i < d.geometry.coordinates.length; i++) {
            if (d.geometry.coordinates[i][0].length > 2) {
                for (var j = 0; j < d.geometry.coordinates[i].length; j++) {
                    d.geometry.coordinates[i][j] = worldJsonImmutable.features[k].geometry.coordinates[i][j].map(fisheye)
                }
            } else {
                d.geometry.coordinates[i] = worldJsonImmutable.features[k].geometry.coordinates[i].map(fisheye)
            }
        }
    })
    d3.select(el).select('#mapPaths').selectAll('path').attr('d', geoPath)
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

    let projection = d3.geoEquirectangular()
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
    let xMargin = props.display.viz.horizontal_margin
    let yMargin = props.display.viz.vertical_margin
    console.log(width, height)
    let projection = d3.geoEquirectangular()
        .fitExtent([[0, 0], [width, height]], worldJson)
        .clipExtent([[0, 0], [props.display.viz.useful_width, props.display.viz.useful_height]])

    let zoom = d3.zoom()
        .wheelDelta(function () {
            return -d3.event.deltaY * (d3.event.deltaMode ? 120 : 1) / 800
        })
        .scaleExtent([1, 10])
        .on('zoom', function () {
            // console.log(d3.event)
            // console.log(d3.event.transform)
            // computeCliping(el, props, d3.event.transform.k, d3.event.transform.x, d3.event.transform.y)
        })

    let geoPath = d3.geoPath()
        .projection(projection)

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
            fishEye(el, props, projection, geoPath)
        })

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
            // d.saveGeo = d.geometry
            // if (this.getBoundingClientRect().width < 40 || this.getBoundingClientRect().height < 40) this.setAttribute('fill', '#888')
        })
        .on('mousemove', function () {
            fishEye(el, props, projection, geoPath)
        })
        .on('mouseover', function (d, i) {
            // this.setAttribute('fill', 'red')
        })
        .on('mouseleave', function (d, i) {
            // this.setAttribute('fill', 'white')
        })
        .on('click', function (d) {

            // computeCliping(el, props, 1, 0, 0)

            // console.log(d.geometry.coordinates[0])
            /*
                let id = this.getAttribute('id')
                d3.select(el).selectAll('path').filter(function () { return id !== this.getAttribute('id') })
                    .each(function () {
                        // this.setAttribute('transform', 'scale(0.8,0.8)')
                    })
                    */

            //  d3.select(el).select('#mapPaths').selectAll('path').attr('d', geoPath)
        })

    d3.select(el).append('g').attr('id', 'places')
        .selectAll('circle')
        .data(places.results.bindings)
        .enter()
        .append('circle')
        .attr('id', function (d) { return d.name.value })
        .attr('r', 4)
        .attr('fill', 'blue')
        .style('visibility', 'hidden')
        .attr('cx', function (d) { return projection([d.longitude.value, d.latitude.value])[0] })
        .attr('cy', function (d) { return projection([d.longitude.value, d.latitude.value])[1] })

    computeAgregation(el, props)
    /*
    let bBoxScale = d3.select(el).select('#places').node().getBoundingClientRect()
    console.log(bBoxScale)
    let clipX = bBoxScale.x - 10 - xMargin
    let clipY = bBoxScale.y - 10 - yMargin
    let clipWidth = clipX + bBoxScale.width + 10
    let clipHeight = clipY + bBoxScale.height + 10
    console.log(clipX, clipY, clipWidth, clipHeight)
    projection.clipExtent([[clipX, clipY], [clipWidth, clipHeight]])

    let k = bBoxScale.width > bBoxScale.height ? width / (bBoxScale.width + 20) : height / (bBoxScale.height + 20)
    let x = -((bBoxScale.x - props.display.viz.horizontal_margin + (bBoxScale.width / 2)) * (k - 1))
    let y = -((bBoxScale.y - props.display.viz.vertical_margin + (bBoxScale.height / 2)) * (k - 1))
    computeCliping(el, props, k, x, y)
    d3.select(el).selectAll('circle')
        .attr('transform', 'scale(' + k + ') ' + 'translate(' + x / k + ',' + y / k + ')')
        .attr('r', 4 / k)
        */
    /* ******************************************************************************************************** */
    /* *****************************    init legend    ********************************************************* */
    /* ******************************************************************************************************** */

    /* ******************************************************************************************************** */
    /* *****************************    compute size/placement of items    ************************************ */
    /* ******************************************************************************************************** */
    resize(el, props)

    d3.select(el).selectAll('path').each(function (d1) {
        let poly = extractPolygone(d1.geometry.coordinates)
        let count = 0
        d3.selectAll('circle').each(function (d2) {
            if (d3.polygonContains(poly, [d2.longitude.value, d2.latitude.value])) {
                count++
            }
        })
        this.setAttribute('metadata', count)
    })

    d3.select(el).append('rect').attr('x', 0).attr('y', 0).attr('width', 40).attr('height', 40).attr('fill', 'yellow').on('click', () => visibilityLevel(el, 'country'))
    d3.select(el).append('rect').attr('x', 0).attr('y', 41).attr('width', 40).attr('height', 40).attr('fill', 'purple').on('click', () => visibilityLevel(el, 'metadata'))
    d3.select(el).append('rect').attr('x', 0).attr('y', 82).attr('width', 40).attr('height', 40).attr('fill', 'pink').on('click', () => visibilityLevel(el, 'agregate'))

    visibilityLevel(el, 'metadata')

    // d3.select(el).append('circle').attr('id', 'lens').attr('r', 80).attr('fill', 'transparent').attr('stroke', 'black').attr('stroke-width', 1).style('pointer-events', 'none')
}

const computeDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

const computeAgregation = (el, props) => {
    d3.select(el).append('g').attr('id', 'agregatePoint')

    let res = []
    d3.select(el).select('#places').selectAll('circle').each(function (d, i) {
        if (i === 0) res.push([[Number(this.getAttribute('cx')), Number(this.getAttribute('cy'))]])
        else {
            let coord = [Number(this.getAttribute('cx')), Number(this.getAttribute('cy'))]
            var pushed = false
            for (var k = 0; k < res.length; k++) {
                for (var j = 0; j < res[k].length; j++) {
                    if (computeDistance(res[k][j][0], res[k][j][1], coord[0], coord[1]) < 10) {
                        res[k].push(coord)
                        pushed = true
                        break
                    }
                }
                if (pushed) break
            }
            if (!pushed) res.push([coord])
        }
    })

    for (var c in res) {
        let centroidX = 0
        let centroidY = 0
        for (var i = 0; i < res[c].length; i++) {
            centroidX += res[c][i][0]
            centroidY += res[c][i][1]
        }
        centroidX = centroidX / res[c].length
        centroidY = centroidY / res[c].length

        console.log(centroidX, centroidY)

        d3.select(el).select('#agregatePoint').append('circle').attr('cx', centroidX).attr('cy', centroidY).attr('r', 15).attr('fill', 'red')
    }
}

const visibilityLevel = (el, mode) => {
    if (mode === 'country') {
        d3.select(el).selectAll('path').each(function (d1) {
            if (Number(this.getAttribute('metadata')) > 0) this.setAttribute('fill', 'green')
        })
        d3.select(el).select('#places').selectAll('circle').style('visibility', 'hidden')
    } else if (mode === 'metadata') {
        d3.select(el).selectAll('path').attr('fill', 'white')
        d3.select(el).select('#places').selectAll('circle').style('visibility', 'visible')
    } else if (mode === 'agregate') {
        d3.select(el).selectAll('path').attr('fill', 'white')
        d3.select(el).select('#places').selectAll('circle').style('visibility', 'hidden')
    }
}

const extractPolygone = (coord) => {
    var polygone = []
    if (coord[0].length == 2) {
        return coord
    } else {
        for (var i = 0; i < coord.length; i++) {
            var inter = extractPolygone(coord[i])
            for (var j = 0; j < inter.length; j++) {
                polygone.push(inter[j])
            }
        }
    }
    return polygone
}

const getPositionOfData = (x, y) => {
    var projX = d3.geoEquirectangular()([x, y])[0]
    var projY = d3.geoEquirectangular()([x, y])[1]
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
