import React from 'react'
import PropTypes from 'prop-types'

import './Selection.css'

class Selection extends React.Component {
    render () {
        return (
            <div className='Selection'>
                {(
                    !this.props.isLoading &&
                    <button
                        className='button'
                        onClick={this.props.onClick}
                        disabled={this.props.disable}
                    >
                        focus on selection
                        <span className='icon'>
                            <i className='fas fa-mouse-pointer' />
                        </span>
                    </button>
                ) ||
                    <span className='Selection button is-loading'>focus on selection</span>
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

export default Selection
