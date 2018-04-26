import express from 'express'
import stats from './stats'
import resources from './resources'

let router = express.Router()

// middleware to use for all requests
router.use('/', (req, res, next) => {
    if (req.path === '/favicon.ico') {
        res.writeHead(200, { 'Content-Type': 'image/x-icon' })
        res.end()
    } 
    next()
})

router.use('/stats', stats)
//router.use('/resources', resources)

export default router
