const clean = require('./operation/clean')
const compileMain = require('./operation/compile-main')
const compileProject = require('./operation/compile-project')
const watchProject = require('./operation/watch-project')

const NODE_ENV = process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

async function run () {
  console.log('\033[2J');
  
  try {
    if (NODE_ENV === 'prod') await clean()
    await compileMain()
    await compileProject()
    if (NODE_ENV === 'dev') await watchProject()
  } catch (err) {
    console.error(err)
  }
}

run()
