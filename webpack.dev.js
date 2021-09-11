const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        filename: 'klee.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'Klee',
        libraryTarget: "umd",
    }
});
