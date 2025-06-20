import { describe, expect, test } from 'vitest'
import { Arr } from './$.ts'

describe('is', () => {
  test('returns true for arrays', () => {
    expect(Arr.is([])).toBe(true)
    expect(Arr.is([1, 2, 3])).toBe(true)
  })

  test('returns false for non-arrays', () => {
    expect(Arr.is({})).toBe(false)
    expect(Arr.is('string')).toBe(false)
    expect(Arr.is(null)).toBe(false)
    expect(Arr.is(undefined)).toBe(false)
  })
})

describe('create', () => {
  test('creates empty array when no arguments provided', () => {
    expect(Arr.create()).toEqual([])
  })
})

describe('map', () => {
  test('maps over array elements', () => {
    const result = Arr.map([1, 2, 3], x => x * 2)
    expect(result).toEqual([2, 4, 6])
  })

  test('works with empty array', () => {
    expect(Arr.map([], x => x)).toEqual([])
  })
})

describe('find', () => {
  test('finds element matching predicate', () => {
    const result = Arr.find([1, 2, 3], x => x > 2)
    expect(result).toBe(3)
  })

  test('returns undefined when no match', () => {
    const result = Arr.find([1, 2, 3], x => x > 10)
    expect(result).toBeUndefined()
  })
})

describe('join', () => {
  test('joins array elements with separator', () => {
    expect(Arr.join(['a', 'b', 'c'], ',')).toBe('a,b,c')
    expect(Arr.join([1, 2, 3], ' - ')).toBe('1 - 2 - 3')
  })
})

describe('merge', () => {
  test('merges two arrays', () => {
    const result = Arr.merge([1, 2], [3, 4])
    expect(result).toEqual([1, 2, 3, 4])
  })
})

describe('isEmpty', () => {
  test('returns true for empty arrays', () => {
    expect(Arr.isEmpty([])).toBe(true)
  })

  test('returns false for non-empty arrays', () => {
    expect(Arr.isEmpty([1])).toBe(false)
  })
})

describe('getFirst', () => {
  test('returns first element', () => {
    expect(Arr.getFirst([1, 2, 3])).toBe(1)
  })

  test('returns undefined for empty array', () => {
    expect(Arr.getFirst([])).toBeUndefined()
  })
})

describe('getLast', () => {
  test('returns last element', () => {
    expect(Arr.getLast([1, 2, 3])).toBe(3)
  })

  test('returns undefined for empty array', () => {
    expect(Arr.getLast([])).toBeUndefined()
  })
})
