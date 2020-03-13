const path = require('path');

module.exports = {
  mode: "production", 
  entry: {
    index: './client/index.js',
  },
  output: { 
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        loader: 'babel-loader',
        exclude: path.resolve(__dirname, 'node_modules'),
        query: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      }
    ]
  },
  devServer: {
    publicPath: '/build/',
    contentBase: path.join(__dirname, './client'), // path from which static file should be served. if not specified, static files will not be served.
    proxy: {
      '/listener/add': 'http://localhost:3000',
      '/listener/chart': 'http://localhost:3000',
      '/listener/runinitial': 'http://localhost:3000',
      '/series': 'http://localhost:3000',
    }
},
}