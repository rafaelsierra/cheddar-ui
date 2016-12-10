import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import webpack from 'webpack';

let CSSExtractor = new ExtractTextPlugin('dist/stylesheets/cheddar.[hash].css');

module.exports = {
  entry: [
    './src/js/cheddar.js',
  ],
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
      { test: /\.hbs$/, loader: "handlebars-loader" },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      API_ROOT_URL: JSON.stringify(process.env.API_ROOT_URL || 'http://localhost:8000/v1/'),
    }),
    new webpack.ProvidePlugin({
      'Promise': 'imports?this=>global!exports?global.Promise!es6-promise',
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch',
    }),
    CSSExtractor,
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html'
    }),
  ]
}
