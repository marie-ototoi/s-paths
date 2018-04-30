import express from 'express'
import promiseLimit from 'promise-limit'
import pathModel from '../models/path'
import resourceModel from '../models/resource'
import { getLabels } from '../src/lib/labelLib'
import queryLib from '../src/lib/queryLib'
import dataLib from '../src/lib/dataLib'
import dataset from '../src/reducers/dataset'
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
        forceUpdate: opt.forceUpdate,
        prefixes: opt.prefixes
    }
    let { endpoint, forceUpdate, prefixes } = options
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
    let labels = await getLabels(resources.map(resource => {
        return { uri: resource.type }
    }))
    let dico = dataLib.getDict(labels.map(label => { return { key: label.uri } }))
    return resources.map(resource => {
        return {
            ...resource,
            label: labels[dico[resource.type]].label || resource.type,
            comment: labels[dico[resource.type]].comment || null
        }
    })
}

export default router
