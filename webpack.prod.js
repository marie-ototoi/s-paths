const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const common = require('./webpack.common.js')

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        new CopyWebpackPlugin([{
            from: path.join(__dirname, 'src/index.html'),
            to: path.join(__dirname, 'public/index.html')
        }]),
        new webpack.DefinePlugin({ 'process.env': { NODE_ENV: '"production"' } }),
        new UglifyJsPlugin({ sourceMap: true })
    ]
})
