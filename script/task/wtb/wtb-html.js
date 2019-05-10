let log = require('../../log')
let tools = require('./tools')

module.exports = async (file) => {
  try {
    let contents = file.contents.toString('utf8')

    contents = contents.replace(/wx[:|-]if=/g, `s-if=`)

    // contents = contents.replace(/<image(([\s\S])*?)\/(image)?>/g, (word) => {
    //   if (word.includes('src=') && word.includes('.uploadFilePrefix(')) {
    //     word = word.replace(/((?:style|src)=)"(.*?)"/g, (word, ...str) => {
    //       str[1] = str[1].replace(/'/g, '"')
    //       return `${str[0]}'${str[1]}'`
    //     })
    //   }

    //   return word
    // })

    // contents = contents.replace(/<view.*?uploadFilePrefix.*?>/g, (word) => {
    //   word = word.replace(/(style=)"(.*?)"/g, (t, ...str) => {
    //     str[1] = str[1].replace(/'/g, '"')
    //     return `${str[0]}'${str[1]}'`
    //   })

    //   word = word.replace(/(style=)'(.*?)'/g, (str) => {
    //     return str.replace(/[^"]({{.*?uploadFilePrefix.*?}})[^"]/g, `("$1")`)
    //   })

    //   return word
    // })

    // 修复wxs标签名称不对的问题 wxs => filter
    contents = contents.replace(/(<\/?)wxs(>)?/g, '$1filter$2')

    // 修复wxs引入的问题，需要把 wxs => filter
    contents = contents.replace(/<filter.*src=".*\.wxs".*\/(filter)?>/g, (word) => {
      return word.replace(/\.wxs"/, '.filter.js"')
    })

    contents = tools.changeExports(contents)

    // 修复icon组件的 type 不一致的问题， type="circle" => type="radioUnselect”
    contents = contents.replace(/(<icon.*?)type="circle"(.*?\/>)/g, `$1type="radioUnselect"$2`)

    return Buffer.from(contents)
  } catch (error) {
    log.error(error)
  }
}
