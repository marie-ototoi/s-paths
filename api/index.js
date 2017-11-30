import express from 'express'
import stats from './stats'

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

export default router
