import type { Apply, Kind } from '../../kind.js'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • HKT Composition Utilities
//
//
//
//

/**
 * Compose a relation kind with an extractor kind.
 *
 * This is the core composition pattern that enables DRY implementation.
 * Instead of duplicating logic for each relation, we define extractors once
 * and compose them with any relation.
 *
 * @example
 * ```typescript
 * // Define extractor once
 * interface AwaitedExtractor {
 *   parameters: [$Actual]
 *   return: Awaited<this['parameters'][0]>
 * }
 *
 * // Reuse with all relations
 * type exact.awaited<$E, $A> = ComposeRelationExtractor<ExactKind, AwaitedExtractor, $E, $A>
 * type equiv.awaited<$E, $A> = ComposeRelationExtractor<EquivKind, AwaitedExtractor, $E, $A>
 * type sub.awaited<$E, $A> = ComposeRelationExtractor<SubKind, AwaitedExtractor, $E, $A>
 * ```
 *
 * @param $RelationKind - The relation kind to use (ExactKind, EquivKind, SubKind)
 * @param $ExtractorKind - The extractor kind that transforms $Actual
 * @param $Expected - The expected type to compare against
 * @param $Actual - The actual type to extract from and check
 * @returns The result of applying the relation to ($Expected, Extracted<$Actual>)
 */
export type ComposeRelationExtractor<
  $RelationKind extends Kind,
  $ExtractorKind extends Kind,
  $Expected,
  $Actual,
> = Apply<
  $RelationKind,
  [$Expected, Apply<$ExtractorKind, [$Actual]>]
>

/**
 * Compose two extractors sequentially (for chaining).
 *
 * Applies the first extractor, then applies the second extractor to the result.
 * This enables chained assertions like `.returned.awaited`.
 *
 * @example
 * ```typescript
 * // Chain two extractors
 * type ReturnedAwaited<$Actual> = ComposeExtractors<
 *   ReturnedExtractor,  // First: extract return type
 *   AwaitedExtractor,   // Then: await the result
 *   $Actual
 * >
 *
 * // Usage in relation
 * type exact.returned.awaited<$E, $A> = Apply<
 *   ExactKind,
 *   [$E, ComposeExtractors<ReturnedExtractor, AwaitedExtractor, $A>]
 * >
 * ```
 *
 * @param $Extractor1 - First extractor to apply
 * @param $Extractor2 - Second extractor to apply to result of first
 * @param $Actual - The actual type to extract from
 * @returns The result of applying both extractors sequentially
 */
export type ComposeExtractors<
  $Extractor1 extends Kind,
  $Extractor2 extends Kind,
  $Actual,
> = Apply<
  $Extractor2,
  [Apply<$Extractor1, [$Actual]>]
>

/**
 * Compose a relation kind with a matcher kind (for special types).
 *
 * Matchers don't extract from $Actual - they provide a specific type to compare against.
 * Used for assertions like `.never`, `.any`, `.unknown`.
 *
 * @example
 * ```typescript
 * // Define matcher once
 * interface NeverMatcher {
 *   parameters: []
 *   return: never
 * }
 *
 * // Reuse with all relations
 * type exact.never<$A> = ComposeRelationMatcher<ExactKind, NeverMatcher, $A>
 * type equiv.never<$A> = ComposeRelationMatcher<EquivKind, NeverMatcher, $A>
 * type sub.never<$A> = ComposeRelationMatcher<SubKind, NeverMatcher, $A>
 * ```
 *
 * @param $RelationKind - The relation kind to use
 * @param $MatcherKind - The matcher kind that provides expected type
 * @param $Actual - The actual type to check
 * @returns The result of applying the relation to (MatchedType, $Actual)
 */
export type ComposeRelationMatcher<
  $RelationKind extends Kind,
  $MatcherKind extends Kind,
  $Actual,
> = Apply<
  $RelationKind,
  [Apply<$MatcherKind, []>, $Actual]
>

/**
 * Compose a relation with an extractor that takes additional parameters.
 *
 * Some extractors need extra parameters (e.g., IndexedExtractor needs an index).
 * This composer handles that case.
 *
 * @example
 * ```typescript
 * // Extractor with parameter
 * interface IndexedExtractor {
 *   parameters: [$Index: number, $Actual: any]
 *   return: this['parameters'][1][this['parameters'][0]]
 * }
 *
 * // Compose with relation
 * type exact.indexed<$Index, $Expected, $Actual> = ComposeRelationParameterizedExtractor<
 *   ExactKind,
 *   IndexedExtractor,
 *   $Index,
 *   $Expected,
 *   $Actual
 * >
 * ```
 *
 * @param $RelationKind - The relation kind to use
 * @param $ExtractorKind - The parameterized extractor kind
 * @param $ExtractorParam - Additional parameter for the extractor
 * @param $Expected - The expected type to compare against
 * @param $Actual - The actual type to extract from
 * @returns The result of applying the relation to extracted value
 */
export type ComposeRelationParameterizedExtractor<
  $RelationKind extends Kind,
  $ExtractorKind extends Kind,
  $ExtractorParam,
  $Expected,
  $Actual,
> = Apply<
  $RelationKind,
  [$Expected, Apply<$ExtractorKind, [$ExtractorParam, $Actual]>]
>

/**
 * Compose three extractors sequentially.
 *
 * For complex chaining scenarios (rare, but supported).
 *
 * @example
 * ```typescript
 * // Hypothetical: returned -> awaited -> indexed
 * type ChainedExtract<$Actual> = ComposeThreeExtractors<
 *   ReturnedExtractor,
 *   AwaitedExtractor,
 *   IndexedExtractor,
 *   $Actual
 * >
 * ```
 */
export type ComposeThreeExtractors<
  $Extractor1 extends Kind,
  $Extractor2 extends Kind,
  $Extractor3 extends Kind,
  $Actual,
> = Apply<
  $Extractor3,
  [Apply<$Extractor2, [Apply<$Extractor1, [$Actual]>]>]
>
