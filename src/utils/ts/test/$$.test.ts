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
  ERROR_________: "Types are completely disjoint (no common values)"
  expected______: string
  actual________: number
  tip___________: "These types have no overlap and will never be equal"
}`)
})

test('exact error - SingleOperation case', () => {
  type A<T = {}> = { query: T }
  type B = { name: 'default'; result: { a: string | null } }
  attest({} as Ts.Test.exact<A, B>).type.toString.snap(`{
  ERROR_________: "Types have overlapping values but are not structurally equal"
  expected______: A<{}>
  actual________: B
  diff_missing__: { query: {} }
  diff_excess___: {
    name: "default"
    result: { a: string | null }
  }
  tip___________: "Types share some possible values but are different"
}`)
})

test('exact error - with built-in types preserved', () => {
  type A = { a: Date; b: string }
  type B = { a: number; b: string }
  attest({} as Ts.Test.exact<A, B>).type.toString.snap(`{
  ERROR_________: "Types have overlapping values but are not structurally equal"
  expected______: A
  actual________: B
  diff_mismatch_: { a: { expected: Date; actual: number } }
  tip___________: "Types share some possible values but are different"
}`)
})

test('exact error - diff with missing, excess, and mismatched', () => {
  type Expected = {
    id: string
    name: string
    age: number
  }
  type Actual = {
    id: number // Mismatched - different type
    name: string // Same
    email: string // Excess - not in Expected
  }
  attest({} as Ts.Test.exact<Expected, Actual>).type.toString.snap(`{
  ERROR_________: "Types have overlapping values but are not structurally equal"
  expected______: Expected
  actual________: Actual
  diff_missing__: { age: number }
  diff_excess___: { email: string }
  diff_mismatch_: {
    id: { expected: string; actual: number }
  }
  tip___________: "Types share some possible values but are different"
}`)
})

test('exact error - optionality difference', () => {
  type Expected = { x: 1 }
  type Actual = { x?: 1 }
  attest({} as Ts.Test.exact<Expected, Actual>).type.toString.snap(`{
  ERROR_________: "Actual type is a supertype of expected type but not structurally equal"
  expected______: Expected
  actual________: Actual
  diff_mismatch_: {
    x: { expected: 1; actual: 1 | undefined }
  }
  tip___________: "Actual is wider than expected - types don't match exactly"
}`)
})

test('exact value mode - basic type mismatches', () => {
  const fn = Ts.Test.exact.is<string>()<42>
  attest(fn).type.toString.snap(`(
  actual: 42,
  error: "Types are completely disjoint (no common values)",
  expected: string
) => void`)

  const fn2 = Ts.Test.exact.is<{ a: string }>()<{ a: number; b: number }>
  attest(fn2).type.toString.snap(`(
  actual: { a: number; b: number },
  error: "Types have overlapping values but are not structurally equal",
  expected: { a: string }
) => void`)
})

test('exact value mode - never handling', () => {
  const neverValue = null as never
  Ts.Test.exact.is<never>()(neverValue)
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

  const exactComplexA = Ts.Test.exact.is<ComplexA>()
  const fnComplexError = exactComplexA<ComplexB>
  attest(fnComplexError).type.toString.snap(`(
  actual: ComplexB,
  error: "Types have overlapping values but are not structurally equal",
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
    { location: 'src/file.ts:42'; hint: 'Use string' }
  >
  attest({} as e).type.toString.snap(`{
  ERROR_________: "Custom validation failed"
  expected______: { a: string }
  actual________: { a: number }
  location______: "src/file.ts:42"
  hint__________: "Use string"
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
  ERROR_________: "Type mismatch"
  expected______: string
  actual________: number
  tip___________: "Use string"
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
  ERROR_________: "Type mismatch"
  expected______: string
  actual________: number
  tip_a_________: "Use string"
  tip_b_________: "Check docs"
  tip_c_________: "See example"
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
  ERROR_________: "Types have overlapping values but are not structurally equal"
  expected______: A
  actual________: B
  diff_mismatch_: {
    a: { expected: { value: Date }; actual: Date }
  }
  tip___________: "Types share some possible values but are different"
}`)
})

test('multiple preserved types from different augmentations', () => {
  type A = { a: Bar; b: string }
  type B = { a: { a: number; b: number }; b: string }
  attest({} as Ts.Test.exact<A, B>).type.toString.snap(`{
  ERROR_________: "Types have overlapping values but are not structurally equal"
  expected______: A
  actual________: B
  diff_mismatch_: {
    a: {
      expected: { a: string; b: number }
      actual: { a: number; b: number }
    }
  }
  tip___________: "Types share some possible values but are different"
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
  ERROR_________: "Actual type does not extend expected type"
  expected______: "hello"
  actual________: string
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
  attest({} as Ts.Test.sub.noExcess<Config, { id: true; extra: number }>).type
    .toString.snap(`{
  ERROR_________: "Type has excess properties not present in expected type"
  expected______: Config
  actual________: { id: true; extra: number }
  tip___________: "Excess properties: ''extra''"
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
  attest({} as Ts.Test.not.sub<string, 'hello'>).type.toString.snap(`{
  ERROR_________: "Type extends the type it should not extend"
  expected______: string
  actual________: "hello"
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
  ERROR_________: "Types are disjoint (no common values)"
  expected______: string
  actual________: number
}`)
})

test('equiv error - actual extends expected but not vice versa', () => {
  attest({} as Ts.Test.equiv<string, 'hello'>).type.toString.snap(`{
  ERROR_________: "Actual extends Expected, but Expected does not extend Actual"
  expected______: string
  actual________: "hello"
}`)
})

test('equiv error - expected extends actual but not vice versa', () => {
  attest({} as Ts.Test.equiv<'hello', string>).type.toString.snap(`{
  ERROR_________: "Expected extends Actual, but Actual does not extend Expected"
  expected______: "hello"
  actual________: string
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
    {} as Ts.Test.equiv.noExcess<
      Config,
      { id: boolean; name?: string; extra: number }
    >,
  ).type.toString.snap(`{
  ERROR_________: "Actual extends Expected, but Expected does not extend Actual"
  expected______: Config
  actual________: {
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
  attest({} as Ts.Test.exact.Never<string>).type.toString.snap(`{
  ERROR_________: "Actual type is a supertype of expected type but not structurally equal"
  expected______: never
  actual________: string
}`)
})

test('equalAny error - type is not any', () => {
  attest({} as Ts.Test.exact.Any<unknown>).type.toString.snap(`{
  ERROR_________: "Types are mutually assignable but not structurally equal"
  expected______: any
  actual________: unknown
  tip___________: "Use equiv() for mutual assignability OR apply Simplify<T> to normalize types"
}`)
})

test('equalUnknown error - type is not unknown', () => {
  attest({} as Ts.Test.exact.Unknown<string>).type.toString.snap(`{
  ERROR_________: "Actual type is a subtype of expected type but not structurally equal"
  expected______: unknown
  actual________: string
  tip___________: "Actual is narrower than expected - types don't match exactly"
}`)
})

test('equalUnknown error - type is any not unknown', () => {
  attest({} as Ts.Test.exact.Unknown<any>).type.toString.snap(`{
  ERROR_________: "Types are mutually assignable but not structurally equal"
  expected______: unknown
  actual________: any
  tip___________: "Use equiv() for mutual assignability OR apply Simplify<T> to normalize types"
}`)
})

test('equalEmptyObject error - type has keys', () => {
  attest({} as Ts.Test.exact.empty<{ a: number }>).type.toString.snap(`{
  ERROR_________: "Types are completely disjoint (no common values)"
  expected______: true
  actual________: false
  tip___________: "These types have no overlap and will never be equal"
}`)
})
