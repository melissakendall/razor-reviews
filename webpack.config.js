var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: './src/js/script.js',
	output: {
		path: './public/js',
		filename: 'app.bundle.js'
	},
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    colors: true,
    historyApiFallback: true,
    inline: true
  },
  plugins: [
      new HtmlWebpackPlugin({
        filename: '../index.html',
        template: 'src/index.html'
      }),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js', Infinity),

      // expose the environment to the front end
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
  ]
}
