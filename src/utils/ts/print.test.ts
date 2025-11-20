import { Type as A } from '#assert/assert'
import { Ts } from '#ts'
import { describe, test } from 'vitest'

// Alias for Ts.Print to make test cases less verbose
type P<T, Fallback extends string | undefined = undefined> = Ts.Print<T, Fallback>

describe('Primitives and Literals', () => {
  test('string', () => {
    A.exact.ofAs<'string'>().onAs<P<string>>()
    A.exact.ofAs<"'hello'">().onAs<P<'hello'>>()
    // todo: should use template literal backticks instead actually
    A.exact.ofAs<`'template${string}'`>().onAs<P<`template${string}`>>()
  })

  test('number', () => {
    A.exact.ofAs<'number'>().onAs<P<number>>()
    A.exact.ofAs<'123'>().onAs<P<123>>()
    A.exact.ofAs<'0.5'>().onAs<P<0.5>>()
    A.exact.ofAs<'-10'>().onAs<P<-10>>()
  })

  test('boolean', () => {
    A.exact.ofAs<'boolean'>().onAs<P<boolean>>()
    A.exact.ofAs<'true'>().onAs<P<true>>()
    A.exact.ofAs<'false'>().onAs<P<false>>()
  })

  test('bigint', () => {
    A.exact.ofAs<'bigint'>().onAs<P<bigint>>()
    A.exact.ofAs<'100n'>().onAs<P<100n>>()
    A.exact.ofAs<'-20n'>().onAs<P<-20n>>()
  })

  test('null and undefined', () => {
    A.exact.ofAs<'null'>().onAs<P<null>>()
    A.exact.ofAs<'undefined'>().onAs<P<undefined>>()
  })

  test('symbol', () => {
    A.exact.ofAs<'symbol'>().onAs<P<symbol>>()
    const mySymbol = Symbol('description')
    type MySymbolType = typeof mySymbol
    A.exact.ofAs<'symbol'>().onAs<P<MySymbolType>>() // Description is not part of the type string
  })
})

describe('Common Object Types', () => {
  test('Promise', () => {
    A.exact.ofAs<'Promise<any>'>().onAs<P<Promise<any>>>()
    A.exact.ofAs<'Promise<string>'>().onAs<P<Promise<string>>>()
    A.exact.ofAs<'Promise<number>'>().onAs<P<Promise<number>>>()
    A.exact.ofAs<'Promise<undefined>'>().onAs<P<Promise<undefined>>>()
    A.exact.ofAs<'Promise<void>'>().onAs<P<Promise<void>>>()
  })

  test('Array', () => {
    A.exact.ofAs<'Array<any>'>().onAs<P<any[]>>()
    A.exact.ofAs<'Array<unknown>'>().onAs<P<unknown[]>>() // unknown is not any
    A.exact.ofAs<'ReadonlyArray<Date>'>().onAs<P<readonly Date[]>>()
    // todo: tuples
    // A.exact.ofAs<'ReadonlyArray<Date,RegExp>'>().onAs<Print<readonly [Date, RegExp]>>()
  })

  test('Date', () => {
    A.exact.ofAs<'Date'>().onAs<P<Date>>()
  })

  test('RegExp', () => {
    A.exact.ofAs<'RegExp'>().onAs<P<RegExp>>()
  })

  test('Function', () => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    A.exact.ofAs<'Function'>().onAs<P<Function>>()
    A.exact.ofAs<'Function'>().onAs<P<() => void>>()
    A.exact.ofAs<'Function'>().onAs<P<(a: string, b: number) => boolean>>()
    class MyClass {
      method() {}
    }
    A.exact.ofAs<'Function'>().onAs<P<typeof MyClass>>() // Class constructor
    A.exact.ofAs<'Function'>().onAs<P<MyClass['method']>>()
  })
})

describe('General Object, any, unknown, never, and Fallbacks', () => {
  test('object', () => {
    A.exact.ofAs<'object'>().onAs<P<object>>()
    A.exact.ofAs<'object'>().onAs<P<{ a: number }>>()
    A.exact.ofAs<'object'>().onAs<P<Record<string, any>>>()
    A.exact.ofAs<'object'>().onAs<P<NonNullable<unknown>>>() // NonNullable<unknown> is {}
  })
  test('unknown', () => {
    A.exact.ofAs<'unknown'>().onAs<P<unknown>>()
  })
  test('never', () => {
    A.exact.ofAs<'never'>().onAs<P<never>>()
  })
})

describe('Union Types', () => {
  test('union of primitives', () => {
    // union order is not deterministic so we have to be a bit loose here.
    A.sub.ofAs<'number | null' | 'null | number'>().onAs<P<number | null>>()
  })

  test('union including any, unknown, never', () => {
    A.exact.ofAs<'any'>().onAs<P<any | 'literal'>>() // any overtakes literal
    A.exact.ofAs<'unknown'>().onAs<P<unknown | 'literal'>>() // unknown overtakes literal
    A.exact.ofAs<"'literal'">().onAs<P<never | 'literal'>>() // never is dropped from unions
  })
})

describe('Fallback Parameter', () => {
  test('fallback with non-primitive types', () => {
    A.exact.ofAs<'CustomObject'>().onAs<P<{ x: 1 }, 'CustomObject'>>()
    A.exact.ofAs<'CustomDate'>().onAs<P<Date, 'CustomDate'>>()
    A.exact.ofAs<'CustomPromise'>().onAs<P<Promise<string>, 'CustomPromise'>>()
    A.exact.ofAs<'CustomArray'>().onAs<P<any[], 'CustomArray'>>()
  })

  test('fallback is ignored for primitive types', () => {
    A.exact.ofAs<'string'>().onAs<P<string, 'CustomString'>>()
    A.exact.ofAs<'123'>().onAs<P<123, 'CustomNumber'>>()
    A.exact.ofAs<'true'>().onAs<P<true, 'CustomBoolean'>>()
    A.exact.ofAs<'100n'>().onAs<P<100n, 'CustomBigInt'>>()
    A.exact.ofAs<'null'>().onAs<P<null, 'CustomNull'>>()
    A.exact.ofAs<'undefined'>().onAs<P<undefined, 'CustomUndefined'>>()
  })

  test('fallback with object', () => {
    A.exact.ofAs<'FallbackForUnknown'>().onAs<P<{ a: 1 }, 'FallbackForUnknown'>>()
  })
})
