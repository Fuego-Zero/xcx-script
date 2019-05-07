const fs = require('fs')
const path = require('path')
const log = require('./log')
const conf = require('./base.conf')

fs.copyFile(
  path.resolve(__dirname, '..', 'project.swan.json'),
  path.resolve(__dirname, '..', conf.outputDir, 'project.swan.json'),
  (err) => {
    if (err) {
      log.error(err)
    }
    log.compile('配置文件安装完成。')
  }
)
