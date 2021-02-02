const BC = require("../../lib/BaseCommand").default;

class Ui extends BC {
  init (commander) {

  }

  async do () {
    await console.log('Hello World.')
  }
}

Ui.command = "ui"
Ui.alias = "ui"
Ui.description= "start cf webui"

module.exports = Ui
