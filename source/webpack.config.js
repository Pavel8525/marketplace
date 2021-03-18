const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const devMode = process.env.NODE_ENV !== 'production';
const dist = 'dist';

const package = require('./package.json');

// Change manifest settings
//
const manifest = require('./manifest.json');
manifest.name = package.displayName;
manifest.short_name = package.description;

module.exports = {
    entry: './src/index.tsx',
    output: {
        publicPath: '/',
        path: path.resolve(__dirname, dist),
        filename: devMode ? '[name].js' : '[name].[chunkhash].js'
    },

    devServer: {
        contentBase: path.join(__dirname, 'public'),
        liveReload: true,
        hot: true,
        open: true,
        compress: false,
        //host: '0.0.0.0',
        port: 9000,
        historyApiFallback: true
        //,writeToDisk: true
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        alias: {
            'app': path.resolve(__dirname, 'src/'),
        }
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            JSZip: 'jszip',
            'window.JSZip': 'jszip'
        }),

        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: [dist]
        }),

        /*new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: devMode ? '[name].css' : '[name].[contenthash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[contenthash].css',
        }),*/

        new HtmlWebpackPlugin({
            title: package.description,
            description: package.description,
            inject: false,
            hash: true,
            template: './index.html',
            filename: 'index.html'
        }),

        new ManifestPlugin({
            seed: require('./manifest.json')
        }),

        new CopyWebpackPlugin([
            { from: 'public', to: '' },
            { from: './src/css/themes', to: 'css/themes' },
            { from: './src/img', to: 'img' },
            { from: './src/_img', to: 'img' },
            { from: './src/js/index.js', to: 'js/index.js' },
            { from: './src/js/vendors.bundle.js', to: 'js/vendors.bundle.js' },
            { from: './src/js/app.bundle.js', to: 'js/app.bundle.js' },
            { from: './src/locales', to: 'locales' }
        ]),

        //new BundleAnalyzerPlugin()
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                },
            },
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true
                    }
                }]
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                // include: jsDir,
                // exclude: commonExcludePaths,

                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'less-loader'
                    }
                ]
            },
            {
                test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|gif|svg)$/,
                loader: 'url-loader?limit=100000'
            },
            {
                test: /\.(wav|mp3)$/,
                use: [{
                    loader: 'file-loader?name=[name].[ext]'
                }]
            }
        ]
    }
};