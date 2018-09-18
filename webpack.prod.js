const merge = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const common = require('./webpack.common.js')

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        new Dotenv({ path: './.env.prod' })
    ],
    optimization: {
        minimizer: [new TerserPlugin({
            test: /\.js(\?.*)?$/i,
            parallel: true
        })]
    }
})
