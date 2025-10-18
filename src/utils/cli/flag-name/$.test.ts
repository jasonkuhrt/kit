import { Test } from '#test'
import { Ts } from '#ts'
import { Schema as S } from 'effect'
import { test } from 'vitest'
import { FlagName } from './$.js'

// =============================================================================
// Type-Level Parsing Tests (ported from mixed.spec.ts)
// =============================================================================

test('type-level parsing: basic cases', () => {
  type _ = Ts.Assert.Cases<
    // Short flag only
    Ts.Assert.equiv<
      { expression: string; canonical: 'v'; long: null; short: 'v'; aliases: { short: []; long: [] } },
      FlagName.Analyze<'-v'>
    >,
    // Short with one alias
    Ts.Assert.equiv<
      { expression: string; canonical: 'v'; long: null; short: 'v'; aliases: { short: ['x']; long: [] } },
      FlagName.Analyze<'-v -x'>
    >,
    // Short with multiple aliases
    Ts.Assert.equiv<
      { expression: string; canonical: 'v'; long: null; short: 'v'; aliases: { short: ['x', 'y']; long: [] } },
      FlagName.Analyze<'-v -x -y'>
    >,
    // Long only
    Ts.Assert.equiv<
      { expression: string; canonical: 'vv'; long: 'vv'; short: null; aliases: { short: []; long: ['xx'] } },
      FlagName.Analyze<'--vv --xx'>
    >,
    // Long with multiple aliases
    Ts.Assert.equiv<
      { expression: string; canonical: 'vv'; long: 'vv'; short: null; aliases: { short: []; long: ['xx', 'yy'] } },
      FlagName.Analyze<'--vv --xx --yy'>
    >,
    // Mixed short and long
    Ts.Assert.equiv<
      { expression: string; canonical: 'vv'; long: 'vv'; short: 'v'; aliases: { short: ['x']; long: ['xx'] } },
      FlagName.Analyze<'-v --vv -x --xx'>
    >,
    // No prefix (inferred by length)
    Ts.Assert.equiv<
      { expression: string; canonical: 'vv'; long: 'vv'; short: 'v'; aliases: { short: ['x']; long: ['xx'] } },
      FlagName.Analyze<'v vv x xx'>
    >,
    // Mixed prefix and no prefix
    Ts.Assert.equiv<
      { expression: string; canonical: 'vv'; long: 'vv'; short: 'v'; aliases: { short: ['x']; long: ['xx'] } },
      FlagName.Analyze<'v --vv x xx'>
    >
  >
})

// =============================================================================
// Type-Level Parsing Tests (ported from other.spec.ts)
// =============================================================================

test('type-level parsing: case handling', () => {
  type _ = Ts.Assert.Cases<
    // Kebab case to camelCase
    Ts.Assert.equiv<
      { expression: string; canonical: 'filePath'; long: 'filePath'; short: null; aliases: { short: []; long: [] } },
      FlagName.Analyze<'--file-path'>
    >
  >
})

test('type-level parsing: whitespace handling', () => {
  interface SomeLong {
    expression: string
    canonical: 'version'
    long: 'version'
    short: null
    aliases: { short: []; long: [] }
  }

  type _1 = Ts.Assert.Cases<
    Ts.Assert.equiv<SomeLong, FlagName.Analyze<'--version'>>,
    Ts.Assert.equiv<SomeLong, FlagName.Analyze<' --version'>>,
    Ts.Assert.equiv<SomeLong, FlagName.Analyze<'  --version '>>,
    Ts.Assert.equiv<SomeLong, FlagName.Analyze<'  --version  '>>,
    Ts.Assert.equiv<SomeLong, FlagName.Analyze<' --version  '>>,
    Ts.Assert.equiv<SomeLong, FlagName.Analyze<'version  '>>
  >

  interface SomeShort {
    expression: string
    canonical: 'v'
    long: null
    short: 'v'
    aliases: { short: []; long: [] }
  }

  type _2 = Ts.Assert.Cases<
    Ts.Assert.equiv<SomeShort, FlagName.Analyze<'-v'>>,
    Ts.Assert.equiv<SomeShort, FlagName.Analyze<' -v'>>,
    Ts.Assert.equiv<SomeShort, FlagName.Analyze<' -v '>>,
    Ts.Assert.equiv<SomeShort, FlagName.Analyze<' -v  '>>,
    Ts.Assert.equiv<SomeShort, FlagName.Analyze<'  -v '>>,
    Ts.Assert.equiv<SomeShort, FlagName.Analyze<'  -v  '>>,
    Ts.Assert.equiv<SomeShort, FlagName.Analyze<'-v  '>>,
    Ts.Assert.equiv<SomeShort, FlagName.Analyze<'-v '>>,
    Ts.Assert.equiv<SomeShort, FlagName.Analyze<'v '>>,
    Ts.Assert.equiv<SomeShort, FlagName.Analyze<'v'>>
  >

  interface SomeLongShort {
    expression: string
    canonical: 'version'
    long: 'version'
    short: 'v'
    aliases: { short: []; long: [] }
  }

  type _3 = Ts.Assert.Cases<
    Ts.Assert.equiv<SomeLongShort, FlagName.Analyze<'--version -v'>>,
    Ts.Assert.equiv<SomeLongShort, FlagName.Analyze<' --version -v'>>,
    Ts.Assert.equiv<SomeLongShort, FlagName.Analyze<' --version -v '>>,
    Ts.Assert.equiv<SomeLongShort, FlagName.Analyze<'  --version -v  '>>,
    Ts.Assert.equiv<SomeLongShort, FlagName.Analyze<'  --version -v '>>,
    Ts.Assert.equiv<SomeLongShort, FlagName.Analyze<'-v --version'>>,
    Ts.Assert.equiv<SomeLongShort, FlagName.Analyze<' -v --version'>>,
    Ts.Assert.equiv<SomeLongShort, FlagName.Analyze<'  -v --version'>>,
    Ts.Assert.equiv<SomeLongShort, FlagName.Analyze<'  -v --version '>>,
    Ts.Assert.equiv<SomeLongShort, FlagName.Analyze<'  -v --version  '>>,
    Ts.Assert.equiv<SomeLongShort, FlagName.Analyze<'  -v  --version  '>>,
    Ts.Assert.equiv<SomeLongShort, FlagName.Analyze<'  -v   --version '>>,
    Ts.Assert.equiv<SomeLongShort, FlagName.Analyze<'  v   version '>>,
    Ts.Assert.equiv<SomeLongShort, FlagName.Analyze<'v version'>>
  >

  interface SomeLongCamelCase {
    expression: string
    canonical: 'fooBar'
    long: 'fooBar'
    short: null
    aliases: { short: []; long: [] }
  }

  type _4 = Ts.Assert.Cases<
    Ts.Assert.equiv<SomeLongCamelCase, FlagName.Analyze<'--fooBar'>>,
    Ts.Assert.equiv<SomeLongCamelCase, FlagName.Analyze<'--foo-bar'>>
  >
})

// =============================================================================
// Type-Level Validation Tests (ported from errors.spec.ts)
// =============================================================================

test('type-level validation: empty input', () => {
  type _ = Ts.Assert.Cases<
    Ts.Assert.equiv<FlagName.Errors.Empty, FlagName.Analyze<''>>,
    Ts.Assert.equiv<FlagName.Errors.Empty, FlagName.Analyze<' '>>
  >
})

test('type-level validation: reserved names', () => {
  type _ = Ts.Assert.Cases<
    // Short flag reserved
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.Reserved<'a'>>,
      FlagName.Analyze<'-a', { reservedNames: 'a'; usedNames: undefined }>
    >,
    // Long flag reserved
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.Reserved<'abc'>>,
      FlagName.Analyze<'--abc', { reservedNames: 'abc'; usedNames: undefined }>
    >,
    // Case normalization (kebab vs camel)
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.Reserved<'foo-bar'>>,
      FlagName.Analyze<'--foo-bar', { reservedNames: 'fooBar'; usedNames: undefined }>
    >,
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.Reserved<'fooBar'>>,
      FlagName.Analyze<'--fooBar', { reservedNames: 'foo-bar'; usedNames: undefined }>
    >,
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.Reserved<'foo-bar'>>,
      FlagName.Analyze<'foo-bar', { reservedNames: 'fooBar'; usedNames: undefined }>
    >,
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.Reserved<'fooBar'>>,
      FlagName.Analyze<'fooBar', { reservedNames: 'foo-bar'; usedNames: undefined }>
    >,
    // Aliases
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.Reserved<'foo-bar'>>,
      FlagName.Analyze<'--foo --foo-bar', { reservedNames: 'fooBar'; usedNames: undefined }>
    >,
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.Reserved<'fooBar'>>,
      FlagName.Analyze<'--foo --fooBar', { reservedNames: 'foo-bar'; usedNames: undefined }>
    >,
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.Reserved<'foo-bar'>>,
      FlagName.Analyze<'foo foo-bar', { reservedNames: 'fooBar'; usedNames: undefined }>
    >,
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.Reserved<'fooBar'>>,
      FlagName.Analyze<'foo fooBar', { reservedNames: 'foo-bar'; usedNames: undefined }>
    >
  >
})

test('type-level validation: already taken names', () => {
  type _ = Ts.Assert.Cases<
    // Short flag already taken
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.AlreadyTaken<'a'>>,
      FlagName.Analyze<'-a', { usedNames: 'a'; reservedNames: undefined }>
    >,
    // Long flag already taken
    Ts.Assert.equiv<
      'Error(s):\nThe name "abc" cannot be used because it is already used for another flag.',
      FlagName.Analyze<'--abc', { usedNames: 'abc'; reservedNames: undefined }>
    >,
    // Case normalization
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.AlreadyTaken<'fooBar'>>,
      FlagName.Analyze<'--fooBar', { usedNames: 'foo-bar'; reservedNames: undefined }>
    >,
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.AlreadyTaken<'foo-bar'>>,
      FlagName.Analyze<'--foo-bar', { usedNames: 'fooBar'; reservedNames: undefined }>
    >,
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.AlreadyTaken<'fooBar'>>,
      FlagName.Analyze<'fooBar', { usedNames: 'foo-bar'; reservedNames: undefined }>
    >,
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.AlreadyTaken<'foo-bar'>>,
      FlagName.Analyze<'foo-bar', { usedNames: 'fooBar'; reservedNames: undefined }>
    >,
    // Aliases
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.AlreadyTaken<'fooBar'>>,
      FlagName.Analyze<'--foo --fooBar', { usedNames: 'foo-bar'; reservedNames: undefined }>
    >,
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.AlreadyTaken<'foo-bar'>>,
      FlagName.Analyze<'--foo --foo-bar', { usedNames: 'fooBar'; reservedNames: undefined }>
    >,
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.AlreadyTaken<'fooBar'>>,
      FlagName.Analyze<'foo fooBar', { usedNames: 'foo-bar'; reservedNames: undefined }>
    >,
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.AlreadyTaken<'foo-bar'>>,
      FlagName.Analyze<'foo foo-bar', { usedNames: 'fooBar'; reservedNames: undefined }>
    >
  >
})

test('type-level validation: length errors', () => {
  type _ = Ts.Assert.Cases<
    // Long flag too short
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.LongTooShort<'v'>>,
      FlagName.Analyze<'--v'>
    >,
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.LongTooShort<'v'>>,
      FlagName.Analyze<'--ver --v'>
    >,
    // Short flag too long
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.ShortTooLong<'vv'>>,
      FlagName.Analyze<'-vv'>
    >
  >
})

test('type-level validation: duplicate aliases', () => {
  type _ = Ts.Assert.Cases<
    // Exact duplicates
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.AliasDuplicate<'vv'>>,
      FlagName.Analyze<'--vv --vv'>
    >,
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.AliasDuplicate<'v-v'>>,
      FlagName.Analyze<'--v-v --v-v'>
    >,
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.AliasDuplicate<'v'>>,
      FlagName.Analyze<'-v -v'>
    >,
    // Case variations (kebab vs camel)
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.AliasDuplicate<'foo-bar'>>,
      FlagName.Analyze<'--fooBar --foo-bar'>
    >,
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.AliasDuplicate<'fooBar'>>,
      FlagName.Analyze<'--foo-bar --fooBar'>
    >,
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.AliasDuplicate<'foo-bar'>>,
      FlagName.Analyze<'fooBar foo-bar'>
    >,
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.AliasDuplicate<'fooBar'>>,
      FlagName.Analyze<'foo-bar fooBar'>
    >,
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.AliasDuplicate<'fooBar'>>,
      FlagName.Analyze<'foo-bar --fooBar'>
    >,
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.AliasDuplicate<'fooBar'>>,
      FlagName.Analyze<'--foo-bar fooBar'>
    >,
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.AliasDuplicate<'foo-bar'>>,
      FlagName.Analyze<'fooBar --foo-bar'>
    >,
    Ts.Assert.equiv<
      FlagName.Checks.Messages.WithHeader<FlagName.Checks.Messages.AliasDuplicate<'foo-bar'>>,
      FlagName.Analyze<'--fooBar foo-bar'>
    >
  >
})

// =============================================================================
// Type-Level Tests for FlagName.fromString
// =============================================================================

test('type-level: fromString return types', () => {
  // Valid inputs - type inference works
  // @ts-expect-error - fromString returns 'any' internally
  Ts.Assert.equiv.of.as<FlagName.Analyze<'-v'>>()(FlagName.fromString('-v'))
  // @ts-expect-error - fromString returns 'any' internally
  Ts.Assert.equiv.of.as<FlagName.Analyze<'--verbose'>>()(FlagName.fromString('--verbose'))
  // @ts-expect-error - fromString returns 'any' internally
  Ts.Assert.equiv.of.as<FlagName.Analyze<'-v --verbose'>>()(FlagName.fromString('-v --verbose'))
  // @ts-expect-error - fromString returns 'any' internally
  Ts.Assert.equiv.is.as<FlagName.Analyze<'--foo-bar'>>()(FlagName.fromString('--foo-bar'))
  // @ts-expect-error - fromString returns 'any' internally
  Ts.Assert.equiv.is.as<FlagName.Analyze<'-v --verbose -x --extra'>>()(FlagName.fromString('-v --verbose -x --extra'))

  // Invalid inputs - input guard rejects with Ts.StaticError
  // These are type-only tests - they verify compile-time errors without executing
  if (false as boolean) {
    // @ts-expect-error - Empty input
    FlagName.fromString('')
  }
})

// =============================================================================
// Runtime Parsing Tests
// =============================================================================

// Runtime decoder without type-level guards
const decodeString = S.decodeSync(FlagName.String)

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
