import commander from 'commander'
import fs from 'fs'
import path from 'path'
import debugFactory from 'debug'
import injectCommandFromClass from './__internal__/injectCommandsFromClass'
import { Tapable } from './hook-system/Tapable'

const debug = debugFactory('cf:core:bootstrap')

// 创建一个新的 Tapable 实例
export const hooks = new Tapable()

// 用于跟踪 bootstrap 是否已经执行
let isBootstrapped = false

// 用于测试的重置函数
export const _resetBootstrap = () => {
  isBootstrapped = false
  hooks.hooks.clear()
}

/**
 * Bootstrap the CLI application
 * @param {Object} options Configuration options
 * @param {string} options.root Root directory for command discovery
 * @param {string} options.version CLI version
 * @throws {Error} If bootstrap is called more than once
 * @throws {Error} If required parameters are missing
 */
const bootstrap = async ({ root, version }) => {
  // 参数验证
  if (!root || typeof root !== 'string') {
    throw new Error('Root directory must be specified')
  }
  if (!version || typeof version !== 'string') {
    throw new Error('Version must be specified')
  }
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    throw new Error(`Root directory "${root}" does not exist or is not a directory`)
  }

  // 防止多次执行
  if (isBootstrapped) {
    throw new Error('Bootstrap can only be called once')
  }

  // 设置版本
  commander.version(version)

  const parse = async (next) => {
    commander.parse(process.argv)
    await next()
  }

  const inject = async (next) => {
    debug('commands entry path: %s', root)

    try {
      // inject commands
      const modules = fs.readdirSync(root).map((moduleEntry) => {
        let modulePath = path.join(root, moduleEntry)
        debug('command module loaded: %s', modulePath)
        try {
          return require(modulePath).default || require(modulePath)
        } catch (err) {
          debug(`Failed to load module ${modulePath}: ${err}`)
          return null
        }
      }).filter(Boolean)
      
      const mods = modules.slice()

      while ((module = mods.pop())) {
        try {
          injectCommandFromClass(commander, module, {
            root,
            version,
          })
        } catch (err) {
          debug(`inject process fail: ${err}`)
          throw err
        }
      }

      debug('all commands have been inject.')
      await next()
    } catch (error) {
      debug('Fatal error during command injection: %O', error)
      throw error
    }
  }

  // 注册内置 hooks - 确保它们在用户 hooks 之后执行
  hooks.tapBuiltin('will-inject', inject)
  hooks.tapBuiltin('will-parse', parse)

  try {
    // 执行 hook chains
    await hooks.call('will-inject')
    await hooks.call('will-parse')
    
    // 标记为已执行
    isBootstrapped = true
  } catch (error) {
    debug('Bootstrap failed: %O', error)
    throw error
  }
}

bootstrap.hooks = {
  /**
   * @deprecated Use tap() instead. This method will be removed in future versions.
   */
  listen(name, handler = (next) => next()) {
    console.warn('Warning: hooks.listen() is deprecated. Please use hooks.tap() instead.')
    if (!name) return
    this.tap(name, handler)
  },

  /**
   * Register a hook handler
   * @param {string} name - Hook name
   * @param {Function} handler - Hook handler function
   */
  tap(name, handler = (next) => next()) {
    if (!name) return
    hooks.tap(name, handler)
  }
}

export default bootstrap
