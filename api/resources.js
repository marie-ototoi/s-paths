import express from 'express'
import promiseLimit from 'promise-limit'
import pathModel from '../models/path'
import resourceModel from '../models/resource'
import queryLib from '../src/lib/queryLib'
// import { error } from 'util';

const router = express.Router()
const limit = promiseLimit(10)

router.post('/', (req, res) => {
    if (!req.body.endpoint) {
        // console.error('You must provide at least an entrypoint and an endpoint')
        res.end()
    } else {
        getResources(req.body)
            .then(resources => {
                console.log('API resources', resources)
                res.json(resources)
                res.end()
            })
            .catch((err) => {
                console.error('Error retrieving resources', err)
            })
    }
})

const getResources = async (opt) => {
    // add default options when not set
    let options = {
        defaultGraph: opt.defaultGraph || null,
        endpoint: opt.endpoint,
        forceUpdate: opt.forceUpdate
    }
    let { endpoint, forceUpdate } = options
    if (forceUpdate) {
        await pathModel.deleteMany({ endpoint })
        await resourceModel.deleteMany({ endpoint })
    }
    let query = queryLib.makeQueryResources(options)
    let result = await queryLib.getData(endpoint, query, {})
    let resources = result.results.bindings.map(resource => {
        return { total: Number(resource.occurrences.value), type: resource.type.value, endpoint }
    })
    await resourceModel.createOrUpdate(resources)
    return resources
}

export default router
