# API Reference

Browse the complete API documentation for @wollybeard/kit.

## [Arr](/api/arr)

Array utilities for working with readonly and mutable arrays.

## [Err](/api/err)

Error handling utilities for robust error management.

## [Fn](/api/fn)

Function utilities for functional programming patterns.

## [Html](/api/html)

HTML utility functions for escaping and working with HTML content.

## [Json](/api/json)

JSON utilities with Effect Schema integration.

## [Num](/api/num)

Numeric types and utilities with branded types for mathematical constraints.

## [Obj](/api/obj)

Object utilities for working with plain JavaScript objects.

- [`Union`](/api/obj/union) - Union operations on objects.

This module provides utilities for working with unions of object types, solving common TypeScript limitations when dealing with union types:

- `keyof (A | B)` returns only common keys (intersection), not all keys (union) - `(A | B)['key']` returns `any` for keys not in all members - No built-in way to merge union members while preserving value unions per key

These utilities use distributive conditional types to properly handle each union member separately, then combine the results.

## [Prom](/api/prom)

Promise utilities for asynchronous operations.

## [Rec](/api/rec)

Record utilities for working with plain JavaScript objects as dictionaries.

## [Str](/api/str)

String utilities for text manipulation and analysis.

- [`Char`](/api/str/char) - Uppercase letter.
- [`Code`](/api/str/code) - Code generation and documentation utilities.

Provides tools for generating markdown, TSDoc/JSDoc, and TypeScript code. Includes safe JSDoc generation with escaping, builder API, and structured tag helpers.

- [`Text`](/api/str/text) - Multi-line text formatting and layout utilities.

Provides functions specifically for working with multi-line strings treated as text content: - **Line operations**: Split into lines, join lines, map transformations per line - **Indentation**: Add/remove indentation, strip common leading whitespace - **Alignment**: Pad text, span to width, fit to exact width - **Block formatting**: Format blocks with prefixes, styled borders

**Use Text for**: Operations that treat strings as multi-line content with visual layout (indentation, padding for tables, line-by-line transformations).

**Use root Str for**: Primitive string operations (split, join, replace, match, trim) that work on strings as atomic values.

- [`Visual`](/api/str/visual) - Visual-aware string utilities that handle ANSI escape codes and grapheme clusters.

These functions measure and manipulate strings based on their visual appearance, not raw character count. Useful for terminal output, tables, and formatted text.

## [Test](/api/test)

Enhanced test utilities for table-driven testing with Vitest.

## [Ts](/api/ts)

TypeScript type utilities and type-level programming helpers.

- [`Assert`](/api/ts/assert)
- [`Err`](/api/ts/err) - Error utilities for working with static type-level errors.
- [`Inhabitance`](/api/ts/inhabitance) - Type utilities for classifying types by their inhabitance in TypeScript's type lattice.
- [`Kind`](/api/ts/kind) - Higher-kinded type utilities for type-level programming. Provides type-level functions and utilities for simulating higher-kinded types in TypeScript.
- [`SENTINEL`](/api/ts/sentinel) - Utilities for working with the SENTINEL type.
- [`SimpleSignature`](/api/ts/simplesignature) - Utilities for working with the `__simpleSignature` phantom type pattern. Allows complex generic functions to provide simpler signatures for type inference.
- [`Simplify`](/api/ts/simplify) - Type simplification utilities for flattening and expanding types. All functions automatically preserve globally registered types from KitLibrarySettings.Ts.PreserveTypes.
- [`Union`](/api/ts/union) - Utilities for working with union types at the type level.
- [`VariancePhantom`](/api/ts/variancephantom) - Phantom type helpers for controlling type variance (covariance, contravariance, invariance, bivariance).

## [Value](/api/value)

General value utilities for common JavaScript values and patterns.

## [Paka](/api/paka)

todo
