const babel = require('babel-core')
const path = require('path')
const fs = require('fs')

const log = require('../log')
const notCompile = require('../base.conf').notCompile

const REGENERATOR_RUNTIME_PATH = 'src/npm/regenerator-runtime.js'

function headerPrefixer (file, filePath) {
  if (file.code.includes(`require('babel-runtime/regenerator');`)) {
    let relative = path.relative(filePath, REGENERATOR_RUNTIME_PATH).slice(3).replace(/\\/g, '/')

    if (relative.length > 0) {
      file.code = file.code.replace(/require\('babel-runtime\/regenerator'\);/g, `require('${relative}');`)
    }
  }
}

function setMaps (file, fileRelative) {
  return new Promise((resolve, reject) => {
    let mapName = file.map.file + '.map'
    let mapPath = 'dist/' + path.dirname(fileRelative)
    file.code = file.code + `\n//# sourceMappingURL=${mapName}`

    fs.mkdirSync(mapPath, { recursive: true })
    fs.writeFileSync(path.join(mapPath, mapName), Buffer.from(JSON.stringify(file.map)))

    resolve()
  })
}

const NODE_ENV = process.env.NODE_ENV || 'dev'

module.exports = async (file) => {
  try {
    let filePath = file.path
    let fileRelative = file.relative

    let opt = !notCompile.js.includes(path.basename(filePath))
      ? {
        minified: true,
        comments: false
      }
      : {}

    if (NODE_ENV === 'dev') {
      opt.sourceMap = true
    }

    file = babel.transformFileSync(filePath, opt)

    if (NODE_ENV === 'dev') {
      await setMaps(file, fileRelative)
    }

    headerPrefixer(file, filePath)

    return Buffer.from(file.code)
  } catch (error) {
    log.error(error)
  }
}
