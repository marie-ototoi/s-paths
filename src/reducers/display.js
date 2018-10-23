import types from '../constants/ActionTypes'

const initValue = 10

const defaultState = {
    screen: {
        width: initValue,
        height: initValue
    },
    vizDefPercent: {
        useful_height: 60,
        top_margin: 24,
        bottom_margin: 5,
        bottom_padding: 11,
        horizontal_margin: 15,
        main_width: 100,
        aside_width: 0
    },
    faded: {
        main: 0.5,
        aside: 0.3
    },
    viz: {
        useful_height: initValue,
        width: initValue,
        useful_width: initValue,
        //
        top_margin: initValue,
        bottom_margin: initValue,
        bottom_padding: initValue,
        horizontal_padding: initValue,
        //
        main_x: initValue,
        main_width: initValue,
        main_useful_width: initValue,
        main_useful_height: initValue,
        main_top_padding: initValue,
        aside_x: initValue,
        aside_width: initValue,
        aside_useful_width: initValue,
        aside_useful_height: initValue,
        aside_top_padding: initValue
    },
    modifierPressed: null,
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
    settingsOpen: false,
    statsOpen: false,
    graphsOpen: false,
    details: []
}

const display = (state = defaultState, action) => {
    // console.log(action, state)
    let newZone
    switch (action.type) {
    case types.SET_DISPLAY:
        return {
            ...state,
            screen: action.screen || state.screen,
            viz: action.viz || state.viz,
            vizDefPercent: action.vizDefPercent || state.vizDefPercent,
        }
    case types.SHOW_SETTINGS:
        return {
            ...state,
            settingsOpen: !state.settingsOpen
        }
    case types.SHOW_STATS:
        return {
            ...state,
            statsOpen: !state.statsOpen
        }
    case types.SHOW_GRAPHS:
        return {
            ...state,
            graphsOpen: !state.graphsOpen
        }
    case types.SHOW_DETAILS:
        return {
            ...state,
            details: action.details
        }
    case types.SET_MODIFIER:
        return {
            ...state,
            modifierPressed: action.modifierPressed
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
    case types.ADD_SELECTION:
    case types.REMOVE_SELECTION:
    case types.REPLACE_SELECTION:
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
