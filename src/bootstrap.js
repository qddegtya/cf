import defaultCli from 'commander'
import fs from 'fs'
import path from 'path'
import debugFactory from 'debug'
import injectCommandFromClass from './injectCommandsFromClass'
import { functional } from 'xajs'

const { Puber, Suber } = functional.helper.PS
const debug = debugFactory('cf:core:bootstrap')

const tap = new Puber('cf-tap')

let isHooked = (n) => {
  const subers = Object.keys(tap._subers)
  return subers.indexOf(n) >= 0
}

tap.emit = (msg, payload) => {
  isHooked(msg) && tap.pub(msg, payload)
}

const bootstrap = ({ cli = defaultCli, root, version }) => {
  // set version
  cli.version(version)

  const tapHook = (name, next) => {
    isHooked(name) ? tap.emit(name, next) : next()
  }

  const parse = () => {
    // start parse
    cli.parse(process.argv)
  }

  const inject = () => {
    debug('commands entry path: %s', root)

    // inject commands
    const modules = fs.readdirSync(root).map((moduleEntry) => {
        let modulePath = path.join(root, moduleEntry)
        debug('command module loaded: %s', modulePath)
        return module.require(modulePath).default || module.require(modulePath)
      }),
      mods = modules.slice()

    while ((module = mods.pop())) {
      try {
        injectCommandFromClass(cli, module, {
          root,
          version,
        })
      } catch (err) {
        debug(`inject process fail: ${err}`)
        break
      }
    }

    debug('all commands have been inject.')
    tapHook('will-parse', parse)
  }

  tapHook('will-inject', inject)
}

bootstrap.hooks = {
  listen(n, h = (next) => next()) {
    if (!n) return

    const hook = new Suber(n)
    tap.addSuber(hook)

    hook.rss(tap, [
      {
        msg: n,
        handler: h,
      },
    ])
  },
}

export default bootstrap
