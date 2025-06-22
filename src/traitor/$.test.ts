import { describe, expect, test } from 'vitest'
import { dispatchOrThrow } from './dispatcher.ts'
import { Registry } from './registry/$.ts'

describe('integration', () => {
  test('full flow: register and dispatch', () => {
    const registry = Registry.create()

    // Register implementations
    registry.proxy.Eq.Num = {
      is: (a: number, b: number) => a === b,
    }

    registry.proxy.Eq.Str = {
      is: (a: string, b: string) => a.toLowerCase() === b.toLowerCase(),
    }

    registry.proxy.Eq.Arr = {
      is: (a: any[], b: any[]) => {
        if (a.length !== b.length) return false
        return a.every((val, i) => dispatchOrThrow(registry.data, 'Eq', 'is', [val, b[i]]))
      },
    }

    // Test dispatching
    expect(dispatchOrThrow(registry.data, 'Eq', 'is', [42, 42])).toBe(true)
    expect(dispatchOrThrow(registry.data, 'Eq', 'is', ['Hello', 'hello'])).toBe(true)
    expect(dispatchOrThrow(registry.data, 'Eq', 'is', [[1, 2], [1, 2]])).toBe(true)
    expect(dispatchOrThrow(registry.data, 'Eq', 'is', [[1, 2], [1, 3]])).toBe(false)
  })
})
