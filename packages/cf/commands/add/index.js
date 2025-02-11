const { BaseCommand } = require('../../lib')
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const AJS = require('xajs')
const vfs = require('vinyl-fs')
const map = require('map-stream')
const { isInnerPackage } = require('../../lib/util')

const tpl = AJS.future.tpl
const MagicString = AJS.lang.MagicString
const cwd = process.cwd()
const DEFAULT_TEMPLATE = path.join(__dirname, '../../_template/cmd.tpl')
const DEFAULT_OUTPUT = 'commands'

class Add extends BaseCommand {
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
    let { output = DEFAULT_OUTPUT, template } = this.commander.opts()
    
    // 如果是 cf 框架内部，使用相对路径
    if (isInnerPackage()) {
      template = template || '../../_template/cmd.tpl'
      const templatePath = path.join(__dirname, template)
      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template not found at: ${templatePath}`)
      }
      template = templatePath
    } else {
      // 外部包使用默认模板
      template = template || DEFAULT_TEMPLATE
      if (!fs.existsSync(template)) {
        throw new Error(`Template not found at: ${template}`)
      }
    }

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
          .src(template)
          .pipe(
            map((file, cb) => {
              file.basename = 'index.js'
              file.contents = Buffer.from(
                tpl.exec(file.contents.toString(), {
                  pkg: isInnerPackage()
                    ? 'require("../../lib")'
                    : 'require("@atools/cf-core")',
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
