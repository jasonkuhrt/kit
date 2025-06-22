# Complete Trait System Design

## Overview

This document captures the complete trait system design for Kit after extensive exploration. The system enables polymorphic operations across different data types while maintaining tree-shaking, type safety, and excellent developer experience.

## Core Concepts

### What Are Traits?

Traits are interfaces that can be implemented by multiple data types, enabling polymorphic operations:

```typescript
// Instead of domain-specific calls
Num.Range.diff(numRange1, numRange2)
Str.Range.diff(strRange1, strRange2)

// Traits enable polymorphic calls
Range.diff(numRange1, numRange2) // Works with any Range type
Range.diff(strRange1, strRange2) // Same interface, different implementation
```

### Domains vs Traits

- **Domains**: Type-specific modules (Num, Str, Arr, Obj, etc.)
- **Traits**: Cross-cutting interfaces (Range, Eq, Ord, Show, etc.)

## Architecture

### File Structure

```
src/
├── num/                      # Domain
│   ├── $.ts                 # Namespace export + trait registrations
│   ├── $$.ts                # Barrel export
│   ├── range/               # Domain implementation
│   │   └── index.ts
│   └── traits/              # Trait implementations
│       ├── range.ts         # Source implementation
│       ├── range.registry.ts # Generated registration
│       ├── eq.ts
│       └── eq.registry.ts
├── traits/                   # Trait definitions
│   ├── range.ts             # Interface + dispatch
│   ├── eq.ts
│   └── core.ts              # Registry system
└── index.ts                 # Main barrel export
```

### Import Patterns

#### 1. Main Import (Trait-Enabled)

```typescript
import { Num, Range } from '@wollybeard/kit'

// All registrations happen automatically via side effects
Range.diff(r1, r2) // Polymorphic dispatch
```

#### 2. Deep Import (Tree-Shakeable)

```typescript
import { diff } from '@wollybeard/kit/num/range'

// Direct function call, no trait system
diff(r1, r2) // Only this specific function is bundled
```

#### 3. Traits Not Available as Deep Imports

```typescript
// ❌ FORBIDDEN - Ensures registration happens
import { equals } from '@wollybeard/kit/eq' // Module not found!
```

## Registration System

### Domain Self-Registration

```typescript
// src/num/$.ts
import './traits/range.registry.js' // Generated file
import './traits/eq.registry.js'
import './traits/ord.registry.js'

export * from './$$.js'
export const id = Symbol('Num') // Domain identifier
```

### Generated Registry Files

```typescript
// src/num/traits/range.registry.ts (GENERATED)
import { Traits } from '#traits'
import * as impl from './range.js'

// Runtime registration
Traits.Range.Num = impl

// Type augmentation
declare global {
  interface KitRegistry {
    traits: {
      range: {
        domains: {
          Num: {
            // Type-level function for dependent types
            diff: impl.__diff_return
            // Simple return type
            contains: ReturnType<typeof impl.contains>
          }
        }
      }
    }
  }
}
```

### How Registration Works

1. User imports from main barrel: `import { Range } from '@wollybeard/kit'`
2. Barrel exports all domains: `export * from './num/$.js'`
3. Each domain's `$.ts` imports its trait registrations
4. All registrations complete before user code runs
5. Traits work immediately with all registered types

## Type System

### Basic Trait Types

```typescript
interface RangeOps<T> {
  diff(a: Range<T>, b: Range<T>): Range<T>[]
  contains(range: Range<T>, value: T): boolean
}
```

### Advanced: Type-Level Functions

For domain-specific return types, we use type-level functions:

```typescript
// src/num/traits/parse.ts
export const parse = <T extends string>(input: T): ParseResult<T> => {/* ... */}

// Signal dependent return type with __ prefix
export type __parse_return<$Parameters extends [string]> =
  $Parameters[0] extends `0x${string}`
    ? { success: true; value: number; format: 'hex' }
    : $Parameters[0] extends `${number}.${number}`
      ? { success: true; value: number; format: 'decimal' }
    : { success: boolean; value?: number; error?: string }
```

### Type Resolution

```typescript
// Core type that handles dispatch
type GetReturnType<
  Trait extends string,
  Method extends string,
  Domain extends string,
  Params extends any[],
  DefaultReturn,
> =
  // Check if KitRegistry exists and has traits
  KitRegistry extends { traits: infer Traits }
    ? Traits extends Record<Trait, infer TraitDef>
      ? TraitDef extends { domains: infer Domains }
        ? Domains extends Record<Domain, infer DomainDef>
          ? DomainDef extends Record<Method, infer MethodDef>
            ? MethodDef extends (...args: any[]) => any ? MethodDef<Params> // Call type-level function
            : MethodDef // Use type directly
          : DefaultReturn // Method not found
        : DefaultReturn // Domain not found
      : DefaultReturn // No domains property
    : DefaultReturn // Trait not found
    : DefaultReturn // No traits property

// Trait method preserves types
export const diff = <T, V extends Range<T>>(
  a: V,
  b: V,
): GetReturnType<'range', 'diff', GetDomain<V>, [V, V], Range<T>[]> => {
  return dispatch('range', 'diff', [a, b])
}
```

## Native Type Support

Traits work with JavaScript native types through implicit domain mapping:

```typescript
const nativeToDomainMap = {
  'Array': 'Arr',
  'number': 'Num',
  'string': 'Str',
  'Date': 'Date',
  'Object': 'Obj',
  // ...
}

// These work automatically
Eq.equals([1, 2], [1, 2]) // Uses Arr.Eq.equals
Show.show(42) // Uses Num.Show.show
Range.contains(dateRange, today) // Uses Date.Range.contains
```

## Tree-Shaking Strategy

### The Challenge

Trait dispatch breaks static analysis - bundlers can't determine which implementations are needed.

### Solution: Trait-Aware Rollup Plugin

The plugin:

1. Analyzes trait usage using TypeScript compiler API
2. Determines which domain implementations are needed
3. Ensures bundler keeps required implementations

### Plugin Constraints (Phase 1)

- Traits must be called with namespace: `Range.diff()` not `diff()`
- No aliasing: `import { Range }` not `import { Range as R }`
- Uses TypeScript compiler API for type analysis

### Implementation Approaches

1. **Transform imports** - Add phantom imports for used implementations
2. **Virtual re-exports** - Generate module with only used exports
3. **Module side effects** - Mark required modules as having side effects

## Multi-Environment Support

### The Problem

Some environments have unreliable global state:

- Cloudflare Workers: Shared across concurrent requests
- Serverless: Fresh isolates per invocation

### Solution: AsyncContext

For environments needing request isolation:

```typescript
// CF Workers pattern
export default {
  async fetch(request, env, ctx) {
    return await withTraits([
      { trait: 'Range', type: 'NumRange', impl: NumRangeOps },
    ], async () => {
      return app(request) // Traits work in isolated context
    })
  },
}
```

### Hybrid Approach

```typescript
// Automatic detection
const Range = {
  diff: (a, b) => {
    // Try context first (CF Workers)
    const contextRegistry = traitContext.get()
    if (contextRegistry) {
      return dispatch(contextRegistry, 'Range', 'diff', [a, b])
    }

    // Fall back to global registry (Node/Browser)
    return dispatch(globalRegistry, 'Range', 'diff', [a, b])
  },
}
```

## Build System

### For Kit Development

Kit uses a build step to generate registry files:

```javascript
// build-scripts/generate-registries.js
// For each src/*/traits/*.ts file:
// 1. Parse exports
// 2. Detect __*_return type functions
// 3. Generate registry.ts with runtime + type registration
```

### For Kit Users

No build tooling required! Users just:

```bash
npm install @wollybeard/kit
```

All types and registrations are pre-built.

## API Summary

### For Users

```typescript
// Full Kit with traits
import { Eq, Num, Range, Str } from '@wollybeard/kit'

Range.diff(numRange, numRange2) // Polymorphic
Eq.equals([1, 2], [1, 2]) // Works with natives

// Tree-shakeable direct imports
import { diff } from '@wollybeard/kit/num/range'
diff(r1, r2) // No trait system, minimal bundle
```

### For Domain Implementors

```typescript
// src/num/traits/range.ts - Just write the implementation
export const diff = (a: NumRange, b: NumRange): NumRangeDiff => {/* ... */}

// Optional: type-level function for precise types
export type __diff_return<$Parameters extends [NumRange, NumRange]> =
  DiffSegment<$Parameters[0], $Parameters[1]>[]

// Everything else is generated!
```

### For Plugin Authors

```typescript
// Augment types
declare module '@wollybeard/kit' {
  interface RangeOps {
    interpolate?(range: Range<any>, t: number): any
  }
}

// Add implementation
Traits.Range.MyType = {
  interpolate: (range, t) => {/* ... */},
}
```

## Key Design Decisions

1. **ESM side effects for registration** - Solves timing issues elegantly
2. **No circular dependencies** - Clean layered architecture
3. **Progressive type complexity** - Simple defaults, powerful when needed
4. **Build-time generation** - Reduces boilerplate for implementors
5. **Dual API** - Traits for polymorphism, domains for tree-shaking
6. **Proxy-based dispatch** - Enables extensibility without patching

## Benefits

### For Users

- Zero configuration
- Excellent TypeScript inference
- Choose between polymorphism and bundle size
- Works in all environments

### For Kit Development

- Minimal boilerplate via code generation
- Type-safe implementations
- Clean separation of concerns
- Extensible architecture

### For the Ecosystem

- Plugins can extend without forking
- Tree-shaking still possible
- No vendor lock-in
- Standard TypeScript patterns

## Future Enhancements

1. Support for trait method aliasing/destructuring
2. Performance optimizations for dispatch
3. Developer tools for debugging trait dispatch
4. More sophisticated type-level functions
5. Automatic API documentation from traits

## Conclusion

This trait system provides Kit with powerful polymorphic capabilities while maintaining its core values of simplicity, tree-shaking, and type safety. The design balances implementation complexity with user experience, making advanced functional programming patterns accessible in everyday TypeScript.
