import { describe, expect, it } from 'vitest'
import { Whole } from './$.ts'

describe('isWhole', () => {
  it('returns true for non-negative integers', () => {
    expect(Whole.is(0)).toBe(true)
    expect(Whole.is(1)).toBe(true)
    expect(Whole.is(100)).toBe(true)
    expect(Whole.is(Number.MAX_SAFE_INTEGER)).toBe(true)
  })

  it('returns false for negative numbers', () => {
    expect(Whole.is(-1)).toBe(false)
    expect(Whole.is(-100)).toBe(false)
  })

  it('returns false for non-integers', () => {
    expect(Whole.is(1.5)).toBe(false)
    expect(Whole.is(0.1)).toBe(false)
    expect(Whole.is(Math.PI)).toBe(false)
  })

  it('returns false for special values', () => {
    expect(Whole.is(Infinity)).toBe(false)
    expect(Whole.is(-Infinity)).toBe(false)
    expect(Whole.is(NaN)).toBe(false)
  })

  it('returns false for non-numbers', () => {
    expect(Whole.is('1')).toBe(false)
    expect(Whole.is(null)).toBe(false)
    expect(Whole.is(undefined)).toBe(false)
    expect(Whole.is({})).toBe(false)
  })
})

describe('whole', () => {
  it('returns value for non-negative integers', () => {
    expect(Whole.from(0)).toBe(0)
    expect(Whole.from(1)).toBe(1)
    expect(Whole.from(100)).toBe(100)
  })

  it('throws for negative numbers', () => {
    expect(() => Whole.from(-1)).toThrow('Value must be non-negative')
  })

  it('throws for non-integers', () => {
    expect(() => Whole.from(1.5)).toThrow('Value must be an integer')
  })
})

describe('tryWhole', () => {
  it('returns value for non-negative integers', () => {
    expect(Whole.tryFrom(0)).toBe(0)
    expect(Whole.tryFrom(1)).toBe(1)
    expect(Whole.tryFrom(100)).toBe(100)
  })

  it('returns null for invalid values', () => {
    expect(Whole.tryFrom(-1)).toBe(null)
    expect(Whole.tryFrom(1.5)).toBe(null)
  })
})

describe('parseAsWhole', () => {
  it('parses valid whole number strings', () => {
    expect(Whole.parseAsWhole('0')).toBe(0)
    expect(Whole.parseAsWhole('1')).toBe(1)
    expect(Whole.parseAsWhole('100')).toBe(100)
  })

  it('returns null for invalid strings', () => {
    expect(Whole.parseAsWhole('-1')).toBe(null)
    expect(Whole.parseAsWhole('1.5')).toBe(null)
    expect(Whole.parseAsWhole('abc')).toBe(null)
  })
})

describe('nextWhole', () => {
  it('returns next whole for positive numbers', () => {
    expect(Whole.next(5)).toBe(6)
    expect(Whole.next(5.1)).toBe(6)
    expect(Whole.next(5.9)).toBe(6)
  })

  it('returns 0 for negative numbers', () => {
    expect(Whole.next(-1)).toBe(0)
    expect(Whole.next(-10.5)).toBe(0)
  })
})

describe('prevWhole', () => {
  it('returns previous whole for values > 0', () => {
    expect(Whole.prev(5)).toBe(4)
    expect(Whole.prev(5.9)).toBe(4)
    expect(Whole.prev(1)).toBe(0)
  })

  it('returns null for values <= 0', () => {
    expect(Whole.prev(0)).toBe(null)
    expect(Whole.prev(-0.5)).toBe(null)
    expect(Whole.prev(-1)).toBe(null)
  })
})
