import { describe, expect, test } from 'vitest'
import { Prime } from './$.js'

describe('Prime', () => {
  describe('is', () => {
    test('identifies prime numbers', () => {
      // First few primes
      expect(Prime.is(2)).toBe(true)
      expect(Prime.is(3)).toBe(true)
      expect(Prime.is(5)).toBe(true)
      expect(Prime.is(7)).toBe(true)
      expect(Prime.is(11)).toBe(true)
      expect(Prime.is(13)).toBe(true)

      // Larger primes
      expect(Prime.is(97)).toBe(true)
      expect(Prime.is(101)).toBe(true)
      expect(Prime.is(997)).toBe(true)
    })

    test('rejects non-primes', () => {
      expect(Prime.is(1)).toBe(false) // Not prime by definition
      expect(Prime.is(4)).toBe(false)
      expect(Prime.is(6)).toBe(false)
      expect(Prime.is(8)).toBe(false)
      expect(Prime.is(9)).toBe(false)
      expect(Prime.is(10)).toBe(false)
      expect(Prime.is(100)).toBe(false)
    })

    test('rejects non-integers', () => {
      expect(Prime.is(2.5)).toBe(false)
      expect(Prime.is('2')).toBe(false)
      expect(Prime.is(null)).toBe(false)
      expect(Prime.is(undefined)).toBe(false)
    })
  })

  describe('from', () => {
    test('accepts prime numbers', () => {
      expect(Prime.from(2 as any)).toBe(2)
      expect(Prime.from(17 as any)).toBe(17)
    })

    test('throws for non-primes', () => {
      expect(() => Prime.from(1 as any)).toThrow('not prime by definition')
      expect(() => Prime.from(4 as any)).toThrow('not prime')
    })
  })

  describe('next', () => {
    test('finds next prime', () => {
      expect(Prime.next(1)).toBe(2)
      expect(Prime.next(2)).toBe(3)
      expect(Prime.next(3)).toBe(5)
      expect(Prime.next(4)).toBe(5)
      expect(Prime.next(10)).toBe(11)
      expect(Prime.next(11)).toBe(13)
      expect(Prime.next(20)).toBe(23)
    })
  })

  describe('prev', () => {
    test('finds previous prime', () => {
      expect(Prime.prev(10)).toBe(7)
      expect(Prime.prev(8)).toBe(7)
      expect(Prime.prev(7)).toBe(5)
      expect(Prime.prev(3)).toBe(2)
    })

    test('returns null when no previous prime exists', () => {
      expect(Prime.prev(2)).toBe(null)
      expect(Prime.prev(1)).toBe(null)
      expect(Prime.prev(0)).toBe(null)
    })
  })

  describe('nth', () => {
    test('returns nth prime', () => {
      expect(Prime.nth(1 as any)).toBe(2) // 1st prime
      expect(Prime.nth(2 as any)).toBe(3) // 2nd prime
      expect(Prime.nth(3 as any)).toBe(5) // 3rd prime
      expect(Prime.nth(10 as any)).toBe(29) // 10th prime
      expect(Prime.nth(25 as any)).toBe(97) // 25th prime
    })

    test('throws for invalid n', () => {
      expect(() => Prime.nth(0 as any)).toThrow('at least 1')
    })
  })

  describe('factorize', () => {
    test('factorizes composite numbers', () => {
      const factors12 = Prime.factorize(12 as any)
      expect(factors12.get(2 as any)).toBe(2) // 2²
      expect(factors12.get(3 as any)).toBe(1) // 3¹

      const factors60 = Prime.factorize(60 as any)
      expect(factors60.get(2 as any)).toBe(2) // 2²
      expect(factors60.get(3 as any)).toBe(1) // 3¹
      expect(factors60.get(5 as any)).toBe(1) // 5¹
    })

    test('factorizes prime numbers', () => {
      const factors17 = Prime.factorize(17 as any)
      expect(factors17.size).toBe(1)
      expect(factors17.get(17 as any)).toBe(1)
    })

    test('handles powers of 2', () => {
      const factors16 = Prime.factorize(16 as any)
      expect(factors16.size).toBe(1)
      expect(factors16.get(2 as any)).toBe(4) // 2⁴
    })

    test('throws for invalid input', () => {
      expect(() => Prime.factorize(1 as any)).toThrow('less than 2')
      expect(() => Prime.factorize(0 as any)).toThrow('less than 2')
    })
  })
})
