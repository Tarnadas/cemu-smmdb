const webpack = require('webpack');
const path    = require('path');

module.exports = [
    {
        target: "electron",
        entry: {
            "renderer": ["babel-polyfill", path.join(__dirname, 'gui/renderer.js')]
        },
        output: {
            filename: '[name].bundle.js',
            path: path.join(__dirname, 'gui')
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    query: {
                        plugins: ["transform-react-jsx", "transform-es2015-arrow-functions", "transform-async-to-generator"]
                    }
                },
                {
                    test: /\.(png|jpg)$/,
                    loader: 'url-loader?limit=25000'
                }
            ]
        },
        plugins: [
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false
            }),
            new webpack.optimize.UglifyJsPlugin({
                beautify: false,
                mangle: {
                    keep_fnames: true
                },
                comments: false
            }),
            new webpack.EnvironmentPlugin('NODE_ENV'),
            new webpack.DefinePlugin({
                __dirname: '__dirname',
            })
        ]
    },
    {
        target: "electron",
        entry: ["babel-polyfill", path.join(__dirname, 'main.js')],
        output: {
            filename: '[name].bundle.js'
        },
        node: {
            __dirname: false,
            __filename: false
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    query: {
                        plugins: ["transform-es2015-arrow-functions", "transform-async-to-generator"]
                    }
                }
            ]
        },
        plugins: [
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false
            }),
            new webpack.optimize.UglifyJsPlugin({
                beautify: false,
                mangle: {
                    keep_fnames: true
                },
                comments: false
            }),
            new webpack.EnvironmentPlugin('NODE_ENV')
        ]
    }
];

/*module.exports = {
    target: "electron",
    entry: path.join(__dirname, 'main.js'),
    output: {
        filename: '[name].bundle.js',
        sourceMapFilename: '[name].map'
    },
    node: {
        __dirname: false,
        __filename: false
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
                keep_fnames: true
            },
            comments: false
        })
    ]
};*/