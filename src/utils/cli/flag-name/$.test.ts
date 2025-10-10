import { Test } from '#test'
import { Ts } from '#ts'
import { Schema as S } from 'effect'
import { test } from 'vitest'
import type { Analyze, Errors } from './$$.js'
import { Checks, FlagName } from './$$.js'

// =============================================================================
// Type-Level Parsing Tests (ported from mixed.spec.ts)
// =============================================================================

test('type-level parsing: basic cases', () => {
  type _ = Ts.Test.Cases<
    // Short flag only
    Ts.Test.bid<
      { expression: string; canonical: 'v'; long: null; short: 'v'; aliases: { short: []; long: [] } },
      Analyze<'-v'>
    >,
    // Short with one alias
    Ts.Test.bid<
      { expression: string; canonical: 'v'; long: null; short: 'v'; aliases: { short: ['x']; long: [] } },
      Analyze<'-v -x'>
    >,
    // Short with multiple aliases
    Ts.Test.bid<
      { expression: string; canonical: 'v'; long: null; short: 'v'; aliases: { short: ['x', 'y']; long: [] } },
      Analyze<'-v -x -y'>
    >,
    // Long only
    Ts.Test.bid<
      { expression: string; canonical: 'vv'; long: 'vv'; short: null; aliases: { short: []; long: ['xx'] } },
      Analyze<'--vv --xx'>
    >,
    // Long with multiple aliases
    Ts.Test.bid<
      { expression: string; canonical: 'vv'; long: 'vv'; short: null; aliases: { short: []; long: ['xx', 'yy'] } },
      Analyze<'--vv --xx --yy'>
    >,
    // Mixed short and long
    Ts.Test.bid<
      { expression: string; canonical: 'vv'; long: 'vv'; short: 'v'; aliases: { short: ['x']; long: ['xx'] } },
      Analyze<'-v --vv -x --xx'>
    >,
    // No prefix (inferred by length)
    Ts.Test.bid<
      { expression: string; canonical: 'vv'; long: 'vv'; short: 'v'; aliases: { short: ['x']; long: ['xx'] } },
      Analyze<'v vv x xx'>
    >,
    // Mixed prefix and no prefix
    Ts.Test.bid<
      { expression: string; canonical: 'vv'; long: 'vv'; short: 'v'; aliases: { short: ['x']; long: ['xx'] } },
      Analyze<'v --vv x xx'>
    >
  >
})

// =============================================================================
// Type-Level Parsing Tests (ported from other.spec.ts)
// =============================================================================

test('type-level parsing: case handling', () => {
  type _ = Ts.Test.Cases<
    // Kebab case to camelCase
    Ts.Test.bid<
      { expression: string; canonical: 'filePath'; long: 'filePath'; short: null; aliases: { short: []; long: [] } },
      Analyze<'--file-path'>
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

  type _1 = Ts.Test.Cases<
    Ts.Test.bid<SomeLong, Analyze<'--version'>>,
    Ts.Test.bid<SomeLong, Analyze<' --version'>>,
    Ts.Test.bid<SomeLong, Analyze<'  --version '>>,
    Ts.Test.bid<SomeLong, Analyze<'  --version  '>>,
    Ts.Test.bid<SomeLong, Analyze<' --version  '>>,
    Ts.Test.bid<SomeLong, Analyze<'version  '>>
  >

  interface SomeShort {
    expression: string
    canonical: 'v'
    long: null
    short: 'v'
    aliases: { short: []; long: [] }
  }

  type _2 = Ts.Test.Cases<
    Ts.Test.bid<SomeShort, Analyze<'-v'>>,
    Ts.Test.bid<SomeShort, Analyze<' -v'>>,
    Ts.Test.bid<SomeShort, Analyze<' -v '>>,
    Ts.Test.bid<SomeShort, Analyze<' -v  '>>,
    Ts.Test.bid<SomeShort, Analyze<'  -v '>>,
    Ts.Test.bid<SomeShort, Analyze<'  -v  '>>,
    Ts.Test.bid<SomeShort, Analyze<'-v  '>>,
    Ts.Test.bid<SomeShort, Analyze<'-v '>>,
    Ts.Test.bid<SomeShort, Analyze<'v '>>,
    Ts.Test.bid<SomeShort, Analyze<'v'>>
  >

  interface SomeLongShort {
    expression: string
    canonical: 'version'
    long: 'version'
    short: 'v'
    aliases: { short: []; long: [] }
  }

  type _3 = Ts.Test.Cases<
    Ts.Test.bid<SomeLongShort, Analyze<'--version -v'>>,
    Ts.Test.bid<SomeLongShort, Analyze<' --version -v'>>,
    Ts.Test.bid<SomeLongShort, Analyze<' --version -v '>>,
    Ts.Test.bid<SomeLongShort, Analyze<'  --version -v  '>>,
    Ts.Test.bid<SomeLongShort, Analyze<'  --version -v '>>,
    Ts.Test.bid<SomeLongShort, Analyze<'-v --version'>>,
    Ts.Test.bid<SomeLongShort, Analyze<' -v --version'>>,
    Ts.Test.bid<SomeLongShort, Analyze<'  -v --version'>>,
    Ts.Test.bid<SomeLongShort, Analyze<'  -v --version '>>,
    Ts.Test.bid<SomeLongShort, Analyze<'  -v --version  '>>,
    Ts.Test.bid<SomeLongShort, Analyze<'  -v  --version  '>>,
    Ts.Test.bid<SomeLongShort, Analyze<'  -v   --version '>>,
    Ts.Test.bid<SomeLongShort, Analyze<'  v   version '>>,
    Ts.Test.bid<SomeLongShort, Analyze<'v version'>>
  >

  interface SomeLongCamelCase {
    expression: string
    canonical: 'fooBar'
    long: 'fooBar'
    short: null
    aliases: { short: []; long: [] }
  }

  type _4 = Ts.Test.Cases<
    Ts.Test.bid<SomeLongCamelCase, Analyze<'--fooBar'>>,
    Ts.Test.bid<SomeLongCamelCase, Analyze<'--foo-bar'>>
  >
})

// =============================================================================
// Type-Level Validation Tests (ported from errors.spec.ts)
// =============================================================================

test('type-level validation: empty input', () => {
  type _ = Ts.Test.Cases<
    Ts.Test.bid<Errors.Empty, Analyze<''>>,
    Ts.Test.bid<Errors.Empty, Analyze<' '>>
  >
})

test('type-level validation: reserved names', () => {
  type _ = Ts.Test.Cases<
    // Short flag reserved
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.Reserved<'a'>>,
      Analyze<'-a', { reservedNames: 'a'; usedNames: undefined }>
    >,
    // Long flag reserved
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.Reserved<'abc'>>,
      Analyze<'--abc', { reservedNames: 'abc'; usedNames: undefined }>
    >,
    // Case normalization (kebab vs camel)
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.Reserved<'foo-bar'>>,
      Analyze<'--foo-bar', { reservedNames: 'fooBar'; usedNames: undefined }>
    >,
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.Reserved<'fooBar'>>,
      Analyze<'--fooBar', { reservedNames: 'foo-bar'; usedNames: undefined }>
    >,
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.Reserved<'foo-bar'>>,
      Analyze<'foo-bar', { reservedNames: 'fooBar'; usedNames: undefined }>
    >,
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.Reserved<'fooBar'>>,
      Analyze<'fooBar', { reservedNames: 'foo-bar'; usedNames: undefined }>
    >,
    // Aliases
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.Reserved<'foo-bar'>>,
      Analyze<'--foo --foo-bar', { reservedNames: 'fooBar'; usedNames: undefined }>
    >,
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.Reserved<'fooBar'>>,
      Analyze<'--foo --fooBar', { reservedNames: 'foo-bar'; usedNames: undefined }>
    >,
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.Reserved<'foo-bar'>>,
      Analyze<'foo foo-bar', { reservedNames: 'fooBar'; usedNames: undefined }>
    >,
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.Reserved<'fooBar'>>,
      Analyze<'foo fooBar', { reservedNames: 'foo-bar'; usedNames: undefined }>
    >
  >
})

test('type-level validation: already taken names', () => {
  type _ = Ts.Test.Cases<
    // Short flag already taken
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.AlreadyTaken<'a'>>,
      Analyze<'-a', { usedNames: 'a'; reservedNames: undefined }>
    >,
    // Long flag already taken
    Ts.Test.bid<
      'Error(s):\nThe name "abc" cannot be used because it is already used for another flag.',
      Analyze<'--abc', { usedNames: 'abc'; reservedNames: undefined }>
    >,
    // Case normalization
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.AlreadyTaken<'fooBar'>>,
      Analyze<'--fooBar', { usedNames: 'foo-bar'; reservedNames: undefined }>
    >,
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.AlreadyTaken<'foo-bar'>>,
      Analyze<'--foo-bar', { usedNames: 'fooBar'; reservedNames: undefined }>
    >,
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.AlreadyTaken<'fooBar'>>,
      Analyze<'fooBar', { usedNames: 'foo-bar'; reservedNames: undefined }>
    >,
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.AlreadyTaken<'foo-bar'>>,
      Analyze<'foo-bar', { usedNames: 'fooBar'; reservedNames: undefined }>
    >,
    // Aliases
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.AlreadyTaken<'fooBar'>>,
      Analyze<'--foo --fooBar', { usedNames: 'foo-bar'; reservedNames: undefined }>
    >,
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.AlreadyTaken<'foo-bar'>>,
      Analyze<'--foo --foo-bar', { usedNames: 'fooBar'; reservedNames: undefined }>
    >,
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.AlreadyTaken<'fooBar'>>,
      Analyze<'foo fooBar', { usedNames: 'foo-bar'; reservedNames: undefined }>
    >,
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.AlreadyTaken<'foo-bar'>>,
      Analyze<'foo foo-bar', { usedNames: 'fooBar'; reservedNames: undefined }>
    >
  >
})

test('type-level validation: length errors', () => {
  type _ = Ts.Test.Cases<
    // Long flag too short
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.LongTooShort<'v'>>,
      Analyze<'--v'>
    >,
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.LongTooShort<'v'>>,
      Analyze<'--ver --v'>
    >,
    // Short flag too long
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.ShortTooLong<'vv'>>,
      Analyze<'-vv'>
    >
  >
})

test('type-level validation: duplicate aliases', () => {
  type _ = Ts.Test.Cases<
    // Exact duplicates
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.AliasDuplicate<'vv'>>,
      Analyze<'--vv --vv'>
    >,
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.AliasDuplicate<'v-v'>>,
      Analyze<'--v-v --v-v'>
    >,
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.AliasDuplicate<'v'>>,
      Analyze<'-v -v'>
    >,
    // Case variations (kebab vs camel)
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.AliasDuplicate<'foo-bar'>>,
      Analyze<'--fooBar --foo-bar'>
    >,
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.AliasDuplicate<'fooBar'>>,
      Analyze<'--foo-bar --fooBar'>
    >,
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.AliasDuplicate<'foo-bar'>>,
      Analyze<'fooBar foo-bar'>
    >,
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.AliasDuplicate<'fooBar'>>,
      Analyze<'foo-bar fooBar'>
    >,
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.AliasDuplicate<'fooBar'>>,
      Analyze<'foo-bar --fooBar'>
    >,
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.AliasDuplicate<'fooBar'>>,
      Analyze<'--foo-bar fooBar'>
    >,
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.AliasDuplicate<'foo-bar'>>,
      Analyze<'fooBar --foo-bar'>
    >,
    Ts.Test.bid<
      Checks.Messages.WithHeader<Checks.Messages.AliasDuplicate<'foo-bar'>>,
      Analyze<'--fooBar foo-bar'>
    >
  >
})

// =============================================================================
// Type-Level Tests for FlagName.fromString
// =============================================================================

test('type-level: fromString return types', () => {
  // Valid inputs - type inference works
  Ts.Test.bid<Analyze<'-v'>>()(FlagName.fromString('-v'))
  Ts.Test.bid<Analyze<'--verbose'>>()(FlagName.fromString('--verbose'))
  Ts.Test.bid<Analyze<'-v --verbose'>>()(FlagName.fromString('-v --verbose'))
  Ts.Test.bid<Analyze<'--foo-bar'>>()(FlagName.fromString('--foo-bar'))
  Ts.Test.bid<Analyze<'-v --verbose -x --extra'>>()(FlagName.fromString('-v --verbose -x --extra'))

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
