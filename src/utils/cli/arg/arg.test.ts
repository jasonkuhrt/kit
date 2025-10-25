import { Ts } from '#ts'
import { test } from 'vitest'
import { Arg, ArgLongFlag, ArgPositional, ArgShortFlag, ArgShortFlagCluster } from './arg.js'

test('Arg.fromString', () => {
  // Long flag
  const r1 = Arg.fromString('--verbose')
  Ts.Assert.exact.ofAs<ArgLongFlag>().on(r1)
  Ts.Assert.exact.ofAs<{ _tag: 'long-flag'; name: 'verbose'; negated: false; value: null; original: '--verbose' }>().on(r1)

  // Long flag with value
  const r2 = Arg.fromString('--count=5')
  Ts.Assert.exact.ofAs<ArgLongFlag>().on(r2)
  Ts.Assert.exact.ofAs<{ _tag: 'long-flag'; name: 'count'; negated: false; value: '5'; original: '--count=5' }>().on(r2)

  // Negated long flag
  const r3 = Arg.fromString('--no-verbose')
  Ts.Assert.exact.ofAs<ArgLongFlag>().on(r3)
  Ts.Assert.exact.ofAs<{ _tag: 'long-flag'; name: 'verbose'; negated: true; value: null; original: '--no-verbose' }>()
    .on(r3)

  // Short flag
  const r4 = Arg.fromString('-v')
  Ts.Assert.exact.ofAs<ArgShortFlag>().on(r4)
  Ts.Assert.exact.ofAs<{ _tag: 'short-flag'; name: 'v'; value: null; original: '-v' }>().on(r4)

  // Short flag with value
  const r5 = Arg.fromString('-n=10')
  Ts.Assert.exact.ofAs<ArgShortFlag>().on(r5)
  Ts.Assert.exact.ofAs<{ _tag: 'short-flag'; name: 'n'; value: '10'; original: '-n=10' }>().on(r5)

  // Short flag cluster (no value)
  const r6 = Arg.fromString('-abc')
  Ts.Assert.exact.ofAs<ArgShortFlagCluster>().on(r6)
  Ts.Assert.exact.ofAs<{
    _tag: 'short-flag-cluster'
    additionalShortFlagNames: ['a', 'b']
    shortFlag: { _tag: 'short-flag'; name: 'c'; value: null; original: '-c' }
    original: '-abc'
  }>().on(r6)

  // Short flag cluster (with value)
  const r7 = Arg.fromString('-xyz=foo')
  Ts.Assert.exact.ofAs<ArgShortFlagCluster>().on(r7)
  Ts.Assert.exact.ofAs<{
    _tag: 'short-flag-cluster'
    additionalShortFlagNames: ['x', 'y']
    shortFlag: { _tag: 'short-flag'; name: 'z'; value: 'foo'; original: '-z=foo' }
    original: '-xyz=foo'
  }>().on(r7)

  // Positional
  const r8 = Arg.fromString('file.txt')
  Ts.Assert.exact.ofAs<ArgPositional>().on(r8)
  Ts.Assert.exact.ofAs<{ _tag: 'positional'; value: 'file.txt'; original: 'file.txt' }>().on(r8)
})
