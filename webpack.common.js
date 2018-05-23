const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
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
            {
                test: /\.(jsx?)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: { presets: ['react', 'env'] }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff2?)$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: 'styles/discover.css' })
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
