import mongoose from 'mongoose'

const propertySchema = new mongoose.Schema({
    property: { type: String, required: true },
    label: { type: String },
    comment: { type: String },
    loadAttempts: { type: Number, required: true, default: 0 },
    createdAt: { type: Date },
    modifiedAt: { type: Date }
})

propertySchema.statics = {
    createOrUpdate (properties) {
        // console.log('youhou', properties)
        let allPromises = properties.map(prop => {
            if (prop.label) {
                return this.update(
                    {
                        property: prop.uri
                    },
                    {
                        $set: {
                            category: prop.category,
                            label: prop.label || null,
                            comment: prop.comment || null,
                            modifiedAt: Date.now()
                        },
                        $setOnInsert: {
                            createdAt: Date.now()
                        }
                    },
                    { upsert: true }
                ).exec()
            } else {
                return this.update(
                    {
                        property: prop.uri
                    },
                    {
                        $set: {
                            modifiedAt: Date.now()
                        },
                        $setOnInsert: {
                            createdAt: Date.now(),
                            property: prop.uri
                        },
                        $inc: {
                            loadAttempts: 1
                        }
                    },
                    { upsert: true }
                ).exec()
            }
        })
        return Promise.all(allPromises)
    }
}

const Model = mongoose.model('Property', propertySchema)

module.exports = Model
