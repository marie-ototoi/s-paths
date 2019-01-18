import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import api from './api'

mongoose.Promise = Promise
mongoose
    .connect(process.env.MONGODB_URI, {
        autoReconnect: true,
        useNewUrlParser: true,
        reconnectTries: 20,
    })
    .catch(err => console.error('✖ ｢app｣: Unable to connect to the MongoDB database', err))

// Router configuration
const router = express.Router()
router.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))

// Application initialisation
const app = express()
app.use(cors())
app.use(bodyParser.json({limit: '50mb'}))

app.use('/', router)
app.use('/', express.static('public'))
app.use('/', api)

// Development configuration
if (process.env.NODE_ENV === 'development') {
    const config = require('./webpack.dev');
    const compiler = require('webpack')(config);
    const {publicPath} = config.output;
    require('webpack-hot-client')(compiler, {
        host: '0.0.0.0',
        port: { client: 8081, server: 8081 }
    });
    app.use(require('webpack-dev-middleware')(compiler, {
        publicPath,
        watchOptions: {
            poll: 1000 // https://webpack.js.org/configuration/watch/#watchoptions watching does not work with Virtualbox VM
        }
    }));
}

app.listen(80, () => console.log('ℹ ｢app｣: S-Paths server running on port', 80))
