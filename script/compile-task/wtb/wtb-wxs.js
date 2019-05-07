let log = require('../../log')
let tools = require('./tools')

module.exports = async (file) => {
  try {
    let contents = file.contents.toString('utf8')
    // 修复微信 wxs 文件独有方法 getRegExp 不兼容问题 getRegExp => RegExp
    contents = contents.replace(/(^|[\s\S])getRegExp(\(.+?\))/g, `$1RegExp$2`)

    contents = tools.changeExports(contents)

    return Buffer.from(contents)
  } catch (error) {
    log.error(file.path, '转换出错')
    log.error(error)
  }
}
