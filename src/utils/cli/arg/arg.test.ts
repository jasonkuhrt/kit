import { Ts } from '#ts'
import { Schema as S } from 'effect'
import { expect, test } from 'vitest'
import { Arg, ArgLongFlag, ArgPositional, ArgShortFlag, ArgShortFlagCluster } from './arg.js'

test('Arg.fromString', () => {
  // Long flag
  const r1 = Arg.fromString('--verbose')
  const e1 = ArgLongFlag.make({ name: 'verbose', negated: false, value: null, original: '--verbose' })
  expect(S.is(ArgLongFlag)(r1)).toBe(true)
  expect(r1).toMatchObject(e1)
  Ts.Assert.exact.ofAs<ArgLongFlag>().on(r1)

  // Long flag with value
  const r2 = Arg.fromString('--count=5')
  const e2 = ArgLongFlag.make({ name: 'count', negated: false, value: '5', original: '--count=5' })
  expect(S.is(ArgLongFlag)(r2)).toBe(true)
  expect(r2).toMatchObject(e2)
  Ts.Assert.exact.ofAs<ArgLongFlag>().on(r2)

  // Negated long flag
  const r3 = Arg.fromString('--no-verbose')
  const e3 = ArgLongFlag.make({ name: 'verbose', negated: true, value: null, original: '--no-verbose' })
  expect(S.is(ArgLongFlag)(r3)).toBe(true)
  expect(r3).toMatchObject(e3)
  Ts.Assert.exact.ofAs<ArgLongFlag>().on(r3)

  // Short flag
  const r4 = Arg.fromString('-v')
  const e4 = ArgShortFlag.make({ name: 'v', value: null, original: '-v' })
  expect(S.is(ArgShortFlag)(r4)).toBe(true)
  expect(r4).toMatchObject(e4)
  Ts.Assert.exact.ofAs<ArgShortFlag>().on(r4)

  // Short flag with value
  const r5 = Arg.fromString('-n=10')
  const e5 = ArgShortFlag.make({ name: 'n', value: '10', original: '-n=10' })
  expect(S.is(ArgShortFlag)(r5)).toBe(true)
  expect(r5).toMatchObject(e5)
  Ts.Assert.exact.ofAs<ArgShortFlag>().on(r5)

  // Short flag cluster (no value)
  const r6 = Arg.fromString('-abc')
  const e6 = ArgShortFlagCluster.make({
    additionalShortFlagNames: ['a', 'b'],
    shortFlag: ArgShortFlag.make({ name: 'c', value: null, original: '-c' }),
    original: '-abc',
  })
  expect(S.is(ArgShortFlagCluster)(r6)).toBe(true)
  expect(r6).toMatchObject(e6)
  Ts.Assert.exact.ofAs<ArgShortFlagCluster>().on(r6)

  // Short flag cluster (with value)
  const r7 = Arg.fromString('-xyz=foo')
  const e7 = ArgShortFlagCluster.make({
    additionalShortFlagNames: ['x', 'y'],
    shortFlag: ArgShortFlag.make({ name: 'z', value: 'foo', original: '-z=foo' }),
    original: '-xyz=foo',
  })
  expect(S.is(ArgShortFlagCluster)(r7)).toBe(true)
  expect(r7).toMatchObject(e7)
  Ts.Assert.exact.ofAs<ArgShortFlagCluster>().on(r7)

  // Positional
  const r8 = Arg.fromString('file.txt')
  const e8 = ArgPositional.make({ value: 'file.txt', original: 'file.txt' })
  expect(S.is(ArgPositional)(r8)).toBe(true)
  expect(r8).toMatchObject(e8)
  Ts.Assert.exact.ofAs<ArgPositional>().on(r8)
})
