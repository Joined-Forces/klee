const path = require('path');

const ifdefOptions = {
    DEBUG_UI: false
}

module.exports = {
    entry: './src/klee.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: path.resolve(__dirname, 'src'),
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
};
