import React from 'react'
import PropTypes from 'prop-types'

import './Selection.css'

class Selection extends React.Component {
    render () {
        return (
            <div className={`Selection Selection_${this.props.type}`}>
                {(
                    !this.props.isLoading &&
                    <button
                        className='button'
                        onClick={this.props.onClick}
                        disabled={this.props.disable}
                    >
                        { this.props.type === 'standard' ? 'Focus on selection' : 'Focus in same config' }
                    </button>
                ) ||
                    <span className='button is-loading'>{ this.props.type === 'standard' ? 'Focus on selection' : 'Focus in same config' }</span>
                }
            </div>
        )
    }

    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        disable: PropTypes.bool.isRequired,
        onClick: PropTypes.func.isRequired,
        type: PropTypes.string
    }
}

export default Selection
