const path = require('path')
const Dotenv = require('dotenv-webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: [
        path.join(__dirname, 'src'),
        path.join(__dirname, 'src/styles')
    ],
    output: {
        path: path.join(__dirname, 'public/'),
        filename: "[name].js",
        devtoolModuleFilenameTemplate: 'webpack:///[resource-path]',
        library: '[name]',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff2?)$/,
                loader: 'file-loader'
            }
        ]
    },
    plugins: [
        new Dotenv({ path: './.env' }),
        new HtmlWebpackPlugin({
            inject: false,
            template: require('html-webpack-template'),
            appMountId: 'root',
            title: 'Semantic Paths - semantic datasets exploratory tool',
            links: [{
                href: 'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css',
                rel: 'stylesheet',
                type: 'text/css'
            }],
            meta: [{
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            }],
            scripts: [{
                defer: true,
                src: 'https://use.fontawesome.com/releases/v5.0.7/js/all.js'
            }]
        }),
        new CopyWebpackPlugin([
            {
                from:  path.join(__dirname, 'assets'),
                to: path.join(__dirname, 'public/')
            }
        ])
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.css']
    },
    node: {
        console: false,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
}
