const chalk = require('chalk')
const dateFormat = require('dateformat')

function getTime () {
  return dateFormat(new Date(), 'HH:MM:ss')
}

module.exports = {
  info: (...text) => {
    console.log(chalk.gray(`[${getTime()}][信息]`), ...text)
  },
  compile: (...text) => {
    console.log(chalk.blue(`[${getTime()}][编译]`), ...text)
  },
  error: (...text) => {
    console.log(chalk.red(`[${getTime()}][错误]`), ...text)
  },
  add: (...text) => {
    console.log(chalk.green(`[${getTime()}][新增]`), ...text)
  },
  change: (...text) => {
    console.log(chalk.yellow(`[${getTime()}][修改]`), ...text)
  },
  unlink: (...text) => {
    console.log(chalk.red(`[${getTime()}][删除]`), ...text)
  },
  dist: (...text) => {
    console.log(chalk.blue(`[${getTime()}][写入]`), ...text)
  },
  process: {
    write (text) {
      this.clean()
      process.stdout.write(chalk.cyan(`[${getTime()}][进度] `) + text)
    },
    clean () {
      process.stdout.clearLine(0)
      process.stdout.cursorTo(0)
    }
  }
}
