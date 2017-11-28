import express from 'express'
import stats from './stats'

let router = express.Router()

// middleware to use for all requests
router.use('/', function (req, res, next) {
    next()
})

router.use('/stats', stats)

export default router
