import mongoose from 'mongoose'

const resourceSchema = new mongoose.Schema({
    type: { type: String, required: true },
    endpoint: { type: String, required: true },
    graphs: { type: Array },
    subgraph: Boolean,
    total: Number,
    pathsNumber: Number,
    label: { type: String },
    comment: { type: String },
    createdAt: Date,
    modifiedAt: Date
})

resourceSchema.statics = {
    createOrUpdate (properties) {
        let allPromises = properties.map(prop => {
            return this.updateOne(
                {
                    type: prop.type,
                    endpoint: prop.endpoint,
                    graphs: prop.graphs
                },
                {
                    $set: {
                        total: prop.total || 0,
                        label: prop.label || '',
                        comment: prop.comment || '',
                        pathsNumber: prop.pathsNumber || 0,
                        modifiedAt: Date.now()
                    },
                    $setOnInsert: {
                        createdAt: Date.now(),
                        subgraph: false
                    }
                },
                { upsert: true }
            ).exec()
        })
        return Promise.all(allPromises)
    }
}

export default mongoose.model('Resource', resourceSchema)
