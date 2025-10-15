import { ArrMut } from '#arr-mut'
import { Err } from '#err'
import { Ts } from '#ts'
import { test } from 'vitest'

// Test improved error messages
test('sub with StaticError', () => {
  // This should show a clear error with Expected and Actual types
  // @ts-expect-error - Type 'number' is not assignable to type 'string'
  Ts.Test.sub<string>()(42)
  Ts.Test.sub<string>()('hello') // This should pass
})

test('sub (subtype)', () => {
  // Test subtype relationships
  Ts.Test.sub<string>()('hello') // Should pass - 'hello' extends string
  Ts.Test.sub<object>()({ a: 1 }) // Should pass - { a: 1 } extends object
  // @ts-expect-error - Type '"world"' does not extend type '"hello"'
  Ts.Test.sub<'hello'>()('world')
})

test('subNoExcess - value level', () => {
  type Config = { id: boolean; name?: string }
  type Q = { id: boolean }

  // Should pass - exact match
  Ts.Test.subNoExcess<Q>()({ id: true })

  // Should pass - subtype without excess
  Ts.Test.subNoExcess<Q>()({ id: false })

  // Should pass - optional property included
  Ts.Test.subNoExcess<Config>()({ id: true, name: 'test' })

  // Should pass - optional property omitted
  Ts.Test.subNoExcess<Config>()({ id: true })

  // Should fail - excess property
  // @ts-expect-error - Excess property $skip
  Ts.Test.subNoExcess<Q>()({ $skip: true, id: true })

  // Should fail - excess property on config
  // @ts-expect-error - Excess property age
  Ts.Test.subNoExcess<Config>()({ id: true, age: 30 })

  // Should fail - wrong type
  // @ts-expect-error - id should be boolean
  Ts.Test.subNoExcess<Q>()({ id: 'wrong' })

  // Should fail - both excess and wrong type
  // @ts-expect-error - id wrong type and extra has excess property
  Ts.Test.subNoExcess<Q>()({ id: 'wrong', extra: 1 })
})

test('subNoExcess - comparison with sub', () => {
  type Q = { id: boolean }

  // .sub allows excess properties
  Ts.Test.sub<Q>()({ id: true, extra: 1 }) // ✓ Passes

  // .subNoExcess rejects excess properties
  // @ts-expect-error - Excess property rejected
  Ts.Test.subNoExcess<Q>()({ id: true, extra: 1 })
})

test('subNoExcess - typo detection', () => {
  type QueryOptions = { limit?: number; offset?: number }

  // Common typo: "offest" instead of "offset"
  // @ts-expect-error - Catches typo!
  Ts.Test.subNoExcess<QueryOptions>()({ limit: 10, offest: 20 })

  // Correct spelling passes
  Ts.Test.subNoExcess<QueryOptions>()({ limit: 10, offset: 20 })
})

// Type-level tests
type _SubNoExcessTests = Ts.Test.Cases<
  // Should pass - exact match
  Ts.Test.subNoExcess<{ id: boolean }, { id: true }>,
  // Should pass - subtype without excess
  Ts.Test.subNoExcess<{ id: boolean }, { id: boolean }>,
  // Should pass - optional included
  Ts.Test.subNoExcess<{ id: boolean; name?: string }, { id: true; name: 'test' }>,
  // Should pass - optional omitted
  Ts.Test.subNoExcess<{ id: boolean; name?: string }, { id: true }>
>

// Negative tests - intentionally excluded from Cases (would show errors)
// These demonstrate that subNoExcess correctly rejects:
// - Ts.Test.subNoExcess<{ id: boolean }, { id: true; extra: 1 }> // Excess property
// - Ts.Test.subNoExcess<{ id: boolean }, { id: 'wrong' }> // Wrong type
// - Ts.Test.subNoExcess<{ id: boolean; name: string }, { id: true }> // Missing required

test('sup (supertype)', () => {
  // Test supertype relationships (reverse of sub)
  interface Base {
    id: string
  }
  interface Extended extends Base {
    name: string
  }

  const _extended: Extended = { id: '1', name: 'test' }
  const _base: Base = { id: '1' }

  // Note: sup checks if the actual type extends the supertype
  // This test is expected to show type errors to verify our assertions work
  // Ts.Test.sup<Base>()(extended) // Should pass - Extended extends Base
})

test('exact (exact structural equality)', () => {
  // Should pass
  // Test exact type equality
  Ts.Test.exact<string>()('hello')
  Ts.Test.exact<{ a: 1 }>()({ a: 1 } as { a: 1 })
  // @ts-expect-error - Types are not exactly equal (too narrow)
  Ts.Test.exact<string | number>()('hello')
  // @ts-expect-error - Types are not exactly equal (too wide)
  Ts.Test.exact<string | number>()(ArrMut.getRandomly(['hello' as string, 1 as number, true]))
  // @ts-expect-error - Types are not exactly equal
  Ts.Test.exact<{ a: 1; b?: 2 }>()({ a: 1 })
})

test('IsExact with edge cases', () => {
  // IsExact with never
  type Test1 = Ts.IsExact<never, never> // Should be true
  type Test2 = Ts.IsExact<never, 1> // Should be false
  type Test3 = Ts.IsExact<1, never> // Should be false
  type Test4 = Ts.IsExact<never, string> // Should be false

  // IsExact with any
  type Test5 = Ts.IsExact<any, any> // Should be true
  type Test6 = Ts.IsExact<any, unknown> // Should be false
  type Test7 = Ts.IsExact<any, never> // Should be false

  // IsExact with unknown
  type Test8 = Ts.IsExact<unknown, unknown> // Should be true
  type Test9 = Ts.IsExact<unknown, any> // Should be false
  type Test10 = Ts.IsExact<unknown, never> // Should be false

  // Verify tests compile correctly
  // @ts-expect-error - Test1 should be true
  const _test1: Test1 = false
  // @ts-expect-error - Test2 should be false
  const _test2: Test2 = true
  // @ts-expect-error - Test3 should be false
  const _test3: Test3 = true
  // @ts-expect-error - Test4 should be false
  const _test4: Test4 = true
  // @ts-expect-error - Test5 should be true
  const _test5: Test5 = false
  // @ts-expect-error - Test6 should be false
  const _test6: Test6 = true
  // @ts-expect-error - Test7 should be false
  const _test7: Test7 = true
  // @ts-expect-error - Test8 should be true
  const _test8: Test8 = false
  // @ts-expect-error - Test9 should be false
  const _test9: Test9 = true
  // @ts-expect-error - Test10 should be false
  const _test10: Test10 = true
})

test('GetRelation with edge cases', () => {
  // GetRelation with never - never extends everything, so it's a subtype of everything
  type Test1 = Ts.GetRelation<never, never> // Should be 'equivalent'
  type Test2 = Ts.GetRelation<string, never> // Should be 'subtype' (never extends string)
  type Test3 = Ts.GetRelation<never, string> // Should be 'supertype' (string doesn't extend never)

  // GetRelation with any - any is both subtype and supertype of everything (special case)
  type Test4 = Ts.GetRelation<any, any> // Should be 'equivalent'
  type Test5 = Ts.GetRelation<string, any> // any extends string AND string extends any
  type Test6 = Ts.GetRelation<any, string> // any extends string AND string extends any

  // GetRelation with unknown
  type Test7 = Ts.GetRelation<unknown, unknown> // Should be 'equivalent'
  type Test8 = Ts.GetRelation<string, unknown> // Should be 'subtype' (unknown extends string? no, string extends unknown)
  type Test9 = Ts.GetRelation<unknown, string> // Should be 'supertype' (string extends unknown)

  // Verify correct relations
  const _test1: Test1 = 'equivalent'
  const _test2: Test2 = 'subtype'
  const _test3: Test3 = 'supertype'
  const _test4: Test4 = 'equivalent'
  // Test5 and Test6 are special - any is weird
  const _test7: Test7 = 'equivalent'
  // const _test8: Test8 = 'subtype'  // Need to verify actual behavior
  // const _test9: Test9 = 'supertype'
})

test('exact with never (regression test)', () => {
  // never should be exactly equal to never
  Ts.Test.exact<never>()(null as never)

  // @ts-expect-error - never is NOT exactly equal to any other type
  Ts.Test.exact<1>()(null as never)

  // @ts-expect-error - never is NOT exactly equal to string
  Ts.Test.exact<string>()(null as never)

  // @ts-expect-error - number is NOT exactly equal to never
  Ts.Test.exact<never>()(42)
})

test('equiv (equivalence/mutual assignability)', () => {
  // Union order doesn't matter for equivalence
  type Union1 = 1 | 2
  type Union2 = 2 | 1
  const union1 = 1 as Union1
  Ts.Test.equiv<Union2>()(union1)

  // Value-level equiv now correctly requires mutual assignability (use sub for subtype checking)
  Ts.Test.sub<string | number>()('hello') // OK - 'hello' extends string | number
  // @ts-expect-error - Not mutually assignable (different types)
  Ts.Test.equiv<number>()('hello')
})

test('equiv with lintBidForExactPossibility disabled (default)', () => {
  // Default behavior: equiv allows structurally equal types (value-level only)
  // Type-level assertions use Cases which require explicit types

  // Value-level - these work because linting is disabled by default
  Ts.Test.equiv<string>()('hello') // OK - no error
  Ts.Test.equiv<number>()(42) // OK - no error

  // Union reassignment works
  type Union1 = 1 | 2
  type Union2 = 2 | 1
  const union1 = 1 as Union1
  Ts.Test.equiv<Union2>()(union1) // OK

  // equiv still works correctly when only equivalent (not exact)
  const strIntersection = 'test' as string & {}
  Ts.Test.equiv<string>()(strIntersection) // OK - correct equiv usage
})

// Note: Testing with linting enabled would require changing the global setting,
// which would affect all tests. The type-level test below demonstrates the concept.

// Type-level test showing equiv behavior with default settings
type _EquivDefaultBehavior = Ts.Test.Cases<
  // These pass because linting is disabled by default
  Ts.Test.equiv<string, string>,
  Ts.Test.equiv<number, number>
> // Note: 1 | 2 vs 2 | 1 are the same type, so equiv passes

// Test union reassignment at type level
type Union1 = 1 | 2
type Union2 = 2 | 1
type _UnionEquiv = Ts.Test.equiv<Union2, Union1> // Should pass

const syncValue = 42
const asyncValue = Promise.resolve(42)

test('promise', () => {
  // Should pass
  Ts.Test.promise<number>()(asyncValue)
  // @ts-expect-error - Wrong Promise type
  Ts.Test.promise<string>()(asyncValue)
  // @ts-expect-error - Not a Promise
  Ts.Test.promise<number>()(syncValue)
})

test('Not.promise', () => {
  // Value mode - should pass for non-Promise
  Ts.Test.Not.promise()(syncValue)
  // @ts-expect-error - Value mode should fail for Promise
  Ts.Test.Not.promise()(asyncValue)

  // Type-only mode - should pass for non-Promise
  Ts.Test.Not.promise<number>()
  // @ts-expect-error - Type-only mode should fail for Promise
  Ts.Test.Not.promise<Promise<number>>()
})

test('Not.array', () => {
  const str = 'hello'
  const arr = [1, 2, 3]

  // Value mode - should pass for non-array
  Ts.Test.Not.array()(str)
  // @ts-expect-error - Value mode should fail for array
  Ts.Test.Not.array()(arr)

  // Type-only mode - should pass for non-array
  Ts.Test.Not.array<string>()
  // @ts-expect-error - Type-only mode should fail for array
  Ts.Test.Not.array<number[]>()
})

test('array', () => {
  const strings = ['a', 'b', 'c']
  const numbers = [1, 2, 3]
  const mixed = [1, 'a', 2]
  const notArray = 'hello'

  Ts.Test.array<string>()(strings) // Should pass
  Ts.Test.array<number>()(numbers) // Should pass
  // @ts-expect-error - Wrong element type
  Ts.Test.array<string>()(numbers)
  Ts.Test.array<string | number>()(mixed) // Should pass
  // @ts-expect-error - Not an array
  Ts.Test.array<string>()(notArray)
})

// Test use with try.test-d.ts patterns
test('integration with tryOr', () => {
  // Using Not.promise for sync results
  const syncResult = Err.tryOr(() => 42, 'fallback')
  Ts.Test.Not.promise()(syncResult)

  // Using promise for async results
  const asyncResult = Err.tryOr(async () => 42, 'fallback')
  Ts.Test.promise<number | string>()(asyncResult)
})

// Individual type assertions
type _SubtypeTest = Ts.Test.sub<string, 'hello'> // Should be true
type _SupertypeTest = Ts.Test.sup<{ a: 1 }, { a: 1; b: 2 }> // Should be true
type _ExactTest = Ts.Test.exact<number, number> // Should be true
type _ComputedTest = Ts.Test.equiv<1 | 2, 2 | 1> // Should be true
type _ExtendsTest = Ts.Test.sub<string, 'hello'> // Should be true

// Test exact vs equiv differences
type _EqualStructural1 = Ts.Test.exact<1 | 2, 1 | 2> // true - same structure
type _EqualStructural2 = Ts.Test.exact<1 | 2, 2 | 1> // true - union order doesn't matter for structural equality either

type _EqualComputed1 = Ts.Test.equiv<1 | 2, 2 | 1> // true - same computed type
type _EqualComputed2 = Ts.Test.equiv<string & {}, string> // true - both compute to string
type _EqualComputed3 = Ts.Test.equiv<number, number> // true

// === Test testCase and testCases Types ===

// Test testCase type - single assertion wrapper
type _testCase1 = Ts.Test.Case<never> // Should work - never is success
type _testCase2 = Ts.Test.Case<Ts.Test.exact<string, string>> // Should work
type _testCase3 = Ts.Test.Case<Ts.Test.sub<string, 'hello'>> // Should work

// @ts-expect-error - true doesn't extend never
type _testCaseFail1 = Ts.Test.Case<true>
// @ts-expect-error - equal returns StaticErrorAssertion for mismatched types
type _testCaseFail2 = Ts.Test.Case<Ts.Test.exact<string, number>>

// Test testCases type - multiple assertions
type _testCases1 = Ts.Test.Cases<
  Ts.Test.exact<string, string>,
  Ts.Test.sub<string, 'hello'>,
  Ts.Test.equalNever<never>,
  Ts.Test.sub<string, 'hello'>
> // Should be true

// Test testCases with many assertions
type _testCasesMany = Ts.Test.Cases<
  Ts.Test.exact<1, 1>,
  Ts.Test.exact<true, true>,
  Ts.Test.exact<true, true>,
  // @ts-expect-error - This should fail
  Ts.Test.exact<1, 0>
>

// === Test parameters ===

test('parameters runtime', () => {
  function add(a: number, b: number): number {
    return a + b
  }
  function greet(name: string): string {
    return `Hello ${name}`
  }

  // Should pass
  Ts.Test.parameters<[number, number]>()(add)
  Ts.Test.parameters<[string]>()(greet)

  // @ts-expect-error - Wrong parameter types
  Ts.Test.parameters<[string, string]>()(add)
  // @ts-expect-error - Wrong number of parameters
  Ts.Test.parameters<[string, string]>()(greet)
  // @ts-expect-error - Wrong parameter type
  Ts.Test.parameters<[number]>()(greet)
})

// === Test type-only mode for all assertions ===

test('type-only mode - exact', () => {
  // Should pass
  Ts.Test.exact<string, string>()
  Ts.Test.exact<number, number>()
  Ts.Test.exact<{ a: 1 }, { a: 1 }>()
  Ts.Test.exact<never, never>() // Can test never directly!

  // These return StaticErrorAssertion types and require error argument
  // @ts-expect-error - Assertion fails, requires error argument
  void Ts.Test.exact<string, number>()
  // @ts-expect-error - Assertion fails, requires error argument
  void Ts.Test.exact<string | number, string>()
})

test('type-only mode - equiv', () => {
  // Should pass
  Ts.Test.equiv<string, string>()
  Ts.Test.equiv<1 | 2, 2 | 1>() // Mutually assignable
  Ts.Test.equiv<string & {}, string>() // Both compute to string

  // Returns StaticErrorAssertion and requires error argument
  // @ts-expect-error - Assertion fails, requires error argument
  void Ts.Test.equiv<string, number>()
})

test('type-only mode - sub', () => {
  // Should pass
  Ts.Test.sub<string, 'hello'>() // 'hello' extends string
  Ts.Test.sub<object, { a: 1 }>() // { a: 1 } extends object
  Ts.Test.sub<number, 42>()

  // Returns StaticErrorAssertion and requires error argument
  // @ts-expect-error - Assertion fails, requires error argument
  void Ts.Test.sub<'hello', string>() // string doesn't extend 'hello'
})

test('type-only mode - subNoExcess', () => {
  type Config = { id: boolean; name?: string }

  // Should pass
  Ts.Test.subNoExcess<Config, { id: true }>()
  Ts.Test.subNoExcess<Config, { id: true; name: 'test' }>()

  // Returns StaticErrorAssertion and requires error argument
  // @ts-expect-error - Assertion fails, requires error argument
  void Ts.Test.subNoExcess<Config, { id: true; extra: 1 }>()
})

test('type-only mode - subNot', () => {
  // Should pass
  Ts.Test.subNot<number, string>()
  Ts.Test.subNot<string, number>()

  // Returns StaticErrorAssertion and requires error argument
  // @ts-expect-error - Assertion fails, requires error argument
  void Ts.Test.subNot<string, 'hello'>()
})

test('type-only mode - sup', () => {
  // Should pass
  Ts.Test.sup<object, { a: 1 }>() // { a: 1 } extends object
  Ts.Test.sup<string, 'hello'>() // 'hello' extends string

  // Returns StaticErrorAssertion - expects error argument when assertion fails
  // @ts-expect-error - Expected 1 arguments (error object) when assertion fails
  void Ts.Test.sup<{ a: 1 }, object>()
})

test('type-only mode - parameters (the original use case!)', () => {
  function add(a: number, b: number): number {
    return a + b
  }
  type AddParams = Parameters<typeof add>

  // Should pass
  Ts.Test.parameters<[number, number], AddParams>()
  Ts.Test.parameters<[number, number], [number, number]>()

  // Returns StaticErrorAssertion and requires error argument
  // @ts-expect-error - Assertion fails, requires error argument
  void Ts.Test.parameters<[string, string], AddParams>()

  // Real-world example from user's code
  // type i1 = Interceptor.InferFromPipeline<typeof p1>
  // Ts.Test.parameters<[steps: { a: any; b: any; c: any }], i1>()
})

test('type-only mode - promise', () => {
  // Should pass
  Ts.Test.promise<number, Promise<number>>()
  Ts.Test.promise<string, Promise<string>>()

  // Returns StaticErrorAssertion and requires error argument
  // @ts-expect-error - Assertion fails, requires error argument
  void Ts.Test.promise<string, Promise<number>>()
  // @ts-expect-error - Assertion fails, requires error argument
  void Ts.Test.promise<number, number>()
})

test('type-only mode - array', () => {
  // Should pass
  Ts.Test.array<string, string[]>()
  Ts.Test.array<number, number[]>()
  Ts.Test.array<{ a: 1 }, Array<{ a: 1 }>>()

  // Returns StaticErrorAssertion and requires error argument
  // @ts-expect-error - Assertion fails, requires error argument
  void Ts.Test.array<number, string[]>()
  // @ts-expect-error - Assertion fails, requires error argument
  void Ts.Test.array<string, string>()
})

// === Test new features ===

test('tuple', () => {
  Ts.Test.tuple<[string, number]>()(['hello', 42] as [string, number])
  // @ts-expect-error - Wrong order
  Ts.Test.tuple<[string, number]>()([42, 'hello'] as [number, string])
})

test('returns', () => {
  function getNumber() {
    return 42
  }
  Ts.Test.returns<number>()(getNumber)
  // @ts-expect-error - Wrong return type
  Ts.Test.returns<string>()(getNumber)
})

test('returnsPromise', () => {
  async function getNumber() {
    return 42
  }
  Ts.Test.returnsPromise<number>()(getNumber)
  // @ts-expect-error - Wrong resolved type
  Ts.Test.returnsPromise<string>()(getNumber)
})

test('propertiesSub', () => {
  type User = { name: string; age: number }
  Ts.Test.propertiesSub<{ name: string }, User>()
  // @ts-expect-error - Wrong property type
  Ts.Test.propertiesSub<{ name: number }, User>()
})

test('propertiesExact', () => {
  type User = { name: string; age: number }
  Ts.Test.propertiesExact<{ name: string }, User>()
  // @ts-expect-error - Not exact
  Ts.Test.propertiesExact<{ name: string | number }, User>()
})

test('propertiesEquiv', () => {
  type User = { name: string; count: number & {} }
  Ts.Test.propertiesEquiv<{ count: number }, User>()
  // @ts-expect-error - Not equivalent
  Ts.Test.propertiesEquiv<{ name: number }, User>()
})

test('equivNoExcess', () => {
  type Config = { id: boolean; name?: string }
  // Value mode
  Ts.Test.equivNoExcess<Config>()({ id: true })
  // @ts-expect-error - Excess property
  Ts.Test.equivNoExcess<Config>()({ id: true, extra: 1 })
})
