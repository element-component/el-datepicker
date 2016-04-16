module.exports = {
  use: 'vue',

  webpack: function(provide, config) {
    var HtmlWebpackPlugin = provide.HtmlWebpackPlugin;

    config.nodeServer = true;
    config.port = 8101;
    config.entry = { app: 'examples/entry.js' };

    config.stats = {
      children: false
    };

    config.devServer = {
      stats: 'errors-only'
    };

    config.plugins = (config.plugins || []).concat([
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'examples/index.html',
        inject: true
      })
    ]);

    return config;
  }
};
