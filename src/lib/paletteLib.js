import { color } from 'd3-color'
import * as d3 from 'd3'

const getNextPaletteIndex = (palettes) => {
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

const getQuantitativeColors = (length) => {
    const colors = [
        '#FDD835', '#FBC02D', '#FF8F00', '#FF6F00', '#E65100', '#BF360C'
    ]
    return selectColorsInPalette(colors, length)
}

const selectColorsInPalette = (colors, length) => {
    // return colors.slice(0, length)
    const step = Math.floor(colors.length / length)
    const rest = colors.length % length
    const limit = rest > 0 ? rest - 1 : 0
    return colors.filter((color, index) => (index % step === limit))
}

// create a patern equivalent to the string parameter (ex:lines) with the specified color,
// add it to the element 'el' and then return the url (ex: attr('fill', url))
const colorPattern = (el, pattern, color) => {
    const stringify = require('virtual-dom-stringify')
    let resultPattern
    switch (pattern) {
    case 'lines':
        const lines = require('svg-patterns/p/lines')
        resultPattern = lines({
            background: color,
            strokeWidth: 2.5,
            size: 20
        })
        break
    case 'circles':
        const circles = require('svg-patterns/p/circles')
        resultPattern = circles({
            background: color,
            radius: 5,
            size: 30,
            fill: 'black'
        })
        break
    case 'rhombic':
        const rhombic = require('svg-patterns/p/rhombic')
        resultPattern = rhombic({
            background: color,
            strokeWidth: 2,
            size: 40,
            stroke: 'black'
        })
        break
    case 'crosses':
        const crosses = require('svg-patterns/p/crosses')
        resultPattern = crosses({
            background: color,
            strokeWidth: 1.2,
            size: 20,
            stroke: 'black'
        })
        break
    case 'hexagons':
        const hexagons = require('svg-patterns/p/hexagons')
        resultPattern = hexagons({
            background: color,
            strokeWidth: 1.8,
            size: 22,
            stroke: 'black'
        })
        break
    case 'nylon':
        const nylon = require('svg-patterns/p/nylon')
        resultPattern = nylon({
            background: color,
            strokeWidth: 5,
            size: 60,
            stroke: 'black'
        })
        break
    case 'squares':
        const squares = require('svg-patterns/p/squares')
        resultPattern = squares({
            background: color,
            strokeWidth: 2,
            size: 20,
            stroke: 'black'
        })
        break
    case 'waves':
        const waves = require('svg-patterns/p/waves')
        resultPattern = waves({
            background: color,
            strokeWidth: 2,
            size: 20,
            stroke: 'black'
        })
        break
    case 'woven':
        const woven = require('svg-patterns/p/woven')
        resultPattern = woven({
            background: color,
            strokeWidth: 2,
            size: 20,
            stroke: 'black'
        })
        break
    case 'lines2':
        const lines2 = require('svg-patterns/p/lines')
        resultPattern = lines2({
            background: color,
            strokeWidth: 2.5,
            size: 20,
            orientations: [-45]
        })
        break
    case 'circles2':
        const circles2 = require('svg-patterns/p/circles')
        resultPattern = circles2({
            background: color,
            radius: 5,
            size: 30,
            fill: 'none',
            strokeWidth: 2,
            stroke: 'black'
        })
        break
    case 'rhombic3d':
        const rhombic3d = require('svg-patterns/p/rhombic3d')
        resultPattern = rhombic3d({
            background: color,
            strokeWidth: 2,
            size: 40,
            stroke: 'black'
        })
        break
    default:
        const def = require('svg-patterns/p/lines')
        resultPattern = def({
            background: color,
            strokeWidth: 2.5,
            size: 20
        })
    }
    el.append('defs').html(stringify(resultPattern))
    return resultPattern.url()
}

// return list of string that are used for pattern
const getPatternsPalette = (length) => {
    const patterns = ['lines', 'circles', 'rhombic', 'crosses', 'hexagons', 'nylon', 'rhombic', 'squares', 'waves', 'woven', 'lines2', 'circles2', 'rhombic3d']
    return patterns.slice(0, length)
}

exports.getNextPaletteIndex = getNextPaletteIndex
exports.getQuantitativeColors = getQuantitativeColors
exports.selectColorsInPalette = selectColorsInPalette
exports.colorPattern = colorPattern
exports.getPatternsPalette = getPatternsPalette
