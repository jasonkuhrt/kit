import { describe, expect, test } from 'vitest'
import { dispatchOrThrow } from './dispatcher.ts'
import { Registry } from './registry/$.ts'

describe('dispatchOrThrow', () => {
  test('dispatches to correct implementation', () => {
    const registry = Registry.create()
    Registry.register(registry.data, 'Eq', 'Num', {
      is: (a: number, b: number) => a === b,
    })

    const result = dispatchOrThrow(registry.data, 'Eq', 'is', [42, 42])
    expect(result).toBe(true)

    const result2 = dispatchOrThrow(registry.data, 'Eq', 'is', [42, 43])
    expect(result2).toBe(false)
  })

  test('uses first argument to determine domain', () => {
    const registry = Registry.create()
    let calledWith: string | null = null

    Registry.register(registry.data, 'Test', 'Str', {
      method: (s: string) => {
        calledWith = 'Str'
        return s
      },
    })
    Registry.register(registry.data, 'Test', 'Num', {
      method: (n: number) => {
        calledWith = 'Num'
        return n
      },
    })

    dispatchOrThrow(registry.data, 'Test', 'method', ['hello'])
    expect(calledWith).toBe('Str')

    dispatchOrThrow(registry.data, 'Test', 'method', [42])
    expect(calledWith).toBe('Num')
  })

  test('passes all arguments to implementation', () => {
    const registry = Registry.create()
    let receivedArgs: any[] = []

    Registry.register(registry.data, 'Test', 'Arr', {
      concat: (...args: any[]) => {
        receivedArgs = args
        return args[0].concat(...args.slice(1))
      },
    })

    const result = dispatchOrThrow(registry.data, 'Test', 'concat', [[1], [2], [3]])
    expect(receivedArgs).toEqual([[1], [2], [3]])
    expect(result).toEqual([1, 2, 3])
  })

  test('supports this context', () => {
    const registry = Registry.create()
    const context = { multiplier: 10 }

    Registry.register(registry.data, 'Test', 'Num', {
      multiply: function(this: typeof context, n: number) {
        return n * this.multiplier
      },
    })

    const result = dispatchOrThrow(registry.data, 'Test', 'multiply', [5], context)
    expect(result).toBe(50)
  })

  test('throws for non-existent trait', () => {
    const registry = Registry.create()

    expect(() => dispatchOrThrow(registry.data, 'NonExistent', 'method', [42])).toThrow(
      'Trait "NonExistent" not found in registry',
    )
  })

  test('throws for non-registered domain', () => {
    const registry = Registry.create()
    Registry.register(registry.data, 'Eq', 'Str', { is: () => true })

    expect(() => dispatchOrThrow(registry.data, 'Eq', 'is', [42]) // Number, not String
    ).toThrow('Domain "Num" not registered for trait "Eq"')
  })

  test('throws for non-existent method', () => {
    const registry = Registry.create()
    Registry.register(registry.data, 'Eq', 'Num', { is: () => true })

    expect(() => dispatchOrThrow(registry.data, 'Eq', 'compare', [42, 43])).toThrow(
      'Method "compare" not found for domain "Num" in trait "Eq"',
    )
  })
})
