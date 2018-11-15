import express from 'express'
import resourceModel from '../models/resource'
import pathModel from '../models/path'
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
    let resources = await resourceModel.find({ endpoint: endpoint, graphs: { $all: graphs, $size: graphs.length } }).sort('-total').exec()
    console.log('GET RESOURCES')
    if (resources.length > 0) {
        resources = resources.map(resource => resource._doc)
    } else {
        let query = queryLib.makeQueryResources(options)
        console.log(query)
        let result = await queryLib.getData(localEndpoint, query, {})
        resources = result.results.bindings.map(resource => {
            return { total: Number(resource.occurrences.value), type: resource.type.value, endpoint, graphs }
        })
        // console.log(resources)
        await resourceModel.createOrUpdate(resources) 
    }
    let labels = await getLabels(resources.map(resource => {
        return { uri: resource.type }
    }))
    let dico = dataLib.getDict(labels.map(label => { return { key: label.uri } }))
    let pathsNumbers = []
    for (let i= 0; i < resources.length; i ++){
        let pathsNumber = await pathModel.countDocuments({ endpoint: endpoint, entrypoint: resources[i].type, graphs: { $all: graphs, $size: graphs.length } }).exec()
        pathsNumbers[i] = pathsNumber
        // console.log('count', i, pathsNumber)
    }
    // console.log('agg', resources, pathsNumbers, resources.length, pathsNumbers.length)
    let newresources = resources.map((resource, i) => {
        // console.log('new resource', i)
        let newresource = {
            ...resource,
            label: queryLib.usePrefix(dico[resource.type]? labels[dico[resource.type]].label : resource.type, prefixes),
            comment: dico[resource.type] ? labels[dico[resource.type]].comment : null,
            pathsNumber: pathsNumbers[i] || 0
        }
        
        return newresource
    }).sort((a, b) => b.pathsNumber - a.pathsNumber)
    console.log(newresources)
    return newresources
}

export default router
