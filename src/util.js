const fs = require('fs')
const path = require('path')
const cwd = process.cwd()

function readMyPackageJson() {
  return JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'package.json')).toString())
}

function isInnerPackage() {
  try {
    const cwdPackageJsonPath = path.join(cwd, 'package.json')
    if (!fs.existsSync(cwdPackageJsonPath)) {
      return false
    }
    return JSON.parse(fs.readFileSync(cwdPackageJsonPath).toString())
      .name === readMyPackageJson().name
  } catch (e) {
    return false
  }
}

export { isInnerPackage, readMyPackageJson }
