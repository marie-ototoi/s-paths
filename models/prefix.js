import mongoose from 'mongoose'
import queryLib from '../src/lib/queryLib'

const prefixSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    prefix: { type: String, required: true },
    createdAt: { type: Date },
    modifiedAt: { type: Date }
})

prefixSchema.statics = {
    findOrGenerateOne (url) {
        return this.find().exec()
            .then(prefixes => {
                const found = prefixes.filter(pref => {
                    let splittedUri = url.split(pref._id)
                    return (splittedUri.length > 1)
                })
                // console.log('found', found)
                if (found.length > 0) {
                    return found[0]
                } else {
                    return this.setSmallestPrefixName(url)
                        .then(upsertedPrefix => {
                            return this.findOne({ _id: upsertedPrefix.upserted[0]._id }).exec()
                        })
                }
            })
    },
    findOrCreate (prefixes) {
        let allPromises = []
        for (let prefix in prefixes) {
            allPromises.push(this.update(
                { _id: prefixes[prefix] },
                { $set: { prefix: prefix, createdAt: Date.now() } },
                { upsert: true }
            ).exec())
        }
        return Promise.all(allPromises)
    },
    setSmallestPrefixName (url) {
        const root = queryLib.getRoot(url)
        const flatRoot = queryLib.createPrefix(root)
        const checkRoot = (len) => {
            return this.findOne({ prefix: flatRoot.substr(0, len) }).exec()
                .then(res => {
                    // console.log(flatRoot.substr(0, len), len, res)
                    return !res ? flatRoot.substr(0, len) : checkRoot(flatRoot, (len + 1))
                })
                .then(pref => {
                    // console.log(pref, root)
                    return this.update(
                        { _id: root },
                        { $set: { prefix: pref, createdAt: Date.now() } },
                        { upsert: true }
                    ).exec()
                })
        }
        return checkRoot(5)
    }
}

const Model = mongoose.model('Prefix', prefixSchema)

module.exports = Model
