const mongoose = require('mongoose')
mongoose.Promise = Promise

module.exports = mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true })
    .then(
        () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
        err => { console.error('✘ CANNOT CONNECT TO mongoDB DATABASE !', err) }
    )
