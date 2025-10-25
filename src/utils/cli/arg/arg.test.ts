import { Ts } from '#ts'
import { Schema as S } from 'effect'
import { expect, test } from 'vitest'
import { Arg, ArgLongFlag, ArgPositional, ArgSeparator, ArgShortFlag, ArgShortFlagCluster } from './arg.js'

test('Arg.fromString > long flag', () => {
  const r = Arg.fromString('--verbose')
  const e = ArgLongFlag.make({ name: 'verbose', negated: false, value: null, original: '--verbose' })
  expect(S.is(ArgLongFlag)(r)).toBe(true)
  expect(r).toMatchObject(e)
  Ts.Assert.exact.ofAs<typeof e>().on(r)
})

test('Arg.fromString > long flag with value', () => {
  const r = Arg.fromString('--count=5')
  const e = ArgLongFlag.make({ name: 'count', negated: false, value: '5', original: '--count=5' })
  expect(S.is(ArgLongFlag)(r)).toBe(true)
  expect(r).toMatchObject(e)
  Ts.Assert.exact.ofAs<typeof e>().on(r)
})

test('Arg.fromString > negated long flag', () => {
  const r = Arg.fromString('--no-verbose')
  const e = ArgLongFlag.make({ name: 'verbose', negated: true, value: null, original: '--no-verbose' })
  expect(S.is(ArgLongFlag)(r)).toBe(true)
  expect(r).toMatchObject(e)
  Ts.Assert.exact.ofAs<typeof e>().on(r)
})

test('Arg.fromString > short flag', () => {
  const r = Arg.fromString('-v')
  const e = ArgShortFlag.make({ name: 'v', value: null, original: '-v' })
  expect(S.is(ArgShortFlag)(r)).toBe(true)
  expect(r).toMatchObject(e)
  Ts.Assert.exact.ofAs<typeof e>().on(r)
})

test('Arg.fromString > short flag with value', () => {
  const r = Arg.fromString('-n=10')
  const e = ArgShortFlag.make({ name: 'n', value: '10', original: '-n=10' })
  expect(S.is(ArgShortFlag)(r)).toBe(true)
  expect(r).toMatchObject(e)
  Ts.Assert.exact.ofAs<typeof e>().on(r)
})

test('Arg.fromString > short flag cluster', () => {
  const r = Arg.fromString('-abc')
  const e = ArgShortFlagCluster.make({
    additionalShortFlagNames: ['a', 'b'],
    shortFlag: ArgShortFlag.make({ name: 'c', value: null, original: '-c' }),
    original: '-abc',
  })
  expect(S.is(ArgShortFlagCluster)(r)).toBe(true)
  expect(r).toMatchObject(e)
  Ts.Assert.exact.ofAs<typeof e>().on(r)
})

test('Arg.fromString > short flag cluster with value', () => {
  const r = Arg.fromString('-xyz=foo')
  const e = ArgShortFlagCluster.make({
    additionalShortFlagNames: ['x', 'y'],
    shortFlag: ArgShortFlag.make({ name: 'z', value: 'foo', original: '-z=foo' }),
    original: '-xyz=foo',
  })
  expect(S.is(ArgShortFlagCluster)(r)).toBe(true)
  expect(r).toMatchObject(e)
  Ts.Assert.exact.ofAs<typeof e>().on(r)
})

test('Arg.fromString > positional', () => {
  const r = Arg.fromString('file.txt')
  const e = ArgPositional.make({ value: 'file.txt', original: 'file.txt' })
  expect(S.is(ArgPositional)(r)).toBe(true)
  expect(r).toMatchObject(e)
  Ts.Assert.exact.ofAs<typeof e>().on(r)
})

test('Arg.fromString > separator', () => {
  const r = Arg.fromString('--')
  const e = ArgSeparator.make({ value: null, original: '--' })
  expect(S.is(ArgSeparator)(r)).toBe(true)
  expect(r).toMatchObject(e)
  Ts.Assert.exact.ofAs<typeof e>().on(r)
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
