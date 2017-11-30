import * as d3 from 'd3'
import d3AxisBottom from './d3AxisBottom'

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
         y1: props.display.viz.vertical_margin,
         x2: props.display.viz.horizontal_margin,
         y2: props.display.viz.vertical_margin + props.display.viz.useful_height
     }
    return new d3Axis(el, position)
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

exports.bottom = bottom
exports.top = top
exports.left = left
exports.right = right
