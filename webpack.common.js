const path = require('path')
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
        new HtmlWebpackPlugin({
            inject: false,
            template: require('html-webpack-template'),
            appMountId: 'root',
            title: 'Discover - semantic data sets exploratory tool'
        })
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
