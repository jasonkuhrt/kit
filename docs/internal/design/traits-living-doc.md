# Traits System - Living Design Document

## Current State

This document represents the current, up-to-date design of the Kit traits system. It consolidates all previous explorations and decisions.

Last Updated: 2025-06-22

## Overview

The traits system enables polymorphic operations across different data types in Kit while maintaining tree-shaking, type safety, and excellent developer experience.

## MVP Implementation Plan

### Phase 1: Core Infrastructure

1. **Trait Module Structure** - Basic trait definitions and registry
2. **Eq Trait** - First trait with `is` method
3. **Rollup Plugin** - For trait transformation
4. **Domain Implementations** - Eq for Arr, Str, Num, Obj, Bool, Undefined, Null

### Key Decision: Namespaced Trait Methods

After considering method name mapping (e.g., `Eq.is` → `isEqual`), we've decided to use **namespaced trait methods** for the MVP:

```typescript
// Instead of top-level with renaming:
Arr.isEqual(a, b) // Requires mapping Eq.is -> isEqual

// We'll use namespaced access:
Arr.Eq.is(a, b) // No naming conflicts, clear semantics
```

**Benefits:**

- No naming conflicts with existing methods (e.g., `Arr.is` remains type guard)
- All trait methods grouped under their trait namespace
- Preserves exact trait method names
- Clear semantics: `Arr.Eq.is(a, b)` clearly means "are these arrays equal?"
- Simpler implementation (no mapping complexity)

## Architecture

### File Structure

```
src/
├── traitor/                  # Trait system infrastructure ("trait operator")
│   ├── dispatcher/           # Dispatch system
│   │   ├── dispatcher.ts     # Core dispatch implementation
│   │   └── ...
│   ├── registry/             # Registry system
│   ├── $.ts                  # Namespace export
│   └── $$.ts                 # Barrel export
├── traits/                   # Trait definitions
│   ├── eq/                   # Eq trait
│   │   ├── interface.ts      # Trait interface and proxy
│   │   ├── laws.ts           # Property-based law tests for implementations
│   │   ├── $.ts              # Namespace export (exports as Eq)
│   │   └── $$.ts             # Barrel export
│   ├── ord/                  # Future: Ord trait
│   │   └── ...
│   ├── $.ts                  # Namespace export (exports as Traits)
│   └── $$.ts                 # Barrel export
├── arr/                      # Domain modules
│   ├── $.ts                  # Namespace export (includes trait implementations)
│   ├── $$.ts                 # Barrel export
│   ├── traits/               # Trait implementations
│   │   ├── eq.ts             # Eq implementation for arrays
│   │   ├── eq.test.ts        # Tests for Eq implementation + registration
│   │   └── eq-laws.test.ts   # Property-based law tests
│   └── ...
└── index.ts                  # Main barrel export
```

### Domain Trait Implementation

```typescript
// src/arr/traits/eq.ts
export const is = <T>(a: T[], b: T[]): boolean => {
  if (a.length !== b.length) return false
  return a.every((val, i) => /* dispatch to Eq for elements */)
}
```

### Domain Namespace Export

```typescript
// src/arr/$.ts
import * as Eq from './traits/eq.js'

// Existing exports
export * from './$$.js'

// Add trait namespaces
export { Eq }
```

### Trait Definition

```typescript
// src/traits/eq/interface.ts
export interface Eq<$Value = unknown> {
  is<value extends $Value>(a: value, b: value): boolean
  isOn<value extends $Value>(a: value): (b: value) => boolean
}

// Trait proxy using dispatcher
export const Eq = Traitor.Dispatcher.create<Eq>(Traitor.REGISTRY, 'Eq')
```

## Type System

### Basic Usage

```typescript
import { Arr, Str } from '@wollybeard/kit'

// Namespaced trait methods
Arr.Eq.is([1, 2], [1, 2]) // true
Str.Eq.is('hello', 'hello') // true
```

### Native Type Support

The system will support JavaScript native types through implicit domain mapping:

```typescript
// These will work in the full implementation:
Eq.is([1, 2], [1, 2]) // Detects array, uses Arr.Eq.is
Eq.is('a', 'a') // Detects string, uses Str.Eq.is
```

## Implementation Phases

### Phase 1: MVP (Current Focus)

- Basic trait infrastructure
- Eq trait with namespaced methods
- Manual registration
- 7 domain implementations

### Phase 2: Code Generation

- Generate registration files
- Generate trait dispatch functions
- Type-level function support

### Phase 3: Rollup Plugin

- Analyze trait usage
- Tree-shaking optimization
- Transform trait calls if needed

### Phase 4: Advanced Features

- Multi-environment support (AsyncContext)
- Plugin extensibility
- Performance optimizations

## Testing Strategy

### Responsibility Separation

- **Traits module (`src/traits/`)**: Defines interfaces only, no tests (interfaces have no implementation to test)
- **Domain modules**: Own their trait implementations and tests

### Domain Testing Structure

Each domain's trait implementation includes comprehensive tests:

```typescript
// src/arr/traits/eq.test.ts
describe('Arr.Eq implementation', () => {
  test('direct implementation', () => {
    expect(Arr.Eq.is([1, 2], [1, 2])).toBe(true)
    expect(Arr.Eq.is([1, 2], [1, 3])).toBe(false)
  })

  test('registration with dispatch system', () => {
    expect(dispatchOrThrow(REGISTRY, 'Eq', 'is', [[1, 2], [1, 2]])).toBe(true)
  })

  test('domain-specific edge cases', () => {
    // Nested arrays, empty arrays, mixed types, etc.
  })
})
```

### Test Coverage Areas

1. **Direct trait method testing** - Test the implementation API users interact with
2. **Registration verification** - Ensure trait is properly registered with dispatch system
3. **Domain-specific scenarios** - Edge cases relevant to each data type
4. **Integration testing** - Cross-domain scenarios can live in domain tests or separate integration suite
5. **Trait laws** - Mathematical properties that all implementations must satisfy

### Trait Laws

Traits provide property-based law tests to help domains verify their implementations are mathematically correct. These are located at `src/traits/<trait-name>/laws.ts` and accessible via the namespace pattern:

```typescript
// src/traits/eq/laws.ts
export const EqLaws = {
  reflexivity: <T>(arbitrary: fc.Arbitrary<T>, eq: Eq<T>) => {/* ... */},
  symmetry: <T>(arbitrary: fc.Arbitrary<T>, eq: Eq<T>) => {/* ... */},
  transitivity: <T>(arbitrary: fc.Arbitrary<T>, eq: Eq<T>) => {/* ... */},
  curryingConsistency: <T>(
    arbitrary: fc.Arbitrary<T>,
    eq: Eq<T>,
  ) => {/* ... */},
  all: <T>(arbitrary: fc.Arbitrary<T>, eq: Eq<T>) => {/* ... */},
}
```

Domains use these laws in their tests:

```typescript
// src/str/traits/eq-laws.test.ts
import { Str } from '#str'
import { Eq } from '#traits/eq'

test('Str.Eq satisfies all Eq laws', () => {
  fc.assert(Eq.Laws.all(fc.string(), Str.Eq))
})
```

## Key Design Decisions

1. **Namespaced trait methods** - Avoids naming conflicts, preserves trait semantics
2. **ESM side effects for registration** - Ensures traits work immediately
3. **Manual MVP, generated later** - Start simple, automate repetitive parts
4. **Domain-first organization** - Traits live with their implementations
5. **Domain-owned testing** - Each domain tests its own trait implementations and registration

## Open Questions

1. Should we support both patterns eventually?
   - `Arr.Eq.is(a, b)` (namespaced)
   - `Arr.isEqual(a, b)` (mapped)

2. How do we handle trait methods that need different names per domain?
   - Current approach: Use namespaces, no renaming needed
   - Alternative: Support optional mapping in trait definition

3. Tree-shaking strategy for namespaced methods?
   - Rollup plugin needs to understand `Arr.Eq.is` usage
   - May be simpler than mapped methods

## Next Steps

1. Create basic trait module structure
2. Implement Eq trait with is method
3. Add Eq namespace to existing domains
4. Test the namespaced approach
5. Begin Rollup plugin development

## Archive Notes

Previous explorations have been moved to `/docs/internal/design/traits/` subdirectory. Key insights have been incorporated into this living document.
