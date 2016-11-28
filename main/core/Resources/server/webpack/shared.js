const path = require('path')
const paths = require('./paths')
const libraries = require('./libraries')

const externals = () => ({
  'jquery': 'jQuery'
})

const aliases = () => ({
  modernizr$: path.resolve(paths.distribution(), '.modernizrrc')
})

module.exports = {
  externals,
  aliases
}
