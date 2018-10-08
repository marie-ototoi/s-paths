import React from 'react'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select'
import './PropSelect.css'

class PropSelect extends React.Component {
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
                isSearchable={false}
                defaultValue={this.props.options[this.props.currentValue || 0]}
                getOptionValue={(option) => (option['path'])}
                getOptionLabel={PropSelect.getOptionLabel}
                onChange={this.props.onChange}
                options={this.props.options}
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
