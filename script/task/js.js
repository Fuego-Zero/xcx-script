const babel = require('babel-core')
const path = require('path')
const fs = require('fs')

const log = require('../log')
const baseConf = require('../base.conf')
// const notCompile = baseConf.notCompile
const outputDir = baseConf.outputDir

/**
 * 修复regeneratorRuntime模块路径的问题
 * @param {*} file
 * @param {*} filePath
 */
function fixRegeneratorPath (file, filePath) {
  if (!file.code.includes(`require('babel-runtime/regenerator');`)) return file
  let relative = path.relative(filePath, 'src/npm/regenerator-runtime.js').slice(3).replace(/\\/g, '/')

  if (relative.length === 0) return file

  if (!relative.startsWith('.'))relative = `./${relative}`
  file.code = file.code.replace(/require\('babel-runtime\/regenerator'\);/g, `require('${relative}');`)

  return file
}

/**
 * 写入sourceMap文件
 * @param {*} file
 * @param {*} fileRelative
 */
function writeSourceMap (file, fileRelative) {
  let mapName = file.map.file + '.map'
  let mapPath = `${outputDir}/` + path.dirname(fileRelative)
  file.code += `\n//# sourceMappingURL=${mapName}`

  fs.mkdirSync(mapPath, { recursive: true })
  fs.writeFileSync(path.join(mapPath, mapName), Buffer.from(JSON.stringify(file.map)))
}

/**
 * 修复文件从根部直接引用
 * @param {*} file
 */
function fixRootRequirePath (file) {
  file.code = file.code.replace(/require\('(\w+)'\);/g, `require('./$1');`)
  return file
}

const NODE_ENV = process.env.NODE_ENV || 'dev'

module.exports = async (file) => {
  try {
    let filePath = file.path
    let fileRelative = file.relative

    // let opt = !notCompile.js.includes(path.basename(filePath))
    //   ? {
    //     minified: true,
    //     comments: false
    //   }
    //   : {}

    let opt = {
      minified: true,
      comments: false
    }

    if (NODE_ENV === 'dev') opt.sourceMap = true

    file = babel.transformFileSync(filePath, opt)

    if (NODE_ENV === 'dev') writeSourceMap(file, fileRelative)

    file = fixRootRequirePath(file)
    file = fixRegeneratorPath(file, filePath)

    return Buffer.from(file.code)
  } catch (error) {
    log.error(error)
  }
}
