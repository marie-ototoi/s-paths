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
                    styles={{
                        option: (base, state) => {
                            let color = '#999'  
                            let borderColor = '#bbb'  
                            if (state.isSelected) {
                                color = '#bc5186'
                                borderColor = '#d15793'
                            } else if (state.isFocused) {
                                color = '#333'
                                borderColor = '#666'
                            }
                            return {
                                ...base,
                                borderBottom: '1px solid ' + borderColor,
                                color: color,
                                background: 'none',
                                padding: '2px'
                            }
                        },
                        control: (base, state) => ({
                            ...base,
                            border: 'none',
                            boxShadow: 'none'              
                        }),
                        singleValue: (base, state) => {
                            const opacity = state.isDisabled ? 0.5 : 1
                            const transition = 'opacity 300ms'                    
                            return { 
                                ...base,
                                opacity,
                                transition,
                                padding: '2px'
                            }
                        },
                        container: (base, state) => {              
                            return { 
                                ...base,
                                border: 'none',
                                boxShadow: 'none',
                                borderBottom: '1px solid #ccc',
                                padding: '0'
                            }
                        },
                        valueContainer: (base, state) => {              
                            return { 
                                ...base,
                                border: 'none',
                                margin: '0',
                                padding: '0'
                            }
                        },
                        menu: (base, state) => {              
                            return { 
                                ...base,
                                border: 'none',
                                boxShadow: 'none',
                                padding: '0 0 0 10px',
                                marginLeft: '-10px',
                                borderRadius: 0
                            }
                        }
                    }}
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
        onChange: PropTypes.func,
    }
}

export default ResourceSelect
