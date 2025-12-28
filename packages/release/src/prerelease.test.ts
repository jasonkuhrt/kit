import { Git } from '@kitz/git'
import { Test } from '@kitz/test'
import { Schema as S } from 'effect'
import { describe, expect, test } from 'vitest'
import {
  encodePreviewPrerelease,
  encodePrPrerelease,
  makePreviewPrerelease,
  makePrPrerelease,
  nextPreviewPrerelease,
  nextPrPrerelease,
  parsePreviewPrerelease,
  parsePrPrerelease,
  PreviewPrerelease,
  PreviewPrereleaseSchema,
  PrPrerelease,
  PrPrereleaseSchema,
} from './prerelease.js'

// ─── PrPrerelease ──────────────────────────────────────────────────

describe('PrPrerelease', () => {
  test('make', () => {
    const pr = makePrPrerelease(123, 5, Git.Sha.make('abc1234'))
    expect(pr.prNumber).toBe(123)
    expect(pr.iteration).toBe(5)
    expect(pr.sha).toBe('abc1234')
  })

  test('encode', () => {
    const pr = makePrPrerelease(123, 5, Git.Sha.make('abc1234'))
    expect(encodePrPrerelease(pr)).toBe('pr.123.5.abc1234')
  })

  test('parse', () => {
    const pr = parsePrPrerelease('pr.456.10.def56789')
    expect(pr.prNumber).toBe(456)
    expect(pr.iteration).toBe(10)
    expect(pr.sha).toBe('def56789')
  })

  test('roundtrip', () => {
    const original = makePrPrerelease(789, 3, Git.Sha.make('a1b2c3d'))
    const encoded = encodePrPrerelease(original)
    const decoded = parsePrPrerelease(encoded)
    expect(decoded).toEqual(original)
  })

  test('next', () => {
    const current = makePrPrerelease(123, 5, Git.Sha.make('0001234'))
    const next = nextPrPrerelease(current, Git.Sha.make('0004567'))
    expect(next.prNumber).toBe(123)
    expect(next.iteration).toBe(6)
    expect(next.sha).toBe('0004567')
  })

  test('serialization', () => {
    const pr = makePrPrerelease(42, 7, Git.Sha.make('deadbeef'))
    expect(S.encodeSync(PrPrerelease)(pr)).toMatchInlineSnapshot(`
      {
        "iteration": 7,
        "prNumber": 42,
        "sha": "deadbeef",
      }
    `)
  })
})

Test.describe('PrPrereleaseSchema > decode')
  .inputType<string>()
  .outputType<{ prNumber: number; iteration: number; sha: string } | null>()
  .on((input) => {
    const result = S.decodeUnknownEither(PrPrereleaseSchema)(input)
    return result._tag === 'Right'
      ? { prNumber: result.right.prNumber, iteration: result.right.iteration, sha: result.right.sha }
      : null
  })
  .cases(
    [['pr.1.1.abc1234'], { prNumber: 1, iteration: 1, sha: 'abc1234' }],
    [['pr.123.456.abcdef0'], { prNumber: 123, iteration: 456, sha: 'abcdef0' }],
    [['pr.999.1.0123456789abcdef'], { prNumber: 999, iteration: 1, sha: '0123456789abcdef' }],
    [['invalid'], null],
    [['pr.1.1'], null],
    [['pr.1.a.abc'], null],
    [['pr.1.1.abc'], null], // sha too short (< 7 chars)
    [['next.5'], null],
  )
  .test()

// ─── PreviewPrerelease ─────────────────────────────────────────────

describe('PreviewPrerelease', () => {
  test('make', () => {
    const preview = makePreviewPrerelease(5)
    expect(preview.iteration).toBe(5)
  })

  test('encode', () => {
    const preview = makePreviewPrerelease(5)
    expect(encodePreviewPrerelease(preview)).toBe('next.5')
  })

  test('parse', () => {
    const preview = parsePreviewPrerelease('next.10')
    expect(preview.iteration).toBe(10)
  })

  test('roundtrip', () => {
    const original = makePreviewPrerelease(42)
    const encoded = encodePreviewPrerelease(original)
    const decoded = parsePreviewPrerelease(encoded)
    expect(decoded).toEqual(original)
  })

  test('next', () => {
    const current = makePreviewPrerelease(5)
    const next = nextPreviewPrerelease(current)
    expect(next.iteration).toBe(6)
  })

  test('serialization', () => {
    const preview = makePreviewPrerelease(7)
    expect(S.encodeSync(PreviewPrerelease)(preview)).toMatchInlineSnapshot(`
      {
        "iteration": 7,
      }
    `)
  })
})

Test.describe('PreviewPrereleaseSchema > decode')
  .inputType<string>()
  .outputType<{ iteration: number } | null>()
  .on((input) => {
    const result = S.decodeUnknownEither(PreviewPrereleaseSchema)(input)
    return result._tag === 'Right' ? { iteration: result.right.iteration } : null
  })
  .cases(
    [['next.1'], { iteration: 1 }],
    [['next.42'], { iteration: 42 }],
    [['next.999'], { iteration: 999 }],
    [['invalid'], null],
    [['next.'], null],
    [['next.abc'], null],
    [['pr.1.1.abc'], null],
  )
  .test()
