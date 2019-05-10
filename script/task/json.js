const jsonminify = require('jsonminify')

module.exports = (file) => {
  return new Promise((resolve, reject) => {
    let json = jsonminify(file.contents.toString('utf8'))
    resolve(Buffer.from(json))
  })
}
