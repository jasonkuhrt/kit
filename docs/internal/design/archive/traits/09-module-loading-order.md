# Module Loading Order

## Problem

What happens if trait methods are called before the implementing types are imported? How do we handle registration timing?

## Scenarios

### 1. Trait Used Before Implementation Loaded

```typescript
import { Range } from '@wollybeard/kit/traits'

// NumRange not imported yet!
Range.diff(numRange1, numRange2) // Error? Lazy load?

import { Num } from '@wollybeard/kit' // Too late?
```

### 2. Circular Dependencies

```typescript
// range-trait.ts
import { NumRange } from './num-range' // For types

// num-range.ts
import { registerTrait } from './range-trait' // For registration

// Circular dependency!
```

### 3. Dynamic Imports

```typescript
// Only load implementations when needed
if (userWantsNumbers) {
  await import('@wollybeard/kit/num')
}

Range.diff(r1, r2) // Will this work?
```

## Possible Solutions

### 1. Lazy Loading

```typescript
const implementations = new Map<string, () => Promise<Implementation>>()

// Register lazy loader, not implementation
implementations.set('NumRange', () => import('./num/range'))

// First use triggers load
async function diff(a: unknown, b: unknown) {
  const type = detectType(a)
  const impl = await implementations.get(type)?.()
  return impl.diff(a, b)
}
```

**Pros:**

- No load order issues
- Optimal bundle splitting
- Works with dynamic imports

**Cons:**

- Async trait methods
- First call is slow
- Complex error handling

### 2. Fail-Fast With Clear Errors

```typescript
function diff(a: unknown, b: unknown) {
  const type = detectType(a)
  const impl = implementations.get(type)

  if (!impl) {
    throw new Error(
      `No Range implementation for ${type}. `
        + `Did you forget to import '@wollybeard/kit/num'?`,
    )
  }

  return impl.diff(a, b)
}
```

**Pros:**

- Clear error messages
- Simple implementation
- Predictable behavior

**Cons:**

- Requires manual import ordering
- Can't recover from errors
- Poor DX

### 3. Auto-Import Via Build Plugin

```typescript
// Build plugin detects trait usage and adds imports
// Transform:
Range.diff(numRange1, numRange2)

// Into:
import '@wollybeard/kit/num/range/register'
Range.diff(numRange1, numRange2)
```

**Pros:**

- Transparent to users
- No runtime overhead
- Optimal loading

**Cons:**

- Build tool complexity
- Magic behavior
- Hard to debug

### 4. Synchronous Registration

```typescript
// Side-effect imports register immediately
import { Num } from '@wollybeard/kit'
// Registration happens during module evaluation

// By the time user code runs, everything is registered
Range.diff(numRange1, numRange2) // Works
```

**Pros:**

- Simple mental model
- Predictable
- No async complexity

**Cons:**

- Side effects on import
- All-or-nothing loading
- Impacts tree-shaking

### 5. Two-Phase Initialization

```typescript
// Phase 1: Collect metadata
import { Range } from '@wollybeard/kit/traits'
Range.expectImplementation('NumRange')

// Phase 2: Validate all expected implementations loaded
import { validateTraits } from '@wollybeard/kit/traits'
validateTraits() // Throws if missing implementations

// Now safe to use
Range.diff(r1, r2)
```

**Pros:**

- Explicit initialization
- Can validate at app start
- Clear contracts

**Cons:**

- Boilerplate
- Manual process
- Easy to forget

## Recommendation

Combine approaches:

1. **Default**: Synchronous registration via side-effect imports
   - Simple and predictable
   - Document import order requirements

2. **Advanced**: Lazy loading for code-splitting scenarios
   - Opt-in via different import path
   - Returns promises

3. **Development**: Clear error messages with import hints
   - Help developers debug missing implementations

4. **Future**: Build plugin for automatic imports
   - Once pattern is proven
