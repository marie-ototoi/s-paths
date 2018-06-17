const merge = require('webpack-merge')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const common = require('./webpack.common.js')

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        new Dotenv({ path: './.env.prod' }),
        new UglifyJsPlugin({ sourceMap: true, test: /\.js($|\?)/i })
    ]
})
