const BC = require("../../lib/BaseCommand").default;

class ${'name'} extends BC {
  init (commander) {

  }

  async do () {
    await console.log('Hello World.')
  }
}

${'name'}.command = "${'command'}"
${'name'}.alias = "${'alias'}"
${'name'}.description= "${'description'}"

module.exports = ${'name'}
