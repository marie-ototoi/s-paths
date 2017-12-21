import dotenv from 'dotenv'
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import index from './api/index'

dotenv.config()
const dbConnect = require('./models/connection')

const app = express()
const router = express.Router()
app.use(cors())
app.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

app.use('/', router)

app.use('/', index)

app.listen(5000, () => {
    console.log('Api is running on port 5000')
})
