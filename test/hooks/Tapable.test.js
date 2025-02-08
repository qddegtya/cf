import { Tapable } from '../../src/hooks/Tapable'

describe('Tapable', () => {
  let tapable

  beforeEach(() => {
    tapable = new Tapable()
  })

  describe('tap', () => {
    it('should register a hook handler', () => {
      const handler = jest.fn()
      tapable.tap('test', handler)
      expect(tapable.getHook('test').taps).toHaveLength(1)
      expect(tapable.getHook('test').taps[0]).toBe(handler)
    })

    it('should not register if name is not provided', () => {
      const handler = jest.fn()
      tapable.tap(null, handler)
      expect(tapable.hooks.get(null)).toBeUndefined()
    })
  })

  describe('tapBuiltin', () => {
    it('should register a builtin hook', () => {
      const handler = jest.fn()
      tapable.tapBuiltin('test', handler)
      expect(tapable.getHook('test').builtinTap).toBe(handler)
    })

    it('should throw if handler is not a function', () => {
      expect(() => tapable.tapBuiltin('test', 'not a function'))
        .toThrow('Hook tapBuiltin requires a function')
    })
  })

  describe('call', () => {
    it('should execute hooks in sequence', async () => {
      const sequence = []
      
      tapable.tap('test', async (next) => {
        sequence.push(1)
        await next()
      })

      tapable.tap('test', async (next) => {
        sequence.push(2)
        await next()
      })

      tapable.tap('test', async (next) => {
        sequence.push(3)
        await next()
      })

      await tapable.call('test')
      expect(sequence).toEqual([1, 2, 3])
    })

    it('should execute builtin hook after all user hooks', async () => {
      const sequence = []
      
      tapable.tap('test', async (next) => {
        sequence.push(1)
        await next()
      })

      tapable.tapBuiltin('test', async (next) => {
        sequence.push('builtin')
        await next()
      })

      await tapable.call('test')
      expect(sequence).toEqual([1, 'builtin'])
    })

    it('should execute builtin hook even without user hooks', async () => {
      const sequence = []
      
      tapable.tapBuiltin('test', async (next) => {
        sequence.push('builtin')
        await next()
      })

      await tapable.call('test')
      expect(sequence).toEqual(['builtin'])
    })

    it('should handle async operations', async () => {
      const sequence = []
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
      
      tapable.tap('test', async (next) => {
        sequence.push(1)
        await delay(1)
        await next()
      })

      tapable.tapBuiltin('test', async (next) => {
        sequence.push(2)
        await next()
      })

      await tapable.call('test')
      expect(sequence).toEqual([1, 2])
    })

    it('should handle errors in hooks', async () => {
      const error = new Error('Test error')
      
      tapable.tap('test', async () => {
        throw error
      })

      await expect(tapable.call('test')).rejects.toThrow(error)
    })

    it('should handle errors in builtin hooks', async () => {
      const error = new Error('Builtin error')
      
      tapable.tapBuiltin('test', async () => {
        throw error
      })

      await expect(tapable.call('test')).rejects.toThrow(error)
    })

    it('should do nothing if hook name does not exist', async () => {
      const result = await tapable.call('nonexistent')
      expect(result).toBeUndefined()
    })
  })
})
