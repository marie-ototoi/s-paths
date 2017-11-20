import { color } from "d3-color";

const getNextPaletteIndex = (palettes) => {
    let index 
    let max = 0
    while (index === undefined) {
        for(let i = palettes.length - 1; i >= 0; i--) {
            if (palettes[i].properties.length === max) {
                index = i
            }
        }
        max ++
    }
    return index
}

const getQuantitativeColors = (length) => {
    const colors = [
        '#FDD835', '#FBC02D', '#FF8F00', '#FF6F00', '#E65100', '#BF360C', '#4E342E'
    ]
    return getColors(colors, length)
}

const selectColorsInPalette = (colors, length) => {
    return colors.slice(0, length)
    const step = Math.floor(colors.length / length)
    return colors.filter((color, index) => (index % step === 0))
}

exports.getNextPaletteIndex = getNextPaletteIndex
exports.getQuantitativeColors = getQuantitativeColors
exports.selectColorsInPalette = selectColorsInPalette
