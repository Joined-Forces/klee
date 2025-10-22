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
                include: [
                    path.resolve(__dirname, 'src'), 
                    path.resolve(__dirname, 'plugins')
                ],
                use: [
                    { loader: 'ts-loader' }, 
                    { loader: 'ifdef-loader', options: ifdefOptions }, 
                ],
                exclude: [
                    /node_modules/,
                    /\.test\.ts$/,
                    /\.spec\.ts$/,
                    /\/tests?\//
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            src: path.resolve(__dirname, "src/"),
            plugins: path.resolve(__dirname, "plugins/")
        }
    },
};
