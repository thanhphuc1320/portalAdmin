const { override, useBabelRc, addWebpackPlugin } = require('customize-cra');
const webpack = require('webpack');

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin;

// module.exports = function overrides(config, env) {
//   if (env === 'production') {
//     if (!config.plugins) config.plugins = [];
//     config.plugins.push(new BundleAnalyzerPlugin({ generateStatsFile: true }));
//   }
//   return config;
// };

let buildMode = 'local';
if (process.argv.indexOf('dev') > -1) buildMode = 'development';
if (process.argv.indexOf('prod') > -1) buildMode = 'prod';
if (process.argv.indexOf('stg') > -1) buildMode = 'stg';

module.exports = override(
  useBabelRc(),
  addWebpackPlugin(
    new webpack.DefinePlugin({
      'process.env': {
        BUILD_TIME: new Date().getTime(),
        BUILD_USERNAME: `'${process.env.USERNAME}'`,
        BUILD_MODE: `'${buildMode}'`,
      },
    }),
  ),
  config => {
    if (process.env.NODE_ENV === 'production') {
      const time = new Date().getTime();
      config.output.filename = `static/js/[name]${time}.js`;
      config.output.chunkFilename = `static/js/[name]${time}.chunk.js`;
    }
    return config;
  },
);
