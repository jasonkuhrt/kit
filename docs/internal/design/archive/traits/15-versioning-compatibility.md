# Versioning and Compatibility

## Problem

How do we handle versioning when different implementations of a trait might have different capabilities or versions? What happens when trait interfaces evolve?

## Scenarios

### 1. Optional Methods

Some implementations might support additional operations:

```typescript
// Base trait
interface RangeOps {
  diff(a, b): Range
  contains(range, value): boolean
}

// NumRange has additional methods
NumRange.interpolate(range, t)
NumRange.clamp(value, range)

// DateRange has different additional methods
DateRange.businessDays(range)
DateRange.weekends(range)
```

### 2. Interface Evolution

Trait interfaces need to evolve over time:

```typescript
// Version 1
interface RangeOps {
  diff(a, b): Range
}

// Version 2 - Added method
interface RangeOps {
  diff(a, b): Range
  union(a, b): Range // New!
}
```

### 3. Breaking Changes

Sometimes changes are incompatible:

```typescript
// Version 1
interface RangeOps {
  isEmpty(range): boolean
}

// Version 2 - Changed signature
interface RangeOps {
  isEmpty(range): { empty: boolean; reason?: string }
}
```

## Solutions

### 1. Capability Detection

```typescript
interface RangeOps {
  // Required methods
  diff(a, b): Range
  contains(range, value): boolean

  // Optional methods
  union?(a, b): Range
  intersection?(a, b): Range
}

// Runtime detection
if ('union' in rangeOps) {
  result = rangeOps.union(a, b)
} else {
  throw new Error('Union not supported for this range type')
}

// Type-safe detection
type SupportsUnion<T> = T extends { union: Function } ? true : false

function requireUnion<T extends RangeOps>(
  ops: T & (SupportsUnion<T> extends true ? T : never),
) {
  return ops.union // Safe to access
}
```

### 2. Versioned Traits

```typescript
// Separate versions
interface RangeOpsV1 {
  diff(a, b): Range
}

interface RangeOpsV2 extends RangeOpsV1 {
  union(a, b): Range
}

// Registration with version
registerTrait('Range', 'NumRange', {
  version: 2,
  implementation: NumRangeOpsV2,
})

// Version detection
const getRangeOps = (type: string, minVersion = 1) => {
  const registration = registry.get(type)
  if (registration.version < minVersion) {
    throw new Error(
      `Range implementation ${type} is version ${registration.version}, need ${minVersion}`,
    )
  }
  return registration.implementation
}
```

### 3. Feature Flags

```typescript
interface RangeCapabilities {
  supportsUnion: boolean
  supportsIntersection: boolean
  supportsInterpolation: boolean
  supportsNegation: boolean
}

interface RangeRegistration {
  ops: RangeOps
  capabilities: RangeCapabilities
}

// Check capabilities before use
const rangeReg = getRegistration('NumRange')
if (rangeReg.capabilities.supportsUnion) {
  return rangeReg.ops.union!(a, b)
}
```

### 4. Adapter Pattern

```typescript
// Old implementation
const oldNumRange: RangeOpsV1 = {
  diff: (a, b) => {/* ... */},
}

// Adapter to new interface
const adaptToV2 = (v1: RangeOpsV1): RangeOpsV2 => ({
  ...v1,
  union: (a, b) => {
    // Polyfill with existing operations
    return /* implementation using diff/contains */
  },
})

// Register adapted version
registerTrait('Range', 'NumRange', adaptToV2(oldNumRange))
```

### 5. Semantic Versioning

```typescript
interface TraitVersion {
  major: number
  minor: number
  patch: number
}

interface TraitRegistry {
  register(
    trait: string,
    type: string,
    implementation: any,
    version: TraitVersion,
  ): void

  get(
    trait: string,
    type: string,
    minVersion?: Partial<TraitVersion>,
  ): any
}

// Usage
registry.register('Range', 'NumRange', impl, { major: 2, minor: 1, patch: 0 })

// Get with version requirement
const ops = registry.get('Range', 'NumRange', { major: 2 })
```

### 6. Progressive Enhancement

```typescript
// Core trait - always required
interface RangeCore {
  contains(range, value): boolean
  isEmpty(range): boolean
}

// Extensions - optional
interface RangeSetOps {
  union(a, b): Range
  intersection(a, b): Range
  diff(a, b): Range
}

interface RangeInterpolation {
  interpolate(range, t): value
  normalize(range, value): number
}

// Compose as needed
type FullRange = RangeCore & RangeSetOps & RangeInterpolation

// Check what's available
function isSetOps(ops: RangeCore): ops is RangeCore & RangeSetOps {
  return 'union' in ops && 'intersection' in ops
}
```

## Migration Strategies

### 1. Deprecation Warnings

```typescript
const deprecated = (message: string) => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const original = descriptor.value
    descriptor.value = function(...args: any[]) {
      console.warn(`DEPRECATED: ${key} - ${message}`)
      return original.apply(this, args)
    }
  }
}

class NumRangeOps {
  @deprecated('Use union() instead')
  merge(a, b) {
    return this.union(a, b)
  }
}
```

### 2. Compatibility Layers

```typescript
// Maintain old API while using new implementation
const createCompatibleOps = (newOps: RangeOpsV2): RangeOpsV1 & RangeOpsV2 => {
  return {
    ...newOps,
    // Old method name -> new implementation
    merge: newOps.union,
    // Old signature -> new signature adapter
    isEmpty: (range) => {
      const result = newOps.isEmpty(range)
      return typeof result === 'object' ? result.empty : result
    },
  }
}
```

## Recommendation

1. **Start with minimal required interface** - easier to add than remove
2. **Use capability detection** for optional features
3. **Version at trait level**, not individual methods
4. **Provide adapters** for backward compatibility
5. **Document version requirements** clearly
6. **Consider progressive enhancement** for complex traits

The goal is to allow evolution while maintaining compatibility where possible.
