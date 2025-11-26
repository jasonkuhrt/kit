import { Fn } from '#fn'
import { Optic } from '#optic'
import { Ts } from '#ts'
import { attest } from '@ark/attest'
import { test } from 'vitest'
import { Type as A } from './__.ts'

// Shared type aliases for tests
type CA = { id: string; user: { name: string; age: number }; tags: string[] }
type CB = {
  id: string
  user: { name: string; age: string }
  tags: string[]
  extra: boolean
}

class Foo {
  constructor(public ts_assert_fixture_a: Date) {}
}
class Bar {
  constructor(
    public ts_assert_fixture_a: string,
    public ts_assert_fixture_b: number,
  ) {}
}

export {}

declare global {
  namespace KitLibrarySettings.Ts {
    interface PreserveTypes {
      foo: Foo
      bar: Bar
    }
  }
}

// exact() Tests

test('exact error - string vs number', () => {
  type E = Ts.Err.Show<A.exact<string, number>>
  attest({} as E).type.toString.snap(`{
  ERROR_________: ".assert"
  message_______: "EXPECTED and ACTUAL are disjoint"
  expected______: string
  actual________: number
}`)
})

test('exact error - SingleOperation case', () => {
  type A<T = {}> = { query: T }
  type B = { name: 'default'; result: { a: string | null } }
  type E = Ts.Err.Show<A.exact<A, B>>
  attest({} as E).type.toString.snap(`{
  ERROR_________: ".assert"
  message_______: "EXPECTED only overlaps with ACTUAL"
  expected______: A<{}>
  actual________: B
}`)
})

test('exact error - with built-in types preserved', () => {
  type A = { a: Date; b: string }
  type B = { a: number; b: string }
  type E = Ts.Err.Show<A.exact<A, B>>
  attest({} as E).type.toString.snap(`{
  ERROR_________: ".assert"
  message_______: "EXPECTED only overlaps with ACTUAL"
  expected______: A
  actual________: B
}`)
})

test('exact error - diff with missing, excess, and mismatched', () => {
  type Expected = { id: string; name: string; age: number }
  type Actual = { id: number; name: string; email: string }
  type E = Ts.Err.Show<A.exact<Expected, Actual>>
  attest({} as E).type.toString.snap(`{
  ERROR_________: ".assert"
  message_______: "EXPECTED only overlaps with ACTUAL"
  expected______: Expected
  actual________: Actual
}`)
})

test('exact error - optionality difference', () => {
  type Expected = { x: 1 }
  type Actual = { x?: 1 }
  type E = Ts.Err.Show<A.exact<Expected, Actual>>
  attest({} as E).type.toString.snap(`{
  ERROR_________: ".assert"
  message_______: "ACTUAL is supertype of EXPECTED"
  expected______: Expected
  actual________: Actual
}`)
})

test('exact value mode - basic type mismatches', () => {
  const fn = A.exact.ofAs<string>().onAs<42>
  const p = Ts.as<Parameters<typeof fn>>()
  attest(p).type.toString.snap(`[
  {
    ERROR_________: ".assert"
    message_______: "EXPECTED and ACTUAL are disjoint"
    expected______: string
    actual________: 42
  }
]`)

  const fn2 = A.exact.ofAs<{ a: string }>().onAs<{ a: number; b: number }>
  const p2 = Ts.as<Parameters<typeof fn2>>()
  attest(p2).type.toString.snap(`[
  {
    ERROR_________: ".assert"
    message_______: "EXPECTED only overlaps with ACTUAL"
    expected______: { a: string }
    actual________: { a: number; b: number }
  }
]`)
})

test('exact value mode - parameter-based error feedback', () => {
  type IsExact<E, A> = E extends A ? (A extends E ? true : false) : false
  type ExactV1<E> = <A>(
    actual: A,
    ...errorInfo: IsExact<E, A> extends true ? []
      : [error: '⚠ Types are not exactly equal', expected: E]
  ) => void

  const exactV1 = (() => {}) as ExactV1<string>
  const fnError = exactV1<42>
  attest(fnError).type.toString.snap(`(
  actual: 42,
  error: "⚠ Types are not exactly equal",
  expected: string
) => void`)

  const fnSuccess = exactV1<string>
  attest(fnSuccess).type.toString.snap('(actual: string) => void')

  const exactComplexA = (() => {}) as ExactV1<CA>
  const fnComplexError = exactComplexA<CB>
  attest(fnComplexError).type.toString.snap(`(
  actual: CB,
  error: "⚠ Types are not exactly equal",
  expected: CA
) => void`)
})

test('exact value mode - complex type aliases in signatures', () => {
  const on = A.exact.ofAs<CA>().on<CB>
  type P = Parameters<typeof on>
  attest({} as P).type.toString.snap(`[
  actual: {
    ERROR_________: ".assert"
    message_______: "EXPECTED only overlaps with ACTUAL"
    expected______: {
      id: string
      user: { name: string; age: number }
      tags: string[]
    }
    actual________: {
      id: string
      user: { name: string; age: string }
      tags: string[]
      extra: boolean
    }
  }
]`)
})

// StaticErrorAssertion Tests

test('error with custom metadata', () => {
  type E = Ts.Err.Show<
    A.StaticErrorAssertion<
      'Custom validation failed',
      { a: string },
      { a: number },
      { location: 'src/file.ts:42'; hint: 'Use string' }
    >
  >
  attest({} as E).type.toString.snap(`{
  ERROR_________: ".assert"
  message_______: "Custom validation failed"
  expected______: { a: string }
  actual________: { a: number }
  location______: "src/file.ts:42"
  hint__________: "Use string"
}`)
})

test('error with tip string', () => {
  type E = Ts.Err.Show<
    A.StaticErrorAssertion<'Type mismatch', string, number, 'Use string'>
  >
  attest({} as E).type.toString.snap(`{
  ERROR_________: ".assert"
  message_______: "Type mismatch"
  expected______: string
  actual________: number
  tip___________: "Use string"
}`)
})

test('error with tuple of tips', () => {
  type E = Ts.Err.Show<
    A.StaticErrorAssertion<
      'Type mismatch',
      string,
      number,
      ['Use string', 'Check docs', 'See example']
    >
  >
  attest({} as E).type.toString.snap(`{
  ERROR_________: ".assert"
  message_______: "Type mismatch"
  expected______: string
  actual________: number
  tip_a_________: "Use string"
  tip_b_________: "Check docs"
  tip_c_________: "See example"
}`)
})

// Global Display Settings Tests

test('user-defined types preserved with preserveTypes setting', () => {
  type A = { a: Foo; b: string }
  type B = { a: Date; b: string }
  type E = Ts.Err.Show<A.exact<A, B>>
  attest({} as E).type.toString.snap(`{
  ERROR_________: ".assert"
  message_______: "EXPECTED only overlaps with ACTUAL"
  expected______: A
  actual________: B
}`)
})

test('multiple preserved types from different augmentations', () => {
  type A = { a: Bar; b: string }
  type B = { a: { a: number; b: number }; b: string }
  type E = Ts.Err.Show<A.exact<A, B>>
  attest({} as E).type.toString.snap(`{
  ERROR_________: ".assert"
  message_______: "EXPECTED only overlaps with ACTUAL"
  expected______: A
  actual________: B
}`)
})

// sub() Tests

test('sub error - string does not extend hello', () => {
  attest({} as Ts.Err.Show<A.sub<'hello', string>>).type.toString.snap(`{
  ERROR_________: ".assert"
  message_______: "ACTUAL does not extend EXPECTED"
  expected______: "hello"
  actual________: string
}`)
})

// subNoExcess() Tests

// test('subNoExcess error - excess property', () => {
//   type Config = { id: boolean; name?: string }
//   attest({} as Assert.sub.noExcess<Config, { id: true; extra: number }>).type.toString.snap(`{
//   ERROR_________: "ACTUAL has excess properties not in EXPECTED"
//   expected______: Config
//   actual________: { id: true; extra: number }
//   tip___________: "Excess: ''extra''"
// }`)
// })

// subNot() Tests

test('subNot error - hello extends string', () => {
  attest({} as Ts.Err.Show<A.not.sub<string, 'hello'>>).type.toString
    .snap(`{
  ERROR_________: ".assert"
  message_______: "ACTUAL extends EXPECTED but should not"
  expected______: string
  actual________: "hello"
}`)
})

// equiv() Tests

test('equiv errors', () => {
  attest({} as Ts.Err.Show<A.equiv<string, number>>).type.toString.snap(`{
  ERROR_________: ".assert"
  message_______: "EXPECTED and ACTUAL are disjoint"
  expected______: string
  actual________: number
}`)
  attest({} as Ts.Err.Show<A.equiv<string, 'hello'>>).type.toString.snap(`{
  ERROR_________: ".assert"
  message_______: "ACTUAL extends EXPECTED but not vice versa"
  expected______: string
  actual________: "hello"
}`)
  attest({} as Ts.Err.Show<A.equiv<'hello', string>>).type.toString.snap(`{
  ERROR_________: ".assert"
  message_______: "EXPECTED extends ACTUAL but not vice versa"
  expected______: "hello"
  actual________: string
}`)
})

// equivNoExcess() Tests

// test('equivNoExcess error - excess property', () => {
//   type Config = { id: boolean; name?: string }
//   attest(
//     {} as Assert.equiv.noExcess.of<Config, { id: boolean; name?: string; extra: number }>,
//   ).type.toString.snap(`{
//   ERROR_________: "ACTUAL extends EXPECTED but not vice versa"
//   expected______: Config
//   actual________: {
//     id: boolean
//     name?: string
//     extra: number
//   }
// }`)
// })

// Extractor Tests

test('extractor - parameters', () => {
  type Fn = (a: number, b: number) => number
  type E = Ts.Err.Show<A.parameters.exact<[string, string], Fn>>
  attest({} as E).type.toString.snap(`{
  ERROR_________: ".assert"
  message_______: "EXPECTED only overlaps with ACTUAL"
  expected______: [string, string]
  actual________: [a: number, b: number]
}`)
})

test('extractor - awaited', () => {
  type _Pass = A.awaited.exact<number, Promise<number>>
  type E = Ts.Err.Show<A.awaited.exact<string, Promise<number>>>
  attest({} as E).type.toString.snap(`{
  ERROR_________: ".assert"
  message_______: "EXPECTED and ACTUAL are disjoint"
  expected______: string
  actual________: number
}`)
})

test('extractor - array', () => {
  type _Pass = A.array.exact<string, string[]>
  type E = Ts.Err.Show<A.array.exact<number, string[]>>
  attest({} as E).type.toString.snap(`{
  ERROR_________: ".assert"
  message_______: "EXPECTED and ACTUAL are disjoint"
  expected______: number
  actual________: string
}`)
})

// Extractor Resolution Errors - Value-Second API

test('extractor error - array on non-array', () => {
  type E = Ts.Err.Show<A.array.exact<number, string>>
  attest({} as E).type.toString.snap(`{
  ERROR_________: ".lens.incompatible"
  message_______: "Cannot extract array from incompatible type"
  expected______: "Type must extend array (readonly any[])"
  actual________: string
  attempted_____: "array lens"
}`)
})

test('extractor error - awaited on non-Promise string', () => {
  type E = Ts.Err.Show<A.awaited.exact<number, string>>
  attest({} as E).type.toString.snap(`{
  ERROR_________: ".lens.incompatible"
  message_______: "Cannot extract awaited from incompatible type"
  expected______: "Type must extend PromiseLike<any>"
  actual________: string
  attempted_____: "awaited lens"
}`)
})

test('extractor error - parameters on non-function', () => {
  type E = Ts.Err.Show<A.parameters.exact<[number], string>>
  attest({} as E).type.toString.snap(`{
  ERROR_________: ".lens.incompatible"
  message_______: "Cannot extract parameters from incompatible type"
  expected______: "Type must extend function ((...args: any) => any)"
  actual________: string
  attempted_____: "parameters lens"
}`)
})

test('extractor error - returned on non-function', () => {
  type E = Ts.Err.Show<A.returned.exact<number, string>>
  attest({} as E).type.toString.snap(`{
  ERROR_________: ".lens.incompatible"
  message_______: "Cannot extract returned from incompatible type"
  expected______: "Type must extend function ((...args: any) => any)"
  actual________: string
  attempted_____: "returned lens"
}`)
})

// Union Edge Cases - Unions with valid parts should pass

test('extractor - awaited with union containing Promise (type-level)', () => {
  // Union with Promise should NOT error - the Promise part is valid
  type MixedUnion = string | Promise<number>
  type _Pass = A.awaited.exact<number, MixedUnion> // Should pass - extracts from Promise part

  // Pure string should error
  type E = Ts.Err.Show<A.awaited.exact<number, string>>
  attest({} as E).type.toString.snap(`{
  ERROR_________: ".lens.incompatible"
  message_______: "Cannot extract awaited from incompatible type"
  expected______: "Type must extend PromiseLike<any>"
  actual________: string
  attempted_____: "awaited lens"
}`)
})

test('extractor - array with union containing array (type-level)', () => {
  // Union with array should NOT error - the array part is valid
  type MixedUnion = string | number[]
  type _Pass = A.array.exact<number, MixedUnion> // Should pass - extracts from array part

  // Pure string should error
  type E = Ts.Err.Show<A.array.exact<number, string>>
  attest({} as E).type.toString.snap(`{
  ERROR_________: ".lens.incompatible"
  message_______: "Cannot extract array from incompatible type"
  expected______: "Type must extend array (readonly any[])"
  actual________: string
  attempted_____: "array lens"
}`)
})

// Value-Level API Tests

test('extractor - awaited value-level API', () => {
  const promiseValue = Promise.resolve(42)
  type _Pass = A.awaited.exact<number, typeof promiseValue>

  // Error case - string is not a Promise
  const stringValue = 'hello'
  type E = Ts.Err.Show<A.awaited.exact<number, typeof stringValue>>
  attest({} as E).type.toString.snap(`{
  ERROR_________: ".lens.incompatible"
  message_______: "Cannot extract awaited from incompatible type"
  expected______: "Type must extend PromiseLike<any>"
  actual________: "hello"
  attempted_____: "awaited lens"
}`)
})

test('extractor - array value-level API', () => {
  const arrayValue = [1, 2, 3]
  type _Pass = A.array.exact<number, typeof arrayValue>

  // Error case - string is not an array
  const stringValue = 'hello'
  type E = Ts.Err.Show<A.array.exact<number, typeof stringValue>>
  attest({} as E).type.toString.snap(`{
  ERROR_________: ".lens.incompatible"
  message_______: "Cannot extract array from incompatible type"
  expected______: "Type must extend array (readonly any[])"
  actual________: "hello"
  attempted_____: "array lens"
}`)
})

test('extractor - returned value-level API', () => {
  const fnValue = () => 42
  type _Pass = A.returned.exact<number, typeof fnValue>

  // Error case - string is not a function
  const stringValue = 'hello'
  type E = Ts.Err.Show<A.returned.exact<number, typeof stringValue>>
  attest({} as E).type.toString.snap(`{
  ERROR_________: ".lens.incompatible"
  message_______: "Cannot extract returned from incompatible type"
  expected______: "Type must extend function ((...args: any) => any)"
  actual________: "hello"
  attempted_____: "returned lens"
}`)
})

//
//
// .extract() Method Tests
//
//

test('.extract() - type signature exists', () => {
  // Verify .extract() method exists on Assert builder
  type _HasExtract = typeof A extends { extract: (...args: any[]) => any } ? true
    : false
  type _Check = A.exact<_HasExtract, true>
})

test('.extract() - composition preserves .kind metadata', () => {
  // Create inline extractors using Lens types
  const awaited: Fn.Extractor<Promise<any>, any> = Object.assign(
    (value: Promise<any>) => value,
    { kind: {} as Optic.Awaited.$Get },
  )
  const returned: Fn.Extractor<(...args: any) => any, any> = Object.assign(
    (value: (...args: any) => any) => value,
    { kind: {} as Optic.Returned.$Get },
  )

  // Compose awaited and returned extractors
  const composed = Fn.compose(awaited, returned)

  // Verify compose preserves .kind property
  type _HasKind = typeof composed extends { kind: any } ? true : false
  type _Check = A.exact<_HasKind, true>
})
