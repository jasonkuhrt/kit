# Fuzzy String Matching Implementation Plan

## Overview

This document outlines a phased approach to implementing fuzzy string matching capabilities in the @wollybeard/kit Str module. The implementation will provide best-in-class performance, type safety, and API consistency while offering features that exceed existing libraries.

## Goals

1. **Performance**: Match or exceed the performance of existing libraries (fuzzysort, microfuzz)
2. **Type Safety**: Native TypeScript with advanced type features and inference
3. **API Consistency**: Follow kit's established patterns (`*With`, `*On` currying)
4. **Feature Completeness**: Support multiple algorithms and use cases
5. **Bundle Efficiency**: Tree-shakable, minimal overhead (<10KB for core features)

## Phase 1: Core Foundation (Week 1)

### Objectives

- Implement fundamental distance algorithms
- Create basic fuzzy matching with scoring
- Establish API patterns and types

### Tasks

#### 1.1 Levenshtein Distance Implementation

```typescript
// src/str/fuzzy/levenshtein.ts
export const levenshtein = (str1: string, str2: string): number
export const levenshteinWith = (str1: string) => (str2: string): number

// Optimized implementation with early termination
export const levenshteinBounded = (
  str1: string, 
  str2: string, 
  maxDistance: number
): number | null
```

#### 1.2 Basic Fuzzy Match

```typescript
// src/str/fuzzy/match.ts
export interface FuzzyMatchResult {
  score: number  // 0-1 normalized score
  distance: number  // Raw distance value
  matches: Array<[start: number, end: number]>  // Character match ranges
}

export const fuzzyMatch = (
  pattern: string, 
  target: string
): FuzzyMatchResult | null

export const fuzzyMatchWith = (pattern: string) => 
  (target: string): FuzzyMatchResult | null
```

#### 1.3 Simple Fuzzy Search

```typescript
// src/str/fuzzy/search.ts
export interface FuzzySearchOptions {
  threshold?: number  // Minimum score (0-1)
  limit?: number      // Maximum results
  sortBy?: 'score' | 'index'
}

export interface FuzzySearchResult<T> {
  item: T
  score: number
  matches: Array<[start: number, end: number]>
  index: number  // Original array index
}

export const fuzzySearch = <T>(
  pattern: string,
  items: T[],
  accessor: (item: T) => string,
  options?: FuzzySearchOptions
): FuzzySearchResult<T>[]

export const fuzzySearchWith = <T>(
  pattern: string,
  accessor: (item: T) => string,
  options?: FuzzySearchOptions
) => (items: T[]): FuzzySearchResult<T>[]
```

#### 1.4 Core Type Definitions

```typescript
// src/str/fuzzy/types.ts
export type FuzzyAlgorithm =
  | 'levenshtein'
  | 'jaro'
  | 'jaroWinkler'
  | 'trigram'
  | 'hybrid'

export interface FuzzyOptions {
  algorithm?: FuzzyAlgorithm
  caseSensitive?: boolean
  normalizeWhitespace?: boolean
}

// Branded type for normalized scores
export type FuzzyScore = number & { readonly __brand: 'FuzzyScore' }
```

### Deliverables

- Working Levenshtein implementation with tests
- Basic fuzzy match function with scoring
- Simple array search capability
- Property-based tests for algorithm correctness
- Performance benchmarks against baseline

### Success Criteria

- Levenshtein performance within 20% of native implementations
- 100% test coverage for core algorithms
- API follows kit patterns consistently

## Phase 2: Advanced Algorithms (Week 2)

### Objectives

- Implement additional distance/similarity algorithms
- Create hybrid scoring system
- Add algorithm-specific optimizations

### Tasks

#### 2.1 Jaro-Winkler Implementation

```typescript
// src/str/fuzzy/jaro-winkler.ts
export const jaro = (str1: string, str2: string): number
export const jaroWinkler = (
  str1: string, 
  str2: string, 
  prefixScale?: number
): number

export const jaroWinklerWith = (str1: string, prefixScale?: number) => 
  (str2: string): number
```

#### 2.2 Trigram Similarity

```typescript
// src/str/fuzzy/trigram.ts
export const trigram = (str1: string, str2: string): number
export const trigramWith = (str1: string) => (str2: string): number

// Pre-computed trigram sets for performance
export class TrigramIndex<T> {
  constructor(items: T[], accessor: (item: T) => string)
  search(pattern: string, threshold?: number): T[]
}
```

#### 2.3 Hybrid Scoring Algorithm

```typescript
// src/str/fuzzy/hybrid.ts
export interface HybridScoringWeights {
  exactMatch: number      // 1.0
  prefixMatch: number     // 0.9
  acronymMatch: number    // 0.8
  wordBoundaryMatch: number // 0.8
  camelCaseMatch: number  // 0.7
  consecutiveMatch: number // 0.6
  transposition: number   // 0.5
}

export const hybridScore = (
  pattern: string,
  target: string,
  weights?: Partial<HybridScoringWeights>
): FuzzyMatchResult

// Optimized for common use cases (file paths, function names, etc.)
export const smartMatch = (
  pattern: string,
  target: string,
  context?: 'filename' | 'identifier' | 'natural'
): FuzzyMatchResult
```

#### 2.4 Algorithm Selection Strategy

```typescript
// src/str/fuzzy/strategy.ts
export const selectAlgorithm = (
  pattern: string,
  target: string
): FuzzyAlgorithm

export const fuzzyMatchAuto = (
  pattern: string,
  target: string
): FuzzyMatchResult
```

### Deliverables

- Jaro-Winkler implementation with tests
- Trigram similarity with indexing support
- Hybrid scoring system
- Algorithm selection logic
- Comprehensive benchmarks

### Success Criteria

- All algorithms perform within 10% of reference implementations
- Hybrid scoring provides better results than individual algorithms
- Automatic algorithm selection improves performance by 30%+

## Phase 3: Performance & Features (Week 3)

### Objectives

- Optimize critical paths
- Add advanced features
- Implement caching and indexing

### Tasks

#### 3.1 Performance Optimizations

```typescript
// src/str/fuzzy/optimized.ts
// Memoization for repeated comparisons
export const memoizedLevenshtein = Cache.memoize(levenshtein, {
  cache: new Map(),
  createKey: ([s1, s2]) => `${s1}::${s2}`
})

// SIMD optimizations for batch operations
export const batchLevenshtein = (
  pattern: string,
  targets: string[]
): number[]

// Worker pool for large datasets
export class FuzzyWorkerPool {
  constructor(workerCount?: number)
  searchAsync<T>(
    pattern: string,
    items: T[],
    accessor: (item: T) => string
  ): Promise<FuzzySearchResult<T>[]>
}
```

#### 3.2 Match Highlighting

```typescript
// src/str/fuzzy/highlight.ts
export interface HighlightOptions {
  tag?: string  // Default: 'mark'
  className?: string
  wrapper?: (match: string, index: number) => string
}

export const fuzzyHighlight = (
  text: string,
  pattern: string,
  matches: Array<[number, number]>,
  options?: HighlightOptions
): string

export const fuzzyHighlightHtml = (
  text: string,
  pattern: string,
  matches: Array<[number, number]>
): string

export const fuzzyHighlightWith = (
  pattern: string,
  options?: HighlightOptions
) => (text: string, matches: Array<[number, number]>): string
```

#### 3.3 Advanced Search Features

```typescript
// src/str/fuzzy/advanced-search.ts
export interface AdvancedSearchOptions<T> extends FuzzySearchOptions {
  keys?: Array<keyof T>  // Search multiple fields
  weights?: Partial<Record<keyof T, number>>  // Field weights
  includeMatches?: boolean
  includeScore?: boolean
  ignoreFields?: Array<keyof T>
  customScorer?: (item: T, pattern: string) => number
}

export const fuzzySearchMulti = <T extends Record<string, any>>(
  pattern: string,
  items: T[],
  options: AdvancedSearchOptions<T>
): FuzzySearchResult<T>[]

// Fuzzy search with query syntax
export const fuzzyQuery = <T>(
  query: string,  // Supports: "term1 term2" OR logic, "+term" AND logic
  items: T[],
  accessor: (item: T) => string
): FuzzySearchResult<T>[]
```

#### 3.4 Batch Operations

```typescript
// src/str/fuzzy/batch.ts
export const fuzzyFilter = <T>(
  items: T[],
  pattern: string,
  accessor: (item: T) => string,
  threshold?: number
): T[]

export const fuzzyPartition = <T>(
  items: T[],
  pattern: string,
  accessor: (item: T) => string,
  threshold?: number
): [matches: T[], nonMatches: T[]]

export const fuzzyGroupBy = <T>(
  items: T[],
  patterns: string[],
  accessor: (item: T) => string
): Map<string, T[]>
```

### Deliverables

- Optimized implementations with benchmarks
- Match highlighting utilities
- Advanced search capabilities
- Batch operation functions
- Memory usage analysis

### Success Criteria

- 50%+ performance improvement for common operations
- Memory usage remains constant for large datasets
- Highlighting performs in <1ms for typical text

## Phase 4: Integration & Polish (Week 4)

### Objectives

- Complete integration with Str module
- Add specialized algorithms
- Comprehensive documentation
- Production readiness

### Tasks

#### 4.1 Phonetic Algorithms

```typescript
// src/str/fuzzy/phonetic.ts
export const soundex = (str: string): string
export const metaphone = (str: string): string
export const doubleMetaphone = (str: string): [primary: string, alternate?: string]

// Better than Soundex for non-English names
export const cologne = (str: string): string
export const nysiis = (str: string): string

export const phoneticMatch = (
  str1: string,
  str2: string,
  algorithm?: 'soundex' | 'metaphone' | 'cologne'
): boolean
```

#### 4.2 Language-Aware Matching

```typescript
// src/str/fuzzy/locale.ts
export const fuzzyMatchLocale = (
  pattern: string,
  target: string,
  locale: string
): FuzzyMatchResult

// Diacritic-insensitive matching
export const fuzzyMatchNormalized = (
  pattern: string,
  target: string
): FuzzyMatchResult

// Unicode-aware operations
export const fuzzyMatchUnicode = (
  pattern: string,
  target: string
): FuzzyMatchResult
```

#### 4.3 Specialized Matchers

```typescript
// src/str/fuzzy/specialized.ts
// Optimized for specific use cases
export const fuzzyMatchFilePath = (
  pattern: string,
  path: string
): FuzzyMatchResult

export const fuzzyMatchIdentifier = (
  pattern: string,
  identifier: string
): FuzzyMatchResult

export const fuzzyMatchEmail = (
  pattern: string,
  email: string
): FuzzyMatchResult

export const fuzzyMatchUrl = (
  pattern: string,
  url: string
): FuzzyMatchResult
```

#### 4.4 Module Integration

```typescript
// src/str/$$.ts
export * from './fuzzy/index.ts'

// src/str/fuzzy/index.ts
export { levenshtein, levenshteinWith } from './levenshtein.ts'
export { fuzzyMatch, fuzzyMatchWith } from './match.ts'
export { fuzzySearch, fuzzySearchWith } from './search.ts'
// ... etc

// Convenience namespace
export * as Fuzzy from './fuzzy.ts'
```

### Deliverables

- Complete phonetic algorithm suite
- Language-aware matching capabilities
- Specialized matchers for common use cases
- Full integration with Str module
- Comprehensive documentation
- Migration guide from other libraries

### Success Criteria

- All algorithms pass extensive test suites
- Documentation includes clear examples
- Bundle size <10KB for core features
- Performance meets or exceeds all competitors

## Testing Strategy

### Unit Tests

```typescript
// Property-based tests for algorithms
property(
  'levenshtein distance is symmetric',
  fc.string(),
  fc.string(),
  (s1, s2) => {
    expect(levenshtein(s1, s2)).toBe(levenshtein(s2, s1))
  },
)

property('exact match has distance 0', fc.string(), (s) => {
  expect(levenshtein(s, s)).toBe(0)
})
```

### Performance Benchmarks

```typescript
// Benchmark against reference implementations
suite('Levenshtein Performance', () => {
  const strings = generateTestStrings(1000)

  bench('kit implementation', () => {
    strings.forEach(([s1, s2]) => levenshtein(s1, s2))
  })

  bench('reference implementation', () => {
    strings.forEach(([s1, s2]) => referenceLevenshtein(s1, s2))
  })
})
```

### Integration Tests

```typescript
test('fuzzy search with real-world data', () => {
  const files = loadFileList() // Real file paths
  const results = fuzzySearch('src/util/helper', files, f => f.path)

  expect(results[0].item.path).toBe('src/utils/helpers.ts')
  expect(results[0].score).toBeGreaterThan(0.8)
})
```

## Performance Targets

### Algorithm Performance

- **Levenshtein**: <100μs for typical strings (20-50 chars)
- **Jaro-Winkler**: <50μs for typical strings
- **Fuzzy Search**: <10ms for 10,000 items
- **Batch Operations**: Linear scaling with parallelization

### Memory Efficiency

- **Base memory**: <1MB for algorithm implementations
- **Index memory**: ~100 bytes per indexed item
- **Search memory**: O(pattern length) additional memory

### Bundle Size

- **Core algorithms**: <5KB minified + gzipped
- **Full feature set**: <10KB minified + gzipped
- **Individual imports**: <1KB per algorithm

## API Examples

```typescript
import { Str } from '@wollybeard/kit'

// Basic usage
const distance = Str.levenshtein('kitten', 'sitting') // 3
const similarity = Str.fuzzyMatch('helo', 'hello') // { score: 0.8, ... }

// Search arrays
const results = Str.fuzzySearch('user', users, user => user.name)

// Advanced search
const products = Str.fuzzySearchMulti('laptop 16gb', products, {
  keys: ['name', 'description', 'specs'],
  weights: { name: 2, description: 1, specs: 0.5 },
  threshold: 0.6,
})

// Curried usage
const searchByName = Str.fuzzySearchWith(
  'john',
  (user: User) => user.name,
  { threshold: 0.7 },
)

const matches = pipe(
  users,
  searchByName,
  Arr.sortBy([{ key: r => r.score, order: 'desc' }]),
  Arr.take(5),
)

// Highlighting
const highlighted = Str.fuzzyHighlight(
  'Hello World',
  'hlo',
  [[0, 1], [3, 5]],
) // '<mark>H</mark>el<mark>lo</mark> World'

// Phonetic matching
Str.soundex('Smith') === Str.soundex('Smythe') // true

// Specialized matching
Str.fuzzyMatchFilePath('src/util', 'src/utils/helpers.ts')
// Optimized for path separators and file extensions
```

## Risk Mitigation

### Technical Risks

1. **Performance degradation**: Continuous benchmarking, early optimization
2. **Memory leaks**: Careful cache management, WeakMap usage
3. **Unicode edge cases**: Comprehensive test suite, normalize strings

### Implementation Risks

1. **Scope creep**: Strict phase boundaries, feature freeze per phase
2. **API changes**: Early API design review, user feedback
3. **Bundle size growth**: Tree-shaking tests, modular design

## Success Metrics

### Phase 1

- Core algorithms implemented and tested
- Performance within 20% of targets
- API patterns established

### Phase 2

- All major algorithms implemented
- Hybrid scoring shows 30%+ improvement
- Algorithm selection working

### Phase 3

- Performance targets met or exceeded
- Advanced features complete
- <10KB bundle size achieved

### Phase 4

- Full integration complete
- Documentation comprehensive
- Ready for production use

## Conclusion

This phased approach ensures we build a world-class fuzzy string matching implementation that exceeds existing libraries while maintaining the high standards of the @wollybeard/kit project. Each phase builds on the previous one, with clear deliverables and success criteria to track progress.
