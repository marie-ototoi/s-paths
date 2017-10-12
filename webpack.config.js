const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const CORE_CONFIG = {
    entry: {
        semexp: path.join(__dirname, 'src/semexp'),
        styles: path.join(__dirname, 'src/styles/styles')
    },
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'scripts/[name].js',
        devtoolModuleFilenameTemplate: 'webpack:///[resource-path]',
        library: '[name]',
        publicPath: '/'
    },
    module: {
        loaders: [
            { test: /\.(jsx|js)?/, loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.css$/, loader: ExtractTextPlugin.extract({ use: 'css-loader', fallback: 'style-loader' }) },
            { test: /\.(eot|svg|ttf|woff|woff2)$/, loader: 'file-loader?name=fonts/[name].[ext]' }
        ]
    },
    plugins: [
        new ExtractTextPlugin('styles/semexp.css'),
        new webpack.NamedModulesPlugin(),
        new CopyWebpackPlugin([{ from: path.join(__dirname, 'src/index.html'), to: path.join(__dirname, 'public/index.html') }])
    ],
    resolve: {
        extensions: ['.js', '.jsx']
    },
    node: {
        console: false,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
}

const devConfig = () =>
    merge([
        CORE_CONFIG,
        {
            devtool: 'cheap-module-source-map',
            devServer: {
                contentBase: path.join(__dirname, 'public'),
                hot: true,
                overlay: true,
            },
            plugins: [
                new webpack.HotModuleReplacementPlugin()
            ]
        }
    ])

const prodConfig = () =>
    merge([
        CORE_CONFIG,
        {
            devtool: 'source-map',
        }
    ])

module.exports = (env = process.env.NODE_ENV) =>
    env === 'production' ? prodConfig() : devConfig()
