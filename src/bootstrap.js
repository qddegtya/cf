import defaultCli from 'commander'
import fs from 'fs'
import path from 'path'
import debugFactory from 'debug'
import { COMMANDS_STORE } from './host'
import injectCommandFromClass from './injectCommandsFromClass'

const VM_NAME = '@vm/bc'

const debug = debugFactory('cf:core:bootstrap')

export default ({
  cli = defaultCli,
  root,
  version
}) => {
  debug('commands entry path: %s', root)

  // set version
  cli.version(version)

  // load base command virtual module
  const BASE_COMMAND_PATH = path.resolve(__dirname, './BaseCommand.js')

  // patch require
  module.constructor.prototype.require = (id) => {
    if (id === VM_NAME) return module.require(BASE_COMMAND_PATH).default
    return module.constructor._load(id, module)
  }

  // inject commands
  const modules = fs.readdirSync(root)
      .map((moduleEntry) => {
        let modulePath = path.join(root, moduleEntry)
        debug('command module loaded: %s', modulePath)
        return module.require(modulePath)
      })
    , mods = modules.slice()

  while(module = mods.pop()) {
    try {
      injectCommandFromClass(cli, module)
    } catch(err) {
      debug(`inject process fail: ${err}`)
      break
    }
  }
  
  if (COMMANDS_STORE.length === modules.length)
    debug('all commands have been inject.')
  
  // start parse
  cli.parse(process.argv)
}
