import { Test } from '#test'
import { Ts } from '#ts'
import { Schema as S } from 'effect'
import { expect, test } from 'vitest'
import { type Analysis, Arg, ArgShortFlag, ArgShortFlagCluster } from './arg.js'

// =============================================================================
// Type-Level Analysis Tests
// =============================================================================

test('type-level analysis', () => {
  type _pass = Ts.Assert.Cases<
    // Long flags (non-negated)
    Ts.Assert.exact<
      { _tag: 'long-flag'; name: 'verbose'; negated: false; value: null; original: '--verbose' },
      Arg.Analyze<'--verbose'>
    >,
    Ts.Assert.exact<
      { _tag: 'long-flag'; name: 'count'; negated: false; value: '5'; original: '--count=5' },
      Arg.Analyze<'--count=5'>
    >,
    // Long flags (negated)
    Ts.Assert.exact<
      { _tag: 'long-flag'; name: 'verbose'; negated: true; value: null; original: '--no-verbose' },
      Arg.Analyze<'--no-verbose'>
    >,
    // Short flags (single character)
    Ts.Assert.exact<
      { _tag: 'short-flag'; name: 'v'; value: null; original: '-v' },
      Arg.Analyze<'-v'>
    >,
    Ts.Assert.exact<
      { _tag: 'short-flag'; name: 'n'; value: '10'; original: '-n=10' },
      Arg.Analyze<'-n=10'>
    >,
    // Short flag clusters
    Ts.Assert.exact<
      {
        _tag: 'short-flag-cluster'
        additionalShortFlagNames: ['a']
        shortFlag: { _tag: 'short-flag'; name: 'b'; value: null; original: '-b' }
        original: '-ab'
      },
      Arg.Analyze<'-ab'>
    >,
    Ts.Assert.exact<
      {
        _tag: 'short-flag-cluster'
        additionalShortFlagNames: ['a', 'b']
        shortFlag: { _tag: 'short-flag'; name: 'c'; value: null; original: '-c' }
        original: '-abc'
      },
      Arg.Analyze<'-abc'>
    >,
    Ts.Assert.exact<
      {
        _tag: 'short-flag-cluster'
        additionalShortFlagNames: ['x', 'y']
        shortFlag: { _tag: 'short-flag'; name: 'z'; value: 'foo'; original: '-z=foo' }
        original: '-xyz=foo'
      },
      Arg.Analyze<'-xyz=foo'>
    >,
    // Positional
    Ts.Assert.exact<
      { _tag: 'positional'; value: 'file.txt'; original: 'file.txt' },
      Arg.Analyze<'file.txt'>
    >,
    // Separator
    Ts.Assert.exact<
      { _tag: 'separator'; original: '--' },
      Arg.Analyze<'--'>
    >
  >
})

// =============================================================================
// Runtime Analyzer Tests
// =============================================================================

Test.describe('runtime analyzer > long flags')
  .on(Arg.analyze)
  .cases(
    ['--verbose', { _tag: 'long-flag', name: 'verbose', negated: false, value: null, original: '--verbose' }],
    ['--count=5', { _tag: 'long-flag', name: 'count', negated: false, value: '5', original: '--count=5' }],
  )
  .test()

Test.describe('runtime analyzer > long flags (negated)')
  .on(Arg.analyze)
  .cases(
    ['--no-verbose', { _tag: 'long-flag', name: 'verbose', negated: true, value: null, original: '--no-verbose' }],
  )
  .test()

Test.describe('runtime analyzer > short flags')
  .on(Arg.analyze)
  .cases(
    ['-v', ArgShortFlag.make({ name: 'v', value: null, original: '-v' })],
    ['-n=10', ArgShortFlag.make({ name: 'n', value: '10', original: '-n=10' })],
  )
  .test()

Test
  .on(Arg.analyze)
  .describe('runtime analyzer > short flag clusters', [
    [
      '-ab',
      ArgShortFlagCluster.make({
        additionalShortFlagNames: ['a'],
        shortFlag: ArgShortFlag.make({ name: 'b', value: null, original: '-b' }),
        original: '-ab',
      }),
    ],
    // [
    //   '-abc',
    //   ArgShortFlagCluster.make({
    //     additionalShortFlagNames: ['a', 'b'],
    //     shortFlag: ArgShortFlag.make({ name: 'c', value: null, original: '-c' }),
    //     original: '-abc',
    //   }),
    // ],
    // [
    //   '-xyz=foo',
    //   ArgShortFlagCluster.make({
    //     additionalShortFlagNames: ['x', 'y'],
    //     shortFlag: ArgShortFlag.make({ name: 'z', value: 'foo', original: '-z=foo' }),
    //     original: '-xyz=foo',
    //   }),
    // ],
  ])
  .test()

Test.describe('runtime analyzer > positional')
  .on(Arg.analyze)
  .cases(
    ['file.txt', { _tag: 'positional', value: 'file.txt', original: 'file.txt' }],
  )
  .test()

Test.describe('runtime analyzer > separator')
  .on(Arg.analyze)
  .cases(
    ['--', { _tag: 'separator', original: '--' }],
  )
  .test()

// =============================================================================
// Effect Schema Tests
// =============================================================================

const decodeString = S.decodeSync(Arg.String) as (input: string) => Analysis

test('Effect Schema decoding', () => {
  expect(decodeString('--verbose')._tag).toBe('long-flag')
  expect(decodeString('-v')._tag).toBe('short-flag')
  expect(decodeString('file.txt')._tag).toBe('positional')

  const cluster = decodeString('-xyz=foo')
  expect(cluster).toEqual(
    ArgShortFlagCluster.make({
      additionalShortFlagNames: ['x', 'y'],
      shortFlag: ArgShortFlag.make({ name: 'z', value: 'foo', original: '-z=foo' }),
      original: '-xyz=foo',
    }),
  )
})

// =============================================================================
// fromString Tests
// =============================================================================

test('fromString', () => {
  expect(Arg.fromString('--verbose')._tag).toBe('long-flag')
  expect(Arg.fromString('-v')._tag).toBe('short-flag')
  expect(Arg.fromString('file.txt')._tag).toBe('positional')

  const cluster = Arg.fromString('-xyz=foo')
  expect(cluster).toEqual(
    ArgShortFlagCluster.make({
      additionalShortFlagNames: ['x', 'y'],
      shortFlag: ArgShortFlag.make({ name: 'z', value: 'foo', original: '-z=foo' }),
      original: '-xyz=foo',
    }),
  )
})
