import express from 'express'
import stats from './stats'

let router = express.Router()

console.log('titi')
// middleware to use for all requests
router.use('/', function (req, res, next) {
    console.log('toto')
    next()
})

router.use('/stats', stats)

export default router
