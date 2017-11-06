import scale from './scale'

const resize = (viewBoxDef, screen) => {

}

const getScreen = () => {
    return {
        height: window.innerHeight - 5,
        width: window.innerWidth - 5
    }
}

const getZones = (zonesDef, stage) => {
    return {
        main: scale.scaleViewBox(zonesDef.main, stage),
        aside: scale.scaleViewBox(zonesDef.aside, stage),
        full: scale.scaleViewBox(zonesDef.full, stage),
        dev: scale.scaleViewBox(zonesDef.dev, stage)
    }
}

exports.getScreen = getScreen
exports.getZones = getZones
exports.resize = resize
