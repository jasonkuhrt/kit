import { Ts } from '#ts'
import { expect, test } from 'vitest'
import { Arg, ArgLongFlag, ArgPositional, ArgSeparator, ArgShortFlag, ArgShortFlagCluster } from './arg.js'

test('Arg.fromString > long flag', () => {
  const r = Arg.fromString('--verbose')
  const e = ArgLongFlag.make({ name: 'verbose', negated: false, value: null, original: '--verbose' })
  expect(ArgLongFlag.is(r)).toBe(true)
  expect(r).toMatchObject(e)
  Ts.Assert.exact.ofAs<{
    _tag: 'long-flag'
    name: 'verbose'
    negated: false
    value: null
    original: '--verbose'
  }>().on(r)
})

test('Arg.fromString > long flag with value', () => {
  const r = Arg.fromString('--count=5')
  const e = ArgLongFlag.make({ name: 'count', negated: false, value: '5', original: '--count=5' })
  expect(ArgLongFlag.is(r)).toBe(true)
  expect(r).toMatchObject(e)
  Ts.Assert.exact.ofAs<{
    _tag: 'long-flag'
    name: 'count'
    negated: false
    value: '5'
    original: '--count=5'
  }>().on(r)
})

test('Arg.fromString > negated long flag', () => {
  const r = Arg.fromString('--no-verbose')
  const e = ArgLongFlag.make({ name: 'verbose', negated: true, value: null, original: '--no-verbose' })
  expect(ArgLongFlag.is(r)).toBe(true)
  expect(r).toMatchObject(e)
  Ts.Assert.exact.ofAs<{ _tag: 'long-flag'; name: 'verbose'; negated: true; value: null; original: '--no-verbose' }>()
    .on(r)
})

test('Arg.fromString > short flag', () => {
  const r = Arg.fromString('-v')
  const e = ArgShortFlag.make({ name: 'v', value: null, original: '-v' })
  expect(ArgShortFlag.is(r)).toBe(true)
  expect(r).toMatchObject(e)
  Ts.Assert.exact.ofAs<{ _tag: 'short-flag'; name: 'v'; value: null; original: '-v' }>().on(r)
})

test('Arg.fromString > short flag with value', () => {
  const r = Arg.fromString('-n=10')
  const e = ArgShortFlag.make({ name: 'n', value: '10', original: '-n=10' })
  expect(ArgShortFlag.is(r)).toBe(true)
  expect(r).toMatchObject(e)
  Ts.Assert.exact.ofAs<{ _tag: 'short-flag'; name: 'n'; value: '10'; original: '-n=10' }>().on(r)
})

test('Arg.fromString > short flag cluster', () => {
  const r = Arg.fromString('-abc')
  const e = ArgShortFlagCluster.make({
    additionalShortFlagNames: ['a', 'b'],
    shortFlag: ArgShortFlag.make({ name: 'c', value: null, original: '-c' }),
    original: '-abc',
  })
  expect(ArgShortFlagCluster.is(r)).toBe(true)
  expect(r).toMatchObject(e)
  Ts.Assert.exact.ofAs<
    {
      _tag: 'short-flag-cluster'
      additionalShortFlagNames: ['a', 'b']
      shortFlag: { _tag: 'short-flag'; name: 'c'; value: null; original: '-c' }
      original: '-abc'
    }
  >().on(r)
})

test('Arg.fromString > short flag cluster with value', () => {
  const r = Arg.fromString('-xyz=foo')
  const e = ArgShortFlagCluster.make({
    additionalShortFlagNames: ['x', 'y'],
    shortFlag: ArgShortFlag.make({ name: 'z', value: 'foo', original: '-z=foo' }),
    original: '-xyz=foo',
  })
  expect(ArgShortFlagCluster.is(r)).toBe(true)
  expect(r).toMatchObject(e)
  Ts.Assert.exact.ofAs<
    {
      _tag: 'short-flag-cluster'
      additionalShortFlagNames: ['x', 'y']
      shortFlag: { _tag: 'short-flag'; name: 'z'; value: 'foo'; original: '-z=foo' }
      original: '-xyz=foo'
    }
  >().on(r)
})

test('Arg.fromString > positional', () => {
  const r = Arg.fromString('file.txt')
  const e = ArgPositional.make({ value: 'file.txt', original: 'file.txt' })
  expect(ArgPositional.is(r)).toBe(true)
  expect(r).toMatchObject(e)
  Ts.Assert.exact.ofAs<{
    _tag: 'positional'
    value: 'file.txt'
    original: 'file.txt'
  }>().on(r)
})

test('Arg.fromString > separator', () => {
  const r = Arg.fromString('--')
  const e = ArgSeparator.make({ value: null, original: '--' })
  expect(ArgSeparator.is(r)).toBe(true)
  expect(r).toMatchObject(e)
  Ts.Assert.exact.ofAs<{
    _tag: 'separator'
    value: null
    original: '--'
  }>().on(r)
})
