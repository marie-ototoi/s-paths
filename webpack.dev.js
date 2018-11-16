const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const { DefinePlugin } = require('webpack')
const common = require('./webpack.common.js')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    plugins: [
        new DefinePlugin({
            'process.env': {
                ENDPOINT: JSON.stringify(process.env.ENDPOINT),
                LOCAL_ENDPOINT: JSON.stringify(process.env.LOCAL_ENDPOINT),
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                APP_NAME: JSON.stringify(process.env.APP_NAME)
            }
        }),
        new CleanWebpackPlugin(common.output.path)
    ]
})
