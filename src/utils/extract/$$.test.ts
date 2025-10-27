import { Test } from '#test'
import { describe, expect, test } from 'vitest'
import * as Extract from './$$.js'

describe('Extract', () => {
  describe('awaited', () => {
    test('is a function with .kind property', () => {
      expect(typeof Extract.awaited).toBe('function')
      expect(Extract.awaited).toHaveProperty('kind')
    })

    test('runtime behavior: identity function', () => {
      const promise = Promise.resolve(42)
      expect(Extract.awaited(promise)).toBe(promise)
    })
  })

  describe('returned', () => {
    test('is a function with .kind property', () => {
      expect(typeof Extract.returned).toBe('function')
      expect(Extract.returned).toHaveProperty('kind')
    })

    Test.describe('returned > runtime behavior')
      .on(Extract.returned)
      .cases(
        [[() => 'hello'], 'hello'],
        [[() => 42], 42],
        [[(x?: number) => x ?? 'no args'], 'no args'],
      )
      .test()
  })

  describe('array', () => {
    test('is a function with .kind property', () => {
      expect(typeof Extract.array).toBe('function')
      expect(Extract.array).toHaveProperty('kind')
    })

    Test.describe('array > runtime behavior')
      .on(Extract.array)
      .cases(
        [[['a', 'b', 'c']], 'a'],
        [[[1, 2, 3]], 1],
        [[[]], undefined],
      )
      .test()
  })

  describe('prop', () => {
    test('creates extractor function with .kind property', () => {
      const getName = Extract.prop('name')
      expect(typeof getName).toBe('function')
      expect(getName).toHaveProperty('kind')
    })

    Test.describe('prop > string key')
      .on(Extract.prop('name'))
      .cases(
        [[{ name: 'Alice', age: 30 }], 'Alice'],
        [[{}], undefined],
      )
      .test()

    Test.describe('prop > number key')
      .on(Extract.prop(0))
      .cases(
        [[['a', 'b', 'c']], 'a'],
        [[[1, 2, 3]], 1],
      )
      .test()

    test('works with symbol keys', () => {
      const sym = Symbol('test')
      const getSym = Extract.prop(sym)
      expect(getSym({ [sym]: 'value' })).toBe('value')
    })
  })

  describe('parameter extractors (type-only)', () => {
    test('parameter1 has .kind property', () => {
      expect(Extract.parameter1).toHaveProperty('kind')
    })

    test('parameter1 is not callable', () => {
      expect(typeof Extract.parameter1).not.toBe('function')
    })

    test('parameter2 has .kind property', () => {
      expect(Extract.parameter2).toHaveProperty('kind')
    })

    test('parameter3 has .kind property', () => {
      expect(Extract.parameter3).toHaveProperty('kind')
    })

    test('parameter4 has .kind property', () => {
      expect(Extract.parameter4).toHaveProperty('kind')
    })

    test('parameter5 has .kind property', () => {
      expect(Extract.parameter5).toHaveProperty('kind')
    })
  })
})
