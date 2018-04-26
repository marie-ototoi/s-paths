import mongoose from 'mongoose'

const resourceSchema = new mongoose.Schema({
    type: { type: String, required: true },
    endpoint: { type: String, required: true },
    total: Number,
    createdAt: Date,
    modifiedAt: Date
})

resourceSchema.statics = {
    createOrUpdate (properties) {
        let allPromises = properties.map(prop => {
            return this.update(
                {
                    type: prop.type,
                    endpoint: prop.endpoint
                },
                {
                    $set: {
                        total: prop.total || null,
                        modifiedAt: Date.now()
                    },
                    $setOnInsert: {
                        createdAt: Date.now(),
                        endpoint: prop.endpoint,
                        type: prop.type
                    }
                },
                { upsert: true }
            ).exec()
        })
        return Promise.all(allPromises)
    }
}

const Model = mongoose.model('Resource', resourceSchema)

module.exports = Model
