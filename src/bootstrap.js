import defaultCli from 'commander'
import fs from 'fs'
import path from 'path'
import debugFactory from 'debug'
import { COMMANDS_STORE } from './host'
import injectCommandFromClass from './injectCommandsFromClass'

const debug = debugFactory('cf:core:bootstrap')

export default ({
  cli = defaultCli,
  root,
  version
}) => {
  debug('commands entry path: %s', root)

  // set version
  cli.version(version)

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
      injectCommandFromClass(cli, module, {
        root,
        version
      })
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
