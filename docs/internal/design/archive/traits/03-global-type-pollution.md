# Global Type Pollution

## Problem

If traits are available globally but a user doesn't want to use them, how do we prevent the global namespace from being polluted with unused types?

## Context

TypeScript's type system is ambient - once types are declared globally, they exist for all code in the project. This could be seen as pollution if unused.

## Possible Solutions

### 1. Accept It As Harmless

```typescript
// These exist but don't affect runtime if unused
declare global {
  const Range: RangeOps
  const Eq: EqOps
}
```

**Pros:**

- Simple approach
- No runtime cost if unused
- TypeScript tree-shakes unused types

**Cons:**

- Shows up in autocomplete
- Might confuse users who don't use traits
- "Pollutes" the global namespace

### 2. Module Augmentation

```typescript
// Only augment if explicitly imported
declare module '@wollybeard/kit' {
  export interface Traits {
    Range: RangeOps
  }
}
```

**Pros:**

- More controlled exposure
- Only visible when kit is imported

**Cons:**

- Still ambient once kit is imported anywhere
- Can't truly isolate

### 3. Separate Entry Points

```typescript
// Standard import - no traits
import { Num } from '@wollybeard/kit'

// Trait-enabled import
import { Num, Range } from '@wollybeard/kit/traits'
```

**Pros:**

- Explicit opt-in
- Clean separation
- No pollution without consent

**Cons:**

- Multiple entry points to maintain
- Might fragment the ecosystem

### 4. Type-Only Exports

```typescript
// Only export types, not runtime
export type { RangeOps }

// User must explicitly import types
import type { RangeOps } from '@wollybeard/kit/traits'
```

**Pros:**

- No runtime pollution
- Explicit type imports

**Cons:**

- Can't use for runtime dispatch
- Defeats purpose of traits

## Recommendation

Accept global types as harmless. They:

- Don't affect runtime performance
- Don't affect bundle size
- Only show in IDE autocomplete
- Are a common pattern (see: `Array`, `Object`, etc.)

The benefit of ergonomic trait usage outweighs the minor autocomplete pollution.
