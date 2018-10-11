import React from 'react'
import PropTypes from 'prop-types'

import Submit from './Submit'
import Quantifier from './Quantifier'
import { connect } from 'react-redux'

class Line extends React.Component {
    render () {
        return (
            <div className='Line'>
                {this.props.leftChildren}
                <div
                    className='field'
                    style={{
                        marginLeft: `${this.props.display.viz.horizontal_padding}px`,
                        width: `${this.props.display.viz.useful_width * 4 / 5}px`
                    }}
                >
                    <label className='label'>
                        {this.props.label}
                    </label>
                    {this.props.children}
                    <Submit
                        isLoading={this.props.isLoading}
                        onClick={this.props.onSubmit}
                        disable={this.props.disable}
                    />
                    {this.props.rightChildren}
                </div>
                <Quantifier
                    value={this.props.counterData}
                    max={this.props.maxData}
                />
            </div>
        )
    }

    static propTypes = {
        leftChildren: PropTypes.object,
        rightChildren: PropTypes.object,
        label: PropTypes.string.isRequired,
        children: PropTypes.any.isRequired,
        isLoading: PropTypes.bool.isRequired,
        onSubmit: PropTypes.func.isRequired,
        disable: PropTypes.bool.isRequired,
        maxData: PropTypes.number.isRequired,
        counterData: PropTypes.object.isRequired,
        display: PropTypes.object
    }
}

const LineConnect = connect(
    (state) => ({
        display: state.display
    })
)(Line)

export default LineConnect
