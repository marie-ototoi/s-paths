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
                ).slice(0, 50))
            }
            resolve(this.props.options.slice(0, 50))
        })
    }

    static getOptionLabel (option, i) {
        return (
            <div>
                {option.readablePath.map((p, pi) => (
                    <span key= {`navprop${Math.ceil(Math.random()*10000)}_${i}_${pi}`} title = {p.comment}>{p.label} {pi < option.readablePath.length ? ' / ' : ''}</span>
                ))}
            </div>
        )
    }

    render () {
        return (
            <ReactSelect
                classNamePrefix='PropSelect'
                cacheOptions
                defaultOptions={this.props.options.slice(0, 50)}
                loadOptions={this.loadOptions}
                value={this.props.options[this.props.currentValue]}
                getOptionValue={(option) => option['path']}
                getOptionLabel={PropSelect.getOptionLabel}
                onChange={this.props.onChange}
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
                            transition
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
                            padding: '0 0 10px 10px',
                            marginLeft: '-10px',
                            borderRadius: 0
                        }
                    },
                    menuList: (base, state) => {              
                        return { 
                            ...base,
                            paddingRight: '10px'
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

export default PropSelect
