import { Ts } from '#ts'
import { Schema as S } from 'effect'
import { expect, test } from 'vitest'
import { Arg, ArgLongFlag, ArgPositional, ArgSeparator, ArgShortFlag, ArgShortFlagCluster } from './arg.js'

test('Arg.fromString', () => {
  // Long flag
  const r1 = Arg.fromString('--verbose')
  const e1 = ArgLongFlag.make({ name: 'verbose', negated: false, value: null, original: '--verbose' })
  expect(S.is(ArgLongFlag)(r1)).toBe(true)
  expect(r1).toMatchObject(e1)
  Ts.Assert.exact.ofAs<typeof e1>().on(r1)

  // Long flag with value
  const r2 = Arg.fromString('--count=5')
  const e2 = ArgLongFlag.make({ name: 'count', negated: false, value: '5', original: '--count=5' })
  expect(S.is(ArgLongFlag)(r2)).toBe(true)
  expect(r2).toMatchObject(e2)
  Ts.Assert.exact.ofAs<typeof e2>().on(r2)

  // Negated long flag
  const r3 = Arg.fromString('--no-verbose')
  const e3 = ArgLongFlag.make({ name: 'verbose', negated: true, value: null, original: '--no-verbose' })
  expect(S.is(ArgLongFlag)(r3)).toBe(true)
  expect(r3).toMatchObject(e3)
  Ts.Assert.exact.ofAs<typeof e3>().on(r3)

  // Short flag
  const r4 = Arg.fromString('-v')
  const e4 = ArgShortFlag.make({ name: 'v', value: null, original: '-v' })
  expect(S.is(ArgShortFlag)(r4)).toBe(true)
  expect(r4).toMatchObject(e4)
  Ts.Assert.exact.ofAs<typeof e4>().on(r4)

  // Short flag with value
  const r5 = Arg.fromString('-n=10')
  const e5 = ArgShortFlag.make({ name: 'n', value: '10', original: '-n=10' })
  expect(S.is(ArgShortFlag)(r5)).toBe(true)
  expect(r5).toMatchObject(e5)
  Ts.Assert.exact.ofAs<typeof e5>().on(r5)

  // Short flag cluster (no value)
  const r6 = Arg.fromString('-abc')
  const e6 = ArgShortFlagCluster.make({
    additionalShortFlagNames: ['a', 'b'],
    shortFlag: ArgShortFlag.make({ name: 'c', value: null, original: '-c' }),
    original: '-abc',
  })
  expect(S.is(ArgShortFlagCluster)(r6)).toBe(true)
  expect(r6).toMatchObject(e6)
  Ts.Assert.exact.ofAs<typeof e6>().on(r6)

  // Short flag cluster (with value)
  const r7 = Arg.fromString('-xyz=foo')
  const e7 = ArgShortFlagCluster.make({
    additionalShortFlagNames: ['x', 'y'],
    shortFlag: ArgShortFlag.make({ name: 'z', value: 'foo', original: '-z=foo' }),
    original: '-xyz=foo',
  })
  expect(S.is(ArgShortFlagCluster)(r7)).toBe(true)
  expect(r7).toMatchObject(e7)
  Ts.Assert.exact.ofAs<typeof e7>().on(r7)

  // Positional
  const r8 = Arg.fromString('file.txt')
  const e8 = ArgPositional.make({ value: 'file.txt', original: 'file.txt' })
  expect(S.is(ArgPositional)(r8)).toBe(true)
  expect(r8).toMatchObject(e8)
  Ts.Assert.exact.ofAs<typeof e8>().on(r8)

  // Separator
  const r9 = Arg.fromString('--')
  const e9 = ArgSeparator.make({ value: null, original: '--' })
  expect(S.is(ArgSeparator)(r9)).toBe(true)
  expect(r9).toMatchObject(e9)
  Ts.Assert.exact.ofAs<typeof e9>().on(r9)
})

test('Arg.Analyze type-level literal preservation', () => {
  // Long flag - preserves literal name
  type r1 = Arg.Analyze<'--verbose'>
  type e1 = { _tag: 'long-flag'; name: 'verbose'; negated: false; value: null; original: '--verbose' }
  type _1 = Ts.Assert.exact<e1, r1>

  // Long flag with value - preserves literal value
  type r2 = Arg.Analyze<'--count=5'>
  type e2 = { _tag: 'long-flag'; name: 'count'; negated: false; value: '5'; original: '--count=5' }
  type _2 = Ts.Assert.exact<e2, r2>

  // Negated - preserves negated: true
  type r3 = Arg.Analyze<'--no-verbose'>
  type e3 = { _tag: 'long-flag'; name: 'verbose'; negated: true; value: null; original: '--no-verbose' }
  type _3 = Ts.Assert.exact<e3, r3>

  // Short flag - preserves literal name
  type r4 = Arg.Analyze<'-v'>
  type e4 = { _tag: 'short-flag'; name: 'v'; value: null; original: '-v' }
  type _4 = Ts.Assert.exact<e4, r4>

  // Short flag cluster - preserves literal names array
  type r5 = Arg.Analyze<'-xyz=foo'>
  type e5 = {
    _tag: 'short-flag-cluster'
    additionalShortFlagNames: ['x', 'y']
    shortFlag: { _tag: 'short-flag'; name: 'z'; value: 'foo'; original: '-z=foo' }
    original: '-xyz=foo'
  }
  type _5 = Ts.Assert.exact<e5, r5>

  // Positional - preserves literal value
  type r6 = Arg.Analyze<'file.txt'>
  type e6 = { _tag: 'positional'; value: 'file.txt'; original: 'file.txt' }
  type _6 = Ts.Assert.exact<e6, r6>

  // Separator
  type r7 = Arg.Analyze<'--'>
  type e7 = { _tag: 'separator'; value: null; original: '--' }
  type _7 = Ts.Assert.exact<e7, r7>
})
