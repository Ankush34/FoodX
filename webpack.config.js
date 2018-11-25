
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const outputDirectory = 'dist';

module.exports = {
  entry: 
  {
   dashboard:  './src/client/dashboard.js',
   orders: './src/client/orders.js',
   edit: './src/client/edit.js'
  },
  output: {
    path: path.join(__dirname, outputDirectory),
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
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  devServer: {
    port: 3000,
    open: true,
    hot: true,
    disableHostCheck: true,
    historyApiFallback: {
      index: 'dashboard.html'
    }
  },
  plugins: [
    // new CleanWebpackPlugin([outputDirectory]), 
  ]
};
