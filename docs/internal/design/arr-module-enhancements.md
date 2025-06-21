# Arr Module Enhancements

## Overview

The existing `arr` module is comprehensive but can be enhanced with additional utilities commonly found in libraries like Lodash, Ramda, and es-toolkit. This document outlines missing functionality and proposed enhancements while maintaining the established patterns and philosophy.

## Current State Analysis

**Strengths:**

- Excellent type safety with branded types (`NonEmpty`, `NonEmptyRO`)
- Comprehensive currying support (`*On`, `*With` variants)
- Strong focus on immutability
- Good error handling with Result types
- Property-based testing integration

**Gaps Identified:**

- Limited array construction utilities
- Missing advanced transformation functions
- No statistical/aggregation functions
- Limited set-like operations
- No chunking or windowing functions
- No advanced sorting utilities
- Limited array comparison functions

## Proposed Enhancements

### Array Construction (`construction.ts`)

```typescript
/**
 * Create array from range.
 */
export const fromRange = (start: number, end: number, step?: number): number[]
export const fromRangeWith = (step: number) => (start: number, end: number): number[]

/**
 * Create array by repeating value.
 */
export const repeat = <T>(value: T, count: number): T[]
export const repeatWith = <T>(count: number) => (value: T): T[]

/**
 * Create array by cycling through values.
 */
export const cycle = <T>(values: T[], count: number): T[]
export const cycleWith = <T>(count: number) => (values: T[]): T[]

/**
 * Create array from generator function.
 */
export const fromGenerator = <T>(generator: () => T, count: number): T[]
export const fromGeneratorWith = <T>(count: number) => (generator: () => T): T[]

/**
 * Create array from iterable.
 */
export const fromIterable = <T>(iterable: Iterable<T>): T[]

/**
 * Create array from arguments.
 */
export const fromArgs = <T>(...args: T[]): T[]

/**
 * Unfold - create array by repeatedly applying function.
 */
export const unfold = <T, R>(fn: (seed: T) => [R, T] | null, seed: T): R[]
export const unfoldWith = <T, R>(fn: (seed: T) => [R, T] | null) => (seed: T): R[]
```

### Advanced Transformations (`transformations.ts`)

```typescript
/**
 * Scan - like reduce but returns all intermediate values.
 */
export const scan = <T, R>(arr: T[], fn: (acc: R, val: T, idx: number) => R, initial: R): R[]
export const scanOn = <T, R>(arr: T[]) => (fn: (acc: R, val: T, idx: number) => R, initial: R): R[]
export const scanWith = <T, R>(fn: (acc: R, val: T, idx: number) => R, initial: R) => (arr: T[]): R[]

/**
 * Flat map with depth control.
 */
export const flatMap = <T, R>(arr: T[], fn: (val: T, idx: number) => R[]): R[]
export const flatMapOn = <T, R>(arr: T[]) => (fn: (val: T, idx: number) => R[]): R[]
export const flatMapWith = <T, R>(fn: (val: T, idx: number) => R[]) => (arr: T[]): R[]

/**
 * Flatten with depth control.
 */
export const flatten = <T>(arr: T[][], depth?: number): T[]
export const flattenDeep = <T>(arr: any[]): T[]

/**
 * Transpose 2D array.
 */
export const transpose = <T>(matrix: T[][]): T[][]

/**
 * Rotate array left/right.
 */
export const rotateLeft = <T>(arr: T[], steps?: number): T[]
export const rotateRight = <T>(arr: T[], steps?: number): T[]
export const rotateLeftBy = <T>(steps: number) => (arr: T[]): T[]
export const rotateRightBy = <T>(steps: number) => (arr: T[]): T[]

/**
 * Reverse without mutation.
 */
export const reverse = <T>(arr: T[]): T[]

/**
 * Intersperse - insert separator between elements.
 */
export const intersperse = <T>(arr: T[], separator: T): T[]
export const intersperseWith = <T>(separator: T) => (arr: T[]): T[]

/**
 * Intercalate - insert array between elements and flatten.
 */
export const intercalate = <T>(arr: T[][], separator: T[]): T[]
export const intercalateWith = <T>(separator: T[]) => (arr: T[][]): T[]
```

### Chunking and Windowing (`windowing.ts`)

```typescript
/**
 * Split array into chunks of specified size.
 */
export const chunk = <T>(arr: T[], size: number): T[][]
export const chunkBy = <T>(size: number) => (arr: T[]): T[][]

/**
 * Split array when predicate returns true.
 */
export const splitWhen = <T>(arr: T[], predicate: (val: T, idx: number) => boolean): T[][]
export const splitWhenWith = <T>(predicate: (val: T, idx: number) => boolean) => (arr: T[]): T[][]

/**
 * Split array at specific indices.
 */
export const splitAt = <T>(arr: T[], indices: number[]): T[][]
export const splitAtWith = <T>(indices: number[]) => (arr: T[]): T[][]

/**
 * Sliding window over array.
 */
export const window = <T>(arr: T[], size: number): T[][]
export const windowBy = <T>(size: number) => (arr: T[]): T[][]

/**
 * Sliding window with step size.
 */
export const windowStep = <T>(arr: T[], size: number, step: number): T[][]
export const windowStepBy = <T>(size: number, step: number) => (arr: T[]): T[][]

/**
 * Pairs - create array of adjacent pairs.
 */
export const pairs = <T>(arr: T[]): [T, T][]

/**
 * Aperture - n-tuples of consecutive elements.
 */
export const aperture = <T>(arr: T[], size: number): T[][]
export const apertureBy = <T>(size: number) => (arr: T[]): T[][]
```

### Set Operations (`sets.ts`)

```typescript
/**
 * Union of arrays (remove duplicates).
 */
export const union = <T>(arr1: T[], arr2: T[]): T[]
export const unionOn = <T>(arr1: T[]) => (arr2: T[]): T[]
export const unionWith = <T>(arr2: T[]) => (arr1: T[]): T[]

/**
 * Intersection of arrays.
 */
export const intersection = <T>(arr1: T[], arr2: T[]): T[]
export const intersectionOn = <T>(arr1: T[]) => (arr2: T[]): T[]
export const intersectionWith = <T>(arr2: T[]) => (arr1: T[]): T[]

/**
 * Difference between arrays.
 */
export const difference = <T>(arr1: T[], arr2: T[]): T[]
export const differenceOn = <T>(arr1: T[]) => (arr2: T[]): T[]
export const differenceWith = <T>(arr2: T[]) => (arr1: T[]): T[]

/**
 * Symmetric difference.
 */
export const symmetricDifference = <T>(arr1: T[], arr2: T[]): T[]
export const symmetricDifferenceOn = <T>(arr1: T[]) => (arr2: T[]): T[]

/**
 * Check if arrays are disjoint (no common elements).
 */
export const areDisjoint = <T>(arr1: T[], arr2: T[]): boolean

/**
 * Check if arr1 is subset of arr2.
 */
export const isSubsetOf = <T>(arr1: T[], arr2: T[]): boolean
export const isSubsetOfWith = <T>(arr2: T[]) => (arr1: T[]): boolean

/**
 * Check if arr1 is superset of arr2.
 */
export const isSupersetOf = <T>(arr1: T[], arr2: T[]): boolean
export const isSupersetOfWith = <T>(arr2: T[]) => (arr1: T[]): boolean

/**
 * Remove duplicates with custom equality.
 */
export const uniqBy = <T, K>(arr: T[], keyFn: (val: T) => K): T[]
export const uniqByWith = <T, K>(keyFn: (val: T) => K) => (arr: T[]): T[]

/**
 * Remove duplicates using deep equality.
 */
export const uniqDeep = <T>(arr: T[]): T[]
```

### Aggregation and Statistics (`aggregation.ts`)

```typescript
/**
 * Sum of numbers.
 */
export const sum = (arr: number[]): number

/**
 * Sum by property or function.
 */
export const sumBy = <T>(arr: T[], fn: (val: T) => number): number
export const sumByWith = <T>(fn: (val: T) => number) => (arr: T[]): number

/**
 * Average of numbers.
 */
export const average = (arr: number[]): number
export const mean = average // Alias

/**
 * Average by property or function.
 */
export const averageBy = <T>(arr: T[], fn: (val: T) => number): number
export const averageByWith = <T>(fn: (val: T) => number) => (arr: T[]): number

/**
 * Median value.
 */
export const median = (arr: number[]): number

/**
 * Mode (most frequent value).
 */
export const mode = <T>(arr: T[]): T[]

/**
 * Min/Max values.
 */
export const min = <T>(arr: T[]): T | undefined
export const max = <T>(arr: T[]): T | undefined

/**
 * Min/Max by property or function.
 */
export const minBy = <T>(arr: T[], fn: (val: T) => number): T | undefined
export const maxBy = <T>(arr: T[], fn: (val: T) => number): T | undefined
export const minByWith = <T>(fn: (val: T) => number) => (arr: T[]): T | undefined
export const maxByWith = <T>(fn: (val: T) => number) => (arr: T[]): T | undefined

/**
 * Count occurrences.
 */
export const count = <T>(arr: T[], value: T): number
export const countBy = <T>(arr: T[], predicate: (val: T) => boolean): number
export const countByWith = <T>(predicate: (val: T) => boolean) => (arr: T[]): number

/**
 * Frequency map.
 */
export const frequencies = <T>(arr: T[]): Map<T, number>
export const frequenciesBy = <T, K>(arr: T[], keyFn: (val: T) => K): Map<K, number>
export const frequenciesByWith = <T, K>(keyFn: (val: T) => K) => (arr: T[]): Map<K, number>
```

### Advanced Sorting (`sorting.ts`)

```typescript
/**
 * Sort with multiple criteria.
 */
export interface SortCriterion<T> {
  key: (item: T) => any
  order?: 'asc' | 'desc'
}

export const sortBy = <T>(arr: T[], criteria: SortCriterion<T>[]): T[]
export const sortByWith = <T>(criteria: SortCriterion<T>[]) => (arr: T[]): T[]

/**
 * Natural sort (handles numbers in strings correctly).
 */
export const sortNatural = (arr: string[]): string[]

/**
 * Sort with custom comparator.
 */
export const sortWith = <T>(arr: T[], comparator: (a: T, b: T) => number): T[]
export const sortWithBy = <T>(comparator: (a: T, b: T) => number) => (arr: T[]): T[]

/**
 * Check if array is sorted.
 */
export const isSorted = <T>(arr: T[], comparator?: (a: T, b: T) => number): boolean

/**
 * Shuffle array randomly.
 */
export const shuffle = <T>(arr: T[]): T[]

/**
 * Sample random elements.
 */
export const sample = <T>(arr: T[], count: number): T[]
export const sampleBy = <T>(count: number) => (arr: T[]): T[]
```

### Array Comparison (`comparison.ts`)

```typescript
/**
 * Deep equality comparison.
 */
export const equalDeep = <T>(arr1: T[], arr2: T[]): boolean

/**
 * Equality with custom comparator.
 */
export const equalWith = <T>(arr1: T[], arr2: T[], comparator: (a: T, b: T) => boolean): boolean
export const equalWithBy = <T>(comparator: (a: T, b: T) => boolean) => (arr1: T[], arr2: T[]): boolean

/**
 * Lexicographic comparison.
 */
export const compare = <T>(arr1: T[], arr2: T[]): -1 | 0 | 1
export const compareWith = <T>(comparator: (a: T, b: T) => number) => (arr1: T[], arr2: T[]): -1 | 0 | 1

/**
 * Check if array starts with prefix.
 */
export const startsWith = <T>(arr: T[], prefix: T[]): boolean
export const startsWithBy = <T>(prefix: T[]) => (arr: T[]): boolean

/**
 * Check if array ends with suffix.
 */
export const endsWith = <T>(arr: T[], suffix: T[]): boolean
export const endsWithBy = <T>(suffix: T[]) => (arr: T[]): boolean

/**
 * Check if array contains subsequence.
 */
export const containsSubsequence = <T>(arr: T[], subsequence: T[]): boolean
export const containsSubsequenceBy = <T>(subsequence: T[]) => (arr: T[]): boolean
```

### Utility Functions (`utilities.ts`)

```typescript
/**
 * Zip arrays together.
 */
export const zip = <A, B>(arr1: A[], arr2: B[]): [A, B][]
export const zipWith = <A, B, C>(arr1: A[], arr2: B[], fn: (a: A, b: B) => C): C[]
export const zipWithBy = <A, B, C>(fn: (a: A, b: B) => C) => (arr1: A[], arr2: B[]): C[]

/**
 * Unzip array of tuples.
 */
export const unzip = <A, B>(arr: [A, B][]): [A[], B[]]

/**
 * Zip with index.
 */
export const zipWithIndex = <T>(arr: T[]): [T, number][]

/**
 * Cartesian product.
 */
export const cartesianProduct = <A, B>(arr1: A[], arr2: B[]): [A, B][]

/**
 * Array comprehension.
 */
export const comprehension = <T, R>(
  arr: T[],
  transformer: (val: T) => R,
  filter?: (val: T) => boolean
): R[]

/**
 * Take while predicate is true.
 */
export const takeWhile = <T>(arr: T[], predicate: (val: T, idx: number) => boolean): T[]
export const takeWhileWith = <T>(predicate: (val: T, idx: number) => boolean) => (arr: T[]): T[]

/**
 * Drop while predicate is true.
 */
export const dropWhile = <T>(arr: T[], predicate: (val: T, idx: number) => boolean): T[]
export const dropWhileWith = <T>(predicate: (val: T, idx: number) => boolean) => (arr: T[]): T[]

/**
 * Take last n elements.
 */
export const takeLast = <T>(arr: T[], count: number): T[]
export const takeLastBy = <T>(count: number) => (arr: T[]): T[]

/**
 * Drop last n elements.
 */
export const dropLast = <T>(arr: T[], count: number): T[]
export const dropLastBy = <T>(count: number) => (arr: T[]): T[]

/**
 * Insert element at index.
 */
export const insertAt = <T>(arr: T[], index: number, value: T): T[]
export const insertAtWith = <T>(index: number, value: T) => (arr: T[]): T[]

/**
 * Remove element at index.
 */
export const removeAt = <T>(arr: T[], index: number): T[]
export const removeAtBy = <T>(index: number) => (arr: T[]): T[]

/**
 * Update element at index.
 */
export const updateAt = <T>(arr: T[], index: number, value: T): T[]
export const updateAtWith = <T>(index: number, value: T) => (arr: T[]): T[]

/**
 * Move element from one index to another.
 */
export const move = <T>(arr: T[], fromIndex: number, toIndex: number): T[]
export const moveWith = <T>(fromIndex: number, toIndex: number) => (arr: T[]): T[]
```

## Integration Enhancements

### Existing Module Integration

```typescript
// Enhanced merge to handle nested arrays
export const mergeDeep = <T>(arr1: T[][], arr2: T[][]): T[][]

// Enhanced join with more options
export interface JoinOptions {
  separator?: string
  lastSeparator?: string
  empty?: string
}

export const joinAdvanced = <T>(arr: T[], options: JoinOptions): string

// Enhanced map with more utilities
export const mapIndexed = <T, R>(arr: T[], fn: (val: T, idx: number, arr: T[]) => R): R[]
export const mapWithKey = <T, R>(arr: T[], fn: (val: T, key: string) => R): R[] // For objects converted to arrays
```

### New Type Definitions

```typescript
/**
 * Fixed-length array type.
 */
export type FixedArray<T, N extends number> = T[] & { length: N }

/**
 * Tuple of specific length.
 */
export type Tuple<T, N extends number> = FixedArray<T, N>

/**
 * Array with at least N elements.
 */
export type AtLeast<T, N extends number> = T[] & { 0: T } // Can be enhanced with more type magic

/**
 * Sorted array type.
 */
export type Sorted<T> = T[] & { readonly __brand: 'Sorted' }

/**
 * Unique array type (no duplicates).
 */
export type Unique<T> = T[] & { readonly __brand: 'Unique' }
```

## Performance Optimizations

1. **Lazy evaluation** for chain operations
2. **Early termination** for find/filter operations
3. **Optimized algorithms** for large arrays
4. **Memory-efficient** implementations
5. **Web Workers** for computationally intensive operations

## Testing Strategy

```typescript
// Property-based tests for mathematical properties
property(
  'union is commutative',
  fc.array(fc.integer()),
  fc.array(fc.integer()),
  (a, b) => {
    expect(union(a, b)).toEqual(union(b, a))
  },
)

property('flatten . map === flatMap', fc.array(fc.integer()), (arr) => {
  const double = (x: number) => [x, x]
  expect(flatten(map(arr, double))).toEqual(flatMap(arr, double))
})

// Edge case testing
test('handles empty arrays gracefully', () => {
  expect(sum([])).toBe(0)
  expect(average([])).toBe(NaN)
  expect(max([])).toBe(undefined)
})
```

## Migration Strategy

1. **Backward compatibility**: All existing functions remain unchanged
2. **Gradual adoption**: New functions can be adopted incrementally
3. **Documentation**: Comprehensive examples and migration guides
4. **Type safety**: New functions follow existing type patterns
5. **Performance**: Benchmark against existing implementations

## Usage Examples

```typescript
import { Arr } from '@wollybeard/kit'

// Statistical operations
const numbers = [1, 2, 3, 4, 5]
Arr.sum(numbers) // 15
Arr.average(numbers) // 3
Arr.median(numbers) // 3

// Set operations
const a = [1, 2, 3]
const b = [3, 4, 5]
Arr.union(a, b) // [1, 2, 3, 4, 5]
Arr.intersection(a, b) // [3]
Arr.difference(a, b) // [1, 2]

// Windowing
Arr.chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
Arr.window([1, 2, 3, 4], 3) // [[1, 2, 3], [2, 3, 4]]

// Advanced transformations
Arr.scan([1, 2, 3], (acc, x) => acc + x, 0) // [0, 1, 3, 6]
Arr.transpose([[1, 2], [3, 4]]) // [[1, 3], [2, 4]]

// Curried usage with pipes
pipe(
  [1, 2, 3, 4, 5, 6],
  Arr.chunkBy(2),
  Arr.mapWith(Arr.sum),
  Arr.filterWith(x => x > 5),
) // [7, 11]
```

This enhancement maintains the module's excellent foundations while adding comprehensive functionality to match and exceed what's available in major utility libraries.
