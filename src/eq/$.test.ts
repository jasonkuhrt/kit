import { describe, expect, test } from 'vitest'
import { Eq } from './$.ts'

describe('is', () => {
  test('returns true for strictly equal values', () => {
    expect(Eq.is(5, 5)).toBe(true)
    expect(Eq.is('hello', 'hello')).toBe(true)
    expect(Eq.is(true, true)).toBe(true)
    expect(Eq.is(null, null)).toBe(true)
    expect(Eq.is(undefined, undefined)).toBe(true)
  })

  test('returns false for different values', () => {
    expect(Eq.is(5, '5')).toBe(false)
    expect(Eq.is(null, undefined)).toBe(false)
    expect(Eq.is(0, false)).toBe(false)
    expect(Eq.is(1, true)).toBe(false)
  })

  test('returns false for NaN comparison', () => {
    expect(Eq.is(NaN, NaN)).toBe(false)
  })
})

describe('isWith', () => {
  test('creates predicate function for value comparison', () => {
    const isThree = Eq.isWith(3)

    expect(isThree(3)).toBe(true)
    expect(isThree(4)).toBe(false)
    expect(isThree('3')).toBe(false)
  })

  test('works with array filtering', () => {
    const numbers = [1, 2, 3, 3, 4]
    const threes = numbers.filter(Eq.isWith(3))

    expect(threes).toEqual([3, 3])
  })
})

describe('isnt', () => {
  test('returns true for different values', () => {
    expect(Eq.isnt(5, 6)).toBe(true)
    expect(Eq.isnt('hello', 'world')).toBe(true)
    expect(Eq.isnt(5, '5')).toBe(true)
    expect(Eq.isnt(null, undefined)).toBe(true)
  })

  test('returns false for strictly equal values', () => {
    expect(Eq.isnt(5, 5)).toBe(false)
    expect(Eq.isnt('hello', 'hello')).toBe(false)
    expect(Eq.isnt(true, true)).toBe(false)
  })

  test('returns true for NaN comparison', () => {
    expect(Eq.isnt(NaN, NaN)).toBe(true)
  })
})

describe('isntWith', () => {
  test('creates predicate function for inequality comparison', () => {
    const isNotThree = Eq.isntWith(3)

    expect(isNotThree(3)).toBe(false)
    expect(isNotThree(4)).toBe(true)
    expect(isNotThree('3')).toBe(true)
  })

  test('works with array filtering', () => {
    const numbers = [1, 2, 3, 3, 4]
    const notThrees = numbers.filter(Eq.isntWith(3))

    expect(notThrees).toEqual([1, 2, 4])
  })
})

describe('isTypeWith', () => {
  test('creates type guard for specific values', () => {
    const isValueFoo = Eq.isTypeWith('foo' as const)

    const value: 'foo' | 'bar' = 'foo'
    if (isValueFoo(value)) {
      // Type should be narrowed to 'foo'
      expect(value).toBe('foo')
    }
  })
})

describe('isntTypeWith', () => {
  test('creates negated type guard for specific values', () => {
    const isNotValueFoo = Eq.isntTypeWith('foo' as const)

    const value: 'foo' | 'bar' = 'bar'
    if (isNotValueFoo(value as any)) {
      // Type should be narrowed to 'bar'
      expect(value).toBe('bar')
    }
  })
})
