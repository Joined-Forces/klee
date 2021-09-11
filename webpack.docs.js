const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        open: true,
        watchFiles: ['docs/**/*'],
        static: [
            {
                directory: path.join(__dirname, 'docs'),
                watch: true
            },
        ]
    }
});
