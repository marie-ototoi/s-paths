import * as d3 from 'd3'

const create = (el, props) => {
    // console.log('create', props)
    if (el && props.legend) {
        draw(el, props)
        resize(el, props)
    }
}

const draw = (el, props) => {
    const { configs } = props
    
}

const update = (el, props) => {
    if (el && props.legend) {
        draw(el, props)
        resize(el, props)
    }
}

const destroy = (el) => {
    //
}

const resize = (el, props) => {

}

exports.create = create
exports.destroy = destroy
exports.update = update
