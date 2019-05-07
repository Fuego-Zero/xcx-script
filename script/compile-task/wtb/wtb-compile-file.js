const css = require('./wtb-css')
const html = require('./wtb-html')
const wxs = require('./wtb-wxs')
const json = require('./wtb-json')
const js = require('./wtb-js')

async function compileFile (file, cb) {
  let { extname } = file
  extname = extname.slice(1).toLowerCase()

  switch (extname) {
    case 'less':
    case 'scss':
    case 'sass':
      file.contents = await css(file)
      break

    case 'js':
      file.contents = await js(file)
      break

    case 'wxml':
    case 'swan':
      file.contents = await html(file)
      break

    case 'wxs':
      file.contents = await wxs(file)
      file.extname = '.filter.js'
      break

    case 'json':
      file.contents = await json(file)
      break
  }

  cb(null, file)
}

module.exports = compileFile
