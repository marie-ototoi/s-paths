import React from 'react'
import PropTypes from 'prop-types'

import './Submit.css'

class Submit extends React.Component {
    render () {
        return (
            <div className="Submit">
                {!this.props.isLoading &&
                    <button
                        className="button"
                        onClick={this.props.onClick}
                        disabled={this.props.disable}
                    >
                        <span className="icon">
                            <i className="fas fa-arrow-down fa-lg"/>
                        </span>
                    </button>
                ||
                    <span className="button is-loading"/>
                }
            </div>
        )
    }

    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        disable: PropTypes.bool.isRequired,
        onClick: PropTypes.func.isRequired
    }
}

export default Submit
