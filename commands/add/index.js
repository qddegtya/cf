const BC = require('../../lib/BaseCommand').default
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const AJS = require('xajs')
const vfs = require('vinyl-fs')
const map = require('map-stream')
const { IF_CWD_IS_INNER_PKG } = require('../../lib/util')

const tpl = AJS.future.tpl
const MagicString = AJS.lang.MagicString
const cwd = process.cwd()

class Add extends BC {
  constructor(config) {
    super(config)

    this.cmds = []
  }

  init(commander) {
    commander
      .option('-o, --output <path>', 'output dir')
      .option('-t, --template <path>', 'tpl path')

    this.commander = commander
  }

  conflict (cmd) {
    return this.cmds.includes(cmd)
  }

  async do() {
    const { output, template } = this.commander.opts()

    if (!template) throw new Error('Must set tpl param.')
    if (!output) throw new Error('Must set output param.')

    await inquirer
      .prompt([
        {
          type: 'input',
          name: 'name',
          message: '[CF] -> command name: ',
        },
        {
          type: 'input',
          name: 'alias',
          message: '[CF] -> command alias: ',
        },
        {
          type: 'input',
          name: 'description',
          message: '[CF] -> command description: ',
        },
      ])
      .then(async ({ name, alias, description }) => {
        if (this.conflict(name)) {
          throw new Error(`Command [ ${name} ] exists.`)
        }

        if (name === alias)
          throw new Error('Command alias can\'t be the same as its name')

        vfs
          .src(
            IF_CWD_IS_INNER_PKG
              ? path.resolve(__dirname, '../../_template/cmd.tpl')
              : path.join(cwd, template)
          )
          .pipe(
            map((file, cb) => {
              file.basename = 'index.js'
              file.contents = Buffer.from(
                tpl.exec(file.contents.toString(), {
                  pkg: IF_CWD_IS_INNER_PKG
                    ? 'require("../../lib/BaseCommand").default'
                    : 'require("@atools/cf").BC',
                  name: MagicString(name).capitalize(),
                  command: name,
                  alias,
                  description,
                }),
                'utf8'
              )

              cb(null, file)
            })
          )
          .pipe(vfs.dest(path.join(cwd, output, name)))

        this.cmds.push(name)
      })
  }
}

Add.command = 'add'
Add.alias = 'a'
Add.description = 'add one command'

module.exports = Add
