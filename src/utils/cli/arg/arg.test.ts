import { Test } from '#test'
import { Ts } from '#ts'
import { Schema as S } from 'effect'
import { expect, test } from 'vitest'
import { type Analysis, Arg } from './arg.js'

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
      { _tag: 'long-flag'; name: 'fooBar'; negated: false; value: null; original: '--foo-bar' },
      Arg.Analyze<'--foo-bar'>
    >,
    Ts.Assert.exact<
      { _tag: 'long-flag'; name: 'count'; negated: false; value: '5'; original: '--count=5' },
      Arg.Analyze<'--count=5'>
    >,
    Ts.Assert.exact<
      { _tag: 'long-flag'; name: 'maxCount'; negated: false; value: '10'; original: '--max-count=10' },
      Arg.Analyze<'--max-count=10'>
    >,
    Ts.Assert.exact<
      { _tag: 'long-flag'; name: 'query'; negated: false; value: 'a=b'; original: '--query=a=b' },
      Arg.Analyze<'--query=a=b'>
    >,
    Ts.Assert.exact<
      { _tag: 'long-flag'; name: 'empty'; negated: false; value: ''; original: '--empty=' },
      Arg.Analyze<'--empty='>
    >,
    // Long flags (negated)
    Ts.Assert.exact<
      { _tag: 'long-flag'; name: 'verbose'; negated: true; value: null; original: '--no-verbose' },
      Arg.Analyze<'--no-verbose'>
    >,
    Ts.Assert.exact<
      { _tag: 'long-flag'; name: 'debug'; negated: true; value: null; original: '--no-debug' },
      Arg.Analyze<'--no-debug'>
    >,
    Ts.Assert.exact<
      { _tag: 'long-flag'; name: 'debugMode'; negated: true; value: null; original: '--no-debug-mode' },
      Arg.Analyze<'--no-debug-mode'>
    >,
    Ts.Assert.exact<
      { _tag: 'long-flag'; name: 'verbose'; negated: true; value: 'true'; original: '--no-verbose=true' },
      Arg.Analyze<'--no-verbose=true'>
    >,
    // Edge cases: NOT negated (lowercase after 'no')
    Ts.Assert.exact<
      { _tag: 'long-flag'; name: 'notice'; negated: false; value: null; original: '--notice' },
      Arg.Analyze<'--notice'>
    >,
    Ts.Assert.exact<
      { _tag: 'long-flag'; name: 'node'; negated: false; value: null; original: '--node' },
      Arg.Analyze<'--node'>
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
    Ts.Assert.exact<
      { _tag: 'short-flag'; name: 'q'; value: 'x=y'; original: '-q=x=y' },
      Arg.Analyze<'-q=x=y'>
    >,
    Ts.Assert.exact<
      { _tag: 'short-flag'; name: 'e'; value: ''; original: '-e=' },
      Arg.Analyze<'-e='>
    >,
    // Short flag clusters
    Ts.Assert.exact<
      {
        _tag: 'short-flag-cluster'
        flags: [
          { _tag: 'short-flag'; name: 'a'; value: null; original: '-a' },
          { _tag: 'short-flag'; name: 'b'; value: null; original: '-b' },
        ]
        original: '-ab'
      },
      Arg.Analyze<'-ab'>
    >,
    Ts.Assert.exact<
      {
        _tag: 'short-flag-cluster'
        flags: [
          { _tag: 'short-flag'; name: 'a'; value: null; original: '-a' },
          { _tag: 'short-flag'; name: 'b'; value: null; original: '-b' },
          { _tag: 'short-flag'; name: 'c'; value: null; original: '-c' },
        ]
        original: '-abc'
      },
      Arg.Analyze<'-abc'>
    >,
    Ts.Assert.exact<
      {
        _tag: 'short-flag-cluster'
        flags: [
          { _tag: 'short-flag'; name: 'x'; value: null; original: '-x' },
          { _tag: 'short-flag'; name: 'y'; value: null; original: '-y' },
          { _tag: 'short-flag'; name: 'z'; value: 'foo'; original: '-z=foo' },
        ]
        original: '-xyz=foo'
      },
      Arg.Analyze<'-xyz=foo'>
    >,
    Ts.Assert.exact<
      {
        _tag: 'short-flag-cluster'
        flags: [
          { _tag: 'short-flag'; name: 'v'; value: null; original: '-v' },
          { _tag: 'short-flag'; name: 'x'; value: null; original: '-x' },
          { _tag: 'short-flag'; name: 'f'; value: ''; original: '-f=' },
        ]
        original: '-vxf='
      },
      Arg.Analyze<'-vxf='>
    >,
    // Positional
    Ts.Assert.exact<
      { _tag: 'positional'; value: 'file.txt'; original: 'file.txt' },
      Arg.Analyze<'file.txt'>
    >,
    Ts.Assert.exact<
      { _tag: 'positional'; value: '123'; original: '123' },
      Arg.Analyze<'123'>
    >,
    Ts.Assert.exact<
      { _tag: 'positional'; value: './path/to/file'; original: './path/to/file' },
      Arg.Analyze<'./path/to/file'>
    >,
    Ts.Assert.exact<
      { _tag: 'positional'; value: 'https://example.com'; original: 'https://example.com' },
      Arg.Analyze<'https://example.com'>
    >,
    Ts.Assert.exact<
      { _tag: 'positional'; value: 'key=value'; original: 'key=value' },
      Arg.Analyze<'key=value'>
    >,
    // Separator
    Ts.Assert.exact<
      { _tag: 'separator'; original: '--' },
      Arg.Analyze<'--'>
    >,
    // Edge cases
    Ts.Assert.exact<
      { _tag: 'positional'; value: '---foo'; original: '---foo' },
      Arg.Analyze<'---foo'>
    >,
    Ts.Assert.exact<
      { _tag: 'positional'; value: ''; original: '' },
      Arg.Analyze<''>
    >
  >
})

// =============================================================================
// Runtime Analyzer Tests
// =============================================================================

// dprint-ignore
Test.on(Arg.analyze)
  .cases(
    // Long flags (non-negated)
    ['--verbose',        { _tag: 'long-flag',  name: 'verbose',    negated: false, value: null,  original: '--verbose' }],
    ['--foo-bar',        { _tag: 'long-flag',  name: 'fooBar',     negated: false, value: null,  original: '--foo-bar' }],
    ['--count=5',        { _tag: 'long-flag',  name: 'count',      negated: false, value: '5',   original: '--count=5' }],
    ['--max-count=10',   { _tag: 'long-flag',  name: 'maxCount',   negated: false, value: '10',  original: '--max-count=10' }],
    ['--query=a=b',      { _tag: 'long-flag',  name: 'query',      negated: false, value: 'a=b', original: '--query=a=b' }],
    ['--empty=',         { _tag: 'long-flag',  name: 'empty',      negated: false, value: '',    original: '--empty=' }],
    // Long flags (negated)
    ['--no-verbose',     { _tag: 'long-flag',  name: 'verbose',    negated: true,  value: null,  original: '--no-verbose' }],
    ['--no-debug',       { _tag: 'long-flag',  name: 'debug',      negated: true,  value: null,  original: '--no-debug' }],
    ['--no-debug-mode',  { _tag: 'long-flag',  name: 'debugMode',  negated: true,  value: null,  original: '--no-debug-mode' }],
    ['--no-verbose=true',{ _tag: 'long-flag',  name: 'verbose',    negated: true,  value: 'true', original: '--no-verbose=true' }],
    // Edge cases: NOT negated (lowercase after 'no')
    ['--notice',         { _tag: 'long-flag',  name: 'notice',     negated: false, value: null,  original: '--notice' }],
    ['--node',           { _tag: 'long-flag',  name: 'node',       negated: false, value: null,  original: '--node' }],
    // Short flags (single character)
    ['-v',               { _tag: 'short-flag', name: 'v',          value: null,  original: '-v' }],
    ['-n=10',            { _tag: 'short-flag', name: 'n',          value: '10',  original: '-n=10' }],
    ['-q=x=y',           { _tag: 'short-flag', name: 'q',          value: 'x=y', original: '-q=x=y' }],
    ['-e=',              { _tag: 'short-flag', name: 'e',          value: '',    original: '-e=' }],
    // Short flag clusters
    ['-ab',              { _tag: 'short-flag-cluster', flags: [{ _tag: 'short-flag', name: 'a', value: null, original: '-a' }, { _tag: 'short-flag', name: 'b', value: null, original: '-b' }], original: '-ab' }],
    ['-abc',             { _tag: 'short-flag-cluster', flags: [{ _tag: 'short-flag', name: 'a', value: null, original: '-a' }, { _tag: 'short-flag', name: 'b', value: null, original: '-b' }, { _tag: 'short-flag', name: 'c', value: null, original: '-c' }], original: '-abc' }],
    ['-xyz=foo',         { _tag: 'short-flag-cluster', flags: [{ _tag: 'short-flag', name: 'x', value: null, original: '-x' }, { _tag: 'short-flag', name: 'y', value: null, original: '-y' }, { _tag: 'short-flag', name: 'z', value: 'foo', original: '-z=foo' }], original: '-xyz=foo' }],
    ['-vxf=',            { _tag: 'short-flag-cluster', flags: [{ _tag: 'short-flag', name: 'v', value: null, original: '-v' }, { _tag: 'short-flag', name: 'x', value: null, original: '-x' }, { _tag: 'short-flag', name: 'f', value: '', original: '-f=' }], original: '-vxf=' }],
    // Positional
    ['file.txt',         { _tag: 'positional', value: 'file.txt',            original: 'file.txt' }],
    ['123',              { _tag: 'positional', value: '123',                 original: '123' }],
    ['./path/to/file',   { _tag: 'positional', value: './path/to/file',      original: './path/to/file' }],
    ['https://example.com', { _tag: 'positional', value: 'https://example.com', original: 'https://example.com' }],
    ['key=value',        { _tag: 'positional', value: 'key=value',           original: 'key=value' }],
    // Separator
    ['--',               { _tag: 'separator',  original: '--' }],
    // Edge cases
    ['---foo',           { _tag: 'positional', value: '---foo',              original: '---foo' }],
    ['',                 { _tag: 'positional', value: '',                    original: '' }],
  )
  .test()

// =============================================================================
// Effect Schema Tests
// =============================================================================

const decodeString = S.decodeSync(Arg.String) as (input: string) => Analysis

// Simple snapshot tests for Effect Schema decoding
test('Effect Schema decoding works', () => {
  const result1 = decodeString('--verbose')
  const result2 = decodeString('-v')
  const result3 = decodeString('file.txt')

  expect(result1._tag).toBe('long-flag')
  expect(result2._tag).toBe('short-flag')
  expect(result3._tag).toBe('positional')
})

test('Effect Schema decoding with negated flags', () => {
  const result1 = decodeString('--no-verbose')
  const result2 = decodeString('--no-debug-mode')

  expect(result1._tag).toBe('long-flag')
  if (result1._tag === 'long-flag') {
    expect(result1.name).toBe('verbose')
    expect(result1.negated).toBe(true)
  }

  expect(result2._tag).toBe('long-flag')
  if (result2._tag === 'long-flag') {
    expect(result2.name).toBe('debugMode')
    expect(result2.negated).toBe(true)
  }
})

test('Effect Schema decoding with short flag clusters', () => {
  const result1 = decodeString('-ab')
  const result2 = decodeString('-abc')
  const result3 = decodeString('-xyz=foo')

  expect(result1._tag).toBe('short-flag-cluster')
  if (result1._tag === 'short-flag-cluster') {
    expect(result1.flags).toHaveLength(2)
    expect(result1.flags[0].name).toBe('a')
    expect(result1.flags[1].name).toBe('b')
    expect(result1.flags[0].value).toBe(null)
    expect(result1.flags[1].value).toBe(null)
  }

  expect(result2._tag).toBe('short-flag-cluster')
  if (result2._tag === 'short-flag-cluster') {
    expect(result2.flags).toHaveLength(3)
    expect(result2.flags[0].name).toBe('a')
    expect(result2.flags[1].name).toBe('b')
    expect(result2.flags[2]!.name).toBe('c')
  }

  expect(result3._tag).toBe('short-flag-cluster')
  if (result3._tag === 'short-flag-cluster') {
    expect(result3.flags).toHaveLength(3)
    expect(result3.flags[0].value).toBe(null)
    expect(result3.flags[1].value).toBe(null)
    expect(result3.flags[2]!.value).toBe('foo') // Value on last flag only
  }
})

// =============================================================================
// fromString Tests
// =============================================================================

test('fromString with literal strings', () => {
  const arg1 = Arg.fromString('--verbose')
  const arg2 = Arg.fromString('-v')
  const arg3 = Arg.fromString('file.txt')
  const arg4 = Arg.fromString('--')

  // Runtime verification (types are already verified by fromString signature)
  expect(arg1._tag).toBe('long-flag')
  expect(arg2._tag).toBe('short-flag')
  expect(arg3._tag).toBe('positional')
  expect(arg4._tag).toBe('separator')
})

test('fromString with negated flags', () => {
  const arg1 = Arg.fromString('--no-verbose')
  const arg2 = Arg.fromString('--no-debug-mode')

  // Runtime verification (types are already verified by fromString signature)
  expect(arg1._tag).toBe('long-flag')
  if (arg1._tag === 'long-flag') {
    expect(arg1.name).toBe('verbose')
    expect(arg1.negated).toBe(true)
  }

  expect(arg2._tag).toBe('long-flag')
  if (arg2._tag === 'long-flag') {
    expect(arg2.name).toBe('debugMode')
    expect(arg2.negated).toBe(true)
  }
})

test('fromString with short flag clusters', () => {
  const arg1 = Arg.fromString('-ab')
  const arg2 = Arg.fromString('-abc')
  const arg3 = Arg.fromString('-xyz=foo')

  // Runtime verification (types are already verified by fromString signature)
  expect(arg1._tag).toBe('short-flag-cluster')
  if (arg1._tag === 'short-flag-cluster') {
    expect(arg1.flags).toHaveLength(2)
    expect(arg1.flags[0].name).toBe('a')
    expect(arg1.flags[1].name).toBe('b')
  }

  expect(arg2._tag).toBe('short-flag-cluster')
  if (arg2._tag === 'short-flag-cluster') {
    expect(arg2.flags).toHaveLength(3)
  }

  expect(arg3._tag).toBe('short-flag-cluster')
  if (arg3._tag === 'short-flag-cluster') {
    expect(arg3.flags[2].value).toBe('foo') // Value on last flag only
  }
})
