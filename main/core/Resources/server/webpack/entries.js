//TODO rename name with entries at metadata.webpack[key]

const fs = require('fs')
const paths = require('./paths')

/**
 * Creates an "entry" map containing all the entries declared in claroline
 * packages "assets.json" manifests. Entries are automatically prefixed to
 * avoid name collisions across bundles.
 */
function collectEntries(key) {
  const packages = collectPackages(paths.root(), key)
  const webpackPackages = packages.filter(def => def.assets && def.assets.webpack)
  const packageNames = webpackPackages.map(def => def.name)
  const normalizedPackages = normalizeNames(webpackPackages)
  var entries = extractEntries(normalizedPackages, key)

  if (key === 'common') {
       entries = addBundleConfigEntry(entries)
  }

  return entries
}

/**
 * Collects information about currently installed
 * claroline packages. Each package will be represented
 * as an object literal with the following attributes:
 *
 *  - name:      name of the package declared in its composer.json file
 *  - path:      path of the package source directory
 *  - assets:    package assets config declared its assets.json file, if any
 */
function collectPackages(rootDir, key) {
  const stats = fs.statSync(rootDir)

  if (!stats.isDirectory()) {
    throw new Error(`${rootDir} is not a directory`)
  }

  return getPackageDefinitions(rootDir, key)
}

function addBundleConfigEntry(entries) {
  entries['bundle-configs'] = [paths.root() + '/web/dist/plugins-config']

  return entries
}

/**
 * Merges "entry" sections of package configs into one object,
 * prefixing entry names and paths with package names/paths.
 */
function extractEntries(packages, key) {
    return packages
      .filter(def => def.assets.webpack && def.assets.webpack[key])
      .reduce((entries, def) => {
        Object.keys(def.assets.webpack[key]).forEach(entry => {
          var isArray = Array.isArray(def.assets.webpack[key][entry].name)
          if (isArray) {
              el = []
              def.assets.webpack[key][entry].name.forEach(lib => {
                 el.push(`${def.assets.webpack[key][entry].prefix}/Resources/modules/${lib}`)
             })


          } else {
              el = `${def.assets.webpack[key][entry].prefix}/Resources/modules/${def.assets.webpack[key][entry].name}`
          }

          entries[`${def.name}-${def.assets.webpack[key][entry].dir}-${entry}`] = el
        })

        return entries
      }, {})
}

/**
 * Removes the "bundle" portion of package names and replaces
 * slashes by hyphens. Example:
 *
 * "foo/bar-bundle" -> "foo-bar"
 */
function normalizeNames(packages) {
  return packages.map(def => {
    def.name = normalizeName(def.name)
    return def
  })
}

function normalizeName(name) {
  var parts = name.split(/\/|\-/)

  if (parts[parts.length - 1] === 'bundle') {
    parts.pop()
  }

  name = parts.join('-')

  return name
}

function getPackageDefinitions(rootDir, key) {
  const file = `${rootDir}/vendor/composer/installed.json`
  var data

  try {
    data = fs.readFileSync(file, 'utf8')
  } catch (err) {
    throw new Error('Cannot found package info (composer/installed.json)')
  }

  const packages = JSON.parse(data)

  if (!(packages instanceof Array) || packages.length < 1) {
    throw new Error('Cannot find packages in composer/installed.json')
  }

  const filteredPackages = packages.filter(def => def.type === 'claroline-core' || def.type === 'claroline-plugin'
  )

  return filteredPackages.map(extractPackageInfo(rootDir, key))
}

function extractPackageInfo(rootDir, key) {
  return def => {
    const targetDir = def['target-dir'] ? `/${def['target-dir']}` : ''
    const path = `${rootDir}/vendor/${def.name}${targetDir}`
    const newDef = {
      name: def.name,
      path,
      assets: false,
      meta: false
    }
    var data
    if (isMetaPackage(path)) {
      assets = getMetaEntries(path, key)
      newDef.assets = assets
      newDef.meta = true
    } else {
      try {
        data = fs.readFileSync(`${path}/assets.json`, 'utf8')
        newDef.assets = JSON.parse(data)
      } catch (err) {}
    }

    return newDef
  }
}

function getMetaEntries(targetDir, key) {
  var data
  var metadata = { webpack: { entry: {}, common: {} } }

  getMetaBundles(targetDir).forEach(bundle => {
    if (fs.existsSync(`${bundle}/assets.json`)) {
      data = JSON.parse(fs.readFileSync(`${bundle}/assets.json`, 'utf8'))
      if (data.webpack[key]) {
          Object.keys(data.webpack[key]).forEach(entry => {

            var parts = bundle.split('/')
            var bundleName = parts.pop()
            var lastDir = parts[parts.length - 1]
            metadata.webpack[key][`${bundleName}-${entry}`] = {
              name: data.webpack[key][entry],
              prefix: bundle,
              dir: lastDir,
              bundle: bundleName
            }

          })
      }
    }
  })


  return metadata
}

function getMetaBundles(targetDir) {
  var bundles = []
  const src = ['main', 'plugin']

  src.filter(dir => fs.existsSync(targetDir + '/' + dir)).forEach(el => {
    var dir = targetDir + '/' + el
    bundles = bundles.concat(fs.readdirSync(dir).map(el => {
      return dir + '/' + el}))
  })

  return bundles
}

function isMetaPackage(rootDir) {
  return fs.existsSync(rootDir + '/main')
}

module.exports = {
  collectEntries,
  collectPackages,
  isMetaPackage,
  getMetaBundles,
  normalizeName
}
