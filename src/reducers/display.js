import * as types from '../constants/ActionTypes'

const defaultState = {
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
        xPoints: [],
        yPoints: []
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
        dev: { x: 0, y: 0, width: 100, height: 100 },
        full: { x: 35, y: 35, width: 65, height: 30 },
        main: { x: 35, y: 35, width: 30, height: 30 },
        aside: { x: 70, y: 35, width: 30, height: 30 }
    },
    vizDefPercent: {
        useful_width: 70,
        useful_height: 60,
        vertical_margin: 20,
        horizontal_margin: 15
    },
    viz: {
        useful_width: 10,
        useful_height: 10,
        vertical_margin: 10,
        horizontal_margin: 10
    },
    selectedZone: {
        x1: null,
        y1: null,
        x2: null,
        y2: null
    }
}

const display = (state = defaultState, action) => {
    // console.log(action, state)
    switch (action.type) {
    case types.SET_DISPLAY:
        return {
            ...state,
            screen: action.screen || state.screen,
            viewBox: action.viewBox || state.viewBox,
            stage: action.stage || state.stage,
            grid: action.grid || state.grid,
            zones: action.zones || state.zones,
            viz: action.viz || state.viz
        }
    case types.START_SELECTED_ZONE:
        return {
            ...state,
            selectedZone: {
                x1: action.x1,
                y1: action.y1,
                x2: action.x1,
                y2: action.y1
            }
        }
    case types.MOVE_SELECTED_ZONE:
        return {
            ...state,
            selectedZone: {
                ...state.selectedZone,
                x2: action.x2,
                y2: action.y2
            }
        }
    case types.CLEAR_SELECTED_ZONE:
        return {
            ...state,
            selectedZone: {
                x1: null,
                y1: null,
                x2: null,
                y2: null
            }
        }
    default:
        return state
    }
}

export default display
