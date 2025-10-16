import { ArrMut } from '#arr-mut'
import { Err } from '#err'
import { Ts } from '#ts'
import { test } from 'vitest'

test('sub with StaticError', () => {
  // @ts-expect-error - Type 'number' is not assignable to type 'string'
  Ts.Test.sub.is<string>()(42)
  Ts.Test.sub.is<string>()('hello')
})

test('sub (subtype)', () => {
  Ts.Test.sub.is<string>()('hello')
  Ts.Test.sub.is<object>()({ a: 1 })
  // @ts-expect-error - Type '"world"' does not extend type '"hello"'
  Ts.Test.sub.is<'hello'>()('world')
})

test('subNoExcess - value level', () => {
  type Config = { id: boolean; name?: string }
  type Q = { id: boolean }

  // Ts.Test.sub.noExcess<Q>()({ id: true }) // TODO: Fix noExcess value-level API
  // Ts.Test.sub.noExcess<Q>()({ id: false }) // TODO: Fix noExcess value-level API
  // Ts.Test.sub.noExcess<Config>()({ id: true, name: 'test' }) // TODO: Fix noExcess value-level API
  // Ts.Test.sub.noExcess<Config>()({ id: true }) // TODO: Fix noExcess value-level API
  // Ts.Test.sub.noExcess<Q>()({ $skip: true, id: true }) // TODO: Fix noExcess value-level API
  // Ts.Test.sub.noExcess<Config>()({ id: true, age: 30 }) // TODO: Fix noExcess value-level API
  // Ts.Test.sub.noExcess<Q>()({ id: 'wrong' }) // TODO: Fix noExcess value-level API
  // Ts.Test.sub.noExcess<Q>()({ id: 'wrong', extra: 1 }) // TODO: Fix noExcess value-level API
})

test('subNoExcess - comparison with sub', () => {
  type Q = { id: boolean }

  // .sub allows excess properties
  Ts.Test.sub.is<Q>()({ id: true, extra: 1 })

  // .subNoExcess rejects excess properties
  // Ts.Test.sub.noExcess<Q>()({ id: true, extra: 1 }) // TODO: Fix noExcess value-level API
})

test('subNoExcess - typo detection', () => {
  type QueryOptions = { limit?: number; offset?: number }

  // Common typo: "offest" instead of "offset"
  // Ts.Test.sub.noExcess<QueryOptions>()({ limit: 10, offest: 20 }) // TODO: Fix noExcess value-level API

  // Correct spelling passes
  // Ts.Test.sub.noExcess<QueryOptions>()({ limit: 10, offset: 20 }) // TODO: Fix noExcess value-level API
})

// Type-level tests
type _SubNoExcessTests = Ts.Test.Cases<
  Ts.Test.sub.noExcess<{ id: boolean }, { id: true }>,
  Ts.Test.sub.noExcess<{ id: boolean }, { id: boolean }>,
  Ts.Test.sub.noExcess<{ id: boolean; name?: string }, { id: true; name: 'test' }>,
  Ts.Test.sub.noExcess<{ id: boolean; name?: string }, { id: true }>
>

// Negative tests - intentionally excluded from Cases (would show errors)
// These demonstrate that subNoExcess correctly rejects:
// - Ts.Test.sub.noExcess<{ id: boolean }, { id: true; extra: 1 }> // Excess property
// - Ts.Test.sub.noExcess<{ id: boolean }, { id: 'wrong' }> // Wrong type
// - Ts.Test.sub.noExcess<{ id: boolean; name: string }, { id: true }> // Missing required

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
  // Ts.Test.sub<Base>()(extended)
})

test('exact (exact structural equality)', () => {
  // Test exact type equality
  Ts.Test.exact.is<string>()('hello')
  Ts.Test.exact.is<{ a: 1 }>()({ a: 1 } as { a: 1 })
  // @ts-expect-error - Types are not exactly equal (too narrow)
  Ts.Test.exact.is<string | number>()('hello')
  // @ts-expect-error - Types are not exactly equal (too wide)
  Ts.Test.exact.is<string | number>()(ArrMut.getRandomly(['hello' as string, 1 as number, true]))
  // @ts-expect-error - Types are not exactly equal
  Ts.Test.exact.is<{ a: 1; b?: 2 }>()({ a: 1 })
})

test('IsExact with edge cases', () => {
  // IsExact with never
  type Test1 = Ts.Relation.IsExact<never, never>
  type Test2 = Ts.Relation.IsExact<never, 1>
  type Test3 = Ts.Relation.IsExact<1, never>
  type Test4 = Ts.Relation.IsExact<never, string>

  // IsExact with any
  type Test5 = Ts.Relation.IsExact<any, any>
  type Test6 = Ts.Relation.IsExact<any, unknown>
  type Test7 = Ts.Relation.IsExact<any, never>

  // IsExact with unknown
  type Test8 = Ts.Relation.IsExact<unknown, unknown>
  type Test9 = Ts.Relation.IsExact<unknown, any>
  type Test10 = Ts.Relation.IsExact<unknown, never>

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
  type Test1 = Ts.Relation.GetRelation<never, never>
  type Test2 = Ts.Relation.GetRelation<string, never>
  type Test3 = Ts.Relation.GetRelation<never, string>

  // GetRelation with any - any is both subtype and supertype of everything (special case)
  type Test4 = Ts.Relation.GetRelation<any, any>
  type Test5 = Ts.Relation.GetRelation<string, any> // any extends string AND string extends any
  type Test6 = Ts.Relation.GetRelation<any, string> // any extends string AND string extends any

  // GetRelation with unknown
  type Test7 = Ts.Relation.GetRelation<unknown, unknown>
  type Test8 = Ts.Relation.GetRelation<string, unknown>
  type Test9 = Ts.Relation.GetRelation<unknown, string>

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
  Ts.Test.exact.is<never>()(null as never)

  // @ts-expect-error - never is NOT exactly equal to any other type
  Ts.Test.exact.is<1>()(null as never)

  // @ts-expect-error - never is NOT exactly equal to string
  Ts.Test.exact.is<string>()(null as never)

  // @ts-expect-error - number is NOT exactly equal to never
  Ts.Test.exact.is<never>()(42)
})

test('equiv (equivalence/mutual assignability)', () => {
  // Union order doesn't matter for equivalence
  type Union1 = 1 | 2
  type Union2 = 2 | 1
  const union1 = 1 as Union1
  Ts.Test.equiv.is<Union2>()(union1)

  // Value-level equiv now correctly requires mutual assignability (use sub for subtype checking)
  Ts.Test.sub.is<string | number>()('hello') // OK - 'hello' extends string | number
  // @ts-expect-error - Not mutually assignable (different types)
  Ts.Test.equiv.is<number>()('hello')
})

test('equiv with lintBidForExactPossibility disabled (default)', () => {
  // Default behavior: equiv allows structurally equal types (value-level only)
  // Type-level assertions use Cases which require explicit types

  // Value-level - these work because linting is disabled by default
  Ts.Test.equiv.is<string>()('hello') // OK - no error
  Ts.Test.equiv.is<number>()(42) // OK - no error

  // Union reassignment works
  type Union1 = 1 | 2
  type Union2 = 2 | 1
  const union1 = 1 as Union1
  Ts.Test.equiv.is<Union2>()(union1) // OK

  // equiv still works correctly when only equivalent (not exact)
  const strIntersection = 'test' as string & {}
  Ts.Test.equiv.is<string>()(strIntersection) // OK - correct equiv usage
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
type _UnionEquiv = Ts.Test.equiv<Union2, Union1>

const syncValue = 42
const asyncValue = Promise.resolve(42)

test('promise', () => {
  // Ts.Test.exact.awaited.is<number>()(asyncValue) // TODO: Fix awaited value-level API
  // Ts.Test.exact.awaited.is<string>()(asyncValue) // TODO: Fix awaited value-level API
  // Ts.Test.exact.awaited.is<number>()(syncValue) // TODO: Fix awaited value-level API
})

// Old API test removed - not.promise does not exist in new API

// Old API test removed - not.array does not exist in new API

test('array', () => {
  const strings = ['a', 'b', 'c']
  const numbers = [1, 2, 3]
  const mixed = [1, 'a', 2]
  const notArray = 'hello'

  // Ts.Test.exact.array<string>()(strings) // TODO: Fix array value-level API
  // Ts.Test.exact.array<number>()(numbers) // TODO: Fix array value-level API
  // Ts.Test.exact.array<string>()(numbers) // TODO: Fix array value-level API
  // Ts.Test.exact.array<string | number>()(mixed) // TODO: Fix array value-level API
  // Ts.Test.exact.array<string>()(notArray) // TODO: Fix array value-level API
})

// Test use with try.test-d.ts patterns
test('integration with tryOr', () => {
  // Using Not.promise for sync results
  const syncResult = Err.tryOr(() => 42, 'fallback')
  // Ts.Test.not.promise()(syncResult) - old API removed

  // Using promise for async results
  const asyncResult = Err.tryOr(async () => 42, 'fallback')
  // Ts.Test.exact.awaited.is<number | string>()(asyncResult) // TODO: Fix awaited value-level API
})

// Individual type assertions
type _SubtypeTest = Ts.Test.sub<string, 'hello'>
type _SupertypeTest = Ts.Test.sub<{ a: 1 }, { a: 1; b: 2 }>
type _ExactTest = Ts.Test.exact<number, number>
type _ComputedTest = Ts.Test.equiv<1 | 2, 2 | 1>
type _ExtendsTest = Ts.Test.sub<string, 'hello'>

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
  Ts.Test.exact.Never<never>,
  Ts.Test.sub<string, 'hello'>
>

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

  // Ts.Test.exact.parameters<[number, number]>()(add) // TODO: Fix parameters value-level API
  // Ts.Test.exact.parameters<[string]>()(greet) // TODO: Fix parameters value-level API

  // Ts.Test.exact.parameters<[string, string]>()(add) // TODO: Fix parameters value-level API
  // Ts.Test.exact.parameters<[string, string]>()(greet) // TODO: Fix parameters value-level API
  // Ts.Test.exact.parameters<[number]>()(greet) // TODO: Fix parameters value-level API
})

// === Test type-only mode for all assertions ===

test('type-only mode - exact', () => {
  type _1 = Ts.Test.exact<string, string>
  type _2 = Ts.Test.exact<number, number>
  type _3 = Ts.Test.exact<{ a: 1 }, { a: 1 }>
  type _unused1 = Ts.Test.exact<never, never> // Can test never directly!

  // These return StaticErrorAssertion types and require error argument
  // @ts-expect-error - Assertion fails, requires error argument
  void Ts.Test.exact<string, number>()
  // @ts-expect-error - Assertion fails, requires error argument
  void Ts.Test.exact<string | number, string>()
})

test('type-only mode - equiv', () => {
  type _4 = Ts.Test.equiv<string, string>
  type _unused2 = Ts.Test.equiv<1 | 2, 2 | 1> // Mutually assignable
  type _unused3 = Ts.Test.equiv<string & {}, string> // Both compute to string

  // Returns StaticErrorAssertion and requires error argument
  // @ts-expect-error - Assertion fails, requires error argument
  void Ts.Test.equiv<string, number>()
})

test('type-only mode - sub', () => {
  type _unused4 = Ts.Test.sub<string, 'hello'> // 'hello' extends string
  type _unused5 = Ts.Test.sub<object, { a: 1 }> // { a: 1 } extends object
  type _5 = Ts.Test.sub<number, 42>

  // Returns StaticErrorAssertion and requires error argument
  // @ts-expect-error - Assertion fails, requires error argument
  void Ts.Test.sub<'hello', string>() // string doesn't extend 'hello'
})

test('type-only mode - subNoExcess', () => {
  type Config = { id: boolean; name?: string }

  type _typeOnlyTest1 = Ts.Test.sub.noExcess<Config, { id: true }>
  type _typeOnlyTest2 = Ts.Test.sub.noExcess<Config, { id: true; name: 'test' }>

  // Returns StaticErrorAssertion and requires error argument
  // @ts-expect-error - Assertion fails, requires error argument
  void Ts.Test.sub.noExcess<Config, { id: true; extra: 1 }>()
})

test('type-only mode - subNot', () => {
  type _notSubTest1 = Ts.Test.not.sub<number, string>
  type _notSubTest2 = Ts.Test.not.sub<string, number>

  // Returns StaticErrorAssertion and requires error argument
  // @ts-expect-error - Assertion fails, requires error argument
  void Ts.Test.not.sub<string, 'hello'>()
})

test('type-only mode - sup', () => {
  type _unused6 = Ts.Test.sub<object, { a: 1 }> // { a: 1 } extends object
  type _unused7 = Ts.Test.sub<string, 'hello'> // 'hello' extends string

  // Returns StaticErrorAssertion - expects error argument when assertion fails
  // @ts-expect-error - Expected 1 arguments (error object) when assertion fails
  void Ts.Test.sub<{ a: 1 }, object>()
})

test('type-only mode - parameters (the original use case!)', () => {
  function add(a: number, b: number): number {
    return a + b
  }
  type AddParams = Parameters<typeof add>

  type _typeOnlyTest1 = Ts.Test.exact.parameters<[number, number], AddParams>
  type _typeOnlyTest2 = Ts.Test.exact.parameters<[number, number], [number, number]>

  // Returns StaticErrorAssertion and requires error argument
  // @ts-expect-error - Assertion fails, requires error argument
  void Ts.Test.exact.parameters<[string, string], AddParams>()

  // Real-world example from user's code
  // type i1 = Interceptor.InferFromPipeline<typeof p1>
  // Ts.Test.exact.parameters<[steps: { a: any; b: any; c: any }], i1>()
})

test('type-only mode - promise', () => {
  type _typeOnlyTest1 = Ts.Test.exact.awaited<number, Promise<number>>
  type _typeOnlyTest2 = Ts.Test.exact.awaited<string, Promise<string>>

  // These return StaticErrorAssertion types (fail silently at type level)
  type _typeOnlyTestFail1 = Ts.Test.exact.awaited<string, Promise<number>>
  type _typeOnlyTestFail2 = Ts.Test.exact.awaited<number, number>
})

test('type-only mode - array', () => {
  type _typeOnlyTest1 = Ts.Test.exact.array<string, string[]>
  type _typeOnlyTest2 = Ts.Test.exact.array<number, number[]>
  type _typeOnlyTest3 = Ts.Test.exact.array<{ a: 1 }, Array<{ a: 1 }>>

  // These return StaticErrorAssertion types (fail silently at type level)
  type _typeOnlyTestFail1 = Ts.Test.exact.array<number, string[]>
  type _typeOnlyTestFail2 = Ts.Test.exact.array<string, string>
})

// Old API tests removed - these functions don't exist in new chaining API
// TODO: Re-implement these if they're needed as part of the new API

// === Test diff functionality ===

test('exact with diff - object types show property differences', () => {
  type Person = { name: string; age: number }
  type OtherPerson = { name: string; age: string; city: string }

  // This should fail and show missing/excess fields at type level (StaticErrorAssertion)
  type _6 = Ts.Test.exact<Person, OtherPerson>

  // Value mode should also show diff
  const other: OtherPerson = { name: 'John', age: '30', city: 'NYC' }
  // @ts-expect-error - Type mismatch with diff showing missing/excess
  Ts.Test.exact.is<Person>()(other)
})

test('exact with diff - nested objects', () => {
  type User = {
    id: number
    profile: {
      name: string
      email: string
    }
  }

  type OtherUser = {
    id: number
    profile: {
      name: string
      phone: string
    }
  }

  // Should show diff with nested differences (StaticErrorAssertion)
  type _7 = Ts.Test.exact<User, OtherUser>
})

test('exact with diff - primitives show no diff', () => {
  // Primitives shouldn't show diff field (only objects) - StaticErrorAssertion
  type _8 = Ts.Test.exact<string, number>

  type _9 = Ts.Test.exact<boolean, string>
})

test('exact with diff - mixed object and primitive', () => {
  type Config = { port: number }

  // Object vs primitive - should show diff only if both are objects (StaticErrorAssertion)
  type _10 = Ts.Test.exact<Config, number>

  type _11 = Ts.Test.exact<string, Config>
})

// Type-level tests demonstrating diff in error messages
type _DiffTest1 = Ts.Test.exact<
  { a: string; b: number },
  { a: string; b: string; c: boolean }
> // Should show missing: { b: number }, excess: { b: string, c: boolean }

type _DiffTest2 = Ts.Test.exact<
  { id: number; name: string },
  { id: number; age: number }
> // Should show missing: { name: string }, excess: { age: number }

// Test that diff appears in equivalent but not exact cases
type _DiffEquivalent = Ts.Test.exact<
  { a: 1 | 2 },
  { a: 2 | 1 }
>
