import { describe, expect, it } from 'vitest'
import { Natural } from './$.js'

describe('isNatural', () => {
  it('returns true for positive integers', () => {
    expect(Natural.is(1)).toBe(true)
    expect(Natural.is(2)).toBe(true)
    expect(Natural.is(100)).toBe(true)
    expect(Natural.is(Number.MAX_SAFE_INTEGER)).toBe(true)
  })

  it('returns false for zero', () => {
    expect(Natural.is(0)).toBe(false)
  })

  it('returns false for negative numbers', () => {
    expect(Natural.is(-1)).toBe(false)
    expect(Natural.is(-100)).toBe(false)
  })

  it('returns false for non-integers', () => {
    expect(Natural.is(1.5)).toBe(false)
    expect(Natural.is(0.1)).toBe(false)
    expect(Natural.is(Math.PI)).toBe(false)
  })

  it('returns false for special values', () => {
    expect(Natural.is(Infinity)).toBe(false)
    expect(Natural.is(-Infinity)).toBe(false)
    expect(Natural.is(NaN)).toBe(false)
  })

  it('returns false for non-numbers', () => {
    expect(Natural.is('1')).toBe(false)
    expect(Natural.is(null)).toBe(false)
    expect(Natural.is(undefined)).toBe(false)
    expect(Natural.is({})).toBe(false)
  })
})

describe('natural', () => {
  it('returns value for positive integers', () => {
    expect(Natural.from(1)).toBe(1)
    expect(Natural.from(100)).toBe(100)
  })

  it('throws for zero', () => {
    expect(() => Natural.from(0)).toThrow('Value must be positive')
  })

  it('throws for negative numbers', () => {
    expect(() => Natural.from(-1)).toThrow('Value must be positive')
  })

  it('throws for non-integers', () => {
    expect(() => Natural.from(1.5)).toThrow('Value must be an integer')
  })
})

describe('tryNatural', () => {
  it('returns value for positive integers', () => {
    expect(Natural.tryFrom(1)).toBe(1)
    expect(Natural.tryFrom(100)).toBe(100)
  })

  it('returns null for invalid values', () => {
    expect(Natural.tryFrom(0)).toBe(null)
    expect(Natural.tryFrom(-1)).toBe(null)
    expect(Natural.tryFrom(1.5)).toBe(null)
  })
})

describe('parseAsNatural', () => {
  it('parses valid natural number strings', () => {
    expect(Natural.parseAsNatural('1')).toBe(1)
    expect(Natural.parseAsNatural('100')).toBe(100)
  })

  it('returns null for invalid strings', () => {
    expect(Natural.parseAsNatural('0')).toBe(null)
    expect(Natural.parseAsNatural('-1')).toBe(null)
    expect(Natural.parseAsNatural('1.5')).toBe(null)
    expect(Natural.parseAsNatural('abc')).toBe(null)
  })
})

describe('nextNatural', () => {
  it('returns next natural for positive numbers', () => {
    expect(Natural.next(5)).toBe(6)
    expect(Natural.next(5.1)).toBe(6)
    expect(Natural.next(5.9)).toBe(6)
  })

  it('returns 1 for non-positive numbers', () => {
    expect(Natural.next(0)).toBe(1)
    expect(Natural.next(-1)).toBe(1)
    expect(Natural.next(-10.5)).toBe(1)
  })
})

describe('prevNatural', () => {
  it('returns previous natural for values > 1', () => {
    expect(Natural.prev(5)).toBe(4)
    expect(Natural.prev(5.9)).toBe(4)
    expect(Natural.prev(2)).toBe(1)
  })

  it('returns null for values <= 1', () => {
    expect(Natural.prev(1)).toBe(null)
    expect(Natural.prev(0.5)).toBe(null)
    expect(Natural.prev(0)).toBe(null)
    expect(Natural.prev(-1)).toBe(null)
  })
})
