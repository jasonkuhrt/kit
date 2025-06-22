# Dynamic Import for Dispatch

## Problem

Should trait dispatch use dynamic imports to load implementations on-demand, or use a global registry?

## Dynamic Import Approach

```typescript
const Range = {
  diff: async (a, b) => {
    const type = detectType(a) // 'NumRange'
    const impl = await import(`./implementations/${type}.js`)
    return impl.diff(a, b)
  },
}
```

## Global Registry Approach

```typescript
const Range = {
  diff: (a, b) => {
    const type = detectType(a)
    const impl = registry.get(type)
    return impl.diff(a, b)
  },
}
```

## Analysis

### Tree-Shaking

Neither approach improves tree-shaking because both use runtime type detection:

```typescript
// Dynamic import with variable path
await import(`./implementations/${type}.js`) // Bundler can't analyze

// Global registry
registry.get(type) // Also runtime determined
```

Bundlers must include all possible implementations in both cases.

### Deferred Parsing Benefit?

The theoretical benefit of deferred parsing is undermined by practical usage patterns:

```typescript
import { Num } from '@wollybeard/kit'

// We already parsed/executed Num module to create this
const range = Num.Range.create(0, 10)

// So dynamic import gains us nothing
Range.diff(range, range2) // Would dynamically import already-loaded Num module
```

If you have data of a type, you've almost certainly already imported that type's module.

### Problems with Dynamic Import

1. **Async Contagion**
   ```typescript
   // Forces all trait methods to be async
   const result = await Range.diff(r1, r2)
   ```

2. **First-Use Latency**
   ```typescript
   // First call has network/parse delay
   await Range.diff(r1, r2) // Slow
   await Range.diff(r3, r4) // Fast (cached)
   ```

3. **Build Complexity**
   ```typescript
   // Need to maintain path mappings
   const typeToPath = {
     'NumRange': './num/range.js',
     'DateRange': './date/range.js',
     // Must keep in sync with file structure
   }
   ```

4. **Error Handling**
   ```typescript
   try {
     const impl = await import(`./implementations/${type}.js`)
   } catch (e) {
     // Module not found? Network error? Parse error?
     // Harder to distinguish than registry.get() returning null
   }
   ```

### Theoretical Use Case

The only scenario where dynamic import might help:

```typescript
// Large app with many range types
// User only works with dates in this session
import { DateRange } from '@wollybeard/kit/date'

// Never loads Num, Str, or other Range implementations
Range.diff(date1, date2) // Only loads Date implementation

// But this seems contrived - why use trait dispatch
// if you know you're only using dates?
```

## Decision

**Use global registry** because:

1. **Synchronous** - Better developer experience, no async contagion
2. **Simpler** - No path mapping or module resolution logic
3. **No real tree-shaking disadvantage** - Both approaches include all implementations
4. **Practical reality** - If you have typed data, you've already imported its module
5. **Proven pattern** - Used by lodash, Clojure protocols, etc.

Dynamic import for trait dispatch is over-engineering without tangible benefits.
