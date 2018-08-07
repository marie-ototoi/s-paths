import express from 'express'
import pathModel from '../models/path'
import resourceModel from '../models/resource'
import { getLabels } from '../src/lib/labelLib'
import * as queryLib from '../src/lib/queryLib'
import * as dataLib from '../src/lib/dataLib'
// import { error } from 'util';

const router = express.Router()

router.post('/', (req, res) => {
    if (!req.body.endpoint) {
        // console.error('You must provide at least an entrypoint and an endpoint')
        res.end()
    } else {
        getResources(req.body)
            .then(resources => {
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
    let options = opt
    let { graphs, endpoint, localEndpoint, forceUpdate } = options
    if (forceUpdate) {
        let toDelete = await resourceModel.find({ endpoint, graphs: { $all: graphs } }).exec()
        for(let i = 0; i < toDelete.length; i ++) {
            queryLib.getData(localEndpoint, `CLEAR GRAPH <${toDelete[i]._doc.type}>`, {})
            await new Promise((resolve, reject) => setTimeout(resolve, 1000))
        }
        await pathModel.deleteMany({ endpoint, graphs: { $all: graphs } }).exec()
        await resourceModel.deleteMany({ endpoint, graphs: { $all: graphs } }).exec()
    }
    let resources = await resourceModel.find({ endpoint: endpoint, graphs: { $all: graphs } }).sort('-total').exec()
    if (resources.length > 0) {
        resources = resources.map(resource => resource._doc)
    } else {
        let query = queryLib.makeQueryResources(options)
        let result = await queryLib.getData(localEndpoint, query, {})
        resources = result.results.bindings.map(resource => {
            return { total: Number(resource.occurrences.value), type: resource.type.value, endpoint, graphs }
        })
        await resourceModel.createOrUpdate(resources)
        resources = await resourceModel.find({ endpoint: endpoint, graphs: { $all: graphs } }).sort('-total').exec()
        resources = resources.map(resource => resource._doc)
        for(let i = 0; i < resources.length; i ++) {
            let resource = resources[i]
            for(let j = 1; j < options.maxLevel; j ++) {
                let query = queryLib.makeSubGraphQuery({
                    ...options,
                    resourceGraph: resource.type,
                    entrypoint: resource.type
                }, j)
                queryLib.getData(localEndpoint, query, {})
                await new Promise((resolve, reject) => setTimeout(resolve, 2500))
            }
        }
    }
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
