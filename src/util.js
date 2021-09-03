const fs = require('fs')
const path = require('path')
const cwd = process.cwd()

const IF_CWD_IS_INNER_PKG =
  JSON.parse(fs.readFileSync(path.join(cwd, 'package.json')).toString())
    .name === '@atools/cf'

export { IF_CWD_IS_INNER_PKG }
