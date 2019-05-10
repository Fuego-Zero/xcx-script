const log = require('../log')

module.exports = async (file) => {
  try {
    let contents = file.contents.toString('utf8')
    let temp = /<(?:wxs|filter).*utils\/tools.\1.*module="(\w+)".*?\/?>/g.exec(contents)

    if (temp && contents.includes(`${temp[1]}.uploadFilePrefix(`)) {
      contents = contents + `{{${temp[1]}.setPrefix($prefix)}}`
    }

    contents = contents.replace(/>\s+</g, '><')
    contents = contents.replace(/[\r\n]/g, '')

    return Buffer.from(contents)
  } catch (error) {
    log.error(file.path, '转换出错')
    log.error(error)
  }
}
