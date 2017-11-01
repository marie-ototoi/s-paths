import data from '../../test/data/nobel'

// statistical queries
const exploreProperties = (endpoint, entity) => {

    return new Promise((resolve, reject) => {

        resolve(data.explore())

    })
}

exports.exploreProperties = exploreProperties
