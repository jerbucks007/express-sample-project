'use strict'

const path = require('path')

module.exports = {
  mode: 'development',
  bail: true,
  devtool: 'cheap-module-eval-source-map',
  entry: {
    app: './public/lobby.js'
  },
  output: {
    path: path.join(__dirname, 'public/build'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    },
    ]
  },
  resolve: {

    extensions: ['*', '.js', '.json'],
    modules: [path.join(__dirname, 'public'), 'node_modules']
  },
  plugins: [
  ]
};
