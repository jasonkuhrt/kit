import { Ts } from '#ts'
import { attest } from '@ark/attest'
import { test } from 'vitest'

//
//
//
//
// ─────────────────────────────────────────────────────────────────────────────
//
//   exact() Tests
//
// ─────────────────────────────────────────────────────────────────────────────
//
//
//
//

test('exact error - string vs number', () => {
  attest({} as Ts.Test.exact<string, number>).type.toString.snap(`{
  ERROR_______: "⚠ Types are not exactly equal"
  expected____: string
  actual______: number
}`)
})

test('exact error - SingleOperation case', () => {
  type A<T = {}> = { query: T }
  type B = { name: 'default'; result: { a: string | null } }
  attest({} as Ts.Test.exact<A, B>).type.toString.snap(`{
  ERROR_______: "⚠ Types are not exactly equal"
  expected____: A<{}>
  actual______: B
}`)
})

test('exact error - with built-in types preserved', () => {
  type A = { a: Date; b: string }
  type B = { a: number; b: string }
  attest({} as Ts.Test.exact<A, B>).type.toString.snap(`{
  ERROR_______: "⚠ Types are not exactly equal"
  expected____: A
  actual______: B
}`)
})

test('exact value mode - basic type mismatches', () => {
  const fn = Ts.Test.exact<string>()<42>
  attest(fn).type.toString.snap(`(
  actual: 42,
  error: "⚠ Types are not exactly equal",
  expected: string
) => void`)

  const fn2 = Ts.Test.exact<{ a: string }>()<{ a: number; b: number }>
  attest(fn2).type.toString.snap(`(
  actual: { a: number; b: number },
  error: "⚠ Types are not exactly equal",
  expected: { a: string }
) => void`)
})

test('exact value mode - never handling', () => {
  const neverValue = null as never
  Ts.Test.exact<never>()(neverValue)
})

test('exact value mode - parameter-based error feedback', () => {
  type IsExact<Expected, Actual> = Expected extends Actual ? Actual extends Expected ? true
    : false
    : false

  type ExactV1<Expected> = <Actual>(
    actual: Actual,
    ...errorInfo: IsExact<Expected, Actual> extends true ? []
      : [error: '⚠ Types are not exactly equal', expected: Expected]
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

  type ComplexA = {
    id: string
    user: { name: string; age: number }
    tags: string[]
  }

  type ComplexB = {
    id: string
    user: { name: string; age: string }
    tags: string[]
    extra: boolean
  }

  const exactComplexA = (() => {}) as ExactV1<ComplexA>
  const fnComplexError = exactComplexA<ComplexB>
  attest(fnComplexError).type.toString.snap(`(
  actual: ComplexB,
  error: "⚠ Types are not exactly equal",
  expected: ComplexA
) => void`)
})

test('exact value mode - complex type aliases in signatures', () => {
  type ComplexA = {
    id: string
    user: { name: string; age: number }
    tags: string[]
  }

  type ComplexB = {
    id: string
    user: { name: string; age: string }
    tags: string[]
    extra: boolean
  }

  const exactComplexA = Ts.Test.exact<ComplexA>()
  const fnComplexError = exactComplexA<ComplexB>
  attest(fnComplexError).type.toString.snap(`(
  actual: ComplexB,
  error: "⚠ Types are not exactly equal",
  expected: ComplexA
) => void`)
})

//
//
//
//
// ─────────────────────────────────────────────────────────────────────────────
//
//   StaticErrorAssertion Tests
//
// ─────────────────────────────────────────────────────────────────────────────
//
//
//
//

test('error with custom metadata', () => {
  type e = Ts.Test.StaticErrorAssertion<
    'Custom validation failed',
    { a: string },
    { a: number },
    never,
    { location: 'src/file.ts:42'; hint: 'Use string' }
  >
  attest({} as e).type.toString.snap(`{
  ERROR_______: "Custom validation failed"
  expected____: { a: string }
  actual______: { a: number }
  location____: "src/file.ts:42"
  hint________: "Use string"
}`)
})

test('error with tip string (backward compat)', () => {
  type e = Ts.Test.StaticErrorAssertion<
    'Type mismatch',
    string,
    number,
    'Use string'
  >
  attest({} as e).type.toString.snap(`{
  ERROR_______: "Type mismatch"
  expected____: string
  actual______: number
  tip_________: "Use string"
}`)
})

test('error with tuple of tips', () => {
  type e = Ts.Test.StaticErrorAssertion<
    'Type mismatch',
    string,
    number,
    ['Use string', 'Check docs', 'See example']
  >
  attest({} as e).type.toString.snap(`{
  ERROR_______: "Type mismatch"
  expected____: string
  actual______: number
  tip_a_______: "Use string"
  tip_b_______: "Check docs"
  tip_c_______: "See example"
}`)
})

//
//
//
//
// ─────────────────────────────────────────────────────────────────────────────
//
//   Global Display Settings Tests
//
// ─────────────────────────────────────────────────────────────────────────────
//
//
//
//

class Foo {
  constructor(public value: Date) {}
}

class Bar {
  constructor(
    public a: string,
    public b: number,
  ) {}
}

export {}

declare global {
  namespace KitLibrarySettings {
    namespace Ts {
      namespace Test {
        interface PreserveTypes {
          foo: Foo
        }
      }
    }
  }
}

declare global {
  namespace KitLibrarySettings {
    namespace Ts {
      namespace Test {
        interface PreserveTypes {
          bar: Bar
        }
      }
    }
  }
}

test('user-defined types preserved with preserveTypes setting', () => {
  type A = { a: Foo; b: string }
  type B = { a: Date; b: string }
  attest({} as Ts.Test.exact<A, B>).type.toString.snap(`{
  ERROR_______: "⚠ Types are not exactly equal"
  expected____: A
  actual______: B
}`)
})

test('multiple preserved types from different augmentations', () => {
  type A = { a: Bar; b: string }
  type B = { a: { a: number; b: number }; b: string }
  attest({} as Ts.Test.exact<A, B>).type.toString.snap(`{
  ERROR_______: "⚠ Types are not exactly equal"
  expected____: A
  actual______: B
}`)
})

//
//
//
//
// ─────────────────────────────────────────────────────────────────────────────
//
//   sub() Tests
//
// ─────────────────────────────────────────────────────────────────────────────
//
//
//
//

test('sub error - string does not extend hello', () => {
  attest({} as Ts.Test.sub<'hello', string>).type.toString.snap(`{
  ERROR_______: "Actual type does not extend expected type"
  expected____: "hello"
  actual______: string
}`)
})

//
//
//
//
// ─────────────────────────────────────────────────────────────────────────────
//
//   subNoExcess() Tests
//
// ─────────────────────────────────────────────────────────────────────────────
//
//
//
//

test('subNoExcess error - excess property', () => {
  type Config = { id: boolean; name?: string }
  attest({} as Ts.Test.subNoExcess<Config, { id: true; extra: number }>).type
    .toString.snap(`{
  ERROR_______: "Type has excess properties not present in expected type"
  expected____: Config
  actual______: { id: true; extra: number }
  tip_________: "Excess properties: ''extra''"
}`)
})

//
//
//
//
// ─────────────────────────────────────────────────────────────────────────────
//
//   subNot() Tests
//
// ─────────────────────────────────────────────────────────────────────────────
//
//
//
//

test('subNot error - hello extends string', () => {
  attest({} as Ts.Test.subNot<string, 'hello'>).type.toString.snap(`{
  ERROR_______: "Actual type extends type it should not extend"
  expected____: string
  actual______: "hello"
}`)
})

//
//
//
//
// ─────────────────────────────────────────────────────────────────────────────
//
//   equiv() Tests
//
// ─────────────────────────────────────────────────────────────────────────────
//
//
//
//

test('equiv error - types are disjoint', () => {
  attest({} as Ts.Test.equiv<string, number>).type.toString.snap(`{
  ERROR_______: "Types are disjoint (no common values)"
  expected____: string
  actual______: number
}`)
})

test('equiv error - actual extends expected but not vice versa', () => {
  attest({} as Ts.Test.equiv<string, 'hello'>).type.toString.snap(`{
  ERROR_______: "Actual extends Expected, but Expected does not extend Actual"
  expected____: string
  actual______: "hello"
}`)
})

test('equiv error - expected extends actual but not vice versa', () => {
  attest({} as Ts.Test.equiv<'hello', string>).type.toString.snap(`{
  ERROR_______: "Expected extends Actual, but Actual does not extend Expected"
  expected____: "hello"
  actual______: string
}`)
})

//
//
//
//
// ─────────────────────────────────────────────────────────────────────────────
//
//   equivNoExcess() Tests
//
// ─────────────────────────────────────────────────────────────────────────────
//
//
//
//

test('equivNoExcess error - excess property', () => {
  type Config = { id: boolean; name?: string }
  attest(
    {} as Ts.Test.equivNoExcess<
      Config,
      { id: boolean; name?: string; extra: number }
    >,
  ).type.toString.snap(`{
  ERROR_______: "Actual extends Expected, but Expected does not extend Actual"
  expected____: Config
  actual______: {
    id: boolean
    name?: string
    extra: number
  }
}`)
})

//
//
//
//
// ─────────────────────────────────────────────────────────────────────────────
//
//   Special Type Tests
//
// ─────────────────────────────────────────────────────────────────────────────
//
//
//
//

test('equalNever error - type is not never', () => {
  attest({} as Ts.Test.equalNever<string>).type.toString.snap(`{
  ERROR_______: "Type is not never"
  expected____: never
  actual______: string
}`)
})

test('equalAny error - type is not any', () => {
  attest({} as Ts.Test.equalAny<unknown>).type.toString.snap(`{
  ERROR_______: "Type is not any"
  expected____: any
  actual______: unknown
}`)
})

test('equalUnknown error - type is not unknown', () => {
  attest({} as Ts.Test.equalUnknown<string>).type.toString.snap(`{
  ERROR_______: "Type is not unknown"
  expected____: unknown
  actual______: string
}`)
})

test('equalUnknown error - type is any not unknown', () => {
  attest({} as Ts.Test.equalUnknown<any>).type.toString.snap(`{
  ERROR_______: "Type is any, not unknown"
  expected____: unknown
  actual______: any
}`)
})

test('equalEmptyObject error - type has keys', () => {
  attest({} as Ts.Test.equalEmptyObject<{ a: number }>).type.toString.snap(`{
  ERROR_______: "Type is not an empty object (has keys)"
  expected____: Empty
  actual______: object & { a: number }
}`)
})
