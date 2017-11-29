import express from 'express'
import index from './api/index'

const app = express()
const router = express.Router()

app.use('/', router)

app.use('/', index)

app.listen(5000, () => {
    console.log('Api is running on port 5000')
})
