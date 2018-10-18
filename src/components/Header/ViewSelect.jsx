import React from 'react'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select'
import './ViewSelect.css'

class ViewSelect extends React.Component {
    static getOptionLabel (option) {
        return (
            <div style={{
                alignItems: 'center',
                display: 'flex'
            }}>
                <img
                    src={option.thumb}
                    alt={option.name}
                />
                <span>{option.name}</span>
            </div>
        )
    }

    render () {
        return (
            <ReactSelect
                classNamePrefix='ViewSelect'
                isSearchable={false}
                options={this.props.options}
                value={this.props.options[this.props.currentValue]}
                getOptionValue={(option) => (option['index'])}
                getOptionLabel={ViewSelect.getOptionLabel}
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

export default ViewSelect
