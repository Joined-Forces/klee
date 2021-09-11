const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        open: true,
        watchFiles: ['test', 'src'],
        compress: true,
        static: [
            {
                directory: path.join(__dirname, 'test'),
                serveIndex: true,
            },
        ]
    },
    output: {
        filename: 'klee.js',
        path: path.resolve(__dirname, 'test'),
        library: 'Klee',
        libraryTarget: "umd",
    }
});
