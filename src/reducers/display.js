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
    unitDimensions: {
        main: {
            origin: null,
            target: null
        },
        aside: {
            origin: null,
            target: null
        }
    }
}

const display = (state = defaultState, action) => {
    // console.log(action, state)
    switch (action.type) {
    case types.SET_DISPLAY: {
        return {
            ...state,
            mode: action.mode || state.mode,
            screen: action.screen || state.screen,
            viewBox: action.viewBox || state.viewBox,
            stage: action.stage || state.stage,
            grid: action.grid || state.grid,
            zones: action.zones || state.zones,
            viz: action.viz || state.viz
        }
    }
    case types.START_SELECTED_ZONE: {
        let newSelectedZoneStart = state.selectedZone
        newSelectedZoneStart[action.zone] = {
            x1: action.x1,
            y1: action.y1,
            x2: action.x1,
            y2: action.y1
        }
        return {
            ...state,
            selectedZone: newSelectedZoneStart
        }
    }
    case types.MOVE_SELECTED_ZONE: {
        let newSelectedZoneMove = state.selectedZone
        newSelectedZoneMove[action.zone].x2 = action.x2
        newSelectedZoneMove[action.zone].y2 = action.y2
        return {
            ...state,
            selectedZone: newSelectedZoneMove
        }
    }
    case types.CLEAR_SELECTED_ZONE: {
        let newSelectedZoneClear = state.selectedZone
        newSelectedZoneClear[action.zone] = {
            x1: null,
            y1: null,
            x2: null,
            y2: null
        }
        return {
            ...state,
            selectedZone: newSelectedZoneClear
        }
    }
    case types.SET_UNIT_DIMENSIONS: {
        return {
            ...state,
            unitDimensions: {
                ...state.unitDimensions,
                [action.zone]: {
                    ...state.unitDimensions[action.zone],
                    [action.role]: {
                        ...state.unitDimensions[action.zone][action.role],
                        ...action.unitDimensions
                    }
                }
            }
        }
    }
    case types.SET_DATA: {
        let unitDimensions = {
            main: {
                origin: state.unitDimensions.main.origin,
                target: (action.resetUnitDimensions === 'all' || (action.resetUnitDimensions === 'zone' && action.zone === 'main')) ? null : state.unitDimensions.main.target
            },
            aside: {
                origin: state.unitDimensions.aside.origin,
                target: (action.resetUnitDimensions === 'all' || (action.resetUnitDimensions === 'zone' && action.zone === 'aside')) ? null : state.unitDimensions.aside.target
            }
        }
        return {
            ...state,
            unitDimensions
        }
    }
    case types.END_TRANSITION: {
        return {
            ...state,
            unitDimensions: {
                main: {
                    origin: state.unitDimensions.main.target ? state.unitDimensions.main.target : state.unitDimensions.main.origin,
                    target: state.unitDimensions.main.target
                },
                aside: {
                    origin: state.unitDimensions.aside.target ? state.unitDimensions.aside.target : state.unitDimensions.aside.origin,
                    target: state.unitDimensions.aside.target
                }
            }
        }
    }
    case types.RESET_UNIT_DIMENSIONS: {
        return {
            ...state,
            unitDimensions: {
                main: {
                    origin: null,
                    target: null
                },
                aside: {
                    origin: null,
                    target: null
                }
            }
        }
    }
    default:
        return state
    }
}

export default display
