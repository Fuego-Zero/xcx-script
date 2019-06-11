const clean = require('./main/clean')
const compileProject = require('./main/compile-project')

async function run () {
  console.clear()

  try {
    await clean()
    await compileProject()
  } catch (err) {
    console.error(err)
  }
}

run()
