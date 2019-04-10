const log = require('../log')

module.exports = async (file) => {
  try {
    let contents = file.contents.toString('utf8')
    contents = contents.replace(/>\s+</g, '><')
    contents = contents.replace(/[\r\n]/g, '')

    return Buffer.from(contents)
  } catch (error) {
    log.error(file.path, '转换出错')
    log.error(error)
  }
}
