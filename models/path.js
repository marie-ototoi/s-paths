import mongoose from 'mongoose'

const pathSchema = new mongoose.Schema({
    fullPath: { type: String, required: true },
    
    endpoint: { type: String, required: true },
    //
    //  
    createdAt: Date,
    //
    entrypoint: { type: String, required: true },
    level: { type: Number, required: true },
    property: { type: String, required: true },
    //
    // 
    modifiedAt: Date,
    //
    avgcharlength: Number,
    category: { type: String, required: true },
    coverage: Number,
    datatype: { type: String, required: true },
    interlinks: [],
    subcategory: { type: String },
    total: Number,
    type: { type: String, required: true },
    unique: Number    
})

pathSchema.statics = {
    createOrUpdate (properties) {
        let allPromises = properties.map(prop => {
            return this.update(
                {
                    fullPath: prop.fullPath,
                    endpoint: prop.endpoint
                },
                {
                    $set: {
                        avgcharlength: prop.avgcharlength || null,
                        category: prop.category,
                        coverage: prop.coverage || null,
                        datatype: prop.datatype,
                        total: prop.total || null,
                        type: prop.type,
                        unique: prop.unique || null,
                        modifiedAt: Date.now(),
                        subcategory: prop.subcategory || null
                    },
                    $setOnInsert: {
                        createdAt: Date.now(),
                        /*endpoint: prop.endpoint,
                        fullPath: prop.fullPath,*/
                        entrypoint: prop.entrypoint,
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

const Model = mongoose.model('Path', pathSchema)

module.exports = Model
