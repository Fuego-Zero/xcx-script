let vfs = require('vinyl-fs')
let map = require('map-stream')
let TransformStream = require('stream').Transform
let log = require('../log')

let baseConf = require('../base.conf')
let compileFile = require('../compile-task/compile-file')

let wtdConf = require('../wtb.conf')
let wtdCompileFile = require('../compile-task/wtb/wtb-compile-file')

let totalFileNumber = 0
let current = 0

function process () {
  let stream = new TransformStream({ objectMode: true })

  stream._transform = function (file, unused, callback) {
    current++
    log.process.write(`${current}/${totalFileNumber} (${(current / totalFileNumber * 100).toFixed(2)}%)`)
    this.push(file)
    callback()
  }

  return stream
}

function count () {
  let stream = new TransformStream({ objectMode: true })

  stream._transform = function (file, unused, callback) {
    totalFileNumber++
    this.push(null)
    callback()
  }

  return stream
}

function collectFileCount (conf) {
  return new Promise((resolve, reject) => {
    vfs.src(conf.fileSrc, { cwd: conf.inputDir, read: false })
      .pipe(count())
      .on('finish', () => {
        resolve()
      })
  })
}

function compileProject (type = 1) {
  return new Promise(async (resolve, reject) => {
    let compile, conf

    switch (type) {
      case 1:
        compile = compileFile
        conf = baseConf
        break
      case 2:
        compile = wtdCompileFile
        conf = wtdConf
        break
    }

    await collectFileCount(conf)

    log.info('开始编译项目文件。')
    vfs.src(conf.fileSrc, { cwd: conf.inputDir })
      .pipe(map(compile))
      .pipe(process())
      .pipe(vfs.dest(conf.outputDir))
      .on('finish', () => {
        log.process.clean()
        log.compile('项目文件编译完毕。')
        resolve()
      })
  })
}

module.exports = compileProject
