const BC = require('../../lib/BaseCommand').default
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')

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
    await inquirer
      .prompt([
        {
          type: 'input',
          name: 'name',
          message: "[CF] -> command name: ",
        },
        {
          type: 'input',
          name: 'alias',
          message: "[CF] -> command alias: "
        },
        {
          type: 'input',
          name: 'description',
          message: "[CF] -> command description: "
        }
      ])
      .then(async ({ name, alias, description }) => {
        const cmdTpl = await this.loadCmdTpl()
        const result = await this.helper.tpl(cmdTpl, {
          name,
          command: name,
          alias,
          description
        });

        console.log(result)
      })
  }
}

Add.command = 'add'
Add.alias = 'a'
Add.description= 'add one command'

module.exports = Add
