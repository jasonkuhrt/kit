import type { Obj } from '#obj'
import type { Apply } from '../../kind.js'
import type { ShowInTemplate } from '../../ts.js'
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
import type { SubKind } from '../kinds/core.js'
import type {
  AnyMatcher,
  AwaitedExtractor,
  EmptyMatcher,
  IndexedExtractor,
  NeverMatcher,
  NoExcessModifier,
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
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Sub Relation
//
//
//
//

/**
 * Sub relation - checks that Actual extends Expected (subtype relation).
 *
 * This checks standard TypeScript subtyping: Actual must be assignable to Expected.
 * The most commonly used relation for general type checking.
 *
 * @example Type Level
 * ```typescript
 * type T = Ts.Test.sub<string, 'hello'>      // ✓ Pass ('hello' extends string)
 * type T = Ts.Test.sub<object, { a: 1 }>     // ✓ Pass (more specific extends less)
 * type T = Ts.Test.sub<'hello', string>      // ✗ Fail (string doesn't extend 'hello')
 * ```
 *
 * @example Value Level
 * ```typescript
 * Ts.Test.sub.is<string>()(value)  // Must use .is for identity
 * ```
 */
export type sub<$Expected, $Actual> = Apply<SubKind, [$Expected, $Actual]>

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Sub Extractors (Type Level)
//
//
//
//

/**
 * Sub relation extractors - compose with the base sub relation.
 *
 * All extractors are defined as type aliases using HKT composition.
 * Extractors are reused - only the relation kind changes.
 */
export namespace sub {
  //
  // ━━━ Identity ━━━
  //

  /**
   * Identity extractor - alias for plain sub check.
   */
  export type is<$Expected, $Actual> = sub<$Expected, $Actual>

  //
  // ━━━ Special Type Extractors ━━━
  //

  /**
   * Assert that a type extends `never` (only never itself).
   */
  export type Never<$Actual> = ComposeRelationMatcher<SubKind, NeverMatcher, $Actual>

  /**
   * Assert that a type extends `any`.
   */
  export type Any<$Actual> = ComposeRelationMatcher<SubKind, AnyMatcher, $Actual>

  /**
   * Assert that a type extends `unknown` (all types do).
   */
  export type Unknown<$Actual> = ComposeRelationMatcher<SubKind, UnknownMatcher, $Actual>

  /**
   * Assert that a type is an empty value.
   */
  export type empty<$Actual> = Apply<
    SubKind,
    [
      true,
      Apply<EmptyMatcher, [$Actual]>,
    ]
  >

  //
  // ━━━ Container Extractors ━━━
  //

  /**
   * Assert that a type extends an array with specific element type.
   *
   * This is the most common use case for container checking.
   *
   * @example
   * ```typescript
   * type T = Ts.Test.sub.array<number, number[]>     // ✓ Pass
   * type T = Ts.Test.sub.array<number, (1 | 2 | 3)[]> // ✓ Pass (narrower elements)
   * ```
   */
  export type array<$Element, $Actual> = Apply<SubKind, [$Element[], $Actual]>

  /**
   * Assert that a type extends a tuple.
   */
  export type tuple<$Expected extends readonly any[], $Actual extends readonly any[]> = Apply<
    SubKind,
    [$Expected, $Actual]
  >

  //
  // ━━━ Transformation Extractors (Chainable) ━━━
  //

  /**
   * Awaited extractor - checks the resolved type extends expected.
   *
   * Most common use: checking Promise resolution types.
   *
   * @example
   * ```typescript
   * type T = Ts.Test.sub.awaited<User, Promise<AdminUser>>  // ✓ Pass if AdminUser extends User
   * ```
   */
  export type awaited<$Expected, $Actual> = ComposeRelationExtractor<
    SubKind,
    AwaitedExtractor,
    $Expected,
    $Actual
  >

  export namespace awaited {
    export type is<$Expected, $Actual> = sub.awaited<$Expected, $Actual>

    export type array<$Element, $Actual> = Apply<
      SubKind,
      [$Element[], Awaited<$Actual>]
    >

    export type indexed<
      $Index extends number,
      $Expected,
      $Actual,
    > = Awaited<$Actual> extends infer __Awaited__
      ? __Awaited__ extends readonly any[] ? Apply<SubKind, [$Expected, __Awaited__[$Index]]>
      : never
      : never
  }

  /**
   * Returned extractor - checks the return type extends expected.
   *
   * Most common use: checking function return types.
   */
  export type returned<$Expected, $Actual> = ComposeRelationExtractor<
    SubKind,
    ReturnedExtractor,
    $Expected,
    $Actual
  >

  export namespace returned {
    export type is<$Expected, $Actual> = sub.returned<$Expected, $Actual>

    export type awaited<$Expected, $Actual> = Apply<
      SubKind,
      [$Expected, ComposeExtractors<ReturnedExtractor, AwaitedExtractor, $Actual>]
    >

    export type array<
      $Element,
      $Actual extends (...args: any[]) => any,
    > = Apply<
      SubKind,
      [$Element[], ReturnType<$Actual>]
    >

    export type indexed<
      $Index extends number,
      $Expected,
      $Actual extends (...args: any[]) => any,
    > = ReturnType<$Actual> extends infer __Returned__
      ? __Returned__ extends readonly any[] ? Apply<SubKind, [$Expected, __Returned__[$Index]]>
      : never
      : never
  }

  /**
   * Indexed extractor - checks specific element extends expected.
   */
  export type indexed<$Index extends number, $Expected, $Actual> = ComposeRelationParameterizedExtractor<
    SubKind,
    IndexedExtractor,
    $Index,
    $Expected,
    $Actual
  >

  //
  // ━━━ Function Extractors ━━━
  //

  export type parameter<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
    SubKind,
    ParameterExtractor,
    0,
    $Expected,
    $Actual
  >

  export type parameter1<$Expected, $Actual> = sub.parameter<$Expected, $Actual>

  export type parameter2<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
    SubKind,
    ParameterExtractor,
    1,
    $Expected,
    $Actual
  >

  export type parameter3<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
    SubKind,
    ParameterExtractor,
    2,
    $Expected,
    $Actual
  >

  export type parameter4<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
    SubKind,
    ParameterExtractor,
    3,
    $Expected,
    $Actual
  >

  export type parameter5<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
    SubKind,
    ParameterExtractor,
    4,
    $Expected,
    $Actual
  >

  export type parameters<$Expected extends readonly any[], $Actual> = ComposeRelationExtractor<
    SubKind,
    ParametersExtractor,
    $Expected,
    $Actual
  >

  //
  // ━━━ Object Extractors ━━━
  //

  export type properties<$Props extends object, $Actual> = ComposeRelationExtractor<
    SubKind,
    PropertiesExtractor,
    $Props,
    $Actual
  >

  //
  // ━━━ Modifier Extractors ━━━
  //

  /**
   * Assert that Actual extends Expected AND has no excess properties.
   *
   * **Most common use case**: Configuration validation with type narrowing.
   *
   * This allows type narrowing (e.g., literal types) while still catching typos.
   *
   * @example
   * ```typescript
   * type Options = { timeout?: number; retry?: boolean }
   *
   * // ✓ Allows literals (narrower types)
   * type T1 = Ts.Test.sub.noExcess<Options, { timeout: 5000, retry: true }>
   *
   * // ✗ Catches typos
   * type T2 = Ts.Test.sub.noExcess<Options, { timeout: 5000, retrys: true }>  // typo!
   * ```
   */
  export type noExcess<$Expected, $Actual> = Apply<
    NoExcessModifier,
    [
      Apply<SubKind, [$Expected, $Actual]>,
      $Expected,
      $Actual,
    ]
  >
}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Sub Extractors (Value Level)
//
//
//
//

/**
 * Sub relation at value level - namespace-only (not callable).
 */
export namespace sub {
  //
  // ━━━ Identity ━━━
  //

  export const is: AssertionFn<SubKind> = runtime

  //
  // ━━━ Special Type Extractors ━━━
  //

  export const never: UnaryAssertionFn<any> = runtimeUnary
  export const any: UnaryAssertionFn<any> = runtimeUnary
  export const unknown: UnaryAssertionFn<any> = runtimeUnary
  export const empty: UnaryAssertionFn<any> = runtimeUnary

  //
  // ━━━ Container Extractors ━━━
  //

  export const array: AssertionFn<any> = runtime
  export const tuple: AssertionFn<any> = runtime

  //
  // ━━━ Transformation Extractors (Namespace-only - chainable) ━━━
  //

  export namespace awaited {
    export const is: AssertionFn<any> = runtime
    export const array: AssertionFn<any> = runtime
    export const indexed: AssertionFn<any> = runtime
  }

  export namespace returned {
    export const is: AssertionFn<any> = runtime
    export const awaited: AssertionFn<any> = runtime
    export const array: AssertionFn<any> = runtime
    export const indexed: AssertionFn<any> = runtime
  }

  export const indexed: AssertionFn<any> = runtime

  //
  // ━━━ Function Extractors ━━━
  //

  export const parameter: AssertionFn<any> = runtime
  export const parameter1: AssertionFn<any> = runtime
  export const parameter2: AssertionFn<any> = runtime
  export const parameter3: AssertionFn<any> = runtime
  export const parameter4: AssertionFn<any> = runtime
  export const parameter5: AssertionFn<any> = runtime
  export const parameters: AssertionFn<any> = runtime

  //
  // ━━━ Object Extractors ━━━
  //

  export const properties: AssertionFn<any> = runtime

  //
  // ━━━ Modifier Extractors ━━━
  //

  export const noExcess: AssertionFn<any> = runtime
}
