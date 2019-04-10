// eslint-disable-next-line
console.log('\033[2J')
const exec = require('child_process').exec
exec(`taskkill /f /im "wechatdevtools.exe"`, function () {
  require('./operation/clean')()
})
