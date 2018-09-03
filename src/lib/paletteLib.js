
export const getNextPaletteIndex = (palettes) => {
    let index
    let max = 0
    while (index === undefined) {
        for (let i = palettes.length - 1; i >= 0; i--) {
            if (palettes[i].properties.length === max) {
                index = i
            }
        }
        max++
    }
    return index
}

export const getGraphsColors = (length = 6) => {
    const colors = [
        '#ff0000', '#5b2886', '#0071fc', '#fc00ed', '#09bc00', '#00bcad'
    ]
    return selectColorsInPalette(colors, length)
}

export const getQuantitativeColors = (length = 6) => {
    const colors = [
        '#FDD835', '#FBC02D', '#FF8F00', '#FF6F00', '#E65100', '#BF360C'
    ]
    return selectColorsInPalette(colors, length)
}

export const selectColorsInPalette = (colors, length) => {
    // return colors.slice(0, length)
    const step = Math.floor(colors.length / length)
    const rest = colors.length % length
    return colors.filter((color, index) => ((index + rest) % step === 0))
}

// create a patern equivalent to the string parameter (ex:lines) with the specified color,
// add it to the element 'el' and then return the url (ex: attr('fill', url))
export const colorPattern = (el, pattern, color) => {
    const stringify = require('virtual-dom-stringify')
    let resultPattern
    let patternLib
    switch (pattern) {
    case 'lines':
        patternLib = require('svg-patterns/p/lines')
        resultPattern = patternLib({
            background: color,
            strokeWidth: 2.5,
            size: 20
        })
        break
    case 'circles':
        patternLib = require('svg-patterns/p/circles')
        resultPattern = patternLib({
            background: color,
            radius: 5,
            size: 30,
            fill: 'black'
        })
        break
    case 'rhombic':
        patternLib = require('svg-patterns/p/rhombic')
        resultPattern = patternLib({
            background: color,
            strokeWidth: 2,
            size: 40,
            stroke: 'black'
        })
        break
    case 'crosses':
        patternLib = require('svg-patterns/p/crosses')
        resultPattern = patternLib({
            background: color,
            strokeWidth: 1.2,
            size: 20,
            stroke: 'black'
        })
        break
    case 'hexagons':
        patternLib = require('svg-patterns/p/hexagons')
        resultPattern = patternLib({
            background: color,
            strokeWidth: 1.8,
            size: 22,
            stroke: 'black'
        })
        break
    case 'nylon':
        patternLib = require('svg-patterns/p/nylon')
        resultPattern = patternLib({
            background: color,
            strokeWidth: 5,
            size: 60,
            stroke: 'black'
        })
        break
    case 'squares':
        patternLib = require('svg-patterns/p/squares')
        resultPattern = patternLib({
            background: color,
            strokeWidth: 2,
            size: 20,
            stroke: 'black'
        })
        break
    case 'waves':
        patternLib = require('svg-patterns/p/waves')
        resultPattern = patternLib({
            background: color,
            strokeWidth: 2,
            size: 20,
            stroke: 'black'
        })
        break
    case 'woven':
        patternLib = require('svg-patterns/p/woven')
        resultPattern = patternLib({
            background: color,
            strokeWidth: 2,
            size: 20,
            stroke: 'black'
        })
        break
    case 'lines2':
        patternLib = require('svg-patterns/p/lines')
        resultPattern = patternLib({
            background: color,
            strokeWidth: 2.5,
            size: 20,
            orientations: [-45]
        })
        break
    case 'circles2':
        patternLib = require('svg-patterns/p/circles')
        resultPattern = patternLib({
            background: color,
            radius: 5,
            size: 30,
            fill: 'none',
            strokeWidth: 2,
            stroke: 'black'
        })
        break
    case 'rhombic3d':
        patternLib = require('svg-patterns/p/rhombic3d')
        resultPattern = patternLib({
            background: color,
            strokeWidth: 2,
            size: 40,
            stroke: 'black'
        })
        break
    default:
        patternLib = require('svg-patterns/p/lines')
        resultPattern = patternLib({
            background: color,
            strokeWidth: 2.5,
            size: 20
        })
    }
    el.append('defs').html(stringify(resultPattern))
    return resultPattern.url()
}

// return list of string that are used for pattern
export const getPatternsPalette = (length) => {
    const patterns = ['lines', 'circles', 'rhombic', 'crosses', 'hexagons', 'nylon', 'rhombic', 'squares', 'waves', 'woven', 'lines2', 'circles2', 'rhombic3d']
    return patterns.slice(0, length)
}
