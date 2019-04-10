const vfs = require('vinyl-fs')
const map = require('map-stream')

const conf = require('../base.conf')
const log = require('../log')
const compileFile = require('../compile-task/compile-file')

function compileMain () {
  return new Promise((resolve, reject) => {
    log.info('开始编译入口文件。')
    vfs.src('app.json', { cwd: conf.inputDir })
      .pipe(map(compileFile))
      .pipe(vfs.dest(conf.outputDir))
      .on('finish', () => {
        log.compile('入口文件编译完毕。')
        resolve()
      })
  })
}

module.exports = compileMain
