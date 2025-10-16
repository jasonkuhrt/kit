import type { Apply } from '../../kind.js'
import type { Relation } from '../../relation.js'
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
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Negated Relation Kinds
//
//
//
//

/**
 * NotExact kind - checks that types are NOT exactly equal.
 */
interface NotExactKind {
  parameters: [$A: unknown, $B: unknown]
  // dprint-ignore
  return:
    Relation.IsExact<this['parameters'][0], this['parameters'][1]> extends true
      ? StaticErrorAssertion<
          'Types are exactly equal but should not be',
          this['parameters'][0],
          this['parameters'][1]
        >
      : never
}

/**
 * NotEquiv kind - checks that types are NOT mutually assignable.
 */
interface NotEquivKind {
  parameters: [$A: unknown, $B: unknown]
  // dprint-ignore
  return:
    Relation.GetRelation<this['parameters'][0], this['parameters'][1]> extends Relation.equivalent
      ? StaticErrorAssertion<
          'Types are equivalent (mutually assignable) but should not be',
          this['parameters'][0],
          this['parameters'][1]
        >
      : never
}

/**
 * NotSub kind - checks that type does NOT extend another.
 */
interface NotSubKind {
  parameters: [$A: unknown, $B: unknown]
  // dprint-ignore
  return:
    this['parameters'][1] extends this['parameters'][0]
      ? StaticErrorAssertion<
          'Type extends the type it should not extend',
          this['parameters'][0],
          this['parameters'][1]
        >
      : never
}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Not Namespace
//
//
//
//

/**
 * Negation namespace - mirrors exact, equiv, and sub with negated checks.
 *
 * All positive assertions have negated counterparts:
 * - `not.exact.*` - negates exact checks
 * - `not.equiv.*` - negates equiv checks
 * - `not.sub.*` - negates sub checks
 *
 * @example
 * ```typescript
 * type T = Ts.Test.not.exact<string, number>           // ✓ Pass
 * type T = Ts.Test.not.sub.awaited<X, Promise<Y>>      // ✓ Pass if Y doesn't extend X
 * Ts.Test.not.exact.returned.awaited<X>()(fn)          // Value level
 * ```
 */
export namespace not {
  //
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • not.exact
  //
  //

  export type exact<$A, $B> = Apply<NotExactKind, [$A, $B]>

  export namespace exact {
    export type is<$A, $B> = not.exact<$A, $B>

    // Special types
    export type Never<$Actual> = ComposeRelationMatcher<NotExactKind, NeverMatcher, $Actual>
    export type Any<$Actual> = ComposeRelationMatcher<NotExactKind, AnyMatcher, $Actual>
    export type Unknown<$Actual> = ComposeRelationMatcher<NotExactKind, UnknownMatcher, $Actual>
    export type empty<$Actual> = Apply<NotExactKind, [true, Apply<EmptyMatcher, [$Actual]>]>

    // Containers
    export type array<$Element, $Actual> = Apply<NotExactKind, [$Element[], $Actual]>
    export type tuple<$Expected extends readonly any[], $Actual extends readonly any[]> = Apply<
      NotExactKind,
      [$Expected, $Actual]
    >

    // Transformations
    export type awaited<$Expected, $Actual> = ComposeRelationExtractor<
      NotExactKind,
      AwaitedExtractor,
      $Expected,
      $Actual
    >

    export namespace awaited {
      export type is<$Expected, $Actual> = not.exact.awaited<$Expected, $Actual>
      export type array<$Element, $Actual> = Apply<NotExactKind, [$Element[], Awaited<$Actual>]>
      export type indexed<$Index extends number, $Expected, $Actual> = Awaited<$Actual> extends infer __Awaited__
        ? __Awaited__ extends readonly any[] ? Apply<NotExactKind, [$Expected, __Awaited__[$Index]]>
        : never
        : never
    }

    export type returned<$Expected, $Actual> = ComposeRelationExtractor<
      NotExactKind,
      ReturnedExtractor,
      $Expected,
      $Actual
    >

    export namespace returned {
      export type is<$Expected, $Actual> = not.exact.returned<$Expected, $Actual>
      export type awaited<$Expected, $Actual> = Apply<
        NotExactKind,
        [$Expected, ComposeExtractors<ReturnedExtractor, AwaitedExtractor, $Actual>]
      >
      export type array<$Element, $Actual extends (...args: any[]) => any> = Apply<
        NotExactKind,
        [$Element[], ReturnType<$Actual>]
      >
      export type indexed<
        $Index extends number,
        $Expected,
        $Actual extends (...args: any[]) => any,
      > = ReturnType<$Actual> extends infer __Returned__
        ? __Returned__ extends readonly any[] ? Apply<NotExactKind, [$Expected, __Returned__[$Index]]>
        : never
        : never
    }

    export type indexed<$Index extends number, $Expected, $Actual> = ComposeRelationParameterizedExtractor<
      NotExactKind,
      IndexedExtractor,
      $Index,
      $Expected,
      $Actual
    >

    // Functions
    export type parameter<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
      NotExactKind,
      ParameterExtractor,
      0,
      $Expected,
      $Actual
    >
    export type parameter1<$Expected, $Actual> = not.exact.parameter<$Expected, $Actual>
    export type parameter2<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
      NotExactKind,
      ParameterExtractor,
      1,
      $Expected,
      $Actual
    >
    export type parameter3<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
      NotExactKind,
      ParameterExtractor,
      2,
      $Expected,
      $Actual
    >
    export type parameter4<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
      NotExactKind,
      ParameterExtractor,
      3,
      $Expected,
      $Actual
    >
    export type parameter5<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
      NotExactKind,
      ParameterExtractor,
      4,
      $Expected,
      $Actual
    >
    export type parameters<$Expected extends readonly any[], $Actual> = ComposeRelationExtractor<
      NotExactKind,
      ParametersExtractor,
      $Expected,
      $Actual
    >

    // Objects
    export type properties<$Props extends object, $Actual> = ComposeRelationExtractor<
      NotExactKind,
      PropertiesExtractor,
      $Props,
      $Actual
    >
  }

  //
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • not.equiv
  //
  //

  export type equiv<$A, $B> = Apply<NotEquivKind, [$A, $B]>

  export namespace equiv {
    export type is<$A, $B> = not.equiv<$A, $B>

    // Special types
    export type Never<$Actual> = ComposeRelationMatcher<NotEquivKind, NeverMatcher, $Actual>
    export type Any<$Actual> = ComposeRelationMatcher<NotEquivKind, AnyMatcher, $Actual>
    export type Unknown<$Actual> = ComposeRelationMatcher<NotEquivKind, UnknownMatcher, $Actual>
    export type empty<$Actual> = Apply<NotEquivKind, [true, Apply<EmptyMatcher, [$Actual]>]>

    // Containers
    export type array<$Element, $Actual> = Apply<NotEquivKind, [$Element[], $Actual]>
    export type tuple<$Expected extends readonly any[], $Actual extends readonly any[]> = Apply<
      NotEquivKind,
      [$Expected, $Actual]
    >

    // Transformations
    export type awaited<$Expected, $Actual> = ComposeRelationExtractor<
      NotEquivKind,
      AwaitedExtractor,
      $Expected,
      $Actual
    >

    export namespace awaited {
      export type is<$Expected, $Actual> = not.equiv.awaited<$Expected, $Actual>
      export type array<$Element, $Actual> = Apply<NotEquivKind, [$Element[], Awaited<$Actual>]>
      export type indexed<$Index extends number, $Expected, $Actual> = Awaited<$Actual> extends infer __Awaited__
        ? __Awaited__ extends readonly any[] ? Apply<NotEquivKind, [$Expected, __Awaited__[$Index]]>
        : never
        : never
    }

    export type returned<$Expected, $Actual> = ComposeRelationExtractor<
      NotEquivKind,
      ReturnedExtractor,
      $Expected,
      $Actual
    >

    export namespace returned {
      export type is<$Expected, $Actual> = not.equiv.returned<$Expected, $Actual>
      export type awaited<$Expected, $Actual> = Apply<
        NotEquivKind,
        [$Expected, ComposeExtractors<ReturnedExtractor, AwaitedExtractor, $Actual>]
      >
      export type array<$Element, $Actual extends (...args: any[]) => any> = Apply<
        NotEquivKind,
        [$Element[], ReturnType<$Actual>]
      >
      export type indexed<
        $Index extends number,
        $Expected,
        $Actual extends (...args: any[]) => any,
      > = ReturnType<$Actual> extends infer __Returned__
        ? __Returned__ extends readonly any[] ? Apply<NotEquivKind, [$Expected, __Returned__[$Index]]>
        : never
        : never
    }

    export type indexed<$Index extends number, $Expected, $Actual> = ComposeRelationParameterizedExtractor<
      NotEquivKind,
      IndexedExtractor,
      $Index,
      $Expected,
      $Actual
    >

    // Functions
    export type parameter<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
      NotEquivKind,
      ParameterExtractor,
      0,
      $Expected,
      $Actual
    >
    export type parameter1<$Expected, $Actual> = not.equiv.parameter<$Expected, $Actual>
    export type parameter2<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
      NotEquivKind,
      ParameterExtractor,
      1,
      $Expected,
      $Actual
    >
    export type parameter3<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
      NotEquivKind,
      ParameterExtractor,
      2,
      $Expected,
      $Actual
    >
    export type parameter4<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
      NotEquivKind,
      ParameterExtractor,
      3,
      $Expected,
      $Actual
    >
    export type parameter5<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
      NotEquivKind,
      ParameterExtractor,
      4,
      $Expected,
      $Actual
    >
    export type parameters<$Expected extends readonly any[], $Actual> = ComposeRelationExtractor<
      NotEquivKind,
      ParametersExtractor,
      $Expected,
      $Actual
    >

    // Objects
    export type properties<$Props extends object, $Actual> = ComposeRelationExtractor<
      NotEquivKind,
      PropertiesExtractor,
      $Props,
      $Actual
    >
  }

  //
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • not.sub
  //
  //

  export type sub<$A, $B> = Apply<NotSubKind, [$A, $B]>

  export namespace sub {
    export type is<$A, $B> = not.sub<$A, $B>

    // Special types
    export type Never<$Actual> = ComposeRelationMatcher<NotSubKind, NeverMatcher, $Actual>
    export type Any<$Actual> = ComposeRelationMatcher<NotSubKind, AnyMatcher, $Actual>
    export type Unknown<$Actual> = ComposeRelationMatcher<NotSubKind, UnknownMatcher, $Actual>
    export type empty<$Actual> = Apply<NotSubKind, [true, Apply<EmptyMatcher, [$Actual]>]>

    // Containers
    export type array<$Element, $Actual> = Apply<NotSubKind, [$Element[], $Actual]>
    export type tuple<$Expected extends readonly any[], $Actual extends readonly any[]> = Apply<
      NotSubKind,
      [$Expected, $Actual]
    >

    // Transformations
    export type awaited<$Expected, $Actual> = ComposeRelationExtractor<
      NotSubKind,
      AwaitedExtractor,
      $Expected,
      $Actual
    >

    export namespace awaited {
      export type is<$Expected, $Actual> = not.sub.awaited<$Expected, $Actual>
      export type array<$Element, $Actual> = Apply<NotSubKind, [$Element[], Awaited<$Actual>]>
      export type indexed<$Index extends number, $Expected, $Actual> = Awaited<$Actual> extends infer __Awaited__
        ? __Awaited__ extends readonly any[] ? Apply<NotSubKind, [$Expected, __Awaited__[$Index]]>
        : never
        : never
    }

    export type returned<$Expected, $Actual> = ComposeRelationExtractor<
      NotSubKind,
      ReturnedExtractor,
      $Expected,
      $Actual
    >

    export namespace returned {
      export type is<$Expected, $Actual> = not.sub.returned<$Expected, $Actual>
      export type awaited<$Expected, $Actual> = Apply<
        NotSubKind,
        [$Expected, ComposeExtractors<ReturnedExtractor, AwaitedExtractor, $Actual>]
      >
      export type array<$Element, $Actual extends (...args: any[]) => any> = Apply<
        NotSubKind,
        [$Element[], ReturnType<$Actual>]
      >
      export type indexed<
        $Index extends number,
        $Expected,
        $Actual extends (...args: any[]) => any,
      > = ReturnType<$Actual> extends infer __Returned__
        ? __Returned__ extends readonly any[] ? Apply<NotSubKind, [$Expected, __Returned__[$Index]]>
        : never
        : never
    }

    export type indexed<$Index extends number, $Expected, $Actual> = ComposeRelationParameterizedExtractor<
      NotSubKind,
      IndexedExtractor,
      $Index,
      $Expected,
      $Actual
    >

    // Functions
    export type parameter<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
      NotSubKind,
      ParameterExtractor,
      0,
      $Expected,
      $Actual
    >
    export type parameter1<$Expected, $Actual> = not.sub.parameter<$Expected, $Actual>
    export type parameter2<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
      NotSubKind,
      ParameterExtractor,
      1,
      $Expected,
      $Actual
    >
    export type parameter3<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
      NotSubKind,
      ParameterExtractor,
      2,
      $Expected,
      $Actual
    >
    export type parameter4<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
      NotSubKind,
      ParameterExtractor,
      3,
      $Expected,
      $Actual
    >
    export type parameter5<$Expected, $Actual> = ComposeRelationParameterizedExtractor<
      NotSubKind,
      ParameterExtractor,
      4,
      $Expected,
      $Actual
    >
    export type parameters<$Expected extends readonly any[], $Actual> = ComposeRelationExtractor<
      NotSubKind,
      ParametersExtractor,
      $Expected,
      $Actual
    >

    // Objects
    export type properties<$Props extends object, $Actual> = ComposeRelationExtractor<
      NotSubKind,
      PropertiesExtractor,
      $Props,
      $Actual
    >
  }
}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Value Level
//
//
//
//

/**
 * Value-level negation - mirrors type-level structure.
 */
export namespace not {
  export namespace exact {
    export const is: AssertionFn<NotExactKind> = runtime
    export const never: UnaryAssertionFn<any> = runtimeUnary
    export const any: UnaryAssertionFn<any> = runtimeUnary
    export const unknown: UnaryAssertionFn<any> = runtimeUnary
    export const empty: UnaryAssertionFn<any> = runtimeUnary
    export const array: AssertionFn<any> = runtime
    export const tuple: AssertionFn<any> = runtime

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
    export const parameter: AssertionFn<any> = runtime
    export const parameter1: AssertionFn<any> = runtime
    export const parameter2: AssertionFn<any> = runtime
    export const parameter3: AssertionFn<any> = runtime
    export const parameter4: AssertionFn<any> = runtime
    export const parameter5: AssertionFn<any> = runtime
    export const parameters: AssertionFn<any> = runtime
    export const properties: AssertionFn<any> = runtime
  }

  export namespace equiv {
    export const is: AssertionFn<NotEquivKind> = runtime
    export const never: UnaryAssertionFn<any> = runtimeUnary
    export const any: UnaryAssertionFn<any> = runtimeUnary
    export const unknown: UnaryAssertionFn<any> = runtimeUnary
    export const empty: UnaryAssertionFn<any> = runtimeUnary
    export const array: AssertionFn<any> = runtime
    export const tuple: AssertionFn<any> = runtime

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
    export const parameter: AssertionFn<any> = runtime
    export const parameter1: AssertionFn<any> = runtime
    export const parameter2: AssertionFn<any> = runtime
    export const parameter3: AssertionFn<any> = runtime
    export const parameter4: AssertionFn<any> = runtime
    export const parameter5: AssertionFn<any> = runtime
    export const parameters: AssertionFn<any> = runtime
    export const properties: AssertionFn<any> = runtime
  }

  export namespace sub {
    export const is: AssertionFn<NotSubKind> = runtime
    export const never: UnaryAssertionFn<any> = runtimeUnary
    export const any: UnaryAssertionFn<any> = runtimeUnary
    export const unknown: UnaryAssertionFn<any> = runtimeUnary
    export const empty: UnaryAssertionFn<any> = runtimeUnary
    export const array: AssertionFn<any> = runtime
    export const tuple: AssertionFn<any> = runtime

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
    export const parameter: AssertionFn<any> = runtime
    export const parameter1: AssertionFn<any> = runtime
    export const parameter2: AssertionFn<any> = runtime
    export const parameter3: AssertionFn<any> = runtime
    export const parameter4: AssertionFn<any> = runtime
    export const parameter5: AssertionFn<any> = runtime
    export const parameters: AssertionFn<any> = runtime
    export const properties: AssertionFn<any> = runtime
  }
}
