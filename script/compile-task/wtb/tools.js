/**
 * 修复微信 wxs 文件模块导出语法问题 module.exports => export default
 * @param {string} contents - 需要修改的内容
 */
function changeExports (contents) {
  return contents.replace(/module.exports\s*=\s*/g, 'export default ')
}

module.exports = {
  changeExports
}
