const fs = require('fs')
const path = require('path')
const cwd = process.cwd()

function readPackageJson(pkgPath) {
  return JSON.parse(fs.readFileSync(path.resolve(pkgPath)).toString())
}

const IF_CWD_IS_INNER_PKG = readPackageJson(path.join(cwd, 'package.json')).name === '@atools/cf'

export { IF_CWD_IS_INNER_PKG, readPackageJson }
