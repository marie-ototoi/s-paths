import * as d3 from 'd3'

export class d3AxisAbstract {
    constructor (el, positions) {
        this.el = d3.select(el)
        d3.select(el).append('line')
            .attr('x1', positions.x1)
            .attr('y1', positions.y1)
            .attr('x2', positions.x2)
            .attr('y2', positions.y2)
            .attr('stroke-width', 2)
            .attr('stroke', 'black')
    }

    addTitles (titles) {
        throw new Error('You have to implement the method addTitles!')
    }

    addKeys (keys) {
        throw new Error('You have to implement the method addKeys!')
    }
    /*
    create (ref, title, labels, positions, orientation) {

        default:
        }
    }
*/
    assignBehavior (items, type, fun) {
        switch (items) {
        case 'keys':
            this.ticks.on(type, fun)
            break
        default:
        }
        return this
    }

    update () {
        throw new Error('You have to implement the method update!')
    }

    destroy () {
    }

    resize (position) {

    }
}
