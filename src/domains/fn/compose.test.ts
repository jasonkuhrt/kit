import { describe, expect, test } from 'vitest'
import type * as Path from '../../utils/ts/path.js'
import { compose, compose2 } from './compose.js'
import type { Extractor } from './extractor.js'

describe('compose', () => {
  describe('regular functions', () => {
    test('composes two functions right-to-left', () => {
      const add1 = (x: number) => x + 1
      const double = (x: number) => x * 2

      const composed = compose(add1, double)

      expect(composed(5)).toBe(11) // double(5) = 10, add1(10) = 11
    })

    test('composes three functions right-to-left', () => {
      const add1 = (x: number) => x + 1
      const double = (x: number) => x * 2
      const toString = (x: number) => x.toString()

      const composed = compose(toString, add1, double)

      expect(composed(5)).toBe('11')
    })

    test('identity composition with single function', () => {
      const double = (x: number) => x * 2

      const composed = compose(double)

      expect(composed(5)).toBe(10)
    })

    test('throws on empty composition', () => {
      expect(() => compose()).toThrow('compose requires at least one function')
    })
  })

  describe('extractors', () => {
    test('composes extractors and preserves .kind metadata', () => {
      // Create mock extractors
      const extractor1: Extractor<number, string> = Object.assign(
        (x: number) => x.toString(),
        { kind: {} as Path.Returned },
      )

      const extractor2: Extractor<boolean, number> = Object.assign(
        (x: boolean) => (x ? 1 : 0),
        { kind: {} as Path.Awaited$ },
      )

      const composed = compose(extractor1, extractor2)

      // Runtime behavior
      expect(composed(true)).toBe('1')
      expect(composed(false)).toBe('0')

      // Has .kind property
      expect(composed).toHaveProperty('kind')
    })

    test('composes multiple extractors', () => {
      const ext1: Extractor<number, number> = Object.assign((x: number) => x * 2, { kind: {} as Path.Returned })
      const ext2: Extractor<number, number> = Object.assign((x: number) => x + 1, { kind: {} as Path.Awaited$ })
      const ext3: Extractor<number, number> = Object.assign((x: number) => x - 3, { kind: {} as Path.ArrayElement })

      const composed = compose(ext1, ext2, ext3)

      // (5 - 3) = 2, (2 + 1) = 3, (3 * 2) = 6
      expect(composed(5)).toBe(6)
      expect(composed).toHaveProperty('kind')
    })
  })

  describe('compose2', () => {
    test('composes two functions', () => {
      const add1 = (x: number) => x + 1
      const double = (x: number) => x * 2

      const composed = compose2(add1, double)

      expect(composed(5)).toBe(11)
    })

    test('composes two extractors', () => {
      const ext1: Extractor<number, string> = Object.assign(
        (x: number) => x.toString(),
        { kind: {} as Path.Returned },
      )

      const ext2: Extractor<boolean, number> = Object.assign(
        (x: boolean) => (x ? 1 : 0),
        { kind: {} as Path.Awaited$ },
      )

      const composed = compose2(ext1, ext2)

      expect(composed(true)).toBe('1')
      expect(composed).toHaveProperty('kind')
    })
  })
})
