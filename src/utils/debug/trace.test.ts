import { Debug } from '#debug'
import { Test } from '#test'
import fc from 'fast-check'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type * as Vi from 'vitest'
import { trace } from './trace.js'

export type MockDebug = Vi.Mock<Debug.Debug>

const debug = Debug.create()

const debugMock = vi.mockObject(debug)
debugMock.sub.mockReturnValue(debugMock)
debugMock.trace.mockImplementation((fn, options) => trace(debugMock, fn, options))

beforeEach(debugMock.mockReset)

describe('core functionality', () => {
  Test.property(
    'always preserves function behavior',
    fc.integer(),
    fc.boolean(),
    fc.boolean(),
    fc.boolean(),
    (input, enableInput, enableOutput, enableDuration) => {
      debugMock.mockClear()
      const fn = (x: number) => x * 2
      const traced = trace(debugMock, fn, {
        input: enableInput,
        output: enableOutput,
        duration: enableDuration,
      })

      const result = traced(input)
      expect(result).toBe(input * 2)
    },
  )

  Test.property('always logs start and end events', fc.anything(), (input) => {
    debugMock.mockClear() // property runs many times
    const fn = (x: any) => x
    const traced = trace(debugMock, fn)

    traced(input)

    expect(debugMock).toHaveBeenCalledTimes(2)
    expect(debugMock).toHaveBeenNthCalledWith(1, 'start', undefined)
    expect(debugMock).toHaveBeenNthCalledWith(2, 'end', undefined)
  })

  Test.property('logs error events when function throws', fc.string(), (errorMessage) => {
    debugMock.mockClear() // property runs many times
    const fn = () => {
      throw new Error(errorMessage)
    }
    const traced = trace(debugMock, fn)

    expect(() => traced()).toThrow(errorMessage)
    expect(debugMock).toHaveBeenCalledTimes(2)
    expect(debugMock).toHaveBeenNthCalledWith(1, 'start', undefined)
    expect(debugMock).toHaveBeenNthCalledWith(2, 'error', expect.objectContaining({ error: expect.any(Error) }))
  })
})

describe('specific features', () => {
  it('works via debug.trace method', () => {
    const traced = debugMock.trace((x: number) => x * 2)
    expect(traced(5)).toBe(10)
    expect(debugMock).toHaveBeenCalledTimes(2)
  })

  it('handles async functions and errors', async () => {
    const asyncFn = async (x?: number) => {
      await new Promise(resolve => setTimeout(resolve, 1))
      if (x === undefined) throw new Error('async error')
      return x * 2
    }
    const traced = trace(debugMock, asyncFn)

    expect(await traced(5)).toBe(10)
    expect(debugMock).toHaveBeenNthCalledWith(2, 'end', undefined)

    debugMock.mockClear()
    await expect(traced()).rejects.toThrow('async error')
    expect(debugMock).toHaveBeenNthCalledWith(2, 'error', expect.objectContaining({ error: expect.any(Error) }))
  })
})

describe('options', () => {
  it('handles all data and timing options', () => {
    const traced = trace(debugMock, (_user: { name: string; password: string }) => ({ id: 1, token: 'secret' }), {
      input: (args) => ({ name: args[0].name, password: '***' }),
      output: ['id'] as const,
      duration: true,
      count: true,
    })

    traced({ name: 'Alice', password: 'secret123' })
    traced({ name: 'Bob', password: 'secret456' })

    expect(debugMock).toHaveBeenCalledTimes(4)
    expect(debugMock).toHaveBeenNthCalledWith(1, 'start', { input: { name: 'Alice', password: '***' }, call: 1 })
    expect(debugMock).toHaveBeenNthCalledWith(2, 'end', { result: { id: 1 }, duration: expect.any(Number), call: 1 })
    expect(debugMock).toHaveBeenNthCalledWith(3, 'start', { input: { name: 'Bob', password: '***' }, call: 2 })
  })

  it('respects conditional logging and preserves context', () => {
    class Calculator {
      multiplier = 3
      multiply = trace(debugMock, (x: number) => x * this.multiplier, {
        when: (args) => args[0] > 10,
      })
    }

    const calc = new Calculator()
    expect(calc.multiply(5)).toBe(15) // Works but no logs
    expect(debugMock).not.toHaveBeenCalled()

    calc.multiply(15) // Should log
    expect(debugMock).toHaveBeenCalledTimes(2)
  })
})
