/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
/* eslint-enable import/no-extraneous-dependencies */

module.exports = merge(common, {
  mode: 'dev',
  devServer: {
    host: '0.0.0.0',
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 3000,
    historyApiFallback: true,
    filename: '[chunkhash].min.js',
    https: true,
    disableHostCheck: true,
    inline: false,
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: path.join(__dirname, 'config.js') },
    ]),
  ],
});
