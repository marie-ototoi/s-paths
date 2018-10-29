import React from 'react'
import PropTypes from 'prop-types'

import './Pivot.css'

class Pivot extends React.Component {
    render () {
        return (
            <div>
                {(
                    !this.props.isLoading &&
                    <div>
                        <button
                            className='Pivot button'
                            onClick={this.props.onClick}
                            disabled={this.props.disable}
                        >
                            Pivot from selection 
                        </button>
                        <div className="title is-7">Entities from the selection also belonging to the class:</div>
                        <ul>
                            {
                                this.props.elements.typeentrypoint && this.props.elements.typeentrypoint.map((piv, i) => (
                                    <li key = {`piv_ep${i}`} onClick={e => this.props.onClick({ prop: 'typeentrypoint', type: piv })}>{piv}</li>
                                ))
                            }
                        </ul>
                        <div className="title is-7">Entities related to the selection through one of the currently displayed paths:</div>
                        <ul>
                            {
                                this.props.elements.paths && this.props.elements.paths.map((classelt, cli) => {
                                    return classelt.props.map((piv, i) => (
                                        <li key = {`piv_cl${cli}ep${i}`} onClick={e => this.props.onClick(piv)}>{classelt.class} {piv.prop}</li>
                                    ))
                                })
                            }
                        </ul>
                    </div>
                ) ||
                    <span className='Pivot button is-loading'>Pivot to</span>
                }
            </div>
        )
    }

    static propTypes = {
        elements: PropTypes.object,
        isLoading: PropTypes.bool.isRequired,
        disable: PropTypes.bool.isRequired,
        onClick: PropTypes.func.isRequired
    }
}

export default Pivot
