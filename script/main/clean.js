const del = require('del')

const baseConf = require('../base.conf')
const log = require('../log')

function clean (conf = baseConf) {
  return new Promise((resolve, reject) => {
    log.info('开始清理目录。')

    ;(function exec () {
      try {
        del.sync([`${conf.outputDir}/**`, `!${conf.outputDir}`])
        del.sync([`${conf.outputDir}`])
      } catch (error) {
        exec()
      }
    })()

    log.info('目录清理完毕。')
    resolve()
  })
}

module.exports = clean
