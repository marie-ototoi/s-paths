import mongoose from 'mongoose'

mongoose.Promise = Promise

mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true })
    .catch(err => console.error('✘ CANNOT CONNECT TO mongoDB DATABASE !', err))
