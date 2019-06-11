const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminPngquant = require('imagemin-pngquant')
const imageminMozjpeg = require('imagemin-mozjpeg')

const images = require('images')

const path = require('path')
const fs = require('fs')
const config = require('../minify.conf')

/**
 * 写入备份文件
 * @param {*} file
 * @param {*} fileRelative
 */
function writeBakFile (file, fileRelative) {
  let distPath = path.join(`${config.outputDir}`, path.dirname(fileRelative))
  fs.mkdirSync(distPath, { recursive: true })
  fs.writeFileSync(path.join(distPath, `${file.stem}.bak${file.extname}`), file.contents)
}

const MODE = process.env.MODE

module.exports = async (file) => {
  let { extname, contents, relative } = file
  let isMinify = false

  if (MODE === 'minifyImg') {
    let img = images(contents)

    if (img.width() > config.inputWidth) {
      isMinify = true
      img.size(config.outputWidth)
      writeBakFile(file, relative)
      contents = img.encode(extname.slice(1).toLowerCase())
    }
  }

  if (isMinify && MODE !== 'minifyImg') {
    contents = await imagemin.buffer(contents, {
      plugins: [
        imageminJpegtran(),
        imageminMozjpeg({
          quality: 90
        }),
        imageminPngquant({
          speed: 1,
          strip: true,
          quality: [0.6, 0.8]
        })
      ]
    })
  }

  return contents
}
