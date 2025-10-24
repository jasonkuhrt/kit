import { Test } from '#test'
import { Ts } from '#ts'
import { Schema as S } from 'effect'
import { expect, test } from 'vitest'
import { Param } from './param.js'

// =============================================================================
// Type-Level Parsing Tests
// =============================================================================

test('type-level parsing', () => {
  type _pass = Ts.Assert.Cases<
    // Short only
    Ts.Assert.equiv<
      { expression: string; canonical: 'v'; long: null; short: 'v'; aliases: { short: []; long: [] } },
      Param.Analyze<'-v'>
    >,
    // Short with aliases
    Ts.Assert.equiv<
      { expression: string; canonical: 'v'; long: null; short: 'v'; aliases: { short: ['x']; long: [] } },
      Param.Analyze<'-v -x'>
    >,
    // Long only
    Ts.Assert.equiv<
      { expression: string; canonical: 'vv'; long: 'vv'; short: null; aliases: { short: []; long: ['xx'] } },
      Param.Analyze<'--vv --xx'>
    >,
    // Mixed short and long
    Ts.Assert.equiv<
      { expression: string; canonical: 'vv'; long: 'vv'; short: 'v'; aliases: { short: ['x']; long: ['xx'] } },
      Param.Analyze<'-v --vv -x --xx'>
    >,
    // Kebab case to camelCase
    Ts.Assert.equiv<
      { expression: string; canonical: 'filePath'; long: 'filePath'; short: null; aliases: { short: []; long: [] } },
      Param.Analyze<'--file-path'>
    >,
    // No prefix (inferred by length)
    Ts.Assert.equiv<
      { expression: string; canonical: 'vv'; long: 'vv'; short: 'v'; aliases: { short: ['x']; long: ['xx'] } },
      Param.Analyze<'v vv x xx'>
    >
  >
})

test('type-level validation errors', () => {
  type _pass = Ts.Assert.Cases<
    // Empty input - check it's an error
    Ts.Assert.exact.true<Ts.Err.Is<Param.Analyze<''>>>,
    Ts.Assert.exact.true<Ts.Err.Is<Param.Analyze<' '>>>,
    // Long flag too short - check it's an error
    Ts.Assert.exact.true<Ts.Err.Is<Param.Analyze<'--v'>>>,
    // Short flag too long - check it's an error
    Ts.Assert.exact.true<Ts.Err.Is<Param.Analyze<'-vv'>>>,
    // Duplicate aliases - check it's an error
    Ts.Assert.exact.true<Ts.Err.Is<Param.Analyze<'--vv --vv'>>>
  >
})

// =============================================================================
// Runtime Analyzer Tests
// =============================================================================

// dprint-ignore
Test.on(Param.analyze)
  .cases(
    ['-v',                  { expression: '-v', canonical: 'v', short: 'v', long: null, aliases: { short: [], long: [] } }],
    ['--verbose',           { expression: '--verbose', canonical: 'verbose', short: null, long: 'verbose', aliases: { short: [], long: [] } }],
    ['-v --verbose',        { expression: '-v --verbose', canonical: 'verbose', short: 'v', long: 'verbose', aliases: { short: [], long: [] } }],
    ['--foo-bar',           { expression: '--foo-bar', canonical: 'fooBar', short: null, long: 'fooBar', aliases: { short: [], long: [] } }],
    ['-v --verbose -x --extra', { expression: '-v --verbose -x --extra', canonical: 'verbose', short: 'v', long: 'verbose', aliases: { short: ['x'], long: ['extra'] } }],
    ['v verbose x extra',   { expression: 'v verbose x extra', canonical: 'verbose', short: 'v', long: 'verbose', aliases: { short: ['x'], long: ['extra'] } }],
  )
  .test()

// =============================================================================
// Effect Schema Tests
// =============================================================================

const decodeString = S.decodeSync(Param.String)

// dprint-ignore
Test.on(decodeString)
  .describeInputs('success', [
    ['-v'],
    ['--verbose'],
    ['-v --verbose'],
    ['--foo-bar'],
    ['-v --verbose -x --extra'],
    ['v verbose x extra'],
  ])
  .describeInputs('error', [
    [''],
    [' '],
    ['--v'],
    ['-vv'],
    ['--foo --foo'],
    ['-v -v'],
  ])
  .test()

// =============================================================================
// fromString Tests
// =============================================================================

test('fromString with literal strings', () => {
  const param1 = Param.fromString('-v --verbose')
  const param2 = Param.fromString('--foo-bar')
  const param3 = Param.fromString('-v')

  // Runtime verification (types are already verified by fromString signature)
  expect(param1.canonical).toBe('verbose')
  expect(param2.canonical).toBe('fooBar')
  expect(param3.canonical).toBe('v')
})
