const path = require('path');
const webpack = require('webpack');

// 设置输入和输出根目录
const ROOT_PATH = path.resolve(__dirname);
const APP_PATH = path.resolve(ROOT_PATH, 'src');
const BUILD_PATH = path.resolve(ROOT_PATH, 'chrome/scripts');

//获取环境
const env = process.env;
const isProduction = env.NODE_ENV === 'production';

module.exports = {
  /* source-map */
  devtool: isProduction ? 'hidden-source-map' : 'cheap-module-eval-source-map',
  entry: {
    app: './src/index.js'
  },
  output: {
    path: BUILD_PATH, // 编译到当前目录
    filename: 'contentscript.js',
    sourceMapFilename: 'contentscript.js.map'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // 用babel编译jsx和es6
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      components: path.resolve(APP_PATH, './components'),
      utils: path.resolve(APP_PATH, './utils'),
      libs: path.resolve(APP_PATH, './libs')
    }
  },
  plugins: [
    new webpack.DefinePlugin(
      (() => {
        const result = { 'process.env.NODE_ENV': '"development"' };
        for (let key in env) {
          if (env.hasOwnProperty(key)) {
            result['process.env.' + key] = JSON.stringify(process.env[key]);
          }
        }
        return result;
      })()
    )
  ],
  watch: !isProduction
};

switch (env.NODE_ENV) {
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
    ]);
    break;
}
