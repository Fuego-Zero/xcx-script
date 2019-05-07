const log = require('../../log')

module.exports = async (file) => {
  try {
    let contents = file.contents.toString('utf8')

    // #region 默认标签添加swan前缀

    // contents = contents.replace(/(^|[^-.#])view([^-])/g, `$1swan-view$2`)
    // contents = contents.replace(/(^|[^-.#])input([^-])/g, `$1swan-input$2`)
    // contents = contents.replace(/(^|[^-.#])text([^-])/g, `$1swan-text$2`)
    // contents = contents.replace(/(^|[^-.#:/])image([^-])/g, `$1swan-image$2`)

    // #endregion

    return Buffer.from(contents)
  } catch (error) {
    log.error(error)
  }
}
