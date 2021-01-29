const BC = require('@vm/bc')

class ${'name'} extends BC {
  init (commander) {

  }

  async do () {
    await console.log('Hello World.')
  }
}

Add.command = "${'command'}"
Add.alias = "${'alias'}"
Add.description= "${'description'}"

module.exports = Add
