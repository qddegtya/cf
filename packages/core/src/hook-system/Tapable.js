class Hook {
  constructor(name) {
    this.name = name
    this.taps = []
    this.builtinTap = null
  }

  tap(fn) {
    if (typeof fn !== 'function') {
      throw new Error('Hook tap requires a function')
    }
    this.taps.push(fn)
  }

  tapBuiltin(fn) {
    if (typeof fn !== 'function') {
      throw new Error('Hook tapBuiltin requires a function')
    }
    this.builtinTap = fn
  }

  async call(...args) {
    const taps = this.taps.slice()
    
    try {
      // 执行用户注册的 hooks
      for (const tap of taps) {
        await new Promise((resolve, reject) => {
          try {
            tap(...args, () => resolve())
          } catch (error) {
            reject(error)
          }
        })
      }

      // 执行内置 hook
      if (this.builtinTap) {
        await new Promise((resolve, reject) => {
          try {
            this.builtinTap(...args, () => resolve())
          } catch (error) {
            reject(error)
          }
        })
      }
    } catch (error) {
      throw error
    }
  }
}

class SyncHook extends Hook {
  tap(fn) {
    super.tap(fn)
  }

  async call(...args) {
    const taps = this.taps.slice()
    
    try {
      // 同步执行所有 hooks
      for (const tap of taps) {
        await new Promise((resolve, reject) => {
          try {
            tap(...args, () => resolve())
          } catch (error) {
            reject(error)
          }
        })
      }
      
      // 执行内置 hook
      if (this.builtinTap) {
        await new Promise((resolve, reject) => {
          try {
            this.builtinTap(...args, () => resolve())
          } catch (error) {
            reject(error)
          }
        })
      }
    } catch (error) {
      throw error
    }
  }
}

class AsyncHook extends Hook {
  tap(fn) {
    super.tap(fn)
  }

  async call(...args) {
    const taps = this.taps.slice()
    
    // 串行执行用户的 hooks
    for (const tap of taps) {
      try {
        await new Promise((resolve, reject) => {
          const next = () => resolve()
          Promise.resolve(tap(...args, next)).catch(reject)
        })
      } catch (error) {
        throw error
      }
    }

    // 最后执行内置 hook
    if (this.builtinTap) {
      try {
        await new Promise((resolve, reject) => {
          const next = () => resolve()
          Promise.resolve(this.builtinTap(...args, next)).catch(reject)
        })
      } catch (error) {
        throw error
      }
    }
  }
}

class Tapable {
  constructor() {
    this.hooks = new Map()
  }

  createHook(name, type = 'async') {
    let hook
    
    switch (type) {
    case 'sync':
      hook = new SyncHook(name)
      break
    case 'async':
    default:
      hook = new AsyncHook(name)
    }

    this.hooks.set(name, hook)
    return hook
  }

  getHook(name) {
    // 如果 name 是 null 或 undefined，返回 undefined
    if (name == null) return undefined
    
    let hook = this.hooks.get(name)
    
    if (!hook) {
      hook = this.createHook(name)
    }

    return hook
  }

  tap(name, fn) {
    if (!name) return
    const hook = this.getHook(name)
    hook.tap(fn)
  }

  tapBuiltin(name, fn) {
    const hook = this.getHook(name)
    hook.tapBuiltin(fn)
  }

  async call(name, ...args) {
    const hook = this.getHook(name)
    if (!hook) return
    return hook.call(...args)
  }

  clear() {
    this.hooks.clear()
  }
}

export { Tapable }
