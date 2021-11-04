
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const HOST = 'localhost';
const PORT = 8080;

module.exports = merge(common, {
  mode: 'development',

  devServer: {
    clientLogLevel: 'warning',
    hot: true,
    contentBase: 'dist',
    compress: true,
    host: HOST,
    port: PORT,
    open: true,
    overlay: { warnings: false, errors: true },
    publicPath: '/public',
    quiet: true,
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
        ],
      }, 
      // {
      //   test: /\.styl(us)?$/,
      //   use: [
      //     'vue-style-loader',
      //     'css-loader',
      //     'stylus-loader',
      //   ],
      // },
    ],
  },

  plugins: [
    /**  
     * With this in place you should be able to see 
     * the changes hot loaded into the page without refreshing. 
     */
    new webpack.HotModuleReplacementPlugin(),
  ],
});
