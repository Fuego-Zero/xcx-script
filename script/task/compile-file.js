const path = require('path')
const conf = require('../base.conf')
const image = require('./image')
const css = require('./css')
const html = require('./html')
const js = require('./js')
const json = require('./json')

async function compileFile (file, cb) {
  let { extname } = file
  extname = extname.slice(1).toLowerCase()

  switch (extname) {
    case 'less':
    case 'scss':
    case 'sass':
      file.contents = await css(file, extname)
      file.extname = conf.cssExtName
      break

    case 'js':
      if (path.basename(file.path).endsWith('.filter.js')) break

      file.contents = await js(file)
      break

    case 'jpg':
    case 'png':
    case 'gif':
    case 'ico':
      file.contents = await image(file)
      break

    case 'json':
      file.contents = await json(file)
      break

    case 'swan':
    case 'wxml':
      file.contents = await html(file)
      break
  }

  if ((file.contents && file.contents.length === 0)) cb()
  else cb(null, file)
}

module.exports = compileFile
