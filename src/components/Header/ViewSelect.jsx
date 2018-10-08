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
                    alt={option.id}
                />
                <span>{option.id}</span>
            </div>
        )
    }

    render () {
        return (
            <ReactSelect
                classNamePrefix='ViewSelect'
                isSearchable={false}
                options={this.props.options}
                defaultValue={this.props.options[0]}
                getOptionValue={(option) => (option['name'])}
                getOptionLabel={ViewSelect.getOptionLabel}
                onChange={this.props.onChange}
            />
        )
    }

    static propTypes = {
        options: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired
    }
}

export default ViewSelect
