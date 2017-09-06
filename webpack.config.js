const path = require('path')
const webpack = require('webpack')

// 设置输入和输出根目录
const ROOT_PATH = path.resolve(__dirname)
const APP_PATH = path.resolve(ROOT_PATH, 'src')
const BUILD_PATH = path.resolve(ROOT_PATH, 'chrome/scripts')

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: {
        app: './src/test.js'
    },
    output: {
        path: BUILD_PATH, // 编译到当前目录
        filename: 'contentscript.js'
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
            'utils': path.resolve(APP_PATH, './utils')
        }
    },
    plugins: [

    ],
    watch: true
}