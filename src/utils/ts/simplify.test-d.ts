/**
 * Type-level tests for Simplify namespace
 * Tests all simplification utilities and preservation logic
 */

import type { Brand } from 'effect'
import type * as Simplify from './simplify.js'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Test Setup - Branded Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type NonNegative = number & Brand.Brand<'NonNegative'>
type Int = number & Brand.Brand<'Int'>
type UserId = string & Brand.Brand<'UserId'>

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Simplify.Shallow Tests
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Basic intersection flattening
type _test_shallow_basic = Simplify.Shallow<{ a: string } & { b: number }>
//   ^? Should be: { a: string; b: number }

// Preserves primitives in values
type _test_shallow_primitives = Simplify.Shallow<{ str: string; num: number; bool: boolean }>
//   ^? Should preserve: { str: string; num: number; bool: boolean }

// Preserves Date and other built-ins
type _test_shallow_builtins = Simplify.Shallow<{ created: Date; pattern: RegExp; data: Map<string, number> }>
//   ^? Should preserve: { created: Date; pattern: RegExp; data: Map<string, number> }

// CRITICAL: Shallow does NOT preserve branded types in nested values (by design)
type _test_shallow_branded_nested = Simplify.Shallow<{ id: UserId; count: NonNegative }>
//   ^? Will expand branded types (Shallow doesn't recurse into values)

// Top-level branded type should be preserved
type _test_shallow_branded_toplevel = Simplify.Shallow<NonNegative>
//   ^? Should preserve: NonNegative

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Simplify.Deep Tests - THE KEY TEST FOR BRANDED TYPE PRESERVATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Basic deep flattening
type _test_deep_basic = Simplify.Deep<{ a: 1 } & { b: { c: 2 } & { d: 3 } }>
//   ^? Should be: { a: 1; b: { c: 2; d: 3 } }

// Preserves primitives at all levels
type _test_deep_primitives = Simplify.Deep<{
  str: string
  nested: { num: number; bool: boolean }
}>
//   ^? All primitives should be preserved

// Preserves built-ins at all levels
type _test_deep_builtins = Simplify.Deep<{
  created: Date
  nested: { pattern: RegExp; data: Map<string, number> }
}>
//   ^? All built-ins should be preserved

// ⭐ CRITICAL TEST: Deep should preserve branded types in nested values
type _test_deep_branded_nested = Simplify.Deep<{
  id: UserId
  count: NonNegative
  nested: { value: Int }
}>
//   ^? Should preserve: { id: UserId; count: NonNegative; nested: { value: Int } }
//   NOT: { id: { toString: ..., [BrandTypeId]: ... }, count: { ... }, nested: { value: { ... } } }

// Top-level branded type
type _test_deep_branded_toplevel = Simplify.Deep<NonNegative>
//   ^? Should preserve: NonNegative

// Array of branded types
type _test_deep_branded_array = Simplify.Deep<Array<NonNegative>>
//   ^? Should preserve: Array<NonNegative>

// Complex nested structure with brands
type _test_deep_branded_complex = Simplify.Deep<{
  user: {
    id: UserId
    age: NonNegative
  }
  counts: Array<Int>
}>
//   ^? All branded types should be preserved

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Simplify.Nullable Tests
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Preserves null union
type _test_nullable_null = Simplify.Nullable<({ a: string } & { b: number }) | null>
//   ^? Should be: { a: string; b: number } | null

// Preserves undefined union
type _test_nullable_undefined = Simplify.Nullable<({ a: string } & { b: number }) | undefined>
//   ^? Should be: { a: string; b: number } | undefined

// Non-nullable types
type _test_nullable_nonnull = Simplify.Nullable<{ a: string } & { b: number }>
//   ^? Should be: { a: string; b: number }

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Simplify.Display Tests (alias for Deep)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type _test_display_branded = Simplify.Display<{
  id: UserId
  count: NonNegative
}>
//   ^? Should preserve branded types like Deep

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Visual Inspection Tests - Hover over these to verify display
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * HOVER INSPECTION: These types let you visually verify the results
 * The type names below should show the simplified/preserved types when you hover
 */

// This should show: { id: UserId; count: NonNegative; nested: { value: Int } }
type InspectDeepBranded = Simplify.Deep<{
  id: UserId
  count: NonNegative
  nested: { value: Int }
}>

// This should show expanded methods if branded types aren't preserved:
// { id: { toString: ..., [BrandTypeId]: ... }, count: { ... }, nested: { value: { ... } } }
type InspectWithoutPreservation = {
  id: UserId
  count: NonNegative
  nested: { value: Int }
}

// For comparison - plain primitives should always be simple
type InspectPlainPrimitives = Simplify.Deep<{
  str: string
  num: number
  nested: { bool: boolean }
}>

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Compile-Time Assertions - These MUST compile for tests to pass
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// If branded preservation works, these should compile:
declare const _deepBrandedResult: Simplify.Deep<{ id: UserId; count: NonNegative }>

// The result should be assignable back to the original structure
const _assignability_test: { id: UserId; count: NonNegative } = _deepBrandedResult

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Explicit Preservation Tests - Verify branded types aren't expanded
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Helper: Check if type is preserved (not expanded to method soup)
type IsPreserved<T, Expected> = [T] extends [Expected] ? [Expected] extends [T] ? true : false : false

// Top-level branded type should be preserved
type _verify_toplevel_branded = IsPreserved<Simplify.Deep<NonNegative>, NonNegative>
const _assert_toplevel_branded: _verify_toplevel_branded = true

// Nested branded types should be preserved
type _verify_nested_branded = Simplify.Deep<{ count: NonNegative }>
type _verify_nested_test = IsPreserved<_verify_nested_branded['count'], NonNegative>
const _assert_nested_branded: _verify_nested_test = true

// Array of branded types should be preserved
type _verify_array_branded = Simplify.Deep<Array<Int>>
type _verify_array_element = _verify_array_branded extends Array<infer E> ? E : never
type _verify_array_test = IsPreserved<_verify_array_element, Int>
const _assert_array_branded: _verify_array_test = true

// Complex structure - all branded types should be preserved
type _verify_complex = Simplify.Deep<{
  user: { id: UserId; age: NonNegative }
  counts: Array<Int>
}>
type _verify_complex_id = IsPreserved<_verify_complex['user']['id'], UserId>
type _verify_complex_age = IsPreserved<_verify_complex['user']['age'], NonNegative>
const _assert_complex_id: _verify_complex_id = true
const _assert_complex_age: _verify_complex_age = true
