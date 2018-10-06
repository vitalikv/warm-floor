var path = require('path')
var webpack = require('webpack')
var NpmInstallPlugin = require('npm-install-webpack-plugin')
var UglifyJSPlugin = require('uglifyjs-webpack-plugin')

var config = {
  // devtool: 'source-map',
  entry: [
    'babel-polyfill',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/frontend/dist/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    })
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        include: [
          path.resolve(__dirname, 'src'),
        ]
      },
      {
        test: /\.js$/,
        loaders: ['react-hot-loader', 'babel-loader'],
        exclude: /node_modules/,
        include: [
          path.resolve(__dirname, 'src'),
        ]
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png)([\?]?.*)$/,
        loader: 'file-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      }

    ]
  }
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin()
  )
  config.output.publicPath = './frontend/dist/'
} else {
  config.devtool = "#cheap-module-source-map"
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );
  config.entry.push('webpack-hot-middleware/client');
}

module.exports = config;