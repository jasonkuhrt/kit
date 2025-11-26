import { describe, expect, test } from 'vitest'
import { BigInteger } from './_.js'

describe('BigInteger', () => {
  describe('from', () => {
    test('creates from number', () => {
      const bi = BigInteger.from(123)
      expect(bi).toBe(123n)
    })

    test('creates from string', () => {
      const bi = BigInteger.from('123456789012345678901234567890')
      expect(bi).toBe(123456789012345678901234567890n)
    })

    test('creates from bigint', () => {
      const bi = BigInteger.from(123n)
      expect(bi).toBe(123n)
    })

    test('throws on decimal number', () => {
      expect(() => BigInteger.from(123.45)).toThrow('integers')
    })

    test('handles large numbers beyond safe integer', () => {
      const large = Number.MAX_SAFE_INTEGER + 1
      const bi = BigInteger.from(large)
      expect(bi).toBe(9007199254740992n)
    })
  })

  describe('constants', () => {
    test('ZERO is 0n', () => {
      expect(BigInteger.ZERO).toBe(0n)
    })

    test('ONE is 1n', () => {
      expect(BigInteger.ONE).toBe(1n)
    })

    test('TWO is 2n', () => {
      expect(BigInteger.TWO).toBe(2n)
    })
  })

  describe('arithmetic operations', () => {
    test('add', () => {
      const a = BigInteger.from('123456789012345678901234567890')
      const b = BigInteger.from('987654321098765432109876543210')
      const sum = BigInteger.add(a, b)

      expect(sum).toBe(1111111110111111111011111111100n)
    })

    test('subtract', () => {
      const a = BigInteger.from(1000)
      const b = BigInteger.from(123)
      const diff = BigInteger.subtract(a, b)

      expect(diff).toBe(877n)
    })

    test('multiply', () => {
      const a = BigInteger.from(123)
      const b = BigInteger.from(456)
      const product = BigInteger.multiply(a, b)

      expect(product).toBe(56088n)
    })

    test('divide', () => {
      const a = BigInteger.from(123)
      const b = BigInteger.from(4)
      const quotient = BigInteger.divide(a, b)

      expect(quotient).toBe(30n) // truncated
    })

    test('divide throws on zero', () => {
      expect(() => BigInteger.divide(BigInteger.ONE, BigInteger.ZERO)).toThrow('zero')
    })

    test('remainder', () => {
      const a = BigInteger.from(123)
      const b = BigInteger.from(10)
      const rem = BigInteger.remainder(a, b)

      expect(rem).toBe(3n)
    })

    test('remainder throws on zero', () => {
      expect(() => BigInteger.remainder(BigInteger.ONE, BigInteger.ZERO)).toThrow('zero')
    })

    test('power', () => {
      const base = BigInteger.from(2)
      const exp = BigInteger.from(10)
      const result = BigInteger.power(base, exp)

      expect(result).toBe(1024n)
    })

    test('power throws on negative exponent', () => {
      expect(() => BigInteger.power(BigInteger.TWO, BigInteger.from(-1))).toThrow('negative')
    })
  })

  describe('comparison and predicates', () => {
    test('compare', () => {
      const small = BigInteger.from(123)
      const large = BigInteger.from(456)

      expect(BigInteger.compare(small, large)).toBe(-1)
      expect(BigInteger.compare(large, small)).toBe(1)
      expect(BigInteger.compare(small, small)).toBe(0)
    })

    test('abs', () => {
      expect(BigInteger.abs(BigInteger.from(-123))).toBe(123n)
      expect(BigInteger.abs(BigInteger.from(123))).toBe(123n)
      expect(BigInteger.abs(BigInteger.ZERO)).toBe(0n)
    })

    test('isEven', () => {
      expect(BigInteger.isEven(BigInteger.from(2))).toBe(true)
      expect(BigInteger.isEven(BigInteger.from(3))).toBe(false)
      expect(BigInteger.isEven(BigInteger.ZERO)).toBe(true)
    })

    test('isOdd', () => {
      expect(BigInteger.isOdd(BigInteger.from(2))).toBe(false)
      expect(BigInteger.isOdd(BigInteger.from(3))).toBe(true)
      expect(BigInteger.isOdd(BigInteger.ZERO)).toBe(false)
    })

    test('isPositive', () => {
      expect(BigInteger.isPositive(BigInteger.ONE)).toBe(true)
      expect(BigInteger.isPositive(BigInteger.ZERO)).toBe(false)
      expect(BigInteger.isPositive(BigInteger.from(-1))).toBe(false)
    })

    test('isNegative', () => {
      expect(BigInteger.isNegative(BigInteger.from(-1))).toBe(true)
      expect(BigInteger.isNegative(BigInteger.ZERO)).toBe(false)
      expect(BigInteger.isNegative(BigInteger.ONE)).toBe(false)
    })

    test('isZero', () => {
      expect(BigInteger.isZero(BigInteger.ZERO)).toBe(true)
      expect(BigInteger.isZero(BigInteger.ONE)).toBe(false)
    })
  })

  describe('conversion', () => {
    test('toNumber', () => {
      const bi = BigInteger.from(123)
      expect(BigInteger.toNumber(bi)).toBe(123)
    })

    test('toNumber throws on large values', () => {
      const large = BigInteger.from('999999999999999999999999999999')
      expect(() => BigInteger.toNumber(large)).toThrow('too large')
    })

    test('toString', () => {
      const bi = BigInteger.from(123)
      expect(BigInteger.toString(bi)).toBe('123')
    })

    test('toString with radix', () => {
      const bi = BigInteger.from(255)
      expect(BigInteger.toString(bi, 16)).toBe('ff')
      expect(BigInteger.toString(bi, 2)).toBe('11111111')
    })
  })

  describe('curried functions', () => {
    test('addOn', () => {
      const addTen = BigInteger.addOn(BigInteger.from(10))
      const result = addTen(BigInteger.from(5))
      expect(result).toBe(15n)
    })

    test('subtractOn', () => {
      // subtractOn fixes the first parameter (minuend)
      const subtractFromFifty = BigInteger.subtractOn(BigInteger.from(50))
      const result = subtractFromFifty(BigInteger.from(10))
      expect(result).toBe(40n) // 50 - 10 = 40
    })

    test('multiplyOn', () => {
      const double = BigInteger.multiplyOn(BigInteger.TWO)
      const result = double(BigInteger.from(21))
      expect(result).toBe(42n)
    })

    test('divideWith', () => {
      // divideWith fixes the second parameter (divisor)
      const divideByFour = BigInteger.divideWith(BigInteger.from(4))
      const result = divideByFour(BigInteger.from(100))
      expect(result).toBe(25n) // 100 / 4 = 25
    })

    test('divideOn', () => {
      // divideOn fixes the first parameter (dividend)
      const divideHundred = BigInteger.divideOn(BigInteger.from(100))
      const result = divideHundred(BigInteger.TWO)
      expect(result).toBe(50n) // 100 / 2 = 50
    })

    test('remainderOn', () => {
      // remainderOn fixes the first parameter (dividend)
      const remainder123 = BigInteger.remainderOn(BigInteger.from(123))
      expect(remainder123(BigInteger.from(10))).toBe(3n) // 123 % 10 = 3

      const remainder456 = BigInteger.remainderOn(BigInteger.from(456))
      expect(remainder456(BigInteger.from(10))).toBe(6n) // 456 % 10 = 6
    })

    test('powerOn', () => {
      // powerOn fixes the first parameter (base)
      const powersOfTwo = BigInteger.powerOn(BigInteger.TWO)
      const result = powersOfTwo(BigInteger.from(7))
      expect(result).toBe(128n) // 2^7 = 128
    })

    test('compareOn', () => {
      // compareOn fixes the first parameter
      const compareTen = BigInteger.compareOn(BigInteger.from(10))
      expect(compareTen(BigInteger.from(5))).toBe(1) // 10 > 5
      expect(compareTen(BigInteger.from(15))).toBe(-1) // 10 < 15
      expect(compareTen(BigInteger.from(10))).toBe(0) // 10 = 10
    })

    test('addWith', () => {
      // addWith fixes the second parameter
      const addTen = BigInteger.addWith(BigInteger.from(10))
      const result = addTen(BigInteger.from(5))
      expect(result).toBe(15n) // 5 + 10 = 15
    })

    test('subtractWith', () => {
      // subtractWith fixes the second parameter (subtrahend)
      const subtractTen = BigInteger.subtractWith(BigInteger.from(10))
      const result = subtractTen(BigInteger.from(50))
      expect(result).toBe(40n) // 50 - 10 = 40
    })

    test('multiplyWith', () => {
      // multiplyWith fixes the second parameter
      const double = BigInteger.multiplyWith(BigInteger.TWO)
      const result = double(BigInteger.from(21))
      expect(result).toBe(42n) // 21 * 2 = 42
    })

    test('remainderWith', () => {
      // remainderWith fixes the second parameter (divisor)
      const mod10 = BigInteger.remainderWith(BigInteger.from(10))
      expect(mod10(BigInteger.from(123))).toBe(3n) // 123 % 10 = 3
      expect(mod10(BigInteger.from(456))).toBe(6n) // 456 % 10 = 6
    })

    test('powerWith', () => {
      // powerWith fixes the second parameter (exponent)
      const square = BigInteger.powerWith(BigInteger.TWO)
      const result = square(BigInteger.from(12))
      expect(result).toBe(144n) // 12^2 = 144
    })

    test('compareWith', () => {
      // compareWith fixes the second parameter
      const compareToTen = BigInteger.compareWith(BigInteger.from(10))
      expect(compareToTen(BigInteger.from(5))).toBe(-1) // 5 < 10
      expect(compareToTen(BigInteger.from(15))).toBe(1) // 15 > 10
      expect(compareToTen(BigInteger.from(10))).toBe(0) // 10 = 10
    })
  })

  describe('is', () => {
    test('recognizes bigints', () => {
      expect(BigInteger.is(123n)).toBe(true)
      expect(BigInteger.is(BigInteger.from(456))).toBe(true)
    })

    test('rejects non-bigints', () => {
      expect(BigInteger.is(123)).toBe(false)
      expect(BigInteger.is('123')).toBe(false)
      expect(BigInteger.is(null)).toBe(false)
      expect(BigInteger.is(undefined)).toBe(false)
    })
  })

  describe('large number operations', () => {
    test('works with numbers beyond JavaScript safe integer limit', () => {
      const large1 = BigInteger.from('9007199254740992') // MAX_SAFE_INTEGER + 1
      const large2 = BigInteger.from('9007199254740993') // MAX_SAFE_INTEGER + 2

      const sum = BigInteger.add(large1, large2)
      expect(sum).toBe(18014398509481985n)

      const product = BigInteger.multiply(large1, large2)
      expect(BigInteger.toString(product)).toBe('81129638414606690702988259885056')
    })

    test('handles factorial calculation', () => {
      // Calculate 10!
      let factorial = BigInteger.ONE
      for (let i = 1; i <= 10; i++) {
        factorial = BigInteger.multiply(factorial, BigInteger.from(i))
      }

      expect(factorial).toBe(3628800n)
    })
  })
})
