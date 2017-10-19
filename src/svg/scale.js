
const scaleStage = (viewBoxDef, screen) => {
    let width = Math.floor(screen.width * 100/ viewBoxDef.width)
    let height = Math.floor(screen.height * 100/ viewBoxDef.height)
    return { width, height }
}

const scaleViewBox = (viewBoxDef, stage) => {
    let x = Math.floor(stage.width * viewBoxDef.x / 100)
    let y = Math.floor(stage.height * viewBoxDef.y / 100)
    let width = Math.floor(stage.width * viewBoxDef.width / 100)
    let height = Math.floor(stage.height * viewBoxDef.height / 100)
    return { x, y, width, height }
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

exports.scaleStage = scaleStage
exports.scaleViewBox = scaleViewBox
exports.scaleX = scaleX
exports.scaleY = scaleY
exports.getGrid = getGrid
