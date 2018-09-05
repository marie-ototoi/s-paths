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

const getResources = async (options) => {
    // add default options when not set
    let { graphs, endpoint, localEndpoint, toAnalyse } = options
    if (Array.isArray(toAnalyse) && toAnalyse.length > 0) {
        for(let i = 0; i < toAnalyse.length; i ++) {
            queryLib.getData(localEndpoint, `DROP SILENT GRAPH <${toAnalyse[i]}>`, {})
            console.log(`DROP SILENT GRAPH <${toAnalyse[i]}>`)
            await new Promise((resolve, reject) => setTimeout(resolve, 100))
            queryLib.getData(localEndpoint, `CREATE GRAPH <${toAnalyse[i]}>`, {})
            console.log(`CREATE GRAPH <${toAnalyse[i]}>`)
            await new Promise((resolve, reject) => setTimeout(resolve, 100))
            for(let j = 1; j < options.maxLevel; j ++) {
                let query = queryLib.makeSubGraphQuery({
                    ...options,
                    entrypoint: toAnalyse[i],
                    resourceGraph: toAnalyse[i],
                }, j)
                console.log(query)
                queryLib.getData(localEndpoint, query, {})
                await new Promise((resolve, reject) => setTimeout(resolve, 2000))
            }
            resourceModel.updateOne({ endpoint, graphs: { $all: graphs }, type: toAnalyse[i] }, { subgraph: true }, { upsert: true }).exec()
            await new Promise((resolve, reject) => setTimeout(resolve, 5000))
        }
    }

    let resources = await resourceModel.find({ endpoint: endpoint, graphs: { $all: graphs } }).sort('-total').exec()
    console.log('GET RESOURCES', endpoint, graphs, resources)
    if (resources.length > 0) {
        resources = resources.map(resource => resource._doc)
    } else {
        let query = queryLib.makeQueryResources(options)
        console.log(query)
        let result = await queryLib.getData(localEndpoint, query, {})
        resources = result.results.bindings.map(resource => {
            return { total: Number(resource.occurrences.value), type: resource.type.value, endpoint, graphs }
        })
        console.log(resources)
        await resourceModel.createOrUpdate(resources) 
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
