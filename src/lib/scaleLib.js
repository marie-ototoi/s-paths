
const scaleStage = (viewBoxDef, screen) => {
    let width = Math.floor(screen.width * 100 / viewBoxDef.width)
    let height = Math.floor(screen.height * 100 / viewBoxDef.height)
    return { width, height }
}

const scaleViewBox = (viewBoxDef, stage) => {
    let x = Math.floor(stage.width * viewBoxDef.x / 100)
    let y = Math.floor(stage.height * viewBoxDef.y / 100)
    let width = Math.floor(stage.width * viewBoxDef.width / 100)
    let height = Math.floor(stage.height * viewBoxDef.height / 100)
    return { x, y, width, height }
}

const getZones = (zonesDef, stage) => {
    return {
        main: scaleViewBox(zonesDef.main, stage),
        aside: scaleViewBox(zonesDef.aside, stage),
        full: scaleViewBox(zonesDef.full, stage),
        dev: scaleViewBox(zonesDef.dev, stage)
    }
}

const getViz = (vizDef, stage) => {
    return {
        useful_width: scaleX(vizDef.useful_width, stage),
        useful_height: scaleY(vizDef.useful_height, stage),
        horizontal_margin: scaleX(vizDef.horizontal_margin, stage),
        vertical_margin: scaleY(vizDef.vertical_margin, stage)
    }
}

const scaleX = (xPoint, stage) => {
    return Math.floor(stage.width * xPoint / 100)
}

const scaleY = (yPoint, stage) => {
    return Math.floor(stage.height * yPoint / 100)
}

const getGrid = (gridDef, stage) => {
    let xPoints = gridDef.xPoints.map(point => scaleX(point, stage))
    let yPoints = gridDef.yPoints.map(point => scaleY(point, stage))
    return { xPoints, yPoints }
}

const getDimensions = (element, origin, viz, offset = { x: 0, y: 0, width: 0, height: 0 }) => {
    switch (element) {
    case 'legend':
        return {
            x: origin.x + viz.horizontal_margin + viz.useful_width + offset.x,
            y: origin.y + viz.vertical_margin + offset.y,
            width: viz.horizontal_margin + offset.width,
            height: viz.vertical_margin + offset.height
        }
    case 'header':
        return {
            x: origin.x + viz.horizontal_margin + offset.x,
            y: origin.y + offset.y,
            width: viz.useful_width + offset.width,
            height: viz.vertical_margin + offset.height
        }
    case 'axisBottom':
        return {
            x: origin.x + viz.horizontal_margin + offset.x,
            y: origin.y + viz.useful_height + viz.vertical_margin + offset.y,
            width: viz.useful_width + offset.width,
            height: viz.vertical_margin + offset.height
        }
    case 'axisLeft':
        return {
            x: origin.x + offset.x,
            y: origin.y + viz.vertical_margin + offset.y,
            width: viz.horizontal_margin + offset.width,
            height: viz.useful_height + offset.height
        }
    case 'propSelectorLegend':
        return {
            x: origin.x + viz.horizontal_margin + viz.useful_width + offset.x,
            y: origin.y + viz.vertical_margin + offset.y,
            width: viz.horizontal_margin + offset.width,
            height: 20 + offset.height
        }
    case 'propSelectorAxisBottom':
        return {
            x: origin.x + offset.x,
            y: origin.y + viz.useful_height + viz.vertical_margin + offset.y,
            width: viz.horizontal_margin + offset.width,
            height: 20 + offset.height
        }
    }
}

exports.getDimensions = getDimensions
exports.getGrid = getGrid
exports.getViz = getViz
exports.getZones = getZones
exports.scaleStage = scaleStage
exports.scaleViewBox = scaleViewBox
exports.scaleX = scaleX
exports.scaleY = scaleY
