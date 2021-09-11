const path = require('path');

const ifdefOptions = {
    DEBUG_UI: false
}

module.exports = {
    mode: 'development',
    entry: './src/klee.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    { loader: 'ts-loader' }, 
                    { loader: 'ifdef-loader', options: ifdefOptions }, 
                ],
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'klee.min.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'Klee',
        libraryTarget: "umd",
    }
};