import mongoose from 'mongoose'

const resourceSchema = new mongoose.Schema({
    type: { type: String, required: true },
    endpoint: { type: String, required: true },
    graph: { type: String },
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
                    endpoint: prop.endpoint,
                    graph: prop.graph
                },
                {
                    $set: {
                        total: prop.total || null,
                        modifiedAt: Date.now()
                    },
                    $setOnInsert: {
                        type: prop.type,
                        endpoint: prop.endpoint,
                        graph: prop.graph,
                        createdAt: Date.now()
                    }
                },
                { upsert: true }
            ).exec()
        })
        return Promise.all(allPromises)
    }
}

export default mongoose.model('Resource', resourceSchema)
