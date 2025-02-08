const fs = require('fs')
const path = require('path')
const cwd = process.cwd()

function readMyPackageJson() {
  return JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'package.json')).toString())
}

const IF_CWD_IS_INNER_PKG =
  JSON.parse(fs.readFileSync(path.join(cwd, 'package.json')).toString())
    .name === readMyPackageJson().name

export { IF_CWD_IS_INNER_PKG, readMyPackageJson }
