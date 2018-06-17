import dotenv from 'dotenv'
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import index from './api/index'

dotenv.config()
require('./models/connection')

// Router configuration
const router = express.Router()
router.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))

// Application initialisation
const app = express()
app.use(cors())
app.use(bodyParser.json({limit: '50mb'}))

app.use('/', router)
app.use('/', express.static('public'))
app.use('/', index)

// Development configuration
// console.log('salut', process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
    const config = require('./webpack.dev');

    const compiler = require('webpack')(config);
    const {publicPath} = config.output;
    // console.log(publicPath)
    require('webpack-hot-client')(compiler, { host: process.env.APP_BASE });
    app.use(require('webpack-dev-middleware')(compiler, {
        publicPath
    }));
}

app.listen(5000, () => console.log('ℹ ｢app｣: Semantic Paths server running on port 5000'))
