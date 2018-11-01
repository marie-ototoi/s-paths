import React from 'react'
import PropTypes from 'prop-types'

import './Pivot.css'

class Pivot extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            open: false
        }
    }
    render () {
        return (
            <div>
                {(
                    !this.props.isLoading &&
                    <div className='Pivot'>
                        <button
                            className='button'
                            disabled={this.props.disable}
                            onClick={e => this.setState({open: !this.state.open})}
                        >
                            Pivot from selection to...
                            {this.state.open &&
                                <ul>
                                    {this.props.elements.map((piv, i) => (
                                        <li
                                            key = {`piv_ep${i}`}
                                            onClick={e => {
                                                this.props.onClick(piv)
                                                this.setState({open: false})
                                            }}
                                            title={piv.comment}
                                        >
                                            <span>{piv.label}</span>
                                        </li>
                                    ))}
                                </ul>
                            }
                        </button>
                      
                        
                    </div>
                ) ||
                    <span className='Pivot button is-loading'>Pivot from selection to...</span>
                }
            </div>
        )
    }

    static propTypes = {
        elements: PropTypes.array,
        isLoading: PropTypes.bool.isRequired,
        disable: PropTypes.bool.isRequired,
        onClick: PropTypes.func.isRequired
    }
}

export default Pivot
