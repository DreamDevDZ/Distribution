const paths = require('./main/core/Resources/server/webpack/paths')
const entries = require('./main/core/Resources/server/webpack/entries')
const shared = require('./main/core/Resources/server/webpack/shared')
const plugins = require('./main/core/Resources/server/webpack/plugins')
const loaders = require('./main/core/Resources/server/webpack/loaders')
const libraries = require('./main/core/Resources/server/webpack/libraries')

if (process.env.NODE_ENV !== 'production') {
  throw new Error('Production builds must have NODE_ENV=production')
}

module.exports = {
  entry: Object.assign(entries.collectEntries(), libraries),
  output: {
    path: paths.output(),
    filename: '[name]-[hash].js'
  },
  resolve: {
    root: paths.bower(),
    alias: shared.aliases()
  },
  plugins: [
    plugins.assetsInfoFile(),
    plugins.bowerFileLookup(),
    plugins.distributionShortcut(),
    plugins.defineProdEnv(),
    plugins.libChunks(),
    plugins.dedupeModules(),
    plugins.rejectBuildErrors(),
    plugins.exitWithErrorCode(),
    plugins.clarolineConfiguration(),
    plugins.configShortcut()
  ],
  module: {
    loaders: [
      loaders.babel(),
      loaders.font(),
      loaders.rawHtml(),
      loaders.jqueryUiNoAmd(),
      loaders.css(),
      loaders.imageUris(),
      loaders.modernizr()
    ]
  },
  externals: shared.externals(),
  devtool: false
}
