const { BaseCommand } = require('../../lib')

class Ui extends BaseCommand {
  init (commander) {

  }

  async do () {
    await console.log('Hello World.')
  }
}

Ui.command = 'ui'
Ui.alias = 'u'
Ui.description= 'start cf webui'

module.exports = Ui
