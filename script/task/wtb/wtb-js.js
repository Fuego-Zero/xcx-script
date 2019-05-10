const path = require('path')
const log = require('../../log')
const babylon = require('babylon')
const t = require('babel-types')
const template = require('babel-template')
const generate = require('babel-generator').default

const simpleASTNode = template(`Reflect.apply(this.pageLifetimes.show, this, [])`)()
const complexASTNode = t.objectMethod('method', { 'type': 'Identifier', 'name': 'ready' }, [], { 'type': 'BlockStatement', 'body': [simpleASTNode] })

function evil (fn) {
  let Fn = Function
  return new Fn('return ' + fn)()
}

module.exports = async (file) => {
  try {
    let contents = file.contents.toString('utf8')

    // 针对配置文件constant替换通讯配置
    if (path.basename(file.path, '.js') === 'constant') {
      contents = contents.replace(/let terminal = 'wx'/g, `let terminal = 'bd'`)
    }

    if (contents.includes('Component({')) {
      let mode
      let word = /Component\(([\s\S]*)\)/gm.exec(contents)
      let options = evil(word[1])

      if (options.ready && options.pageLifetimes && options.pageLifetimes.show) mode = 1
      if (!options.ready && options.pageLifetimes && options.pageLifetimes.show) mode = 2

      if (mode) {
        let ast = babylon.parse(contents, {
          sourceType: 'module',
          plugins: [
            'objectRestSpread'
          ]
        })

        let result = ast.program.body.find((item) => {
          if (item.type === 'ExpressionStatement' &&
          item.expression.callee.name === 'Component' &&
          item.expression.callee.type === 'Identifier') {
            return true
          }
        })

        switch (mode) {
          case 1:
            result = result.expression.arguments[0].properties.find((item) => {
              if (item.key.type === 'Identifier' && item.key.name === 'ready') return true
            })

            if (result.method) result.body.body.push(simpleASTNode)
            else result.value.body.body.push(simpleASTNode)
            break

          case 2:
            result.expression.arguments[0].properties.unshift(complexASTNode)
            break
        }

        contents = generate(ast, {}).code
      }
    }

    return Buffer.from(contents)
  } catch (error) {
    log.error(file.path, '转换出错')
    log.error(error)
  }
}
