import mongoose from 'mongoose'

const resourceSchema = new mongoose.Schema({
    pref: { type: String, required: true },
    uri: { type: String, required: true },
    createdAt: Date,
    modifiedAt: Date
})

resourceSchema.statics = {
    createOrUpdate (properties) {
        let allPromises = properties.map(prop => {
            return this.updateOne(
                {
                    pref: prop.pref,
                    uri: prop.uri
                },
                {
                    $set: {
                        modifiedAt: Date.now()
                    },
                    $setOnInsert: {
                        createdAt: Date.now()
                    }
                },
                { upsert: true }
            ).exec()
        })
        return Promise.all(allPromises)
    }
}

export default mongoose.model('Prefix', resourceSchema)
