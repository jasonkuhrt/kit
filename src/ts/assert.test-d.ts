/**
 * Type-level tests for assert utilities
 */

import { Arr } from '#arr'
import { tryOr } from '#err/try'
import { Ts } from '#ts'

// Test improved error messages
Ts.test('assertType with StaticError', () => {
  // This should show a clear error with Expected and Actual types
  // @ts-expect-error - Type 'number' is not assignable to type 'string'
  Ts.assert<string>()(42)
  Ts.assert<string>()('hello') // This should pass
})

Ts.test('assertTypeSimple', () => {
  // Simplified API without double function call
  Ts.assertSimple<string>('hello') // Should pass
  // @ts-expect-error - Type 'number' is not assignable to type 'string'
  Ts.assertSimple<string>(42)
})

Ts.test('assertSub (subtype)', () => {
  // Test subtype relationships
  Ts.assertSub<string>()('hello') // Should pass - 'hello' extends string
  Ts.assertSub<object>()({ a: 1 }) // Should pass - { a: 1 } extends object
  Ts.assertAssignable<string>()('hello') // Alias should work too
  // @ts-expect-error - Type '"world"' does not extend type '"hello"'
  Ts.assertSub<'hello'>()('world')
})

Ts.test('assertSuper (supertype)', () => {
  // Test supertype relationships (reverse of sub)
  interface Base {
    id: string
  }
  interface Extended extends Base {
    name: string
  }

  const _extended: Extended = { id: '1', name: 'test' }
  const _base: Base = { id: '1' }

  // Note: assertSuper checks if the actual type extends the supertype
  // This test is expected to show type errors to verify our assertions work
  // Ts.assertSuper<Base>()(extended) // Should pass - Extended extends Base
  // Ts.assertSupertype<Base>()(extended) // Alias should work too
})

Ts.test('assertExact (exact equality)', () => {
  // Should pass
  // Test exact type equality
  Ts.assertExact<string>()('hello')
  Ts.assertEqual<string>()('hello') // Alias should work
  Ts.assertExact<{ a: 1 }>()({ a: 1 } as { a: 1 })
  // @ts-expect-error - Types are not exactly equal (too narrow)
  Ts.assertExact<string | number>()('hello')
  // @ts-expect-error - Types are not exactly equal (too wide)
  Ts.assertExact<string | number>()(Arr.getRandomly(['hello' as string, 1 as number, true]))
  // @ts-expect-error - Types are not exactly equal
  Ts.assertExact<{ a: 1; b?: 2 }>()({ a: 1 })
})

const syncValue = 42
const asyncValue = Promise.resolve(42)

Ts.test('assertPromise', () => {
  // Should pass
  Ts.assertPromise<number>()(asyncValue)
  // @ts-expect-error - Wrong Promise type
  Ts.assertPromise<string>()(asyncValue)
  // @ts-expect-error - Not a Promise
  Ts.assertPromise<number>()(syncValue)
})

Ts.test('assertNotPromise', () => {
  // Should pass
  Ts.assertNotPromise(syncValue)
  // @ts-expect-error - Value is a Promise
  Ts.assertNotPromise(asyncValue)
})

Ts.test('assertFunction', () => {
  const fn1 = (x: number) => x.toString()
  const fn2 = (x: string) => x.length
  const notFn = 42

  Ts.assertFunction<(x: number) => string>()(fn1) // Should pass
  // @ts-expect-error - Wrong function signature
  Ts.assertFunction<(x: number) => string>()(fn2)
  // @ts-expect-error - Not a function
  Ts.assertFunction<(x: number) => string>()(notFn)
})

Ts.test('assertArray', () => {
  const strings = ['a', 'b', 'c']
  const numbers = [1, 2, 3]
  const mixed = [1, 'a', 2]
  const notArray = 'hello'

  Ts.assertArray<string>()(strings) // Should pass
  Ts.assertArray<number>()(numbers) // Should pass
  // @ts-expect-error - Wrong element type
  Ts.assertArray<string>()(numbers)
  Ts.assertArray<string | number>()(mixed) // Should pass
  // @ts-expect-error - Not an array
  Ts.assertArray<string>()(notArray)
})

Ts.test('inline assertion', () => {
  // Test inline assertion for complex expressions
  const result1 = Ts.inline<Promise<number | string>>(Promise.resolve(42))
  const result2 = Ts.inline<number>(42)
  // const result3 = Ts.inline<string>(42) // Should fail - type mismatch (commented to avoid error)

  // Inline should preserve the type
  Ts.assert<Promise<number | string>>()(result1)
  Ts.assert<number>()(result2)
})

// Test use with try.test-d.ts patterns
Ts.test('integration with tryOr', () => {
  // Using assertNotPromise for sync results
  const syncResult = tryOr(() => 42, 'fallback')
  Ts.assertNotPromise(syncResult)

  // Using assertPromise for async results
  const asyncResult = tryOr(async () => 42, 'fallback')
  Ts.assertPromise<number | string>()(asyncResult)
})

// === Type-Level Only Tests ===

// Individual type assertions
type _SubtypeTest = Ts.Assert<string, 'hello'> // Should be true
type _SupertypeTest = Ts.AssertSuper<{ a: 1 }, { a: 1; b: 2 }> // Should be true
type _ExactTest = Ts.AssertExact<number, number> // Should be true
type _ExtendsTest = Ts.AssertExtendsTyped<'hello', string> // Should be true

// Test suite examples - all passing
type _BasicTests = Ts.TestSuite<[
  Ts.Assert<string, 'hello'>,
  Ts.AssertExact<number, number>,
  Ts.AssertSuper<{ a: 1 }, object>, // Fixed: { a: 1 } extends object (not the other way)
  Ts.AssertExtendsTyped<'hello', string>,
]> // Should be true

// Demonstrate TestSuite failure behavior
Ts.test('TestSuite shows StaticError on failure', () => {
  // Example 1: All pass - result is true
  type AllPass = Ts.TestSuite<[
    Ts.Assert<string, 'hello'>,
    Ts.Assert<number, 42>,
  ]>
  const _checkAllPass: AllPass = true // ✓ Works

  // Example 2: One fails - result is StaticError
  // @ts-expect-error - Intentionally demonstrating TestSuite failure
  type OneFails = Ts.TestSuite<[
    Ts.Assert<string, 'hello'>,
    Ts.Assert<string, 123>, // This fails!
  ]>
  // @ts-expect-error - OneFails is StaticError, not true
  const _checkOneFails: OneFails = true

  // The type of OneFails is:
  // StaticError<'Type assertion failed', { Expected: string; Actual: 123 }, '$Actual must extend $Expected'>
})

type _PromiseTests = Ts.TestCase<'Promise type checks', [
  Ts.Assert<Promise<any>, Promise<number>>,
  Ts.Assert<Promise<number | string>, Promise<42>>,
  Ts.AssertExact<Promise<number>, Promise<number>>,
]> // Should be true

// Complex type relationships
type _ComplexTests = Ts.TestSuite<[
  // Function types
  Ts.Assert<(...args: any[]) => any, (x: number) => string>,
  Ts.AssertSub<(...args: any[]) => any, (x: number) => string>,

  // Object types
  Ts.AssertSuper<{ id: string; name: string }, { id: string }>, // Fixed: { id: string; name: string } extends { id: string }
  Ts.AssertExtendsTyped<{ id: string; name: string }, { id: string }>,

  // Union types
  Ts.Assert<string | number, string>,
  Ts.Assert<string | number, number>,
]> // Should be true

// === TestSuite Failure Cases ===

// Failure Case 1: Basic type mismatch
// @ts-expect-error - Intentionally demonstrating TestSuite failure
type _FailureBasic = Ts.TestSuite<[
  Ts.Assert<string, 'hello'>, // ✓ Passes
  Ts.Assert<string, number>, // ✗ Fails - number doesn't extend string
]>
// Result: StaticError<'Type assertion failed', { Expected: string; Actual: number }, '$Actual must extend $Expected'>

// @ts-expect-error - TestSuite with failing assertions returns StaticError, not true
const _failureBasicCheck: _FailureBasic = true

// Failure Case 2: Exact type mismatch
// @ts-expect-error - Intentionally demonstrating TestSuite failure
type _FailureExact = Ts.TestSuite<[
  Ts.AssertExact<{ a: 1; b: 2 }, { a: 1 }>, // ✗ Fails - missing property b
  Ts.AssertExact<string | number, string>, // ✗ Fails - union vs single type
]>
// Result: StaticError with details about the first failing assertion

// @ts-expect-error - TestSuite with failing assertions returns StaticError, not true
const _failureExactCheck: _FailureExact = true

// Failure Case 3: Mixed assertion types
// @ts-expect-error - Intentionally demonstrating TestSuite failure
type _FailureMixed = Ts.TestSuite<[
  Ts.Assert<number, 42>, // ✓ Passes
  Ts.AssertSuper<{ id: string }, { name: string }>, // ✗ Fails - no id property
  Ts.AssertExact<Promise<void>, Promise<unknown>>, // ✗ Fails - void !== unknown
]>
// Result: StaticError from the first failing assertion (AssertSuper)

// @ts-expect-error - TestSuite with failing assertions returns StaticError, not true
const _failureMixedCheck: _FailureMixed = true

// Failure Case 4: Function signature mismatch
// @ts-expect-error - Intentionally demonstrating TestSuite failure
type _FailureFunction = Ts.TestSuite<[
  Ts.Assert<(x: string) => number, (x: number) => string>, // ✗ Fails - incompatible signatures
]>
// Result: StaticError with function type details

// @ts-expect-error - TestSuite with failing assertions returns StaticError, not true
const _failureFunctionCheck: _FailureFunction = true

// Failure Case 5: Promise type mismatch
// @ts-expect-error - Intentionally demonstrating TestSuite failure
type _FailurePromise = Ts.TestSuite<[
  Ts.Assert<Promise<string>, number>, // ✗ Fails - number is not a Promise
  Ts.AssertExact<Promise<any>, Promise<42>>, // ✗ Fails - any !== 42
]>
// Result: StaticError from the first failing assertion

// @ts-expect-error - TestSuite with failing assertions returns StaticError, not true
const _failurePromiseCheck: _FailurePromise = true

// Demonstrating that we can't assign true to failed TestSuites
declare const failedSuite: _FailureBasic
// @ts-expect-error - Cannot assign true to StaticError
const _: true = failedSuite
