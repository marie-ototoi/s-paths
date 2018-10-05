import React from 'react'
import PropTypes from 'prop-types'
import connect from 'react-redux/es/connect/connect'

class Quantifier extends React.Component {
    render () {
        let percent = this.props.value.total / this.props.max
        if (percent > 1) percent = 1
        return (
            <div>
                <div style={{ width: `${this.props.display.viz.useful_width / 3}px` }}>
                    <progress
                        className="progress is-small"
                        value={this.props.value.total}
                        max={this.props.max}
                    >
                        {percent}%
                    </progress>
                </div>
                <p className="text-progress is-size-7">
                    {this.props.value.total}
                    <span className="is-pulled-right">&nbsp;{this.props.value.label}</span>
                </p>
            </div>
        )
    }

    static propTypes = {
        display: PropTypes.object.isRequired,
        value: PropTypes.object.isRequired,
        max: PropTypes.number.isRequired
    }
}

const QuantifierConnect = connect(
    (state) => ({
        display: state.display
    })
)(Quantifier)

export default QuantifierConnect
