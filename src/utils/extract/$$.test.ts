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

    test('runtime behavior: calls function', () => {
      const fn = () => 'hello'
      expect(Extract.returned(fn)).toBe('hello')
    })

    test('calls function with no arguments', () => {
      const fn = (x?: number) => x ?? 'no args'
      expect(Extract.returned(fn)).toBe('no args')
    })
  })

  describe('array', () => {
    test('is a function with .kind property', () => {
      expect(typeof Extract.array).toBe('function')
      expect(Extract.array).toHaveProperty('kind')
    })

    test('runtime behavior: returns first element', () => {
      expect(Extract.array(['a', 'b', 'c'])).toBe('a')
      expect(Extract.array([1, 2, 3])).toBe(1)
    })

    test('returns undefined for empty array', () => {
      expect(Extract.array([])).toBeUndefined()
    })
  })

  describe('prop', () => {
    test('creates extractor function with .kind property', () => {
      const getName = Extract.prop('name')
      expect(typeof getName).toBe('function')
      expect(getName).toHaveProperty('kind')
    })

    test('runtime behavior: accesses property', () => {
      const getName = Extract.prop('name')
      expect(getName({ name: 'Alice', age: 30 })).toBe('Alice')
    })

    test('works with number keys', () => {
      const getFirst = Extract.prop(0)
      expect(getFirst(['a', 'b', 'c'])).toBe('a')
    })

    test('works with symbol keys', () => {
      const sym = Symbol('test')
      const getSym = Extract.prop(sym)
      expect(getSym({ [sym]: 'value' })).toBe('value')
    })

    test('returns undefined for missing property', () => {
      const getName = Extract.prop('name')
      expect(getName({})).toBeUndefined()
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
