
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const utils = require('./utils');

module.exports = {
  // Entry point of the app
  entry: {
    app: './public/index.js'
  },
  // // Resolve
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      // Add alias on this folder if you don't want to use ../../../
      // assets: utils.resolve('assets'),
    },
  },

  // Modules
  module: {
    rules: [
      // {
      //   test: /\.(js|vue)$/,
      //   use: 'eslint-loader',
      //   enforce: 'pre',
      // },
      {
        test: /\.pug$/,
        use: 'pug-loader',
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      }, 
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('img/[name].[hash:7].[ext]'),
          },
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('media/[name].[hash:7].[ext]'),
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
          },
        },
      },
    ],
  },

  // Optimization
  optimization: {
    // runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      // maxInitialRequests: Infinity,
      // minSize: 0,
      cacheGroups: {
        // vendor: {
        //   test: /[\\/]node_modules[\\/]/,
        //   name(module) {
        //     // get the name. E.g. node_modules/packageName/not/this/part.js
        //     // or node_modules/packageName
        //     const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
        //     // npm package names are URL-safe, but some servers don't like @ symbols
        //     return `npm.${packageName.replace('@', '')}`;
        //   },
        //   priority: -10
        // },
        commons: {
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5, // The default limit is too small to showcase the effect
          minSize: 0, // This is example is too small to create commons chunks
        },
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10,
          enforce: true,
        },
      },
    },
  },

  // Where to output the build app
  output: {
    filename: '[name].bundle.js',
    publicPath: '/build/',
    path: utils.resolve('public/build'),
  },

  // Plugins
  plugins: [
    // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),

    // new HtmlWebpackPlugin({
    //   filename: '../views/home.pug'
    // }),
    // // copy assets folder to access file from html or as http request
    // new CopyWebpackPlugin([{
    //   from: './public/views',
    //   to: utils.resolve('/test'),
    // }]),
  ],

};
