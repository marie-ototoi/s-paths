import mongoose from 'mongoose'

const pathSchema = new mongoose.Schema({
    fullPath: { type: String, required: true },
    path: { type: String, required: true },
    graphs: { type: Array, required: true },
    endpoint: { type: String, required: true },
    //
    createdAt: Date,
    //
    entrypoint: { type: String, required: true },
    level: { type: Number, required: true },
    property: { type: String, required: true },
    //
    modifiedAt: Date,
    //
    avgcharlength: Number,
    category: { type: String, required: true },
    coverage: Number,
    datatype: { type: String, required: true },
    interlinks: [],
    subcategory: { type: String },
    triplesGraphs: { type: Array, required: true },
    readablePath: { type: Array },
    total: Number,
    type: { type: String, required: true },
    unique: Number
})

pathSchema.statics = {
    createOrUpdate (properties) {
        let allPromises = properties.map(prop => {
            return this.updateOne(
                {
                    endpoint: prop.endpoint,
                    graphs: prop.graphs,
                    entrypoint: prop.entrypoint,
                    path: prop.path
                },
                {
                    $set: {
                        fullPath: prop.fullPath,
                        avgcharlength: prop.avgcharlength || null,
                        category: prop.category,
                        coverage: prop.coverage || null,
                        datatype: prop.datatype,
                        total: prop.total || null,
                        triplesGraphs: prop.triplesGraphs,
                        readablePath: prop.readablePath,
                        type: prop.type,
                        unique: prop.unique || null,
                        modifiedAt: Date.now(),
                        subcategory: prop.subcategory || null
                    },
                    $setOnInsert: {
                        createdAt: Date.now(),
                        level: prop.level,
                        property: prop.property
                    }
                },
                { upsert: true }
            ).exec()
        })
        return Promise.all(allPromises)
    }
}

export default mongoose.model('Path', pathSchema)
