const vfs = require('vinyl-fs')
const map = require('map-stream')

const conf = require('../base.conf')
const log = require('../log')
const compileFile = require('../compile-task/compile-file')

function compileProject () {
  return new Promise((resolve, reject) => {
    log.info('开始编译项目文件。')
    vfs.src('**/**', { cwd: conf.inputDir })
      .pipe(map(compileFile))
      .pipe(vfs.dest(conf.outputDir))
      .on('finish', () => {
        log.compile('项目文件编译完毕。')
        resolve()
      })
  })
}

module.exports = compileProject
