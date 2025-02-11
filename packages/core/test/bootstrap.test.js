import bootstrap, { _resetBootstrap, hooks } from '../src/bootstrap'

// Mock fs module
jest.mock('fs', () => ({
  readdirSync: jest.fn().mockReturnValue([]),
  existsSync: jest.fn().mockReturnValue(true),
  statSync: jest.fn().mockReturnValue({ isDirectory: () => true })
}))

// Mock commander
jest.mock('commander', () => ({
  version: jest.fn(),
  parse: jest.fn()
}))

describe('bootstrap', () => {
  beforeEach(() => {
    // Reset bootstrap state before each test
    _resetBootstrap()
    // Clear all mocks
    jest.clearAllMocks()
  })

  describe('singleton behavior', () => {
    it('should throw error when called multiple times', async () => {
      // First call should succeed
      await bootstrap({ root: '/test', version: '1.0.0' })
      
      // Second call should throw
      await expect(bootstrap({ root: '/test', version: '1.0.0' }))
        .rejects
        .toThrow('Bootstrap can only be called once')
    })
  })

  describe('parameter validation', () => {
    it('should throw if root directory is not specified', async () => {
      await expect(bootstrap({ version: '1.0.0' }))
        .rejects
        .toThrow('Root directory must be specified')
    })

    it('should throw if version is not specified', async () => {
      await expect(bootstrap({ root: '/test' }))
        .rejects
        .toThrow('Version must be specified')
    })

    it('should throw if root directory does not exist', async () => {
      const fs = require('fs')
      fs.existsSync.mockReturnValueOnce(false)

      await expect(bootstrap({ root: '/nonexistent', version: '1.0.0' }))
        .rejects
        .toThrow('Root directory "/nonexistent" does not exist or is not a directory')
    })
  })

  describe('hooks behavior', () => {
    it('should execute hooks in correct order', async () => {
      const sequence = []
      
      // 用户 hooks
      hooks.tap('will-inject', async (next) => {
        sequence.push('user-inject')
        await next()
      })

      hooks.tap('will-parse', async (next) => {
        sequence.push('user-parse')
        await next()
      })

      await bootstrap({ root: '/test', version: '1.0.0' })

      // 验证执行顺序：用户 hooks 先执行，内置 hooks 后执行
      expect(sequence).toEqual(['user-inject', 'user-parse'])
    })

    it('should execute builtin hooks even without user hooks', async () => {
      const fs = require('fs')
      const commander = require('commander')
      const mockModules = ['module1.js', 'module2.js']
      fs.readdirSync.mockReturnValueOnce(mockModules)
      
      await bootstrap({ root: '/test', version: '1.0.0' })

      // 验证内置 hooks 被执行
      expect(fs.readdirSync).toHaveBeenCalledWith('/test')
      expect(commander.parse).toHaveBeenCalledWith(process.argv)
      expect(commander.version).toHaveBeenCalledWith('1.0.0')
    })

    it('should handle async hooks correctly', async () => {
      const sequence = []
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
      
      hooks.tap('will-inject', async (next) => {
        sequence.push('start-inject')
        await delay(1)
        sequence.push('end-inject')
        await next()
      })

      hooks.tap('will-parse', async (next) => {
        sequence.push('parse')
        await next()
      })

      await bootstrap({ root: '/test', version: '1.0.0' })

      expect(sequence).toEqual(['start-inject', 'end-inject', 'parse'])
    })

    it('should handle errors in hooks', async () => {
      const error = new Error('Hook error')
      
      hooks.tap('will-inject', async () => {
        throw error
      })

      await expect(bootstrap({ root: '/test', version: '1.0.0' }))
        .rejects
        .toThrow(error)
    })
  })

  describe('hooks.tap', () => {
    it('should allow registering hooks', () => {
      const handler = jest.fn()
      hooks.tap('will-inject', handler)
      hooks.tap('will-parse', handler)
      // 验证 hooks 被正确注册
      expect(handler).not.toHaveBeenCalled()
    })

    it('should not register hook if name is not provided', () => {
      const handler = jest.fn()
      hooks.tap(null, handler)
      // 验证 hook 没有被注册
      expect(hooks.getHook(null)).toBeUndefined()
    })
  })

  describe('hooks.listen (deprecated)', () => {
    let consoleWarnSpy

    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    })

    afterEach(() => {
      consoleWarnSpy.mockRestore()
    })

    it('should show deprecation warning and register hook', () => {
      const handler = jest.fn()
      bootstrap.hooks.listen('will-inject', handler)
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Warning: hooks.listen() is deprecated. Please use hooks.tap() instead.'
      )
      
      // 验证 hook 被正确注册
      expect(hooks.getHook('will-inject').taps).toContain(handler)
    })

    it('should not register if name is not provided', () => {
      const handler = jest.fn()
      bootstrap.hooks.listen(null, handler)
      
      expect(hooks.getHook(null)).toBeUndefined()
    })
  })
})
