import * as d3 from 'd3'
import data from '../lib/dataLib'

const create = (el, props) => {
    // console.log('create', config.getSelectedConfig(props.configs, props.zone))
    if (el && data.areLoaded(props.data, props.zone)) {
        resize(el, props)
    }
}

const update = (el, props) => {
    //
    if (el && props.data) {
        resize(el, props)
    }
}

const destroy = (el) => {
    //
}

const resize = (el, props) => {
    const { display } = props
    
}

exports.create = create
exports.destroy = destroy
exports.update = update
