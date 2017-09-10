const path = require('path')
const webpack = require('webpack')

// 设置输入和输出根目录
const ROOT_PATH = path.resolve(__dirname)
const APP_PATH = path.resolve(ROOT_PATH, 'src')
const BUILD_PATH = path.resolve(ROOT_PATH, 'chrome/scripts')

//获取环境
const env = process.env.NODE_ENV

module.exports = {
    /* source-map */
    devtool: env === 'production' ? 'hidden-source-map' : 'cheap-module-eval-source-map',
    entry: {
        app: './src/index.js'
    },
    output: {
        path: BUILD_PATH, // 编译到当前目录
        filename: 'contentscript.js',
        sourceMapFilename: 'contentscript.js.map'
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/, // 用babel编译jsx和es6
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                cacheDirectory: true,
                presets: [
                    'es2015'
                ],
                plugins: [
                    ['transform-runtime']
                ]
            }
        }]
    },
    resolve: {
        extensions: [
            '.js'
        ],
        alias: {
            'components': path.resolve(APP_PATH, './components'),
            'utils': path.resolve(APP_PATH, './utils'),
            'components': path.resolve(APP_PATH, './components'),
            'libs': path.resolve(APP_PATH, './libs')
        }
    },
    plugins: [],
    watch: env === 'development' ? true : false
}

switch (env) {
    case 'production':
        module.exports.plugins = (module.exports.plugins || []).concat([
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    drop_console: true
                },
                comments: false,
                beautify: false,
                sourceMap: false
            })
        ])
        break
}