const mongoose = require('mongoose')

const prefixSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    url: { type: String, required: true },
    createdAt: { type: Date },
    modifiedAt: { type: Date }
})

prefixSchema.statics.findOrCreate = function findOrCreate (id, url) {
    return this.update(
        { _id: id },
        { $set: { date: id, url, modifiedAt: Date.now() }, $setOnInsert: { createdAt: Date.now() } },
        { upsert: true }
    )
}

const Model = mongoose.model('Prefix', prefixSchema)

module.exports = Model
