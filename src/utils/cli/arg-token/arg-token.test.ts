import { Test } from '#test'
import { Ts } from '#ts'
import { Schema as S } from 'effect'
import { describe, expect, test } from 'vitest'
import { ArgToken } from './arg-token.js'
import * as Analyzer from './analyzer.js'

// =============================================================================
// Type-Level Analysis Tests
// =============================================================================

test('type-level analysis: long flags', () => {
  type _pass = Ts.Assert.Cases<
    // Long flag without value
    Ts.Assert.equiv<
      { _tag: 'long-flag'; name: 'verbose'; value: null; original: '--verbose' },
      ArgToken.Analyze<'--verbose'>
    >,
    // Long flag with kebab-case → camelCase
    Ts.Assert.equiv<
      { _tag: 'long-flag'; name: 'fooBar'; value: null; original: '--foo-bar' },
      ArgToken.Analyze<'--foo-bar'>
    >,
    // Long flag with equals value
    Ts.Assert.equiv<
      { _tag: 'long-flag'; name: 'count'; value: '5'; original: '--count=5' },
      ArgToken.Analyze<'--count=5'>
    >,
    // Long flag with equals and kebab-case
    Ts.Assert.equiv<
      { _tag: 'long-flag'; name: 'maxCount'; value: '10'; original: '--max-count=10' },
      ArgToken.Analyze<'--max-count=10'>
    >,
    // Long flag with equals containing equals
    Ts.Assert.equiv<
      { _tag: 'long-flag'; name: 'query'; value: 'a=b'; original: '--query=a=b' },
      ArgToken.Analyze<'--query=a=b'>
    >,
    // Long flag with empty value after equals
    Ts.Assert.equiv<
      { _tag: 'long-flag'; name: 'empty'; value: ''; original: '--empty=' },
      ArgToken.Analyze<'--empty='>
    >
  >
})

test('type-level analysis: short flags', () => {
  type _pass = Ts.Assert.Cases<
    // Short flag without value
    Ts.Assert.equiv<
      { _tag: 'short-flag'; name: 'v'; value: null; original: '-v' },
      ArgToken.Analyze<'-v'>
    >,
    // Short flag with equals value
    Ts.Assert.equiv<
      { _tag: 'short-flag'; name: 'n'; value: '10'; original: '-n=10' },
      ArgToken.Analyze<'-n=10'>
    >,
    // Short flag with equals containing equals
    Ts.Assert.equiv<
      { _tag: 'short-flag'; name: 'q'; value: 'x=y'; original: '-q=x=y' },
      ArgToken.Analyze<'-q=x=y'>
    >,
    // Short flag with empty value after equals
    Ts.Assert.equiv<
      { _tag: 'short-flag'; name: 'e'; value: ''; original: '-e=' },
      ArgToken.Analyze<'-e='>
    >
  >
})

test('type-level analysis: positional arguments', () => {
  type _pass = Ts.Assert.Cases<
    // Plain filename
    Ts.Assert.equiv<
      { _tag: 'positional'; value: 'file.txt'; original: 'file.txt' },
      ArgToken.Analyze<'file.txt'>
    >,
    // Number
    Ts.Assert.equiv<
      { _tag: 'positional'; value: '123'; original: '123' },
      ArgToken.Analyze<'123'>
    >,
    // Path
    Ts.Assert.equiv<
      { _tag: 'positional'; value: './path/to/file'; original: './path/to/file' },
      ArgToken.Analyze<'./path/to/file'>
    >,
    // URL
    Ts.Assert.equiv<
      { _tag: 'positional'; value: 'https://example.com'; original: 'https://example.com' },
      ArgToken.Analyze<'https://example.com'>
    >,
    // String with equals
    Ts.Assert.equiv<
      { _tag: 'positional'; value: 'key=value'; original: 'key=value' },
      ArgToken.Analyze<'key=value'>
    >
  >
})

test('type-level analysis: separator', () => {
  type _pass = Ts.Assert.Cases<
    Ts.Assert.equiv<
      { _tag: 'separator'; original: '--' },
      ArgToken.Analyze<'--'>
    >
  >
})

test('type-level analysis: edge cases', () => {
  type _pass = Ts.Assert.Cases<
    // Malformed: three dashes → positional
    Ts.Assert.equiv<
      { _tag: 'positional'; value: '---foo'; original: '---foo' },
      ArgToken.Analyze<'---foo'>
    >,
    // Empty string → positional
    Ts.Assert.equiv<
      { _tag: 'positional'; value: ''; original: '' },
      ArgToken.Analyze<''>
    >
  >
})

// =============================================================================
// Runtime Analyzer Tests
// =============================================================================

describe('runtime analyzer', () => {
  test('long flags', () => {
    expect(Analyzer.analyze('--verbose')).toEqual({
      _tag: 'long-flag',
      name: 'verbose',
      value: null,
      original: '--verbose',
    })

    expect(Analyzer.analyze('--foo-bar')).toEqual({
      _tag: 'long-flag',
      name: 'fooBar',
      value: null,
      original: '--foo-bar',
    })

    expect(Analyzer.analyze('--count=5')).toEqual({
      _tag: 'long-flag',
      name: 'count',
      value: '5',
      original: '--count=5',
    })

    expect(Analyzer.analyze('--max-count=10')).toEqual({
      _tag: 'long-flag',
      name: 'maxCount',
      value: '10',
      original: '--max-count=10',
    })

    expect(Analyzer.analyze('--query=a=b')).toEqual({
      _tag: 'long-flag',
      name: 'query',
      value: 'a=b',
      original: '--query=a=b',
    })

    expect(Analyzer.analyze('--empty=')).toEqual({
      _tag: 'long-flag',
      name: 'empty',
      value: '',
      original: '--empty=',
    })
  })

  test('short flags', () => {
    expect(Analyzer.analyze('-v')).toEqual({
      _tag: 'short-flag',
      name: 'v',
      value: null,
      original: '-v',
    })

    expect(Analyzer.analyze('-n=10')).toEqual({
      _tag: 'short-flag',
      name: 'n',
      value: '10',
      original: '-n=10',
    })

    expect(Analyzer.analyze('-q=x=y')).toEqual({
      _tag: 'short-flag',
      name: 'q',
      value: 'x=y',
      original: '-q=x=y',
    })

    expect(Analyzer.analyze('-e=')).toEqual({
      _tag: 'short-flag',
      name: 'e',
      value: '',
      original: '-e=',
    })
  })

  test('positional arguments', () => {
    expect(Analyzer.analyze('file.txt')).toEqual({
      _tag: 'positional',
      value: 'file.txt',
      original: 'file.txt',
    })

    expect(Analyzer.analyze('123')).toEqual({
      _tag: 'positional',
      value: '123',
      original: '123',
    })

    expect(Analyzer.analyze('./path/to/file')).toEqual({
      _tag: 'positional',
      value: './path/to/file',
      original: './path/to/file',
    })

    expect(Analyzer.analyze('https://example.com')).toEqual({
      _tag: 'positional',
      value: 'https://example.com',
      original: 'https://example.com',
    })

    expect(Analyzer.analyze('key=value')).toEqual({
      _tag: 'positional',
      value: 'key=value',
      original: 'key=value',
    })
  })

  test('separator', () => {
    expect(Analyzer.analyze('--')).toEqual({
      _tag: 'separator',
      original: '--',
    })
  })

  test('edge cases', () => {
    // Malformed: three dashes
    expect(Analyzer.analyze('---foo')).toEqual({
      _tag: 'positional',
      value: '---foo',
      original: '---foo',
    })

    // Empty string
    expect(Analyzer.analyze('')).toEqual({
      _tag: 'positional',
      value: '',
      original: '',
    })
  })
})

// =============================================================================
// Effect Schema Tests
// =============================================================================

describe('Effect Schema decoding', () => {
  const decodeString = S.decodeSync(ArgToken.String)

  test('long flags', () => {
    const result = decodeString('--verbose')
    expect(result).toMatchObject({
      _tag: 'long-flag',
      name: 'verbose',
      value: null,
      original: '--verbose',
    })
  })

  test('short flags', () => {
    const result = decodeString('-v')
    expect(result).toMatchObject({
      _tag: 'short-flag',
      name: 'v',
      value: null,
      original: '-v',
    })
  })

  test('positional arguments', () => {
    const result = decodeString('file.txt')
    expect(result).toMatchObject({
      _tag: 'positional',
      value: 'file.txt',
      original: 'file.txt',
    })
  })

  test('separator', () => {
    const result = decodeString('--')
    expect(result).toMatchObject({
      _tag: 'separator',
      original: '--',
    })
  })
})

// =============================================================================
// fromString Tests
// =============================================================================

test('fromString with literal strings', () => {
  // These tests verify both runtime behavior and type inference
  const token1 = ArgToken.fromString('--verbose')
  expect(token1).toMatchObject({
    _tag: 'long-flag',
    name: 'verbose',
    value: null,
  })

  const token2 = ArgToken.fromString('-v')
  expect(token2).toMatchObject({
    _tag: 'short-flag',
    name: 'v',
    value: null,
  })

  const token3 = ArgToken.fromString('file.txt')
  expect(token3).toMatchObject({
    _tag: 'positional',
    value: 'file.txt',
  })

  const token4 = ArgToken.fromString('--')
  expect(token4).toMatchObject({
    _tag: 'separator',
  })
})
