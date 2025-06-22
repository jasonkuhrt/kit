# Multi-Modal Environments

## Problem

Different JavaScript runtime environments have fundamentally different characteristics that affect how traits can work:

- **Node.js**: Global state persists across requests, single-threaded event loop
- **Browsers**: Global state scoped to tab/window, may have multiple tabs
- **Cloudflare Workers**: Global state shared across concurrent requests, but fresh isolates
- **Deno**: Similar to Node.js but with different security model

## Cloudflare Workers Specific Issues

Based on CF Workers documentation:

### 1. Shared Global Across Concurrent Requests

```typescript
// BAD: Race conditions and request pollution
globalThis.registry = new Map()
registerTrait('Range', 'NumRange', impl) // Request A
getTrait('Range', 'NumRange') // Request B - sees Request A's data!
```

### 2. No Request Isolation for Globals

Unlike traditional servers where each request is isolated, CF Workers share `globalThis` across concurrent requests on the same Worker instance.

### 3. Race Conditions

Multiple concurrent requests can modify the same global registry simultaneously.

## Solutions

### 1. Environment Detection

```typescript
const isCloudflareWorkers = typeof caches !== 'undefined'
  && typeof importScripts === 'undefined'
const isNode = typeof process !== 'undefined' && process.versions?.node
const isBrowser = typeof window !== 'undefined'

// Choose appropriate strategy based on environment
```

### 2. Context-Based Trait Registry

```typescript
// CF Workers pattern - pass registry through context
export const withTraits = <T>(
  traitRegistrations: TraitConfig[],
  fn: (traits: TraitNamespace) => T,
): T => {
  const registry = new Map()

  // Register traits for this scope
  traitRegistrations.forEach(config => {
    registerInRegistry(registry, config)
  })

  // Create trait namespace bound to this registry
  const traits = createTraitNamespace(registry)

  return fn(traits)
}

// Usage in CF Workers
export default {
  async fetch(request, env, ctx) {
    return withTraits([
      { trait: 'Range', type: 'NumRange', impl: NumRangeOps },
    ], (traits) => {
      // Use traits.Range.diff(r1, r2) here
      return handleRequest(request, traits)
    })
  },
}
```

### 3. Module-Scoped with Environment Awareness

```typescript
// For environments that support it (Node, Browser)
let globalRegistry: Map<string, Map<string, unknown>>

if (isCloudflareWorkers) {
  // Don't use global registry
  globalRegistry = null
} else {
  // Safe to use module-scoped singleton
  globalRegistry = new Map()
}

export const registerTrait = (...args) => {
  if (globalRegistry) {
    // Traditional registration
    registerInGlobal(...args)
  } else {
    // Warn or throw - need context-based approach
    throw new Error('Use withTraits() in Cloudflare Workers environment')
  }
}
```

### 4. Hybrid API

```typescript
// Global registration (Node.js, Browser)
import { Num } from '@wollybeard/kit'
Range.diff(r1, r2) // Works automatically

// Context-based (CF Workers, or when you want isolation)
import { Num, withTraits } from '@wollybeard/kit'

withTraits([
  { trait: 'Range', type: 'NumRange', impl: Num.RangeOps },
], (traits) => {
  traits.Range.diff(r1, r2) // Works in isolated context
})
```

## AsyncContext Alternative

If AsyncContext becomes widely available:

```typescript
const traitContext = new AsyncContext()

export const withTraits = (registrations, fn) => {
  const registry = createRegistry(registrations)
  return traitContext.run(registry, fn)
}

// Trait methods automatically use context
export const Range = {
  diff: (a, b) => {
    const registry = traitContext.get()
    if (!registry) {
      throw new Error(
        'No trait context. Use withTraits() or global registration.',
      )
    }
    return dispatch(registry, 'Range', 'diff', [a, b])
  },
}
```

## Decision Requirements

We need to support:

1. **Global registration** for traditional environments (Node.js, Browser)
2. **Context-based registration** for concurrent environments (CF Workers)
3. **Automatic environment detection** or explicit opt-in
4. **Clear error messages** when wrong approach is used in wrong environment

## Recommendation

Implement **hybrid approach**:

- Default to global/module-scoped registry
- Provide `withTraits()` for environments that need isolation
- Detect CF Workers environment and guide users toward context-based approach
- Document environment-specific patterns clearly

This ensures traits work everywhere while providing the isolation needed for concurrent request environments.
