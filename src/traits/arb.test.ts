import { Str } from '#str'
import * as fc from 'fast-check'
import { describe, expect, test } from 'vitest'

describe('Arb trait', () => {
  test('Str.Arb generates strings', () => {
    // Test that we can generate strings
    const sample = Str.Arb.sample()
    expect(typeof sample).toBe('string')

    // Test multiple samples
    const samples = Str.Arb.samples(5)
    expect(samples).toHaveLength(5)
    samples.forEach(s => expect(typeof s).toBe('string'))
  })

  test('Str.Arb works in property tests', () => {
    fc.assert(
      fc.property(Str.Arb.arbitrary, (str) => {
        // All generated strings should have non-negative length
        return str.length >= 0
      }),
      { numRuns: 100 }, // Run quickly
    )
  })
})
