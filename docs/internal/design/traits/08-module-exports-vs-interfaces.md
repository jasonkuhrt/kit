# Module Exports vs Interfaces

## Problem

There's a fundamental tension between:

1. Wanting trait interfaces for type safety and contracts
2. Wanting module-level function exports for tree-shaking and simplicity

```typescript
// Interface approach - good for traits
interface RangeOps<T> {
  diff(a: T, b: T): T
  contains(range: T, value: any): boolean
}

// Module exports - good for tree-shaking
export const diff = (a: NumRange, b: NumRange): NumRange => { ... }
export const contains = (range: NumRange, value: number): boolean => { ... }
```

## The Conflict

### What Interfaces Want

```typescript
const NumRangeOps: RangeOps<NumRange> = {
  diff: (a, b) => { ... },
  contains: (range, value) => { ... }
}
```

- Single object implementing contract
- Easy to pass around
- Type checker ensures completeness

### What Module Exports Want

```typescript
// num/range/diff.ts
export const diff = (a: NumRange, b: NumRange): NumRange => { ... }

// num/range/contains.ts  
export const contains = (range: NumRange, value: number): boolean => { ... }
```

- Separate files per function
- Tree-shakeable
- Direct imports

## Possible Solutions

### 1. Dual Exports

```typescript
// num/range/diff.ts
export const diff = (a: NumRange, b: NumRange): NumRange => { ... }

// num/range/contains.ts
export const contains = (range: NumRange, value: number): boolean => { ... }

// num/range/ops.ts
import { diff } from './diff.ts'
import { contains } from './contains.ts'

export const NumRangeOps: RangeOps<NumRange> = {
  diff,
  contains
}
```

**Pros:**

- Both patterns supported
- Tree-shaking preserved for direct imports
- Interface available for traits

**Cons:**

- Duplication
- Two ways to do same thing
- Maintenance burden

### 2. Build-Time Assembly

```typescript
// Source: individual functions
export const diff = (a: NumRange, b: NumRange): NumRange => { ... }

// Build generates:
export const NumRangeOps = {
  diff: require('./diff').diff,
  contains: require('./contains').contains
}
```

**Pros:**

- Single source of truth
- Both patterns available
- Automated

**Cons:**

- Build complexity
- Dynamic requires hurt bundling
- Source differs from output

### 3. Namespace Objects

```typescript
// num/range/$.ts
export * as NumRange from './$$.ts'

// Usage
import { NumRange } from '#num/range'
NumRange.diff(a, b)

// Can still destructure
const { diff, contains } = NumRange
```

**Pros:**

- Single import
- Grouping without interface
- Can still tree-shake (with modern bundlers)

**Cons:**

- Not a "real" interface
- Can't implement type contract
- Relies on bundler optimization

### 4. Type-Only Interfaces

```typescript
// Define interface for type checking only
export interface RangeOps<T> {
  diff(a: T, b: T): T
  contains(range: T, value: any): boolean
}

// Type assertion for validation
const _typeCheck: RangeOps<NumRange> = {
  diff,
  contains,
} as const
```

**Pros:**

- Type safety without runtime object
- Module exports preserved
- Zero runtime cost

**Cons:**

- Can't use for dispatch
- Extra boilerplate
- Not a real implementation

### 5. Proxy-Based Interface

```typescript
const NumRangeOps = new Proxy({} as RangeOps<NumRange>, {
  get(_, prop) {
    return import(`./num/range/${prop}.ts`).then(m => m[prop])
  },
})
```

**Pros:**

- Lazy loading
- Tree-shaking friendly
- Interface satisfied

**Cons:**

- Async loading
- Complex
- Dev/build tool specific

## Recommendation

Use a combination approach:

1. **Primary**: Module-level exports for all functions
   ```typescript
   export const diff = ...
   export const contains = ...
   ```

2. **Secondary**: Build-time generated namespace object
   ```typescript
   export * as NumRange from './num/range/$$.ts'
   ```

3. **For Traits**: Runtime registration that references the individual exports
   ```typescript
   registerTrait('Range', 'NumRange', {
     diff: () => import('./num/range/diff.ts').then(m => m.diff),
     contains: () => import('./num/range/contains.ts').then(m => m.contains),
   })
   ```

This preserves tree-shaking while enabling trait polymorphism when needed.
