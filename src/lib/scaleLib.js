
export const scaleViewBox = (viewBoxDef, stage) => {
    let x = Math.floor(stage.width * viewBoxDef.x / 100)
    let y = Math.floor(stage.height * viewBoxDef.y / 100)
    let width = Math.floor(stage.width * viewBoxDef.width / 100)
    let height = Math.floor(stage.height * viewBoxDef.height / 100)
    return { x, y, width, height }
}

export const getScreen = () => {
    // console.log(window.innerHeight)
    return {
        height: window.innerHeight - 10,
        width: window.innerWidth
    }
}

//https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
export const throttle = (func, limit) => {
    let lastFunc
    let lastRan
    return function() {
        const context = this
        const args = arguments
        if (!lastRan) {
            func.apply(context, args)
            lastRan = Date.now()
        } else {
            clearTimeout(lastFunc)
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args)
                    lastRan = Date.now()
                }
            }, limit - (Date.now() - lastRan))
        }
    }
}


export const getViz = (vizDef, stage) => {
    let opt = { 
        horizontal_padding_percent: 15,
        horizontal_padding_min_width: 150,
        min_ratio: 1.1
    }
    //
    let useful_height = scaleY(vizDef.useful_height, stage)
    let bottom_padding = scaleY(vizDef.bottom_padding, stage)
    //
    let main_width = scaleX(vizDef.main_width, stage)
    let aside_width = scaleX(vizDef.aside_width, stage)
    let horizontal_main_padding = Math.floor(main_width * opt.horizontal_padding_percent / 100)
    let horizontal_aside_padding = Math.floor(aside_width * opt.horizontal_padding_percent / 100)
    let horizontal_padding = Math.max(horizontal_main_padding, horizontal_aside_padding, opt.horizontal_padding_min_width)
    let main_useful_width = main_width - (horizontal_padding * 2)
    let aside_useful_width = aside_width - (horizontal_padding * 2)
    let main_useful_height = useful_height
    let aside_useful_height = useful_height
    while ((main_useful_width / main_useful_height) < opt.min_ratio) {
        main_useful_height -= 10
    }
    while ((aside_useful_width / aside_useful_height) < opt.min_ratio) {
        aside_useful_height -= 10
    }
    return {
        useful_height,
        width: stage.width,
        useful_width: stage.width - (horizontal_padding * 2),
        top_margin: scaleY(vizDef.top_margin, stage),
        bottom_margin: scaleY(vizDef.bottom_margin, stage),
        bottom_padding,
        horizontal_padding,
        main_x: aside_width,
        main_width,
        main_useful_width,
        main_useful_height,
        main_top_padding: useful_height - main_useful_height,
        aside_x: 0,
        aside_width,
        aside_useful_width,
        aside_useful_height,
        aside_top_padding: useful_height - aside_useful_height
    }
}

export const scaleX = (xPoint, stage) => {
    return Math.floor(stage.width * xPoint / 100)
}

export const scaleY = (yPoint, stage) => {
    return Math.floor(stage.height * yPoint / 100)
}

export const getDimensions = (element, viz, offset = { x: 0, y: 0, width: 0, height: 0 }) => {
    switch (element) {
    case 'stats':
        return {
            x: viz.horizontal_padding + offset.x,
            y: viz.top_margin + offset.y,
            width: viz.useful_width + offset.width,
            height: viz.useful_height + offset.height
        }
    case 'graphs':
        return {
            x: (viz.width / 2) + offset.x,
            y: viz.top_margin + offset.y,
            width: (viz.width / 2) + offset.width,
            height: viz.top_margin + offset.height
        }
    case 'details':
        return {
            x: offset.x,
            y: viz.top_margin + offset.y,
            width: (viz.width / 2) + offset.width,
            height: viz.top_margin + offset.height
        }
    case 'settings':
        return {
            x: (viz.width / 2) + offset.x,
            y: offset.y,
            width: (viz.width / 2) + offset.width,
            height: viz.top_margin + offset.height
        }
    
    case 'core':
        return {
            x: viz.horizontal_padding + offset.x,
            y: viz.top_margin + offset.y,
            width: viz.useful_width + offset.width,
            height: viz.useful_height + offset.height
        }
    case 'main':
        return {
            x: offset.x,
            y: viz.top_margin + offset.y,
            width: viz.main_width + offset.width,
            height: viz.useful_height + viz.bottom_padding + offset.height,
            useful_width: viz.main_useful_width + offset.width,
            useful_height: viz.useful_height - viz.main_top_padding + offset.height,
            horizontal_padding: viz.horizontal_padding,
            top_padding: viz.main_top_padding + offset.height
        }
    case 'mainbrush':
        return {
            x: offset.x + viz.main_x + viz.horizontal_padding,
            y: viz.top_margin + viz.main_top_padding + offset.y,
            width: viz.main_width + offset.width,
            height: viz.useful_height + viz.bottom_padding + offset.height,
            useful_width: viz.main_useful_width  + offset.width,
            useful_height: viz.useful_height + viz.main_top_padding + offset.height,
            horizontal_padding: viz.horizontal_padding,
            top_padding: viz.main_top_padding + offset.height
        }
    case 'aside':
        return {
            x: offset.x + viz.aside_x,
            y: viz.top_margin + offset.y,
            width: viz.aside_width + offset.width,
            height: viz.useful_height + viz.bottom_padding + offset.height,
            useful_width: viz.aside_useful_width + offset.width,
            useful_height: viz.useful_height - viz.aside_top_padding + offset.height,
            horizontal_padding: viz.horizontal_padding,
            top_padding: viz.aside_top_padding + offset.height
        }
    case 'asidebrush':
        return {
            x: offset.x + viz.aside_x + viz.horizontal_padding,
            y: viz.top_margin + viz.aside_top_padding + offset.y,
            width: viz.aside_width + offset.width,
            height: viz.useful_height + viz.bottom_padding + offset.height,
            useful_width: viz.aside_useful_width + offset.width,
            useful_height: viz.useful_height - viz.main_top_padding + offset.height,
            horizontal_padding: viz.horizontal_padding,
            top_padding: viz.main_top_padding + offset.height
        }
    case 'mainLegend':
        return {
            x: viz.main_width - viz.horizontal_padding + offset.x,
            y: viz.main_top_padding + viz.top_margin + offset.y,
            width: viz.horizontal_padding + offset.width,
            height: viz.main_useful_height + offset.height
        }
    case 'asideLegend':
        return {
            x: viz.aside_width - viz.horizontal_padding + offset.x,
            y: viz.aside_top_padding + viz.top_margin + offset.y,
            width: viz.horizontal_padding + offset.width,
            height: viz.aside_useful_height + offset.height
        }
    case 'header':
        return {
            x: offset.x,
            y: offset.y,
            width: viz.width + offset.width,
            height: viz.top_margin + offset.height
        }
    case 'mainAxisBottom':
        return {
            x: viz.horizontal_padding + offset.x,
            y: viz.useful_height + viz.top_margin + offset.y,
            width: viz.main_useful_width + offset.width,
            height: viz.bottom_margin + offset.height
        }
    case 'asideAxisBottom':
        return {
            x: viz.horizontal_padding + offset.x,
            y: viz.useful_height + viz.top_margin + offset.y,
            width: viz.aside_useful_width + offset.width,
            height: viz.bottom_margin + offset.height
        }
    case 'mainAxisLeft':
        return {
            x: offset.x,
            y: offset.y + viz.top_margin,
            width: viz.horizontal_padding + offset.width,
            height: viz.useful_height - viz.main_top_padding + offset.height
        }
    case 'asideAxisLeft':
        return {
            x: offset.x,
            y: offset.y + viz.top_margin + viz.aside_top_padding,
            width: viz.horizontal_padding + offset.width,
            height: viz.useful_height - viz.aside_top_padding + offset.height
        }
    case 'mainLegendAxisBottom':
        return {
            x: offset.x,
            y: viz.useful_height + viz.top_margin + offset.y,
            width: viz.horizontal_padding + offset.width,
            height: 20 + offset.height
        }
    case 'asideLegendAxisBottom':
        return {
            x: offset.x,
            y: viz.useful_height + viz.top_margin + offset.y,
            width: viz.horizontal_padding + offset.width,
            height: 20 + offset.height
        }
    case 'mainLegendAxisLeft':
        return {
            x: offset.x,
            y: viz.useful_height + viz.top_margin + viz.main_top_padding + offset.y,
            width: viz.horizontal_padding + offset.width,
            height: 20 + offset.height
        }
    case 'asideLegendAxisLeft':
        return {
            x: viz.aside_x + offset.x,
            y: viz.useful_height + viz.top_margin + viz.aside_top_padding + offset.y,
            width: viz.horizontal_padding + offset.width,
            height: 20 + offset.height
        }
    case 'mainLegendLegend':
        return {
            x: viz.horizontal_padding + viz.main_useful_width + offset.x,
            y: viz.useful_height + viz.top_margin + viz.main_top_padding + offset.y,
            width: viz.horizontal_padding + offset.width,
            height: 20 + offset.height
        }
    case 'asideLegendLegend':
        return {
            x: viz.horizontal_padding + viz.aside_useful_width + offset.x,
            y: viz.useful_height + viz.top_margin + viz.aside_top_padding + offset.y,
            width: viz.horizontal_padding + offset.width,
            height: 20 + offset.height
        }
    case 'history':
        return {
            x: 10 + offset.x,
            y: viz.useful_height + viz.top_margin + viz.bottom_margin + viz.bottom_padding + offset.y,
            width: (viz.horizontal_padding * 2) + viz.useful_width - 20 + offset.width,
            height: 20 + offset.height
        }
    }
}

export const getRelativeRectangle = (rectangle, zone, display) => {
    return {
        x1: rectangle.x1 - display.viz[zone + '_x'] - display.viz.horizontal_padding,
        y1: rectangle.y1 - display.viz[zone + '_top_padding'] - display.viz.top_margin,
        x2: rectangle.x2 - display.viz[zone + '_x'] - display.viz.horizontal_padding,
        y2: rectangle.y2 - display.viz[zone + '_top_padding'] - display.viz.top_margin
    }
}