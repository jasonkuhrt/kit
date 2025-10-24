import { Test } from '#test'
import { Ts } from '#ts'
import { Schema as S } from 'effect'
import { expect, test } from 'vitest'
import { Arg } from './arg.js'

// =============================================================================
// Type-Level Analysis Tests
// =============================================================================

test('type-level analysis', () => {
  type _pass = Ts.Assert.Cases<
    // Long flags
    Ts.Assert.equiv<
      { _tag: 'long-flag'; name: 'verbose'; value: null; original: '--verbose' },
      Arg.Analyze<'--verbose'>
    >,
    Ts.Assert.equiv<
      { _tag: 'long-flag'; name: 'fooBar'; value: null; original: '--foo-bar' },
      Arg.Analyze<'--foo-bar'>
    >,
    Ts.Assert.equiv<
      { _tag: 'long-flag'; name: 'count'; value: '5'; original: '--count=5' },
      Arg.Analyze<'--count=5'>
    >,
    Ts.Assert.equiv<
      { _tag: 'long-flag'; name: 'maxCount'; value: '10'; original: '--max-count=10' },
      Arg.Analyze<'--max-count=10'>
    >,
    Ts.Assert.equiv<
      { _tag: 'long-flag'; name: 'query'; value: 'a=b'; original: '--query=a=b' },
      Arg.Analyze<'--query=a=b'>
    >,
    Ts.Assert.equiv<
      { _tag: 'long-flag'; name: 'empty'; value: ''; original: '--empty=' },
      Arg.Analyze<'--empty='>
    >,
    // Short flags
    Ts.Assert.equiv<
      { _tag: 'short-flag'; name: 'v'; value: null; original: '-v' },
      Arg.Analyze<'-v'>
    >,
    Ts.Assert.equiv<
      { _tag: 'short-flag'; name: 'n'; value: '10'; original: '-n=10' },
      Arg.Analyze<'-n=10'>
    >,
    Ts.Assert.equiv<
      { _tag: 'short-flag'; name: 'q'; value: 'x=y'; original: '-q=x=y' },
      Arg.Analyze<'-q=x=y'>
    >,
    Ts.Assert.equiv<
      { _tag: 'short-flag'; name: 'e'; value: ''; original: '-e=' },
      Arg.Analyze<'-e='>
    >,
    // Positional
    Ts.Assert.equiv<
      { _tag: 'positional'; value: 'file.txt'; original: 'file.txt' },
      Arg.Analyze<'file.txt'>
    >,
    Ts.Assert.equiv<
      { _tag: 'positional'; value: '123'; original: '123' },
      Arg.Analyze<'123'>
    >,
    Ts.Assert.equiv<
      { _tag: 'positional'; value: './path/to/file'; original: './path/to/file' },
      Arg.Analyze<'./path/to/file'>
    >,
    Ts.Assert.equiv<
      { _tag: 'positional'; value: 'https://example.com'; original: 'https://example.com' },
      Arg.Analyze<'https://example.com'>
    >,
    Ts.Assert.equiv<
      { _tag: 'positional'; value: 'key=value'; original: 'key=value' },
      Arg.Analyze<'key=value'>
    >,
    // Separator
    Ts.Assert.equiv<
      { _tag: 'separator'; original: '--' },
      Arg.Analyze<'--'>
    >,
    // Edge cases
    Ts.Assert.equiv<
      { _tag: 'positional'; value: '---foo'; original: '---foo' },
      Arg.Analyze<'---foo'>
    >,
    Ts.Assert.equiv<
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
    // Long flags
    ['--verbose',        { _tag: 'long-flag',  name: 'verbose',  value: null,  original: '--verbose' }],
    ['--foo-bar',        { _tag: 'long-flag',  name: 'fooBar',   value: null,  original: '--foo-bar' }],
    ['--count=5',        { _tag: 'long-flag',  name: 'count',    value: '5',   original: '--count=5' }],
    ['--max-count=10',   { _tag: 'long-flag',  name: 'maxCount', value: '10',  original: '--max-count=10' }],
    ['--query=a=b',      { _tag: 'long-flag',  name: 'query',    value: 'a=b', original: '--query=a=b' }],
    ['--empty=',         { _tag: 'long-flag',  name: 'empty',    value: '',    original: '--empty=' }],
    // Short flags
    ['-v',               { _tag: 'short-flag', name: 'v',        value: null,  original: '-v' }],
    ['-n=10',            { _tag: 'short-flag', name: 'n',        value: '10',  original: '-n=10' }],
    ['-q=x=y',           { _tag: 'short-flag', name: 'q',        value: 'x=y', original: '-q=x=y' }],
    ['-e=',              { _tag: 'short-flag', name: 'e',        value: '',    original: '-e=' }],
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

const decodeString = S.decodeSync(Arg.String)

// Simple snapshot tests for Effect Schema decoding
test('Effect Schema decoding works', () => {
  const result1 = decodeString('--verbose')
  const result2 = decodeString('-v')
  const result3 = decodeString('file.txt')

  expect(result1._tag).toBe('long-flag')
  expect(result2._tag).toBe('short-flag')
  expect(result3._tag).toBe('positional')
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
