import React from 'react'
import PropTypes from 'prop-types'
import { Async as ReactSelect } from 'react-select'
import './PropSelect.css'

class PropSelect extends React.Component {
    constructor (...args) {
        super(...args)
        this.loadOptions = this.loadOptions.bind(this)
    }

    loadOptions (inputValue) {
        return new Promise(resolve => {
            inputValue = inputValue.trim().toLowerCase()
            if (inputValue) {
                resolve(this.props.options.filter(i =>
                    i.path.toLowerCase().includes(inputValue)
                ).slice(0, 100))
            }
            resolve(this.props.options.slice(0, 100))
        })
    }

    static getOptionLabel (option) {
        return (
            <div>
                <span className='tag'>
                    {option.readablePath.map(p => p.label).join(' / * / ')}
                </span>
            </div>
        )
    }

    render () {
        return (
            <ReactSelect
                classNamePrefix='PropSelect'
                cacheOptions
                defaultOptions
                loadOptions={this.loadOptions}
                value={this.props.options[this.props.currentValue]}
                getOptionValue={(option) => option['path']}
                getOptionLabel={PropSelect.getOptionLabel}
                onChange={this.props.onChange}
            />
        )
    }

    static propTypes = {
        options: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired,
        currentValue: PropTypes.number
    }
}

export default PropSelect
