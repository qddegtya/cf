const { BaseCommand } = ${'pkg'};

class ${'name'} extends BaseCommand {
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
