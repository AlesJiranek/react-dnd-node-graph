var path = require('path')
var webpack = require('webpack')

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'babel' ],
        exclude: /node_modules/,
        include: __dirname
      }
    ]
  }
}


var rdngSrc = path.join(__dirname, '..', '..', 'src')
var rdngNodeModules = path.join(__dirname, '..', '..', 'node_modules')
var fs = require('fs')
if (fs.existsSync(rdngSrc) && fs.existsSync(rdngNodeModules)) {
  module.exports.resolve = { alias: { 'react-dnd-node-graph': rdngSrc, 'react': path.join(__dirname, 'node_modules/', 'react') } }
  module.exports.module.loaders.push({
    test: /\.js$/,
    loaders: [ 'babel' ],
    include: rdngSrc
  })
}
