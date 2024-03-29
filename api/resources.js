import express from 'express'
import resourceModel from '../models/resource'
import prefixModel from '../models/prefix'
import { getLabels } from '../src/lib/labelLib'
import * as queryLib from '../src/lib/queryLib'
import * as dataLib from '../src/lib/dataLib'

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
    let { graphs, endpoint, localEndpoint, prefixes } = options
    let newprefixes = await prefixModel.find({}).exec()
    newprefixes.forEach(pref => {
        prefixes[pref._doc.pref] = pref._doc.uri
    })
    let resources = await resourceModel.find({ endpoint: endpoint, graphs: { $all: graphs, $size: graphs.length } }).sort('-pathsNumber').exec()
    console.log('GET RESOURCES')
    if (resources.length > 0) {
        resources = resources.map(resource => resource._doc)
    } else {
        let query = queryLib.makeQueryResources(options)
        console.log(query)
        let result = await queryLib.getData(localEndpoint, query, {})
        let labels = await getLabels(result.results.bindings.map(resource => {
            return { uri: resource.type.value }
        }))
        let dico = dataLib.getDict(labels.map(label => { return { key: label.uri } }))
        resources = result.results.bindings.map(resource => {
            return {
                total: Number(resource.occurrences.value),
                type: resource.type.value,
                endpoint,
                graphs,
                label: queryLib.usePrefix(dico[resource.type.value]? labels[dico[resource.type.value]].label : resource.type.value, prefixes),
                comment: dico[resource.type.value] ? labels[dico[resource.type.value]].comment : null
            }
        })
        // console.log(resources)
        await resourceModel.createOrUpdate(resources) 
    }    
    // console.log('agg', resources, pathsNumbers, resources.length, pathsNumbers.length)
    console.log('resources', resources)
    return resources
}

export default router
