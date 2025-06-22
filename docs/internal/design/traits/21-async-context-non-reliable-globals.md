# AsyncContext for Non-Reliable Global Environments

## Problem

Some JavaScript environments have unreliable or problematic global state:

- **Cloudflare Workers**: Global state shared across concurrent requests (race conditions)
- **Serverless Functions**: Fresh isolates per invocation (no persistence)
- **Web Workers**: Limited global access
- **Test Environments**: Need isolation between test cases

Traditional global trait registries don't work well in these environments.

## AsyncContext Solution

AsyncContext provides **request-scoped "globals"** - they feel global to application code but are actually isolated per execution context.

### Implementation

```typescript
const traitContext = new AsyncContext()

export const withTraits = (traitConfigs, fn) => {
  const registry = createRegistry(traitConfigs)
  return traitContext.run(registry, fn)
}

// Traits access the request-scoped context
export const Range = {
  diff: (a, b) => {
    const registry = traitContext.get() // Gets request-scoped registry
    if (!registry) {
      throw new Error(
        'No trait context. Use withTraits() or global registration.',
      )
    }
    return dispatch(registry, 'Range', 'diff', [a, b])
  },
}
```

### Cloudflare Workers Usage

```typescript
export default {
  async fetch(request, env, ctx) {
    return await withTraits([
      { trait: 'Range', type: 'NumRange', impl: NumRangeOps },
      { trait: 'Eq', type: 'NumRange', impl: NumEqOps },
    ], async () => {
      return app(request) // ✅ app can use traits "globally"
    })
  },
}

async function app(request) {
  // Feels like global state, but is request-scoped
  const r1 = createRange(0, 10)
  const r2 = createRange(5, 15)

  const diff = Range.diff(r1, r2) // ✅ Works
  const equal = Eq.equals(r1, r2) // ✅ Works

  // Even in nested async calls
  const result = await processData()
  return response(result)
}

async function processData() {
  // Still has access - context flows through async calls
  return Range.union(someRange, otherRange) // ✅ Works
}
```

## Benefits Over Global Registry

### 1. Request Isolation

```typescript
// Request A
withTraits([...configA], () => app()) // Registry A

// Request B (concurrent)
withTraits([...configB], () => app()) // Registry B - completely isolated
```

No race conditions or request pollution.

### 2. Per-Request Configuration

```typescript
export default {
  async fetch(request, env, ctx) {
    const userConfig = getUserConfig(request)

    return await withTraits([
      // Base traits
      { trait: 'Range', type: 'NumRange', impl: NumRangeOps },
      // User-specific or request-specific traits
      ...userConfig.traits,
    ], async () => {
      return app(request)
    })
  },
}
```

### 3. Environment Adaptability

Different environments can configure different trait implementations:

```typescript
// Development - with debug implementations
withTraits([
  { trait: 'Range', type: 'NumRange', impl: DebugNumRangeOps },
], () => app())

// Production - with optimized implementations
withTraits([
  { trait: 'Range', type: 'NumRange', impl: OptimizedNumRangeOps },
], () => app())
```

## Other Environment Examples

### Express.js Middleware

```typescript
app.use(async (req, res, next) => {
  const userTraits = getTraitsForUser(req.user)
  return withTraits(userTraits, () => {
    return next()
  })
})
```

### Serverless Functions

```typescript
export const handler = async (event) => {
  return withTraits(getTraitsForEvent(event), () => {
    return processEvent(event)
  })
}
```

### Test Isolation

```typescript
test('feature A', async () => {
  await withTraits([
    { trait: 'Range', type: 'NumRange', impl: MockNumRangeOps },
  ], async () => {
    // Test with mocked implementations
    const result = await testFeature()
    expect(result).toBe(expected)
  })
})
```

## Hybrid Approach

Support both global and context-based registries:

```typescript
export const Range = {
  diff: (a, b) => {
    // Try context first
    const contextRegistry = traitContext.get()
    if (contextRegistry) {
      return dispatch(contextRegistry, 'Range', 'diff', [a, b])
    }

    // Fall back to global registry
    const globalRegistry = getGlobalRegistry()
    if (globalRegistry) {
      return dispatch(globalRegistry, 'Range', 'diff', [a, b])
    }

    throw new Error(
      'No trait registry available. Use withTraits() or global registration.',
    )
  },
}
```

This allows:

- **Node.js/Browser**: Use global registry (simpler)
- **CF Workers**: Use context registry (safer)
- **Tests**: Use context registry (isolated)

## Compatibility

AsyncContext is experimental. Provide fallback:

```typescript
const hasAsyncContext = typeof AsyncContext !== 'undefined'

const traitContext = hasAsyncContext
  ? new AsyncContext()
  : createManualContext() // Explicit parameter passing fallback
```

## Decision

AsyncContext solves the **fundamental problem** of trait registration in environments with unreliable globals. It enables:

1. **Request-scoped isolation** without race conditions
2. **Per-request configuration** without global mutation
3. **Familiar "global" API** without actual global state
4. **Environment adaptability** with the same codebase

This makes Kit truly multi-environment compatible while maintaining ergonomic APIs.
