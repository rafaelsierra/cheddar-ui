import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import webpack from 'webpack';

let CSSExtractor = new ExtractTextPlugin('dist/stylesheets/cheddar.[hash].css');

module.exports = {
  entry: './src/js/cheddar.js',
  output: {
    filename: 'cheddar.[hash].js',
    path: './dist'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        loader: CSSExtractor.extract(['css', 'less']),
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: CSSExtractor.extract(['css']),
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html'
    }),
    CSSExtractor,
  ]
}
