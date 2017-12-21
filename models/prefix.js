const mongoose = require('mongoose')
import queryLib from '../src/lib/queryLib'

const prefixSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    url: { type: String, required: true },
    createdAt: { type: Date },
    modifiedAt: { type: Date }
})

prefixSchema.statics.findOrCreateOne = (_id) => {
    return this.findOne({ _id }).exec()
        .then(prefix => {
            if (!prefix) {

            } else {
                let prefObj = {}
                prefObj[prefix._id] = prefix.url
                return new Promise(resolve => queryLib.usePrefix(_id, prefObj))
            }
        })
        .catch(err => {
            console.error(err)
        })
}
prefixSchema.statics.findOrCreate = (prefixes) => {
    let allPromises = []
    for (let prefix in prefixes) {
        allPromises.push(this.update(
            { _id: prefixes[prefix] },
            { $set: { prefix: prefix, createdAt: Date.now() } },
            { upsert: true }
        ).exec())
    }
    return Promise.all(allPromises)
}

const Model = mongoose.model('Prefix', prefixSchema)

module.exports = Model
