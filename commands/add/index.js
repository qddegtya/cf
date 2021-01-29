const BC = require('@vm/bc')
const fs = require('fs')
const path = require('path')

class Add extends BC {
  constructor () {
    super()

    this.tplRoot = path.join(__dirname, '../../_template/cmd.tpl')
  }

  init (commander) {

  }

  async loadCmdTpl () {
    return fs.readFileSync(this.tplRoot).toString()
  }

  async do () {
    const cmdTpl = await this.loadCmdTpl()
    const result = await this.helper.tpl(cmdTpl, {
      name: 'Add',
      command: 'add',
      alias: 'a',
      description: 'fdasfdas'
    })

    console.log(result)
  }
}

Add.command = 'add'
Add.alias = 'a'
Add.description= 'add one command'

module.exports = Add
