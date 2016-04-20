module.exports = {
  use: 'vue',

  webpack: function(provide, config) {
    var ExtractTextPlugin = provide.ExtractTextPlugin;
    var webpack = provide.webpack;

    config.entry = {
      'index': 'src/index.js'
    };
    config.devtool = false;
    config.output.publicPath = '';
    config.output.path = 'lib';
    config.output.filename = '[name].js';
    config.output.library = 'ElementDatePicker';
    config.output.libraryTarget = 'umd';
    config.plugins = [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        include: /\.min\.js$/,
        minimize: true,
        compress: {
          warnings: false
        }
      }),
      new webpack.optimize.OccurenceOrderPlugin(),
      new ExtractTextPlugin('style.css')
    ];
    config.externals = {
      vue: 'Vue'
    };
    return config;
  }
};
