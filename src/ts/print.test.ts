import { Ts } from '#ts/index.js'
import { describe, expectTypeOf, test } from 'vitest'

// Alias for Ts.Print to make test cases less verbose
type P<T, Fallback extends string | undefined = undefined> = Ts.Print<T, Fallback>

describe('Primitives and Literals', () => {
  test('string', () => {
    expectTypeOf<P<string>>().toEqualTypeOf<'string'>()
    expectTypeOf<P<'hello'>>().toEqualTypeOf<"'hello'">()
    // todo: should use template literal backticks instead actually
    expectTypeOf<P<`template${string}`>>().toEqualTypeOf<`'template${string}'`>()
  })

  test('number', () => {
    expectTypeOf<P<number>>().toEqualTypeOf<'number'>()
    expectTypeOf<P<123>>().toEqualTypeOf<'123'>()
    expectTypeOf<P<0.5>>().toEqualTypeOf<'0.5'>()
    expectTypeOf<P<-10>>().toEqualTypeOf<'-10'>()
  })

  test('boolean', () => {
    expectTypeOf<P<boolean>>().toEqualTypeOf<'boolean'>()
    expectTypeOf<P<true>>().toEqualTypeOf<'true'>()
    expectTypeOf<P<false>>().toEqualTypeOf<'false'>()
  })

  test('bigint', () => {
    expectTypeOf<P<bigint>>().toEqualTypeOf<'bigint'>()
    expectTypeOf<P<100n>>().toEqualTypeOf<'100n'>()
    expectTypeOf<P<-20n>>().toEqualTypeOf<'-20n'>()
  })

  test('null and undefined', () => {
    expectTypeOf<P<null>>().toEqualTypeOf<'null'>()
    expectTypeOf<P<undefined>>().toEqualTypeOf<'undefined'>()
  })

  test('symbol', () => {
    expectTypeOf<P<symbol>>().toEqualTypeOf<'symbol'>()
    const mySymbol = Symbol('description')
    type MySymbolType = typeof mySymbol
    expectTypeOf<P<MySymbolType>>().toEqualTypeOf<'symbol'>() // Description is not part of the type string
  })
})

describe('Common Object Types', () => {
  test('Promise', () => {
    expectTypeOf<P<Promise<any>>>().toEqualTypeOf<'Promise<any>'>()
    expectTypeOf<P<Promise<string>>>().toEqualTypeOf<'Promise<string>'>()
    expectTypeOf<P<Promise<number>>>().toEqualTypeOf<'Promise<number>'>()
    expectTypeOf<P<Promise<undefined>>>().toEqualTypeOf<'Promise<undefined>'>()
    expectTypeOf<P<Promise<void>>>().toEqualTypeOf<'Promise<void>'>()
  })

  test('Array', () => {
    expectTypeOf<P<any[]>>().toEqualTypeOf<'Array<any>'>()
    expectTypeOf<P<unknown[]>>().toEqualTypeOf<'Array<unknown>'>() // unknown is not any
    expectTypeOf<P<readonly Date[]>>().toEqualTypeOf<'ReadonlyArray<Date>'>()
    // todo: tuples
    // expectTypeOf<Print<readonly [Date, RegExp]>>().toEqualTypeOf<'ReadonlyArray<Date,RegExp>'>()
  })

  test('Date', () => {
    expectTypeOf<P<Date>>().toEqualTypeOf<'Date'>()
  })

  test('RegExp', () => {
    expectTypeOf<P<RegExp>>().toEqualTypeOf<'RegExp'>()
  })

  test('Function', () => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    expectTypeOf<P<Function>>().toEqualTypeOf<'Function'>()
    expectTypeOf<P<() => void>>().toEqualTypeOf<'Function'>()
    expectTypeOf<P<(a: string, b: number) => boolean>>().toEqualTypeOf<'Function'>()
    class MyClass {
      method() {}
    }
    expectTypeOf<P<typeof MyClass>>().toEqualTypeOf<'Function'>() // Class constructor
    expectTypeOf<P<MyClass['method']>>().toEqualTypeOf<'Function'>()
  })
})

describe('General Object, any, unknown, never, and Fallbacks', () => {
  test('object', () => {
    expectTypeOf<P<object>>().toEqualTypeOf<'object'>()
    expectTypeOf<P<{ a: number }>>().toEqualTypeOf<'object'>()
    expectTypeOf<P<Record<string, any>>>().toEqualTypeOf<'object'>()
    expectTypeOf<P<NonNullable<unknown>>>().toEqualTypeOf<'object'>() // NonNullable<unknown> is {}
  })
  test('unknown', () => {
    expectTypeOf<P<unknown>>().toEqualTypeOf<'unknown'>()
  })
  test('never', () => {
    expectTypeOf<P<never>>().toEqualTypeOf<'never'>()
  })
})

describe('Union Types', () => {
  test('union of primitives', () => {
    // union order is not deterministic so we have to be a bit loose here.
    expectTypeOf<P<number | null>>().toExtend<'number | null' | 'null | number'>()
  })

  test('union including any, unknown, never', () => {
    expectTypeOf<P<any | 'literal'>>().toEqualTypeOf<'any'>() // any overtakes literal
    expectTypeOf<P<unknown | 'literal'>>().toEqualTypeOf<'unknown'>() // unknown overtakes literal
    expectTypeOf<P<never | 'literal'>>().toEqualTypeOf<"'literal'">() // never is dropped from unions
  })
})

describe('Fallback Parameter', () => {
  test('fallback with non-primitive types', () => {
    expectTypeOf<P<{ x: 1 }, 'CustomObject'>>().toEqualTypeOf<'CustomObject'>()
    expectTypeOf<P<Date, 'CustomDate'>>().toEqualTypeOf<'CustomDate'>()
    expectTypeOf<P<Promise<string>, 'CustomPromise'>>().toEqualTypeOf<'CustomPromise'>()
    expectTypeOf<P<any[], 'CustomArray'>>().toEqualTypeOf<'CustomArray'>()
  })

  test('fallback is ignored for primitive types', () => {
    expectTypeOf<P<string, 'CustomString'>>().toEqualTypeOf<'string'>()
    expectTypeOf<P<123, 'CustomNumber'>>().toEqualTypeOf<'123'>()
    expectTypeOf<P<true, 'CustomBoolean'>>().toEqualTypeOf<'true'>()
    expectTypeOf<P<100n, 'CustomBigInt'>>().toEqualTypeOf<'100n'>()
    expectTypeOf<P<null, 'CustomNull'>>().toEqualTypeOf<'null'>()
    expectTypeOf<P<undefined, 'CustomUndefined'>>().toEqualTypeOf<'undefined'>()
  })

  test('fallback with object', () => {
    expectTypeOf<P<{ a: 1 }, 'FallbackForUnknown'>>().toEqualTypeOf<'FallbackForUnknown'>()
  })
})
