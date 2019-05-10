const log = require('../log')

function less (contents, filePath) {
  return new Promise((resolve, reject) => {
    const less = require('less')
    less.render(contents, { filename: filePath }, (err, css) => {
      if (typeof css === 'undefined' || err) {
        console.error(err)
        reject(new Error(`Compile Error: less => css`))
      }

      resolve(css)
    })
  })
}

function sass (contents, filePath) {
  const sass = require('node-sass')
  const result = sass.renderSync({ file: filePath, data: contents })
  return result.css.toString('utf8')
}

async function autoprefixer (css) {
  const Autoprefixer = require('autoprefixer')
  const postcss = require('postcss')

  const autoprefixPlugin = new Autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  })

  ;({ css } = await postcss([autoprefixPlugin]).process(css, { from: undefined }))

  return css
}

function minify (contents) {
  const csso = require('csso')
  let { css } = csso.minify(contents)

  return css
}

module.exports = async (file, extName) => {
  const path = require('path')

  try {
    let contents = file.contents.toString('utf8')
    let filePath = path.resolve(file.path)

    switch (extName) {
      case 'less':
        ({ css: contents } = await less(contents, filePath))
        break
      case 'scss':
      case 'sass':
        contents = sass(contents, filePath)
        break

      default:
        throw new Error(`unknown file type：${extName}`)
    }

    contents = await autoprefixer(contents)
    contents = await minify(contents)

    return Buffer.from(contents)
  } catch (error) {
    log.error(path.resolve(file.path))
    log.error(error)
  }
}
