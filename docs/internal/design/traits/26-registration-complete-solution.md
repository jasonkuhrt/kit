# Registration: Complete Solution

## Overview

This document describes the complete solution for trait registration, addressing both barrel imports and deep path imports.

## Core Insight

We leverage ESM import behavior where barrel files execute all exported modules' side effects, solving the registration timing problem.

## Import Patterns

### 1. Main Barrel Import (Trait-Enabled)

```typescript
import { Range, Num } from '@wollybeard/kit'

// ✅ Triggers all registrations via side effects
// ✅ Traits work
Range.diff(r1, r2)  // Works!
```

**What happens:**
1. Main barrel exports all domains: `export * from './num/$.js'`
2. Each domain's `$.ts` runs: `Traits.of(Num, [Range, Eq, Ord])`
3. All registrations complete before user code runs

### 2. Deep Domain Import (Tree-Shakeable)

```typescript
import { diff } from '@wollybeard/kit/num/range'

// ✅ Direct function, no trait system
// ✅ Optimal tree-shaking
// ❌ No trait polymorphism
diff(r1, r2)  // Works, but not polymorphic
```

**What happens:**
1. Only specific module loads
2. No barrel side effects
3. No trait registration
4. Maximum tree-shaking

### 3. Deep Trait Import (FORBIDDEN)

```typescript
// ❌ NOT ALLOWED - Traits are not exported from deep paths
import { equals } from '@wollybeard/kit/eq'  // Module not found!
```

**Why forbidden:**
1. Traits need registration to work
2. Deep imports skip registration
3. Would break without cryptic errors

## Implementation

### Domain Registration

```typescript
// src/num/$.ts
import { Range, Eq, Ord, Show } from '#traits'
import { Traits } from '#trait'
import * as Num from './$$.ts'

// Self-register with trait system
Traits.of(Num, [Range, Eq, Ord, Show])

export { Num }
export const id = Symbol('Num')
```

### Main Barrel

```typescript
// src/index.ts
// Re-export all domains (triggers registrations)
export * from './num/$.js'
export * from './str/$.js'
export * from './arr/$.js'

// Export traits (no deep paths)
export { Range, Eq, Ord, Show } from './traits/index.js'
```

### Package.json Exports

```json
{
  "exports": {
    ".": "./dist/index.js",
    "./num": "./dist/num/$.js",
    "./num/range": "./dist/num/range/index.js",
    "./str": "./dist/str/$.js",
    "./arr": "./dist/arr/$.js"
    // Note: NO "./eq" or other trait paths
  }
}
```

## Why This Works

### Registration Timing ✅
- Barrel import = all domains register
- Happens during module initialization
- Before any user code runs

### Tree-Shaking ✅
- Deep domain imports skip trait system entirely
- Only import what you use
- No registration overhead

### Type Safety ✅
- Can't import traits incorrectly
- Clear error if trying deep trait import
- TypeScript knows available paths

### Developer Experience ✅
- Want traits? Import from main
- Want tree-shaking? Import from domains
- Clear, predictable behavior

## Constraints That Make It Work

1. **Traits only from main barrel** - Ensures registration
2. **Domains available at any depth** - Enables tree-shaking
3. **Namespace-only trait usage** - `Range.diff()` not `diff()`
4. **Registration as side-effect** - Happens on import

## Usage Patterns

### Full Kit with Traits
```typescript
import { Range, Num, Str, Arr } from '@wollybeard/kit'

// Everything registered, traits work
Range.diff(numRange, numRange2)
Eq.equals(arr1, arr2)
```

### Selective Import for Bundle Size
```typescript
import { map } from '@wollybeard/kit/arr'
import { capitalize } from '@wollybeard/kit/str'

// No traits, minimal bundle
const result = map(items, item => capitalize(item))
```

### Mixed Usage
```typescript
// Some modules get traits
import { Range } from '@wollybeard/kit'

// Others are direct for tree-shaking
import { clamp } from '@wollybeard/kit/num'

// Both work in same codebase
Range.diff(r1, r2)        // Polymorphic
const x = clamp(5, 0, 10) // Direct
```

## Summary

The complete solution leverages:
1. ESM side effects for automatic registration
2. Import patterns to control trait availability
3. Package exports to enforce constraints
4. Clear separation between trait-enabled and tree-shakeable imports

This provides both powerful trait polymorphism and optimal bundle sizes, with predictable behavior based on import patterns.