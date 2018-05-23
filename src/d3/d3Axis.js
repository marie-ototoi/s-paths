import * as d3 from 'd3'

export const create = (el, props) => {
    //
    if (el && props.axis) {
        draw(el, props)
        resize(el, props)
    }
}

const draw = (el, props) => {
}

export const update = (el, props) => {
    //
    if (el && props.axis) {
        draw(el, props)
        resize(el, props)
    }
}

export const destroy = (el, props) => {
    //
}

const resize = (el, props) => {
    const { axis, dimensions, selectElements, type } = props
    const { info, category } = axis
    let axeLength
    let tickV
    let tickF
    let tickA
    let legendLinePoints
    if (type === 'Bottom') {
        axeLength = dimensions.width
        legendLinePoints = { x1: 0, y1: 0.5, x2: -30, y2: 0.5 }
    } else {
        axeLength = dimensions.height
        legendLinePoints = { x1: 0, y1: dimensions.height + 20, x2: 0, y2: dimensions.height + 35 }
    }
    //
    const scale = d3.scaleLinear().range([0, axeLength])
    //

    if (category === 'number') {
        scale.domain([info[0].key, info[info.length - 1].key])
        tickV = info.map(v => Number(v.key))
        tickF = d3.format(',')
    } else if (category === 'datetime') {
        scale.domain([info[0].key, info[info.length - 1].key])
        const minDif = info.reduce((acc, current) => {
            if (acc.prev) {
                let dif = Number(current.key) - Number(acc.prev.key)
                if (!acc.dif || dif < acc.dif) acc.dif = dif
            }
            acc.prev = current
            return acc
        }, {}).dif
        // in case there would be empty years (we want them to appear in the timeline anyway, according to calculated groups)
        // note : maybe it would be better to calculate the diff based on the groups
        let ticksNumber = (Number(info[info.length - 1].key) - Number(info[0].key)) / minDif
        tickF = d3.format('.0f')
        tickA = ticksNumber
        // to be fixed : if there's many empty values on the scale
        // and the length of the info array is closer to a multiple, there might be only one out of two ticks
    } else if (category === 'text' || category === 'uri') {
        scale.domain([0, info.length - 1])
        tickV = info.map((d, i) => i)
        tickF = (d, i) => { return info[i].key }
    }
    //
    d3.select(el).selectAll(`.axis${type}`).remove()
    const axisEl = d3[`axis${type}`]()
        .scale(scale)

    if (tickA) axisEl.ticks(tickA)
    if (tickV) axisEl.tickValues(tickV)
    axisEl.tickFormat(tickF)

    d3.select(el).append('g')
        .attr('class', `axis${type}`)
        .call(axisEl)

    d3.select(el).select(`.axis${type}`)
        .append('line')
        .attr('class', `legendline`)
        .attr('x1', legendLinePoints.x1)
        .attr('y1', legendLinePoints.y1)
        .attr('x2', legendLinePoints.x2)
        .attr('y2', legendLinePoints.y2)
    const ticks = d3.select(el).selectAll(`.axis${type} .tick`)
    const tickWidth = (type === 'Bottom') ? Math.floor(dimensions.width / ticks.size()) : 7
    const tickHeight = (type === 'Bottom') ? 7 : Math.floor(dimensions.height / (ticks.size() - 1))
    const tickX = (type === 'Bottom') ? 0 : -7
    const tickY = (type === 'Bottom') ? 2 : 0

    // console.log(dimensions.height, tickX, tickY, tickWidth, tickHeight)
    ticks.append('rect')
        .classed('reactzone', true)
        .attr('width', tickWidth)
        .attr('x', tickX)
        .attr('y', tickY)
        .attr('height', tickHeight)
    // console.log(axis.info)
    d3.select(el).selectAll('.tick')
        .on('click', (d, indexD) => {
            let data
            if (category === 'text' || category === 'uri') {
                data = axis.info.filter((i, indexI) => indexD === indexI)
            } else {
                data = axis.info.filter(i => i.key === String(d))
            }
            if (data.length > 0) {
                // console.log(data[0])
                selectElements(data[0].propName, data[0].range, data[0].category)
            }
        })
        .classed('selectable', (d, indexD) => {
            // console.log(d, axis.info)
            let data = axis.info.filter((i, indexI) => indexD === indexI)
            // console.log(data)
            return (data.length > 0 && data[0].range !== null)
        })
    d3.select(el).selectAll('.tick text')
        .attr('width', 400)
        .attr('text-anchor', 'end')
        .attr('transform', d => {
            if (type === 'Bottom') {
                return `translate(${(category === 'datetime') ? -8 : -8 + (axeLength / ((ticks.size() - 1) * 2))}, 3) rotate(315 0,0)`
            } else {
                return `translate(-5, ${axeLength / ((ticks.size() - 1) * 2)})`
            }
        })
        //
}
