import mongoose from 'mongoose'

const pathSchema = new mongoose.Schema({
    fullPath: { type: String, required: true },
    property: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String },
    datatype: { type: String, required: true },
    type: { type: String, required: true },
    entrypoint: { type: String, required: true },
    endpoint: { type: String, required: true },
    level: { type: Number, required: true },
    interlinks: [],
    total: Number,
    unique: Number,
    coverage: Number,
    avgcharlength: Number,
    createdAt: Date,
    modifiedAt: Date
})

pathSchema.statics = {
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
                        subcategory: prop.subcategory || null,
                        type: prop.type,
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
                        datatype: prop.datatype,
                        level: prop.level
                    }
                },
                { upsert: true }
            ).exec()
        })
        return Promise.all(allPromises)
    }
}

const Model = mongoose.model('Path', pathSchema)

module.exports = Model
