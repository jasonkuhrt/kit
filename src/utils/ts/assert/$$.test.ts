import { attest } from '@ark/attest'
import { test } from 'vitest'
import * as Assert from './$$.js'

// Shared type aliases for tests
type CA = { id: string; user: { name: string; age: number }; tags: string[] }
type CB = { id: string; user: { name: string; age: string }; tags: string[]; extra: boolean }

class Foo {
  constructor(public value: Date) {}
}
class Bar {
  constructor(public a: string, public b: number) {}
}

export {}

declare global {
  namespace KitLibrarySettings.Ts.Assert {
    interface PreserveTypes {
      foo: Foo
      bar: Bar
    }
  }
}

// exact() Tests

test('exact error - string vs number', () => {
  attest({} as Assert.exact.of<string, number>).type.toString.snap(`{
  ERROR_________: "EXPECTED and ACTUAL are disjoint"
  expected______: string
  actual________: number
  tip___________: "Types share no values"
}`)
})

test('exact error - SingleOperation case', () => {
  type A<T = {}> = { query: T }
  type B = { name: 'default'; result: { a: string | null } }
  attest({} as Assert.exact.of<A, B>).type.toString.snap(`{
  ERROR_________: "EXPECTED only overlaps with ACTUAL"
  expected______: A<{}>
  actual________: B
  diff_missing__: { query: {} }
  diff_excess___: {
    name: "default"
    result: { a: string | null }
  }
  tip___________: "Types share some values but differ"
}`)
})

test('exact error - with built-in types preserved', () => {
  type A = { a: Date; b: string }
  type B = { a: number; b: string }
  attest({} as Assert.exact.of<A, B>).type.toString.snap(`{
  ERROR_________: "EXPECTED only overlaps with ACTUAL"
  expected______: A
  actual________: B
  diff_mismatch_: { a: { expected: Date; actual: number } }
  tip___________: "Types share some values but differ"
}`)
})

test('exact error - diff with missing, excess, and mismatched', () => {
  type E = { id: string; name: string; age: number }
  type A = { id: number; name: string; email: string }
  attest({} as Assert.exact.of<E, A>).type.toString.snap(`{
  ERROR_________: "EXPECTED only overlaps with ACTUAL"
  expected______: E
  actual________: A
  diff_missing__: { age: number }
  diff_excess___: { email: string }
  diff_mismatch_: {
    id: { expected: string; actual: number }
  }
  tip___________: "Types share some values but differ"
}`)
})

test('exact error - optionality difference', () => {
  type E = { x: 1 }
  type A = { x?: 1 }
  attest({} as Assert.exact.of<E, A>).type.toString.snap(`{
  ERROR_________: "ACTUAL is supertype of EXPECTED"
  expected______: E
  actual________: A
  diff_mismatch_: {
    x: { expected: 1; actual: 1 | undefined }
  }
  tip___________: "ACTUAL is wider than EXPECTED"
}`)
})

test('exact value mode - basic type mismatches', () => {
  const fn = Assert.exact.of.as<string>()<42>
  attest(fn).type.toString.snap(`{
  (actual: {
    ERROR_________: "EXPECTED and ACTUAL are disjoint"
    expected______: string
    actual________: 42
    tip___________: "Types share no values"
  }): void
  as<$actual>(
    ...params: [
      GuardActual_<
        $actual,
        SetMatcherType<
          SetRelator<Empty, ExactKind>,
          string
        >,
        ExactKind,
        $actual,
        [$actual] extends [AssertionErrorHash]
          ? $actual
          : IsExact<$actual, string> extends true
            ? never
            : GetRelation<
                  string,
                  $actual
                > extends "equivalent"
              ? {
                  ERROR_________: "EXPECTED and ACTUAL are only equivilant (not exact)"
                  expected______: string
                  actual________: $actual
                  tip___________: "Use equiv() for mutual assignability OR apply Simplify<T> to normalize types"
                }
              : GetRelation<
                    string,
                    $actual
                  > extends "subtype"
                ? {
                    ERROR_________: "ACTUAL is subtype of EXPECTED"
                    expected______: string
                    actual________: $actual
                    tip___________: "ACTUAL is narrower than EXPECTED"
                  }
                : GetRelation<
                      string,
                      $actual
                    > extends "supertype"
                  ? {
                      ERROR_________: "ACTUAL is supertype of EXPECTED"
                      expected______: string
                      actual________: $actual
                      tip___________: "ACTUAL is wider than EXPECTED"
                    }
                  : GetRelation<
                        string,
                        $actual
                      > extends "overlapping"
                    ? {
                        ERROR_________: "EXPECTED only overlaps with ACTUAL"
                        expected______: string
                        actual________: $actual
                        tip___________: "Types share some values but differ"
                      }
                    : {
                        ERROR_________: "EXPECTED and ACTUAL are disjoint"
                        expected______: string
                        actual________: $actual
                        tip___________: "Types share no values"
                      }
      >
    ] extends [AssertionErrorHash]
      ? [
          AssertionErrorHash &
            GuardActual_<
              $actual,
              SetMatcherType<
                SetRelator<Empty, ExactKind>,
                string
              >,
              ExactKind,
              $actual,
              [$actual] extends [AssertionErrorHash]
                ? $actual
                : IsExact<$actual, string> extends true
                  ? never
                  : GetRelation<
                        string,
                        $actual
                      > extends "equivalent"
                    ? {
                        ERROR_________: "EXPECTED and ACTUAL are only equivilant (not exact)"
                        expected______: string
                        actual________: $actual
                        tip___________: "Use equiv() for mutual assignability OR apply Simplify<T> to normalize types"
                      }
                    : GetRelation<
                          string,
                          $actual
                        > extends "subtype"
                      ? {
                          ERROR_________: "ACTUAL is subtype of EXPECTED"
                          expected______: string
                          actual________: $actual
                          tip___________: "ACTUAL is narrower than EXPECTED"
                        }
                      : GetRelation<
                            string,
                            $actual
                          > extends "supertype"
                        ? {
                            ERROR_________: "ACTUAL is supertype of EXPECTED"
                            expected______: string
                            actual________: $actual
                            tip___________: "ACTUAL is wider than EXPECTED"
                          }
                        : GetRelation<
                              string,
                              $actual
                            > extends "overlapping"
                          ? {
                              ERROR_________: "EXPECTED only overlaps with ACTUAL"
                              expected______: string
                              actual________: $actual
                              tip___________: "Types share some values but differ"
                            }
                          : {
                              ERROR_________: "EXPECTED and ACTUAL are disjoint"
                              expected______: string
                              actual________: $actual
                              tip___________: "Types share no values"
                            }
            >,
          ...([
            GuardAnyOrNeverActual<
              $actual,
              SetMatcherType<
                SetRelator<Empty, ExactKind>,
                string
              >
            >
          ] extends [AssertionErrorHash]
            ? [
                AssertionErrorHash &
                  GuardAnyOrNeverActual<
                    $actual,
                    SetMatcherType<
                      SetRelator<Empty, ExactKind>,
                      string
                    >
                  >
              ]
            : [])
        ]
      : [
            GuardAnyOrNeverActual<
              $actual,
              SetMatcherType<
                SetRelator<Empty, ExactKind>,
                string
              >
            >
          ] extends [AssertionErrorHash]
        ? [
            AssertionErrorHash &
              GuardAnyOrNeverActual<
                $actual,
                SetMatcherType<
                  SetRelator<Empty, ExactKind>,
                  string
                >
              >
          ]
        : []
  ): void
}`)

  const fn2 = Assert.exact.of.as<{ a: string }>()<{ a: number; b: number }>
  attest(fn2).type.toString.snap(`{
  (actual: {
    ERROR_________: "EXPECTED only overlaps with ACTUAL"
    expected______: { a: string }
    actual________: { a: number; b: number }
    diff_excess___: { b: number }
    diff_mismatch_: {
      a: { expected: string; actual: number }
    }
    tip___________: "Types share some values but differ"
  }): void
  as<$actual>(
    ...params: [
      GuardActual_<
        $actual,
        SetMatcherType<
          SetRelator<Empty, ExactKind>,
          { a: string }
        >,
        ExactKind,
        $actual,
        [$actual] extends [AssertionErrorHash]
          ? $actual
          : IsExact<$actual, { a: string }> extends true
            ? never
            : GetRelation<
                  { a: string },
                  $actual
                > extends "equivalent"
              ? StaticErrorAssertion<
                  "EXPECTED and ACTUAL are only equivilant (not exact)",
                  { a: string },
                  $actual,
                  ($actual extends object
                    ? {
                        [k in keyof DiffFields<
                          { a: string },
                          $actual
                        > as IsEmpty<
                          DiffFields<
                            { a: string },
                            $actual
                          >[k]
                        > extends true
                          ? never
                          : k]: DiffFields<
                          { a: string },
                          $actual
                        >[k]
                      }
                    : {}) & {
                    tip: "Use equiv() for mutual assignability OR apply Simplify<T> to normalize types"
                  },
                  14
                >
              : GetRelation<
                    { a: string },
                    $actual
                  > extends "subtype"
                ? StaticErrorAssertion<
                    "ACTUAL is subtype of EXPECTED",
                    { a: string },
                    $actual,
                    ($actual extends object
                      ? {
                          [k in keyof DiffFields<
                            { a: string },
                            $actual
                          > as IsEmpty<
                            DiffFields<
                              { a: string },
                              $actual
                            >[k]
                          > extends true
                            ? never
                            : k]: DiffFields<
                            { a: string },
                            $actual
                          >[k]
                        }
                      : {}) & {
                      tip: "ACTUAL is narrower than EXPECTED"
                    },
                    14
                  >
                : GetRelation<
                      { a: string },
                      $actual
                    > extends "supertype"
                  ? StaticErrorAssertion<
                      "ACTUAL is supertype of EXPECTED",
                      { a: string },
                      $actual,
                      ($actual extends object
                        ? {
                            [k in keyof DiffFields<
                              { a: string },
                              $actual
                            > as IsEmpty<
                              DiffFields<
                                { a: string },
                                $actual
                              >[k]
                            > extends true
                              ? never
                              : k]: DiffFields<
                              { a: string },
                              $actual
                            >[k]
                          }
                        : {}) & {
                        tip: "ACTUAL is wider than EXPECTED"
                      },
                      14
                    >
                  : GetRelation<
                        { a: string },
                        $actual
                      > extends "overlapping"
                    ? StaticErrorAssertion<
                        "EXPECTED only overlaps with ACTUAL",
                        { a: string },
                        $actual,
                        ($actual extends object
                          ? {
                              [k in keyof DiffFields<
                                { a: string },
                                $actual
                              > as IsEmpty<
                                DiffFields<
                                  { a: string },
                                  $actual
                                >[k]
                              > extends true
                                ? never
                                : k]: DiffFields<
                                { a: string },
                                $actual
                              >[k]
                            }
                          : {}) & {
                          tip: "Types share some values but differ"
                        },
                        14
                      >
                    : StaticErrorAssertion<
                        "EXPECTED and ACTUAL are disjoint",
                        { a: string },
                        $actual,
                        ($actual extends object
                          ? {
                              [k in keyof DiffFields<
                                { a: string },
                                $actual
                              > as IsEmpty<
                                DiffFields<
                                  { a: string },
                                  $actual
                                >[k]
                              > extends true
                                ? never
                                : k]: DiffFields<
                                { a: string },
                                $actual
                              >[k]
                            }
                          : {}) & {
                          tip: "Types share no values"
                        },
                        14
                      >
      >
    ] extends [AssertionErrorHash]
      ? [
          AssertionErrorHash &
            GuardActual_<
              $actual,
              SetMatcherType<
                SetRelator<Empty, ExactKind>,
                { a: string }
              >,
              ExactKind,
              $actual,
              [$actual] extends [AssertionErrorHash]
                ? $actual
                : IsExact<
                      $actual,
                      { a: string }
                    > extends true
                  ? never
                  : GetRelation<
                        { a: string },
                        $actual
                      > extends "equivalent"
                    ? StaticErrorAssertion<
                        "EXPECTED and ACTUAL are only equivilant (not exact)",
                        { a: string },
                        $actual,
                        ($actual extends object
                          ? {
                              [k in keyof DiffFields<
                                { a: string },
                                $actual
                              > as IsEmpty<
                                DiffFields<
                                  { a: string },
                                  $actual
                                >[k]
                              > extends true
                                ? never
                                : k]: DiffFields<
                                { a: string },
                                $actual
                              >[k]
                            }
                          : {}) & {
                          tip: "Use equiv() for mutual assignability OR apply Simplify<T> to normalize types"
                        },
                        14
                      >
                    : GetRelation<
                          { a: string },
                          $actual
                        > extends "subtype"
                      ? StaticErrorAssertion<
                          "ACTUAL is subtype of EXPECTED",
                          { a: string },
                          $actual,
                          ($actual extends object
                            ? {
                                [k in keyof DiffFields<
                                  { a: string },
                                  $actual
                                > as IsEmpty<
                                  DiffFields<
                                    { a: string },
                                    $actual
                                  >[k]
                                > extends true
                                  ? never
                                  : k]: DiffFields<
                                  { a: string },
                                  $actual
                                >[k]
                              }
                            : {}) & {
                            tip: "ACTUAL is narrower than EXPECTED"
                          },
                          14
                        >
                      : GetRelation<
                            { a: string },
                            $actual
                          > extends "supertype"
                        ? StaticErrorAssertion<
                            "ACTUAL is supertype of EXPECTED",
                            { a: string },
                            $actual,
                            ($actual extends object
                              ? {
                                  [k in keyof DiffFields<
                                    { a: string },
                                    $actual
                                  > as IsEmpty<
                                    DiffFields<
                                      { a: string },
                                      $actual
                                    >[k]
                                  > extends true
                                    ? never
                                    : k]: DiffFields<
                                    { a: string },
                                    $actual
                                  >[k]
                                }
                              : {}) & {
                              tip: "ACTUAL is wider than EXPECTED"
                            },
                            14
                          >
                        : GetRelation<
                              { a: string },
                              $actual
                            > extends "overlapping"
                          ? StaticErrorAssertion<
                              "EXPECTED only overlaps with ACTUAL",
                              { a: string },
                              $actual,
                              ($actual extends object
                                ? {
                                    [k in keyof DiffFields<
                                      { a: string },
                                      $actual
                                    > as IsEmpty<
                                      DiffFields<
                                        { a: string },
                                        $actual
                                      >[k]
                                    > extends true
                                      ? never
                                      : k]: DiffFields<
                                      { a: string },
                                      $actual
                                    >[k]
                                  }
                                : {}) & {
                                tip: "Types share some values but differ"
                              },
                              14
                            >
                          : StaticErrorAssertion<
                              "EXPECTED and ACTUAL are disjoint",
                              { a: string },
                              $actual,
                              ($actual extends object
                                ? {
                                    [k in keyof DiffFields<
                                      { a: string },
                                      $actual
                                    > as IsEmpty<
                                      DiffFields<
                                        { a: string },
                                        $actual
                                      >[k]
                                    > extends true
                                      ? never
                                      : k]: DiffFields<
                                      { a: string },
                                      $actual
                                    >[k]
                                  }
                                : {}) & {
                                tip: "Types share no values"
                              },
                              14
                            >
            >,
          ...([
            GuardAnyOrNeverActual<
              $actual,
              SetMatcherType<
                SetRelator<Empty, ExactKind>,
                { a: string }
              >
            >
          ] extends [AssertionErrorHash]
            ? [
                AssertionErrorHash &
                  GuardAnyOrNeverActual<
                    $actual,
                    SetMatcherType<
                      SetRelator<Empty, ExactKind>,
                      { a: string }
                    >
                  >
              ]
            : [])
        ]
      : [
            GuardAnyOrNeverActual<
              $actual,
              SetMatcherType<
                SetRelator<Empty, ExactKind>,
                { a: string }
              >
            >
          ] extends [AssertionErrorHash]
        ? [
            AssertionErrorHash &
              GuardAnyOrNeverActual<
                $actual,
                SetMatcherType<
                  SetRelator<Empty, ExactKind>,
                  { a: string }
                >
              >
          ]
        : []
  ): void
}`)
})

test('exact value mode - never handling', () => {
  const neverValue = null as never
  Assert.exact.of.as<never>()(neverValue)
})

test('exact value mode - parameter-based error feedback', () => {
  type IsExact<E, A> = E extends A ? A extends E ? true : false : false
  type ExactV1<E> = <A>(
    actual: A,
    ...errorInfo: IsExact<E, A> extends true ? [] : [error: '⚠ Types are not exactly equal', expected: E]
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
  const exactComplexA = Assert.exact.of.as<CA>()
  const fnComplexError = exactComplexA<CB>
  attest(fnComplexError).type.toString.snap(`{
  (actual: {
    ERROR_________: "EXPECTED only overlaps with ACTUAL"
    expected______: CA
    actual________: CB
    diff_excess___: { extra: boolean }
    diff_mismatch_: {
      user: {
        expected: { name: string; age: number }
        actual: { name: string; age: string }
      }
    }
    tip___________: "Types share some values but differ"
  }): void
  as<$actual>(
    ...params: [
      GuardActual_<
        $actual,
        SetMatcherType<SetRelator<Empty, ExactKind>, CA>,
        ExactKind,
        $actual,
        [$actual] extends [AssertionErrorHash]
          ? $actual
          : IsExact<$actual, CA> extends true
            ? never
            : GetRelation<CA, $actual> extends "equivalent"
              ? StaticErrorAssertion<
                  "EXPECTED and ACTUAL are only equivilant (not exact)",
                  CA,
                  $actual,
                  ($actual extends object
                    ? {
                        [k in keyof DiffFields<
                          CA,
                          $actual
                        > as IsEmpty<
                          DiffFields<CA, $actual>[k]
                        > extends true
                          ? never
                          : k]: DiffFields<CA, $actual>[k]
                      }
                    : {}) & {
                    tip: "Use equiv() for mutual assignability OR apply Simplify<T> to normalize types"
                  },
                  14
                >
              : GetRelation<CA, $actual> extends "subtype"
                ? StaticErrorAssertion<
                    "ACTUAL is subtype of EXPECTED",
                    CA,
                    $actual,
                    ($actual extends object
                      ? {
                          [k in keyof DiffFields<
                            CA,
                            $actual
                          > as IsEmpty<
                            DiffFields<CA, $actual>[k]
                          > extends true
                            ? never
                            : k]: DiffFields<CA, $actual>[k]
                        }
                      : {}) & {
                      tip: "ACTUAL is narrower than EXPECTED"
                    },
                    14
                  >
                : GetRelation<
                      CA,
                      $actual
                    > extends "supertype"
                  ? StaticErrorAssertion<
                      "ACTUAL is supertype of EXPECTED",
                      CA,
                      $actual,
                      ($actual extends object
                        ? {
                            [k in keyof DiffFields<
                              CA,
                              $actual
                            > as IsEmpty<
                              DiffFields<CA, $actual>[k]
                            > extends true
                              ? never
                              : k]: DiffFields<
                              CA,
                              $actual
                            >[k]
                          }
                        : {}) & {
                        tip: "ACTUAL is wider than EXPECTED"
                      },
                      14
                    >
                  : GetRelation<
                        CA,
                        $actual
                      > extends "overlapping"
                    ? StaticErrorAssertion<
                        "EXPECTED only overlaps with ACTUAL",
                        CA,
                        $actual,
                        ($actual extends object
                          ? {
                              [k in keyof DiffFields<
                                CA,
                                $actual
                              > as IsEmpty<
                                DiffFields<CA, $actual>[k]
                              > extends true
                                ? never
                                : k]: DiffFields<
                                CA,
                                $actual
                              >[k]
                            }
                          : {}) & {
                          tip: "Types share some values but differ"
                        },
                        14
                      >
                    : StaticErrorAssertion<
                        "EXPECTED and ACTUAL are disjoint",
                        CA,
                        $actual,
                        ($actual extends object
                          ? {
                              [k in keyof DiffFields<
                                CA,
                                $actual
                              > as IsEmpty<
                                DiffFields<CA, $actual>[k]
                              > extends true
                                ? never
                                : k]: DiffFields<
                                CA,
                                $actual
                              >[k]
                            }
                          : {}) & {
                          tip: "Types share no values"
                        },
                        14
                      >
      >
    ] extends [AssertionErrorHash]
      ? [
          AssertionErrorHash &
            GuardActual_<
              $actual,
              SetMatcherType<
                SetRelator<Empty, ExactKind>,
                CA
              >,
              ExactKind,
              $actual,
              [$actual] extends [AssertionErrorHash]
                ? $actual
                : IsExact<$actual, CA> extends true
                  ? never
                  : GetRelation<
                        CA,
                        $actual
                      > extends "equivalent"
                    ? StaticErrorAssertion<
                        "EXPECTED and ACTUAL are only equivilant (not exact)",
                        CA,
                        $actual,
                        ($actual extends object
                          ? {
                              [k in keyof DiffFields<
                                CA,
                                $actual
                              > as IsEmpty<
                                DiffFields<CA, $actual>[k]
                              > extends true
                                ? never
                                : k]: DiffFields<
                                CA,
                                $actual
                              >[k]
                            }
                          : {}) & {
                          tip: "Use equiv() for mutual assignability OR apply Simplify<T> to normalize types"
                        },
                        14
                      >
                    : GetRelation<
                          CA,
                          $actual
                        > extends "subtype"
                      ? StaticErrorAssertion<
                          "ACTUAL is subtype of EXPECTED",
                          CA,
                          $actual,
                          ($actual extends object
                            ? {
                                [k in keyof DiffFields<
                                  CA,
                                  $actual
                                > as IsEmpty<
                                  DiffFields<CA, $actual>[k]
                                > extends true
                                  ? never
                                  : k]: DiffFields<
                                  CA,
                                  $actual
                                >[k]
                              }
                            : {}) & {
                            tip: "ACTUAL is narrower than EXPECTED"
                          },
                          14
                        >
                      : GetRelation<
                            CA,
                            $actual
                          > extends "supertype"
                        ? StaticErrorAssertion<
                            "ACTUAL is supertype of EXPECTED",
                            CA,
                            $actual,
                            ($actual extends object
                              ? {
                                  [k in keyof DiffFields<
                                    CA,
                                    $actual
                                  > as IsEmpty<
                                    DiffFields<
                                      CA,
                                      $actual
                                    >[k]
                                  > extends true
                                    ? never
                                    : k]: DiffFields<
                                    CA,
                                    $actual
                                  >[k]
                                }
                              : {}) & {
                              tip: "ACTUAL is wider than EXPECTED"
                            },
                            14
                          >
                        : GetRelation<
                              CA,
                              $actual
                            > extends "overlapping"
                          ? StaticErrorAssertion<
                              "EXPECTED only overlaps with ACTUAL",
                              CA,
                              $actual,
                              ($actual extends object
                                ? {
                                    [k in keyof DiffFields<
                                      CA,
                                      $actual
                                    > as IsEmpty<
                                      DiffFields<
                                        CA,
                                        $actual
                                      >[k]
                                    > extends true
                                      ? never
                                      : k]: DiffFields<
                                      CA,
                                      $actual
                                    >[k]
                                  }
                                : {}) & {
                                tip: "Types share some values but differ"
                              },
                              14
                            >
                          : StaticErrorAssertion<
                              "EXPECTED and ACTUAL are disjoint",
                              CA,
                              $actual,
                              ($actual extends object
                                ? {
                                    [k in keyof DiffFields<
                                      CA,
                                      $actual
                                    > as IsEmpty<
                                      DiffFields<
                                        CA,
                                        $actual
                                      >[k]
                                    > extends true
                                      ? never
                                      : k]: DiffFields<
                                      CA,
                                      $actual
                                    >[k]
                                  }
                                : {}) & {
                                tip: "Types share no values"
                              },
                              14
                            >
            >,
          ...([
            GuardAnyOrNeverActual<
              $actual,
              SetMatcherType<
                SetRelator<Empty, ExactKind>,
                CA
              >
            >
          ] extends [AssertionErrorHash]
            ? [
                AssertionErrorHash &
                  GuardAnyOrNeverActual<
                    $actual,
                    SetMatcherType<
                      SetRelator<Empty, ExactKind>,
                      CA
                    >
                  >
              ]
            : [])
        ]
      : [
            GuardAnyOrNeverActual<
              $actual,
              SetMatcherType<
                SetRelator<Empty, ExactKind>,
                CA
              >
            >
          ] extends [AssertionErrorHash]
        ? [
            AssertionErrorHash &
              GuardAnyOrNeverActual<
                $actual,
                SetMatcherType<
                  SetRelator<Empty, ExactKind>,
                  CA
                >
              >
          ]
        : []
  ): void
}`)
})

// StaticErrorAssertion Tests

test('error with custom metadata', () => {
  type e = Assert.StaticErrorAssertion<
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
  type e = Assert.StaticErrorAssertion<'Type mismatch', string, number, 'Use string'>
  attest({} as e).type.toString.snap(`{
  ERROR_________: "Type mismatch"
  expected______: string
  actual________: number
  tip___________: "Use string"
}`)
})

test('error with tuple of tips', () => {
  type e = Assert.StaticErrorAssertion<
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

// Global Display Settings Tests

test('user-defined types preserved with preserveTypes setting', () => {
  type A = { a: Foo; b: string }
  type B = { a: Date; b: string }
  attest({} as Assert.exact.of<A, B>).type.toString.snap(`{
  ERROR_________: "EXPECTED only overlaps with ACTUAL"
  expected______: A
  actual________: B
  diff_mismatch_: {
    a: { expected: { value: Date }; actual: Date }
  }
  tip___________: "Types share some values but differ"
}`)
})

test('multiple preserved types from different augmentations', () => {
  type A = { a: Bar; b: string }
  type B = { a: { a: number; b: number }; b: string }
  attest({} as Assert.exact.of<A, B>).type.toString.snap(`{
  ERROR_________: "EXPECTED only overlaps with ACTUAL"
  expected______: A
  actual________: B
  diff_mismatch_: {
    a: {
      expected: { a: string; b: number }
      actual: { a: number; b: number }
    }
  }
  tip___________: "Types share some values but differ"
}`)
})

// sub() Tests

test('sub error - string does not extend hello', () => {
  attest({} as Assert.sub.of<'hello', string>).type.toString.snap(`{
  ERROR_________: "ACTUAL does not extend EXPECTED"
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
  attest({} as Assert.not.sub.of<string, 'hello'>).type.toString.snap(`{
  ERROR_________: "ACTUAL extends EXPECTED but should not"
  expected______: string
  actual________: "hello"
}`)
})

// equiv() Tests

test('equiv errors', () => {
  attest({} as Assert.equiv.of<string, number>).type.toString.snap(`{
  ERROR_________: "EXPECTED and ACTUAL are disjoint"
  expected______: string
  actual________: number
}`)
  attest({} as Assert.equiv.of<string, 'hello'>).type.toString.snap(`{
  ERROR_________: "ACTUAL extends EXPECTED but not vice versa"
  expected______: string
  actual________: "hello"
}`)
  attest({} as Assert.equiv.of<'hello', string>).type.toString.snap(`{
  ERROR_________: "EXPECTED extends ACTUAL but not vice versa"
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
  type _Pass = Assert.parameters.exact.of<[number, number], Parameters<Fn>>
  attest({} as Assert.parameters.exact.of<[string, string], Parameters<Fn>>).type.toString.snap(`{
  ERROR_________: "ACTUAL is supertype of EXPECTED"
  expected______: [string, string]
  actual________: any[]
  diff_missing__: ExcludeKeys<[string, string], number>
  diff_excess___: {}[]
  diff_mismatch_: {
    [x: number]: { expected: string; actual: any }
  }
  tip___________: "ACTUAL is wider than EXPECTED"
}`)
})

test('extractor - awaited', () => {
  type _Pass = Assert.awaited.exact.of<number, Promise<number>>
  attest({} as Assert.awaited.exact.of<string, Promise<number>>).type.toString.snap(`{
  ERROR_________: "EXPECTED and ACTUAL are disjoint"
  expected______: string
  actual________: number
  tip___________: "Types share no values"
}`)
})

test('extractor - array', () => {
  type _Pass = Assert.array.exact<string, string[]>
  attest({} as Assert.array.exact<number, string[]>).type.toString.snap(`{
  ERROR_________: "EXPECTED and ACTUAL are disjoint"
  expected______: number
  actual________: string
  tip___________: "Types share no values"
}`)
})

// // Special Type Tests

// test('special type tests', () => {
//   attest({} as Assert.exact.never<string>).type.toString.snap(`{
//   ERROR_________: "ACTUAL is supertype of EXPECTED but not structurally equal"
//   expected______: never
//   actual________: string
// }`)
//   attest({} as Assert.exact.any<unknown>).type.toString.snap(`{
//   ERROR_________: "EXPECTED and ACTUAL are mutually assignable but not structurally equal"
//   expected______: any
//   actual________: unknown
//   tip___________: "Use equiv() for mutual assignability OR apply Simplify<T> to normalize types"
// }`)
//   attest({} as Assert.exact.unknown<string>).type.toString.snap(`{
//   ERROR_________: "ACTUAL is subtype of EXPECTED but not structurally equal"
//   expected______: unknown
//   actual________: string
//   tip___________: "ACTUAL is narrower than EXPECTED"
// }`)
//   attest({} as Assert.exact.unknown<any>).type.toString.snap(`{
//   ERROR_________: "EXPECTED and ACTUAL are mutually assignable but not structurally equal"
//   expected______: unknown
//   actual________: any
//   tip___________: "Use equiv() for mutual assignability OR apply Simplify<T> to normalize types"
// }`)
//   attest({} as Assert.exact.empty<{ a: number }>).type.toString.snap(`{
//   ERROR_________: "EXPECTED and ACTUAL are disjoint"
//   expected______: true
//   actual________: false
//   tip___________: "Types share no values"
// }`)
// })
