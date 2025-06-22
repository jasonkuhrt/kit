# Runtime Compatibility

## Problem

Are there JavaScript runtimes where global scope is not available or works differently? How do we ensure trait dispatch works everywhere?

## Runtime Environments to Consider

### 1. Node.js

- Has `global` object
- Has `globalThis` (ES2020)
- No issues expected

### 2. Browsers

- Has `window` object
- Has `globalThis` (ES2020)
- No issues expected

### 3. Web Workers

- Has `self` object
- Has `globalThis` (ES2020)
- Separate global scope from main thread
- **Issue**: Registrations in main thread not visible in worker

### 4. Service Workers

- Similar to Web Workers
- Isolated global scope
- Same registration visibility issues

### 5. Cloudflare Workers

- V8 isolate-based
- Has `globalThis`
- Stateless between requests
- **Issue**: Global mutations don't persist

### 6. Deno

- Has `globalThis`
- More strict about global mutations
- May require permissions

### 7. Bun

- Has `globalThis`
- Generally Node-compatible
- No known issues

## Possible Solutions

### 1. Use globalThis Everywhere

```typescript
const getRegistry = () => {
  // ES2020 standard
  return globalThis.__kit_trait_registry__ ||= new Map()
}
```

**Pros:**

- Standard approach
- Works in all modern environments

**Cons:**

- Still has isolation issues in workers
- Doesn't solve stateless runtime issue

### 2. Runtime Detection

```typescript
const getGlobalObject = () => {
  if (typeof globalThis !== 'undefined') return globalThis
  if (typeof global !== 'undefined') return global
  if (typeof window !== 'undefined') return window
  if (typeof self !== 'undefined') return self
  throw new Error('No global object found')
}
```

**Pros:**

- Maximum compatibility
- Fallback chain

**Cons:**

- Complex
- Still doesn't solve fundamental issues

### 3. Registry Serialization

```typescript
// For workers/stateless environments
const registry = {
  serialize(): string {
    return JSON.stringify([...registryMap])
  },
  deserialize(data: string) {
    new Map(JSON.parse(data))
  },
}

// Pass serialized registry to worker
worker.postMessage({ registry: registry.serialize() })
```

**Pros:**

- Solves worker isolation
- Could work for stateless environments

**Cons:**

- Complex to implement
- Performance overhead
- Not all implementations serializable

### 4. Import-Time Registration

```typescript
// Each file registers itself when imported
// num/range/register.ts
registerTrait('Range', 'NumRange', implementation)
```

**Pros:**

- Works in stateless environments
- Explicit registration

**Cons:**

- Must be imported in each isolate
- Side effects on import

## Recommendation

1. Use `globalThis` as the standard approach
2. Document limitations for isolated environments
3. Provide serialization utilities for worker scenarios
4. For Cloudflare Workers and similar, recommend import-time registration pattern

The trait system should gracefully degrade - if global registration isn't possible, fall back to direct imports.
