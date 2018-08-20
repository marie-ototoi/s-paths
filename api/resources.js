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

    let resources = await resourceModel.find({ endpoint: endpoint, graphs: { $all: graphs } }).sort('-total').exec()
    console.log('GET RESOURCES', resources)
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
        for(let i = 0; i < resources.length; i ++) {
            console.log(`CREATE GRAPH <${resources[i].type}>`)
            queryLib.getData(localEndpoint, `CREATE GRAPH <${resources[i].type}>`, {})
            await new Promise((resolve, reject) => setTimeout(resolve, 200))
        }
        for(let i = 0; i < resources.length; i ++) {
            for(let j = 1; j < options.maxLevel; j ++) {
                let query = queryLib.makeSubGraphQuery({
                    ...options,
                    entrypoint: resources[i].type,
                    resourceGraph: resources[i].type,
                }, j)
                console.log(query)
                queryLib.getData(localEndpoint, query, {})
                await new Promise((resolve, reject) => setTimeout(resolve, 2000))
            }
            await new Promise((resolve, reject) => setTimeout(resolve, 5000))
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
