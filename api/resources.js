import express from 'express'
import promiseLimit from 'promise-limit'
import resourceModel from '../models/resource'
import queryLib from '../src/lib/queryLib'
// import { error } from 'util';

const router = express.Router()
const limit = promiseLimit(10)

router.post('/resources', (req, res) => {
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

const getResources = (opt) => {
    // add default options when not set
    let { endpoint } = opt
    let options = {
        defaultGraph: opt.defaultGraph || null,
        endpoint: opt.endpoint,
        forceUpdate: opt.forceUpdate
    }
    let totalInstances
    // number of entities of the set of entrypoint class
    let query = queryLib.makeQueryResources(options)
    return queryLib.getData(endpoint, query, {})
        .then(resources => {
            console.log(resources)
        })
   
}

export default router
