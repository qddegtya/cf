const BC = require("../../lib/BaseCommand").default;

class King2 extends BC {
  init (commander) {

  }

  async do () {
    await console.log('Hello World.')
  }
}

King2.command = "king2"
King2.alias = "k2"
King2.description= "king2"

module.exports = King2
