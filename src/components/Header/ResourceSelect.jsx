import React from 'react'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select'

class ResourceSelect extends React.Component {
    static getOptionLabel (option) {
        return (
            <div>
                {option.label} ({option.total})
            </div>
        )
    }

    render () {
        return (
            <div className='control'>
                <ReactSelect
                    classNamePrefix='PropSelect'
                    isSearchable={true}
                    value={this.props.selectedResource}
                    getOptionValue={(option) => (option['type'])}
                    getOptionLabel={ResourceSelect.getOptionLabel}
                    onChange={this.props.onChange}
                    options={this.props.options}
                    isDisabled={this.props.isDisabled}
                />
            </div>
        )
    }

    static propTypes = {
        options: PropTypes.arrayOf(
            PropTypes.shape({
                value: PropTypes.number,
                label: PropTypes.string
            })
        ),
        selectedResource: PropTypes.object,
        isDisabled: PropTypes.bool,
        onChange: PropTypes.func
    }
}

export default ResourceSelect
