import types from '../constants/ActionTypes'

const defaultState = {
    screen: {
        width: 10,
        height: 10
    },
    grid: {
        xPoints: [],
        yPoints: []
    },
    gridDefPercent: {
        xPoints: [0, 35, 40, 100],
        yPoints: [0, 17, 100]
    },
    zones: {
        main: { x: 0, y: 0, width: 10, height: 10 },
        aside: { x: 0, y: 0, width: 10, height: 10 },
        full: { x: 0, y: 0, width: 10, height: 10 },
        dev: { x: 0, y: 0, width: 10, height: 10 }
    },
    zonesDefPercent: {
        dev: { x: 0, y: 0, width: 100, height: 100 },
        full: { x: 0, y: 0, width: 100, height: 100 },
        main: { x: 40, y: 0, width: 60, height: 100 },
        aside: { x: 0, y: 0, width: 35, height: 100 }
    },
    vizDefPercent: {
        useful_width: 70,
        useful_height: 60,
        top_margin: 24,
        bottom_margin: 16,
        horizontal_margin: 15
    },
    viz: {
        useful_width: 10,
        useful_height: 10,
        top_margin: 10,
        bottom_margin: 10,
        horizontal_margin: 10
    },
    selectedZone: {
        main: {
            x1: null,
            y1: null,
            x2: null,
            y2: null
        },
        aside: {
            x1: null,
            y1: null,
            x2: null,
            y2: null
        }
    },
    detail: {
        main: false,
        aside: false
    },
    settingsOpen: {
        main: false,
        aside: false
    }
}

const display = (state = defaultState, action) => {
    // console.log(action, state)
    let newZone
    let newSettings
    switch (action.type) {
    case types.SET_DISPLAY:
        return {
            ...state,
            mode: action.mode || state.mode,
            screen: action.screen || state.screen,
            grid: action.grid || state.grid,
            zones: action.zones || state.zones,
            viz: action.viz || state.viz
        }
    case types.SHOW_SETTINGS:
        newSettings = state.settingsOpen
        newSettings[action.zone] = !newSettings[action.zone]
        return {
            ...state,
            settingsOpen: newSettings
        }
    case types.START_SELECTED_ZONE:
        newZone = { ...state.selectedZone }
        newZone[action.zone] = {
            x1: action.x1,
            y1: action.y1
        }
        return {
            ...state,
            selectedZone: newZone
        }
    case types.CLEAR_SELECTED_ZONE:
        newZone = { ...state.selectedZone }
        newZone[action.zone] = {
            x1: null,
            y1: null
        }
        return {
            ...state,
            selectedZone: newZone
        }
    default:
        return state
    }
}

export default display
