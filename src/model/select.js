
// statistical queries
const selectViews = () => {

    return new Promise((resolve, reject) => {

        resolve(data.explore())

    })
}

exports.selectViews = selectViews
