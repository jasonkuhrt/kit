# Auto-augmentation vs Registration

## Problem

When a user imports a data type that implements a trait, how does the trait system become aware of this implementation?

## Possible Solutions

### 1. Auto-augmentation on Import

```typescript
import { Num } from '@wollybeard/kit'
// Range.diff now works with NumRange automatically
```

**Pros:**

- Most ergonomic for users
- "Just works" experience
- Similar to how TypeScript declaration merging works

**Cons:**

- "Spooky action at a distance" - imports have side effects
- Harder to understand what's happening
- Can't opt out if you don't want global registration

### 2. Explicit Registration

```typescript
import { Num, Range } from '@wollybeard/kit'
Range.register(Num.Range)
```

**Pros:**

- Explicit and clear what's happening
- Can selectively register only what you need
- No hidden side effects

**Cons:**

- Extra boilerplate for users
- Easy to forget registration
- Verbose when using many types

### 3. Side-effect Import

```typescript
import '@wollybeard/kit/num/range/register'
```

**Pros:**

- Explicit but separate from main import
- Can be done once at app entry point
- Clear that it's a registration

**Cons:**

- Still a side-effect import
- Extra import to manage
- Not discoverable

### 4. Factory Pattern

```typescript
const Range = createTraitRegistry()
Range.register(Num.Range)
export { Range }
```

**Pros:**

- No global mutation
- Explicit registry creation
- Can have multiple registries

**Cons:**

- Users must manage registry instances
- Can't share registries across module boundaries easily
- More complex API

## Recommendation

A hybrid approach might work best:

- Auto-augmentation by default for convenience
- Provide explicit registration API for advanced users
- Clear documentation about the magic
