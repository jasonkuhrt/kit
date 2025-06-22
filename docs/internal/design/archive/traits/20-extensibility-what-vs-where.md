# Extensibility: What vs Where

## Problem

There are two distinct aspects of extensibility that are easy to confuse:

1. **WHAT** is extensible - Which parts of the system can be extended
2. **WHERE** it's extensible - Which APIs/namespaces expose the extensions

## What is Extensible

Both traits and domains can be extended:

### Trait Extensibility

```typescript
// Plugin adds new trait
interface ShowOps {
  show: (value: any) => string
}

// Plugin provides implementations for existing domains
registerTrait('Show', 'NumRange', {
  show: (value) => `Num(${value})`,
})
```

### Domain Extensibility

```typescript
// Plugin adds new methods to existing domain
// (e.g., advanced math functions to Num domain)
export const fibonacci = (n: number) => {/* ... */}
export const isPrime = (n: number) => {/* ... */}
```

## Where is Extensible

This is about which API surface exposes the extensions:

### Trait Namespace: `<TRAIT>.<METHOD>`

```typescript
// Trait dispatch - works for extensions
Show.show(numValue) // ✅ Extension accessible
Show.show(strValue) // ✅ Extension accessible
Show.show(dateValue) // ✅ Extension accessible
```

### Domain Namespace: `<DOMAIN>.<METHOD>`

```typescript
// Domain namespace - extension availability depends on implementation
Num.show(42) // ❓ Only if domain namespace was extended
Str.show('hello') // ❓ Only if domain namespace was extended
```

## The Two Extension Scenarios

### Scenario 1: Trait Extensions (Easier)

Plugin adds new trait with implementations for existing domains:

```typescript
// ✅ ALWAYS WORKS - Trait namespace
Show.show(numValue) // Polymorphic dispatch

// ❓ MAYBE WORKS - Domain namespace (requires complex tooling)
Num.show(42) // Only if Num namespace was patched
```

### Scenario 2: Domain Extensions (Harder)

Plugin adds new methods to existing domains:

```typescript
// Plugin: advanced-math adds to Num domain
export const fibonacci = (n: number) => {/* ... */}

// ❓ REQUIRES TOOLING - Domain namespace extension
Num.fibonacci(10) // Only if Num namespace was patched

// ❌ NO TRAIT EQUIVALENT - No polymorphic version
// (fibonacci doesn't make sense for Str, Date, etc.)
```

## ESM Immutability Problem

The challenge is that ESM modules are immutable:

```typescript
// This doesn't work in ESM:
import * as Num from '@wollybeard/kit/num'
Num.show = (value) => `Num(${value})` // ❌ TypeError: Cannot add property
```

## Solutions by Extension Type

### For Trait Extensions

**Simple solution** - Only expose through trait namespace:

```typescript
// Plugin works immediately
registerTrait('Show', 'NumRange', { show: ... })

// Usage through trait (always works)
Show.show(numValue)  // ✅

// Domain usage not supported
Num.show(42)         // ❌ Method doesn't exist
```

### For Domain Extensions

**Complex solution** - Requires build tooling:

1. **Package Manager Patching** (pnpm/yarn only)
2. **Build-time Code Generation** (universal)
3. **Bundler Plugins** (tool-specific)

```typescript
// After build tool runs:
// @wollybeard/kit/src/num/$$.ts (patched)
export * from 'advanced-math/num/index.js' // ← Added
export * from './range/index.js'

// Then this works:
Num.fibonacci(10) // ✅
```

## Package Manager Compatibility

| Package Manager | Native Patch Support   |
| --------------- | ---------------------- |
| pnpm            | ✅ Built-in            |
| yarn v2+        | ✅ Built-in            |
| npm             | ❌ Needs patch-package |
| bun             | ❌ Needs external tool |

## Recommendation

**Two-tier extensibility strategy:**

### Tier 1: Trait Extensions (Easy)

- Plugin adds new traits with domain implementations
- Always accessible via `<TRAIT>.<METHOD>`
- No tooling required
- Works with all package managers

### Tier 2: Domain Extensions (Advanced)

- Plugin adds methods to existing domain namespaces
- Accessible via `<DOMAIN>.<METHOD>`
- Requires build tooling
- Limited package manager support

## Example: show-trait Plugin

```typescript
// Tier 1: Trait extensibility (always works)
import { Show } from '@wollybeard/kit'
Show.show(numValue) // ✅ Polymorphic

// Tier 2: Domain extensibility (requires tooling)
import { Num } from '@wollybeard/kit'
Num.show(42) // ✅ Only after build tool patches Kit
```

This separation clarifies that trait extensibility is the foundational capability, while domain namespace extensibility is an advanced feature requiring additional tooling complexity.

## Decision

1. **Start with Tier 1** - Trait-based extensibility for MVP
2. **Consider Tier 2** - Domain namespace extensibility for future versions
3. **Document clearly** - Make the distinction between WHAT and WHERE explicit
4. **Provide migration path** - Users can upgrade from trait-only to full domain extensions
