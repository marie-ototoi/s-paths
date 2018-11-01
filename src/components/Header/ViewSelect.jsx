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
                isDisabled={this.props.isDisabled}
                styles={{
                    option: (base, state) => {
                        let color = '#999'  
                        let borderColor = '#bbb'  
                        if (state.isSelected) {
                            color = '#d15793'
                            borderColor = '#d15793'
                        } else if (state.isFocused) {
                            color = '#333'
                            borderColor = '#666'
                        }
                        return {
                            ...base,
                            borderBottom: '1px solid ' + borderColor,
                            color: color,
                            fontWeight: state.isSelected ? 'bold' : 'normal',
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
                            transition
                        }
                    },
                    container: (base, state) => {              
                        return { 
                            ...base,
                            border: 'none',
                            boxShadow: 'none',
                            borderBottom: '1px solid #ccc',
                            padding: '0',
                            marginRight: '10px'
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
        )
    }

    static propTypes = {
        options: PropTypes.array.isRequired,
        isDisabled: PropTypes.bool,
        onChange: PropTypes.func.isRequired,
        currentValue: PropTypes.number
    }
}

export default ViewSelect
