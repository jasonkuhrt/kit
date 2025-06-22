# Performance Impact

## Problem

What is the performance cost of using global trait dispatch compared to direct function calls?

## Performance Considerations

### 1. Direct Call Performance

```typescript
// Baseline - direct call
NumRange.diff(a, b)
```

Operations:

1. Direct function call

Total: ~1 operation

### 2. Trait Dispatch Performance

```typescript
// Trait dispatch
Range.diff(a, b)
```

Operations:

1. Access global registry
2. Detect type of argument
3. Map lookup for implementation
4. Indirect function call
5. Possible type checking

Total: ~5-10 operations

### 3. Real-World Impact

```typescript
// Benchmark example
const directTime = benchmark(() => {
  for (let i = 0; i < 1000000; i++) {
    NumRange.diff(r1, r2)
  }
})

const traitTime = benchmark(() => {
  for (let i = 0; i < 1000000; i++) {
    Range.diff(r1, r2)
  }
})

// Expected results:
// Direct: ~10ms
// Trait: ~15-20ms (50-100% overhead)
```

### 4. Optimization Opportunities

#### Caching

```typescript
const diffCache = new WeakMap()
const diff = (a, b) => {
  let impl = diffCache.get(a.constructor)
  if (!impl) {
    impl = findImplementation(a)
    diffCache.set(a.constructor, impl)
  }
  return impl(a, b)
}
```

#### Monomorphic Dispatch

```typescript
// If same types used repeatedly, V8 can optimize
const ranges = [r1, r2, r3] // All NumRange
ranges.forEach(r => Range.diff(r, baseline)) // V8 optimizes
```

#### Compile-Time Optimization

```typescript
// Build tool could transform:
Range.diff(numRange1, numRange2)
// Into:
NumRange.diff(numRange1, numRange2)
```

## Performance Testing Scenarios

### 1. Hot Path Usage

- Tight loops
- High-frequency operations
- Real-time calculations

**Recommendation**: Use direct calls

### 2. Application Logic

- Business logic
- UI updates
- API handlers

**Recommendation**: Trait overhead negligible

### 3. Batch Operations

- Array transformations
- Data processing
- Report generation

**Recommendation**: Depends on volume

## Mitigation Strategies

### 1. Hybrid API

```typescript
// Both available
NumRange.diff(a, b) // Performance critical
Range.diff(a, b) // Convenience
```

### 2. Specialized Functions

```typescript
// Batch operation with single dispatch
Range.diffAll(ranges) // One dispatch for entire array
```

### 3. JIT Compilation Hints

```typescript
// Help V8 optimize
function diff(a, b) {
  'use inline' // Hypothetical hint
  return dispatch('diff', a, b)
}
```

## Conclusion

Performance impact exists but is:

- Negligible for most use cases
- Predictable and measurable
- Optimizable when needed
- Worth it for the ergonomics in many cases

Recommend:

1. Default to traits for convenience
2. Profile if performance matters
3. Use direct calls in hot paths
4. Provide both APIs
