import * as Constructors from './constructors.js'

/**
 * Input types for law selection in trait definitions.
 *
 * When defining a trait, you can specify which algebraic laws
 * its methods should satisfy by setting these flags to true.
 *
 * Note: The JSDoc on the Select interface properties is a subset of
 * what is found in constructors.ts. The full JSDoc standards specification
 * can be found in that module. Each property here includes only the
 * introduction and practical information, omitting parameter details.
 */

/**
 * All available algebraic laws that can be applied to trait methods.
 * Each law represents a mathematical property that implementations must satisfy.
 */
export interface Select {
  // Equality laws
  /**
   * Reflexivity law: Every value must equal itself (a == a).
   * Essential for hash tables, cache lookups, and set membership tests.
   * Examples: string equality ("hello" === "hello"), number equality (42 === 42)
   */
  reflexivity?: boolean
  /**
   * Symmetry law: Equality must be bidirectional - if a == b then b == a.
   * Prevents order-dependent bugs in comparisons and ensures consistent sorting.
   * Examples: case-insensitive comparison, set equality, coordinate comparison
   */
  symmetry?: boolean
  /**
   * Transitivity law: Equality must chain - if a == b and b == c then a == c.
   * Enables equivalence classes and optimization through equality caching.
   * Examples: URL redirects, type compatibility, timezone offset equality
   */
  transitivity?: boolean

  // Ordering laws
  /**
   * Ordering reflexivity: Every value compares equal to itself (compare(a, a) === 0).
   * Prevents infinite loops in sorting and ensures stable behavior with duplicates.
   * Examples: locale string comparison, version comparison, date comparison
   */
  orderingReflexivity?: boolean
  /**
   * Antisymmetry law: If a <= b and b <= a, then a == b.
   * Prevents paradoxical orderings and ensures consistent hierarchies.
   * Examples: priority comparison, semantic versioning, access level comparison
   */
  antisymmetry?: boolean
  /**
   * Ordering transitivity: If a <= b and b <= c, then a <= c.
   * Enables efficient sorting and range queries without comparing all pairs.
   * Examples: file path depth, employee hierarchy, chronological ordering
   */
  orderingTransitivity?: boolean
  /**
   * Totality law: Any two values must be comparable (return -1, 0, or 1).
   * Guarantees deterministic sorting and prevents "comparison violates contract" errors.
   * Examples: numeric comparison, lexicographic ordering, timestamp comparison
   */
  totality?: boolean

  // Semigroup laws
  /**
   * Associativity law: Grouping doesn't matter - (a + b) + c == a + (b + c).
   * Enables parallel computation and breaking complex operations into steps.
   * Examples: string concatenation, array concatenation, Math.max operations
   */
  associativity?: boolean

  // Monoid laws
  /**
   * Left identity: Combining identity on the left returns original value (empty + a == a).
   * Provides safe initialization for reduce operations and default values.
   * Examples: 0 + n, "" + str, [] ++ array
   */
  leftIdentity?: boolean
  /**
   * Right identity: Combining identity on the right returns original value (a + empty == a).
   * Ensures consistent behavior in builder patterns and fluent interfaces.
   * Examples: n * 1, obj merge {}, compose(fn, identity)
   */
  rightIdentity?: boolean

  // Functor laws
  /**
   * Functor identity: Mapping with identity function preserves structure (map(fa, x => x) == fa).
   * Guarantees map operations have no hidden side effects.
   * Examples: array.map(x => x), optional.map(x => x), tree node mapping
   */
  functorIdentity?: boolean
  /**
   * Functor composition: Two maps can be fused - map(map(fa, f), g) == map(fa, x => g(f(x))).
   * Enables optimization by reducing iteration overhead in transformation chains.
   * Examples: array.map(f).map(g), promise.then(f).then(g), stream transformations
   */
  functorComposition?: boolean
}

/**
 * Extract law names as a union type
 */
export type Name = keyof Select

/**
 * Law constructor type - a function that takes a method and returns a property generator
 */
export type LawConstructor = (method: any) => (arb: any) => any

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Method Select
//
//

/**
 * Map user-provided law flags to law constructors.
 *
 * @param methodLaws - Law selections for a specific method
 * @returns Record of law names to constructor functions
 */
export const resolveMethodSelect = (methodLaws: Select): Record<string, LawConstructor> => {
  const constructors: Record<string, LawConstructor> = {}

  for (const [lawName, isApplicable] of Object.entries(methodLaws) as [Name, boolean | undefined][]) {
    if (isApplicable) {
      const lawConstructor = Constructors[lawName as keyof typeof Constructors]
      if (typeof lawConstructor === 'function') {
        constructors[lawName] = lawConstructor as any
      }
    }
  }

  return constructors
}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Trait Select
//
//

/**
 * Type for selecting laws for all methods in a trait.
 * Maps method names to their law selections.
 */
export type TraitSelect = {
  [methodName: string]: Select
}

/**
 * Type for resolved trait laws.
 * Maps method names to their law constructors.
 */
export type TraitSelectResolved = {
  [methodName: string]: Record<string, LawConstructor>
}

/**
 * Resolve law selections for an entire trait.
 *
 * @param traitLaws - Law selections for all methods in a trait
 * @returns Resolved law constructors for all methods
 */
export const resolveTraitSelect = (traitLaws: TraitSelect): TraitSelectResolved => {
  const resolved: TraitSelectResolved = {}

  for (const [methodName, methodLaws] of Object.entries(traitLaws)) {
    if (methodLaws) {
      resolved[methodName] = resolveMethodSelect(methodLaws)
    }
  }

  return resolved
}
