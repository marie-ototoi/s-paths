import express from 'express'
import stats from './api/stats'

const app = express()
const router = express.Router()

router.use('/', stats)

app.use('/', router)

app.listen(5000, () => {
    console.log('Api is running on port 5000')
})
