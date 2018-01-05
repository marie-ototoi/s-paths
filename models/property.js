import mongoose from 'mongoose'

const propertySchema = new mongoose.Schema({
    fullPath: { type: String, required: true },
    property: { type: String, required: true },
    category: { type: String, required: true },
    entrypoint: { type: String, required: true },
    endpoint: { type: String, required: true },
    level: { type: Number, required: true },
    total: { type: Number },
    unique: { type: Number },
    coverage: { type: Number },
    avgcharlength: { type: Number },
    createdAt: { type: Date },
    modifiedAt: { type: Date }
})

propertySchema.statics = {
    createOrUpdate (properties) {
        let allPromises = properties.map(prop => {
            return this.update(
                {
                    fullPath: prop.fullPath,
                    entrypoint: prop.entrypoint,
                    endpoint: prop.endpoint
                },
                {
                    $set: {
                        category: prop.category,
                        total: prop.total || null,
                        unique: prop.unique || null,
                        coverage: prop.coverage || null,
                        avgcharlength: prop.avgcharlength || null,
                        modifiedAt: Date.now()
                    },
                    $setOnInsert: {
                        createdAt: Date.now(),
                        property: prop.property,
                        fullPath: prop.fullPath,
                        level: prop.level
                    }
                },
                { upsert: true }
            ).exec()
        })
        return Promise.all(allPromises)
    }
}

const Model = mongoose.model('Property', propertySchema)

module.exports = Model
