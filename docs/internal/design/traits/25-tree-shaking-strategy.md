# Tree-Shaking Strategy for Traits

## Overview

This document outlines how Kit maintains tree-shaking capabilities while supporting a trait system with dynamic dispatch.

## The Challenge

Trait dispatch breaks static analysis:
```typescript
Range.diff(r1, r2)  // Which implementation? Bundler can't tell!
```

## Solution: Trait-Aware Rollup Plugin

### Core Principle

A Rollup plugin that:
1. Analyzes trait usage in user code
2. Determines which domain implementations are needed
3. Ensures bundler keeps required implementations

### Phase 1 Constraints

To keep initial implementation manageable:

1. **Namespace-only usage** - Traits must be called with their namespace
   ```typescript
   // ✅ SUPPORTED
   Range.diff(r1, r2)
   
   // ❌ NOT SUPPORTED (Phase 1)
   const { diff } = Range
   diff(r1, r2)
   ```

2. **No aliasing** - Import names must match
   ```typescript
   // ✅ SUPPORTED
   import { Range } from '@wollybeard/kit'
   
   // ❌ NOT SUPPORTED (Phase 1)
   import { Range as R } from '@wollybeard/kit'
   ```

### Implementation Approaches

#### Approach 1: Transform Imports
Add phantom imports for used implementations:
```typescript
// Original
import { Range } from '@wollybeard/kit'
Range.diff(r1, r2)

// Transformed
import { Range } from '@wollybeard/kit'
import '@wollybeard/kit/num/range/diff' // Added by plugin
Range.diff(r1, r2)
```

#### Approach 2: Virtual Re-exports
Generate a virtual module with only used exports:
```typescript
// Generated virtual module
export { diff as Num_Range_diff } from './num/range/diff.js'
export { equals as Str_Eq_equals } from './str/eq/equals.js'
// Only includes what's actually used
```

#### Approach 3: Module Side Effects
Use Rollup's `moduleSideEffects` to mark modules as used:
```typescript
resolveId(source) {
  return {
    id: source,
    moduleSideEffects: requiredModules.has(source)
  }
}
```

### Type Analysis

The plugin requires TypeScript compiler API to:
1. Determine types of values used with traits
2. Map native types to domain types
3. Handle generic type resolution

```typescript
// Plugin needs to know:
const arr = [1, 2, 3]        // Type: number[] → Arr + Num domains
const range = createRange()   // Type: NumRange → Num domain
Eq.equals(arr, [1, 2, 3])    // Needs: Arr.Eq.equals
Range.diff(range, range2)     // Needs: Num.Range.diff
```

### Native Type Mapping

When traits work with native JavaScript values:

```typescript
const nativeToDomainMap = {
  'Array': 'Arr',
  'number': 'Num',
  'string': 'Str',
  'Date': 'Date',
  'Object': 'Obj',
  // ...
}
```

### Recursive Analysis

If domain implementations use other traits:
```typescript
// Num.Range.diff uses Ord.compare
export const diff = (a, b) => {
  if (Ord.compare(a.start, b.start) > 0) { /* ... */ }
}

// Plugin must recursively include:
// Range.diff → Num.Range.diff → Ord.compare → Num.Ord.compare
```

## Benefits

1. **Optimal bundle size** - Only includes used implementations
2. **Type safety** - Leverages TypeScript for analysis
3. **Gradual adoption** - Start with constraints, relax over time
4. **Clear mental model** - Explicit about what works

## Future Enhancements

- Support for destructuring
- Support for aliasing  
- Dynamic trait method access
- Cross-module trait usage tracking