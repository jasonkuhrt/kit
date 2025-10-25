import { Ts } from '#ts'
import { describe, test } from 'vitest'

const A = Ts.Assert.exact.ofAs

// Alias for Ts.Print to make test cases less verbose
type P<T, Fallback extends string | undefined = undefined> = Ts.Print<T, Fallback>

describe('Primitives and Literals', () => {
  test('string', () => {
    Ts.Assert.exact.ofAs<'string'>().onAs<P<string>>()
    Ts.Assert.exact.ofAs<"'hello'">().onAs<P<'hello'>>()
    // todo: should use template literal backticks instead actually
    Ts.Assert.exact.ofAs<`'template${string}'`>().onAs<P<`template${string}`>>()
  })

  test('number', () => {
    Ts.Assert.exact.ofAs<'number'>().onAs<P<number>>()
    Ts.Assert.exact.ofAs<'123'>().onAs<P<123>>()
    Ts.Assert.exact.ofAs<'0.5'>().onAs<P<0.5>>()
    Ts.Assert.exact.ofAs<'-10'>().onAs<P<-10>>()
  })

  test('boolean', () => {
    Ts.Assert.exact.ofAs<'boolean'>().onAs<P<boolean>>()
    Ts.Assert.exact.ofAs<'true'>().onAs<P<true>>()
    Ts.Assert.exact.ofAs<'false'>().onAs<P<false>>()
  })

  test('bigint', () => {
    Ts.Assert.exact.ofAs<'bigint'>().onAs<P<bigint>>()
    Ts.Assert.exact.ofAs<'100n'>().onAs<P<100n>>()
    Ts.Assert.exact.ofAs<'-20n'>().onAs<P<-20n>>()
  })

  test('null and undefined', () => {
    Ts.Assert.exact.ofAs<'null'>().onAs<P<null>>()
    Ts.Assert.exact.ofAs<'undefined'>().onAs<P<undefined>>()
  })

  test('symbol', () => {
    Ts.Assert.exact.ofAs<'symbol'>().onAs<P<symbol>>()
    const mySymbol = Symbol('description')
    type MySymbolType = typeof mySymbol
    Ts.Assert.exact.ofAs<'symbol'>().onAs<P<MySymbolType>>() // Description is not part of the type string
  })
})

describe('Common Object Types', () => {
  test('Promise', () => {
    Ts.Assert.exact.ofAs<'Promise<any>'>().onAs<P<Promise<any>>>()
    Ts.Assert.exact.ofAs<'Promise<string>'>().onAs<P<Promise<string>>>()
    Ts.Assert.exact.ofAs<'Promise<number>'>().onAs<P<Promise<number>>>()
    Ts.Assert.exact.ofAs<'Promise<undefined>'>().onAs<P<Promise<undefined>>>()
    Ts.Assert.exact.ofAs<'Promise<void>'>().onAs<P<Promise<void>>>()
  })

  test('Array', () => {
    Ts.Assert.exact.ofAs<'Array<any>'>().onAs<P<any[]>>()
    Ts.Assert.exact.ofAs<'Array<unknown>'>().onAs<P<unknown[]>>() // unknown is not any
    Ts.Assert.exact.ofAs<'ReadonlyArray<Date>'>().onAs<P<readonly Date[]>>()
    // todo: tuples
    // Ts.Assert.exact.ofAs<'ReadonlyArray<Date,RegExp>'>().onAs<Print<readonly [Date, RegExp]>>()
  })

  test('Date', () => {
    Ts.Assert.exact.ofAs<'Date'>().onAs<P<Date>>()
  })

  test('RegExp', () => {
    Ts.Assert.exact.ofAs<'RegExp'>().onAs<P<RegExp>>()
  })

  test('Function', () => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    Ts.Assert.exact.ofAs<'Function'>().onAs<P<Function>>()
    Ts.Assert.exact.ofAs<'Function'>().onAs<P<() => void>>()
    Ts.Assert.exact.ofAs<'Function'>().onAs<P<(a: string, b: number) => boolean>>()
    class MyClass {
      method() {}
    }
    Ts.Assert.exact.ofAs<'Function'>().onAs<P<typeof MyClass>>() // Class constructor
    Ts.Assert.exact.ofAs<'Function'>().onAs<P<MyClass['method']>>()
  })
})

describe('General Object, any, unknown, never, and Fallbacks', () => {
  test('object', () => {
    Ts.Assert.exact.ofAs<'object'>().onAs<P<object>>()
    Ts.Assert.exact.ofAs<'object'>().onAs<P<{ a: number }>>()
    Ts.Assert.exact.ofAs<'object'>().onAs<P<Record<string, any>>>()
    Ts.Assert.exact.ofAs<'object'>().onAs<P<NonNullable<unknown>>>() // NonNullable<unknown> is {}
  })
  test('unknown', () => {
    Ts.Assert.exact.ofAs<'unknown'>().onAs<P<unknown>>()
  })
  test('never', () => {
    Ts.Assert.exact.ofAs<'never'>().onAs<P<never>>()
  })
})

describe('Union Types', () => {
  test('union of primitives', () => {
    // union order is not deterministic so we have to be a bit loose here.
    Ts.Assert.sub.ofAs<'number | null' | 'null | number'>().onAs<P<number | null>>()
  })

  test('union including any, unknown, never', () => {
    Ts.Assert.exact.ofAs<'any'>().onAs<P<any | 'literal'>>() // any overtakes literal
    Ts.Assert.exact.ofAs<'unknown'>().onAs<P<unknown | 'literal'>>() // unknown overtakes literal
    Ts.Assert.exact.ofAs<"'literal'">().onAs<P<never | 'literal'>>() // never is dropped from unions
  })
})

describe('Fallback Parameter', () => {
  test('fallback with non-primitive types', () => {
    Ts.Assert.exact.ofAs<'CustomObject'>().onAs<P<{ x: 1 }, 'CustomObject'>>()
    Ts.Assert.exact.ofAs<'CustomDate'>().onAs<P<Date, 'CustomDate'>>()
    Ts.Assert.exact.ofAs<'CustomPromise'>().onAs<P<Promise<string>, 'CustomPromise'>>()
    Ts.Assert.exact.ofAs<'CustomArray'>().onAs<P<any[], 'CustomArray'>>()
  })

  test('fallback is ignored for primitive types', () => {
    Ts.Assert.exact.ofAs<'string'>().onAs<P<string, 'CustomString'>>()
    Ts.Assert.exact.ofAs<'123'>().onAs<P<123, 'CustomNumber'>>()
    Ts.Assert.exact.ofAs<'true'>().onAs<P<true, 'CustomBoolean'>>()
    Ts.Assert.exact.ofAs<'100n'>().onAs<P<100n, 'CustomBigInt'>>()
    Ts.Assert.exact.ofAs<'null'>().onAs<P<null, 'CustomNull'>>()
    Ts.Assert.exact.ofAs<'undefined'>().onAs<P<undefined, 'CustomUndefined'>>()
  })

  test('fallback with object', () => {
    Ts.Assert.exact.ofAs<'FallbackForUnknown'>().onAs<P<{ a: 1 }, 'FallbackForUnknown'>>()
  })
})
