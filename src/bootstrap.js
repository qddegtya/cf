import defaultCli from 'commander'
import fs from 'fs'
import path from 'path'
import debugFactory from 'debug'
import { COMMANDS_STORE } from './host'
import injectCommandFromClass from './injectCommandsFromClass'
import { functional } from 'xajs'

const { Puber, Suber } = functional.helper.PS
const debug = debugFactory('cf:core:bootstrap')

const tap = new Puber('cf-tap')
const hook = new Suber('cf-hook')
tap.addSuber(hook)

let _hooked
tap.emit = (msg, payload) => {
  _hooked && tap.pub(msg, payload)
}

const bootstrap = ({ cli = defaultCli, root, version }) => {
  // set version
  cli.version(version)

  const thunkParse = () => {
    // start parse
    cli.parse(process.argv)
  }

  const thunkInject = () => {
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

    if (COMMANDS_STORE.length === modules.length)
      debug('all commands have been inject.')

    _hooked ? tap.emit('will-parse', thunkParse) : thunkParse()
  }

  _hooked ? tap.emit('will-inject', thunkInject) : thunkInject()
}

bootstrap.hooks = {
  _defaultHandler: async (next) => await next(),
  get _defaultListeners() {
    return {
      'will-inject': this._defaultHandler,
      'will-parse': this._defaultHandler,
    }
  },

  listen(n, h) {
    if (!n) return
    _hooked = true
    const listeners = { ...this._defaultListeners, ...{ [n]: h } }
    hook.rss(
      tap,
      Object.keys(listeners).map((k) => {
        return {
          msg: k,
          handler: listeners[k],
        }
      })
    )
  },
}

export default bootstrap
