import mongoose from 'mongoose'

mongoose.Promise = Promise

mongoose
    .connect(process.env.MONGODB_URI)
    .catch(err => console.error('✘ CANNOT CONNECT TO MongoDB DATABASE !', err))
