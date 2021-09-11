const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    optimization: {
        minimizer: [ new UglifyJsPlugin() ],
    },
    output: {
        filename: 'klee.min.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'Klee',
        libraryTarget: "umd",
    }
});
