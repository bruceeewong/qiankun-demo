const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const collectSubappQiankunConfs = require('./scripts/qiankun-confs-collector')
/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'index.js'),
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
    port: 3000,
  },
  plugins: [
    new webpack.DefinePlugin({
      WEBPACK_QIANKUN_SUBAPP_CONFIGS: JSON.stringify(collectSubappQiankunConfs()),
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
    }),
  ]
}