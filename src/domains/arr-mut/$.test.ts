import { describe, expect, test } from 'vitest'
import { ArrMut } from './$.ts'

describe('Type.is', () => {
  test('returns true for arrays', () => {
    expect(ArrMut.Type.is([])).toBe(true)
    expect(ArrMut.Type.is([1, 2, 3])).toBe(true)
  })

  test('returns false for non-arrays', () => {
    expect(ArrMut.Type.is({})).toBe(false)
    expect(ArrMut.Type.is('string')).toBe(false)
    expect(ArrMut.Type.is(null)).toBe(false)
    expect(ArrMut.Type.is(undefined)).toBe(false)
  })
})

describe('create', () => {
  test('creates empty array when no arguments provided', () => {
    expect(ArrMut.create()).toEqual([])
  })
})

describe('map', () => {
  test('maps over array elements', () => {
    const result = ArrMut.map([1, 2, 3], x => x * 2)
    expect(result).toEqual([2, 4, 6])
  })

  test('works with empty array', () => {
    expect(ArrMut.map([], x => x)).toEqual([])
  })
})

describe('find', () => {
  test('finds element matching predicate', () => {
    const result = ArrMut.find([1, 2, 3], x => x > 2)
    expect(result).toBe(3)
  })

  test('returns undefined when no match', () => {
    const result = ArrMut.find([1, 2, 3], x => x > 10)
    expect(result).toBeUndefined()
  })
})

describe('join', () => {
  test('joins array elements with separator', () => {
    expect(ArrMut.join(['a', 'b', 'c'], ',')).toBe('a,b,c')
    expect(ArrMut.join([1, 2, 3], ' - ')).toBe('1 - 2 - 3')
  })
})

describe('merge', () => {
  test('merges two arrays', () => {
    const result = ArrMut.merge([1, 2], [3, 4])
    expect(result).toEqual([1, 2, 3, 4])
  })
})

describe('isEmpty', () => {
  test('returns true for empty arrays', () => {
    expect(ArrMut.isEmpty([])).toBe(true)
  })

  test('returns false for non-empty arrays', () => {
    expect(ArrMut.isEmpty([1])).toBe(false)
  })
})

describe('getFirst', () => {
  test('returns first element', () => {
    expect(ArrMut.getFirst([1, 2, 3])).toBe(1)
  })

  test('returns undefined for empty array', () => {
    expect(ArrMut.getFirst([])).toBeUndefined()
  })
})

describe('getLast', () => {
  test('returns last element', () => {
    expect(ArrMut.getLast([1, 2, 3])).toBe(3)
  })

  test('returns undefined for empty array', () => {
    expect(ArrMut.getLast([])).toBeUndefined()
  })
})
