/**
 * A domain's implementation of a trait.
 *
 * Intentionally loose type as implementations may include:
 * - Methods (the primary use case)
 * - Properties for trait-specific metadata
 * - Nested namespaces for complex traits
 *
 * The trait system itself will provide stricter typing.
 */
export type Implementation = Record<string, any>

/**
 * Name of a domain (e.g., 'Arr', 'Str', 'Num').
 * Domains represent data types that can implement traits.
 */
export type DomainName = string

/**
 * Name of a trait (e.g., 'Eq', 'Ord', 'Show').
 * Traits define polymorphic interfaces across domains.
 */
export type TraitName = string

// /**
//  * Base type for trait interfaces.
//  *
//  * All trait interfaces must extend object to work with the proxy-based
//  * dispatch system. This constraint ensures traits can only define methods
//  * and properties, not primitive values.
//  */
// export type TraitInterface = object

/**
 * Name of a method within a trait (e.g., 'is', 'compare').
 */
export type MethodName = string

/**
 * Generic method signature for trait methods.
 * Used for type constraints when more specific types aren't known.
 */
export interface Method<Args extends any[] = any[], Return = any> {
  (...args: Args): Return
}

/**
 * Domain definition for trait implementations.
 *
 * @template $Type - The type this domain represents
 * @template $Name - The literal name of the domain (e.g., 'Str', 'Arr')
 */
export interface Domain<$Type, $Name extends string = string> {
  name: $Name
  _type: $Type
}
