
export const scaleViewBox = (viewBoxDef, stage) => {
    let x = Math.floor(stage.width * viewBoxDef.x / 100)
    let y = Math.floor(stage.height * viewBoxDef.y / 100)
    let width = Math.floor(stage.width * viewBoxDef.width / 100)
    let height = Math.floor(stage.height * viewBoxDef.height / 100)
    return { x, y, width, height }
}

export const getZones = (zonesDef, stage) => {
    return {
        main: scaleViewBox(zonesDef.main, stage),
        aside: scaleViewBox(zonesDef.aside, stage),
        full: scaleViewBox(zonesDef.full, stage),
        dev: scaleViewBox(zonesDef.dev, stage)
    }
}

export const getScreen = () => {
    return {
        height: window.innerHeight - 5,
        width: window.innerWidth - 5
    }
}

export const getViz = (vizDef, stage) => {
    return {
        useful_width: scaleX(vizDef.useful_width, stage),
        useful_height: scaleY(vizDef.useful_height, stage),
        horizontal_margin: scaleX(vizDef.horizontal_margin, stage),
        top_margin: scaleY(vizDef.top_margin, stage),
        bottom_margin: scaleY(vizDef.bottom_margin, stage)
    }
}

export const getZoneCoord = (zone, mode, zonesDefPercent, screen) => {
    // find top left of the zone
    let factorX = zonesDefPercent[mode].width
    let factorY = zonesDefPercent[mode].height
    let offsetXPercent = (zonesDefPercent[zone].x - zonesDefPercent[mode].x) * 100 / factorX
    let offsetYPercent = (zonesDefPercent[zone].y - zonesDefPercent[mode].y) * 100 / factorY
    let offsetX = Math.floor(offsetXPercent * screen.width / 100)
    let offsetY = Math.floor(offsetYPercent * screen.height / 100)
    // console.log(factorX, factorY, offsetX, offsetY)
    return { x: offsetX, y: offsetY }
}

export const scaleX = (xPoint, stage) => {
    return Math.floor(stage.width * xPoint / 100)
}

export const scaleY = (yPoint, stage) => {
    return Math.floor(stage.height * yPoint / 100)
}

export const getGrid = (gridDef, stage) => {
    let xPoints = gridDef.xPoints.map(point => scaleX(point, stage))
    let yPoints = gridDef.yPoints.map(point => scaleY(point, stage))
    return { xPoints, yPoints }
}

export const getDimensions = (element, origin, viz, offset = { x: 0, y: 0, width: 0, height: 0 }) => {
    switch (element) {
    case 'settings':
        return {
            x: origin.x + viz.horizontal_margin + offset.x,
            y: origin.y + viz.top_margin + offset.y,
            width: viz.useful_width + offset.width,
            height: viz.useful_height + offset.height
        }
    case 'core':
        return {
            x: origin.x + viz.horizontal_margin + offset.x,
            y: origin.y + viz.top_margin + offset.y,
            width: viz.useful_width + offset.width,
            height: viz.useful_height + offset.height
        }
    case 'main':
        return {
            x: origin.x + viz.horizontal_margin + offset.x,
            y: origin.y + viz.top_margin + offset.y,
            width: viz.useful_width + offset.width,
            height: viz.useful_height + offset.height
        }
    case 'aside':
        return {
            x: origin.x + viz.horizontal_margin + offset.x,
            y: origin.y + viz.top_margin + offset.y,
            width: viz.useful_width + offset.width,
            height: viz.useful_height + offset.height
        }
    case 'legend':
        return {
            x: origin.x + viz.horizontal_margin + viz.useful_width + offset.x,
            y: origin.y + viz.top_margin + offset.y,
            width: viz.horizontal_margin + offset.width,
            height: viz.useful_height + offset.height
        }
    case 'header':
        return {
            x: origin.x +  offset.x,
            y: origin.y + offset.y,
            width: viz.useful_width + (viz.horizontal_margin * 2) + offset.width,
            height: viz.top_margin + offset.height
        }
    case 'axisBottom':
        return {
            x: origin.x + viz.horizontal_margin + offset.x,
            y: origin.y + viz.useful_height + viz.top_margin + offset.y,
            width: viz.useful_width + offset.width,
            height: viz.top_margin + offset.height
        }
    case 'axisLeft':
        return {
            x: origin.x + offset.x,
            y: origin.y + viz.top_margin + offset.y,
            width: viz.horizontal_margin + offset.width,
            height: viz.useful_height + offset.height
        }
    case 'legendAxisBottom':
        return {
            x: origin.x + offset.x,
            y: origin.y + viz.useful_height + viz.top_margin + offset.y,
            width: viz.horizontal_margin + offset.width,
            height: 20 + offset.height
        }
    case 'legendAxisLeft':
        return {
            x: origin.x + offset.x,
            y: origin.y + viz.useful_height + viz.top_margin + offset.y,
            width: viz.horizontal_margin + offset.width,
            height: 20 + offset.height
        }
    case 'legendLegend':
        return {
            x: origin.x + viz.horizontal_margin + viz.useful_width + offset.x,
            y: origin.y + (viz.useful_height * 3 / 4) + viz.top_margin + offset.y,
            width: viz.horizontal_margin + offset.width,
            height: 20 + offset.height
        }
    case 'history':
        return {
            x: origin.x + 10 + offset.x,
            y: origin.y + viz.useful_height + (viz.top_margin * 2) - 10 + offset.y,
            width: (viz.horizontal_margin * 2) + viz.useful_width - 20 + offset.width,
            height: 20 + offset.height
        }
    }
}
