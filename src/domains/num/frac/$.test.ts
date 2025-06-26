import { describe, expect, test } from 'vitest'
import { Ratio } from '../ratio/$.ts'
import { Frac } from './$.ts'

describe('Frac', () => {
  describe('is', () => {
    test('identifies proper fractions', () => {
      expect(Frac.is(Ratio.from(1 as any, 2 as any))).toBe(true)
      expect(Frac.is(Ratio.from(3 as any, 4 as any))).toBe(true)
      expect(Frac.is(Ratio.from(99 as any, 100 as any))).toBe(true)
    })

    test('rejects improper fractions', () => {
      expect(Frac.is(Ratio.from(5 as any, 3 as any))).toBe(false) // > 1
      expect(Frac.is(Ratio.from(4 as any, 4 as any))).toBe(false) // = 1
    })

    test('rejects zero and negative', () => {
      expect(Frac.is(Ratio.from(0 as any, 5 as any))).toBe(false) // = 0
      expect(Frac.is(Ratio.from(-1 as any, 2 as any))).toBe(false) // negative
    })
  })

  describe('from', () => {
    test('creates proper fractions', () => {
      const half = Frac.from(1 as any, 2 as any)
      expect(half.numerator).toBe(1)
      expect(half.denominator).toBe(2)
    })

    test('throws for improper fractions', () => {
      expect(() => Frac.from(5 as any, 3 as any)).toThrow('less than 1')
      expect(() => Frac.from(4 as any, 4 as any)).toThrow('less than 1')
    })

    test('throws for zero numerator', () => {
      expect(() => Frac.from(0 as any, 5 as any)).toThrow('must be positive')
    })
  })

  describe('fromDecimal', () => {
    test('converts decimals between 0 and 1', () => {
      const half = Frac.fromDecimal(0.5)
      expect(half.numerator).toBe(1)
      expect(half.denominator).toBe(2)

      const quarter = Frac.fromDecimal(0.25)
      expect(quarter.numerator).toBe(1)
      expect(quarter.denominator).toBe(4)
    })

    test('throws for values outside (0,1)', () => {
      expect(() => Frac.fromDecimal(0)).toThrow('between 0 and 1')
      expect(() => Frac.fromDecimal(1)).toThrow('between 0 and 1')
      expect(() => Frac.fromDecimal(1.5)).toThrow('between 0 and 1')
      expect(() => Frac.fromDecimal(-0.5)).toThrow('between 0 and 1')
    })
  })

  describe('complement', () => {
    test('calculates 1 - fraction', () => {
      const quarter = Frac.from(1 as any, 4 as any)
      const comp = Frac.complement(quarter)

      expect(comp.numerator).toBe(3)
      expect(comp.denominator).toBe(4) // 1 - 1/4 = 3/4

      const third = Frac.from(1 as any, 3 as any)
      const compThird = Frac.complement(third)

      expect(compThird.numerator).toBe(2)
      expect(compThird.denominator).toBe(3) // 1 - 1/3 = 2/3
    })
  })

  describe('toPercentage', () => {
    test('converts to percentage', () => {
      expect(Frac.toPercentage(Frac.from(1 as any, 2 as any))).toBe(50)
      expect(Frac.toPercentage(Frac.from(1 as any, 4 as any))).toBe(25)
      expect(Frac.toPercentage(Frac.from(3 as any, 4 as any))).toBe(75)
    })
  })

  describe('multiply', () => {
    test('multiplies fractions', () => {
      const half = Frac.from(1 as any, 2 as any)
      const third = Frac.from(1 as any, 3 as any)
      const product = Frac.multiply(half, third)

      expect(product.numerator).toBe(1)
      expect(product.denominator).toBe(6) // 1/2 × 1/3 = 1/6
    })
  })

  describe('add', () => {
    test('adds fractions returning Ratio', () => {
      const half = Frac.from(1 as any, 2 as any)
      const third = Frac.from(1 as any, 3 as any)
      const sum = Frac.add(half, third)

      expect(sum.numerator).toBe(5)
      expect(sum.denominator).toBe(6) // 1/2 + 1/3 = 5/6

      // Sum might exceed 1
      const twoThirds = Frac.from(2 as any, 3 as any)
      const overOne = Frac.add(twoThirds, twoThirds)

      expect(overOne.numerator).toBe(4)
      expect(overOne.denominator).toBe(3) // 2/3 + 2/3 = 4/3 (not a Frac)
    })
  })
})
