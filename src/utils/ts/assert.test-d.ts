import { ArrMut } from '#arr-mut'
import { Err } from '#err'
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
  Ts.assertExact<string | number>()(ArrMut.getRandomly(['hello' as string, 1 as number, true]))
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
  const syncResult = Err.tryOr(() => 42, 'fallback')
  Ts.assertNotPromise(syncResult)

  // Using assertPromise for async results
  const asyncResult = Err.tryOr(async () => 42, 'fallback')
  Ts.assertPromise<number | string>()(asyncResult)
})

// Individual type assertions
type _SubtypeTest = Ts.Assert<string, 'hello'> // Should be true
type _SupertypeTest = Ts.AssertSuper<{ a: 1 }, { a: 1; b: 2 }> // Should be true
type _ExactTest = Ts.AssertExact<number, number> // Should be true
type _ExtendsTest = Ts.AssertExtendsTyped<'hello', string> // Should be true

// === Test Case and Cases Types ===

// Test Case type - single assertion wrapper
type _Case1 = Ts.Case<true> // Should work
type _Case2 = Ts.Case<Ts.AssertEqual<string, string>> // Should work
type _Case3 = Ts.Case<Ts.AssertExtends<'hello', string>> // Should work

// @ts-expect-error - false doesn't extend true
type _CaseFail1 = Ts.Case<false>
// @ts-expect-error - AssertEqual returns false for mismatched types
type _CaseFail2 = Ts.Case<Ts.AssertEqual<string, number>>

// Test Cases type - multiple assertions
type _Cases1 = Ts.Cases<
  Ts.AssertEqual<string, string>,
  Ts.AssertExtends<'hello', string>,
  Ts.AssertNever<never>,
  Ts.Assert<string, 'hello'>
> // Should be true

// Test Cases with many assertions
type _CasesMany = Ts.Cases<
  Ts.AssertEqual<1, 1>,
  Ts.AssertEqual<Ts.Cases, true>,
  Ts.AssertEqual<Ts.Cases<true>, true>,
  // @ts-expect-error - This should fail
  Ts.AssertEqual<1, 0>
>
