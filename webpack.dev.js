const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const common = require('./webpack.common.js')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    plugins: [
        new Dotenv({ path: './.env' }),
        new CleanWebpackPlugin(common.output.path)
    ]
})
