const { BaseCommand } = require('../../lib')

class Init extends BaseCommand {
  init (commander) {

  }

  async do () {
    await console.log('Hello World.')
  }
}

Init.command = 'init'
Init.alias = 'i'
Init.description= 'cf initializer'

module.exports = Init
