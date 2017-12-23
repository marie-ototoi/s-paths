import * as d3 from 'd3'
import d3AxisBottom from './d3AxisBottom'
import d3AxisLeft from './d3AxisLeft'

const create = (el, props) => {
    const { type } = props
    switch (type) {
    case 'bottom':
        bottom(el, props)
            .addKeys(props.keys, props.keysDisplay)
            .addTitles(props.titles)
        //            .assignBehaviors(props.behaviors)
        break
    case 'left':
        left(el, props)
            .addKeys(props.keys, props.keysDisplay)
            .addTitles(props.titles)
        //          .assignBehaviors(props.behaviors)
        break
    default:
    }
    update(el, props)
}

const update = (el, props) => {
    const { type } = props
    switch (type) {
    case 'bottom':
        d3AxisBottom.resize(el, props)
        break
    case 'left':
        d3AxisLeft.resize(el, props)
    default:
    }
}

const destroy = (el) => {
    //
}

const bottom = (el, props) => {
    let position =
     {
         x1: props.display.viz.horizontal_margin,
         y1: props.display.viz.vertical_margin + props.display.viz.useful_height,
         x2: props.display.viz.horizontal_margin + props.display.viz.useful_width,
         y2: props.display.viz.vertical_margin + props.display.viz.useful_height
     }
    return new d3AxisBottom(el, position)
}
const top = (el, props) => {
    let position =
     {
         x1: props.display.viz.horizontal_margin,
         y1: props.display.viz.vertical_margin,
         x2: props.display.viz.horizontal_margin + props.display.viz.useful_width,
         y2: props.display.viz.vertical_margin
     }
    return new d3Axis(el, position)
}
const left = (el, props) => {
    let position =
     {
         x1: props.display.viz.horizontal_margin,
         y1: props.display.viz.vertical_margin + props.display.viz.useful_height,
         x2: props.display.viz.horizontal_margin,
         y2: props.display.viz.vertical_margin
     }
    d3.select(el).attr('transform', 'translate(' + props.display.zones[props.zone].x + ',' + props.display.zones[props.zone].y + ')')
    return new d3AxisLeft(el, position)
}
const right = (el, props) => {
    let position =
     {
         x1: props.display.viz.horizontal_margin + props.display.viz.useful_width,
         y1: props.display.viz.vertical_margin,
         x2: props.display.viz.horizontal_margin + props.display.viz.useful_width,
         y2: props.display.viz.vertical_margin + props.display.viz.useful_height
     }
    return new d3Axis(el, position)
}

exports.create = create
exports.destroy = destroy
exports.update = update
