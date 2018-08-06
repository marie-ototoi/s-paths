import mongoose from 'mongoose'

const resourceSchema = new mongoose.Schema({
    type: { type: String, required: true },
    endpoint: { type: String, required: true },
    graphs: { type: Array },
    ownGraph: Boolean,
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
                    graphs: prop.graphs
                },
                {
                    $set: {
                        total: prop.total || null,
                        modifiedAt: Date.now()
                    },
                    $setOnInsert: {
                        ownGraph: false,
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
