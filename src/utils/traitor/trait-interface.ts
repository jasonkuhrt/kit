/**
 * Private symbol for storing trait metadata.
 * This symbol is not exported, making it inaccessible outside this module.
 */
declare const TRAIT_META: unique symbol

/**
 * Metadata stored on each trait interface.
 */
interface TraitMetadata<$Internal, $Deps extends ReadonlyArray<keyof TRAITOR_TRAITS>> {
  internal: $Internal
  deps: $Deps
}

/**
 * Base interface for all traits in the Traitor system.
 *
 * Traits extend this interface to define both internal (implementation-facing)
 * and external (user-facing) types, along with their dependencies.
 * All metadata is hidden behind a private symbol, making traits appear as
 * their external interface directly.
 *
 * @template $Deps - Array of trait names this trait depends on
 * @template $External - The external interface for users
 * @template $Internal - The internal interface for implementations
 *
 * @example
 * ```ts
 * interface Eq<$Type = unknown> extends Traitor.Definition<
 *   ['Type'], // Dependencies
 *   { // External - rich types for users
 *     is<a extends $Type, b = a>(a: a, b: ValidateComparable<a, b>): boolean
 *     isOn<a extends $Type>(a: a): <b = a>(b: ValidateComparable<a, b>) => boolean
 *   },
 *   { // Internal - simple types for implementations
 *     is(a: $Type, b: $Type): boolean
 *   }
 * > {}
 * ```
 */
export type Definition<
  $Deps extends ReadonlyArray<keyof TRAITOR_TRAITS> = [],
  $External = any,
  $Internal = $External,
> = $External & {
  [TRAIT_META]: TraitMetadata<$Internal, $Deps>
}

/**
 * Legacy type for backward compatibility.
 * @deprecated Use Definition instead
 */
export type TraitInterface<$External = any, $Internal = $External> = Definition<[], $External, $Internal>

/**
 * Helper type to create a trait definition with internal and external interfaces.
 *
 * @example
 * ```ts
 * export interface Eq extends Traitor.Trait<{
 *   internal: EqInternal
 *   external: EqExternal
 * }> {}
 * ```
 */
export type Trait<T extends { internal?: any; external: any }> = Definition<
  [],
  T['external'],
  T['internal'] extends undefined ? T['external'] : T['internal']
>

/**
 * Extract the internal interface from a trait.
 * This requires access to the private symbol.
 */
export type GetInternal<T> = T extends { [TRAIT_META]: infer Meta }
  ? Meta extends TraitMetadata<infer $Internal, any> ? $Internal
  : never
  : never

/**
 * Extract the dependencies from a trait.
 */
export type GetDeps<T> = T extends { [TRAIT_META]: infer Meta } ? Meta extends TraitMetadata<any, infer $Deps> ? $Deps
  : []
  : []

/**
 * Extract the external interface from a trait.
 * Since traits ARE their external interface, we just return T.
 * @deprecated Traits are their external interface directly, no extraction needed
 */
export type GetExternal<T> = T

/**
 * Base implementation pattern for traits.
 * Takes a domain proxy and self-reference, returns partial trait implementation.
 */
export type TraitBase<$TraitInterface> = (
  domain: GetInternal<$TraitInterface>,
  self: GetInternal<$TraitInterface>,
) => Partial<GetInternal<$TraitInterface>>
