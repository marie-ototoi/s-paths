import * as types from '../constants/ActionTypes'
import paletteLib from '../lib/paletteLib'

const getPropPalette = (dispatch) => (palettes, propPath, length) => {
    let palette = palettes.filter(p => {
        return p.properties.includes(propPath)
    })
    if (palette.length === 0) {
        let index = paletteLib.getNextPaletteIndex(palettes)
        dispatch({
            type: types.SET_PROP_PALETTE,
            property: propPath,
            index
        })
        palette = palettes[index]
    }
    return paletteLib.selectColorsInPalette(palette.colors, length)
}

exports.getPropPalette = getPropPalette
