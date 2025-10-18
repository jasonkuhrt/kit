# API Reference

Browse the complete API documentation for @wollybeard/kit.

## [Arr](/api/arr)

## [Err](/api/err)

## [Fn](/api/fn)

## [Html](/api/html)

## [Json](/api/json)

## [Num](/api/num)

- [`BigInteger`](/api/num/biginteger)
- [`Complex`](/api/num/complex)
- [`Degrees`](/api/num/degrees)
- [`Even`](/api/num/even)
- [`Finite`](/api/num/finite)
- [`Float`](/api/num/float)
- [`Frac`](/api/num/frac)
- [`InRange`](/api/num/inrange)
- [`Int`](/api/num/int)
- [`Natural`](/api/num/natural)
- [`Negative`](/api/num/negative)
- [`NonNegative`](/api/num/nonnegative)
- [`NonPositive`](/api/num/nonpositive)
- [`NonZero`](/api/num/nonzero)
- [`Odd`](/api/num/odd)
- [`Percentage`](/api/num/percentage)
- [`Positive`](/api/num/positive)
- [`Prime`](/api/num/prime)
- [`Radians`](/api/num/radians)
- [`Ratio`](/api/num/ratio)
- [`SafeInt`](/api/num/safeint)
- [`Whole`](/api/num/whole)
- [`Zero`](/api/num/zero)

## [Obj](/api/obj)

- [`PropertySignature`](/api/obj/propertysignature)
- [`Union`](/api/obj/union) - Union operations on objects.

This module provides utilities for working with unions of object types, solving common TypeScript limitations when dealing with union types:

- `keyof (A | B)` returns only common keys (intersection), not all keys (union) - `(A | B)['key']` returns `any` for keys not in all members - No built-in way to merge union members while preserving value unions per key

These utilities use distributive conditional types to properly handle each union member separately, then combine the results.

## [Prom](/api/prom)

## [Rec](/api/rec)

## [Str](/api/str)

- [`AxisHand`](/api/str/axishand)
- [`Case`](/api/str/case)
- [`Char`](/api/str/char) - Uppercase letter.
- [`Code`](/api/str/code) - Code generation and documentation utilities.

Provides tools for generating markdown, TSDoc/JSDoc, and TypeScript code. Includes safe JSDoc generation with escaping, builder API, and structured tag helpers.

- [`Nat`](/api/str/nat)
- [`Text`](/api/str/text) - Multi-line text formatting and layout utilities.

Provides functions specifically for working with multi-line strings treated as text content: - **Line operations**: Split into lines, join lines, map transformations per line - **Indentation**: Add/remove indentation, strip common leading whitespace - **Alignment**: Pad text, span to width, fit to exact width - **Block formatting**: Format blocks with prefixes, styled borders

**Use Text for**: Operations that treat strings as multi-line content with visual layout (indentation, padding for tables, line-by-line transformations).

**Use root Str for**: Primitive string operations (split, join, replace, match, trim) that work on strings as atomic values.

- [`Tpl`](/api/str/tpl)
- [`Visual`](/api/str/visual) - Visual-aware string utilities that handle ANSI escape codes and grapheme clusters.

These functions measure and manipulate strings based on their visual appearance, not raw character count. Useful for terminal output, tables, and formatted text.

## [Test](/api/test)

Enhanced test utilities for table-driven testing with Vitest.

- [`Test`](/api/test/test) - Custom Vitest matchers for Effect Schema and equivalence testing.

## [Ts](/api/ts)

- [`Assert`](/api/ts/assert)
- [`Kind`](/api/ts/kind) - Higher-kinded type utilities for type-level programming. Provides type-level functions and utilities for simulating higher-kinded types in TypeScript.
- [`Relation`](/api/ts/relation)
- [`SENTINEL`](/api/ts/sentinel) - Utilities for working with the SENTINEL type.
- [`SimpleSignature`](/api/ts/simplesignature) - Utilities for working with the `__simpleSignature` phantom type pattern. Allows complex generic functions to provide simpler signatures for type inference.
- [`Union`](/api/ts/union) - Utilities for working with union types at the type level.
- [`VariancePhantom`](/api/ts/variancephantom) - Phantom type helpers for controlling type variance (covariance, contravariance, invariance, bivariance).

## [Value](/api/value)

## [Paka](/api/paka)

- [`Adaptors`](/api/paka/adaptors)
- [`Extractor`](/api/paka/extractor)
