const paths = require('./main/core/Resources/server/webpack/paths')
const entries = require('./main/core/Resources/server/webpack/entries')
const shared = require('./main/core/Resources/server/webpack/shared')
const plugins = require('./main/core/Resources/server/webpack/plugins')
const loaders = require('./main/core/Resources/server/webpack/loaders')
const libraries = require('./main/core/Resources/server/webpack/libraries')

module.exports = {
  entry: Object.assign(entries.collectEntries(), libraries),
  output: {
    path: paths.output(),
    publicPath: 'http://localhost:8080/dist',
    filename: '[name].js'
  },
  resolve: {
    root: paths.bower(),
    alias: shared.aliases()
},
  plugins: [
    plugins.assetsInfoFile(),
    plugins.bowerFileLookup(),
    plugins.distributionShortcut(),
    plugins.clarolineConfiguration(),
    plugins.configShortcut(),
    plugins.libChunks()
  ],
  module: {
    loaders: [
      loaders.css(),
      loaders.font(),
      loaders.babel(),
      //loaders.loadConfig(),
      loaders.rawHtml(),
      loaders.jqueryUiNoAmd(),
      loaders.imageUris(),
      loaders.modernizr()
    ]
  },
  externals: shared.externals(),
  devtool: 'eval',
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}
