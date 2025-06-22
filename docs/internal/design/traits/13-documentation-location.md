# Documentation Location

## Problem

Where should documentation live for trait-based operations? Should it be on the trait definition, on each implementation, or both?

## Documentation Needs

1. **Conceptual**: What does this operation mean abstractly?
2. **Implementation-specific**: How does this specific type implement it?
3. **Usage examples**: How to use with different types
4. **Performance notes**: Implementation-specific performance characteristics
5. **Edge cases**: Type-specific edge cases

## Options for Documentation Location

### 1. Document on Trait Only

```typescript
/**
 * Calculate the difference between two ranges.
 * Returns a range representing the values in the first range
 * but not in the second.
 *
 * @param a - The first range
 * @param b - The range to subtract
 * @returns The difference between the ranges
 *
 * @example
 * Range.diff(numRange(1, 10), numRange(5, 15)) // numRange(1, 5)
 * Range.diff(dateRange(jan1, jan31), dateRange(jan15, feb15)) // dateRange(jan1, jan15)
 */
interface RangeOps {
  diff<T>(a: T, b: T): T
}

// Implementations have no docs
export const diff = (a: NumRange, b: NumRange): NumRange => {
  // Just implementation
}
```

**Pros:**

- Single source of truth
- Consistent documentation
- Easy to maintain

**Cons:**

- No implementation details
- Can't document type-specific behavior
- Generic examples only

### 2. Document on Implementations Only

```typescript
// Trait has minimal docs
interface RangeOps {
  diff<T>(a: T, b: T): T
}

/**
 * Calculate the difference between two numeric ranges.
 * Returns a range containing values in the first range but not the second.
 *
 * For numeric ranges, this handles floating point precision correctly
 * and returns an empty range if there's no difference.
 *
 * @param a - The first numeric range
 * @param b - The numeric range to subtract
 * @returns The difference as a numeric range
 *
 * @example
 * diff(numRange(1, 10), numRange(5, 15)) // numRange(1, 5)
 * diff(numRange(1.1, 2.2), numRange(1.5, 3.0)) // numRange(1.1, 1.5)
 */
export const diff = (a: NumRange, b: NumRange): NumRange => {
  // Implementation
}
```

**Pros:**

- Specific details
- Type-specific examples
- Performance notes possible

**Cons:**

- Duplication across implementations
- Might diverge over time
- No central reference

### 3. Document Both with Different Focus

```typescript
/**
 * Calculate the difference between two ranges.
 *
 * ## Concept
 * The difference operation returns a range representing values
 * that exist in the first range but not in the second.
 *
 * ## Laws
 * - `diff(a, a)` returns empty range
 * - `diff(a, empty)` returns `a`
 *
 * @see NumRange.diff for numeric-specific details
 * @see DateRange.diff for date-specific details
 */
interface RangeOps {
  diff<T>(a: T, b: T): T
}

/**
 * Calculate the difference between numeric ranges.
 *
 * ## Implementation Details
 * - Handles floating point precision using epsilon comparison
 * - Returns `null` for empty ranges
 * - O(1) time complexity
 *
 * @example
 * diff(numRange(1.0, 2.0), numRange(1.5, 2.5)) // numRange(1.0, 1.5)
 */
export const diff = (a: NumRange, b: NumRange): NumRange => {
  // Implementation
}
```

**Pros:**

- Complete documentation
- Separation of concerns
- Best of both worlds

**Cons:**

- More maintenance
- Potential inconsistency
- Documentation overhead

### 4. Generated Documentation

```typescript
/**
 * @trait RangeOps
 * @traitMethod diff
 * @implementation NumRange
 *
 * Additional implementation notes...
 */
export const diff = (a: NumRange, b: NumRange): NumRange => {
  // Tool generates combined docs
}
```

**Pros:**

- Single source, multiple outputs
- Consistency enforced
- Can generate comparison tables

**Cons:**

- Requires tooling
- Less flexible
- Build complexity

### 5. Documentation Inheritance

```typescript
/**
 * @inheritDoc RangeOps.diff
 *
 * ## Numeric-Specific Details
 * - Uses epsilon for floating point comparison
 * - Returns smallest possible range
 */
export const diff = (a: NumRange, b: NumRange): NumRange => {
  // Inherits base docs, adds specific details
}
```

**Pros:**

- Reduces duplication
- Maintains connection
- IDE support

**Cons:**

- Not all tools support @inheritDoc
- Can be fragile
- Limited customization

## Cross-Cutting Concerns

### Where to Document:

1. **Performance characteristics** - On implementations
2. **Conceptual explanation** - On trait
3. **Laws and contracts** - On trait
4. **Type-specific examples** - On implementations
5. **Edge cases** - Both (general on trait, specific on impl)
6. **Algorithm choice** - On implementations

### Documentation Strategy

```typescript
// traits/range.ts
/**
 * Range operations trait
 *
 * @concepts
 * - Ranges represent intervals between start and end values
 * - Operations follow set theory semantics
 *
 * @laws
 * - All operations must handle empty ranges
 * - Symmetric operations must be commutative
 *
 * @implementations
 * - {@link NumRange} - Numeric ranges with floating point support
 * - {@link DateRange} - Temporal ranges with timezone handling
 */

// num/range/diff.ts
/**
 * @implements {RangeOps.diff}
 *
 * Numeric range difference with epsilon comparison for floating points.
 *
 * @performance O(1)
 * @precision Uses Number.EPSILON for comparisons
 */
```

## Recommendation

Use a three-tier documentation strategy:

1. **Trait level**: Concepts, laws, general behavior
2. **Implementation level**: Specific details, performance, edge cases
3. **Cross-references**: Link between trait and implementations

This provides:

- Complete documentation without excessive duplication
- Clear separation between abstract and concrete
- Easy navigation for users
- Maintainable structure
