# Extensibility and Plugins

## Problem

How do we enable third-party plugins to extend traits with new methods and implementations? For example, a `range-plus` package that adds `interpolate` and `clamp` methods to the Range trait.

## Requirements

A plugin should be able to:

1. Add new methods to existing traits
2. Provide implementations for some (not all) data types
3. Maintain type safety with TypeScript
4. Work without modifying Kit's source code

## Solutions

### 1. Without Proxy - Explicit Registration

```typescript
// range-plus/index.ts

// Step 1: Augment types
declare module '@wollybeard/kit' {
  interface RangeOps {
    interpolate(range: Range<any>, t: number): any
    clamp(range: Range<any>, value: any): any
  }
}

// Step 2: Add runtime methods (REQUIRED)
import { createTraitMethod, Range } from '@wollybeard/kit'
Range.interpolate = createTraitMethod('Range', 'interpolate')
Range.clamp = createTraitMethod('Range', 'clamp')

// Step 3: Register implementations
import { registerTrait } from '@wollybeard/kit'
registerTrait('Range', 'NumRange', {
  interpolate: (range, t) => {/* ... */},
  clamp: (range, value) => {/* ... */},
})
```

**Pros:**

- Explicit and debuggable
- Clear what's being added

**Cons:**

- Step 2 is boilerplate that could be forgotten
- Requires mutable Range object
- Plugin author must remember all three steps

### 2. With Proxy - Automatic Method Creation

```typescript
// range-plus/index.ts

// Step 1: Augment types
declare module '@wollybeard/kit' {
  interface RangeOps {
    interpolate(range: Range<any>, t: number): any
    clamp(range: Range<any>, value: any): any
  }
}

// Step 2: Register implementations (no runtime method addition needed!)
import { registerTrait } from '@wollybeard/kit'
registerTrait('Range', 'NumRange', {
  interpolate: (range, t) => {/* ... */},
  clamp: (range, value) => {/* ... */},
})
```

The proxy automatically handles method creation:

```typescript
// Kit's Range implementation
const Range = new Proxy({}, {
  get(target, method) {
    // Every property access returns a dispatch function
    return (...args) => {
      const type = detectType(args[0])
      const impl = getImplementation('Range', type)
      if (!impl[method]) {
        throw new Error(`Method ${method} not implemented for ${type}`)
      }
      return impl[method](...args)
    }
  },
})
```

**Pros:**

- Plugins can't forget to add runtime methods
- Less boilerplate
- Truly open-ended interface

**Cons:**

- Less explicit (magic)
- Harder to debug
- No autocomplete for dynamic methods

### 3. Plugin Registry Pattern

```typescript
// Kit provides a plugin system
export const TraitPlugin = {
  extend(trait: string, methods: Record<string, string>) {
    // Automatically adds runtime methods
    for (const [name, _] of Object.entries(methods)) {
      traits[trait][name] = createTraitMethod(trait, name)
    }
  },
}

// range-plus uses it
TraitPlugin.extend('Range', {
  interpolate: 'Interpolate within range',
  clamp: 'Clamp value to range',
})

registerTrait('Range', 'NumRange', {/* ... */})
```

**Pros:**

- Structured plugin API
- Can add metadata (descriptions)
- Reduces boilerplate

**Cons:**

- Another API to learn
- Still requires mutable traits

## Partial Implementation Problem

What if a plugin only implements new methods for some types?

```typescript
// range-plus only implements interpolate for NumRange
registerTrait('Range', 'NumRange', {
  interpolate: (range, t) => {/* ... */},
})

// But not for DateRange
Range.interpolate(dateRange, 0.5) // Error!
```

### Solutions:

1. **Feature Detection**

```typescript
const interpolate = (range, t) => {
  const impl = getImplementation('Range', detectType(range))
  if (!impl.interpolate) {
    throw new Error(`Interpolate not supported for ${detectType(range)}`)
  }
  return impl.interpolate(range, t)
}
```

2. **Optional Trait Methods**

```typescript
interface RangeOps {
  // Required
  contains(range: Range<any>, value: any): boolean

  // Optional (plugins)
  interpolate?(range: Range<any>, t: number): any
}
```

3. **Capability Flags**

```typescript
registerTrait('Range', 'NumRange', {
  capabilities: ['interpolate', 'clamp'],
  interpolate: (range, t) => {/* ... */},
})
```

## Tree-Shaking Considerations

Plugins break tree-shaking by nature:

- They augment global types
- They modify runtime objects
- They add code that might not be used

Mitigation strategies:

1. Separate entry points for core vs extended features
2. Build-time plugin inclusion
3. Dynamic imports for plugin code

## Recommendation

**Use Proxy for trait objects** because:

1. Eliminates common plugin authoring errors
2. Reduces boilerplate significantly
3. Enables truly open-ended traits
4. Simplifies the plugin authoring experience

The "magic" of proxy is worth it for the extensibility benefits. The debugging challenges can be mitigated with good error messages and development tools.

Example plugin template:

```typescript
// 1. Augment types (required)
declare module '@wollybeard/kit' {
  interface RangeOps {
    myMethod(range: Range<any>): any
  }
}

// 2. Add implementations (required)
import { registerTrait } from '@wollybeard/kit'
registerTrait('Range', 'NumRange', {
  myMethod: (range) => {/* ... */},
})

// That's it! No step 3 needed with proxy
```
