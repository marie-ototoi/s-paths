const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

const CORE_CONFIG = {
    entry: {
        discover: path.join(__dirname, 'src/discover'),
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
        rules: [
            { test: /\.(jsx|js)?/, loader: 'babel-loader', exclude: /node_modules/, options: { presets: ['react', 'env'] } },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({ fallback: "style-loader", use: "css-loader" })
            },
            { test: /\.(eot|svg|ttf|woff|woff2)$/, loader: 'file-loader?name=fonts/[name].[ext]' }
        ]
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new ExtractTextPlugin("styles/discover.css")
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
            plugins: [
                new CopyWebpackPlugin([{ from: path.join(__dirname, 'src/index.html'), to: path.join(__dirname, 'public/index.html') }]),
                new webpack.DefinePlugin({ 'process.env': { NODE_ENV: '"production"' } }),
                new webpack.LoaderOptionsPlugin({ minimize: true, debug: false }),
                new webpack.optimize.UglifyJsPlugin({ sourceMap: true })
            ]
        }
    ])

module.exports = (env = process.env.NODE_ENV) => 
    (env === 'production') ? prodConfig() : devConfig()