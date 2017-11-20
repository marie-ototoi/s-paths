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
        '#FDD835', '#FBC02D', '#FF8F00', '#FF6F00', '#E65100', '#BF360C', '#4E342E'
    ]
    return selectColorsInPalette(colors, length)
}

const selectColorsInPalette = (colors, length) => {
    return colors.slice(0, length)
//    const step = Math.floor(colors.length / length)
//    return colors.filter((color, index) => (index % step === 0))
}

const colorPattern = (el, pattern, color) => {
    const stringify = require('virtual-dom-stringify')
    const resultPattern = pattern({
        background: color
    })
    el.append('defs').html(stringify(resultPattern))
    return resultPattern.url()
}

const getPatternsPalette = (length) => {
    const lines = require('svg-patterns/p/lines')
    const caps = require('svg-patterns/p/caps')
    const circles = require('svg-patterns/p/circles')
    const crosses = require('svg-patterns/p/crosses')
    const hexagons = require('svg-patterns/p/hexagons')
    const nylon = require('svg-patterns/p/nylon')
    const rhombic = require('svg-patterns/p/rhombic')
    const squares = require('svg-patterns/p/squares')
    const waves = require('svg-patterns/p/waves')
    const woven = require('svg-patterns/p/woven')
    const rhombic3d = require('svg-patterns/p/rhombic3d')
    const patterns = [lines, caps, circles, crosses, hexagons, nylon, rhombic, squares, waves, woven, rhombic3d]
    return patterns.slice(0, length)
}

exports.getNextPaletteIndex = getNextPaletteIndex
exports.getQuantitativeColors = getQuantitativeColors
exports.selectColorsInPalette = selectColorsInPalette
exports.colorPattern = colorPattern
exports.getPatternsPalette = getPatternsPalette
