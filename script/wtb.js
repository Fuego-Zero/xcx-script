const clean = require('./main/clean')
const conf = require('./wtb.conf')
const compileProject = require('./main/compile-project')

// const NODE_ENV = process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

async function run () {
  console.clear()

  try {
    await clean(conf)
    await compileProject(2)
  } catch (err) {
    console.error(err)
  }
}

run()
