import * as types from '../constants/ActionTypes'
import exploreData from '../model/exploreData'
import selectViews from '../model/selectViews'

export const setDisplay = (dispatch) => (display) => {
    return dispatch({
        type: types.SET_DISPLAY,
        ...display
    })
}

export const receiveStats = (dispatch) => (stats) => {
    return dispatch({
        type: types.SET_STATS,
        stats
    })
}

export const init = (dispatch) => () => {
    return dispatch({
        type: types.INIT
    })
}

export const setEntrypoint = (dispatch) => (endpoint, entrypoint, constraints = '') => {
    return dispatch({
        type: types.SET_ENTRYPOINT,
        endpoint,
        entryPoint,
        constraints
    })
}

export const loadData = (dispatch) => (endpoint, entrypoint, constraints, configs, views) => {
    exploreData.getStats(endpoint, entrypoint)
        .then(stats => {
            dispatch({
                type: types.SET_STATS,
                stats
            })
            let configs = selectViews.selectViewConfigs(views, stats)
            configs = selectViews.activateDefaultViewConfigs(configs)
            dispatch({
                type: types.SET_CONFIGS,
                configs
            })
            return new Promise((resolve) => {
                resolve(configs)
            })
        })
        .then(configs => {
            let configMain = configs.filter(c => c.zone === 'main')[0]
            let queryMain =  exploreData.makeQuery(entrypoint, constraints, configMain)
            let configAside = configs.filter(c => c.zone === 'aside')[0]
            let queryAside =  exploreData.makeQuery(entrypoint, constraints, configAside)
            return Promise.all([
                exploreData.getData(endpoint, queryMain),
                exploreData.getData(endpoint, queryAside)
            ])
                .then(([dataMain, dataAside]) => {
                    console.log(dataMain)
                    dispatch({
                        type: types.SET_DATA,
                        statements: dataMain,
                        zone: 'main'
                    })
                    dispatch({
                        type: types.SET_DATA,
                        statements: dataAside,
                        zone: 'aside'
                    })
                })
        })
        .catch(error => {
            console.error('Error getting data', error)
        })
}
