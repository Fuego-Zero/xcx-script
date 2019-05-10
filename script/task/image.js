const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminPngquant = require('imagemin-pngquant')
const imageminMozjpeg = require('imagemin-mozjpeg')

module.exports = async (file) => {
  let files = await imagemin.buffer(file.contents, {
    plugins: [
      imageminJpegtran(),
      imageminMozjpeg({
        quality: 20
      }),
      imageminPngquant({
        speed: 1,
        strip: true,
        quality: [0.6, 0.8]
      })
    ]
  })

  return files
}
