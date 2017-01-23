var webpack = require('webpack');

module.exports = {

  entry: {
    app: ['webpack/hot/dev-server', './js/app.js']
  },

  // config.node = {
  //   console: 'empty',
  //   fs: 'empty',
  //   net: 'empty',
  //   tls: 'empty'
  // }

  // node: {
  //   net: "empty",
  //   fs: "empty"
  // },


  output: {
    path: './public/built',
    filename: 'bundle.js',
    publicPath: 'http://localhost:8080/built/'
  },

  devServer: {
    contentBase: './public',
    publicPath: 'http://localhost:8080/built/'
  },

  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel',
        // exclude: /node_modules/,
        query: {
          presets: ['react','es2015','stage-1']
        }
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader'}
    ],
  },

  devtool: 'eval',
      resolve: {
          extensions: ['', '.js', '.jsx'],
          modulesDirectories: ['src', 'node_modules']
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(new RegExp("^(fs|ipc)$"))
  ],

  target: 'node'
}
