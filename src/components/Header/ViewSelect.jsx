import React from 'react'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select'
import './ViewSelect.css'

class ViewSelect extends React.Component {
    static getOptionLabel (option) {
        return (
            <div style={{
                alignItems: 'center',
                display: 'flex',
                width: '30px',
                background: '#666'
            }}>
                <img src={option.thumb} alt={option.id}/>
            </div>
        );
    }

    render () {
        return (
            <ReactSelect
                classNamePrefix={'viewSelector'}
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
