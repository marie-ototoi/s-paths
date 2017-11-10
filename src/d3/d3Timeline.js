import * as d3 from 'd3'

const formatData = (data) => {
    //console.log('salut c est moi data')
}

const create = (el, props) => {
    //
    if(el && props.data.statements) {
        formatData(props.data.statements)
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
