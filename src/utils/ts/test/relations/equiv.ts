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
import type { EquivKind } from '../kinds/core.js'
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
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Equiv Relation
//
//
//
//

/**
 * Equiv relation - checks for mutual assignability (semantic equality).
 *
 * Two types are equivalent if they are mutually assignable (A extends B and B extends A).
 * This checks semantic equality rather than structural equality.
 *
 * @example Type Level
 * ```typescript
 * type T = Ts.Test.equiv<string, string>      // ✓ Pass
 * type T = Ts.Test.equiv<string & {}, string> // ✓ Pass (mutually assignable)
 * type T = Ts.Test.equiv<1 | 2, 2 | 1>        // ✓ Pass (same computed type)
 * ```
 *
 * @example Value Level
 * ```typescript
 * Ts.Test.equiv.is<string>()(value)  // Must use .is for identity
 * ```
 */
export type equiv<$Expected, $Actual> = Apply<EquivKind, [$Expected, $Actual]>

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Equiv Extractors (Type Level)
//
//
//
//

/**
 * Equiv relation extractors - compose with the base equiv relation.
 *
 * All extractors are defined as type aliases using HKT composition.
 * Extractors are reused from exact - only the relation kind changes.
 */
export namespace equiv {
  //
  // ━━━ Identity ━━━
  //

  /**
   * Identity extractor - alias for plain equiv check.
   */
  export type is<$Expected, $Actual> = equiv<$Expected, $Actual>

  //
  // ━━━ Special Type Extractors ━━━
  //

  /**
   * Assert that a type is equivalent to `never`.
   */
  export type Never<$Actual> = ComposeRelationMatcher<EquivKind, NeverMatcher, $Actual>

  /**
   * Assert that a type is equivalent to `any`.
   */
  export type Any<$Actual> = ComposeRelationMatcher<EquivKind, AnyMatcher, $Actual>

  /**
   * Assert that a type is equivalent to `unknown`.
   */
  export type Unknown<$Actual> = ComposeRelationMatcher<EquivKind, UnknownMatcher, $Actual>

  /**
   * Assert that a type is an empty value.
   */
  export type empty<$Actual> = Apply<
    EquivKind,
    [
      true,
      Apply<EmptyMatcher, [$Actual]>,
    ]
  >

  //
  // ━━━ Container Extractors ━━━
  //

  /**
   * Assert that a type is equivalent to an array with specific element type.
   */
  export type array<$Element, $Actual> = Apply<EquivKind, [$Element[], $Actual]>

  /**
   * Assert that a type is equivalent to a tuple.
   */
  export type tuple<$Expected extends readonly any[], $Actual extends readonly any[]> = Apply<
    EquivKind,
    [$Expected, $Actual]
  >

  //
  // ━━━ Transformation Extractors (Chainable) ━━━
  //

  /**
   * Awaited extractor - checks the resolved type is equivalent.
   */
  export type awaited<$Expected, $Actual> = ComposeRelationExtractor<
    EquivKind,
    AwaitedExtractor,
    $Expected,
    $Actual
  >

  export namespace awaited {
    export type is<$Expected, $Actual> = equiv.awaited<$Expected, $Actual>

    export type array<$Element, $Actual> = Apply<
      EquivKind,
      [$Element[], Awaited<$Actual>]
    >

    export type indexed<
      $Index extends number,
      $Expected,
      $Actual,
    > = Awaited<$Actual> extends infer __Awaited__
      ? __Awaited__ extends readonly any[] ? Apply<EquivKind, [$Expected, __Awaited__[$Index]]>
      : never
      : never
  }

  /**
   * Returned extractor - checks the return type is equivalent.
   */
  export type returned<$Expected, $Actual> = ComposeRelationExtractor<
    EquivKind,
    ReturnedExtractor,
    $Expected,
    $Actual
  >

  export namespace returned {
    export type is<$Expected, $Actual> = equiv.returned<$Expected, $Actual>

    export type awaited<$Expected, $Actual> = Apply<
      EquivKind,
      [$Expected, ComposeExtractors<ReturnedExtractor, AwaitedExtractor, $Actual>]
    >

    export type array<
      $Element,
      $Actual extends (...args: any[]) => any,
    > = Apply<
      EquivKind,
      [$Element[], ReturnType<$Actual>]
    >

    export type indexed<
      $Index extends number,
      $Expected,
      $Actual extends (...args: any[]) => any,
    > = ReturnType<$Actual> extends infer __Returned__
      ? __Returned__ extends readonly any[] ? Apply<EquivKind, [$Expected, __Returned__[$Index]]>
      : never
      : never
  }

  /**
   * Indexed extractor - checks specific element is equivalent.
   */
  export type indexed<$Index extends number, $Expected, $Actual> = ComposeRelationParameterizedExtractor<
    EquivKind,
    IndexedExtractor,
    $Index,
    $Expected,
    $Actual
  >

  //
  // ━━━ Function Extractors ━━━
  //

  export type parameter<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
    EquivKind,
    ParameterExtractor,
    0,
    $Expected,
    $Actual
  >

  export type parameter1<$Expected, $Actual> = equiv.parameter<$Expected, $Actual>

  export type parameter2<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
    EquivKind,
    ParameterExtractor,
    1,
    $Expected,
    $Actual
  >

  export type parameter3<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
    EquivKind,
    ParameterExtractor,
    2,
    $Expected,
    $Actual
  >

  export type parameter4<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
    EquivKind,
    ParameterExtractor,
    3,
    $Expected,
    $Actual
  >

  export type parameter5<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
    EquivKind,
    ParameterExtractor,
    4,
    $Expected,
    $Actual
  >

  export type parameters<$Expected extends readonly any[], $Actual> = ComposeRelationExtractor<
    EquivKind,
    ParametersExtractor,
    $Expected,
    $Actual
  >

  //
  // ━━━ Object Extractors ━━━
  //

  export type properties<$Props extends object, $Actual> = ComposeRelationExtractor<
    EquivKind,
    PropertiesExtractor,
    $Props,
    $Actual
  >

  //
  // ━━━ Modifier Extractors ━━━
  //

  /**
   * Assert that two types are equivalent (mutually assignable) AND $Actual has no excess properties.
   *
   * **Use case**: Catching optional property typos in mutually assignable types.
   *
   * Two types can be mutually assignable even when one has optional properties the other lacks.
   * This assertion rejects such cases to catch configuration typos and deprecated fields.
   *
   * @example
   * ```typescript
   * type UserSchema = {
   *   id: number
   *   name: string
   *   email?: string  // valid optional
   * }
   *
   * type Response = {
   *   id: number
   *   name: string
   *   emial?: string  // TYPO! Should be 'email'
   * }
   *
   * // Both are mutually assignable (optional props don't break assignability)
   * Ts.Test.equiv<UserSchema, Response>          // ✓ PASS (misses typo!)
   *
   * // But noExcess catches the extra property
   * Ts.Test.equiv.noExcess<UserSchema, Response> // ✗ FAIL (catches typo!)
   * ```
   *
   * **Note**: For most config validation, use `sub.noExcess` instead.
   * `equiv.noExcess` is specifically for catching optional property issues in mutually assignable types.
   */
  export type noExcess<$Expected, $Actual> = Apply<
    NoExcessModifier,
    [
      Apply<EquivKind, [$Expected, $Actual]>,
      $Expected,
      $Actual,
    ]
  >
}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Equiv Extractors (Value Level)
//
//
//
//

/**
 * Equiv relation at value level - namespace-only (not callable).
 */
export namespace equiv {
  //
  // ━━━ Identity ━━━
  //

  export const is: AssertionFn<EquivKind> = runtime

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
