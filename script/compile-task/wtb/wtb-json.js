const log = require('../../log')

module.exports = async (file) => {
  try {
    let contents = file.contents.toString('utf8')

    // 移除首页路径
    if (file.path.endsWith('\\app.json')) {
      contents = contents.replace(/.*"pages\/index\/index",[\n|\r]*/g, '')
    }

    return Buffer.from(contents)
  } catch (error) {
    log.error(file.path, '转换出错')
    log.error(error)
  }
}
