const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js'
  },
  mode : 'development',
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './index.html', to: "index.html" },
      //import app.css to the build folder too
      { from: './app.css', to: 'app.css' }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      { test: /\.json$/, exclude: /(node_modules|bower_components)/, use: 'json-loader' },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  }
}
