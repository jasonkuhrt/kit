import * as fc from 'fast-check'

/**
 * Well-known algebraic laws for trait implementations.
 *
 * These laws define mathematical properties that trait implementations must satisfy.
 * They are derived from abstract algebra and category theory.
 *
 * Laws are curried functions that first take the method being tested,
 * then return a function that takes an arbitrary and produces a property.
 *
 * Law JSDoc Standards:
 * 1. Introduction - What the law states mathematically
 * 2. Why it's useful - Practical benefits of this property
 * 3. Typical places you'd see this law in practice
 * 4. 3 different practical examples of functions that obey this law
 */

/**
 * Equality laws - for methods that compare two values for equality
 */

/**
 * Reflexivity law for equality operations.
 *
 * Introduction: States that every value must be equal to itself (a == a).
 * This is the most fundamental property of any equality relation.
 *
 * Why it's useful: Ensures that equality checks are internally consistent.
 * Without reflexivity, basic operations like finding an element in a list
 * or checking if a key exists in a map would fail unpredictably.
 *
 * Typical places: Database primary key comparisons, hash table lookups,
 * set membership tests, cache key matching, authentication token validation.
 *
 * Examples of functions that obey this law:
 * - String equality: "hello" === "hello" // always true
 * - Number equality: 42 === 42 // always true
 * - Deep object equality: deepEqual({a: 1}, {a: 1}) // true when same reference
 *
 * @param is - The equality function to test
 * @returns A function that creates a fast-check property for testing reflexivity
 */
export const reflexivity = <T>(
  is: (a: T, b: T) => boolean,
) =>
(arb: fc.Arbitrary<T>): fc.IProperty<[T]> => {
  return fc.property(arb, (a) => {
    return is(a, a) === true
  })
}

/**
 * Symmetry law for equality operations.
 *
 * Introduction: States that equality must be bidirectional - if a equals b,
 * then b must equal a. Order of comparison should never affect the result.
 *
 * Why it's useful: Prevents bugs where comparison logic accidentally depends
 * on argument order. Essential for reliable sorting algorithms, data deduplication,
 * and any operation that needs consistent equality semantics.
 *
 * Typical places: Database join conditions, React component prop comparison,
 * GraphQL field resolvers, test assertion libraries, caching systems.
 *
 * Examples of functions that obey this law:
 * - Case-insensitive string comparison: equalsIgnoreCase("Hello", "HELLO") === equalsIgnoreCase("HELLO", "Hello")
 * - Set equality: setEquals({1, 2, 3}, {3, 2, 1}) === setEquals({3, 2, 1}, {1, 2, 3})
 * - Coordinate comparison: pointEquals({x: 5, y: 10}, {x: 5, y: 10}) // same regardless of order
 *
 * @param is - The equality function to test
 * @returns A function that creates a fast-check property for testing symmetry
 */
export const symmetry = <T>(
  is: (a: T, b: T) => boolean,
) =>
(arb: fc.Arbitrary<T>): fc.IProperty<[T, T]> => {
  return fc.property(arb, arb, (a, b) => {
    return is(a, b) === is(b, a)
  })
}

/**
 * Transitivity law for equality operations.
 *
 * Introduction: States that equality must chain - if a equals b and b equals c,
 * then a must equal c. This creates a consistent equivalence relation.
 *
 * Why it's useful: Enables reasoning about equality chains and equivalence classes.
 * Critical for optimizations like equality caching, transitive dependency resolution,
 * and maintaining consistency in distributed systems.
 *
 * Typical places: Type system equivalence checks, network route optimization,
 * dependency version resolution, CSS selector matching, graph traversal algorithms.
 *
 * Examples of functions that obey this law:
 * - URI equivalence: if url1 redirects to url2, and url2 redirects to url3, then url1 ≈ url3
 * - Type compatibility: if TypeA extends TypeB, and TypeB extends TypeC, then TypeA is compatible with TypeC
 * - Time zone equality: if timezone1 has same offset as timezone2, and timezone2 as timezone3, then timezone1 ≈ timezone3
 *
 * @param is - The equality function to test
 * @returns A function that creates a fast-check property for testing transitivity
 */
export const transitivity = <T>(
  is: (a: T, b: T) => boolean,
) =>
(arb: fc.Arbitrary<T>): fc.IProperty<[T, T, T]> => {
  return fc.property(arb, arb, arb, (a, b, c) => {
    if (is(a, b) && is(b, c)) {
      return is(a, c) === true
    }
    return true // vacuously true when premise is false
  })
}

/**
 * Ordering laws - for methods that compare values for order
 */

/**
 * Ordering reflexivity law for comparison operations.
 *
 * Introduction: States that every value must compare equal to itself (a <= a and a >= a).
 * In three-way comparison, this means compare(a, a) must always return 0.
 *
 * Why it's useful: Ensures stable sorting algorithms don't infinite loop and that
 * ordered data structures (like binary search trees) can properly handle duplicates.
 * Essential for consistent behavior in priority queues and sorted collections.
 *
 * Typical places: Array.sort() implementations, database ORDER BY clauses,
 * binary search tree insertions, priority queue operations, leaderboard rankings.
 *
 * Examples of functions that obey this law:
 * - String locale comparison: localeCompare("café", "café") === 0
 * - Version comparison: compareVersion("1.2.3", "1.2.3") === 0
 * - Date comparison: compareDates(new Date(2024), new Date(2024)) === 0
 *
 * @param compare - The comparison function to test
 * @returns A function that creates a fast-check property for testing ordering reflexivity
 */
export const orderingReflexivity = <T>(
  compare: (a: T, b: T) => -1 | 0 | 1,
) =>
(arb: fc.Arbitrary<T>): fc.IProperty<[T]> => {
  return fc.property(arb, (a) => {
    return compare(a, a) === 0
  })
}

/**
 * Antisymmetry law for ordering operations.
 *
 * Introduction: States that if a <= b and b <= a, then a must equal b.
 * This ensures that the ordering relation creates a proper hierarchy without cycles.
 *
 * Why it's useful: Prevents paradoxical orderings where two distinct items could be
 * simultaneously "less than" each other. Critical for maintaining consistent sort
 * orders and preventing infinite loops in order-dependent algorithms.
 *
 * Typical places: Dependency resolution systems, task scheduling algorithms,
 * CSS specificity calculations, database index optimization, topological sorting.
 *
 * Examples of functions that obey this law:
 * - Priority comparison: if priority(taskA) <= priority(taskB) and vice versa, then they have equal priority
 * - Semantic versioning: if version A is compatible with B and B with A, they must be the same version
 * - Access level comparison: if roleA <= roleB and roleB <= roleA in permissions, they grant same access
 *
 * @param compare - The comparison function to test
 * @returns A function that creates a fast-check property for testing antisymmetry
 */
export const antisymmetry = <T>(
  compare: (a: T, b: T) => -1 | 0 | 1,
) =>
(arb: fc.Arbitrary<T>): fc.IProperty<[T, T]> => {
  return fc.property(arb, arb, (a, b) => {
    const ab = compare(a, b)
    const ba = compare(b, a)
    if (ab <= 0 && ba <= 0) {
      return ab === 0 && ba === 0
    }
    return true
  })
}

/**
 * Ordering transitivity law for comparison operations.
 *
 * Introduction: States that ordering must chain - if a <= b and b <= c,
 * then a <= c. This ensures that ordering relationships are globally consistent.
 *
 * Why it's useful: Enables efficient sorting algorithms and allows reasoning about
 * relative positions without comparing every pair. Essential for maintaining
 * sorted invariants in data structures and optimizing range queries.
 *
 * Typical places: Merge sort implementations, B-tree operations, interval tree
 * queries, cascading style sheet precedence, database query optimization.
 *
 * Examples of functions that obey this law:
 * - File path depth: if /a/b is shallower than /a/b/c, and /a/b/c than /a/b/c/d, then /a/b < /a/b/c/d
 * - Employee hierarchy: if manager A supervises B, and B supervises C, then A is above C
 * - Time ordering: if event1 happened before event2, and event2 before event3, then event1 < event3
 *
 * @param compare - The comparison function to test
 * @returns A function that creates a fast-check property for testing ordering transitivity
 */
export const orderingTransitivity = <T>(
  compare: (a: T, b: T) => -1 | 0 | 1,
) =>
(arb: fc.Arbitrary<T>): fc.IProperty<[T, T, T]> => {
  return fc.property(arb, arb, arb, (a, b, c) => {
    if (compare(a, b) <= 0 && compare(b, c) <= 0) {
      return compare(a, c) <= 0
    }
    return true
  })
}

/**
 * Totality law for ordering operations.
 *
 * Introduction: States that any two values must be comparable - for any a and b,
 * exactly one of these is true: a < b, a == b, or a > b. No pairs are incomparable.
 *
 * Why it's useful: Guarantees that sorting algorithms will always produce a defined
 * order and won't get stuck on incomparable values. Essential for deterministic
 * behavior in ordered collections and preventing "comparison method violates contract" errors.
 *
 * Typical places: Java Comparator implementations, database collation rules,
 * search result ranking, game leaderboards, e-commerce product sorting.
 *
 * Examples of functions that obey this law:
 * - Numeric comparison: any two numbers are comparable (5 < 10, 10 > 5, 5 == 5)
 * - Lexicographic ordering: any two strings can be ordered ("apple" < "banana")
 * - Chronological ordering: any two timestamps are comparable (earlier, later, or simultaneous)
 *
 * @param compare - The comparison function to test
 * @returns A function that creates a fast-check property for testing totality
 */
export const totality = <T>(
  compare: (a: T, b: T) => -1 | 0 | 1,
) =>
(arb: fc.Arbitrary<T>): fc.IProperty<[T, T]> => {
  return fc.property(arb, arb, (a, b) => {
    const result = compare(a, b)
    return result === -1 || result === 0 || result === 1
  })
}

/**
 * Semigroup laws - for types that can be combined associatively
 */

/**
 * Associativity law for binary operations.
 *
 * Introduction: States that when combining three or more values, the grouping
 * doesn't matter - (a + b) + c equals a + (b + c). The order matters, but not the parentheses.
 *
 * Why it's useful: Enables parallel computation, optimization of operations, and
 * reasoning about sequences of operations. Allows breaking down complex combinations
 * into simpler steps without affecting the result.
 *
 * Typical places: String concatenation, list/array concatenation, mathematical operations,
 * stream processing, reducer functions, monoid operations in functional programming.
 *
 * Examples of functions that obey this law:
 * - String concatenation: ("Hello" + " ") + "World" === "Hello" + (" " + "World")
 * - Array concatenation: ([1, 2] ++ [3]) ++ [4, 5] === [1, 2] ++ ([3] ++ [4, 5])
 * - Math.max: max(max(3, 7), 5) === max(3, max(7, 5)) // all equal 7
 *
 * @param combine - The binary operation to test
 * @returns A function that creates a fast-check property for testing associativity
 */
export const associativity = <T>(
  combine: (a: T, b: T) => T,
) =>
(arb: fc.Arbitrary<T>): fc.IProperty<[T, T, T]> => {
  return fc.property(arb, arb, arb, (a, b, c) => {
    const left = combine(combine(a, b), c)
    const right = combine(a, combine(b, c))
    // Would need an Eq implementation to properly compare
    // For now, assuming the type has a working equality
    return (left as any) === (right as any)
  })
}

/**
 * Monoid laws - for types that form a monoid (semigroup with identity)
 */

/**
 * Left identity law for monoid operations.
 *
 * Introduction: States that combining the identity element on the left with any value
 * returns that value unchanged - empty() + a == a. The identity acts as a neutral element.
 *
 * Why it's useful: Provides a starting point for fold/reduce operations and enables
 * safe initialization of accumulators. Essential for implementing default values and
 * handling empty collections gracefully.
 *
 * Typical places: Array reduce operations, configuration merging, query builders,
 * aggregation functions, stream processing, parser combinators.
 *
 * Examples of functions that obey this law:
 * - Addition with zero: 0 + 5 === 5 (zero is the identity)
 * - String concatenation with empty: "" + "hello" === "hello"
 * - Array concatenation: [] ++ [1, 2, 3] === [1, 2, 3]
 *
 * @param combine - The binary operation to test
 * @param empty - Function that returns the identity element
 * @returns A function that creates a fast-check property for testing left identity
 */
export const leftIdentity = <T>(
  combine: (a: T, b: T) => T,
  empty: () => T,
) =>
(arb: fc.Arbitrary<T>): fc.IProperty<[T]> => {
  return fc.property(arb, (a) => {
    const result = combine(empty(), a)
    return (result as any) === (a as any)
  })
}

/**
 * Right identity law for monoid operations.
 *
 * Introduction: States that combining any value with the identity element on the right
 * returns that value unchanged - a + empty() == a. Complements the left identity law.
 *
 * Why it's useful: Ensures operations can be safely terminated and provides consistent
 * behavior regardless of operation direction. Critical for builder patterns and
 * fluent interfaces where operations can end with a default.
 *
 * Typical places: StringBuilder append operations, pipeline builders, promise chains,
 * middleware composition, event handler registration, SQL query builders.
 *
 * Examples of functions that obey this law:
 * - Multiplication with one: 7 * 1 === 7 (one is the identity)
 * - Object merging with empty: {...obj, ...{}} === obj
 * - Function composition with identity: compose(fn, identity) === fn
 *
 * @param combine - The binary operation to test
 * @param empty - Function that returns the identity element
 * @returns A function that creates a fast-check property for testing right identity
 */
export const rightIdentity = <T>(
  combine: (a: T, b: T) => T,
  empty: () => T,
) =>
(arb: fc.Arbitrary<T>): fc.IProperty<[T]> => {
  return fc.property(arb, (a) => {
    const result = combine(a, empty())
    return (result as any) === (a as any)
  })
}

/**
 * Functor laws - for types that can be mapped over
 */

/**
 * Functor identity law.
 *
 * Introduction: States that mapping with the identity function (x => x) leaves
 * the structure unchanged. Only the values can change, never the shape.
 *
 * Why it's useful: Guarantees that map operations preserve structure and don't
 * have hidden side effects. Enables safe refactoring and composition of
 * transformations. Essential for predictable data pipeline behavior.
 *
 * Typical places: Array.map implementations, Observable/Stream transformations,
 * Promise.then chains, parser transformations, React component prop mapping.
 *
 * Examples of functions that obey this law:
 * - Array map: [1, 2, 3].map(x => x) === [1, 2, 3]
 * - Optional map: Some(5).map(x => x) === Some(5)
 * - Tree map: treeMap(node, x => x) preserves the tree structure
 *
 * @param map - The map function to test
 * @returns A function that creates a fast-check property for testing functor identity
 */
export const functorIdentity = <F, A>(
  map: <A, B>(fa: F & { _A: A }, f: (a: A) => B) => F & { _A: B },
) =>
(arb: fc.Arbitrary<F & { _A: A }>): fc.IProperty<[F & { _A: A }]> => {
  return fc.property(arb, (fa) => {
    const result = map(fa, (x) => x)
    return (result as any) === (fa as any)
  })
}

/**
 * Functor composition law.
 *
 * Introduction: States that mapping twice in sequence is equivalent to mapping
 * once with the composition of both functions - map(map(fa, f), g) == map(fa, x => g(f(x))).
 *
 * Why it's useful: Enables optimization by fusing multiple passes into one,
 * reducing iteration overhead. Guarantees that transformation chains can be
 * refactored without changing behavior. Critical for stream processing efficiency.
 *
 * Typical places: Data transformation pipelines, middleware chains, CSS transforms,
 * GraphQL resolver chains, image processing filters, compiler optimization passes.
 *
 * Examples of functions that obey this law:
 * - Array transformations: arr.map(double).map(toString) === arr.map(x => toString(double(x)))
 * - Promise chains: promise.then(validate).then(normalize) === promise.then(x => normalize(validate(x)))
 * - Stream operations: stream.map(parse).map(transform) === stream.map(x => transform(parse(x)))
 *
 * @param map - The map function to test
 * @returns A function that creates a fast-check property for testing functor composition
 */
export const functorComposition = <F, A, B, C>(
  map: <A, B>(fa: F & { _A: A }, f: (a: A) => B) => F & { _A: B },
) =>
(
  arbFA: fc.Arbitrary<F & { _A: A }>,
  arbF: fc.Arbitrary<(a: A) => B>,
  arbG: fc.Arbitrary<(b: B) => C>,
): fc.IProperty<[F & { _A: A }, (a: A) => B, (b: B) => C]> => {
  return fc.property(arbFA, arbF, arbG, (fa, f, g) => {
    const left = map(map(fa, f), g)
    const right = map(fa, (x) => g(f(x)))
    return (left as any) === (right as any)
  })
}

/**
 * Common law patterns for easy reuse
 */
export const patterns = {
  /**
   * Test all equality laws at once
   */
  equalityAll: <T>(
    is: (a: T, b: T) => boolean,
  ) =>
  (arb: fc.Arbitrary<T>): fc.IProperty<[T, T, T]> => {
    return fc.property(arb, arb, arb, (a, b, c) => {
      // Reflexivity
      if (!is(a, a)) return false

      // Symmetry
      if (is(a, b) !== is(b, a)) return false

      // Transitivity
      if (is(a, b) && is(b, c) && !is(a, c)) return false

      return true
    })
  },

  /**
   * Test all monoid laws at once
   */
  monoidAll: <T>(
    combine: (a: T, b: T) => T,
    empty: () => T,
  ) =>
  (arb: fc.Arbitrary<T>): fc.IProperty<[T, T, T]> => {
    return fc.property(arb, arb, arb, (a, b, c) => {
      // Left identity
      const leftId = combine(empty(), a)
      if ((leftId as any) !== (a as any)) return false

      // Right identity
      const rightId = combine(a, empty())
      if ((rightId as any) !== (a as any)) return false

      // Associativity
      const left = combine(combine(a, b), c)
      const right = combine(a, combine(b, c))
      if ((left as any) !== (right as any)) return false

      return true
    })
  },
}
