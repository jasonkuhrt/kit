import { Ts } from '#ts'
import { attest } from '@ark/attest'
import { test } from 'vitest'
import * as Assert from './$$.js'

// Shared type aliases for tests
type CA = { id: string; user: { name: string; age: number }; tags: string[] }
type CB = { id: string; user: { name: string; age: string }; tags: string[]; extra: boolean }

class Foo {
  constructor(public ts_assert_fixture_a: Date) {}
}
class Bar {
  constructor(public ts_assert_fixture_a: string, public ts_assert_fixture_b: number) {}
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
  attest({} as Assert.exact.of<string, number>).type.toString.snap(`{
  ERROR_________: "EXPECTED and ACTUAL are disjoint"
  expected______: string
  actual________: number
  tip___________: "Types share no values"
  HIERARCHY_____: readonly ["root", "assert", ...string[]]
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
  HIERARCHY_____: readonly ["root", "assert", ...string[]]
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
  HIERARCHY_____: readonly ["root", "assert", ...string[]]
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
  HIERARCHY_____: readonly ["root", "assert", ...string[]]
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
  HIERARCHY_____: readonly ["root", "assert", ...string[]]
}`)
})

test('exact value mode - basic type mismatches', () => {
  const fn = Assert.exact.ofAs<string>().onAs<42>
  const p = Ts.as<Parameters<typeof fn>>()
  attest(p).type.toString.snap(`[
  {
    ERROR_________: "EXPECTED and ACTUAL are disjoint"
    expected______: string
    actual________: 42
    tip___________: "Types share no values"
    HIERARCHY_____: readonly ["root", "assert", ...string[]]
  }
]`)

  const fn2 = Assert.exact.ofAs<{ a: string }>().onAs<{ a: number; b: number }>
  const p2 = Ts.as<Parameters<typeof fn2>>()
  attest(p2).type.toString.snap(`[
  {
    ERROR_________: "EXPECTED only overlaps with ACTUAL"
    expected______: { a: string }
    actual________: { a: number; b: number }
    diff_excess___: { b: number }
    diff_mismatch_: {
      a: { expected: string; actual: number }
    }
    tip___________: "Types share some values but differ"
    HIERARCHY_____: readonly ["root", "assert", ...string[]]
  }
]`)
})

// Note: never handling is now covered by guard tests

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
  const exactComplexA = Assert.exact.ofAs<CA>().on
  const fnComplexError = exactComplexA<CB>
  const p3 = Ts.as<Parameters<typeof fnComplexError>>()
  attest(p3).type.toString.snap(`[
  actual: {
    ERROR_________: "EXPECTED only overlaps with ACTUAL"
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
    diff_excess___: { extra: boolean }
    diff_mismatch_: {
      user: {
        expected: { name: string; age: number }
        actual: { name: string; age: string }
      }
    }
    tip___________: "Types share some values but differ"
    HIERARCHY_____: readonly ["root", "assert", ...string[]]
  }
]`)
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
  HIERARCHY_____: readonly ["root", "assert", ...string[]]
}`)
})

test('error with tip string (backward compat)', () => {
  type e = Assert.StaticErrorAssertion<'Type mismatch', string, number, 'Use string'>
  attest({} as e).type.toString.snap(`{
  ERROR_________: "Type mismatch"
  expected______: string
  actual________: number
  tip___________: "Use string"
  HIERARCHY_____: readonly ["root", "assert", ...string[]]
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
  HIERARCHY_____: readonly ["root", "assert", ...string[]]
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
  diff_mismatch_: { a: { expected: Foo; actual: Date } }
  tip___________: "Types share some values but differ"
  HIERARCHY_____: readonly ["root", "assert", ...string[]]
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
    a: { expected: Bar; actual: { a: number; b: number } }
  }
  tip___________: "Types share some values but differ"
  HIERARCHY_____: readonly ["root", "assert", ...string[]]
}`)
})

// sub() Tests

test('sub error - string does not extend hello', () => {
  attest({} as Assert.sub.of<'hello', string>).type.toString.snap(`{
  ERROR_________: "ACTUAL does not extend EXPECTED"
  expected______: "hello"
  actual________: string
  HIERARCHY_____: readonly ["root", "assert", ...string[]]
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
  attest({} as Assert.not.sub<string, 'hello'>).type.toString.snap(`{
  ERROR_________: "ACTUAL extends EXPECTED but should not"
  expected______: string
  actual________: "hello"
  HIERARCHY_____: readonly ["root", "assert", ...string[]]
}`)
})

// equiv() Tests

test('equiv errors', () => {
  attest({} as Assert.equiv.of<string, number>).type.toString.snap(`{
  ERROR_________: "EXPECTED and ACTUAL are disjoint"
  expected______: string
  actual________: number
  HIERARCHY_____: readonly ["root", "assert", ...string[]]
}`)
  attest({} as Assert.equiv.of<string, 'hello'>).type.toString.snap(`{
  ERROR_________: "ACTUAL extends EXPECTED but not vice versa"
  expected______: string
  actual________: "hello"
  HIERARCHY_____: readonly ["root", "assert", ...string[]]
}`)
  attest({} as Assert.equiv.of<'hello', string>).type.toString.snap(`{
  ERROR_________: "EXPECTED extends ACTUAL but not vice versa"
  expected______: "hello"
  actual________: string
  HIERARCHY_____: readonly ["root", "assert", ...string[]]
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
  type _Pass = Assert.parameters.exact.of<[number, number], Fn>
  attest({} as Assert.parameters.exact.of<[string, string], Fn>).type.toString.snap(`{
  ERROR_________: "EXPECTED only overlaps with ACTUAL"
  expected______: [string, string]
  actual________: [a: number, b: number]
  diff_missing__: {
    [iterator]: () => ArrayIterator<string>
    [unscopables]: {
      [x: number]: boolean | undefined
      length?: boolean
      toString?: boolean
      toLocaleString?: boolean
      pop?: boolean
      push?: boolean
      concat?: boolean
      join?: boolean
      reverse?: boolean
      shift?: boolean
      slice?: boolean
      sort?: boolean
      splice?: boolean
      unshift?: boolean
      indexOf?: boolean
      lastIndexOf?: boolean
      every?: boolean
      some?: boolean
      forEach?: boolean
      map?: boolean
      filter?: boolean
      reduce?: boolean
      reduceRight?: boolean
      find?: boolean
      findIndex?: boolean
      fill?: boolean
      copyWithin?: boolean
      entries?: boolean
      keys?: boolean
      values?: boolean
      includes?: boolean
      flatMap?: boolean
      flat?: boolean
      at?: boolean
      findLast?: boolean
      findLastIndex?: boolean
      toReversed?: boolean
      toSorted?: boolean
      toSpliced?: boolean
      with?: boolean
      [Symbol.iterator]?: boolean
      readonly [Symbol.unscopables]?: boolean
    }
    map: <U>(
      callbackfn: (
        value: string,
        index: number,
        array: string[]
      ) => U,
      thisArg?: any
    ) => U[]
    length: 2
    toString: () => string
    toLocaleString: {
      (): string
      (
        locales: string | string[],
        options?:
          | (NumberFormatOptions & DateTimeFormatOptions)
          | undefined
      ): string
    }
    pop: () => string | undefined
    push: (...items: string[]) => number
    concat: {
      (...items: ConcatArray<string>[]): string[]
      (...items: (string | ConcatArray<string>)[]): string[]
    }
    join: (separator?: string | undefined) => string
    reverse: () => string[]
    shift: () => string | undefined
    slice: (
      start?: number | undefined,
      end?: number | undefined
    ) => string[]
    sort: (
      compareFn?:
        | ((a: string, b: string) => number)
        | undefined
    ) => [string, string]
    splice: {
      (
        start: number,
        deleteCount?: number | undefined
      ): string[]
      (
        start: number,
        deleteCount: number,
        ...items: string[]
      ): string[]
    }
    unshift: (...items: string[]) => number
    indexOf: (
      searchElement: string,
      fromIndex?: number | undefined
    ) => number
    lastIndexOf: (
      searchElement: string,
      fromIndex?: number | undefined
    ) => number
    every: {
      <S extends string>(
        predicate: (
          value: string,
          index: number,
          array: string[]
        ) => value is S,
        thisArg?: any
      ): this is S[]
      (
        predicate: (
          value: string,
          index: number,
          array: string[]
        ) => unknown,
        thisArg?: any
      ): boolean
    }
    some: (
      predicate: (
        value: string,
        index: number,
        array: string[]
      ) => unknown,
      thisArg?: any
    ) => boolean
    forEach: (
      callbackfn: (
        value: string,
        index: number,
        array: string[]
      ) => void,
      thisArg?: any
    ) => void
    filter: {
      <S extends string>(
        predicate: (
          value: string,
          index: number,
          array: string[]
        ) => value is S,
        thisArg?: any
      ): S[]
      (
        predicate: (
          value: string,
          index: number,
          array: string[]
        ) => unknown,
        thisArg?: any
      ): string[]
    }
    reduce: {
      (
        callbackfn: (
          previousValue: string,
          currentValue: string,
          currentIndex: number,
          array: string[]
        ) => string
      ): string
      (
        callbackfn: (
          previousValue: string,
          currentValue: string,
          currentIndex: number,
          array: string[]
        ) => string,
        initialValue: string
      ): string
      <U>(
        callbackfn: (
          previousValue: U,
          currentValue: string,
          currentIndex: number,
          array: string[]
        ) => U,
        initialValue: U
      ): U
    }
    reduceRight: {
      (
        callbackfn: (
          previousValue: string,
          currentValue: string,
          currentIndex: number,
          array: string[]
        ) => string
      ): string
      (
        callbackfn: (
          previousValue: string,
          currentValue: string,
          currentIndex: number,
          array: string[]
        ) => string,
        initialValue: string
      ): string
      <U>(
        callbackfn: (
          previousValue: U,
          currentValue: string,
          currentIndex: number,
          array: string[]
        ) => U,
        initialValue: U
      ): U
    }
    find: {
      <S extends string>(
        predicate: (
          value: string,
          index: number,
          obj: string[]
        ) => value is S,
        thisArg?: any
      ): S | undefined
      (
        predicate: (
          value: string,
          index: number,
          obj: string[]
        ) => unknown,
        thisArg?: any
      ): string | undefined
    }
    findIndex: (
      predicate: (
        value: string,
        index: number,
        obj: string[]
      ) => unknown,
      thisArg?: any
    ) => number
    fill: (
      value: string,
      start?: number | undefined,
      end?: number | undefined
    ) => [string, string]
    copyWithin: (
      target: number,
      start: number,
      end?: number | undefined
    ) => [string, string]
    entries: () => ArrayIterator<[number, string]>
    keys: () => ArrayIterator<number>
    values: () => ArrayIterator<string>
    includes: (
      searchElement: string,
      fromIndex?: number | undefined
    ) => boolean
    flatMap: <U, This = undefined>(
      callback: (
        this: This,
        value: string,
        index: number,
        array: string[]
      ) => U | readonly U[],
      thisArg?: This | undefined
    ) => U[]
    flat: <A, D extends number = 1>(
      this: A,
      depth?: D | undefined
    ) => FlatArray<A, D>[]
    at: (index: number) => string | undefined
    findLast: {
      <S extends string>(
        predicate: (
          value: string,
          index: number,
          array: string[]
        ) => value is S,
        thisArg?: any
      ): S | undefined
      (
        predicate: (
          value: string,
          index: number,
          array: string[]
        ) => unknown,
        thisArg?: any
      ): string | undefined
    }
    findLastIndex: (
      predicate: (
        value: string,
        index: number,
        array: string[]
      ) => unknown,
      thisArg?: any
    ) => number
    toReversed: () => string[]
    toSorted: (
      compareFn?:
        | ((a: string, b: string) => number)
        | undefined
    ) => string[]
    toSpliced: {
      (
        start: number,
        deleteCount: number,
        ...items: string[]
      ): string[]
      (
        start: number,
        deleteCount?: number | undefined
      ): string[]
    }
    with: (index: number, value: string) => string[]
  }
  diff_excess___: {
    [iterator]: () => ArrayIterator<number>
    [unscopables]: {
      [x: number]: boolean | undefined
      length?: boolean
      toString?: boolean
      toLocaleString?: boolean
      pop?: boolean
      push?: boolean
      concat?: boolean
      join?: boolean
      reverse?: boolean
      shift?: boolean
      slice?: boolean
      sort?: boolean
      splice?: boolean
      unshift?: boolean
      indexOf?: boolean
      lastIndexOf?: boolean
      every?: boolean
      some?: boolean
      forEach?: boolean
      map?: boolean
      filter?: boolean
      reduce?: boolean
      reduceRight?: boolean
      find?: boolean
      findIndex?: boolean
      fill?: boolean
      copyWithin?: boolean
      entries?: boolean
      keys?: boolean
      values?: boolean
      includes?: boolean
      flatMap?: boolean
      flat?: boolean
      at?: boolean
      findLast?: boolean
      findLastIndex?: boolean
      toReversed?: boolean
      toSorted?: boolean
      toSpliced?: boolean
      with?: boolean
      [Symbol.iterator]?: boolean
      readonly [Symbol.unscopables]?: boolean
    }
    map: <U>(
      callbackfn: (
        value: number,
        index: number,
        array: number[]
      ) => U,
      thisArg?: any
    ) => U[]
    length: 2
    toString: () => string
    toLocaleString: {
      (): string
      (
        locales: string | string[],
        options?:
          | (NumberFormatOptions & DateTimeFormatOptions)
          | undefined
      ): string
    }
    pop: () => number | undefined
    push: (...items: number[]) => number
    concat: {
      (...items: ConcatArray<number>[]): number[]
      (...items: (number | ConcatArray<number>)[]): number[]
    }
    join: (separator?: string | undefined) => string
    reverse: () => number[]
    shift: () => number | undefined
    slice: (
      start?: number | undefined,
      end?: number | undefined
    ) => number[]
    sort: (
      compareFn?:
        | ((a: number, b: number) => number)
        | undefined
    ) => [a: number, b: number]
    splice: {
      (
        start: number,
        deleteCount?: number | undefined
      ): number[]
      (
        start: number,
        deleteCount: number,
        ...items: number[]
      ): number[]
    }
    unshift: (...items: number[]) => number
    indexOf: (
      searchElement: number,
      fromIndex?: number | undefined
    ) => number
    lastIndexOf: (
      searchElement: number,
      fromIndex?: number | undefined
    ) => number
    every: {
      <S extends number>(
        predicate: (
          value: number,
          index: number,
          array: number[]
        ) => value is S,
        thisArg?: any
      ): this is S[]
      (
        predicate: (
          value: number,
          index: number,
          array: number[]
        ) => unknown,
        thisArg?: any
      ): boolean
    }
    some: (
      predicate: (
        value: number,
        index: number,
        array: number[]
      ) => unknown,
      thisArg?: any
    ) => boolean
    forEach: (
      callbackfn: (
        value: number,
        index: number,
        array: number[]
      ) => void,
      thisArg?: any
    ) => void
    filter: {
      <S extends number>(
        predicate: (
          value: number,
          index: number,
          array: number[]
        ) => value is S,
        thisArg?: any
      ): S[]
      (
        predicate: (
          value: number,
          index: number,
          array: number[]
        ) => unknown,
        thisArg?: any
      ): number[]
    }
    reduce: {
      (
        callbackfn: (
          previousValue: number,
          currentValue: number,
          currentIndex: number,
          array: number[]
        ) => number
      ): number
      (
        callbackfn: (
          previousValue: number,
          currentValue: number,
          currentIndex: number,
          array: number[]
        ) => number,
        initialValue: number
      ): number
      <U>(
        callbackfn: (
          previousValue: U,
          currentValue: number,
          currentIndex: number,
          array: number[]
        ) => U,
        initialValue: U
      ): U
    }
    reduceRight: {
      (
        callbackfn: (
          previousValue: number,
          currentValue: number,
          currentIndex: number,
          array: number[]
        ) => number
      ): number
      (
        callbackfn: (
          previousValue: number,
          currentValue: number,
          currentIndex: number,
          array: number[]
        ) => number,
        initialValue: number
      ): number
      <U>(
        callbackfn: (
          previousValue: U,
          currentValue: number,
          currentIndex: number,
          array: number[]
        ) => U,
        initialValue: U
      ): U
    }
    find: {
      <S extends number>(
        predicate: (
          value: number,
          index: number,
          obj: number[]
        ) => value is S,
        thisArg?: any
      ): S | undefined
      (
        predicate: (
          value: number,
          index: number,
          obj: number[]
        ) => unknown,
        thisArg?: any
      ): number | undefined
    }
    findIndex: (
      predicate: (
        value: number,
        index: number,
        obj: number[]
      ) => unknown,
      thisArg?: any
    ) => number
    fill: (
      value: number,
      start?: number | undefined,
      end?: number | undefined
    ) => [a: number, b: number]
    copyWithin: (
      target: number,
      start: number,
      end?: number | undefined
    ) => [a: number, b: number]
    entries: () => ArrayIterator<[number, number]>
    keys: () => ArrayIterator<number>
    values: () => ArrayIterator<number>
    includes: (
      searchElement: number,
      fromIndex?: number | undefined
    ) => boolean
    flatMap: <U, This = undefined>(
      callback: (
        this: This,
        value: number,
        index: number,
        array: number[]
      ) => U | readonly U[],
      thisArg?: This | undefined
    ) => U[]
    flat: <A, D extends number = 1>(
      this: A,
      depth?: D | undefined
    ) => FlatArray<A, D>[]
    at: (index: number) => number | undefined
    findLast: {
      <S extends number>(
        predicate: (
          value: number,
          index: number,
          array: number[]
        ) => value is S,
        thisArg?: any
      ): S | undefined
      (
        predicate: (
          value: number,
          index: number,
          array: number[]
        ) => unknown,
        thisArg?: any
      ): number | undefined
    }
    findLastIndex: (
      predicate: (
        value: number,
        index: number,
        array: number[]
      ) => unknown,
      thisArg?: any
    ) => number
    toReversed: () => number[]
    toSorted: (
      compareFn?:
        | ((a: number, b: number) => number)
        | undefined
    ) => number[]
    toSpliced: {
      (
        start: number,
        deleteCount: number,
        ...items: number[]
      ): number[]
      (
        start: number,
        deleteCount?: number | undefined
      ): number[]
    }
    with: (index: number, value: number) => number[]
  }
  diff_mismatch_: {
    [x: number]: { expected: string; actual: number }
    0: { expected: string; actual: number }
    1: { expected: string; actual: number }
  }
  tip___________: "Types share some values but differ"
  HIERARCHY_____: readonly ["root", "assert", ...string[]]
}`)
})

test('extractor - awaited', () => {
  type _Pass = Assert.awaited.exact.of<number, Promise<number>>
  attest({} as Assert.awaited.exact.of<string, Promise<number>>).type.toString.snap(`{
  ERROR_________: "EXPECTED and ACTUAL are disjoint"
  expected______: string
  actual________: number
  tip___________: "Types share no values"
  HIERARCHY_____: readonly ["root", "assert", ...string[]]
}`)
})

test('extractor - array', () => {
  type _Pass = Assert.array.exact<string, string[]>
  attest({} as Assert.array.exact<number, string[]>).type.toString.snap(`{
  ERROR_________: "EXPECTED and ACTUAL are disjoint"
  expected______: number
  actual________: string
  tip___________: "Types share no values"
  HIERARCHY_____: readonly ["root", "assert", ...string[]]
}`)
})

// Extractor Resolution Errors - Value-Second API

test('extractor error - array on non-array', () => {
  type ParamError = Assert.array.exact.of<number, string>
  attest({} as ParamError).type.toString.snap(`{
  ERROR_________: "Cannot extract array from incompatible type"
  expected______: "Type must extend array (readonly any[])"
  actual________: string
  attempted_____: "array extractor"
  HIERARCHY_____: readonly ["root", ...string[]]
}`)
})

test('extractor error - awaited on non-Promise string', () => {
  type ParamError = Assert.awaited.exact.of<number, string>
  attest({} as ParamError).type.toString.snap(`{
  ERROR_________: "Cannot extract awaited from incompatible type"
  expected______: "Type must extend PromiseLike<any>"
  actual________: string
  attempted_____: "awaited extractor"
  HIERARCHY_____: readonly ["root", ...string[]]
}`)
})

test('extractor error - parameters on non-function', () => {
  type ParamError = Assert.parameters.exact.of<[number], string>
  attest({} as ParamError).type.toString.snap(`{
  ERROR_________: "Cannot extract parameters from incompatible type"
  expected______: "Type must extend function ((...args: any) => any)"
  actual________: string
  attempted_____: "parameters extractor"
  HIERARCHY_____: readonly ["root", ...string[]]
}`)
})

test('extractor error - returned on non-function', () => {
  type ParamError = Assert.returned.exact.of<number, string>
  attest({} as ParamError).type.toString.snap(`{
  ERROR_________: "Cannot extract returned from incompatible type"
  expected______: "Type must extend function ((...args: any) => any)"
  actual________: string
  attempted_____: "returned extractor"
  HIERARCHY_____: readonly ["root", ...string[]]
}`)
})

// Union Edge Cases - Unions with valid parts should pass

test('extractor - awaited with union containing Promise (type-level)', () => {
  // Union with Promise should NOT error - the Promise part is valid
  type MixedUnion = string | Promise<number>
  type _Pass = Assert.awaited.exact.of<number, MixedUnion> // Should pass - extracts from Promise part

  // Pure string should error
  type _Error = Assert.awaited.exact.of<number, string>
  attest({} as _Error).type.toString.snap(`{
  ERROR_________: "Cannot extract awaited from incompatible type"
  expected______: "Type must extend PromiseLike<any>"
  actual________: string
  attempted_____: "awaited extractor"
  HIERARCHY_____: readonly ["root", ...string[]]
}`)
})

test('extractor - array with union containing array (type-level)', () => {
  // Union with array should NOT error - the array part is valid
  type MixedUnion = string | number[]
  type _Pass = Assert.array.exact.of<number, MixedUnion> // Should pass - extracts from array part

  // Pure string should error
  type _Error = Assert.array.exact.of<number, string>
  attest({} as _Error).type.toString.snap(`{
  ERROR_________: "Cannot extract array from incompatible type"
  expected______: "Type must extend array (readonly any[])"
  actual________: string
  attempted_____: "array extractor"
  HIERARCHY_____: readonly ["root", ...string[]]
}`)
})

// Value-Level API Tests

test('extractor - awaited value-level API', () => {
  const promiseValue = Promise.resolve(42)
  type _Pass = Assert.awaited.exact.of<number, typeof promiseValue>

  // Error case - string is not a Promise
  const stringValue = 'hello'
  type _Error = Assert.awaited.exact.of<number, typeof stringValue>
  attest({} as _Error).type.toString.snap(`{
  ERROR_________: "Cannot extract awaited from incompatible type"
  expected______: "Type must extend PromiseLike<any>"
  actual________: "hello"
  attempted_____: "awaited extractor"
  HIERARCHY_____: readonly ["root", ...string[]]
}`)
})

test('extractor - array value-level API', () => {
  const arrayValue = [1, 2, 3]
  type _Pass = Assert.array.exact.of<number, typeof arrayValue>

  // Error case - string is not an array
  const stringValue = 'hello'
  type _Error = Assert.array.exact.of<number, typeof stringValue>
  attest({} as _Error).type.toString.snap(`{
  ERROR_________: "Cannot extract array from incompatible type"
  expected______: "Type must extend array (readonly any[])"
  actual________: "hello"
  attempted_____: "array extractor"
  HIERARCHY_____: readonly ["root", ...string[]]
}`)
})

test('extractor - returned value-level API', () => {
  const fnValue = () => 42
  type _Pass = Assert.returned.exact.of<number, typeof fnValue>

  // Error case - string is not a function
  const stringValue = 'hello'
  type _Error = Assert.returned.exact.of<number, typeof stringValue>
  attest({} as _Error).type.toString.snap(`{
  ERROR_________: "Cannot extract returned from incompatible type"
  expected______: "Type must extend function ((...args: any) => any)"
  actual________: "hello"
  attempted_____: "returned extractor"
  HIERARCHY_____: readonly ["root", ...string[]]
}`)
})
