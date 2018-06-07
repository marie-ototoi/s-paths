import * as d3 from 'd3'
import AbstractLayout from './AbstractLayout'
import shallowEqual from 'shallowequal'

class HistoryLayout extends AbstractLayout {

    draw (props) {
        const { configs, currentIndex } = props
        d3.select(this.el).selectAll('circle.config')
            .data(configs)
            .enter()
            .append('circle')
            .attr('class', 'config')
            .attr('r', 4)
            .attr('stroke-width', 3)
            .attr('stroke', '#fff')

        d3.select(this.el).selectAll('circle.config')
            .attr('class', (d, i) => {
                if (d.status !== 'active') {
                    return 'config hidden'
                } else if (i === currentIndex) {
                    return 'config selected'
                } else if (i > 0 && shallowEqual(configs[i], configs[i - 1])) {
                    return 'config nochange'
                } else {
                    return 'config'
                }
            })
            .on('mouseup', (d, i) => {
                props.jumpHistory(i)
            })
    }

    resize (props) {
        d3.select(this.el).selectAll('circle.config')
            .attr('cx', (d, i) => i * 10)
    }
}
export default HistoryLayout