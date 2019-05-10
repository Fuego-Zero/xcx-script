const vfs = require('vinyl-fs')
const map = require('map-stream')
const del = require('del')
const path = require('path')
const fs = require('fs')

const conf = require('../base.conf')
const log = require('../log')
const compileFile = require('../task/compile-file')

function watchProject () {
  return new Promise((resolve, reject) => {
    const chokidar = require('chokidar')
    let ready = false

    chokidar.watch('**/**', { cwd: conf.inputDir })
      .on('all', function (event, filePath) {
        if (!ready) return

        let extName = (path.extname(filePath) + '    ').slice(1, 5).toUpperCase()
        filePath = filePath.replace(conf.inputDir, '')

        switch (event) {
          case 'add':
          case 'change':
            if (event === 'add') {
              log.add(extName, ':', filePath)
            } else {
              log.change(extName, ':', filePath)
            }

            vfs.src(filePath, { cwd: conf.inputDir })
              .pipe(map(compileFile))
              .pipe(vfs.dest(conf.outputDir))
              .on('finish', () => {
                log.dist(extName, ':', filePath)
              })
            break

          case 'unlink':
            let dirPath = path.join(conf.outputDir, path.dirname(filePath))
            del.sync(path.join(conf.outputDir, filePath))
            log.unlink(extName, ':', filePath)
            fs.readdirSync(dirPath).length === 0 && del.sync(dirPath)
            break
        }
      })
      .on('ready', function () {
        log.info('开始监听文件变动。')
        ready = true
      })
  })
}

module.exports = watchProject
