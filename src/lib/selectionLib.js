export const getSelections = (selections, zone) => {
    return selections.filter(s => s.zone === zone)
}
export const isSelected = (el, zone, selections) => {
    // console.log(selections)
    let listSelections = selections.filter(s => s.zone === zone).map(s => s.selector)
    return listSelections.includes(el.selector)
}
export const areSelected = (elements, zone, selections) => {
    let listSelections = selections.filter(s => s.zone === zone).map(s => s.selector)
    // console.log('list', elements, listSelections)
    let allSelected = 0
    elements.forEach(el => {
        // console.log(el.selector, listSelections.includes(el.selector), selections, listSelections)
        if (listSelections.includes(el.selector)) {
            allSelected++
        }
    })
    return allSelected === elements.length
}


export const mergeSelections = (newSel, previousSel) => {
    if(newSel.length > 0) {
        console.log('there s a new sel')
        let newSelConfig = newSel[0].config
        if (!newSelConfig.entrypoint.aggregate) {
            console.log('replace every old sel')
            previousSel = [newSel]
        } else {
            if (previousSel.length > 0) {
                console.log('there s a previous sel')
                let prevSelConfig = previousSel[0][0].config
                let same = true
                if (prevSelConfig.id !== newSelConfig.id ||
                    prevSelConfig.selectedMatch.properties.length !== newSelConfig.selectedMatch.properties.length) {
                    same = false
                } else {
                    prevSelConfig.selectedMatch.properties.forEach((prop, pi ) =>{
                        if (prop.path !== newSelConfig.selectedMatch.properties[pi].path) same = false
                    })
                }
                if (same) {
                    console.log('config is the same')
                    previousSel = previousSel.splice(1, previousSel.length)
                }
            }
            previousSel.unshift(newSel)
        }
    }
    return previousSel
    // return [...newSel, ...previousSel]
}


export const detectRectCollision = (rect1, rect2) => {
    return (rect1.x1 < rect2.x2 &&
        rect1.x2 > rect2.x1 &&
        rect1.y1 < rect2.y2 &&
        rect1.y2 > rect2.y1)
}

export const detectPointCollision = (point, rect) => {
    return (point.x > rect.x1 &&
        point.x < rect.x2 &&
        point.y > rect.y1 &&
        point.y < rect.y2)
}

export const pathToPoints = (path) => {
    let re = /M([\d.-]+),([\d.-]+)q([\d.-]+),([\d.-]+),([\d.-]+),([\d.-]+)q([\d.-]+),([\d.-]+),([\d.-]+),([\d.-]+)/i
    let res = re.exec(path)
    let path1 = [
        { x: Number(res[1]), y: Number(res[2]) },
        { x: Number(res[3]), y: Number(res[4]) },
        { x: Number(res[5]), y: Number(res[6]) }
    ]
    let extrapolatePath1 = getInterpolatedPoints(path1, 8)
    let path2 = [
        { x: Number(res[5]), y: Number(res[6]) },
        { x: Number(res[5]) + Number(res[7]), y: Number(res[6]) + Number(res[8]) },
        { x: Number(res[5]) + Number(res[9]), y: Number(res[6]) + Number(res[10]) }
    ]
    let extrapolatePath2 = getInterpolatedPoints(path2, 5).slice(1)
    return [
        ...extrapolatePath1,
        ...extrapolatePath2
    ]
}
export const extrapolatePath = (points) => {
    let path1 = points.slice(0, 3)
    let extrapolatePath1 = getInterpolatedPoints(path1, 8)
    let path2 = points.slice(2, 5)
    let extrapolatePath2 = getInterpolatedPoints(path2, 5).slice(1)
    let path3 = points.slice(2, 5)
    let extrapolatePath3 = getInterpolatedPoints(path3, 5).slice(1)
    return [
        ...extrapolatePath1,
        ...extrapolatePath2,
        ...extrapolatePath3
    ]
}
export const getInterpolatedPoints = (path, numberOfPoints) => {
    const quadraticInterpolator = interpolateQuadraticBezier(path);
    return Array.from(Array(numberOfPoints).keys()).map((d, i, a) => quadraticInterpolator(d / (a.length - 1)));
}
export const detectPathCollision = (points, rect) => {
    let collision = false
    points.forEach(point => {
        if (detectPointCollision(point, rect)) collision = true
    })
    return collision
}

export const getRotatedPoints = (points, rotation, offset) => {
    points = points.map(point => getRotatedPoint(point, rotation))
    if (offset) points = points.map(point => { return { x: point.x + offset.x, y: point.y + offset.y } } )
    return points
}

export const getRotatedPoint = (point, rotation) => {
    return {
        x:  (Number(point.x) * Math.cos(rotation * Math.PI / 180) - Number(point.y) * Math.sin(rotation * Math.PI / 180)),
        y:  (Number(point.y) * Math.cos(rotation * Math.PI / 180) + Number(point.x) * Math.sin(rotation * Math.PI / 180))
    }
}

const interpolateQuadraticBezier = ([start, control, end]) => {
    // 0 <= t <= 1
    return (t) => {
        return {
            x: Math.round(100 * ((Math.pow(1 - t, 2) * start.x) + (2 * (1 - t) * t * control.x) + (Math.pow(t, 2) * end.x))) / 100,
            y: Math.round(100 * ((Math.pow(1 - t, 2) * start.y) + (2 * (1 - t) * t * control.y) + (Math.pow(t, 2) * end.y)))     / 100,
        }
    }
}

export const getRectSelection = (selection) => {
    const { x1, y1, x2, y2 } = selection
    const selectionX1 = (x1 < x2) ? x1 : x2
    const selectionY1 = (y1 < y2) ? y1 : y2
    const selectionX2 = (x1 < x2) ? x2 : x1
    const selectionY2 = (y1 < y2) ? y2 : y1
    return {
        x1: selectionX1,
        y1: selectionY1,
        x2: selectionX2,
        y2: selectionY2
    }
}

