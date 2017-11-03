const defaultState = {
    env: 'prod',
    mode: 'main',
    screen: {
        width: 10,
        height: 10
    },
    viewBox: {
        width: 10,
        height: 10,
        x: 0,
        y: 0
    },
    stage: {
        width: 10,
        height: 10
    },
    grid: {
        xPoints : [0],
        yPoints : [0]
    },
    gridDefPercent: {
        xPoints: [0, 30, 35, 65, 70, 85, 100],
        yPoints: [0, 30, 35, 65, 70, 85, 100]
    },
    zones: {
        main: { x: 0, y: 0, width: 10, height: 10 },
        aside: { x: 0, y: 0, width: 10, height: 10 },
        full: { x: 0, y: 0, width: 10, height: 10 },
        dev: { x: 0, y: 0, width: 10, height: 10 }
    },
    zonesDefPercent: {
        dev: { x: 0, y: 0, width: 100, height: 100},
        full: { x: 35, y: 35, width: 40, height: 40},
        main: { x: 35, y: 35, width: 30, height: 30},
        aside: { x: 70, y: 35, width: 30, height: 30}
    }
}

const display = (state = defaultState, action) => {
    switch (action.type) {
        case 'SET_ENV':
            return {
                ...state,
                env: action.env,
                mode: action.mode
            }
        case 'SET_DISPLAY':
            return {
                ...state,
                screen: action.screen,
                viewBox: action.viewBox, 
                stage: action.stage, 
                grid: action.grid,
                zones: action.zones
            }
        default:
            return state
    }
}

export default display
