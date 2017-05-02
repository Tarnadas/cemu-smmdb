const webpack = require('webpack');
const path    = require('path');

module.exports = [
    {
        target: "electron",
        entry: {
            "renderer": path.join(__dirname, 'gui/renderer.js')
        },
        output: {
            filename: '[name].bundle.js',
            path: path.join(__dirname, 'gui'),
            //sourceMapFilename: '[name].map'
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    query: {
                        plugins: ["transform-react-jsx"]
                    }
                },
                {
                    test: /\.(png|jpg)$/,
                    loader: 'url-loader?limit=25000'
                }
            ]
        },
        plugins: [
            new webpack.EnvironmentPlugin('NODE_ENV')
        ]
    },
    {
        target: "electron",
        entry: path.join(__dirname, 'main.js'),
        output: {
            filename: '[name].bundle.js',
            //sourceMapFilename: '[name].map'
        },
        node: {
            __dirname: false,
            __filename: false
        },
        plugins: [
            new webpack.EnvironmentPlugin('NODE_ENV')
        ]
    }
];