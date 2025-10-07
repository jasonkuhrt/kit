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

// These should produce type errors
// @ts-expect-error - Excess property
type _TestExcessFail1 = Ts.Test.subNoExcess<{ id: boolean }, { id: true; extra: 1 }>

// @ts-expect-error - Wrong type
type _TestWrongType = Ts.Test.subNoExcess<{ id: boolean }, { id: 'wrong' }>

// @ts-expect-error - Missing required property
type _TestMissing = Ts.Test.subNoExcess<{ id: boolean; name: string }, { id: true }>

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

test('bid (bidirectional assignability)', () => {
  // Union order doesn't matter for bidirectional assignability
  type Union1 = 1 | 2
  type Union2 = 2 | 1
  const union1 = 1 as Union1
  Ts.Test.bid<Union2>()(union1)

  // Value-level bid just checks subtype relationship
  Ts.Test.bid<string | number>()('hello') // OK - 'hello' extends string | number
  // @ts-expect-error - Not mutually assignable (different types)
  Ts.Test.bid<number>()('hello')
})

test('bid with lintBidForExactPossibility disabled (default)', () => {
  // Default behavior: bid allows structurally equal types (value-level only)
  // Type-level assertions use Cases which require explicit types

  // Value-level - these work because linting is disabled by default
  Ts.Test.bid<string>()('hello') // OK - no error
  Ts.Test.bid<number>()(42) // OK - no error

  // Union reassignment works
  type Union1 = 1 | 2
  type Union2 = 2 | 1
  const union1 = 1 as Union1
  Ts.Test.bid<Union2>()(union1) // OK

  // bid still works correctly when only bidirectional (not exact)
  const strIntersection = 'test' as string & {}
  Ts.Test.bid<string>()(strIntersection) // OK - correct bid usage
})

// Note: Testing with linting enabled would require changing the global setting,
// which would affect all tests. The type-level test below demonstrates the concept.

// Type-level test showing bid behavior with default settings
type _BidDefaultBehavior = Ts.Test.Cases<
  // These pass because linting is disabled by default
  Ts.Test.bid<string, string>,
  Ts.Test.bid<number, number>
> // Note: 1 | 2 vs 2 | 1 are the same type, so bid passes

// Test union reassignment at type level
type Union1 = 1 | 2
type Union2 = 2 | 1
type _UnionBid = Ts.Test.bid<Union2, Union1> // Should pass

// === Test Const Variants ===

test('exactConst - preserves literal types without cast', () => {
  // String literals
  Ts.Test.exactConst<'hello'>()('hello')

  // Number literals
  Ts.Test.exactConst<42>()(42)

  // Boolean literals
  Ts.Test.exactConst<true>()(true)

  // Object literals - no cast needed!
  Ts.Test.exactConst<{ readonly a: 1 }>()({ a: 1 })
  Ts.Test.exactConst<{ readonly name: 'Alice'; readonly age: 30 }>()({ name: 'Alice', age: 30 })

  // Array literals
  Ts.Test.exactConst<readonly [1, 2, 3]>()([1, 2, 3])

  // @ts-expect-error - Types don't match
  Ts.Test.exactConst<'hello'>()('world')
  // @ts-expect-error - Wrong literal value
  Ts.Test.exactConst<42>()(43)
})

test('subConst - preserves literal types', () => {
  // Literal extends base type
  Ts.Test.subConst<string>()('hello')
  Ts.Test.subConst<number>()(42)

  // Object literal extends interface
  Ts.Test.subConst<{ a: number }>()({ a: 1 })
  Ts.Test.subConst<{ a: number; b?: string }>()({ a: 1, b: 'test' })

  // @ts-expect-error - Type mismatch
  Ts.Test.subConst<string>()(42)
  // @ts-expect-error - Missing required property
  Ts.Test.subConst<{ a: number; b: string }>()({ a: 1 })
})

test('bidConst - mutual assignability with literals', () => {
  // Union types with literals
  type Status = 'pending' | 'complete'
  Ts.Test.bidConst<Status>()('pending')
  Ts.Test.bidConst<Status>()('complete')

  // Number unions
  type Score = 1 | 2 | 3 | 4 | 5
  Ts.Test.bidConst<Score>()(3)

  // @ts-expect-error - Not in union
  Ts.Test.bidConst<Status>()('invalid')
  // @ts-expect-error - Wrong type
  Ts.Test.bidConst<Status>()(42)
})

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

test('promiseNot', () => {
  // Should pass
  Ts.Test.promiseNot(syncValue)
  // @ts-expect-error - Value is a Promise
  Ts.Test.promiseNot(asyncValue)
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
  // Using promiseNot for sync results
  const syncResult = Err.tryOr(() => 42, 'fallback')
  Ts.Test.promiseNot(syncResult)

  // Using promise for async results
  const asyncResult = Err.tryOr(async () => 42, 'fallback')
  Ts.Test.promise<number | string>()(asyncResult)
})

// Individual type assertions
type _SubtypeTest = Ts.Test.sub<string, 'hello'> // Should be true
type _SupertypeTest = Ts.Test.sup<{ a: 1 }, { a: 1; b: 2 }> // Should be true
type _ExactTest = Ts.Test.exact<number, number> // Should be true
type _ComputedTest = Ts.Test.bid<1 | 2, 2 | 1> // Should be true
type _ExtendsTest = Ts.Test.sub<string, 'hello'> // Should be true

// Test exact vs bid differences
type _EqualStructural1 = Ts.Test.exact<1 | 2, 1 | 2> // true - same structure
type _EqualStructural2 = Ts.Test.exact<1 | 2, 2 | 1> // true - union order doesn't matter for structural equality either

type _EqualComputed1 = Ts.Test.bid<1 | 2, 2 | 1> // true - same computed type
type _EqualComputed2 = Ts.Test.bid<string & {}, string> // true - both compute to string
type _EqualComputed3 = Ts.Test.bid<number, number> // true

// === Test testCase and testCases Types ===

// Test testCase type - single assertion wrapper
type _testCase1 = Ts.Test.Case<true> // Should work
type _testCase2 = Ts.Test.Case<Ts.Test.exact<string, string>> // Should work
type _testCase3 = Ts.Test.Case<Ts.Test.sub<string, 'hello'>> // Should work

// @ts-expect-error - false doesn't extend true
type _testCaseFail1 = Ts.Test.Case<false>
// @ts-expect-error - equal returns false for mismatched types
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
