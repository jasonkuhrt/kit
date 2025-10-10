/**
 * Type-level analyzer for CLI flag name parsing.
 * Mirrors the runtime analyzer logic for compile-time flag name analysis and validation.
 */

import type { BaseChecks, LongChecks, ReportFailures, ShortChecks, SomeFailures } from './checks.js'

// ============================================================================
// Type-Level Utilities
// ============================================================================

/**
 * Get the length of a string type.
 * Replaces hotscript's `$<Strings.Length, T>`.
 *
 * Uses recursive character counting since string literals don't have numeric length at type-level.
 */
export type Length<$S extends string, $Acc extends any[] = []> = $S extends `${infer _First}${infer Rest}`
  ? Length<Rest, [...$Acc, any]>
  : $Acc['length']

/**
 * Convert a string type to camelCase.
 * Replaces hotscript's `$<Strings.CamelCase, T>`.
 *
 * Handles:
 * - kebab-case → camelCase
 * - snake_case → camelCase
 * - Already camelCase → unchanged
 *
 * @example
 * ```typescript
 * type A = CamelCase<'foo-bar'>  // 'fooBar'
 * type B = CamelCase<'foo_bar'>  // 'fooBar'
 * type C = CamelCase<'fooBar'>   // 'fooBar'
 * ```
 */
export type CamelCase<$S extends string> = $S extends `${infer First}-${infer Rest}`
  ? `${First}${Capitalize<CamelCase<Rest>>}`
  : $S extends `${infer First}_${infer Rest}` ? `${First}${Capitalize<CamelCase<Rest>>}`
  : $S

/**
 * Simplify an intersection type into a single object type.
 * Creates a clean object type from complex intersections.
 */
type Simplify<$T> = { [k in keyof $T]: $T[k] } & {}

/**
 * Update a nested object property by path.
 * Replaces hotscript's `$<Objects.Update<'path', Value>, Object>`.
 *
 * @example
 * ```typescript
 * type Obj = { a: { b: number } }
 * type Updated = Update<Obj, 'a.b', string>  // { a: { b: string } }
 * ```
 */
export type Update<$Obj, $Path extends string, $Value> = $Path extends `${infer Key}.${infer Rest}`
  ? $Obj extends Record<any, any>
    ? Key extends keyof $Obj ? Simplify<Omit<$Obj, Key> & { [k in Key]: Update<$Obj[k], Rest, $Value> }>
    : $Obj
  : $Obj
  : $Obj extends Record<any, any> ? $Path extends keyof $Obj ? Simplify<Omit<$Obj, $Path> & { [k in $Path]: $Value }>
    : $Obj
  : $Obj

/**
 * Append an element to a tuple type.
 * Replaces hotscript's `Tuples.Append<Element>`.
 *
 * @example
 * ```typescript
 * type Arr = ['a', 'b']
 * type Extended = Append<Arr, 'c'>  // ['a', 'b', 'c']
 * ```
 */
export type Append<$Tuple extends readonly any[], $Element> = [...$Tuple, $Element]

// ============================================================================
// Name Types
// ============================================================================

/**
 * Parsed flag name structure.
 */
export type Name = {
  expression: string
  canonical: string | null
  aliases: {
    short: [...string[]]
    long: [...string[]]
  }
  long: string | null
  short: string | null
}

/**
 * Empty flag name (initial parsing state).
 */
export type NameEmpty = {
  expression: string
  canonical: null
  aliases: {
    short: []
    long: []
  }
  long: null
  short: null
}

/**
 * Fully parsed flag name with canonical set.
 */
export type NameParsed = {
  expression: string
  canonical: string
  aliases: {
    short: string[]
    long: string[]
  }
  long: string | null
  short: string | null
}

// ============================================================================
// Parser Error Messages
// ============================================================================

/**
 * Parser error messages.
 */
export namespace Errors {
  export type TrailingPipe =
    `Error: You have a trailing pipe. Pipes are for adding aliases. Add more names after your pipe or remove it.`
  export type Empty = `Error: You must specify at least one name for your flag.`
  export type Unknown = `Error: Cannot parse your flag expression.`
}

// ============================================================================
// Parser Limits/Constraints
// ============================================================================

/**
 * Limits/constraints for parsing (reserved and already-used names).
 */
export interface SomeLimits {
  reservedNames: string | undefined
  usedNames: string | undefined
}

interface SomeLimitsNone {
  reservedNames: undefined
  usedNames: undefined
}

// ============================================================================
// Parser Helper Types
// ============================================================================

/**
 * Add a name variant to the Name being built during parsing.
 */
type Add<
  $Kind extends 'short' | 'long',
  $Name extends Name,
  $Variant extends string,
> = $Kind extends 'short' ? $Name['short'] extends null ? AddShort<$Name, $Variant>
  : AddAliasShort<$Name, $Variant>
  : $Kind extends 'long' ? $Name['long'] extends null ? AddLong<$Name, $Variant>
    : AddAliasLong<$Name, $Variant>
  : never

/**
 * Add a long alias to an existing Name (long already set).
 */
type AddAliasLong<$Name extends Name, $Variant extends string> = Update<
  $Name,
  'aliases.long',
  Append<$Name['aliases']['long'], CamelCase<$Variant>>
>

/**
 * Add a short alias to an existing Name (short already set).
 */
type AddAliasShort<$Name extends Name, $Variant extends string> = Update<
  $Name,
  'aliases.short',
  Append<$Name['aliases']['short'], $Variant>
>

/**
 * Set the primary long name (first long encountered).
 */
type AddLong<$Name extends Name, $Variant extends string> = Update<$Name, 'long', CamelCase<$Variant>>

/**
 * Set the primary short name (first short encountered).
 */
type AddShort<$Name extends Name, $Variant extends string> = Update<$Name, 'short', $Variant>

/**
 * Set the canonical name (long takes precedence over short).
 */
type addCanonical<$Name extends Name> = Update<
  $Name,
  'canonical',
  $Name['long'] extends string ? $Name['long']
    : $Name['short'] extends string ? $Name['short']
    : never // A valid flag always has either a long or short name
>

// ============================================================================
// Main Analyzer
// ============================================================================

/**
 * Analyze a CLI flag expression into a Name type.
 *
 * This is a recursive type-level parser that handles:
 * - Short flags: `-v`
 * - Long flags: `--verbose`
 * - Multiple flags: `-v --verbose`
 * - Aliases: `-v --verbose -x --extra`
 * - Whitespace: trimmed automatically
 * - No prefix: `v verbose` (infers short/long by length)
 *
 * @example
 * ```typescript
 * type A = Analyze<'-v'>                      // { short: 'v', long: null, ... }
 * type B = Analyze<'--verbose'>               // { short: null, long: 'verbose', ... }
 * type C = Analyze<'-v --verbose'>            // { short: 'v', long: 'verbose', canonical: 'verbose', ... }
 * type D = Analyze<'-v --verbose -x'>         // { short: 'v', long: 'verbose', aliases: { short: ['x'], long: [] }, ... }
 * type E = Analyze<'--foo-bar'>               // { long: 'fooBar', ... } (kebab → camel)
 * type F = Analyze<'v version'>               // { short: 'v', long: 'version', ... } (no prefix)
 * type G = Analyze<'--v'>                     // Error: long flag must be 2+ chars
 * type H = Analyze<'-vv'>                     // Error: short flag must be 1 char
 * type I = Analyze<''>                        // Error: must specify at least one name
 * ```
 */
export type Analyze<
  $E extends string,
  $limits extends SomeLimits = SomeLimitsNone,
  $names extends Name = NameEmpty,
> = _Analyze<$E, $limits, $names>

type _Analyze<$E extends string, $Limits extends SomeLimits, $Name extends Name> =
  // Done!
  $E extends `` ? NameEmpty extends $Name ? Errors.Empty : addCanonical<$Name>
    // Trim leading and trailing whitespace
    : $E extends ` ${infer tail}` ? _Analyze<tail, $Limits, $Name>
    : $E extends `${infer initial} ` ? _Analyze<initial, $Limits, $Name>
    // Capture a long flag & continue
    : $E extends `--${infer v} ${infer tail}`
      ? LongChecks<v, $Limits, $Name> extends SomeFailures ? ReportFailures<LongChecks<v, $Limits, $Name>>
      : _Analyze<
        tail,
        $Limits,
        Add<
          'long',
          $Name,
          v
        >
      >
    // Capture a long name & Done!
    : $E extends `--${infer v}`
      ? LongChecks<v, $Limits, $Name> extends SomeFailures ? ReportFailures<LongChecks<v, $Limits, $Name>>
      : _Analyze<
        '',
        $Limits,
        Add<
          'long',
          $Name,
          v
        >
      >
    // Capture a short flag & continue
    : $E extends `-${infer v} ${infer tail}`
      ? ShortChecks<v, $Limits, $Name> extends SomeFailures ? ReportFailures<ShortChecks<v, $Limits, $Name>>
      : _Analyze<
        tail,
        $Limits,
        Add<
          'short',
          $Name,
          v
        >
      >
    // Capture a short name & Done!
    : $E extends `-${infer v}`
      ? ShortChecks<v, $Limits, $Name> extends SomeFailures ? ReportFailures<ShortChecks<v, $Limits, $Name>>
      : _Analyze<
        '',
        $Limits,
        Add<
          'short',
          $Name,
          v
        >
      >
    // Capture a long flag & continue (no prefix, inferred by length)
    : $E extends `${infer v} ${infer tail}`
      ? BaseChecks<v, $Limits, $Name> extends SomeFailures ? ReportFailures<BaseChecks<v, $Limits, $Name>>
      : _Analyze<
        tail,
        $Limits,
        Add<
          Length<v> extends 1 ? 'short' : 'long',
          $Name,
          v
        >
      >
    // Capture final name (no prefix, inferred by length)
    : $E extends `${infer v}`
      ? BaseChecks<v, $Limits, $Name> extends SomeFailures ? ReportFailures<BaseChecks<v, $Limits, $Name>>
      : _Analyze<
        '',
        $Limits,
        Add<
          Length<v> extends 1 ? 'short' : 'long',
          $Name,
          v
        >
      >
    : Errors.Unknown
