const clean = require('./main/clean')
const compileMain = require('./main/compile-main')
const compileProject = require('./main/compile-project')
const watchProject = require('./main/watch-project')

const NODE_ENV = process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

async function run () {
  console.clear()

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
