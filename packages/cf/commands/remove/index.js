const { BaseCommand } = require('../../lib')

class Remove extends BaseCommand {
  init (commander) {

  }

  async do () {
    await console.log('Hello World.')
  }
}

Remove.command = 'remove'
Remove.alias = 'rm'
Remove.description= 'remove one command'

module.exports = Remove
