var path = require('path')
var webpack = require('webpack')

var config = {
  // devtool: 'source-map',
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/ugol/dist/'
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
        loaders: ['react-hot-loader/webpack', 'babel-loader'],
        exclude: /node_modules/,
        include: [
          path.resolve(__dirname, 'src'),
        ]
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)([\?]?.*)$/,
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
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        comparisons: false,
      },
      mangle: {
        safari10: true,
      },        
      output: {
        comments: false,
        ascii_only: true,
      },
      sourceMap: false,
    })
  )
  config.output.publicPath = './ugol/dist/'
} else {
  config.devtool = '#cheap-module-source-map'
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );
  config.entry.push('webpack-hot-middleware/client');
}

module.exports = config;