import * as d3 from 'd3'
import data from '../lib/data'

const formatData = (data) => {
    console.log('salut c est moi data', data)
}

const create = (el, props) => {
    //
    console.log('create', data.areLoaded(props.data, props.zone), data.getHeadings(props.data, props.zone))
    if(el && data.areLoaded(props.data, props.zone)) {
        const fData = formatData(data.getResults(props.data, props.zone))
    }
}

const update = (el, props) => {
    //
    if(el && props.data) {

    }
}

const destroy = (el) => {
    //
}

exports.create = create
exports.destroy = destroy
exports.update = update
