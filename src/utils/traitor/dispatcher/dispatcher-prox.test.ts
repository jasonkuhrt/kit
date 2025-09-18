import { describe, expect, test } from 'vitest'
import { Registry } from '../registry/$.js'
import { createTraitProxy } from './dispatcher.js'

describe('createTraitProxy with Prox domain', () => {
  test('createTraitProxy uses Prox.createCachedGetProxy correctly', () => {
    const registry = Registry.create()
    Registry.register(registry, 'TestTrait', 'Num', {
      add: (a: number, b: number) => a + b,
      multiply: (a: number, b: number) => a * b,
    })

    const TestTrait = createTraitProxy<{
      add: (a: number, b: number) => number
      multiply: (a: number, b: number) => number
    }>(registry, 'TestTrait')

    // Test that methods work correctly
    expect(TestTrait.add(2, 3)).toBe(5)
    expect(TestTrait.multiply(4, 5)).toBe(20)

    // Test that methods are cached (same reference)
    const add1 = TestTrait.add
    const add2 = TestTrait.add
    expect(add1).toBe(add2)
  })
})
