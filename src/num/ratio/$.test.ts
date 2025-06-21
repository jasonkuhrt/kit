import { describe, expect, test } from 'vitest'
import { Ratio } from './$.ts'

describe('Ratio', () => {
  describe('from', () => {
    test('creates and simplifies ratios', () => {
      const half = Ratio.from(1 as any, 2 as any)
      expect(half.numerator).toBe(1)
      expect(half.denominator).toBe(2)

      // Simplifies
      const simplified = Ratio.from(4 as any, 8 as any)
      expect(simplified.numerator).toBe(1)
      expect(simplified.denominator).toBe(2)

      // Normalizes sign
      const negative = Ratio.from(3 as any, -4 as any)
      expect(negative.numerator).toBe(-3)
      expect(negative.denominator).toBe(4)
    })
  })

  describe('fromDecimal', () => {
    test('converts decimals to ratios', () => {
      const half = Ratio.fromDecimal(0.5)
      expect(half.numerator).toBe(1)
      expect(half.denominator).toBe(2)

      const quarter = Ratio.fromDecimal(0.25)
      expect(quarter.numerator).toBe(1)
      expect(quarter.denominator).toBe(4)

      const eighth = Ratio.fromDecimal(0.125)
      expect(eighth.numerator).toBe(1)
      expect(eighth.denominator).toBe(8)
    })

    test('handles repeating decimals', () => {
      const third = Ratio.fromDecimal(0.333333)
      expect(third.numerator).toBe(1)
      expect(third.denominator).toBe(3)
    })

    test('respects max denominator', () => {
      const pi = Ratio.fromDecimal(3.14159, 100)
      // Our algorithm finds 311/99 which is actually more accurate than 22/7
      // 311/99 = 3.141414... (error: 0.000176)
      // 22/7 = 3.142857... (error: 0.001267)
      expect(pi.denominator).toBeLessThanOrEqual(100)
      expect(Math.abs(Ratio.toDecimal(pi) - 3.14159)).toBeLessThan(0.001)
    })
  })

  describe('arithmetic operations', () => {
    test('add', () => {
      const a = Ratio.from(1 as any, 2 as any)
      const b = Ratio.from(1 as any, 3 as any)
      const sum = Ratio.add(a, b)

      expect(sum.numerator).toBe(5)
      expect(sum.denominator).toBe(6) // 1/2 + 1/3 = 5/6
    })

    test('subtract', () => {
      const a = Ratio.from(3 as any, 4 as any)
      const b = Ratio.from(1 as any, 2 as any)
      const diff = Ratio.subtract(a, b)

      expect(diff.numerator).toBe(1)
      expect(diff.denominator).toBe(4) // 3/4 - 1/2 = 1/4
    })

    test('multiply', () => {
      const a = Ratio.from(2 as any, 3 as any)
      const b = Ratio.from(3 as any, 4 as any)
      const product = Ratio.multiply(a, b)

      expect(product.numerator).toBe(1)
      expect(product.denominator).toBe(2) // 2/3 × 3/4 = 1/2
    })

    test('divide', () => {
      const a = Ratio.from(1 as any, 2 as any)
      const b = Ratio.from(1 as any, 3 as any)
      const quotient = Ratio.divide(a, b)

      expect(quotient.numerator).toBe(3)
      expect(quotient.denominator).toBe(2) // 1/2 ÷ 1/3 = 3/2
    })

    test('divide throws on zero', () => {
      const a = Ratio.from(1 as any, 2 as any)
      const zero = Ratio.from(0 as any, 1 as any)

      expect(() => Ratio.divide(a, zero)).toThrow('zero')
    })
  })

  describe('compare', () => {
    test('compares ratios correctly', () => {
      const half = Ratio.from(1 as any, 2 as any)
      const third = Ratio.from(1 as any, 3 as any)
      const twoThirds = Ratio.from(2 as any, 3 as any)

      expect(Ratio.compare(third, half)).toBe(-1) // 1/3 < 1/2
      expect(Ratio.compare(half, half)).toBe(0) // equal
      expect(Ratio.compare(twoThirds, half)).toBe(1) // 2/3 > 1/2
    })
  })

  describe('reciprocal', () => {
    test('inverts ratios', () => {
      const twoThirds = Ratio.from(2 as any, 3 as any)
      const reciprocal = Ratio.reciprocal(twoThirds)

      expect(reciprocal.numerator).toBe(3)
      expect(reciprocal.denominator).toBe(2)
    })

    test('throws on zero', () => {
      const zero = Ratio.from(0 as any, 1 as any)
      expect(() => Ratio.reciprocal(zero)).toThrow('zero')
    })
  })

  describe('toMixedNumber', () => {
    test('converts improper fractions to mixed numbers', () => {
      const improper = Ratio.from(7 as any, 3 as any)
      const mixed = Ratio.toMixedNumber(improper)

      expect(mixed.whole).toBe(2)
      expect(mixed.fraction.numerator).toBe(1)
      expect(mixed.fraction.denominator).toBe(3) // 7/3 = 2⅓
    })

    test('handles proper fractions', () => {
      const proper = Ratio.from(3 as any, 4 as any)
      const mixed = Ratio.toMixedNumber(proper)

      expect(mixed.whole).toBe(0)
      expect(mixed.fraction.numerator).toBe(3)
      expect(mixed.fraction.denominator).toBe(4) // 3/4 = 0¾
    })
  })
})
