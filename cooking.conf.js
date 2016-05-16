const cooking = require('cooking');
const postcssNested = require('postcss-nested');
const isProd = process.env.NODE_ENV === 'production'

cooking.set({
  dist: './lib',
  devServer: {
    enable: !isProd
  },
  entry: isProd ? {app: './src/index.js'} : {app: './examples/entry.js'},
  // Production
  clean: true,
  hash: false,
  template: isProd ? false : './examples/index.html',
  sourceMap: true,
  extends: ['vue', 'lint']
});

var config = cooking.resolve();

config.vue.postcss = [postcssNested()];

config.vue.autoprefixer = {
  browsers: ['Android >= 4.0', 'ios > 6']
};

module.exports = config;
