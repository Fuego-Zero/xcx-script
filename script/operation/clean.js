const del = require('del')

const conf = require('../base.conf')
const log = require('../log')

function clean () {
  return new Promise((resolve, reject) => {
    log.info('开始清理目录。')
    del.sync([`${conf.outputDir}/**`, `!${conf.outputDir}`])
    del.sync([`${conf.outputDir}`])

    setTimeout(() => {
      log.info('目录清理完毕。')
      resolve()
    }, 1000)
  })
}

module.exports = clean
