import * as d3 from 'd3'
import dataLib from '../lib/dataLib'

const create = (el, props) => {
    if (!(el && dataLib.areLoaded(props.data, props.zone))) return

    /* ******************************************************************************************************** */
    /* *****************************    init legend    ********************************************************* */
    /* ******************************************************************************************************** */
    const { setLegend } = props
    setLegend(props.palette)

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
