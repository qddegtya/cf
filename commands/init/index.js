const BC = require("../../lib/BaseCommand").default;

class Init extends BC {
  init (commander) {

  }

  async do () {
    await console.log('Hello World.')
  }
}

Init.command = "init"
Init.alias = "i"
Init.description= "cf initializer"

module.exports = Init
