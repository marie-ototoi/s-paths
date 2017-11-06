
const selectViewConfigs = (availableViews, stats, domainRules = []) => {
    // for each views, checks which properties ou sets of properties could match and evaluate
    return []
}

const activateDefaultViewConfigs = (viewConfigs) => {
    // temporary : select the first 2 ones
    return viewConfigs.map((vc, index) => {
        let zone;
        if (index === 0) zone = 'main'
        if (index === 1) zone = 'aside'
        return {
            ...vc,
            zone: (index <= 1) ? zone : null
        }
    })
}

exports.activateDefaultViewConfigs = activateDefaultViewConfigs
exports.selectViewConfigs = selectViewConfigs
