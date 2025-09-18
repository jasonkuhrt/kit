import { describe, expect, it } from 'vitest'
import { Positive } from './$.js'

describe('is', () => {
  it('returns true for positive numbers', () => {
    expect(Positive.is(1)).toBe(true)
    expect(Positive.is(0.1)).toBe(true)
    expect(Positive.is(Number.POSITIVE_INFINITY)).toBe(true)
  })

  it('returns false for zero', () => {
    expect(Positive.is(0)).toBe(false)
  })

  it('returns false for negative numbers', () => {
    expect(Positive.is(-1)).toBe(false)
    expect(Positive.is(-0.1)).toBe(false)
  })

  it('returns false for special values', () => {
    expect(Positive.is(NaN)).toBe(false)
    expect(Positive.is(-Infinity)).toBe(false)
  })

  it('returns false for non-numbers', () => {
    expect(Positive.is('1')).toBe(false)
    expect(Positive.is(null)).toBe(false)
    expect(Positive.is(undefined)).toBe(false)
    expect(Positive.is({})).toBe(false)
  })
})

describe('from', () => {
  it('returns value for positive numbers', () => {
    expect(Positive.from(1)).toBe(1)
    expect(Positive.from(0.1)).toBe(0.1)
    expect(Positive.from(100)).toBe(100)
  })

  it('throws for zero', () => {
    expect(() => Positive.from(0)).toThrow('Value must be positive')
  })

  it('throws for negative numbers', () => {
    expect(() => Positive.from(-1)).toThrow('Value must be positive')
    expect(() => Positive.from(-0.1)).toThrow('Value must be positive')
  })
})

describe('tryFrom', () => {
  it('returns value for positive numbers', () => {
    expect(Positive.tryFrom(1)).toBe(1)
    expect(Positive.tryFrom(0.1)).toBe(0.1)
    expect(Positive.tryFrom(100)).toBe(100)
  })

  it('returns null for non-positive values', () => {
    expect(Positive.tryFrom(0)).toBe(null)
    expect(Positive.tryFrom(-1)).toBe(null)
    expect(Positive.tryFrom(-0.1)).toBe(null)
  })
})
