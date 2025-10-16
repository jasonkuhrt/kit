import type { Obj } from '#obj'
import type { Apply } from '../../kind.js'
import {
  type AssertionFn,
  runtime,
  runtimeUnary,
  type StaticErrorAssertion,
  type UnaryAssertionFn,
} from '../helpers.js'
import type {
  ComposeExtractors,
  ComposeRelationExtractor,
  ComposeRelationMatcher,
  ComposeRelationParameterizedExtractor,
} from '../kinds/composers.js'
import type { ExactKind } from '../kinds/core.js'
import type {
  AnyMatcher,
  AwaitedExtractor,
  EmptyMatcher,
  IndexedExtractor,
  NeverMatcher,
  ParameterExtractor,
  ParametersExtractor,
  PropertiesExtractor,
  ReturnedExtractor,
  UnknownMatcher,
} from '../kinds/extractors.js'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Exact Relation
//
//
//
//

/**
 * Exact relation - checks for exact structural equality.
 *
 * This is the base relation type that can be used directly or composed with extractors.
 * At the type level, it's a simple type alias. At the value level, use `.is` for identity checks.
 *
 * @example Type Level
 * ```typescript
 * type T = Ts.Test.exact<string, string>  // ✓ Pass
 * type T = Ts.Test.exact<string, number>  // ✗ Fail
 * ```
 *
 * @example Value Level
 * ```typescript
 * Ts.Test.exact.is<string>()(value)  // Must use .is for identity
 * ```
 */
export type exact<$Expected, $Actual> = Apply<ExactKind, [$Expected, $Actual]>

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Exact Extractors (Type Level)
//
//
//
//

/**
 * Exact relation extractors - compose with the base exact relation.
 *
 * All extractors are defined as type aliases using HKT composition.
 * This keeps the implementation DRY - extractors are defined once and reused.
 */
export namespace exact {
  //
  // ━━━ Identity ━━━
  //

  /**
   * Identity extractor - alias for plain exact check.
   * Used for consistency at both type and value level.
   *
   * @example
   * ```typescript
   * type T = Ts.Test.exact.is<string, string>  // Same as exact<string, string>
   * ```
   */
  export type is<$Expected, $Actual> = exact<$Expected, $Actual>

  //
  // ━━━ Special Type Extractors ━━━
  //

  /**
   * Assert that a type is exactly `never`.
   *
   * Note: Type alias uses uppercase `Never` due to TypeScript keyword restriction.
   * Value-level remains lowercase: `exact.never()(value)`.
   *
   * @example
   * ```typescript
   * type T = Ts.Test.exact.Never<never>   // ✓ Pass
   * type T = Ts.Test.exact.Never<string>  // ✗ Fail
   * ```
   */
  export type Never<$Actual> = ComposeRelationMatcher<ExactKind, NeverMatcher, $Actual>

  /**
   * Assert that a type is exactly `any`.
   *
   * Note: Type alias uses uppercase `Any` due to TypeScript keyword restriction.
   * Value-level remains lowercase: `exact.any()(value)`.
   *
   * @example
   * ```typescript
   * type T = Ts.Test.exact.Any<any>      // ✓ Pass
   * type T = Ts.Test.exact.Any<unknown>  // ✗ Fail
   * ```
   */
  export type Any<$Actual> = ComposeRelationMatcher<ExactKind, AnyMatcher, $Actual>

  /**
   * Assert that a type is exactly `unknown`.
   *
   * Note: Type alias uses uppercase `Unknown` due to TypeScript keyword restriction.
   * Value-level remains lowercase: `exact.unknown()(value)`.
   *
   * @example
   * ```typescript
   * type T = Ts.Test.exact.Unknown<unknown>  // ✓ Pass
   * type T = Ts.Test.exact.Unknown<any>      // ✗ Fail
   * ```
   */
  export type Unknown<$Actual> = ComposeRelationMatcher<ExactKind, UnknownMatcher, $Actual>

  /**
   * Assert that a type is an empty value ([], '', or empty object).
   *
   * Dispatches over multiple empty types:
   * - Empty array: []
   * - Empty string: ''
   * - Empty object: Record<string, never>
   *
   * @example
   * ```typescript
   * type T = Ts.Test.exact.empty<[]>         // ✓ Pass
   * type T = Ts.Test.exact.empty<''>         // ✓ Pass
   * type T = Ts.Test.exact.empty<Obj.Empty>  // ✓ Pass
   * type T = Ts.Test.exact.empty<{}>         // ✗ Fail ({} is not empty in TS)
   * ```
   */
  export type empty<$Actual> = Apply<
    ExactKind,
    [
      true,
      Apply<EmptyMatcher, [$Actual]>,
    ]
  >

  //
  // ━━━ Container Extractors ━━━
  //

  /**
   * Assert that a type is exactly an array with specific element type.
   *
   * @example
   * ```typescript
   * type T = Ts.Test.exact.array<string, string[]>  // ✓ Pass
   * type T = Ts.Test.exact.array<number, string[]>  // ✗ Fail
   * ```
   */
  export type array<$Element, $Actual> = Apply<ExactKind, [$Element[], $Actual]>

  /**
   * Assert that a type is exactly a tuple with specific structure.
   *
   * @example
   * ```typescript
   * type T = Ts.Test.exact.tuple<[string, number], [string, number]>  // ✓ Pass
   * type T = Ts.Test.exact.tuple<[string], [string, number]>          // ✗ Fail
   * ```
   */
  export type tuple<$Expected extends readonly any[], $Actual extends readonly any[]> = Apply<
    ExactKind,
    [$Expected, $Actual]
  >

  //
  // ━━━ Transformation Extractors (Chainable) ━━━
  //

  /**
   * Awaited extractor - checks the resolved type of a Promise.
   *
   * This is a chainable extractor (namespace with both types and values).
   * Use `.is` for terminal check, or chain to other extractors.
   *
   * @example Type Level
   * ```typescript
   * type T = Ts.Test.exact.awaited<number, Promise<number>>  // ✓ Pass
   * type T = Ts.Test.exact.awaited.array<string, Promise<string[]>>  // ✓ Chained
   * ```
   */
  export type awaited<$Expected, $Actual> = ComposeRelationExtractor<
    ExactKind,
    AwaitedExtractor,
    $Expected,
    $Actual
  >

  /**
   * Awaited extractor chaining - allows further extraction after awaiting.
   */
  export namespace awaited {
    /**
     * Terminal awaited check - explicit identity.
     */
    export type is<$Expected, $Actual> = exact.awaited<$Expected, $Actual>

    /**
     * Check that awaited type is exactly an array with specific element.
     *
     * @example
     * ```typescript
     * type T = Ts.Test.exact.awaited.array<string, Promise<string[]>>  // ✓ Pass
     * ```
     */
    export type array<$Element, $Actual> = Apply<
      ExactKind,
      [$Element[], Awaited<$Actual>]
    >

    /**
     * Check specific index of awaited array/tuple.
     *
     * @example
     * ```typescript
     * type T = Ts.Test.exact.awaited.indexed<0, string, Promise<[string, number]>>  // ✓ Pass
     * ```
     */
    export type indexed<
      $Index extends number,
      $Expected,
      $Actual,
    > = Awaited<$Actual> extends infer __Awaited__
      ? __Awaited__ extends readonly any[] ? Apply<ExactKind, [$Expected, __Awaited__[$Index]]>
      : never
      : never
  }

  /**
   * Returned extractor - checks the return type of a function.
   *
   * This is a chainable extractor (namespace with both types and values).
   * Use `.is` for terminal check, or chain to other extractors like `.awaited`.
   *
   * @example Type Level
   * ```typescript
   * type T = Ts.Test.exact.returned<number, () => number>  // ✓ Pass
   * type T = Ts.Test.exact.returned.awaited<User, () => Promise<User>>  // ✓ Chained
   * ```
   */
  export type returned<$Expected, $Actual> = ComposeRelationExtractor<
    ExactKind,
    ReturnedExtractor,
    $Expected,
    $Actual
  >

  /**
   * Returned extractor chaining - allows further extraction from return type.
   */
  export namespace returned {
    /**
     * Terminal returned check - explicit identity.
     */
    export type is<$Expected, $Actual> = exact.returned<$Expected, $Actual>

    /**
     * Check that function returns exactly a Promise resolving to specific type.
     *
     * @example
     * ```typescript
     * type T = Ts.Test.exact.returned.awaited<User, () => Promise<User>>  // ✓ Pass
     * ```
     */
    export type awaited<$Expected, $Actual> = Apply<
      ExactKind,
      [$Expected, ComposeExtractors<ReturnedExtractor, AwaitedExtractor, $Actual>]
    >

    /**
     * Check that function returns exactly an array with specific element type.
     *
     * @example
     * ```typescript
     * type T = Ts.Test.exact.returned.array<string, () => string[]>  // ✓ Pass
     * ```
     */
    export type array<
      $Element,
      $Actual extends (...args: any[]) => any,
    > = Apply<
      ExactKind,
      [$Element[], ReturnType<$Actual>]
    >

    /**
     * Check specific index of returned array/tuple.
     *
     * @example
     * ```typescript
     * type T = Ts.Test.exact.returned.indexed<0, string, () => [string, number]>  // ✓ Pass
     * ```
     */
    export type indexed<
      $Index extends number,
      $Expected,
      $Actual extends (...args: any[]) => any,
    > = ReturnType<$Actual> extends infer __Returned__
      ? __Returned__ extends readonly any[] ? Apply<ExactKind, [$Expected, __Returned__[$Index]]>
      : never
      : never
  }

  /**
   * Indexed extractor - checks specific element of array/tuple.
   *
   * @example
   * ```typescript
   * type T = Ts.Test.exact.indexed<0, string, [string, number]>  // ✓ Pass
   * type T = Ts.Test.exact.indexed<1, number, [string, number]>  // ✓ Pass
   * ```
   */
  export type indexed<$Index extends number, $Expected, $Actual> = ComposeRelationParameterizedExtractor<
    ExactKind,
    IndexedExtractor,
    $Index,
    $Expected,
    $Actual
  >

  //
  // ━━━ Function Extractors ━━━
  //

  /**
   * Assert that a function's first parameter is exactly the expected type.
   *
   * @example
   * ```typescript
   * type T = Ts.Test.exact.parameter<string, (x: string) => void>  // ✓ Pass
   * ```
   */
  export type parameter<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
    ExactKind,
    ParameterExtractor,
    0,
    $Expected,
    $Actual
  >

  /**
   * Assert that a function's first parameter is exactly the expected type.
   * Explicit alias of `parameter` for clarity.
   */
  export type parameter1<$Expected, $Actual> = exact.parameter<$Expected, $Actual>

  /**
   * Assert that a function's second parameter is exactly the expected type.
   *
   * @example
   * ```typescript
   * type T = Ts.Test.exact.parameter2<number, (x: string, y: number) => void>  // ✓ Pass
   * ```
   */
  export type parameter2<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
    ExactKind,
    ParameterExtractor,
    1,
    $Expected,
    $Actual
  >

  /**
   * Assert that a function's third parameter is exactly the expected type.
   */
  export type parameter3<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
    ExactKind,
    ParameterExtractor,
    2,
    $Expected,
    $Actual
  >

  /**
   * Assert that a function's fourth parameter is exactly the expected type.
   */
  export type parameter4<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
    ExactKind,
    ParameterExtractor,
    3,
    $Expected,
    $Actual
  >

  /**
   * Assert that a function's fifth parameter is exactly the expected type.
   */
  export type parameter5<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
    ExactKind,
    ParameterExtractor,
    4,
    $Expected,
    $Actual
  >

  /**
   * Assert that a function's full parameter tuple is exactly the expected type.
   *
   * @example
   * ```typescript
   * type T = Ts.Test.exact.parameters<[string, number], (x: string, y: number) => void>  // ✓ Pass
   * ```
   */
  export type parameters<$Expected extends readonly any[], $Actual> = ComposeRelationExtractor<
    ExactKind,
    ParametersExtractor,
    $Expected,
    $Actual
  >

  //
  // ━━━ Object Extractors ━━━
  //

  /**
   * Assert that specific properties of an object are exactly the expected types.
   * Ignores other properties not specified in $Props.
   *
   * @example
   * ```typescript
   * type Config = { id: string; name: string; debug: boolean }
   * type T = Ts.Test.exact.properties<{ id: string }, Config>  // ✓ Pass
   * ```
   */
  export type properties<$Props extends object, $Actual> = ComposeRelationExtractor<
    ExactKind,
    PropertiesExtractor,
    $Props,
    $Actual
  >

  //
  // ━━━ Modifier Extractors ━━━
  //

  /**
   * Assert that two types are exactly equal AND $Actual has no excess properties.
   *
   * **Note**: For exact equality, excess properties are already part of structural checking,
   * so this is primarily useful when combining with other modifiers or for explicit clarity.
   *
   * @example
   * ```typescript
   * type T = Ts.Test.exact.noExcess<{ id: string }, { id: string }>        // ✓ Pass
   * type T = Ts.Test.exact.noExcess<{ id: string }, { id: string; x: 1 }>  // ✗ Fail
   * ```
   */
  export type noExcess<$Expected, $Actual> = Apply<
    ExactKind,
    [
      $Expected,
      [keyof Obj.SubtractShallow<$Actual, $Expected>] extends [never] ? $Actual
        : StaticErrorAssertion<
          'Type has excess properties not present in expected type',
          $Expected,
          $Actual
        >,
    ]
  >
}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Exact Extractors (Value Level)
//
//
//
//

/**
 * Exact relation at value level - namespace-only (not callable).
 *
 * All extractors are defined as const values using the runtime infrastructure.
 * For plain checks, use `.is`. For extraction, use specific extractors.
 *
 * **No callable interface** - namespace-only for clean autocomplete!
 */
export namespace exact {
  //
  // ━━━ Identity ━━━
  //

  /**
   * Identity extractor - check value's type exactly matches expected.
   *
   * @example
   * ```typescript
   * Ts.Test.exact.is<string>()(value)
   * ```
   */
  export const is: AssertionFn<ExactKind> = runtime

  //
  // ━━━ Special Type Extractors ━━━
  //

  /**
   * Assert that a value's type is exactly `never`.
   *
   * @example
   * ```typescript
   * Ts.Test.exact.never()(value)
   * Ts.Test.exact.never<never>()  // Type-only mode
   * ```
   */
  export const never: UnaryAssertionFn<any> = runtimeUnary

  /**
   * Assert that a value's type is exactly `any`.
   *
   * @example
   * ```typescript
   * Ts.Test.exact.any()(value)
   * ```
   */
  export const any: UnaryAssertionFn<any> = runtimeUnary

  /**
   * Assert that a value's type is exactly `unknown`.
   *
   * @example
   * ```typescript
   * Ts.Test.exact.unknown()(value)
   * ```
   */
  export const unknown: UnaryAssertionFn<any> = runtimeUnary

  /**
   * Assert that a value's type is an empty value.
   *
   * @example
   * ```typescript
   * Ts.Test.exact.empty()(value)
   * ```
   */
  export const empty: UnaryAssertionFn<any> = runtimeUnary

  //
  // ━━━ Container Extractors ━━━
  //

  /**
   * Assert that a value is exactly an array with specific element type.
   *
   * @example
   * ```typescript
   * Ts.Test.exact.array<string>()(value)
   * ```
   */
  export const array: AssertionFn<any> = runtime

  /**
   * Assert that a value is exactly a tuple with specific structure.
   *
   * @example
   * ```typescript
   * Ts.Test.exact.tuple<[string, number]>()(value)
   * ```
   */
  export const tuple: AssertionFn<any> = runtime

  //
  // ━━━ Transformation Extractors (Namespace-only - chainable) ━━━
  //

  /**
   * Awaited extractor - namespace-only (not callable).
   * Use `.is` for terminal check, or chain to other extractors.
   */
  export namespace awaited {
    /**
     * Terminal awaited check.
     *
     * @example
     * ```typescript
     * Ts.Test.exact.awaited.is<number>()(promise)
     * ```
     */
    export const is: AssertionFn<any> = runtime

    /**
     * Check awaited type is exactly an array.
     *
     * @example
     * ```typescript
     * Ts.Test.exact.awaited.array<string>()(promise)
     * ```
     */
    export const array: AssertionFn<any> = runtime

    /**
     * Check specific index of awaited array/tuple.
     *
     * @example
     * ```typescript
     * Ts.Test.exact.awaited.indexed<0, string>()(promise)
     * ```
     */
    export const indexed: AssertionFn<any> = runtime
  }

  /**
   * Returned extractor - namespace-only (not callable).
   * Use `.is` for terminal check, or chain to other extractors like `.awaited`.
   */
  export namespace returned {
    /**
     * Terminal returned check.
     *
     * @example
     * ```typescript
     * Ts.Test.exact.returned.is<number>()(fn)
     * ```
     */
    export const is: AssertionFn<any> = runtime

    /**
     * Check function returns a Promise resolving to specific type.
     *
     * @example
     * ```typescript
     * Ts.Test.exact.returned.awaited<User>()(asyncFn)
     * ```
     */
    export const awaited: AssertionFn<any> = runtime

    /**
     * Check function returns exactly an array.
     *
     * @example
     * ```typescript
     * Ts.Test.exact.returned.array<string>()(fn)
     * ```
     */
    export const array: AssertionFn<any> = runtime

    /**
     * Check specific index of returned array/tuple.
     *
     * @example
     * ```typescript
     * Ts.Test.exact.returned.indexed<0, string>()(fn)
     * ```
     */
    export const indexed: AssertionFn<any> = runtime
  }

  /**
   * Indexed extractor - check specific element of array/tuple.
   *
   * @example
   * ```typescript
   * Ts.Test.exact.indexed<0, string>()(tuple)
   * ```
   */
  export const indexed: AssertionFn<any> = runtime

  //
  // ━━━ Function Extractors ━━━
  //

  /**
   * Assert that a function's first parameter is exactly the expected type.
   *
   * @example
   * ```typescript
   * Ts.Test.exact.parameter<string>()(fn)
   * ```
   */
  export const parameter: AssertionFn<any> = runtime

  /**
   * Explicit alias of `parameter` for first parameter.
   */
  export const parameter1: AssertionFn<any> = runtime

  /**
   * Assert that a function's second parameter is exactly the expected type.
   */
  export const parameter2: AssertionFn<any> = runtime

  /**
   * Assert that a function's third parameter is exactly the expected type.
   */
  export const parameter3: AssertionFn<any> = runtime

  /**
   * Assert that a function's fourth parameter is exactly the expected type.
   */
  export const parameter4: AssertionFn<any> = runtime

  /**
   * Assert that a function's fifth parameter is exactly the expected type.
   */
  export const parameter5: AssertionFn<any> = runtime

  /**
   * Assert that a function's full parameter tuple is exactly the expected type.
   *
   * @example
   * ```typescript
   * Ts.Test.exact.parameters<[string, number]>()(fn)
   * ```
   */
  export const parameters: AssertionFn<any> = runtime

  //
  // ━━━ Object Extractors ━━━
  //

  /**
   * Assert that specific properties are exactly the expected types.
   *
   * @example
   * ```typescript
   * Ts.Test.exact.properties<{ id: string }>()(config)
   * ```
   */
  export const properties: AssertionFn<any> = runtime

  //
  // ━━━ Modifier Extractors ━━━
  //

  /**
   * Assert exact equality with no excess properties.
   *
   * @example
   * ```typescript
   * Ts.Test.exact.noExcess<{ id: string }>()(value)
   * ```
   */
  export const noExcess: AssertionFn<any> = runtime
}
