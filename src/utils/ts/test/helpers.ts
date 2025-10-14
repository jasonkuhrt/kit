import type { Apply, Kind } from '../kind.js'
import type { IsNever } from '../ts.js'
import type { ___NoValue___, IsNoTypeArg } from './shared.js'

//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Higher-Kinded Types (HKT) Pattern
//
// This module uses the HKT pattern to achieve polymorphism over type constructors.
//
// **Kind Interface**: Defines the "shape" of a type-level function
//   interface SubKind {
//     parameters: [$Expected, $Actual]  // Input types
//     return: $Actual extends $Expected ? never : StaticErrorAssertion<...>  // Output type
//   }
//
// **Apply Type**: "Calls" a Kind with concrete type arguments
//   Apply<SubKind, [string, 'hello']>  // Evaluates the conditional, returns never
//
// **Why**: Allows generic functions like AssertionFn to work with ANY assertion logic.
//   The Kind is a type parameter, so we can plug in different assertion behaviors
//   (exact, sub, sup, etc.) without duplicating the assertion function infrastructure.
//

/**
 * Type-level test assertion that requires the result to be never (no error).
 * Used in type-level test suites to ensure a type evaluates to never (success).
 *
 * @example
 * ```ts
 * type MyTests = [
 *   Ts.Test.Case<Equal<string, string>>,  // OK - evaluates to never (success)
 *   Ts.Test.Case<Equal<string, number>>,  // Error - doesn't extend never (returns error)
 * ]
 * ```
 */
export type Case<$Result extends never> = $Result

/**
 * Type-level batch assertion helper that accepts multiple assertions.
 * Each type parameter must extend never (no error), allowing batch type assertions.
 *
 * @example
 * ```ts
 * type _ = Ts.Test.Cases<
 *   Equal<string, string>,     // ✓ Pass (returns never)
 *   Extends<string, 'hello'>,  // ✓ Pass (returns never)
 *   Never<never>               // ✓ Pass (returns never)
 * >
 *
 * // Type error if any assertion fails
 * type _ = Ts.Test.Cases<
 *   Equal<string, string>,     // ✓ Pass (returns never)
 *   Equal<string, number>,     // ✗ Fail - Type error here (returns StaticErrorAssertion)
 *   Extends<string, 'hello'>   // ✓ Pass (returns never)
 * >
 * ```
 */
export type Cases<
  _T1 extends never = never,
  _T2 extends never = never,
  _T3 extends never = never,
  _T4 extends never = never,
  _T5 extends never = never,
  _T6 extends never = never,
  _T7 extends never = never,
  _T8 extends never = never,
  _T9 extends never = never,
  _T10 extends never = never,
  _T11 extends never = never,
  _T12 extends never = never,
  _T13 extends never = never,
  _T14 extends never = never,
  _T15 extends never = never,
  _T16 extends never = never,
  _T17 extends never = never,
  _T18 extends never = never,
  _T19 extends never = never,
  _T20 extends never = never,
  _T21 extends never = never,
  _T22 extends never = never,
  _T23 extends never = never,
  _T24 extends never = never,
  _T25 extends never = never,
  _T26 extends never = never,
  _T27 extends never = never,
  _T28 extends never = never,
  _T29 extends never = never,
  _T30 extends never = never,
  _T31 extends never = never,
  _T32 extends never = never,
  _T33 extends never = never,
  _T34 extends never = never,
  _T35 extends never = never,
  _T36 extends never = never,
  _T37 extends never = never,
  _T38 extends never = never,
  _T39 extends never = never,
  _T40 extends never = never,
  _T41 extends never = never,
  _T42 extends never = never,
  _T43 extends never = never,
  _T44 extends never = never,
  _T45 extends never = never,
  _T46 extends never = never,
  _T47 extends never = never,
  _T48 extends never = never,
  _T49 extends never = never,
  _T50 extends never = never,
  _T51 extends never = never,
  _T52 extends never = never,
  _T53 extends never = never,
  _T54 extends never = never,
  _T55 extends never = never,
  _T56 extends never = never,
  _T57 extends never = never,
  _T58 extends never = never,
  _T59 extends never = never,
  _T60 extends never = never,
  _T61 extends never = never,
  _T62 extends never = never,
  _T63 extends never = never,
  _T64 extends never = never,
  _T65 extends never = never,
  _T66 extends never = never,
  _T67 extends never = never,
  _T68 extends never = never,
  _T69 extends never = never,
  _T70 extends never = never,
  _T71 extends never = never,
  _T72 extends never = never,
  _T73 extends never = never,
  _T74 extends never = never,
  _T75 extends never = never,
  _T76 extends never = never,
  _T77 extends never = never,
  _T78 extends never = never,
  _T79 extends never = never,
  _T80 extends never = never,
  _T81 extends never = never,
  _T82 extends never = never,
  _T83 extends never = never,
  _T84 extends never = never,
  _T85 extends never = never,
  _T86 extends never = never,
  _T87 extends never = never,
  _T88 extends never = never,
  _T89 extends never = never,
  _T90 extends never = never,
  _T91 extends never = never,
  _T92 extends never = never,
  _T93 extends never = never,
  _T94 extends never = never,
  _T95 extends never = never,
  _T96 extends never = never,
  _T97 extends never = never,
  _T98 extends never = never,
  _T99 extends never = never,
  _T100 extends never = never,
> = true

/**
 * Represents a static assertion error at the type level, optimized for type testing.
 *
 * This is a simpler, more focused error type compared to {@link StaticError}. It's specifically
 * designed for type assertions where you need to communicate expected vs. actual types.
 *
 * @template $Message - A string literal type describing the assertion failure
 * @template $Expected - The expected type
 * @template $Actual - The actual type that was provided
 * @template $Tip - Optional tip for resolving the error
 *
 * @example
 * ```ts
 * // Using in parameter assertions
 * function assertParameters<T extends readonly any[]>(
 *   fn: Parameters<typeof fn> extends T ? typeof fn
 *     : StaticErrorAssertion<
 *       'Parameters mismatch',
 *       T,
 *       Parameters<typeof fn>
 *     >
 * ): void {}
 *
 * // Error shows:
 * // MESSAGE: 'Parameters mismatch'
 * // EXPECTED: [string, number]
 * // ACTUAL: [number, string]
 * ```
 *
 * @category Error Messages
 */
export interface StaticErrorAssertion<
  $Message extends string = string,
  $Expected = unknown,
  $Actual = unknown,
  $Tip extends string = never,
> {
  MESSAGE: $Message
  EXPECTED: $Expected
  ACTUAL: $Actual
  TIP: $Tip
}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Generic Assertion Infrastructure
//
//
//
//

/**
 * Convert an assertion result to rest parameter specification.
 * - If assertion passes (never), no arguments required (empty array)
 * - If assertion fails (StaticErrorAssertion), requires error argument
 *
 * @template $Result - The assertion result (never | StaticErrorAssertion)
 */
// dprint-ignore
export type ResultToRestArgs<$Result> =
  [$Result] extends [never]  // Tuple wrapping prevents distributive conditional
    ? []  // Pass - no args required
    : [error: $Result] // Fail - require error argument

/**
 * Generic assertion function type that works for any assertion Kind.
 *
 * Supports two modes:
 * - Value mode: `fn<Expected>()` returns function accepting value
 * - Type-only mode: `fn<Expected, Actual>()` validates types, requires error arg if fails
 *
 * @template $Assertion - The assertion Kind defining the check logic
 */
/**
 * Error: Type `never` was passed but expected type is not `never`.
 *
 * **Why this error exists:**
 * This library enforces stricter semantics than TypeScript's natural subtyping to catch bugs.
 * In TypeScript, `never` is the bottom type and extends everything, which means passing
 * `never` as a value would incorrectly satisfy any assertion.
 *
 * **How to fix:**
 * If you actually expect `never`, use the appropriate assertion with `never` as the expected type:
 * - `Ts.Test.exact<never>()(value)`
 * - `Ts.Test.sub<never>()(value)`
 * - etc.
 *
 * **Example:**
 * ```ts
 * // ✗ Error - never passed when expecting number
 * Ts.Test.exact<number>()(null as never)
 *
 * // ✓ Correct - explicitly expecting never
 * Ts.Test.exact<never>()(null as never)
 * ```
 */
interface NeverNotAllowedError {
  readonly __error__: 'Type never is not assignable unless expected type is never'
  readonly __tip__: 'Use exact<never>() or sub<never>() if you actually expect never type'
  readonly __expected__: unknown
  readonly __actual__: never
}

/**
 * Conditional rest parameters for never detection.
 * When never is passed to a non-never expected type, requires an error parameter.
 * Uses tuple wrapping to prevent distributive conditional behavior with never.
 */
// dprint-ignore
type NeverErrorParams<$Expected, $actual> =
  [IsNever<$actual>] extends [true]  // Tuple wrapping prevents distribution over never/unions
    ? [IsNever<$Expected>] extends [true]
      ? []  // Both are never - no extra param needed
      : [error: NeverNotAllowedError]  // Must pass error param
    : [] // Normal case - no extra param needed

// dprint-ignore
export type AssertionFn<$Assertion extends Kind> = <
  $Expected,
  $Actual = ___NoValue___,
>(
  ..._:
    IsNoTypeArg<$Actual> extends true
      ? []  // Value mode - no args required
      : ResultToRestArgs<Apply<$Assertion, [$Expected, $Actual]>>
) =>
  IsNoTypeArg<$Actual> extends true
    ? <$actual>(
        actual:
          [Apply<$Assertion, [$Expected, $actual]>] extends [never]  // Tuple wrapping prevents distributive conditional
            ? $actual  // Assertion passes
            : Apply<$Assertion, [$Expected, $actual]>,  // Assertion fails
        ..._ERROR_never_only_allowed_when_expected_is_never: NeverErrorParams<$Expected, $actual>
      ) => void
    : void // Type-only mode: return void

/**
 * Generic assertion function type for *Const variants.
 *
 * Similar to {@link AssertionFn} but specialized for const assertions:
 * - Only supports value mode (no type-only mode)
 * - Uses `const` assertion to preserve literal types
 * - Takes `$Expected` type parameter first, returns function accepting value
 *
 * @template $Assertion - The assertion Kind defining the check logic
 *
 * @example
 * ```ts
 * // Define assertion using existing Kind
 * export const subConst: ConstAssertionFn<SubKind> = runtimeConst
 *
 * // Usage
 * subConst<string>()('hello')  // OK - preserves 'hello' literal
 * subConst<{ a: number }>()({ a: 1 })  // OK - preserves { readonly a: 1 }
 * ```
 */
// dprint-ignore
export type ConstAssertionFn<$Assertion extends Kind> = <$Expected>() =>
  <const $Actual>(
    _actual:
      [Apply<$Assertion, [$Expected, $Actual]>] extends [never]  // Tuple wrapping prevents distributive conditional
        ? $Actual  // Assertion passes
        : Apply<$Assertion, [$Expected, $Actual]>,  // Assertion fails
    ..._ERROR_never_only_allowed_when_expected_is_never: NeverErrorParams<$Expected, $Actual>
  ) => void

/**
 * Generic assertion function type for single-parameter (unary) assertions.
 *
 * Supports two modes:
 * - Value mode: `fn()` returns function accepting value to check
 * - Type-only mode: `fn<Actual>()` validates type, requires error arg if fails
 *
 * Used for assertions that only check properties of the actual type,
 * without comparing to an expected type (e.g., Not.promise, equalNever).
 *
 * @template $Assertion - The assertion Kind with single parameter
 *
 * @example
 * ```ts
 * // Define unary assertion using a Kind with one parameter
 * interface NotPromiseKind {
 *   parameters: [$Actual: unknown]
 *   return: $Actual extends Promise<any> ? StaticErrorAssertion<...> : never
 * }
 * export const notPromise: UnaryAssertionFn<NotPromiseKind> = runtimeUnary
 *
 * // Usage
 * notPromise()(42)  // OK - not a Promise
 * notPromise<number>()  // OK - type-only mode
 * notPromise<Promise<number>>()  // Error - is a Promise
 * ```
 */
// dprint-ignore
export type UnaryAssertionFn<$Assertion extends Kind> = <$Actual = ___NoValue___>(
  ..._:
    IsNoTypeArg<$Actual> extends true
      ? []  // Value mode - no args required
      : ResultToRestArgs<Apply<$Assertion, [$Actual]>>
) =>
  IsNoTypeArg<$Actual> extends true
    ? <$actual>(
        _actual:
          [Apply<$Assertion, [$actual]>] extends [never]  // Tuple wrapping prevents distributive conditional
            ? $actual  // Assertion passes
            : Apply<$Assertion, [$actual]>  // Assertion fails - show error
      ) => void
    : void // Type-only mode: return void

/**
 * Generic assertion function type for container extractors.
 *
 * Combines type extraction (e.g., ReturnType, Parameters) with assertion in one step.
 * Used for assertions like `returns` and `returnsPromise` that accept containers
 * (functions) and assert on extracted types (return types).
 *
 * Supports two modes:
 * - Value mode: `fn<Expected>()` returns function accepting container
 * - Type-only mode: `fn<Expected, Extracted>()` validates extracted type
 *
 * @template $Extractor - Kind that extracts type from container (e.g., ReturnType)
 * @template $Assertion - Assertion Kind to apply to extracted type
 *
 * @example
 * ```ts
 * // Define extractor Kind
 * interface ReturnTypeExtractor {
 *   parameters: [$Container: (...args: any[]) => any]
 *   return: ReturnType<this['parameters'][0]>
 * }
 *
 * // Compose with assertion
 * export const returns: ExtractorAssertionFn<ReturnTypeExtractor, SubKind> = runtimeExtractor
 *
 * // Usage
 * function getUser() { return { name: 'John' } }
 * returns<{ name: string }>()(getUser)  // OK
 * ```
 */
// dprint-ignore
export type ExtractorAssertionFn<$Extractor extends Kind, $Assertion extends Kind> = <
  $Expected,
  $Actual = ___NoValue___,
>(
  ..._:
    IsNoTypeArg<$Actual> extends true
      ? []  // Value mode - no args required
      : ResultToRestArgs<Apply<$Assertion, [$Expected, $Actual]>>
) =>
  IsNoTypeArg<$Actual> extends true
    ? <$Container>(
        _container:
          [Apply<$Assertion, [$Expected, Apply<$Extractor, [$Container]>]>] extends [never]  // Tuple wrapping prevents distributive conditional
            ? $Container  // Assertion passes
            : Apply<$Assertion, [$Expected, Apply<$Extractor, [$Container]>]>,  // Assertion fails
        ..._ERROR_never_only_allowed_when_expected_is_never: NeverErrorParams<$Expected, $Container>
      ) => void
    : void // Type-only mode: return void

export const runtime = () => ((..._args: any[]) => {}) as any
export const runtimeConst = <$Expected>() => (..._args: any[]) => {}
export const runtimeUnary = ((..._args: any[]) => {}) as any
export const runtimeExtractor = runtime
